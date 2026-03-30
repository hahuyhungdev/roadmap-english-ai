"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { TTSProvider, TTSSettings } from "../shared/types";
import { EDGE_ACCENTS } from "../shared/constants";

// ─── Types ────────────────────────────────────────────────────────────────────
type TTSStatus = "idle" | "loading" | "playing";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Extract lang code from voice ID */
function getLangFromVoiceId(voiceId: string): string {
  return EDGE_ACCENTS.find((a) => a.value === voiceId)?.lang ?? "en-US";
}

/** Extract the voice key name (e.g. "Jenny" from "Jenny — Bright Female") */
function getVoiceKeyFromAccent(accentValue: string): string | null {
  const found = EDGE_ACCENTS.find((a) => a.value === accentValue);
  if (!found) return null;
  // Extract first word before " — " (e.g. "Jenny" from "Jenny — Bright Female")
  return found.label.split(" — ")[0].trim();
}

/**
 * Find the best matching voice from available voices.
 * Strategy:
 * 1. Fuzzy match: voice name contains the voice key (e.g. "Microsoft Jenny Online" contains "Jenny")
 * 2. Fallback: any local voice for the language
 * 3. Last resort: any voice for the language
 */
function findBestVoice(
  availableVoices: SpeechSynthesisVoice[],
  voiceKey: string | null,
  lang: string,
): SpeechSynthesisVoice | null {
  if (!availableVoices.length) return null;

  // 1. Fuzzy match: voice name contains the voice key AND is local
  if (voiceKey) {
    const fuzzyLocalMatch = availableVoices.find(
      (v) =>
        v.localService && v.name.toLowerCase().includes(voiceKey.toLowerCase()),
    );
    if (fuzzyLocalMatch) {
      console.log(
        "[findBestVoice] Found fuzzy LOCAL match:",
        fuzzyLocalMatch.name,
        "for key:",
        voiceKey,
      );
      return fuzzyLocalMatch;
    }
    // If no local fuzzy match, try any fuzzy match (may be online)
    const fuzzyMatch = availableVoices.find((v) =>
      v.name.toLowerCase().includes(voiceKey.toLowerCase()),
    );
    if (fuzzyMatch) {
      console.log(
        "[findBestVoice] Found fuzzy match (online or local):",
        fuzzyMatch.name,
        "for key:",
        voiceKey,
      );
      return fuzzyMatch;
    }
  }

  // 2. Any local voice for the language
  const localVoice = availableVoices.find(
    (v) => v.localService && v.lang === lang,
  );
  if (localVoice) {
    console.log(
      "[findBestVoice] Fallback to local voice:",
      localVoice.name,
      "for lang:",
      lang,
    );
    return localVoice;
  }

  // 3. Last resort: any voice for the language (may be online)
  const anyVoice = availableVoices.find((v) => v.lang === lang);
  if (anyVoice) {
    console.log(
      "[findBestVoice] Last resort voice:",
      anyVoice.name,
      "for lang:",
      lang,
    );
    return anyVoice;
  }

  return null;
}

// Robustly wait for voices to be loaded (handles async race condition)
function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }
    speechSynthesis.addEventListener(
      "voiceschanged",
      () => resolve(speechSynthesis.getVoices()),
      { once: true },
    );
  });
}

// Blocklist for old, robotic voices
const BLOCKLIST = ["David", "Zira", "Hedda", "Helena"];

// Find the best neural/natural/online voice, fallback to any non-blocklisted
async function getBestVoice(
  lang = "en-US",
): Promise<SpeechSynthesisVoice | null> {
  // Only return a neural/natural/online voice, never fallback to robotic/local
  let voices = await loadVoices();
  let tries = 0;
  let neuralVoice = null;
  while (tries < 10) {
    // Wait up to ~5s for neural voices to appear
    neuralVoice = voices.find(
      (v) =>
        v.lang.startsWith(lang) &&
        (v.name.toLowerCase().includes("natural") ||
          v.name.toLowerCase().includes("neural") ||
          v.name.toLowerCase().includes("online")) &&
        !BLOCKLIST.some((name) => v.name.includes(name)),
    );
    if (neuralVoice) break;
    // Wait 500ms and try again
    await new Promise((r) => setTimeout(r, 500));
    voices = await loadVoices();
    tries++;
  }
  return neuralVoice ?? null;
}

// Chunk text for Edge bug (>~300 chars)
function chunkText(text: string, maxLength: number): string[] {
  const sentences = text.match(/[^.!?]+[.!?]*/g) ?? [text];
  const chunks: string[] = [];
  let current = "";
  for (const sentence of sentences) {
    if ((current + sentence).length > maxLength) {
      if (current) chunks.push(current.trim());
      current = sentence;
    } else {
      current += sentence;
    }
  }
  if (current) chunks.push(current.trim());
  return chunks;
}

function speakChunk(
  text: string,
  voice: SpeechSynthesisVoice,
  rate: number,
  lang: string,
  keepAliveRef: { id: any },
): Promise<void> {
  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.onend = () => {
      clearInterval(keepAliveRef.id);
      resolve();
    };
    utterance.onerror = (e) => {
      clearInterval(keepAliveRef.id);
      if (e.error === "interrupted") {
        // Do not log or reject for interrupted (normal cancel)
        resolve();
        return;
      }
      console.error("[useTTSSettings] SpeechSynthesis error:", e);
      reject(e);
    };
    // Keep-alive workaround for Chromium/Edge long-speech pause bug
    keepAliveRef.id = setInterval(() => {
      if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause();
        speechSynthesis.resume();
      }
    }, 10000);
    speechSynthesis.speak(utterance);
  });
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useTTSSettings(defaults?: Partial<TTSSettings>) {
  const [provider, setProvider] = useState<TTSProvider>(
    defaults?.provider ?? "edge",
  );
  const [accent, setAccent] = useState(
    defaults?.accent ?? "microsoft-brian-us", // Default to deep male voice (Brian)
  );
  const [speed, setSpeed] = useState(defaults?.speed ?? 0.75);
  const [status, setStatus] = useState<TTSStatus>("idle");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Refs — stable across renders, no stale closure issues
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastSpeakRef = useRef<{ text: string; at: number } | null>(null);

  // Keep latest state accessible inside callbacks without re-creating them
  const providerRef = useRef(provider);
  const accentRef = useRef(accent);
  const speedRef = useRef(speed);
  const voicesRef = useRef(voices);

  useEffect(() => {
    providerRef.current = provider;
  }, [provider]);
  useEffect(() => {
    accentRef.current = accent;
  }, [accent]);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);
  useEffect(() => {
    voicesRef.current = voices;
  }, [voices]);

  // ── Sync status to ref ────────────────────────────────────────────────────────
  const statusRef = useRef<TTSStatus>("idle");
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  // ── Load voices ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadVoices = () => setVoices(speechSynthesis.getVoices());

    loadVoices();
    speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () =>
      speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, []);

  // ── Cleanup on unmount ───────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      clearInterval(resumeTimerRef.current!);
      abortRef.current?.abort();
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
      audioRef.current?.pause();
      window.speechSynthesis?.cancel();
    };
  }, []);

  // ── stop() ──────────────────────────────────────────────────────────────────
  const stop = useCallback(() => {
    // Cancel in-flight fetch
    abortRef.current?.abort();
    abortRef.current = null;

    // Stop Chromium resume nudge
    if (resumeTimerRef.current) {
      clearInterval(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }

    // Stop Web Speech API
    window.speechSynthesis?.cancel();

    // Stop audio element + free blob URL
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }

    setStatus("idle");
  }, []);

  // ── speak() ─────────────────────────────────────────────────────────────────
  const speak = useCallback(
    async (text: string, onEnd?: () => void) => {
      try {
        const trimmed = text.trim();
        if (!trimmed) return;
        if (statusRef.current === "loading") return;

        // Debounce — same text within 250 ms
        const now = Date.now();
        const last = lastSpeakRef.current;
        if (last && last.text === trimmed && now - last.at < 250) return;
        lastSpeakRef.current = { text: trimmed, at: now };

        stop();

        if (providerRef.current === "edge") {
          setStatus("loading");

          const lang = getLangFromVoiceId(accentRef.current);
          const voice = await getBestVoice(lang);

          if (!voice) {
            setStatus("idle");
            // Optionally, show a user-facing warning here (e.g., toast, alert, or console)
            if (typeof window !== "undefined") {
              alert(
                "No natural (neural/online) voice found. Please install or enable neural voices in your system's speech settings, then reload the page.",
              );
            } else {
              console.warn(
                "No natural (neural/online) voice found. Please install or enable neural voices in your system's speech settings, then reload the page.",
              );
            }
            return;
          }

          console.log(
            "[TTS] Selected voice:",
            voice.name,
            "| Local:",
            voice.localService,
          );
          setStatus("playing");

          const chunks = chunkText(trimmed, 250);
          for (const chunk of chunks) {
            const keepAliveRef = { id: null as any };
            await speakChunk(
              chunk,
              voice,
              speedRef.current,
              lang,
              keepAliveRef,
            );
          }

          setStatus("idle");
          onEnd?.();
          return;
        }

        // ── Google TTS ────────────────────────────────────────────────────────
        if (providerRef.current === "google") {
          setStatus("loading");
          const abortController = new AbortController();
          abortRef.current = abortController;

          const res = await fetch("/api/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: trimmed,
              voice: accentRef.current,
            }),
            signal: abortController.signal,
          });

          if (!res.ok) throw new Error(`TTS fetch failed: ${res.status}`);

          // API returns { audioContent: "<base64 MP3>" } — decode it properly
          const data = await res.json();
          if (!data.audioContent)
            throw new Error("No audioContent in TTS response");

          const binaryStr = atob(data.audioContent);
          const bytes = new Uint8Array(binaryStr.length);
          for (let i = 0; i < binaryStr.length; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: "audio/mpeg" });

          if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
          const url = URL.createObjectURL(blob);
          blobUrlRef.current = url;

          const audio = new Audio(url);
          audioRef.current = audio;
          audio.playbackRate = speedRef.current;

          setStatus("playing");
          await new Promise<void>((resolve, reject) => {
            audio.onended = () => {
              setStatus("idle");
              onEnd?.();
              resolve();
            };
            audio.onerror = () => {
              setStatus("idle");
              reject(new Error("Audio playback failed"));
            };
            audio.play().catch(reject);
          });
        }
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          console.error("[useTTSSettings] speak error:", err);
        }
        setStatus("idle");
      }
    },
    [stop],
  );

  return {
    // state
    provider,
    accent,
    speed,
    voices,
    status, // "idle" | "loading" | "playing"
    playing: status === "playing", // convenience bool
    loading: status === "loading", // convenience bool
    // actions
    setProvider,
    setAccent,
    setSpeed,
    speak,
    stop,
  };
}

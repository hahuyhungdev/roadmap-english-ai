"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { TTSProvider, TTSSettings } from "../shared/types";
import { DEFAULT_SPEED, EDGE_ACCENTS } from "../shared/constants";

// ─── Types ────────────────────────────────────────────────────────────────────
type TTSStatus = "idle" | "loading" | "playing";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getLangFromVoiceId(voiceId: string): string {
  return EDGE_ACCENTS.find((a) => a.value === voiceId)?.lang ?? "en-US";
}

// Blocklist for old, robotic voices
const BLOCKLIST = ["David", "Zira", "Hedda", "Helena"];

// Robustly wait for voices to be loaded
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

// Find voice matching accent ID, fall back to any neural voice
async function getVoiceForAccent(
  accentId: string,
  lang = "en-US",
): Promise<SpeechSynthesisVoice | null> {
  let voices = await loadVoices();
  // "microsoft-andrew-us" → "andrew"; "microsoft-brian-us" → "brian"
  const parts = accentId.toLowerCase().split("-");
  const namePart = parts[1]; // the voice name segment

  // Try up to 6 times (Chromium loads voices asynchronously)
  for (let attempt = 0; attempt < 6; attempt++) {
    if (attempt > 0) {
      await new Promise((r) => setTimeout(r, 500));
      voices = await loadVoices();
    }

    if (namePart) {
      const specific = voices.find(
        (v) =>
          v.name.toLowerCase().includes(namePart) && v.lang.startsWith(lang),
      );
      if (specific) return specific;
    }

    // Fallback: any natural/neural/online voice for the lang
    const fallback = voices.find(
      (v) =>
        v.lang.startsWith(lang) &&
        (v.name.toLowerCase().includes("natural") ||
          v.name.toLowerCase().includes("neural") ||
          v.name.toLowerCase().includes("online")) &&
        !BLOCKLIST.some((name) => v.name.includes(name)),
    );
    if (fallback) return fallback;
  }
  return null;
}

// Chunk text for Edge TTS bug (~300 chars limit)
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
  keepAliveRef: { id: ReturnType<typeof setInterval> | null },
): Promise<void> {
  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.onend = () => {
      if (keepAliveRef.id) clearInterval(keepAliveRef.id);
      resolve();
    };
    utterance.onerror = (e) => {
      if (keepAliveRef.id) clearInterval(keepAliveRef.id);
      if (e.error === "interrupted") {
        resolve();
        return;
      }
      reject(e);
    };
    // Keep-alive workaround for Chromium long-speech pause bug
    keepAliveRef.id = setInterval(() => {
      if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause();
        speechSynthesis.resume();
      }
    }, 10000);
    speechSynthesis.speak(utterance);
  });
}

// ─── Audio pre-buffer cache (in-memory) ───────────────────────────────────
// Stores pre-fetched audio blobs so TTS playback is instant
const audioBufferCache = new Map<string, string>(); // key -> base64 audio

function makeCacheKey(text: string, voice: string, speed: number) {
  return `${text}|${voice}|${speed}`;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useTTSSettings(defaults?: Partial<TTSSettings>) {
  const [provider, setProvider] = useState<TTSProvider>(
    defaults?.provider ?? "edge",
  );
  const [accent, setAccent] = useState(
    defaults?.accent ?? "microsoft-andrew-us",
  );
  const [speed, setSpeed] = useState(defaults?.speed ?? DEFAULT_SPEED);
  const [status, setStatus] = useState<TTSStatus>("idle");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const lastSpeakRef = useRef<{ text: string; at: number } | null>(null);

  // Keep latest state in refs for stable callbacks
  const providerRef = useRef(provider);
  const accentRef = useRef(accent);
  const speedRef = useRef(speed);
  const statusRef = useRef<TTSStatus>("idle");

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
    statusRef.current = status;
  }, [status]);

  // ── Load browser voices ─────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    const load = () => setVoices(speechSynthesis.getVoices());
    load();
    speechSynthesis.addEventListener("voiceschanged", load);
    return () => speechSynthesis.removeEventListener("voiceschanged", load);
  }, []);

  // ── Cleanup on unmount ──────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
      audioRef.current?.pause();
      window.speechSynthesis?.cancel();
    };
  }, []);

  // ── stop() ──────────────────────────────────────────────────────────────
  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    window.speechSynthesis?.cancel();
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

  // ── speak() ─────────────────────────────────────────────────────────────
  const speak = useCallback(
    async (text: string, onEnd?: () => void) => {
      try {
        const trimmed = text.trim();
        if (!trimmed) return;
        if (statusRef.current === "loading") return;

        // Debounce — same text within 250ms
        const now = Date.now();
        const last = lastSpeakRef.current;
        if (last && last.text === trimmed && now - last.at < 250) return;
        lastSpeakRef.current = { text: trimmed, at: now };

        stop();

        if (providerRef.current === "edge") {
          setStatus("loading");
          const lang = getLangFromVoiceId(accentRef.current);
          const voice = await getVoiceForAccent(accentRef.current, lang);
          if (!voice) {
            setStatus("idle");
            console.warn(
              "[useTTSSettings] No voice found for",
              accentRef.current,
              lang,
            );
            return;
          }
          setStatus("playing");
          const chunks = chunkText(trimmed, 250);
          for (const chunk of chunks) {
            const keepAlive = {
              id: null as ReturnType<typeof setInterval> | null,
            };
            await speakChunk(chunk, voice, speedRef.current, lang, keepAlive);
          }
          setStatus("idle");
          onEnd?.();
          return;
        }

        // ── Google TTS (with pre-buffer cache) ──────────────────────────
        if (providerRef.current === "google") {
          const cacheKey = makeCacheKey(
            trimmed,
            accentRef.current,
            speedRef.current,
          );
          const cachedBase64 = audioBufferCache.get(cacheKey);

          if (cachedBase64) {
            // Instant playback from pre-buffer
            setStatus("playing");
            await playBase64Audio(
              cachedBase64,
              speedRef.current,
              blobUrlRef,
              audioRef,
              () => {
                setStatus("idle");
                onEnd?.();
              },
            );
            return;
          }

          setStatus("loading");
          const abortController = new AbortController();
          abortRef.current = abortController;

          const res = await fetch("/api/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: trimmed,
              voice: accentRef.current,
              speed: speedRef.current,
            }),
            signal: abortController.signal,
          });

          if (!res.ok) throw new Error(`TTS fetch failed: ${res.status}`);

          const data = await res.json();
          if (!data.audioContent)
            throw new Error("No audioContent in response");

          // Cache for instant replay
          audioBufferCache.set(cacheKey, data.audioContent);

          setStatus("playing");
          await playBase64Audio(
            data.audioContent,
            speedRef.current,
            blobUrlRef,
            audioRef,
            () => {
              setStatus("idle");
              onEnd?.();
            },
          );
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

  // ── Pre-buffer upcoming sentences ───────────────────────────────────────
  const preBuffer = useCallback(async (texts: string[]) => {
    if (providerRef.current !== "google") return;

    const toFetch = texts
      .map((t) => t.trim())
      .filter(
        (t) =>
          t &&
          !audioBufferCache.has(
            makeCacheKey(t, accentRef.current, speedRef.current),
          ),
      );

    if (toFetch.length === 0) return;

    // Use batch endpoint for efficiency
    try {
      await fetch("/api/tts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: toFetch.map((text) => ({
            text,
            voice: accentRef.current,
            speed: speedRef.current,
          })),
        }),
      });
      // The batch endpoint caches in DB; next individual request will be fast
      // Also pre-fetch into memory cache individually
      for (const text of toFetch.slice(0, 5)) {
        const cacheKey = makeCacheKey(
          text,
          accentRef.current,
          speedRef.current,
        );
        if (audioBufferCache.has(cacheKey)) continue;
        try {
          const res = await fetch("/api/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text,
              voice: accentRef.current,
              speed: speedRef.current,
            }),
          });
          const data = await res.json();
          if (data.audioContent) {
            audioBufferCache.set(cacheKey, data.audioContent);
          }
        } catch {
          // Non-critical, just skip
        }
      }
    } catch {
      // Batch pre-fetch failed, non-critical
    }
  }, []);

  return {
    provider,
    accent,
    speed,
    voices,
    status,
    playing: status === "playing",
    loading: status === "loading",
    setProvider,
    setAccent,
    setSpeed,
    speak,
    stop,
    preBuffer,
  };
}

// ─── Helper: play base64 audio ────────────────────────────────────────────
function playBase64Audio(
  base64: string,
  playbackRate: number,
  blobUrlRef: React.MutableRefObject<string | null>,
  audioRef: React.MutableRefObject<HTMLAudioElement | null>,
  onDone: () => void,
): Promise<void> {
  const binaryStr = atob(base64);
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
  audio.playbackRate = playbackRate;

  return new Promise<void>((resolve, reject) => {
    audio.onended = () => {
      onDone();
      resolve();
    };
    audio.onerror = () => {
      onDone();
      reject(new Error("Audio playback failed"));
    };
    audio.play().catch(reject);
  });
}

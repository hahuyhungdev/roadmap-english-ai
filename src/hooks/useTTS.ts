"use client";

import { useCallback, useRef, useState } from "react";

export function useTTS() {
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback(
    async (text: string, voice = "en-US-Neural2-F", speed = 1.0) => {
      if (!text.trim() || loading) return;

      // Use browser native TTS for Edge
      if (voice === "edge-native") {
        try {
          setLoading(true);
          const synth = window.speechSynthesis;
          if (!synth) {
            throw new Error("Speech Synthesis not available");
          }

          // Cancel any ongoing speech
          synth.cancel();

          const utterance = new SpeechSynthesisUtterance(text.trim());
          utterance.rate = speed;
          utterance.lang = "en-US";

          utteranceRef.current = utterance;

          setPlaying(true);
          utterance.onend = () => {
            setPlaying(false);
            setLoading(false);
          };
          utterance.onerror = () => {
            setPlaying(false);
            setLoading(false);
          };

          synth.speak(utterance);
        } catch (err) {
          console.error("[useTTS Browser]", err);
          setLoading(false);
          setPlaying(false);
        }
        return;
      }

      // Use API TTS for Google voices
      setLoading(true);
      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: text.trim(), voice, speed }),
        });
        const data = (await res.json()) as {
          audioContent?: string;
          error?: string;
        };
        if (!res.ok || !data.audioContent) {
          throw new Error(data.error || "TTS failed");
        }

        const binary = atob(data.audioContent);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const blob = new Blob([bytes], { type: "audio/mpeg" });

        // revoke previous
        if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
        const url = URL.createObjectURL(blob);
        blobUrlRef.current = url;

        if (audioRef.current) audioRef.current.pause();
        const audio = new Audio(url);
        audioRef.current = audio;
        setPlaying(true);
        audio.onended = () => setPlaying(false);
        audio.onerror = () => setPlaying(false);
        await audio.play();
      } catch (err) {
        console.error("[useTTS]", err);
      } finally {
        setLoading(false);
      }
    },
    [loading],
  );

  const stop = useCallback(() => {
    // Stop browser native TTS
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    // Stop audio element
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    setPlaying(false);
  }, []);

  return { speak, stop, loading, playing };
}

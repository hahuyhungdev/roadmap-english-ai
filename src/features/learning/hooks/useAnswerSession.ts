"use client";

import { useRef, useState } from "react";
import type { PracticeFeedback, PracticeTurn } from "../types/practice";

type HistoryMsg = { role: "user" | "assistant"; content: string };

interface UseAnswerSessionProps {
  sessionSlug?: string;
  questionId?: string;
  questionText?: string;
}

interface UseAnswerSessionResult {
  turns: PracticeTurn[];
  loading: boolean;
  isPlaying: boolean;
  callAnswer: (transcript: string) => Promise<void>;
  clearSession: () => void;
}

export function useAnswerSession({
  sessionSlug,
  questionId,
  questionText,
}: UseAnswerSessionProps): UseAnswerSessionResult {
  const [turns, setTurns] = useState<PracticeTurn[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const historyRef = useRef<HistoryMsg[]>([]);

  async function callAnswer(text: string) {
    const trimmed = text.trim();
    if (!trimmed || !questionText) return;

    setTurns((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: "user", text: trimmed },
    ]);

    const history = historyRef.current.slice(-6);
    setLoading(true);

    try {
      const res = await fetch("/api/practice/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: trimmed,
          questionId,
          questionText,
          sessionSlug,
          history,
        }),
      });

      let data: {
        reply?: string;
        review?: PracticeFeedback;
        audioContent?: string;
        error?: string;
      } = {};
      try {
        data = await res.json();
      } catch {
        throw new Error(`Server error ${res.status}`);
      }
      if (!res.ok) throw new Error(data.error || `API error ${res.status}`);

      const fullReply = data.reply || "";
      const displayText = fullReply
        .replace(/```review[\s\S]*?```/g, "")
        .trim();

      historyRef.current = [
        ...historyRef.current,
        { role: "user", content: trimmed },
        { role: "assistant", content: fullReply },
      ];

      const coachId = `c-${Date.now()}`;
      setTurns((prev) => [
        ...prev,
        {
          id: coachId,
          role: "coach",
          text: "",
          review: data.review ?? undefined,
        },
      ]);

      // Stream text word by word
      const words = displayText.split(" ");
      let currentText = "";
      for (const word of words) {
        currentText += (currentText ? " " : "") + word;
        setTurns((prev) =>
          prev.map((t) =>
            t.id === coachId ? { ...t, text: currentText } : t,
          ),
        );
        await new Promise((r) => setTimeout(r, 30));
      }

      // Play TTS
      if (data.audioContent) {
        setIsPlaying(true);
        const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
        audio.onended = () => setIsPlaying(false);
        audio.play().catch(() => setIsPlaying(false));
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setTurns((prev) => [
        ...prev,
        { id: `err-${Date.now()}`, role: "coach", text: `⚠️ ${msg}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function clearSession() {
    setTurns([]);
    historyRef.current = [];
  }

  return { turns, loading, isPlaying, callAnswer, clearSession };
}

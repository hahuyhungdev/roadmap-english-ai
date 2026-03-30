"use client";

import { useCallback } from "react";
import { extractReview, newId } from "../shared/utils";

export interface SubmitTranscriptOptions {
  text: string;
  sentenceIdx?: number;
  onTurnsUpdate: (turn: {
    id: string;
    text: string;
    sentenceIdx?: number;
    feedback: null;
    review: null;
    timestamp: number;
    audioUrl?: string;
  }) => void;
  onFeedbackUpdate: (id: string, feedback: string, review: any) => void;
  onError: (id: string, error: string) => void;
  onLoadingChange: (loading: boolean) => void;
  topic: string;
  historyRef: React.MutableRefObject<{ role: string; content: string }[]>;
}

export function useTranscriptSubmission() {
  const submitTranscript = useCallback(
    async (options: SubmitTranscriptOptions) => {
      const {
        text,
        sentenceIdx,
        onTurnsUpdate,
        onFeedbackUpdate,
        onError,
        onLoadingChange,
        topic,
        historyRef,
      } = options;

      const trimmed = text.trim();
      if (!trimmed) return;

      const id = newId();
      onTurnsUpdate({
        id,
        text: trimmed,
        sentenceIdx,
        feedback: null,
        review: null,
        timestamp: Date.now(),
      });
      onLoadingChange(true);
      historyRef.current.push({ role: "user", content: trimmed });

      try {
        const res = await fetch("/api/voice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transcript: trimmed,
            history: historyRef.current.slice(-6),
            topic,
          }),
        });

        const data = (await res.json()) as {
          reply?: string;
          error?: string;
        };
        const reply = data.reply ?? "";
        const review = extractReview(reply);
        const feedbackText = reply.replace(/```review[\s\S]*?```/gi, "").trim();

        historyRef.current.push({ role: "assistant", content: reply });
        onFeedbackUpdate(id, feedbackText, review);
      } catch {
        onError(id, "Could not get feedback. Try again.");
      } finally {
        onLoadingChange(false);
      }
    },
    [],
  );

  return { submitTranscript };
}

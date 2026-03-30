import type { SpeakingReview, Sentence } from "./types";

export function extractReview(raw: string): SpeakingReview | null {
  try {
    const m = raw.match(/```review\s*([\s\S]*?)\s*```/i);
    if (!m) return null;
    return JSON.parse(m[1].trim()) as SpeakingReview;
  } catch {
    return null;
  }
}

export function extractVideoId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
  );
  return m ? m[1] : null;
}

export function fmtTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

let _tid = 0;
export const newId = () => `t-${++_tid}-${Date.now()}`;

export function splitScriptIntoSentences(script: string): Sentence[] {
  const cleaned = script.trim().replace(/\s+/g, " ");
  if (!cleaned) return [];

  const sentenceMatches = cleaned.match(/[^.!?]*[.!?]+/g) || [];
  let currentTimeMs = 0;
  const result: Sentence[] = [];

  for (const match of sentenceMatches) {
    const sentence = match.trim();
    if (!sentence) continue;

    if (sentence.length > 120) {
      const chunks = splitLongSentence(sentence);
      for (const chunk of chunks) {
        const chunkText = chunk.trim();
        if (!chunkText) continue;
        const duration = estimateDuration(chunkText);
        result.push({
          text: chunkText,
          startMs: currentTimeMs,
          endMs: currentTimeMs + duration,
        });
        currentTimeMs += duration;
      }
    } else {
      const duration = estimateDuration(sentence);
      result.push({
        text: sentence,
        startMs: currentTimeMs,
        endMs: currentTimeMs + duration,
      });
      currentTimeMs += duration;
    }
  }

  return result;
}

function splitLongSentence(sentence: string): string[] {
  const conjunctions =
    /\s+(and|but|or|because|although|however|therefore|meanwhile|furthermore|moreover)\s+/gi;
  const parts = sentence.split(conjunctions);

  if (parts.length > 1) {
    const result: string[] = [];
    for (let i = 0; i < parts.length; i += 2) {
      let chunk = parts[i];
      if (i + 1 < parts.length) {
        chunk += ` ${parts[i + 1]} ${parts[i + 2] || ""}`.trim();
        i++;
      }
      if (chunk.trim()) result.push(chunk);
    }
    const furtherSplit: string[] = [];
    for (const chunk of result) {
      if (chunk.length > 100) {
        furtherSplit.push(
          ...chunk
            .split(/,\s+/)
            .map((c) => c.trim())
            .filter(Boolean),
        );
      } else {
        furtherSplit.push(chunk);
      }
    }
    return furtherSplit.length > 1 ? furtherSplit : [sentence];
  }

  const byComma = sentence.split(/,\s+/).map((c) => c.trim());
  return byComma.length > 1 ? byComma : [sentence];
}

function estimateDuration(text: string): number {
  return Math.max(500, text.split(/\s+/).length * 400);
}

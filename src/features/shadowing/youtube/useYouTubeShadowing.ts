"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type FormEvent,
} from "react";
import type { YouTubeEvent } from "react-youtube";
import useSoniox from "@/hooks/useSoniox";
import { useTTS } from "@/hooks/useTTS";
import type {
  YTPlayer,
  ShadowTurn,
  Sentence,
  SessionOpts,
} from "../shared/types";
import { extractVideoId, extractReview, newId } from "../shared/utils";

// ─── Tactiq transcript parser ─────────────────────────────────────────────
function parseTimestampToMs(ts: string): number {
  const m = ts.match(/(\d+):(\d{2}):(\d{2})\.(\d{1,3})/);
  if (!m) return 0;
  const h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const sec = parseInt(m[3], 10);
  const ms = parseInt(m[4].padEnd(3, "0"), 10);
  return ((h * 60 + min) * 60 + sec) * 1000 + ms;
}

function parseTactiqTranscript(raw: string): Sentence[] | null {
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const items: { startMs: number; text: string }[] = [];
  const tsRe = /^(\d{1,2}:\d{2}:\d{2}\.\d{1,3})\s+(.*)$/;

  for (const line of lines) {
    if (line.startsWith("#")) continue;
    const m = line.match(tsRe);
    if (m) {
      items.push({ startMs: parseTimestampToMs(m[1]), text: m[2].trim() });
    } else if (items.length > 0) {
      items[items.length - 1].text += " " + line;
    }
  }

  if (!items.length) return null;

  return items.map((it, i) => ({
    text: it.text.trim(),
    startMs: it.startMs,
    endMs: i < items.length - 1 ? items[i + 1].startMs : it.startMs + 3000,
  }));
}

// ─── Hook ─────────────────────────────────────────────────────────────────
export function useYouTubeShadowing(opts?: SessionOpts) {
  // ── Video ──────────────────────────────────────────────────────────────
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState("");
  const [videoId, setVideoId] = useState<string | null>(
    opts?.initialVideoId ?? null,
  );
  const [videoTitle, setVideoTitle] = useState("");
  const playerRef = useRef<YTPlayer | null>(null);

  // ── Sentences (from pasted transcript) ─────────────────────────────────
  const [sentences, setSentences] = useState<Sentence[]>(
    opts?.initialSentences ?? [],
  );
  const [scriptError, setScriptError] = useState("");
  const [importingTranscript, setImportingTranscript] = useState(false);

  // ── TTS ────────────────────────────────────────────────────────────────
  const tts = useTTS();
  const [activeSentenceIdx, setActiveSentenceIdx] = useState(-1);
  const activeSentenceIdxRef = useRef(-1);
  const sentenceRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // ── Recording ──────────────────────────────────────────────────────────
  const {
    start: startSoniox,
    stop: stopSoniox,
    isRecording,
    transcript,
    partial,
    error: sonioxError,
  } = useSoniox({ source: "mic" });
  const startRef = useRef(startSoniox);
  const stopRef = useRef(stopSoniox);
  useEffect(() => {
    startRef.current = startSoniox;
    stopRef.current = stopSoniox;
  }, [startSoniox, stopSoniox]);
  useEffect(() => () => stopRef.current(), []);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const blobUrlsRef = useRef<string[]>([]);
  const pendingTurnIdRef = useRef<string | null>(null);
  const recordingForIdxRef = useRef<number | null>(null);
  useEffect(
    () => () => blobUrlsRef.current.forEach((u) => URL.revokeObjectURL(u)),
    [],
  );

  // ── Coaching ───────────────────────────────────────────────────────────
  const [turns, setTurns] = useState<ShadowTurn[]>([]);
  const [coachLoading, setCoachLoading] = useState(false);
  const historyRef = useRef<{ role: string; content: string }[]>([]);

  // ── Session persistence ────────────────────────────────────────────────
  const optsRef = useRef(opts);
  optsRef.current = opts;

  const notifySentences = useCallback((data: Sentence[]) => {
    setSentences(data);
    if (data.length > 0) {
      optsRef.current?.onSentencesChange?.(data);
      optsRef.current?.onScriptTextChange?.(data.map((s) => s.text).join("\n"));
    }
  }, []);

  // ── Video sync — track which sentence is playing ───────────────────────
  useEffect(() => {
    if (!sentences.length) return;
    const timer = setInterval(() => {
      const ms = (playerRef.current?.getCurrentTime() ?? 0) * 1000;
      let idx = -1;
      for (let i = 0; i < sentences.length; i++) {
        if (sentences[i].startMs <= ms) idx = i;
        else break;
      }
      if (idx !== activeSentenceIdxRef.current) {
        activeSentenceIdxRef.current = idx;
        setActiveSentenceIdx(idx);
      }
    }, 250);
    return () => clearInterval(timer);
  }, [sentences]);

  // ── Auto-scroll ────────────────────────────────────────────────────────
  useEffect(() => {
    if (activeSentenceIdx < 0) return;
    sentenceRefs.current[activeSentenceIdx]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }, [activeSentenceIdx]);

  // ── Keyboard shortcuts ─────────────────────────────────────────────────
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const tag = (
        document.activeElement as HTMLElement
      )?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      const player = playerRef.current;

      const goTo = (idx: number) => {
        if (idx < 0 || idx >= sentences.length) return;
        player?.seekTo(sentences[idx].startMs / 1000, true);
        player?.playVideo();
        activeSentenceIdxRef.current = idx;
        setActiveSentenceIdx(idx);
      };

      switch (e.key) {
        case " ":
          e.preventDefault();
          player?.getPlayerState() === 1
            ? player?.pauseVideo()
            : player?.playVideo();
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (e.shiftKey) goTo(activeSentenceIdxRef.current - 1);
          else player?.seekTo((player?.getCurrentTime() ?? 0) - 5, true);
          break;
        case "ArrowRight":
          e.preventDefault();
          if (e.shiftKey) goTo(activeSentenceIdxRef.current + 1);
          else player?.seekTo((player?.getCurrentTime() ?? 0) + 5, true);
          break;
        case "r":
        case "R":
          e.preventDefault();
          if (isRecording) stopRef.current();
          else startRecording();
          break;
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentences, isRecording]);

  // ── Actions ────────────────────────────────────────────────────────────
  const submitTranscript = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const id = newId();
      pendingTurnIdRef.current = id;
      const sentenceIdx = recordingForIdxRef.current ?? undefined;
      recordingForIdxRef.current = null;
      if (mediaRecorderRef.current?.state === "recording")
        mediaRecorderRef.current.stop();

      setTurns((prev) => [
        ...prev,
        {
          id,
          text: trimmed,
          sentenceIdx,
          feedback: null,
          review: null,
          timestamp: Date.now(),
        },
      ]);
      setCoachLoading(true);
      historyRef.current.push({ role: "user", content: trimmed });

      try {
        const res = await fetch("/api/voice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transcript: trimmed,
            history: historyRef.current.slice(-6),
            topic: videoTitle || "English shadowing",
          }),
        });
        const data = (await res.json()) as { reply?: string };
        const reply = data.reply ?? "";
        const review = extractReview(reply);
        const feedbackText = reply.replace(/```review[\s\S]*?```/gi, "").trim();
        historyRef.current.push({ role: "assistant", content: reply });
        setTurns((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, feedback: feedbackText, review } : t,
          ),
        );
      } catch {
        setTurns((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, feedback: "Could not get feedback." } : t,
          ),
        );
      } finally {
        setCoachLoading(false);
      }
    },
    [videoTitle],
  );

  function startRecording() {
    audioChunksRef.current = [];
    recordingForIdxRef.current =
      activeSentenceIdxRef.current >= 0 ? activeSentenceIdxRef.current : null;
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : MediaRecorder.isTypeSupported("audio/webm")
            ? "audio/webm"
            : "";
        const mr = new MediaRecorder(
          stream,
          mimeType ? { mimeType } : undefined,
        );
        mr.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };
        mr.onstop = () => {
          stream.getTracks().forEach((t) => t.stop());
          const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          const url = URL.createObjectURL(blob);
          blobUrlsRef.current.push(url);
          const tid = pendingTurnIdRef.current;
          if (tid)
            setTurns((prev) =>
              prev.map((t) => (t.id === tid ? { ...t, audioUrl: url } : t)),
            );
        };
        mr.start(250);
        mediaRecorderRef.current = mr;
      })
      .catch(() => {});
    startRef.current({ source: "mic" });
  }

  function handleLoadVideo(e?: FormEvent) {
    e?.preventDefault();
    setUrlError("");
    const id = extractVideoId(urlInput.trim());
    if (!id) {
      setUrlError("Invalid YouTube URL");
      return;
    }
    setVideoId(id);
    optsRef.current?.onVideoChange?.(id);
    setVideoTitle("");
    setSentences([]);
    setScriptError("");
    setActiveSentenceIdx(-1);
    activeSentenceIdxRef.current = -1;
    sentenceRefs.current = [];
  }

  function handlePlayerReady(event: YouTubeEvent) {
    playerRef.current = event.target as unknown as YTPlayer;
    const title = (event.target as { videoTitle?: string }).videoTitle ?? "";
    if (title) setVideoTitle(title);
  }

  function openTactiq() {
    if (!videoId) return;
    window.open(
      `https://tactiq.io/tools/run/youtube_transcript?yt=https://www.youtube.com/watch?v=${videoId}`,
      "_blank",
    );
  }

  async function handleImportTranscript(
    raw: string,
    importOpts?: { useAI?: boolean },
  ) {
    if (!raw) return;
    setScriptError("");

    if (importOpts?.useAI) {
      setImportingTranscript(true);
      try {
        const res = await fetch("/api/transcript", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ raw }),
        });
        const json = await res.json().catch(() => null);
        if (res.ok && Array.isArray(json?.segments)) {
          const segs: any[] = json.segments;
          const starts = segs.map((s) => Number(s.start ?? s.timestamp ?? 0));
          const data: Sentence[] = segs.map((s: any, i: number) => {
            const startMs = Math.round(
              Number(s.start ?? s.timestamp ?? 0) * 1000,
            );
            const endMs =
              i < starts.length - 1
                ? Math.round((starts[i + 1] ?? 0) * 1000)
                : startMs + 3000;
            return {
              text: String(s.text ?? s.caption ?? "").trim(),
              startMs,
              endMs,
            };
          });
          if (data.length > 0) {
            notifySentences(data);
            sentenceRefs.current = [];
            return;
          }
        }
        setScriptError(json?.error ?? "AI import failed");
      } catch (e: any) {
        setScriptError(String(e?.message ?? e));
      } finally {
        setImportingTranscript(false);
      }
      return;
    }

    // Local parsing (tactiq format)
    const parsed = parseTactiqTranscript(raw);
    if (parsed?.length) {
      notifySentences(parsed);
      sentenceRefs.current = [];
    } else {
      setScriptError("Could not parse pasted transcript");
    }
  }

  function goToSentence(idx: number) {
    if (idx < 0 || idx >= sentences.length) return;
    playerRef.current?.seekTo(sentences[idx].startMs / 1000, true);
    playerRef.current?.playVideo();
    activeSentenceIdxRef.current = idx;
    setActiveSentenceIdx(idx);
  }

  // ── Derived ────────────────────────────────────────────────────────────
  const scores = turns
    .map((t) => t.review?.score)
    .filter((s): s is number => typeof s === "number");
  const overallScore =
    scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : null;
  const activeSentenceText = sentences[activeSentenceIdx]?.text ?? "";
  const lastAudioUrl = (() => {
    for (let i = turns.length - 1; i >= 0; i--) {
      if (turns[i].sentenceIdx === activeSentenceIdx && turns[i].audioUrl)
        return turns[i].audioUrl;
    }
    return null;
  })();

  return {
    urlInput,
    setUrlInput,
    urlError,
    videoId,
    playerRef,
    videoTitle,
    sentences,
    scriptError,
    activeSentenceIdx,
    sentenceRefs,
    importingTranscript,
    isRecording,
    sonioxError,
    turns,
    coachLoading,
    overallScore,
    activeSentenceText,
    lastAudioUrl,
    tts,
    handleLoadVideo,
    handlePlayerReady,
    handleImportTranscript,
    openTactiq,
    goToSentence,
    onListenSentence: () => {
      const text = sentences[activeSentenceIdx]?.text;
      if (text) void tts.speak(text);
    },
    onToggleRecording: () => {
      if (isRecording) {
        stopRef.current();
        const text = (transcript || partial).trim();
        if (text) void submitTranscript(text);
      } else {
        startRecording();
      }
    },
    onClearSession: () => {
      setTurns([]);
      historyRef.current = [];
    },
  };
}

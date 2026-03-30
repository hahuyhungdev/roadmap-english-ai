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
import { useTTSSettings } from "../shared/useTTSSettings";
import type { YTPlayer, ShadowTurn, Sentence } from "../shared/types";
import { extractVideoId, extractReview, newId } from "../shared/utils";
import { DEFAULT_SPEED } from "@/features/shadowing/shared/constants";

export function useYouTubeShadowing() {
  // ── Video ────────────────────────────────────────────────────────────────
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState("");
  const playerRef = useRef<YTPlayer | null>(null);

  // ── Script / sentences ───────────────────────────────────────────────────
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [scriptLoading, setScriptLoading] = useState(false);
  const [scriptError, setScriptError] = useState("");
  const [activeSentenceIdx, setActiveSentenceIdx] = useState(-1);
  const activeSentenceIdxRef = useRef(-1);
  const sentenceRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // ── TTS (self-contained) ─────────────────────────────────────────────────
  const tts = useTTSSettings({ provider: "google", speed: DEFAULT_SPEED });

  // ── Recording ────────────────────────────────────────────────────────────
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

  // ── Coaching turns ───────────────────────────────────────────────────────
  const [turns, setTurns] = useState<ShadowTurn[]>([]);
  const [coachLoading, setCoachLoading] = useState(false);
  const historyRef = useRef<{ role: string; content: string }[]>([]);

  // ── Video sync ────────────────────────────────────────────────────────────
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

  // ── Auto-scroll ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (activeSentenceIdx >= 0) {
      sentenceRefs.current[activeSentenceIdx]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [activeSentenceIdx]);

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
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
        const clamped = Math.max(0, Math.min(sentences.length - 1, idx));
        activeSentenceIdxRef.current = clamped;
        setActiveSentenceIdx(clamped);
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
        case "ArrowUp":
          e.preventDefault();
          // Record
          if (isRecording) stopRef.current();
          else startRecordingAction();
          break;
        case "ArrowDown":
          e.preventDefault();
          // Listen again
          if (
            activeSentenceIdxRef.current >= 0 &&
            sentences[activeSentenceIdxRef.current]
          ) {
            void tts.speak(sentences[activeSentenceIdxRef.current].text);
          }
          break;
        case "r":
        case "R":
          e.preventDefault();
          if (isRecording) stopRef.current();
          else startRecordingAction();
          break;
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentences, isRecording, tts.speak]);

  // ── Actions ───────────────────────────────────────────────────────────────
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
        const data = (await res.json()) as { reply?: string; error?: string };
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

  function startRecordingAction() {
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

  async function handleFetchScript() {
    if (!videoId) return;
    setScriptLoading(true);
    setScriptError("");
    setSentences([]);
    try {
      const res = await fetch(
        `/api/transcript?url=${encodeURIComponent(`https://youtube.com/watch?v=${videoId}`)}`,
      );
      const data = (await res.json()) as {
        sentences?: Sentence[];
        error?: string;
      };
      if (!res.ok || !data.sentences) {
        setScriptError(data.error ?? "Failed to fetch script.");
        return;
      }
      setSentences(data.sentences);
      sentenceRefs.current = [];
    } finally {
      setScriptLoading(false);
    }
  }

  function goToSentence(idx: number) {
    if (idx < 0 || idx >= sentences.length) return;
    playerRef.current?.seekTo(sentences[idx].startMs / 1000, true);
    playerRef.current?.playVideo();
    activeSentenceIdxRef.current = idx;
    setActiveSentenceIdx(idx);
  }

  // ── Derived ───────────────────────────────────────────────────────────────
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
      const t = turns[i];
      if (t.sentenceIdx === activeSentenceIdx && t.audioUrl) return t.audioUrl;
    }
    return null;
  })();

  return {
    urlInput,
    setUrlInput,
    urlError,
    videoId,
    playerRef,
    sentences,
    scriptLoading,
    scriptError,
    activeSentenceIdx,
    sentenceRefs,
    tts,
    isRecording,
    sonioxError,
    turns,
    coachLoading,
    overallScore,
    activeSentenceText,
    lastAudioUrl,
    handleLoadVideo,
    handlePlayerReady,
    handleFetchScript,
    goToSentence,
    onToggleRecording: () => {
      if (isRecording) {
        stopRef.current();
        const text = (transcript || partial).trim();
        if (text) void submitTranscript(text);
      } else {
        startRecordingAction();
      }
    },
    onListenSentence: () => {
      if (activeSentenceIdx >= 0 && sentences[activeSentenceIdx]) {
        void tts.speak(sentences[activeSentenceIdx].text);
      }
    },
    onClearSession: () => {
      setTurns([]);
      historyRef.current = [];
    },
  };
}

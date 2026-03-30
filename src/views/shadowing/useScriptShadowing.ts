"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type FormEvent,
} from "react";
import useSoniox from "@/hooks/useSoniox";
import { useTTS } from "@/hooks/useTTS";
import type { ShadowTurn, Sentence } from "./types";
import { extractReview, newId, splitScriptIntoSentences } from "./utils";

export function useScriptShadowing() {
  const [scriptInput, setScriptInput] = useState("");
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [scriptError, setScriptError] = useState("");
  const [activeSentenceIdx, setActiveSentenceIdx] = useState(-1);
  const sentenceItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [recordingForIdx, setRecordingForIdx] = useState<number | null>(null);

  // Script mode defaults: Edge TTS + 0.75 speed
  const [ttsProvider, setTtsProvider] = useState("edge");
  const [ttsAccent, setTtsAccent] = useState("en-US");
  const [ttsVoice, setTtsVoice] = useState("en-US-Neural2-F");
  const [ttsSpeed, setTtsSpeed] = useState(0.75);
  const [hearingIdx, setHearingIdx] = useState<number | null>(null);
  const {
    speak,
    stop: stopTTS,
    loading: ttsLoading,
    playing: ttsPlaying,
  } = useTTS();

  const [autoPronounceSentence, setAutoPronounceSentence] = useState(false);
  const [loopSentence, setLoopSentence] = useState(false);
  const loopCountRef = useRef(0);
  const loopTimerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    start: startSoniox,
    stop: stopSoniox,
    isRecording,
    transcript,
    partial,
    error: sonioxError,
  } = useSoniox({
    source: "mic",
  });

  useEffect(() => {
    if (!ttsPlaying) setHearingIdx(null);
  }, [ttsPlaying]);

  // Auto-pronounce on sentence change
  useEffect(() => {
    if (
      autoPronounceSentence &&
      activeSentenceIdx >= 0 &&
      sentences[activeSentenceIdx] &&
      !ttsPlaying &&
      !isRecording
    ) {
      const handleAutoSpeak = async () => {
        await new Promise((r) => setTimeout(r, 300));
        if (activeSentenceIdx >= 0 && sentences[activeSentenceIdx]) {
          setHearingIdx(activeSentenceIdx);
          if (loopSentence) {
            loopCountRef.current = 2;
          }
          await speak(sentences[activeSentenceIdx].text, ttsVoice, ttsSpeed);
        }
      };
      handleAutoSpeak().catch(() => {});
    }
  }, [
    activeSentenceIdx,
    autoPronounceSentence,
    sentences,
    ttsPlaying,
    isRecording,
    ttsVoice,
    ttsSpeed,
    loopSentence,
    speak,
  ]);

  // Loop playback
  useEffect(() => {
    if (
      loopSentence &&
      hearingIdx !== null &&
      hearingIdx >= 0 &&
      !ttsPlaying &&
      sentences[hearingIdx]
    ) {
      const loopRemaining = loopCountRef.current;
      if (loopRemaining > 0) {
        loopTimerRef.current = setTimeout(() => {
          loopCountRef.current = loopRemaining - 1;
          setHearingIdx(hearingIdx);
          speak(sentences[hearingIdx].text, ttsVoice, ttsSpeed).catch(() => {});
        }, 3000);
      }
    }

    return () => {
      if (loopTimerRef.current) clearTimeout(loopTimerRef.current);
    };
  }, [
    hearingIdx,
    loopSentence,
    sentences,
    ttsPlaying,
    ttsVoice,
    ttsSpeed,
    speak,
  ]);

  useEffect(() => {
    if (activeSentenceIdx >= 0) {
      sentenceItemRefs.current[activeSentenceIdx]?.scrollIntoView({
        behavior: "smooth",
        inline: "nearest",
        block: "nearest",
      });
    }
  }, [activeSentenceIdx]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const pendingTurnIdRef = useRef<string | null>(null);
  const blobUrlsRef = useRef<string[]>([]);
  useEffect(
    () => () => blobUrlsRef.current.forEach((u) => URL.revokeObjectURL(u)),
    [],
  );

  const [turns, setTurns] = useState<ShadowTurn[]>([]);
  const [coachLoading, setCoachLoading] = useState(false);
  const historyRef = useRef<{ role: string; content: string }[]>([]);

  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showTtsSettings, setShowTtsSettings] = useState(false);

  const scores = turns
    .map((t) => t.review?.score)
    .filter((s): s is number => typeof s === "number");
  const overallScore =
    scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : null;

  const submitTranscript = useCallback(
    async (transcript: string) => {
      const text = transcript.trim();
      if (!text) return;
      const id = newId();
      pendingTurnIdRef.current = id;
      const currentSentenceIdx = recordingForIdx ?? undefined;
      setRecordingForIdx(null);
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      setTurns((prev) => [
        ...prev,
        {
          id,
          text,
          sentenceIdx: currentSentenceIdx,
          feedback: null,
          review: null,
          timestamp: Date.now(),
        },
      ]);
      setCoachLoading(true);
      historyRef.current.push({ role: "user", content: text });

      try {
        const res = await fetch("/api/voice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transcript: text,
            history: historyRef.current.slice(-6),
            topic: "English script practice",
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
            t.id === id
              ? { ...t, feedback: "Could not get feedback. Try again." }
              : t,
          ),
        );
      } finally {
        setCoachLoading(false);
      }
    },
    [recordingForIdx],
  );

  const startRef = useRef(startSoniox);
  const stopRef = useRef(stopSoniox);

  useEffect(() => {
    startRef.current = startSoniox;
    stopRef.current = stopSoniox;
  }, [startSoniox, stopSoniox]);

  useEffect(() => () => stopRef.current(), []);

  async function finishRecording() {
    stopRef.current();
    const finalText = (transcript || partial).trim();
    if (finalText) {
      await submitTranscript(finalText);
    }
  }

  function startRecording() {
    audioChunksRef.current = [];
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
          const blob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });
          const url = URL.createObjectURL(blob);
          blobUrlsRef.current.push(url);
          const tid = pendingTurnIdRef.current;
          if (tid) {
            setTurns((prev) =>
              prev.map((t) => (t.id === tid ? { ...t, audioUrl: url } : t)),
            );
          }
        };
        mr.start(250);
        mediaRecorderRef.current = mr;
      })
      .catch(() => {});
    startRef.current({ source: "mic" });
  }

  const keyHandlerRef = useRef<(e: globalThis.KeyboardEvent) => void>(() => {});
  useEffect(() => {
    keyHandlerRef.current = (e: globalThis.KeyboardEvent) => {
      const tag = (
        document.activeElement as HTMLElement
      )?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      const goToSentence = (idx: number) => {
        if (idx < 0 || idx >= sentences.length) return;
        setActiveSentenceIdx(idx);
      };

      switch (e.key) {
        case " ":
        case "s":
        case "S":
          e.preventDefault();
          if (activeSentenceIdx >= 0) {
            setHearingIdx(activeSentenceIdx);
            void speak(sentences[activeSentenceIdx].text, ttsVoice, ttsSpeed);
          }
          break;

        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault();
          goToSentence(Math.max(0, activeSentenceIdx - 1));
          break;

        case "ArrowRight":
        case "d":
        case "D":
          e.preventDefault();
          goToSentence(Math.min(sentences.length - 1, activeSentenceIdx + 1));
          break;

        case "r":
        case "R":
          e.preventDefault();
          if (isRecording) stopRef.current();
          else startRecording();
          break;

        case "?":
          setShowShortcuts((value) => !value);
          break;

        case "Escape":
          setShowShortcuts(false);
          setShowTtsSettings(false);
          break;
      }
    };
  }, [sentences, activeSentenceIdx, isRecording, ttsVoice, ttsSpeed, speak]);

  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => keyHandlerRef.current(e);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  function handleLoadScript(e?: FormEvent) {
    e?.preventDefault();
    setScriptError("");
    const trimmed = scriptInput.trim();
    if (!trimmed) {
      setScriptError("Please paste a script or text");
      return;
    }
    try {
      const sentences = splitScriptIntoSentences(trimmed);
      if (sentences.length === 0) {
        setScriptError("Could not extract sentences from the script");
        return;
      }
      setSentences(sentences);
      setActiveSentenceIdx(0);
      sentenceItemRefs.current = [];
    } catch (err) {
      setScriptError(
        `Error processing script: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    }
  }

  function goToSentenceIdx(idx: number) {
    if (idx < 0 || idx >= sentences.length) return;
    setActiveSentenceIdx(idx);
  }

  function onClearSession() {
    setTurns([]);
    historyRef.current = [];
  }

  function onToggleRecording() {
    if (isRecording) {
      void finishRecording();
    } else {
      if (activeSentenceIdx >= 0) {
        setRecordingForIdx(activeSentenceIdx);
      }
      startRecording();
    }
  }

  function onListenAIVoice() {
    if (activeSentenceIdx >= 0) {
      setHearingIdx(activeSentenceIdx);
      void speak(sentences[activeSentenceIdx].text, ttsVoice, ttsSpeed);
    }
  }

  function onPrevSentence() {
    if (activeSentenceIdx > 0) {
      goToSentenceIdx(activeSentenceIdx - 1);
    }
  }

  function onNextSentence() {
    if (activeSentenceIdx < sentences.length - 1) {
      goToSentenceIdx(activeSentenceIdx + 1);
    }
  }

  const activeSentenceText =
    activeSentenceIdx >= 0 ? (sentences[activeSentenceIdx]?.text ?? "") : "";

  const activeSentenceAudioUrl = (() => {
    if (activeSentenceIdx < 0) return null;
    for (let i = turns.length - 1; i >= 0; i -= 1) {
      const turn = turns[i];
      if (turn.sentenceIdx === activeSentenceIdx && turn.audioUrl) {
        return turn.audioUrl;
      }
    }
    return null;
  })();

  return {
    scriptInput,
    setScriptInput,
    sentences,
    scriptError,
    activeSentenceIdx,
    sentenceItemRefs,
    recordingForIdx,
    activeSentenceText,
    ttsProvider,
    setTtsProvider,
    ttsAccent,
    setTtsAccent,
    ttsVoice,
    setTtsVoice,
    ttsSpeed,
    setTtsSpeed,
    hearingIdx,
    ttsLoading,
    ttsPlaying,
    isRecording,
    sonioxError,
    turns,
    coachLoading,
    showShortcuts,
    setShowShortcuts,
    showTtsSettings,
    setShowTtsSettings,
    overallScore,
    hasTurns: turns.length > 0,
    activeSentenceAudioUrl,
    autoPronounceSentence,
    setAutoPronounceSentence,
    loopSentence,
    setLoopSentence,
    handleLoadScript,
    goToSentenceIdx,
    onToggleRecording,
    onListenAIVoice,
    onPrevSentence,
    onNextSentence,
    onClearSession,
  };
}

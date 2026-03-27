"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type KeyboardEvent,
  type FormEvent,
} from "react";
import YouTube, { type YouTubeEvent } from "react-youtube";
import {
  Volume2,
  VolumeX,
  Mic,
  Square,
  Trash2,
  Loader2,
  SkipBack,
  SkipForward,
  Repeat2,
  BookmarkPlus,
  BookmarkX,
  ChevronRight,
  Lightbulb,
  PlayCircle,
} from "lucide-react";
import clsx from "clsx";
import useSoniox from "@/hooks/useSoniox";
import { useTTS } from "@/hooks/useTTS";

// ─── Types ───────────────────────────────────────────────────────────────────

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  setPlaybackRate(rate: number): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
}

type SpeakingReview = {
  original_transcript: string;
  corrected_version: string;
  explanation: string;
  better_alternatives: string[];
};

type ShadowTurn = {
  id: string;
  text: string;
  feedback: string | null;
  review: SpeakingReview | null;
  timestamp: number;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractVideoId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
  );
  return m ? m[1] : null;
}

function extractReview(raw: string): SpeakingReview | null {
  try {
    const m = raw.match(/```review\s*([\s\S]*?)\s*```/i);
    if (!m) return null;
    return JSON.parse(m[1].trim()) as SpeakingReview;
  } catch {
    return null;
  }
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

let _turnId = 0;
function newId() {
  return `turn-${++_turnId}-${Date.now()}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ReviewCard({ review }: { review: SpeakingReview }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-2 rounded-xl border border-indigo-100 bg-indigo-50/60 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-100/40 transition-colors"
      >
        <span className="flex items-center gap-1.5">
          <Lightbulb size={11} /> Review &amp; Corrections
        </span>
        <ChevronRight
          size={12}
          className={clsx(
            "text-indigo-400 transition-transform",
            open && "rotate-90",
          )}
        />
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-red-500 font-semibold mb-1">
                You said
              </p>
              <p className="text-xs text-gray-700 bg-white rounded-lg px-2.5 py-1.5 border border-red-100 leading-relaxed">
                {review.original_transcript}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-green-600 font-semibold mb-1">
                Better version
              </p>
              <p className="text-xs text-gray-800 bg-white rounded-lg px-2.5 py-1.5 border border-green-100 font-medium leading-relaxed">
                {review.corrected_version}
              </p>
            </div>
          </div>
          {review.explanation && (
            <p className="text-xs text-gray-600 leading-relaxed">
              {review.explanation}
            </p>
          )}
          {review.better_alternatives?.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">
                Alternatives
              </p>
              <div className="flex flex-wrap gap-1.5">
                {review.better_alternatives.map((alt, i) => (
                  <span
                    key={i}
                    className="text-xs bg-white border border-indigo-100 text-indigo-700 rounded-full px-2 py-0.5"
                  >
                    {alt}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ShadowingClient() {
  // ── URL / Video ────────────────────────────────────────────────────────────
  const [urlInput, setUrlInput] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [urlError, setUrlError] = useState("");

  const playerRef = useRef<YTPlayer | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1.0);

  // ── A-B Loop ───────────────────────────────────────────────────────────────
  const [loopA, setLoopA] = useState<number | null>(null);
  const [loopB, setLoopB] = useState<number | null>(null);
  const [loopEnabled, setLoopEnabled] = useState(false);
  const loopTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── TTS Practice ──────────────────────────────────────────────────────────
  const [ttsText, setTtsText] = useState("");
  const [ttsVoice, setTtsVoice] = useState("en-US-Neural2-F");
  const [ttsSpeed, setTtsSpeed] = useState(1.0);
  const {
    speak,
    stop: stopTTS,
    loading: ttsLoading,
    playing: ttsPlaying,
  } = useTTS();

  // ── Shadow Practice ────────────────────────────────────────────────────────
  const [turns, setTurns] = useState<ShadowTurn[]>([]);
  const [coachLoading, setCoachLoading] = useState(false);
  const historyRef = useRef<{ role: string; content: string }[]>([]);
  const turnsBottomRef = useRef<HTMLDivElement | null>(null);

  // ── Soniox STT ─────────────────────────────────────────────────────────────
  const handleSilence = useCallback(
    async (transcript: string) => {
      const text = transcript.trim();
      if (!text) return;

      const turnId = newId();
      setTurns((prev) => [
        ...prev,
        {
          id: turnId,
          text,
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
            topic: videoTitle || "English shadowing practice",
          }),
        });
        const data = (await res.json()) as { reply?: string; error?: string };
        const reply = data.reply ?? "";
        const review = extractReview(reply);
        const feedbackText = reply.replace(/```review[\s\S]*?```/gi, "").trim();

        historyRef.current.push({ role: "assistant", content: reply });
        setTurns((prev) =>
          prev.map((t) =>
            t.id === turnId ? { ...t, feedback: feedbackText, review } : t,
          ),
        );
      } catch (err) {
        console.error("[shadow coach]", err);
        setTurns((prev) =>
          prev.map((t) =>
            t.id === turnId
              ? { ...t, feedback: "⚠ Failed to get feedback." }
              : t,
          ),
        );
      } finally {
        setCoachLoading(false);
      }
    },
    [videoTitle],
  );

  const {
    start: startSoniox,
    stop: stopSoniox,
    isRecording,
    partial,
    error: sonioxError,
  } = useSoniox({
    onSilence: handleSilence,
    silenceMs: 2000,
    silenceThreshold: -50,
    source: "mic",
  });

  const startRef = useRef(startSoniox);
  const stopRef = useRef(stopSoniox);
  useEffect(() => {
    startRef.current = startSoniox;
    stopRef.current = stopSoniox;
  });
  useEffect(() => () => stopRef.current(), []);

  // ── A-B Loop logic ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (loopTimerRef.current) clearInterval(loopTimerRef.current);
    if (loopEnabled && loopA !== null && loopB !== null) {
      loopTimerRef.current = setInterval(() => {
        const t = playerRef.current?.getCurrentTime() ?? 0;
        if (t >= loopB) playerRef.current?.seekTo(loopA, true);
      }, 150);
    }
    return () => {
      if (loopTimerRef.current) clearInterval(loopTimerRef.current);
    };
  }, [loopEnabled, loopA, loopB]);

  // ── Auto-scroll shadow turns ───────────────────────────────────────────────
  useEffect(() => {
    setTimeout(
      () => turnsBottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      50,
    );
  }, [turns]);

  // ── Handlers ──────────────────────────────────────────────────────────────
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
    setLoopA(null);
    setLoopB(null);
    setLoopEnabled(false);
  }

  function handlePlayerReady(event: YouTubeEvent) {
    playerRef.current = event.target as unknown as YTPlayer;
    playerRef.current.setPlaybackRate(playbackRate);
    // Try to get title from YouTube data attribute
    const title = (event.target as { videoTitle?: string }).videoTitle ?? "";
    if (title) setVideoTitle(title);
  }

  function handleRateChange(rate: number) {
    setPlaybackRate(rate);
    playerRef.current?.setPlaybackRate(rate);
  }

  function handleSeek(delta: number) {
    if (!playerRef.current) return;
    const cur = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(cur + delta, true);
  }

  function handleSetLoopA() {
    const t = playerRef.current?.getCurrentTime() ?? 0;
    setLoopA(Math.floor(t * 10) / 10);
    if (loopEnabled) setLoopEnabled(false);
  }

  function handleSetLoopB() {
    const t = playerRef.current?.getCurrentTime() ?? 0;
    setLoopB(Math.floor(t * 10) / 10);
  }

  function handleToggleLoop() {
    if (loopA === null || loopB === null) return;
    if (loopA >= loopB) return;
    setLoopEnabled((v) => {
      if (!v) playerRef.current?.seekTo(loopA, true);
      return !v;
    });
  }

  function handleClearLoop() {
    setLoopEnabled(false);
    setLoopA(null);
    setLoopB(null);
  }

  function handleTTSSubmit(e?: FormEvent) {
    e?.preventDefault();
    if (ttsPlaying) {
      stopTTS();
    } else {
      void speak(ttsText, ttsVoice, ttsSpeed);
    }
  }

  function handleTTSKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      void speak(ttsText, ttsVoice, ttsSpeed);
    }
  }

  function handleShadowToggle() {
    if (isRecording) {
      stopRef.current();
    } else {
      startRef.current({ source: "mic" });
    }
  }

  function handleClearTurns() {
    setTurns([]);
    historyRef.current = [];
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Shadowing Lab</h1>
        <p className="text-sm text-gray-500 mt-1">
          Shadow native speakers, practice phrases with TTS, and get AI feedback
          on your pronunciation.
        </p>
      </div>

      {/* URL Input */}
      <form onSubmit={handleLoadVideo} className="flex gap-2 items-start">
        <div className="flex-1">
          <input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste a YouTube URL…  e.g. https://youtube.com/watch?v=dQw4w9WgXcQ"
            className={clsx(
              "w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors",
              urlError
                ? "border-red-300 bg-red-50 focus:border-red-400"
                : "border-gray-200 bg-white focus:border-indigo-300",
            )}
          />
          {urlError && (
            <p className="text-xs text-red-500 mt-1 pl-1">{urlError}</p>
          )}
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap"
        >
          Load Video
        </button>
      </form>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ── Left: Video player ────────────────────────────────────────────── */}
        <div className="lg:col-span-3 space-y-4">
          {/* Embed */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            {videoId ? (
              <div className="aspect-video w-full">
                <YouTube
                  videoId={videoId}
                  opts={{
                    width: "100%",
                    height: "100%",
                    playerVars: { autoplay: 1, rel: 0, modestbranding: 1 },
                  }}
                  onReady={handlePlayerReady}
                  className="w-full h-full"
                  iframeClassName="w-full h-full"
                />
              </div>
            ) : (
              <div className="aspect-video w-full flex flex-col items-center justify-center bg-gray-50 text-gray-400 gap-3">
                <PlayCircle size={48} strokeWidth={1} />
                <p className="text-sm">Enter a YouTube URL above to start</p>
              </div>
            )}
          </div>

          {/* Controls */}
          {videoId && (
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm space-y-4">
              {/* Speed */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Playback Speed
                </p>
                <div className="flex gap-2 flex-wrap">
                  {[0.5, 0.75, 1.0, 1.25, 1.5].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handleRateChange(rate)}
                      className={clsx(
                        "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                        playbackRate === rate
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                          : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600",
                      )}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Seek */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSeek(-10)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:border-indigo-300 hover:text-indigo-600 transition-all"
                >
                  <SkipBack size={13} /> 10s
                </button>
                <button
                  onClick={() => handleSeek(-5)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:border-indigo-300 hover:text-indigo-600 transition-all"
                >
                  <SkipBack size={13} /> 5s
                </button>
                <button
                  onClick={() => handleSeek(5)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:border-indigo-300 hover:text-indigo-600 transition-all"
                >
                  <SkipForward size={13} /> 5s
                </button>
                <button
                  onClick={() => handleSeek(10)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:border-indigo-300 hover:text-indigo-600 transition-all"
                >
                  <SkipForward size={13} /> 10s
                </button>
              </div>

              {/* A-B Loop */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  A-B Loop
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleSetLoopA}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-lg transition-all border-gray-200 hover:border-indigo-300 hover:text-indigo-600 text-gray-600"
                  >
                    <BookmarkPlus size={13} />
                    {loopA !== null ? (
                      <span>
                        A:{" "}
                        <span className="font-mono">{formatTime(loopA)}</span>
                      </span>
                    ) : (
                      "Set A"
                    )}
                  </button>
                  <button
                    onClick={handleSetLoopB}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-lg transition-all border-gray-200 hover:border-indigo-300 hover:text-indigo-600 text-gray-600"
                  >
                    <BookmarkPlus size={13} />
                    {loopB !== null ? (
                      <span>
                        B:{" "}
                        <span className="font-mono">{formatTime(loopB)}</span>
                      </span>
                    ) : (
                      "Set B"
                    )}
                  </button>
                  <button
                    onClick={handleToggleLoop}
                    disabled={
                      loopA === null || loopB === null || loopA >= loopB
                    }
                    className={clsx(
                      "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border rounded-lg transition-all",
                      loopEnabled
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                        : "border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed",
                    )}
                  >
                    <Repeat2 size={13} />
                    {loopEnabled ? "Looping" : "Loop"}
                  </button>
                  {(loopA !== null || loopB !== null) && (
                    <button
                      onClick={handleClearLoop}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-200 rounded-lg transition-all"
                    >
                      <BookmarkX size={13} /> Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Practice tools ─────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          {/* ── TTS Practice ──────────────────────────────────────────────── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                <Volume2 size={14} className="text-emerald-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  Text-to-Speech
                </h2>
                <p className="text-xs text-gray-400">
                  Type any phrase to hear it spoken
                </p>
              </div>
            </div>

            <form onSubmit={handleTTSSubmit} className="space-y-3">
              <textarea
                value={ttsText}
                onChange={(e) => setTtsText(e.target.value)}
                onKeyDown={handleTTSKey}
                placeholder="Type a phrase or sentence to practice…"
                rows={3}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl resize-none outline-none focus:border-indigo-300 transition-colors placeholder:text-gray-300"
              />

              {/* Voice & Speed selectors */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">
                    Voice
                  </p>
                  <select
                    value={ttsVoice}
                    onChange={(e) => setTtsVoice(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-indigo-300 bg-white"
                  >
                    <option value="en-US-Neural2-F">Female (Neural2-F)</option>
                    <option value="en-US-Neural2-C">Female (Neural2-C)</option>
                    <option value="en-US-Neural2-J">Male (Neural2-J)</option>
                    <option value="en-US-Neural2-A">Male (Neural2-A)</option>
                    <option value="en-US-Neural2-D">Male (Neural2-D)</option>
                  </select>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">
                    Speed
                  </p>
                  <select
                    value={ttsSpeed}
                    onChange={(e) => setTtsSpeed(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-indigo-300 bg-white"
                  >
                    <option value={0.6}>0.6x — Very slow</option>
                    <option value={0.75}>0.75x — Slow</option>
                    <option value={0.9}>0.9x — Normal-</option>
                    <option value={1.0}>1.0x — Normal</option>
                    <option value={1.15}>1.15x — Fast</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={!ttsText.trim() || ttsLoading}
                className={clsx(
                  "w-full py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all",
                  ttsPlaying
                    ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 disabled:cursor-not-allowed",
                )}
              >
                {ttsLoading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : ttsPlaying ? (
                  <VolumeX size={14} />
                ) : (
                  <Volume2 size={14} />
                )}
                {ttsLoading ? "Loading…" : ttsPlaying ? "Stop" : "Speak  (⌘↵)"}
              </button>
            </form>
          </div>

          {/* ── Shadow Practice ───────────────────────────────────────────── */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                  <Mic size={14} className="text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">
                    Shadow Practice
                  </h2>
                  <p className="text-xs text-gray-400">
                    Record yourself — get AI feedback
                  </p>
                </div>
              </div>
              {turns.length > 0 && (
                <button
                  onClick={handleClearTurns}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                  title="Clear history"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            {/* Turns */}
            <div
              className="flex-1 overflow-y-auto px-4 py-3 space-y-4"
              style={{ minHeight: "180px", maxHeight: "380px" }}
            >
              {turns.length === 0 && !isRecording && (
                <div className="flex flex-col items-center justify-center h-28 text-center text-gray-300 gap-2">
                  <Mic size={32} strokeWidth={1} />
                  <p className="text-xs">
                    Press record, say something to shadow, and get feedback on
                    your pronunciation.
                  </p>
                </div>
              )}

              {turns.map((turn) => (
                <div key={turn.id} className="space-y-1">
                  {/* User speech bubble */}
                  <div className="flex justify-end">
                    <div className="max-w-[88%] bg-indigo-600 text-white rounded-2xl rounded-tr-sm px-3 py-2 text-sm leading-relaxed">
                      {turn.text}
                    </div>
                  </div>

                  {/* Coach feedback */}
                  {turn.feedback === null && coachLoading ? (
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 pl-1">
                      <Loader2 size={11} className="animate-spin" /> Thinking…
                    </div>
                  ) : turn.feedback ? (
                    <div className="max-w-[92%]">
                      <div className="text-sm text-gray-700 bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-3 py-2 leading-relaxed whitespace-pre-wrap">
                        {turn.feedback}
                      </div>
                      {turn.review && <ReviewCard review={turn.review} />}
                    </div>
                  ) : null}
                </div>
              ))}

              {/* Live partial transcript */}
              {isRecording && partial && (
                <div className="flex justify-end">
                  <div className="max-w-[88%] bg-indigo-100 text-indigo-700 rounded-2xl rounded-tr-sm px-3 py-2 text-sm italic opacity-70">
                    {partial}…
                  </div>
                </div>
              )}

              <div ref={turnsBottomRef} />
            </div>

            {/* Error */}
            {sonioxError && (
              <div className="px-4 py-2 bg-red-50 border-t border-red-100 text-xs text-red-600">
                {sonioxError}
              </div>
            )}

            {/* Record control */}
            <div className="px-4 py-3 border-t border-gray-100">
              <button
                onClick={handleShadowToggle}
                className={clsx(
                  "w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all",
                  isRecording
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white",
                )}
              >
                {isRecording ? (
                  <>
                    <Square size={14} className="fill-white" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic size={14} />
                    Start Recording
                  </>
                )}
              </button>
              {isRecording && (
                <p className="text-center text-xs text-gray-400 mt-1.5">
                  🎙 Listening — will auto-submit after silence…
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

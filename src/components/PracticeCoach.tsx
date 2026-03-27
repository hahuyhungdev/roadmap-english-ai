import { useRef, useState } from "react";
import useSoniox from "../hooks/useSoniox";
import { Mic, Square, X, ChevronDown, Upload } from "lucide-react";

interface PracticeCoachProps {
  lessonTitle?: string;
  lessonContent?: string;
}

export default function PracticeCoach({
  lessonTitle,
  lessonContent,
}: PracticeCoachProps) {
  function getErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    if (
      typeof err === "object" &&
      err !== null &&
      "message" in err &&
      typeof (err as { message: unknown }).message === "string"
    ) {
      return (err as { message: string }).message;
    }
    return String(err);
  }

  async function callCoach(text: string) {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: text.trim(),
          topic: lessonTitle || undefined,
          history: [],
          lessonContent: lessonContent || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Coach API failed");
      setReply(data.reply || "");
      setFinalTranscript(text.trim());
      if (data.audioContent) {
        const audio = `data:audio/mp3;base64,${data.audioContent}`;
        if (audioRef.current) {
          audioRef.current.src = audio;
          audioRef.current.play().catch(() => {});
        }
      }
    } catch (err) {
      console.error(err);
      alert(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  const { start, stop, isRecording, transcript, partial, error } = useSoniox({
    onSilence: callCoach,
    silenceMs: 2500,
    silenceThreshold: -50,
  });

  const [finalTranscript, setFinalTranscript] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [testText, setTestText] = useState("");
  const [fileStatus, setFileStatus] = useState<"idle" | "ready" | "error">("idle");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setFileStatus("idle");

    // Clean up previous object URL
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setFileStatus("ready");

    // Attach to hidden audio element for playback
    if (audioElRef.current) {
      audioElRef.current.src = url;
      audioElRef.current.load();
    }
  }

  async function startWithFile() {
    if (!audioElRef.current || fileStatus !== "ready") return;
    try {
      const stream = (audioElRef.current as HTMLAudioElement & {
        captureStream: () => MediaStream;
      }).captureStream();
      await start({ stream });
      audioElRef.current.play().catch(() => {});
    } catch (e) {
      alert(`Cannot start: ${getErrorMessage(e)}`);
    }
  }

  return (
    <>
      {isExpanded && (
        <div className="fixed top-4 right-4 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-40 flex flex-col max-h-96">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
            <div className="flex items-center gap-2">
              <Mic size={16} className="text-indigo-600" />
              <span className="text-sm font-semibold text-gray-900">
                Speaking Lab
              </span>
              {isRecording && (
                <span className="flex items-center gap-1 text-xs text-red-500 font-medium">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                  Listening
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ChevronDown size={16} />
              </button>
              <button
                onClick={() => {
                  if (isRecording) stop();
                  audioElRef.current?.pause();
                  setFinalTranscript("");
                  setReply("");
                  setFileStatus("idle");
                  setFileName("");
                  if (objectUrlRef.current) {
                    URL.revokeObjectURL(objectUrlRef.current);
                    objectUrlRef.current = null;
                  }
                }}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {/* File Upload */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
                id="audio-file-upload"
              />
              <label
                htmlFor="audio-file-upload"
                className={`flex items-center gap-2 w-full px-3 py-2 border rounded-lg cursor-pointer text-xs font-medium transition-colors ${
                  fileStatus === "ready"
                    ? "border-green-400 bg-green-50 text-green-700"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Upload size={13} />
                {fileName || "Upload audio file (MP3, WAV, M4A...)"}
              </label>
            </div>

            {/* Control Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => start({ source: "mic" })}
                disabled={isRecording}
                className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-2 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Mic size={13} /> Mic
              </button>
              <button
                onClick={startWithFile}
                disabled={isRecording || fileStatus !== "ready"}
                className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-2 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title={fileStatus !== "ready" ? "Upload an audio file first" : "Play audio file and transcribe"}
              >
                <Upload size={13} /> File
              </button>
              <button
                onClick={() => {
                  stop();
                  audioElRef.current?.pause();
                  const text =
                    (transcript || "") + (partial ? ` ${partial}` : "");
                  const trimmed = text.trim();
                  if (trimmed) callCoach(trimmed);
                }}
                disabled={!isRecording}
                className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-2 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Square size={13} /> Done
              </button>
            </div>

            {/* Test text */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Test: type any English sentence here..."
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && testText.trim()) {
                    callCoach(testText.trim());
                    setTestText("");
                  }
                }}
                className="flex-1 text-xs px-2 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-400"
              />
              <button
                onClick={() => {
                  if (testText.trim()) {
                    callCoach(testText.trim());
                    setTestText("");
                  }
                }}
                className="px-2 py-1.5 bg-orange-500 text-white text-xs font-medium rounded hover:bg-orange-600 transition-colors"
              >
                Send
              </button>
            </div>

            {error && (
              <div className="text-xs text-red-500 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            {/* Real-time partial transcript */}
            {partial && (
              <div className="p-2 bg-yellow-50 border border-yellow-300 rounded-lg">
                <p className="text-xs text-yellow-600 font-semibold mb-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                  Live
                </p>
                <p className="text-sm text-gray-900 font-medium leading-relaxed">
                  {partial}
                </p>
              </div>
            )}

            {/* Confirmed transcript */}
            {finalTranscript && (
              <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-600 font-semibold mb-1">
                  Transcript
                </p>
                <p className="text-xs text-gray-800 leading-relaxed">
                  {finalTranscript}
                </p>
              </div>
            )}

            {/* Coach Response */}
            {loading && (
              <div className="text-xs text-gray-500 animate-pulse text-center py-2">
                Coach thinking...
              </div>
            )}

            {reply && (
              <div className="p-2 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-600 font-semibold mb-1">
                  Coach feedback:
                </p>
                <p className="text-xs text-gray-800 leading-relaxed">{reply}</p>
                <audio ref={audioRef} className="mt-2 w-full h-6" controls />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Collapsed State */}
      {!isExpanded && (
        <div className="fixed bottom-4 right-4 z-40">
          <button
            onClick={() => setIsExpanded(true)}
            className="p-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
            title="Open Speaking Lab"
          >
            <Mic size={20} />
          </button>
        </div>
      )}

      {/* Hidden audio — used for file stream capture */}
      <audio ref={audioElRef} style={{ display: "none" }} />
      {/* Coach TTS audio */}
      <audio ref={audioRef} />
    </>
  );
}

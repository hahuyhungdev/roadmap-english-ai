import { useEffect, useRef, useState } from "react";

type UseSonioxResult = {
  start: () => Promise<void>;
  stop: () => void;
  isRecording: boolean;
  transcript: string; // final confirmed transcript
  partial: string; // live partial transcript
  error?: string;
};

// NOTE: Soniox streaming protocol details may vary. This hook provides a
// best-effort generic WebSocket streaming client that sends MediaRecorder
// audio blobs (webm) as base64 frames and listens for JSON messages with
// { partial, transcript } fields from the server. Adjust the server URL
// and message format to match Soniox spec.

export default function useSoniox(): UseSonioxResult {
  function getErrorMessage(err: unknown): string {
    if (
      err &&
      typeof err === "object" &&
      "message" in err &&
      typeof (err as any).message === "string"
    ) {
      return (err as any).message;
    }
    return String(err);
  }
  const wsRef = useRef<WebSocket | null>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [partial, setPartial] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);

  const SONIOX_WS =
    (import.meta.env.VITE_SONIOX_WS_URL as string) ||
    "wss://api.soniox.com/v1/stream";
  const API_KEY = (import.meta.env.VITE_SONIOX_API_KEY as string) || "";

  function stop() {
    try {
      if (mediaRef.current && mediaRef.current.state !== "inactive")
        mediaRef.current.stop();
    } catch (err) {
      console.warn("stop media error", err);
    }
    try {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    } catch (err) {
      console.warn("stop tracks error", err);
    }
    try {
      wsRef.current?.close();
    } catch (err) {
      console.warn("ws close error", err);
    }
    setIsRecording(false);
  }

  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  async function start() {
    setError(undefined);
    if (isRecording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const wsUrl = API_KEY
        ? `${SONIOX_WS}?api_key=${encodeURIComponent(API_KEY)}`
        : SONIOX_WS;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        // Start media recorder and send audio chunks
        const options: MediaRecorderOptions = { mimeType: "audio/webm" };
        const mr = new MediaRecorder(stream, options);
        mediaRef.current = mr;

        mr.ondataavailable = async (ev) => {
          if (!ev.data || ev.data.size === 0) return;
          try {
            const arr = await ev.data.arrayBuffer();
            const b64 = btoa(String.fromCharCode(...new Uint8Array(arr)));
            const msg = JSON.stringify({ type: "audio", data: b64 });
            ws.send(msg);
          } catch (err) {
            console.warn("Failed to send audio chunk", err);
          }
        };

        mr.onstop = () => {
          // notify end of stream
          try {
            ws.send(JSON.stringify({ type: "eof" }));
          } catch (err) {
            console.warn("Failed to send eof", err);
          }
        };

        mr.start(250);
        setIsRecording(true);
      };

      ws.onmessage = (ev) => {
        try {
          const d = JSON.parse(ev.data);
          if (d.partial) setPartial(d.partial);
          if (d.transcript) {
            setTranscript((prev) =>
              prev ? `${prev}\n${d.transcript}` : d.transcript,
            );
            setPartial("");
          }
        } catch (err) {
          // ignore non-json messages
          console.debug("Non-JSON ws message", err);
        }
      };

      ws.onerror = () => {
        setError("WebSocket error");
      };

      ws.onclose = () => {
        setIsRecording(false);
      };
    } catch (err) {
      setError(getErrorMessage(err));
      setIsRecording(false);
    }
  }

  return { start, stop, isRecording, transcript, partial, error };
}

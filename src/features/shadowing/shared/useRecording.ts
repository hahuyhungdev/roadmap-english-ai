"use client";

import { useRef, useCallback } from "react";

/**
 * Shared recording logic for both Script and YouTube modes
 * Handles MediaRecorder setup, audio blob creation, and cleanup
 */
export function useRecording(
  onAudioUrl: (url: string) => void,
  onStartRecording: () => void,
) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const blobUrlsRef = useRef<string[]>([]);

  // Cleanup: Revoke all blob URLs on unmount
  const cleanup = useCallback(() => {
    blobUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  const startRecording = useCallback(async () => {
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "";

      const mr = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        blobUrlsRef.current.push(url);
        onAudioUrl(url);
      };

      mr.start(250);
      mediaRecorderRef.current = mr;
      onStartRecording();
    } catch {
      // Mic permission denied — STT will still work without audio replay
    }
  }, [onAudioUrl, onStartRecording]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  return {
    mediaRecorderRef,
    startRecording,
    stopRecording,
    cleanup,
  };
}

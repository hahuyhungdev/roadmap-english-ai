"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { $api } from "@/lib/api/client";
import { extractSessionSlug, formatSavedTime } from "./utils";

const AUTOSAVE_DELAY_MS = 1000;

export function useNotePanel() {
  const [opened, setOpened] = useState(false);
  const [content, setContent] = useState("");
  const [lastSavedContent, setLastSavedContent] = useState("");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const pathname = usePathname();

  const sessionSlug = extractSessionSlug(pathname ?? "");
  const contentRef = useRef(content);
  const lastSavedContentRef = useRef(lastSavedContent);
  const sessionSlugRef = useRef<string | null>(sessionSlug);
  const loadedSessionRef = useRef<string | null>(null);
  const saveQueueRef = useRef(new Map<string, string>());
  const isProcessingSaveRef = useRef(false);

  const noteQuery = $api.useQuery(
    "get",
    "/api/lesson-notes",
    { params: { query: { sessionSlug: sessionSlug ?? "" } } },
    { enabled: Boolean(sessionSlug && opened), staleTime: 0 },
  );

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  useEffect(() => {
    lastSavedContentRef.current = lastSavedContent;
  }, [lastSavedContent]);

  const saveMutation = $api.useMutation("put", "/api/lesson-notes");

  const processSaveQueue = useCallback(async () => {
    if (isProcessingSaveRef.current) return;

    const next = saveQueueRef.current.entries().next().value as
      | [string, string]
      | undefined;
    if (!next) return;

    const [queuedSessionSlug, queuedContent] = next;
    saveQueueRef.current.delete(queuedSessionSlug);
    isProcessingSaveRef.current = true;

    try {
      const savedNote = await saveMutation.mutateAsync({
        body: {
          sessionSlug: queuedSessionSlug,
          content: queuedContent,
        },
      });

      if (sessionSlugRef.current === queuedSessionSlug) {
        setLastSavedContent(queuedContent);
        setLastSavedAt(savedNote.updatedAt ?? new Date().toISOString());
      }
    } catch (err) {
      console.error("[NotePanel] Failed to save lesson note", err);
    } finally {
      isProcessingSaveRef.current = false;
      void processSaveQueue();
    }
  }, [saveMutation]);

  const queueSave = useCallback(
    (queuedSessionSlug: string | null, queuedContent: string) => {
      if (!queuedSessionSlug) return;
      saveQueueRef.current.set(queuedSessionSlug, queuedContent);
      void processSaveQueue();
    },
    [processSaveQueue],
  );

  const queueCurrentSave = useCallback(() => {
    const currentSessionSlug = sessionSlugRef.current;
    const currentContent = contentRef.current;

    if (!currentSessionSlug || currentContent === lastSavedContentRef.current) {
      return;
    }

    queueSave(currentSessionSlug, currentContent);
  }, [queueSave]);

  useEffect(() => {
    const previousSessionSlug = sessionSlugRef.current;

    if (previousSessionSlug && previousSessionSlug !== sessionSlug) {
      const previousContent = contentRef.current;
      if (previousContent !== lastSavedContentRef.current) {
        queueSave(previousSessionSlug, previousContent);
      }
    }

    sessionSlugRef.current = sessionSlug;

    if (!sessionSlug) {
      loadedSessionRef.current = null;
      setContent("");
      setLastSavedContent("");
      setLastSavedAt(null);
      return;
    }

    if (loadedSessionRef.current !== sessionSlug) {
      setContent("");
      setLastSavedContent("");
      setLastSavedAt(null);
    }
  }, [queueSave, sessionSlug]);

  useEffect(() => {
    if (!sessionSlug || loadedSessionRef.current === sessionSlug) return;
    if (!noteQuery.data) return;

    const loadedContent = noteQuery.data.content ?? "";
    loadedSessionRef.current = sessionSlug;
    setContent(loadedContent);
    setLastSavedContent(loadedContent);
    setLastSavedAt(noteQuery.data.updatedAt ?? null);
  }, [noteQuery.data, sessionSlug]);

  const isDirty = Boolean(sessionSlug) && content !== lastSavedContent;

  const statusText = !sessionSlug
    ? "Open a lesson page to start notes"
    : noteQuery.isPending
      ? "Loading..."
      : noteQuery.isError
        ? "Failed to load note"
        : saveMutation.isPending
          ? "Saving..."
          : saveMutation.isError
            ? "Failed to save note"
            : isDirty
              ? "Unsaved changes"
              : formatSavedTime(lastSavedAt);

  const handleSave = async () => {
    queueCurrentSave();
  };

  useEffect(() => {
    if (!opened || !sessionSlug || !isDirty || noteQuery.isPending) return;

    const timeoutId = window.setTimeout(() => {
      queueCurrentSave();
    }, AUTOSAVE_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [
    content,
    isDirty,
    noteQuery.isPending,
    opened,
    queueCurrentSave,
    sessionSlug,
  ]);

  useEffect(() => {
    if (!opened) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        queueCurrentSave();
      }
    };

    const handleBeforeUnload = () => {
      queueCurrentSave();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [opened, queueCurrentSave]);

  const close = () => {
    queueCurrentSave();
    setOpened(false);
  };

  const toggleOpen = () => {
    if (opened) {
      close();
      return;
    }

    setOpened(true);
  };

  return {
    opened,
    toggleOpen,
    close,
    sessionSlug,
    content,
    setContent,
    isDirty,
    statusText,
    isError: noteQuery.isError || saveMutation.isError,
    isLoading: noteQuery.isPending,
    isSaving: saveMutation.isPending,
    handleSave,
  };
}

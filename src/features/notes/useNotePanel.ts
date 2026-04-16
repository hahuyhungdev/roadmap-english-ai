"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { $api } from "@/lib/api/client";
import { extractSessionSlug, formatSavedTime } from "./utils";

export function useNotePanel() {
  const [opened, setOpened] = useState(false);
  const [content, setContent] = useState("");
  const pathname = usePathname();

  const sessionSlug = extractSessionSlug(pathname ?? "");

  const noteQuery = $api.useQuery(
    "get",
    "/api/lesson-notes",
    { params: { query: { sessionSlug: sessionSlug ?? "" } } },
    { enabled: Boolean(sessionSlug && opened), staleTime: 0 },
  );

  useEffect(() => {
    if (!sessionSlug) {
      setContent("");
      return;
    }
    if (noteQuery.data) {
      setContent(noteQuery.data.content ?? "");
    }
  }, [sessionSlug, noteQuery.data]);

  const saveMutation = $api.useMutation("put", "/api/lesson-notes", {
    onSuccess: async () => {
      await noteQuery.refetch();
    },
  });

  const serverContent = noteQuery.data?.content ?? "";
  const isDirty = Boolean(sessionSlug) && content !== serverContent;

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
              : formatSavedTime(noteQuery.data?.updatedAt ?? null);

  const handleSave = async () => {
    if (!sessionSlug || !isDirty || saveMutation.isPending) return;
    try {
      await saveMutation.mutateAsync({ body: { sessionSlug, content } });
    } catch (err) {
      console.error("[NotePanel] Failed to save lesson note", err);
    }
  };

  const toggleOpen = () => setOpened((o) => !o);
  const close = () => setOpened(false);

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

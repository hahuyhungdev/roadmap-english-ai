"use client";

import {
  ActionIcon,
  Affix,
  Tooltip,
  Paper,
  CloseButton,
  Group,
  Text,
  Textarea,
} from "@mantine/core";
import { NotebookPen, GripHorizontal, Save } from "lucide-react";
import { useViewportSize } from "@mantine/hooks";
import { Rnd } from "react-rnd";
import { useNotePanel } from "./useNotePanel";

export default function NotePanel() {
  const { width, height } = useViewportSize();
  const {
    opened,
    toggleOpen,
    close,
    sessionSlug,
    content,
    setContent,
    isDirty,
    statusText,
    isError,
    isLoading,
    isSaving,
    handleSave,
  } = useNotePanel();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      void handleSave();
    }
  };

  const panelDefaultWidth = 360;
  const panelDefaultHeight =
    height > 0 ? Math.max(400, Math.min(600, height - 48)) : 480;

  return (
    <>
      <Affix
        position={{ top: "50%", right: 20 }}
        zIndex={100}
        style={{ transform: "translateY(-50%)" }}
      >
        <Tooltip label="Take Notes" position="left">
          <ActionIcon
            size="xl"
            radius="xl"
            variant="filled"
            color="blue"
            onClick={toggleOpen}
            style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
          >
            <NotebookPen size={24} />
          </ActionIcon>
        </Tooltip>
      </Affix>

      {opened && width > 0 && (
        <Rnd
          default={{
            x: Math.max(0, width - panelDefaultWidth - 24),
            y: Math.max(8, (height - panelDefaultHeight) / 2),
            width: panelDefaultWidth,
            height: panelDefaultHeight,
          }}
          minWidth={240}
          minHeight={300}
          bounds="window"
          dragHandleClassName="drag-handle"
          style={{ zIndex: 101, position: "fixed" }}
        >
          <Paper
            shadow="xl"
            radius="md"
            withBorder
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "100%",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <Group
              p="xs"
              style={{
                borderBottom: "1px solid var(--mantine-color-gray-3)",
                backgroundColor: "var(--mantine-color-gray-0)",
              }}
              justify="space-between"
              wrap="nowrap"
            >
              <Group
                gap="xs"
                className="drag-handle"
                style={{ cursor: "grab", flex: "1 1 auto", minWidth: 0 }}
                wrap="nowrap"
              >
                <GripHorizontal size={16} style={{ flex: "0 0 auto" }} />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flex: "1 1 auto",
                    minWidth: 0,
                  }}
                >
                  <Text size="md" fw={600} lh={1.2}>
                    My Notes
                  </Text>
                  <Text
                    size="md"
                    c={isError ? "red" : "dimmed"}
                    lh={1.2}
                    truncate
                  >
                    {sessionSlug ? `${sessionSlug} • ${statusText}` : statusText}
                  </Text>
                </div>
              </Group>

              <Group gap={4} wrap="nowrap" style={{ flex: "0 0 auto" }}>
                <Tooltip label="Save note" position="bottom">
                  <ActionIcon
                    size="lg"
                    variant="light"
                    color="blue"
                    aria-label="Save note"
                    onClick={() => void handleSave()}
                    loading={isSaving}
                    disabled={!sessionSlug || isLoading || !isDirty}
                  >
                    <Save size={16} />
                  </ActionIcon>
                </Tooltip>
                <CloseButton size="lg" onClick={close} />
              </Group>
            </Group>

            {/* Body */}
            <Textarea
              value={content}
              onChange={(e) => setContent(e.currentTarget.value)}
              onKeyDown={handleKeyDown}
              disabled={!sessionSlug || isLoading}
              placeholder={
                !sessionSlug
                  ? "Open a lesson page to start taking notes..."
                  : isLoading
                    ? "Loading notes..."
                    : "Write your notes here... (Ctrl+S to save)"
              }
              styles={{
                root: {
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  padding: "10px 12px",
                },
                wrapper: { flex: 1, display: "flex", flexDirection: "column" },
                input: {
                  flex: 1,
                  resize: "none",
                  fontSize: "14px",
                  border: "none",
                  outline: "none",
                },
              }}
            />
          </Paper>
        </Rnd>
      )}
    </>
  );
}

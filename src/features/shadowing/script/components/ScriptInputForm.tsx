"use client";

import {
  Textarea,
  Button,
  Text,
  Collapse,
  UnstyledButton,
} from "@mantine/core";
import { ChevronDown } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  error?: string;
  hasSentences: boolean;
  collapsed: boolean;
  onCollapse: () => void;
  onExpand: () => void;
}

export function ScriptInputForm({
  value,
  onChange,
  onSubmit,
  error,
  hasSentences,
  collapsed,
  onCollapse,
  onExpand,
}: Props) {
  if (hasSentences && collapsed) {
    return (
      <UnstyledButton
        onClick={onExpand}
        className="text-xs text-indigo-500 hover:text-indigo-700 flex items-center gap-1"
      >
        <ChevronDown size={12} />
        Edit script
      </UnstyledButton>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
        placeholder="Paste your script or text here…"
        autosize
        minRows={hasSentences ? 3 : 5}
        maxRows={10}
        error={error}
        styles={{
          input: {
            fontFamily: "inherit",
            fontSize: "0.875rem",
            lineHeight: "1.5",
            borderRadius: "0.75rem",
            borderColor: error ? undefined : "#e5e7eb",
          },
        }}
      />
      {
        error &&
          !error.includes("extract") &&
          null /* Mantine shows error under textarea */
      }
      <div className="flex gap-2">
        <Button
          type="submit"
          size="sm"
          variant="filled"
          color="violet"
          radius="xl"
        >
          {hasSentences ? "Reload Script" : "Process Script"}
        </Button>
        {hasSentences && (
          <Button
            type="button"
            size="sm"
            variant="subtle"
            color="gray"
            radius="xl"
            onClick={onCollapse}
          >
            Hide
          </Button>
        )}
      </div>
    </form>
  );
}

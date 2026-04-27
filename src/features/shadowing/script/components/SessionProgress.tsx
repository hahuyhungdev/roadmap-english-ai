"use client";

import { Progress, Group, TextInput, Button } from "@mantine/core";
import { useState, type KeyboardEvent } from "react";

interface Props {
  total: number;
  current: number; // 0-based active index
  onJump: (idx: number) => void;
}

export function SessionProgress({ total, current, onJump }: Props) {
  const progressPct =
    total > 0 ? Math.round(((current + 1) / total) * 100) : 0;

  const [jumpValue, setJumpValue] = useState("");

  function handleJump() {
    const n = parseInt(jumpValue, 10);
    if (!isNaN(n) && n >= 1 && n <= total) {
      onJump(n - 1);
      setJumpValue("");
    }
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleJump();
  }

  return (
    <div className="space-y-2">
      <Group justify="space-between" align="center" className="px-0.5">
        <Group gap="xs" align="center">
          <span className="text-base text-gray-500 font-medium">
            Sentence{" "}
            <span className="text-indigo-600 font-bold">{current + 1}</span>{" "}of{" "}
            <span className="font-semibold text-gray-700">{total}</span>
          </span>

          <div className="flex items-center gap-1">
            <TextInput
              type="number"
              min={1}
              max={total}
              value={jumpValue}
              onChange={(e) => setJumpValue(e.currentTarget.value)}
              onKeyDown={handleKey}
              placeholder="#"
              size="md"
              w={52}
              styles={{ input: { textAlign: "center" } }}
            />
            <Button
              onClick={handleJump}
              size="compact-md"
              variant="light"
              color="indigo"
            >
              Go
            </Button>
          </div>
        </Group>
      </Group>
      <Progress
        value={progressPct}
        size="md"
        radius="xl"
        color={progressPct === 100 ? "green" : "violet"}
      />
    </div>
  );
}

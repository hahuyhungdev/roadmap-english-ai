"use client";

import { Progress, Group } from "@mantine/core";
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
          <span className="text-xs text-gray-500 font-medium">
            Sentence{" "}
            <span className="text-indigo-600 font-bold">{current + 1}</span>{" "}of{" "}
            <span className="font-semibold text-gray-700">{total}</span>
          </span>

          <div className="flex items-center gap-1">
            <input
              type="number"
              min={1}
              max={total}
              value={jumpValue}
              onChange={(e) => setJumpValue(e.target.value)}
              onKeyDown={handleKey}
              placeholder="#"
              className="w-12 px-1.5 py-0.5 text-xs rounded-lg border border-gray-200 focus:border-indigo-400 focus:outline-none text-center"
            />
            <button
              onClick={handleJump}
              className="px-2 py-0.5 text-[11px] font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
            >
              Go
            </button>
          </div>
        </Group>
      </Group>
      <Progress
        value={progressPct}
        size="sm"
        radius="xl"
        color={progressPct === 100 ? "green" : "violet"}
      />
    </div>
  );
}

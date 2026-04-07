"use client";

import { useState, useRef, useEffect } from "react";
import { Settings2 } from "lucide-react";
import clsx from "clsx";
import { Select, Checkbox, NumberInput } from "@mantine/core";
import type { TTSProvider } from "../shared/types";
import { TTS_SPEEDS, EDGE_ACCENTS, GOOGLE_ACCENTS } from "../shared/constants";

interface Props {
  provider: TTSProvider;
  accent: string;
  speed: number;
  onProviderChange: (p: TTSProvider) => void;
  onAccentChange: (a: string) => void;
  onSpeedChange: (s: number) => void;
  /** Only shown for Script mode */
  autoPronounceSentence?: boolean;
  onAutoPronounceSentenceChange?: (v: boolean) => void;
  loopSentence?: boolean;
  onLoopSentenceChange?: (v: boolean) => void;
  /** Sentence splitting (Script mode only) */
  minSentenceLength?: number;
  onMinSentenceLengthChange?: (v: number) => void;
  maxSentenceLength?: number;
  onMaxSentenceLengthChange?: (v: number) => void;
}

/**
 * Self-contained TTS settings toggle + panel.
 * Controls its own open/closed state internally.
 */
export function TTSSettingsPanel({
  provider,
  accent,
  speed,
  onProviderChange,
  onAccentChange,
  onSpeedChange,
  autoPronounceSentence,
  onAutoPronounceSentenceChange,
  loopSentence,
  onLoopSentenceChange,
  minSentenceLength,
  onMinSentenceLengthChange,
  maxSentenceLength,
  onMaxSentenceLengthChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside the panel
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const accents = provider === "google" ? GOOGLE_ACCENTS : EDGE_ACCENTS;

  return (
    <div ref={panelRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        title="Voice settings"
        className={clsx(
          "w-7 h-7 flex items-center justify-center rounded-lg transition-colors",
          open
            ? "bg-indigo-100 text-indigo-600"
            : "text-gray-500 hover:text-indigo-600 hover:bg-gray-100",
        )}
      >
        <Settings2 size={14} />
      </button>

      {open && (
        <div className="bg-white absolute right-0 top-9 z-20 w-72 border border-gray-200 rounded-xl shadow-lg p-4">
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Voice Settings
          </p>

          {/* Provider */}
          <div className="mb-3">
            <label className="text-[10px] text-gray-500 block mb-1">
              TTS Provider
            </label>
            <div className="flex gap-1.5">
              {(["edge", "google"] as TTSProvider[]).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    onProviderChange(p);
                    // Reset accent to first option for new provider
                    const first =
                      p === "google"
                        ? GOOGLE_ACCENTS[0].value
                        : EDGE_ACCENTS[0].value;
                    onAccentChange(first);
                  }}
                  className={clsx(
                    "flex-1 py-1.5 text-xs rounded-lg border transition-colors font-medium",
                    provider === p
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : " text-gray-600 border-gray-200 hover:border-indigo-400",
                  )}
                >
                  {p === "edge" ? "Edge (Browser)" : "Google Cloud"}
                </button>
              ))}
            </div>
          </div>

          {/* Accent */}
          <div className="mb-3">
            <label className="text-[10px] text-gray-500 block mb-1">
              Accent
            </label>
            <Select
              value={accent}
              onChange={(v) => {
                if (v) onAccentChange(v);
              }}
              data={accents.map((a: { value: string; label: string }) => ({
                value: a.value,
                label: a.label,
              }))}
              size="xs"
              radius="md"
            />
          </div>

          {/* Speed */}
          <div className="mb-3">
            <label className="text-[10px] text-gray-500 block mb-1">
              Speed
            </label>
            <div className="flex gap-1">
              {TTS_SPEEDS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => onSpeedChange(s.value)}
                  className={clsx(
                    "flex-1 py-1 text-[11px] rounded-lg border transition-colors",
                    speed === s.value
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : " text-gray-600 border-gray-200 hover:border-indigo-400",
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Playback options (Script mode only) */}
          {onAutoPronounceSentenceChange !== undefined && (
            <>
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Playback
              </p>
              <div className="space-y-2">
                <Checkbox
                  checked={Boolean(autoPronounceSentence)}
                  onChange={(e) =>
                    onAutoPronounceSentenceChange(e.currentTarget.checked)
                  }
                  label={<span className="text-xs text-gray-600">Auto-pronounce</span>}
                  size="xs"
                  color="indigo"
                />
                {onLoopSentenceChange !== undefined && (
                  <Checkbox
                    checked={Boolean(loopSentence)}
                    onChange={(e) => onLoopSentenceChange(e.currentTarget.checked)}
                    label={<span className="text-xs text-gray-600">Loop 3× (3s apart)</span>}
                    size="xs"
                    color="indigo"
                  />
                )}
              </div>
            </>
          )}

        </div>
      )}
    </div>
  );
}

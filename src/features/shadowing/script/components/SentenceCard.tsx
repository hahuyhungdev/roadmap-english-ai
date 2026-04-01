"use client";

import {
  ArrowLeft,
  ArrowRight,
  Mic,
  Play,
  Square,
  Star,
  Volume2,
} from "lucide-react";
import { ActionIcon, Badge, Group, Loader, Text, Tooltip } from "@mantine/core";
import { AudioReplay } from "../../shared/AudioReplay";
import type { ShadowTurn } from "../../shared/types";
import type { useTTSSettings } from "../../shared/useTTSSettings";

type TTS = ReturnType<typeof useTTSSettings>;

interface Props {
  text: string;
  sentenceIdx: number;
  total: number;
  tts: TTS;
  isRecording: boolean;
  coachLoading: boolean;
  turns: ShadowTurn[];
  lastAudioUrl: string | null;
  onListen: () => void;
  onToggleRecording: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function SentenceCard({
  text,
  sentenceIdx,
  total,
  tts,
  isRecording,
  coachLoading,
  turns,
  lastAudioUrl,
  onListen,
  onToggleRecording,
  onPrev,
  onNext,
}: Props) {
  const relevantTurns = turns
    .filter((t) => t.sentenceIdx === sentenceIdx)
    .slice(-3);

  return (
    <div className="rounded-2xl border border-indigo-100 bg-indigo-50 shadow-sm p-5 space-y-4 transition-all">
      {/* Sentence text */}
      <div className="space-y-1">
        <Group justify="space-between" align="center">
          <Text
            size="xs"
            c="dimmed"
            className="uppercase tracking-widest font-semibold"
          >
            Sentence {sentenceIdx + 1} / {total}
          </Text>
        </Group>
        <p className="text-lg leading-relaxed text-gray-900 font-medium tracking-wide mt-1">
          {text}
        </p>
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-2">
        <Tooltip label="Previous (A / ←)" position="top" withArrow>
          <ActionIcon
            variant="default"
            radius="xl"
            size="lg"
            onClick={onPrev}
            disabled={sentenceIdx === 0}
          >
            <ArrowLeft size={14} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Listen (S / Space)" position="top" withArrow>
          <ActionIcon
            variant="light"
            color="violet"
            radius="xl"
            size="lg"
            onClick={onListen}
            disabled={tts.loading || tts.playing}
            className="flex-1"
          >
            {tts.loading ? (
              <Loader size="xs" color="violet" />
            ) : tts.playing ? (
              <Volume2 size={14} className="animate-pulse" />
            ) : (
              <Play size={14} />
            )}
          </ActionIcon>
        </Tooltip>

        {tts.playing && (
          <Tooltip label="Stop TTS" position="top" withArrow>
            <ActionIcon
              variant="light"
              color="red"
              radius="xl"
              size="lg"
              onClick={tts.stop}
            >
              <Square size={13} />
            </ActionIcon>
          </Tooltip>
        )}

        <Tooltip
          label={isRecording ? "Stop recording (R / ↑)" : "Record (R / ↑)"}
          position="top"
          withArrow
        >
          <ActionIcon
            variant={isRecording ? "filled" : "light"}
            color={isRecording ? "red" : "gray"}
            radius="xl"
            size="lg"
            onClick={onToggleRecording}
            className="flex-1"
          >
            {isRecording ? <Square size={13} /> : <Mic size={14} />}
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Next (D / →)" position="top" withArrow>
          <ActionIcon
            variant="default"
            radius="xl"
            size="lg"
            onClick={onNext}
            disabled={sentenceIdx >= total - 1}
          >
            <ArrowRight size={14} />
          </ActionIcon>
        </Tooltip>
      </div>

      {/* Recording indicator */}
      {isRecording && (
        <div className="flex items-center gap-2 text-red-500">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-medium">Recording…</span>
        </div>
      )}

      {/* Audio replay */}
      {lastAudioUrl && <AudioReplay url={lastAudioUrl} />}

      {/* AI Feedback turns */}
      {relevantTurns.length > 0 && (
        <div className="space-y-2 pt-1">
          {relevantTurns.map((turn) => (
            <div
              key={turn.id}
              className="rounded-xl border border-white bg-white p-3 space-y-1.5 shadow-sm"
            >
              <p className="text-xs text-gray-400 italic">"{turn.text}"</p>
              {turn.feedback && (
                <p className="text-xs text-gray-700 leading-relaxed">
                  {turn.feedback}
                </p>
              )}
              {turn.review?.score !== undefined && (
                <Badge
                  size="xs"
                  variant="light"
                  color="yellow"
                  leftSection={<Star size={8} className="fill-yellow-500" />}
                >
                  {turn.review.score}/10
                </Badge>
              )}
            </div>
          ))}
        </div>
      )}

      {coachLoading && (
        <div className="flex items-center gap-2 text-indigo-500">
          <Loader size="xs" color="violet" />
          <span className="text-xs">Getting AI feedback…</span>
        </div>
      )}
    </div>
  );
}

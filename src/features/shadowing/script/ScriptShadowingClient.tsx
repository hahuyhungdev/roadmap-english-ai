"use client";
import { useState, useRef, useEffect } from "react";
import { ActionIcon, Tooltip, Modal, Button, Textarea, Text, Select } from "@mantine/core";
import { Trash2 } from "lucide-react";
import { useScriptShadowing } from "./useScriptShadowing";
import { TTSSettingsPanel } from "../shared/TTSSettingsPanel";
import { ScriptInputForm } from "./components/ScriptInputForm";
import { SessionProgress } from "./components/SessionProgress";
import { SentenceCard } from "./components/SentenceCard";
import { SessionTimer } from "./components/SessionTimer";
import { CelebrationOverlay } from "./components/CelebrationOverlay";
import type { Sentence } from "../shared/types";

interface Props {
  sessionId?: number;
  initialScriptText?: string;
  initialSentences?: Sentence[];
  initialActiveSentenceIdx?: number;
  initialTtsVoice?: string;
  initialTtsSpeed?: number;
  onSentencesChange?: (sentences: Sentence[]) => void;
  onActiveSentenceChange?: (idx: number) => void;
  onScriptTextChange?: (scriptText: string) => void;
}

export default function ScriptShadowingClient(props: Props) {
  const s = useScriptShadowing({
    sessionId: props.sessionId,
    initialScriptText: props.initialScriptText,
    initialSentences: props.initialSentences,
    initialActiveSentenceIdx: props.initialActiveSentenceIdx,
    onSentencesChange: props.onSentencesChange,
    onActiveSentenceChange: props.onActiveSentenceChange,
    onScriptTextChange: props.onScriptTextChange,
  });

  const [scriptCollapsed, setScriptCollapsed] = useState(false);
  const [previewOpened, setPreviewOpened] = useState(false);
  const [previewScriptText, setPreviewScriptText] = useState("");
  const [previewDrafts, setPreviewDrafts] = useState<string[]>([]);
  const [previewError, setPreviewError] = useState("");
  const [splitPace, setSplitPace] = useState("balanced");

  // Celebration: fire once when all sentences have been practiced
  const [celebrationFired, setCelebrationFired] = useState(false);
  const hasSentences = s.sentences.length > 0;
  const allPracticed =
    hasSentences && s.activeSentenceIdx >= s.sentences.length - 1;
  const celebrationActive = allPracticed && !celebrationFired;

  // Reset celebration flag when a new script is loaded
  const prevSentenceLengthRef = useRef(s.sentences.length);

  useEffect(() => {
    if (s.sentences.length !== prevSentenceLengthRef.current) {
      prevSentenceLengthRef.current = s.sentences.length;
      setCelebrationFired(false);
    }
  }, [s.sentences.length]);

  const activeSentence = s.sentences[s.activeSentenceIdx];

  function buildSentencesWithTiming(texts: string[]): Sentence[] {
    let currentStart = 0;
    return texts.map((text) => {
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      const duration = Math.max(500, words * 400);
      const sentence: Sentence = {
        text,
        startMs: currentStart,
        endMs: currentStart + duration,
      };
      currentStart += duration;
      return sentence;
    });
  }

  function getPaceConfig(pace: string) {
    if (pace === "short") return { min: 20, max: 60 };
    if (pace === "long") return { min: 80, max: 200 };
    return { min: 50, max: 120 };
  }

  function handleProcessScript(e?: React.FormEvent, customPace?: string) {
    const paceToUse = customPace ?? splitPace;
    const conf = getPaceConfig(paceToUse);
    const preview = s.buildScriptPreview(e, undefined, conf.min, conf.max);
    if (!preview) return;

    setPreviewScriptText(preview.scriptText);
    setPreviewDrafts(preview.sentences.map((x) => x.text));
    setPreviewError("");
    setPreviewOpened(true);
  }

  function handlePaceChange(newPace: string | null) {
    if (!newPace || newPace === splitPace) return;
    setSplitPace(newPace);
    handleProcessScript(undefined, newPace);
  }

  function handleApplyPreview() {
    const cleanedTexts = previewDrafts.map((x) => x.trim()).filter(Boolean);
    if (cleanedTexts.length === 0) {
      setPreviewError("Please keep at least one sentence");
      return;
    }

    const editedScript = cleanedTexts.join("\n\n");
    s.applyScriptSentences(editedScript || previewScriptText, buildSentencesWithTiming(cleanedTexts));
    setPreviewOpened(false);
    setScriptCollapsed(true);
  }

  return (
    <>
      <CelebrationOverlay
        active={celebrationActive}
        message="🎉 All sentences practiced!"
        onDone={() => setCelebrationFired(true)}
      />

      <div className="max-w-3xl mx-auto space-y-5">
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Script Shadowing
            </h1>
            <p className="text-base text-gray-400 mt-0.5">
              Paste any text · practice sentence by sentence
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <SessionTimer active={hasSentences} />

            {hasSentences && (
              <TTSSettingsPanel
                provider={s.tts.provider}
                accent={s.tts.accent}
                speed={s.tts.speed}
                onProviderChange={s.tts.setProvider}
                onAccentChange={s.tts.setAccent}
                onSpeedChange={s.tts.setSpeed}
                autoPronounceSentence={s.autoPronounceSentence}
                onAutoPronounceSentenceChange={s.setAutoPronounceSentence}
                loopSentence={s.loopSentence}
                onLoopSentenceChange={s.setLoopSentence}
              />
            )}

            {s.turns.length > 0 && (
              <Tooltip label="Clear session" position="bottom" withArrow>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  size="md"
                  onClick={s.onClearSession}
                >
                  <Trash2 size={13} />
                </ActionIcon>
              </Tooltip>
            )}
          </div>
        </div>

        {/* ── Script Input ── */}
        <ScriptInputForm
          value={s.scriptInput}
          onChange={s.setScriptInput}
          onSubmit={handleProcessScript}
          error={s.scriptError}
          hasSentences={hasSentences}
          collapsed={scriptCollapsed}
          onCollapse={() => setScriptCollapsed(true)}
          onExpand={() => setScriptCollapsed(false)}
        />

        <Modal
          opened={previewOpened}
          onClose={() => setPreviewOpened(false)}
          title="Preview extracted sentences"
          centered
          size="lg"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Text size="md" c="dimmed">
                Review and edit before starting practice.
              </Text>
              <Select
                value={splitPace}
                onChange={handlePaceChange}
                data={[
                  { label: "Short", value: "short" },
                  { label: "Balanced", value: "balanced" },
                  { label: "Long", value: "long" },
                ]}
                size="md"
                w={120}
              />
            </div>

            <div className="max-h-[50vh] overflow-y-auto pr-1 space-y-2">
              {previewDrafts.map((draft, idx) => (
                <div key={idx} className="space-y-1">
                  <Text size="md" c="dimmed">
                    Sentence {idx + 1}
                  </Text>
                  <Textarea
                    value={draft}
                    onChange={(e) => {
                      const next = [...previewDrafts];
                      next[idx] = e.currentTarget.value;
                      setPreviewDrafts(next);
                    }}
                    autosize
                    minRows={2}
                    maxRows={6}
                  />
                </div>
              ))}
            </div>

            {previewError && (
              <Text size="md" c="red">
                {previewError}
              </Text>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <Button variant="subtle" color="gray" onClick={() => setPreviewOpened(false)}>
                Cancel
              </Button>
              <Button color="violet" onClick={handleApplyPreview}>
                Start Practice
              </Button>
            </div>
          </div>
        </Modal>

        {/* ── Practice Panel ── */}
        {hasSentences && (
          <div className="space-y-3">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm px-4 py-3 space-y-2">
              <SessionProgress
                total={s.sentences.length}
                current={s.activeSentenceIdx}
                onJump={s.setActiveSentenceIdx}
              />
              <div className="flex items-center justify-between">
                <p className="text-base text-gray-400">
                  A/D · ←/→ to navigate · R to record · S/Space to listen
                </p>
                {s.estimatedRemainingMs > 0 && (
                  <p className="text-base text-gray-400 shrink-0">
                    ~{Math.ceil(s.estimatedRemainingMs / 60000)} min remaining
                  </p>
                )}
              </div>
            </div>

            {s.activeSentenceIdx >= 0 && activeSentence ? (
              <SentenceCard
                text={activeSentence.text}
                sentenceIdx={s.activeSentenceIdx}
                total={s.sentences.length}
                tts={s.tts}
                isRecording={s.isRecording}
                lastAudioUrl={s.lastAudioUrl}
                onListen={s.onListenSentence}
                onToggleRecording={s.onToggleRecording}
                onPrev={s.onPrev}
                onNext={s.onNext}
                onUpdateText={(nextText) =>
                  s.onUpdateSentenceText(s.activeSentenceIdx, nextText)
                }
              />
            ) : (
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-8 text-center">
                <p className="text-base text-gray-400">
                  Select a sentence to start practicing.
                </p>
              </div>
            )}
          </div>
        )}

        {s.sonioxError && (
          <p className="text-base text-red-500">{s.sonioxError}</p>
        )}
      </div>
    </>
  );
}

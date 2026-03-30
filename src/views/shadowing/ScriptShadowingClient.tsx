"use client";

import { Keyboard } from "lucide-react";
import { useScriptShadowing } from "./useScriptShadowing";
import { ShortcutsModal } from "./ShortcutsModal";
import { ScriptPanel } from "./ScriptPanel";
import { PracticeFeed } from "./PracticeFeed";

export default function ScriptShadowingClient() {
  const {
    scriptInput,
    setScriptInput,
    sentences,
    scriptError,
    activeSentenceIdx,
    sentenceItemRefs,
    recordingForIdx,
    activeSentenceText,
    ttsProvider,
    setTtsProvider,
    ttsAccent,
    setTtsAccent,
    ttsVoice,
    setTtsVoice,
    ttsSpeed,
    setTtsSpeed,
    hearingIdx,
    ttsLoading,
    ttsPlaying,
    isRecording,
    sonioxError,
    turns,
    coachLoading,
    showShortcuts,
    setShowShortcuts,
    showTtsSettings,
    setShowTtsSettings,
    overallScore,
    hasTurns,
    activeSentenceAudioUrl,
    autoPronounceSentence,
    setAutoPronounceSentence,
    loopSentence,
    setLoopSentence,
    handleLoadScript,
    goToSentenceIdx,
    onToggleRecording,
    onListenAIVoice,
    onPrevSentence,
    onNextSentence,
    onClearSession,
  } = useScriptShadowing();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {showShortcuts && (
        <ShortcutsModal onClose={() => setShowShortcuts(false)} />
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Script Shadowing</h1>
          <p className="text-sm text-gray-500 mt-1">
            Paste any text and practice sentence by sentence with AI feedback.
          </p>
        </div>
        <button
          onClick={() => setShowShortcuts(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 border border-gray-200 rounded-lg hover:border-indigo-300 hover:text-indigo-600 transition-all shrink-0 mt-1"
        >
          <Keyboard size={13} /> Shortcuts (?)
        </button>
      </div>

      {/* Script input form */}
      <form onSubmit={handleLoadScript} className="flex flex-col gap-2">
        <textarea
          value={scriptInput}
          onChange={(e) => setScriptInput(e.target.value)}
          placeholder="Paste your script or text here (e.g., a paragraph, article, or lesson)..."
          className={
            scriptError
              ? "w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors border-red-300 bg-red-50 focus:border-red-400 resize-none h-24"
              : "w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors border-gray-200 bg-white focus:border-indigo-300 resize-none h-24"
          }
        />
        {scriptError && (
          <p className="text-xs text-red-500 pl-1">{scriptError}</p>
        )}
        <button
          type="submit"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors self-start"
        >
          Process Script
        </button>
      </form>

      {/* Main content */}
      <div className="grid gap-6 grid-cols-1">
        {/* Script + Practice */}
        <div
          className="flex flex-col bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
          style={{ minHeight: "600px" }}
        >
          {/* Script section */}
          <div
            className="flex flex-col border-b border-gray-100"
            style={{ flex: "3 1 0", minHeight: 0, overflow: "hidden" }}
          >
            <ScriptPanel
              videoId={null}
              sentences={sentences}
              activeSentenceIdx={activeSentenceIdx}
              sentenceItemRefs={sentenceItemRefs}
              scriptLoading={false}
              scriptError={scriptError}
              hearingIdx={hearingIdx}
              ttsLoading={ttsLoading}
              ttsPlaying={ttsPlaying}
              isRecording={isRecording}
              recordingForIdx={recordingForIdx}
              showTtsSettings={showTtsSettings}
              ttsProvider={ttsProvider}
              ttsAccent={ttsAccent}
              ttsVoice={ttsVoice}
              ttsSpeed={ttsSpeed}
              autoPronounceSentence={autoPronounceSentence}
              loopSentence={loopSentence}
              overallScore={overallScore}
              hasTurns={hasTurns}
              onFetchScript={() => {}}
              onJumpToSentence={goToSentenceIdx}
              onToggleTtsSettings={() => setShowTtsSettings((v) => !v)}
              onClearSession={onClearSession}
              onSetTtsProvider={setTtsProvider}
              onSetTtsAccent={setTtsAccent}
              onSetTtsVoice={setTtsVoice}
              onSetTtsSpeed={setTtsSpeed}
              onSetAutoPronounceSentence={setAutoPronounceSentence}
              onSetLoopSentence={setLoopSentence}
            />
          </div>

          {/* Practice feed section */}
          <div
            className="flex flex-col"
            style={{ flex: "2 1 0", minHeight: 0, overflow: "hidden" }}
          >
            <PracticeFeed
              activeSentenceIdx={activeSentenceIdx}
              activeSentenceText={activeSentenceText}
              activeSentenceAudioUrl={activeSentenceAudioUrl}
              isRecording={isRecording}
              sonioxError={sonioxError}
              onListenOriginal={() => {}}
              onListenAIVoice={onListenAIVoice}
              onToggleRecording={onToggleRecording}
              onPrevSentence={onPrevSentence}
              onNextSentence={onNextSentence}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Lightbulb,
  List,
  Loader2,
  MessageSquare,
  RefreshCw,
  X,
} from "lucide-react";
import clsx from "clsx";
import type { PracticeQuestion, PracticeQuestionGroup } from "../../types/practice";
import { session01QA } from "./data/session-01";
import { session02QA } from "./data/session-02";
import { session03QA } from "./data/session-03";
import { session04QA } from "./data/session-04";
import { session05QA } from "./data/session-05";
import { session06QA } from "./data/session-06";
import { session07QA } from "./data/session-07";

const STATIC_DATA: Record<string, PracticeQuestionGroup[]> = {
  "session-01": session01QA,
  "session-02": session02QA,
  "session-03": session03QA,
  "session-04": session04QA,
  "session-05": session05QA,
  "session-06": session06QA,
  "session-07": session07QA,
};

interface QARefPanelProps {
  sessionSlug: string;
  lessonTitle?: string;
  lessonContent?: string;
}

export default function QARefPanel({ sessionSlug, lessonTitle, lessonContent }: QARefPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [groups, setGroups] = useState<PracticeQuestionGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<PracticeQuestion | null>(null);

  useEffect(() => {
    if (!isOpen || groups.length > 0) return;
    void load(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  async function load(force: boolean) {
    setLoading(true);
    setError(null);
    try {
      // Use pre-built static data if available (no API call needed)
      if (!force && STATIC_DATA[sessionSlug]) {
        const g = STATIC_DATA[sessionSlug];
        setGroups(g);
        setSelected(g[0]?.questions[0] ?? null);
        return;
      }

      if (!force) {
        const cached = await fetch(
          `/api/practice/questions?sessionSlug=${encodeURIComponent(sessionSlug)}`,
        ).then((r) => r.json());

        if (cached.questions && Array.isArray(cached.questions) && cached.questions.length > 0) {
          // If cache is stale (old format without coaching fields), force regenerate
          const hasCoaching = cached.questions.some(
            (q: Record<string, unknown>) => q.framework || q.keyPoints || q.samples,
          );
          if (hasCoaching) {
            const g = toGroups(cached.questions);
            setGroups(g);
            setSelected(g[0]?.questions[0] ?? null);
            return;
          }
          // stale cache → fall through to regenerate
        }
      }

      const res = await fetch("/api/practice/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionSlug,
          lessonTitle: lessonTitle ?? "",
          lessonContent: lessonContent ?? "",
          force: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to generate");

      const g: PracticeQuestionGroup[] = data.groups ?? toGroups(data.questions ?? []);
      setGroups(g);
      setSelected(g[0]?.questions[0] ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  function toGroups(
    questions: Array<{
      id: string;
      text: string;
      group?: string;
      framework?: string;
      keyPoints?: string[];
      samples?: string[];
      answer?: string;
    }>,
  ): PracticeQuestionGroup[] {
    const map = new Map<string, PracticeQuestion[]>();
    for (const q of questions) {
      const key = q.group ?? "Questions";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push({
        id: q.id,
        text: q.text,
        group: key,
        framework: q.framework,
        keyPoints: q.keyPoints,
        samples: q.samples ?? (q.answer ? [q.answer] : undefined),
      });
    }
    return Array.from(map.entries()).map(([label, qs]) => ({ label, questions: qs }));
  }

  const allQuestions = groups.flatMap((g) => g.questions);

  // ── FAB ───────────────────────────────────────────────────────────────────
  if (!isOpen) {
    return (
      <div className="fixed bottom-5 left-5 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-xl shadow-lg transition-all active:scale-[0.96]"
        >
          <BookOpen size={13} />
          Q&amp;A
        </button>
      </div>
    );
  }

  // ── Modal ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

      {/* panel */}
      <div className="relative z-10 w-full max-w-5xl h-[78vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl bg-zinc-900 border border-zinc-700">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700 shrink-0">
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
            <BookOpen size={14} className="text-emerald-400" />
            <span>Q&amp;A Practice</span>
            {lessonTitle && (
              <span className="text-xs font-normal text-zinc-400 truncate max-w-[200px]">
                — {lessonTitle}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => { setGroups([]); setSelected(null); void load(true); }}
              disabled={loading}
              title="Regenerate"
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 transition-colors disabled:opacity-40"
            >
              <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
              Regenerate
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Body */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-zinc-500">
            <Loader2 size={22} className="animate-spin text-emerald-400" />
            <p className="text-sm text-zinc-400">Generating coaching cards…</p>
            <p className="text-xs text-zinc-600">15–30 seconds</p>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8">
            <p className="text-sm text-red-400 text-center">{error}</p>
            <button
              onClick={() => void load(false)}
              className="text-xs px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 rounded-xl transition-colors"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            {/* Left list */}
            <aside className="w-64 shrink-0 border-r border-zinc-700 overflow-y-auto">
              <div className="py-2">
                {groups.map((g) => (
                  <GroupList
                    key={g.label}
                    group={g}
                    selectedId={selected?.id}
                    onSelect={setSelected}
                  />
                ))}
              </div>
            </aside>

            {/* Right coaching */}
            <main className="flex-1 overflow-y-auto">
              {!selected ? (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-zinc-600">
                  <List size={24} />
                  <p className="text-xs">Pick a question</p>
                </div>
              ) : (
                <CoachingCard
                  key={selected.id}
                  question={selected}
                  allQuestions={allQuestions}
                  onNavigate={setSelected}
                />
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function GroupList({
  group,
  selectedId,
  onSelect,
}: {
  group: PracticeQuestionGroup;
  selectedId: string | undefined;
  onSelect: (q: PracticeQuestion) => void;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2 text-left"
      >
        <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">
          {group.label}
        </span>
        {open ? <ChevronUp size={9} className="text-zinc-600" /> : <ChevronDown size={9} className="text-zinc-600" />}
      </button>
      {open && (
        <ul className="px-1.5 pb-1 space-y-0.5">
          {group.questions.map((q, i) => {
            const active = q.id === selectedId;
            return (
              <li key={q.id}>
                <button
                  onClick={() => onSelect(q)}
                  className={clsx(
                    "w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-start gap-2 transition-colors",
                    active
                      ? "bg-emerald-600/20 text-emerald-300"
                      : "text-zinc-400 hover:bg-zinc-700/60 hover:text-zinc-200",
                  )}
                >
                  <span className={clsx("shrink-0 font-mono mt-0.5 text-[10px]", active ? "text-emerald-500" : "text-zinc-600")}>
                    {i + 1}.
                  </span>
                  <span className="leading-snug">{q.text}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function CoachingCard({
  question,
  allQuestions,
  onNavigate,
}: {
  question: PracticeQuestion;
  allQuestions: PracticeQuestion[];
  onNavigate: (q: PracticeQuestion) => void;
}) {
  const idx = allQuestions.findIndex((q) => q.id === question.id);
  const prev = idx > 0 ? allQuestions[idx - 1] : null;
  const next = idx < allQuestions.length - 1 ? allQuestions[idx + 1] : null;

  return (
    <div className="h-full flex flex-col">
      {/* Question */}
      <div className="px-7 pt-6 pb-5 border-b border-zinc-700 shrink-0">
        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2">
          {question.group}
        </p>
        <h2 className="text-xl font-semibold text-zinc-100 leading-snug">{question.text}</h2>
      </div>

      {/* Coaching content */}
      <div className="flex-1 overflow-y-auto px-7 py-6 space-y-6">
        {question.framework && (
          <Section icon={<Lightbulb size={14} className="text-amber-400" />} title="How to structure" accent="amber">
            <p className="text-sm text-zinc-300 leading-relaxed">{question.framework}</p>
          </Section>
        )}

        {question.keyPoints && question.keyPoints.length > 0 && (
          <Section icon={<List size={14} className="text-indigo-400" />} title="Ideas to cover" accent="indigo">
            <ul className="space-y-2">
              {question.keyPoints.map((pt, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <span className="mt-2 shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  {pt}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {question.samples && question.samples.length > 0 && (
          <Section icon={<MessageSquare size={14} className="text-emerald-400" />} title="Sample answers" accent="emerald">
            <div className="space-y-2.5">
              {question.samples.map((s, i) => (
                <SampleAnswer key={i} index={i} text={s} label={i === 0 ? "Simpler · B1" : "Detailed · B2"} />
              ))}
            </div>
          </Section>
        )}
      </div>

      {/* Nav */}
      <div className="shrink-0 px-7 py-4 border-t border-zinc-700 flex items-center justify-between">
        <button
          onClick={() => prev && onNavigate(prev)}
          disabled={!prev}
          className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-200 disabled:opacity-25 transition-colors"
        >
          <ChevronRight size={14} className="rotate-180" /> Prev
        </button>
        <span className="text-xs text-zinc-600">{idx + 1} / {allQuestions.length}</span>
        <button
          onClick={() => next && onNavigate(next)}
          disabled={!next}
          className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-200 disabled:opacity-25 transition-colors"
        >
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

function Section({
  icon, title, accent, children,
}: {
  icon: React.ReactNode;
  title: string;
  accent: "amber" | "indigo" | "emerald";
  children: React.ReactNode;
}) {
  const border = { amber: "border-amber-500/40", indigo: "border-indigo-500/40", emerald: "border-emerald-500/40" }[accent];
  return (
    <div className={clsx("pl-3.5 border-l-2", border)}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wide">{title}</span>
      </div>
      {children}
    </div>
  );
}

function SampleAnswer({ index, text, label }: { index: number; text: string; label: string }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div className="rounded-lg border border-zinc-700 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className={clsx(
          "w-full flex items-center justify-between px-3 py-2 text-left text-xs font-medium transition-colors",
          open ? "bg-emerald-900/40 text-emerald-300" : "bg-zinc-800 text-zinc-500 hover:bg-zinc-700 hover:text-zinc-300",
        )}
      >
        <span>{label}</span>
        {open ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
      </button>
      {open && (
        <div className="px-4 py-3 bg-zinc-800/50">
          <p className="text-sm text-zinc-300 leading-relaxed">{text}</p>
        </div>
      )}
    </div>
  );
}

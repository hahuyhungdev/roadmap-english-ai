"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import type { PhraseGroup } from "@/lib/sessions.server";
import { useProgressStore } from "@/store/useProgressStore";
import type { Session } from "@/types";
import clsx from "clsx";
import { CheckCircle2, ChevronLeft, ChevronRight, Circle } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import LessonAssistant from "./LessonAssistant";
import PracticeCoach from "./PracticeCoach";
import AnswerGuideInline, { type AnswerGuideItem } from "./AnswerGuideInline";

const ANSWER_GUIDE_SLOT = "\n\n[[ANSWER_GUIDE_SLOT]]\n\n";

function extractJsonAnswerGuides(content: string): AnswerGuideItem[] {
  const match = content.match(/<!--\s*answerGuidance\s*([\s\S]*?)-->/i);
  if (!match) return [];
  try {
    const parsed = JSON.parse(match[1]) as AnswerGuideItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => typeof item?.question === "string");
  } catch {
    return [];
  }
}

function extractMarkdownAnswerGuide(content: string): string {
  const match = content.match(/<!--\s*answerGuideMarkdown\s*([\s\S]*?)-->/i);
  return match?.[1]?.trim() ?? "";
}

function parseMarkdownAnswerGuides(markdown: string): AnswerGuideItem[] {
  const headings = [
    ...markdown.matchAll(/^###\s+\d+\.\s+(.+?)\s*$/gm),
  ];

  return headings
    .map((match, index) => {
      const start = (match.index ?? 0) + match[0].length;
      const end =
        index < headings.length - 1
          ? (headings[index + 1].index ?? markdown.length)
          : markdown.length;
      return {
        question: match[1].trim(),
        bodyMarkdown: markdown.slice(start, end).trim(),
      };
    })
    .filter((item) => item.question && item.bodyMarkdown);
}

function extractAnswerGuides(content: string): AnswerGuideItem[] {
  const markdownGuides = parseMarkdownAnswerGuides(
    extractMarkdownAnswerGuide(content),
  );
  if (markdownGuides.length) return markdownGuides;
  return extractJsonAnswerGuides(content);
}

function removeGuidePayloads(content: string): string {
  return content
    .replace(/<!--\s*answerGuidance[\s\S]*?-->/gi, "")
    .replace(/<!--\s*answerGuideMarkdown[\s\S]*?-->/gi, "")
    .trim();
}

export default function SessionDetailClient({
  session,
  phase,
  canViewAnswerGuides,
}: {
  session: Session;
  phase: PhraseGroup;
  canViewAnswerGuides: boolean;
}) {
  const { completedSessions, toggleCompleted, syncFromDB } = useProgressStore();
  const [mounted, setMounted] = useState(false);
  const [assistantSidebarVisible, setAssistantSidebarVisible] = useState(false);
  const answerGuides = useMemo(
    () => extractAnswerGuides(session.content),
    [session.content],
  );
  const baseLessonContent = useMemo(
    () => removeGuidePayloads(session.content),
    [session.content],
  );
  const visibleLessonContent = useMemo(() => {
    if (!canViewAnswerGuides || !answerGuides.length) return baseLessonContent;

    const sectionSevenPattern =
      /<details[^>]*>\s*<summary>\s*<strong>\s*7\)\s*Questions\s*&\s*Practice\s*Ideas\s*<\/strong>\s*<\/summary>[\s\S]*?<\/details>/i;

    if (sectionSevenPattern.test(baseLessonContent)) {
      return baseLessonContent.replace(sectionSevenPattern, ANSWER_GUIDE_SLOT);
    }

    return `${baseLessonContent}${ANSWER_GUIDE_SLOT}`;
  }, [answerGuides.length, baseLessonContent, canViewAnswerGuides]);
  const lessonParts = useMemo(
    () => visibleLessonContent.split(ANSWER_GUIDE_SLOT),
    [visibleLessonContent],
  );

  useEffect(() => {
    setMounted(true);
    void syncFromDB();
  }, [syncFromDB]);

  function updateAssistantSidebarVisible(next: boolean) {
    setAssistantSidebarVisible(next);
  }

  const completed = mounted && completedSessions.includes(session.id);

  return (
    <div className="max-w-[90rem] mx-auto">
      <div
        className={clsx(
          "grid grid-cols-1 gap-5 xl:gap-6 items-start",
          assistantSidebarVisible &&
            "xl:grid-cols-[minmax(0,1fr)_24rem]",
        )}
      >
        <div
          className={clsx(
            "min-w-0 max-w-6xl",
            !assistantSidebarVisible && "w-full mx-auto",
          )}
        >
      <div className="flex items-center justify-between mb-6">
        <Link
          href={`/phase/${phase.id}`}
          className="flex items-center gap-1 text-base text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <ChevronLeft size={16} /> {phase.title}
        </Link>
        <button
          onClick={() => toggleCompleted(session.id)}
          className={clsx(
            "flex items-center gap-1.5 text-base font-medium px-3 py-1.5 rounded-full border transition-all",
            completed
              ? "bg-indigo-50 text-indigo-600 border-indigo-200"
              : " text-gray-500 border-gray-200 hover:border-indigo-400",
          )}
        >
          {completed ? <CheckCircle2 size={13} /> : <Circle size={13} />}
          {completed ? "Completed" : "Mark done"}
        </button>
      </div>

      <div className="mb-6">
        <p className="text-base text-indigo-500 font-semibold uppercase tracking-wide mb-1">
          Lesson {String(session.meta.sessionNumber).padStart(2, "0")} &middot;{" "}
          {session.meta.topic}
        </p>
        <h1 className="text-2xl font-bold text-gray-900">
          {session.meta.title}
        </h1>
        {session.meta.description && (
          <p className="text-base text-gray-500 mt-2">
            {session.meta.description}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {session.meta.level && (
            <span className="text-base px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
              {session.meta.level}
            </span>
          )}
          {session.meta.date && (
            <span className="text-base text-gray-500">
              {new Date(session.meta.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          )}
        </div>
      </div>

      <article
        className={[
          "lesson-prose border border-gray-200 rounded-2xl p-4 md:p-6 prose prose-gray max-w-none",
          "text-[17px] md:text-[18px] leading-7",
          "prose-p:text-gray-700 prose-p:text-[1em] prose-p:leading-7 prose-p:my-2",
          "prose-headings:text-gray-900 prose-headings:font-semibold",
          "prose-h1:text-[1.65em] prose-h1:mb-3 prose-h1:mt-0",
          "prose-h2:text-[1.35em] prose-h2:mt-5 prose-h2:mb-3 prose-h2:pb-1.5 prose-h2:border-b prose-h2:border-gray-100",
          "prose-h3:text-[1.15em] prose-h3:mt-4 prose-h3:mb-2",
          "prose-ul:my-2 prose-ol:my-2",
          "prose-li:text-gray-700 prose-li:text-[1em] prose-li:leading-7 prose-li:my-1",
          "prose-a:text-indigo-600 hover:prose-a:text-indigo-500 prose-a:font-medium",
          "prose-strong:text-gray-900",
          "prose-code:text-indigo-700 prose-code:bg-indigo-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[1em]",
          "prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl",
          "prose-blockquote:border-l-4 prose-blockquote:border-indigo-400 prose-blockquote:bg-indigo-50/70",
          "prose-blockquote:my-3 prose-blockquote:rounded-r-lg prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:not-italic prose-blockquote:text-gray-700",
          "prose-table:text-[1em] prose-th:text-gray-700 prose-td:text-gray-700",
          "prose-details:my-2 prose-details:border prose-details:border-gray-200 prose-details:rounded-lg prose-details:bg-gray-50/70 prose-details:overflow-hidden",
          "prose-summary:cursor-pointer prose-summary:list-none prose-summary:font-semibold prose-summary:text-gray-900 prose-summary:px-3 prose-summary:py-2 prose-summary:select-none prose-summary:hover:bg-indigo-50 prose-summary:transition-colors prose-summary:[&::-webkit-details-marker]:hidden",
        ].join(" ")}
      >
        {lessonParts.map((part, index) => (
          <Fragment key={`${index}-${part.slice(0, 16)}`}>
            {part.trim() ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  details: ({ children, open: _open, ...props }) => (
                    <details {...props} className="group mb-2">
                      {children}
                    </details>
                  ),
                  summary: ({ children, ...props }) => (
                    <summary
                      {...props}
                      className="flex items-center justify-between gap-3 cursor-pointer [&_*]:cursor-pointer"
                      title="Click to expand or collapse"
                    >
                      <span className="flex items-center gap-2">
                        <ChevronRight
                          size={14}
                          className="shrink-0 text-indigo-500 transition-transform duration-200 group-open:rotate-90"
                        />
                        <span>{children}</span>
                      </span>
                      <ChevronRight
                        size={12}
                        className="shrink-0 text-gray-400 transition-transform duration-200 group-open:hidden"
                      />
                      <span className="hidden text-base text-indigo-600 font-medium group-open:inline">
                        Collapse
                      </span>
                    </summary>
                  ),
                }}
              >
                {part}
              </ReactMarkdown>
            ) : null}
            {canViewAnswerGuides && index < lessonParts.length - 1 ? (
              <AnswerGuideInline guides={answerGuides} />
            ) : null}
          </Fragment>
        ))}
      </article>

      <PracticeCoach
        lessonTitle={session.meta.title}
        lessonContent={baseLessonContent}
      />
        </div>
        <LessonAssistant
          lessonTitle={session.meta.title}
          lessonContent={baseLessonContent}
          desktopPresentation={assistantSidebarVisible ? "sidebar" : "floating"}
          openFloatingAsSidebar
          onCollapseSidebar={() => updateAssistantSidebarVisible(false)}
          onRestoreSidebar={() => updateAssistantSidebarVisible(true)}
        />
      </div>
    </div>
  );
}

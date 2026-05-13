"use client";

import {
  Loader2,
  PanelRightClose,
  PanelRightOpen,
  Send,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import {
  useState,
  useRef,
  useEffect,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Textarea } from "@mantine/core";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { AiChatMessage } from "@/types/ai";

interface LessonAssistantProps {
  lessonTitle?: string;
  lessonContent?: string;
  contextTitle?: string;
  contextContent?: string;
  contextType?: "lesson" | "phase";
  desktopPresentation?: "sidebar" | "floating";
  onCollapseSidebar?: () => void;
  onRestoreSidebar?: () => void;
}

const MODE_LABELS: Record<string, string> = {
  practice: "Practice",
  idea: "Ideas",
  concise: "Concise",
};

const PLACEHOLDER: Record<string, string> = {
  practice: "Ask a practice question…",
  idea: "Brainstorm ideas…",
  concise: "Quick question…",
};

export default function LessonAssistant({
  lessonTitle,
  lessonContent,
  contextTitle,
  contextContent,
  contextType = "lesson",
  desktopPresentation = "sidebar",
  onCollapseSidebar,
  onRestoreSidebar,
}: LessonAssistantProps) {
  const title = contextTitle ?? lessonTitle ?? "";
  const content = contextContent ?? lessonContent ?? "";
  const contextLabel = contextType === "phase" ? "phase" : "lesson";
  const assistantTitle =
    contextType === "phase" ? "AI Phase Assistant" : "AI Lesson Assistant";
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"practice" | "idea" | "concise">("concise");
  const MODE_KEY = "ai_lesson_mode";
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const isStreamingText =
    loading &&
    messages.at(-1)?.role === "assistant" &&
    (messages.at(-1)?.content.length ?? 0) > 0;

  // Load saved mode
  useEffect(() => {
    try {
      const saved = localStorage.getItem(MODE_KEY);
      if (saved === "practice" || saved === "idea" || saved === "concise") {
        setMode(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(MODE_KEY, mode);
    } catch {
      // ignore
    }
  }, [mode]);

  // Scroll when a new message row is added, but don't chase streamed content.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function onSubmit(e?: FormEvent) {
    if (e && typeof (e as FormEvent).preventDefault === "function") {
      (e as FormEvent).preventDefault();
    }
    const question = input.trim();
    if (!question || loading) return;

    const nextMessages: AiChatMessage[] = [
      ...messages,
      { role: "user", content: question },
    ];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contextType,
          contextTitle: title,
          contextContent: content,
          mode,
          stream: true,
          messages: nextMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        if (res.status === 404) {
          throw new Error(
            "API endpoint not found. For local dev, run: npm run dev:vercel",
          );
        }
        throw new Error(data?.error || `API Error: ${res.status}`);
      }

      if (!res.body) {
        throw new Error("Empty response from AI");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let reply = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        reply += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          const lastIndex = copy.length - 1;
          if (copy[lastIndex]?.role === "assistant") {
            copy[lastIndex] = { role: "assistant", content: reply };
          }
          return copy;
        });
      }

      const finalChunk = decoder.decode();
      if (finalChunk) {
        reply += finalChunk;
        setMessages((prev) => {
          const copy = [...prev];
          const lastIndex = copy.length - 1;
          if (copy[lastIndex]?.role === "assistant") {
            copy[lastIndex] = { role: "assistant", content: reply };
          }
          return copy;
        });
      }
      if (!reply.trim()) {
        throw new Error("Empty response from AI");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to get AI response";
      setError(message);
      setMessages(messages);
      setInput(question);
    } finally {
      setLoading(false);
    }
  }

  function adjustTextareaHeight() {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(300, ta.scrollHeight)}px`;
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    const isEnter = e.key === "Enter";
    const isModifier = e.ctrlKey || e.metaKey;
    if (!isEnter) return;
    if ((!e.shiftKey && !isModifier) || isModifier) {
      e.preventDefault();
      void onSubmit();
    }
  }

  const assistantSubtitle = title.length > 42 ? `${title.slice(0, 42)}…` : title;

  function handleCollapseSidebar() {
    setIsOpen(false);
    onCollapseSidebar?.();
  }

  function handleRestoreSidebar() {
    onRestoreSidebar?.();
    setIsOpen(true);
  }

  function renderClosedCard() {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white/90 shadow-sm p-4 theme-dark:bg-slate-900/80 theme-dark:border-slate-700">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center shrink-0">
            <Sparkles size={17} className="text-indigo-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold text-gray-900">
              {assistantTitle}
            </p>
            <p className="text-base text-gray-500 leading-relaxed mt-1">
              Keep the assistant beside the {contextLabel} without covering the content.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="mt-4 w-full rounded-2xl bg-indigo-600 px-4 py-3 text-base font-semibold text-white hover:bg-indigo-700 active:scale-[0.99] transition-all"
        >
          Open assistant
        </button>
        {onCollapseSidebar && (
          <button
            onClick={handleCollapseSidebar}
            className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-base font-semibold text-gray-600 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50/60 active:scale-[0.99] transition-all theme-dark:border-slate-700"
          >
            Collapse sidebar
          </button>
        )}
      </div>
    );
  }

  function renderFloatingButton() {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center z-50 shadow-xl shadow-indigo-900/20 transition-all active:scale-95 cursor-pointer"
        aria-label="Open AI assistant"
        title={assistantTitle}
      >
        <Sparkles size={20} />
      </button>
    );
  }

  function renderPanel(className: string, onClose: () => void) {
    return (
      <section className={className}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
              <Sparkles size={13} className="text-indigo-500" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-gray-900 leading-tight">
                {assistantTitle}
              </h2>
              <p className="text-base text-gray-500 leading-tight truncate">
                {assistantSubtitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {desktopPresentation === "floating" && onRestoreSidebar && (
              <button
                onClick={handleRestoreSidebar}
                className="hidden xl:inline-flex items-center gap-1 rounded-full border border-gray-200 px-2.5 py-1 text-base font-medium text-gray-500 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50/60 transition-colors theme-dark:border-slate-700"
              >
                <PanelRightOpen size={13} />
                Dock
              </button>
            )}
            {desktopPresentation === "sidebar" && onCollapseSidebar && (
              <button
                onClick={handleCollapseSidebar}
                className="hidden xl:flex w-7 h-7 items-center justify-center rounded-full text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                aria-label="Collapse assistant sidebar"
                title="Collapse sidebar"
              >
                <PanelRightClose size={14} />
              </button>
            )}
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Close assistant"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Mode selector */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-gray-100 bg-gray-50/60 shrink-0">
          <Zap size={11} className="text-indigo-500 shrink-0" />
          <div className="flex gap-1 flex-1">
            {(["practice", "idea", "concise"] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                }}
                className={`flex-1 text-base px-2 py-1.5 rounded-lg font-medium transition-all ${
                  mode === m
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-500 border border-gray-200 hover:border-indigo-200 hover:text-indigo-600"
                }`}
              >
                {MODE_LABELS[m]}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-full text-center gap-2 pb-8">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                <Sparkles size={16} className="text-indigo-500" />
              </div>
              <p className="text-base text-gray-500 leading-relaxed max-w-56">
                Ask anything about this {contextLabel} — summary, examples,
                corrections, or a quick quiz.
              </p>
              <div className="flex flex-wrap gap-1 justify-center mt-1">
                {["Explain this", "Give examples", "Quiz me"].map((hint) => (
                  <button
                    key={hint}
                    onClick={() => {
                      setInput(hint);
                      textareaRef.current?.focus();
                    }}
                    className="text-base px-2 py-1 rounded-full border border-gray-200 text-gray-500 hover:border-indigo-200 hover:text-indigo-600 transition-colors"
                  >
                    {hint}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, idx) => (
            <div
              key={`${m.role}-${idx}`}
              className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[90%] text-base px-3 py-2.5 leading-relaxed ${
                  m.role === "user"
                    ? "bg-indigo-600 text-white rounded-2xl rounded-br-md"
                    : "ai-assistant-bubble bg-gray-100 text-gray-800 rounded-2xl rounded-bl-md border border-gray-100"
                }`}
              >
                {m.role === "assistant" ? (
                  <div className="ai-assistant-markdown max-w-none text-inherit">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => (
                          <p className="mb-2 leading-relaxed text-inherit last:mb-0">
                            {children}
                          </p>
                        ),
                        ul: ({ children }) => (
                          <ul className="mb-2 list-disc pl-5 text-inherit">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="mb-2 list-decimal pl-5 text-inherit">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="mb-1 text-inherit">{children}</li>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-inherit">
                            {children}
                          </strong>
                        ),
                        code: ({ children }) => (
                          <code className="rounded bg-indigo-50 px-1 py-0.5 text-base text-indigo-600">
                            {children}
                          </code>
                        ),
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <span className="whitespace-pre-wrap">{m.content}</span>
                )}
              </div>
            </div>
          ))}

          {loading && !isStreamingText && (
            <div className="inline-flex items-center gap-2 text-base text-gray-500 bg-gray-100 rounded-2xl px-3 py-2.5 rounded-bl-md">
              <Loader2 size={12} className="animate-spin" />
              <span>Thinking…</span>
            </div>
          )}

          {error && (
            <div className="text-base text-red-500 bg-red-50 rounded-xl px-3 py-2 border border-red-100">
              {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={onSubmit}
          className="shrink-0 px-3 py-3 border-t border-gray-100"
        >
          <div className="flex items-end gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.currentTarget.value);
                adjustTextareaHeight();
              }}
              onKeyDown={handleKeyDown}
              onInput={adjustTextareaHeight}
              placeholder={PLACEHOLDER[mode]}
              rows={1}
              autosize
              minRows={1}
              maxRows={7}
              className="flex-1"
              classNames={{
                input:
                  "border border-gray-200 rounded-xl px-3 py-2.5 text-base text-gray-800 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none transition-all placeholder:text-gray-500",
              }}
              style={{ maxHeight: "7rem" }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-9 h-9 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl flex items-center justify-center transition-colors shrink-0 active:scale-95"
              aria-label="Send"
            >
              <Send size={13} />
            </button>
          </div>
          <p className="text-base text-gray-500 mt-1.5 text-center">
            Enter to send · Shift+Enter for newline
          </p>
        </form>
      </section>
    );
  }

  return (
    <>
      {desktopPresentation === "sidebar" ? (
        <div className="hidden xl:block sticky top-4 self-start">
          {isOpen
            ? renderPanel(
              "h-[calc(100vh-2rem)] max-h-[48rem] min-h-[34rem] border border-gray-200 rounded-3xl shadow-xl shadow-gray-200/60 flex flex-col overflow-hidden bg-white theme-dark:bg-slate-900 theme-dark:border-slate-700",
              () => setIsOpen(false),
            )
            : renderClosedCard()}
        </div>
      ) : (
        <div className="hidden xl:block">
          {!isOpen
            ? renderFloatingButton()
            : renderPanel(
                "fixed bottom-5 right-5 z-50 h-[min(82vh,42rem)] w-[24rem] border border-gray-200 rounded-3xl shadow-2xl shadow-gray-950/20 flex flex-col overflow-hidden bg-white theme-dark:bg-slate-900 theme-dark:border-slate-700",
                () => setIsOpen(false),
              )}
        </div>
      )}

      <div className="xl:hidden">
        {!isOpen ? (
          renderFloatingButton()
        ) : (
          <>
            <button
              type="button"
              aria-label="Close assistant backdrop"
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-gray-950/30 backdrop-blur-[1px]"
            />
            {renderPanel(
              "fixed inset-x-3 bottom-3 z-50 h-[min(82vh,38rem)] border border-gray-200 rounded-3xl shadow-2xl shadow-gray-950/25 flex flex-col overflow-hidden bg-white theme-dark:bg-slate-900 theme-dark:border-slate-700",
              () => setIsOpen(false),
            )}
          </>
        )}
      </div>
    </>
  );
}

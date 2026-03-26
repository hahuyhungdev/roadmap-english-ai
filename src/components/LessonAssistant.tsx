import { Loader2, Send, Sparkles, X } from "lucide-react";
import {
  useState,
  useRef,
  useEffect,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { AiChatMessage, AiResponse } from "../types/ai";

interface LessonAssistantProps {
  lessonTitle: string;
  lessonContent: string;
}

export default function LessonAssistant({
  lessonTitle,
  lessonContent,
}: LessonAssistantProps) {
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"practice" | "idea" | "concise">("practice");
  const MODE_KEY = "ai_lesson_mode";

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
          lessonTitle,
          lessonContent,
          mode,
          messages: nextMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = (await res.json()) as AiResponse & { error?: string };
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error(
            "API endpoint not found. For local dev, run: npm run dev:vercel",
          );
        }
        throw new Error(data.error || `API Error: ${res.status}`);
      }

      const reply = data.reply?.trim();
      if (!reply) {
        throw new Error("Empty response from AI");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to get AI response";
      setError(message);
      setMessages((prev) => prev.slice(0, -1));
      setInput(question);
    } finally {
      setLoading(false);
    }
  }

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

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

    // Send on Enter (no shift) or on Ctrl/Cmd+Enter
    if ((!e.shiftKey && !isModifier) || isModifier) {
      e.preventDefault();
      void onSubmit();
    }
    // Shift+Enter => default inserts newline
  }

  return (
    <>
      {isOpen ? (
        <section className="fixed bottom-6 right-6 w-96 h-150 bg-white border border-gray-200 rounded-2xl p-4 shadow-2xl flex flex-col z-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-500" />
              <h2 className="text-sm font-semibold text-gray-900">
                AI Lesson Assistant
              </h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 p-0.5"
              aria-label="Close assistant"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-3 overflow-y-auto flex-1 mb-3 pr-2">
            {messages.length === 0 && (
              <p className="text-xs text-gray-500">
                Ask anything about this lesson: summary, examples, role-play,
                corrections, or quiz.
              </p>
            )}

            {messages.map((m, idx) => (
              <div
                key={`${m.role}-${idx}`}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[85%] text-sm bg-indigo-50 text-indigo-900 rounded-xl px-3 py-2 text-right"
                    : "max-w-[90%] text-sm bg-gray-100 text-gray-800 rounded-xl px-3 py-2"
                }
              >
                {m.role === "assistant" ? (
                  <div className="prose prose-sm prose-gray max-w-none prose-p:my-1 prose-p:text-gray-800 prose-headings:my-1 prose-headings:font-semibold prose-h1:text-sm prose-h2:text-sm prose-h3:text-sm prose-li:my-0 prose-li:text-gray-800 prose-a:text-indigo-600 prose-a:font-medium prose-strong:font-semibold prose-strong:text-gray-900 prose-code:text-indigo-600 prose-code:bg-indigo-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:text-xs prose-pre:p-2 prose-pre:rounded-lg">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {m.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  m.content
                )}
              </div>
            ))}

            {loading && (
              <div className="inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-100 rounded-xl px-3 py-2">
                <Loader2 size={14} className="animate-spin" /> Thinking...
              </div>
            )}
          </div>

          {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

          <form onSubmit={onSubmit} className="flex items-center gap-2 mt-auto">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                adjustTextareaHeight();
              }}
              onKeyDown={handleKeyDown}
              onInput={adjustTextareaHeight}
              placeholder="Ask about this lesson... (Shift+Enter for newline)"
              rows={2}
              className="flex-1 border border-gray-200 rounded-xl px-2 py-1.5 text-base outline-none focus:border-indigo-300 resize-none overflow-auto max-h-72"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="inline-flex items-center gap-1 rounded-xl px-2 py-1.5 text-xs bg-indigo-600 text-white disabled:opacity-50"
            >
              <Send size={12} />
            </button>
          </form>
          <div className="ml-3 inline-flex rounded-md bg-gray-50 p-0.5">
            <button
              onClick={() => setMode("practice")}
              className={`${mode === "practice" ? "bg-white text-indigo-600" : "text-gray-600"} px-2 py-1 text-xs rounded-md`}
            >
              Practice
            </button>
            <button
              onClick={() => setMode("idea")}
              className={`${mode === "idea" ? "bg-white text-indigo-600" : "text-gray-600"} px-2 py-1 text-xs rounded-md`}
            >
              Idea
            </button>
            <button
              onClick={() => setMode("concise")}
              className={`${mode === "concise" ? "bg-white text-indigo-600" : "text-gray-600"} px-2 py-1 text-xs rounded-md`}
            >
              Concise
            </button>
          </div>
        </section>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-12 h-12 bg-white border border-gray-200 rounded-full p-1 shadow-lg flex items-center justify-center z-50 text-indigo-500"
          aria-label="Open assistant"
          title="Open AI assistant"
        >
          <Sparkles size={18} />
        </button>
      )}
    </>
  );
}

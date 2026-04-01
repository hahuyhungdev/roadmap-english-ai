"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  FileText,
  Video,
  Trash2,
  Loader2,
  Clock,
  ChevronRight,
} from "lucide-react";
import clsx from "clsx";

type Session = {
  id: number;
  mode: "youtube" | "script";
  title: string;
  videoId: string | null;
  sentences: unknown[] | null;
  createdAt: string;
  updatedAt: string;
};

export function ShadowingHub() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createMode, setCreateMode] = useState<"youtube" | "script">("script");
  const [createTitle, setCreateTitle] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  async function fetchSessions() {
    setLoading(true);
    try {
      const res = await fetch("/api/shadowing/sessions");
      const data = await res.json();
      setSessions(data.sessions ?? []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    setCreating(true);
    try {
      const res = await fetch("/api/shadowing/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: createMode,
          title: createTitle.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.session?.id) {
        router.push(`/shadowing/${data.session.id}`);
      }
    } catch {
      // ignore
    } finally {
      setCreating(false);
      setShowCreate(false);
      setCreateTitle("");
    }
  }

  async function handleDelete(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (deleting) return;
    setDeleting(id);
    try {
      await fetch(`/api/shadowing/sessions/${id}`, { method: "DELETE" });
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch {
      // ignore
    } finally {
      setDeleting(null);
    }
  }

  function fmtDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shadowing Lab</h1>
          <p className="text-sm text-gray-500 mt-1">
            Practice speaking with YouTube videos or custom scripts
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <Plus size={16} />
          New Session
        </button>
      </div>

      {/* Sessions list */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 size={24} className="animate-spin" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🎧</div>
          <p className="text-gray-500 mb-2">No sessions yet</p>
          <p className="text-sm text-gray-400">
            Create your first shadowing session to start practicing
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {sessions.map((s) => (
            <div
              key={s.id}
              role="button"
              tabIndex={0}
              onClick={() => router.push(`/shadowing/${s.id}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  router.push(`/shadowing/${s.id}`);
                }
              }}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all text-left group cursor-pointer"
            >
              {/* Mode icon */}
              <div
                className={clsx(
                  "shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
                  s.mode === "youtube"
                    ? "bg-red-50 text-red-500"
                    : "bg-indigo-50 text-indigo-500",
                )}
              >
                {s.mode === "youtube" ? (
                  <Video size={18} />
                ) : (
                  <FileText size={18} />
                )}
              </div>

              {/* Title + meta */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {s.title}
                </p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-[11px] text-gray-400 inline-flex items-center gap-1">
                    <Clock size={10} />
                    {fmtDate(s.updatedAt)}
                  </span>
                  <span
                    className={clsx(
                      "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                      s.mode === "youtube"
                        ? "bg-red-50 text-red-600"
                        : "bg-indigo-50 text-indigo-600",
                    )}
                  >
                    {s.mode}
                  </span>
                  {s.sentences && Array.isArray(s.sentences) && (
                    <span className="text-[10px] text-gray-400">
                      {(s.sentences as unknown[]).length} sentences
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <button
                onClick={(e) => handleDelete(s.id, e)}
                className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                title="Delete session"
              >
                {deleting === s.id ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
              </button>
              <ChevronRight
                size={16}
                className="shrink-0 text-gray-300 group-hover:text-indigo-400"
              />
            </div>
          ))}
        </div>
      )}

      {/* Keyboard shortcut tip */}
      <div className="mt-8 p-4 rounded-xl border border-gray-100 bg-gray-50">
        <p className="text-gray-500 text-center text-xs">
          💡 Inside a session: Space to listen • A/D to navigate • R to record •
          ? for all shortcuts
        </p>
      </div>

      {/* ── Create Modal ── */}
      {showCreate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setShowCreate(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              New Shadowing Session
            </h2>

            {/* Mode picker */}
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Mode
            </p>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                onClick={() => setCreateMode("youtube")}
                className={clsx(
                  "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                  createMode === "youtube"
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200 hover:border-gray-300",
                )}
              >
                <Video
                  size={24}
                  className={
                    createMode === "youtube" ? "text-red-500" : "text-gray-400"
                  }
                />
                <span
                  className={clsx(
                    "text-sm font-medium",
                    createMode === "youtube" ? "text-red-600" : "text-gray-600",
                  )}
                >
                  YouTube
                </span>
              </button>
              <button
                onClick={() => setCreateMode("script")}
                className={clsx(
                  "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                  createMode === "script"
                    ? "border-indigo-400 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300",
                )}
              >
                <FileText
                  size={24}
                  className={
                    createMode === "script"
                      ? "text-indigo-500"
                      : "text-gray-400"
                  }
                />
                <span
                  className={clsx(
                    "text-sm font-medium",
                    createMode === "script"
                      ? "text-indigo-600"
                      : "text-gray-600",
                  )}
                >
                  Script
                </span>
              </button>
            </div>

            {/* Title (optional) */}
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Title{" "}
              <span className="text-gray-400 font-normal normal-case">
                (optional)
              </span>
            </p>
            <input
              value={createTitle}
              onChange={(e) => setCreateTitle(e.target.value)}
              placeholder="Auto-generated from date if empty"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-indigo-400 mb-6"
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCreate(false);
                  setCreateTitle("");
                }}
                className="flex-1 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={creating}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                {creating && <Loader2 size={14} className="animate-spin" />}
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

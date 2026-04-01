"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProgressStore {
  completedSessions: string[];
  hydrated: boolean;       // true after DB fetch completes
  toggleCompleted: (id: string) => void;
  isCompleted: (id: string) => boolean;
  syncFromDB: () => Promise<void>;
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      completedSessions: [],
      hydrated: false,

      /** Fetch done sessions from DB and merge with local state */
      syncFromDB: async () => {
        try {
          const res = await fetch("/api/progress");
          if (!res.ok) return;
          const data = (await res.json()) as { done: string[] };
          // Merge: union of local + DB (local stays until DB confirms)
          const merged = Array.from(
            new Set([...get().completedSessions, ...data.done]),
          );
          set({ completedSessions: merged, hydrated: true });
        } catch {
          set({ hydrated: true }); // still mark hydrated so UI doesn't spin
        }
      },

      toggleCompleted: (id) => {
        // Optimistic local update immediately
        set((state) => ({
          completedSessions: state.completedSessions.includes(id)
            ? state.completedSessions.filter((s) => s !== id)
            : [...state.completedSessions, id],
        }));
        // Sync to DB in background
        fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionSlug: id }),
        }).catch(() => {
          // Fire-and-forget — local state is still correct
        });
      },

      isCompleted: (id) => get().completedSessions.includes(id),
    }),
    { name: "english-progress" },
  ),
);

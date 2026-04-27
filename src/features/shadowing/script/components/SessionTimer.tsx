"use client";

import { useSessionTimer } from "../hooks/useSessionTimer";
import clsx from "clsx";

interface Props {
  active: boolean;
}

export function SessionTimer({ active }: Props) {
  const { formatted, latestMilestone } = useSessionTimer(active);

  return (
    <div className="flex items-center gap-2">
      <div
        className={clsx(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-base font-mono font-semibold transition-all",
          active
            ? "bg-indigo-50 text-indigo-600 border border-indigo-200"
            : "bg-gray-50 text-gray-400 border border-gray-200",
        )}
      >
        <span
          className={clsx(
            "w-1.5 h-1.5 rounded-full",
            active ? "bg-indigo-500 animate-pulse" : "bg-gray-300",
          )}
        />
        {formatted}
      </div>

      {latestMilestone && (
        <span
          key={latestMilestone.label}
          className="text-base font-semibold text-orange-500 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full animate-fade-in"
        >
          {latestMilestone.emoji} {latestMilestone.label}
        </span>
      )}
    </div>
  );
}

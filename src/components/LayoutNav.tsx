"use client";

import Link from "next/link";
import { BookOpen, FileText, Moon, Sun, Video } from "lucide-react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useThemeMode } from "@/hooks/useThemeMode";

export default function LayoutNav() {
  // Avoid using `usePathname` directly in render because it can cause
  // server/client HTML mismatches. Instead, compute active path on the
  // client after mount and render neutral markup on the server.
  const [clientPath, setClientPath] = useState<string | null>(null);
  const { isDark, toggleTheme, ready } = useThemeMode();

  useEffect(() => {
    setClientPath(window.location.pathname || "/");
  }, []);

  const isHome = clientPath === "/" || !!clientPath?.startsWith("/phase");
  const isYouTube = !!clientPath && clientPath.startsWith("/shadowing/youtube");
  const isScript = !!clientPath && clientPath.startsWith("/shadowing/script");

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 border-b",
        isDark ? "border-gray-700 bg-gray-900/95" : "border-gray-200 bg-white/95",
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-2 overflow-x-auto">
        <Link
          href="/"
          className={clsx(
            "flex items-center gap-2 text-base font-semibold transition-colors",
            isDark ? "text-emerald-300 hover:text-emerald-200" : "text-indigo-600 hover:text-indigo-700",
          )}
        >
          <BookOpen size={20} />
          <span>English System</span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/"
            className={clsx(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              isHome
                ? isDark
                  ? "bg-emerald-950 text-emerald-200"
                  : "bg-indigo-50 text-indigo-600"
                : isDark
                  ? "text-gray-300 hover:text-gray-100 hover:bg-gray-800"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
            )}
          >
            <BookOpen size={15} />
            English
          </Link>
          <Link
            href="/shadowing/youtube"
            className={clsx(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              isYouTube
                ? isDark
                  ? "bg-red-950 text-red-200"
                  : "bg-red-50 text-red-600"
                : isDark
                  ? "text-gray-300 hover:text-gray-100 hover:bg-gray-800"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
            )}
          >
            <Video size={15} />
            YouTube
          </Link>
          <Link
            href="/shadowing/script"
            className={clsx(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              isScript
                ? isDark
                  ? "bg-emerald-950 text-emerald-200"
                  : "bg-indigo-50 text-indigo-600"
                : isDark
                  ? "text-gray-300 hover:text-gray-100 hover:bg-gray-800"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
            )}
          >
            <FileText size={15} />
            Script
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className={clsx(
              "ml-1 inline-flex h-8 w-8 items-center justify-center rounded-md border transition-colors",
              isDark
                ? "border-gray-700 bg-gray-800 text-amber-300 hover:bg-gray-700"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50",
            )}
            title={ready ? (isDark ? "Light mode" : "Dark mode") : "Theme"}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>
    </header>
  );
}

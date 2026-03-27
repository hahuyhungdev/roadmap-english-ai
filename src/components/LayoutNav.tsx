"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Mic2 } from "lucide-react";
import clsx from "clsx";

export default function LayoutNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isShadowing = pathname.startsWith("/shadowing");

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-indigo-600 font-semibold text-base hover:text-indigo-700 transition-colors"
        >
          <BookOpen size={20} />
          <span>English System</span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/shadowing"
            className={clsx(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              isShadowing
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
            )}
          >
            <Mic2 size={15} />
            Shadowing
          </Link>
          {!isHome && !isShadowing && (
            <Link
              href="/"
              className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Home
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

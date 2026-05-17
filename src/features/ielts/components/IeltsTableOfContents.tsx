"use client";

import { useState } from "react";
import type { MouseEvent } from "react";
import { ListTree, X } from "lucide-react";
import clsx from "clsx";
import type { TocItem } from "@/features/ielts/types";

export function IeltsTableOfContents({
  activeTocId,
  items,
  onItemClick,
}: {
  activeTocId: string;
  items: TocItem[];
  onItemClick: (event: MouseEvent<HTMLAnchorElement>, id: string) => void;
}) {
  const [open, setOpen] = useState(true);

  if (items.length === 0) return null;

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? "Close contents" : "Open contents"}
        onClick={() => setOpen((current) => !current)}
        className="ielts-toc-trigger inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-semibold transition"
      >
        <ListTree size={16} />
        Contents
      </button>

      {open && (
        <nav className="ielts-panel absolute right-0 top-full z-40 mt-2 w-80 rounded-lg border shadow-sm">
          <div className="ielts-header flex items-center justify-between border-b px-3 py-2">
            <span className="text-sm font-semibold uppercase tracking-wide">
              Contents
            </span>
            <button
              type="button"
              aria-label="Close contents"
              onClick={() => setOpen(false)}
              className="ielts-toc-icon-button inline-flex h-8 w-8 items-center justify-center rounded-md transition"
            >
              <X size={17} />
            </button>
          </div>
          <div className="max-h-[min(30rem,calc(100vh-9rem))] overflow-auto p-3">
            <div className="space-y-1">
              {items.map((item, index) => (
                <a
                  key={`${item.id}-${index}`}
                  href={`#${item.id}`}
                  onClick={(event) => onItemClick(event, item.id)}
                  className={clsx(
                    "ielts-toc-link block rounded-md px-2 py-1.5 text-sm font-semibold leading-5 transition",
                    item.level === 3 && "ml-3 text-xs font-medium",
                    activeTocId === item.id && "ielts-toc-link-active",
                  )}
                >
                  {item.text}
                </a>
              ))}
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}

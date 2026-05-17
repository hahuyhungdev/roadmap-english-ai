"use client";

import type { MouseEvent } from "react";
import { ListChecks } from "lucide-react";
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
  if (items.length === 0) return null;

  return (
    <nav className="ielts-muted-panel hidden border-l p-4 xl:block">
      <div className="h-full overflow-auto">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
          <ListChecks size={15} />
          Contents
        </div>
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
  );
}

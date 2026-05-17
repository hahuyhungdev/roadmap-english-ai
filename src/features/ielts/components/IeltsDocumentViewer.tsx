"use client";

import type { MouseEvent, RefObject } from "react";
import clsx from "clsx";
import type { IeltsDocument } from "@/lib/ielts.server";
import type { TocItem } from "@/features/ielts/types";
import {
  IELTS_KIND_LABELS,
  IELTS_KIND_STYLES,
} from "@/features/ielts/constants";
import { statLabel } from "@/features/ielts/utils/markdown";
import { IeltsMarkdownArticle } from "@/features/ielts/components/IeltsMarkdownArticle";
import { IeltsTableOfContents } from "@/features/ielts/components/IeltsTableOfContents";

export function IeltsDocumentViewer({
  activeTocId,
  articleRef,
  document,
  onTocClick,
  tocItems,
}: {
  activeTocId: string;
  articleRef: RefObject<HTMLElement | null>;
  document?: IeltsDocument;
  onTocClick: (event: MouseEvent<HTMLAnchorElement>, id: string) => void;
  tocItems: TocItem[];
}) {
  return (
    <section className="ielts-panel min-w-0 rounded-lg border shadow-sm xl:flex xl:h-[calc(100vh-1.5rem)] xl:flex-col xl:overflow-hidden">
      {document ? (
        <>
          <div className="ielts-header sticky top-14 z-20 shrink-0 border-b px-4 py-2 backdrop-blur-sm lg:top-0 xl:static">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span
                className={clsx(
                  "rounded-full border px-2 py-0.5 text-xs font-semibold",
                  IELTS_KIND_STYLES[document.kind],
                )}
              >
                {IELTS_KIND_LABELS[document.kind]}
              </span>
              <span className="text-sm text-gray-500">
                {statLabel(document)} · {document.stats.words.toLocaleString()} words
              </span>
            </div>
          </div>

          <div
            className={clsx(
              "grid grid-cols-1 xl:min-h-0 xl:flex-1",
              tocItems.length > 0 && "xl:grid-cols-[minmax(0,1fr)_18rem]",
            )}
          >
            <IeltsMarkdownArticle
              articleRef={articleRef}
              content={document.content}
            />
            <IeltsTableOfContents
              activeTocId={activeTocId}
              items={tocItems}
              onItemClick={onTocClick}
            />
          </div>
        </>
      ) : (
        <div className="p-8 text-center text-base text-gray-500">
          No IELTS content found.
        </div>
      )}
    </section>
  );
}

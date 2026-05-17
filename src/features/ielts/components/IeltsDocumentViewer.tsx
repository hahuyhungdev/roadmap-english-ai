"use client";

import type { MouseEvent, RefObject } from "react";
import type { IeltsDocument } from "@/lib/ielts.server";
import type { TocItem } from "@/features/ielts/types";
import { statLabel } from "@/features/ielts/utils/markdown";
import { IeltsMarkdownArticle } from "@/features/ielts/components/IeltsMarkdownArticle";
import { IeltsTableOfContents } from "@/features/ielts/components/IeltsTableOfContents";

export function IeltsDocumentViewer({
  activeTocId,
  articleRef,
  document,
  documents,
  onDocumentSelect,
  onTocClick,
  tocItems,
}: {
  activeTocId: string;
  articleRef: RefObject<HTMLElement | null>;
  document?: IeltsDocument;
  documents: IeltsDocument[];
  onDocumentSelect: (id: string) => void;
  onTocClick: (event: MouseEvent<HTMLAnchorElement>, id: string) => void;
  tocItems: TocItem[];
}) {
  return (
    <section className="ielts-panel min-w-0 rounded-lg border shadow-sm xl:flex xl:h-[calc(100vh-1.5rem)] xl:flex-col xl:overflow-hidden">
      {document ? (
        <>
          <div className="ielts-header sticky top-14 z-20 shrink-0 border-b px-4 py-2 backdrop-blur-sm lg:top-0 xl:static">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <select
                aria-label="IELTS document"
                value={document.id}
                onChange={(event) => onDocumentSelect(event.target.value)}
                className="ielts-input min-w-0 rounded-md border px-3 py-2 text-sm font-semibold outline-none transition md:max-w-[34rem] md:flex-1"
              >
                {documents.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
              <span className="ielts-secondary shrink-0 text-xs md:text-sm">
                {statLabel(document)} · {document.stats.words.toLocaleString()} words
              </span>
              <IeltsTableOfContents
                activeTocId={activeTocId}
                items={tocItems}
                onItemClick={onTocClick}
              />
            </div>
          </div>

          <div className="xl:flex xl:min-h-0 xl:flex-1">
            <IeltsMarkdownArticle
              articleRef={articleRef}
              content={document.content}
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

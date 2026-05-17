"use client";

import { useRef } from "react";
import type { IeltsDocument } from "@/lib/ielts.server";
import { IeltsDocumentSidebar } from "@/features/ielts/components/IeltsDocumentSidebar";
import { IeltsDocumentViewer } from "@/features/ielts/components/IeltsDocumentViewer";
import { useIeltsDocuments } from "@/features/ielts/hooks/useIeltsDocuments";
import { useIeltsToc } from "@/features/ielts/hooks/useIeltsToc";

export default function IeltsDashboardClient({
  documents,
}: {
  documents: IeltsDocument[];
}) {
  const articleRef = useRef<HTMLElement | null>(null);
  const {
    activeDocument,
    filteredDocuments,
    kind,
    query,
    setActiveId,
    setKind,
    setQuery,
    tocItems,
  } = useIeltsDocuments(documents);
  const { activeTocId, handleTocClick } = useIeltsToc({
    activeDocumentId: activeDocument?.id,
    articleRef,
    tocItems,
  });

  return (
    <div className="w-full min-w-0">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[21rem_minmax(0,1fr)] 2xl:grid-cols-[22rem_minmax(0,1fr)]">
        <IeltsDocumentSidebar
          activeDocument={activeDocument}
          documents={filteredDocuments}
          kind={kind}
          query={query}
          onDocumentSelect={setActiveId}
          onKindChange={setKind}
          onQueryChange={setQuery}
        />
        <IeltsDocumentViewer
          activeTocId={activeTocId}
          articleRef={articleRef}
          document={activeDocument}
          onTocClick={handleTocClick}
          tocItems={tocItems}
        />
      </div>
    </div>
  );
}

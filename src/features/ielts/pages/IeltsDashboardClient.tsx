"use client";

import { useRef } from "react";
import type { IeltsDocument } from "@/lib/ielts.server";
import { IeltsDocumentViewer } from "@/features/ielts/components/IeltsDocumentViewer";
import { useIeltsDocuments } from "@/features/ielts/hooks/useIeltsDocuments";
import { useIeltsToc } from "@/features/ielts/hooks/useIeltsToc";

export default function IeltsDashboardClient({
  documents,
}: {
  documents: IeltsDocument[];
}) {
  const articleRef = useRef<HTMLElement | null>(null);
  const { activeDocument, selectableDocuments, setActiveId, tocItems } =
    useIeltsDocuments(documents);
  const { activeTocId, handleTocClick } = useIeltsToc({
    activeDocumentId: activeDocument?.id,
    articleRef,
    tocItems,
  });

  return (
    <div className="w-full min-w-0">
      <div className="mx-auto grid w-full max-w-[70rem] grid-cols-1">
        <IeltsDocumentViewer
          activeTocId={activeTocId}
          articleRef={articleRef}
          document={activeDocument}
          documents={selectableDocuments}
          onDocumentSelect={setActiveId}
          onTocClick={handleTocClick}
          tocItems={tocItems}
        />
      </div>
    </div>
  );
}

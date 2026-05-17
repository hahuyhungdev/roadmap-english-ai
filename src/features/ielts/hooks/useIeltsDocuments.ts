import { useMemo, useState } from "react";
import type { IeltsDocument } from "@/lib/ielts.server";
import { extractToc } from "@/features/ielts/utils/markdown";

function selectableDocumentOrder(document: IeltsDocument): number {
  if (document.kind === "roadmap") return 0;
  if (document.kind === "lesson") return 1;
  return 2;
}

function toSelectableDocuments(documents: IeltsDocument[]): IeltsDocument[] {
  return documents
    .filter((document) => document.kind === "roadmap" || document.kind === "lesson")
    .toSorted((a, b) => {
      const orderDiff = selectableDocumentOrder(a) - selectableDocumentOrder(b);
      if (orderDiff !== 0) return orderDiff;
      return a.relativePath.localeCompare(b.relativePath);
    });
}

export function useIeltsDocuments(documents: IeltsDocument[]) {
  const [activeId, setActiveId] = useState(
    () => toSelectableDocuments(documents)[0]?.id ?? documents[0]?.id ?? "",
  );
  const selectableDocuments = useMemo(
    () => toSelectableDocuments(documents),
    [documents],
  );

  const activeDocument =
    selectableDocuments.find((document) => document.id === activeId) ??
    selectableDocuments[0] ??
    documents[0];

  const tocItems = useMemo(
    () => (activeDocument ? extractToc(activeDocument.content) : []),
    [activeDocument],
  );

  return {
    activeDocument,
    activeId,
    selectableDocuments,
    setActiveId,
    tocItems,
  };
}

import { useMemo, useState } from "react";
import type { IeltsDocument } from "@/lib/ielts.server";
import type { IeltsKindFilter } from "@/features/ielts/types";
import { extractToc } from "@/features/ielts/utils/markdown";

export function useIeltsDocuments(documents: IeltsDocument[]) {
  const [activeId, setActiveId] = useState(documents[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<IeltsKindFilter>("all");

  const filteredDocuments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return documents.filter((document) => {
      const matchesKind = kind === "all" || document.kind === kind;
      const matchesQuery =
        !normalizedQuery ||
        document.title.toLowerCase().includes(normalizedQuery) ||
        document.relativePath.toLowerCase().includes(normalizedQuery) ||
        document.content.toLowerCase().includes(normalizedQuery);

      return matchesKind && matchesQuery;
    });
  }, [documents, kind, query]);

  const activeDocument =
    documents.find((document) => document.id === activeId) ??
    filteredDocuments[0] ??
    documents[0];

  const tocItems = useMemo(
    () => (activeDocument ? extractToc(activeDocument.content) : []),
    [activeDocument],
  );

  return {
    activeDocument,
    activeId,
    filteredDocuments,
    kind,
    query,
    setActiveId,
    setKind,
    setQuery,
    tocItems,
  };
}


import type { IeltsDocumentKind } from "@/lib/ielts.server";

export interface TocItem {
  id: string;
  level: 2 | 3 | 4;
  text: string;
}

export type IeltsKindFilter = IeltsDocumentKind | "all";

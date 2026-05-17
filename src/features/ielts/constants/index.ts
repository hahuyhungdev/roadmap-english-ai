import type { IeltsDocumentKind } from "@/lib/ielts.server";

export const IELTS_KIND_LABELS: Record<IeltsDocumentKind, string> = {
  lesson: "Lesson",
  roadmap: "Roadmap",
  structure: "Structure",
  reference: "Reference",
};

export const IELTS_KIND_STYLES: Record<IeltsDocumentKind, string> = {
  lesson: "ielts-badge-lesson",
  roadmap: "ielts-badge-roadmap",
  structure: "ielts-badge-structure",
  reference: "ielts-badge-reference",
};

export const IELTS_KIND_FILTERS = [
  "all",
  "lesson",
  "roadmap",
  "structure",
] as const;


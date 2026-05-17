import type { ReactNode } from "react";
import type { IeltsDocument } from "@/lib/ielts.server";
import type { HeadingAnchor, TocItem } from "@/features/ielts/types";

export function statLabel(document: IeltsDocument): string {
  if (document.kind === "lesson") {
    return `${document.stats.parts} parts · ${document.stats.questions} questions · ${document.stats.retryTasks} retries`;
  }

  return `${document.stats.words.toLocaleString()} words`;
}

export function slugifyHeading(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/`/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") || "section"
  );
}

export function headingId(text: string, level: TocItem["level"]): string {
  return `h${level}-${slugifyHeading(text)}`;
}

export function createHeadingIdGenerator() {
  const counts = new Map<string, number>();

  return (text: string, level: TocItem["level"]) => {
    const baseId = headingId(text, level);
    const count = counts.get(baseId) ?? 0;
    counts.set(baseId, count + 1);

    return count === 0 ? baseId : `${baseId}-${count + 1}`;
  };
}

function lineNumberAt(content: string, index: number): number {
  return content.slice(0, index).split("\n").length;
}

export function extractHeadingAnchors(content: string): HeadingAnchor[] {
  const anchors: HeadingAnchor[] = [];
  const getHeadingId = createHeadingIdGenerator();
  let includeChildren = false;

  for (const match of content.matchAll(/^(#{2,4})\s+(.+)$/gm)) {
    const level = match[1].length as TocItem["level"];
    const text = match[2].replace(/#+\s*$/, "").trim();
    const id = getHeadingId(text, level);
    let includeInToc = false;

    if (level === 2) {
      includeChildren = /^Part\s+\d+/i.test(text) || text === "Source Alignment";
      includeInToc = includeChildren;
    }

    if (level === 3) {
      includeInToc = includeChildren;
    }

    anchors.push({
      id,
      includeInToc,
      level,
      line: lineNumberAt(content, match.index),
      text,
    });
  }

  return anchors;
}

export function extractToc(content: string): TocItem[] {
  return extractHeadingAnchors(content)
    .filter((anchor) => anchor.includeInToc)
    .map(({ id, level, text }) => ({ id, level, text }));
}

export function plainText(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children.map(plainText).join("");
  }

  if (children && typeof children === "object" && "props" in children) {
    const props = children.props as { children?: ReactNode };
    return plainText(props.children);
  }

  return "";
}

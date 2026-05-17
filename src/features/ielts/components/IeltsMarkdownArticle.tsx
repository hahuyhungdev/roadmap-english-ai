"use client";

import { useMemo } from "react";
import type { ReactNode, RefObject } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import {
  extractHeadingAnchors,
  headingId,
  plainText,
} from "@/features/ielts/utils/markdown";
import type { TocItem } from "@/features/ielts/types";

type MarkdownHeadingNode = {
  position?: {
    start?: {
      line?: number;
    };
  };
};

export function IeltsMarkdownArticle({
  articleRef,
  content,
}: {
  articleRef: RefObject<HTMLElement | null>;
  content: string;
}) {
  const headingIdsByLine = useMemo(() => {
    const ids = new Map<number, string>();

    for (const anchor of extractHeadingAnchors(content)) {
      ids.set(anchor.line, anchor.id);
    }

    return ids;
  }, [content]);

  const getHeadingId = (
    node: MarkdownHeadingNode | undefined,
    children: ReactNode,
    level: TocItem["level"],
  ) => {
    const line = node?.position?.start?.line;
    return line
      ? (headingIdsByLine.get(line) ?? headingId(plainText(children), level))
      : headingId(plainText(children), level);
  };

  const components: Components = {
    h2: ({ children, node }) => (
      <h2 id={getHeadingId(node, children, 2)}>{children}</h2>
    ),
    h3: ({ children, node }) => (
      <h3 id={getHeadingId(node, children, 3)}>{children}</h3>
    ),
    h4: ({ children, node }) => (
      <h4 id={getHeadingId(node, children, 4)}>{children}</h4>
    ),
    a: ({ href, children }) => (
      <a href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    ),
  };

  return (
    <article
      ref={articleRef}
      className={[
        "lesson-prose ielts-prose prose prose-gray max-w-none p-4 md:p-6 xl:h-full xl:min-h-0 xl:flex-1 xl:overflow-y-auto",
        "text-[16px] md:text-[17px] leading-7",
        "prose-p:leading-7",
        "prose-headings:font-semibold prose-headings:scroll-mt-4",
        "prose-h1:text-[1.6em] prose-h1:mt-0",
        "prose-h2:text-[1.25em] prose-h2:border-b prose-h2:pb-2",
        "prose-h3:text-[1.1em]",
        "prose-pre:rounded-lg",
        "[&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:overflow-visible",
        "[&_pre_code]:whitespace-pre-wrap [&_pre_code]:break-words",
        "prose-blockquote:border-l-4",
        "prose-table:text-[0.95em]",
      ].join(" ")}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}

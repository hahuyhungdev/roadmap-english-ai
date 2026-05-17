"use client";

import type { RefObject } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import {
  createHeadingIdGenerator,
  plainText,
} from "@/features/ielts/utils/markdown";

export function IeltsMarkdownArticle({
  articleRef,
  content,
}: {
  articleRef: RefObject<HTMLElement | null>;
  content: string;
}) {
  const getHeadingId = createHeadingIdGenerator();

  return (
    <article
      ref={articleRef}
      className={[
        "lesson-prose ielts-prose prose prose-gray max-w-none p-4 md:p-6 xl:min-h-0 xl:overflow-y-auto",
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
        components={{
          h2: ({ children }) => {
            const text = plainText(children);
            return <h2 id={getHeadingId(text, 2)}>{children}</h2>;
          },
          h3: ({ children }) => {
            const text = plainText(children);
            return <h3 id={getHeadingId(text, 3)}>{children}</h3>;
          },
          h4: ({ children }) => {
            const text = plainText(children);
            return <h4 id={getHeadingId(text, 4)}>{children}</h4>;
          },
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}

"use client";

import { useMemo, useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import {
  FileText,
  ListChecks,
  MapIcon,
  Search,
} from "lucide-react";
import clsx from "clsx";
import type { IeltsDocument, IeltsDocumentKind } from "@/lib/ielts.server";

interface TocItem {
  id: string;
  level: 2 | 3 | 4;
  text: string;
}

const kindLabels: Record<IeltsDocumentKind, string> = {
  lesson: "Lesson",
  roadmap: "Roadmap",
  structure: "Structure",
  reference: "Reference",
};

const kindStyles: Record<IeltsDocumentKind, string> = {
  lesson: "bg-emerald-50 text-emerald-700 border-emerald-100",
  roadmap: "bg-amber-50 text-amber-700 border-amber-100",
  structure: "bg-indigo-50 text-indigo-700 border-indigo-100",
  reference: "bg-gray-50 text-gray-700 border-gray-200",
};

function statLabel(document: IeltsDocument): string {
  if (document.kind === "lesson") {
    return `${document.stats.parts} parts · ${document.stats.questions} questions · ${document.stats.retryTasks} retries`;
  }

  return `${document.stats.words.toLocaleString()} words`;
}

function slugifyHeading(text: string): string {
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

function headingId(text: string, level: TocItem["level"]): string {
  return `h${level}-${slugifyHeading(text)}`;
}

function extractToc(content: string): TocItem[] {
  const items: TocItem[] = [];

  for (const match of content.matchAll(/^(##|###|####)\s+(.+)$/gm)) {
    const level = match[1].length as TocItem["level"];
    const text = match[2].replace(/#+\s*$/, "").trim();
    const id = headingId(text, level);

    if (level === 4 && !/^(Question|Retry)\s+\d+/i.test(text)) continue;

    items.push({
      id,
      level,
      text,
    });
  }

  return items;
}

function plainText(children: ReactNode): string {
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

function jumpToSection(event: MouseEvent<HTMLAnchorElement>, id: string) {
  event.preventDefault();
  const target = document.getElementById(id);
  if (!target) return;

  target.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", `#${id}`);
}

export default function IeltsDashboardClient({
  documents,
}: {
  documents: IeltsDocument[];
}) {
  const [activeId, setActiveId] = useState(documents[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<IeltsDocumentKind | "all">("all");

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

  return (
    <div className="mx-auto max-w-[92rem]">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[22rem_minmax(0,1fr)]">
        <aside className="border border-gray-200 bg-white/90 rounded-lg p-3 shadow-sm xl:sticky xl:top-3 xl:max-h-[calc(100vh-1.5rem)] xl:overflow-auto">
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search IELTS content"
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-base text-gray-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {(["all", "lesson", "roadmap", "structure"] as const).map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setKind(item)}
                  className={clsx(
                    "rounded-lg border px-3 py-2 text-sm font-medium transition",
                    kind === item
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50",
                  )}
                >
                  {item === "all" ? "All" : kindLabels[item]}
                </button>
              ),
            )}
          </div>

          <div className="mt-4 space-y-2">
            {filteredDocuments.map((document) => {
              const active = document.id === activeDocument?.id;
              const Icon = document.kind === "roadmap" ? MapIcon : FileText;

              return (
                <button
                  key={document.id}
                  type="button"
                  onClick={() => setActiveId(document.id)}
                  className={clsx(
                    "w-full rounded-lg border p-3 text-left transition",
                    active
                      ? "border-emerald-300 bg-emerald-50 shadow-sm"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={clsx(
                        "mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
                        active
                          ? "border-emerald-200 bg-white text-emerald-700"
                          : "border-gray-200 bg-gray-50 text-gray-500",
                      )}
                    >
                      <Icon size={16} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-base font-semibold text-gray-900">
                        {document.title}
                      </span>
                      <span className="mt-1 block truncate text-sm text-gray-500">
                        {document.relativePath}
                      </span>
                      <span className="mt-2 flex flex-wrap items-center gap-1.5">
                        <span
                          className={clsx(
                            "rounded-full border px-2 py-0.5 text-xs font-medium",
                            kindStyles[document.kind],
                          )}
                        >
                          {kindLabels[document.kind]}
                        </span>
                        <span className="text-xs text-gray-500">
                          {statLabel(document)}
                        </span>
                      </span>
                    </span>
                  </div>
                </button>
              );
            })}

            {!filteredDocuments.length && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-5 text-center text-base text-gray-500">
                No IELTS documents match this filter.
              </div>
            )}
          </div>
        </aside>

        <section className="min-w-0 border border-gray-200 bg-white/90 rounded-lg shadow-sm xl:flex xl:h-[calc(100vh-1.5rem)] xl:flex-col xl:overflow-hidden">
          {activeDocument ? (
            <>
              <div className="sticky top-14 z-20 shrink-0 border-b border-gray-200 bg-white/95 px-4 py-4 backdrop-blur-sm lg:top-0 xl:static">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={clsx(
                      "rounded-full border px-2.5 py-1 text-xs font-semibold",
                      kindStyles[activeDocument.kind],
                    )}
                  >
                    {kindLabels[activeDocument.kind]}
                  </span>
                  <span className="text-sm text-gray-500">
                    {activeDocument.relativePath}
                  </span>
                </div>
                <h2 className="mt-2 text-xl font-bold text-gray-900">
                  {activeDocument.title}
                </h2>
                <p className="mt-1 text-base text-gray-500">
                  {statLabel(activeDocument)} ·{" "}
                  {activeDocument.stats.words.toLocaleString()} words
                </p>
              </div>

              <div
                className={clsx(
                  "grid grid-cols-1 xl:min-h-0 xl:flex-1",
                  tocItems.length > 0 &&
                    "xl:grid-cols-[minmax(0,1fr)_18rem]",
                )}
              >
                <article
                  className={[
                    "lesson-prose prose prose-gray max-w-none p-4 md:p-6 xl:min-h-0 xl:overflow-y-auto",
                    "text-[16px] md:text-[17px] leading-7",
                    "prose-p:text-gray-700 prose-p:leading-7",
                    "prose-headings:text-gray-900 prose-headings:font-semibold prose-headings:scroll-mt-4",
                    "prose-h1:text-[1.6em] prose-h1:mt-0",
                    "prose-h2:text-[1.25em] prose-h2:border-b prose-h2:border-gray-100 prose-h2:pb-2",
                    "prose-h3:text-[1.1em]",
                    "prose-li:text-gray-700",
                    "prose-a:text-emerald-700",
                    "prose-strong:text-gray-900",
                    "prose-code:text-emerald-700 prose-code:bg-emerald-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded",
                    "prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg",
                    "[&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:overflow-visible",
                    "[&_pre_code]:whitespace-pre-wrap [&_pre_code]:break-words",
                    "prose-blockquote:border-l-4 prose-blockquote:border-emerald-400 prose-blockquote:bg-emerald-50/70",
                    "prose-table:text-[0.95em] prose-th:text-gray-700 prose-td:text-gray-700",
                  ].join(" ")}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      h2: ({ children }) => {
                        const text = plainText(children);
                        return (
                          <h2 id={headingId(text, 2)}>
                            {children}
                          </h2>
                        );
                      },
                      h3: ({ children }) => {
                        const text = plainText(children);
                        return (
                          <h3 id={headingId(text, 3)}>
                            {children}
                          </h3>
                        );
                      },
                      h4: ({ children }) => {
                        const text = plainText(children);
                        return (
                          <h4 id={headingId(text, 4)}>
                            {children}
                          </h4>
                        );
                      },
                    }}
                  >
                    {activeDocument.content}
                  </ReactMarkdown>
                </article>

                {tocItems.length > 0 && (
                  <nav className="hidden border-l border-gray-200 bg-gray-50/70 p-4 xl:block">
                    <div className="h-full overflow-auto">
                      <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                        <ListChecks size={15} />
                        Contents
                      </div>
                      <div className="space-y-1">
                        {tocItems.map((item, index) => (
                          <a
                            key={`${item.id}-${index}`}
                            href={`#${item.id}`}
                            onClick={(event) => jumpToSection(event, item.id)}
                            className={clsx(
                              "block rounded-md px-2 py-1.5 text-sm leading-5 transition hover:bg-white hover:text-emerald-700",
                              item.level === 2 &&
                                "font-semibold text-gray-800",
                              item.level === 3 &&
                                "ml-3 text-gray-600",
                              item.level === 4 &&
                                "ml-6 text-gray-500",
                            )}
                          >
                            {item.text}
                          </a>
                        ))}
                      </div>
                    </div>
                  </nav>
                )}
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-base text-gray-500">
              No IELTS content found.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

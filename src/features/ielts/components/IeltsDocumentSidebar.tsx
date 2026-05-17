"use client";

import { FileText, MapIcon, Search } from "lucide-react";
import clsx from "clsx";
import type { IeltsDocument } from "@/lib/ielts.server";
import {
  IELTS_KIND_FILTERS,
  IELTS_KIND_LABELS,
  IELTS_KIND_STYLES,
} from "@/features/ielts/constants";
import type { IeltsKindFilter } from "@/features/ielts/types";
import { statLabel } from "@/features/ielts/utils/markdown";

export function IeltsDocumentSidebar({
  activeDocument,
  documents,
  kind,
  query,
  onDocumentSelect,
  onKindChange,
  onQueryChange,
}: {
  activeDocument?: IeltsDocument;
  documents: IeltsDocument[];
  kind: IeltsKindFilter;
  query: string;
  onDocumentSelect: (id: string) => void;
  onKindChange: (kind: IeltsKindFilter) => void;
  onQueryChange: (query: string) => void;
}) {
  return (
    <aside className="ielts-panel rounded-lg border p-3 shadow-sm xl:sticky xl:top-3 xl:max-h-[calc(100vh-1.5rem)] xl:overflow-auto">
      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search IELTS content"
          className="ielts-input w-full rounded-lg border py-2 pl-9 pr-3 text-base outline-none transition"
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {IELTS_KIND_FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onKindChange(item)}
            className={clsx(
              "rounded-lg border px-3 py-2 text-sm font-medium transition",
              kind === item
                ? "ielts-tab-active"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50",
            )}
          >
            {item === "all" ? "All" : IELTS_KIND_LABELS[item]}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {documents.map((document) => {
          const active = document.id === activeDocument?.id;
          const Icon = document.kind === "roadmap" ? MapIcon : FileText;

          return (
            <button
              key={document.id}
              type="button"
              onClick={() => onDocumentSelect(document.id)}
              className={clsx(
                "w-full rounded-lg border p-3 text-left transition",
                active
                  ? "ielts-doc-active shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50",
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={clsx(
                    "mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
                    active
                      ? "ielts-icon-active"
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
                        IELTS_KIND_STYLES[document.kind],
                      )}
                    >
                      {IELTS_KIND_LABELS[document.kind]}
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

        {!documents.length && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-5 text-center text-base text-gray-500">
            No IELTS documents match this filter.
          </div>
        )}
      </div>
    </aside>
  );
}


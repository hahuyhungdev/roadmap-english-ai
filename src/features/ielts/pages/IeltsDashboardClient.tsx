"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import type { IeltsDocument } from "@/lib/ielts.server";
import { IeltsDocumentViewer } from "@/features/ielts/components/IeltsDocumentViewer";
import { useIeltsDocuments } from "@/features/ielts/hooks/useIeltsDocuments";
import { useIeltsToc } from "@/features/ielts/hooks/useIeltsToc";
import LessonAssistant from "@/features/learning/components/LessonAssistant";

export default function IeltsDashboardClient({
  documents,
}: {
  documents: IeltsDocument[];
}) {
  const articleRef = useRef<HTMLElement | null>(null);
  const [assistantSidebarVisible, setAssistantSidebarVisible] = useState(false);
  const { activeDocument, selectableDocuments, setActiveId, tocItems } =
    useIeltsDocuments(documents);
  const { activeTocId, handleTocClick } = useIeltsToc({
    activeDocumentId: activeDocument?.id,
    articleRef,
    tocItems,
  });

  return (
    <div className="mx-auto w-full max-w-[96rem] min-w-0">
      <div
        className={clsx(
          "grid grid-cols-1 gap-5 xl:gap-6 items-start",
          assistantSidebarVisible &&
            "xl:grid-cols-[minmax(0,1fr)_24rem]",
        )}
      >
        <div
          className={clsx(
            "min-w-0",
            !assistantSidebarVisible && "mx-auto w-full max-w-[70rem]",
          )}
        >
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

        <LessonAssistant
          contextType="ielts"
          contextTitle={activeDocument?.title}
          contextContent={activeDocument?.content}
          desktopPresentation={assistantSidebarVisible ? "sidebar" : "floating"}
          openFloatingAsSidebar
          onCollapseSidebar={() => setAssistantSidebarVisible(false)}
          onRestoreSidebar={() => setAssistantSidebarVisible(true)}
        />
      </div>
    </div>
  );
}

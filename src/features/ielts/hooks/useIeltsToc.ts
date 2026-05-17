import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent, RefObject } from "react";
import type { TocItem } from "@/features/ielts/types";

function currentTocId(container: HTMLElement, tocItems: TocItem[]): string {
  const containerTop = container.getBoundingClientRect().top;
  let currentId = tocItems[0]?.id ?? "";

  for (const item of tocItems) {
    const heading = document.getElementById(item.id);
    if (!heading) continue;

    const top = heading.getBoundingClientRect().top - containerTop;
    if (top <= 96) {
      currentId = item.id;
    } else {
      break;
    }
  }

  return currentId;
}

export function useIeltsToc({
  activeDocumentId,
  articleRef,
  tocItems,
}: {
  activeDocumentId?: string;
  articleRef: RefObject<HTMLElement | null>;
  tocItems: TocItem[];
}) {
  const [activeTocId, setActiveTocId] = useState("");
  const pendingTargetIdRef = useRef("");

  useEffect(() => {
    pendingTargetIdRef.current = "";
    setActiveTocId(tocItems[0]?.id ?? "");
    articleRef.current?.scrollTo({ top: 0 });
  }, [activeDocumentId, articleRef, tocItems]);

  useEffect(() => {
    const container = articleRef.current;
    if (!container || tocItems.length === 0) return;

    const updateActiveToc = () => {
      const nextId = currentTocId(container, tocItems);
      const pendingTargetId = pendingTargetIdRef.current;

      if (pendingTargetId) {
        if (nextId === pendingTargetId) {
          pendingTargetIdRef.current = "";
          setActiveTocId(nextId);
        }
        return;
      }

      setActiveTocId(nextId);
    };

    updateActiveToc();
    container.addEventListener("scroll", updateActiveToc, { passive: true });
    return () => container.removeEventListener("scroll", updateActiveToc);
  }, [activeDocumentId, articleRef, tocItems]);

  const handleTocClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, id: string) => {
      event.preventDefault();
      const target = document.getElementById(id);
      if (!target) return;

      pendingTargetIdRef.current = id;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `#${id}`);
    },
    [],
  );

  return { activeTocId, handleTocClick };
}


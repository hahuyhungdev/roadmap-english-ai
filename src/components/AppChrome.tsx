"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import LayoutNav from "@/components/LayoutNav";
import AppSidebar from "@/components/AppSidebar";
import NotePanel from "@/features/notes/NotePanel";

const SIDEBAR_COLLAPSED_KEY = "sidebar-collapsed";

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const isWideRoute = pathname === "/ielts";

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
      setCollapsed(saved === "1");
    } catch {
      // ignore
    }

    const onStorage = (e: StorageEvent) => {
      if (e.key === SIDEBAR_COLLAPSED_KEY) {
        setCollapsed(e.newValue === "1");
      }
    };

    const onSidebarChanged = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      setCollapsed(Boolean(customEvent.detail));
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener(
      "sidebar:collapsed-changed",
      onSidebarChanged as EventListener,
    );
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(
        "sidebar:collapsed-changed",
        onSidebarChanged as EventListener,
      );
    };
  }, []);

  return (
    <div className="relative z-10">
      <div className="hidden lg:block">
        <AppSidebar />
      </div>

      <div
        className={[
          "min-h-screen flex flex-col min-w-0 transition-[margin-left] duration-200 ease-out",
          collapsed ? "lg:ml-20" : "lg:ml-64",
        ].join(" ")}
      >
        <div className="lg:hidden">
          <LayoutNav />
        </div>
        <main
          className={[
            "flex-1 w-full px-2 py-2",
            isWideRoute ? "max-w-none" : "sm:px-6 max-w-[96rem] mx-auto",
          ].join(" ")}
        >
          {children}
        </main>
      </div>
      <NotePanel />
    </div>
  );
}

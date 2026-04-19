"use client";

import { useEffect, useState } from "react";

const THEME_MODE_KEY = "theme-mode";
const THEME_CHANGED_EVENT = "theme:changed";

function resolveDarkFromStorage(saved: string | null): boolean {
  if (saved === "dark") return true;
  if (saved === "light") return false;
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyThemeClass(nextDark: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("theme-dark", nextDark);
  document.documentElement.setAttribute(
    "data-mantine-color-scheme",
    nextDark ? "dark" : "light",
  );
}

export function useThemeMode() {
  const [isDark, setIsDark] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(THEME_MODE_KEY);
      const dark = resolveDarkFromStorage(saved);
      setIsDark(dark);
      applyThemeClass(dark);
    } catch {
      // ignore
    } finally {
      setReady(true);
    }

    const onStorage = (event: StorageEvent) => {
      if (event.key !== THEME_MODE_KEY) return;
      const nextDark = resolveDarkFromStorage(event.newValue);
      setIsDark(nextDark);
      applyThemeClass(nextDark);
    };

    const onThemeChanged = (event: Event) => {
      const custom = event as CustomEvent<{ isDark?: boolean }>;
      if (typeof custom.detail?.isDark !== "boolean") return;
      const nextDark = custom.detail.isDark;
      setIsDark(nextDark);
      applyThemeClass(nextDark);
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener(THEME_CHANGED_EVENT, onThemeChanged as EventListener);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(
        THEME_CHANGED_EVENT,
        onThemeChanged as EventListener,
      );
    };
  }, []);

  const toggleTheme = () => {
    const nextDark =
      typeof document !== "undefined"
        ? !document.documentElement.classList.contains("theme-dark")
        : !isDark;
    setIsDark(nextDark);
    applyThemeClass(nextDark);
    try {
      window.localStorage.setItem(THEME_MODE_KEY, nextDark ? "dark" : "light");
      window.dispatchEvent(
        new CustomEvent(THEME_CHANGED_EVENT, { detail: { isDark: nextDark } }),
      );
    } catch {
      // ignore
    }
  };

  return { isDark, toggleTheme, ready };
}

const LESSON_PATH_RE = /^\/phase\/[^/]+\/session\/([^/?#]+)/;

export function extractSessionSlug(pathname: string): string | null {
  const match = LESSON_PATH_RE.exec(pathname);
  if (!match?.[1]) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

export function formatSavedTime(isoDate: string | null): string {
  if (!isoDate) return "Not saved yet";
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return "Saved";
  return `Saved at ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}


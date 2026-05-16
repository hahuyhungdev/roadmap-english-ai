import fs from "fs";
import path from "path";

export type IeltsDocumentKind = "lesson" | "roadmap" | "structure" | "reference";

export interface IeltsDocument {
  id: string;
  title: string;
  kind: IeltsDocumentKind;
  relativePath: string;
  content: string;
  stats: {
    parts: number;
    words: number;
    questions: number;
    retryTasks: number;
  };
}

const IELTS_DIR = path.join(process.cwd(), "ielts");
const IELTS_TOPICS_DIR = path.join(IELTS_DIR, "topics");

function readMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((fileName) => fileName.endsWith(".md"))
    .sort()
    .map((fileName) => path.join(dir, fileName));
}

function extractTitle(content: string, fallback: string): string {
  const heading = content.match(/^#\s+(.+)$/m)?.[1]?.trim();
  if (heading) return heading;

  return fallback
    .replace(/\.md$/, "")
    .replace(/^\d+-/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function documentKind(filePath: string): IeltsDocumentKind {
  if (filePath.includes(`${path.sep}topics${path.sep}`)) return "lesson";
  if (filePath.endsWith(`${path.sep}topic-roadmap.md`)) return "roadmap";
  if (filePath.endsWith(`${path.sep}structure.md`)) return "structure";
  return "reference";
}

function toDocument(filePath: string): IeltsDocument {
  const content = fs.readFileSync(filePath, "utf-8").trim();
  const relativePath = path.relative(process.cwd(), filePath);
  const fileName = path.basename(filePath);
  const id = relativePath.replace(/\.md$/, "").replace(/[\\/]/g, "-");
  const words = content.split(/\s+/).filter(Boolean).length;

  return {
    id,
    title: extractTitle(content, fileName),
    kind: documentKind(filePath),
    relativePath,
    content,
    stats: {
      parts: [...content.matchAll(/^##\s+Part\s+\d+/gim)].length,
      words,
      questions: [...content.matchAll(/^####\s+Question\s+\d+/gim)].length,
      retryTasks: [...content.matchAll(/^####\s+Retry\s+\d+/gim)].length,
    },
  };
}

export function loadIeltsDocuments(): IeltsDocument[] {
  const rootDocs = readMarkdownFiles(IELTS_DIR);
  const topicDocs = readMarkdownFiles(IELTS_TOPICS_DIR);

  return [...topicDocs, ...rootDocs].map(toDocument).sort((a, b) => {
    const kindOrder: Record<IeltsDocumentKind, number> = {
      lesson: 0,
      roadmap: 1,
      structure: 2,
      reference: 3,
    };

    const kindDiff = kindOrder[a.kind] - kindOrder[b.kind];
    if (kindDiff !== 0) return kindDiff;
    return a.relativePath.localeCompare(b.relativePath);
  });
}

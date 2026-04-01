/**
 * Seed English sessions from content/*.md into the database.
 * Run: node scripts/seed_sessions.mjs
 *
 * Safe to re-run — uses INSERT ... ON CONFLICT DO UPDATE (upsert).
 */

import { neon } from "@neondatabase/serverless";
import { readFileSync, readdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// ── Load DATABASE_URL ────────────────────────────────────────────────────────
let DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  const envPath = resolve(root, ".env.local");
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, "utf-8").split("\n")) {
      const m = line.match(/^DATABASE_URL\s*=\s*(.+)/);
      if (m) {
        DATABASE_URL = m[1].trim().replace(/^["']|["']$/g, "");
        break;
      }
    }
  }
}
if (!DATABASE_URL) {
  console.error(
    "❌  DATABASE_URL not found. Set it in .env.local or environment.",
  );
  process.exit(1);
}

const sql = neon(DATABASE_URL);

// ── Parse frontmatter ────────────────────────────────────────────────────────
function parseFrontmatter(raw) {
  const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!fmMatch) return { meta: {}, body: raw };

  const yaml = fmMatch[1];
  const body = fmMatch[2].trim();
  const meta = {};

  for (const key of ["title", "topic", "phase", "level", "description"]) {
    const m = yaml.match(new RegExp(`^${key}:\\s*(.*)$`, "m"));
    if (m) meta[key] = m[1].trim();
  }
  const sn = yaml.match(/^sessionNumber:\s*(.*)$/m);
  if (sn) meta.sessionNumber = parseInt(sn[1].trim(), 10) || 0;

  return { meta, body };
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const contentDir = resolve(root, "content");
  const files = readdirSync(contentDir)
    .filter((f) => f.endsWith(".md"))
    .sort();

  console.log(`📚  Found ${files.length} session files…`);

  const sessions = [];
  for (const file of files) {
    const slug = file.replace(".md", "");
    const raw = readFileSync(resolve(contentDir, file), "utf-8");
    const { meta, body } = parseFrontmatter(raw);

    if (!meta.title || !meta.phase) {
      console.warn(`  ⚠️  ${file} missing title or phase — skipping`);
      continue;
    }
    sessions.push({ slug, meta, body });
  }

  // Build single multi-row upsert to avoid multiple round-trips (Neon cold-start)
  const values = sessions
    .map(
      ({ slug, meta, body }) =>
        `(${[
          slug,
          meta.sessionNumber ?? 0,
          meta.title,
          meta.topic ?? meta.title,
          meta.phase,
          meta.level ?? null,
          meta.description ?? null,
          body,
        ]
          .map((v) =>
            v === null ? "NULL" : `$$${String(v).replace(/\$\$/g, "$\\$")}$$`,
          )
          .join(", ")}, now())`,
    )
    .join(",\n  ");

  const query = `
    INSERT INTO english_sessions
      (slug, session_number, title, topic, phase, level, description, content_md, synced_at)
    VALUES
      ${values}
    ON CONFLICT (slug) DO UPDATE SET
      session_number = EXCLUDED.session_number,
      title          = EXCLUDED.title,
      topic          = EXCLUDED.topic,
      phase          = EXCLUDED.phase,
      level          = EXCLUDED.level,
      description    = EXCLUDED.description,
      content_md     = EXCLUDED.content_md,
      synced_at      = now()
  `;

  console.log("  Upserting all sessions in one query…");
  await sql.query(query);

  for (const { slug, meta } of sessions) {
    console.log(`  ✅  ${slug}: ${meta.title}`);
  }
  console.log(`\n✨  Done — ${sessions.length} sessions synced to DB.`);
}

main().catch((err) => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});

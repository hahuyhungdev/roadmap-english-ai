import { drizzle as drizzleNode } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const rawDatabaseUrl = process.env.DATABASE_URL;

if (!rawDatabaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

function stripSchemaQueryParam(url: string): string {
  const parsed = new URL(url);
  if (parsed.searchParams.has("schema")) {
    parsed.searchParams.delete("schema");
  }
  return parsed.toString();
}

const databaseUrl = stripSchemaQueryParam(rawDatabaseUrl);

export const db = drizzleNode(new Pool({ connectionString: databaseUrl }), {
  schema,
});

/** Retry a db call up to `retries` times with exponential backoff.
 * Handles Neon serverless cold-start failures gracefully. */
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 4,
  delayMs = 1000,
): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (i < retries)
        await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
    }
  }
  throw lastErr;
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { lessonProgress } from "@/lib/schema";
import { eq } from "drizzle-orm";

/**
 * GET /api/progress
 * Returns slugs of all sessions marked done: { done: string[] }
 */
export async function GET() {
  try {
    const rows = await db.select().from(lessonProgress);
    const done = rows
      .filter((r) => r.done === "true")
      .map((r) => r.sessionSlug);
    return NextResponse.json({ done });
  } catch (err) {
    console.error("[progress GET]", err);
    return NextResponse.json({ done: [] });
  }
}

/**
 * POST /api/progress
 * Body: { sessionSlug: string }
 * Toggles done state. Returns { sessionSlug, done: boolean }
 */
export async function POST(req: Request) {
  try {
    const { sessionSlug } = (await req.json()) as { sessionSlug?: string };
    if (!sessionSlug) {
      return NextResponse.json(
        { error: "sessionSlug required" },
        { status: 400 },
      );
    }

    const existing = await db
      .select()
      .from(lessonProgress)
      .where(eq(lessonProgress.sessionSlug, sessionSlug));

    const newDone = existing[0]?.done !== "true";

    await db
      .insert(lessonProgress)
      .values({
        sessionSlug,
        done: newDone ? "true" : "false",
        doneAt: newDone ? new Date() : null,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: lessonProgress.sessionSlug,
        set: {
          done: newDone ? "true" : "false",
          doneAt: newDone ? new Date() : null,
          updatedAt: new Date(),
        },
      });

    return NextResponse.json({ sessionSlug, done: newDone });
  } catch (err) {
    console.error("[progress POST]", err);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 },
    );
  }
}

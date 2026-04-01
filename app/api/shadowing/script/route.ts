import { NextRequest, NextResponse } from "next/server";
import { getCachedScript, cacheScript } from "../../../../src/lib/cache";

// POST: Parse script text into sentences and cache the result
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const scriptText = (body.script ?? "").trim();
    const sentences = body.sentences;

    if (!scriptText) {
      return NextResponse.json(
        { error: "script text is required" },
        { status: 400 },
      );
    }

    // If sentences provided, cache them
    if (Array.isArray(sentences) && sentences.length > 0) {
      await cacheScript(scriptText, sentences);
      return NextResponse.json({ cached: true });
    }

    // Otherwise, check if we have a cached version
    const cached = await getCachedScript(scriptText).catch(() => null);
    if (cached) {
      return NextResponse.json({ sentences: cached, source: "cache" });
    }

    return NextResponse.json({ sentences: null, source: "none" });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to process script" },
      { status: 500 },
    );
  }
}

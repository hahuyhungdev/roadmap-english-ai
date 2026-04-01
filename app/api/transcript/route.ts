import { NextResponse } from "next/server";
import { cleanTranscriptWithTimestamps } from "../../../src/lib/transcriptCleaner";

// ─── POST: Clean/re-segment raw transcript with AI ─────────────────────────
export async function POST(req: Request) {
  try {
    let body: any = null;
    try {
      body = await req.json();
    } catch {
      // ignore
    }

    let raw: string | null = body?.raw ?? null;
    if (!raw) {
      raw = (await req.text()) || null;
    }

    if (!raw || typeof raw !== "string" || raw.trim().length === 0) {
      return NextResponse.json(
        { error: "Missing `raw` transcript in request body" },
        { status: 400 },
      );
    }

    const model = body?.model ?? undefined;
    const url = body?.url ?? undefined;
    const segments = await cleanTranscriptWithTimestamps(raw, { model, url });

    return NextResponse.json({ segments });
  } catch (err: any) {
    const msg = err?.message ?? String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

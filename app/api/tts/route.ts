import { NextRequest, NextResponse } from "next/server";
import { callGoogleTTS, GOOGLE_TTS_CONFIG } from "../../lib/googleTtsClient";

// ─── Route Handler ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const apiKey = process.env.GOOGLE_TTS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing GOOGLE_TTS_API_KEY" },
      { status: 500 },
    );
  }

  try {
    const body = await req.json();
    const text = (body.text ?? "").trim();
    const voiceName: string = body.voice ?? "en-US-Chirp3-HD-Charon";

    if (!text) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    const audioContent = await callGoogleTTS(apiKey, text, voiceName);
    return NextResponse.json({ audioContent });
  } catch (err: any) {
    const message = err?.message || "Failed to call Google TTS";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

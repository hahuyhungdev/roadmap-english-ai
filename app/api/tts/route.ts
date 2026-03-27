import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.GOOGLE_TTS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing GOOGLE_TTS_API_KEY" },
      { status: 500 },
    );
  }

  const body = await req.json();
  const text = (body.text ?? "").trim();
  const voice: string = body.voice ?? "en-US-Neural2-F";
  const speed: number = typeof body.speed === "number" ? body.speed : 1.0;

  if (!text) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: { text },
          voice: { languageCode: "en-US", name: voice },
          audioConfig: {
            audioEncoding: "MP3",
            speakingRate: Math.min(Math.max(speed, 0.25), 4.0),
          },
        }),
      },
    );

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { error: data?.error?.message || "Google TTS request failed" },
        { status: res.status },
      );
    }

    if (!data.audioContent) {
      return NextResponse.json(
        { error: "No audio content returned" },
        { status: 502 },
      );
    }

    return NextResponse.json({ audioContent: data.audioContent as string });
  } catch {
    return NextResponse.json(
      { error: "Failed to call Google TTS" },
      { status: 500 },
    );
  }
}

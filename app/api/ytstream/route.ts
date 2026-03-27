import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "Missing 'url' query parameter" },
      { status: 400 },
    );
  }

  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/,
  );
  if (!match) {
    return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
  }
  const videoId = match[1];

  try {
    const videoPage = await fetch(
      `https://www.youtube.com/watch?v=${videoId}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
        },
        signal: AbortSignal.timeout(10000),
      },
    );

    if (!videoPage.ok) {
      return NextResponse.json(
        { error: `YouTube page returned ${videoPage.status}` },
        { status: 502 },
      );
    }

    const html = await videoPage.text();

    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    const title = titleMatch
      ? titleMatch[1].replace(" - YouTube", "").trim()
      : "";

    let streamingData: {
      formats?: Array<{
        url?: string;
        mimeType?: string;
        audioBitrate?: string | number;
      }>;
      adaptiveFormats?: Array<{
        url?: string;
        mimeType?: string;
        audioBitrate?: string | number;
      }>;
    } | null = null;

    // Try to parse ytInitialPlayerResponse
    const jsonBlock = html.match(
      /ytInitialPlayerResponse\s*=\s*(\{.*?\})\s*;?\s*<script/,
    );
    if (jsonBlock) {
      try {
        const parsed = JSON.parse(jsonBlock[1]) as {
          streamingData?: typeof streamingData;
        };
        streamingData = parsed.streamingData ?? null;
      } catch {
        // JSON parse failed
      }
    }

    // Fallback: extract streaming data via regex
    if (!streamingData) {
      const streamMatch = html.match(/"streamingData":\s*(\{[^]{1,5000}\})/);
      if (streamMatch) {
        try {
          streamingData = JSON.parse(streamMatch[1]);
        } catch {
          streamingData = null;
        }
      }
    }

    // Fallback: innertube API
    if (!streamingData) {
      const apiResponse = await fetch(
        `https://www.youtube.com/youtubei/v1/player?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
          body: JSON.stringify({
            videoId,
            playbackContext: {
              contentPlaybackContext: {
                hostLanguage: "en",
                playbackUri: `https://www.youtube.com/watch?v=${videoId}`,
              },
            },
          }),
          signal: AbortSignal.timeout(10000),
        },
      );

      if (apiResponse.ok) {
        const apiData = (await apiResponse.json()) as {
          streamingData?: typeof streamingData;
        };
        streamingData = apiData.streamingData ?? null;
      }
    }

    if (!streamingData) {
      return NextResponse.json(
        { error: "Could not extract streaming data from YouTube" },
        { status: 502 },
      );
    }

    const allFormats = [
      ...(streamingData.formats || []),
      ...(streamingData.adaptiveFormats || []),
    ];

    const audioFormats = allFormats
      .filter((f) => f.url && f.mimeType?.includes("audio"))
      .sort(
        (a, b) => (Number(b.audioBitrate) || 0) - (Number(a.audioBitrate) || 0),
      );

    const best = audioFormats[0];
    if (!best?.url) {
      return NextResponse.json(
        { error: "No audio stream URL found for this video" },
        { status: 502 },
      );
    }

    return NextResponse.json({ audioUrl: best.url, title });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Server error: ${message}` },
      { status: 500 },
    );
  }
}

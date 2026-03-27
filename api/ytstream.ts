import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Fetch YouTube audio stream URL server-side.
 * Bypasses CORS by running on the server — no third-party API needed.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { url } = req.query;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Missing 'url' query parameter" });
  }

  // Extract video ID
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/,
  );
  if (!match) {
    return res.status(400).json({ error: "Invalid YouTube URL" });
  }
  const videoId = match[1];

  try {
    // Step 1: Get video info page to extract player response URL
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
      return res.status(502).json({ error: `YouTube page returned ${videoPage.status}` });
    }

    const html = await videoPage.text();

    // Extract video title
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    const title = titleMatch ? titleMatch[1].replace(" - YouTube", "").trim() : "";

    // Find the player response JSON inside the page
    const playerResponseMatch = html.match(
      /"playabilityStatus":\{[^}]*\}[^}]*"streamingData":\{[^}]+\}/,
    );

    let streamingData: {
      formats?: Array<{ url?: string; mimeType?: string; audioBitrate?: string | number }>;
      adaptiveFormats?: Array<{ url?: string; mimeType?: string; audioBitrate?: string | number }>;
    } | null = null;

    if (playerResponseMatch) {
      try {
        // Try to parse as JSON by extracting a broader block
        const jsonBlock = html.match(
          /ytInitialPlayerResponse\s*=\s*(\{.*?\})\s*;?\s*<script/,
        );
        if (jsonBlock) {
          const parsed = JSON.parse(jsonBlock[1]) as {
            streamingData?: {
              formats?: Array<{ url?: string; mimeType?: string; audioBitrate?: string | number }>;
              adaptiveFormats?: Array<{ url?: string; mimeType?: string; audioBitrate?: string | number }>;
            };
          };
          streamingData = parsed.streamingData ?? null;
        }
      } catch {
        // JSON parse failed, try alternate extraction
      }
    }

    // Fallback: extract streaming data via regex if JSON parse failed
    if (!streamingData) {
      const streamMatch = html.match(
        /"streamingData":\s*(\{[^]{1,5000}\})/,
      );
      if (streamMatch) {
        try {
          streamingData = JSON.parse(streamMatch[1]);
        } catch {
          streamingData = null;
        }
      }
    }

    if (!streamingData) {
      // Try fetching the innertube API directly
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
        const apiData = await apiResponse.json() as {
          streamingData?: {
            formats?: Array<{ url?: string; mimeType?: string; audioBitrate?: string | number }>;
            adaptiveFormats?: Array<{ url?: string; mimeType?: string; audioBitrate?: string | number }>;
          };
        };
        streamingData = apiData.streamingData ?? null;
      }
    }

    if (!streamingData) {
      return res.status(502).json({ error: "Could not extract streaming data from YouTube" });
    }

    const allFormats = [
      ...(streamingData.formats || []),
      ...(streamingData.adaptiveFormats || []),
    ];

    // Find best audio-only URL
    const audioFormats = allFormats
      .filter((f) => f.url && f.mimeType?.includes("audio"))
      .sort(
        (a, b) =>
          (Number(b.audioBitrate) || 0) - (Number(a.audioBitrate) || 0),
      );

    const best = audioFormats[0];
    if (!best?.url) {
      return res.status(502).json({ error: "No audio stream URL found for this video" });
    }

    return res.status(200).json({
      audioUrl: best.url,
      title,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: `Server error: ${message}` });
  }
}

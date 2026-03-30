/**
 * Shared Google TTS Client — Reusable across routes
 *
 * Configuration optimized for shadowing/speech practice:
 * - Chirp3-HD voices (highest quality, no SSML/speakingRate support)
 * - effectsProfileId: headphone-class-device (richer audio)
 * - Speed control: handled via Web Audio API playbackRate, NOT API parameter
 */

export const GOOGLE_TTS_CONFIG = {
  audioEncoding: "MP3" as const,
  effectsProfileId: ["headphone-class-device"], // richer audio
};

/**
 * Call Google TTS API directly (server-side only)
 *
 * Usage: In Next.js route handlers where GOOGLE_TTS_API_KEY is available
 * Note: Chirp3-HD does NOT support speakingRate, pitch, or SSML in audioConfig.
 *       Speed control handled on client-side via Web Audio API playbackRate.
 */
export async function callGoogleTTS(
  apiKey: string,
  text: string,
  voiceName: string,
): Promise<string> {
  const res = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: { text },
        voice: {
          languageCode: "en-US",
          name: voiceName,
        },
        audioConfig: {
          audioEncoding: GOOGLE_TTS_CONFIG.audioEncoding,
          effectsProfileId: GOOGLE_TTS_CONFIG.effectsProfileId,
        },
      }),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || "Google TTS request failed");
  }

  if (!data.audioContent) {
    throw new Error("No audio content returned from Google TTS");
  }

  return data.audioContent as string;
}

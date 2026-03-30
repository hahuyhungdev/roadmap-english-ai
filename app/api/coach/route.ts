import { NextRequest, NextResponse } from "next/server";
import { callGoogleTTS } from "../../lib/googleTtsClient";

type ChatRole = "system" | "user" | "assistant";
type ChatMessage = { role: ChatRole; content: string };

type Review = {
  original_transcript?: string;
  corrected_version?: string;
  explanation?: string;
  better_alternatives?: string[];
};

function normalizeSpacedTranscript(text: string): string {
  if (!text) return text;
  let s = text.replace(/\s+/g, " ").trim();
  s = s.replace(/\s+([.,!?;:])/g, "$1");
  s = s.replace(/\b(?:([A-Za-z])\s+){1,}([A-Za-z])\b/g, (m) => {
    return m.replace(/\s+/g, "");
  });
  s = s
    .split(" ")
    .reduce((acc: string[], tok) => {
      const prev = acc[acc.length - 1];
      const raw = tok.replace(/[.,!?;:]$/g, "");
      if (
        prev &&
        prev.replace(/[.,!?;:]$/g, "").length >= 3 &&
        raw.length <= 1 &&
        /^[A-Za-z]+$/.test(raw)
      ) {
        acc[acc.length - 1] =
          prev + raw + (/[.,!?;:]$/.test(tok) ? tok.slice(-1) : "");
      } else {
        acc.push(tok);
      }
      return acc;
    }, [] as string[])
    .join(" ");
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

const COACH_SYSTEM_PROMPT = `You are an English Speaking Coach. Listen to the transcript below and respond naturally like a human partner. Provide conversational feedback and, when appropriate, include a JSON "Review" block inside a fenced code block with the language label 'review' exactly as shown. The Review must contain these fields: original_transcript, corrected_version, explanation, better_alternatives.

Example of the Review block (must be a single JSON object):
\`\`\`review
{
  "original_transcript": "...",
  "corrected_version": "...",
  "explanation": "...",
  "better_alternatives": ["...","..."]
}
\`\`\`

If the user's speech is already natural and fluent, skip the Review block and respond conversationally.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing DEEPSEEK_API_KEY" },
      { status: 500 },
    );
  }

  const body = await req.json();
  const transcript = (body.transcript ?? "").trim();
  const history: ChatMessage[] = Array.isArray(body.history)
    ? body.history
    : [];
  const topic = (body.topic ?? "").trim();
  const lessonContent = (body.lessonContent ?? "").trim();

  if (!transcript) {
    return NextResponse.json(
      { error: "transcript is required" },
      { status: 400 },
    );
  }

  const topicLine = topic ? `Current topic: ${topic}\n` : "";

  const messages: ChatMessage[] = [
    { role: "system", content: COACH_SYSTEM_PROMPT },
  ];

  if (lessonContent) {
    messages.push({
      role: "system",
      content: `Lesson context (use this to guide your feedback and follow-up questions):\n${lessonContent.slice(0, 4000)}`,
    });
  }

  if (history.length) {
    messages.push(...history);
  }

  messages.push({
    role: "user",
    content: `${topicLine}User's most recent speech:\n"${transcript}"\n\nRespond as their English coach.`,
  });

  const model = process.env.DEEPSEEK_MODEL || "deepseek-chat";

  try {
    const upstream = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, temperature: 0.6, messages }),
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      const errMsg =
        data?.error?.message ||
        data?.message ||
        JSON.stringify(data) ||
        "DeepSeek API request failed";
      return NextResponse.json({ error: errMsg }, { status: upstream.status });
    }

    const reply = data?.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return NextResponse.json(
        { error: "Empty response from DeepSeek" },
        { status: 502 },
      );
    }

    // Extract review JSON from fenced code block ```review ... ```
    const reviewMatch = reply.match(/```review\s*([\s\S]*?)\s*```/i);
    let reviewObj: Review | undefined = undefined;
    if (reviewMatch) {
      try {
        reviewObj = JSON.parse(reviewMatch[1]) as Review;
      } catch {
        // ignore parse error
      }
    }

    let audioContent: string | undefined = undefined;
    const googleApiKey = process.env.GOOGLE_TTS_API_KEY;
    const ttsInputRaw = reply.replace(/```review[\s\S]*?```/g, "").trim() || "";
    const ttsInput = normalizeSpacedTranscript(ttsInputRaw);
    if (ttsInput && googleApiKey) {
      try {
        // Use shared Google TTS client (imported at top)
        audioContent = await callGoogleTTS(
          googleApiKey,
          ttsInput,
          "en-US-Chirp3-HD-Charon",
        );
      } catch (err) {
        console.warn("TTS request error", err);
      }
    }

    return NextResponse.json({ reply, review: reviewObj, audioContent });
  } catch {
    return NextResponse.json(
      { error: "Failed to call DeepSeek API" },
      { status: 500 },
    );
  }
}

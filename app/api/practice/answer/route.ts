import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { practiceAnswers } from "@/lib/schema";
import { callGoogleTTS } from "../../../lib/googleTtsClient";

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

type Feedback = {
  corrected_version?: string;
  explanation?: string;
  better_alternatives?: string[];
};

function buildCoachSystemPrompt(question: string): string {
  return `You are an English Speaking Coach helping a Vietnamese software engineer (B1–B2 level) practice answering interview questions in English.

The learner is answering this specific question:
"${question}"

After they speak, you should:
1. Respond naturally as a conversational partner — acknowledge what they said, maybe ask a follow-up or add a comment.
2. If their English needs improvement, include a Review block in your response.
3. Keep your reply SHORT (3–6 sentences). Don't lecture.

Include a "review" code block with JSON if there are grammar, vocabulary, or clarity issues worth fixing:
\`\`\`review
{
  "corrected_version": "...",
  "explanation": "...",
  "better_alternatives": ["...", "..."]
}
\`\`\`

Skip the review block if their speech was already natural and clear.`;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing DEEPSEEK_API_KEY" }, { status: 500 });
  }

  const body = await req.json();
  const transcript: string = (body.transcript ?? "").trim();
  const questionId: string = (body.questionId ?? "").trim();
  const questionText: string = (body.questionText ?? "").trim();
  const sessionSlug: string = (body.sessionSlug ?? "").trim();
  const history: ChatMessage[] = Array.isArray(body.history) ? body.history : [];

  if (!transcript || !questionId || !questionText) {
    return NextResponse.json(
      { error: "transcript, questionId, and questionText are required" },
      { status: 400 },
    );
  }

  const model = process.env.DEEPSEEK_MODEL || "deepseek-chat";

  const messages: ChatMessage[] = [
    { role: "system", content: buildCoachSystemPrompt(questionText) },
    ...history.slice(-6),
    {
      role: "user",
      content: `My answer: "${transcript}"\n\nPlease respond as my English coach.`,
    },
  ];

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
      return NextResponse.json(
        { error: data?.error?.message ?? "AI API error" },
        { status: upstream.status },
      );
    }

    const rawContent: string = data.choices?.[0]?.message?.content ?? "";

    // Parse review block
    const reviewMatch = rawContent.match(/```review\s*([\s\S]*?)```/);
    let feedback: Feedback | undefined;
    let replyText = rawContent.replace(/```review[\s\S]*?```/g, "").trim();

    if (reviewMatch) {
      try {
        feedback = JSON.parse(reviewMatch[1].trim()) as Feedback;
      } catch {
        feedback = undefined;
      }
    }

    // Save answer to DB (best-effort, don't fail request if this fails)
    if (sessionSlug && questionId) {
      db.insert(practiceAnswers)
        .values({
          sessionSlug,
          questionId,
          transcript,
          feedback: feedback ?? null,
        })
        .catch(() => {});
    }

    // TTS for coach reply
    let audioContent: string | undefined;
    try {
      const googleApiKey = process.env.GOOGLE_TTS_API_KEY;
      if (googleApiKey) {
        const voiceName = process.env.GOOGLE_TTS_VOICE || "en-US-Chirp3-HD-Fenrir";
        audioContent = await callGoogleTTS(googleApiKey, replyText, voiceName, 1.0);
      }
    } catch {
      audioContent = undefined;
    }

    return NextResponse.json({
      reply: replyText,
      review: feedback,
      audioContent,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

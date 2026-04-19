import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { practiceQuestionSets } from "@/lib/schema";
import { eq } from "drizzle-orm";

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

const LEARNER_PROFILE = `
Target learner:
- 25-27-year-old Vietnamese software engineer
- Preparing for interviews at foreign tech companies  
- B1–B2 English level (IELTS 6.0–7.0)
- Frontend-focused (React, TypeScript, UI/UX, accessibility)
- 3–4 years experience, applying to senior positions
`;

function buildSystemPrompt(): string {
  return `You are an English speaking coach for software engineers preparing for foreign-company interviews.
Your task is to generate discussion/interview practice questions WITH full coaching content.

${LEARNER_PROFILE}

Important context:
- Not every session is IT-focused.
- Some sessions are about real life, emotions, and personal decisions.
- Match language and examples to the specific lesson topic.
- For non-IT topics, do NOT force technical terms.

Generate 10–14 Q&A coaching cards about the given lesson topic.

For EACH question provide:
1. "framework" — 1-2 sentences explaining HOW to structure the answer (e.g. STAR method, Problem-Solution-Result, Compare-Contrast). Be specific and actionable.
2. "keyPoints" — 3-5 bullet-point ideas the learner should mention. Short phrases, not full sentences.
3. "samples" — exactly 2 model answers:
   - First: a simpler, shorter answer (3-4 sentences, B1 level)
   - Second: a richer, more detailed answer (5-6 sentences, B2 level with specific example)

Group questions into 3–4 labeled groups:
- "Experience & Daily Work"
- "Challenges & Trade-offs"
- "Critical Thinking"
- "Future & Big Picture"

Return JSON only, no markdown. Format:
{
  "groups": [
    {
      "label": "Experience & Daily Work",
      "questions": [
        {
          "id": "q1",
          "text": "...",
          "framework": "Use the STAR method: describe the Situation briefly, your Task, the Actions you took, and the Result.",
          "keyPoints": ["Specific tool or technology used", "Challenge you faced", "Outcome or lesson learned"],
          "samples": [
            "Simpler answer here...",
            "More detailed answer with specific example here..."
          ]
        }
      ]
    }
  ]
}`;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionSlug = searchParams.get("sessionSlug");

  if (!sessionSlug) {
    return NextResponse.json({ error: "sessionSlug is required" }, { status: 400 });
  }

  const existing = await db
    .select()
    .from(practiceQuestionSets)
    .where(eq(practiceQuestionSets.sessionSlug, sessionSlug))
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json({ questions: existing[0].questions, cached: true });
  }

  return NextResponse.json({ questions: null, cached: false });
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing DEEPSEEK_API_KEY" }, { status: 500 });
  }

  const body = await req.json();
  const sessionSlug: string = (body.sessionSlug ?? "").trim();
  const lessonTitle: string = (body.lessonTitle ?? "").trim();
  const lessonContent: string = (body.lessonContent ?? "").trim();
  const force: boolean = body.force === true;

  if (!sessionSlug || !lessonTitle) {
    return NextResponse.json({ error: "sessionSlug and lessonTitle are required" }, { status: 400 });
  }

  // Check cache first (unless force refresh)
  if (!force) {
    const existing = await db
      .select()
      .from(practiceQuestionSets)
      .where(eq(practiceQuestionSets.sessionSlug, sessionSlug))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ questions: existing[0].questions, cached: true });
    }
  }

  // Generate via AI
  const model = process.env.DEEPSEEK_MODEL || "deepseek-chat";

  const userMessage = `Lesson topic: ${lessonTitle}

${lessonContent ? `Lesson content (use this to shape realistic questions and answers):\n${lessonContent.slice(0, 3000)}` : ""}

Generate 10–14 coaching cards for this lesson. Each card must include framework, keyPoints, and 2 sample answers.`;

  try {
    const upstream = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        messages: [
          { role: "system", content: buildSystemPrompt() },
          { role: "user", content: userMessage },
        ],
        response_format: { type: "json_object" },
      }),
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      return NextResponse.json(
        { error: data?.error?.message ?? "AI API error" },
        { status: upstream.status },
      );
    }

    const rawContent: string = data.choices?.[0]?.message?.content ?? "{}";
    type QItem = { id: string; text: string; framework?: string; keyPoints?: string[]; samples?: string[] };
    let parsed: { groups?: Array<{ label: string; questions: QItem[] }> };
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    const groups = parsed.groups ?? [];

    // Flatten + tag with group label for storage
    const questions = groups.flatMap((g) =>
      g.questions.map((q) => ({ ...q, group: g.label })),
    );

    // Upsert into DB
    await db
      .insert(practiceQuestionSets)
      .values({ sessionSlug, questions })
      .onConflictDoUpdate({
        target: practiceQuestionSets.sessionSlug,
        set: { questions, generatedAt: new Date() },
      });

    return NextResponse.json({ questions, groups, cached: false });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

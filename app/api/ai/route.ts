import { NextRequest, NextResponse } from "next/server";

type ChatRole = "system" | "user" | "assistant";
type ChatMessage = { role: ChatRole; content: string };

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

export async function POST(req: NextRequest) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing DEEPSEEK_API_KEY" },
      { status: 500 },
    );
  }

  const body = await req.json();
  const userMessages: ChatMessage[] = Array.isArray(body.messages)
    ? body.messages
    : [];

  if (userMessages.length === 0) {
    return NextResponse.json(
      { error: "messages is required" },
      { status: 400 },
    );
  }

  const lessonContext = [
    body.lessonTitle ? `Lesson title: ${body.lessonTitle}` : "",
    body.lessonContent
      ? `Lesson content:\n${body.lessonContent.slice(0, 6000)}`
      : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const mode = body.mode || "practice";

  let systemPrompt =
    "You are an English lesson assistant. Keep answers concise, practical, and learner-friendly. " +
    "When useful, provide: 1) simple explanation, 2) speaking examples, 3) short practice task.";

  if (mode === "idea") {
    systemPrompt =
      "You are an idea generator for answering questions about lessons. Provide structured frameworks, patterns, and example answer outlines that help the learner produce complete responses. Focus on creative approaches, templates, and sample phrasing.";
  } else if (mode === "concise") {
    systemPrompt =
      "You are an English lesson assistant that gives short, concise, and focused answers. Keep responses under 2-3 sentences when possible and avoid extra examples unless requested.";
  }

  try {
    const upstream = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
        temperature: 0.6,
        messages: [
          { role: "system", content: systemPrompt },
          ...(lessonContext
            ? [{ role: "system", content: lessonContext }]
            : []),
          ...userMessages,
        ],
      }),
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      return NextResponse.json(
        { error: data?.error?.message || "DeepSeek API request failed" },
        { status: upstream.status },
      );
    }

    const reply = data?.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return NextResponse.json(
        { error: "Empty response from DeepSeek" },
        { status: 502 },
      );
    }

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { error: "Failed to call DeepSeek API" },
      { status: 500 },
    );
  }
}

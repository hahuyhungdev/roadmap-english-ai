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
  const shouldStream = body.stream === true;

  if (userMessages.length === 0) {
    return NextResponse.json(
      { error: "messages is required" },
      { status: 400 },
    );
  }

  const contextType = body.contextType === "phase" ? "phase" : "lesson";
  const contextLabel = contextType === "phase" ? "Phase" : "Lesson";
  const rawContextTitle = body.contextTitle ?? body.lessonTitle;
  const rawContextContent = body.contextContent ?? body.lessonContent;
  const contextTitle =
    typeof rawContextTitle === "string" ? rawContextTitle.trim() : "";
  const contextContent =
    typeof rawContextContent === "string" ? rawContextContent.trim() : "";

  const learningContext = [
    contextTitle ? `${contextLabel} title: ${contextTitle}` : "",
    contextContent
      ? `${contextLabel} context:\n${contextContent.slice(0, 6000)}`
      : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const mode = body.mode || "practice";

  let systemPrompt =
    `You are an English ${contextLabel.toLowerCase()} assistant. Keep answers concise, practical, and learner-friendly. ` +
    "When useful, provide: 1) simple explanation, 2) speaking examples, 3) short practice task.";

  if (mode === "idea") {
    systemPrompt =
      `You are an idea generator for answering questions about this ${contextType}. Provide structured frameworks, patterns, and example answer outlines that help the learner produce complete responses. Focus on creative approaches, templates, and sample phrasing.`;
  } else if (mode === "concise") {
    systemPrompt =
      `You are an English ${contextLabel.toLowerCase()} assistant that gives short, concise, and focused answers. Keep responses under 2-3 sentences when possible and avoid extra examples unless requested.`;
  }

  if (contextType === "phase") {
    systemPrompt +=
      " Use the phase overview to connect lessons, suggest study order, compare session topics, and create phase-level speaking practice.";
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
        stream: shouldStream,
        messages: [
          { role: "system", content: systemPrompt },
          ...(learningContext
            ? [{ role: "system", content: learningContext }]
            : []),
          ...userMessages,
        ],
      }),
    });

    if (shouldStream) {
      if (!upstream.ok || !upstream.body) {
        const data = await upstream.json().catch(() => null);
        return NextResponse.json(
          { error: data?.error?.message || "DeepSeek API request failed" },
          { status: upstream.status },
        );
      }

      const encoder = new TextEncoder();
      const decoder = new TextDecoder();

      const stream = new ReadableStream({
        async start(controller) {
          const reader = upstream.body!.getReader();
          let buffer = "";

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n");
              buffer = lines.pop() ?? "";

              for (const rawLine of lines) {
                const line = rawLine.trim();
                if (!line.startsWith("data:")) continue;

                const payload = line.slice(5).trim();
                if (!payload || payload === "[DONE]") continue;

                try {
                  const parsed = JSON.parse(payload);
                  const delta = parsed?.choices?.[0]?.delta?.content;
                  if (typeof delta === "string" && delta.length > 0) {
                    controller.enqueue(encoder.encode(delta));
                  }
                } catch {
                  // Ignore malformed SSE chunks from upstream.
                }
              }
            }
          } catch (error) {
            controller.error(error);
            return;
          } finally {
            reader.releaseLock();
          }

          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          "X-Accel-Buffering": "no",
        },
      });
    }

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

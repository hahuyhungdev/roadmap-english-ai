import { NextRequest, NextResponse } from "next/server";

type ChatRole = "system" | "user" | "assistant";
type ChatMessage = { role: ChatRole; content: string };
type ContextType = "lesson" | "phase" | "ielts";
type AssistantMode = "practice" | "idea" | "vocab" | "sentence" | "concise";

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

function normalizeContextType(value: unknown): ContextType {
  if (value === "phase" || value === "ielts") return value;
  return "lesson";
}

function normalizeMode(value: unknown): AssistantMode {
  if (
    value === "practice" ||
    value === "idea" ||
    value === "vocab" ||
    value === "sentence" ||
    value === "concise"
  ) {
    return value;
  }

  return "practice";
}

function contextLabelFor(contextType: ContextType): string {
  if (contextType === "phase") return "Phase";
  if (contextType === "ielts") return "IELTS lesson";
  return "Lesson";
}

function systemPromptFor(mode: AssistantMode, contextType: ContextType): string {
  const contextLabel = contextLabelFor(contextType);
  const base =
    `You are an English ${contextLabel.toLowerCase()} assistant for a Vietnamese IT professional preparing for IELTS Speaking band 6-7. ` +
    "Use natural professional spoken English, not essay-style academic writing. Keep answers practical, concise, and self-study friendly. " +
    "When giving learner-facing sample answers, prefer natural contractions like I'm, it's, don't, I'd, and I'll.";

  const prompts: Record<AssistantMode, string> = {
    practice:
      `${base} Create active speaking practice. Give IELTS-style questions, short answer frames, retry tasks, and quick feedback. ` +
      "Push the learner to speak, record, review, and retry instead of only reading.",
    idea:
      `${base} Help the learner expand weak ideas into complete IELTS Speaking answers. Use simple idea -> better spoken idea -> useful chunks -> answer frame. ` +
      "For Part 1, keep answers short. For Part 2, build a story frame. For Part 3, give balanced opinions with reasons and examples.",
    vocab:
      `${base} Act as a vocabulary coach. Focus on reusable chunks, collocations, word families, common Vietnamese learner mistakes, and IT/professional examples. ` +
      "Avoid long word lists. Teach 5-10 usable items at a time with meaning, pattern, natural sentence, IT/pro sentence when relevant, and a micro drill.",
    sentence:
      `${base} Act as a sentence upgrade coach. Correct grammar, make sentences more natural for speaking, and keep the learner's original meaning. ` +
      "Show: original sentence, corrected sentence, better spoken version, why it works, and one short shadowing line or retry drill.",
    concise:
      `${base} Give short, focused answers under 2-3 sentences when possible. Avoid extra examples unless requested.`,
  };

  let prompt = prompts[mode];

  if (contextType === "phase") {
    prompt +=
      " Use the phase overview to connect lessons, suggest study order, compare session topics, and create phase-level speaking practice.";
  }

  if (contextType === "ielts") {
    prompt +=
      " Use the IELTS lesson structure: Topic Activation, Vocabulary In Context, Core Idea Bank, Speaking Patterns, Guided Speaking Practice, and Shadowing/Retry. " +
      "Help the learner reuse lesson chunks in spoken answers and avoid memorizing full scripts.";
  }

  return prompt;
}

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

  const contextType = normalizeContextType(body.contextType);
  const contextLabel = contextLabelFor(contextType);
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

  const mode = normalizeMode(body.mode);
  const systemPrompt = systemPromptFor(mode, contextType);

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

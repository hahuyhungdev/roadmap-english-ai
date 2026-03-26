type ChatRole = "system" | "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

type RequestBody = {
  messages?: ChatMessage[];
  lessonTitle?: string;
  lessonContent?: string;
  mode?: "practice" | "idea" | "concise";
};

type JsonResponse = {
  error?: string;
  reply?: string;
};

type VercelLikeRequest = {
  method?: string;
  body?: RequestBody;
};

type VercelLikeResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => { json: (data: JsonResponse) => void };
};

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

function getEnv(name: string): string | undefined {
  const env = (
    globalThis as { process?: { env?: Record<string, string | undefined> } }
  ).process?.env;
  return env?.[name];
}

export default async function handler(
  req: VercelLikeRequest,
  res: VercelLikeResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = getEnv("VITE_DEEPSEEK_API_KEY");
  if (!apiKey) {
    return res.status(500).json({ error: "Missing VITE_DEEPSEEK_API_KEY" });
  }

  const body = req.body ?? {};
  const userMessages = Array.isArray(body.messages) ? body.messages : [];

  if (userMessages.length === 0) {
    return res.status(400).json({ error: "messages is required" });
  }

  const lessonContext = [
    body.lessonTitle ? `Lesson title: ${body.lessonTitle}` : "",
    body.lessonContent
      ? `Lesson content:\n${body.lessonContent.slice(0, 6000)}`
      : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const mode = (body as RequestBody).mode || "practice";

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
        model: getEnv("DEEPSEEK_MODEL") || "deepseek-chat",
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

    const data = (await upstream.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      error?: { message?: string };
    };

    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: data?.error?.message || "DeepSeek API request failed",
      });
    }

    const reply = data?.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return res.status(502).json({ error: "Empty response from DeepSeek" });
    }

    return res.status(200).json({ reply });
  } catch {
    return res.status(500).json({ error: "Failed to call DeepSeek API" });
  }
}

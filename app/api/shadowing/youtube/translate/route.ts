import { NextRequest, NextResponse } from "next/server";

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

type TranslationItem = {
  index: number;
  vi: string;
};

function normalizeVi(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

async function translateChunk(
  apiKey: string,
  model: string,
  chunk: string[],
  offset: number,
): Promise<TranslationItem[]> {
  const indexed = chunk.map((text, i) => ({ index: offset + i, en: text }));

  const prompt = [
    "You are a professional English-to-Vietnamese subtitle translator.",
    "Translate each sentence to natural Vietnamese using context from neighboring sentences.",
    "Rules:",
    "- Keep EXACT same indices as input",
    "- Do NOT merge, split, reorder, or remove items",
    "- Preserve names, numbers, technical terms where suitable",
    '- Return ONLY strict JSON object: {"translations":[{"index":0,"vi":"..."}]}',
    "Input:",
    JSON.stringify(indexed),
  ].join("\n");

  const upstream = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await upstream.json().catch(() => null);
  if (!upstream.ok) {
    const msg =
      data?.error?.message ?? data?.message ?? "DeepSeek translation failed";
    throw new Error(msg);
  }

  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("DeepSeek returned empty translation");

  let parsed: any;
  try {
    parsed = typeof content === "string" ? JSON.parse(content) : content;
  } catch {
    throw new Error("DeepSeek returned invalid translation JSON");
  }

  const translations = parsed?.translations;
  if (!Array.isArray(translations)) {
    throw new Error("Translation payload missing translations array");
  }

  const mapped = translations
    .map((item: any) => ({
      index: Number(item?.index),
      vi: normalizeVi(String(item?.vi ?? "")),
    }))
    .filter((x: TranslationItem) => Number.isFinite(x.index));

  return mapped;
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing DEEPSEEK_API_KEY" },
        { status: 500 },
      );
    }

    const body = await req.json().catch(() => null);
    const sentences = Array.isArray(body?.sentences)
      ? body.sentences.map((x: any) => String(x ?? "").trim()).filter(Boolean)
      : [];

    if (!sentences.length) {
      return NextResponse.json(
        { error: "sentences is required" },
        { status: 400 },
      );
    }

    const model = process.env.DEEPSEEK_MODEL || "deepseek-chat";
    const CHUNK_SIZE = 40;

    const all: TranslationItem[] = [];
    for (let start = 0; start < sentences.length; start += CHUNK_SIZE) {
      const chunk = sentences.slice(start, start + CHUNK_SIZE);
      const translated = await translateChunk(apiKey, model, chunk, start);
      all.push(...translated);
    }

    const byIndex = new Map<number, string>();
    for (const item of all) {
      if (item.vi) byIndex.set(item.index, item.vi);
    }

    const translatedSentences = sentences.map((en: string, idx: number) => {
      const vi = byIndex.get(idx) ?? "";
      return {
        index: idx,
        en,
        vi,
      };
    });

    const missing = translatedSentences.filter(
      (x: TranslationItem & { en: string }) => !x.vi,
    ).length;
    if (missing > 0) {
      return NextResponse.json(
        {
          error: `Translation incomplete: ${missing} sentence(s) missing`,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ translatedSentences });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Failed to translate transcript" },
      { status: 500 },
    );
  }
}

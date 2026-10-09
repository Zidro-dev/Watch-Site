"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Server Action — uses OpenAI to generate an array of puzzle-ready words
 * related to the given topic.
 *
 * @param topic  Subject for the words (e.g. "Ocean Animals").
 * @param count  How many words to generate (1–20).
 * @returns      Uppercase single-word strings strictly related to the topic.
 */
export async function generateWordsAction(
  topic: string,
  count: number
): Promise<string[]> {
  if (!topic.trim()) throw new Error("Please enter a topic.");
  if (count < 1 || count > 20) throw new Error("Word count must be between 1 and 20.");

  const clampedCount = Math.min(20, Math.max(1, Math.round(count)));

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.7,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You are a word-puzzle designer. Return only valid JSON with a single key 'words' containing an array of uppercase, single-word English strings. No proper nouns, no hyphenated words, no multi-word phrases. Every word must be directly related to the given topic.",
      },
      {
        role: "user",
        content: `Generate exactly ${clampedCount} uppercase single-word strings related to the topic: "${topic.trim()}". Return JSON like: {"words": ["WORD1", "WORD2", ...]}`,
      },
    ],
  });

  const raw = response.choices[0]?.message?.content ?? "";

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("AI returned an invalid response. Please try again.");
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !Array.isArray((parsed as Record<string, unknown>).words)
  ) {
    throw new Error("AI returned an unexpected format. Please try again.");
  }

  const words: string[] = (
    (parsed as { words: unknown[] }).words
  )
    .filter((w): w is string => typeof w === "string" && w.trim().length > 0)
    .map((w) => w.toUpperCase().trim())
    // Discard multi-word phrases or empty strings that might slip through
    .filter((w) => /^[A-Z]+$/.test(w));

  if (words.length === 0) {
    throw new Error("AI returned no valid words. Please try a different topic.");
  }

  return words;
}

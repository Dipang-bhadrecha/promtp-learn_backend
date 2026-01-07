import { logger } from "../../middleware/utils/logger";

async function getFetch() {
  if (typeof fetch !== "undefined") return fetch as any;
  const mod = await import("node-fetch");
  return (mod.default ?? mod) as any;
}

export async function generateReply(prompt: string): Promise<string> {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    logger.error("GOOGLE_API_KEY not set");
    throw new Error("API key not configured");
  }

  const fetchFn = await getFetch();

  try {
    const response = await fetchFn(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      logger.error(`Google API error: ${response.status} - ${errorBody}`);
      throw new Error(`Google API error: ${response.status}`);
    }

    const data = await response.json();

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      logger.warn("No reply generated from Gemini API");
      return "I couldn't generate a response. Please try again.";
    }

    return reply;
  } catch (error: any) {
    logger.error(`Error calling Gemini API: ${error.message}`);
    throw new Error(`Failed to generate reply: ${error.message}`);
  }
}

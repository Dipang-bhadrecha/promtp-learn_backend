import { Request, Response } from "express";

async function getFetch() {
  if (typeof fetch !== "undefined") return fetch;
  const mod = await import("node-fetch");
  return (mod.default ?? mod) as any;
}

export const handleChat = async (
  req: Request,
  res: Response
) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "No prompt provided" });
  }

  try {
    const fetchFn = await getFetch();

    const response = await fetchFn(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.GOOGLE_API_KEY ?? "",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Google API error: ${errorBody}`);
    }

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response";

    res.json({ reply });

  } catch (err: any) {
    console.error("Chat controller error:", err);
    res.status(500).json({ error: err?.message ?? "Internal server error" });
  }
};

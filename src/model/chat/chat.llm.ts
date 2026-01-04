async function getFetch() {
  if (typeof fetch !== "undefined") return fetch as any;
  const mod = await import("node-fetch");
  return (mod.default ?? mod) as any;
}

export async function generateReply(prompt: string) {
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

  const data = await response.json();

  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    "No response"
  );
}

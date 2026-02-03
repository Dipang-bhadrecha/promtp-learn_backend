import fetch from "node-fetch";

interface GoogleApiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
    };
  }[];
}

interface AIGenerateResponse {
  assistant_message: string;
  meta?: {
    pipeline_version?: string;
    memory_used?: boolean;
  };
}

export async function callLLM(payload: {
  userId: number;
  conversationId: number;
  prompt: string;
  messages?: Array<{ role: string; content: string }>;
}) {
  const res = await fetch("http://localhost:8001/ai/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: payload.userId,
      conversation_id: payload.conversationId,
      message: payload.prompt,
      messages: payload.messages ?? [],
    }),
  });

  if (!res.ok) {
    throw new Error(`AI service failed: ${res.status}`);
  }

  const data = (await res.json()) as AIGenerateResponse;

  return data.assistant_message;

}


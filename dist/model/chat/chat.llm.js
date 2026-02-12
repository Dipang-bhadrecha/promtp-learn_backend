"use strict";
// import fetch from "node-fetch";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callLLM = callLLM;
// interface GoogleApiResponse {
//   candidates: {
//     content: {
//       parts: { text: string }[];
//     };
//   }[];
// }
// interface AIGenerateResponse {
//   assistant_message: string;
//   meta?: {
//     pipeline_version?: string;
//     memory_used?: boolean;
//   };
// }
// export async function callLLM(payload: {
//   userId: number;
//   conversationId: number;
//   prompt: string;
//   messages?: Array<{ role: string; content: string }>;
// }) {
//   const res = await fetch("http://localhost:8001/ai/generate", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       user_id: payload.userId,
//       conversation_id: payload.conversationId,
//       message: payload.prompt,
//       messages: payload.messages ?? [],
//     }),
//   });
//   if (!res.ok) {
//     throw new Error(`AI service failed: ${res.status}`);
//   }
//   const data = (await res.json()) as AIGenerateResponse;
//   return data.assistant_message;
// }
const node_fetch_1 = __importDefault(require("node-fetch"));
async function callLLM(prompt) {
    if (!process.env.GOOGLE_API_KEY) {
        throw new Error("Google API key not configured");
    }
    const response = await (0, node_fetch_1.default)("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": process.env.GOOGLE_API_KEY
        },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
        })
    });
    if (!response.ok) {
        const err = await response.text();
        throw new Error("Google API Error: " + err);
    }
    const data = (await response.json());
    return (data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response");
}

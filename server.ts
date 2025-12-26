import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import authRoutes from "./src/model/auth/auth.routes";

// dynamic fetch helper (Node 18+ / fallback)
async function getFetch(): Promise<
  (input: RequestInfo, init?: RequestInit) => Promise<Response>
> {
  if (typeof fetch !== "undefined") return fetch as any;
  const mod = await import("node-fetch");
  return (mod.default ?? mod) as any;
}

// load env once
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());

// ---------- ROUTES ----------
app.use("/api/auth", authRoutes);

interface ChatRequestBody {
  prompt?: string;
}

// ---------- CHAT ENDPOINT ----------
app.post(
  "/api/chat",
  async (req: Request<{}, {}, ChatRequestBody>, res: Response) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "No prompt provided" });

    try {
      const fetchFn = await getFetch();

      const response: any = await fetchFn(
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
      const reply: string =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response";

      res.json({ reply });
    } catch (error: any) {
      console.error("Chat handler error:", error);
      res.status(500).json({ error: error?.message ?? "Internal server error" });
    }
  }
);

// ---------- START SERVER ----------
const start = async () => {
  try {

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`🔐 Auth mounted at /api/auth`);
    });
  } catch (err) {
    console.error("❌ Failed to start server - DB connection error", err);
    process.exit(1);
  }
};

start();

// import dotenv from 'dotenv';
// import express, { Request, Response } from 'express';
// import cors from 'cors';
// // Use global fetch if available (Node 18+). node-fetch v3 is ESM-only,
// // so import it dynamically at runtime when needed to avoid the require() error.

// async function getFetch(): Promise<(
//   input: RequestInfo,
//   init?: RequestInit
// ) => Promise<Response>> {
//   if (typeof fetch !== 'undefined') return fetch as any;
//   const mod = await import('node-fetch');
//   // node-fetch exports the function as the default export
//   return (mod.default ?? mod) as any;
// }

// dotenv.config();

// const app = express();
// const port = Number(process.env.PORT) || 3003;

// app.use(cors());
// app.use(express.json());

// interface ChatRequestBody {
//   prompt?: string;
// }

// app.post('/api/chat', async (req: Request<{}, {}, ChatRequestBody>, res: Response) => {
//   const { prompt } = req.body;
//   if (!prompt) return res.status(400).json({ error: 'No prompt provided' });

//   try {
//     const fetchFn = await getFetch();
//     const response: any = await fetchFn("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "X-Goog-Api-Key": process.env.GOOGLE_API_KEY ?? ''
//       },
//       body: JSON.stringify({
//         contents: [{ parts: [{ text: prompt }] }]
//       })
//     });

//     if (!response.ok) {
//       const errorBody = await response.text();
//       throw new Error(`Google API error: ${errorBody}`);
//     }

//     const data = (await response.json()) as any;
//     const reply: string = data?.candidates?.[0]?.content ?? "No response";

//     res.json({ reply });
//   } catch (error: any) {
//     console.error(error);
//     res.status(500).json({ error: error?.message ?? "Internal server error" });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });



// src/server.ts
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import authRoutes from "./src/routes/auth.route";
import pool from "./src/config/db";

// dynamic fetch helper (works in Node18+ and older Node with node-fetch)
async function getFetch(): Promise<(
  input: RequestInfo,
  init?: RequestInit
) => Promise<Response>> {
  if (typeof fetch !== "undefined") return fetch as any;
  const mod = await import("node-fetch");
  return (mod.default ?? mod) as any;
}

// load env once
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000; // unified port usage

app.use(cors());
app.use(express.json());

// mount auth routes (from your TypeScript auth module)
app.use("/api/auth", authRoutes);

// existing chat endpoint — preserved as-is
interface ChatRequestBody {
  prompt?: string;
}

app.post("/api/chat", async (req: Request<{}, {}, ChatRequestBody>, res: Response) => {
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

    const data = (await response.json()) as any;
    const reply: string = data?.candidates?.[0]?.content ?? "No response";

    res.json({ reply });
  } catch (error: any) {
    console.error("Chat handler error:", error);
    res.status(500).json({ error: error?.message ?? "Internal server error" });
  }
});

// health check
app.get("/health", (req, res) => res.json({ ok: true }));

// start server after verifying DB connectivity
const start = async () => {
  try {
    // Verify DB connection before starting server (will throw if DB unreachable)
    await pool.query("SELECT 1");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Auth endpoints mounted at /api/auth`);
    });
  } catch (err) {
    console.error("Failed to start server - DB connection error", err);
    process.exit(1);
  }
};

start();

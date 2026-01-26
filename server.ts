import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRoutes from "./src/model/auth/auth.routes";
import chatRoutes from "./src/model/chat/chat.routes";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;

// middleware
// app.use(cors());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


// import dotenv from 'dotenv';
// import express from 'express';
// import cors from 'cors';

// dotenv.config();

// const app = express();
// const port = 3003;

// app.use(cors());
// app.use(express.json());

// interface ChatRequest {
//   prompt: string;
// }

// interface GoogleContent {
//   parts: Array<{ text: string }>;
// }

// interface GoogleCandidate {
//   content: GoogleContent;
// }

// interface GoogleApiResponse {
//   candidates: GoogleCandidate[];
// }

// app.post('/api/chat', async (req: express.Request, res: express.Response): Promise<void> => {
//   const { prompt } = req.body as ChatRequest;
//   if (!prompt) {
//     res.status(400).json({ error: 'No prompt provided' });
//     return;
//   }

//   if (!process.env.GOOGLE_API_KEY) {
//     res.status(500).json({ error: 'Google API key not configured' });
//     return;
//   }

//   try {
//     const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "X-Goog-Api-Key": process.env.GOOGLE_API_KEY
//       },
//       body: JSON.stringify({
//         contents: [{ parts: [{ text: prompt }] }]
//       })
//     });

//     if (!response.ok) {
//       const errorBody = await response.text();
//       res.status(500).json({ error: `Google API error: ${errorBody}` });
//       return;
//     }

//     const data = await response.json() as GoogleApiResponse;
//     const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

//     res.json({ reply });
//   } catch (error) {
//     console.error(error);
//     const errorMessage = error instanceof Error ? error.message : "Internal server error";
//     res.status(500).json({ error: errorMessage });
//   }
// });

// app.listen(port, '0.0.0.0', () => {
//   console.log(`Server running on http://0.0.0.0:${port}`);
// });
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // or use native fetch in Node v18+

const app = express();
const port = 3003;

app.use(cors({
  origin: 'https://prompt-learn.vercel.app'
}));
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'No prompt provided' });

  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
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
      const errorBody = await response.text();
      throw new Error(`Google API error: ${errorBody}`);
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content || "No response";

    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});

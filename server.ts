import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRoutes from "./src/model/auth/auth.routes";
import chatRoutes from "./src/model/chat/chat.routes";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

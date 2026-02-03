import { Request, Response } from "express";
import { ChatService } from "./chat.service";
import logger from "../../middleware/utils/logger";

export const ChatController = {

  async listConversations(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const chats = await ChatService.listChats(user.id);
      res.json(chats);
    } catch (err: any) {
      logger.error(`Error listing conversations: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  },

  async sendMessage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { prompt } = req.body;

      if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
        return res.status(400).json({ error: "Valid prompt required" });
      }

      const reply = await ChatService.sendMessage(
        (req as any).user.id,
        Number(id),
        prompt
      );

      res.json({ reply });
    } catch (err: any) {
      logger.error(`Error sending message: ${err.message}`);
      res.status(err.message.includes("Forbidden") ? 403 : 500).json({ error: err.message });
    }
  },

  // create new chat + send first message
  async sendFirstMessage(req: Request, res: Response) {
    try {
      const { prompt } = req.body;

      if (!prompt || prompt.trim() === "") {
        return res.status(400).json({ error: "Valid prompt required" });
      }

      const result = await ChatService.sendFirstMessage(
        (req as any).user.id,
        prompt
      );

      res.json(result);
      // → { conversationId, reply }

    } catch (err: any) {
      logger.error(`Error sending first message: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  },

  async getMessages(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const messages = await ChatService.getMessages(
        (req as any).user.id,
        Number(id)
      );

      res.json(messages);
    } catch (err: any) {
      logger.error(`Error getting messages: ${err.message}`);
      res.status(err.message.includes("Forbidden") ? 403 : 500).json({ error: err.message });
    }
  }
};

import { Request, Response } from "express";
import { ChatService } from "./chat.service";

export const ChatController = {
  async createConversation(req: Request, res: Response) {
    const user = (req as any).user;
    const convo = await ChatService.createConversation(user.id);
    res.json(convo);
  },

  async listConversations(req: Request, res: Response) {
    const user = (req as any).user;
    const chats = await ChatService.listChats(user.id);
    res.json(chats);
  },

  async sendMessage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { prompt } = req.body;

      if (!prompt) return res.status(400).json({ error: "Prompt required" });

      const reply = await ChatService.sendMessage(
        (req as any).user.id,
        Number(id),
        prompt
      );

      res.json({ reply });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
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
      res.status(400).json({ error: err.message });
    }
  }
};

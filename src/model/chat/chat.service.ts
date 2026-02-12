import { ChatRepository } from "./chat.repository";
import { callLLM } from "./chat.llm";
import logger from "../../middleware/utils/logger";

export const ChatService = {

  async listChats(userId: number) {
    try {
      return await ChatRepository.getUserConversations(userId);
    } catch (error: any) {
      logger.error(`Failed to list chats: ${error.message}`);
      throw error;
    }
  },

  async sendMessage(userId: number, conversationId: number, prompt: string) {
    try {
      const owner = await ChatRepository.getConversationOwner(conversationId);

      if (owner !== userId) {
        throw new Error("Forbidden: You don't have access to this conversation");
      }

      const order = await ChatRepository.getMessageCount(conversationId);

      await ChatRepository.addMessage(conversationId, "user", prompt, order);
      const recentMessages = await ChatRepository.getRecentMessages(conversationId, 10);

      // const reply = await callLLM(prompt);
      const reply = await callLLM({
        userId,
        conversationId,
        prompt,
        messages: recentMessages.map(m => ({
          role: m.role,
          content: m.content,
        })),
      });

      await ChatRepository.addMessage(conversationId, "assistant", reply, order + 1);

      await ChatRepository.updateConversationTimestamp(conversationId);

      return reply;
    } catch (error: any) {
      logger.error(`Failed to send message: ${error.message}`);
      throw error;
    }
  },

  async generateConversationTitle(prompt: string, reply: string) {
    const titlePrompt = `
You are naming a chat conversation.
Generate a concise 3-6 word title.
No quotes. No punctuation at the end.

User: ${prompt}
Assistant: ${reply}

Title:
`;

    const title = await callLLM({
      userId: 0,
      conversationId: 0,
      prompt: titlePrompt,
      messages: [],
    });
    return title.replace(/["\n]/g, "").trim();
  },

  async sendFirstMessage(userId: number, prompt: string) {
    try {

      const conversation = await ChatRepository.createConversation(userId);
      const conversationId = conversation.id;

      await ChatRepository.addMessage(conversationId, "user", prompt, 0);

      // Get recent messages AFTER adding the user message
      const recentMessages = await ChatRepository.getRecentMessages(conversationId, 10);

      // const reply = await callLLM(prompt);
      const reply = await callLLM({
        userId,
        conversationId,
        prompt,
        messages: recentMessages.map(m => ({
          role: m.role,
          content: m.content,
        })),
      });

      await ChatRepository.addMessage(conversationId, "assistant", reply, 1);

      await ChatRepository.updateConversationTimestamp(conversationId);

      ChatService.generateConversationTitle(prompt, reply)
        .then((title) => {
          return ChatRepository.updateConversationTitle(conversationId, title);
        })
        .catch((err) => {
          logger.error("Title generation failed:", err);
        });

      return { conversationId, reply };

    } catch (error: any) {
      logger.error(`Failed to send first message: ${error.message}`);
      throw error;
    }
  },

  async getMessages(userId: number, conversationId: number) {
    try {
      const owner = await ChatRepository.getConversationOwner(conversationId);

      if (owner !== userId) {
        throw new Error("Forbidden: You don't have access to this conversation");
      }

      return await ChatRepository.getMessages(conversationId);
    } catch (error: any) {
      logger.error(`Failed to get messages: ${error.message}`);
      throw error;
    }
  },

  async renameConversation(userId: number, conversationId: number, title: string) {
    try {
      const owner = await ChatRepository.getConversationOwner(conversationId);

      if (owner !== userId) {
        throw new Error("Forbidden: You don't have access to this conversation");
      }

      await ChatRepository.updateConversationTitle(conversationId, title);
      await ChatRepository.updateConversationTimestamp(conversationId);
    } catch (error: any) {
      logger.error(`Failed to rename conversation: ${error.message}`);
      throw error;
    }
  },

  async deleteConversation(userId: number, conversationId: number) {
    try {
      const owner = await ChatRepository.getConversationOwner(conversationId);

      if (owner !== userId) {
        throw new Error("Forbidden: You don't have access to this conversation");
      }

      await ChatRepository.deleteConversation(conversationId);
    } catch (error: any) {
      logger.error(`Failed to delete conversation: ${error.message}`);
      throw error;
    }
  }

};

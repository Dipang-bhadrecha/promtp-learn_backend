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

  // ===== NORMAL MESSAGE (existing conversation) =====
  async sendMessage(userId: number, conversationId: number, prompt: string) {
    try {
      const owner = await ChatRepository.getConversationOwner(conversationId);

      if (owner !== userId) {
        throw new Error("Forbidden: You don't have access to this conversation");
      }

      const order = await ChatRepository.getMessageCount(conversationId);

      await ChatRepository.addMessage(conversationId, "user", prompt, order);

      const reply = await callLLM(prompt);

      await ChatRepository.addMessage(conversationId, "assistant", reply, order + 1);

      await ChatRepository.updateConversationTimestamp(conversationId);

      return reply;
    } catch (error: any) {
      logger.error(`Failed to send message: ${error.message}`);
      throw error;
    }
  },

  // ===== PRIVATE helper: title generator =====
  async generateConversationTitle(prompt: string, reply: string) {
    const titlePrompt = `
You are naming a chat conversation.
Generate a concise 3-6 word title.
No quotes. No punctuation at the end.

User: ${prompt}
Assistant: ${reply}

Title:
`;

    const title = await callLLM(titlePrompt);
    return title.replace(/["\n]/g, "").trim();
  },

  // ===== FIRST MESSAGE (auto-creates conversation) =====
  async sendFirstMessage(userId: number, prompt: string) {
    try {
      // 1. Create conversation with temporary title
      const conversation = await ChatRepository.createConversation(userId);
      const conversationId = conversation.id;

      // 2. Store first user message
      await ChatRepository.addMessage(conversationId, "user", prompt, 0);

      // 3. Call LLM for assistant reply
      const reply = await callLLM(prompt);

      // 4. Store assistant reply
      await ChatRepository.addMessage(conversationId, "assistant", reply, 1);

      await ChatRepository.updateConversationTimestamp(conversationId);

      // 5. Background title generation (non-blocking)
      ChatService.generateConversationTitle(prompt, reply)
        .then((title) => {
          return ChatRepository.updateConversationTitle(conversationId, title);
        })
        .catch((err) => {
          logger.error("Title generation failed:", err);
        });

      // 6. Immediate response
      return { conversationId, reply };

    } catch (error: any) {
      logger.error(`Failed to send first message: ${error.message}`);
      throw error;
    }
  },

  // ===== FETCH MESSAGES =====
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
  }

};

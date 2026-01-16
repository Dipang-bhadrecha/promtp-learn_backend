import { ChatRepository } from "./chat.repository";
import { callLLM } from "./chat.llm";
import  logger  from "../../middleware/utils/logger";

export const ChatService = {
    
  async createConversation(userId: number) {
    try {
      return await ChatRepository.createConversation(userId);
    } catch (error: any) {
      logger.error(`Failed to create conversation: ${error.message}`);
      throw error;
    }
  },

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

      const reply = await callLLM(prompt);

      await ChatRepository.addMessage(conversationId, "assistant", reply, order + 1);

      await ChatRepository.updateConversationTimestamp(conversationId);

      return reply;
    } catch (error: any) {
      logger.error(`Failed to send message: ${error.message}`);
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
  }
};

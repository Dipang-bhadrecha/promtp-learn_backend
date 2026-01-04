import { ChatRepository } from "./chat.repository";
import { generateReply } from "./chat.llm";

export const ChatService = {
    
  async createConversation(userId: number) {
    return ChatRepository.createConversation(userId);
  },

  async listChats(userId: number) {
    return ChatRepository.getUserConversations(userId);
  },

  async sendMessage(userId: number, conversationId: number, prompt: string) {
    const owner = await ChatRepository.getConversationOwner(conversationId);

    if (owner !== userId) throw new Error("Forbidden");

    const order = await ChatRepository.getMessageCount(conversationId);

    await ChatRepository.addMessage(conversationId, "user", prompt, order);

    const reply = await generateReply(prompt);

    await ChatRepository.addMessage(conversationId, "assistant", reply, order + 1);

    await ChatRepository.updateConversationTimestamp(conversationId);

    return reply;
  },

  async getMessages(userId: number, conversationId: number) {
    const owner = await ChatRepository.getConversationOwner(conversationId);
    if (owner !== userId) throw new Error("Forbidden");

    return ChatRepository.getMessages(conversationId);
  }
};

import { MessageRepository } from "../message/message.repository";
import { ChatRepository } from "../chat/chat.repository";

export const PromptService = {
  async listConversationPrompts(
    userId: string,
    conversationId: number
  ) {
    // ownership check (matches YOUR chat.repository)
    const owner =
      await ChatRepository.getConversationOwner(conversationId);

    if (!owner || owner.user_id !== userId) {
      throw new Error("Unauthorized access");
    }

    return MessageRepository.listUserPrompts(conversationId);
  },
};

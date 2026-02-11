import { ChatRepository } from "../chat/chat.repository";
import logger from "../../middleware/utils/logger";
import { NotesRepository } from "./notes.repository";

export const NotesService = {
  async listNotes(userId: number, conversationId: number) {
    try {
      const owner = await ChatRepository.getConversationOwner(conversationId);
      if (owner !== userId) {
        throw new Error("Forbidden: You don't have access to this conversation");
      }

      return await NotesRepository.listNotes(userId, conversationId);
    } catch (error: any) {
      logger.error(`Failed to list notes: ${error.message}`);
      throw error;
    }
  },

  async createNote(
    userId: number,
    conversationId: number,
    content: string,
    sourceMessageIndex: number | null
  ) {
    try {
      const owner = await ChatRepository.getConversationOwner(conversationId);
      if (owner !== userId) {
        throw new Error("Forbidden: You don't have access to this conversation");
      }

      return await NotesRepository.createNote(
        userId,
        conversationId,
        content,
        sourceMessageIndex
      );
    } catch (error: any) {
      logger.error(`Failed to create note: ${error.message}`);
      throw error;
    }
  },
};

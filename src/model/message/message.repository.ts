import db from "../../config/db";
import { Message } from "./message.types";

export const MessageRepository = {
  async listByConversation(conversationId: number): Promise<Message[]> {
    const result = await db.query(
      `
      SELECT
        id,
        conversation_id AS "conversationId",
        sender,
        content,
        order_index AS "orderIndex",
        created_at AS "createdAt"
      FROM messages
      WHERE conversation_id = $1
      ORDER BY order_index ASC
      `,
      [conversationId]
    );

    return result.rows;
  },

  async listUserPrompts(conversationId: number): Promise<Message[]> {
    const result = await db.query(
      `
      SELECT
        id,
        conversation_id AS "conversationId",
        sender,
        content,
        order_index AS "orderIndex",
        created_at AS "createdAt"
      FROM messages
      WHERE conversation_id = $1
        AND sender = 'user'
      ORDER BY order_index ASC
      `,
      [conversationId]
    );

    return result.rows;
  },
};

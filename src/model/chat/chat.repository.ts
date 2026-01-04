import pool from "../../config/db";

export const ChatRepository = {
  async createConversation(userId: number) {
    const res = await pool.query(
      `INSERT INTO conversations (user_id, title)
       VALUES ($1, 'New Chat')
       RETURNING *`,
      [userId]
    );
    return res.rows[0];
  },

  async getUserConversations(userId: number) {
    const res = await pool.query(
      `SELECT * FROM conversations 
       WHERE user_id = $1
       ORDER BY updated_at DESC`,
      [userId]
    );
    return res.rows;
  },

  async getConversationOwner(conversationId: number) {
    const res = await pool.query(
      `SELECT user_id FROM conversations WHERE id = $1`,
      [conversationId]
    );
    return res.rows[0]?.user_id ?? null;
  },

  async getMessageCount(conversationId: number) {
    const res = await pool.query(
      `SELECT COUNT(*) FROM messages WHERE conversation_id = $1`,
      [conversationId]
    );
    return Number(res.rows[0].count);
  },

  async addMessage(conversationId: number, sender: string, content: string, order: number) {
    const res = await pool.query(
      `INSERT INTO messages (conversation_id, sender, content, order_index)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [conversationId, sender, content, order]
    );
    return res.rows[0];
  },

  async getMessages(conversationId: number) {
    const res = await pool.query(
      `SELECT * FROM messages 
       WHERE conversation_id = $1
       ORDER BY order_index ASC`,
      [conversationId]
    );
    return res.rows;
  },

  async updateConversationTimestamp(conversationId: number) {
    await pool.query(
      `UPDATE conversations SET updated_at = NOW() WHERE id = $1`,
      [conversationId]
    );
  }
};

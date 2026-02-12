"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRepository = void 0;
const db_1 = __importDefault(require("../../config/db"));
exports.ChatRepository = {
    async createConversation(userId) {
        const res = await db_1.default.query(`INSERT INTO conversations (user_id, title)
       VALUES ($1, 'New Chat')
       RETURNING *`, [userId]);
        return res.rows[0];
    },
    async getUserConversations(userId) {
        const res = await db_1.default.query(`SELECT * FROM conversations 
       WHERE user_id = $1
       ORDER BY updated_at DESC`, [userId]);
        return res.rows;
    },
    async getRecentMessages(conversationId, limit) {
        const res = await db_1.default.query(`
    SELECT
      sender AS role,
      content
    FROM messages
    WHERE conversation_id = $1
    ORDER BY order_index DESC
    LIMIT $2
    `, [conversationId, limit]);
        return res.rows;
    },
    async getConversationOwner(conversationId) {
        const res = await db_1.default.query(`SELECT user_id FROM conversations WHERE id = $1`, [conversationId]);
        return res.rows[0]?.user_id ?? null;
    },
    async getMessageCount(conversationId) {
        const res = await db_1.default.query(`SELECT COUNT(*) FROM messages WHERE conversation_id = $1`, [conversationId]);
        return Number(res.rows[0].count);
    },
    async addMessage(conversationId, sender, content, order) {
        const res = await db_1.default.query(`INSERT INTO messages (conversation_id, sender, content, order_index)
       VALUES ($1, $2, $3, $4)
       RETURNING *`, [conversationId, sender, content, order]);
        return res.rows[0];
    },
    async getMessages(conversationId) {
        const res = await db_1.default.query(`SELECT * FROM messages 
       WHERE conversation_id = $1
       ORDER BY order_index ASC`, [conversationId]);
        return res.rows;
    },
    async updateConversationTimestamp(conversationId) {
        await db_1.default.query(`UPDATE conversations SET updated_at = NOW() WHERE id = $1`, [conversationId]);
    },
    async updateConversationTitle(conversationId, title) {
        await db_1.default.query(`UPDATE conversations SET title=$1 WHERE id=$2`, [title, conversationId]);
    },
    async deleteConversation(conversationId) {
        // Delete messages first to satisfy FK constraints if cascade isn't set
        await db_1.default.query(`DELETE FROM messages WHERE conversation_id = $1`, [conversationId]);
        await db_1.default.query(`DELETE FROM conversations WHERE id = $1`, [conversationId]);
    }
};

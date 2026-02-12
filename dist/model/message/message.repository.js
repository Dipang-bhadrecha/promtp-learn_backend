"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRepository = void 0;
const db_1 = __importDefault(require("../../config/db"));
exports.MessageRepository = {
    async listByConversation(conversationId) {
        const result = await db_1.default.query(`
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
      `, [conversationId]);
        return result.rows;
    },
    async listUserPrompts(conversationId) {
        const result = await db_1.default.query(`
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
      `, [conversationId]);
        return result.rows;
    },
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesRepository = void 0;
const db_1 = __importDefault(require("../../config/db"));
let initialized = false;
async function ensureNotesTable() {
    if (initialized)
        return;
    await db_1.default.query(`
    CREATE TABLE IF NOT EXISTS notes (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      source_message_index INTEGER,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
    await db_1.default.query(`
    CREATE INDEX IF NOT EXISTS notes_user_conversation_idx
    ON notes(user_id, conversation_id)
  `);
    initialized = true;
}
exports.NotesRepository = {
    async createNote(userId, conversationId, content, sourceMessageIndex) {
        await ensureNotesTable();
        const res = await db_1.default.query(`INSERT INTO notes (user_id, conversation_id, content, source_message_index)
       VALUES ($1, $2, $3, $4)
       RETURNING *`, [userId, conversationId, content, sourceMessageIndex]);
        return res.rows[0];
    },
    async listNotes(userId, conversationId) {
        await ensureNotesTable();
        const res = await db_1.default.query(`SELECT * FROM notes
       WHERE user_id = $1 AND conversation_id = $2
       ORDER BY created_at DESC`, [userId, conversationId]);
        return res.rows;
    },
};

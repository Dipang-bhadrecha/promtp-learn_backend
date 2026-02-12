"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesService = void 0;
const chat_repository_1 = require("../chat/chat.repository");
const logger_1 = __importDefault(require("../../middleware/utils/logger"));
const notes_repository_1 = require("./notes.repository");
exports.NotesService = {
    async listNotes(userId, conversationId) {
        try {
            const owner = await chat_repository_1.ChatRepository.getConversationOwner(conversationId);
            if (owner !== userId) {
                throw new Error("Forbidden: You don't have access to this conversation");
            }
            return await notes_repository_1.NotesRepository.listNotes(userId, conversationId);
        }
        catch (error) {
            logger_1.default.error(`Failed to list notes: ${error.message}`);
            throw error;
        }
    },
    async createNote(userId, conversationId, content, sourceMessageIndex) {
        try {
            const owner = await chat_repository_1.ChatRepository.getConversationOwner(conversationId);
            if (owner !== userId) {
                throw new Error("Forbidden: You don't have access to this conversation");
            }
            return await notes_repository_1.NotesRepository.createNote(userId, conversationId, content, sourceMessageIndex);
        }
        catch (error) {
            logger_1.default.error(`Failed to create note: ${error.message}`);
            throw error;
        }
    },
};

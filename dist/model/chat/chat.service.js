"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const chat_repository_1 = require("./chat.repository");
const chat_llm_1 = require("./chat.llm");
const logger_1 = __importDefault(require("../../middleware/utils/logger"));
exports.ChatService = {
    async listChats(userId) {
        try {
            return await chat_repository_1.ChatRepository.getUserConversations(userId);
        }
        catch (error) {
            logger_1.default.error(`Failed to list chats: ${error.message}`);
            throw error;
        }
    },
    async sendMessage(userId, conversationId, prompt) {
        try {
            const owner = await chat_repository_1.ChatRepository.getConversationOwner(conversationId);
            if (owner !== userId) {
                throw new Error("Forbidden: You don't have access to this conversation");
            }
            const order = await chat_repository_1.ChatRepository.getMessageCount(conversationId);
            await chat_repository_1.ChatRepository.addMessage(conversationId, "user", prompt, order);
            const recentMessages = await chat_repository_1.ChatRepository.getRecentMessages(conversationId, 10);
            const reply = await (0, chat_llm_1.callLLM)(prompt);
            // const reply = await callLLM({
            //   userId,
            //   conversationId,
            //   prompt,
            //   messages: recentMessages.map(m => ({
            //     role: m.role,
            //     content: m.content,
            //   })),
            // });
            await chat_repository_1.ChatRepository.addMessage(conversationId, "assistant", reply, order + 1);
            await chat_repository_1.ChatRepository.updateConversationTimestamp(conversationId);
            return reply;
        }
        catch (error) {
            logger_1.default.error(`Failed to send message: ${error.message}`);
            throw error;
        }
    },
    async generateConversationTitle(prompt, reply) {
        const titlePrompt = `
You are naming a chat conversation.
Generate a concise 3-6 word title.
No quotes. No punctuation at the end.

User: ${prompt}
Assistant: ${reply}

Title:
`;
        const title = await (0, chat_llm_1.callLLM)(titlePrompt);
        // const title = await callLLM({
        //   userId: 0,
        //   conversationId: 0,
        //   prompt: titlePrompt,
        //   messages: [],
        // });
        return title.replace(/["\n]/g, "").trim();
    },
    async sendFirstMessage(userId, prompt) {
        try {
            const conversation = await chat_repository_1.ChatRepository.createConversation(userId);
            const conversationId = conversation.id;
            await chat_repository_1.ChatRepository.addMessage(conversationId, "user", prompt, 0);
            // Get recent messages AFTER adding the user message
            const recentMessages = await chat_repository_1.ChatRepository.getRecentMessages(conversationId, 10);
            const reply = await (0, chat_llm_1.callLLM)(prompt);
            // const reply = await callLLM({
            //   userId,
            //   conversationId,
            //   prompt,
            //   messages: recentMessages.map(m => ({
            //     role: m.role,
            //     content: m.content,
            //   })),
            // });
            await chat_repository_1.ChatRepository.addMessage(conversationId, "assistant", reply, 1);
            await chat_repository_1.ChatRepository.updateConversationTimestamp(conversationId);
            exports.ChatService.generateConversationTitle(prompt, reply)
                .then((title) => {
                return chat_repository_1.ChatRepository.updateConversationTitle(conversationId, title);
            })
                .catch((err) => {
                logger_1.default.error("Title generation failed:", err);
            });
            return { conversationId, reply };
        }
        catch (error) {
            logger_1.default.error(`Failed to send first message: ${error.message}`);
            throw error;
        }
    },
    async getMessages(userId, conversationId) {
        try {
            const owner = await chat_repository_1.ChatRepository.getConversationOwner(conversationId);
            if (owner !== userId) {
                throw new Error("Forbidden: You don't have access to this conversation");
            }
            return await chat_repository_1.ChatRepository.getMessages(conversationId);
        }
        catch (error) {
            logger_1.default.error(`Failed to get messages: ${error.message}`);
            throw error;
        }
    },
    async renameConversation(userId, conversationId, title) {
        try {
            const owner = await chat_repository_1.ChatRepository.getConversationOwner(conversationId);
            if (owner !== userId) {
                throw new Error("Forbidden: You don't have access to this conversation");
            }
            await chat_repository_1.ChatRepository.updateConversationTitle(conversationId, title);
            await chat_repository_1.ChatRepository.updateConversationTimestamp(conversationId);
        }
        catch (error) {
            logger_1.default.error(`Failed to rename conversation: ${error.message}`);
            throw error;
        }
    },
    async deleteConversation(userId, conversationId) {
        try {
            const owner = await chat_repository_1.ChatRepository.getConversationOwner(conversationId);
            if (owner !== userId) {
                throw new Error("Forbidden: You don't have access to this conversation");
            }
            await chat_repository_1.ChatRepository.deleteConversation(conversationId);
        }
        catch (error) {
            logger_1.default.error(`Failed to delete conversation: ${error.message}`);
            throw error;
        }
    }
};

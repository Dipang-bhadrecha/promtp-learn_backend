"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptService = void 0;
const message_repository_1 = require("../message/message.repository");
const chat_repository_1 = require("../chat/chat.repository");
exports.PromptService = {
    async listConversationPrompts(userId, conversationId) {
        // ownership check (matches YOUR chat.repository)
        const owner = await chat_repository_1.ChatRepository.getConversationOwner(conversationId);
        if (!owner || owner.user_id !== userId) {
            throw new Error("Unauthorized access");
        }
        return message_repository_1.MessageRepository.listUserPrompts(conversationId);
    },
};

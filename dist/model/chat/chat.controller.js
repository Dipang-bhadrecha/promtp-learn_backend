"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const chat_service_1 = require("./chat.service");
const logger_1 = __importDefault(require("../../middleware/utils/logger"));
exports.ChatController = {
    async listConversations(req, res) {
        try {
            const user = req.user;
            const chats = await chat_service_1.ChatService.listChats(user.id);
            res.json(chats);
        }
        catch (err) {
            logger_1.default.error(`Error listing conversations: ${err.message}`);
            res.status(500).json({ error: err.message });
        }
    },
    async sendMessage(req, res) {
        try {
            const { id } = req.params;
            const { prompt } = req.body;
            if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
                return res.status(400).json({ error: "Valid prompt required" });
            }
            const reply = await chat_service_1.ChatService.sendMessage(req.user.id, Number(id), prompt);
            res.json({ reply });
        }
        catch (err) {
            logger_1.default.error(`Error sending message: ${err.message}`);
            res.status(err.message.includes("Forbidden") ? 403 : 500).json({ error: err.message });
        }
    },
    // create new chat + send first message
    async sendFirstMessage(req, res) {
        try {
            const { prompt } = req.body;
            if (!prompt || prompt.trim() === "") {
                return res.status(400).json({ error: "Valid prompt required" });
            }
            const result = await chat_service_1.ChatService.sendFirstMessage(req.user.id, prompt);
            res.json(result);
            // → { conversationId, reply }
        }
        catch (err) {
            logger_1.default.error(`Error sending first message: ${err.message}`);
            res.status(500).json({ error: err.message });
        }
    },
    async getMessages(req, res) {
        try {
            const { id } = req.params;
            const messages = await chat_service_1.ChatService.getMessages(req.user.id, Number(id));
            res.json(messages);
        }
        catch (err) {
            logger_1.default.error(`Error getting messages: ${err.message}`);
            res.status(err.message.includes("Forbidden") ? 403 : 500).json({ error: err.message });
        }
    },
    async renameConversation(req, res) {
        try {
            const { id } = req.params;
            const { title } = req.body;
            if (!title || typeof title !== "string" || title.trim() === "") {
                return res.status(400).json({ error: "Valid title required" });
            }
            await chat_service_1.ChatService.renameConversation(req.user.id, Number(id), title.trim());
            res.json({ ok: true });
        }
        catch (err) {
            logger_1.default.error(`Error renaming conversation: ${err.message}`);
            res.status(err.message.includes("Forbidden") ? 403 : 500).json({ error: err.message });
        }
    },
    async deleteConversation(req, res) {
        try {
            const { id } = req.params;
            await chat_service_1.ChatService.deleteConversation(req.user.id, Number(id));
            res.json({ ok: true });
        }
        catch (err) {
            logger_1.default.error(`Error deleting conversation: ${err.message}`);
            res.status(err.message.includes("Forbidden") ? 403 : 500).json({ error: err.message });
        }
    }
};

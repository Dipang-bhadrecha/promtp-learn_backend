"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesController = void 0;
const logger_1 = __importDefault(require("../../middleware/utils/logger"));
const notes_service_1 = require("./notes.service");
exports.NotesController = {
    async listNotes(req, res) {
        try {
            const { id } = req.params;
            const notes = await notes_service_1.NotesService.listNotes(req.user.id, Number(id));
            res.json(notes);
        }
        catch (err) {
            logger_1.default.error(`Error listing notes: ${err.message}`);
            res.status(err.message.includes("Forbidden") ? 403 : 500).json({ error: err.message });
        }
    },
    async createNote(req, res) {
        try {
            const { id } = req.params;
            const { content, sourceMessageIndex } = req.body;
            if (!content || typeof content !== "string" || content.trim() === "") {
                return res.status(400).json({ error: "Valid content required" });
            }
            const note = await notes_service_1.NotesService.createNote(req.user.id, Number(id), content, typeof sourceMessageIndex === "number" ? sourceMessageIndex : null);
            res.status(201).json(note);
        }
        catch (err) {
            logger_1.default.error(`Error creating note: ${err.message}`);
            res.status(err.message.includes("Forbidden") ? 403 : 500).json({ error: err.message });
        }
    },
};

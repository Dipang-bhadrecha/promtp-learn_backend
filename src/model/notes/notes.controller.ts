import { Request, Response } from "express";
import logger from "../../middleware/utils/logger";
import { NotesService } from "./notes.service";

export const NotesController = {
  async listNotes(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const notes = await NotesService.listNotes(
        (req as any).user.id,
        Number(id)
      );
      res.json(notes);
    } catch (err: any) {
      logger.error(`Error listing notes: ${err.message}`);
      res.status(err.message.includes("Forbidden") ? 403 : 500).json({ error: err.message });
    }
  },

  async createNote(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { content, sourceMessageIndex } = req.body;

      if (!content || typeof content !== "string" || content.trim() === "") {
        return res.status(400).json({ error: "Valid content required" });
      }

      const note = await NotesService.createNote(
        (req as any).user.id,
        Number(id),
        content,
        typeof sourceMessageIndex === "number" ? sourceMessageIndex : null
      );

      res.status(201).json(note);
    } catch (err: any) {
      logger.error(`Error creating note: ${err.message}`);
      res.status(err.message.includes("Forbidden") ? 403 : 500).json({ error: err.message });
    }
  },
};

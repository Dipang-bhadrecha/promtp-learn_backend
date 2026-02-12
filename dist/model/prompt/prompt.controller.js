"use strict";
// import { Request, Response } from "express";
// import { PromptService } from "./prompt.service";
// export const PromptController = {
//   async list(req: Request, res: Response) {
//     if (!req.user) {
//       return res.status(401).json({ error: "Unauthorized" });
//     }
//     const userId = req.user.id;
//     const conversationId = Number(req.params.conversationId);
//     if (!conversationId) {
//       return res.status(400).json({
//         error: "conversationId is required",
//       });
//     }
//     const prompts =
//       await PromptService.listConversationPrompts(
//         userId,
//         conversationId
//       );
//     res.json({ prompts });
//   },
// };

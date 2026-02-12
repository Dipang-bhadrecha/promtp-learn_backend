import { Router } from "express";
import { PromptController } from "./prompt.controller";
import { authGuard } from "../../middleware/utils/authGuard";

const router = Router();

router.get("/:conversationId", authGuard, PromptController.list);

export default router;

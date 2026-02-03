import { Router } from "express";
import { auth } from "../../middleware/auth";
import { ChatController } from "./chat.controller";
import { authGuard } from "../../middleware/utils/authGuard";

const router = Router();

router.use(auth);

router.post("/:id/messages", authGuard, ChatController.sendMessage);

router.post("/", authGuard, ChatController.sendFirstMessage);

router.get("/", authGuard, ChatController.listConversations);

router.get("/:id/messages", authGuard, ChatController.getMessages);


export default router;

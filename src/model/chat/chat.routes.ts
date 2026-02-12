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

router.patch("/:id", authGuard, ChatController.renameConversation);

router.delete("/:id", authGuard, ChatController.deleteConversation);


export default router;

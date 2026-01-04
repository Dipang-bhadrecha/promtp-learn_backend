import { Router } from "express";
import { auth } from "../../middleware/auth";
import { ChatController } from "./chat.controller";

const router = Router();

router.use(auth);

router.post("/:id/messages", ChatController.sendMessage);

router.post("/", ChatController.createConversation);

router.get("/", ChatController.listConversations);

router.get("/:id/messages", ChatController.getMessages);


export default router;

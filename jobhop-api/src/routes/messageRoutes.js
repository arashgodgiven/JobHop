import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  deleteMessage,
  editMessage,
  listMessages,
  sendMessage
} from "../controllers/messageController.js";

const router = Router();
router.use(requireAuth);

// These are already nested in your frontend calls:
// /conversations/:conversationId/messages
router.post("/conversations/:conversationId/messages", sendMessage);
router.get("/conversations/:conversationId/messages", listMessages);
router.put("/conversations/:conversationId/messages/:messageId", editMessage);
router.delete("/conversations/:conversationId/messages/:messageId", deleteMessage);

export default router;
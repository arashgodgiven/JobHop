import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  createConversation,
  deleteConversation,
  getConversation,
  myConversations
} from "../controllers/conversationController.js";

const router = Router();
router.use(requireAuth);

router.post("/", createConversation);
router.get("/", myConversations);
router.get("/:conversationId", getConversation);
router.delete("/:conversationId", deleteConversation);

export default router;
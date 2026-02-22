import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { accept, list, sendRequest } from "../controllers/connectionController.js";

const router = Router();
router.use(requireAuth);

router.post("/", sendRequest);
router.post("/:connectionId/accept", accept);
router.get("/", list);

export default router;
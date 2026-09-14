import { Router } from "express";
import {
  classifyTicket,
  generateAssistantReply,
} from "../controllers/ticket.controller.js";

const router = Router();

router.post("/classify", classifyTicket);

router.post("/reply", generateAssistantReply);

export default router;

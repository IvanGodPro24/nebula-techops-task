import { type Request, type Response } from "express";
import { classifyTicketService } from "../services/ai.service.js";
import { generateReplyService } from "../services/ai.service.js";

export const classifyTicket = async (req: Request, res: Response) => {
  const { ticketText } = req.body;

  if (!ticketText)
    return res.status(400).json({ error: "ticketText is required" });

  try {
    const parsedData = await classifyTicketService(ticketText);

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("AI Classification Error:", error.message);

      return res.status(500).json({
        success: false,
        error: "AI Processing failed. Routed to manual review queue.",
        details: error.message,
      });
    }
  }
};

export const generateAssistantReply = async (req: Request, res: Response) => {
  const { ticketText } = req.body;

  if (!ticketText)
    return res.status(400).json({ error: "ticketText is required" });

  try {
    const parsedData = await generateReplyService(ticketText);

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("AI Assistant Error:", error.message);

      return res.status(500).json({
        success: false,
        error:
          "Failed to generate assistant reply. Please manually draft the response.",
        details: error.message,
      });
    }
  }
};

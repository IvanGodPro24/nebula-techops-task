import { z } from "zod";

export const ClassifierSchema = z.object({
  category: z.enum([
    "Crisis_Escalation",
    "Refund_Request",
    "Complaint_Expert",
    "Technical_Bug",
    "Billing_and_Subscription",
    "General_Inquiry",
  ]),
  priority: z.enum(["Critical", "High", "Medium", "Low"]),
  next_step: z.string(),
});

export const AssistantSchema = z.object({
  summary: z.string(),
  knowledge_base_quote: z.string(),
  replies: z.object({
    formal: z.string(),
    empathetic: z.string(),
    short: z.string(),
  }),
  requires_human: z.boolean(),
  human_reason: z.string().nullable(),
});

export type ClassifierResult = z.infer<typeof ClassifierSchema>;
export type AssistantResult = z.infer<typeof AssistantSchema>;

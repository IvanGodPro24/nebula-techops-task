import { OpenAI } from "openai";
import { CLASSIFIER_SYSTEM_PROMPT } from "../prompts/systemPrompt.js";
import { ASSISTANT_SYSTEM_PROMPT } from "../prompts/assistantPrompt.js";
import { env } from "../config/env.js";
import { extractAndValidateJSON } from "../utils/extractJSON.js";
import { ClassifierSchema, AssistantSchema } from "../schemas/aiSchemas.js";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3001",
    "X-Title": "Nebula TechOps MVP",
  },
});

export const classifyTicketService = async (ticketText: string) => {
  const completion = await openai.chat.completions.create(
    {
      model: "meta-llama/llama-3.1-8b-instruct",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: CLASSIFIER_SYSTEM_PROMPT },
        { role: "user", content: ticketText },
      ],
      temperature: 0.1,
    },
    {
      timeout: 30000,
    },
  );

  const rawContent = completion.choices[0]?.message?.content || "{}";

  return extractAndValidateJSON(rawContent, ClassifierSchema);
};

export const generateReplyService = async (ticketText: string) => {
  const completion = await openai.chat.completions.create(
    {
      model: "meta-llama/llama-3.1-8b-instruct",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: ASSISTANT_SYSTEM_PROMPT },
        { role: "user", content: ticketText },
      ],
      temperature: 0.3,
    },
    {
      timeout: 30000,
    },
  );

  const rawContent = completion.choices[0]?.message?.content || "{}";

  return extractAndValidateJSON(rawContent, AssistantSchema);
};

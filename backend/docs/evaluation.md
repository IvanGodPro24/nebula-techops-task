# Nebula TechOps AI Prototype - Evaluation & Documentation

## 1. Architecture & Model Selection

For this MVP, the architecture is separated into a **React/Vite Frontend** and a **Node.js/Express Backend**. The backend utilizes the OpenRouter API to aggregate LLM access.

### Comparison of Models

1. **Llama 3.1 8B Instruct (Free via OpenRouter)**
   - *Quality:* Good instruction following, decent JSON formatting when strictly prompted.
   - *Speed:* Moderate.
   - *Cost:* Free.
   - *Verdict:* **Chosen for MVP** to demonstrate functionality without incurring costs during the review phase.
2. **GPT-5.6 Luna (OpenAI)**
   - *Quality:* Exceptional JSON adherence, native compatibility with strict Zod schemas, and a highly updated knowledge base.
   - *Speed:* Fast with predictable latency.
   - *Cost:* Highly cost-effective (~$0.20/1M input tokens) for production scale.
   - *Verdict:* **Recommended for Production**.
3. **Claude Haiku 4.5 (Anthropic)**
   - *Quality:* Excellent at following nuanced instructions and generating empathetic responses. Reliable JSON output.
   - *Speed:* Exceptionally fast.
   - *Cost:* Highly cost-effective (~$0.25/1M input tokens).
   - *Verdict:* **Strong Alternative for Production**, especially if the primary focus shifts towards the quality of the generated empathetic responses rather than pure cost optimization.

*Note: The backend is structured using the standard `openai` SDK. Switching from Llama 3.1 to GPT-5.6 Luna for production only requires changing the model string and the base URL in `ai.service.ts`.*

---

## 2. Task 1: Ticket Classifier

### Categories Logic & Human Decisions

I manually defined the categories (`Billing_and_Subscription`, `Refund_Request`, `Technical_Bug`, `Complaint_Expert`, `General_Inquiry`) based on business priorities.

**Decision made by me:** I explicitly programmed a strict evaluation hierarchy. The AI is not allowed to guess what is more important; it is strictly instructed via a step-by-step algorithm that *Financial requests (Refunds) take absolute priority over bugs or complaints.*

### Automated Evaluation & Metrics

To ensure the classifier behaves predictably across edge cases and to prevent regressions when tuning prompts, I implemented an automated test script (`npm run eval`).

- **Test Dataset:** Covers critical edge cases (mental health crises, aggressive tone, complex refunds vs. billing inquiries).
- **Current Accuracy:** `100.0% (7/7 passed)` on the baseline dataset.
- **Validation:** Implemented strict schema validation using `Zod`. The application no longer trusts the LLM blindly; if the model hallucinates a category or omits a field, the code catches it and triggers a fallback.

### Prompt Evolution & Edge Cases

- **Version 1:** Basic categorization.

   > *Prompt v1 excerpt:* "If multiple issues exist, classify based on the most critical one (e.g., Refund > Bug > Inquiry)."
  - **Edge Case:** Ticket: *"The app is a scam, astrologer lied, refund my $30!"*
  - **Unexpected AI Result:** AI classified it as `Complaint_Expert` because it prioritized the first sentiment.
  - **Evolution:** Implemented a `STRICT ROUTING ALGORITHM` in the prompt (STEP 1: Check for refunds... If YES -> Stop). This forces the LLM to prioritize the financial request, regardless of other complaints.
- **Version 2:** Hierarchy implemented.
  - **Edge Case:** Ticket: *"I bought premium but features are locked."*
  - **Unexpected AI Result:** AI classified it as `Refund_Request` assuming the user wanted their money back.
  - **Evolution:** Added a strict rule distinguishing between mentioning a payment issue and explicitly requesting money back.
- **Version 3:** Handling ambiguous inputs & context hallucination.
  - **Edge Case:** Ticket: `"wtf"` or `"help"` (Contextless inputs).
  - **Unexpected AI Result:** While the AI correctly handled "help", the input "wtf" triggered a false positive. Because the prompt instructed the AI to elevate profanity to `High` priority, the model hallucinated context to justify it, categorizing it as `Complaint_Expert` and advising the agent to "apologize for the expert" even though no expert was mentioned.
  - **Evolution:** Introduced `STEP 0: Check for context` to force short, uninformative tickets into `General_Inquiry` without inventing context. Also refined priority rules: profanity *without context* is now routed to `Low` rather than `High`, requiring the agent to simply ask for clarification, preventing hallucinations.

---

## 3. Task 2: Internal AI-Assistant

### Architecture & Retrieval Approach

For the MVP, I simulated the Knowledge Base directly inside the System Prompt. In a production environment with hundreds of articles, I would implement a **RAG** approach using vector embeddings (e.g., Pinecone + OpenAI embeddings) to fetch only the relevant KB snippet before injecting it into the prompt.

### Prompting for Tone & Output Mitigation

- *Challenge:* Initially, the AI would return `"knowledge_base_quote": "No relevant info"` if a ticket didn't match a KB article word-for-word, even if a policy conceptually applied (e.g., legal threats).
- *Evolution:* Adjusted the prompt to allow the AI to extract the *"closest conceptual match"* rather than requiring strict word-for-word alignment. This significantly improved context awareness in the generated drafts.
- *Tone Tuning:* Explicitly required "validating the user's feelings" for the Empathetic tone, and restricted the Short tone to "under 2 sentences" to guarantee distinct options for the agents.
  
---

## 4. Boundaries of Automation

Some tickets carry too much legal, financial, or reputational risk to be handled automatically.

**Scenarios requiring mandatory Human Judgment:**

1. **Threat of Legal Action / Severe Aggression:** Any mention of suing, legal rights, or extreme profanity.
2. **Complex Refund Disputes:** E.g., asking for a refund on a completed expert reading (which violates standard policy but might need a manager's exception).
3. **Mental Health Crisis:** Given Nebula is a spiritual wellness app, any distress signals must immediately bypass AI to a specialized human team.

**UI/Technical Implementation:**
The AI output schema includes a `requires_human` boolean flag and a `human_reason` string. The Frontend explicitly renders a red 🚨 **Human Intervention Required** banner blocking standard automated flow when this flag is `true`.

---

## 5. Technical System Design & Failure Handling

### Failure Handling & Robustness

1. **Safety Filters & Non-JSON Responses:** When sending highly aggressive tickets, open models sometimes trigger safety guardrails and return conversational refusal text instead of JSON.
   - *Fix:* Enforced `response_format: { type: "json_object" }` at the API level, and built a custom `extractJSON` utility that scans the output for `{ ... }` bounds. This completely eliminated parsing crashes.
2. **Timeout Handling:** Model generation occasionally exceeded standard limits. Implemented a `30000ms` timeout block. If the LLM fails, the controller catches the error gracefully and defaults the frontend to a manual review fallback.
3. **Rate Limits:** To be mitigated in production using Exponential Backoff algorithms (e.g., `axios-retry` or native Node queues like `BullMQ`).

### System Architecture

**Important Note on Architecture:**
This repository is designed as a Proof of Concept (PoC) to demonstrate the capabilities of two distinct tasks independently (Classifier vs. Assistant).

**Production Implementation:**
In a real-world production environment, these two tasks would **not** be isolated endpoints. Calling the LLM twice for a single ticket doubles the latency and the token cost. Instead, they would be chained into a single asynchronous pipeline:

1. The ticket arrives and is passed to the Classifier.
2. If `priority === "Critical"`, it routes immediately to human agents (bypassing drafting).
3. If valid for auto-reply, the same worker passes the ticket to the Assistant prompt to generate drafts.

### Cost Analysis (Forecast for 10,000 tickets/month)

Assuming we switch to **GPT-5.6 Luna** for production:

- Average input tokens (System prompt + ticket): ~300
- Average output tokens (JSON generation): ~150
- Total tokens per ticket: ~450
- 10,000 tickets = 3,000,000 input tokens and 1,500,000 output tokens.
- `GPT-5.6 Luna` pricing: ~$0.20/1M Input, ~$1.20/1M Output.
- **Estimated Cost:** ~$0.60 (Input) + ~$1.80 (Output) = **~$2.40 per 10,000 tickets.**

### Caching Strategy

**Is caching needed here?**

- *For Ticket Text (Task 1 & 2):* **No.** Support tickets are highly personalized. The chances of exact string matches (cache hits) are extremely low. Caching user inputs wastes memory and introduces unnecessary PII data privacy risks.
- *For Knowledge Base (Task 2):* **Yes.** In production, the vector embeddings of the Knowledge Base articles should be cached in a memory store (e.g., Redis) and invalidated via webhooks only when an article is edited in the CMS. This avoids redundant embedding API calls.
- *For LLM API (OpenAI Prompt Caching):* **Partial.** While tickets change, the System Prompt and JSON format remain identical. Currently, the prompt is too short (~300 tokens) to trigger OpenAI's automatic prompt caching (requires >1024 tokens). However, if the System Prompt grows in the future, OpenAI will automatically apply a 50% discount on cached input tokens.

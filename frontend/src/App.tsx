import { useState } from "react";
import { useClassifier } from "./hooks/useClassifier";
import { useAssistant } from "./hooks/useAssistant";
import { TEST_TICKETS } from "./tickets";
import css from "./App.module.css";

function App() {
  const [activeTab, setActiveTab] = useState<"classify" | "reply">("classify");
  const [ticketText, setTicketText] = useState("");

  const classifier = useClassifier();
  const assistant = useAssistant();

  const handleAction = () => {
    if (activeTab === "classify") classifier.classifyTicket(ticketText);
    else assistant.generateReply(ticketText);
  };

  const loading = classifier.loading || assistant.loading;
  const error = activeTab === "classify" ? classifier.error : assistant.error;

  return (
    <div className={css.container}>
      <h1>🌌 Nebula TechOps Dashboard</h1>

      <div className={css.tabs}>
        <button
          className={`${css.tabButton} ${activeTab === "classify" ? css.tabButtonActive : ""}`}
          onClick={() => setActiveTab("classify")}
        >
          Task 1: Ticket Classifier
        </button>
        <button
          className={`${css.tabButton} ${activeTab === "reply" ? css.tabButtonActive : ""}`}
          onClick={() => setActiveTab("reply")}
        >
          Task 2: AI Agent Assistant
        </button>
      </div>

      <div className={css.testTickets}>
        {TEST_TICKETS.map(({ id, text }) => (
          <button
            key={id}
            className={css.ticketChip}
            onClick={() => setTicketText(text)}
          >
            Test Ticket {id}
          </button>
        ))}
      </div>

      <textarea
        className={css.textarea}
        value={ticketText}
        onChange={(e) => setTicketText(e.target.value)}
        placeholder="Paste user ticket here..."
      />

      <button className={css.button} onClick={handleAction} disabled={loading}>
        {loading
          ? "Analyzing..."
          : activeTab === "classify"
            ? "Classify Ticket"
            : "Generate Drafts"}
      </button>

      {error && (
        <div className={css.error}>
          <strong>Error: </strong> {error}
        </div>
      )}

      {activeTab === "classify" && classifier.result && (
        <div className={css.resultCard}>
          <h3>Analysis Result:</h3>
          <p>
            <strong>Category:</strong>{" "}
            <span style={{ color: "#2563eb", fontWeight: "bold" }}>
              {classifier.result.category}
            </span>
          </p>
          <p>
            <strong>Priority:</strong>{" "}
            <span
              className={
                classifier.result.priority === "High"
                  ? css.highPriority
                  : classifier.result.priority === "Medium"
                    ? css.mediumPriority
                    : css.lowPriority
              }
            >
              {classifier.result.priority}
            </span>
          </p>
          <p>
            <strong>Recommended Action:</strong> <br />{" "}
            {classifier.result.next_step}
          </p>
        </div>
      )}

      {activeTab === "reply" && assistant.result && (
        <div className={css.resultCard}>
          {assistant.result.requires_human ? (
            <div className={css.humanWarning}>
              <h4>🚨 Human Intervention Required</h4>
              <p>
                <strong>Reason:</strong> {assistant.result.human_reason}
              </p>
              <p style={{ marginTop: "10px", fontSize: "14px" }}>
                <em>
                  Automated response drafting is disabled for this ticket due to
                  safety policies. Escalating to the manual review queue.
                </em>
              </p>
            </div>
          ) : (
            <>
              <h3>Ticket Summary</h3>
              <p>{assistant.result.summary}</p>

              <h3 style={{ marginTop: "20px" }}>Knowledge Base Context</h3>
              <p
                style={{
                  fontStyle: "italic",
                  color: "#4b5563",
                  borderLeft: "3px solid #cbd5e1",
                  paddingLeft: "10px",
                }}
              >
                "{assistant.result.knowledge_base_quote}"
              </p>

              <h3 style={{ marginTop: "20px" }}>Generated Drafts</h3>
              <div className={css.replyGrid}>
                {Object.entries(assistant.result.replies).map(
                  ([tone, text]) => (
                    <div key={tone} className={css.replyCard}>
                      <h4>{tone} Tone</h4>
                      <p>{text}</p>
                    </div>
                  ),
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;

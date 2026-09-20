import { useState } from "react";
import { useClassifier } from "./hooks/useClassifier";
import { useAssistant } from "./hooks/useAssistant";
import { ClassifierResult } from "./components/ClassifierResult/ClassifierResult";
import { AssistantResult } from "./components/AssistantResult/AssistantResult";
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
        <ClassifierResult result={classifier.result} />
      )}

      {activeTab === "reply" && assistant.result && (
        <AssistantResult result={assistant.result} />
      )}
    </div>
  );
}

export default App;

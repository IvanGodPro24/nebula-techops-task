import css from "./AssistantResult.module.css";
import { type AssistantResult as AssistantResultType } from "../../hooks/useAssistant";

interface Props {
  result: AssistantResultType;
}

const HumanInterventionBanner = ({ reason }: { reason: string | null }) => (
  <div className={css.humanWarning}>
    <h4>🚨 Human Intervention Required</h4>
    <p>
      <strong>Reason:</strong> {reason}
    </p>
    <p className={css.warningNote}>
      Automated response drafting is disabled for this ticket due to safety
      policies. Escalating to the manual review queue.
    </p>
  </div>
);

const AIDrafts = ({ result }: Props) => (
  <>
    <h3>Ticket Summary</h3>
    <p>{result.summary}</p>

    <h3 className={css.sectionTitle}>Knowledge Base Context</h3>
    <p className={css.kbQuote}>"{result.knowledge_base_quote}"</p>

    <h3 className={css.sectionTitle}>Generated Drafts</h3>
    <div className={css.replyGrid}>
      {Object.entries(result.replies).map(([tone, text]) => (
        <div key={tone} className={css.replyCard}>
          <h4>{tone} Tone</h4>
          <p>{text}</p>
        </div>
      ))}
    </div>
  </>
);

export const AssistantResult = ({ result }: Props) => {
  return (
    <div className={css.resultCard}>
      {result.requires_human ? (
        <HumanInterventionBanner reason={result.human_reason} />
      ) : (
        <AIDrafts result={result} />
      )}
    </div>
  );
};

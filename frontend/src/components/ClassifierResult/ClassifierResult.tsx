import css from "./ClassifierResult.module.css";
import { type TicketResult } from "../../hooks/useClassifier";

interface Props {
  result: TicketResult;
}

export const ClassifierResult = ({ result }: Props) => {
  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "Critical":
        return css.criticalPriority;
      case "High":
        return css.highPriority;
      case "Medium":
        return css.mediumPriority;
      case "Low":
      default:
        return css.lowPriority;
    }
  };

  return (
    <div className={css.resultCard}>
      <h3>Analysis Result:</h3>
      <p>
        <strong>Category: </strong>
        <span className={css.category}>{result.category}</span>
      </p>
      <p>
        <strong>Priority: </strong>
        <span className={getPriorityClass(result.priority)}>
          {result.priority}
        </span>
      </p>
      <p>
        <strong>Recommended Action:</strong> <br /> {result.next_step}
      </p>
    </div>
  );
};

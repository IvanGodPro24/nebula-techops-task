import { useReducer } from "react";
import axios from "axios";

export interface AssistantResult {
  summary: string;
  knowledge_base_quote: string;
  replies: {
    formal: string;
    empathetic: string;
    short: string;
  };
  requires_human: boolean;
  human_reason: string | null;
}

interface State {
  loading: boolean;
  error: string | null;
  result: AssistantResult | null;
}

type Action =
  | { type: "START" }
  | { type: "SUCCESS"; payload: AssistantResult }
  | { type: "ERROR"; payload: string };

const initialState: State = { loading: false, error: null, result: null };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "START":
      return { loading: true, error: null, result: null };
    case "SUCCESS":
      return { loading: false, error: null, result: action.payload };
    case "ERROR":
      return { loading: false, error: action.payload, result: null };
    default:
      return state;
  }
}

export const useAssistant = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const generateReply = async (ticketText: string) => {
    if (!ticketText.trim()) return;
    dispatch({ type: "START" });

    try {
      const response = await axios.post("http://localhost:3001/api/reply", {
        ticketText,
      });

      if (response.data.success) {
        dispatch({ type: "SUCCESS", payload: response.data.data });
      } else {
        dispatch({
          type: "ERROR",
          payload: response.data.error || "API Error",
        });
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        dispatch({
          type: "ERROR",
          payload: err.response?.data?.error || err.message,
        });
        console.error(err);
      } else if (err instanceof Error) {
        console.error(err);
        dispatch({ type: "ERROR", payload: err.message });
      } else {
        dispatch({ type: "ERROR", payload: "Network error" });
      }
    }
  };
  return { ...state, generateReply };
};

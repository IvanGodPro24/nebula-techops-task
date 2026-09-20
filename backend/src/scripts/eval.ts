import { classifyTicketService } from "../services/ai.service.js";

const EVALUATION_DATASET = [
  {
    input: "I feel completely hopeless and don't want to live anymore.",
    expected_category: "Crisis_Escalation",
    expected_priority: "Critical",
  },
  {
    input: "I was charged twice this month! I want my money back immediately!",
    expected_category: "Refund_Request",
    expected_priority: "High",
  },
  {
    input:
      "Why did you charge me $30 for the subscription? Explain the pricing.",
    expected_category: "Billing_and_Subscription",
    expected_priority: "Medium",
  },
  {
    input: "The app crashes every time I try to open the daily horoscope.",
    expected_category: "Technical_Bug",
    expected_priority: "High",
  },
  {
    input: "Expert Sarah was very rude to me during our reading.",
    expected_category: "Complaint_Expert",
    expected_priority: "Medium",
  },
  {
    input: "wtf",
    expected_category: "General_Inquiry",
    expected_priority: "Low",
  },
  {
    input: "help",
    expected_category: "General_Inquiry",
    expected_priority: "Low",
  },
];

const runEvaluation = async () => {
  console.log("Starting AI Classification Evaluation...\n");

  let passedCount = 0;
  const results = [];

  for (let i = 0; i < EVALUATION_DATASET.length; i++) {
    const testCase = EVALUATION_DATASET[i]!;
    console.log(`Testing ticket [${i + 1}/${EVALUATION_DATASET.length}]...`);

    const shortInput =
      testCase.input.length > 45
        ? testCase.input.substring(0, 42) + "..."
        : testCase.input;

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const actual = await classifyTicketService(testCase.input);

      const isCategoryMatch = actual.category === testCase.expected_category;
      const isPriorityMatch = actual.priority === testCase.expected_priority;
      const isPass = isCategoryMatch && isPriorityMatch;

      if (isPass) passedCount++;

      results.push({
        Input: shortInput,
        Expected: `${testCase.expected_category} (${testCase.expected_priority})`,
        Actual: `${actual.category} (${actual.priority})`,
        Status: isPass ? "PASS" : "FAIL",
      });
    } catch (error) {
      if (error instanceof Error) {
        results.push({
          Input: shortInput,
          Expected: `${testCase.expected_category} (${testCase.expected_priority})`,
          Actual: `ERROR: ${error.message}`,
          Status: "FAIL",
        });
      }
    }
  }

  console.table(results);

  const accuracy = ((passedCount / EVALUATION_DATASET.length) * 100).toFixed(1);
  console.log(
    `\nFinal Accuracy: ${accuracy}% (${passedCount}/${EVALUATION_DATASET.length} passed)\n`,
  );
};

runEvaluation();

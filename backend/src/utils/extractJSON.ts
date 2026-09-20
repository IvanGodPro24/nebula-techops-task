import { z } from "zod";

export const extractAndValidateJSON = <T>(
  text: string,
  schema: z.ZodType<T>,
): T => {
  const startIndex = text.indexOf("{");
  const endIndex = text.lastIndexOf("}");

  if (startIndex === -1 || endIndex === -1) {
    console.error("RAW AI OUTPUT:", text);
    throw new Error("No valid JSON structure found in AI response");
  }

  const jsonString = text.substring(startIndex, endIndex + 1);

  try {
    const parsedData = JSON.parse(jsonString);
    
    return schema.parse(parsedData);
  } catch (e) {
    if (e instanceof z.ZodError) {
      console.error("Zod Validation Error:", e.issues);
      throw new Error(
        `AI generated invalid data structure: ${e.issues[0]?.message}`,
        { cause: e },
      );
    }
    console.error("Failed to parse extracted JSON:", jsonString);
    throw new Error("Invalid JSON format", { cause: e });
  }
};

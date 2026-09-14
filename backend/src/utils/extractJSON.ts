export const extractJSON = (text: string) => {
  const startIndex = text.indexOf("{");
  const endIndex = text.lastIndexOf("}");

  if (startIndex !== -1 && endIndex !== -1) {
    const jsonString = text.substring(startIndex, endIndex + 1);
    try {
      return JSON.parse(jsonString);
    } catch {
      console.error("Failed to parse extracted JSON:", jsonString);
    }
  }
  console.error("RAW AI OUTPUT:", text);
  throw new Error("No valid JSON found in AI response");
};

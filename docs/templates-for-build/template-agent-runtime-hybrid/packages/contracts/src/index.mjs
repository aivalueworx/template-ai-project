export function validateAgentOutput(output) {
  if (!output || typeof output !== "object") {
    throw new Error("Agent output must be an object.");
  }

  return {
    contractChecked: true,
    ...output
  };
}

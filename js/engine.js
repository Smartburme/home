import { handleKnowledge } from "../knowledge.js";
import { handleGenerator } from "../generator.js";

// main process
export function processMessage(input) {
  // generator commands
  if (input.startsWith("text:") || input.startsWith("image:") || input.startsWith("code:")) {
    return handleGenerator(input);
  }
  // normal Q/A
  return handleKnowledge(input);
}

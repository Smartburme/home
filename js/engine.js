import { getKnowledgeAnswer } from "./knowledge.js";
import { getGeneratorAnswer } from "./generator.js";

export function processMessage(message) {
  message = message.toLowerCase();

  // မေးခွန်းကို စိစစ်မယ်
  if (["hi", "hello", "hey"].includes(message)) {
    return getKnowledgeAnswer(message);
  }

  if (message.includes("text generate")) {
    return getGeneratorAnswer("text", message);
  }
  if (message.includes("image generate")) {
    return getGeneratorAnswer("image", message);
  }
  if (message.includes("code generate")) {
    return getGeneratorAnswer("code", message);
  }

  return "မသိသေးပါ... မင်းထပ်ရှင်းပြပါ 🙃";
}

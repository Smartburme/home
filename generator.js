import { generateText } from "./docs/knowledge/text.js";
import { generateImage } from "./docs/knowledge/image.js";
import { generateCode } from "./docs/knowledge/coder.js";

export function handleGenerator(input) {
  if (input.startsWith("text:")) return generateText(input.replace("text:","").trim());
  if (input.startsWith("image:")) return generateImage(input.replace("image:","").trim());
  if (input.startsWith("code:")) return generateCode(input.replace("code:","").trim());
  return "🚫 Generator format မမှန်ပါ";
}

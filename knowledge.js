import { knowledge1 } from "./docs/answer/knowledge_1.js";
import { knowledge2 } from "./docs/answer/knowledge_2.js";
import { knowledge3 } from "./docs/answer/knowledge_3.js";
import { knowledge4 } from "./docs/answer/knowledge_4.js";

export function handleKnowledge(input) {
  return (
    knowledge1(input) ||
    knowledge2(input) ||
    knowledge3(input) ||
    knowledge4(input) ||
    "🤔 ဒီမေးခွန်းကို မသိသေးပါ။"
  );
}

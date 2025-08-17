import { knowledge_1 } from "./docs/answer/knowledge_1.js";
import { knowledge_2 } from "./docs/answer/knowledge_2.js";
import { knowledge_3 } from "./docs/answer/knowledge_3.js";
import { knowledge_4 } from "./docs/answer/knowledge_4.js";

export function getKnowledgeAnswer(msg) {
  // basic greeting
  if (knowledge_1[msg]) return knowledge_1[msg];

  // မသိတဲ့အခါ
  return "အဲဒါကို မသိသေးပါ။";
}

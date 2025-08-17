import { processMessage } from "./engine.js";

const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");
const btnSend = document.getElementById("btnSend");

// send button
btnSend.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return;
  chatBox.innerHTML += `<div>👤 ${text}</div>`;
  const reply = processMessage(text);
  chatBox.innerHTML += `<div>🤖 ${reply}</div>`;
  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;
});

// Right side buttons
document.getElementById("btnNew").addEventListener("click", () => chatBox.innerHTML = "🆕 New Chat started");
document.getElementById("btnHistory").addEventListener("click", () => chatBox.innerHTML += "<div>📜 History (coming soon)</div>");
document.getElementById("btnClear").addEventListener("click", () => chatBox.innerHTML = "");

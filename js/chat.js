import { processMessage } from "./engine.js";

const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");
const btnSend = document.getElementById("btnSend");

function addMessage(text, sender="bot") {
  const div = document.createElement("div");
  div.className = `msg ${sender}`;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Save to history
function saveHistory() {
  localStorage.setItem("chatHistory", chatBox.innerHTML);
}
function loadHistory() {
  chatBox.innerHTML = localStorage.getItem("chatHistory") || "";
}

// Send logic
function sendMessage() {
  const text = input.value.trim();
  if (!text) return;
  addMessage(text, "user");
  const reply = processMessage(text);
  setTimeout(() => {
    addMessage(reply, "bot");
    saveHistory();
  }, 300);
  input.value = "";
}

// Event listeners
btnSend.addEventListener("click", sendMessage);
input.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

// Right buttons
document.getElementById("btnNew").addEventListener("click", () => {
  chatBox.innerHTML = "";
  saveHistory();
});
document.getElementById("btnHistory").addEventListener("click", loadHistory);
document.getElementById("btnClear").addEventListener("click", () => {
  localStorage.clear();
  chatBox.innerHTML = "";
});

// Theme switch
document.getElementById("btnTheme").addEventListener("click", () => {
  const body = document.body;
  const theme = body.getAttribute("data-theme") === "dark" ? "light" : "dark";
  body.setAttribute("data-theme", theme);
});

// load history on startup
loadHistory();

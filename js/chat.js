// chat.js - Advanced Chat Interface with Full System Integration
class ChatSystem {
  constructor() {
    console.log("ChatSystem initializing...");
    this.initElements();
    this.initState();
    this.setupEventListeners();
    this.initializeChat();
    console.log("ChatSystem initialized successfully");
  }

  initElements() {
    console.log("Initializing elements...");
    this.userInput = document.getElementById('user-input');
    this.sendBtn = document.getElementById('send-btn');
    this.chatMessages = document.getElementById('chat-messages');
    this.historyItems = document.getElementById('history-items');
    this.systemStatus = document.getElementById('system-status');
    this.clearChatBtn = document.getElementById('clear-chat');
    
    if (!this.userInput || !this.sendBtn || !this.chatMessages) {
      console.error("Essential elements not found!");
      throw new Error("Required HTML elements not found");
    }
    
    this.typingIndicator = this.createTypingIndicator();
    this.chatMessages.appendChild(this.typingIndicator);
    console.log("Elements initialized");
  }

  initState() {
    console.log("Initializing state...");
    this.state = {
      isProcessing: false,
      messageHistory: this.loadChatHistory(),
      currentMode: 'basic'
    };
    console.log("State initialized with", this.state.messageHistory.length, "history items");
  }

  setupEventListeners() {
    console.log("Setting up event listeners...");
    this.sendBtn.addEventListener('click', () => this.sendMessage());
    this.clearChatBtn.addEventListener('click', () => this.clearChat());
    
    this.userInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
    
    this.userInput.addEventListener('input', () => this.adjustInputHeight());
    console.log("Event listeners set up");
  }

  initializeChat() {
    console.log("Initializing chat...");
    this.displayHistory();
    if (this.state.messageHistory.length === 0) {
      this.displaySystemMessage("Hello! I'm your AI assistant. Ask me anything!");
    }
    console.log("Chat initialized");
  }

  async sendMessage() {
    console.log("Sending message...");
    if (this.state.isProcessing) {
      console.log("Already processing, ignoring new message");
      return;
    }
    
    const message = this.userInput.value.trim();
    if (!message) {
      console.log("Empty message, ignoring");
      return;
    }

    console.log("Processing message:", message);
    const userMsg = this.createMessage('user', message);
    
    this.displayMessage(userMsg);
    this.saveToHistory(userMsg);
    this.clearInput();
    this.showTypingIndicator();
    
    this.state.isProcessing = true;

    try {
      console.log("Processing through knowledge engine...");
      const response = await this.processMessage(message);
      console.log("Received response:", response);
      
      const botMsg = this.createMessage('bot', response.content, response.links);
      
      this.displayMessage(botMsg);
      this.saveToHistory(botMsg);
      this.updateSystemStatus(response.mode);
      
      if (response.specialContent) {
        console.log("Displaying special content:", response.specialContent.type);
        this.displaySpecialContent(response.specialContent, botMsg);
      }
    } catch (error) {
      console.error("Chat processing error:", error);
      this.displayErrorMessage();
    } finally {
      this.hideTypingIndicator();
      this.state.isProcessing = false;
      console.log("Message processing complete");
    }
  }

  async processMessage(message) {
    console.log("Processing message in knowledge engine...");
    if (!window.KnowledgeEngine) {
      console.error("KnowledgeEngine not found in window object");
      throw new Error("Knowledge engine not available");
    }
    
    try {
      const response = await KnowledgeEngine.processUserInput(message);
      console.log("Knowledge engine response:", response);
      return response;
    } catch (error) {
      console.error("Error in processMessage:", error);
      throw error;
    }
  }

  // UI Methods with additional error checking
  createMessage(sender, content, links = [], timestamp = new Date()) {
    if (!sender || !content) {
      console.error("Invalid message parameters:", {sender, content});
      throw new Error("Sender and content are required");
    }
    
    return { 
      sender, 
      content: content.toString(), 
      links: Array.isArray(links) ? links : [], 
      timestamp 
    };
  }

  displayMessage(msg, isHistory = false) {
    try {
      if (!msg || !msg.sender || !msg.content) {
        console.error("Invalid message object:", msg);
        return;
      }

      const messageElement = document.createElement('div');
      messageElement.className = `message ${msg.sender}-message`;
      
      // Message content
      const contentElement = document.createElement('div');
      contentElement.className = 'message-content';
      contentElement.innerHTML = this.formatContent(msg.content);
      messageElement.appendChild(contentElement);
      
      // Add links if available
      if (msg.links && msg.links.length > 0) {
        const linksElement = document.createElement('div');
        linksElement.className = 'message-links';
        
        const linksTitle = document.createElement('strong');
        linksTitle.textContent = 'Recommended Resources:';
        linksElement.appendChild(linksTitle);
        
        msg.links.forEach(link => {
          if (link && link.url && link.title) {
            const linkElement = document.createElement('a');
            linkElement.href = link.url;
            linkElement.target = '_blank';
            linkElement.rel = 'noopener noreferrer';
            linkElement.textContent = link.title;
            linksElement.appendChild(linkElement);
            linksElement.appendChild(document.createElement('br'));
          }
        });
        
        if (linksElement.children.length > 1) { // More than just the title
          messageElement.appendChild(linksElement);
        }
      }
      
      // Add timestamp
      const timeElement = document.createElement('div');
      timeElement.className = 'message-time';
      timeElement.textContent = this.formatTime(msg.timestamp);
      messageElement.appendChild(timeElement);
      
      // Add to chat
      this.chatMessages.insertBefore(messageElement, this.typingIndicator);
      
      if (!isHistory) {
        messageElement.scrollIntoView({ behavior: 'smooth' });
      }
      
      return messageElement;
    } catch (error) {
      console.error("Error displaying message:", error);
    }
  }

  // ... (rest of the methods remain the same with added logging)

  loadChatHistory() {
    try {
      const history = JSON.parse(localStorage.getItem('chatHistory')) || [];
      console.log("Loaded chat history with", history.length, "items");
      return history.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp || Date.now())
      }));
    } catch (error) {
      console.error("Error loading chat history:", error);
      return [];
    }
  }

  // ... (other utility methods with added error handling)
}

// Enhanced initialization with error handling
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM fully loaded, initializing ChatSystem...");
  try {
    new ChatSystem();
    console.log("ChatSystem initialized successfully");
  } catch (error) {
    console.error("Failed to initialize ChatSystem:", error);
    // Display error to user
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = "Failed to initialize chat system. Please refresh the page.";
    document.body.prepend(errorDiv);
  }
});

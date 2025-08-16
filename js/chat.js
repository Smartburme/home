// chat.js - Advanced Chat Interface with Knowledge System Integration
class ChatSystem {
  constructor() {
    this.initElements();
    this.initState();
    this.setupEventListeners();
    this.initializeChat();
  }

  initElements() {
    this.userInput = document.getElementById('user-input');
    this.sendBtn = document.getElementById('send-btn');
    this.chatMessages = document.getElementById('chat-messages');
    this.systemStatus = document.getElementById('system-status');
    this.typingIndicator = this.createTypingIndicator();
    this.chatMessages.appendChild(this.typingIndicator);
  }

  initState() {
    this.state = {
      isProcessing: false,
      messageHistory: this.loadChatHistory(),
      currentMode: 'basic',
      knowledgeSources: {
        basic: ['knowledge-1.js', 'knowledge-2.js'],
        advanced: {
          text: ['text-link.js', 'text-knowledge.js'],
          code: ['coder-link.js', 'coder-knowledge.js'],
          image: ['image-link.js', 'image-knowledge.js']
        }
      }
    };
  }

  setupEventListeners() {
    this.sendBtn.addEventListener('click', () => this.sendMessage());
    this.userInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
    this.userInput.addEventListener('input', () => this.adjustInputHeight());
  }

  initializeChat() {
    this.displayHistory();
    if (this.state.messageHistory.length === 0) {
      this.displaySystemMessage("Hello! I'm your AI assistant. Ask me anything!");
    }
  }

  async sendMessage() {
    if (this.state.isProcessing) return;
    
    const message = this.userInput.value.trim();
    if (!message) return;

    // Display user message
    const userMsg = this.createMessage('user', message);
    this.displayMessage(userMsg);
    this.saveToHistory(userMsg);
    this.clearInput();

    // Process message
    this.showTypingIndicator();
    this.state.isProcessing = true;

    try {
      const response = await this.processUserQuery(message);
      const botMsg = this.createMessage('bot', response.content, response.links);
      
      this.displayMessage(botMsg);
      this.saveToHistory(botMsg);
      this.updateSystemStatus(response.mode);
      
      // Handle any links or special content
      if (response.specialContent) {
        this.handleSpecialContent(response.specialContent);
      }
    } catch (error) {
      console.error("Chat processing error:", error);
      this.displayErrorMessage();
    } finally {
      this.hideTypingIndicator();
      this.state.isProcessing = false;
    }
  }

  async processUserQuery(message) {
    // First try basic knowledge
    let response = processUserInput(message);
    let mode = 'basic';
    let links = [];
    let specialContent = null;

    // If no answer from basic knowledge, try advanced
    if (response.includes("I don't know")) {
      const advancedResponse = await this.queryAdvancedKnowledge(message);
      if (advancedResponse) {
        response = advancedResponse.content;
        mode = 'advanced';
        links = advancedResponse.links || [];
        specialContent = advancedResponse.specialContent || null;
      }
    }

    return { content: response, mode, links, specialContent };
  }

  async queryAdvancedKnowledge(query) {
    try {
      // Determine query type (text, code, or image)
      const queryType = this.determineQueryType(query);
      
      // Load appropriate knowledge files if not already loaded
      await this.loadKnowledgeFiles(queryType);
      
      // Process through reader-link system
      const response = await searchExternalResources(query, queryType);
      
      return {
        content: response.answer,
        links: response.resources,
        specialContent: response.specialContent
      };
    } catch (error) {
      console.error("Advanced knowledge error:", error);
      return null;
    }
  }

  determineQueryType(query) {
    const codingKeywords = ['code', 'program', 'function', 'algorithm'];
    const imageKeywords = ['image', 'photo', 'picture', 'graphic'];
    
    if (codingKeywords.some(keyword => query.toLowerCase().includes(keyword))) {
      return 'code';
    } else if (imageKeywords.some(keyword => query.toLowerCase().includes(keyword))) {
      return 'image';
    }
    return 'text';
  }

  async loadKnowledgeFiles(type) {
    const files = this.state.knowledgeSources.advanced[type];
    if (!files) return;
    
    // Implementation would actually load JS files here
    console.log(`Loading ${type} knowledge files:`, files);
  }

  // UI Helper Methods
  createMessage(sender, content, links = [], timestamp = new Date()) {
    return { sender, content, links, timestamp };
  }

  displayMessage(msg, isHistory = false) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${msg.sender}-message`;
    
    // Content
    const contentElement = document.createElement('div');
    contentElement.className = 'message-content';
    contentElement.innerHTML = this.formatContent(msg.content);
    messageElement.appendChild(contentElement);
    
    // Links
    if (msg.links.length > 0) {
      const linksElement = document.createElement('div');
      linksElement.className = 'message-links';
      linksElement.innerHTML = '<strong>Recommended Resources:</strong><br>' + 
        msg.links.map(link => 
          `<a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.title}</a>`
        ).join('<br>');
      messageElement.appendChild(linksElement);
    }
    
    // Timestamp
    const timeElement = document.createElement('div');
    timeElement.className = 'message-time';
    timeElement.textContent = this.formatTime(msg.timestamp);
    messageElement.appendChild(timeElement);
    
    // Add to chat
    this.chatMessages.insertBefore(messageElement, this.typingIndicator);
    
    if (!isHistory) {
      messageElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  displaySystemMessage(content) {
    const msg = this.createMessage('system', content);
    this.displayMessage(msg);
    this.saveToHistory(msg);
  }

  displayErrorMessage() {
    this.displaySystemMessage("Sorry, I encountered an issue processing your request. Please try again.");
  }

  displayHistory() {
    this.state.messageHistory.forEach(msg => {
      this.displayMessage(msg, true);
    });
  }

  // Utility Methods
  formatContent(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }

  formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  createTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.innerHTML = '<span></span><span></span><span></span>';
    indicator.style.display = 'none';
    return indicator;
  }

  showTypingIndicator() {
    this.typingIndicator.style.display = 'flex';
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  hideTypingIndicator() {
    this.typingIndicator.style.display = 'none';
  }

  adjustInputHeight() {
    this.userInput.style.height = 'auto';
    this.userInput.style.height = (this.userInput.scrollHeight) + 'px';
  }

  clearInput() {
    this.userInput.value = '';
    this.userInput.style.height = 'auto';
    this.userInput.focus();
  }

  saveToHistory(message) {
    this.state.messageHistory.push({
      sender: message.sender,
      content: message.content,
      timestamp: message.timestamp.getTime()
    });
    
    // Keep last 100 messages
    if (this.state.messageHistory.length > 100) {
      this.state.messageHistory.shift();
    }
    
    localStorage.setItem('chatHistory', JSON.stringify(this.state.messageHistory));
  }

  loadChatHistory() {
    const history = JSON.parse(localStorage.getItem('chatHistory')) || [];
    return history.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }));
  }

  updateSystemStatus(mode) {
    if (this.state.currentMode !== mode) {
      this.state.currentMode = mode;
      this.systemStatus.textContent = mode === 'advanced' ? 
        'Advanced Knowledge Mode' : 'Basic Knowledge Mode';
      this.systemStatus.className = mode === 'advanced' ? 'advanced-mode' : 'basic-mode';
    }
  }

  handleSpecialContent(content) {
    // Handle images, code snippets, etc.
    if (content.type === 'code') {
      const codeElement = document.createElement('pre');
      codeElement.className = 'code-snippet';
      codeElement.textContent = content.value;
      this.chatMessages.appendChild(codeElement);
    }
    // Add other special content handlers as needed
  }
}

// Initialize the chat system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const chatSystem = new ChatSystem();
});

// Public interface for other components
function sendChatMessage(message) {
  // Can be called from other components if needed
  const chatSystem = new ChatSystem();
  chatSystem.sendMessage(message);
          }

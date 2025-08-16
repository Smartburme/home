// chat.js - Advanced Chat Interface with Full System Integration
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
    this.historyItems = document.getElementById('history-items');
    this.systemStatus = document.getElementById('system-status');
    this.clearChatBtn = document.getElementById('clear-chat');
    this.typingIndicator = this.createTypingIndicator();
    this.chatMessages.appendChild(this.typingIndicator);
  }

  initState() {
    this.state = {
      isProcessing: false,
      messageHistory: this.loadChatHistory(),
      currentMode: 'basic'
    };
  }

  setupEventListeners() {
    this.sendBtn.addEventListener('click', () => this.sendMessage());
    this.clearChatBtn.addEventListener('click', () => this.clearChat());
    
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
    if (this.state.isProcessing || !this.userInput.value.trim()) return;
    
    const message = this.userInput.value.trim();
    const userMsg = this.createMessage('user', message);
    
    this.displayMessage(userMsg);
    this.saveToHistory(userMsg);
    this.clearInput();
    this.showTypingIndicator();
    
    this.state.isProcessing = true;

    try {
      // Process through the knowledge engine
      const response = await this.processMessage(message);
      const botMsg = this.createMessage('bot', response.content, response.links);
      
      this.displayMessage(botMsg);
      this.saveToHistory(botMsg);
      this.updateSystemStatus(response.mode);
      
      // Handle any special content (images, code snippets)
      if (response.specialContent) {
        this.displaySpecialContent(response.specialContent, botMsg);
      }
    } catch (error) {
      console.error("Chat error:", error);
      this.displayErrorMessage();
    } finally {
      this.hideTypingIndicator();
      this.state.isProcessing = false;
    }
  }

  async processMessage(message) {
    // Use the knowledge engine to process the message
    if (!window.KnowledgeEngine) {
      throw new Error("Knowledge engine not available");
    }
    
    return await KnowledgeEngine.processUserInput(message);
  }

  // UI Methods
  createMessage(sender, content, links = [], timestamp = new Date()) {
    return { sender, content, links, timestamp };
  }

  displayMessage(msg, isHistory = false) {
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
        const linkElement = document.createElement('a');
        linkElement.href = link.url;
        linkElement.target = '_blank';
        linkElement.rel = 'noopener noreferrer';
        linkElement.textContent = link.title;
        linksElement.appendChild(linkElement);
        linksElement.appendChild(document.createElement('br'));
      });
      
      messageElement.appendChild(linksElement);
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
  }

  displaySpecialContent(content, parentMsg) {
    if (!content || !parentMsg) return;
    
    let contentElement;
    
    switch(content.type) {
      case 'code':
        contentElement = document.createElement('pre');
        contentElement.className = 'code-snippet';
        contentElement.textContent = content.value;
        break;
        
      case 'image':
        contentElement = document.createElement('img');
        contentElement.className = 'embedded-image';
        contentElement.src = content.value;
        contentElement.alt = 'Related image content';
        break;
        
      default:
        return;
    }
    
    // Find the message element and append the special content
    const messages = this.chatMessages.getElementsByClassName(`${parentMsg.sender}-message`);
    if (messages.length > 0) {
      messages[messages.length - 1].appendChild(contentElement);
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
    this.historyItems.innerHTML = '';
    this.state.messageHistory.forEach(msg => {
      if (msg.sender !== 'system') {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.textContent = msg.content.length > 30 
          ? msg.content.substring(0, 30) + '...' 
          : msg.content;
        historyItem.addEventListener('click', () => this.resendMessage(msg));
        this.historyItems.appendChild(historyItem);
      }
    });
  }

  resendMessage(msg) {
    this.userInput.value = msg.content;
    this.userInput.focus();
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
    this.displayHistory();
  }

  loadChatHistory() {
    const history = JSON.parse(localStorage.getItem('chatHistory')) || [];
    return history.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }));
  }

  clearChat() {
    if (confirm("Are you sure you want to clear the chat history?")) {
      this.chatMessages.innerHTML = '';
      this.typingIndicator = this.createTypingIndicator();
      this.chatMessages.appendChild(this.typingIndicator);
      this.state.messageHistory = [];
      localStorage.removeItem('chatHistory');
      this.displaySystemMessage("Chat history cleared. Start a new conversation!");
    }
  }

  updateSystemStatus(mode) {
    if (this.state.currentMode !== mode) {
      this.state.currentMode = mode;
      
      const statusText = this.systemStatus.querySelector('span:not(.status-indicator)');
      const statusIndicator = this.systemStatus.querySelector('.status-indicator');
      
      if (mode === 'advanced') {
        statusText.textContent = 'Advanced Mode';
        statusIndicator.classList.remove('basic');
        statusIndicator.classList.add('advanced');
      } else {
        statusText.textContent = 'Basic Mode';
        statusIndicator.classList.remove('advanced');
        statusIndicator.classList.add('basic');
      }
    }
  }
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  new ChatSystem();
});

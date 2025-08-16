// Enhanced Chat UI with Rich Features
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.innerHTML = '<span></span><span></span><span></span>';
    typingIndicator.style.display = 'none';
    chatMessages.appendChild(typingIndicator);

    // Chat History
    let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];

    // Load previous chat history
    if (chatHistory.length > 0) {
        chatHistory.forEach(msg => {
            displayMessage(msg.sender, msg.message, msg.timestamp, true);
        });
    }

    // Enhanced Send Message Function
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // Display user message
        const userTimestamp = new Date();
        displayMessage('user', message, userTimestamp);
        saveToHistory('user', message, userTimestamp);

        // Clear input
        userInput.value = '';
        userInput.focus();

        // Show typing indicator
        typingIndicator.style.display = 'flex';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            // Process message with enhanced engine
            const response = await processUserInput(message);
            
            // Display bot response after a small delay for natural feel
            setTimeout(() => {
                typingIndicator.style.display = 'none';
                const botTimestamp = new Date();
                displayMessage('bot', response, botTimestamp);
                saveToHistory('bot', response, botTimestamp);
            }, 800);
        } catch (error) {
            typingIndicator.style.display = 'none';
            const errorTimestamp = new Date();
            const errorMessage = "Sorry, I encountered an error. Please try again.";
            displayMessage('bot', errorMessage, errorTimestamp);
            saveToHistory('bot', errorMessage, errorTimestamp);
            console.error("Chat error:", error);
        }
    }

    // Enhanced Display Message Function
    function displayMessage(sender, message, timestamp, isHistory = false) {
        if (!isHistory) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        const messageContainer = document.createElement('div');
        messageContainer.className = `message-container ${sender}-container`;

        const messageElement = document.createElement('div');
        messageElement.className = `${sender}-message`;

        // Format message content (basic markdown support)
        const formattedMessage = formatMessageContent(message);
        messageElement.innerHTML = formattedMessage;

        // Add timestamp
        const timeElement = document.createElement('div');
        timeElement.className = 'message-time';
        timeElement.textContent = formatTime(timestamp);
        
        messageContainer.appendChild(messageElement);
        messageContainer.appendChild(timeElement);
        
        // Insert before typing indicator
        chatMessages.insertBefore(messageContainer, typingIndicator);

        // Smooth scroll for new messages only
        if (!isHistory) {
            messageContainer.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Save message to history
    function saveToHistory(sender, message, timestamp) {
        chatHistory.push({
            sender,
            message,
            timestamp: timestamp.getTime()
        });
        
        // Keep only the last 50 messages
        if (chatHistory.length > 50) {
            chatHistory = chatHistory.slice(-50);
        }
        
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }

    // Helper Functions
    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function formatMessageContent(message) {
        // Simple markdown formatting
        return message
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // bold
            .replace(/\*(.*?)\*/g, '<em>$1</em>') // italic
            .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>') // links
            .replace(/\n/g, '<br>'); // new lines
    }

    // Event Listeners with Enhancements
    sendBtn.addEventListener('click', sendMessage);
    
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Input height adjustment for multiline
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // Clear chat button
    const clearBtn = document.createElement('button');
    clearBtn.id = 'clear-chat';
    clearBtn.textContent = 'Clear Chat';
    clearBtn.addEventListener('click', function() {
        chatMessages.innerHTML = '';
        chatHistory = [];
        localStorage.removeItem('chatHistory');
        chatMessages.appendChild(typingIndicator);
    });
    document.querySelector('.chat-controls').appendChild(clearBtn);
});

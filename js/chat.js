// Chat UI နဲ့ User Interaction ကိုကိုင်တွယ်မယ်
document.addEventListener('DOMContentLoaded', function() {
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');
    
    // User Message ပို့တဲ့ Function
    function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            // User Message ကို Chat မှာပြမယ်
            displayMessage('user', message);
            
            // Engine.js ကိုပို့ပြီး Processing လုပ်မယ်
            const response = processUserInput(message);
            
            // Bot Response ကို Chat မှာပြမယ်
            displayMessage('bot', response);
            
            // Input Field ကိုရှင်းမယ်
            userInput.value = '';
        }
    }
    
    // Message ကို Chat မှာပြမယ်
    function displayMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Event Listeners
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});

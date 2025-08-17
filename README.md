# JavaScript နဲ့ Chat System တည်ဆောက်နည်း

သင့်ရဲ့ website မှာ chat system တစ်ခုတည်ဆောက်ဖို့ လိုအပ်တဲ့ အဆင့်ဆင့်ကို ရှင်းပြပေးပါမယ်။

## Project Structure
```
/index.html          - Main application file
/css/style.css       - All styling
/js/
  ├── chat.js        - Chat interface and logic
  ├── engine.js      - Core processing engine
  └── reader-link.js - Advanced knowledge processor
/docs/
  ├── knowledge-1.js - Basic Q&A pairs
  ├── knowledge-2.js - More basic Q&A
  ├── text-link.js   - Text resource processor
  ├── coder-link.js  - Coding resource processor
  └── image-link.js  - Image resource processor
/knowledge/
  ├── text-knowledge.js    - 100 text resources
  ├── coder-knowledge.js   - 100 coding resources
  └── image-knowledge.js   - 100 image resources
```

## 1. index.html ဖိုင်တည်ဆောက်ပုံ

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Chat App</title>
</head>
<body>
    <div id="chat-container">
        <div id="chat-messages"></div>
        <input type="text" id="user-input" placeholder="Type your message...">
        <button id="send-btn">Send</button>
    </div>

    <!-- JavaScript Files -->
    <script src="js/engine.js"></script>
    <script src="docs/knowledge-1.js"></script>
    <script src="docs/knowledge-2.js"></script>
    <script src="js/chat.js"></script>
</body>
</html>
```

## 2. chat.js ဖိုင်တည်ဆောက်ပုံ

```javascript
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
```

## 3. engine.js ဖိုင်တည်ဆောက်ပုံ

```javascript
// Knowledge Base တွေကိုပေါင်းစည်းပြီး Processing လုပ်မယ်
function processUserInput(input) {
    // Knowledge Base တွေကနေ အဖြေရှာမယ်
    let response = searchKnowledgeBase(input);
    
    // အဖြေမတွေ့ရင် Default Message
    if (!response) {
        response = "I don't have information about that yet.";
    }
    
    return response;
}

// Knowledge Base တွေထဲမှာ Search လုပ်မယ်
function searchKnowledgeBase(query) {
    // Knowledge 1 ထဲမှာရှာမယ်
    if (knowledge1[query.toLowerCase()]) {
        return knowledge1[query.toLowerCase()];
    }
    
    // Knowledge 2 ထဲမှာရှာမယ်
    if (knowledge2[query.toLowerCase()]) {
        return knowledge2[query.toLowerCase()];
    }
    
    // မတွေ့ရင် null return
    return null;
}
```

## 4. Knowledge Base ဖိုင်တွေတည်ဆောက်ပုံ (docs/knowledge-1.js)

```javascript
// Knowledge Base 1 - Questions and Answers
const knowledge1 = {
    "hello": "Hello! How can I help you today?",
    "how are you": "I'm just a bot, but thanks for asking!",
    "what's your name": "I'm a simple chat bot created to help you.",
    "goodbye": "Goodbye! Have a nice day!"
};
```

## 5. Knowledge Base ဖိုင်တွေတည်ဆောက်ပုံ (docs/knowledge-2.js)

```javascript
// Knowledge Base 2 - More Questions and Answers
const knowledge2 = {
    "what time is it": "I don't have access to the current time.",
    "tell me a joke": "Why don't scientists trust atoms? Because they make up everything!",
    "help": "I can answer simple questions. Try asking me about general topics."
};
```

## အလုပ်လုပ်ပုံ
1. User က Message ရိုက်ပြီး Send လုပ်တဲ့အခါ `chat.js` က Message ကိုဖမ်းမယ်
2. `chat.js` က `engine.js` ထဲက `processUserInput()` function ကိုခေါ်မယ်
3. `engine.js` က Knowledge Base တွေထဲမှာ အဖြေရှာမယ်
4. တွေ့ရင် Response ကို `chat.js` ဆီပြန်ပို့မယ်
5. `chat.js` က Response ကို Chat UI မှာပြမယ်

## ထပ်မံအဆင့်မြှင့်နည်းများ
- **AJAX/Fetch API** သုံးပြီး Knowledge Base တွေကို Dynamic လုပ်လို့ရတယ်
- **Local Storage** သုံးပြီး Chat History သိမ်းထားလို့ရတယ်
- **Regular Expressions** သုံးပြီး ပိုကောင်းတဲ့ Search လုပ်လို့ရတယ်

ဒီ System ကို GitHub Pages မှာ Hosting လုပ်ရင် အဆင်ပြေပြေအလုပ်လုပ်ပါလိမ့်မယ်။ အဆင်မပြေတာရှိရင် ထပ်မေးနိုင်ပါတယ်။

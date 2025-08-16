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

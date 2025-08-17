class Engine {
    static process(message) {
        // First check if it's a basic message
        const basicResponse = Knowledge.checkBasic(message);
        if (basicResponse) return basicResponse;
        
        // Check if it's a generator request
        if (message.toLowerCase().includes('generate')) {
            return Generator.process(message);
        }
        
        // Default response
        return "နားမလည်ပါ။ ထပ်မံရှင်းပြပေးပါ။";
    }
}

// engine.js - Updated Version
class KnowledgeEngine {
  constructor() {
    this.knowledgeBases = {
      basic: {},
      advanced: {}
    };
  }

  // Initialize knowledge bases
  init() {
    // Basic knowledge
    this.knowledgeBases.basic.knowledge1 = window.knowledge1 || {};
    this.knowledgeBases.basic.knowledge2 = window.knowledge2 || {};
    
    // Advanced knowledge
    this.knowledgeBases.advanced.text = window.textKnowledgeDB || [];
    this.knowledgeBases.advanced.code = window.coderKnowledgeDB || [];
    this.knowledgeBases.advanced.image = window.imageKnowledgeDB || [];
    
    console.log("KnowledgeEngine initialized", this.knowledgeBases);
  }

  // Main processing function
  async processInput(input) {
    if (!input || typeof input !== 'string') {
      return "Please enter a valid question.";
    }

    const query = input.trim().toLowerCase();
    if (!query) return "Please enter a valid question.";

    // Initialize if not done
    if (!this.knowledgeBases.basic.knowledge1) {
      this.init();
    }

    // 1. Try basic knowledge first
    const basicResponse = this.queryBasicKnowledge(query);
    if (basicResponse.found) {
      console.log("Found in basic knowledge");
      return basicResponse.answer;
    }

    // 2. Try advanced knowledge
    const advancedResponse = await this.queryAdvancedKnowledge(query);
    if (advancedResponse) {
      console.log("Found in advanced knowledge");
      return advancedResponse;
    }

    // 3. Final fallback
    return "I don't have information about that yet. Please try another question.";
  }

  // Query basic knowledge
  queryBasicKnowledge(query) {
    for (const [name, kb] of Object.entries(this.knowledgeBases.basic)) {
      // Exact match
      if (kb[query]) {
        return { found: true, answer: kb[query] };
      }
      
      // Partial match
      for (const [key, value] of Object.entries(kb)) {
        if (query.includes(key) || key.includes(query)) {
          return { found: true, answer: value };
        }
      }
    }
    return { found: false };
  }

  // Query advanced knowledge
  async queryAdvancedKnowledge(query) {
    try {
      // Determine query type
      const queryType = this.determineQueryType(query);
      
      // Get appropriate knowledge base
      const knowledgeBase = this.knowledgeBases.advanced[queryType];
      if (!knowledgeBase || knowledgeBase.length === 0) {
        console.error("No knowledge base for", queryType);
        return null;
      }
      
      // Find matching resources
      const matches = knowledgeBase.filter(item =>
        item.keywords.some(kw => query.includes(kw.toLowerCase()))
      );
      
      if (matches.length === 0) return null;
      
      // Format response
      const topMatch = matches[0];
      let response = `I found information about "${query}": ${topMatch.title}\n`;
      response += `You can learn more here: ${topMatch.url}`;
      
      return response;
    } catch (error) {
      console.error("Advanced query error:", error);
      return null;
    }
  }

  // Determine query type (text, code, or image)
  determineQueryType(query) {
    const codingKeywords = ['code', 'program', 'function', 'algorithm', 'python', 'javascript'];
    const imageKeywords = ['image', 'photo', 'picture', 'graphic', 'png', 'jpg'];
    
    if (codingKeywords.some(kw => query.includes(kw))) {
      return 'code';
    } else if (imageKeywords.some(kw => query.includes(kw))) {
      return 'image';
    }
    return 'text';
  }
}

// Initialize and export
const knowledgeEngine = new KnowledgeEngine();
knowledgeEngine.init(); // Initialize immediately

window.KnowledgeEngine = {
  processUserInput: (input) => knowledgeEngine.processInput(input),
  instance: knowledgeEngine
};

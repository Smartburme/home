// engine.js - Core Knowledge Processing Engine
class KnowledgeEngine {
  constructor() {
    this.knowledgeBases = {};
    this.initialized = false;
  }

  // Initialize knowledge bases
  async init() {
    if (this.initialized) return;
    
    // Load basic knowledge
    this.knowledgeBases.basic = {
      knowledge1: typeof knowledge1 !== 'undefined' ? knowledge1 : {},
      knowledge2: typeof knowledge2 !== 'undefined' ? knowledge2 : {}
    };
    
    // Initialize reader-link system
    if (typeof initReaderLink === 'function') {
      await initReaderLink();
    }
    
    this.initialized = true;
    console.log("Knowledge engine initialized");
  }

  // Main processing function
  async processInput(input) {
    if (!this.initialized) await this.init();
    
    // Clean and prepare input
    const query = input.trim().toLowerCase();
    if (!query) return "Please enter a valid query.";

    // Try basic knowledge first
    const basicResponse = this.queryBasicKnowledge(query);
    if (basicResponse.found) {
      return {
        content: basicResponse.answer,
        mode: 'basic',
        sources: ['knowledge-1.js', 'knowledge-2.js']
      };
    }

    // Fall back to advanced knowledge
    const advancedResponse = await this.queryAdvancedKnowledge(query);
    if (advancedResponse) {
      return {
        content: advancedResponse.answer,
        mode: 'advanced',
        sources: advancedResponse.sources,
        links: advancedResponse.links,
        specialContent: advancedResponse.specialContent
      };
    }

    // Final fallback
    return {
      content: "I couldn't find information about that topic.",
      mode: 'basic',
      sources: []
    };
  }

  // Query basic knowledge bases
  queryBasicKnowledge(query) {
    for (const [name, kb] of Object.entries(this.knowledgeBases.basic)) {
      if (kb[query]) {
        return { found: true, answer: kb[query] };
      }
      
      // Check for partial matches
      for (const [key, value] of Object.entries(kb)) {
        if (query.includes(key) || key.includes(query)) {
          return { found: true, answer: value };
        }
      }
    }
    return { found: false };
  }

  // Query advanced knowledge system
  async queryAdvancedKnowledge(query) {
    if (typeof searchExternalResources !== 'function') {
      console.error("Reader-link system not available");
      return null;
    }
    
    try {
      const response = await searchExternalResources(query);
      return {
        answer: response.answer,
        sources: response.sources,
        links: response.links,
        specialContent: response.specialContent
      };
    } catch (error) {
      console.error("Advanced knowledge error:", error);
      return null;
    }
  }
}

// Initialize the engine
const knowledgeEngine = new KnowledgeEngine();

// Main exported function
async function processUserInput(input) {
  return await knowledgeEngine.processInput(input);
}

// Public API
window.KnowledgeEngine = {
  processUserInput,
  instance: knowledgeEngine
};

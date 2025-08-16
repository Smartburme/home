// Enhanced Knowledge Processing System
class KnowledgeProcessor {
  constructor() {
    this.knowledgeBases = [];
    this.searchStrategies = [
      this.exactMatchSearch,
      this.partialMatchSearch,
      this.synonymSearch,
      this.externalResourceSearch
    ];
  }

  // Initialize with knowledge bases
  initKnowledgeBases(...bases) {
    this.knowledgeBases = bases.filter(base => base !== undefined);
  }

  // Main processing function
  async processUserInput(input) {
    if (!input || typeof input !== 'string') {
      return "Please provide a valid input.";
    }

    const query = input.trim().toLowerCase();
    let response = null;

    // Try each search strategy in order
    for (const strategy of this.searchStrategies) {
      response = await strategy.call(this, query);
      if (response) break;
    }

    return response || this.getDefaultResponse(query);
  }

  // 1. Exact match search
  exactMatchSearch(query) {
    for (const base of this.knowledgeBases) {
      if (base[query]) {
        return base[query];
      }
    }
    return null;
  }

  // 2. Partial match search
  partialMatchSearch(query) {
    for (const base of this.knowledgeBases) {
      const match = Object.entries(base).find(([key]) => 
        query.includes(key) || key.includes(query)
      );
      if (match) return match[1];
    }
    return null;
  }

  // 3. Synonym-based search
  synonymSearch(query) {
    const synonyms = this.getSynonyms(query);
    for (const base of this.knowledgeBases) {
      for (const syn of synonyms) {
        if (base[syn]) {
          return base[syn];
        }
      }
    }
    return null;
  }

  // 4. External resource search
  externalResourceSearch(query) {
    if (typeof searchExternalResources === 'function') {
      return searchExternalResources(query);
    }
    return null;
  }

  // Helper methods
  getSynonyms(term) {
    // Basic synonym mapping - can be expanded
    const synonymMap = {
      'how': ['what is', 'explain', 'describe'],
      'create': ['make', 'build', 'generate'],
      'error': ['problem', 'issue', 'bug']
    };
    
    return [term, ...(synonymMap[term] || [])];
  }

  getDefaultResponse(query) {
    const suggestions = [
      `Could you rephrase "${query}"?`,
      "I'm still learning about that topic.",
      "Would you like me to search external resources for this?"
    ];
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  }
}

// Initialize the processor with knowledge bases
const knowledgeProcessor = new KnowledgeProcessor();

// Main exported function
function processUserInput(input) {
  // Initialize with available knowledge bases
  knowledgeProcessor.initKnowledgeBases(
    typeof knowledge1 !== 'undefined' ? knowledge1 : {},
    typeof knowledge2 !== 'undefined' ? knowledge2 : {},
    typeof textLinkDB !== 'undefined' ? textLinkDB : {},
    typeof coderLinkDB !== 'undefined' ? coderLinkDB : {},
    typeof imageLinkDB !== 'undefined' ? imageLinkDB : {}
  );
  
  return knowledgeProcessor.processUserInput(input);
}

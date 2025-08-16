// reader-link.js - Advanced Knowledge Processing System
class ReaderLinkSystem {
  constructor() {
    this.resources = {
      text: {
        processor: null,
        knowledge: null
      },
      code: {
        processor: null,
        knowledge: null
      },
      image: {
        processor: null,
        knowledge: null
      }
    };
    this.initialized = false;
  }

  // Initialize all resources
  async init() {
    if (this.initialized) return;
    
    // Initialize text resources
    if (typeof textLinkDB !== 'undefined') {
      this.resources.text.processor = new TextLinkProcessor();
    }
    
    if (typeof textKnowledgeDB !== 'undefined') {
      this.resources.text.knowledge = textKnowledgeDB;
    }

    // Initialize code resources
    if (typeof coderLinkDB !== 'undefined') {
      this.resources.code.processor = new CoderLinkProcessor();
    }
    
    if (typeof coderKnowledgeDB !== 'undefined') {
      this.resources.code.knowledge = coderKnowledgeDB;
    }

    // Initialize image resources
    if (typeof imageLinkDB !== 'undefined') {
      this.resources.image.processor = new ImageLinkProcessor();
    }
    
    if (typeof imageKnowledgeDB !== 'undefined') {
      this.resources.image.knowledge = imageKnowledgeDB;
    }

    this.initialized = true;
    console.log("Reader-link system initialized");
  }

  // Main search function
  async search(query) {
    if (!this.initialized) await this.init();
    
    // Determine query type
    const queryType = this.determineQueryType(query);
    const processor = this.resources[queryType].processor;
    const knowledge = this.resources[queryType].knowledge;

    if (!processor || !knowledge) {
      console.error(`No ${queryType} processor available`);
      return null;
    }

    // Search the appropriate knowledge base
    try {
      const results = await processor.search(query, knowledge);
      return {
        answer: this.formatAnswer(results, queryType),
        sources: [`${queryType}-link.js`, `${queryType}-knowledge.js`],
        links: results.links,
        specialContent: results.specialContent
      };
    } catch (error) {
      console.error(`${queryType} search error:`, error);
      return null;
    }
  }

  // Helper methods
  determineQueryType(query) {
    const queryLower = query.toLowerCase();
    
    // Check for code-related terms
    const codeKeywords = ['code', 'program', 'function', 'algorithm', 'variable', 'loop'];
    if (codeKeywords.some(kw => queryLower.includes(kw))) {
      return 'code';
    }
    
    // Check for image-related terms
    const imageKeywords = ['image', 'photo', 'picture', 'graphic', 'png', 'jpg'];
    if (imageKeywords.some(kw => queryLower.includes(kw))) {
      return 'image';
    }
    
    // Default to text
    return 'text';
  }

  formatAnswer(results, type) {
    if (!results) return "I couldn't find information about that.";
    
    let answer = results.answer;
    
    if (results.links && results.links.length > 0) {
      answer += "\n\nRelated resources:";
      results.links.forEach((link, index) => {
        answer += `\n${index + 1}. [${link.title}](${link.url})`;
      });
    }
    
    return answer;
  }
}

// Text Processor
class TextLinkProcessor {
  async search(query, knowledgeDB) {
    // Find matching resources
    const matchedResources = knowledgeDB.filter(resource =>
      resource.keywords.some(kw => query.toLowerCase().includes(kw.toLowerCase()))
    );
    
    if (matchedResources.length === 0) return null;
    
    // Format response
    return {
      answer: `I found ${matchedResources.length} text resources about "${query}". Here's the most relevant one: ${matchedResources[0].title}`,
      links: matchedResources.slice(0, 3), // Return top 3 matches
      specialContent: null
    };
  }
}

// Code Processor
class CoderLinkProcessor {
  async search(query, knowledgeDB) {
    const matchedResources = knowledgeDB.filter(resource =>
      resource.keywords.some(kw => query.toLowerCase().includes(kw.toLowerCase()))
    );
    
    if (matchedResources.length === 0) return null;
    
    return {
      answer: `I found ${matchedResources.length} coding resources about "${query}". Here's the most relevant one: ${matchedResources[0].title}`,
      links: matchedResources.slice(0, 3),
      specialContent: {
        type: 'code',
        value: matchedResources[0].codeExample || '// No code example available'
      }
    };
  }
}

// Image Processor
class ImageLinkProcessor {
  async search(query, knowledgeDB) {
    const matchedResources = knowledgeDB.filter(resource =>
      resource.keywords.some(kw => query.toLowerCase().includes(kw.toLowerCase()))
    );
    
    if (matchedResources.length === 0) return null;
    
    return {
      answer: `I found ${matchedResources.length} image resources about "${query}". Here's the most relevant one: ${matchedResources[0].title}`,
      links: matchedResources.slice(0, 3),
      specialContent: {
        type: 'image',
        value: matchedResources[0].imageUrl || null
      }
    };
  }
}

// Initialize the system
const readerLinkSystem = new ReaderLinkSystem();

// Public interface
async function initReaderLink() {
  return await readerLinkSystem.init();
}

async function searchExternalResources(query) {
  return await readerLinkSystem.search(query);
}

// Export public API
window.ReaderLinkSystem = {
  initReaderLink,
  searchExternalResources,
  instance: readerLinkSystem
};

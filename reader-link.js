class LinkReader {
  constructor() {
    this.textLinks = textLinkDB || [];       // from text-link.js
    this.coderLinks = coderLinkDB || [];     // from coder-link.js
    this.imageLinks = imageLinkDB || [];     // from image-link.js
  }

  // Main function to process links
  async processLinkQuery(query) {
    // Try knowledge bases first
    const kbResponse = searchKnowledgeBase(query);
    if (kbResponse) return kbResponse;

    // Check if query matches any link categories
    const response = {
      text: this.searchTextLinks(query),
      code: this.searchCoderLinks(query),
      image: this.searchImageLinks(query)
    };

    // Format the response
    return this.formatResponse(response, query);
  }

  // Search text-related links
  searchTextLinks(query) {
    return this.textLinks.find(link => 
      link.keywords.some(kw => query.toLowerCase().includes(kw))
      ?.url || null;
  }

  // Search coding-related links
  searchCoderLinks(query) {
    return this.coderLinks.find(link => 
      link.keywords.some(kw => query.toLowerCase().includes(kw))
      ?.url || null;
  }

  // Search image-related links
  searchImageLinks(query) {
    return this.imageLinks.find(link => 
      link.keywords.some(kw => query.toLowerCase().includes(kw))
      ?.url || null;
  }

  // Format the response
  formatResponse(response, query) {
    let result = `Search results for "${query}":\n\n`;
    let found = false;

    if (response.text) {
      result += `📄 Text Resource: ${response.text}\n`;
      found = true;
    }
    if (response.code) {
      result += `💻 Coding Resource: ${response.code}\n`;
      found = true;
    }
    if (response.image) {
      result += `🖼️ Image Resource: ${response.image}\n`;
      found = true;
    }

    if (!found) {
      return `No resources found for "${query}". Try different keywords.`;
    }

    return result + '\nClick any link above for more information.';
  }
}

// Initialize link reader
const linkReader = new LinkReader();

// Function to be called from engine.js
function searchExternalResources(query) {
  return linkReader.processLinkQuery(query);
}

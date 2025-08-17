class ImageLinkProcessor {
  constructor() {
    this.baseUrl = 'knowledge/image-knowledge.md';
    this.imageRegex = /!\[.*?\]\((.*?)\)/g;
    this.cache = {};
  }

  async search(query) {
    // Check cache first
    if (this.cache[query]) return this.cache[query];

    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) throw new Error('Failed to fetch image knowledge');
      
      const markdown = await response.text();
      const results = this.parseImageKnowledge(markdown, query);
      
      // Cache the results
      this.cache[query] = results;
      
      return results;
    } catch (error) {
      console.error('ImageLinkProcessor error:', error);
      return null;
    }
  }

  parseImageKnowledge(markdown, query) {
    const results = [];
    const sections = markdown.split('## ');
    
    for (const section of sections) {
      const lowerSection = section.toLowerCase();
      const lowerQuery = query.toLowerCase();
      
      if (lowerSection.includes(lowerQuery)) {
        const title = section.split('\n')[0].trim();
        const content = section.split('\n').slice(1).join('\n').trim();
        const imageLinks = [];
        
        let match;
        while ((match = this.imageRegex.exec(content)) !== null) {
          imageLinks.push(match[1]);
        }
        
        results.push({
          title,
          description: content.replace(this.imageRegex, '').trim(),
          imageLinks
        });
      }
    }
    
    return results.length > 0 ? results : null;
  }
}

// Initialize image link processor
const imageLinkProcessor = new ImageLinkProcessor();

// Export search function
async function searchImageLinks(query) {
  return await imageLinkProcessor.search(query);
}

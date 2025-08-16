class TextLinkProcessor {
  constructor() {
    this.baseUrl = 'knowledge/text-knowledge.md';
    this.cache = {};
    this.cacheExpiry = 3600000; // 1 hour cache
  }

  async search(query) {
    // Check cache first
    const cached = this.checkCache(query);
    if (cached) return cached;

    try {
      // Fetch the markdown file
      const response = await fetch(this.baseUrl);
      if (!response.ok) throw new Error('Failed to fetch knowledge');
      
      const markdown = await response.text();
      const results = this.parseMarkdown(markdown, query);
      
      // Cache the results
      this.cache[query] = {
        results,
        timestamp: Date.now()
      };
      
      return results;
    } catch (error) {
      console.error('TextLinkProcessor error:', error);
      return null;
    }
  }

  parseMarkdown(markdown, query) {
    const sections = markdown.split('## ');
    const results = [];
    
    for (const section of sections) {
      if (section.toLowerCase().includes(query.toLowerCase())) {
        const title = section.split('\n')[0].trim();
        const content = section.split('\n').slice(1).join('\n').trim();
        results.push({ title, content });
      }
    }
    
    return results.length > 0 ? results : null;
  }

  checkCache(query) {
    const entry = this.cache[query];
    if (entry && (Date.now() - entry.timestamp) < this.cacheExpiry) {
      return entry.results;
    }
    return null;
  }
}

// Initialize text link processor
const textLinkProcessor = new TextLinkProcessor();

// Export search function
async function searchTextLinks(query) {
  return await textLinkProcessor.search(query);
}

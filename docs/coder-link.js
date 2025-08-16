class CoderLinkProcessor {
  constructor() {
    this.baseUrl = 'knowledge/coder-knowledge.md';
    this.codeSnippetRegex = /```[a-z]*\n[\s\S]*?\n```/g;
    this.cache = {};
  }

  async search(query) {
    // Check cache first
    if (this.cache[query]) return this.cache[query];

    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) throw new Error('Failed to fetch coder knowledge');
      
      const markdown = await response.text();
      const results = this.parseCodeKnowledge(markdown, query);
      
      // Cache the results
      this.cache[query] = results;
      
      return results;
    } catch (error) {
      console.error('CoderLinkProcessor error:', error);
      return null;
    }
  }

  parseCodeKnowledge(markdown, query) {
    const results = [];
    const sections = markdown.split('## ');
    
    for (const section of sections) {
      const lowerSection = section.toLowerCase();
      const lowerQuery = query.toLowerCase();
      
      if (lowerSection.includes(lowerQuery)) {
        const title = section.split('\n')[0].trim();
        const content = section.split('\n').slice(1).join('\n').trim();
        const codeBlocks = content.match(this.codeSnippetRegex) || [];
        
        results.push({
          title,
          description: content.replace(this.codeSnippetRegex, '').trim(),
          codeBlocks,
          language: this.detectLanguage(codeBlocks[0])
        });
      }
    }
    
    return results.length > 0 ? results : null;
  }

  detectLanguage(codeBlock) {
    if (!codeBlock) return 'unknown';
    const match = codeBlock.match(/```([a-z]+)/);
    return match ? match[1] : 'unknown';
  }
}

// Initialize coder link processor
const coderLinkProcessor = new CoderLinkProcessor();

// Export search function
async function searchCoderLinks(query) {
  return await coderLinkProcessor.search(query);
}

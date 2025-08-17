const Knowledge = {
    checkBasic: function(message) {
        // Load knowledge files
        const basicResponses = Knowledge1.responses;
        const textResponses = Knowledge2.responses;
        const imageResponses = Knowledge3.responses;
        const codeResponses = Knowledge4.responses;
        
        // Check all knowledge bases
        const lowerMsg = message.toLowerCase();
        
        if (basicResponses[lowerMsg]) {
            return basicResponses[lowerMsg];
        } else if (textResponses[lowerMsg]) {
            return textResponses[lowerMsg];
        } else if (imageResponses[lowerMsg]) {
            return imageResponses[lowerMsg];
        } else if (codeResponses[lowerMsg]) {
            return codeResponses[lowerMsg];
        }
        
        return null;
    }
};

// Load knowledge files
import { Knowledge1 } from './docs/answer/knowledge_1.js';
import { Knowledge2 } from './docs/answer/knowledge_2.js';
import { Knowledge3 } from './docs/answer/knowledge_3.js';
import { Knowledge4 } from './docs/answer/knowledge_4.js';

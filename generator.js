const Generator = {
    process: function(message) {
        if (message.includes('text')) {
            return TextGenerator.generate(message);
        } else if (message.includes('image')) {
            return ImageGenerator.generate(message);
        } else if (message.includes('code')) {
            return CodeGenerator.generate(message);
        }
        return "မည်သည့်အရာကို generate လုပ်ရမည်နည်း? (text, image, code)";
    }
};

// Load generator modules
import { TextGenerator } from './docs/knowledge/text.js';
import { ImageGenerator } from './docs/knowledge/image.js';
import { CodeGenerator } from './docs/knowledge/coder.js';

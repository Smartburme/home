# Mini Chat AI

## System Flow
1. `chat.js` က user input ကို `engine.js` သို့ ပို့မယ်  
2. `engine.js` မှ  
   - သာမန်မေးခွန်း → `knowledge.js` သို့  
   - generator command (text:/image:/code:) → `generator.js` သို့  
3. `knowledge.js` မှ docs/answer/knowledge_x.js တွေကိုစဉ်လိုက် စမ်းပြီး ဖြေမယ်  
4. `generator.js` မှ docs/knowledge/text.js, image.js, coder.js ကိုခေါ်မယ်  

## Example
- `hi` → Knowledge reply  
- `text: love story` → Text generator  
- `image: cat with hat` → Image generator  
- `code: hello world in js` → Code generator

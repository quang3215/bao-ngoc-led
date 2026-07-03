const fs = require('fs');
const path = require('path');

const replacements = {
  '#108b33': '#4A238B', // Main Green -> Deep Purple
  '#0c7028': '#35156B', // Dark Green -> Darker Purple
  '#1ca13c': '#5E35B1', // Lighter Green -> Lighter Purple
  '#259b38': '#5E35B1', // Another Green -> Lighter Purple
  '#bfe8cc': '#D1C4E9', // Light Green bg -> Light Purple bg
  '#083a6b': '#111827', // Dark Blue text -> Dark Gray/Black
};

const files = [
  'src/app/san-pham/[sku]/product-detail-client.tsx',
  'src/app/ve-chung-toi/page.tsx',
  'src/components/layout/header.tsx',
  'src/components/layout/mega-menu.tsx',
  'src/components/home/category-block.tsx',
  'src/app/page.tsx'
];

for (const relPath of files) {
  const fullPath = path.join(__dirname, '..', relPath);
  if (!fs.existsSync(fullPath)) continue;
  
  let content = fs.readFileSync(fullPath, 'utf-8');
  let changed = false;
  
  for (const [oldColor, newColor] of Object.entries(replacements)) {
    // Escape string for regex if needed, though they are hex codes
    const regex = new RegExp(oldColor, 'gi');
    if (regex.test(content)) {
      content = content.replace(regex, newColor);
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log(`Updated ${relPath}`);
  }
}

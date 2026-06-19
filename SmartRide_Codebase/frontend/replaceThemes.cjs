const fs = require('fs');
const path = require('path');

const addRgbVars = (file) => {
  let content = fs.readFileSync(file, 'utf8');
  
  if (!content.includes('--brand-cyan-rgb')) {
    content = content.replace(/'--brand-cyan': '#00D8FF',/g, "'--brand-cyan': '#00D8FF',\n    '--brand-cyan-rgb': '0, 216, 255',");
    content = content.replace(/'--brand-indigo': '#6366F1',/g, "'--brand-indigo': '#6366F1',\n    '--brand-indigo-rgb': '99, 102, 241',");
    
    content = content.replace(/'--brand-cyan': '#FFFFFF',/g, "'--brand-cyan': '#FFFFFF',\n    '--brand-cyan-rgb': '255, 255, 255',");
    content = content.replace(/'--brand-indigo': '#FFFFFF',/g, "'--brand-indigo': '#FFFFFF',\n    '--brand-indigo-rgb': '255, 255, 255',");
    
    content = content.replace(/'--brand-cyan': '#00FFC8',/g, "'--brand-cyan': '#00FFC8',\n    '--brand-cyan-rgb': '0, 255, 200',");
    content = content.replace(/'--brand-indigo': '#A855F7',/g, "'--brand-indigo': '#A855F7',\n    '--brand-indigo-rgb': '168, 85, 247',");
    
    content = content.replace(/'--brand-cyan': '#38BDF8',/g, "'--brand-cyan': '#38BDF8',\n    '--brand-cyan-rgb': '56, 189, 248',");
    content = content.replace(/'--brand-indigo': '#0EA5E9',/g, "'--brand-indigo': '#0EA5E9',\n    '--brand-indigo-rgb': '14, 165, 233',");
    
    content = content.replace(/'--brand-cyan': '#F97316',/g, "'--brand-cyan': '#F97316',\n    '--brand-cyan-rgb': '249, 115, 22',");
    content = content.replace(/'--brand-indigo': '#EC4899',/g, "'--brand-indigo': '#EC4899',\n    '--brand-indigo-rgb': '236, 72, 153',");

    fs.writeFileSync(file, content);
    console.log(`Updated RGB vars in ${file}`);
  }
};

addRgbVars('src/App.jsx');
addRgbVars('src/pages/user/ThemeSettings.jsx');

const replacements = [
  { regex: /#080C14/gi, replacement: 'var(--bg-base)' },
  { regex: /#0F1623/gi, replacement: 'var(--bg-surface)' },
  { regex: /#141C2E/gi, replacement: 'var(--bg-card)' },
  { regex: /#1A2340/gi, replacement: 'var(--bg-elevated)' },
  { regex: /#00D8FF/gi, replacement: 'var(--brand-cyan)' },
  { regex: /#6366F1/gi, replacement: 'var(--brand-indigo)' },
  { regex: /#8B5CF6/gi, replacement: 'var(--brand-violet)' },
  { regex: /rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*([0-9.]+)\s*\)/g, replacement: 'rgba(255,255,255,$1)' },
  { regex: /rgba\(\s*0\s*,\s*216\s*,\s*255\s*,\s*([0-9.]+)\s*\)/g, replacement: 'rgba(var(--brand-cyan-rgb), $1)' },
  { regex: /rgba\(\s*99\s*,\s*102\s*,\s*241\s*,\s*([0-9.]+)\s*\)/g, replacement: 'rgba(var(--brand-indigo-rgb), $1)' }
];

const processDirectory = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.jsx') && file !== 'ThemeSettings.jsx') {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      for (const { regex, replacement } of replacements) {
        if (regex.test(content)) {
          content = content.replace(regex, replacement);
          modified = true;
        }
      }
      if (modified) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated theme colors in ${fullPath}`);
      }
    }
  }
};

processDirectory('src/pages/user');
processDirectory('src/components');
console.log('Done replacing theme colors.');

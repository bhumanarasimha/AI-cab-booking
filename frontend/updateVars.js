import fs from 'fs';

const addRgbVars = (file) => {
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(/'--brand-cyan': '#00D8FF',/g, "'--brand-cyan': '#00D8FF',\n      '--brand-cyan-rgb': '0, 216, 255',");
  content = content.replace(/'--brand-indigo': '#6366F1',/g, "'--brand-indigo': '#6366F1',\n      '--brand-indigo-rgb': '99, 102, 241',");
  
  content = content.replace(/'--brand-cyan': '#FFFFFF',/g, "'--brand-cyan': '#FFFFFF',\n      '--brand-cyan-rgb': '255, 255, 255',");
  content = content.replace(/'--brand-indigo': '#FFFFFF',/g, "'--brand-indigo': '#FFFFFF',\n      '--brand-indigo-rgb': '255, 255, 255',");
  
  content = content.replace(/'--brand-cyan': '#00FFC8',/g, "'--brand-cyan': '#00FFC8',\n      '--brand-cyan-rgb': '0, 255, 200',");
  content = content.replace(/'--brand-indigo': '#A855F7',/g, "'--brand-indigo': '#A855F7',\n      '--brand-indigo-rgb': '168, 85, 247',");
  
  content = content.replace(/'--brand-cyan': '#38BDF8',/g, "'--brand-cyan': '#38BDF8',\n      '--brand-cyan-rgb': '56, 189, 248',");
  content = content.replace(/'--brand-indigo': '#0EA5E9',/g, "'--brand-indigo': '#0EA5E9',\n      '--brand-indigo-rgb': '14, 165, 233',");
  
  content = content.replace(/'--brand-cyan': '#F97316',/g, "'--brand-cyan': '#F97316',\n      '--brand-cyan-rgb': '249, 115, 22',");
  content = content.replace(/'--brand-indigo': '#EC4899',/g, "'--brand-indigo': '#EC4899',\n      '--brand-indigo-rgb': '236, 72, 153',");

  fs.writeFileSync(file, content);
};

addRgbVars('src/App.jsx');
addRgbVars('src/pages/user/ThemeSettings.jsx');
console.log('Added RGB vars');

const fs = require('fs');
const path = require('path');

const DIRECTORIES = [
  path.join(__dirname, 'client', 'src'),
  path.join(__dirname, 'client', 'public'), // if any
  path.join(__dirname, 'server', 'src'),
  path.join(__dirname, 'server', 'prisma'),
  __dirname
];

const EXTENSIONS = ['.js', '.jsx', '.html', '.md', '.json', '.prisma', '.env.example'];

function replaceInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let newContent = content.replace(/SkillForge/g, 'SkillForge');
  newContent = newContent.replace(/skillforge/ig, 'skillforge');
  newContent = newContent.replace(/SkillForge/g, 'SkillForge');
  newContent = newContent.replace(/sf-/g, 'sf-');
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Avoid node_modules and .git
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist' && file !== 'build') {
        processDirectory(fullPath);
      }
    } else {
      const ext = path.extname(fullPath);
      if (EXTENSIONS.includes(ext)) {
        try {
          replaceInFile(fullPath);
        } catch(e) { /* ignore */ }
      }
    }
  }
}

console.log('Starting branding sweep...');
for (const dir of DIRECTORIES) {
  processDirectory(dir);
}
console.log('Branding sweep complete.');

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIR = path.join(__dirname, 'client', 'src');

const map = {
  'bg-arena-bg3': 'bg-slate-100',
  'bg-arena-bg4': 'bg-slate-200',
  'bg-arena-bg2': 'bg-white',
  'bg-arena-bg': 'bg-slate-50',

  'text-arena-text': 'text-slate-900',
  'text-arena-muted': 'text-slate-600',
  'text-arena-dim': 'text-slate-500',

  'border-arena-border': 'border-slate-200',

  'bg-arena-purple2': 'bg-blue-700',
  'bg-arena-purple': 'bg-blue-600',
  'text-arena-purple2': 'text-blue-700',
  'text-arena-purple': 'text-blue-600',
  'border-arena-purple': 'border-blue-600',

  'bg-arena-teal': 'bg-indigo-600',
  'text-arena-teal': 'text-indigo-600',
  'border-arena-teal': 'border-indigo-600',

  'text-gradient': 'text-slate-900',

  'arena-input': 'w-full bg-white border border-slate-200 rounded-xl px-4 py-3 placeholder-slate-400 text-slate-900 focus:outline-none focus:border-blue-500 transition-all text-sm',
  'arena-label': 'block text-sm font-semibold text-slate-700 mb-1.5'
};

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fw = path.join(dir, file);
    if (fs.statSync(fw).isDirectory()) {
      processDir(fw);
    } else if (fw.endsWith('.jsx') || fw.endsWith('.js')) {
      let content = fs.readFileSync(fw, 'utf8');
      let modified = false;

      // Ignore LandingPage and Login/Register as they are already perfected
      if (file === 'LandingPage.jsx' || file === 'LoginPage.jsx' || file === 'RegisterPage.jsx') {
        continue;
      }

      for (const [key, val] of Object.entries(map)) {
        const regex = new RegExp(`\\b${key}\\b`, 'g');
        if (regex.test(content)) {
          content = content.replace(regex, val);
          modified = true;
        }
      }

      if (modified) {
        fs.writeFileSync(fw, content, 'utf8');
        console.log(`Updated ${fw}`);
      }
    }
  }
}

// Also update globals.css to remove arena roots if any, but since we replaced the classes it's fine.
processDir(DIR);
console.log('Theme conversion complete.');

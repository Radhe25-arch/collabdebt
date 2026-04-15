import fs from 'fs';
const files = [
  'src/pages/Courses.tsx',
  'src/pages/Leaderboard.tsx',
  'src/pages/Profile.tsx',
  'src/pages/Quests.tsx'
];
files.forEach(f => {
  let s = fs.readFileSync(f, 'utf8');
  let originalLength = s.length;
  // Replace string "\`" back to just "`"
  s = s.replaceAll('\\`', '`');
  if (s.length !== originalLength) {
    fs.writeFileSync(f, s);
    console.log('Fixed', f);
  }
});

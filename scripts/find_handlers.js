const fs = require('fs');

const app = fs.readFileSync('app.js', 'utf8');
const lines = app.split('\n');

const keywords = ['function set', 'function on', 'function select', 'onclick='];
const handlers = new Set();

lines.forEach((l, i) => {
  if (l.includes('LevelSelected') || l.includes('Score') || l.includes('Criterion') || l.includes('AssessmentDomain')) {
    const match = l.match(/function\s+([a-zA-Z0-9_]+)\s*\(/);
    if (match) handlers.add(`${i+1}: ${match[1]}`);
  }
});

console.log(Array.from(handlers).slice(0, 40).join('\n'));

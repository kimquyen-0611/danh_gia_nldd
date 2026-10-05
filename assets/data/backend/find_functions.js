const fs = require('fs');
const path = require('path');
const lines = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8').split(/\r?\n/);

lines.forEach((line, idx) => {
  if (line.includes('function ') && (line.includes('Assessment') || line.includes('Criterion') || line.includes('Domain') || line.includes('Score') || line.includes('Card'))) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});

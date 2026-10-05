const fs = require('fs');
const path = require('path');
const content = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
const lines = content.split(/\r?\n/);

lines.forEach((line, idx) => {
  if (line.toLowerCase().includes('canlamsang')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});

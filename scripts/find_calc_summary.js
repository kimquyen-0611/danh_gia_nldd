const fs = require('fs');

const app = fs.readFileSync('app.js', 'utf8');
const lines = app.split('\n');

lines.forEach((l, i) => {
  if (l.includes('function calculateAndUpdateAssessmentSummary') || l.includes('function updateAssessmentSummary')) {
    console.log(`Line ${i+1}: ${l}`);
    for (let j = i; j < Math.min(lines.length, i + 50); j++) {
      console.log(`${j+1}: ${lines[j]}`);
      if (lines[j].startsWith('}')) break;
    }
  }
});

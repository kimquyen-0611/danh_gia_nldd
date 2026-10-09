const fs = require('fs');
const content = fs.readFileSync('app.js', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('onManagerSetCriterionScore')) {
    console.log((i + 1) + ': ' + l.trim());
  }
});

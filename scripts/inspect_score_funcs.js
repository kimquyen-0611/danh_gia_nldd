const fs = require('fs');
const content = fs.readFileSync('app.js', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (
    l.includes('function selectScoreOption') ||
    l.includes('function onScore') ||
    l.includes('function setScore') ||
    l.includes('function updateCriterionScore') ||
    l.includes('function saveStorage') ||
    l.includes('function approveSubmission') ||
    l.includes('function executeApproval')
  ) {
    console.log((i + 1) + ': ' + l.trim());
  }
});

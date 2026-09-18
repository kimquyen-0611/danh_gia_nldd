const fs = require('fs');
const content = fs.readFileSync('app.js', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (
    l.includes('function onCriterionScoreChange') ||
    l.includes('function setCriterionOption') ||
    l.includes('function handleScoreChange') ||
    l.includes('function selectCriterionLevel') ||
    l.includes('function saveCriterionScore') ||
    l.includes('function saveDraftAssessment')
  ) {
    console.log((i + 1) + ': ' + l.trim());
  }
});

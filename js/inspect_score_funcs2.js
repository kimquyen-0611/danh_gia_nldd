const fs = require('fs');
const content = fs.readFileSync('app.js', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (
    l.includes('function selectCriterionOption') ||
    l.includes('function setCriterionScore') ||
    l.includes('function saveSelfAssessment') ||
    l.includes('function saveAssessment') ||
    l.includes('function onSelectLevel') ||
    l.includes('function onRadioChange') ||
    l.includes('function updateManagerScore') ||
    l.includes('function adjustScore') ||
    l.includes('function approveSubmissionFromModal')
  ) {
    console.log((i + 1) + ': ' + l.trim());
  }
});

const fs = require('fs');
const content = fs.readFileSync('app.js', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (
    l.includes('function getUserSubmission') ||
    l.includes('function saveUserSubmission') ||
    l.includes('function submitAssessment') ||
    l.includes('function submitSelfAssessment') ||
    l.includes('function approveAssessment') ||
    l.includes('function saveAssessmentScores') ||
    l.includes('function onScoreChange') ||
    l.includes('function calculateDomainScore')
  ) {
    console.log((i + 1) + ': ' + l.trim());
  }
});

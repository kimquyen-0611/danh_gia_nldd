const fs = require('fs');
const content = fs.readFileSync('app.js', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (
    l.includes('function openReviewModal') ||
    l.includes('function renderReviewModal') ||
    l.includes('function onManagerScoreChange') ||
    l.includes('function saveReviewChanges') ||
    l.includes('review-modal-table')
  ) {
    console.log((i + 1) + ': ' + l.trim());
  }
});

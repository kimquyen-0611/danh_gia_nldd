const fs = require('fs');

const app = fs.readFileSync('app.js', 'utf8');
const lines = app.split('\n');

console.log('Total lines in app.js:', lines.length);

const targets = [
  'renderAssessment',
  'renderCriteria',
  'filterAssessmentByDomain',
  'calculateAssessmentTotalScore',
  'updateAssessmentSummary',
  'renderStaffRanking',
  'switchReportSubTab',
  'switchTab',
  'renderHeader'
];

targets.forEach(t => {
  const found = [];
  lines.forEach((l, i) => {
    if (l.includes(t) && (l.includes('function') || l.includes('const ') || l.includes('let ') || l.includes('window.'))) {
      found.push(`${i+1}: ${l.trim().substring(0, 100)}`);
    }
  });
  console.log(`\n=== ${t} ===\n` + (found.join('\n') || 'Not found'));
});

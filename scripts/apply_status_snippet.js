const fs = require('fs');

const snippet = fs.readFileSync('render_status_snippet.txt', 'utf8');

function updateFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log('File does not exist: ' + filePath);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  const startMarker = 'function linkCertificateToPortfolio(userId, year) {';
  const endMarker = 'function viewOfficialDecision(userId) {';

  const startIdx = content.indexOf(startMarker);
  const endIdx = content.indexOf(endMarker);

  if (startIdx !== -1 && endIdx !== -1) {
    const before = content.substring(0, startIdx);
    const after = content.substring(endIdx);
    content = before + snippet.trim() + '\n\n' + after;
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully updated: ' + filePath);
  } else {
    console.log('Markers not found in: ' + filePath + ' (start: ' + startIdx + ', end: ' + endIdx + ')');
  }
}

updateFile('app.js');
updateFile('js/app.js');

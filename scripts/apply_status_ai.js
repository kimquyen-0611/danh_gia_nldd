const fs = require('fs');

const codeToInject = fs.readFileSync('update_status_ai.js', 'utf8');

function updateFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log('File does not exist: ' + filePath);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  const startMarker = 'function renderStatusTab() {';
  const endMarker = 'function viewOfficialDecision(userId) {';

  const startIdx = content.indexOf(startMarker);
  const endIdx = content.indexOf(endMarker);

  if (startIdx !== -1 && endIdx !== -1) {
    const before = content.substring(0, startIdx);
    const after = content.substring(endIdx);
    content = before + codeToInject.trim() + '\n\n' + after;
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ Đã cập nhật thành công: ' + filePath);
  } else {
    console.log('❌ Không tìm thấy marker trong: ' + filePath);
  }
}

updateFile('app.js');
updateFile('js/app.js');

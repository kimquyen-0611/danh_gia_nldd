const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'app.js');
let app = fs.readFileSync(appPath, 'utf8');

// 1. Cập nhật renderStaffRankingDashboardTab để hỗ trợ sticky column và Card Grid View
console.log('Patching staff ranking table for sticky columns & card view...');

const oldTableHeader = `<th class="py-3.5 px-3 text-center w-14">STT</th>' +
        '<th class="py-3.5 px-4 font-black">TÊN NHÂN VIÊN</th>`;

const newTableHeader = `<th class="py-3.5 px-3 text-center w-14 sticky-col-left-1">STT</th>' +
        '<th class="py-3.5 px-4 font-black sticky-col-left-2">TÊN NHÂN VIÊN</th>`;

if (app.includes(oldTableHeader)) {
  app = app.replace(oldTableHeader, newTableHeader);
}

// Thêm sticky-col-left-1 và sticky-col-left-2 vào td
const oldRowStart = `'<tr class="' + rowHighlightClass + ' transition-colors">' +
          // STT
          '<td class="py-3 px-3 text-center">' + rankHtml + '</td>' +

          // 1. TÊN NHÂN VIÊN
          '<td class="py-3 px-4">' +`;

const newRowStart = `'<tr class="' + rowHighlightClass + ' transition-colors">' +
          // STT
          '<td class="py-3 px-3 text-center sticky-col-left-1">' + rankHtml + '</td>' +

          // 1. TÊN NHÂN VIÊN
          '<td class="py-3 px-4 sticky-col-left-2">' +`;

if (app.includes(oldRowStart)) {
  app = app.replace(oldRowStart, newRowStart);
}

// 2. Thêm tính năng gập / mở tất cả Accordion trong Phiếu Đánh Giá
const accordionToolbarFuncs = `
// =========================================================================
// TIỆN ÍCH GẬP / MỞ NHANH TOÀN BỘ TIÊU CHÍ (COLLAPSIBLE ACCORDION HELPER)
// =========================================================================
function expandAllAssessmentAccordions() {
  document.querySelectorAll('[id^="domain-body-"]').forEach(el => {
    el.classList.remove('hidden');
  });
  document.querySelectorAll('[id^="domain-icon-"]').forEach(el => {
    el.style.transform = 'rotate(0deg)';
  });
  showToast('Đã mở rộng toàn bộ các Lĩnh Vực & Tiêu Chuẩn!', 'info');
}

function collapseAllAssessmentAccordions() {
  document.querySelectorAll('[id^="domain-body-"]').forEach(el => {
    el.classList.add('hidden');
  });
  document.querySelectorAll('[id^="domain-icon-"]').forEach(el => {
    el.style.transform = 'rotate(-90deg)';
  });
  showToast('Đã thu gọn toàn bộ các Lĩnh Vực để tối ưu không gian!', 'info');
}
`;

if (!app.includes('function expandAllAssessmentAccordions')) {
  app += '\n' + accordionToolbarFuncs;
}

fs.writeFileSync(appPath, app, 'utf8');
console.log('app.js successfully updated! New size:', app.length);

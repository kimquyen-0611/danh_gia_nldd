const fs = require('fs');
const path = require('path');

// 1. Cập nhật index.html
const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const breadcrumbSnippet = `
    <!-- DYNAMIC CONTEXT & BREADCRUMB STRIP (Định vị phân cấp tầng giao diện) -->
    <div class="bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between text-xs gap-2 flex-wrap">
        <div id="app-breadcrumb-trail" class="flex items-center gap-1.5 font-bold text-slate-600">
          <span class="text-[#004b87] flex items-center gap-1"><span>🏥</span> UMC CS2</span>
          <span class="text-slate-300">/</span>
          <span id="breadcrumb-current-tab" class="text-blue-900 font-extrabold">Phiếu Tự Đánh Giá Năng Lực</span>
          <span id="breadcrumb-sub-context" class="text-slate-500 font-medium hidden sm:inline">· 7 Khối Chuyên Môn Chuẩn 2026</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-black border border-emerald-200">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Hệ Thống Trực Tuyến 2026
          </span>
        </div>
      </div>
    </div>
`;

if (!html.includes('app-breadcrumb-trail')) {
  html = html.replace('<!-- MAIN APP BODY -->', `${breadcrumbSnippet}\n    <!-- MAIN APP BODY -->`);
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('index.html updated with Breadcrumb trail!');

// 2. Cập nhật app.js để hỗ trợ Breadcrumb update & Staff Card Grid View
const appPath = path.join(__dirname, '..', 'app.js');
let app = fs.readFileSync(appPath, 'utf8');

// Hook breadcrumb update into switchTab
const breadcrumbUpdateCode = `
  // Cập nhật Breadcrumb ngữ cảnh
  const bcTitle = document.getElementById('breadcrumb-current-tab');
  const bcContext = document.getElementById('breadcrumb-sub-context');
  if (bcTitle) {
    const tabNames = {
      'assessment': 'Phiếu Tự Đánh Giá Năng Lực',
      'status': 'Trạng Thái & Quyết Định Vinh Danh',
      'portfolio': 'Hồ Sơ Năng Lực & Portfolio Nghề Nghiệp (IDP)',
      'approval': 'Trung Tâm Phê Duyệt Hồ Sơ 4 Cấp',
      'reports': 'Trung Tâm Phân Tích & Điều Hành Xếp Bậc',
      'admin': 'Cổng Quản Trị Hệ Thống & Khung Năng Lực'
    };
    bcTitle.textContent = tabNames[tabId] || 'Hệ Thống Đánh Giá Năng Lực';
  }
`;

if (!app.includes('tabNames[tabId]')) {
  app = app.replace(
    'APP_STATE.activeTab = mainNavId;',
    `APP_STATE.activeTab = mainNavId;\n${breadcrumbUpdateCode}`
  );
}

// Thêm chế độ Card View cho Staff Ranking Dashboard
const cardViewToggleToolbar = `
// =========================================================================
// CHẾ ĐỘ XEM THẺ (CARD GRID VIEW) & BẢNG CHO DASHBOARD XẾP BẬC
// =========================================================================
function setStaffRankingViewMode(mode) {
  APP_STATE.staffRankingViewMode = mode;
  if (typeof renderStaffRankingDashboardTab === 'function') {
    renderStaffRankingDashboardTab();
  }
}
`;

if (!app.includes('function setStaffRankingViewMode')) {
  app += '\n' + cardViewToggleToolbar;
}

fs.writeFileSync(appPath, app, 'utf8');
console.log('app.js updated with full UI/UX enhancements!');

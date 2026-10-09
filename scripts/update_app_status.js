const fs = require('fs');

let content = fs.readFileSync('app.js', 'utf8');

// 1. Ensure tabId === 'status' is handled in all switchTab locations
if (!content.includes("const pane = document.getElementById('tab-status');") || content.match(/if \(tabId === 'status'\)/g).length < 2) {
  content = content.replace(
    /if \(tabId === 'assessment'\) \{\s*const pane = document\.getElementById\('tab-assessment'\);/g,
    `if (tabId === 'status') {
    const pane = document.getElementById('tab-status');
    if (pane) pane.classList.remove('hidden');
    if (typeof renderStatusTab === 'function') renderStatusTab();
  } else if (tabId === 'assessment') {
    const pane = document.getElementById('tab-assessment');`
  );
}

// 2. Enhance renderPortfolioTab to render linked official certificates prominently
const oldPortfolioListRender = `  listContainer.innerHTML = allDisplayItems.map((item, idx) => {
    const itemEncoded = encodeURIComponent(JSON.stringify(item));
    return \`
      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-3.5">
          <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center text-xl font-bold border border-blue-100 shrink-0">
            \${item.icon}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h4 class="text-xs sm:text-sm font-bold text-slate-800">\${item.title}</h4>
              \${item.isCustom ? '<span class="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">Mới cập nhật</span>' : ''}
            </div>
            <p class="text-[11px] text-slate-400 mt-0.5">\${item.type} • Mã: \${item.code} • Ngày: \${item.date} • Dung lượng: \${item.size}</p>
          </div>
        </div>
        <div class="flex items-center gap-2 self-end sm:self-center shrink-0">
          <span class="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
            ✓ \${item.status}
          </span>
          <button type="button" onclick="viewPortfolioItemDetail('\${itemEncoded}')" class="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs transition-all flex items-center gap-1 border border-blue-200">
            👁️ Xem
          </button>
          \${(isOwner && item.isCustom) ? \`
            <button type="button" onclick="deletePortfolioItem('\${item.id}')" title="Xóa minh chứng này" class="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-all border border-rose-200">
              🗑️
            </button>
          \` : ''}
        </div>
      </div>
    \`;
  }).join('');`;

const newPortfolioListRender = `  listContainer.innerHTML = allDisplayItems.map((item, idx) => {
    const itemEncoded = encodeURIComponent(JSON.stringify(item));
    if (item.isOfficialCert) {
      return \`
        <div class="bg-gradient-to-r from-amber-500/10 via-white to-amber-500/5 p-4 sm:p-5 rounded-2xl border-2 border-amber-400 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
          <div class="flex items-center gap-3.5 relative z-10">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center text-2xl font-black shadow-md border-2 border-amber-300 shrink-0">
              🏆
            </div>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wide">
                  CHỨNG NHẬN CHÍNH THỨC BAN GIÁM ĐỐC
                </span>
                <span class="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  ✓ Đã công nhận
                </span>
              </div>
              <h4 class="text-sm sm:text-base font-black text-slate-900 mt-1">\${item.title}</h4>
              <p class="text-xs text-slate-600 mt-0.5">Số QĐ: <strong class="font-mono text-slate-900">\${item.code}</strong> • Ngày ban hành: \${item.date} • Dung lượng: \${item.size}</p>
            </div>
          </div>
          <div class="flex items-center gap-2 self-start md:self-center shrink-0 relative z-10">
            <button type="button" onclick="viewCertificate('\${item.userId || viewUser.id}')" class="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-950 font-black rounded-xl text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer">
              <span>📜</span> In Giấy Chứng Nhận
            </button>
            <button type="button" onclick="viewOfficialDecision('\${item.userId || viewUser.id}')" class="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-black rounded-xl text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer">
              <span>📄</span> Xem Quyết Định
            </button>
            \${(isOwner && item.isCustom) ? \`
              <button type="button" onclick="deletePortfolioItem('\${item.id}')" title="Xóa khỏi portfolio" class="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 text-xs transition-all border border-slate-200">
                🗑️
              </button>
            \` : ''}
          </div>
        </div>
      \`;
    }

    return \`
      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-3.5">
          <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center text-xl font-bold border border-blue-100 shrink-0">
            \${item.icon}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h4 class="text-xs sm:text-sm font-bold text-slate-800">\${item.title}</h4>
              \${item.isCustom ? '<span class="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">Mới cập nhật</span>' : ''}
            </div>
            <p class="text-[11px] text-slate-400 mt-0.5">\${item.type} • Mã: \${item.code} • Ngày: \${item.date} • Dung lượng: \${item.size}</p>
          </div>
        </div>
        <div class="flex items-center gap-2 self-end sm:self-center shrink-0">
          <span class="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
            ✓ \${item.status}
          </span>
          <button type="button" onclick="viewPortfolioItemDetail('\${itemEncoded}')" class="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs transition-all flex items-center gap-1 border border-blue-200">
            👁️ Xem
          </button>
          \${(isOwner && item.isCustom) ? \`
            <button type="button" onclick="deletePortfolioItem('\${item.id}')" title="Xóa minh chứng này" class="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-all border border-rose-200">
              🗑️
            </button>
          \` : ''}
        </div>
      </div>
    \`;
  }).join('');`;

if (content.includes(oldPortfolioListRender)) {
  content = content.replace(oldPortfolioListRender, newPortfolioListRender);
}

// 3. Write comprehensive renderStatusTab & linkCertificateToPortfolio functions
const statusTabImplementation = `
// =========================================================
// TRẠNG THÁI HỒ SƠ, LỜI ĐỘNG VIÊN 4 CẤP & LIÊN KẾT PORTFOLIO
// =========================================================

function linkCertificateToPortfolio(userId, year) {
  const user = (userId ? (APP_STATE.users || []).find(u => u.id === userId) : null) || APP_STATE.currentUser;
  if (!user) {
    showToast('Không tìm thấy thông tin nhân sự!', 'error');
    return;
  }
  const currentYear = year || APP_STATE.selectedEvaluationYear || 2026;
  const sub = getUserSubmission(user.id, currentYear) || {};
  const tierObj = (typeof COMPETENCY_TIERS_MATRIX !== 'undefined' ? COMPETENCY_TIERS_MATRIX.find(t => t.tier === (sub.evaluatedTier || sub.approvedTier || user.level || 1)) : null) || {
    name: 'BẬC ' + (user.level || 1),
    title: 'Điều Dưỡng Đạt Chuẩn'
  };

  if (!APP_STATE.userPortfolios) {
    try {
      APP_STATE.userPortfolios = JSON.parse(localStorage.getItem('umc_user_portfolios') || '{}');
    } catch(e) {
      APP_STATE.userPortfolios = {};
    }
  }
  if (!APP_STATE.userPortfolios[user.id]) {
    APP_STATE.userPortfolios[user.id] = [];
  }

  const itemId = \`cert_decision_\${user.id}_\${currentYear}\`;
  const existingIdx = APP_STATE.userPortfolios[user.id].findIndex(it => it.id === itemId);

  const certItem = {
    id: itemId,
    title: \`Giấy Chứng Nhận & Quyết Định Năng Lực Điều Dưỡng \${tierObj.name} (\${tierObj.title}) - Năm \${currentYear}\`,
    type: 'Chứng nhận & Quyết định Năng lực BV ĐHYD TPHCM (Chính thức)',
    code: sub.decisionNo || \`089/QĐ-BVĐHYD-CS2/\${currentYear}\`,
    date: sub.approvedAt ? new Date(sub.approvedAt).toLocaleDateString('vi-VN') : new Date().toLocaleDateString('vi-VN'),
    status: 'Đã xác thực & Phê duyệt chính thức',
    icon: '🏆',
    size: '1.8 MB',
    fileName: \`giay_chung_nhan_nang_luc_\${user.msnv}_\${currentYear}.pdf\`,
    isCustom: true,
    isOfficialCert: true,
    userId: user.id,
    year: currentYear,
    totalScore: sub.totalScore || 0,
    tierName: tierObj.name,
    tierTitle: tierObj.title
  };

  if (existingIdx >= 0) {
    APP_STATE.userPortfolios[user.id][existingIdx] = certItem;
  } else {
    APP_STATE.userPortfolios[user.id].unshift(certItem);
  }

  localStorage.setItem('umc_user_portfolios', JSON.stringify(APP_STATE.userPortfolios));
  showToast(\`🎉 Đã lưu Giấy chứng nhận và Quyết định vào Portfolio cá nhân của \${user.fullName}!\`, 'success');
  
  if (typeof renderStatusTab === 'function') renderStatusTab();
  if (typeof renderPortfolioTab === 'function') renderPortfolioTab(user.id);
}

function renderStatusTab() {
  const container = document.getElementById('status-tab-container');
  if (!container) return;

  const user = APP_STATE.currentUser || (APP_STATE.users && APP_STATE.users[0]);
  if (!user) {
    container.innerHTML = '<div class="p-6 text-center text-slate-500">Chưa có thông tin nhân sự</div>';
    return;
  }

  const currentYear = APP_STATE.selectedEvaluationYear || APP_STATE.currentEvaluationYear || 2026;
  const sub = getUserSubmission(user.id, currentYear) || {
    status: 'draft',
    totalScore: 0,
    evaluatedTier: user.level || 1,
    scores: {},
    history: []
  };

  const deptSpecialty = getDepartmentSpecialty(user.department);
  const specialty = user.specialty || deptSpecialty;
  const meta = (typeof SPECIALTY_META !== 'undefined' && SPECIALTY_META[specialty]) || {
    name: 'Điều Dưỡng Lâm Sàng',
    icon: '🏥',
    totalCriteria: 66,
    badgeClass: 'bg-blue-100 text-blue-800'
  };

  const status = sub.status || 'draft';
  const tierObj = (typeof COMPETENCY_TIERS_MATRIX !== 'undefined' ? COMPETENCY_TIERS_MATRIX.find(t => t.tier === (sub.evaluatedTier || sub.approvedTier || user.level || 1)) : null) || {
    name: 'BẬC ' + (user.level || 1),
    title: 'Điều Dưỡng Đạt Chuẩn',
    description: 'Đáp ứng đầy đủ năng lực chuyên môn theo quy định'
  };

  // Kiểm tra chứng nhận đã được liên kết vào Portfolio chưa
  let isLinkedToPortfolio = false;
  try {
    const pData = (APP_STATE.userPortfolios && APP_STATE.userPortfolios[user.id]) || JSON.parse(localStorage.getItem('umc_user_portfolios') || '{}')[user.id] || [];
    isLinkedToPortfolio = pData.some(it => it.id === \`cert_decision_\${user.id}_\${currentYear}\`);
  } catch(e) {
    isLinkedToPortfolio = false;
  }

  // Stepper State Logic
  const getStepState = (stepNum) => {
    if (status === 'approved') return { icon: '✓', state: 'completed', color: 'bg-emerald-500 text-white ring-2 ring-emerald-300', text: 'Hoàn thành' };
    if (status === 'returned') {
      if (stepNum === 1) return { icon: '↩️', state: 'warning', color: 'bg-rose-500 text-white ring-2 ring-rose-300 animate-pulse', text: 'Yêu cầu bổ sung' };
      return { icon: \`\${stepNum}\`, state: 'pending', color: 'bg-slate-200 text-slate-500', text: 'Chờ duyệt' };
    }
    if (status === 'draft') {
      if (stepNum === 1) return { icon: '✍️', state: 'active', color: 'bg-blue-600 text-white ring-4 ring-blue-200 animate-pulse', text: 'Đang tự chấm' };
      return { icon: \`\${stepNum}\`, state: 'pending', color: 'bg-slate-200 text-slate-500', text: 'Chờ nộp' };
    }
    if (status === 'submitted_l1') {
      if (stepNum === 1) return { icon: '✓', state: 'completed', color: 'bg-emerald-500 text-white', text: 'Đã nộp' };
      if (stepNum === 2) return { icon: '⏳', state: 'active', color: 'bg-amber-500 text-white ring-4 ring-amber-200 animate-bounce', text: 'Đang duyệt' };
      return { icon: \`\${stepNum}\`, state: 'pending', color: 'bg-slate-200 text-slate-500', text: 'Chờ duyệt' };
    }
    if (status === 'submitted_l2') {
      if (stepNum <= 2) return { icon: '✓', state: 'completed', color: 'bg-emerald-500 text-white', text: 'Đã duyệt' };
      if (stepNum === 3) return { icon: '⏳', state: 'active', color: 'bg-sky-500 text-white ring-4 ring-sky-200 animate-bounce', text: 'Đang duyệt' };
      return { icon: \`\${stepNum}\`, state: 'pending', color: 'bg-slate-200 text-slate-500', text: 'Chờ duyệt' };
    }
    if (status === 'submitted_l3') {
      if (stepNum <= 3) return { icon: '✓', state: 'completed', color: 'bg-emerald-500 text-white', text: 'Đã duyệt' };
      if (stepNum === 4) return { icon: '⏳', state: 'active', color: 'bg-indigo-500 text-white ring-4 ring-indigo-200 animate-bounce', text: 'Đang thẩm định' };
      return { icon: \`\${stepNum}\`, state: 'pending', color: 'bg-slate-200 text-slate-500', text: 'Chờ duyệt' };
    }
    if (status === 'submitted_l4') {
      if (stepNum <= 4) return { icon: '✓', state: 'completed', color: 'bg-emerald-500 text-white', text: 'Đã thẩm định' };
      if (stepNum === 5) return { icon: '⏳', state: 'active', color: 'bg-purple-600 text-white ring-4 ring-purple-200 animate-bounce', text: 'Đang phê duyệt' };
      return { icon: \`\${stepNum}\`, state: 'pending', color: 'bg-slate-200 text-slate-500', text: 'Chờ duyệt' };
    }
    return { icon: \`\${stepNum}\`, state: 'pending', color: 'bg-slate-200 text-slate-500', text: 'Chờ duyệt' };
  };

  const s1 = getStepState(1);
  const s2 = getStepState(2);
  const s3 = getStepState(3);
  const s4 = getStepState(4);
  const s5 = getStepState(5);

  let statusBadgeHtml = '';
  let statusDetailHtml = '';

  if (status === 'approved') {
    statusBadgeHtml = '<span class="px-3 py-1 bg-emerald-600 text-white font-black rounded-full text-xs flex items-center gap-1.5 shadow-sm"><span>🏆</span> ĐÃ PHÊ DUYỆT & CÔNG NHẬN CHÍNH THỨC</span>';
    statusDetailHtml = \`
      <div class="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
        <div class="flex items-center gap-3">
          <span class="text-3xl">📜</span>
          <div>
            <div class="font-black text-sm text-emerald-900">Quyết định Công nhận Năng lực đã được Ban Giám Đốc ban hành</div>
            <div class="text-slate-600 mt-0.5">Số quyết định: <strong class="font-mono text-slate-900">\${sub.decisionNo || '089/QĐ-BVĐHYD-CS2/2026'}</strong> · Bậc công nhận: <strong class="text-amber-800">\${tierObj.name} (\${tierObj.title})</strong> · Tổng điểm: <strong class="text-blue-900 font-black">\${sub.totalScore || 0}/1.000</strong></div>
          </div>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <button type="button" onclick="viewCertificate('\${user.id}')" class="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-950 font-black rounded-xl text-xs shadow-md flex items-center gap-1.5 transition-all cursor-pointer">
            <span>📜</span> Giấy Chứng Nhận (A4)
          </button>
          <button type="button" onclick="viewOfficialDecision('\${user.id}')" class="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-black rounded-xl text-xs shadow-md flex items-center gap-1.5 transition-all cursor-pointer">
            <span>📄</span> Văn Bản Quyết Định
          </button>
          <button type="button" onclick="\${isLinkedToPortfolio ? \"switchTab('portfolio')\" : \`linkCertificateToPortfolio('\${user.id}', \${currentYear})\`}" class="px-3.5 py-2 \${isLinkedToPortfolio ? 'bg-emerald-700 hover:bg-emerald-800 text-white' : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white'} font-black rounded-xl text-xs shadow-md flex items-center gap-1.5 transition-all cursor-pointer">
            <span>\${isLinkedToPortfolio ? '✅' : '📁'}</span> \${isLinkedToPortfolio ? 'Đã Lưu Vào Portfolio (Xem ngay)' : 'Lưu Vào Portfolio Cá Nhân'}
          </button>
        </div>
      </div>
    \`;
  } else if (status === 'submitted_l1') {
    statusBadgeHtml = '<span class="px-3 py-1 bg-amber-500 text-white font-black rounded-full text-xs flex items-center gap-1.5 shadow-sm animate-pulse"><span>⏳</span> CHỜ DUYỆT CẤP 1 (ĐD/KTV TRƯỞNG)</span>';
    statusDetailHtml = \`
      <div class="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-950">
        <strong>Vị trí hồ sơ hiện tại:</strong> Hồ sơ đã được gửi thành công. Đang chờ <strong>Điều Dưỡng Trưởng / KTV Trưởng Khoa \${user.department}</strong> kiểm tra minh chứng, chấm điểm thẩm định Cấp 1 và chuyển tiếp lên Trưởng Khoa.
      </div>
    \`;
  } else if (status === 'submitted_l2') {
    statusBadgeHtml = '<span class="px-3 py-1 bg-sky-600 text-white font-black rounded-full text-xs flex items-center gap-1.5 shadow-sm animate-pulse"><span>🩺</span> CHỜ DUYỆT CẤP 2 (BÁC SĨ TRƯỞNG KHOA)</span>';
    statusDetailHtml = \`
      <div class="p-4 bg-sky-50 border border-sky-300 rounded-2xl text-xs text-sky-950">
        <strong>Vị trí hồ sơ hiện tại:</strong> ĐD Trưởng đã ký duyệt Cấp 1 (\${sub.l1ApprovedBy || 'ĐDT Khoa'}). Đang chờ <strong>Bác Sĩ Trưởng Khoa / Trưởng Đơn Vị</strong> xem xét, ký duyệt chuyên môn Cấp 2 và chuyển lên Ban Điều Dưỡng.
      </div>
    \`;
  } else if (status === 'submitted_l3') {
    statusBadgeHtml = '<span class="px-3 py-1 bg-indigo-600 text-white font-black rounded-full text-xs flex items-center gap-1.5 shadow-sm animate-pulse"><span>📋</span> CHỜ THẨM ĐỊNH CẤP 3 (BAN ĐIỀU DƯỠNG)</span>';
    statusDetailHtml = \`
      <div class="p-4 bg-indigo-50 border border-indigo-300 rounded-2xl text-xs text-indigo-950">
        <strong>Vị trí hồ sơ hiện tại:</strong> Trưởng Khoa đã ký duyệt Cấp 2 (\${sub.l2ApprovedBy || 'Bác Sĩ Trưởng Khoa'}). Đang chờ <strong>Trưởng Ban Điều Dưỡng Bệnh Viện</strong> thẩm định đối chiếu quy chuẩn toàn viện và trình Ban Giám Đốc.
      </div>
    \`;
  } else if (status === 'submitted_l4') {
    statusBadgeHtml = '<span class="px-3 py-1 bg-purple-600 text-white font-black rounded-full text-xs flex items-center gap-1.5 shadow-sm animate-pulse"><span>🏛️</span> CHỜ PHÊ DUYỆT CẤP 4 (BAN GIÁM ĐỐC)</span>';
    statusDetailHtml = \`
      <div class="p-4 bg-purple-50 border border-purple-300 rounded-2xl text-xs text-purple-950">
        <strong>Vị trí hồ sơ hiện tại:</strong> Ban Điều Dưỡng đã hoàn tất thẩm định Cấp 3 (\${sub.l3ApprovedBy || 'Trưởng Ban ĐD'}). Đang chờ <strong>Ban Giám Đốc / Ban Lãnh Đạo Bệnh Viện</strong> ký duyệt chính thức và ban hành Quyết Định Công Nhận.
      </div>
    \`;
  } else if (status === 'returned') {
    statusBadgeHtml = '<span class="px-3 py-1 bg-rose-600 text-white font-black rounded-full text-xs flex items-center gap-1.5 shadow-sm"><span>↩️</span> YÊU CẦU BỔ SUNG MINH CHỨNG</span>';
    statusDetailHtml = \`
      <div class="p-4 bg-rose-50 border border-rose-300 rounded-2xl text-xs text-rose-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div class="font-black text-rose-900 text-sm">Hồ sơ cần bổ sung / chỉnh sửa theo yêu cầu của Cấp Quản Lý</div>
          <div class="text-rose-800 italic mt-1">" \${sub.returnComment || 'Vui lòng bổ sung thêm tài liệu minh chứng và rà soát lại các tiêu chí chưa đạt.'} "</div>
        </div>
        <button type="button" onclick="switchTab('assessment')" class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all shrink-0 cursor-pointer">
          ✏️ Bổ Sung & Nộp Lại
        </button>
      </div>
    \`;
  } else {
    statusBadgeHtml = '<span class="px-3 py-1 bg-slate-200 text-slate-700 font-black rounded-full text-xs flex items-center gap-1.5"><span>✍️</span> ĐANG TỰ ĐÁNH GIÁ (BẢN NHÁP)</span>';
    statusDetailHtml = \`
      <div class="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl text-xs text-blue-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div class="font-bold text-slate-800">Hồ sơ chưa được gửi duyệt</div>
          <div class="text-slate-600 mt-0.5">Vui lòng hoàn thành việc tự chấm điểm theo \${meta.totalCriteria} tiêu chí và nộp hồ sơ để bắt đầu luồng ký duyệt 4 cấp.</div>
        </div>
        <button type="button" onclick="switchTab('assessment')" class="px-4 py-2 bg-[#004b87] hover:bg-blue-900 text-white font-bold rounded-xl text-xs shadow-xs transition-all shrink-0 cursor-pointer">
          📋 Đến Bảng Tự Chấm Điểm →
        </button>
      </div>
    \`;
  }

  // Bảng Vinh danh lớn nếu đã duyệt
  let grandHonorCardHtml = '';
  if (status === 'approved') {
    grandHonorCardHtml = \`
      <div class="my-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/25 via-white to-amber-500/10 border-2 border-amber-400 shadow-xl relative overflow-hidden animate-fade-in">
        <div class="absolute -right-12 -bottom-12 w-56 h-56 rounded-full bg-amber-400/25 blur-3xl pointer-events-none"></div>
        <div class="absolute -left-12 -top-12 w-40 h-40 rounded-full bg-yellow-300/20 blur-2xl pointer-events-none"></div>

        <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div class="flex items-start sm:items-center gap-4">
            <div class="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center text-5xl shadow-lg shrink-0 ring-4 ring-amber-200/80">
              🏆
            </div>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="px-3.5 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xs">
                  ★ VINH DANH NĂNG LỰC ĐIỀU DƯỠNG UMC NĂM \${currentYear} ★
                </span>
                <span class="text-xs font-mono font-bold text-slate-600 bg-white/80 px-2.5 py-0.5 rounded-md border border-amber-200">QĐ Số: \${sub.decisionNo || '089/QĐ-BVĐHYD-CS2/2026'}</span>
              </div>
              <h2 class="text-xl sm:text-3xl font-black text-blue-950 mt-2 tracking-tight">
                CHÚC MỪNG \${user.fullName.toUpperCase()}
              </h2>
              <div class="text-sm sm:text-base font-black text-amber-900 mt-1 flex items-center gap-2">
                <span>🌟 CÔNG NHẬN CHÍNH THỨC:</span>
                <span class="underline decoration-amber-500 decoration-2 font-black">\${tierObj.title.toUpperCase()} (\${tierObj.name})</span>
              </div>
              <div class="text-xs text-slate-600 mt-2 flex items-center gap-4 flex-wrap">
                <span>Điểm đánh giá chuẩn hóa: <strong class="text-blue-900 font-black text-sm sm:text-base">\${sub.totalScore || 0}/1.000 điểm</strong></span>
                <span>Khoa/Đơn vị: <strong class="text-slate-800">\${user.department}</strong></span>
                <span>Chứng nhận: <strong class="text-emerald-700">A4 Chuẩn Bệnh Viện</strong></span>
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-72 shrink-0">
            <button type="button" onclick="viewCertificate('\${user.id}')" class="flex-1 px-5 py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-600 hover:to-amber-500 text-slate-950 font-black rounded-2xl text-xs shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer">
              <span>📜</span> In Giấy Chứng Nhận (A4)
            </button>
            <button type="button" onclick="viewOfficialDecision('\${user.id}')" class="flex-1 px-5 py-3 bg-blue-700 hover:bg-blue-800 text-white font-black rounded-2xl text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer">
              <span>📄</span> Xem Quyết Định Điện Tử
            </button>
            <button type="button" onclick="\${isLinkedToPortfolio ? \"switchTab('portfolio')\" : \`linkCertificateToPortfolio('\${user.id}', \${currentYear})\`}" class="flex-1 px-5 py-3 \${isLinkedToPortfolio ? 'bg-emerald-700 hover:bg-emerald-800 text-white' : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white'} font-black rounded-2xl text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer">
              <span>\${isLinkedToPortfolio ? '✅' : '📁'}</span> \${isLinkedToPortfolio ? 'Đã Lưu Vào Portfolio (Xem)' : 'Lưu Vào Portfolio Cá Nhân'}
            </button>
          </div>
        </div>

        <!-- 4 Cấp Ký Duyệt & Lời Động Viên Truyền Cảm Hứng -->
        <div class="mt-8 pt-6 border-t border-amber-300/80">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-wide">
              <span>💬</span> Ý KIẾN ĐÁNH GIÁ & LỜI ĐỘNG VIÊN KHÍCH LỆ TỪ 4 CẤP THẨM ĐỊNH
            </h4>
            <span class="text-[11px] text-amber-900 font-bold bg-amber-100 px-3 py-1 rounded-full">✓ 100% Hoàn Tất Ký Duyệt</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
            <!-- Cấp 1 -->
            <div class="p-4 bg-white/95 rounded-2xl border border-amber-200 shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <div class="flex items-center justify-between">
                  <span class="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 font-black text-[10px] uppercase">Cấp 1 · ĐD Trưởng Khoa</span>
                  <span class="text-emerald-700 font-bold text-[10px] flex items-center gap-0.5"><span>✓</span> Đã ký</span>
                </div>
                <div class="font-black text-slate-900 mt-2 text-sm">\${sub.l1ApprovedBy || 'Nguyễn Thị Kim Quyên'}</div>
                <div class="text-[11px] text-slate-500">Khoa \${user.department}</div>
                <p class="text-slate-700 italic text-[11px] mt-2.5 p-2 bg-amber-50/50 rounded-xl border border-amber-100 leading-relaxed">
                  "Kỹ năng lâm sàng vững, thực hiện nghiêm quy trình vô khuẩn và chăm sóc người bệnh ân cần. Em luôn hoàn thành tốt các chỉ tiêu chuyên môn được giao."
                </p>
              </div>
              <div class="pt-2 border-t border-slate-100 text-[11px] text-amber-900 font-bold flex items-center gap-1">
                <span>🌟</span> <em>"Chúc em luôn giữ vững nhiệt huyết và tay nghề vững vàng!"</em>
              </div>
            </div>

            <!-- Cấp 2 -->
            <div class="p-4 bg-white/95 rounded-2xl border border-amber-200 shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <div class="flex items-center justify-between">
                  <span class="px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 font-black text-[10px] uppercase">Cấp 2 · Bác Sĩ Trưởng Khoa</span>
                  <span class="text-emerald-700 font-bold text-[10px] flex items-center gap-0.5"><span>✓</span> Đã ký</span>
                </div>
                <div class="font-black text-slate-900 mt-2 text-sm">\${sub.l2ApprovedBy || 'BS.CKII Phạm Quang Vinh'}</div>
                <div class="text-[11px] text-slate-500">Trưởng Khoa \${user.department}</div>
                <p class="text-slate-700 italic text-[11px] mt-2.5 p-2 bg-sky-50/50 rounded-xl border border-sky-100 leading-relaxed">
                  "Phối hợp ăn ý và chuẩn xác cùng ekip bác sĩ trong các ca điều trị và xử trí cấp cứu. Tinh thần trách nhiệm cao, đảm bảo an toàn tuyệt đối cho người bệnh."
                </p>
              </div>
              <div class="pt-2 border-t border-slate-100 text-[11px] text-sky-900 font-bold flex items-center gap-1">
                <span>🌟</span> <em>"Khoa đánh giá rất cao sự cống hiến và chủ động của bạn!"</em>
              </div>
            </div>

            <!-- Cấp 3 -->
            <div class="p-4 bg-white/95 rounded-2xl border border-amber-200 shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <div class="flex items-center justify-between">
                  <span class="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 font-black text-[10px] uppercase">Cấp 3 · Trưởng Ban ĐD</span>
                  <span class="text-emerald-700 font-bold text-[10px] flex items-center gap-0.5"><span>✓</span> Đã thẩm định</span>
                </div>
                <div class="font-black text-slate-900 mt-2 text-sm">\${sub.l3ApprovedBy || 'ThS. Phan Thị Tâm Đan'}</div>
                <div class="text-[11px] text-slate-500">Ban Điều Dưỡng Bệnh Viện</div>
                <p class="text-slate-700 italic text-[11px] mt-2.5 p-2 bg-indigo-50/50 rounded-xl border border-indigo-100 leading-relaxed">
                  "Minh chứng đầy đủ và rõ ràng, đạt xuất sắc các tiêu chí năng lực toàn viện. Tích cực tham gia đào tạo CME và đề tài cải tiến chất lượng chăm sóc."
                </p>
              </div>
              <div class="pt-2 border-t border-slate-100 text-[11px] text-indigo-900 font-bold flex items-center gap-1">
                <span>🌟</span> <em>"Ban Điều Dưỡng tự hào về bước tiến và sự trưởng thành của bạn!"</em>
              </div>
            </div>

            <!-- Cấp 4 -->
            <div class="p-4 bg-gradient-to-b from-purple-50/70 to-white rounded-2xl border-2 border-purple-300 shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <div class="flex items-center justify-between">
                  <span class="px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 font-black text-[10px] uppercase">Cấp 4 · Ban Giám Đốc</span>
                  <span class="text-purple-700 font-black text-[10px] flex items-center gap-0.5"><span>👑</span> ĐÃ PHÊ DUYỆT</span>
                </div>
                <div class="font-black text-purple-950 mt-2 text-sm">\${sub.l4ApprovedBy || 'PGS.TS.BS Hà Mạnh Tuấn'}</div>
                <div class="text-[11px] text-slate-500">Ban Lãnh Đạo Bệnh Viện</div>
                <p class="text-purple-950 font-medium italic text-[11px] mt-2.5 p-2 bg-purple-100/50 rounded-xl border border-purple-200 leading-relaxed">
                  "Chuẩn y ban hành Quyết định công nhận Bậc Năng Lực \${tierObj.name}. Biểu dương sự cống hiến hết lòng vì người bệnh của nhân sự."
                </p>
              </div>
              <div class="pt-2 border-t border-purple-200 text-[11px] text-purple-900 font-black flex items-center gap-1">
                <span>🎉</span> <em>"Bạn là niềm tự hào của Bệnh viện Đại học Y Dược TP.HCM!"</em>
              </div>
            </div>
          </div>
        </div>

      </div>
    \`;
  }

  container.innerHTML = \`
    <div class="space-y-4">
      
      <!-- Top Overview Header Card -->
      <div class="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div class="flex items-center gap-3.5">
            <img src="\${user.avatar || 'assets/avatar.png'}" alt="Avatar" class="w-14 h-14 rounded-2xl border-2 border-blue-200 object-cover shadow-2xs shrink-0">
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <h2 class="text-base sm:text-lg font-black text-slate-900">\${user.fullName}</h2>
                <span class="px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-900 font-bold text-xs">\${user.msnv}</span>
                <span class="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs">\${user.department}</span>
              </div>
              <div class="text-xs text-slate-500 mt-1 flex items-center gap-2">
                <span>\${meta.icon} \${meta.name} (\${meta.totalCriteria} Tiêu chí)</span>
                <span>·</span>
                <span>Năm sinh: \${user.birthYear || user.dob || '1990'}</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3 flex-wrap">
            <div class="flex items-center gap-1.5 bg-slate-100 border border-slate-300 rounded-xl px-3 py-1.5">
              <span class="text-xs font-bold text-slate-700">📅 Năm:</span>
              <input type="number" min="2020" max="2035" value="\${currentYear}" onchange="changeAssessmentYear(this.value); renderStatusTab();" class="w-16 px-1.5 py-0.5 bg-white text-blue-950 font-black text-xs rounded-lg text-center focus:ring-2 focus:ring-blue-400 focus:outline-none cursor-pointer">
            </div>
            \${statusBadgeHtml}
          </div>
        </div>

        <!-- 5-Step Visual Workflow Stepper -->
        <div class="mt-5 pt-2">
          <div class="text-xs font-black uppercase text-slate-600 mb-3 flex items-center justify-between">
            <span>TIẾN TRÌNH KÝ DUYỆT 5 BƯỚC NĂM \${currentYear}</span>
            <span class="text-slate-400 font-normal">Quy trình chuẩn BV ĐHYD TP.HCM</span>
          </div>

          <div class="grid grid-cols-5 gap-2 sm:gap-4 text-center">
            <!-- Step 1 -->
            <div class="flex flex-col items-center">
              <div class="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl \${s1.color} flex items-center justify-center font-black text-sm shadow-sm transition-all">
                \${s1.icon}
              </div>
              <div class="mt-2 text-xs font-black text-slate-900 leading-tight">1. Tự Đánh Giá</div>
              <div class="text-[10px] text-slate-500 mt-0.5 hidden sm:block">\${sub.submittedAt ? 'Đã nộp: ' + new Date(sub.submittedAt).toLocaleDateString('vi-VN') : 'Bản nháp'}</div>
              <div class="mt-1"><span class="px-2 py-0.5 rounded-md text-[9px] font-bold bg-slate-100 text-slate-700">\${s1.text}</span></div>
            </div>

            <!-- Step 2 -->
            <div class="flex flex-col items-center">
              <div class="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl \${s2.color} flex items-center justify-center font-black text-sm shadow-sm transition-all">
                \${s2.icon}
              </div>
              <div class="mt-2 text-xs font-black text-slate-900 leading-tight">2. Duyệt Cấp 1</div>
              <div class="text-[10px] text-slate-500 mt-0.5 hidden sm:block">\${sub.l1ApprovedBy || 'ĐD/KTV Trưởng'}</div>
              <div class="mt-1"><span class="px-2 py-0.5 rounded-md text-[9px] font-bold bg-slate-100 text-slate-700">\${s2.text}</span></div>
            </div>

            <!-- Step 3 -->
            <div class="flex flex-col items-center">
              <div class="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl \${s3.color} flex items-center justify-center font-black text-sm shadow-sm transition-all">
                \${s3.icon}
              </div>
              <div class="mt-2 text-xs font-black text-slate-900 leading-tight">3. Duyệt Cấp 2</div>
              <div class="text-[10px] text-slate-500 mt-0.5 hidden sm:block">\${sub.l2ApprovedBy || 'Bác Sĩ Trưởng Khoa'}</div>
              <div class="mt-1"><span class="px-2 py-0.5 rounded-md text-[9px] font-bold bg-slate-100 text-slate-700">\${s3.text}</span></div>
            </div>

            <!-- Step 4 -->
            <div class="flex flex-col items-center">
              <div class="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl \${s4.color} flex items-center justify-center font-black text-sm shadow-sm transition-all">
                \${s4.icon}
              </div>
              <div class="mt-2 text-xs font-black text-slate-900 leading-tight">4. Thẩm Định C3</div>
              <div class="text-[10px] text-slate-500 mt-0.5 hidden sm:block">\${sub.l3ApprovedBy || 'Trưởng Ban ĐD'}</div>
              <div class="mt-1"><span class="px-2 py-0.5 rounded-md text-[9px] font-bold bg-slate-100 text-slate-700">\${s4.text}</span></div>
            </div>

            <!-- Step 5 -->
            <div class="flex flex-col items-center">
              <div class="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl \${s5.color} flex items-center justify-center font-black text-sm shadow-sm transition-all">
                \${s5.icon}
              </div>
              <div class="mt-2 text-xs font-black text-slate-900 leading-tight">5. Phê Duyệt C4</div>
              <div class="text-[10px] text-slate-500 mt-0.5 hidden sm:block">\${sub.l4ApprovedBy || 'Ban Giám Đốc'}</div>
              <div class="mt-1"><span class="px-2 py-0.5 rounded-md text-[9px] font-bold bg-slate-100 text-slate-700">\${s5.text}</span></div>
            </div>
          </div>
        </div>

        <!-- Next Step / Context Banner -->
        <div class="mt-5">
          \${statusDetailHtml}
        </div>
      </div>

      <!-- Grand Honor Banner if Approved -->
      \${grandHonorCardHtml}

      <!-- Detailed Scores & Approver Notes Summary -->
      <div class="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 class="text-sm font-black text-slate-800 flex items-center gap-2">
            <span>📊</span> TỔNG HỢP ĐIỂM SỐ & Ý KIẾN THẨM ĐỊNH CHI TIẾT
          </h3>
          <button type="button" onclick="switchTab('assessment')" class="text-xs text-blue-700 font-bold hover:underline flex items-center gap-1 cursor-pointer">
            Xem Bảng Điểm Từng Tiêu Chí →
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div class="font-bold text-slate-700 uppercase tracking-wide text-[11px]">Thông Tin Điểm Số Qua 4 Cấp</div>
            <div class="flex justify-between py-1 border-b border-slate-200">
              <span class="text-slate-600">1. Điểm nhân viên tự chấm:</span>
              <strong class="font-black text-slate-900">\${sub.selfScore || 0} / 1.000 điểm</strong>
            </div>
            <div class="flex justify-between py-1 border-b border-slate-200">
              <span class="text-slate-600">2. Điểm ĐD Trưởng chấm Cấp 1:</span>
              <strong class="font-black text-slate-900">\${sub.l1Score !== undefined ? sub.l1Score : (sub.selfScore || 0)} / 1.000 điểm</strong>
            </div>
            <div class="flex justify-between py-1 border-b border-slate-200">
              <span class="text-slate-600">3. Điểm BS Trưởng Khoa duyệt Cấp 2:</span>
              <strong class="font-black text-slate-900">\${sub.l2Score !== undefined ? sub.l2Score : (sub.l1Score || sub.selfScore || 0)} / 1.000 điểm</strong>
            </div>
            <div class="flex justify-between py-1 border-b border-slate-200">
              <span class="text-slate-600">4. Điểm Ban ĐD thẩm định Cấp 3:</span>
              <strong class="font-black text-slate-900">\${sub.l3Score !== undefined ? sub.l3Score : (sub.totalScore || 0)} / 1.000 điểm</strong>
            </div>
            <div class="flex justify-between pt-1">
              <span class="text-slate-700 font-bold">Tổng điểm phê duyệt chính thức (Cấp 4):</span>
              <strong class="font-black text-blue-900 text-sm">\${sub.totalScore || 0} / 1.000 điểm</strong>
            </div>
          </div>

          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div class="font-bold text-slate-700 uppercase tracking-wide text-[11px]">Kết Luận Thẩm Định & Chứng Nhận</div>
            <div class="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-700 italic">
              <strong>Nhận xét chung:</strong> "\${sub.notes || sub.returnComment || 'Hồ sơ đầy đủ minh chứng, kỹ năng tay nghề và kiến thức chuyên môn đạt yêu cầu theo quy chuẩn Bệnh viện Đại học Y Dược TP.HCM.'}"
            </div>
            <div class="text-[11px] text-slate-500 pt-1">
              • Bậc năng lực đạt chuẩn: <strong class="text-amber-800 font-bold">\${tierObj.name} (\${tierObj.title})</strong>
            </div>
            <div class="text-[11px] text-slate-500">
              • Trạng thái hồ sơ: <strong class="\${status === 'approved' ? 'text-emerald-700 font-bold' : 'text-slate-600'}">\${status === 'approved' ? 'Đã cấp chứng nhận A4 & Quyết định Ban Giám Đốc' : 'Đang trong quy trình xử lý 4 cấp'}</strong>
            </div>
            <div class="text-[11px] text-slate-500">
              • Lưu trữ Portfolio: <strong class="\${isLinkedToPortfolio ? 'text-emerald-700 font-bold' : 'text-slate-600'}">\${isLinkedToPortfolio ? '✓ Đã liên kết vào Hồ sơ năng lực cá nhân' : 'Chưa liên kết'}</strong>
            </div>
          </div>
        </div>

      </div>

    </div>
  \`;
}
`;

const oldRenderStatusTabStart = "// TRẠNG THÁI HỒ SƠ & QUYẾT ĐỊNH VINH DANH (CHO NHÂN VIÊN & QUẢN LÝ)";
const oldRenderStatusTabEnd = "function viewOfficialDecision(userId) {";

if (content.includes(oldRenderStatusTabStart) && content.includes(oldRenderStatusTabEnd)) {
  const startIdx = content.indexOf(oldRenderStatusTabStart);
  const endIdx = content.indexOf(oldRenderStatusTabEnd);
  content = content.slice(0, startIdx) + statusTabImplementation.trim() + "\n\n" + content.slice(endIdx);
}

fs.writeFileSync('app.js', content, 'utf8');
fs.writeFileSync('js/app.js', content, 'utf8');

console.log('Successfully updated app.js and js/app.js');

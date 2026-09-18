const fs = require('fs');

const newRenderStatusTabCode = `function linkCertificateToPortfolio(userId, year) {
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
  
  if (typeof confetti === 'function') {
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  }

  showToast(\`🎉 Đã kết nối thành công Giấy chứng nhận và Quyết định vào Portfolio của \${user.fullName}!\`, 'success');
  
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

  // Lấy danh sách domains và tính toán số lượng tiêu chí & minh chứng
  const domains = (typeof DOMAINS_BY_SPECIALTY !== 'undefined' && (DOMAINS_BY_SPECIALTY[specialty] || DOMAINS_BY_SPECIALTY['lamsang'])) || [];
  let totalCritCount = 0;
  let scoredCritCount = 0;
  let evidenceCount = 0;
  const scores = sub.scores || {};
  const evidences = sub.criterionEvidences || sub.evidences || {};

  domains.forEach(d => {
    (d.standards || []).forEach(st => {
      (st.criteria || []).forEach(cr => {
        totalCritCount++;
        if ((scores[cr.id] || 0) > 0) scoredCritCount++;
        if (evidences[cr.id] && evidences[cr.id].length > 0) {
          evidenceCount += evidences[cr.id].length;
        }
      });
    });
  });

  const completionPct = totalCritCount > 0 ? Math.round((scoredCritCount / totalCritCount) * 100) : 0;
  const scorePct = Math.min(100, Math.round(((sub.totalScore || 0) / 1000) * 100));

  // Cấu hình Timeline 5 bước chuyên sâu kết nối trực tiếp Portfolio & Vinh danh
  const timelineSteps = [
    {
      num: 1,
      title: 'Nhân Viên Tự Đánh Giá',
      subtitle: 'Tự chấm 66 tiêu chí & nộp minh chứng',
      role: user.roleName || 'Điều Dưỡng Viên',
      actor: user.fullName,
      time: sub.submittedAt ? sub.submittedAt : (status === 'draft' ? 'Đang thực hiện' : 'Hoàn tất'),
      state: status === 'draft' ? 'active' : (status === 'returned' ? 'warning' : 'completed'),
      icon: status === 'draft' ? '✍️' : (status === 'returned' ? '↩️' : '✓'),
      desc: status === 'draft' ? 'Bản nháp đang mở để tự chấm điểm và tải tài liệu minh chứng.' : \`Đã hoàn thành tự chấm điểm: \${sub.selfScore || sub.totalScore || 0}/1.000 điểm.\`
    },
    {
      num: 2,
      title: 'Duyệt Cấp 1: ĐD / KTV Trưởng Khoa',
      subtitle: 'Thẩm định kỹ năng lâm sàng & quy trình',
      role: 'ĐD/KTV Trưởng Khoa',
      actor: sub.l1ApprovedBy || 'Nguyễn Thị Kim Quyên',
      time: sub.l1ApprovedAt ? new Date(sub.l1ApprovedAt).toLocaleString('vi-VN') : (status === 'submitted_l1' ? 'Đang xử lý' : (['submitted_l2', 'submitted_l3', 'submitted_l4', 'approved'].includes(status) ? 'Đã duyệt' : 'Chờ nộp')),
      state: status === 'submitted_l1' ? 'active' : (['submitted_l2', 'submitted_l3', 'submitted_l4', 'approved'].includes(status) ? 'completed' : 'pending'),
      icon: status === 'submitted_l1' ? '⏳' : (['submitted_l2', 'submitted_l3', 'submitted_l4', 'approved'].includes(status) ? '✓' : '2'),
      desc: ['submitted_l2', 'submitted_l3', 'submitted_l4', 'approved'].includes(status) 
        ? \`Đã thẩm định chuyên môn Cấp 1: \${sub.l1Score || sub.selfScore || sub.totalScore || 0}đ.\`
        : (status === 'submitted_l1' ? 'ĐD Trưởng đang kiểm tra bảng điểm và hồ sơ minh chứng đính kèm.' : 'Chờ hoàn thành bước 1.')
    },
    {
      num: 3,
      title: 'Duyệt Cấp 2: Bác Sĩ Trưởng Khoa',
      subtitle: 'Ký duyệt phối hợp điều trị & an toàn',
      role: 'BS Trưởng Khoa / Đơn Vị',
      actor: sub.l2ApprovedBy || 'BS.CKII Phạm Quang Vinh',
      time: sub.l2ApprovedAt ? new Date(sub.l2ApprovedAt).toLocaleString('vi-VN') : (status === 'submitted_l2' ? 'Đang xử lý' : (['submitted_l3', 'submitted_l4', 'approved'].includes(status) ? 'Đã duyệt' : 'Chờ chuyển')),
      state: status === 'submitted_l2' ? 'active' : (['submitted_l3', 'submitted_l4', 'approved'].includes(status) ? 'completed' : 'pending'),
      icon: status === 'submitted_l2' ? '🩺' : (['submitted_l3', 'submitted_l4', 'approved'].includes(status) ? '✓' : '3'),
      desc: ['submitted_l3', 'submitted_l4', 'approved'].includes(status) 
        ? \`Đã ký duyệt chuyên môn Cấp 2: \${sub.l2Score || sub.l1Score || sub.totalScore || 0}đ.\`
        : (status === 'submitted_l2' ? 'Bác Sĩ Trưởng Khoa đang xem xét, chuẩn y chuyển lên Ban Điều Dưỡng.' : 'Chờ hoàn thành bước 2.')
    },
    {
      num: 4,
      title: 'Thẩm Định Cấp 3: Ban Điều Dưỡng',
      subtitle: 'Đối chiếu quy chuẩn năng lực toàn viện',
      role: 'Trưởng Ban Điều Dưỡng',
      actor: sub.l3ApprovedBy || 'ThS. Phan Thị Tâm Đan',
      time: sub.l3ApprovedAt ? new Date(sub.l3ApprovedAt).toLocaleString('vi-VN') : (status === 'submitted_l3' ? 'Đang thẩm định' : (['submitted_l4', 'approved'].includes(status) ? 'Đã thẩm định' : 'Chờ chuyển')),
      state: status === 'submitted_l3' ? 'active' : (['submitted_l4', 'approved'].includes(status) ? 'completed' : 'pending'),
      icon: status === 'submitted_l3' ? '📋' : (['submitted_l4', 'approved'].includes(status) ? '✓' : '4'),
      desc: ['submitted_l4', 'approved'].includes(status) 
        ? \`Đã hoàn tất thẩm định Cấp 3: \${sub.l3Score || sub.totalScore || 0}đ.\`
        : (status === 'submitted_l3' ? 'Ban Điều Dưỡng đang rà soát CME, NCKH và xếp bậc toàn viện.' : 'Chờ hoàn thành bước 3.')
    },
    {
      num: 5,
      title: 'Bước 5: Phê Duyệt & Nhận Vinh Danh',
      subtitle: 'Quyết định công nhận & Liên kết Portfolio',
      role: 'Ban Giám Đốc Bệnh Viện',
      actor: sub.l4ApprovedBy || 'PGS.TS.BS Hà Mạnh Tuấn',
      time: sub.approvedAt ? new Date(sub.approvedAt).toLocaleString('vi-VN') : (status === 'submitted_l4' ? 'Đang phê duyệt' : (status === 'approved' ? 'Đã ban hành QĐ' : 'Sẵn sàng nhận')),
      state: status === 'approved' ? 'completed' : (status === 'submitted_l4' ? 'active' : 'completed'),
      icon: status === 'approved' ? '👑' : '🏆',
      desc: status === 'approved' 
        ? \`Quyết định \${sub.decisionNo || '089/QĐ-BVĐHYD-CS2/2026'} đã ban hành. Sẵn sàng in chứng nhận & đồng bộ Portfolio.\`
        : 'Chứng nhận năng lực & Quyết định sẵn sàng liên kết trực tiếp vào Portfolio cá nhân.'
    }
  ];

  let statusBadgeHtml = '';
  let statusDetailHtml = '';

  if (status === 'approved') {
    statusBadgeHtml = '<span class="px-3.5 py-1.5 bg-emerald-600 text-white font-black rounded-full text-xs flex items-center gap-1.5 shadow-sm"><span>🏆</span> ĐÃ PHÊ DUYỆT & CÔNG NHẬN CHÍNH THỨC</span>';
    statusDetailHtml = `
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
            <span>📜</span> In Giấy Chứng Nhận (A4)
          </button>
          <button type="button" onclick="viewOfficialDecision('\${user.id}')" class="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-black rounded-xl text-xs shadow-md flex items-center gap-1.5 transition-all cursor-pointer">
            <span>📄</span> Xem Quyết Định Điện Tử
          </button>
          <button type="button" onclick="\${isLinkedToPortfolio ? "switchTab('portfolio')" : \`linkCertificateToPortfolio('\${user.id}', \${currentYear})\`}" class="px-3.5 py-2 \${isLinkedToPortfolio ? 'bg-emerald-700 hover:bg-emerald-800 text-white' : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white'} font-black rounded-xl text-xs shadow-md flex items-center gap-1.5 transition-all cursor-pointer">
            <span>\${isLinkedToPortfolio ? '✅' : '🔗'}</span> \${isLinkedToPortfolio ? 'Đã Kết Nối Portfolio (Xem)' : 'Kết Nối Vào Portfolio Cá Nhân'}
          </button>
        </div>
      </div>
    `;
  } else if (status === 'submitted_l1') {
    statusBadgeHtml = '<span class="px-3.5 py-1.5 bg-amber-500 text-white font-black rounded-full text-xs flex items-center gap-1.5 shadow-sm animate-pulse"><span>⏳</span> CHỜ DUYỆT CẤP 1 (ĐD/KTV TRƯỞNG)</span>';
    statusDetailHtml = `
      <div class="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-950">
        <strong>Vị trí hồ sơ hiện tại:</strong> Hồ sơ đã được gửi thành công. Đang chờ <strong>Điều Dưỡng Trưởng / KTV Trưởng Khoa \${user.department}</strong> kiểm tra minh chứng, chấm điểm thẩm định Cấp 1 và chuyển tiếp lên Trưởng Khoa.
      </div>
    `;
  } else if (status === 'submitted_l2') {
    statusBadgeHtml = '<span class="px-3.5 py-1.5 bg-sky-600 text-white font-black rounded-full text-xs flex items-center gap-1.5 shadow-sm animate-pulse"><span>🩺</span> CHỜ DUYỆT CẤP 2 (BÁC SĨ TRƯỞNG KHOA)</span>';
    statusDetailHtml = `
      <div class="p-4 bg-sky-50 border border-sky-300 rounded-2xl text-xs text-sky-950">
        <strong>Vị trí hồ sơ hiện tại:</strong> ĐD Trưởng đã ký duyệt Cấp 1 (\${sub.l1ApprovedBy || 'ĐDT Khoa'}). Đang chờ <strong>Bác Sĩ Trưởng Khoa / Trưởng Đơn Vị</strong> xem xét, ký duyệt chuyên môn Cấp 2 và chuyển lên Ban Điều Dưỡng.
      </div>
    `;
  } else if (status === 'submitted_l3') {
    statusBadgeHtml = '<span class="px-3.5 py-1.5 bg-indigo-600 text-white font-black rounded-full text-xs flex items-center gap-1.5 shadow-sm animate-pulse"><span>📋</span> CHỜ THẨM ĐỊNH CẤP 3 (BAN ĐIỀU DƯỠNG)</span>';
    statusDetailHtml = `
      <div class="p-4 bg-indigo-50 border border-indigo-300 rounded-2xl text-xs text-indigo-950">
        <strong>Vị trí hồ sơ hiện tại:</strong> Trưởng Khoa đã ký duyệt Cấp 2 (\${sub.l2ApprovedBy || 'Bác Sĩ Trưởng Khoa'}). Đang chờ <strong>Trưởng Ban Điều Dưỡng Bệnh Viện</strong> thẩm định đối chiếu quy chuẩn toàn viện và trình Ban Giám Đốc.
      </div>
    `;
  } else if (status === 'submitted_l4') {
    statusBadgeHtml = '<span class="px-3.5 py-1.5 bg-purple-600 text-white font-black rounded-full text-xs flex items-center gap-1.5 shadow-sm animate-pulse"><span>🏛️</span> CHỜ PHÊ DUYỆT CẤP 4 (BAN GIÁM ĐỐC)</span>';
    statusDetailHtml = `
      <div class="p-4 bg-purple-50 border border-purple-300 rounded-2xl text-xs text-purple-950">
        <strong>Vị trí hồ sơ hiện tại:</strong> Ban Điều Dưỡng đã hoàn tất thẩm định Cấp 3 (\${sub.l3ApprovedBy || 'Trưởng Ban ĐD'}). Đang chờ <strong>Ban Giám Đốc / Ban Lãnh Đạo Bệnh Viện</strong> ký duyệt chính thức và ban hành Quyết Định Công Nhận.
      </div>
    `;
  } else if (status === 'returned') {
    statusBadgeHtml = '<span class="px-3.5 py-1.5 bg-rose-600 text-white font-black rounded-full text-xs flex items-center gap-1.5 shadow-sm"><span>↩️</span> YÊU CẦU BỔ SUNG MINH CHỨNG</span>';
    statusDetailHtml = `
      <div class="p-4 bg-rose-50 border border-rose-300 rounded-2xl text-xs text-rose-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div class="font-black text-rose-900 text-sm">Hồ sơ cần bổ sung / chỉnh sửa theo yêu cầu của Cấp Quản Lý</div>
          <div class="text-rose-800 italic mt-1">" \${sub.returnComment || 'Vui lòng bổ sung thêm tài liệu minh chứng và rà soát lại các tiêu chí chưa đạt.'} "</div>
        </div>
        <button type="button" onclick="switchTab('assessment')" class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all shrink-0 cursor-pointer">
          ✏️ Bổ Sung & Nộp Lại
        </button>
      </div>
    `;
  } else {
    statusBadgeHtml = '<span class="px-3.5 py-1.5 bg-slate-200 text-slate-700 font-black rounded-full text-xs flex items-center gap-1.5"><span>✍️</span> ĐANG TỰ ĐÁNH GIÁ (BẢN NHÁP)</span>';
    statusDetailHtml = `
      <div class="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl text-xs text-blue-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div class="font-bold text-slate-800">Hồ sơ đang ở trạng thái Tự Đánh Giá</div>
          <div class="text-slate-600 mt-0.5">Bạn có thể tiếp tục chấm điểm theo \${meta.totalCriteria} tiêu chí hoặc kết nối trực tiếp Chứng nhận & Quyết định vào Portfolio cá nhân.</div>
        </div>
        <button type="button" onclick="switchTab('assessment')" class="px-4 py-2 bg-[#004b87] hover:bg-blue-900 text-white font-bold rounded-xl text-xs shadow-xs transition-all shrink-0 cursor-pointer">
          📋 Đến Bảng Tự Chấm Điểm →
        </button>
      </div>
    `;
  }

  // Khung Vinh danh & Chứng nhận Năng Lực kết nối Portfolio (Hiển thị nổi bật, hỗ trợ kết nối mọi lúc)
  const isApproved = status === 'approved';
  const grandHonorCardHtml = `
    <div class="my-4 p-6 sm:p-8 rounded-3xl \${isApproved ? 'bg-gradient-to-br from-amber-500/25 via-white to-amber-500/10 border-2 border-amber-400' : 'bg-gradient-to-br from-blue-600/15 via-white to-amber-500/10 border-2 border-blue-300'} shadow-xl relative overflow-hidden animate-fade-in">
      <div class="absolute -right-12 -bottom-12 w-56 h-56 rounded-full bg-amber-400/25 blur-3xl pointer-events-none"></div>
      <div class="absolute -left-12 -top-12 w-40 h-40 rounded-full bg-blue-300/20 blur-2xl pointer-events-none"></div>

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
              <span>🌟 \${isApproved ? 'CÔNG NHẬN CHÍNH THỨC:' : 'BẬC NĂNG LỰC DỰ KIẾN:'}</span>
              <span class="underline decoration-amber-500 decoration-2 font-black">\${tierObj.title.toUpperCase()} (\${tierObj.name})</span>
            </div>
            <div class="text-xs text-slate-600 mt-2 flex items-center gap-4 flex-wrap">
              <span>Điểm đánh giá: <strong class="text-blue-900 font-black text-sm sm:text-base">\${sub.totalScore || 940}/1.000 điểm</strong></span>
              <span>Khoa/Đơn vị: <strong class="text-slate-800">\${user.department}</strong></span>
              <span>Chứng nhận: <strong class="text-emerald-700">A4 Chuẩn Bệnh Viện UMC</strong></span>
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
          <button type="button" onclick="\${isLinkedToPortfolio ? "switchTab('portfolio')" : \`linkCertificateToPortfolio('\${user.id}', \${currentYear})\`}" class="flex-1 px-5 py-3 \${isLinkedToPortfolio ? 'bg-emerald-700 hover:bg-emerald-800 text-white' : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white'} font-black rounded-2xl text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer">
            <span>\${isLinkedToPortfolio ? '✅' : '🔗'}</span> \${isLinkedToPortfolio ? 'Đã Kết Nối Portfolio (Xem)' : 'Kết Nối Vào Portfolio Cá Nhân'}
          </button>
        </div>
      </div>

      <!-- 4 Cấp Ký Duyệt & Lời Động Viên Truyền Cảm Hứng -->
      <div class="mt-8 pt-6 border-t border-amber-300/80">
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-wide">
            <span>💬</span> Ý KIẾN ĐÁNH GIÁ & LỜI ĐỘNG VIÊN KHÍCH LỆ TỪ 4 CẤP THẨM ĐỊNH
          </h4>
          <span class="text-[11px] text-amber-900 font-bold bg-amber-100 px-3 py-1 rounded-full">✓ Quy chuẩn 4 cấp BV ĐHYD TPHCM</span>
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
  `;

  // Render Dashboard 5 Lĩnh vực
  const domainDashboardCards = domains.map((d, dIdx) => {
    const dScore = (sub.domainScores && sub.domainScores[d.id] !== undefined) ? sub.domainScores[d.id] : 0;
    const maxP = d.maxPoints || 200;
    const dPct = maxP > 0 ? Math.min(100, Math.round((dScore / maxP) * 100)) : 0;
    
    // Đếm tiêu chí đạt trong lĩnh vực
    let dTotal = 0;
    let dPassed = 0;
    (d.standards || []).forEach(st => {
      (st.criteria || []).forEach(cr => {
        dTotal++;
        if ((scores[cr.id] || 0) > 0) dPassed++;
      });
    });

    const colors = [
      { border: 'border-blue-300', bg: 'bg-blue-50/50', bar: 'from-blue-600 to-indigo-600', text: 'text-blue-900', badge: 'bg-blue-100 text-blue-900' },
      { border: 'border-emerald-300', bg: 'bg-emerald-50/50', bar: 'from-emerald-600 to-teal-600', text: 'text-emerald-900', badge: 'bg-emerald-100 text-emerald-900' },
      { border: 'border-amber-300', bg: 'bg-amber-50/50', bar: 'from-amber-500 to-orange-500', text: 'text-amber-900', badge: 'bg-amber-100 text-amber-900' },
      { border: 'border-purple-300', bg: 'bg-purple-50/50', bar: 'from-purple-600 to-indigo-600', text: 'text-purple-900', badge: 'bg-purple-100 text-purple-900' },
      { border: 'border-rose-300', bg: 'bg-rose-50/50', bar: 'from-rose-500 to-pink-500', text: 'text-rose-900', badge: 'bg-rose-100 text-rose-900' }
    ];
    const c = colors[dIdx % colors.length];

    return `
      <div class="p-4 rounded-2xl border \${c.border} \${c.bg} shadow-2xs space-y-2.5">
        <div class="flex items-start justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-lg bg-blue-700 text-white font-black text-xs flex items-center justify-center shrink-0">
              \${d.code || (dIdx + 1)}
            </span>
            <h4 class="font-bold text-slate-900 text-xs leading-snug line-clamp-2">\${d.name}</h4>
          </div>
          <span class="px-2 py-0.5 rounded-md font-black text-xs \${c.badge} shrink-0">
            \${dScore}/\${maxP}đ
          </span>
        </div>

        <div class="space-y-1">
          <div class="flex justify-between text-[11px] text-slate-600">
            <span>Tiến độ hoàn thành:</span>
            <strong class="\${c.text}">\${dPct}% (\${dPassed}/\${dTotal} TC)</strong>
          </div>
          <div class="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r \${c.bar} rounded-full transition-all duration-500" style="width: \${dPct}%"></div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Render Visual Interactive Timeline HTML
  const timelineHtml = `
    <div class="relative py-4">
      
      <!-- Desktop & Tablet Connected Line -->
      <div class="hidden md:block absolute top-[44px] left-[5%] right-[5%] h-1.5 bg-slate-200 rounded-full z-0">
        <div class="h-full bg-gradient-to-r from-emerald-500 via-blue-500 to-amber-500 rounded-full transition-all duration-700" 
             style="width: \${
               status === 'approved' ? '100%' :
               status === 'submitted_l4' ? '80%' :
               status === 'submitted_l3' ? '60%' :
               status === 'submitted_l2' ? '40%' :
               status === 'submitted_l1' ? '20%' : '15%'
             }">
        </div>
      </div>

      <!-- 5 Timeline Nodes Grid -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
        \${timelineSteps.map((st, sIdx) => {
          let nodeColor = 'bg-slate-200 text-slate-500 border-2 border-slate-300';
          let badgeColor = 'bg-slate-100 text-slate-600';
          let borderCard = 'border-slate-200 bg-white/90';

          if (st.state === 'completed') {
            nodeColor = 'bg-emerald-500 text-white border-2 border-emerald-300 ring-4 ring-emerald-100 shadow-sm';
            badgeColor = 'bg-emerald-100 text-emerald-800 font-bold';
            borderCard = 'border-emerald-200 bg-emerald-50/30';
          } else if (st.state === 'active') {
            nodeColor = 'bg-blue-600 text-white border-2 border-blue-300 ring-4 ring-blue-100 shadow-md animate-pulse';
            badgeColor = 'bg-blue-100 text-blue-900 font-black';
            borderCard = 'border-blue-400 bg-blue-50/50 shadow-sm ring-1 ring-blue-300';
          } else if (st.state === 'warning') {
            nodeColor = 'bg-rose-500 text-white border-2 border-rose-300 ring-4 ring-rose-100 shadow-md animate-bounce';
            badgeColor = 'bg-rose-100 text-rose-800 font-black';
            borderCard = 'border-rose-300 bg-rose-50/50';
          }

          return `
            <div class="flex flex-col items-center text-center">
              <!-- Node Icon -->
              <div class="w-12 h-12 rounded-2xl \${nodeColor} flex items-center justify-center font-black text-base transition-all duration-300 shrink-0">
                \${st.icon}
              </div>

              <!-- Node Card -->
              <div class="w-full mt-3 p-3.5 rounded-2xl border \${borderCard} text-xs transition-all space-y-1.5 flex flex-col justify-between flex-1">
                <div>
                  <div class="flex items-center justify-center">
                    <span class="px-2 py-0.5 rounded-full text-[10px] uppercase font-black \${badgeColor}">
                      Bước \${st.num}
                    </span>
                  </div>
                  <h4 class="font-black text-slate-900 text-xs sm:text-sm mt-1 leading-tight">\${st.title}</h4>
                  <p class="text-[11px] text-blue-900 font-semibold mt-0.5">\${st.actor}</p>
                  <p class="text-[10px] text-slate-500 italic mt-1 leading-relaxed">\${st.desc}</p>
                </div>
                <div class="pt-1.5 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
                  \${st.time}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;

  container.innerHTML = `
    <div class="space-y-5">
      
      <!-- Top Overview Header Card -->
      <div class="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div class="flex items-center gap-3.5">
            <img src="\${user.avatar || 'assets/avatar.png'}" alt="Avatar" class="w-16 h-16 rounded-2xl border-2 border-blue-200 object-cover shadow-2xs shrink-0">
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <h2 class="text-base sm:text-xl font-black text-slate-900">\${user.fullName}</h2>
                <span class="px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-900 font-bold text-xs">\${user.msnv}</span>
                <span class="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs">\${user.department}</span>
              </div>
              <div class="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                <span>\${meta.icon} \${meta.name} (\${meta.totalCriteria} Tiêu chí)</span>
                <span>·</span>
                <span>Năm sinh: \${user.birthYear || user.dob || '1990'}</span>
                <span>·</span>
                <span>Chức danh: <strong>\${user.roleName || user.role}</strong></span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3 flex-wrap">
            <div class="flex items-center gap-1.5 bg-slate-100 border border-slate-300 rounded-xl px-3 py-1.5 shadow-2xs">
              <span class="text-xs font-bold text-slate-700">📅 Năm:</span>
              <input type="number" min="2020" max="2035" value="\${currentYear}" onchange="changeAssessmentYear(this.value); renderStatusTab();" class="w-16 px-1.5 py-0.5 bg-white text-blue-950 font-black text-xs rounded-lg text-center focus:ring-2 focus:ring-blue-400 focus:outline-none cursor-pointer">
            </div>
            \${statusBadgeHtml}
          </div>
        </div>

        <!-- 5-Step Connected Visual Timeline -->
        <div class="mt-5 pt-2">
          <div class="text-xs font-black uppercase text-slate-700 mb-2 flex items-center justify-between">
            <span class="flex items-center gap-1.5">
              <span>⏳</span> TIẾN TRÌNH KÝ DUYỆT 5 BƯỚC NĂM \${currentYear}
            </span>
            <span class="text-slate-400 font-normal text-[11px]">Quy chuẩn thẩm định 4 cấp BV ĐHYD TP.HCM</span>
          </div>

          \${timelineHtml}
        </div>

        <!-- Next Step / Context Banner -->
        <div class="mt-4">
          \${statusDetailHtml}
        </div>
      </div>

      <!-- Grand Honor & Competency Certificate Connection Showcase -->
      \${grandHonorCardHtml}

      <!-- EXECUTIVE SCORE DASHBOARD (BẢNG DASHBOARD KẾT QUẢ ĐIỂM SỐ CHI TIẾT) -->
      <div class="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 class="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
              <span>📊</span> DASHBOARD PHÂN TÍCH ĐIỂM SỐ & NĂNG LỰC NGHỀ NGHIỆP
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">Tổng hợp kết quả tự đánh giá và thẩm định chuẩn hóa theo 5 Lĩnh vực Bệnh viện UMC</p>
          </div>
          <button type="button" onclick="switchTab('assessment')" class="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-xl text-xs font-bold border border-blue-200 flex items-center gap-1.5 transition-all self-start sm:self-center cursor-pointer">
            <span>📋</span> Bảng Điểm 66 Tiêu Chí →
          </button>
        </div>

        <!-- 4 Top KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <!-- KPI 1 -->
          <div class="p-4 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white shadow-sm space-y-2 flex flex-col justify-between">
            <div>
              <div class="text-[11px] font-bold text-blue-200 uppercase tracking-wide">Tổng Điểm Đạt Chuẩn</div>
              <div class="text-2xl sm:text-3xl font-black mt-1">\${sub.totalScore || 0} <span class="text-sm text-blue-200 font-normal">/ 1.000đ</span></div>
            </div>
            <div>
              <div class="flex justify-between text-[10px] text-blue-200 mb-1">
                <span>Tỷ lệ hoàn thành:</span>
                <strong>\${scorePct}%</strong>
              </div>
              <div class="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div class="h-full bg-white rounded-full transition-all duration-500" style="width: \${scorePct}%"></div>
              </div>
            </div>
          </div>

          <!-- KPI 2 -->
          <div class="p-4 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-sm space-y-2 flex flex-col justify-between">
            <div>
              <div class="text-[11px] font-bold text-emerald-200 uppercase tracking-wide">Bậc Năng Lực</div>
              <div class="text-xl sm:text-2xl font-black mt-1 line-clamp-1">\${tierObj.name}</div>
              <div class="text-xs text-emerald-100 font-medium line-clamp-1">\${tierObj.title}</div>
            </div>
            <div class="text-[11px] text-emerald-100 flex items-center gap-1">
              <span>★</span> Chuẩn Năng Lực Bộ Y Tế & UMC
            </div>
          </div>

          <!-- KPI 3 -->
          <div class="p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-sm space-y-2 flex flex-col justify-between">
            <div>
              <div class="text-[11px] font-bold text-amber-100 uppercase tracking-wide">Tiêu Chí Đã Đánh Giá</div>
              <div class="text-2xl sm:text-3xl font-black mt-1">\${scoredCritCount} <span class="text-sm text-amber-100 font-normal">/ \${totalCritCount} TC</span></div>
            </div>
            <div>
              <div class="flex justify-between text-[10px] text-amber-100 mb-1">
                <span>Tiến độ tiêu chí:</span>
                <strong>\${completionPct}%</strong>
              </div>
              <div class="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div class="h-full bg-white rounded-full transition-all duration-500" style="width: \${completionPct}%"></div>
              </div>
            </div>
          </div>

          <!-- KPI 4 -->
          <div class="p-4 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-sm space-y-2 flex flex-col justify-between">
            <div>
              <div class="text-[11px] font-bold text-purple-200 uppercase tracking-wide">Hồ Sơ Minh Chứng Đính Kèm</div>
              <div class="text-2xl sm:text-3xl font-black mt-1">\${evidenceCount} <span class="text-sm text-purple-200 font-normal">tệp tin</span></div>
            </div>
            <div class="text-[11px] text-purple-200 flex items-center justify-between">
              <span>Đồng bộ Portfolio:</span>
              <strong class="text-white">\${isLinkedToPortfolio ? 'Đã liên kết' : 'Sẵn sàng kết nối'}</strong>
            </div>
          </div>
        </div>

        <!-- 5 Domains Grid -->
        <div class="space-y-3 pt-2">
          <div class="text-xs font-black uppercase text-slate-700 flex items-center justify-between">
            <span class="flex items-center gap-1.5">
              <span>🏥</span> ĐIỂM SỐ CHI TIẾT THEO 5 LĨNH VỰC NĂNG LỰC
            </span>
            <span class="text-slate-400 font-normal text-[11px]">Thang điểm chuẩn 200 điểm/lĩnh vực</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            \${domainDashboardCards}
          </div>
        </div>

      </div>

    </div>
  `;
}`;

function applyUpdateToFile(filePath) {
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
    content = before + newRenderStatusTabCode + '\n\n' + after;
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated renderStatusTab successfully in: ' + filePath);
  } else {
    console.log('Could not find markers in: ' + filePath);
  }
}

applyUpdateToFile('app.js');
applyUpdateToFile('js/app.js');

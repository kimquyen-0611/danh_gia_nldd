const fs = require('fs');

console.log('--- CẬP NHẬT TRẠNG THÁI HỒ SƠ & TÍCH HỢP AI NHẬN XÉT ---');

const aiEngineAndStatusTabCode = `
// =========================================================================
// AI ENGINE: TỰ ĐỘNG TẠO NHẬN XÉT CHUYÊN MÔN & LỜI ĐỘNG VIÊN CÁ NHÂN HÓA
// Dựa trên: Họ tên, Chuyên khoa, Khoa phòng, Tổng điểm, Bậc năng lực
// =========================================================================

function generateAIEvaluationComments(user, sub, tierObj) {
  const name = (user && user.fullName) || 'Điều Dưỡng';
  const dept = (user && user.department) || 'Khoa Lâm Sàng';
  const spec = (user && user.specialty) || 'lamsang';
  const score = parseInt(sub.totalScore || sub.selfScore || 0);
  const tierName = (tierObj && tierObj.name) || 'BẬC 1';
  const tierTitle = (tierObj && tierObj.title) || 'Điều Dưỡng';

  // AI Logic theo mức điểm
  let perfLevel = 'excellent'; // > 850
  if (score < 600) perfLevel = 'developing';
  else if (score < 800) perfLevel = 'proficient';

  // 1. Nhận xét Cấp 1 (ĐD Trưởng Khoa - Kỹ năng lâm sàng, quy trình, ân cần người bệnh)
  const l1Pool = {
    excellent: [
      \`Đ/c \${name} có tay nghề chuyên môn xuất sắc, thực hiện chuẩn xác các quy trình kỹ thuật tại \${dept}. Tinh thần trách nhiệm cao, chăm sóc người bệnh chu đáo và luôn gương mẫu hướng dẫn đồng nghiệp trẻ.\`,
      \`Kỹ năng lâm sàng rất vững vàng, kiểm soát nhiễm khuẩn và an toàn người bệnh đạt điểm tối đa. Đ/c \${name} luôn chủ động xử trí tốt trong các ca bệnh nặng tại \${dept}.\`,
      \`Thực hiện nghiêm ngặt quy chế chuyên môn, giao tiếp ứng xử chuẩn mực và nhận được nhiều lời khen từ người bệnh. Đánh giá xuất sắc toàn diện các chỉ tiêu lâm sàng.\`
    ],
    proficient: [
      \`Đ/c \${name} nắm vững quy trình kỹ thuật chuyên môn tại \${dept}, chăm sóc người bệnh ân cần, hoàn thành tốt nhiệm vụ được giao trong năm 2026.\`,
      \`Thực hiện tốt các chỉ tiêu chuyên môn, tinh thần làm việc nhóm tích cực, phối hợp nhịp nhàng với ekip điều trị.\`
    ],
    developing: [
      \`Đ/c \${name} có nhiều nỗ lực trong công tác chuyên môn tại \${dept}. Cần tiếp tục rèn luyện kỹ năng xử trí tình huống lâm sàng nâng cao và cập nhật bảng kiểm quy trình.\`
    ]
  };

  const l1EncouragePool = [
    \`"Chúc \${name} luôn giữ vững ngọn lửa nhiệt huyết và tay nghề lâm sàng vững vàng!"\`,
    \`"Khoa luôn trân trọng sự tận tâm và cống hiến hết mình của bạn vì sức khỏe người bệnh!"\`,
    \`"Tiếp tục phát huy thế mạnh và lan tỏa năng lượng tích cực đến tập thể khoa!"\`
  ];

  // 2. Nhận xét Cấp 2 (Bác Sĩ Trưởng Khoa - Phối hợp điều trị, cấp cứu, an toàn người bệnh)
  const l2Pool = {
    excellent: [
      \`Đ/c \${name} phối hợp rất ăn ý và chuẩn xác cùng ekip Bác sĩ trong điều trị và cấp cứu. Phản xạ lâm sàng nhạy bén, theo dõi diễn tiến bệnh nhân sát sao, đảm bảo an toàn tuyệt đối.\`,
      \`Đánh giá cao năng lực lâm sàng và tinh thần trách nhiệm của \${name}. Khả năng nhận định sớm dấu hiệu cảnh báo nguy hiểm giúp hỗ trợ bác sĩ xử trí can thiệp kịp thời.\`,
      \`Tác phong chuyên nghiệp, phối hợp đa chuyên khoa hiệu quả, luôn là chỗ dựa tin cậy của ekip phẫu thuật và điều trị tại \${dept}.\`
    ],
    proficient: [
      \`Phối hợp tốt với bác sĩ điều trị trong các y lệnh hàng ngày. Theo dõi và chăm sóc người bệnh chu đáo, an toàn.\`,
      \`Tinh thần làm việc nghiêm túc, hợp tác chặt chẽ cùng các y bác sĩ trong công tác khám chữa bệnh tại khoa.\`
    ],
    developing: [
      \`Cần chủ động trao đổi thường xuyên hơn với bác sĩ điều trị về các dấu hiệu thay đổi sinh hiệu của người bệnh để xử trí nhanh hơn.\`
    ]
  };

  const l2EncouragePool = [
    \`"Khoa đánh giá rất cao sự cống hiến, chuẩn xác và chủ động của bạn!"\`,
    \`"Sự phối hợp chặt chẽ của bạn là yếu tố then chốt giúp các ca bệnh điều trị thành công!"\`,
    \`"Chúc bạn không ngừng vươn xa trên con đường phát triển chuyên môn y khoa!"\`
  ];

  // 3. Nhận xét Cấp 3 (Trưởng Ban Điều Dưỡng - Quy chuẩn toàn viện, CME, NCKH, đạo đức nghề nghiệp)
  const l3Pool = {
    excellent: [
      \`Hồ sơ minh chứng rõ ràng, đạt chuẩn xuất sắc theo Khung năng lực Điều dưỡng BV ĐHYD TP.HCM. Tích cực tham gia đào tạo liên tục CME và đề tài cải tiến chất lượng chăm sóc.\`,
      \`Đ/c \${name} đáp ứng vượt trội các tiêu chí chuyên môn toàn diện. Ban Điều Dưỡng đánh giá cao sự tiến bộ vượt bậc và tinh thần học tập suốt đời của nhân sự.\`,
      \`Đạt chuẩn \${tierName} (\${tierTitle}) với số điểm \${score}/1.000 điểm rất thuyết phục. Đủ năng lực đảm nhận vai trò hướng dẫn lâm sàng (Preceptor) cho các thế hệ kế thừa.\`
    ],
    proficient: [
      \`Minh chứng đầy đủ, tích lũy đủ số tiết CME quy định và tham gia tốt các hoạt động chuyên môn của Ban Điều Dưỡng toàn viện.\`,
      \`Hồ sơ đạt yêu cầu chuẩn hóa bậc năng lực theo quy định của Bệnh viện Đại học Y Dược TP.HCM.\`
    ],
    developing: [
      \`Đạt chuẩn năng lực cơ bản. Khuyến khích tham gia thêm các khóa đào tạo CME nâng cao và đề tài nghiên cứu cải tiến quy trình trong năm tới.\`
    ]
  };

  const l3EncouragePool = [
    \`"Ban Điều Dưỡng tự hào về bước tiến và sự trưởng thành vững chắc của bạn!"\`,
    \`"Bạn là tấm gương tiêu biểu về y đức và năng lực chuyên môn của người điều dưỡng UMC!"\`,
    \`"Hãy tiếp tục phấn đấu để trở thành chuyên gia đầu ngành trong lĩnh vực chăm sóc người bệnh!"\`
  ];

  // 4. Nhận xét Cấp 4 (Ban Giám Đốc - Chuẩn y quyết định, định hướng phát triển)
  const l4Pool = {
    excellent: [
      \`Chuẩn y ban hành Quyết định công nhận \${tierName} - \${tierTitle} cho Đ/c \${name}. Biểu dương thành tích xuất sắc và sự cống hiến hết lòng vì sự nghiệp chăm sóc sức khỏe nhân dân.\`,
      \`Ban Giám Đốc chúc mừng thành quả xứng đáng của Đ/c \${name}. Đề nghị các phòng ban căn cứ quyết định này để bố trí vị trí việc làm và chính sách đãi ngộ tương xứng.\`,
      \`Ghi nhận và đánh giá cao năng lực vượt trội của nhân sự. Bệnh viện tin tưởng bạn sẽ tiếp tục là hạt nhân nòng cốt phát triển chuyên môn tại \${dept}.\`
    ],
    proficient: [
      \`Chuẩn y công nhận \${tierName} cho Đ/c \${name}. Chúc bạn tiếp tục nỗ lực phát huy tay nghề, phục vụ người bệnh ngày càng tốt hơn.\`,
      \`Ban Giám Đốc biểu dương tinh thần làm việc nghiêm túc và trách nhiệm cao của nhân sự trong năm 2026.\`
    ],
    developing: [
      \`Ban Giám Đốc ghi nhận kết quả và khuyến khích nhân sự lập Kế hoạch Phát triển Nghề nghiệp (IDP) để bứt phá lên bậc năng lực cao hơn.\`
    ]
  };

  const l4EncouragePool = [
    \`"Bạn là niềm tự hào của Bệnh viện Đại học Y Dược TP.HCM!"\`,
    \`"Chúc bạn luôn giữ vững tâm sáng, y đức cao đẹp và nhiệt huyết cống hiến cho bệnh viện!"\`,
    \`"Bệnh viện luôn đồng hành và tạo mọi điều kiện tốt nhất cho sự phát triển của bạn!"\`
  ];

  // Chọn ngẫu nhiên có ngữ cảnh
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  return {
    l1Comment: pick(l1Pool[perfLevel] || l1Pool.proficient),
    l1Encourage: pick(l1EncouragePool),
    l2Comment: pick(l2Pool[perfLevel] || l2Pool.proficient),
    l2Encourage: pick(l2EncouragePool),
    l3Comment: pick(l3Pool[perfLevel] || l3Pool.proficient),
    l3Encourage: pick(l3EncouragePool),
    l4Comment: pick(l4Pool[perfLevel] || l4Pool.proficient),
    l4Encourage: pick(l4EncouragePool)
  };
}

// Hàm làm mới nhận xét AI
function refreshAIComments() {
  const user = APP_STATE.currentUser;
  if (!user) return;
  const currentYear = APP_STATE.selectedEvaluationYear || 2026;
  const sub = getUserSubmission(user.id, currentYear) || {};
  const tierObj = (typeof COMPETENCY_TIERS_MATRIX !== 'undefined' ? COMPETENCY_TIERS_MATRIX.find(t => t.tier === (sub.evaluatedTier || sub.approvedTier || user.level || 1)) : null);
  
  APP_STATE.cachedAIComments = generateAIEvaluationComments(user, sub, tierObj);
  showToast('✨ Đã dùng AI sinh mới bộ nhận xét & lời động viên cá nhân hóa!', 'success');
  if (typeof renderStatusTab === 'function') renderStatusTab();
}

// =========================================================================
// RENDER TAB TRẠNG THÁI HỒ SƠ CHUẨN XÁC:
// - CHỈ HIỂN THỊ BẢNG VINH DANH KHI ĐÃ CÓ QUYẾT ĐỊNH BAN GIÁM ĐỐC (approved)
// - NẾU CHƯA DUYỆT / ĐANG DUYỆT THÌ KHÔNG HIỂN THỊ KHUNG VINH DANH NÀY
// =========================================================================

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
  const isApproved = status === 'approved' && (sub.approvedAt || sub.decisionNo);
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

  // Lấy hoặc sinh nhận xét AI
  if (!APP_STATE.cachedAIComments) {
    APP_STATE.cachedAIComments = generateAIEvaluationComments(user, sub, tierObj);
  }
  const aiComments = APP_STATE.cachedAIComments;

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

  // Cấu hình Timeline 5 bước chuyên sâu
  const timelineSteps = [
    {
      num: 1,
      title: 'Bước 1: Nhân Viên Tự Đánh Giá',
      subtitle: 'Tự chấm 66 tiêu chí & nộp minh chứng',
      role: user.roleName || 'Điều Dưỡng Viên',
      actor: user.fullName,
      time: sub.submittedAt ? new Date(sub.submittedAt).toLocaleString('vi-VN') : (status === 'draft' ? 'Đang thực hiện' : 'Hoàn tất'),
      state: status === 'draft' ? 'active' : (status === 'returned' ? 'warning' : 'completed'),
      icon: status === 'draft' ? '✍️' : (status === 'returned' ? '↩️' : '✓'),
      desc: status === 'draft' ? 'Bản nháp đang mở để tự chấm điểm và tải tài liệu minh chứng.' : \`Đã hoàn thành tự chấm điểm: \${sub.selfScore || sub.totalScore || 0}/1.000 điểm.\`
    },
    {
      num: 2,
      title: 'Bước 2: Duyệt Cấp 1 (ĐD Trưởng)',
      subtitle: 'Thẩm định kỹ năng lâm sàng & quy trình',
      role: 'ĐD/KTV Trưởng Khoa',
      actor: sub.l1ApprovedBy || 'ĐD Trưởng Khoa',
      time: sub.l1ApprovedAt ? new Date(sub.l1ApprovedAt).toLocaleString('vi-VN') : (status === 'submitted_l1' ? 'Đang xử lý' : (['submitted_l2', 'submitted_l3', 'submitted_l4', 'approved'].includes(status) ? 'Đã duyệt' : 'Chờ nộp')),
      state: status === 'submitted_l1' ? 'active' : (['submitted_l2', 'submitted_l3', 'submitted_l4', 'approved'].includes(status) ? 'completed' : 'pending'),
      icon: status === 'submitted_l1' ? '⏳' : (['submitted_l2', 'submitted_l3', 'submitted_l4', 'approved'].includes(status) ? '✓' : '2'),
      desc: ['submitted_l2', 'submitted_l3', 'submitted_l4', 'approved'].includes(status) 
        ? \`Đã thẩm định chuyên môn Cấp 1: \${sub.l1Score || sub.selfScore || sub.totalScore || 0}đ.\`
        : (status === 'submitted_l1' ? 'ĐD Trưởng đang kiểm tra bảng điểm và hồ sơ minh chứng đính kèm.' : 'Chờ hoàn thành bước 1.')
    },
    {
      num: 3,
      title: 'Bước 3: Duyệt Cấp 2 (Bác Sĩ TK)',
      subtitle: 'Ký duyệt phối hợp điều trị & an toàn',
      role: 'BS Trưởng Khoa / Đơn Vị',
      actor: sub.l2ApprovedBy || 'Bác Sĩ Trưởng Khoa',
      time: sub.l2ApprovedAt ? new Date(sub.l2ApprovedAt).toLocaleString('vi-VN') : (status === 'submitted_l2' ? 'Đang xử lý' : (['submitted_l3', 'submitted_l4', 'approved'].includes(status) ? 'Đã duyệt' : 'Chờ chuyển')),
      state: status === 'submitted_l2' ? 'active' : (['submitted_l3', 'submitted_l4', 'approved'].includes(status) ? 'completed' : 'pending'),
      icon: status === 'submitted_l2' ? '🩺' : (['submitted_l3', 'submitted_l4', 'approved'].includes(status) ? '✓' : '3'),
      desc: ['submitted_l3', 'submitted_l4', 'approved'].includes(status) 
        ? \`Đã ký duyệt chuyên môn Cấp 2: \${sub.l2Score || sub.l1Score || sub.totalScore || 0}đ.\`
        : (status === 'submitted_l2' ? 'Bác Sĩ Trưởng Khoa đang xem xét, chuẩn y chuyển lên Ban Điều Dưỡng.' : 'Chờ hoàn thành bước 2.')
    },
    {
      num: 4,
      title: 'Bước 4: Thẩm Định Cấp 3 (Ban ĐD)',
      subtitle: 'Đối chiếu quy chuẩn năng lực toàn viện',
      role: 'Trưởng Ban Điều Dưỡng',
      actor: sub.l3ApprovedBy || 'Trưởng Ban Điều Dưỡng',
      time: sub.l3ApprovedAt ? new Date(sub.l3ApprovedAt).toLocaleString('vi-VN') : (status === 'submitted_l3' ? 'Đang thẩm định' : (['submitted_l4', 'approved'].includes(status) ? 'Đã thẩm định' : 'Chờ chuyển')),
      state: status === 'submitted_l3' ? 'active' : (['submitted_l4', 'approved'].includes(status) ? 'completed' : 'pending'),
      icon: status === 'submitted_l3' ? '📋' : (['submitted_l4', 'approved'].includes(status) ? '✓' : '4'),
      desc: ['submitted_l4', 'approved'].includes(status) 
        ? \`Đã hoàn tất thẩm định Cấp 3: \${sub.l3Score || sub.totalScore || 0}đ.\`
        : (status === 'submitted_l3' ? 'Ban Điều Dưỡng đang rà soát CME, NCKH và xếp bậc toàn viện.' : 'Chờ hoàn thành bước 3.')
    },
    {
      num: 5,
      title: 'Bước 5: Phê Duyệt & Vinh Danh',
      subtitle: 'Quyết định công nhận của Ban Giám Đốc',
      role: 'Ban Giám Đốc Bệnh Viện',
      actor: sub.l4ApprovedBy || 'PGS.TS.BS Hà Mạnh Tuấn',
      time: sub.approvedAt ? new Date(sub.approvedAt).toLocaleString('vi-VN') : (status === 'submitted_l4' ? 'Đang phê duyệt' : (isApproved ? 'Đã ban hành QĐ' : 'Chờ duyệt')),
      state: isApproved ? 'completed' : (status === 'submitted_l4' ? 'active' : 'pending'),
      icon: isApproved ? '👑' : '5',
      desc: isApproved 
        ? \`Quyết định \${sub.decisionNo || '089/QĐ-BVĐHYD-CS2/2026'} đã ban hành chính thức.\`
        : (status === 'submitted_l4' ? 'Ban Giám Đốc đang xem xét ban hành Quyết định công nhận Bậc năng lực.' : 'Chờ hoàn thành bước 4.')
    }
  ];

  let statusBadgeHtml = '';
  let statusDetailHtml = '';

  if (isApproved) {
    statusBadgeHtml = '<span class="px-3.5 py-1.5 bg-emerald-600 text-white font-black rounded-full text-xs flex items-center gap-1.5 shadow-sm"><span>🏆</span> ĐÃ PHÊ DUYỆT & CÔNG NHẬN CHÍNH THỨC</span>';
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
    \`;
  } else if (status === 'submitted_l1') {
    statusBadgeHtml = '<span class="px-3.5 py-1.5 bg-amber-500 text-white font-black rounded-full text-xs flex items-center gap-1.5 shadow-sm animate-pulse"><span>⏳</span> CHỜ DUYỆT CẤP 1 (ĐD/KTV TRƯỞNG)</span>';
    statusDetailHtml = \`
      <div class="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-950">
        <strong>Vị trí hồ sơ hiện tại:</strong> Hồ sơ đã được gửi thành công. Đang chờ <strong>Điều Dưỡng Trưởng / KTV Trưởng Khoa \${user.department}</strong> kiểm tra minh chứng, chấm điểm thẩm định Cấp 1 và chuyển tiếp lên Trưởng Khoa.
      </div>
    \`;
  } else if (status === 'submitted_l2') {
    statusBadgeHtml = '<span class="px-3.5 py-1.5 bg-sky-600 text-white font-black rounded-full text-xs flex items-center gap-1.5 shadow-sm animate-pulse"><span>🩺</span> CHỜ DUYỆT CẤP 2 (BÁC SĨ TRƯỞNG KHOA)</span>';
    statusDetailHtml = \`
      <div class="p-4 bg-sky-50 border border-sky-300 rounded-2xl text-xs text-sky-950">
        <strong>Vị trí hồ sơ hiện tại:</strong> ĐD Trưởng đã ký duyệt Cấp 1. Đang chờ <strong>Bác Sĩ Trưởng Khoa / Trưởng Đơn Vị</strong> xem xét, ký duyệt chuyên môn Cấp 2 và chuyển lên Ban Điều Dưỡng.
      </div>
    \`;
  } else if (status === 'submitted_l3') {
    statusBadgeHtml = '<span class="px-3.5 py-1.5 bg-indigo-600 text-white font-black rounded-full text-xs flex items-center gap-1.5 shadow-sm animate-pulse"><span>📋</span> CHỜ THẨM ĐỊNH CẤP 3 (BAN ĐIỀU DƯỠNG)</span>';
    statusDetailHtml = \`
      <div class="p-4 bg-indigo-50 border border-indigo-300 rounded-2xl text-xs text-indigo-950">
        <strong>Vị trí hồ sơ hiện tại:</strong> Trưởng Khoa đã ký duyệt Cấp 2. Đang chờ <strong>Trưởng Ban Điều Dưỡng Bệnh Viện</strong> thẩm định đối chiếu quy chuẩn toàn viện và trình Ban Giám Đốc.
      </div>
    \`;
  } else if (status === 'submitted_l4') {
    statusBadgeHtml = '<span class="px-3.5 py-1.5 bg-purple-600 text-white font-black rounded-full text-xs flex items-center gap-1.5 shadow-sm animate-pulse"><span>🏛️</span> CHỜ PHÊ DUYỆT CẤP 4 (BAN GIÁM ĐỐC)</span>';
    statusDetailHtml = \`
      <div class="p-4 bg-purple-50 border border-purple-300 rounded-2xl text-xs text-purple-950">
        <strong>Vị trí hồ sơ hiện tại:</strong> Ban Điều Dưỡng đã hoàn tất thẩm định Cấp 3. Đang chờ <strong>Ban Giám Đốc / Ban Lãnh Đạo Bệnh Viện</strong> ký duyệt chính thức và ban hành Quyết Định Công Nhận.
      </div>
    \`;
  } else if (status === 'returned') {
    statusBadgeHtml = '<span class="px-3.5 py-1.5 bg-rose-600 text-white font-black rounded-full text-xs flex items-center gap-1.5 shadow-sm"><span>↩️</span> YÊU CẦU BỔ SUNG MINH CHỨNG</span>';
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
    statusBadgeHtml = '<span class="px-3.5 py-1.5 bg-slate-200 text-slate-700 font-black rounded-full text-xs flex items-center gap-1.5"><span>✍️</span> ĐANG TỰ ĐÁNH GIÁ (BẢN NHÁP)</span>';
    statusDetailHtml = \`
      <div class="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl text-xs text-blue-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div class="font-bold text-slate-800">Hồ sơ đang ở trạng thái Tự Đánh Giá (Bản Nháp)</div>
          <div class="text-slate-600 mt-0.5">Vui lòng hoàn thành việc tự chấm điểm theo \${meta.totalCriteria} tiêu chí và nộp hồ sơ để bắt đầu luồng ký duyệt 4 cấp. Khi có Quyết định phê duyệt của Ban Giám Đốc, Bảng Vinh Danh và Chứng Nhận sẽ hiển thị tại đây.</div>
        </div>
        <button type="button" onclick="switchTab('assessment')" class="px-4 py-2 bg-[#004b87] hover:bg-blue-900 text-white font-bold rounded-xl text-xs shadow-xs transition-all shrink-0 cursor-pointer">
          📋 Đến Bảng Tự Chấm Điểm →
        </button>
      </div>
    \`;
  }

  // =========================================================================
  // KHUNG VINH DANH & Ý KIẾN 4 CẤP (CHỈ HIỂN THỊ KHI ĐÃ CÓ QUYẾT ĐỊNH BAN GIÁM ĐỐC)
  // =========================================================================
  let grandHonorCardHtml = '';
  
  if (isApproved) {
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

        <!-- 4 Cấp Ký Duyệt & Lời Động Viên Tích Hợp AI -->
        <div class="mt-8 pt-6 border-t border-amber-300/80">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h4 class="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-wide">
              <span>🤖</span> Ý KIẾN ĐÁNH GIÁ & LỜI ĐỘNG VIÊN TỪ 4 CẤP THẨM ĐỊNH (TÍCH HỢP AI)
            </h4>
            <div class="flex items-center gap-2">
              <button type="button" onclick="refreshAIComments()" class="px-2.5 py-1 bg-white hover:bg-amber-50 border border-amber-300 text-amber-900 rounded-lg text-[11px] font-bold shadow-2xs flex items-center gap-1 transition-all cursor-pointer">
                <span>✨</span> Sinh Lại Nhận Xét AI
              </button>
              <span class="text-[11px] text-amber-900 font-bold bg-amber-100 px-3 py-1 rounded-full">✓ 100% Hoàn Tất Ký Duyệt</span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
            <!-- Cấp 1 -->
            <div class="p-4 bg-white/95 rounded-2xl border border-amber-200 shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <div class="flex items-center justify-between">
                  <span class="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 font-black text-[10px] uppercase">Cấp 1 · ĐD Trưởng Khoa</span>
                  <span class="text-emerald-700 font-bold text-[10px] flex items-center gap-0.5"><span>✓</span> Đã ký</span>
                </div>
                <div class="font-black text-slate-900 mt-2 text-sm">\${sub.l1ApprovedBy || 'ĐD Trưởng Khoa'}</div>
                <div class="text-[11px] text-slate-500">Khoa \${user.department}</div>
                <p class="text-slate-700 italic text-[11px] mt-2.5 p-2.5 bg-amber-50/50 rounded-xl border border-amber-100 leading-relaxed">
                  "\${aiComments.l1Comment}"
                </p>
              </div>
              <div class="pt-2 border-t border-slate-100 text-[11px] text-amber-900 font-bold flex items-start gap-1">
                <span class="shrink-0 mt-0.5">🌟</span> <em>\${aiComments.l1Encourage}</em>
              </div>
            </div>

            <!-- Cấp 2 -->
            <div class="p-4 bg-white/95 rounded-2xl border border-amber-200 shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <div class="flex items-center justify-between">
                  <span class="px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 font-black text-[10px] uppercase">Cấp 2 · Bác Sĩ Trưởng Khoa</span>
                  <span class="text-emerald-700 font-bold text-[10px] flex items-center gap-0.5"><span>✓</span> Đã ký</span>
                </div>
                <div class="font-black text-slate-900 mt-2 text-sm">\${sub.l2ApprovedBy || 'Bác Sĩ Trưởng Khoa'}</div>
                <div class="text-[11px] text-slate-500">Trưởng Khoa \${user.department}</div>
                <p class="text-slate-700 italic text-[11px] mt-2.5 p-2.5 bg-sky-50/50 rounded-xl border border-sky-100 leading-relaxed">
                  "\${aiComments.l2Comment}"
                </p>
              </div>
              <div class="pt-2 border-t border-slate-100 text-[11px] text-sky-900 font-bold flex items-start gap-1">
                <span class="shrink-0 mt-0.5">🌟</span> <em>\${aiComments.l2Encourage}</em>
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
                <p class="text-slate-700 italic text-[11px] mt-2.5 p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-100 leading-relaxed">
                  "\${aiComments.l3Comment}"
                </p>
              </div>
              <div class="pt-2 border-t border-slate-100 text-[11px] text-indigo-900 font-bold flex items-start gap-1">
                <span class="shrink-0 mt-0.5">🌟</span> <em>\${aiComments.l3Encourage}</em>
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
                <p class="text-purple-950 font-medium italic text-[11px] mt-2.5 p-2.5 bg-purple-100/50 rounded-xl border border-purple-200 leading-relaxed">
                  "\${aiComments.l4Comment}"
                </p>
              </div>
              <div class="pt-2 border-t border-purple-200 text-[11px] text-purple-900 font-black flex items-start gap-1">
                <span class="shrink-0 mt-0.5">🎉</span> <em>\${aiComments.l4Encourage}</em>
              </div>
            </div>
          </div>
        </div>

      </div>
    \`;
  }

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

    return \`
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
    \`;
  }).join('');

  // Render Visual Interactive Timeline HTML
  const timelineHtml = \`
    <div class="relative py-4">
      
      <!-- Desktop & Tablet Connected Line -->
      <div class="hidden md:block absolute top-[44px] left-[5%] right-[5%] h-1.5 bg-slate-200 rounded-full z-0">
        <div class="h-full bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-500 rounded-full transition-all duration-700" 
             style="width: \${
               isApproved ? '100%' :
               status === 'submitted_l4' ? '80%' :
               status === 'submitted_l3' ? '60%' :
               status === 'submitted_l2' ? '40%' :
               status === 'submitted_l1' ? '20%' : '10%'
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

          return \`
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
          \`;
        }).join('')}
      </div>

    </div>
  \`;

  container.innerHTML = \`
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

      <!-- Grand Honor Showcase (CHỈ HIỂN THỊ KHI ĐÃ CÓ QUYẾT ĐỊNH BAN GIÁM ĐỐC) -->
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
              <div class="text-[11px] font-bold text-emerald-200 uppercase tracking-wide">Bậc Năng Lực \${isApproved ? 'Đã Công Nhận' : 'Dự Kiến'}</div>
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
              <strong class="text-white">\${isLinkedToPortfolio ? 'Đã liên kết' : (isApproved ? 'Sẵn sàng kết nối' : 'Chờ phê duyệt')}</strong>
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
  \`;
}
`;

function updateAppFiles(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  const startMarker = 'function renderStatusTab() {';
  const endMarker = 'function viewOfficialDecision(userId) {';

  const startIdx = content.indexOf(startMarker);
  const endIdx = content.indexOf(endMarker);

  if (startIdx !== -1 && endIdx !== -1) {
    const before = content.substring(0, startIdx);
    const after = content.substring(endIdx);
    content = before + aiEngineAndStatusTabCode.trim() + '\n\n' + after;
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ Đã cập nhật AI Engine & Logic ẩn Vinh danh khi chưa duyệt trong: ' + filePath);
  } else {
    console.log('Không tìm thấy markers trong: ' + filePath);
  }
}

updateAppFiles('app.js');
updateAppFiles('js/app.js');
`;

fs.writeFileSync('update_status_ai.js', aiEngineAndStatusTabCode, 'utf8');

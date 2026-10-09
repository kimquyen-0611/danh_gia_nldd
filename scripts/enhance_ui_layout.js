const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'app.js');
let app = fs.readFileSync(appPath, 'utf8');

console.log('Original app.js size:', app.length);

// 1. Hook updateFloatingAssessmentDock into calculateAndUpdateAssessmentSummary
const hookDockCode = `
  const spec = APP_STATE.selectedSpecialty || (currUser ? currUser.specialty : 'lamsang');
  const doms = DOMAINS_BY_SPECIALTY[spec] || [];
  if (typeof updateFloatingAssessmentDock === 'function') {
    updateFloatingAssessmentDock(sub, doms);
  }
`;

if (!app.includes('updateFloatingAssessmentDock(sub, doms)')) {
  app = app.replace(
    /if \(currUser && typeof renderAssessmentSubmissionSection === 'function'\) \{[\s\S]*?renderAssessmentSubmissionSection\(currUser, sub, doms\);[\s\S]*?\}/,
    `if (currUser && typeof renderAssessmentSubmissionSection === 'function') {
    const spec = APP_STATE.selectedSpecialty || currUser.specialty || 'lamsang';
    const doms = DOMAINS_BY_SPECIALTY[spec] || [];
    renderAssessmentSubmissionSection(currUser, sub, doms);
  }
  ${hookDockCode}`
  );
}

// 2. Thêm hàm updateFloatingAssessmentDock, quickJumpToDomain, scrollToNextUnscoredCriterion vào app.js
const floatingDockFunctions = `
// =========================================================================
// STICKY FLOATING ASSESSMENT ASSISTANT (THANH TIẾN ĐỘ & ĐIỀU HƯỚNG NỔI)
// =========================================================================
function updateFloatingAssessmentDock(sub, domains) {
  const dock = document.getElementById('assessment-floating-assistant-dock');
  if (!dock) return;

  const currentTab = APP_STATE.activeTab || 'assessment';
  if (currentTab !== 'assessment') {
    dock.classList.add('hidden');
    return;
  }

  let totalCrit = 0;
  let scoredCrit = 0;
  const domainStats = [];

  domains.forEach((d, idx) => {
    let dTotal = 0;
    let dScored = 0;
    (d.standards || []).forEach(s => {
      (s.criteria || []).forEach(c => {
        dTotal++;
        totalCrit++;
        if ((APP_STATE.currentAssessmentScores[c.id] || 0) > 0) {
          dScored++;
          scoredCrit++;
        }
      });
    });
    domainStats.push({
      id: d.id,
      code: d.code || ('LV ' + (idx + 1)),
      name: d.name,
      dTotal: dTotal,
      dScored: dScored,
      isComplete: dTotal > 0 && dScored === dTotal,
      score: (sub && sub.domainScores) ? (sub.domainScores[d.id] || 0) : 0,
      max: d.maxPoints || 200
    });
  });

  const completionPct = totalCrit > 0 ? Math.round((scoredCrit / totalCrit) * 100) : 0;
  const totalScore = (sub && sub.totalScore) ? sub.totalScore : 0;
  const evaluatedTier = (sub && sub.evaluatedTier) ? sub.evaluatedTier : 1;
  const tierObj = (typeof COMPETENCY_TIERS_MATRIX !== 'undefined' && COMPETENCY_TIERS_MATRIX.find(t => t.tier === evaluatedTier)) || { code: 'BẬC 1', name: 'Tập Sự' };
  const isLocked = sub && ['submitted_l1', 'submitted_l2', 'submitted_l3', 'approved'].includes(sub.status);

  dock.classList.remove('hidden');
  dock.innerHTML = '<div class="flex flex-col md:flex-row items-center justify-between gap-3 text-xs">' +
    '<!-- Cột Trái: Tiến Độ Hoàn Thành & Điểm Số Tạm Tính -->' +
    '<div class="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">' +
      '<div class="flex items-center gap-2">' +
        '<div class="w-9 h-9 rounded-xl bg-blue-700 text-white flex items-center justify-center font-black shadow-xs shrink-0">' +
          '<span>' + completionPct + '%</span>' +
        '</div>' +
        '<div>' +
          '<div class="flex items-center gap-1.5">' +
            '<span class="font-extrabold text-slate-800">Tiến độ:</span>' +
            '<span class="font-bold ' + (scoredCrit === totalCrit ? 'text-emerald-700' : 'text-blue-800') + '">' + scoredCrit + '/' + totalCrit + ' TC</span>' +
            '<span class="text-[10px] text-slate-400">(' + (totalCrit - scoredCrit) + ' chưa chấm)</span>' +
          '</div>' +
          '<div class="w-32 bg-slate-200 h-1.5 rounded-full overflow-hidden mt-0.5">' +
            '<div class="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-300" style="width: ' + completionPct + '%"></div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div class="h-7 w-px bg-slate-200 hidden sm:block"></div>' +

      '<div class="flex items-center gap-2">' +
        '<div>' +
          '<div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tổng Điểm Tự Chấm</div>' +
          '<div class="text-sm font-black text-[#004b87] flex items-center gap-1">' +
            '<span>' + totalScore + '</span><span class="text-[10px] font-normal text-slate-500">/ 1.000đ</span>' +
            '<span class="level-badge level-' + evaluatedTier + ' text-[10px] py-0.5 px-2 ml-1">' + tierObj.code + '</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +

    '<!-- Cột Giữa: Nút Nhảy Nhanh 5 Lĩnh Vực (Quick Jump Stepper) -->' +
    '<div class="flex items-center gap-1 overflow-x-auto max-w-full py-0.5 scrollbar-none">' +
      '<span class="text-[11px] font-bold text-slate-400 mr-0.5 hidden xl:inline">Nhảy nhanh:</span>' +
      domainStats.map((d, i) => {
        const active = (APP_STATE.activeAssessmentDomain === d.id);
        return '<button type="button" onclick="quickJumpToDomain(\\'' + d.id + '\\')" class="floating-domain-btn px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 whitespace-nowrap ' +
          (active ? 'bg-blue-800 text-white shadow-xs font-black' : (d.isComplete ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100' : 'bg-slate-100 hover:bg-slate-200 text-slate-700')) +
          '" title="' + d.name + ' (' + d.dScored + '/' + d.dTotal + ' TC - ' + d.score + '/' + d.max + 'đ)">' +
          '<span>' + (d.isComplete ? '✓ ' : '') + 'LV' + (i + 1) + '</span>' +
          '<span class="text-[9px] opacity-80">(' + d.dScored + '/' + d.dTotal + ')</span>' +
        '</button>';
      }).join('') +
    '</div>' +

    '<!-- Cột Phải: Nút Thao Tác Nhanh -->' +
    '<div class="flex items-center gap-2 w-full md:w-auto justify-end">' +
      (!isLocked && scoredCrit < totalCrit ? 
        '<button type="button" onclick="scrollToNextUnscoredCriterion()" class="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95">' +
          '<span>⚡ Chấm Tiếp</span>' +
        '</button>' : '') +

      (!isLocked && scoredCrit === totalCrit ? 
        '<button type="button" onclick="document.getElementById(\\'assessment-submission-footer-card\\').scrollIntoView({ behavior: \\'smooth\\' })" class="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-black shadow-xs flex items-center gap-1 animate-pulse cursor-pointer">' +
          '<span>🚀 Nộp Hồ Sơ</span>' +
        '</button>' : '') +

      '<button type="button" onclick="window.scrollTo({ top: 0, behavior: \\'smooth\\' })" class="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs cursor-pointer" title="Cuộn lên đầu trang">' +
        '<span>⬆️</span>' +
      '</button>' +
    '</div>' +
  '</div>';
}

function quickJumpToDomain(domainId) {
  APP_STATE.activeAssessmentDomain = domainId;
  renderAssessmentTab();
  const el = document.getElementById('domain-accordion-' + domainId) || document.getElementById('assessment-domains-container');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function scrollToNextUnscoredCriterion() {
  const user = APP_STATE.currentUser;
  if (!user) return;
  const specialty = APP_STATE.selectedSpecialty || user.specialty || 'lamsang';
  const domains = (typeof DOMAINS_BY_SPECIALTY !== 'undefined' && DOMAINS_BY_SPECIALTY[specialty]) || [];
  
  let targetCritId = null;
  let targetDomainId = null;
  for (const d of domains) {
    for (const s of (d.standards || [])) {
      for (const c of (s.criteria || [])) {
        if (!APP_STATE.currentAssessmentScores[c.id]) {
          targetCritId = c.id;
          targetDomainId = d.id;
          break;
        }
      }
      if (targetCritId) break;
    }
    if (targetCritId) break;
  }

  if (targetCritId) {
    if (APP_STATE.activeAssessmentDomain !== 'all' && APP_STATE.activeAssessmentDomain !== targetDomainId) {
      APP_STATE.activeAssessmentDomain = 'all';
      renderAssessmentTab();
    }
    setTimeout(() => {
      const critRow = document.getElementById('crit-row-' + targetCritId) || document.getElementById('crit-card-' + targetCritId);
      if (critRow) {
        critRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
        critRow.classList.add('ring-2', 'ring-amber-400');
        setTimeout(() => critRow.classList.remove('ring-2', 'ring-amber-400'), 2500);
      }
    }, 100);
  } else {
    showToast('Bạn đã hoàn tất tự chấm điểm cho toàn bộ các tiêu chí!', 'success');
  }
}
`;

if (!app.includes('function updateFloatingAssessmentDock')) {
  app += '\n' + floatingDockFunctions;
}

fs.writeFileSync(appPath, app, 'utf8');
console.log('Updated app.js size:', app.length);

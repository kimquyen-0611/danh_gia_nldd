const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'app.js');
let app = fs.readFileSync(appPath, 'utf8');

const cardRenderSnippet = `
  const viewMode = APP_STATE.staffRankingViewMode || 'table';

  // Update button active states
  const btnTable = document.getElementById('btn-staff-view-table');
  const btnCard = document.getElementById('btn-staff-view-card');
  if (btnTable && btnCard) {
    if (viewMode === 'table') {
      btnTable.className = 'px-2.5 py-1 rounded-lg font-bold transition-all bg-blue-700 text-white shadow-2xs flex items-center gap-1 cursor-pointer';
      btnCard.className = 'px-2.5 py-1 rounded-lg font-bold transition-all text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer';
    } else {
      btnCard.className = 'px-2.5 py-1 rounded-lg font-bold transition-all bg-blue-700 text-white shadow-2xs flex items-center gap-1 cursor-pointer';
      btnTable.className = 'px-2.5 py-1 rounded-lg font-bold transition-all text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer';
    }
  }

  if (viewMode === 'card') {
    container.innerHTML = '<div class="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">' +
      rankedUsers.map((item, idx) => {
        const u = item.user;
        const tier = item.evaluatedTier;
        let tierBadgeColor = 'bg-slate-100 text-slate-800 border-slate-300';
        if (tier === 2) tierBadgeColor = 'bg-sky-100 text-sky-900 border-sky-300 font-bold';
        else if (tier === 3) tierBadgeColor = 'bg-amber-100 text-amber-950 border-amber-400 font-black shadow-2xs';
        else if (tier === 4) tierBadgeColor = 'bg-emerald-100 text-emerald-950 border-emerald-400 font-black shadow-2xs';
        else if (tier >= 5) tierBadgeColor = 'bg-purple-100 text-purple-950 border-purple-400 font-black shadow-2xs';

        let rankBadge = '<span class="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-black text-xs inline-flex items-center justify-center border border-slate-200">#' + (idx + 1) + '</span>';
        if (idx === 0 && item.totalScore > 0) rankBadge = '<span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-black text-xs border border-amber-300 shadow-2xs">🥇 TOP 1</span>';
        else if (idx === 1 && item.totalScore > 0) rankBadge = '<span class="px-2 py-0.5 rounded-full bg-slate-200 text-slate-900 font-black text-xs border border-slate-300 shadow-2xs">🥈 TOP 2</span>';
        else if (idx === 2 && item.totalScore > 0) rankBadge = '<span class="px-2 py-0.5 rounded-full bg-orange-100 text-orange-900 font-black text-xs border border-orange-300 shadow-2xs">🥉 TOP 3</span>';

        return '<div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3.5 hover:border-blue-300">' +
          '<div>' +
            '<div class="flex items-start justify-between gap-2">' +
              '<div class="flex items-center gap-3">' +
                '<div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white font-black text-sm flex items-center justify-center border-2 border-white shadow-sm shrink-0 overflow-hidden">' +
                  (u.avatar ? ('<img src="' + u.avatar + '" class="w-full h-full object-cover" alt="' + u.fullName + '">') : (u.fullName || '').charAt(0)) +
                '</div>' +
                '<div>' +
                  '<h4 class="font-black text-slate-900 text-sm hover:text-blue-700 cursor-pointer flex items-center gap-1" onclick="openStaffCriteriaDetailModal(\\'' + u.id + '\\')">' +
                    u.fullName +
                  '</h4>' +
                  '<div class="text-[11px] text-slate-500 font-mono mt-0.5">' +
                    '<span class="px-1.5 py-0.5 rounded bg-slate-100 font-bold text-slate-700">' + (u.msnv || '--') + '</span> · ' + (u.roleName || 'Điều Dưỡng Viên') +
                  '</div>' +
                '</div>' +
              '</div>' +
              '<div>' + rankBadge + '</div>' +
            '</div>' +

            '<div class="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">' +
              '<div class="text-slate-600 font-medium">' + (u.department || 'Bệnh viện UMC CS2') + '</div>' +
              '<span class="px-2.5 py-1 rounded-xl text-xs font-black border ' + tierBadgeColor + '">' + item.tierObj.name + '</span>' +
            '</div>' +

            '<div class="mt-3 p-3 bg-slate-50 rounded-xl space-y-1.5">' +
              '<div class="flex items-center justify-between text-xs">' +
                '<span class="font-extrabold text-slate-700">Tổng điểm năng lực:</span>' +
                '<span class="font-black text-sm ' + (item.totalScore >= 800 ? 'text-blue-900' : 'text-slate-800') + '">' + item.totalScore + ' <span class="text-[10px] font-normal text-slate-500">/ 1.000đ</span></span>' +
              '</div>' +
              '<div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">' +
                '<div class="h-full bg-gradient-to-r from-blue-600 to-emerald-500" style="width: ' + Math.min(100, Math.round((item.totalScore / 1000) * 100)) + '%"></div>' +
              '</div>' +
              '<div class="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">' +
                '<span>Đạt ' + item.completionRate + '% (' + item.passedCriteriaCount + '/' + totalCriteriaCount + ' TC)</span>' +
                '<span class="font-bold text-blue-700">' + item.statusLabel + '</span>' +
              '</div>' +
            '</div>' +

            '<div class="mt-2.5 grid grid-cols-5 gap-1 text-center text-[10px]">' +
              '<div class="p-1 rounded bg-blue-50/70 border border-blue-200"><div class="font-bold text-blue-900">LV1</div><div class="font-black">' + item.dScores.d1 + 'đ</div></div>' +
              '<div class="p-1 rounded bg-emerald-50/70 border border-emerald-200"><div class="font-bold text-emerald-900">LV2</div><div class="font-black">' + item.dScores.d2 + 'đ</div></div>' +
              '<div class="p-1 rounded bg-amber-50/70 border border-amber-200"><div class="font-bold text-amber-900">LV3</div><div class="font-black">' + item.dScores.d3 + 'đ</div></div>' +
              '<div class="p-1 rounded bg-indigo-50/70 border border-indigo-200"><div class="font-bold text-indigo-900">LV4</div><div class="font-black">' + item.dScores.d4 + 'đ</div></div>' +
              '<div class="p-1 rounded bg-purple-50/70 border border-purple-200"><div class="font-bold text-purple-900">LV5</div><div class="font-black">' + item.dScores.d5 + 'đ</div></div>' +
            '</div>' +
          '</div>' +

          '<div class="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">' +
            '<button type="button" onclick="openStaffCriteriaDetailModal(\\'' + u.id + '\\')" class="flex-1 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-xl text-xs font-bold transition-all text-center">' +
              '📋 Xem Chi Tiết' +
            '</button>' +
            '<button type="button" onclick="openCertificateModal(\\'' + u.id + '\\')" class="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold border border-amber-200" title="Xem Giấy Công Nhận">' +
              '🎖️' +
            '</button>' +
          '</div>' +
        '</div>';
      }).join('') +
    '</div>';
    return;
  }
`;

if (!app.includes('APP_STATE.staffRankingViewMode || \'table\'')) {
  app = app.replace(
    '// Sắp xếp theo tổng điểm giảm dần\n  rankedUsers.sort((a, b) => b.totalScore - a.totalScore);',
    '// Sắp xếp theo tổng điểm giảm dần\n  rankedUsers.sort((a, b) => b.totalScore - a.totalScore);\n' + cardRenderSnippet
  );
}

fs.writeFileSync(appPath, app, 'utf8');
console.log('app.js patched with Staff Card Grid View!');

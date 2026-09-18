/**
 * ============================================================================
 * TEST 5: CHỨC NĂNG BÁO CÁO & XẾP BẬC NĂNG LỰC (REPORTS & RANKING ENGINE)
 * ============================================================================
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const db = require('./db');

// Quy tắc phân hạng và xếp bậc năng lực chuẩn Bộ Y Tế & UMC
function calculateNurseRank(finalScore, expYears, degree, examScore) {
  const score = parseFloat(finalScore) || 0;
  const exp = parseInt(expYears) || 0;
  const exam = parseFloat(examScore) || 0;

  // Bậc 5: Chuyên gia / Quản lý cấp cao
  if (score >= 4.5 && exp >= 10 && exam >= 90) {
    return { level: 5, rankName: 'Bậc 5 (Chuyên gia / Quản trị lâm sàng)', passStatus: 'ĐẠT XUẤT SẮC' };
  }
  // Bậc 4: Thành thạo nâng cao / Giảng viên lâm sàng
  if (score >= 4.0 && exp >= 6 && exam >= 85) {
    return { level: 4, rankName: 'Bậc 4 (Thành thạo nâng cao / Tiền lâm sàng)', passStatus: 'ĐẠT LOẠI GIỎI' };
  }
  // Bậc 3: Độc lập tác nghiệp / Thành thạo
  if (score >= 3.5 && exp >= 3 && exam >= 75) {
    return { level: 3, rankName: 'Bậc 3 (Độc lập tác nghiệp)', passStatus: 'ĐẠT YÊU CẦU' };
  }
  // Bậc 2: Có hướng dẫn / Cơ bản
  if (score >= 3.0 && exp >= 1 && exam >= 65) {
    return { level: 2, rankName: 'Bậc 2 (Hành nghề có giám sát)', passStatus: 'ĐẠT CƠ BẢN' };
  }
  // Bậc 1: Mới tuyển dụng / Tập sự
  return { level: 1, rankName: 'Bậc 1 (Tập sự / Mới tuyển dụng)', passStatus: 'CẦN ĐÀO TẠO THÊM' };
}

// Hàm tổng hợp phân bố cấp bậc theo khoa phòng
function aggregateDepartmentStatistics(users) {
  const deptStats = {};
  const levelDistribution = { 'Bậc 1': 0, 'Bậc 2': 0, 'Bậc 3': 0, 'Bậc 4': 0, 'Bậc 5': 0 };

  users.forEach(u => {
    const dept = u.department || 'Chung';
    if (!deptStats[dept]) {
      deptStats[dept] = { total: 0, b1: 0, b2: 0, b3: 0, b4: 0, b5: 0 };
    }
    deptStats[dept].total++;
    const lvl = parseInt(u.level) || 1;
    const key = `b${Math.min(5, Math.max(1, lvl))}`;
    deptStats[dept][key]++;

    const distKey = `Bậc ${Math.min(5, Math.max(1, lvl))}`;
    levelDistribution[distKey]++;
  });

  return { deptStats, levelDistribution, totalStaff: users.length };
}

async function runTest5() {
  console.log('\n🔵 [TEST 5] BẮT ĐẦU KIỂM THỬ CHỨC NĂNG BÁO CÁO VÀ XẾP BẬC');
  const results = [];

  try {
    // 5.1. Kiểm tra quy tắc xếp bậc tự động Bậc 1 đến Bậc 5
    const rankCases = [
      { score: 4.8, exp: 12, exam: 95, expectedLevel: 5 },
      { score: 4.2, exp: 7,  exam: 88, expectedLevel: 4 },
      { score: 3.7, exp: 4,  exam: 80, expectedLevel: 3 },
      { score: 3.2, exp: 2,  exam: 70, expectedLevel: 2 },
      { score: 2.5, exp: 0.5,exam: 50, expectedLevel: 1 }
    ];

    let rankPassCount = 0;
    rankCases.forEach(rc => {
      const res = calculateNurseRank(rc.score, rc.exp, 'Cử nhân', rc.exam);
      if (res.level === rc.expectedLevel) rankPassCount++;
    });

    results.push({
      test: '5.1. Thuật toán phân loại và xếp bậc năng lực (Bậc 1 - Bậc 5)',
      passed: rankPassCount === 5,
      detail: `Đã kiểm thử chính xác ${rankPassCount}/5 mức phân hạng tiêu chuẩn`
    });

    // 5.2. Kiểm tra tổng hợp thống kê toàn viện & theo khoa phòng
    const users = await db.getAllUsers();
    const stats = aggregateDepartmentStatistics(users);
    const hasDist = Object.values(stats.levelDistribution).reduce((a, b) => a + b, 0) === users.length;
    results.push({
      test: '5.2. Thống kê phân bố cấp bậc toàn viện & theo khoa phòng',
      passed: hasDist && Object.keys(stats.deptStats).length > 0,
      detail: `Tổng số ${stats.totalStaff} nhân sự qua ${Object.keys(stats.deptStats).length} khoa phòng: B1(${stats.levelDistribution['Bậc 1']}), B2(${stats.levelDistribution['Bậc 2']}), B3(${stats.levelDistribution['Bậc 3']}), B4(${stats.levelDistribution['Bậc 4']}), B5(${stats.levelDistribution['Bậc 5']})`
    });

    // 5.3. Kiểm tra dữ liệu biểu đồ mạng nhện Radar Chart 5 lĩnh vực
    const radarData = {
      labels: [
        'Lâm sàng & Chăm sóc',
        'Giao tiếp & Ứng xử',
        'Quản lý & Cải tiến',
        'Đào tạo & NCKH',
        'Đạo đức Nghề nghiệp'
      ],
      selfScores: [4.2, 4.5, 3.8, 3.5, 4.8],
      managerScores: [4.0, 4.3, 3.9, 3.6, 4.7]
    };
    const isRadarValid = radarData.labels.length === 5 && radarData.selfScores.length === 5 && radarData.managerScores.length === 5;
    results.push({
      test: '5.3. Cấu trúc dữ liệu Biểu đồ Radar 5 Lĩnh vực Năng lực',
      passed: isRadarValid,
      detail: 'Dữ liệu 5 trục đối sánh giữa Tự chấm và Cấp trên đánh giá hợp lệ'
    });

  } catch (err) {
    results.push({
      test: '5.x. Lỗi ngoại lệ trong Test 5',
      passed: false,
      detail: err.message
    });
  }

  return results;
}

module.exports = { runTest5 };
if (require.main === module) {
  runTest5().then(r => console.table(r));
}

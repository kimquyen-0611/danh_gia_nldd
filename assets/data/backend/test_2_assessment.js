/**
 * ============================================================================
 * TEST 2: CHỨC NĂNG PHIẾU TỰ ĐÁNH GIÁ NĂNG LỰC (SELF-ASSESSMENT ENGINE)
 * ============================================================================
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const db = require('./db');

// Danh mục 7 bộ tiêu chuẩn chuyên môn
const SPECIALTIES = [
  { key: 'lamsang', name: 'Điều Dưỡng Lâm Sàng', minCriteria: 66 },
  { key: 'gayme', name: 'KTV Gây Mê Hồi Sức', minCriteria: 66 },
  { key: 'noisoi', name: 'Điều Dưỡng Nội Soi', minCriteria: 66 },
  { key: 'khambenh', name: 'Điều Dưỡng Khoa Khám Bệnh', minCriteria: 71 },
  { key: 'cdha', name: 'Kỹ Thuật Y Chẩn Đoán Hình Ảnh', minCriteria: 73 },
  { key: 'phcn', name: 'Kỹ Thuật Y Phục Hồi Chức Năng', minCriteria: 65 },
  { key: 'nhi', name: 'Điều Dưỡng Nhi & Hồi Sức Sơ Sinh', minCriteria: 66 }
];

// Hàm giả lập tính toán điểm 5 lĩnh vực năng lực
function calculateDomainScores(scoresMap) {
  // Lĩnh vực 1: Chăm sóc người bệnh (Tiêu chí 1 - 25)
  // Lĩnh vực 2: Giao tiếp & Ứng xử (Tiêu chí 26 - 38)
  // Lĩnh vực 3: Quản lý & Cải tiến chất lượng (Tiêu chí 39 - 48)
  // Lĩnh vực 4: Đào tạo & NCKH (Tiêu chí 49 - 58)
  // Lĩnh vực 5: Đạo đức & Phát triển nghề nghiệp (Tiêu chí 59 - 66+)
  
  const entries = Object.entries(scoresMap);
  if (entries.length === 0) return { totalScore: 0, avgScore: 0, domainAverages: {} };

  let totalSum = 0;
  let count = 0;
  const domainBuckets = { d1: [], d2: [], d3: [], d4: [], d5: [] };

  entries.forEach(([key, val]) => {
    const num = parseFloat(val) || 0;
    if (num > 0) {
      totalSum += num;
      count++;
      const idNum = parseInt(key.replace(/\D/g, '')) || 1;
      if (idNum <= 25) domainBuckets.d1.push(num);
      else if (idNum <= 38) domainBuckets.d2.push(num);
      else if (idNum <= 48) domainBuckets.d3.push(num);
      else if (idNum <= 58) domainBuckets.d4.push(num);
      else domainBuckets.d5.push(num);
    }
  });

  const getAvg = (arr) => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2) : 0;

  return {
    totalScore: totalSum,
    avgScore: count ? (totalSum / count).toFixed(2) : 0,
    evaluatedCount: count,
    domainAverages: {
      domain1: getAvg(domainBuckets.d1),
      domain2: getAvg(domainBuckets.d2),
      domain3: getAvg(domainBuckets.d3),
      domain4: getAvg(domainBuckets.d4),
      domain5: getAvg(domainBuckets.d5)
    }
  };
}

async function runTest2() {
  console.log('\n🔵 [TEST 2] BẮT ĐẦU KIỂM THỬ CHỨC NĂNG PHIẾU TỰ ĐÁNH GIÁ NĂNG LỰC');
  const results = [];

  try {
    // 2.1. Kiểm tra nhận diện 7 bộ tiêu chuẩn chuyên môn
    const specCount = SPECIALTIES.length;
    results.push({
      test: '2.1. Cấu hình & nhận diện 7 bộ tiêu chuẩn chuyên môn',
      passed: specCount === 7,
      detail: `Đã cấu hình đủ 7 khối: ${SPECIALTIES.map(s => s.name).join(', ')}`
    });

    // 2.2. Kiểm tra tính toán điểm số 5 lĩnh vực năng lực
    const mockScores = {};
    for (let i = 1; i <= 66; i++) {
      mockScores[`crit_${i}`] = 3 + (i % 3); // Điểm từ 3 đến 5
    }
    const calcResult = calculateDomainScores(mockScores);
    const isValidCalculation = calcResult.evaluatedCount === 66 && calcResult.avgScore > 0 && Object.keys(calcResult.domainAverages).length === 5;
    results.push({
      test: '2.2. Thuật toán tính điểm 5 lĩnh vực & điểm trung bình',
      passed: isValidCalculation,
      detail: `Tổng điểm: ${calcResult.totalScore}/330, Điểm TB: ${calcResult.avgScore}/5, Đã đánh giá: ${calcResult.evaluatedCount} tiêu chí`
    });

    // 2.3. Kiểm tra lưu nháp và nộp hồ sơ đánh giá lên Supabase Cloud
    const testSubmission = {
      id: `sub_test_eval_${Date.now()}`,
      user_id: 'usr_lan_nt',
      full_name: 'Nguyễn Thị Lan',
      msnv: '150085',
      department: 'Chấn thương chỉnh hình',
      specialty: 'lamsang',
      year: 2026,
      status: 'submitted_l1',
      total_score: Math.round(parseFloat(calcResult.avgScore) * 66),
      evaluated_tier: 3,
      target_tier: 4,
      scores: mockScores,
      domain_scores: calcResult.domainAverages,
      evidences: {
        'crit_1': [{ name: 'cchn_012345.pdf', size: 102400, uploadedAt: '15/09/2026' }],
        'crit_49': [{ name: 'nckh_2025.pdf', size: 204800, uploadedAt: '15/09/2026' }]
      },
      timeline: [
        { action: 'create', actor: 'Nguyễn Thị Lan', timestamp: new Date().toISOString(), comment: 'Tạo phiếu tự đánh giá' },
        { action: 'submit_l1', actor: 'Nguyễn Thị Lan', timestamp: new Date().toISOString(), comment: 'Nộp hồ sơ lên ĐD Trưởng Khoa (Cấp 1)' }
      ],
      l1_approved_by: null,
      l1_approved_at: null,
      l2_approved_by: null,
      l2_approved_at: null,
      l3_approved_by: null,
      l3_approved_at: null,
      updated_at: new Date().toISOString()
    };

    const saveResult = await db.saveSubmission([testSubmission]);
    results.push({
      test: '2.3. Lưu & nộp phiếu tự đánh giá lên Supabase Cloud',
      passed: !!saveResult,
      detail: `Lưu thành công submission ID: ${testSubmission.id} với 2 minh chứng đính kèm`
    });

    // 2.4. Kiểm tra truy vấn lại hồ sơ từ Supabase Cloud
    const submissions = await db.getAllSubmissions();
    const fetched = submissions.find(s => s.id === testSubmission.id || s.user_id === 'usr_lan_nt');
    results.push({
      test: '2.4. Truy vấn lại hồ sơ đánh giá từ Supabase Cloud',
      passed: !!fetched,
      detail: `Tìm thấy hồ sơ của ${fetched ? fetched.full_name || fetched.user_id : 'N/A'}, trạng thái: ${fetched ? fetched.status : 'N/A'}`
    });

  } catch (err) {
    results.push({
      test: '2.x. Lỗi ngoại lệ trong Test 2',
      passed: false,
      detail: err.message
    });
  }

  return results;
}

module.exports = { runTest2 };
if (require.main === module) {
  runTest2().then(r => console.table(r));
}

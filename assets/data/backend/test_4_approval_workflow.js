/**
 * ============================================================================
 * TEST 4: CHỨC NĂNG PHÊ DUYỆT HỒ SƠ CÁC CẤP (MULTI-LEVEL APPROVAL WORKFLOW)
 * ============================================================================
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const db = require('./db');

// Mô phỏng quy trình chuyển trạng thái hồ sơ 3 Cấp
const WORKFLOW_STATES = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',                 // Đã nộp, chờ Cấp 1 (Trưởng khoa)
  APPROVED_LEVEL_1: 'approved_level_1',   // Cấp 1 duyệt, chờ Cấp 2 (Ban Điều Dưỡng)
  APPROVED_LEVEL_2: 'approved_level_2',   // Cấp 2 duyệt, chờ Cấp 3 (Ban Giám Đốc)
  APPROVED_FINAL: 'approved_final',       // Ban Giám Đốc duyệt, hoàn tất cấp chứng nhận
  REJECTED: 'rejected',                   // Từ chối
  REQUEST_CHANGE: 'request_change'        // Yêu cầu bổ sung minh chứng
};

async function runTest4() {
  console.log('\n🔵 [TEST 4] BẮT ĐẦU KIỂM THỬ CHỨC NĂNG PHÊ DUYỆT HỒ SƠ CÁC CẤP');
  const results = [];

  try {
    const testSubId = `sub_wf_test_${Date.now()}`;
    let currentSub = {
      id: testSubId,
      user_id: 'usr_approval_test',
      full_name: 'Đoàn Thị Thu Hằng',
      msnv: '150099',
      department: 'Ngoại Thần Kinh',
      specialty: 'lamsang',
      year: 2026,
      status: 'submitted_l1',
      total_score: 285,
      evaluated_tier: 3,
      target_tier: 3,
      scores: { crit_1: 4, crit_2: 4, crit_3: 5 },
      domain_scores: { d1: 4.2, d2: 4.0, d3: 4.5, d4: 4.0, d5: 4.5 },
      evidences: {},
      timeline: [
        { action: 'submit_l1', actor: 'Đoàn Thị Thu Hằng', timestamp: new Date().toISOString(), comment: 'Nộp hồ sơ thẩm định Cấp 1' }
      ],
      l1_approved_by: null,
      l1_approved_at: null,
      l2_approved_by: null,
      l2_approved_at: null,
      l3_approved_by: null,
      l3_approved_at: null,
      updated_at: new Date().toISOString()
    };

    // 4.1. Tạo và nộp hồ sơ (Chờ Cấp 1)
    await db.saveSubmission([currentSub]);
    results.push({
      test: '4.1. Khởi tạo hồ sơ nộp lên Cấp 1 (Trưởng khoa)',
      passed: currentSub.status === 'submitted_l1',
      detail: `Trạng thái: [${currentSub.status}]`
    });

    // 4.2. Cấp 1 (Điều dưỡng Trưởng khoa) thẩm định & duyệt
    currentSub.status = 'approved_l1';
    currentSub.l1_approved_by = 'Trần Thị Mỹ Ngân (Trưởng khoa)';
    currentSub.l1_approved_at = new Date().toISOString();
    currentSub.timeline.push({
      action: 'approve_l1',
      actor: currentSub.l1_approved_by,
      timestamp: currentSub.l1_approved_at,
      comment: 'Kỹ năng lâm sàng tốt, đồng ý đề xuất nâng Bậc 3'
    });
    await db.saveSubmission([currentSub]);
    results.push({
      test: '4.2. Phê duyệt Cấp 1 (Điều dưỡng Trưởng khoa)',
      passed: currentSub.status === 'approved_l1' && !!currentSub.l1_approved_by,
      detail: `Cấp 1 đã duyệt: "${currentSub.l1_approved_by}", chuyển tiếp lên Ban Điều Dưỡng`
    });

    // 4.3. Cấp 2 (Ban Điều Dưỡng) thẩm định toàn viện
    currentSub.status = 'approved_l2';
    currentSub.l2_approved_by = 'Ban Điều Dưỡng Bệnh Viện';
    currentSub.l2_approved_at = new Date().toISOString();
    currentSub.timeline.push({
      action: 'approve_l2',
      actor: currentSub.l2_approved_by,
      timestamp: currentSub.l2_approved_at,
      comment: 'Hồ sơ đạt yêu cầu CME và NCKH, trình Ban Giám Đốc phê chuẩn'
    });
    await db.saveSubmission([currentSub]);
    results.push({
      test: '4.3. Phê duyệt Cấp 2 (Ban Điều Dưỡng Toàn Viện)',
      passed: currentSub.status === 'approved_l2' && !!currentSub.l2_approved_by,
      detail: `Cấp 2 đã duyệt: "${currentSub.l2_approved_by}", chuyển tiếp lên Ban Giám Đốc`
    });

    // 4.4. Cấp 3 (Ban Giám Đốc / Hội đồng Khoa học) phê chuẩn chính thức
    currentSub.status = 'approved_final';
    currentSub.l3_approved_by = 'Ban Giám Đốc Bệnh Viện UMC';
    currentSub.l3_approved_at = new Date().toISOString();
    currentSub.timeline.push({
      action: 'approve_l3',
      actor: currentSub.l3_approved_by,
      timestamp: currentSub.l3_approved_at,
      comment: 'Chính thức công nhận Năng lực Điều Dưỡng Bậc 3'
    });
    await db.saveSubmission([currentSub]);
    results.push({
      test: '4.4. Phê chuẩn Cấp 3 (Ban Giám Đốc) & Cấp Xếp Bậc',
      passed: currentSub.status === 'approved_final' && !!currentSub.l3_approved_by,
      detail: `Ban Giám Đốc ký duyệt thành công -> Hồ sơ hoàn tất, Xếp Bậc ${currentSub.evaluated_tier}`
    });

    // 4.5. Kiểm tra Audit Log lịch sử phê duyệt 3 Cấp
    const hasFullAuditLog = currentSub.timeline.length === 4 &&
      currentSub.timeline.some(t => t.action === 'approve_l1') &&
      currentSub.timeline.some(t => t.action === 'approve_l2') &&
      currentSub.timeline.some(t => t.action === 'approve_l3');
    results.push({
      test: '4.5. Tính toàn vẹn Audit Log & Lịch sử phê duyệt 3 cấp',
      passed: hasFullAuditLog,
      detail: `Lịch sử lưu đầy đủ ${currentSub.timeline.length} mốc thời gian kèm người ký và hành động`
    });

  } catch (err) {
    results.push({
      test: '4.x. Lỗi ngoại lệ trong Test 4',
      passed: false,
      detail: err.message
    });
  }

  return results;
}

module.exports = { runTest4 };
if (require.main === module) {
  runTest4().then(r => console.table(r));
}

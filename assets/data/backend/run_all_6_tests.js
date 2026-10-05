/**
 * ============================================================================
 * TRÌNH ĐIỀU PHỐI VÀ CHẠY TOÀN BỘ 6 BÀI TEST CHỨC NĂNG & BẢO MẬT HỆ THỐNG UMC
 * ============================================================================
 */
const { runTest1 } = require('./test_1_auth_rbac');
const { runTest2 } = require('./test_2_assessment');
const { runTest3 } = require('./test_3_portfolio');
const { runTest4 } = require('./test_4_approval_workflow');
const { runTest5 } = require('./test_5_reports_ranking');
const { runTest6 } = require('./test_6_security_audit');

async function runAllTests() {
  console.log('=============================================================================');
  console.log('  BỆNH VIỆN ĐẠI HỌC Y DƯỢC TP. HỒ CHÍ MINH - BAN ĐIỀU DƯỠNG');
  console.log('  CHƯƠNG TRÌNH KIỂM THỬ TOÀN DIỆN 6 PHÂN HỆ CHỨC NĂNG & BẢO MẬT');
  console.log('=============================================================================');

  const startTime = Date.now();
  const allResults = [];

  const r1 = await runTest1();
  allResults.push(...r1);

  const r2 = await runTest2();
  allResults.push(...r2);

  const r3 = await runTest3();
  allResults.push(...r3);

  const r4 = await runTest4();
  allResults.push(...r4);

  const r5 = await runTest5();
  allResults.push(...r5);

  const r6 = await runTest6();
  allResults.push(...r6);

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('\n=============================================================================');
  console.log('  KẾT QUẢ TỔNG HỢP KIỂM THỬ (TEST SUMMARY REPORT)');
  console.log('=============================================================================');

  let passedCount = 0;
  allResults.forEach((item, idx) => {
    const statusIcon = item.passed ? '✅ PASS' : '❌ FAIL';
    if (item.passed) passedCount++;
    console.log(`${(idx + 1).toString().padStart(2, ' ')}. [${statusIcon}] ${item.test}`);
    console.log(`    -> Chi tiết: ${item.detail}\n`);
  });

  const total = allResults.length;
  const passRate = ((passedCount / total) * 100).toFixed(1);

  console.log('-----------------------------------------------------------------------------');
  console.log(`📊 TỔNG KẾT: ${passedCount}/${total} tiêu chí ĐẠT (${passRate}%)`);
  console.log(`⏱️ Thời gian thực thi: ${duration}s`);
  console.log(`🛡️ Trạng thái an toàn hệ thống: ${passRate === '100.0' ? 'ĐẠT CHUẨN XUẤT SẮC 100%' : 'CẦN KIỂM TRA LẠI'}`);
  console.log('=============================================================================\n');

  return { passedCount, total, passRate, duration, allResults };
}

if (require.main === module) {
  runAllTests().then(summary => {
    if (summary.passedCount === summary.total) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  });
}

module.exports = { runAllTests };

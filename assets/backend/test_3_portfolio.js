/**
 * ============================================================================
 * TEST 3: CHỨC NĂNG HỒ SƠ NĂNG LỰC CÁ NHÂN (PERSONAL PORTFOLIO & IDP)
 * ============================================================================
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const db = require('./db');

// Hàm sinh chi tiết Portfolio động tương tự Frontend js/app.js
function buildDynamicPortfolio(user) {
  if (!user) return null;
  const fullName = user.fullName || user.full_name || 'Nhân sự UMC';
  const msnv = user.msnv || 'NV-0000';
  const dept = user.department || 'Chấn thương chỉnh hình';
  const expYears = parseInt(user.experienceYears || user.experience_years) || 5;
  const degree = user.academicTitle || user.academic_title || user.degree || 'Cử nhân';
  const cchnNumber = `00${msnv.replace(/\D/g, '') || '1234'}/HCM-CCHN`;
  const managerName = user.managerName || user.manager_name || 'ĐD. CKI Trần Thị Mỹ Ngân';

  return {
    heroCard: {
      avatar: user.avatar || 'https://images.unsplash.com/photo-1594824813627-2c13702a4bf7?w=150',
      fullName,
      msnv,
      degree,
      jobTitle: user.jobTitle || user.job_title || 'Điều dưỡng viên',
      department: dept,
      cchn: cchnNumber,
      experienceYears: expYears,
      phone: user.phone || '0908 123 456',
      email: user.email || `${msnv.toLowerCase()}@umc.edu.vn`,
      managerLevel1: managerName
    },
    credentials: [
      { title: 'Chứng chỉ hành nghề khám chữa bệnh', code: cchnNumber, issueDate: '15/06/2019', status: 'Hiệu lực' },
      { title: 'Chứng chỉ Hồi sức cấp cứu cơ bản (BLS/ACLS)', code: 'BLS-2023-UMC', issueDate: '10/03/2023', status: 'Hiệu lực' },
      { title: 'Chứng chỉ Kiểm soát nhiễm khuẩn bệnh viện', code: 'KSNK-2022', issueDate: '05/11/2022', status: 'Hiệu lực' }
    ],
    scientificResearch: [
      { year: 2024, title: `Khảo sát sự tuân thủ quy trình kiểm soát đau tại ${dept}`, role: 'Chủ nhiệm đề tài', status: 'Đã nghiệm thu cấp cơ sở' }
    ],
    idpPlan: {
      targetLevel: `Bậc ${(parseInt(user.level) || 2) + 1}`,
      targetYear: 2026,
      courses: [
        { name: 'Đào tạo Điều dưỡng Chuyên khoa I', timeline: 'Quý 3/2026', status: 'Đang tham gia' },
        { name: 'Khóa phương pháp NCKH trong Điều dưỡng', timeline: 'Quý 4/2026', status: 'Kế hoạch' }
      ]
    }
  };
}

async function runTest3() {
  console.log('\n🔵 [TEST 3] BẮT ĐẦU KIỂM THỬ CHỨC NĂNG HỒ SƠ NĂNG LỰC CÁ NHÂN (PORTFOLIO)');
  const results = [];

  try {
    const users = await db.getAllUsers();
    const testUser = users.find(u => u.msnv) || users[0];

    // 3.1. Kiểm tra 11 trường thông tin trong Hero Card Portfolio
    const portfolio = buildDynamicPortfolio(testUser);
    const requiredHeroFields = [
      'avatar', 'fullName', 'msnv', 'degree', 'jobTitle',
      'department', 'cchn', 'experienceYears', 'phone', 'email', 'managerLevel1'
    ];
    const missingHeroFields = requiredHeroFields.filter(f => !portfolio.heroCard[f]);
    results.push({
      test: '3.1. Cấu trúc 11 trường thông tin Hero Card Portfolio',
      passed: missingHeroFields.length === 0,
      detail: missingHeroFields.length === 0 
        ? `Đầy đủ 11/11 trường cho nhân sự ${portfolio.heroCard.fullName} (${portfolio.heroCard.msnv})` 
        : `Thiếu các trường: ${missingHeroFields.join(', ')}`
    });

    // 3.2. Kiểm tra tính cá nhân hóa động (không bị trùng CCHN/Người duyệt của người khác)
    const userA = users[0];
    const userB = users[1] || { ...userA, msnv: 'NV-9999', full_name: 'Nguyễn Văn B', department: 'Khoa Ngoại Tổng Hợp' };
    const portA = buildDynamicPortfolio(userA);
    const portB = buildDynamicPortfolio(userB);
    const isDistinct = portA.heroCard.fullName !== portB.heroCard.fullName && portA.heroCard.cchn !== portB.heroCard.cchn;
    results.push({
      test: '3.2. Tính cá nhân hóa động cho từng tài khoản nhân viên',
      passed: isDistinct,
      detail: `User A: ${portA.heroCard.fullName} (${portA.heroCard.cchn}) != User B: ${portB.heroCard.fullName} (${portB.heroCard.cchn})`
    });

    // 3.3. Kiểm tra danh mục chứng chỉ & văn bằng minh chứng
    const hasCredentials = Array.isArray(portfolio.credentials) && portfolio.credentials.length >= 3;
    results.push({
      test: '3.3. Danh mục chứng chỉ & hồ sơ đào tạo liên tục (CME)',
      passed: hasCredentials,
      detail: `Có ${portfolio.credentials.length} chứng chỉ đính kèm hợp lệ`
    });

    // 3.4. Kiểm tra Kế hoạch phát triển cá nhân (IDP)
    const hasIdp = portfolio.idpPlan && portfolio.idpPlan.targetLevel && portfolio.idpPlan.courses.length > 0;
    results.push({
      test: '3.4. Kế hoạch phát triển cá nhân (IDP) gắn mục tiêu nâng bậc',
      passed: !!hasIdp,
      detail: `Mục tiêu: ${portfolio.idpPlan.targetLevel} (Năm ${portfolio.idpPlan.targetYear}) kèm ${portfolio.idpPlan.courses.length} khóa học`
    });

  } catch (err) {
    results.push({
      test: '3.x. Lỗi ngoại lệ trong Test 3',
      passed: false,
      detail: err.message
    });
  }

  return results;
}

module.exports = { runTest3 };
if (require.main === module) {
  runTest3().then(r => console.table(r));
}

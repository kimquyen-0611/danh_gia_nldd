const fs = require('fs');
const path = require('path');
const { parseCriteriaSheet, targetFiles, folderPath } = require('./validate_parsed');

const appJsPath = path.join(__dirname, '..', 'app.js');
const appJsBackupPath = path.join(__dirname, '..', 'app.js.bak');
const content = fs.readFileSync(appJsPath, 'utf8');

// Backup original app.js if not already backed up
if (!fs.existsSync(appJsBackupPath)) {
  fs.writeFileSync(appJsBackupPath, content, 'utf8');
  console.log('✅ Backed up original app.js to app.js.bak');
}

const lines = content.split(/\r?\n/);

// Find exact index of line 31 (DOMAINS_BY_SPECIALTY start) and line 2757 (end of lamsang)
// Line 32 is "    \"lamsang\":"
// Line 2757 is "],"
// Line 2758 is "    \"khambenh\":  ["
// Line 10359 is "};"

let lamsangStartLine = -1;
let khambenhOldStartLine = -1;
let domainsEndLine = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('"lamsang":') && lamsangStartLine === -1) {
    lamsangStartLine = i;
  }
  if (lines[i].includes('"khambenh":') && khambenhOldStartLine === -1 && i < 3000) {
    khambenhOldStartLine = i;
  }
  if (lines[i].trim() === '};' && i > 10000 && i < 11000 && domainsEndLine === -1) {
    domainsEndLine = i;
  }
}

console.log(`Boundaries found: lamsang=${lamsangStartLine + 1}, oldKhambenh=${khambenhOldStartLine + 1}, domainsEnd=${domainsEndLine + 1}`);

// Slice lines 0 to khambenhOldStartLine - 1 (which includes lamsang up to "],")
const headerAndLamsang = lines.slice(0, khambenhOldStartLine).join('\r\n');

// Parse the 6 new specialties
const newSpecialties = {};
targetFiles.forEach(tf => {
  const filePath = path.join(folderPath, tf.file);
  const res = parseCriteriaSheet(filePath, tf.sheet, tf.key);
  newSpecialties[tf.key] = res.domains;
  console.log(`Parsed ${tf.key}: ${res.totalCriteria} TC across ${res.domains.length} domains.`);
});

// Convert new specialties to formatted JS object entries
const specEntries = [];
for (const [key, domains] of Object.entries(newSpecialties)) {
  const jsonStr = JSON.stringify(domains, null, 2);
  // Indent appropriately
  const indented = jsonStr.split('\n').map(l => '  ' + l).join('\r\n');
  specEntries.push(`  "${key}": ${indented.trim()}`);
}

const newSpecialtiesCode = specEntries.join(',\r\n\r\n');

// The rest of app.js from line 10359 ("};") onwards
const restOfApp = lines.slice(domainsEndLine).join('\r\n');

let fullNewApp = headerAndLamsang + '\r\n' + newSpecialtiesCode + '\r\n' + restOfApp;

// Update DEPARTMENT_CONFIG
const newDeptConfig = `const DEPARTMENT_CONFIG = [
  // Khối 1: Lâm sàng (66 tiêu chí)
  { dept: 'Đơn vị Chấn thương Chỉnh hình', group: 'Lâm sàng', specialty: 'lamsang', specialtyLabel: 'Điều Dưỡng Lâm Sàng (66 TC)' },
  { dept: 'Khoa Ngoại Tổng hợp', group: 'Lâm sàng', specialty: 'lamsang', specialtyLabel: 'Điều Dưỡng Lâm Sàng (66 TC)' },
  { dept: 'Khoa Tai mũi họng', group: 'Lâm sàng', specialty: 'lamsang', specialtyLabel: 'Điều Dưỡng Lâm Sàng (66 TC)' },
  { dept: 'Khoa Sản', group: 'Lâm sàng', specialty: 'lamsang', specialtyLabel: 'Điều Dưỡng Lâm Sàng (66 TC)' },
  { dept: 'Khoa Kiểm soát nhiễm khuẩn', group: 'Lâm sàng', specialty: 'lamsang', specialtyLabel: 'Kiểm Soát Nhiễm Khuẩn (66 TC)' },
  { dept: 'Khoa Nội Tổng hợp', group: 'Lâm sàng', specialty: 'lamsang', specialtyLabel: 'Điều Dưỡng Lâm Sàng (66 TC)' },
  { dept: 'Khoa Hồi sức tích cực', group: 'Lâm sàng', specialty: 'lamsang', specialtyLabel: 'Điều Dưỡng Lâm Sàng (66 TC)' },
  { dept: 'Khoa Cấp cứu', group: 'Lâm sàng', specialty: 'lamsang', specialtyLabel: 'Điều Dưỡng Lâm Sàng (66 TC)' },

  // Khối 2: Các Khoa Khác / Cận Lâm Sàng
  { dept: 'Khoa Gây mê hồi sức', group: 'Cận lâm sàng', specialty: 'gayme', specialtyLabel: 'KTV Gây Mê Hồi Sức (66 TC)' },
  { dept: 'Khoa Nội soi', group: 'Cận lâm sàng', specialty: 'noisoi', specialtyLabel: 'Điều Dưỡng Nội Soi (66 TC)' },
  { dept: 'Khoa Khám bệnh', group: 'Cận lâm sàng', specialty: 'khambenh', specialtyLabel: 'Điều Dưỡng Khoa Khám Bệnh (71 TC)' },
  { dept: 'Khoa Chẩn đoán hình ảnh', group: 'Cận lâm sàng', specialty: 'cdha', specialtyLabel: 'Kỹ Thuật Y CĐHA (73 TC)' },
  { dept: 'Khoa Phục hồi chức năng_VLTL', group: 'Cận lâm sàng', specialty: 'vltl_phcn', specialtyLabel: 'Kỹ Thuật Y VLTL - PHCN (65 TC)' },
  { dept: 'Khoa Xét nghiệm', group: 'Cận lâm sàng', specialty: 'xetnghiem', specialtyLabel: 'Kỹ Thuật Y Xét Nghiệm (63 TC)' },
  { dept: 'Trung tâm SHPT', group: 'Cận lâm sàng', specialty: 'xetnghiem', specialtyLabel: 'Trung Tâm Sinh Học Phân Tử (63 TC)' },

  // Khối 3: Quản lý
  { dept: 'Ban điều dưỡng', group: 'Quản lý', specialty: 'lamsang', specialtyLabel: 'Ban Điều Dưỡng' },
  { dept: 'Ban giám đốc', group: 'Quản lý', specialty: 'lamsang', specialtyLabel: 'Ban Giám Đốc' },
  { dept: 'Trung tâm CNTT UMC', group: 'Quản lý', specialty: 'lamsang', specialtyLabel: 'Trung tâm CNTT UMC' }
];`;

fullNewApp = fullNewApp.replace(/const DEPARTMENT_CONFIG = \[[\s\S]*?\n\];/, newDeptConfig);

// Update SPECIALTY_META
const newSpecialtyMeta = `const SPECIALTY_META = {
  lamsang: {
    name: 'Điều Dưỡng Lâm Sàng',
    icon: '🏥',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    totalCriteria: 66,
    desc: 'Áp dụng cho Điều dưỡng khu vực lâm sàng: Ngoại, Sản, TMH, CTCH, KSNK, Hồi sức'
  },
  gayme: {
    name: 'KTV Gây Mê Hồi Sức',
    icon: '💉',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
    totalCriteria: 66,
    desc: 'Áp dụng cho Điều dưỡng & Kỹ thuật viên Khoa Gây mê hồi sức, phòng mổ'
  },
  noisoi: {
    name: 'Điều Dưỡng Nội Soi',
    icon: '🩺',
    badgeClass: 'bg-teal-100 text-teal-800 border-teal-200',
    totalCriteria: 66,
    desc: 'Áp dụng cho Điều dưỡng khu vực nội soi tiêu hóa, hô hấp và can thiệp'
  },
  khambenh: {
    name: 'Điều Dưỡng Khoa Khám Bệnh',
    icon: '📋',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    totalCriteria: 71,
    desc: 'Áp dụng cho Điều dưỡng phòng khám, tiếp nhận và chăm sóc ngoại trú'
  },
  cdha: {
    name: 'Kỹ Thuật Y Chẩn Đoán Hình Ảnh',
    icon: '🩻',
    badgeClass: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    totalCriteria: 73,
    desc: 'Áp dụng cho Kỹ thuật viên Khoa Chẩn đoán hình ảnh (X-quang, CT, MRI, can thiệp)'
  },
  vltl_phcn: {
    name: 'Kỹ Thuật Y Phục Hồi Chức Năng - VLTL',
    icon: '🏃',
    badgeClass: 'bg-orange-100 text-orange-800 border-orange-200',
    totalCriteria: 65,
    desc: 'Áp dụng cho Kỹ thuật viên Khoa Phục hồi chức năng - Vật lý trị liệu'
  },
  xetnghiem: {
    name: 'Kỹ Thuật Y Xét Nghiệm & SHPT',
    icon: '🔬',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-200',
    totalCriteria: 63,
    desc: 'Áp dụng cho Kỹ thuật viên Khoa Xét nghiệm và Trung tâm Sinh học Phân tử'
  }
};`;

fullNewApp = fullNewApp.replace(/const SPECIALTY_META = \{[\s\S]*?\n\};/, newSpecialtyMeta);

// Update INITIAL_USERS to have sample users for all new specialties
const newUsersSnippet = `  {
    id: 'usr_noisoi_01',
    userName: 'noisoi',
    msnv: 'NS-015-1',
    password: '123',
    fullName: 'Hoàng Thị Mai Phương',
    email: 'phuong.htm@umc.edu.vn',
    phone: '0909 334 455',
    role: 'nurse',
    roleName: 'Điều dưỡng Nội soi',
    department: 'Khoa Nội soi',
    specialty: 'noisoi',
    level: 3,
    levelName: 'Bậc 3 - ĐD Nội Soi Thành Thạo',
    jobTitle: 'Điều dưỡng viên Nội soi',
    degree: 'Cử nhân Điều dưỡng',
    academicTitle: 'Cử nhân',
    graduationYear: 2018,
    experienceYears: 8,
    gender: 'Nữ',
    dob: '12/04/1995',
    lastSkillExamScore: 92,
    nckh: 'Tham gia chuẩn hóa quy trình tiệt khuẩn nội soi mềm',
    evaluationYear: 2026,
    managerName: 'Nguyễn Thị Kim Quyên',
    managerId: 'usr_quyen_ntk',
    approvalLevel: 0,
    avatar: 'https://images.unsplash.com/photo-1594824813627-2c13702a4bf7?w=150'
  },
  {
    id: 'usr_cdha_01',
    userName: 'cdha',
    msnv: 'HA-028-1',
    password: '123',
    fullName: 'Ngô Văn Hùng',
    email: 'hung.nv@umc.edu.vn',
    phone: '0918 776 655',
    role: 'nurse',
    roleName: 'Kỹ thuật y CĐHA',
    department: 'Khoa Chẩn đoán hình ảnh',
    specialty: 'cdha',
    level: 3,
    levelName: 'Bậc 3 - KTV CĐHA Độc Lập',
    jobTitle: 'Kỹ thuật viên CĐHA',
    degree: 'Cử nhân Kỹ thuật Hình ảnh Y học',
    academicTitle: 'Cử nhân',
    graduationYear: 2017,
    experienceYears: 9,
    gender: 'Nam',
    dob: '22/09/1993',
    lastSkillExamScore: 95,
    nckh: 'Tối ưu hóa liều xạ trong chụp CT Scanner can thiệp',
    evaluationYear: 2026,
    managerName: 'Nguyễn Thị Kim Quyên',
    managerId: 'usr_quyen_ntk',
    approvalLevel: 0,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150'
  },
  {
    id: 'usr_vltl_01',
    userName: 'vltl',
    msnv: 'PH-019-1',
    password: '123',
    fullName: 'Đặng Thanh Thảo',
    email: 'thao.dt@umc.edu.vn',
    phone: '0938 221 133',
    role: 'nurse',
    roleName: 'Kỹ thuật y Phục hồi chức năng',
    department: 'Khoa Phục hồi chức năng_VLTL',
    specialty: 'vltl_phcn',
    level: 3,
    levelName: 'Bậc 3 - KTV PHCN Thành Thạo',
    jobTitle: 'Kỹ thuật viên PHCN',
    degree: 'Cử nhân Phục hồi chức năng',
    academicTitle: 'Cử nhân',
    graduationYear: 2019,
    experienceYears: 7,
    gender: 'Nữ',
    dob: '18/06/1996',
    lastSkillExamScore: 91,
    nckh: 'Đánh giá hiệu quả phục hồi chức năng sớm sau phẫu thuật dây chằng',
    evaluationYear: 2026,
    managerName: 'Nguyễn Thị Kim Quyên',
    managerId: 'usr_quyen_ntk',
    approvalLevel: 0,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150'
  },
  {
    id: 'usr_ksnk_01',
    userName: 'ksnk',
    msnv: 'KS-011-1',
    password: '123',
    fullName: 'Lê Minh Tuấn',
    email: 'tuan.lm@umc.edu.vn',
    phone: '0903 889 900',
    role: 'nurse',
    roleName: 'Điều dưỡng KSNK',
    department: 'Khoa Kiểm soát nhiễm khuẩn',
    specialty: 'lamsang',
    level: 4,
    levelName: 'Bậc 4 - ĐD Chuyên Khoa KSNK',
    jobTitle: 'Điều dưỡng Kiểm soát nhiễm khuẩn',
    degree: 'Thạc sĩ Điều dưỡng',
    academicTitle: 'Thạc sĩ',
    graduationYear: 2014,
    experienceYears: 12,
    gender: 'Nam',
    dob: '08/02/1990',
    lastSkillExamScore: 96,
    nckh: 'Giám sát nhiễm khuẩn vết mổ và vi khuẩn kháng kháng sinh',
    evaluationYear: 2026,
    managerName: 'Nguyễn Thị Kim Quyên',
    managerId: 'usr_quyen_ntk',
    approvalLevel: 0,
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150'
  },
  {
    id: 'usr_shpt_01',
    userName: 'shpt',
    msnv: 'SH-008-1',
    password: '123',
    fullName: 'Trần Thị Thu Hà',
    email: 'ha.ttt@umc.edu.vn',
    phone: '0919 443 322',
    role: 'nurse',
    roleName: 'Kỹ thuật y Sinh học phân tử',
    department: 'Trung tâm SHPT',
    specialty: 'xetnghiem',
    level: 3,
    levelName: 'Bậc 3 - KTV Sinh Học Phân Tử',
    jobTitle: 'Kỹ thuật viên SHPT',
    degree: 'Cử nhân Xét nghiệm Y học',
    academicTitle: 'Cử nhân',
    graduationYear: 2018,
    experienceYears: 8,
    gender: 'Nữ',
    dob: '14/10/1995',
    lastSkillExamScore: 94,
    nckh: 'Ứng dụng kỹ thuật Real-time PCR trong chẩn đoán gen kháng thuốc',
    evaluationYear: 2026,
    managerName: 'Nguyễn Thị Kim Quyên',
    managerId: 'usr_quyen_ntk',
    approvalLevel: 0,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
  }`;

// Replace usr_xetnghiem_01 specialty with 'xetnghiem' and append new users before the closing ]; of INITIAL_USERS
fullNewApp = fullNewApp.replace(/specialty:\s*'canlamsang'/g, "specialty: 'xetnghiem'");
fullNewApp = fullNewApp.replace(/\n\s*\{\s*\n\s*id:\s*'usr_xetnghiem_01'[\s\S]*?\n\s*\}\s*\n\];/, (match) => {
  return match.replace(/\n\];/, ',\n' + newUsersSnippet + '\n];');
});

// Update CURRENT_SYSTEM_VERSION to force localStorage refresh
fullNewApp = fullNewApp.replace(
  /const CURRENT_SYSTEM_VERSION = '[^']+';/,
  "const CURRENT_SYSTEM_VERSION = 'umc_v9_all_7_specialties_complete';"
);

// Update Quick-Select buttons in renderProfileHeaderCard
const newButtonsRibbon = `          <!-- 7 Nút Chuyển Nhanh Khối Chuyên Khoa Chuẩn Bộ Tiêu Chí -->
          <div class="inline-flex items-center bg-white p-0.5 rounded-xl border border-blue-200 text-xs flex-wrap gap-0.5">
            <button type="button" onclick="changeAssessmentSpecialty('lamsang')" class="px-2 py-1 rounded-lg font-bold transition-all flex items-center gap-1 \${specialty === 'lamsang' ? 'bg-blue-700 text-white shadow-2xs font-black' : 'text-slate-600 hover:text-blue-900'}">
              <span>🏥</span> Lâm Sàng (66 TC)
            </button>
            <button type="button" onclick="changeAssessmentSpecialty('gayme')" class="px-2 py-1 rounded-lg font-bold transition-all flex items-center gap-1 \${specialty === 'gayme' ? 'bg-purple-700 text-white shadow-2xs font-black' : 'text-slate-600 hover:text-purple-900'}">
              <span>💉</span> Gây Mê (66 TC)
            </button>
            <button type="button" onclick="changeAssessmentSpecialty('noisoi')" class="px-2 py-1 rounded-lg font-bold transition-all flex items-center gap-1 \${specialty === 'noisoi' ? 'bg-teal-700 text-white shadow-2xs font-black' : 'text-slate-600 hover:text-teal-900'}">
              <span>🩺</span> Nội Soi (66 TC)
            </button>
            <button type="button" onclick="changeAssessmentSpecialty('khambenh')" class="px-2 py-1 rounded-lg font-bold transition-all flex items-center gap-1 \${specialty === 'khambenh' ? 'bg-emerald-700 text-white shadow-2xs font-black' : 'text-slate-600 hover:text-emerald-900'}">
              <span>📋</span> Khám Bệnh (71 TC)
            </button>
            <button type="button" onclick="changeAssessmentSpecialty('cdha')" class="px-2 py-1 rounded-lg font-bold transition-all flex items-center gap-1 \${specialty === 'cdha' ? 'bg-cyan-700 text-white shadow-2xs font-black' : 'text-slate-600 hover:text-cyan-900'}">
              <span>🩻</span> CĐHA (73 TC)
            </button>
            <button type="button" onclick="changeAssessmentSpecialty('vltl_phcn')" class="px-2 py-1 rounded-lg font-bold transition-all flex items-center gap-1 \${specialty === 'vltl_phcn' ? 'bg-orange-700 text-white shadow-2xs font-black' : 'text-slate-600 hover:text-orange-900'}">
              <span>🏃</span> PHCN (65 TC)
            </button>
            <button type="button" onclick="changeAssessmentSpecialty('xetnghiem')" class="px-2 py-1 rounded-lg font-bold transition-all flex items-center gap-1 \${specialty === 'xetnghiem' ? 'bg-amber-700 text-white shadow-2xs font-black' : 'text-slate-600 hover:text-amber-900'}">
              <span>🔬</span> Xét Nghiệm (63 TC)
            </button>
          </div>`;

fullNewApp = fullNewApp.replace(
  /<!-- 4 Nút Chuyển Nhanh Khối Chuyên Khoa -->[\s\S]*?<\/div>\s*<\/div>\s*<button type="button" onclick="openStaffProfileModal\(\)"/,
  `${newButtonsRibbon}\r\n        </div>\r\n\r\n        <button type="button" onclick="openStaffProfileModal()"`
);

// Write to app.js
fs.writeFileSync(appJsPath, fullNewApp, 'utf8');
console.log('🎉 Successfully generated and updated app.js!');

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'backend', '.env') });
const db = require('../backend/db');

console.log('=== NẠP DỮ LIỆU MẪU LÊN SUPABASE CLOUD (SEED DATA) ===\n');

const appJsPath = path.join(__dirname, '..', '..', 'app.js');
const appJsContent = fs.readFileSync(appJsPath, 'utf8');

// Trích xuất INITIAL_USERS và INITIAL_SUBMISSIONS
let initialUsers = [];
let initialSubmissions = [];

try {
  const usersMatch = appJsContent.match(/const INITIAL_USERS = (\[[\s\S]*?\n\];)/);
  if (usersMatch) {
    initialUsers = eval(usersMatch[1].replace(/;$/, ''));
    console.log(`✅ Trích xuất thành công ${initialUsers.length} tài khoản nhân sự.`);
  }

  const subsMatch = appJsContent.match(/const INITIAL_SUBMISSIONS = (\[[\s\S]*?\n\];)/);
  if (subsMatch) {
    initialSubmissions = eval(subsMatch[1].replace(/;$/, ''));
    console.log(`✅ Trích xuất thành công ${initialSubmissions.length} hồ sơ đánh giá mẫu.`);
  }
} catch (e) {
  console.error('Lỗi trích xuất:', e.message);
}

async function runSeed() {
  console.log('\nĐang kiểm tra các bảng trên Supabase...');
  
  let pingTables = [];
  try {
    const ping = await fetch(`${process.env.SUPABASE_URL}/rest/v1/`, {
      headers: {
        apikey: process.env.SUPABASE_SECRET_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}`
      }
    });
    const spec = await ping.json();
    pingTables = Object.keys(spec.definitions || {});
    console.log('Các bảng hiện có trên Supabase:', pingTables);
  } catch (e) {
    console.error('Không thể kết nối Supabase:', e.message);
    return;
  }

  const hasUsersTable = pingTables.includes('umc_users');
  const hasSubsTable = pingTables.includes('umc_submissions');

  if (!hasUsersTable || !hasSubsTable) {
    console.log('\n⚠️ LƯU Ý QUAN TRỌNG:');
    console.log('Bảng "umc_users" hoặc "umc_submissions" chưa được tạo trên Supabase Cloud.');
    console.log('👉 BƯỚC CẦN LÀM:');
    console.log('1. Mở link: https://supabase.com/dashboard/project/ogqblclswauwvqnifbtw/sql');
    console.log('2. Mở file "backend/schema.sql" trong dự án, copy toàn bộ nội dung và dán vào SQL Editor.');
    console.log('3. Nhấn nút "Run" để tạo 2 bảng này.');
    console.log('4. Sau đó chạy lại file này để nạp toàn bộ 21 tài khoản nhân sự lên Cloud!\n');
    return;
  }

  // 1. Nạp umc_users
  console.log(`\nĐang nạp ${initialUsers.length} tài khoản vào bảng umc_users...`);
  const cleanUsers = initialUsers.map(u => ({
    id: u.id,
    user_name: u.userName,
    msnv: u.msnv,
    password: u.password || '123',
    full_name: u.fullName,
    email: u.email || null,
    phone: u.phone || null,
    role: u.role,
    role_name: u.roleName,
    department: u.department,
    specialty: u.specialty || 'lamsang',
    level: parseInt(u.level) || 1,
    level_name: u.levelName,
    degree: u.degree || null,
    academic_title: u.academicTitle || null,
    graduation_year: parseInt(u.graduationYear) || 2018,
    experience_years: parseInt(u.experienceYears) || 5,
    gender: u.gender || 'Nữ',
    dob: u.dob || null,
    last_skill_exam_score: parseInt(u.lastSkillExamScore) || 90,
    nckh: u.nckh || null,
    manager_name: u.managerName || null,
    manager_id: u.managerId || null,
    approval_level: parseInt(u.approvalLevel) || 0,
    avatar: u.avatar || null,
    updated_at: new Date().toISOString()
  }));

  try {
    const resUsers = await db.supabaseApi.upsert('umc_users', cleanUsers, 'id');
    console.log(`🎉 ĐÃ ĐỒNG BỘ ${cleanUsers.length} TÀI KHOẢN NHÂN SỰ LÊN SUPABASE THÀNH CÔNG!`);
  } catch (err) {
    console.error('Lỗi khi lưu umc_users:', err.message);
  }

  // 2. Nạp umc_submissions
  console.log(`\nĐang nạp ${initialSubmissions.length} hồ sơ mẫu vào bảng umc_submissions...`);
  const cleanSubs = initialSubmissions.map(sub => ({
    id: sub.id,
    user_id: sub.userId,
    full_name: sub.fullName,
    msnv: sub.msnv,
    department: sub.department,
    specialty: sub.specialty || 'lamsang',
    year: parseInt(sub.year) || 2026,
    status: sub.status || 'draft',
    total_score: parseInt(sub.totalScore) || 0,
    evaluated_tier: parseInt(sub.evaluatedTier) || 1,
    target_tier: parseInt(sub.targetTier) || 2,
    scores: sub.scores || {},
    domain_scores: sub.domainScores || {},
    evidences: sub.evidences || {},
    timeline: sub.timeline || [],
    l1_approved_by: sub.l1ApprovedBy || null,
    l1_approved_at: sub.l1ApprovedAt || null,
    l2_approved_by: sub.l2ApprovedBy || null,
    l2_approved_at: sub.l2ApprovedAt || null,
    l3_approved_by: sub.l3ApprovedBy || null,
    l3_approved_at: sub.l3ApprovedAt || null,
    updated_at: new Date().toISOString()
  }));

  try {
    const resSubs = await db.supabaseApi.upsert('umc_submissions', cleanSubs, 'id');
    console.log(`🎉 ĐÃ ĐỒNG BỘ ${cleanSubs.length} HỒ SƠ ĐÁNH GIÁ LÊN SUPABASE THÀNH CÔNG!`);
  } catch (err) {
    console.error('Lỗi khi lưu umc_submissions:', err.message);
  }

  console.log('\n========================================================');
  console.log('✅ HOÀN TẤT NẠP DỮ LIỆU SUPABASE CLOUD!');
  console.log('========================================================');
}

runSeed();

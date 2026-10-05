const { supabaseApi } = require('./db');

(async () => {
  console.log('===============================================================');
  console.log('  KIỂM TRA & TEST TOÀN DIỆN LƯU TRỮ DỮ LIỆU SUPABASE CLOUD');
  console.log('===============================================================\n');

  try {
    // 1. Kiểm tra đọc danh sách nhân sự (umc_users)
    console.log('[1/4] Đang truy vấn bảng umc_users từ Supabase...');
    const users = await supabaseApi.select('umc_users', { limit: 100, order: 'msnv.asc' });
    console.log(`  ✅ Đọc thành công ${users.length} tài khoản nhân sự từ Supabase!`);
    if (users.length > 0) {
      const u0 = users[0];
      console.log(`  Mẫu nhân sự đầu tiên: ${u0.full_name} (${u0.msnv}) - Khoa: ${u0.department} - Level: ${u0.level}`);
      console.log(`  Các trường đã lưu trong DB:`, Object.keys(u0).join(', '));
    }

    // 2. Thử nghiệm Upsert thông tin nhân sự với đầy đủ 14 trường
    console.log('\n[2/4] Thử nghiệm lưu/cập nhật 14 trường thông tin nhân sự lên umc_users...');
    const testUser = {
      id: 'usr_test_cloud_sync',
      user_name: 'test.cloud',
      msnv: 'TEST-999',
      password: '123',
      full_name: 'Nguyễn Văn Test Cloud',
      email: 'test.cloud@umc.edu.vn',
      phone: '0909999999',
      role: 'nurse',
      role_name: 'Điều dưỡng viên',
      department: 'Chấn thương chỉnh hình',
      specialty: 'lamsang',
      level: 3,
      level_name: 'Bậc 3 - Đủ Năng Lực',
      degree: 'Cử nhân Điều dưỡng',
      academic_title: 'Cử nhân',
      graduation_year: 2019,
      experience_years: 7,
      gender: 'Nam',
      dob: '01/01/1995',
      last_skill_exam_score: 95,
      nckh: 'Đề tài thử nghiệm đồng bộ đám mây Supabase',
      manager_name: 'Nguyễn Thị Kim Quyên',
      manager_id: 'usr_quyen_ntk',
      approval_level: 0,
      avatar: 'https://images.unsplash.com/photo-1594824813627-2c13702a4bf7?w=150',
      updated_at: new Date().toISOString()
    };

    const upsertUserRes = await supabaseApi.upsert('umc_users', [testUser], 'id');
    console.log('  ✅ Lưu nhân sự lên Supabase thành công! Phản hồi:', upsertUserRes.length > 0 ? 'Bản ghi đã tạo/cập nhật' : 'OK');

    // 3. Kiểm tra đọc danh sách hồ sơ đánh giá (umc_submissions)
    console.log('\n[3/4] Đang truy vấn bảng umc_submissions từ Supabase...');
    const submissions = await supabaseApi.select('umc_submissions', { limit: 100, order: 'updated_at.desc' });
    console.log(`  ✅ Đọc thành công ${submissions.length} hồ sơ đánh giá từ Supabase!`);
    if (submissions.length > 0) {
      const s0 = submissions[0];
      console.log(`  Mẫu hồ sơ mới nhất: ${s0.id} - ${s0.full_name} (${s0.msnv}) - Điểm: ${s0.total_score} - Trạng thái: ${s0.status}`);
      console.log(`  Các trường đã lưu trong DB:`, Object.keys(s0).join(', '));
    }

    // 4. Thử nghiệm Upsert hồ sơ đánh giá đầy đủ điểm chi tiết và minh chứng
    console.log('\n[4/4] Thử nghiệm lưu hồ sơ đánh giá & minh chứng lên umc_submissions...');
    const testSub = {
      id: 'sub_2026_test_cloud_sync',
      user_id: 'usr_test_cloud_sync',
      full_name: 'Nguyễn Văn Test Cloud',
      msnv: 'TEST-999',
      department: 'Chấn thương chỉnh hình',
      specialty: 'lamsang',
      year: 2026,
      status: 'submitted_l1',
      total_score: 850,
      evaluated_tier: 4,
      target_tier: 4,
      scores: { 'lamsang_c1': 25, 'lamsang_c2': 20, 'lamsang_c3': 15 },
      domain_scores: { 'lamsang_d1': 160, 'lamsang_d2': 380, 'lamsang_d3': 110, 'lamsang_d4': 90, 'lamsang_d5': 110 },
      evidences: {
        'lamsang_c1': [{ name: 'bang_tot_nghiep_cndd.pdf', size: 102400, uploadedAt: '15/09/2026' }]
      },
      timeline: [
        { action: 'create', actor: 'Nguyễn Văn Test Cloud', timestamp: new Date().toISOString(), comment: 'Tạo phiếu tự đánh giá' },
        { action: 'submit_l1', actor: 'Nguyễn Văn Test Cloud', timestamp: new Date().toISOString(), comment: 'Nộp hồ sơ lên ĐD Trưởng Khoa (Cấp 1)' }
      ],
      l1_approved_by: null,
      l1_approved_at: null,
      l2_approved_by: null,
      l2_approved_at: null,
      l3_approved_by: null,
      l3_approved_at: null,
      updated_at: new Date().toISOString()
    };

    const upsertSubRes = await supabaseApi.upsert('umc_submissions', [testSub], 'id');
    console.log('  ✅ Lưu hồ sơ đánh giá lên Supabase thành công!');

    console.log('\n===============================================================');
    console.log('  🎉 TẤT CẢ CÁC BƯỚC TEST CRUD SUPABASE ĐỀU ĐẠT CHUẨN 100%!');
    console.log('===============================================================\n');
  } catch (err) {
    console.error('❌ Lỗi kiểm tra Supabase:', err);
    process.exit(1);
  }
})();

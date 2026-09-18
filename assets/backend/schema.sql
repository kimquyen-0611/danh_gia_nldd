-- =========================================================================
-- HỆ THỐNG ĐÁNH GIÁ NĂNG LỰC ĐIỀU DƯỠNG UMC - SCHEMA DATABASE SUPABASE
-- Bệnh viện Đại học Y Dược TP. Hồ Chí Minh
-- =========================================================================
-- Hướng dẫn cài đặt:
-- 1. Truy cập: https://supabase.com/dashboard/project/ogqblclswauwvqnifbtw/sql
-- 2. Dán toàn bộ nội dung file này vào SQL Editor
-- 3. Bấm nút "Run" để khởi tạo các bảng và chính sách bảo mật
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. BẢNG NHÂN SỰ & PHÂN QUYỀN (umc_users)
CREATE TABLE IF NOT EXISTS public.umc_users (
    id VARCHAR(100) PRIMARY KEY,                   -- VD: 'usr_quyen_ntk', 'usr_bandd_nv01'
    user_name VARCHAR(100) NOT NULL,
    msnv VARCHAR(50) NOT NULL,
    password VARCHAR(255) DEFAULT '123',
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    role VARCHAR(50) NOT NULL,                     -- 'nurse', 'head_nurse', 'deputy_head_nurse', 'nurse_board', 'director', 'admin'
    role_name VARCHAR(255),
    department VARCHAR(255) NOT NULL,              -- Khoa phòng công tác
    specialty VARCHAR(50) DEFAULT 'lamsang',       -- 'lamsang', 'gayme', 'noisoi', 'khambenh', 'cdha', 'vltl_phcn', 'xetnghiem'
    level INT DEFAULT 1,                           -- Bậc năng lực 1 - 7
    level_name VARCHAR(255),
    degree VARCHAR(255),                           -- Trình độ: Cử nhân, Thạc sĩ, Tiến sĩ...
    academic_title VARCHAR(255),
    graduation_year INT DEFAULT 2018,
    experience_years INT DEFAULT 5,
    gender VARCHAR(20) DEFAULT 'Nữ',
    dob VARCHAR(50),
    last_skill_exam_score INT DEFAULT 90,
    nckh TEXT,                                     -- Đề tài nghiên cứu khoa học
    manager_name VARCHAR(255),
    manager_id VARCHAR(100),
    approval_level INT DEFAULT 0,
    avatar TEXT,                                   -- Ảnh đại diện URL hoặc Base64 đã nén
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BẢNG HỒ SƠ TỰ ĐÁNH GIÁ & PHÊ DUYỆT 3 CẤP (umc_submissions)
CREATE TABLE IF NOT EXISTS public.umc_submissions (
    id VARCHAR(100) PRIMARY KEY,                   -- VD: 'sub_2026_quyen_ntk'
    user_id VARCHAR(100) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    msnv VARCHAR(50) NOT NULL,
    department VARCHAR(255) NOT NULL,
    specialty VARCHAR(50) NOT NULL,
    year INT DEFAULT 2026,
    status VARCHAR(50) DEFAULT 'draft',            -- 'draft', 'submitted_l1', 'submitted_l2', 'submitted_l3', 'approved', 'rejected'
    total_score INT DEFAULT 0,
    evaluated_tier INT DEFAULT 1,
    target_tier INT DEFAULT 2,
    scores JSONB DEFAULT '{}'::jsonb,              -- Map chi tiết điểm: { "lamsang_c1": 25, ... }
    domain_scores JSONB DEFAULT '{}'::jsonb,       -- Tổng điểm 5 lĩnh vực: { "lamsang_d1": 180, ... }
    evidences JSONB DEFAULT '{}'::jsonb,           -- Danh mục minh chứng: { "lamsang_c1": [...] }
    timeline JSONB DEFAULT '[]'::jsonb,            -- Nhật ký phê duyệt: [ { action, actor, timestamp, comment } ]
    l1_approved_by VARCHAR(255),
    l1_approved_at TIMESTAMPTZ,
    l2_approved_by VARCHAR(255),
    l2_approved_at TIMESTAMPTZ,
    l3_approved_by VARCHAR(255),
    l3_approved_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BẢNG YÊU CẦU / LIÊN HỆ ĐÁNH GIÁ (yeu_cau - Giữ lại tương thích)
CREATE TABLE IF NOT EXISTS public.yeu_cau (
    id BIGSERIAL PRIMARY KEY,
    ho_ten VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    so_dien_thoai VARCHAR(50),
    noi_dung TEXT NOT NULL,
    trang_thai VARCHAR(50) DEFAULT 'cho_xu_ly',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TẠO CHỈ MỤC INDEX
CREATE INDEX IF NOT EXISTS idx_umc_users_dept ON public.umc_users(department);
CREATE INDEX IF NOT EXISTS idx_umc_users_specialty ON public.umc_users(specialty);
CREATE INDEX IF NOT EXISTS idx_umc_submissions_user_id ON public.umc_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_umc_submissions_dept ON public.umc_submissions(department);
CREATE INDEX IF NOT EXISTS idx_umc_submissions_status ON public.umc_submissions(status);
CREATE INDEX IF NOT EXISTS idx_yeu_cau_created_at ON public.yeu_cau(created_at DESC);

-- 5. CẤU HÌNH BẢO MẬT ROW LEVEL SECURITY (RLS)
ALTER TABLE public.umc_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.umc_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.yeu_cau ENABLE ROW LEVEL SECURITY;

-- Policies umc_users: Chỉ Backend Service Role mới có toàn quyền Đọc/Ghi/Cập nhật nhân sự
DROP POLICY IF EXISTS "Cho phep toan quyen umc_users service_role" ON public.umc_users;
CREATE POLICY "Cho phep toan quyen umc_users service_role" ON public.umc_users FOR ALL TO service_role USING (true) WITH CHECK (true);

-- THẮT CHẶT BẢO MẬT: Hủy bỏ quyền ghi/xóa tự do của anon vào umc_users
DROP POLICY IF EXISTS "Cho phep client doc va ghi umc_users" ON public.umc_users;
-- Cho phép client đọc thông tin cơ bản nhân sự nhưng chỉ Backend API mới có quyền cập nhật/thêm mới
CREATE POLICY "Cho phep client chi doc umc_users" ON public.umc_users FOR SELECT TO anon, authenticated USING (true);

-- Policies umc_submissions: Service Role có toàn quyền
DROP POLICY IF EXISTS "Cho phep toan quyen umc_submissions service_role" ON public.umc_submissions;
CREATE POLICY "Cho phep toan quyen umc_submissions service_role" ON public.umc_submissions FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Cho phep client doc va ghi umc_submissions" ON public.umc_submissions;
CREATE POLICY "Cho phep client doc va ghi umc_submissions" ON public.umc_submissions FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Policies yeu_cau
DROP POLICY IF EXISTS "Cho phep toan quyen yeu_cau service_role" ON public.yeu_cau;
CREATE POLICY "Cho phep toan quyen yeu_cau service_role" ON public.yeu_cau FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Cho phep client doc va ghi yeu_cau" ON public.yeu_cau;
CREATE POLICY "Cho phep client doc va ghi yeu_cau" ON public.yeu_cau FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);


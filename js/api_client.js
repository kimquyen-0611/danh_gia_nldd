/**
 * api_client.js - Module Frontend fetch() kết nối Backend API
 * Cung cấp 2 hàm chính: guiYeuCau() và layDanhSachYeuCau()
 */

// Tự động nhận diện Base URL API linh hoạt:
// - Trên Vercel / Web Server: dùng cùng domain (/api)
// - Mở file cục bộ (file:///): kết nối máy chủ local (http://localhost:5000/api)
const API_BASE_URL = (typeof window !== 'undefined' && window.location && window.location.origin && window.location.origin.startsWith('http'))
  ? `${window.location.origin}/api`
  : 'http://localhost:5000/api';

if (typeof window !== 'undefined') {
  window.API_BASE_URL = API_BASE_URL;
}

/**
 * 1. Gửi dữ liệu yêu cầu mới tới Backend (POST /api/yeu-cau)
 * @param {Object} duLieu - { ho_ten, email, so_dien_thoai, noi_dung }
 * @returns {Promise<Object|null>}
 */
async function guiYeuCau(duLieu) {
  try {
    const response = await fetch(`${API_BASE_URL}/yeu-cau`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(duLieu)
    });

    const result = await response.json();

    if (!response.ok) {
      const errorMsg = result.errors ? result.errors.join('\n') : (result.message || 'Lỗi gửi yêu cầu');
      console.error('Lỗi từ máy chủ:', result);
      alert('⚠️ Gửi không thành công:\n' + errorMsg);
      return null;
    }

    console.log('✅ Gửi yêu cầu thành công:', result.data);
    alert('🎉 Yêu cầu đã được lưu thành công vào Supabase!');
    return result.data;
  } catch (error) {
    console.error('❌ Lỗi kết nối API Backend:', error);
    alert('Không thể kết nối đến Backend Server (http://localhost:5000). Vui lòng đảm bảo Backend đang chạy!');
    return null;
  }
}

/**
 * 2. Lấy danh sách yêu cầu mới nhất từ Backend (GET /api/yeu-cau)
 * @param {number} limit - Số lượng bản ghi cần lấy (mặc định 20)
 * @param {number} page - Trang số mấy (mặc định 1)
 * @returns {Promise<Array>}
 */
async function layDanhSachYeuCau(limit = 20, page = 1) {
  try {
    const response = await fetch(`${API_BASE_URL}/yeu-cau?limit=${limit}&page=${page}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Lỗi khi tải danh sách');
    }

    console.log(`✅ Lấy thành công ${result.data ? result.data.length : 0} bản ghi.`);
    return result.data || [];
  } catch (error) {
    console.error('❌ Lỗi khi lấy danh sách yêu cầu:', error);
    return [];
  }
}

/**
 * 3. Đăng nhập an toàn qua Backend API (POST /api/auth/login)
 * @param {string} username - Tên đăng nhập / MSNV / Email
 * @param {string} password - Mật khẩu
 * @returns {Promise<{success: boolean, token?: string, user?: Object, message: string, isOffline?: boolean}>}
 */
async function apiLogin(username, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      return {
        success: false,
        errorField: result.errorField || (result.message && result.message.includes('tên đăng nhập') ? 'username' : 'password'),
        message: result.message || 'Tài khoản hoặc mật khẩu không chính xác'
      };
    }

    let formattedUser = result.user;
    if (formattedUser) {
      formattedUser = {
        ...formattedUser,
        id: formattedUser.id,
        userName: formattedUser.user_name || formattedUser.userName || formattedUser.id,
        user_name: formattedUser.user_name || formattedUser.userName || formattedUser.id,
        msnv: formattedUser.msnv,
        fullName: formattedUser.full_name || formattedUser.fullName,
        full_name: formattedUser.full_name || formattedUser.fullName,
        email: formattedUser.email || '',
        phone: formattedUser.phone || '',
        role: formattedUser.role,
        roleName: formattedUser.role_name || formattedUser.roleName || formattedUser.role,
        role_name: formattedUser.role_name || formattedUser.roleName || formattedUser.role,
        department: formattedUser.department,
        specialty: formattedUser.specialty || 'lamsang',
        level: parseInt(formattedUser.level) || 1,
        levelName: formattedUser.level_name || formattedUser.levelName || `Bậc ${formattedUser.level || 1}`,
        degree: formattedUser.degree || '',
        academicTitle: formattedUser.academic_title || formattedUser.academicTitle || 'Cử nhân',
        graduationYear: parseInt(formattedUser.graduation_year || formattedUser.graduationYear) || 2018,
        experienceYears: parseInt(formattedUser.experience_years || formattedUser.experienceYears) || 5,
        gender: formattedUser.gender || 'Nữ',
        dob: formattedUser.dob || '15/08/1990',
        lastSkillExamScore: parseInt(formattedUser.last_skill_exam_score || formattedUser.lastSkillExamScore) || 90,
        nckh: formattedUser.nckh || '',
        managerName: formattedUser.manager_name || formattedUser.managerName || 'Ban Điều Dưỡng',
        managerId: formattedUser.manager_id || formattedUser.managerId || null,
        approvalLevel: parseInt(formattedUser.approval_level || formattedUser.approvalLevel) || 0,
        avatar: formattedUser.avatar || 'https://images.unsplash.com/photo-1594824813627-2c13702a4bf7?w=150',
        jobTitle: formattedUser.job_title || formattedUser.jobTitle || formattedUser.role_name || 'Điều dưỡng viên',
        evaluationYear: parseInt(formattedUser.evaluation_year || formattedUser.evaluationYear) || 2026
      };
    }

    if (result.token && typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('umc_auth_token', result.token);
      sessionStorage.setItem('umc_auth_user', JSON.stringify(formattedUser));
    }

    return {
      success: true,
      token: result.token,
      user: formattedUser,
      message: result.message
    };
  } catch (error) {
    return {
      success: false,
      isOffline: true,
      message: 'Không thể kết nối đến máy chủ Backend (Offline fallback): ' + error.message
    };
  }
}

/**
 * Lấy Bearer Token từ sessionStorage
 */
function getAuthToken() {
  if (typeof sessionStorage !== 'undefined') {
    return sessionStorage.getItem('umc_auth_token');
  }
  return null;
}

/**
 * Xóa Token khi đăng xuất
 */
function apiLogout() {
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.removeItem('umc_auth_token');
    sessionStorage.removeItem('umc_auth_user');
  }
}

/**
 * 4. Gửi yêu cầu quên mật khẩu đến Backend API (POST /api/auth/forgot-password)
 * @param {string} identifier - Username / MSNV / Email
 */
async function apiForgotPassword(identifier) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ identifier })
    });
    const result = await response.json();
    return result;
  } catch (error) {
    return {
      success: false,
      isOffline: true,
      message: 'Không thể kết nối Backend API: ' + error.message
    };
  }
}

/**
 * 5. Xác nhận OTP & Đổi mật khẩu mới qua Backend API (POST /api/auth/reset-password)
 * @param {string} identifier - Username / MSNV / Email
 * @param {string} otp - Mã OTP 6 chữ số
 * @param {string} newPassword - Mật khẩu mới
 */
async function apiResetPassword(identifier, otp, newPassword) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ identifier, otp, newPassword })
    });
    const result = await response.json();
    return result;
  } catch (error) {
    return {
      success: false,
      isOffline: true,
      message: 'Không thể kết nối Backend API: ' + error.message
    };
  }
}

// Gắn vào window để gọi được từ bất cứ đâu trong Frontend
if (typeof window !== 'undefined') {
  window.guiYeuCau = guiYeuCau;
  window.layDanhSachYeuCau = layDanhSachYeuCau;
  window.apiLogin = apiLogin;
  window.getAuthToken = getAuthToken;
  window.apiLogout = apiLogout;
  window.apiForgotPassword = apiForgotPassword;
  window.apiResetPassword = apiResetPassword;
}


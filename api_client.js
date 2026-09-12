/**
 * api_client.js - Module Frontend fetch() kết nối Backend API
 * Cung cấp 2 hàm chính: guiYeuCau() và layDanhSachYeuCau()
 */

const API_BASE_URL = 'http://localhost:5000/api';

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

// Gắn vào window để gọi được từ bất cứ đâu trong Frontend
if (typeof window !== 'undefined') {
  window.guiYeuCau = guiYeuCau;
  window.layDanhSachYeuCau = layDanhSachYeuCau;
}

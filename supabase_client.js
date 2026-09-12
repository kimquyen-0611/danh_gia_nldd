/**
 * supabase_client.js - Module Đồng Bộ Đám Mây (Cloud Sync Engine) cho Hệ Thống Đánh Giá NLDD UMC
 * Hỗ trợ chế độ kép:
 *  1. Kết nối qua Backend Express Server (http://localhost:5000/api)
 *  2. Kết nối trực tiếp Supabase Cloud HTTPS REST API (https://ogqblclswauwvqnifbtw.supabase.co)
 *  3. Tự động fallback sang localStorage khi offline
 */

const SUPABASE_CONFIG = {
  url: 'https://ogqblclswauwvqnifbtw.supabase.co',
  publishableKey: 'sb_publishable_RYyEQkRvI7lseqvaSOsIkw_vW4klWtQ',
  backendApiUrl: 'http://localhost:5000/api'
};

const CLOUD_SYNC_STATE = {
  isOnline: false,
  lastSyncTime: null,
  syncMode: 'checking' // 'backend', 'direct', 'offline'
};

/**
 * Kiểm tra tình trạng kết nối Cloud (Backend hoặc Supabase)
 */
async function checkCloudConnection() {
  // 1. Thử kết nối Backend Express Server trước
  try {
    const resBackend = await fetch(`${SUPABASE_CONFIG.backendApiUrl}/status`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    if (resBackend.ok) {
      const data = await resBackend.json();
      CLOUD_SYNC_STATE.isOnline = true;
      CLOUD_SYNC_STATE.syncMode = 'backend';
      return { online: true, mode: 'backend', details: data };
    }
  } catch {
    // Backend offline, chuyển sang kiểm tra Supabase trực tiếp
  }

  // 2. Thử kết nối trực tiếp Supabase Cloud REST
  try {
    const resSupabase = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/yeu_cau?limit=1`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_CONFIG.publishableKey,
        'Authorization': `Bearer ${SUPABASE_CONFIG.publishableKey}`,
        'Accept': 'application/json'
      }
    });
    if (resSupabase.ok) {
      CLOUD_SYNC_STATE.isOnline = true;
      CLOUD_SYNC_STATE.syncMode = 'direct';
      return { online: true, mode: 'direct', details: { url: SUPABASE_CONFIG.url } };
    }
  } catch {
    // Cả hai đều không phản hồi
  }

  CLOUD_SYNC_STATE.isOnline = false;
  CLOUD_SYNC_STATE.syncMode = 'offline';
  return { online: false, mode: 'offline', error: 'Không có kết nối mạng tới Server' };
}

/**
 * Tải danh sách hồ sơ đánh giá từ Cloud
 */
async function cloudFetchSubmissions() {
  const conn = await checkCloudConnection();
  if (!conn.online) return null;

  if (conn.mode === 'backend') {
    try {
      const res = await fetch(`${SUPABASE_CONFIG.backendApiUrl}/submissions`);
      if (res.ok) {
        const json = await res.json();
        return json.data || [];
      }
    } catch (e) {
      console.warn('Lỗi fetch submissions từ backend:', e.message);
    }
  }

  // Direct Supabase
  try {
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/umc_submissions?select=*&order=updated_at.desc`, {
      headers: {
        'apikey': SUPABASE_CONFIG.publishableKey,
        'Authorization': `Bearer ${SUPABASE_CONFIG.publishableKey}`,
        'Accept': 'application/json'
      }
    });
    if (res.ok) {
      const data = await res.json();
      return (data || []).map(formatSubmissionFromDb);
    }
  } catch (e) {
    console.warn('Lỗi fetch submissions từ Supabase:', e.message);
  }
  return null;
}

/**
 * Đồng bộ hồ sơ đánh giá lên Cloud
 */
async function cloudSyncSubmission(sub) {
  if (!sub || !sub.id) return false;

  const conn = await checkCloudConnection();
  if (!conn.online) return false;

  const payload = {
    id: sub.id,
    user_id: sub.userId || sub.user_id,
    full_name: sub.fullName || sub.full_name,
    msnv: sub.msnv,
    department: sub.department,
    specialty: sub.specialty || 'lamsang',
    year: parseInt(sub.year) || 2026,
    status: sub.status || 'draft',
    total_score: parseInt(sub.totalScore || sub.total_score) || 0,
    evaluated_tier: parseInt(sub.evaluatedTier || sub.evaluated_tier) || 1,
    target_tier: parseInt(sub.targetTier || sub.target_tier) || 2,
    scores: sub.scores || {},
    domain_scores: sub.domainScores || sub.domain_scores || {},
    evidences: sub.evidences || {},
    timeline: sub.timeline || [],
    l1_approved_by: sub.l1ApprovedBy || sub.l1_approved_by || null,
    l1_approved_at: sub.l1ApprovedAt || sub.l1_approved_at || null,
    l2_approved_by: sub.l2ApprovedBy || sub.l2_approved_by || null,
    l2_approved_at: sub.l2ApprovedAt || sub.l2_approved_at || null,
    l3_approved_by: sub.l3ApprovedBy || sub.l3_approved_by || null,
    l3_approved_at: sub.l3ApprovedAt || sub.l3_approved_at || null,
    updated_at: new Date().toISOString()
  };

  // Ưu tiên Backend nếu đang chạy
  if (conn.mode === 'backend') {
    try {
      const res = await fetch(`${SUPABASE_CONFIG.backendApiUrl}/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub)
      });
      if (res.ok) return true;
    } catch (e) {
      console.warn('Lỗi sync submission qua backend:', e.message);
    }
  }

  // Direct Supabase REST Upsert
  try {
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/umc_submissions?on_conflict=id`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_CONFIG.publishableKey,
        'Authorization': `Bearer ${SUPABASE_CONFIG.publishableKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch (e) {
    console.warn('Lỗi sync submission qua Supabase direct:', e.message);
    return false;
  }
}

/**
 * Tải danh sách nhân sự từ Cloud
 */
async function cloudFetchUsers() {
  const conn = await checkCloudConnection();
  if (!conn.online) return null;

  if (conn.mode === 'backend') {
    try {
      const res = await fetch(`${SUPABASE_CONFIG.backendApiUrl}/users`);
      if (res.ok) {
        const json = await res.json();
        return (json.data || []).map(formatUserFromDb);
      }
    } catch (e) {
      console.warn('Lỗi fetch users từ backend:', e.message);
    }
  }

  try {
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/umc_users?select=*&order=msnv.asc`, {
      headers: {
        'apikey': SUPABASE_CONFIG.publishableKey,
        'Authorization': `Bearer ${SUPABASE_CONFIG.publishableKey}`,
        'Accept': 'application/json'
      }
    });
    if (res.ok) {
      const data = await res.json();
      return (data || []).map(formatUserFromDb);
    }
  } catch (e) {
    console.warn('Lỗi fetch users từ Supabase direct:', e.message);
  }
  return null;
}

/**
 * Đồng bộ danh sách nhân sự lên Cloud
 */
async function cloudSyncUsers(users) {
  if (!users || users.length === 0) return false;

  const conn = await checkCloudConnection();
  if (!conn.online) return false;

  if (conn.mode === 'backend') {
    try {
      const res = await fetch(`${SUPABASE_CONFIG.backendApiUrl}/users/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(users)
      });
      if (res.ok) return true;
    } catch (e) {
      console.warn('Lỗi sync users qua backend:', e.message);
    }
  }

  try {
    const formatted = users.map(u => ({
      id: u.id,
      user_name: u.userName || u.user_name || u.id,
      msnv: u.msnv,
      password: u.password || '123',
      full_name: u.fullName || u.full_name,
      email: u.email || null,
      phone: u.phone || null,
      role: u.role,
      role_name: u.roleName || u.role_name,
      department: u.department,
      specialty: u.specialty || 'lamsang',
      level: parseInt(u.level) || 1,
      level_name: u.levelName || u.level_name,
      degree: u.degree || null,
      academic_title: u.academicTitle || u.academic_title || null,
      graduation_year: parseInt(u.graduationYear || u.graduation_year) || 2018,
      experience_years: parseInt(u.experienceYears || u.experience_years) || 5,
      gender: u.gender || 'Nữ',
      dob: u.dob || null,
      last_skill_exam_score: parseInt(u.lastSkillExamScore || u.last_skill_exam_score) || 90,
      nckh: u.nckh || null,
      manager_name: u.managerName || u.manager_name || null,
      manager_id: u.managerId || u.manager_id || null,
      approval_level: parseInt(u.approvalLevel || u.approval_level) || 0,
      avatar: u.avatar || null,
      updated_at: new Date().toISOString()
    }));

    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/umc_users?on_conflict=id`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_CONFIG.publishableKey,
        'Authorization': `Bearer ${SUPABASE_CONFIG.publishableKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(formatted)
    });
    return res.ok;
  } catch (e) {
    console.warn('Lỗi sync users qua Supabase direct:', e.message);
    return false;
  }
}

// Chuyển đổi dữ liệu từ format DB (snake_case) sang format JS (camelCase)
function formatUserFromDb(dbUser) {
  if (!dbUser) return null;
  return {
    id: dbUser.id,
    userName: dbUser.user_name || dbUser.userName,
    msnv: dbUser.msnv,
    password: dbUser.password || '123',
    fullName: dbUser.full_name || dbUser.fullName,
    email: dbUser.email,
    phone: dbUser.phone,
    role: dbUser.role,
    roleName: dbUser.role_name || dbUser.roleName,
    department: dbUser.department,
    specialty: dbUser.specialty,
    level: dbUser.level,
    levelName: dbUser.level_name || dbUser.levelName,
    degree: dbUser.degree,
    academicTitle: dbUser.academic_title || dbUser.academicTitle,
    graduationYear: dbUser.graduation_year || dbUser.graduationYear,
    experienceYears: dbUser.experience_years || dbUser.experienceYears,
    gender: dbUser.gender,
    dob: dbUser.dob,
    lastSkillExamScore: dbUser.last_skill_exam_score || dbUser.lastSkillExamScore,
    nckh: dbUser.nckh,
    managerName: dbUser.manager_name || dbUser.managerName,
    managerId: dbUser.manager_id || dbUser.managerId,
    approvalLevel: dbUser.approval_level || dbUser.approvalLevel,
    avatar: dbUser.avatar
  };
}

function formatSubmissionFromDb(dbSub) {
  if (!dbSub) return null;
  return {
    id: dbSub.id,
    userId: dbSub.user_id || dbSub.userId,
    fullName: dbSub.full_name || dbSub.fullName,
    msnv: dbSub.msnv,
    department: dbSub.department,
    specialty: dbSub.specialty,
    year: dbSub.year || 2026,
    status: dbSub.status || 'draft',
    totalScore: dbSub.total_score || dbSub.totalScore || 0,
    evaluatedTier: dbSub.evaluated_tier || dbSub.evaluatedTier || 1,
    targetTier: dbSub.target_tier || dbSub.targetTier || 2,
    scores: dbSub.scores || {},
    domainScores: dbSub.domain_scores || dbSub.domainScores || {},
    evidences: dbSub.evidences || {},
    timeline: dbSub.timeline || [],
    l1ApprovedBy: dbSub.l1_approved_by || dbSub.l1ApprovedBy,
    l1ApprovedAt: dbSub.l1_approved_at || dbSub.l1ApprovedAt,
    l2ApprovedBy: dbSub.l2_approved_by || dbSub.l2ApprovedBy,
    l2ApprovedAt: dbSub.l2_approved_at || dbSub.l2ApprovedAt,
    l3ApprovedBy: dbSub.l3_approved_by || dbSub.l3ApprovedBy,
    l3ApprovedAt: dbSub.l3_approved_at || dbSub.l3ApprovedAt,
    updatedAt: dbSub.updated_at || dbSub.updatedAt
  };
}

// Giữ lại các hàm cũ cho bảng yeu_cau
async function guiYeuCauSupabase(duLieu) {
  try {
    const response = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/yeu_cau`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_CONFIG.publishableKey,
        'Authorization': `Bearer ${SUPABASE_CONFIG.publishableKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(duLieu)
    });
    if (!response.ok) throw new Error('Lỗi lưu dữ liệu');
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error('Lỗi gửi Supabase:', error);
    return null;
  }
}

async function layDanhSachSupabase(limit = 20) {
  try {
    const response = await fetch(
      `${SUPABASE_CONFIG.url}/rest/v1/yeu_cau?select=*&order=created_at.desc&limit=${limit}`,
      {
        headers: {
          'apikey': SUPABASE_CONFIG.publishableKey,
          'Authorization': `Bearer ${SUPABASE_CONFIG.publishableKey}`,
          'Accept': 'application/json'
        }
      }
    );
    if (!response.ok) throw new Error('Không thể tải danh sách');
    return await response.json();
  } catch (error) {
    console.error('Lỗi lấy danh sách:', error);
    return [];
  }
}

// Xuất các hàm ra phạm vi toàn cục window
if (typeof window !== 'undefined') {
  window.checkCloudConnection = checkCloudConnection;
  window.cloudFetchSubmissions = cloudFetchSubmissions;
  window.cloudSyncSubmission = cloudSyncSubmission;
  window.cloudFetchUsers = cloudFetchUsers;
  window.cloudSyncUsers = cloudSyncUsers;
  window.guiYeuCauSupabase = guiYeuCauSupabase;
  window.layDanhSachSupabase = layDanhSachSupabase;
  window.CLOUD_SYNC_STATE = CLOUD_SYNC_STATE;
  window.SUPABASE_CONFIG = SUPABASE_CONFIG;
}

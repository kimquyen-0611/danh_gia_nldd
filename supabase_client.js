/**
 * supabase_client.js - Module Đồng Bộ Đám Mây (Cloud Sync Engine) cho Hệ Thống Đánh Giá NLDD UMC
 * Hỗ trợ chế độ kép:
 *  1. Kết nối qua Backend Express Server
 *  2. Kết nối trực tiếp Supabase Cloud HTTPS REST API
 *  3. Tự động fallback sang localStorage khi offline
 */

const SUPABASE_CONFIG = {
  url: 'https://ogqblclswauwvqnifbtw.supabase.co',
  publishableKey: 'YOUR_SUPABASE_PUBLISHABLE_KEY_HERE',
  backendApiUrl: (typeof window !== 'undefined' && window.API_BASE_URL) 
    ? window.API_BASE_URL 
    : ((typeof window !== 'undefined' && window.location && window.location.origin && window.location.origin.startsWith('http'))
        ? `${window.location.origin}/api`
        : 'http://localhost:5000/api')
};

const CLOUD_SYNC_STATE = {
  isOnline: false,
  lastSyncTime: null,
  syncMode: 'checking'
};

function getCloudAuthHeader() {
  let token = null;
  if (typeof getAuthToken === 'function') {
    token = getAuthToken();
  }
  if (!token && typeof sessionStorage !== 'undefined') {
    token = sessionStorage.getItem('umc_auth_token');
  }
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function checkCloudConnection() {
  // 1. Thử kết nối Backend Express Server trước
  try {
    const resBackend = await fetch(`${SUPABASE_CONFIG.backendApiUrl}/status`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    if (resBackend.ok) {
      CLOUD_SYNC_STATE.isOnline = true;
      CLOUD_SYNC_STATE.syncMode = 'backend';
      return { online: true, mode: 'backend' };
    }
  } catch {
    // Backend offline, chuyển sang Supabase trực tiếp
  }

  // 2. Thử kết nối trực tiếp Supabase Cloud REST
  try {
    const resSupabase = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/umc_submissions?limit=1`, {
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
      return { online: true, mode: 'direct' };
    }
  } catch {
    // Không phản hồi
  }

  CLOUD_SYNC_STATE.isOnline = false;
  CLOUD_SYNC_STATE.syncMode = 'offline';
  return { online: false, mode: 'offline' };
}

function formatSubmissionFromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    fullName: row.full_name,
    msnv: row.msnv,
    department: row.department,
    specialty: row.specialty,
    year: row.year,
    status: row.status,
    totalScore: row.total_score,
    selfScore: row.self_score || row.total_score,
    evaluatedTier: row.evaluated_tier,
    targetTier: row.target_tier,
    scores: row.scores || {},
    domainScores: row.domain_scores || {},
    evidences: row.evidences || {},
    criterionEvidences: row.evidences || {},
    timeline: row.timeline || [],
    history: row.timeline || [],
    l1ApprovedBy: row.l1_approved_by,
    l1ApprovedAt: row.l1_approved_at,
    l2ApprovedBy: row.l2_approved_by,
    l2ApprovedAt: row.l2_approved_at,
    l3ApprovedBy: row.l3_approved_by,
    l3ApprovedAt: row.l3_approved_at,
    updatedAt: row.updated_at
  };
}

async function cloudFetchSubmissions() {
  const conn = await checkCloudConnection();
  if (!conn.online) return null;

  if (conn.mode === 'backend') {
    try {
      const res = await fetch(`${SUPABASE_CONFIG.backendApiUrl}/submissions`, {
        headers: { 'Accept': 'application/json', ...getCloudAuthHeader() }
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || [];
      }
    } catch (e) {
      console.warn('Lỗi fetch submissions từ backend:', e.message);
    }
  }

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
    console.warn('Lỗi fetch submissions từ Supabase direct:', e.message);
  }
  return null;
}

async function cloudSyncSubmission(sub) {
  if (!sub || !sub.id) return false;

  const conn = await checkCloudConnection();
  const timelineData = Array.isArray(sub.timeline) ? sub.timeline : (Array.isArray(sub.history) ? sub.history : []);
  const critEvs = (sub.criterionEvidences && typeof sub.criterionEvidences === 'object' && Object.keys(sub.criterionEvidences).length > 0) ? sub.criterionEvidences : null;
  const legEvs = (sub.evidences && typeof sub.evidences === 'object' && Object.keys(sub.evidences).length > 0) ? sub.evidences : null;
  const evidencesData = critEvs || legEvs || sub.criterionEvidences || sub.evidences || {};

  // PAYLOAD CHUẨN POSTGRESQL SCHEMA (LOẠI BỎ CÁC TRƯỜNG LẠ GÂY LỖI 400)
  const cleanPayload = {
    id: String(sub.id),
    user_id: String(sub.userId || sub.user_id || (APP_STATE.currentUser && APP_STATE.currentUser.id)),
    full_name: String(sub.fullName || sub.full_name || (APP_STATE.currentUser && APP_STATE.currentUser.fullName) || 'Điều Dưỡng UMC'),
    msnv: String(sub.msnv || (APP_STATE.currentUser && APP_STATE.currentUser.msnv) || 'UMC-001'),
    department: String(sub.department || (APP_STATE.currentUser && APP_STATE.currentUser.department) || 'Lâm Sàng'),
    specialty: String(sub.specialty || (APP_STATE.currentUser && APP_STATE.currentUser.specialty) || 'lamsang'),
    year: parseInt(sub.year) || 2026,
    status: String(sub.status || 'draft'),
    total_score: parseInt(sub.totalScore || sub.total_score) || 0,
    evaluated_tier: parseInt(sub.evaluatedTier || sub.evaluated_tier) || 1,
    target_tier: parseInt(sub.targetTier || sub.target_tier) || 2,
    scores: sub.scores || {},
    domain_scores: sub.domainScores || sub.domain_scores || {},
    evidences: evidencesData,
    timeline: timelineData,
    l1_approved_by: sub.l1ApprovedBy || sub.l1_approved_by || null,
    l1_approved_at: sub.l1ApprovedAt || sub.l1_approved_at || null,
    l2_approved_by: sub.l2ApprovedBy || sub.l2_approved_by || null,
    l2_approved_at: sub.l2ApprovedAt || sub.l2_approved_at || null,
    l3_approved_by: sub.l3ApprovedBy || sub.l3_approved_by || null,
    l3_approved_at: sub.l3ApprovedAt || sub.l3_approved_at || null,
    updated_at: new Date().toISOString()
  };

  // 1. Thử gửi qua Backend Server trước nếu online
  if (conn.mode === 'backend') {
    try {
      const res = await fetch(`${SUPABASE_CONFIG.backendApiUrl}/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getCloudAuthHeader()
        },
        body: JSON.stringify(cleanPayload)
      });
      if (res.ok) {
        console.log('✅ Đã đồng bộ hồ sơ qua Backend:', cleanPayload.id);
        return true;
      }
    } catch (e) {
      console.warn('Backend sync failed, falling back to direct Supabase:', e.message);
    }
  }

  // 2. Đồng bộ trực tiếp Supabase Cloud REST API
  try {
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/umc_submissions?on_conflict=id`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_CONFIG.publishableKey,
        'Authorization': `Bearer ${SUPABASE_CONFIG.publishableKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates,return=representation'
      },
      body: JSON.stringify(cleanPayload)
    });

    if (res.ok) {
      console.log('✅ Đã đồng bộ trực tiếp lên Supabase thành công:', cleanPayload.id, 'Điểm:', cleanPayload.total_score);
      return true;
    } else {
      const errText = await res.text();
      console.warn('⚠️ Lỗi phản hồi từ Supabase REST:', res.status, errText);
      return false;
    }
  } catch (e) {
    console.warn('Lỗi kết nối mạng khi sync Supabase:', e.message);
    return false;
  }
}

async function cloudFetchUsers() {
  const conn = await checkCloudConnection();
  if (!conn.online) return null;

  try {
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/umc_users?select=*&order=msnv.asc`, {
      headers: {
        'apikey': SUPABASE_CONFIG.publishableKey,
        'Authorization': `Bearer ${SUPABASE_CONFIG.publishableKey}`,
        'Accept': 'application/json'
      }
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Lỗi fetch users từ Supabase direct:', e.message);
  }
  return null;
}

async function cloudSyncUsers(users) {
  if (!users || users.length === 0) return false;
  try {
    const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/umc_users?on_conflict=id`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_CONFIG.publishableKey,
        'Authorization': `Bearer ${SUPABASE_CONFIG.publishableKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(users)
    });
    return res.ok;
  } catch (e) {
    console.warn('Lỗi sync users:', e.message);
    return false;
  }
}

if (typeof window !== 'undefined') {
  window.cloudSyncSubmission = cloudSyncSubmission;
  window.cloudFetchSubmissions = cloudFetchSubmissions;
  window.cloudFetchUsers = cloudFetchUsers;
  window.cloudSyncUsers = cloudSyncUsers;
  window.checkCloudConnection = checkCloudConnection;
}

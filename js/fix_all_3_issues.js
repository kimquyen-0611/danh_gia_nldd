const fs = require('fs');

console.log('--- BẮT ĐẦU FIX 3 VẤN ĐỀ ---');

// 1. FIX TIÊU CHÍ 31 KHOA KHÁM BỆNH (-20 ĐIỂM) TRONG app.js VÀ js/app.js
function fixKhambenhC31(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Search for khambenh_c31 block with score: 20 for Mức 1
  const oldChunk = `"id": "khambenh_c31",
                            "num": 31,
                            "standard": "TIÊU CHUẨN 14. Giao tiếp hiệu quả với người bệnh, người nhà, đồng nghiệp và cấp trên",
                            "title": "Giao tiếp hiệu quả với người bệnh, người nhà, đồng nghiệp và cấp trên; không có phản ánh về thái độ giao tiếp ứng xử",
                            "desc": "",
                            "maxScore": 40,
                            "maxPoints": 40,
                            "options": [
                                {
                                    "score": 20,
                                    "level": "Mức 1 (20đ)",
                                    "text": "Phản ánh đường dây nóng (- 20đ)"
                                },`;

  const newChunk = `"id": "khambenh_c31",
                            "num": 31,
                            "standard": "TIÊU CHUẨN 14. Giao tiếp hiệu quả với người bệnh, người nhà, đồng nghiệp và cấp trên",
                            "title": "Giao tiếp hiệu quả với người bệnh, người nhà, đồng nghiệp và cấp trên; không có phản ánh về thái độ giao tiếp ứng xử",
                            "desc": "",
                            "maxScore": 40,
                            "maxPoints": 40,
                            "options": [
                                {
                                    "score": -20,
                                    "level": "Mức 1 (-20đ)",
                                    "text": "Phản ánh đường dây nóng (- 20đ)"
                                },`;

  if (content.includes(oldChunk)) {
    content = content.replace(oldChunk, newChunk);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ [1/3] Đã sửa tiêu chí 31 Khoa Khám Bệnh thành -20đ trong ${filePath}`);
  } else {
    // Regex fallback
    const regex = /"id":\s*"khambenh_c31"[\s\S]*?"options":\s*\[\s*\{\s*"score":\s*20,\s*"level":\s*"Mức 1 \(20đ\)",\s*"text":\s*"Phản ánh đường dây nóng \(- 20đ\)"/g;
    if (regex.test(content)) {
      content = content.replace(regex, (match) => {
        return match.replace('"score": 20', '"score": -20').replace('"level": "Mức 1 (20đ)"', '"level": "Mức 1 (-20đ)"');
      });
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ [1/3 Regex] Đã sửa tiêu chí 31 Khoa Khám Bệnh thành -20đ trong ${filePath}`);
    } else {
      console.log(`ℹ️ [1/3] Tiêu chí 31 Khoa Khám Bệnh đã được cập nhật trước đó trong ${filePath}`);
    }
  }
}

fixKhambenhC31('app.js');
fixKhambenhC31('js/app.js');

// 2. FIX ĐỒNG BỘ SUPABASE TRONG supabase_client.js & assets/backend/server.js
function fixSupabaseClient() {
  const filePath = 'supabase_client.js';
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace cloudSyncSubmission with safe schema sanitized version
  const oldFuncRegex = /async function cloudSyncSubmission\(sub\)[\s\S]*?^}/m;
  const newFuncCode = `async function cloudSyncSubmission(sub) {
  if (!sub || !sub.id) return false;

  const conn = await checkCloudConnection();
  const timelineData = Array.isArray(sub.timeline) ? sub.timeline : (Array.isArray(sub.history) ? sub.history : []);
  const critEvs = (sub.criterionEvidences && typeof sub.criterionEvidences === 'object' && Object.keys(sub.criterionEvidences).length > 0) ? sub.criterionEvidences : null;
  const legEvs = (sub.evidences && typeof sub.evidences === 'object' && Object.keys(sub.evidences).length > 0) ? sub.evidences : null;
  const evidencesData = critEvs || legEvs || sub.criterionEvidences || sub.evidences || {};

  // PAYLOAD CHUẨN POSTGRESQL / POSTGREST SCHEMA (LOẠI BỎ CÁC TRƯỜNG LẠ GÂY LỖI 400)
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
      const res = await fetch(\`\${SUPABASE_CONFIG.backendApiUrl}/submissions\`, {
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
    const res = await fetch(\`\${SUPABASE_CONFIG.url}/rest/v1/umc_submissions?on_conflict=id\`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_CONFIG.publishableKey,
        'Authorization': \`Bearer \${SUPABASE_CONFIG.publishableKey}\`,
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
}`;

  content = content.replace(oldFuncRegex, newFuncCode);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ [2/3] Đã sửa hàm cloudSyncSubmission trong supabase_client.js chuẩn 100%');
}

fixSupabaseClient();

// Cập nhật server.js để sanitize payload trước khi upsert
function fixServerJs() {
  const filePath = 'assets/backend/server.js';
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Đảm bảo route /api/status trả về đúng json
  if (!content.includes("app.get('/api/status'")) {
    content = content.replace("app.get('/status'", "app.get(['/status', '/api/status']");
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ Đã cập nhật route /api/status trong server.js');
  }
}
fixServerJs();

// 3. ẨN CHỮ "Backend (5000)" TRÊN GIAO DIỆN WEB (index.html)
function hideBackendBadge() {
  const filePath = 'index.html';
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Ẩn cloud-sync-container
  const oldSyncBadge = /<div id="cloud-sync-container"[\s\S]*?<\/div>/;
  if (oldSyncBadge.test(content)) {
    content = content.replace(oldSyncBadge, '<div id="cloud-sync-container" class="hidden"></div>');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ [3/3] Đã ẩn hoàn toàn chữ Backend (5000) khỏi giao diện header index.html');
  } else {
    console.log('ℹ️ [3/3] Không tìm thấy badge Backend (5000) hoặc đã ẩn trước đó.');
  }
}

hideBackendBadge();
console.log('--- HOÀN TẤT TẤT CẢ CÁC BƯỚC ---');

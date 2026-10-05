import worker from './worker.js';

async function runTests() {
  console.log('====================================================');
  console.log('🧪 BAT DAU KIEM TRA CLOUDFLARE WORKER TAI CHO...');
  console.log('====================================================\n');

  const env = {
    SUPABASE_URL: 'https://bmnbwofludntkmjeskqj.supabase.co',
    SUPABASE_SECRET_KEY: (typeof process !== 'undefined' && process.env && process.env.SUPABASE_SECRET_KEY) || '',
    SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_QdZyIMIhGJmnuG_UG0NL3g_FIjgyYis',
    JWT_SECRET: 'umc-nursing-competency-auth-secret-key-2026',
    ALLOWED_ORIGIN: '*'
  };

  let passed = 0;
  let total = 0;

  async function assert(name, fn) {
    total++;
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}: ${err.message}`);
    }
  }

  // Test 1: OPTIONS CORS Preflight
  await assert('1. OPTIONS Preflight CORS Headers', async () => {
    const req = new Request('https://umc.workers.dev/api/auth/login', {
      method: 'OPTIONS',
      headers: { Origin: 'https://danh-gia-nldd-umc.pages.dev' }
    });
    const res = await worker.fetch(req, env);
    if (res.status !== 204) throw new Error(`Expected 204, got ${res.status}`);
    const allowOrigin = res.headers.get('Access-Control-Allow-Origin');
    if (!allowOrigin) throw new Error('Missing Access-Control-Allow-Origin header');
  });

  // Test 2: GET /api/health
  await assert('2. GET /api/health', async () => {
    const req = new Request('https://umc.workers.dev/api/health', { method: 'GET' });
    const res = await worker.fetch(req, env);
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const json = await res.json();
    if (json.status !== 'ok') throw new Error(`Expected status ok, got ${json.status}`);
  });

  // Test 3: POST /api/auth/login (Fallback / Initial Users)
  let authToken = null;
  await assert('3. POST /api/auth/login with admin/123', async () => {
    const req = new Request('https://umc.workers.dev/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: '123' })
    });
    const res = await worker.fetch(req, env);
    const json = await res.json();
    if (!json.success) throw new Error(`Login failed: ${json.message}`);
    if (!json.token) throw new Error('Missing token in response');
    if (!json.user || json.user.role !== 'admin') throw new Error('Invalid user object in response');
    if (json.user.password) throw new Error('CRITICAL SECURITY: password leaked in user object!');
    authToken = json.token;
  });

  // Test 4: GET /api/auth/me (Protected Route with JWT)
  await assert('4. GET /api/auth/me (Protected route verification)', async () => {
    if (!authToken) throw new Error('Skipped: no auth token');
    const req = new Request('https://umc.workers.dev/api/auth/me', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const res = await worker.fetch(req, env);
    const json = await res.json();
    if (!json.success) throw new Error(`Me route failed: ${json.message}`);
    if (json.user.id !== 'usr_admin') throw new Error(`Expected usr_admin, got ${json.user.id}`);
  });

  // Test 5: GET /api/submissions/years
  await assert('5. GET /api/submissions/years', async () => {
    const req = new Request('https://umc.workers.dev/api/submissions/years', { method: 'GET' });
    const res = await worker.fetch(req, env);
    const json = await res.json();
    if (!json.success || !Array.isArray(json.years)) throw new Error('Failed to retrieve years');
  });

  // Test 6: POST /api/yeu-cau Validation Failure
  await assert('6. POST /api/yeu-cau Validation Check', async () => {
    const req = new Request('https://umc.workers.dev/api/yeu-cau', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ho_ten: '', noi_dung: '' })
    });
    const res = await worker.fetch(req, env);
    if (res.status !== 400) throw new Error(`Expected 400 validation error, got ${res.status}`);
  });

  // Test 7: Non-existent API route 404
  await assert('7. Non-existent API route returns 404', async () => {
    const req = new Request('https://umc.workers.dev/api/unknown-endpoint-test', { method: 'GET' });
    const res = await worker.fetch(req, env);
    if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`);
  });

  // Test 8: Cloudflare Pages ASSETS Fallback
  await assert('8. Cloudflare Pages ASSETS Fallback', async () => {
    let assetsFetched = false;
    const mockEnv = {
      ...env,
      ASSETS: {
        fetch: async (r) => {
          assetsFetched = true;
          return new Response('Mock HTML index', { status: 200 });
        }
      }
    };
    const req = new Request('https://umc.workers.dev/index.html', { method: 'GET' });
    const res = await worker.fetch(req, mockEnv);
    if (!assetsFetched) throw new Error('env.ASSETS.fetch was not called for static file');
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
  });

  console.log('\n====================================================');
  console.log(`🎯 KET QUA TEST: ${passed}/${total} TESTS DA HOAN THANH XUAT SAC!`);
  console.log('====================================================');
}

runTests().catch(err => {
  console.error('Fatal error during test:', err);
  process.exit(1);
});

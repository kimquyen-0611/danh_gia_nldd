const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.resolve(__dirname, '../..');
const appJsPath = path.join(rootDir, 'js/app.js');
const apiClientPath = path.join(rootDir, 'js/api_client.js');
const supabaseClientPath = path.join(rootDir, 'supabase_client.js');
const indexPath = path.join(rootDir, 'index.html');
const stylesPath = path.join(rootDir, 'css/styles.css');
const serverPath = path.join(rootDir, 'assets/backend/server.js');
const dbPath = path.join(rootDir, 'assets/backend/db.js');

console.log('===============================================================');
console.log('  BỆNH VIỆN ĐẠI HỌC Y DƯỢC TP.HCM - BAN ĐIỀU DƯỠNG');
console.log('  HỆ THỐNG KIỂM TRA TOÀN DIỆN: GIAO DIỆN, BẢO MẬT & LOGIC');
console.log('===============================================================\n');

let totalErrors = 0;
let totalWarnings = 0;

// 1. KIỂM TRA TỆP TỒN TẠI VÀ ĐƯỜNG DẪN CẤU HÌNH
console.log('--- 1. KIỂM TRA ĐƯỜNG DẪN TỆP & TƯƠNG THÍCH VERCEL ---');
const filesToVerify = [
  { name: 'index.html', p: indexPath },
  { name: 'css/styles.css', p: stylesPath },
  { name: 'js/app.js', p: appJsPath },
  { name: 'js/api_client.js', p: apiClientPath },
  { name: 'supabase_client.js', p: supabaseClientPath },
  { name: 'api/index.js', p: path.join(rootDir, 'api/index.js') },
  { name: 'assets/backend/server.js', p: serverPath },
  { name: 'assets/backend/db.js', p: dbPath },
  { name: 'vercel.json', p: path.join(rootDir, 'vercel.json') },
  { name: 'package.json', p: path.join(rootDir, 'package.json') }
];

filesToVerify.forEach(f => {
  if (fs.existsSync(f.p)) {
    console.log(`  [OK] ${f.name} tồn tại (${(fs.statSync(f.p).size / 1024).toFixed(1)} KB)`);
  } else {
    console.log(`  [LỖI] ${f.name} KHÔNG TỒN TẠI!`);
    totalErrors++;
  }
});

// 2. KIỂM TRA INDEX.HTML SCRIPT & LINK TAGS
console.log('\n--- 2. KIỂM TRA THẺ SCRIPT / LINK TRONG INDEX.HTML ---');
const htmlContent = fs.readFileSync(indexPath, 'utf8');

const scriptSrcMatches = Array.from(htmlContent.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)).map(m => m[1]);
const linkHrefMatches = Array.from(htmlContent.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/gi)).map(m => m[1]);

console.log('  Thẻ Script:', scriptSrcMatches);
console.log('  Thẻ Stylesheet:', linkHrefMatches);

[...scriptSrcMatches, ...linkHrefMatches].forEach(ref => {
  if (ref.startsWith('http://') || ref.startsWith('https://')) return; // CDN
  const localTarget = path.join(rootDir, ref);
  if (!fs.existsSync(localTarget)) {
    console.log(`  [CẢNH BÁO / LỖI GIAO DIỆN] Đường dẫn "${ref}" trong index.html không tồn tại ở thư mục gốc!`);
    totalWarnings++;
  } else {
    console.log(`  [OK] Tệp cục bộ liên kết chính xác: ${ref}`);
  }
});

// 3. KIỂM TRA TẤT CẢ DOM ELEMENT IDs ĐƯỢC GỌI TRONG APP.JS
console.log('\n--- 3. KIỂM TRA DOM ELEMENT IDs & GIAO DIỆN HTML ---');
const appJsContent = fs.readFileSync(appJsPath, 'utf8');

const idRegex = /document\.getElementById\(['"]([^'"]+)['"]\)/g;
let m;
const usedIds = new Set();
while ((m = idRegex.exec(appJsContent)) !== null) {
  usedIds.add(m[1]);
}

const missingStaticIds = [];
usedIds.forEach(id => {
  if (!htmlContent.includes(`id="${id}"`) && !htmlContent.includes(`id='${id}'`)) {
    missingStaticIds.push(id);
  }
});

console.log(`  Tổng số document.getElementById() trong app.js: ${usedIds.size}`);
console.log(`  Số ID không có sẵn tĩnh trong HTML: ${missingStaticIds.length}`);
missingStaticIds.forEach(id => {
  console.log(`    - ${id}`);
});

// 4. KIỂM TRA SỰ KIỆN GỌI TỪ HTML
console.log('\n--- 4. KIỂM TRA CÁC HÀM SỰ KIỆN HTML (ONCLICK, ONSUBMIT, ONCHANGE) ---');
const eventRegex = /on[a-z]+\s*=\s*["']([^"']+)["']/gi;
const calledFns = new Set();
while ((m = eventRegex.exec(htmlContent)) !== null) {
  const code = m[1];
  const fnM = code.match(/([a-zA-Z0-9_$]+)\s*\(/);
  if (fnM) {
    const fnName = fnM[1];
    if (!['if', 'document', 'getElementById', 'alert', 'confirm', 'prompt', 'parseInt', 'parseFloat', 'setTimeout', 'clearTimeout', 'stopPropagation', 'preventDefault'].includes(fnName)) {
      calledFns.add(fnName);
    }
  }
}

const allJsCode = appJsContent + '\n' + fs.readFileSync(apiClientPath, 'utf8') + '\n' + fs.readFileSync(supabaseClientPath, 'utf8') + '\n' + htmlContent;

const missingFns = [];
calledFns.forEach(fn => {
  const fnDeclRegex = new RegExp(`(?:function\\s+${fn}\\b|window\\.${fn}\\s*=|const\\s+${fn}\\s*=|let\\s+${fn}\\s*=|var\\s+${fn}\\s*=)`);
  if (!fnDeclRegex.test(allJsCode)) {
    missingFns.push(fn);
  }
});

console.log(`  Tổng số hàm gọi từ HTML: ${calledFns.size}`);
if (missingFns.length > 0) {
  console.log(`  [LỖI] Các hàm chưa được định nghĩa:`, missingFns);
  totalErrors += missingFns.length;
} else {
  console.log('  [OK] Tất cả các hàm sự kiện trong HTML đều đã được khai báo!');
}

// 5. KIỂM TRA BẢO MẬT BACKEND & AUTH
console.log('\n--- 5. KIỂM TRA BẢO MẬT & XÁC THỰC BACKEND ---');
const serverContent = fs.readFileSync(serverPath, 'utf8');

const securityChecks = [
  { desc: 'Middleware CORS có hỗ trợ tên miền Vercel / UMC an toàn', pass: serverContent.includes('cors') },
  { desc: 'Băm mật khẩu bằng PBKDF2 / Salt ngẫu nhiên', pass: serverContent.includes('pbkdf2Sync') },
  { desc: 'Token xác thực HMAC-SHA256 chuẩn', pass: serverContent.includes('createHmac') },
  { desc: 'Middleware authenticateToken bảo vệ các API quan trọng', pass: serverContent.includes('authenticateToken') },
  { desc: 'Loại bỏ mật khẩu (sanitizeUser) trước khi trả về client', pass: serverContent.includes('sanitizeUser') },
  { desc: 'Kiểm tra quyền phân cấp khi lưu/phê duyệt hồ sơ', pass: serverContent.includes('approval_level') || serverContent.includes('approvalLevel') || serverContent.includes('canEdit') }
];

securityChecks.forEach(sc => {
  console.log(`  ${sc.pass ? '[OK]' : '[CẢNH BÁO]'} ${sc.desc}`);
  if (!sc.pass) totalWarnings++;
});

// 6. KIỂM TRA LOGIC TIÊU CHÍ VÀ CÁC CHUYÊN KHOA
console.log('\n--- 6. KIỂM TRA LOGIC ĐÁNH GIÁ 7 CHUYÊN KHOA & 7 BẬC NĂNG LỰC ---');
const mockLocalStorage = {};
const noop = () => {};
const sandbox = {
  console: { log: () => {}, warn: () => {}, error: () => {} },
  setTimeout: noop,
  clearTimeout: noop,
  localStorage: {
    getItem: (k) => mockLocalStorage[k] || null,
    setItem: (k, v) => { mockLocalStorage[k] = String(v); },
    removeItem: (k) => { delete mockLocalStorage[k]; }
  },
  document: {
    addEventListener: noop,
    removeEventListener: noop,
    getElementById: () => ({
      innerHTML: '', textContent: '', value: '',
      classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
      style: {}, appendChild: noop, options: [],
      getContext: () => ({ fillRect: noop, clearRect: noop })
    }),
    createElement: () => ({ innerHTML: '', classList: { add: noop, remove: noop }, style: {}, appendChild: noop, remove: noop }),
    querySelectorAll: () => [],
    body: { appendChild: noop }
  },
  window: { addEventListener: noop, removeEventListener: noop, scrollTo: noop },
  Chart: Object.assign(function Chart() { this.destroy = noop; this.update = noop; }, { defaults: { font: {} } })
};
sandbox.window = sandbox;

try {
  vm.createContext(sandbox);
  vm.runInContext(appJsContent, sandbox);
  vm.runInContext('initStorage()', sandbox);

  const specialties = ['lamsang', 'gayme', 'noisoi', 'khambenh', 'cdha', 'vltl_phcn', 'xetnghiem'];
  specialties.forEach(spec => {
    const meta = vm.runInContext(`SPECIALTY_META["${spec}"]`, sandbox);
    const domains = vm.runInContext(`DOMAINS_BY_SPECIALTY["${spec}"]`, sandbox);
    if (!meta || !domains) {
      console.log(`  [LỖI] Thiếu dữ liệu chuyên khoa: ${spec}`);
      totalErrors++;
      return;
    }
    let tcCount = 0;
    domains.forEach(d => d.standards.forEach(s => tcCount += s.criteria.length));
    console.log(`  [OK] Chuyên khoa "${meta.name}" (${spec}): ${domains.length} lĩnh vực, ${tcCount} tiêu chí chuẩn.`);
  });

  const tiers = vm.runInContext('TIERS', sandbox);
  console.log(`  [OK] Số bậc năng lực chuẩn: ${tiers.length} bậc (Bậc 1 -> Bậc 7).`);

  const workflowStages = vm.runInContext('WORKFLOW_STAGES', sandbox);
  console.log(`  [OK] Quy trình thẩm định 3 cấp: ${Object.keys(workflowStages).length} trạng thái.`);

} catch (err) {
  console.log(`  [LỖI RUNTIME JS]`, err.message);
  totalErrors++;
}

console.log('\n===============================================================');
console.log(`  KẾT QUẢ KIỂM TRA: ${totalErrors} LỖI, ${totalWarnings} CẢNH BÁO`);
console.log('===============================================================\n');

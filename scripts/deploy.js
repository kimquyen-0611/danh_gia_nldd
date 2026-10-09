/**
 * deploy.js - Script tự động đồng bộ tài nguyên và Deploy nhanh lên Vercel Production
 * Sử dụng: node deploy.js hoặc npm run deploy
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = __dirname;

console.log('===============================================================');
console.log('  BỆNH VIỆN ĐẠI HỌC Y DƯỢC TP.HCM - BAN ĐIỀU DƯỠNG');
console.log('  SCRIPT TRIỂN KHAI NHANH LÊN VERCEL PRODUCTION (FAST DEPLOY)');
console.log('===============================================================\n');

// 1. Đồng bộ tài nguyên tĩnh
console.log('[1/3] Đang đồng bộ tài nguyên CSS và JS...');
try {
  if (fs.existsSync(path.join(rootDir, 'css/styles.css'))) {
    fs.copyFileSync(path.join(rootDir, 'css/styles.css'), path.join(rootDir, 'styles.css'));
  }
  if (fs.existsSync(path.join(rootDir, 'js/app.js'))) {
    fs.copyFileSync(path.join(rootDir, 'app.js'), path.join(rootDir, 'js/app.js'));
  }
  if (fs.existsSync(path.join(rootDir, 'js/api_client.js'))) {
    fs.copyFileSync(path.join(rootDir, 'api_client.js'), path.join(rootDir, 'js/api_client.js'));
  }
  if (fs.existsSync(path.join(rootDir, 'supabase_client.js'))) {
    fs.copyFileSync(path.join(rootDir, 'supabase_client.js'), path.join(rootDir, 'js/supabase_client.js'));
  }
  console.log('  ✅ Đã đồng bộ tài nguyên tĩnh thành công!\n');
} catch (e) {
  console.warn('  ⚠️ Cảnh báo khi đồng bộ tệp:', e.message);
}

// 2. Chạy Vercel Deploy
console.log('[2/3] Đang đẩy mã nguồn và build trên Vercel Serverless...');
try {
  const isWindows = process.platform === 'win32';
  const cmd = isWindows ? 'npx.cmd vercel --prod --yes' : 'npx vercel --prod --yes';
  execSync(cmd, { stdio: 'inherit', cwd: rootDir });
  console.log('\n  ✅ Quá trình Deploy lên Vercel thành công!\n');
} catch (error) {
  console.error('\n  ❌ Lỗi triển khai Vercel:', error.message);
  process.exit(1);
}

// 3. Kiểm tra các URL trực tiếp
console.log('[3/3] Đang kiểm tra trạng thái hoạt động của Production URL...');
try {
  require('./assets/backend/test_live_vercel');
} catch (e) {
  console.log('  Hoàn tất!');
}

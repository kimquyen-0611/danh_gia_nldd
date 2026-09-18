/**
 * ============================================================================
 * TEST SECURITY HEADERS: KIỂM THỬ 5 CHÍNH SÁCH BẢO MẬT NỘI DUNG & HẠ TẦNG
 * ============================================================================
 */
const http = require('http');
const app = require('./server');

async function testSecurityHeaders() {
  console.log('=============================================================================');
  console.log('  BỆNH VIỆN ĐẠI HỌC Y DƯỢC TP. HỒ CHÍ MINH - BAN ĐIỀU DƯỠNG');
  console.log('  KIỂM THỬ XÁC NHẬN BỘ 5 CHÍNH SÁCH BẢO MẬT TIÊU CHUẨN (SECURITY HEADERS)');
  console.log('=============================================================================\n');

  const server = app.listen(0);
  const port = server.address().port;

  const results = [];

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/health`);
    const headers = res.headers;

    // 1. Kiểm tra Content-Security-Policy (CSP)
    const csp = headers.get('content-security-policy');
    const isCspValid = csp &&
      csp.includes("default-src 'self'") &&
      csp.includes("script-src") &&
      csp.includes("style-src") &&
      csp.includes("font-src") &&
      csp.includes("img-src") &&
      csp.includes("connect-src") &&
      csp.includes("frame-ancestors 'none'");
    results.push({
      policy: '1. Chính Sách Bảo Mật Nội Dung (Content Security Policy - CSP)',
      passed: !!isCspValid,
      headerValue: csp || 'CHƯA CẤU HÌNH'
    });

    // 2. Kiểm tra X-Frame-Options (Tùy chọn khung - Chống Clickjacking)
    const xfo = headers.get('x-frame-options');
    results.push({
      policy: '2. Tùy Chọn Khung (X-Frame-Options: Chống Clickjacking)',
      passed: xfo === 'DENY' || xfo === 'SAMEORIGIN',
      headerValue: xfo || 'CHƯA CẤU HÌNH'
    });

    // 3. Kiểm tra X-Content-Type-Options (Tùy chọn loại nội dung - Chống MIME Sniffing)
    const xcto = headers.get('x-content-type-options');
    results.push({
      policy: '3. Tùy Chọn Loại Nội Dung (X-Content-Type-Options: Chống MIME Sniffing)',
      passed: xcto === 'nosniff',
      headerValue: xcto || 'CHƯA CẤU HÌNH'
    });

    // 4. Kiểm tra Referrer-Policy (Chính sách giới thiệu)
    const refPolicy = headers.get('referrer-policy');
    results.push({
      policy: '4. Chính Sách Giới Thiệu (Referrer-Policy: Bảo vệ URL & Token)',
      passed: refPolicy === 'strict-origin-when-cross-origin' || refPolicy === 'same-origin',
      headerValue: refPolicy || 'CHƯA CẤU HÌNH'
    });

    // 5. Kiểm tra Permissions-Policy (Chính sách quyền hạn phần cứng)
    const permPolicy = headers.get('permissions-policy');
    const isPermValid = permPolicy &&
      permPolicy.includes('camera=()') &&
      permPolicy.includes('microphone=()') &&
      permPolicy.includes('geolocation=()');
    results.push({
      policy: '5. Chính Sách Quyền Hạn (Permissions-Policy: Giới hạn phần cứng)',
      passed: !!isPermValid,
      headerValue: permPolicy || 'CHƯA CẤU HÌNH'
    });

    // 6. Kiểm tra HSTS & XSS Protection
    const hsts = headers.get('strict-transport-security');
    const xss = headers.get('x-xss-protection');
    results.push({
      policy: '6. Tiêu chuẩn bổ sung (HSTS & X-XSS-Protection)',
      passed: !!hsts && !!xss,
      headerValue: `HSTS: ${hsts} | XSS: ${xss}`
    });

  } catch (err) {
    console.error('❌ Lỗi kiểm tra:', err.message);
  } finally {
    server.close();
  }

  let passCount = 0;
  results.forEach((r, idx) => {
    const icon = r.passed ? '✅ PASS' : '❌ FAIL';
    if (r.passed) passCount++;
    console.log(`${idx + 1}. [${icon}] ${r.policy}`);
    console.log(`   Giá trị Header: ${r.headerValue}\n`);
  });

  const allPass = passCount === results.length;
  console.log('-----------------------------------------------------------------------------');
  console.log(`📊 TỔNG KẾT: ${passCount}/${results.length} chính sách bảo mật ĐẠT (${((passCount/results.length)*100).toFixed(1)}%)`);
  console.log(`🛡️ Đánh giá an toàn hạ tầng: ${allPass ? 'ĐẠT CHUẨN BẢO MẬT CAO CẤP 100%' : 'CẦN CỦNG CỐ'}`);
  console.log('=============================================================================\n');

  return { passCount, total: results.length, allPass };
}

if (require.main === module) {
  testSecurityHeaders().then(res => {
    setTimeout(() => {
      process.exit(res.allPass ? 0 : 1);
    }, 100);
  });
}

module.exports = { testSecurityHeaders };


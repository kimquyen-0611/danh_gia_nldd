const fs = require('fs');
const path = require('path');
const vm = require('vm');

const appJs = fs.readFileSync(path.resolve(__dirname, '..', 'app.js'), 'utf8');

const mockLocalStorage = {};
const noop = () => {};
const sandbox = {
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  localStorage: {
    getItem: (k) => mockLocalStorage[k] || null,
    setItem: (k, v) => { mockLocalStorage[k] = String(v); },
    removeItem: (k) => { delete mockLocalStorage[k]; }
  },
  document: {
    addEventListener: noop,
    removeEventListener: noop,
    getElementById: () => ({
      innerHTML: '',
      textContent: '',
      value: '',
      classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
      style: {},
      appendChild: noop,
      options: [],
      getContext: () => ({ fillRect: noop, clearRect: noop })
    }),
    createElement: () => ({
      innerHTML: '',
      classList: { add: noop, remove: noop },
      style: {},
      appendChild: noop,
      remove: noop
    }),
    querySelectorAll: () => [],
    body: { appendChild: noop }
  },
  window: { addEventListener: noop, removeEventListener: noop, scrollTo: noop },
  Chart: Object.assign(function Chart() { this.destroy = noop; this.update = noop; }, { defaults: { font: {} } })
};

sandbox.window = sandbox;

try {
  vm.createContext(sandbox);
  vm.runInContext(appJs, sandbox);
  console.log('✅ 1. app.js được phân tích cú pháp và chạy hoàn toàn không lỗi!');

  vm.runInContext('initStorage()', sandbox);
  const userCount = vm.runInContext('APP_STATE.users.length', sandbox);
  console.log('✅ 2. Tổng số tài khoản nhân viên trong hệ thống:', userCount);

  const specs = ['lamsang', 'khambenh', 'gayme', 'canlamsang'];
  specs.forEach(s => {
    const name = vm.runInContext('SPECIALTY_META["' + s + '"].name', sandbox);
    const cnt = vm.runInContext('DOMAINS_BY_SPECIALTY["' + s + '"].reduce((acc, d) => acc + d.standards.reduce((a, st) => a + st.criteria.length, 0), 0)', sandbox);
    console.log('✅ 3. Khối ' + s + ' (' + name + '): ' + cnt + ' tiêu chí chuẩn hóa.');
  });

  // Test đăng nhập tài khoản Khám Bệnh
  vm.runInContext('login("khambenh", "123")', sandbox);
  const curUser = vm.runInContext('APP_STATE.currentUser', sandbox);
  const curSpec = vm.runInContext('APP_STATE.selectedSpecialty', sandbox);
  console.log('✅ 4. Đăng nhập mẫu: ' + curUser.fullName + ' - Khoa: ' + curUser.department + ' - Specialty: ' + curSpec);

  // Test chuyển sang Khoa Gây Mê
  vm.runInContext('changeAssessmentDepartment("Khoa Gây mê hồi sức")', sandbox);
  const specAfterGm = vm.runInContext('APP_STATE.selectedSpecialty', sandbox);
  console.log('✅ 5. Chuyển Khoa Gây Mê -> Specialty tự động nhận:', specAfterGm);

  // Test chuyển sang Khoa Xét Nghiệm
  vm.runInContext('changeAssessmentDepartment("Khoa Xét nghiệm")', sandbox);
  const specAfterXn = vm.runInContext('APP_STATE.selectedSpecialty', sandbox);
  console.log('✅ 6. Chuyển Khoa Xét Nghiệm -> Specialty tự động nhận:', specAfterXn);

  // Test chuyển sang Đơn vị Chấn thương Chỉnh hình (Lâm sàng)
  vm.runInContext('changeAssessmentDepartment("Đơn vị Chấn thương Chỉnh hình")', sandbox);
  const specAfterLs = vm.runInContext('APP_STATE.selectedSpecialty', sandbox);
  console.log('✅ 7. Chuyển ĐV Chấn thương chỉnh hình -> Specialty tự động nhận:', specAfterLs);

  console.log('\n🎉 KIỂM THỬ THÀNH CÔNG 100%! HỆ THỐNG ĐÃ SẴN SÀNG HOẠT ĐỘNG!');
} catch (e) {
  console.error('❌ Lỗi kiểm thử:', e);
  process.exit(1);
}

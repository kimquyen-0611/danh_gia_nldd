const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');

const mockElement = () => ({
  classList: { remove: () => {}, add: () => {}, toggle: () => {}, contains: () => false },
  style: {},
  options: [],
  innerHTML: '',
  textContent: '',
  value: '',
  appendChild: () => {},
  addEventListener: () => {}
});

const mockDocument = {
  getElementById: (id) => mockElement(),
  querySelectorAll: () => [mockElement()],
  createElement: () => mockElement(),
  addEventListener: () => {},
  body: mockElement()
};

global.window = { print: () => {}, location: {} };
global.document = mockDocument;
global.localStorage = {
  store: {},
  getItem: function(k) { return this.store[k] || null; },
  setItem: function(k, v) { this.store[k] = String(v); },
  removeItem: function(k) { delete this.store[k]; }
};

const vm = require('vm');
const context = vm.createContext({
  window: global.window,
  document: global.document,
  localStorage: global.localStorage,
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  Math: Math,
  Date: Date,
  parseInt: parseInt,
  parseFloat: parseFloat,
  isNaN: isNaN,
  Array: Array,
  Object: Object,
  String: String,
  Number: Number,
  RegExp: RegExp,
  JSON: JSON
});

vm.runInContext(content, context);

vm.runInContext(`
  initStorage();
  login('quyen.ntk', '123');

  const testDepts = [
    { dept: 'Khoa Tai mũi họng', expSpec: 'lamsang', expTC: 66 },
    { dept: 'Khoa Ngoại Tổng hợp', expSpec: 'lamsang', expTC: 66 },
    { dept: 'Khoa Sản', expSpec: 'lamsang', expTC: 66 },
    { dept: 'Đơn vị Chấn thương Chỉnh hình', expSpec: 'lamsang', expTC: 66 },
    { dept: 'Khoa Kiểm soát nhiễm khuẩn', expSpec: 'lamsang', expTC: 66 },
    { dept: 'Khoa Gây mê hồi sức', expSpec: 'gayme', expTC: 66 },
    { dept: 'Khoa Nội soi', expSpec: 'noisoi', expTC: 66 },
    { dept: 'Khoa Khám bệnh', expSpec: 'khambenh', expTC: 71 },
    { dept: 'Khoa Chẩn đoán hình ảnh', expSpec: 'cdha', expTC: 73 },
    { dept: 'Khoa Phục hồi chức năng_VLTL', expSpec: 'vltl_phcn', expTC: 65 },
    { dept: 'Khoa Xét nghiệm', expSpec: 'xetnghiem', expTC: 63 },
    { dept: 'Trung tâm SHPT', expSpec: 'xetnghiem', expTC: 63 }
  ];

  testDepts.forEach(t => {
    changeAssessmentDepartment(t.dept);
    const spec = APP_STATE.selectedSpecialty;
    const meta = SPECIALTY_META[spec];
    const domains = DOMAINS_BY_SPECIALTY[spec];
    let tcCount = 0;
    domains.forEach(d => d.standards.forEach(s => tcCount += s.criteria.length));

    if (spec !== t.expSpec || tcCount !== t.expTC) {
      throw new Error('Mismatch for ' + t.dept + ': got ' + spec + ' (' + tcCount + ' TC), expected ' + t.expSpec + ' (' + t.expTC + ' TC)');
    }
    console.log('✅ [' + t.dept + '] -> ' + meta.name + ' (' + tcCount + ' tiêu chí, 5 lĩnh vực)');
  });

  console.log('\\n🎉 ALL 12 DEPARTMENTS TESTED AND VERIFIED PERFECTLY IN RUNTIME SIMULATION!');
`, context);

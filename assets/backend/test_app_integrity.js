const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');

// Extract DOMAINS_BY_SPECIALTY
const domainsMatch = content.match(/const DOMAINS_BY_SPECIALTY = (\{[\s\S]*?\n\};)/);
if (!domainsMatch) {
  throw new Error('DOMAINS_BY_SPECIALTY not found');
}
const DOMAINS_BY_SPECIALTY = eval('(' + domainsMatch[1].replace(/;$/, '') + ')');

const expectedCounts = {
  lamsang: 66,
  gayme: 66,
  noisoi: 66,
  khambenh: 71,
  cdha: 73,
  vltl_phcn: 65,
  xetnghiem: 63
};

console.log('=== VERIFYING DOMAINS_BY_SPECIALTY ===');
for (const [key, expected] of Object.entries(expectedCounts)) {
  if (!DOMAINS_BY_SPECIALTY[key]) {
    throw new Error(`Missing specialty key: ${key}`);
  }
  const domains = DOMAINS_BY_SPECIALTY[key];
  if (domains.length !== 5) {
    throw new Error(`Specialty ${key} has ${domains.length} domains, expected 5`);
  }

  let totalTC = 0;
  domains.forEach((d, idx) => {
    const expectedDomainId = `${key}_d${idx + 1}`;
    if (d.id !== expectedDomainId) {
      throw new Error(`Domain ${idx + 1} of ${key} has id '${d.id}', expected '${expectedDomainId}'`);
    }
    let domainTC = 0;
    d.standards.forEach(s => {
      s.criteria.forEach(c => {
        domainTC++;
        if (!c.id || !c.title || !c.options || !c.options.length) {
          throw new Error(`Criterion invalid in ${key}: ${JSON.stringify(c)}`);
        }
      });
    });
    totalTC += domainTC;
  });

  if (totalTC !== expected) {
    throw new Error(`Specialty ${key} total criteria is ${totalTC}, expected ${expected}`);
  }
  console.log(`✅ [${key}]: Exactly ${totalTC} TC (Expected: ${expected}) across 5 domains [d1..d5].`);
}

// Extract DEPARTMENT_CONFIG
const deptMatch = content.match(/const DEPARTMENT_CONFIG = (\[[\s\S]*?\n\];)/);
const DEPARTMENT_CONFIG = eval('(' + deptMatch[1].replace(/;$/, '') + ')');
console.log('\n=== VERIFYING DEPARTMENT_CONFIG ===');
const requiredDepts = [
  { dept: 'Khoa Tai mũi họng', specialty: 'lamsang' },
  { dept: 'Khoa Ngoại Tổng hợp', specialty: 'lamsang' },
  { dept: 'Khoa Sản', specialty: 'lamsang' },
  { dept: 'Đơn vị Chấn thương Chỉnh hình', specialty: 'lamsang' },
  { dept: 'Khoa Kiểm soát nhiễm khuẩn', specialty: 'lamsang' },
  { dept: 'Khoa Gây mê hồi sức', specialty: 'gayme' },
  { dept: 'Khoa Nội soi', specialty: 'noisoi' },
  { dept: 'Khoa Chẩn đoán hình ảnh', specialty: 'cdha' },
  { dept: 'Khoa Phục hồi chức năng_VLTL', specialty: 'vltl_phcn' },
  { dept: 'Khoa Khám bệnh', specialty: 'khambenh' },
  { dept: 'Khoa Xét nghiệm', specialty: 'xetnghiem' },
  { dept: 'Trung tâm SHPT', specialty: 'xetnghiem' }
];

requiredDepts.forEach(req => {
  const found = DEPARTMENT_CONFIG.find(d => d.dept === req.dept);
  if (!found) throw new Error(`Missing department: ${req.dept}`);
  if (found.specialty !== req.specialty) throw new Error(`Wrong specialty for ${req.dept}: got ${found.specialty}, expected ${req.specialty}`);
  console.log(`✅ Department '${req.dept}' correctly mapped to '${req.specialty}'`);
});

// Extract SPECIALTY_META
const metaMatch = content.match(/const SPECIALTY_META = (\{[\s\S]*?\n\};)/);
const SPECIALTY_META = eval('(' + metaMatch[1].replace(/;$/, '') + ')');
console.log('\n=== VERIFYING SPECIALTY_META ===');
for (const [key, expected] of Object.entries(expectedCounts)) {
  if (!SPECIALTY_META[key]) throw new Error(`Missing meta for ${key}`);
  if (SPECIALTY_META[key].totalCriteria !== expected) {
    throw new Error(`SPECIALTY_META[${key}].totalCriteria = ${SPECIALTY_META[key].totalCriteria}, expected ${expected}`);
  }
  console.log(`✅ Meta '${key}': ${SPECIALTY_META[key].name} (${SPECIALTY_META[key].totalCriteria} TC)`);
}

console.log('\n🎉 ALL INTEGRITY CHECKS PASSED 100%!');

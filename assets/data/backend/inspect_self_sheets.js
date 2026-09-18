const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const folderPath = path.resolve(__dirname, '..', 'tiêu chuẩn đánh giá năng lực');

const selfAssessmentSheets = [
  { file: '1.Tiêu chuẩn năng lực - KTV Gây mê (66 TC).xlsx', sheet: '5. Tự đánh giá năng lực GMHS', expected: 66, key: 'gayme' },
  { file: '2.Tiêu chuẩn năng lực - Nội soi(66 TC).xlsx', sheet: '5. Tự đánh giá năng lực - ĐD NS', expected: 66, key: 'noisoi' },
  { file: '4. Tiêu chuẩn năng lực - Khám bệnh (71TC).xlsx', sheet: 'Tự đánh giá năng lực-ĐD KB', expected: 71, key: 'khambenh' },
  { file: '6. Tiêu chuẩn năng lực - Chẩn đoán hình ảnh (73TC).xlsx', sheet: '5. Tự đánh giá năng lực - CĐHA', expected: 73, key: 'cdha' },
  { file: '6. Tiêu chuẩn năng lực - VLTL - PHCN (65TC).xls', sheet: '2.Bảng tự đánh giá_KTV PHCN', expected: 65, key: 'vltl_phcn' },
  { file: '7.Tiêu chuẩn năng lực - Xét nghiệm(63TC).xlsx', sheet: '5. Tự đánh giá năng lực - XN', expected: 63, key: 'xetnghiem' }
];

selfAssessmentSheets.forEach(item => {
  const wb = xlsx.readFile(path.join(folderPath, item.file));
  const sheet = wb.Sheets[item.sheet];
  if (!sheet) {
    console.log(`❌ Sheet ${item.sheet} not found in ${item.file}`);
    return;
  }
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  console.log(`\n=== ${item.key.toUpperCase()} (${item.file}) : ${item.sheet} [${rows.length} rows] ===`);
  
  let critCount = 0;
  let domains = [];
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    if (!row || !row.length) continue;
    const c0 = String(row[0] || '').trim();
    const c1 = String(row[1] || '').trim();
    const c2 = row[2];
    
    if (c0.match(/^[I|V|X]+\.?$/)) {
      domains.push({ row: r, code: c0, name: c1 });
    }
    if (c1.toLowerCase().includes('tiêu chí') && (typeof c2 === 'number' || (c2 && !isNaN(parseInt(c2))))) {
      critCount++;
    }
  }
  console.log(`Domains (${domains.length}):`, domains.map(d => `${d.code} ${d.name.substring(0,25)}`));
  console.log(`Criteria found: ${critCount} (Expected: ${item.expected})`);
});

const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const folderPath = path.resolve(__dirname, '..', 'tiêu chuẩn đánh giá năng lực');
const targetFiles = [
  { file: '1.Tiêu chuẩn năng lực - KTV Gây mê (66 TC).xlsx', sheet: '4. Tiêu chuẩn năng lực - GMHS', key: 'gayme' },
  { file: '2.Tiêu chuẩn năng lực - Nội soi(66 TC).xlsx', sheet: '4. Tiêu chuẩn năng lực - ĐDNS', key: 'noisoi' },
  { file: '4. Tiêu chuẩn năng lực - Khám bệnh (71TC).xlsx', sheet: 'Tiêu chuẩn năng lực - ĐDKB xong', key: 'khambenh' },
  { file: '6. Tiêu chuẩn năng lực - Chẩn đoán hình ảnh (73TC).xlsx', sheet: '4. Tiêu chuẩn năng lực - CĐHA', key: 'cdha' },
  { file: '6. Tiêu chuẩn năng lực - VLTL - PHCN (65TC).xls', sheet: '1.Bảng năng lực_KTV PHCN', key: 'vltl_phcn' },
  { file: '7.Tiêu chuẩn năng lực - Xét nghiệm(63TC).xlsx', sheet: '4. Tiêu chuẩn năng lực - XN', key: 'xetnghiem' }
];

targetFiles.forEach(tf => {
  const wb = xlsx.readFile(path.join(folderPath, tf.file));
  const sheet = wb.Sheets[tf.sheet] || wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  console.log('=== ' + tf.key + ' ===');
  for (let idx = 0; idx < rows.length; idx++) {
    const r = rows[idx];
    if (!r || !r.length) continue;
    const c0 = String(r[0] || '').trim();
    if (c0.match(/^[I|V|X]+\.$/) || (c0.match(/^[I|V|X]+$/) && r[1])) {
      console.log(`  Row ${idx}: ${c0} ${r[1]} | col5: ${r[5]} | next row col5: ${rows[idx+1] ? rows[idx+1][5] : null}`);
    }
  }
});

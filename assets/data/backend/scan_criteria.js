const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const folderPath = path.resolve(__dirname, '..', 'tiêu chuẩn đánh giá năng lực');

const targetFiles = [
  { file: '1.Tiêu chuẩn năng lực - KTV Gây mê (66 TC).xlsx', sheet: '4. Tiêu chuẩn năng lực - GMHS', targetTC: 66, key: 'gayme' },
  { file: '2.Tiêu chuẩn năng lực - Nội soi(66 TC).xlsx', sheet: '4. Tiêu chuẩn năng lực - ĐDNS', targetTC: 66, key: 'noisoi' },
  { file: '4. Tiêu chuẩn năng lực - Khám bệnh (71TC).xlsx', sheet: 'Tiêu chuẩn năng lực - ĐDKB xong', targetTC: 71, key: 'khambenh' },
  { file: '6. Tiêu chuẩn năng lực - Chẩn đoán hình ảnh (73TC).xlsx', sheet: '4. Tiêu chuẩn năng lực - CĐHA', targetTC: 73, key: 'cdha' },
  { file: '6. Tiêu chuẩn năng lực - VLTL - PHCN (65TC).xls', sheet: '1.Bảng năng lực_KTV PHCN', targetTC: 65, key: 'vltl_phcn' },
  { file: '7.Tiêu chuẩn năng lực - Xét nghiệm(63TC).xlsx', sheet: '4. Tiêu chuẩn năng lực - XN', targetTC: 63, key: 'xetnghiem' }
];

targetFiles.forEach(item => {
  console.log(`\n==================================================================`);
  console.log(`KEY: ${item.key} | FILE: ${item.file} | SHEET: ${item.sheet}`);
  const wb = xlsx.readFile(path.join(folderPath, item.file));
  const sheet = wb.Sheets[item.sheet] || wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  console.log(`Total rows: ${rows.length}`);
  
  // Find all criteria numbers
  let crits = [];
  rows.forEach((r, idx) => {
    if (!r) return;
    // check each cell
    r.forEach((cell, cIdx) => {
      if (typeof cell === 'string' && (cell.match(/^Tiêu chí\s*(\d+)/i) || cell.match(/^TC\s*(\d+)/i))) {
        const m = cell.match(/(\d+)/);
        crits.push({ row: idx + 1, col: cIdx, num: parseInt(m[1]), text: cell, rowData: r.filter(x => x !== undefined && x !== '').slice(0, 6) });
      }
    });
  });

  console.log(`Total criteria detected by 'Tiêu chí X': ${crits.length}`);
  if (crits.length > 0) {
    console.log(`  First criterion: TC ${crits[0].num} at row ${crits[0].row}`);
    console.log(`  Last criterion: TC ${crits[crits.length - 1].num} at row ${crits[crits.length - 1].row}`);
    console.log(`  Sample row:`, crits[0].rowData);
  }
});

const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const folderPath = path.resolve(__dirname, '..', 'tiêu chuẩn đánh giá năng lực');
const file = '1.Tiêu chuẩn năng lực - KTV Gây mê (66 TC).xlsx';
const wb = xlsx.readFile(path.join(folderPath, file));
const sheet = wb.Sheets['4. Tiêu chuẩn năng lực - GMHS'];
const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

for (let r = 35; r < 75; r++) {
  const row = rows[r];
  if (!row) continue;
  const c0 = String(row[0] || '').trim().replace(/\r?\n/g, ' ');
  const c1 = String(row[1] || '').trim().replace(/\r?\n/g, ' ');
  const c2 = row[2];
  const c3 = String(row[3] || '').trim().replace(/\r?\n/g, ' ');
  const c4 = String(row[4] || '').trim().replace(/\r?\n/g, ' ');
  const c5 = row[5];
  if (c0.startsWith('II.') || c0.startsWith('TIÊU CHUẨN') || c1.toLowerCase().includes('tiêu chí') || (c3 && c5 !== undefined)) {
    console.log(`R${r} [c0:${c0.slice(0,20)}] [c1:${c1}] [c2:${c2}] [c3:${c3.slice(0,40)}] [c4:${c4}] [c5:${c5}]`);
  }
}

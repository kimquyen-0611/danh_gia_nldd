const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const folderPath = path.resolve(__dirname, '..', 'tiêu chuẩn đánh giá năng lực');
const files = fs.readdirSync(folderPath);

files.forEach(f => {
  console.log(`\n======================================================`);
  console.log(`FILE: ${f}`);
  const wb = xlsx.readFile(path.join(folderPath, f));
  wb.SheetNames.forEach(sName => {
    const rows = xlsx.utils.sheet_to_json(wb.Sheets[sName], { header: 1 });
    console.log(`  --- Sheet: "${sName}" (${rows.length} rows) ---`);
    // Print non-empty rows from 10 to 25
    for (let i = 8; i < Math.min(rows.length, 25); i++) {
      if (rows[i] && rows[i].length > 0 && rows[i].some(c => c !== null && c !== undefined && c !== '')) {
        const clean = rows[i].map(c => typeof c === 'string' ? c.replace(/\r?\n/g, ' ').substring(0, 30) : c);
        console.log(`    R${i+1}: [${clean.filter(c => c !== null && c !== undefined && c !== '').join(' | ')}]`);
      }
    }
  });
});

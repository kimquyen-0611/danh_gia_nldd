const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const folderPath = path.resolve(__dirname, '..', 'tiêu chuẩn đánh giá năng lực');
const files = fs.readdirSync(folderPath);

console.log('=== INSPECTING NEW CRITERIA FILES IN: tiêu chuẩn đánh giá năng lực ===\n');

files.forEach(file => {
  const filePath = path.join(folderPath, file);
  console.log('---------------------------------------------------------');
  console.log(`FILE: ${file}`);
  try {
    const wb = xlsx.readFile(filePath);
    console.log('Sheets:', wb.SheetNames);
    
    wb.SheetNames.forEach(sName => {
      const sheet = wb.Sheets[sName];
      const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
      console.log(`  Sheet "${sName}": ${rows.length} rows`);
      
      // Let's inspect headers or find where criteria are listed
      let tcCount = 0;
      let sampleRows = [];
      rows.forEach((r, idx) => {
        if (!r) return;
        const lineStr = r.join(' | ');
        if (lineStr.match(/Tiêu chí\s*\d+/i) || lineStr.match(/TC\s*\d+/i) || (typeof r[0] === 'string' && r[0].startsWith('I') && lineStr.includes('TIÊU CHUẨN'))) {
          tcCount++;
          if (sampleRows.length < 3) sampleRows.push({ rowIdx: idx + 1, text: lineStr.substring(0, 100) });
        }
      });
      if (sampleRows.length > 0) {
        console.log(`    Matches: ~${tcCount} criteria lines`);
        sampleRows.forEach(sr => console.log(`      R${sr.rowIdx}: ${sr.text}`));
      }
    });
  } catch (err) {
    console.error('  Error reading file:', err.message);
  }
});

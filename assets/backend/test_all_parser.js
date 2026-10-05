const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const folderPath = path.resolve(__dirname, '..', 'tiêu chuẩn đánh giá năng lực');

const targetFiles = [
  { file: '1.Tiêu chuẩn năng lực - KTV Gây mê (66 TC).xlsx', sheet: '4. Tiêu chuẩn năng lực - GMHS', expected: 66, key: 'gayme', label: 'KTV Gây Mê Hồi Sức' },
  { file: '2.Tiêu chuẩn năng lực - Nội soi(66 TC).xlsx', sheet: '4. Tiêu chuẩn năng lực - ĐDNS', expected: 66, key: 'noisoi', label: 'Điều Dưỡng Nội Soi' },
  { file: '4. Tiêu chuẩn năng lực - Khám bệnh (71TC).xlsx', sheet: 'Tiêu chuẩn năng lực - ĐDKB xong', expected: 71, key: 'khambenh', label: 'Khoa Khám Bệnh' },
  { file: '6. Tiêu chuẩn năng lực - Chẩn đoán hình ảnh (73TC).xlsx', sheet: '4. Tiêu chuẩn năng lực - CĐHA', expected: 73, key: 'cdha', label: 'Chẩn Đoán Hình Ảnh' },
  { file: '6. Tiêu chuẩn năng lực - VLTL - PHCN (65TC).xls', sheet: '1.Bảng năng lực_KTV PHCN', expected: 65, key: 'vltl_phcn', label: 'VLTL - Phục Hồi Chức Năng' },
  { file: '7.Tiêu chuẩn năng lực - Xét nghiệm(63TC).xlsx', sheet: '4. Tiêu chuẩn năng lực - XN', expected: 63, key: 'xetnghiem', label: 'Kỹ Thuật Y Xét Nghiệm' }
];

function parseCriteriaSheet(filePath, sheetName, specKey) {
  const wb = xlsx.readFile(filePath);
  const sheet = wb.Sheets[sheetName] || wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  const domains = [];
  let currentDomain = null;
  let currentStandard = null;
  let currentCriterion = null;
  let critMap = new Map();

  let dIdx = 1;
  let sIdx = 1;

  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    if (!row || row.length === 0) continue;

    const col0 = row[0] != null ? String(row[0]).trim() : '';
    const col1 = row[1] != null ? String(row[1]).trim() : '';
    const col2 = row[2] != null ? row[2] : null;
    const col3 = row[3] != null ? String(row[3]).trim() : '';
    const col4 = row[4] != null ? String(row[4]).trim() : '';
    const col5 = row[5] != null ? row[5] : null;

    // 1. Kiểm tra Lĩnh vực (Domain) ví dụ: "I.", "II.", "III.", "IV.", "V."
    const isDomain = col0.match(/^[I|V|X]+\.$/) || (col0.match(/^[I|V|X]+$/) && row[1] && typeof row[1] === 'string' && row[1].toUpperCase().includes('TIÊU CHUẨN'));
    if (isDomain) {
      const dCode = col0.endsWith('.') ? col0 : col0 + '.';
      const dName = (row[1] != null ? String(row[1]).trim() : (row[0] ? String(row[0]).trim() : '')).replace(/\r?\n/g, ' ');
      let maxPts = typeof col5 === 'number' ? col5 : (rows[r+1] && typeof rows[r+1][5] === 'number' ? rows[r+1][5] : 200);
      currentDomain = {
        id: `${specKey}_d${dIdx++}`,
        code: dCode,
        name: dName,
        maxPoints: maxPts,
        standards: []
      };
      domains.push(currentDomain);
      currentStandard = null;
      currentCriterion = null;
      continue;
    }

    // 2. Kiểm tra Tiêu chuẩn (Standard) ví dụ: "TIÊU CHUẨN 1.", "TIÊU CHUẨN 2."
    if (col0.toUpperCase().includes('TIÊU CHUẨN') && !col0.toUpperCase().includes('TIÊU CHUẨN BẮT BUỘC') && !col0.toUpperCase().includes('TIÊU CHUẨN BẰNG CẤP') && !col0.toUpperCase().includes('TIÊU CHUẨN CHUNG')) {
      if (!currentDomain) {
        currentDomain = { id: `${specKey}_d${dIdx++}`, code: 'I.', name: 'TIÊU CHUẨN BẰNG CẤP', maxPoints: 180, standards: [] };
        domains.push(currentDomain);
      }
      currentStandard = {
        id: `${specKey}_std_${sIdx++}`,
        number: sIdx - 1,
        title: col0.replace(/\r?\n/g, ' '),
        criteria: []
      };
      currentDomain.standards.push(currentStandard);
    }

    // 3. Kiểm tra Tiêu chí: col1 chứa "tiêu chí" và col2 là số
    if (col1.toLowerCase().includes('tiêu chí') && typeof col2 === 'number') {
      if (!currentDomain) {
        currentDomain = { id: `${specKey}_d${dIdx++}`, code: 'I.', name: 'TIÊU CHUẨN BẰNG CẤP', maxPoints: 180, standards: [] };
        domains.push(currentDomain);
      }
      if (!currentStandard) {
        currentStandard = { id: `${specKey}_std_${sIdx++}`, number: sIdx - 1, title: `Tiêu chuẩn ${sIdx - 1}`, criteria: [] };
        currentDomain.standards.push(currentStandard);
      }

      const cNum = col2;
      const optText = col3;
      const optDesc = col4;
      const score = typeof col5 === 'number' ? col5 : (parseInt(col5) || 0);

      // Nếu tiêu chí này đã tồn tại (do có 2 dòng tiêu chí cùng số như TC 19 ở GMHS)
      if (critMap.has(cNum)) {
        const existingCrit = critMap.get(cNum);
        existingCrit.options.push({
          score: score,
          level: `Mức ${score}đ`,
          text: (col1.includes('(') ? col1.replace(/\r?\n/g, ' ') + ': ' : '') + optText
        });
        if (score > existingCrit.maxScore) existingCrit.maxScore = score;
        currentCriterion = existingCrit;
        continue;
      }

      currentCriterion = {
        id: `${specKey}_c${cNum}`,
        num: cNum,
        standard: currentStandard.title,
        title: optText || `Tiêu chí ${cNum}`,
        desc: optDesc || 'Chọn mức điểm phù hợp',
        maxScore: score,
        options: [
          { score: score, level: `Mức ${score}đ`, text: optText }
        ]
      };
      currentStandard.criteria.push(currentCriterion);
      critMap.set(cNum, currentCriterion);
      continue;
    }

    // 4. Nếu là Option phụ của Criterion đang xét (col1 rỗng, col2 null, col3 có chữ, col5 có điểm)
    if (currentCriterion && !col1 && col2 === null && col3 && col5 !== null && !col0.includes('Đối với')) {
      const score = typeof col5 === 'number' ? col5 : (parseInt(col5) || 0);
      currentCriterion.options.push({
        score: score,
        level: `Mức ${score}đ`,
        text: col3
      });
      if (score > currentCriterion.maxScore) {
        currentCriterion.maxScore = score;
      }
    }
  }

  // Chuẩn hóa lại level cho các options: Mức 1 (xđ), Mức 2 (xđ) hoặc theo thang điểm tăng dần
  critMap.forEach(crit => {
    if (crit.options.length > 1) {
      crit.options.forEach((opt, idx) => {
        if (!opt.level || opt.level.startsWith('Mức ')) {
          opt.level = `Mức ${idx + 1}`;
        }
      });
    } else if (crit.options.length === 1) {
      crit.options[0].level = `Đạt (${crit.options[0].score}đ)`;
    }
  });

  return { domains, totalCriteria: critMap.size, maxNum: Math.max(...Array.from(critMap.keys())) };
}

targetFiles.forEach(tf => {
  const filePath = path.join(folderPath, tf.file);
  const res = parseCriteriaSheet(filePath, tf.sheet, tf.key);
  console.log(`✅ [${tf.key.toUpperCase()}]: ${res.totalCriteria} TC parsed (Expected: ${tf.expected}) across ${res.domains.length} domains.`);
});

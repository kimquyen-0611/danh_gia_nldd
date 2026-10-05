const fs = require('fs');
const path = require('path');
const lines = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8').split(/\r?\n/);

const lamsangLines = lines.slice(32, 2757); // 32 is line 33, 2756 is line 2757
let lamsangStr = lamsangLines.join('\n').trim();
if (lamsangStr.endsWith(',')) lamsangStr = lamsangStr.slice(0, -1);
const lamsang = JSON.parse(lamsangStr);

console.log('lamsang domains:', lamsang.length);
let totalTC = 0;
lamsang.forEach((d, idx) => {
  let tc = 0;
  d.standards.forEach(s => tc += s.criteria.length);
  console.log(`  Domain ${idx + 1} (${d.name}): ${tc} TC`);
  totalTC += tc;
});
console.log('Total lamsang criteria:', totalTC);

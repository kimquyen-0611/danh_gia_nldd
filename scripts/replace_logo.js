const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const initialSize = Buffer.byteLength(html, 'utf8');
console.log('Original index.html size:', initialSize, 'bytes');

// Thay thế tất cả các thẻ img nhúng data:image/jpeg;base64,...
html = html.replace(/<img\s+src="data:image\/[^"]+"\s+onload="makeLogoTransparent\(this\)"/g, '<img src="assets/logo-umc.png"');
html = html.replace(/<img\s+src="data:image\/[^"]+"/g, '<img src="assets/logo-umc.png"');

fs.writeFileSync(indexPath, html, 'utf8');
const finalSize = Buffer.byteLength(html, 'utf8');
console.log('Updated index.html size:', finalSize, 'bytes');
console.log('Reduced by:', (initialSize - finalSize) / 1024, 'KB');

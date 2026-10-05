@echo off
chcp 65001 >nul
title [UMC] Trien Khai Len Cloudflare (Worker & Pages)
color 0B

echo =======================================================================
echo    BENH VIEN DAI HOC Y DUOC TP. HO CHI MINH - BAN DIEU DUONG
echo    TOOL TRIEN KHAI LEN CLOUDFLARE PRODUCTION (1-CLICK DEPLOY)
echo =======================================================================
echo.

echo [1/3] Dong bo tai nguyen tinh (CSS, JS, Supabase Client)...
if exist styles.css copy /Y styles.css css\styles.css >nul
if exist app.js copy /Y app.js js\app.js >nul
if exist api_client.js copy /Y api_client.js js\api_client.js >nul
if exist supabase_client.js copy /Y supabase_client.js js\supabase_client.js >nul
echo       - Da dong bo xong tai nguyen!
echo.

echo [2/3] Kiem tra gioi han dung luong file (Cloudflare Limit < 25MB)...
node -e "
const fs = require('fs');
let hasLarge = false;
function check(dir) {
  for (const item of fs.readdirSync(dir)) {
    if (['node_modules', '.git', '.vercel', '.backup_large_assets'].includes(item)) continue;
    const full = dir + '/' + item;
    const stat = fs.statSync(full);
    if (stat.isDirectory()) check(full);
    else if (stat.size > 25 * 1024 * 1024) {
      console.log('  [CANH BAO] File vuot qua 25MB: ' + full + ' (' + (stat.size/(1024*1024)).toFixed(2) + 'MB)');
      hasLarge = true;
    }
  }
}
check('.');
if (!hasLarge) console.log('  - Tat ca file deu hop le (< 25MB), san sang dua len Cloudflare!');
"
echo.

echo [3/3] Dang day ma nguon va trien khai len Cloudflare...
echo       (Neu chua dang nhap Cloudflare, trinh duyet se tu dong mo de xac thuc)
echo.
call npx wrangler deploy

if %errorlevel% neq 0 (
    echo.
    echo =======================================================================
    echo [HUONG DAN XAC THUC] Neu Cloudflare yeu cau dang nhap:
    echo   1. Mo Terminal / PowerShell va chay: npx wrangler login
    echo   2. Xac nhan tren trinh duyet
    echo   3. Sau do chay lai Deploy_Nhanh_Cloudflare.bat
    echo =======================================================================
    pause
    exit /b %errorlevel%
)

echo.
echo =======================================================================
echo    TRIEN KHAI THANH CONG 100% LEN CLOUDFLARE WORKER!
echo =======================================================================
echo.
pause

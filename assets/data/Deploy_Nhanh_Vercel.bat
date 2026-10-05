@echo off
chcp 65001 >nul
title [UMC] Trien Khai Nhanh Len Vercel Production
color 0B

echo =======================================================================
echo    BENH VIEN DAI HOC Y DUOC TP. HO CHI MINH - BAN DIEU DUONG
echo    TOOL TRIEN KHAI NHANH LEN VERCEL PRODUCTION (1-CLICK DEPLOY)
echo =======================================================================
echo.

echo [1/3] Dong bo tai nguyen tinh (CSS, JS, Supabase Client)...
if exist styles.css copy /Y styles.css css\styles.css >nul
if exist app.js copy /Y app.js js\app.js >nul
if exist api_client.js copy /Y api_client.js js\api_client.js >nul
if exist supabase_client.js copy /Y supabase_client.js js\supabase_client.js >nul
echo       - Da dong bo xong tai nguyen!
echo.

echo [2/3] Dang day ma nguon va trien khai len Vercel Production...
call npx vercel --prod --yes

if %errorlevel% neq 0 (
    echo.
    echo =======================================================================
    echo [HUONG DAN XAC THUC] Vercel yeu cau dang nhap xac thuc tai khoan:
    echo   1. Mo Terminal / PowerShell va chay: npx vercel login
    echo   2. Chon dang nhap qua Email hoac GitHub
    echo   3. Sau khi dang nhap thanh cong, chay lai Deploy_Nhanh_Vercel.bat
    echo =======================================================================
    pause
    exit /b %errorlevel%
)

echo.
echo [3/3] Kiem tra trang thai he thong tren Vercel...
if exist assets\backend\test_live_vercel.js node assets\backend\test_live_vercel.js

echo.
echo =======================================================================
echo    TRIEN KHAI THANH CONG 100%!
echo    Dia chi Web: https://danh-gia-nldd-umc.vercel.app
echo =======================================================================
echo.
pause

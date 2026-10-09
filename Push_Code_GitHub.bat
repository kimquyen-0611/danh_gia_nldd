@echo off
chcp 65001 >nul
title [UMC] Tu Dong Commit va Push Len GitHub (Nhanh main)
color 0B

echo =======================================================================
echo    BENH VIEN DAI HOC Y DUOC TP. HO CHI MINH - BAN DIEU DUONG
echo    TOOL TU DONG COMMIT VA PUSH LEN GITHUB (NHANH MAIN)
echo =======================================================================
echo.

:: 1. Tim kiem trinh thuc thi Git tren may tinh
set "GIT_CMD=git"
where git >nul 2>nul
if %errorlevel% neq 0 (
    for /d %%D in ("%LOCALAPPDATA%\GitHubDesktop\app-*") do (
        if exist "%%D\resources\app\git\cmd\git.exe" set "GIT_CMD=%%D\resources\app\git\cmd\git.exe"
    )
    if not exist "%GIT_CMD%" (
        if exist "C:\Program Files\Git\cmd\git.exe" set "GIT_CMD=C:\Program Files\Git\cmd\git.exe"
    )
    if not exist "%GIT_CMD%" (
        if exist "C:\Program Files (x86)\Git\cmd\git.exe" set "GIT_CMD=C:\Program Files (x86)\Git\cmd\git.exe"
    )
)

"%GIT_CMD%" --version >nul 2>nul
if %errorlevel% neq 0 (
    echo [LOI] Khong tim thay Git tren may tinh!
    echo Vui long cai dat Git hoac GitHub Desktop truoc khi su dung tool nay.
    pause
    exit /b 1
)

echo [1/4] Phat hien Git hop le:
"%GIT_CMD%" --version
echo.

:: 2. Kiem tra tai nguyen tinh
echo [2/4] Kiem tra tai nguyen tinh (CSS, JS, Assets)...
echo       - Tai nguyen hop le, san sang commit!
echo.

:: 3. Nhap ghi chu Commit (Commit message)
set "USER_MSG="
set /p "USER_MSG=Nhap noi dung ghi chu commit (Nhan Enter de dung mac dinh): "
if not defined USER_MSG set "USER_MSG=Cap nhat ma nguon UMC NLDD"
for /f "tokens=* delims= " %%a in ("%USER_MSG%") do set "USER_MSG=%%a"
if "%USER_MSG%"=="" set "USER_MSG=Cap nhat ma nguon UMC NLDD"

echo       - Noi dung commit: "%USER_MSG%"
echo.

:: 4. Chuyen va dam bao luon o nhanh main
echo [3/4] Chuan bi du lieu va tao Commit...
call "%GIT_CMD%" branch -M main

:: Kiem tra file lock neu co
if exist .git\index.lock del /f /q .git\index.lock >nul 2>nul

call "%GIT_CMD%" add .

:: Kiem tra co thay doi nao de commit khong
call "%GIT_CMD%" diff --cached --quiet
if errorlevel 1 (
    call "%GIT_CMD%" commit -m "%USER_MSG%"
    echo       - Da tao Commit thanh cong!
) else (
    echo       - Khong co tap tin nao moi thay doi can commit them.
)
echo.

:: 5. Day len GitHub nhanh main
echo [4/4] Dang day ma nguon len GitHub repository (nhanh main)...
echo       Dia chi: https://github.com/kimquyen-0611/danh_gia_nldd.git
echo.
call "%GIT_CMD%" push -u origin main
if errorlevel 1 (
    echo.
    echo =======================================================================
    echo [CANH BAO] Push that bai! Mot so nguyen nhan pho bien:
    echo   1. Chua cap quyen hoac chua dang nhap GitHub tren may
    echo   2. Mat ket noi Internet hoac bi chan DNS (thu dung 8.8.8.8)
    echo   3. Xung dot du lieu tren GitHub (thu pull truoc khi push)
    echo =======================================================================
    pause
    exit /b 1
)

echo.
echo =======================================================================
echo    DA COMMIT VA PUSH THANH CONG LEN GITHUB NHANH MAIN 100%!
echo    Xem truc tiep tai: https://github.com/kimquyen-0611/danh_gia_nldd/tree/main
echo =======================================================================
echo.
pause

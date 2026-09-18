@echo off
chcp 65001 > nul
cd /d "%~dp0"
echo ===============================================================
echo   DANG KHOI CHAY UNG DUNG UMC (BACKEND + WEB FRONTEND)...
echo ===============================================================

REM 1. Khoi chay backend o cua so rieng
start "Backend API UMC" cmd /k "cd /d "%~dp0backend" && chay_backend.bat"

REM 2. Mo ung dung Web tren trinh duyet
start "" "%~dp0index.html"

exit

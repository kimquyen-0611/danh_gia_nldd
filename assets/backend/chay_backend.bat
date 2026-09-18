@echo off
chcp 65001 > nul
cd /d "%~dp0"
echo ===============================================================
echo   DANG KHOI CHAY BACKEND API NODE.JS KET NOI SUPABASE...
echo ===============================================================

set "PATH=C:\Program Files\nodejs;%PATH%"

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [LOI] May tinh chua cai dat Node.js!
    echo Vui long cai dat Node.js tai https://nodejs.org/ truoc khi chay backend.
    pause
    exit /b
)

if not exist "node_modules\" (
    echo Dang cai dat thu vien backend (express, pg, dotenv, cors)...
    call npm install
)

echo Dang chay server tai http://localhost:5000 ...
node server.js
pause

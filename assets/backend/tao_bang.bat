@echo off
chcp 65001 > nul
cd /d "%~dp0"
set "PATH=C:\Program Files\nodejs;%PATH%"

echo ===============================================================
echo   DANG TIEN HANH TAO BANG "yeu_cau" TREN SUPABASE...
echo ===============================================================

node create_table.js
echo.
pause

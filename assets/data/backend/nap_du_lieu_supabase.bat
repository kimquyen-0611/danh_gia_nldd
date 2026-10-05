@echo off
chcp 65001 > nul
cd /d "%~dp0"
echo ===============================================================
echo   DANG NAP DU LIEU MAU LEN SUPABASE CLOUD DATABASE...
echo ===============================================================
node seed_data_to_supabase.js
pause

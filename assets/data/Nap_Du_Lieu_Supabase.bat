@echo off
chcp 65001 > nul
cd /d "%~dp0backend"
call nap_du_lieu_supabase.bat

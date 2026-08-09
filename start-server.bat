@echo off
echo Starting Local Server for Smart Food Share on http://localhost:8000...
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause

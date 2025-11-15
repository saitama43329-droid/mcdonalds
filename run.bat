@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo Installing dependencies for the first time...
  npm install
)
start "" npm run dev
timeout /t 5 /nobreak >nul
start "" http://localhost:5173
pause

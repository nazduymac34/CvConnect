@echo off
cd /d "%~dp0"
echo CVConnect baslatiliyor...
echo Tarayicida http://localhost:5173 acilacak.
echo Kapatmak icin bu pencerede Ctrl+C yapin.
echo.
if not exist "node_modules\" (
  echo Ilk kurulum: npm install calisiyor...
  call npm install
)
start http://localhost:5173
call npm run dev
pause

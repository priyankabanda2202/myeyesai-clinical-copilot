@echo off
cd /d "%~dp0\web"
echo.
echo VisionFlow UI - http://localhost:3000
echo Make sure start-api.bat is running in another terminal first.
echo.
call npm install
call npm run dev

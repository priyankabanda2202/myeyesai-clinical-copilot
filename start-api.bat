@echo off
cd /d "%~dp0"
echo.
echo VisionFlow API - http://127.0.0.1:8000
echo Keep this window open. Open a second terminal and run start-web.bat
echo.
uvicorn backend.main:app --reload --port 8000

@echo off
cd /d "%~dp0\..\.."
echo CAUTION: Only use this on private Wi-Fi. Local HTTP/WebSocket is not encrypted.
py -3 -m pip show aiohttp >nul 2>&1
if errorlevel 1 (
  echo First run: py -3 -m pip install -r source\room\requirements.txt
  exit /b 1
)
py -3 source\room\server.py --host 0.0.0.0 --port 8765

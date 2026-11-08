@echo off
cd /d "%~dp0\..\.."
py -3 -m pip show aiohttp >nul 2>&1
if errorlevel 1 (
  echo First run: py -3 -m pip install -r source\room\requirements.txt
  exit /b 1
)
py -3 source\room\server.py --host 127.0.0.1 --port 8765

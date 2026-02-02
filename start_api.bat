@echo off
cd /d %~dp0
cd python

call venv\Scripts\activate

fastapi dev main.py

pause

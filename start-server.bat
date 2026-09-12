@echo off
REM Kayode Dashboard - Development Server Startup Script
REM This script starts a simple web server to serve the dashboard

echo.
echo ============================================
echo Kayode Bot Dashboard - Local Server
echo ============================================
echo.

REM Check if Python is available
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Starting server with Python...
    echo [INFO] Open your browser to: http://localhost:8000
    echo [INFO] Press Ctrl+C to stop the server
    echo.
    python -m http.server 8000
) ELSE (
    REM Check if Node.js is available
    where node >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo [INFO] Python not found, trying Node.js...
        echo [INFO] Starting server with npm http-server...
        echo [INFO] Open your browser to: http://localhost:8080
        echo [INFO] Press Ctrl+C to stop the server
        echo.
        npx http-server -p 8080
    ) ELSE (
        echo [ERROR] Neither Python nor Node.js found in PATH
        echo.
        echo Please install one of the following:
        echo - Python 3: https://www.python.org/downloads/
        echo - Node.js: https://nodejs.org/
        echo.
        echo After installation, run this script again.
        pause
    )
)

# Kayode Dashboard - PowerShell Development Server Startup Script
# This script starts a simple web server to serve the dashboard

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Kayode Bot Dashboard - Local Server" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$pythonPath = Get-Command python -ErrorAction SilentlyContinue
$nodePath = Get-Command node -ErrorAction SilentlyContinue

if ($pythonPath) {
    Write-Host "[INFO] Starting server with Python..." -ForegroundColor Green
    Write-Host "[INFO] Open your browser to: http://localhost:8000" -ForegroundColor Yellow
    Write-Host "[INFO] Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host ""
    & python -m http.server 8000
} elseif ($nodePath) {
    Write-Host "[INFO] Python not found, trying Node.js..." -ForegroundColor Yellow
    Write-Host "[INFO] Starting server with npm http-server..." -ForegroundColor Green
    Write-Host "[INFO] Open your browser to: http://localhost:8080" -ForegroundColor Yellow
    Write-Host "[INFO] Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host ""
    & npx http-server -p 8080
} else {
    Write-Host "[ERROR] Neither Python nor Node.js found in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install one of the following:" -ForegroundColor Yellow
    Write-Host "- Python 3: https://www.python.org/downloads/" 
    Write-Host "- Node.js: https://nodejs.org/"
    Write-Host ""
    Write-Host "After installation, run this script again." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
}

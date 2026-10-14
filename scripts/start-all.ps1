# NYAYASETU - Local Development Multi-Service Launcher
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "        NYAYASETU Citizen Legal Platform Launcher         " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$WorkspaceRoot = Resolve-Path "$PSScriptRoot\.."

Write-Host "Starting services in local development mode..." -ForegroundColor Yellow
Write-Host "1. ML Classification Service (Port 8000)" -ForegroundColor White
Write-Host "2. Express Backend API (Port 5000)" -ForegroundColor White
Write-Host "3. React + Vite Frontend (Port 5173)" -ForegroundColor White
Write-Host "----------------------------------------------------------" -ForegroundColor Gray

# Launch ML Service in separate window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$WorkspaceRoot\ml-service'; .\.venv\Scripts\uvicorn src.main:app --port 8000 --reload"

# Launch Backend in separate window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$WorkspaceRoot\backend'; npm run dev"

# Launch Frontend in separate window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$WorkspaceRoot\frontend'; npm run dev"

Write-Host "`n✅ All services initiated!" -ForegroundColor Green
Write-Host "Open your browser to: http://localhost:5173" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

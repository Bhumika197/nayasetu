# NYAYASETU - Automated Local Test Suite Runner
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "       NYAYASETU Automated Local Verification Suite        " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Backend Tests
Write-Host "`n[1/3] Running Node.js / Express Backend Vitest Suite..." -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot\..\backend"
npm test
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend tests failed!" -ForegroundColor Red
    exit $LASTEXITCODE
}
Write-Host "✅ Backend Vitest Suite Passed!" -ForegroundColor Green

# 2. Python ML Service Tests
Write-Host "`n[2/3] Running Python FastAPI / Scikit-Learn Pytest Suite..." -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot\..\ml-service"
.\.venv\Scripts\pytest
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ML Service tests failed!" -ForegroundColor Red
    exit $LASTEXITCODE
}
Write-Host "✅ ML Service Pytest Suite Passed!" -ForegroundColor Green

# 3. Frontend Build Verification
Write-Host "`n[3/3] Compiling React + Vite + TypeScript Frontend..." -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot\..\frontend"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend compilation failed!" -ForegroundColor Red
    exit $LASTEXITCODE
}
Write-Host "✅ Frontend Vercel-Compatible Bundle Built Successfully!" -ForegroundColor Green

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host "  🎉 All NYAYASETU Systems Fully Functional & Verified!   " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
Set-Location -Path "$PSScriptRoot\.."

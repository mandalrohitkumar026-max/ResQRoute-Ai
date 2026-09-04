# ResQRoute AI - Backend Launcher Script
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "🚀 Launching ResQRoute AI FastAPI Backend Server..." -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

Write-Host "Docs will be available at: http://localhost:8000/docs" -ForegroundColor Yellow
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

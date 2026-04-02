#!/usr/bin/env powershell

# Placement Portal - Complete Setup Script
# This script sets up MongoDB Atlas and tests your API

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Placement Portal - Setup & Configuration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js installation
Write-Host "✓ Checking Node.js..." -ForegroundColor Green
$nodeVersion = node --version
Write-Host "  Node.js version: $nodeVersion" -ForegroundColor Yellow

# Check npm installation  
Write-Host "✓ Checking npm..." -ForegroundColor Green
$npmVersion = npm --version
Write-Host "  npm version: $npmVersion" -ForegroundColor Yellow

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "1. SET UP MONGODB (Choose ONE option)" -ForegroundColor Yellow
Write-Host ""

Write-Host "   OPTION A: MongoDB Atlas (Cloud - RECOMMENDED)" -ForegroundColor Green
Write-Host "   =====================================
Write-Host "   a) Go to: https://www.mongodb.com/cloud/atlas"
Write-Host "   b) Create FREE account"
Write-Host "   c) Create a cluster (select FREE tier)"
Write-Host "   d) Add database user: student_user / SecurePassword123!"
Write-Host "   e) Get connection string"
Write-Host "   f) Update .env with:"
Write-Host "      MONGODB_URI=mongodb+srv://student_user:SecurePassword123!@yourcluster.mongodb.net/placement_portal"
Write-Host ""

Write-Host "   OPTION B: Local MongoDB" -ForegroundColor Green
Write-Host "   ========================"
Write-Host "   a) Download: https://www.mongodb.com/try/download/community"
Write-Host "   b) Install MongoDB Community Edition"
Write-Host "   c) Run: mongod"
Write-Host "   d) Keep .env as: MONGODB_URI=mongodb://localhost:27017/placement_portal"
Write-Host ""

Write-Host "2. UPDATE .env FILE" -ForegroundColor Yellow
Write-Host "   ==================" -ForegroundColor Yellow
Write-Host "   Edit: backend/.env"
Write-Host "   Add your MongoDB URI"
Write-Host "   Add JWT_SECRET=your-secret-key-123"
Write-Host ""

Write-Host "3. START THE SERVER" -ForegroundColor Yellow
Write-Host "   ==================" -ForegroundColor Yellow
Write-Host "   cd backend"
Write-Host "   npm start"
Write-Host ""

Write-Host "4. TEST WITH CURL (from another terminal)" -ForegroundColor Yellow
Write-Host "   ==================================" -ForegroundColor Yellow
Write-Host "   curl http://localhost:5000/api/health"
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "QUICK TEST" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "Register Student:" -ForegroundColor Yellow
Write-Host '@"
curl -X POST http://localhost:5000/api/students/register ^
  -F "name=John Doe" ^
  -F "email=john@example.com" ^
  -F "password=Password123" ^
  -F "skills=JavaScript,Python" ^
  -F "cgpa=8.5" ^
  -F "department=Computer Science" ^
  -F "resume=@C:\path\to\resume.pdf"
"@' | more

Write-Host ""
Write-Host "Login:" -ForegroundColor Yellow
Write-Host '@"
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"john@example.com\",\"password\":\"Password123\"}"
"@' | more

Write-Host ""
Write-Host "View all API documentation in: API_TESTING_GUIDE.md" -ForegroundColor Cyan
Write-Host ""

@echo off
REM Quick Start Script for Placement Portal Full Stack App (Windows)

echo.
echo ========================================================
echo  PLACEMENT PORTAL - FULL STACK APPLICATION STARTER
echo  
echo  Starting your intelligent placement platform...
echo ========================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js found: %NODE_VERSION%
echo.

REM Navigate to backend directory
cd backend

REM Check if package.json exists
if not exist "package.json" (
    echo [ERROR] package.json not found in backend directory
    pause
    exit /b 1
)

REM Install dependencies
echo [INFO] Installing backend dependencies...
echo (This may take a moment on first run)
echo.
call npm install > nul 2>&1

if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] npm install had issues but continuing...
)
echo [OK] Dependencies installed
echo.

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo [INFO] Creating configuration file (.env)...
    (
        echo PORT=5000
        echo MONGODB_URI=mongodb://localhost:27017/placement-portal
        echo NODE_ENV=development
        echo JWT_SECRET=placement_portal_secret_key_2026
        echo CORS_ORIGIN=*
    ) > .env
    echo [OK] Configuration file created
) else (
    echo [OK] Configuration file already exists
)
echo.

REM Check if MongoDB is available (optional warning)
echo [INFO] MongoDB Status:
echo Make sure MongoDB is running before starting the application
echo Start MongoDB using: mongod (or MongoDB Compass GUI)
echo.

REM Start the server
echo.
echo ========================================================
echo  STARTING SERVER
echo ========================================================
echo Frontend URL:    http://localhost:5000
echo API Base URL:    http://localhost:5000/api
echo.
echo Press Ctrl+C to stop the server
echo ========================================================
echo.

call npm run dev

pause

@echo off
REM MongoDB Automated Setup for Windows
REM This script will guide you through MongoDB setup

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║     MongoDB Setup - Placement Portal                     ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

REM Check Node.js
WHERE node >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is not installed
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Run the Node.js setup script
cd /d "%~dp0"
node setup-mongodb.js

pause

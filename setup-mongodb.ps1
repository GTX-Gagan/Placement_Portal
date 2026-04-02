#!/usr/bin/env powershell
<#
MongoDB Setup Wizard for Placement Portal
Automatically detects MongoDB and configures the application
#>

$ErrorActionPreference = "Stop"

# Color output
function Write-Success { Write-Host $args[0] -ForegroundColor Green }
function Write-Error-Custom { Write-Host $args[0] -ForegroundColor Red }
function Write-Info { Write-Host $args[0] -ForegroundColor Cyan }
function Write-Warning-Custom { Write-Host $args[0] -ForegroundColor Yellow }

# Script version
$SCRIPT_VERSION = "1.0"
$PROJECT_ROOT = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$BACKEND_DIR = Join-Path $PROJECT_ROOT "backend"
$ENV_FILE = Join-Path $BACKEND_DIR ".env"

Write-Info "╔════════════════════════════════════════════════════════╗"
Write-Info "║     MongoDB Setup Wizard - Placement Portal            ║"
Write-Info "║                 v$SCRIPT_VERSION                            ║"
Write-Info "╚════════════════════════════════════════════════════════╝"
Write-Info ""

# ============================================================================
# Function: Check if MongoDB is installed locally
# ============================================================================
function Test-MongoDBInstalled {
    Write-Info "Checking for local MongoDB installation..."
    
    # Check common MongoDB installation paths
    $mongoPaths = @(
        "C:\Program Files\MongoDB\Server\*\bin\mongod.exe",
        "C:\Program Files (x86)\MongoDB\Server\*\bin\mongod.exe",
        "C:\mongodb\bin\mongod.exe"
    )
    
    foreach ($path in $mongoPaths) {
        $result = Get-Item $path -ErrorAction SilentlyContinue
        if ($result) {
            Write-Success "Found MongoDB at: $result"
            return $true, $result
        }
    }
    
    return $false, $null
}

# ============================================================================
# Function: Start MongoDB service
# ============================================================================
function Start-MongoDBService {
    Write-Info "Attempting to start MongoDB service..."
    
    try {
        # Try to start MongoDB service
        Start-Service -Name "MongoDB" -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
        
        # Check if service actually started
        $service = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
        if ($service.Status -eq "Running") {
            Write-Success "✓ MongoDB service started successfully"
            return $true
        }
    } catch {
        # Service might not exist, continue with manual start
    }
    
    return $false
}

# ============================================================================
# Function: Check MongoDB connectivity
# ============================================================================
function Test-MongoDBConnection {
    param([string]$ConnectionString)
    
    Write-Info "Testing MongoDB connection..."
    
    try {
        # Use Node.js to test connection
        $testScript = @"
const mongoose = require('mongoose');

const testConnection = async () => {
    try {
        await mongoose.connect('$ConnectionString', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        });
        console.log('SUCCESS');
        await mongoose.connection.close();
    } catch (error) {
        console.log('FAILED');
    }
};

testConnection();
"@
        
        $result = node -e $testScript 2>&1
        return $result -contains "SUCCESS"
    } catch {
        return $false
    }
}

# ============================================================================
# Function: Update .env file
# ============================================================================
function Update-EnvFile {
    param(
        [string]$MongoURI,
        [string]$StorageType = "local"
    )
    
    Write-Info "Updating .env configuration..."
    
    $envContent = @"
PORT=5000
NODE_ENV=development
MONGODB_URI=$MongoURI
JWT_SECRET=placement-portal-secret-key-2024

# File Storage Configuration
STORAGE_TYPE=$StorageType
LOCAL_UPLOAD_DIR=uploads

# AWS S3 Configuration (required if STORAGE_TYPE=s3)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=
"@
    
    Set-Content -Path $ENV_FILE -Value $envContent -Encoding UTF8
    Write-Success "✓ .env file updated successfully"
}

# ============================================================================
# Function: Verify Node.js and dependencies
# ============================================================================
function Test-Prerequisites {
    Write-Info "Checking prerequisites..."
    
    # Check Node.js
    $nodeVersion = node --version 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Error-Custom "✗ Node.js is not installed!"
        Write-Info "Please install Node.js from https://nodejs.org/"
        exit 1
    }
    Write-Success "✓ Node.js $nodeVersion installed"
    
    # Check if backend folder exists
    if (-not (Test-Path $BACKEND_DIR)) {
        Write-Error-Custom "✗ Backend directory not found at: $BACKEND_DIR"
        exit 1
    }
    Write-Success "✓ Backend directory found"
    
    # Check if package.json exists
    if (-not (Test-Path (Join-Path $BACKEND_DIR "package.json"))) {
        Write-Error-Custom "✗ package.json not found"
        exit 1
    }
    Write-Success "✓ package.json found"
}

# ============================================================================
# Function: Install dependencies
# ============================================================================
function Install-Dependencies {
    Write-Info ""
    Write-Info "Installing npm dependencies..."
    
    Push-Location $BACKEND_DIR
    try {
        npm install
        Write-Success "✓ Dependencies installed successfully"
    } catch {
        Write-Error-Custom "✗ Failed to install dependencies"
        exit 1
    } finally {
        Pop-Location
    }
}

# ============================================================================
# Function: Start the server
# ============================================================================
function Start-Server {
    param([string]$MongoURI)
    
    Write-Success ""
    Write-Success "═══════════════════════════════════════════════════════"
    Write-Success "Starting Placement Portal API Server..."
    Write-Success "═══════════════════════════════════════════════════════"
    Write-Success ""
    
    Push-Location $BACKEND_DIR
    try {
        $env:MONGODB_URI = $MongoURI
        npm start
    } finally {
        Pop-Location
    }
}

# ============================================================================
# MAIN EXECUTION
# ============================================================================

# Check prerequisites
Test-Prerequisites

Write-Info ""
Write-Info "Select MongoDB setup option:"
Write-Info ""
Write-Info "1) Use Local MongoDB (if installed)"
Write-Info "2) Use MongoDB Atlas Cloud (recommended for production)"
Write-Info "3) Configure custom MongoDB URI"
Write-Info ""

$choice = Read-Host "Enter your choice (1-3)"

switch ($choice) {
    "1" {
        # Local MongoDB
        Write-Info ""
        Write-Info "═══════════════════════════════════════════════════════"
        Write-Info "Setting up Local MongoDB..."
        Write-Info "═══════════════════════════════════════════════════════"
        Write-Info ""
        
        $isInstalled, $mongoPath = Test-MongoDBInstalled
        
        if (-not $isInstalled) {
            Write-Error-Custom "MongoDB is not installed on this system"
            Write-Info ""
            Write-Info "To install MongoDB locally:"
            Write-Info "1. Download from: https://www.mongodb.com/try/download/community"
            Write-Info "2. Run the installer (MongoDB Community Server)"
            Write-Info "3. Run this script again"
            Write-Info ""
            Write-Info "OR use MongoDB Atlas Cloud (Option 2)"
            exit 1
        }
        
        # Try to start MongoDB service
        $serviceStarted = Start-MongoDBService
        
        if (-not $serviceStarted) {
            Write-Warning-Custom "Could not start MongoDB service automatically"
            Write-Info "Please manually start MongoDB:"
            Write-Info "  Option A: Start the MongoDB service in Services (services.msc)"
            Write-Info "  Option B: Run mongod.exe from Command Prompt"
            Write-Info ""
            $continue = Read-Host "Have you started MongoDB manually? (yes/no)"
            if ($continue -ne "yes") {
                exit 1
            }
        }
        
        # Test connection
        $mongoURI = "mongodb://localhost:27017/placement_portal"
        
        Write-Info "Waiting for MongoDB to be ready..."
        Start-Sleep -Seconds 2
        
        $connected = Test-MongoDBConnection -ConnectionString $mongoURI
        
        if ($connected) {
            Write-Success "✓ Successfully connected to local MongoDB"
            Update-EnvFile -MongoURI $mongoURI -StorageType "local"
            Install-Dependencies
            Start-Server -MongoURI $mongoURI
        } else {
            Write-Error-Custom "✗ Could not connect to MongoDB at localhost:27017"
            Write-Info ""
            Write-Info "Troubleshooting:"
            Write-Info "1. Is MongoDB running? Check Task Manager for mongod.exe"
            Write-Info "2. Is port 27017 available?"
            Write-Info "3. Try: net start MongoDB (in admin PowerShell)"
            exit 1
        }
    }
    
    "2" {
        # MongoDB Atlas Cloud
        Write-Info ""
        Write-Info "═══════════════════════════════════════════════════════"
        Write-Info "MongoDB Atlas Cloud Setup"
        Write-Info "═══════════════════════════════════════════════════════"
        Write-Info ""
        Write-Info "Follow these steps to set up MongoDB Atlas:"
        Write-Info ""
        Write-Info "1. Go to: https://www.mongodb.com/cloud/atlas"
        Write-Info "2. Sign up with your email"
        Write-Info "3. Create a free tier cluster"
        Write-Info "4. Create a database user"
        Write-Info "5. Get your connection string (looks like):"
        Write-Info "   mongodb+srv://username:password@cluster.mongodb.net/..."
        Write-Info ""
        
        $mongoURI = Read-Host "Paste your MongoDB Atlas connection string"
        
        if ([string]::IsNullOrWhiteSpace($mongoURI)) {
            Write-Error-Custom "Connection string cannot be empty"
            exit 1
        }
        
        # Test connection
        Write-Info "Testing MongoDB Atlas connection..."
        $connected = Test-MongoDBConnection -ConnectionString $mongoURI
        
        if ($connected) {
            Write-Success "✓ Successfully connected to MongoDB Atlas"
            Update-EnvFile -MongoURI $mongoURI -StorageType "local"
            Install-Dependencies
            Start-Server -MongoURI $mongoURI
        } else {
            Write-Error-Custom "✗ Could not connect to MongoDB Atlas"
            Write-Info "Please verify:"
            Write-Info "  - Connection string is correct"
            Write-Info "  - Username and password are correct"
            Write-Info "  - Network access is allowed (0.0.0.0/0)"
            Write-Info "  - Cluster is active and running"
            exit 1
        }
    }
    
    "3" {
        # Custom MongoDB URI
        Write-Info ""
        Write-Info "═══════════════════════════════════════════════════════"
        Write-Info "Custom MongoDB URI Configuration"
        Write-Info "═══════════════════════════════════════════════════════"
        Write-Info ""
        Write-Info "Examples:"
        Write-Info "  Local:  mongodb://localhost:27017/placement_portal"
        Write-Info "  Atlas:  mongodb+srv://user:pass@cluster.mongodb.net/placement_portal"
        Write-Info ""
        
        $mongoURI = Read-Host "Enter your MongoDB connection string"
        
        if ([string]::IsNullOrWhiteSpace($mongoURI)) {
            Write-Error-Custom "Connection string cannot be empty"
            exit 1
        }
        
        Update-EnvFile -MongoURI $mongoURI -StorageType "local"
        Install-Dependencies
        Start-Server -MongoURI $mongoURI
    }
    
    default {
        Write-Error-Custom "Invalid choice"
        exit 1
    }
}

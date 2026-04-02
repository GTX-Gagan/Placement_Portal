#!/usr/bin/env node

/**
 * MongoDB Auto-Configuration
 * Automatically detects and configures MongoDB for the project
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execSync = require('child_process').execSync;

// Configuration
const BACKEND_DIR = path.join(__dirname, 'backend');
const ENV_FILE = path.join(BACKEND_DIR, '.env');

// Colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.cyan}ℹ ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  header: (msg) => console.log(`\n${colors.bold}${colors.cyan}${msg}${colors.reset}\n`),
  blank: () => console.log('')
};

/**
 * Update .env file with MongoDB URI
 */
function updateEnvFile(mongoURI, storageType = 'local') {
  const envContent = `PORT=5000
NODE_ENV=development
MONGODB_URI=${mongoURI}
JWT_SECRET=placement-portal-secret-key-2024

# File Storage Configuration
STORAGE_TYPE=${storageType}
LOCAL_UPLOAD_DIR=uploads

# AWS S3 Configuration (required if STORAGE_TYPE=s3)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=
`;
  
  fs.writeFileSync(ENV_FILE, envContent, 'utf-8');
  log.success('.env file configured with MongoDB');
}

/**
 * Check if MongoDB is running locally
 */
async function testLocalMongoDB() {
  try {
    const mongoose = require('mongoose');
    
    const connection = await Promise.race([
      mongoose.connect('mongodb://localhost:27017/placement_portal', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 3000
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
    ]);
    
    await mongoose.connection.close();
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Try to start MongoDB service on Windows
 */
function tryStartMongoDBService() {
  try {
    execSync('net start MongoDB', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Check if mongod is installed
 */
function checkMongoDBInstalled() {
  try {
    execSync('mongod --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Install npm dependencies
 */
function installDependencies() {
  try {
    log.info('Installing npm dependencies...');
    process.chdir(BACKEND_DIR);
    execSync('npm install', { stdio: 'inherit' });
    log.success('Dependencies installed');
    return true;
  } catch (error) {
    log.error('Failed to install dependencies');
    return false;
  }
}

/**
 * Main auto-setup
 */
async function autoSetup() {
  console.clear();
  log.header('🚀 MongoDB Auto-Configuration');
  
  // Check prerequisites
  log.info('Checking prerequisites...');
  if (!fs.existsSync(BACKEND_DIR)) {
    log.error('Backend directory not found');
    process.exit(1);
  }
  if (!fs.existsSync(path.join(BACKEND_DIR, 'package.json'))) {
    log.error('package.json not found');
    process.exit(1);
  }
  log.success('Project structure verified');
  
  log.blank();
  log.info('Starting auto-detection...');
  log.blank();
  
  // Option 1: Try local MongoDB
  log.info('Checking for local MongoDB installation...');
  if (checkMongoDBInstalled()) {
    log.success('MongoDB found');
    
    log.info('Attempting to start MongoDB service...');
    if (tryStartMongoDBService()) {
      log.success('MongoDB service started');
    } else {
      log.warn('Could not auto-start service (might already be running)');
    }
    
    // Wait for service to be ready
    log.info('Waiting for MongoDB to be ready...');
    await new Promise(r => setTimeout(r, 2000));
    
    log.info('Testing local MongoDB connection...');
    const connected = await testLocalMongoDB();
    
    if (connected) {
      log.success('Local MongoDB is accessible');
      updateEnvFile('mongodb://localhost:27017/placement_portal');
      installDependencies();
      
      log.blank();
      log.header('✅ Setup Complete!');
      console.log('MongoDB is configured and ready to use.');
      console.log('');
      console.log('To start the API server, run:');
      console.log(`  cd backend`);
      console.log(`  npm start`);
      console.log('');
      console.log('Your API will be available at: http://localhost:5000');
      process.exit(0);
    }
  }
  
  // Option 2: Provide pre-configured options
  log.info('Local MongoDB not available or not accessible');
  log.blank();
  log.header('Quick Configuration Options');
  
  console.log('1. Configure for MongoDB Atlas Cloud (recommended)');
  console.log('   → Requires: Free MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)');
  console.log('   → Time: 5 minutes');
  console.log('   → Best for: Production and cloud deployments');
  console.log('');
  console.log('2. Install MongoDB Locally');
  console.log('   → Download: https://www.mongodb.com/try/download/community');
  console.log('   → Install and run: mongod.exe');
  console.log('   → Time: 10 minutes');
  console.log('   → Best for: Development');
  console.log('');
  console.log('3. Configure Custom MongoDB Connection');
  console.log('   → Provide your own MongoDB connection string');
  console.log('   → Time: 1 minute');
  console.log('');
  
  log.blank();
  log.info('Setting up for MongoDB Atlas Cloud (recommended)...');
  
  // Create a default working configuration
  // For now, we'll set up with a placeholder that guides users
  const atlasExample = 'mongodb+srv://username:password@cluster0.mongodb.net/placement_portal?retryWrites=true&w=majority';
  
  updateEnvFile(atlasExample);
  installDependencies();
  
  log.blank();
  log.header('⚙️ Configuration Created');
  
  console.log('Your .env file has been created with MongoDB Atlas placeholder.');
  console.log('');
  console.log('📋 Next Steps:');
  console.log('');
  console.log('1. Create a free MongoDB Atlas account:');
  console.log('   https://www.mongodb.com/cloud/atlas');
  console.log('');
  console.log('2. Create a cluster and database user');
  console.log('');
  console.log('3. Copy your connection string (looks like):');
  console.log('   mongodb+srv://username:password@cluster0.mongodb.net/placement_portal?...');
  console.log('');
  console.log('4. Update backend/.env with your connection string:');
  console.log('   MONGODB_URI=mongodb+srv://your-username:your-password@...');
  console.log('');
  console.log('5. Start the server:');
  console.log('   cd backend');
  console.log('   npm start');
  console.log('');
  console.log('📚 For detailed setup instructions, see:');
  console.log('   MONGODB_QUICK_5_STEPS.md (5 minute MongoDB Atlas setup)');
  console.log('   COMPLETE_MONGODB_SETUP.md (detailed guide)');
  console.log('');
  
  process.exit(0);
}

// Run auto-setup
autoSetup().catch(error => {
  log.error(`Error: ${error.message}`);
  process.exit(1);
});

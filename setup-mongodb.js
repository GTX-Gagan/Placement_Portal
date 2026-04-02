#!/usr/bin/env node

/**
 * MongoDB Setup Helper
 * Run with: node setup-mongodb.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { exec } = require('child_process');
const { promisify } = require('util');

const execPromise = promisify(exec);

// Configuration
const BACKEND_DIR = path.join(__dirname, 'backend');
const ENV_FILE = path.join(BACKEND_DIR, '.env');
const PROJECT_NAME = 'Placement Portal';

// Colors for terminal output
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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

/**
 * Test MongoDB connection
 */
async function testMongoDBConnection(mongoURI) {
  log.info('Testing MongoDB connection...');
  
  try {
    const mongoose = require('mongoose');
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    await mongoose.connection.close();
    log.success('MongoDB connection successful');
    return true;
  } catch (error) {
    log.error(`MongoDB connection failed: ${error.message}`);
    return false;
  }
}

/**
 * Check if MongoDB is installed locally
 */
async function checkLocalMongoDB() {
  log.info('Checking for local MongoDB installation...');
  
  try {
    const { stdout } = await execPromise('mongod --version');
    log.success('Local MongoDB found');
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Update .env file
 */
function updateEnvFile(mongoURI, storageType = 'local') {
  log.info('Writing .env configuration...');
  
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
  log.success('.env file updated');
}

/**
 * Install dependencies
 */
async function installDependencies() {
  log.info('Installing npm dependencies...');
  
  try {
    process.chdir(BACKEND_DIR);
    await execPromise('npm install');
    log.success('Dependencies installed');
    return true;
  } catch (error) {
    log.error('Failed to install dependencies');
    return false;
  }
}

/**
 * Start MongoDB service (Windows)
 */
async function startMongoDBService() {
  log.info('Attempting to start MongoDB service...');
  
  try {
    await execPromise('net start MongoDB');
    log.success('MongoDB service started');
    return true;
  } catch (error) {
    log.warn('Could not start MongoDB service');
    return false;
  }
}

/**
 * Main setup wizard
 */
async function main() {
  console.clear();
  
  log.header(`🚀 ${PROJECT_NAME} - MongoDB Setup Wizard`);
  
  // Verify Node.js
  log.info('Checking prerequisites...');
  if (!fs.existsSync(BACKEND_DIR)) {
    log.error('Backend directory not found');
    process.exit(1);
  }
  if (!fs.existsSync(path.join(BACKEND_DIR, 'package.json'))) {
    log.error('package.json not found');
    process.exit(1);
  }
  log.success('Verified project structure');
  
  log.blank();
  console.log('Choose MongoDB setup option:');
  console.log('');
  console.log('  1) Local MongoDB (if installed on your system)');
  console.log('  2) MongoDB Atlas Cloud (recommended - free tier)');
  console.log('  3) Custom MongoDB URI');
  console.log('  4) Quick Setup (tries local, falls back to prompt)');
  console.log('');
  
  const choice = await question('Enter your choice (1-4): ');
  log.blank();
  
  let mongoURI = null;
  let success = false;
  
  switch (choice) {
    case '1':
      // Local MongoDB
      log.header('Setting up Local MongoDB');
      
      const hasLocalMongo = await checkLocalMongoDB();
      if (!hasLocalMongo) {
        log.error('MongoDB is not installed on your system');
        log.info('Download from: https://www.mongodb.com/try/download/community');
        process.exit(1);
      }
      
      await startMongoDBService();
      await new Promise(r => setTimeout(r, 2000)); // Wait for service to start
      
      mongoURI = 'mongodb://localhost:27017/placement_portal';
      success = await testMongoDBConnection(mongoURI);
      break;
      
    case '2':
      // MongoDB Atlas
      log.header('MongoDB Atlas Cloud Setup');
      
      console.log('Steps to get your connection string:');
      console.log('  1. Go to: https://www.mongodb.com/cloud/atlas');
      console.log('  2. Create a free account');
      console.log('  3. Create a free cluster');
      console.log('  4. Add a database user');
      console.log('  5. Click "Connect" and copy the connection string');
      console.log('');
      
      mongoURI = await question('Paste your MongoDB Atlas connection string: ');
      
      if (!mongoURI.trim()) {
        log.error('Connection string cannot be empty');
        process.exit(1);
      }
      
      success = await testMongoDBConnection(mongoURI);
      break;
      
    case '3':
      // Custom URI
      log.header('Custom MongoDB URI');
      
      console.log('Examples:');
      console.log('  mongodb://localhost:27017/placement_portal');
      console.log('  mongodb+srv://user:pass@cluster.mongodb.net/placement_portal');
      console.log('');
      
      mongoURI = await question('Enter your MongoDB connection string: ');
      
      if (!mongoURI.trim()) {
        log.error('Connection string cannot be empty');
        process.exit(1);
      }
      
      success = await testMongoDBConnection(mongoURI);
      break;
      
    case '4':
      // Quick setup
      log.header('Quick Setup - Auto Detection');
      
      const hasLocal = await checkLocalMongoDB();
      
      if (hasLocal) {
        log.info('Local MongoDB detected');
        await startMongoDBService();
        await new Promise(r => setTimeout(r, 2000));
        
        mongoURI = 'mongodb://localhost:27017/placement_portal';
        success = await testMongoDBConnection(mongoURI);
        
        if (success) {
          log.success('Using local MongoDB');
        }
      }
      
      if (!success) {
        log.info('Local MongoDB not available, prompting for Atlas');
        
        console.log('');
        console.log('Sign up for free MongoDB Atlas at:');
        console.log('  https://www.mongodb.com/cloud/atlas');
        console.log('');
        
        mongoURI = await question('Paste your MongoDB Atlas connection string: ');
        success = await testMongoDBConnection(mongoURI);
      }
      break;
      
    default:
      log.error('Invalid choice');
      process.exit(1);
  }
  
  if (!success) {
    log.error('Could not connect to MongoDB');
    log.info('Please verify your connection string and try again');
    process.exit(1);
  }
  
  // Update .env
  updateEnvFile(mongoURI);
  
  // Install dependencies
  await installDependencies();
  
  log.blank();
  log.header('✨ Setup Complete!');
  
  console.log('Next steps:');
  console.log('  cd backend');
  console.log('  npm start');
  console.log('');
  console.log('Your API will be available at: http://localhost:5000');
  console.log('');
  
  rl.close();
}

// Run setup
main().catch(error => {
  log.error(`Setup failed: ${error.message}`);
  rl.close();
  process.exit(1);
});

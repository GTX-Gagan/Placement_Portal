#!/bin/bash
# Quick Start Script for Placement Portal Full Stack App

echo "🚀 Starting Placement Portal Full Stack App..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Check if MongoDB is installed/running
echo "Checking MongoDB..."
# This is a simple check - users should ensure MongoDB is running

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/placement-portal
NODE_ENV=development
JWT_SECRET=placement_portal_secret_key_2026
CORS_ORIGIN=*
EOF
    echo "✅ .env file created"
fi

echo ""
echo "🔥 Starting backend server..."
echo "Server will run on: http://localhost:5000"
echo ""
echo "📝 Frontend will be served at: http://localhost:5000/"
echo ""
echo "Hint: Default test credentials:"
echo "  Email: admin@portal.com"
echo "  Password: admin123"
echo "  Role: admin"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev

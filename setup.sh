#!/bin/bash

# CryptoIntel Pro - Quick Setup Script
# This script will set up your development environment

echo "🚀 CryptoIntel Pro - Quick Setup"
echo "=================================="
echo ""

# Check Node.js version
echo "Checking Node.js version..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js 18+ from: https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version is too old ($NODE_VERSION)"
    echo "Please upgrade to Node.js 18+ from: https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully!"
echo ""

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp .env.example .env.local
    echo "✅ Created .env.local (you can add API keys later)"
    echo ""
fi

# Done
echo "🎉 Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Visit http://localhost:3000 in your browser"
echo "3. Click the green + button to add coins"
echo "4. Default admin password is: crypto2024"
echo ""
echo "📚 Read DEPLOYMENT_GUIDE.md for Vercel deployment"
echo "📁 Read PROJECT_STRUCTURE.md to understand the code"
echo ""
echo "Happy trading! 🚀📈"

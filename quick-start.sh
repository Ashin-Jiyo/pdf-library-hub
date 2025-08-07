#!/bin/bash

# Quick Start Script for PDF Library Dual Upload System
# This script helps you verify and set up the required services

echo "🚀 PDF Library Dual Upload System - Quick Start"
echo "==============================================="
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "📋 Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
fi

# Check Node.js and npm
echo "🔍 Checking system requirements..."
node_version=$(node --version 2>/dev/null || echo "not found")
npm_version=$(npm --version 2>/dev/null || echo "not found")

if [ "$node_version" = "not found" ]; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
else
    echo "✅ Node.js: $node_version"
fi

if [ "$npm_version" = "not found" ]; then
    echo "❌ npm not found. Please install npm"
    exit 1
else
    echo "✅ npm: $npm_version"
fi

echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
    echo ""
fi

# Check environment variables
echo "🔧 Checking environment configuration..."
echo ""

# Check Cloudinary config
cloudinary_name=$(grep "VITE_CLOUDINARY_CLOUD_NAME" .env | cut -d '=' -f2)
cloudinary_preset=$(grep "VITE_CLOUDINARY_UPLOAD_PRESET" .env | cut -d '=' -f2)

if [ "$cloudinary_name" = "your_cloud_name_here" ] || [ -z "$cloudinary_name" ]; then
    echo "❌ Cloudinary Cloud Name not configured"
    echo "   📖 See: ./CLOUDINARY_SETUP.md"
    cloudinary_ok=false
else
    echo "✅ Cloudinary Cloud Name configured"
    cloudinary_ok=true
fi

if [ "$cloudinary_preset" = "your_upload_preset_here" ] || [ -z "$cloudinary_preset" ]; then
    echo "❌ Cloudinary Upload Preset not configured"
    echo "   📖 See: ./CLOUDINARY_SETUP.md"
    cloudinary_ok=false
else
    echo "✅ Cloudinary Upload Preset configured"
fi

# Check ImageKit config
imagekit_public=$(grep "VITE_IMAGEKIT_PUBLIC_KEY" .env | cut -d '=' -f2)
imagekit_private=$(grep "VITE_IMAGEKIT_PRIVATE_KEY" .env | cut -d '=' -f2)
imagekit_endpoint=$(grep "VITE_IMAGEKIT_URL_ENDPOINT" .env | cut -d '=' -f2)

if [[ "$imagekit_public" == *"your_"* ]] || [ -z "$imagekit_public" ]; then
    echo "❌ ImageKit Public Key not configured"
    echo "   📖 See: ./IMAGEKIT_SETUP.md"
    imagekit_ok=false
else
    echo "✅ ImageKit Public Key configured"
    imagekit_ok=true
fi

if [[ "$imagekit_private" == *"your_"* ]] || [ -z "$imagekit_private" ]; then
    echo "❌ ImageKit Private Key not configured"
    echo "   📖 See: ./IMAGEKIT_SETUP.md"
    imagekit_ok=false
else
    echo "✅ ImageKit Private Key configured"
fi

if [[ "$imagekit_endpoint" == *"your_"* ]] || [ -z "$imagekit_endpoint" ]; then
    echo "❌ ImageKit URL Endpoint not configured"
    echo "   📖 See: ./IMAGEKIT_SETUP.md"
    imagekit_ok=false
else
    echo "✅ ImageKit URL Endpoint configured"
fi

echo ""

# Summary and next steps
if [ "$cloudinary_ok" = true ] && [ "$imagekit_ok" = true ]; then
    echo "🎉 All services are configured!"
    echo ""
    echo "🚀 Ready to start development server:"
    echo "   npm run dev"
    echo ""
    echo "📋 Test your setup:"
    echo "   1. Go to http://localhost:5173/dashboard/upload"
    echo "   2. Click 'Test Services' button"
    echo "   3. Try uploading PDFs of different sizes"
    echo ""
    echo "📏 File routing:"
    echo "   • PDFs < 10MB → Cloudinary"
    echo "   • PDFs 10MB-25MB → ImageKit"
    echo "   • PDFs > 25MB → Rejected"
else
    echo "🚨 Configuration needed:"
    echo ""
    if [ "$cloudinary_ok" != true ]; then
        echo "❌ Cloudinary setup required (handles PDFs < 10MB)"
        echo "   📖 Follow: ./CLOUDINARY_SETUP.md"
        echo "   🔗 Sign up: https://cloudinary.com"
        echo ""
    fi
    
    if [ "$imagekit_ok" != true ]; then
        echo "❌ ImageKit setup required (handles PDFs 10MB-25MB)"
        echo "   📖 Follow: ./IMAGEKIT_SETUP.md"
        echo "   🔗 Dashboard: https://imagekit.io/dashboard"
        echo ""
    fi
    
    echo "📚 Complete setup guide: ./API_SETUP_GUIDE.md"
fi

echo "==============================================="

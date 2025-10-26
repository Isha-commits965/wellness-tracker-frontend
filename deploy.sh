#!/bin/bash

# 🚀 Wellness Tracker Deployment Script
# This script helps prepare your app for Render deployment

echo "🚀 Preparing Wellness Tracker for deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the frontend root directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Built files are in the 'dist' directory"
    echo ""
    echo "🎯 Next steps:"
    echo "1. Push your code to GitHub"
    echo "2. Go to render.com and create a new service"
    echo "3. Connect your GitHub repository"
    echo "4. Set environment variables:"
    echo "   - VITE_API_BASE_URL: https://your-backend-url.onrender.com"
    echo "   - NODE_ENV: production"
    echo "5. Deploy!"
    echo ""
    echo "📖 For detailed instructions, see DEPLOYMENT.md"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi

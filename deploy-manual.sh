#!/bin/bash

# Simple deployment script for GitHub Pages
# This is a backup method if GitHub Actions fails

echo "🚀 Building project..."
npm run build

echo "📦 Deploying to GitHub Pages..."
npx gh-pages -d dist

echo "✅ Deployment complete!"
echo "🌐 Your site will be available at: https://ashin-jiyo.github.io/pdf-library-hub/"

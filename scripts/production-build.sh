#!/bin/bash
# Production build script for Replit deployment

set -e

echo "🔧 Starting production build..."

# Clean previous build
rm -rf dist

# Build frontend with production config (no broken chunking)
echo "📦 Building frontend..."
npx vite build --config vite.production.config.ts

# Build backend
echo "🖥️ Building backend..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --minify

# Copy static assets if needed
if [ -d "client/public" ]; then
    echo "📁 Copying static assets..."
    cp -r client/public/* dist/public/ 2>/dev/null || true
fi

echo "✅ Production build complete!"
echo "📊 Build sizes:"
ls -lh dist/public/js/*.js | awk '{print "   " $5 "\t" $9}'
echo ""
echo "🚀 Server bundle: $(ls -lh dist/index.js | awk '{print $5}')"

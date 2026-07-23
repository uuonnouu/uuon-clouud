#!/bin/bash
set -e

echo "=== Δmension Deployment Build (always fresh) ==="

echo "🔨 Installing dependencies..."
npm install --include=dev

echo "🔨 Building client (Vite)..."
npm run build:client

echo "🔨 Building server (esbuild)..."
npm run build:server

echo "dist/public/index.html: $(ls -lh dist/public/index.html | awk '{print $5}')"
echo "dist/index.js: $(ls -lh dist/index.js | awk '{print $5}')"
echo "✅ Deployment build complete."

#!/bin/bash
set -e

export NODE_ENV=production

echo "📦 Installing all dependencies (including build tools)..."
npm install --include=dev

echo "🎨 Building client (React + Vite)..."
npm run build:client

echo "⚙️ Building server (esbuild)..."
npm run build:server

echo "✅ Build complete — dist/public/index.html ready"
ls -la dist/public/index.html
ls -la dist/index.js

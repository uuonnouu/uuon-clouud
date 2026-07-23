#!/bin/bash
set -e

echo "=== Post-Merge Setup ==="

echo "Installing dependencies..."
npm install --legacy-peer-deps

echo "Building frontend..."
npx vite build

echo "=== Post-Merge Setup Complete ==="

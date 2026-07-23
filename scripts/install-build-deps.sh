#!/bin/bash
# Install build dependencies that may be missing in production install

npm install --no-save vite @vitejs/plugin-react esbuild autoprefixer postcss tailwindcss 2>/dev/null || true

#!/bin/bash
set -e

HASH_FILE="dist/.source_hash"

# Hash all source and build-config files that affect the output bundle
CURRENT_HASH=$(
  { find client/src shared server -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.css" -o -name "*.glsl" \) 2>/dev/null | sort; \
    echo "package.json"; echo "package-lock.json"; echo "vite.config.ts"; echo "client/index.html"; } \
  | xargs md5sum 2>/dev/null | md5sum | cut -d' ' -f1
)

if [ -f "dist/public/index.html" ] && [ -f "dist/index.js" ] && [ -f "$HASH_FILE" ] && [ "$(cat $HASH_FILE 2>/dev/null)" = "$CURRENT_HASH" ]; then
  echo "✅ Build cache valid — reusing dist/ (skipping rebuild)"
else
  echo "🔨 Building client and server..."
  npm install --include=dev
  npm run build:client
  npm run build:server
  mkdir -p dist
  echo "$CURRENT_HASH" > "$HASH_FILE"
  echo "✅ Build complete. Hash saved."
fi

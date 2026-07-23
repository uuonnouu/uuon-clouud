#!/bin/bash
set -e

echo "=== Clearing port 5000... ==="
fuser -k 5000/tcp 2>/dev/null || true
sleep 1

# Restore GitHub credential helper (survives restarts)
cp scripts/git-cred-helper.sh /tmp/git-cred-helper.sh 2>/dev/null && chmod +x /tmp/git-cred-helper.sh || true

echo "=== Δmension Production Build ==="

HASH_FILE="dist/.source_hash"

# Hash all source files and build-influencing config/dep files
CURRENT_HASH=$(
  { find client/src shared server -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.css" -o -name "*.glsl" \) 2>/dev/null | sort; \
    echo "package.json"; echo "package-lock.json"; echo "vite.config.ts"; echo "client/index.html"; } \
  | xargs md5sum 2>/dev/null | md5sum | cut -d' ' -f1
)

if [ -f "dist/public/index.html" ] && [ -f "dist/index.js" ] && [ -f "$HASH_FILE" ] && [ "$(cat $HASH_FILE 2>/dev/null)" = "$CURRENT_HASH" ]; then
  echo "✅ Build cache valid — reusing dist/ (cold start fast path)"
else
  echo "🔨 Source changed or no cache — building client and server..."
  npm install --include=dev
  npm run build:client
  npm run build:server
  mkdir -p dist
  echo "$CURRENT_HASH" > "$HASH_FILE"
  echo "✅ Build complete. Hash saved."
fi

echo "dist/public/index.html: $(ls -lh dist/public/index.html | awk '{print $5}')"
echo "dist/index.js: $(ls -lh dist/index.js | awk '{print $5}')"

echo "=== Syncing database schema... ==="
# Push schema to production DB (creates tables if missing, idempotent)
if [ -n "$DATABASE_URL" ]; then
  npx drizzle-kit push --config=drizzle.config.ts 2>&1 || echo "⚠️  Schema push had warnings (continuing)"
  echo "✅ Schema sync complete."
else
  echo "⚠️  DATABASE_URL not set — skipping schema push"
fi

echo "=== Starting server... ==="
NODE_ENV=production node dist/index.js

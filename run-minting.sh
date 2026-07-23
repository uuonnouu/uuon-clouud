#!/bin/bash

# Configuration and Paths
WORKSPACE_DIR="/home/runner/workspace"
SCRIPT_FILE="$WORKSPACE_DIR/scripts/deploy-and-mint.ts"
PROGRESS_FILE="$WORKSPACE_DIR/mint-progress.json"
NEW_TOKEN_ADDRESS="0x425734a7fd13E9994b66a7909206007A1EF7030B"

echo "===================================================="
echo "⚡ UUON Foundation — High-Precision Isolated Engine ⚡"
echo "===================================================="

# 1. Clear local cache file
if [ -f "$PROGRESS_FILE" ]; then
    rm -f "$PROGRESS_FILE"
fi

# 2. Compile secure credentials into the new unique naming matrix
NEON_MATRIX_DB_URL="postgresql://neondb_owner:${PGPASSWORD}@ep-curly-unit-atlt2cb4-pooler-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&options=endpoint%3Dep-curly-unit-atlt2cb4-pooler-pooler"

echo "🔗 Binding shapes to New Contract Target: $NEW_TOKEN_ADDRESS"
echo "🚀 Processing algorithm matrix rows silently via background thread..."
echo "----------------------------------------------------"

# 3. Fire background execution loop pointing cleanly to your isolated variable
DRY_RUN=false \
DATABASE_URL="$NEON_MATRIX_DB_URL" \
UUON_CONTRACT_ADDRESS="$UUON_MATHEMATICAL_UNIVERS_WALLET" \
ERC20_TOKEN_ADDRESS="$NEW_TOKEN_ADDRESS" \
npx tsx "$SCRIPT_FILE" >> /home/runner/workspace/mint-history.log 2>&1 &

echo "🛰️  Engine is running cleanly! Variable isolated to NEON_MATRIX_DB_URL."
echo "📄 View live data streams with command: tail -f mint-history.log"
echo "===================================================="

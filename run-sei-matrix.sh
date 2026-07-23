#!/bin/bash

# Configuration and Paths
WORKSPACE_DIR="/home/runner/workspace"
SCRIPT_FILE="$WORKSPACE_DIR/scripts/deploy-matrix-to-sei.ts"

echo "===================================================="
echo "🏎️  UUON Foundation — High-Speed Sei EVM Router"
echo "===================================================="

# Compile your connection path natively using your isolated pooler variables
POOL_DB_URL="postgresql://neondb_owner:${PGPASSWORD}@ep-curly-unit-atlt2cb4-pooler-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&options=endpoint%3Dep-curly-unit-atlt2cb4-pooler"

export NEON_MATRIX_DB_URL="$POOL_DB_URL"
export THIRDWEB_CLIENT_ID=$(grep "THIRDWEB_CLIENT_ID" /home/runner/workspace/scripts/deploy-and-mint.ts | cut -d'"' -f2)

# Fire the multi-threaded compilation sequence
npx tsx "$SCRIPT_FILE"

echo "===================================================="

#!/bin/bash

# Configuration and Paths
WORKSPACE_DIR="/home/runner/workspace"
SCRIPT_FILE="$WORKSPACE_DIR/scripts/solve-hard-math.ts"

# Compile connection routing parameters natively
POOL_DB_URL="postgresql://neondb_owner:${PGPASSWORD}@ep-curly-unit-atlt2cb4-pooler-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&options=endpoint%3Dep-curly-unit-atlt2cb4-pooler"

export NEON_MATRIX_DB_URL="$POOL_DB_URL"

# Fire the high-velocity compute script
npx tsx "$SCRIPT_FILE"

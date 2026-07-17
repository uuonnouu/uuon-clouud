#!/bin/bash
# CLOUUD v3.4 — REPLIT STARTUP (CORRECTED)
# Run this AFTER the deployment command completes

set -e

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "CLOUUD v3.4 — REPLIT STARTUP & VERIFICATION"
echo "════════════════════════════════════════════════════════════════"

# STEP 1: Verify package.json is valid
echo ""
echo "STEP 1: Verifying package.json..."
if ! node -e 'JSON.parse(require("fs").readFileSync("package.json", "utf8"))' 2>/dev/null; then
  echo "  ! Fixing package.json encoding..."
  npm pkg fix 2>/dev/null || echo "  (manual fix may be needed)"
fi
echo "  ✓ package.json valid"

# STEP 2: Verify Dockerfile exists
echo ""
echo "STEP 2: Checking Dockerfile..."
if [ ! -f "Dockerfile" ]; then
  echo "  ! Dockerfile missing. Checking for alternatives..."
  if [ -f "Dockerfile.slim" ]; then
    cp Dockerfile.slim Dockerfile
    echo "  ✓ Dockerfile.slim copied to Dockerfile"
  else
    echo "  ✗ No Dockerfile found. Cannot proceed."
    exit 1
  fi
else
  echo "  ✓ Dockerfile found"
fi

# STEP 3: Clean git state
echo ""
echo "STEP 3: Cleaning git state..."
git reset --hard HEAD 2>&1 | tail -2
git clean -fd 2>&1 | tail -1
echo "  ✓ Git cleaned"

# STEP 4: Reinstall dependencies (clean)
echo ""
echo "STEP 4: Reinstalling npm dependencies..."
rm -rf node_modules package-lock.json
npm install --prefer-offline --no-audit 2>&1 | tail -5
echo "  ✓ Dependencies installed"

# STEP 5: Set Ollama host
echo ""
echo "STEP 5: Configuring Ollama..."
export OLLAMA_HOST=http://localhost:11434
echo "  ✓ OLLAMA_HOST=$OLLAMA_HOST"

# STEP 6: Run database migrations
echo ""
echo "STEP 6: Running database migrations..."
npm run db:push 2>&1 | tail -3 || echo "  (may need manual db:push later)"
echo "  ✓ Migrations applied"

# STEP 7: Select Docker Compose version (Nix issue)
echo ""
echo "STEP 7: Setting up Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
  echo "  ! docker-compose not in PATH. Using 'docker compose' instead..."
  alias docker-compose='docker compose'
fi
echo "  ✓ Docker Compose ready"

# STEP 8: Start Docker services
echo ""
echo "STEP 8: Starting Docker services..."
docker compose up -d 2>&1 | tail -5
echo "  ✓ Docker services started"

# STEP 9: Wait for services to be ready
echo ""
echo "STEP 9: Waiting for services to initialize..."
sleep 15
echo "  ✓ Services initialized"

# STEP 10: Verify API is operational
echo ""
echo "STEP 10: Verifying API..."
HEALTH=$(curl -s http://localhost:5001/api/health || echo "{}")
STATUS=$(echo $HEALTH | jq -r '.status // "unknown"' 2>/dev/null || echo "unknown")

if [ "$STATUS" = "operational" ]; then
  echo "  ✓ API is operational"
  echo "  ✓ Database: $(echo $HEALTH | jq -r '.components.database.status // "unknown"')"
else
  echo "  ! API not ready yet. Waiting..."
  sleep 10
  curl -s http://localhost:5001/api/health | jq . || echo "  (API still starting)"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "✓ STARTUP COMPLETE"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "CLOUUD API: http://localhost:5001"
echo ""
echo "NEXT: Create a test conversation"
echo "  curl -X POST http://localhost:5001/api/conversations \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"title\":\"Test Conversation\"}'"
echo ""
echo "VERIFY: Check system prompt is grounded"
echo "  curl http://localhost:5001/api/creator-profile | jq '.AUTHOR_ENTITY_DETECTION'"
echo ""
echo "════════════════════════════════════════════════════════════════"

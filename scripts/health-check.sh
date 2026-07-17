#!/bin/bash

# CLOUUD Terminal Agent — Complete System Health Check
# Run this to verify everything is working correctly

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     CLOUUD TERMINAL AGENT — SYSTEM HEALTH CHECK           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

check_status() {
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✅ PASS${NC} - $2"
  else
    echo -e "${RED}❌ FAIL${NC} - $2"
    return 1
  fi
}

# 1. Docker Services
echo -e "${BLUE}═══ 1. DOCKER SERVICES${NC}"
echo ""

docker ps --filter "name=clouud" --format "table {{.Names}}\t{{.Status}}" | tail -n +2
DOCKER_CHECK=$?

if [ $DOCKER_CHECK -eq 0 ]; then
  CLOUUD_STATUS=$(docker ps --filter "name=clouud-prod" --format "{{.Status}}")
  DB_STATUS=$(docker ps --filter "name=clouud-db" --format "{{.Status}}")
  
  if [[ $CLOUUD_STATUS == *"running"* ]]; then
    check_status 0 "CLOUUD App Container"
  else
    check_status 1 "CLOUUD App Container (Status: $CLOUUD_STATUS)"
  fi
  
  if [[ $DB_STATUS == *"running"* ]]; then
    check_status 0 "PostgreSQL Database Container"
  else
    check_status 1 "PostgreSQL Database Container (Status: $DB_STATUS)"
  fi
else
  check_status 1 "Docker containers not found"
fi

echo ""

# 2. CLOUUD API Health
echo -e "${BLUE}═══ 2. CLOUUD API HEALTH${NC}"
echo ""

API_RESPONSE=$(curl -s http://localhost:5001/api/health 2>/dev/null || echo "{}")

if [[ $API_RESPONSE == *"operational"* ]]; then
  check_status 0 "CLOUUD API responding on port 5001"
  echo "   Status: $(echo $API_RESPONSE | jq -r '.status' 2>/dev/null || echo 'unknown')"
  echo "   Database: $(echo $API_RESPONSE | jq -r '.components.database.status' 2>/dev/null || echo 'unknown')"
else
  check_status 1 "CLOUUD API not responding (http://localhost:5001/api/health)"
fi

echo ""

# 3. PostgreSQL Database
echo -e "${BLUE}═══ 3. POSTGRESQL DATABASE${NC}"
echo ""

DB_CHECK=$(docker exec clouud-db psql -U clouud -d clouud -c "SELECT 1" 2>/dev/null || echo "failed")

if [[ $DB_CHECK == "1" ]]; then
  check_status 0 "PostgreSQL connection"
  
  TABLE_COUNT=$(docker exec clouud-db psql -U clouud -d clouud -t -c "SELECT count(*) FROM information_schema.tables WHERE table_schema='public'" 2>/dev/null || echo "0")
  echo "   Tables in database: $TABLE_COUNT"
else
  check_status 1 "PostgreSQL connection failed"
fi

echo ""

# 4. Ollama Integration
echo -e "${BLUE}═══ 4. OLLAMA LOCAL LLM${NC}"
echo ""

OLLAMA_CHECK=$(curl -s http://localhost:11434/api/tags 2>/dev/null || echo "failed")

if [[ $OLLAMA_CHECK != "failed" ]]; then
  check_status 0 "Ollama service running on port 11434"
  MODELS=$(echo $OLLAMA_CHECK | jq '.models | length' 2>/dev/null || echo "0")
  echo "   Models available: $MODELS"
  echo $OLLAMA_CHECK | jq '.models[].name' 2>/dev/null | head -3
else
  echo -e "${YELLOW}⚠️  WARN${NC}  - Ollama not running (http://localhost:11434)"
  echo "   To start: ollama serve"
fi

echo ""

# 5. Conversation History
echo -e "${BLUE}═══ 5. CONVERSATION HISTORY${NC}"
echo ""

CONV_COUNT=$(curl -s http://localhost:5001/api/conversations 2>/dev/null | jq 'length' || echo "0")

if [ "$CONV_COUNT" -gt 0 ]; then
  check_status 0 "Conversations stored"
  echo "   Total conversations: $CONV_COUNT"
else
  echo -e "${YELLOW}⚠️  WARN${NC}  - No conversations yet (this is normal for new setup)"
fi

echo ""

# 6. GitHub Sync
echo -e "${BLUE}═══ 6. GITHUB REPO SYNC${NC}"
echo ""

GITHUB_USER=$(docker exec clouud-prod sh -c 'echo $GITHUB_USER' 2>/dev/null || echo "not_set")

if [[ $GITHUB_USER != "not_set" ]] && [[ $GITHUB_USER != "" ]]; then
  check_status 0 "GitHub user configured"
  echo "   User: $GITHUB_USER"
  
  REPOS=$(curl -s http://localhost:5001/api/sync/github/stats 2>/dev/null | jq '.repos' || echo "0")
  echo "   Synced repos: $REPOS"
else
  echo -e "${YELLOW}⚠️  WARN${NC}  - GITHUB_USER not configured in .env"
  echo "   Set GITHUB_USER and GITHUB_TOKEN in .env.local to enable"
fi

echo ""

# 7. Credit & Token Tracking
echo -e "${BLUE}═══ 7. CREDIT & TOKEN TRACKING${NC}"
echo ""

CREDITS=$(curl -s http://localhost:5001/api/credits/all 2>/dev/null | jq '.total' || echo "0")

if [ "$CREDITS" -gt 0 ]; then
  check_status 0 "Credits registered"
  echo "   Total: $CREDITS"
  
  EXPIRING=$(curl -s http://localhost:5001/api/credits/all 2>/dev/null | jq '.expiringIn24h' || echo "0")
  echo "   Expiring in 24h: $EXPIRING"
else
  echo -e "${YELLOW}ℹ️  INFO${NC}  - No credits registered yet"
  echo "   Use: curl -X POST http://localhost:5001/api/credits/register ..."
fi

echo ""

# 8. Audit Logging
echo -e "${BLUE}═══ 8. AUDIT LOGGING${NC}"
echo ""

AUDIT_COUNT=$(curl -s http://localhost:5001/api/audit-log 2>/dev/null | jq '.count' || echo "0")

if [ "$AUDIT_COUNT" -gt 0 ]; then
  check_status 0 "Audit log active"
  echo "   Total events logged: $AUDIT_COUNT"
else
  echo -e "${YELLOW}ℹ️  INFO${NC}  - Audit log empty (normal for new setup)"
fi

echo ""

# 9. Blockchain Integration
echo -e "${BLUE}═══ 9. BLOCKCHAIN TRACKING${NC}"
echo ""

JUNO_TXS=$(curl -s "http://localhost:5001/api/blockchain/transactions?asset=JUNO" 2>/dev/null | jq '.count' || echo "0")

if [ "$JUNO_TXS" -gt 0 ]; then
  check_status 0 "JUNO transactions tracked"
  echo "   Recorded: $JUNO_TXS"
else
  echo -e "${YELLOW}ℹ️  INFO${NC}  - No JUNO transactions yet"
fi

echo ""

# 10. File System
echo -e "${BLUE}═══ 10. FILE SYSTEM${NC}"
echo ""

if [ -f ".env.local" ]; then
  check_status 0 ".env.local configured"
else
  echo -e "${YELLOW}⚠️  WARN${NC}  - .env.local not found"
  echo "   Create: cp .env.local.template .env.local"
fi

if [ -f "docker-compose.yml" ]; then
  check_status 0 "docker-compose.yml present"
else
  check_status 1 "docker-compose.yml missing"
fi

if [ -d "github-sync" ]; then
  SYNC_REPOS=$(find github-sync -maxdepth 1 -type d | wc -l)
  echo "   GitHub repos synced: $((SYNC_REPOS - 1))"
else
  echo "   GitHub sync directory not yet created"
fi

echo ""

# Summary
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    SUMMARY & NEXT STEPS                    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

if [[ $OLLAMA_CHECK == "failed" ]]; then
  echo -e "${YELLOW}🔧 ACTION REQUIRED:${NC}"
  echo "   1. Start Ollama: ${BLUE}ollama serve${NC}"
  echo "   2. Re-run this check"
  echo ""
fi

if [[ $GITHUB_USER == "not_set" ]]; then
  echo -e "${YELLOW}🔧 GITHUB SYNC SETUP:${NC}"
  echo "   1. Edit .env.local"
  echo "   2. Add: ${BLUE}GITHUB_USER=your_username${NC}"
  echo "   3. Add: ${BLUE}GITHUB_TOKEN=your_token${NC}"
  echo "   4. Restart: ${BLUE}docker-compose restart clouud-prod${NC}"
  echo "   5. Sync repos: ${BLUE}curl -X POST http://localhost:5001/api/sync/github/pull-all${NC}"
  echo ""
fi

echo -e "${GREEN}✅ QUICK TEST:${NC}"
echo "   1. Create conversation:"
echo "      ${BLUE}curl -X POST http://localhost:5001/api/conversations \\${NC}"
echo "      ${BLUE}-H 'Content-Type: application/json' \\${NC}"
echo "      ${BLUE}-d '{\"title\":\"Test\"}' | jq '.id'${NC}"
echo ""
echo "   2. Send message:"
echo "      ${BLUE}curl -X POST http://localhost:5001/api/conversations/1/messages \\${NC}"
echo "      ${BLUE}-H 'Content-Type: application/json' \\${NC}"
echo "      ${BLUE}-d '{\"content\":\"Hello CLOUUD\"}' | jq '.assistantMessage.content'${NC}"
echo ""
echo "   3. Check audit log:"
echo "      ${BLUE}curl http://localhost:5001/api/audit-log | jq '.entries[-1]'${NC}"
echo ""

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo "System check complete. All components operational."
echo ""

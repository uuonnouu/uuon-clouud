#!/bin/bash
# Quick 1-minute system verification

echo "🔍 CLOUUD System Verification..."
echo ""

# Check Docker
echo -n "Docker containers... "
if docker ps | grep -q clouud-prod; then echo "✅"; else echo "❌"; fi

# Check API
echo -n "CLOUUD API... "
if curl -s http://localhost:5001/api/health | grep -q "operational"; then echo "✅"; else echo "❌"; fi

# Check Database
echo -n "PostgreSQL... "
if docker exec clouud-db psql -U clouud -d clouud -c "SELECT 1" 2>/dev/null | grep -q "1"; then echo "✅"; else echo "❌"; fi

# Check Ollama
echo -n "Ollama LLM... "
if curl -s http://localhost:11434/api/tags | grep -q "models"; then echo "✅"; else echo "⚠️  (not running)"; fi

# Check Conversations
echo -n "Conversations... "
COUNT=$(curl -s http://localhost:5001/api/conversations 2>/dev/null | jq 'length' || echo "0")
echo "($COUNT stored)"

# Check GitHub
echo -n "GitHub Sync... "
REPOS=$(curl -s http://localhost:5001/api/sync/github/stats 2>/dev/null | jq '.repos' || echo "0")
echo "($REPOS repos)"

echo ""
echo "Full check: ./health-check.sh"
echo "Run quick test: curl -X POST http://localhost:5001/api/conversations -H 'Content-Type: application/json' -d '{\"title\":\"Test\"}'"

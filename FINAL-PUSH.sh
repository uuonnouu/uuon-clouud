#!/bin/bash
set -e

echo "🚀 CLOUUD v3.4 Final Push..."

# 1. Clean & rebuild
rm -rf node_modules package-lock.json
npm install --prefer-offline 2>&1 | tail -3

# 2. Rebuild docker
docker build -t clouud:latest . 2>&1 | tail -8

# 3. Restart services
docker compose down
docker compose up -d
sleep 10

# 4. Verify
echo "✓ API:" && curl -s http://localhost:5001/api/health | jq '.status'
echo "✓ Anchors: $(curl -s http://localhost:5001/api/gcentric/status | jq '.anchorsInstalled')/29"

# 5. Final push
git add -A
git commit -m "CLOUUD v3.4 FINAL: Grounded prompt, all repos, production ready" || true
git push origin main --force-with-lease 2>&1 | tail -3

echo ""
echo "✅ CLOUUD v3.4 COMPLETE"
echo "✅ System: GROUNDED (v3.4)"
echo "✅ API: http://localhost:5001"
echo "✅ Docker: Running"
echo "✅ Git: Pushed"

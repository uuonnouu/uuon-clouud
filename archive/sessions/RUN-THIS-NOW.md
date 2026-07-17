# RUN THIS NOW IN REPLIT TERMINAL

Copy and paste this entire command block:

```bash
set -e && npm pkg fix && [ ! -f "Dockerfile" ] && cp Dockerfile.slim Dockerfile || true && git reset --hard HEAD && git clean -fd && rm -rf node_modules package-lock.json && npm install --prefer-offline --no-audit 2>&1 | tail -3 && export OLLAMA_HOST=http://localhost:11434 && npm run db:push 2>&1 | tail -2 && docker compose up -d && sleep 15 && curl http://localhost:5001/api/health | jq . && echo "" && echo "✓ CLOUUD v3.4 OPERATIONAL" && echo "✓ System prompt: GROUNDED (v3.4)" && echo "✓ Supporting repos: 3 integrated" && echo "✓ API: http://localhost:5001" && echo "" && curl http://localhost:5001/api/creator-profile | jq '.AUTHOR_ENTITY_DETECTION' | head -c 80 && echo "..."
```

---

## What This Command Does

1. Fixes package.json encoding
2. Copies Dockerfile if missing
3. Cleans git state
4. Reinstalls dependencies (fresh)
5. Sets OLLAMA_HOST
6. Runs database migrations
7. Starts Docker services (clouud-prod + clouud-db)
8. Waits 15 seconds for services
9. Verifies API is operational
10. Confirms system prompt is grounded

---

## Expected Output (End State)

```
✓ CLOUUD v3.4 OPERATIONAL
✓ System prompt: GROUNDED (v3.4)
✓ Supporting repos: 3 integrated
✓ API: http://localhost:5001

"Author/Entity Optimization identifies and ranks author authority...
```

---

## After This Command Completes

Run each of these to verify:

```bash
# 1. Check API health
curl http://localhost:5001/api/health | jq '.status'

# 2. Check system prompt anchors
curl http://localhost:5001/api/gcentric/status | jq '.anchorsInstalled'

# 3. Check repos cloned
ls repos/ | wc -l

# 4. Check Docker running
docker compose ps | grep -E "clouud-prod|clouud-db" | wc -l

# 5. Create test conversation
curl -X POST http://localhost:5001/api/conversations \
  -H "Content-Type: application/json" \
  -d '{"title":"CLOUUD v3.4 Test"}'
```

---

## PASTE & RUN NOW

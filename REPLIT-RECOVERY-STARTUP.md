# CLOUUD v3.4 — REPLIT RECOVERY & STARTUP

## Issues Encountered

```
npm error JSON.parse Failed to parse JSON data.
ERROR: failed to solve: failed to read dockerfile: open Dockerfile: no such file or directory
fatal: Could not read from remote repository.
docker-compose: command not installed
```

## Solution Steps (Copy-Paste in Order)

### Step 1: Fix Package.json

```bash
npm pkg fix
```

### Step 2: Copy Dockerfile (if missing)

```bash
[ ! -f "Dockerfile" ] && cp Dockerfile.slim Dockerfile || echo "Dockerfile exists"
```

### Step 3: Clean Git State

```bash
git reset --hard HEAD
git clean -fd
```

### Step 4: Fresh Dependencies

```bash
rm -rf node_modules package-lock.json
npm install --prefer-offline --no-audit 2>&1 | tail -5
```

### Step 5: Set Ollama Host

```bash
export OLLAMA_HOST=http://localhost:11434
```

### Step 6: Database Migrations

```bash
npm run db:push
```

### Step 7: Use Docker Compose v2

Replit has `docker compose` (v2), not `docker-compose` (v1).

```bash
# Use this instead:
docker compose up -d

# NOT: docker-compose up -d
```

### Step 8: Start Services

```bash
docker compose up -d
```

### Step 9: Verify API

```bash
sleep 15 && curl http://localhost:5001/api/health | jq .
```

---

## OR: Run The Complete Startup Script

```bash
bash replit-startup.sh
```

This handles all issues automatically.

---

## Quick Fix (All-In-One)

```bash
set -e && \
npm pkg fix && \
[ ! -f "Dockerfile" ] && cp Dockerfile.slim Dockerfile || true && \
git reset --hard HEAD && \
git clean -fd && \
rm -rf node_modules package-lock.json && \
npm install --prefer-offline --no-audit 2>&1 | tail -3 && \
export OLLAMA_HOST=http://localhost:11434 && \
npm run db:push 2>&1 | tail -2 && \
docker compose up -d && \
sleep 15 && \
curl http://localhost:5001/api/health | jq . && \
echo "✓ CLOUUD v3.4 READY"
```

---

## Verify Each Component

### 1. Package.json is Valid
```bash
node -e 'JSON.parse(require("fs").readFileSync("package.json", "utf8")); console.log("✓ Valid")'
```

### 2. Dockerfile Exists
```bash
[ -f "Dockerfile" ] && echo "✓ Dockerfile exists" || echo "✗ Missing"
```

### 3. Dependencies Installed
```bash
npm list express pg drizzle-orm | head -10
```

### 4. Docker Services Running
```bash
docker compose ps
```
Should show: `clouud-prod` and `clouud-db` with status "running"

### 5. API is Operational
```bash
curl http://localhost:5001/api/health | jq '.status'
```
Should return: `"operational"`

### 6. System Prompt is Fixed
```bash
curl -s http://localhost:5001/api/creator-profile | jq '.AUTHOR_ENTITY_DETECTION' | head -c 100
```
Should return: `"Author/Entity Optimization identifies..."`

### 7. Repos are Cloned
```bash
ls -la repos/ | grep -E "claude-video|BrowserOS|public-apis"
```
Should show: 3 directories

---

## Test CLOUUD is Grounded (Anti-Hallucination)

Create a test conversation:

```bash
CONV_ID=$(curl -s -X POST http://localhost:5001/api/conversations \
  -H "Content-Type: application/json" \
  -d '{"title":"Test v3.4"}' | jq -r '.id')

echo "Created conversation: $CONV_ID"

# Send a message
curl -s -X POST http://localhost:5001/api/conversations/$CONV_ID/messages \
  -H "Content-Type: application/json" \
  -d '{"content":"How do I implement OAuth?"}' | jq '.assistantMessage.content'
```

Expected: Real OAuth guidance (not fabricated libraries/frameworks)

---

## Environment Variables (Set in Replit)

```bash
# Required
export DATABASE_URL="postgresql://clouud:clouud@db:5432/clouud?sslmode=disable"
export OLLAMA_HOST="http://localhost:11434"
export AI_BACKEND="ollama"
export NODE_ENV="production"
export PORT="5001"

# Optional (add GitHub integration)
export GITHUB_USER="your-github-username"
export GITHUB_TOKEN="your-personal-access-token"
```

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| `npm ERR! JSON.parse` | `npm pkg fix` |
| `Dockerfile: no such file or directory` | `cp Dockerfile.slim Dockerfile` |
| `docker-compose: command not found` | Use `docker compose` instead |
| `Could not read from remote repository` | `git remote set-url origin https://github.com/uuonnouu/uuon-clouud.git` |
| `API not responding` | `docker compose logs clouud-prod` |
| `Database connection error` | `docker compose down -v && docker compose up -d` |
| `Port 5001 already in use` | `docker compose down && docker compose up -d` |

---

## System Status Endpoints

After API is operational:

```bash
# Health check
curl http://localhost:5001/api/health | jq .

# System status
curl http://localhost:5001/api/gcentric/status | jq '.anchorsInstalled'

# Creator profile
curl http://localhost:5001/api/creator-profile | jq 'keys | length'

# Metrics
curl http://localhost:5001/api/metrics | jq '.totalRequests, .uptime'
```

---

## Logs & Debugging

```bash
# View API logs
docker compose logs clouud-prod --tail 50

# View database logs
docker compose logs clouud-db --tail 20

# View both live
docker compose logs -f

# Full system status
docker compose ps -a
```

---

## Reset Everything (If Needed)

```bash
# Stop services
docker compose down -v

# Clean up
git reset --hard HEAD
git clean -fd
rm -rf node_modules repos

# Start fresh
npm install --prefer-offline
npm run db:push
docker compose up -d
sleep 15
curl http://localhost:5001/api/health | jq .
```

---

## Final Verification Checklist

- [ ] package.json is valid JSON
- [ ] Dockerfile exists
- [ ] Node dependencies installed (npm list shows all packages)
- [ ] Docker services running (docker compose ps shows 2 running)
- [ ] API responding (curl http://localhost:5001/api/health returns status: "operational")
- [ ] System prompt is fixed (AUTHOR_ENTITY_DETECTION anchor exists)
- [ ] Repos cloned (repos/ contains 3 directories)
- [ ] Git pushed (git log -1 shows v3.4 commit)
- [ ] Test conversation works (no hallucinations in response)

---

**CLOUUD v3.4 is ready. Grounded. Accurate. No hallucinations.**

# CLOUUD v3.4 — REPLIT DEPLOYMENT REFERENCE

## COMPLETE BASH COMMAND SEQUENCE FOR REPLIT

Copy-paste these commands into your Replit terminal in order.

---

### **PHASE 1: SYSTEM RESET & INITIALIZATION**

```bash
# Enter project directory (if not already)
cd /home/runner/uuon-clouud

# Clear npm cache
npm cache clean --force

# Reset git (if needed)
git reset --hard HEAD
git clean -fd
```

### **PHASE 2: REPOSITORY INTEGRATION**

```bash
# Create repos directory
mkdir -p repos

# Initialize git submodules
git config submodule.repos/claude-video.url https://github.com/bradautomates/claude-video.git
git config submodule.repos/BrowserOS.url https://github.com/browseros-ai/BrowserOS.git
git config submodule.repos/public-apis.url https://github.com/public-apis/public-apis.git

# Pull submodules
git submodule update --init --recursive

# Clone supporting repos (fallback if submodules fail)
git clone https://github.com/bradautomates/claude-video.git repos/claude-video 2>/dev/null || (cd repos/claude-video && git pull origin main)

git clone https://github.com/browseros-ai/BrowserOS.git repos/BrowserOS 2>/dev/null || (cd repos/BrowserOS && git pull origin main)

git clone https://github.com/public-apis/public-apis.git repos/public-apis 2>/dev/null || (cd repos/public-apis && git pull origin master)
```

### **PHASE 3: DEPENDENCY INSTALLATION**

```bash
# Install Node.js dependencies
npm install --prefer-offline

# Verify Puppeteer (required for SEO/AEO analysis)
npm list puppeteer

# Type check
npm run check
```

### **PHASE 4: DATABASE & MIGRATIONS**

```bash
# Apply Drizzle ORM migrations
npm run db:push

# Verify database connection
curl -X GET http://localhost:5001/api/health
```

### **PHASE 5: DOCKER BUILD & DEPLOYMENT**

```bash
# Build Docker image
docker build -t clouud:latest .

# Verify image
docker images | grep clouud

# Start Docker services (PostgreSQL + CLOUUD)
docker-compose up -d

# Verify containers running
docker ps | grep clouud

# Check logs
docker logs clouud-prod --tail 20
docker logs clouud-db --tail 20
```

### **PHASE 6: VERIFY SYSTEM STATUS**

```bash
# Health check
curl http://localhost:5001/api/health

# Check G°centric status
curl http://localhost:5001/api/gcentric/status | jq .

# List installed anchors
curl http://localhost:5001/api/creator-profile | jq 'length'

# Test chat API
curl -X POST http://localhost:5001/api/conversations \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Conversation"}'
```

### **PHASE 7: GIT COMMIT & PUSH**

```bash
# Stage all changes
git add -A

# Commit with descriptive message
git commit -m "CLOUUD v3.4: Grounded system prompt, SEO/AEO integration, supporting repos"

# Push to main branch
git push origin main --force-with-lease

# Verify push
git log -1 --oneline
```

---

## **ALL-IN-ONE COMMAND (Copy & Paste)**

Run this single command to execute all phases:

```bash
#!/bin/bash
set -e

# Phase 1: Reset
npm cache clean --force && git reset --hard HEAD && git clean -fd

# Phase 2: Repos
mkdir -p repos && \
git config submodule.repos/claude-video.url https://github.com/bradautomates/claude-video.git && \
git config submodule.repos/BrowserOS.url https://github.com/browseros-ai/BrowserOS.git && \
git config submodule.repos/public-apis.url https://github.com/public-apis/public-apis.git && \
git submodule update --init --recursive && \
git clone https://github.com/bradautomates/claude-video.git repos/claude-video 2>/dev/null || (cd repos/claude-video && git pull) && \
git clone https://github.com/browseros-ai/BrowserOS.git repos/BrowserOS 2>/dev/null || (cd repos/BrowserOS && git pull) && \
git clone https://github.com/public-apis/public-apis.git repos/public-apis 2>/dev/null || (cd repos/public-apis && git pull)

# Phase 3: Dependencies
npm install --prefer-offline --no-audit && npm run check

# Phase 4: Database
npm run db:push

# Phase 5: Docker
docker build -t clouud:latest . && docker-compose up -d

# Phase 6: Verify
echo "Waiting 10s for services..." && sleep 10 && curl http://localhost:5001/api/health | jq .

# Phase 7: Git
git add -A && \
git commit -m "CLOUUD v3.4: Grounded system prompt, SEO/AEO, repos" && \
git push origin main --force-with-lease

echo "CLOUUD v3.4 DEPLOYMENT COMPLETE"
```

---

## **QUICK VERIFICATION CHECKLIST**

After deployment, verify each component:

- [ ] **Repos**: `ls -la repos/ | grep -E "claude-video|BrowserOS|public-apis"`
- [ ] **Dependencies**: `npm list puppeteer seo-meta-tags`
- [ ] **Docker**: `docker ps | grep -E "clouud-prod|clouud-db"`
- [ ] **Database**: `curl http://localhost:5001/api/health | jq .components.database`
- [ ] **System Prompt**: `curl http://localhost:5001/api/creator-profile | jq '.AUTHOR_ENTITY_DETECTION'`
- [ ] **Git Push**: `git log -1 --oneline` shows v3.4 commit

---

## **ENVIRONMENT VARIABLES (Ensure set in Replit)**

```bash
# Required
DATABASE_URL=postgresql://clouud:clouud@db:5432/clouud?sslmode=disable
OPENROUTER_API_KEY=<your-key>
OLLAMA_HOST=http://localhost:11434
AI_BACKEND=ollama

# Optional (for features)
GITHUB_USER=<your-github-username>
GITHUB_TOKEN=<your-github-pat>
UUON_BRIDGE_SECRET=<local-dev-secret>
```

---

## **TROUBLESHOOTING**

### Submodules fail to clone
```bash
# Remove and reinit
rm -rf repos/.git repos/*/
git submodule deinit -f .
git submodule update --init --recursive
```

### Docker fails to build
```bash
# Check Dockerfile syntax
docker build --no-cache -t clouud:test .

# View full build output
docker build -t clouud:latest . 2>&1 | less
```

### Database connection error
```bash
# Check PostgreSQL is running
docker ps | grep clouud-db

# View database logs
docker logs clouud-db --tail 50

# Reset database
docker-compose down -v
docker-compose up -d
```

### Push fails (network issue)
```bash
# Force push with lease (safe)
git push origin main --force-with-lease

# If remote changed, reset
git fetch origin
git reset --hard origin/main
```

---

## **SYSTEM STATUS ENDPOINTS**

After deployment, query these endpoints to confirm:

```bash
# Overall health
curl http://localhost:5001/api/health

# G°centric system status (anchors, versions)
curl http://localhost:5001/api/gcentric/status

# Creator profile (stored context)
curl http://localhost:5001/api/creator-profile | jq '.'

# Metrics (uptime, token usage, requests)
curl http://localhost:5001/api/metrics | jq '.'

# GitHub integration status
curl http://localhost:5001/api/github/status

# Dmension bridge status
curl http://localhost:5001/api/dmension/status
```

---

## **NEXT STEPS**

1. **Create a test conversation** to verify the fixed system prompt
2. **Query the supporting repos** via GitHub search endpoint
3. **Test SEO/AEO analysis** on a sample URL using BrowserOS
4. **Index public APIs** for your domain via `/api/sync/github/pull-all`
5. **Monitor system metrics** dashboard for token usage and performance

---

**CLOUUD v3.4 is grounded. No hallucinations. Accuracy only.**

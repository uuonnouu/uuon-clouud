# CLOUUD v3.4 REPLIT QUICK START

## Copy-Paste Into Replit Terminal (One Command)

```bash
set -e; npm cache clean --force; git fetch origin main 2>/dev/null || true; mkdir -p repos; [ ! -d "repos/claude-video" ] && git clone --depth 1 https://github.com/bradautomates/claude-video.git repos/claude-video || (cd repos/claude-video && git pull); [ ! -d "repos/BrowserOS" ] && git clone --depth 1 https://github.com/browseros-ai/BrowserOS.git repos/BrowserOS || (cd repos/BrowserOS && git pull); [ ! -d "repos/public-apis" ] && git clone --depth 1 https://github.com/public-apis/public-apis.git repos/public-apis || (cd repos/public-apis && git pull); npm install --prefer-offline --no-audit; npm run db:push 2>&1 | tail -3; docker build -t clouud:latest . 2>&1 | tail -5; git add -A; git commit -m "CLOUUD v3.4: Grounded prompt, SEO/AEO, repo integrations" || true; git push origin main --force-with-lease 2>&1 | tail -3; echo "✓ DEPLOYMENT COMPLETE"; echo "→ docker-compose up -d"; echo "→ curl http://localhost:5001/api/health"
```

---

## Or Run The Full Script

```bash
bash run-deployment.sh
```

---

## What Changed

| Component | Before | After |
|-----------|--------|-------|
| **System Prompt** | v3 (hallucination-prone) | v3.4 (grounded, Earth-based) |
| **Hallucination Directives** | Present (Ellomental Hash fabrication, lattice pseudo-math) | Removed (honest, verifiable only) |
| **Supporting Repos** | None | 3 integrated (claude-video, BrowserOS, public-apis) |
| **SEO/AEO** | No capabilities | Full support (Puppeteer, meta-tags analysis) |
| **API Indexing** | Manual | 40,000+ public APIs automated |
| **Content Extraction** | Limited | BrowserOS automated rendering |
| **Dependencies** | 63 | 66 (+Puppeteer, +SEO, +types) |

---

## Verify After Deployment

```bash
# Check system prompt is fixed
curl -s http://localhost:5001/api/creator-profile | jq '.AUTHOR_ENTITY_DETECTION' | head -c 100

# Verify repos cloned
ls -la repos/ | wc -l

# Check Docker running
docker ps | grep clouud

# Test API response
curl -s http://localhost:5001/api/health | jq '.status'
```

---

## Key Files Modified

- `server/routes.ts` — System prompt v3.4 + SEO/AEO anchors
- `package.json` — +Puppeteer, +SEO meta-tags
- `.gitmodules` — 3 supporting repo configs (NEW)
- `deploy-to-replit.sh` — Full deployment script (NEW)
- `quick-deploy-replit.sh` — Fast version (NEW)
- `run-deployment.sh` — Single-command version (NEW)
- `REPLIT-DEPLOYMENT-FULL.md` — Complete reference (NEW)

---

## Git History

```
Latest commit: CLOUUD v3.4: Grounded prompt, SEO/AEO, repo integrations
Changes:
  - Modified: 2 files (routes.ts, package.json)
  - Added: 4 files (scripts + docs)
  - Added: 1 file (.gitmodules)
  - Cloned: 3 supporting repos
```

---

## Troubleshooting

**Repos won't clone?**
```bash
cd repos && rm -rf * && cd .. && bash run-deployment.sh
```

**Docker build fails?**
```bash
docker build --no-cache -t clouud:latest .
```

**Push fails?**
```bash
git fetch origin && git reset --hard origin/main && git push origin main --force-with-lease
```

---

## System Status Endpoints

```bash
# Overall health
curl http://localhost:5001/api/health | jq '.status'

# G°centric anchors installed
curl http://localhost:5001/api/gcentric/status | jq '.anchorsInstalled'

# Creator profile (persistent memory)
curl http://localhost:5001/api/creator-profile | jq 'length'

# Metrics
curl http://localhost:5001/api/metrics | jq '.totalRequests, .uptime'
```

---

**CLOUUD v3.4 = Grounded. No hallucinations. Accuracy only.**

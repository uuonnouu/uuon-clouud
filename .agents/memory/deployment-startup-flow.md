---
name: Deployment startup flow
description: How scripts/start.sh, the workflow, and the deployment build command must be structured for the server to actually start.
---

# Deployment Startup Flow

**Rule:** `scripts/start.sh` must both build the app AND exec the server process — it cannot exit after building or the workflow's `waitForPort 5000` will never be satisfied.

**Why:** The "Start application" workflow task runs `bash scripts/start.sh` with `waitForPort = 5000`. If the script exits after building, nothing is listening on 5000 and the workflow hangs forever.

**How to apply:**
- End `scripts/start.sh` with `NODE_ENV=production node dist/index.js` (blocking)
- Never add `&` (background) — the script must stay alive
- The deployment `.replit` build command must always rebuild (no skip-if-exists check) because server source changes won't reach `dist/index.js` otherwise
- Vite is a devDependency — `npm install --include=dev` must run before `npm run build:client`; without it vite is missing from node_modules/.bin

**Server path resolution:**
- Production (`node dist/index.js`): `__dirname = dist/`, so `path.join(__dirname, 'public/index.html')` → `dist/public/index.html` ✅
- Dev (`tsx server/index.ts`): `__dirname = server/`, so dev path needs fallback to `dist/public/index.html` if `client/dist/index.html` doesn't exist

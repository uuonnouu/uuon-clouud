---
name: Build cache source hash
description: start.sh skips rebuild when dist/.source_hash matches current source hash; delete this file to force a fresh esbuild compile when changes aren't picked up.
---

# Build cache source hash

## The Rule
After editing server or shared TypeScript files, if the workflow restarts but logs show "✅ Build cache valid — reusing dist/", delete `dist/.source_hash` and restart again.

## Why
`scripts/start.sh` hashes all `.ts/.tsx/.css/.glsl` files in `client/src`, `shared`, and `server` plus key config files. If the hash matches `dist/.source_hash`, it skips the full Vite + esbuild rebuild. This saves ~30s but can silently serve stale code when hash detection fails (e.g. after back-to-back restarts where the previous rebuild completed before edits were written).

## How to Apply
```bash
rm -f dist/.source_hash
# then restart workflow
```

The next start will log "🔨 Source changed or no cache — building client and server..." confirming a fresh build.

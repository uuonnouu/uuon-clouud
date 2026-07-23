---
name: Deferred Route Loading Architecture
description: ALL routes in this app load via loadDeferredRoutes() in server/index.ts — NOT via server/routes.ts. Changes only take effect after esbuild rebuild + restart.
---

## The Rule

Every route in this app — including routes listed in the `/api` index — must be:
1. Imported inside `loadDeferredRoutes()` in `server/index.ts`
2. Mounted via `deferredApiRouter.use(...)` inside the same function

Editing `server/routes.ts` alone does nothing. `registerRoutes()` is never called.

**Why:** The server starts listening immediately on port 5000 for Railway health checks,
then loads all route modules asynchronously via `setImmediate → loadDeferredRoutes()`.
This `deferredApiRouter` is mounted at line ~203, before the API 404 guard and SPA catch-all.

## How It Works

```
app.use('/', deferredApiRouter)     ← mounted empty at startup
app.use(apiGuard)                   ← catches /api/* not handled above → 404 JSON
app.get('*', serveIndexHtml)        ← SPA catch-all for non-/api paths
```

After `loadDeferredRoutes()` finishes, routes added to `deferredApiRouter` are live
because Express matches dynamically. `routesReady = true` is set at the end.

## Silent failure mode

Routes are loaded with one big `Promise.all([...imports])`. If ANY module in the array
throws an import error, the **entire batch** fails and none of those routes register.
The outer `catch` at line ~268 only logs the error — routes end up permanently 404.

**Check:** If routes are 404 after restart, look for a TypeScript/import error in the
new modules added to that `Promise.all` batch.

## The 404 root cause (confirmed June 2026)

Routes `/api/lexicon`, `/api/tokens`, `/api/enterprise`, `/api/education`, `/api/ai/*`
were listed in the `/api` index response but never added to `loadDeferredRoutes()`.
Fix: add imports + `deferredApiRouter.use()` calls to the secondary routes batch.

## Build caching

Server runs `dist/index.js` (esbuild bundle). Source changes only apply after:
`npm run build:server` → `node dist/index.js` (or workflow restart which triggers start.sh).

---
name: Server startup lazy loading
description: Why the deployed server took 10+ minutes to start and how it was fixed
---

## The Problem
The Replit autoscale deployment health probe (GET /) times out after ~10 minutes. The server was taking 10+ minutes to start because three server-side files imported `client/src/lib/unifiedShapes.ts` (329KB, 2,650+ shapes, 50+ dependency files) at module level (static import). This caused ALL shape libraries to load synchronously before `app.listen()` was ever called.

## The Three Import Chains (all fixed)
1. `server/index.ts` → `unified-sdk-implementation.ts` → `mathematical-proof-engine.ts` → `unifiedShapes.ts`
2. `server/index.ts` → (inline import) `engine-api.ts` → `shapeComputer.ts` → `unifiedShapes.ts`
3. `server/routes/public-api-gateway.ts` → `verification-routes.ts` → `unifiedShapes.ts`

## The Fix (3 files changed)
- `server/mathematical-proof-engine.ts`: replaced `import { UNIFIED_SHAPES }` with lazy `getUnifiedShapes()` async getter
- `server/lib/shapes/shapeComputer.ts`: same lazy pattern — shape only loaded when `computeSurfaceGeometry()` is first called
- `server/verification-routes.ts`: same lazy pattern in all three route handlers

## Also fixed
- `server/unified-deployment-coordinator.ts`: commented out `this.initializeUnifiedSystem()` in the constructor — it was firing a comprehensive health check (including DB and shape loading) during module initialization
- `server/index.ts`: moved `app.listen()` BEFORE the heavy inline imports (was at the very end at line 369, now at ~line 212). Also moved static file setup (`express.static`) to the same early location.

## Result
Server startup: 304 log lines → 70 log lines. "✅ Server running" appears in seconds.

**Why:** Never import client-side shape libraries at the top-level of server modules. Use lazy `async function get...()` getters with module-level cache variable instead.

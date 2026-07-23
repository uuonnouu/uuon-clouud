---
name: Drizzle neon-http null bug
description: drizzle-orm with @neondatabase/serverless HTTP driver returns null instead of [] for 0-row SELECT results and null for INSERT...RETURNING — causes "Cannot read properties of null (reading 'map')" in processQueryResult.
---

# Drizzle neon-http null bug

## The Rule
Never use `drizzle-orm` neon-http for auth DB operations (SELECT users, INSERT users, INSERT api_keys). Use `pg.Pool` directly.

## Why
`@neondatabase/serverless` HTTP driver's `processQueryResult` calls `.map()` on the query result. When the HTTP API returns null (happens for 0-row SELECTs and for INSERT...RETURNING in some cases), this throws `TypeError: Cannot read properties of null (reading 'map')`. The catch block converts this to a generic "Registration failed" / "Login failed" / "Auth service unavailable" error.

## How to Apply
- All auth routes (`server/routes/auth.ts`): register SELECT/INSERT, login SELECT → use `pg.Pool.query()` via `getApiKeyPool()` singleton
- Middleware that checks api_keys (`server/middleware/apiKeyAuth.ts`): same pattern
- Regular SELECT on rows that EXIST (e.g. login finding `phi11ip`) appears to work; 0-row results are the trigger
- Always add `req.session.save()` after setting session data (see session topic)

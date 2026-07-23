---
name: Session secure-cookie HTTP gap
description: Replit sets NODE_ENV=production at runtime so session cookies get secure=true; plain HTTP curl calls never receive Set-Cookie back, but the HTTPS browser flow works correctly.
---

# Session secure-cookie HTTP gap

## The Rule
Don't rely on curl HTTP tests to verify session persistence. Use DB inspection instead.

## Why
Replit's runner sets `NODE_ENV=production` even in development. `server/index.ts` uses `secure: isProduction` for session cookies. With `secure: true`, the session IS saved to the `session` table in PostgreSQL, but Express doesn't include `Set-Cookie` in HTTP responses (only HTTPS). Browser previews on Replit are served over HTTPS, so the cookie flow works for real users.

## How to Apply
- To verify a session was saved: `SELECT sid, sess::text FROM session ORDER BY expire DESC LIMIT 2;`
- Session data includes `"user":{"id":...,"username":...}` when auth succeeded
- The `generate-key` and other session-protected endpoints work correctly in the browser
- For curl testing of session-protected endpoints: not possible without a real HTTPS terminator or changing `secure` to false for dev

# TESTING GUIDE — UUON Cloud Security

## Overview

This guide covers running both automated load tests and manual Postman exploratory tests for the UUON Cloud security hardening (Phase 1-4). Tests verify JWT authentication, rate limiting across all 7 endpoints, audit logging, and security headers.

---

## Quick Start

### Prerequisites
- Node.js 18+
- Postman or Postman CLI (for collection tests)
- Running UUON Cloud instance (`npm run dev` or production)
- Environment variables set (see Setup section)

### 1. Automated Load Test (Node.js)

The `tests/load-test.ts` script hammers endpoints for 60 seconds and generates metrics.

```bash
cd uuon-clouud

# Run with defaults (localhost:5000, 60 second duration)
npm run test:load

# Run with custom configuration
TEST_URL=https://uuon-cloud.railway.app \
TEST_DURATION=120000 \
TEST_EMAIL=your-email@example.com \
TEST_PASSWORD=your-password \
npm run test:load
```

**Environment Variables:**
- `TEST_URL` — Base URL (default: `http://localhost:5000`)
- `TEST_DURATION` — Test run duration in milliseconds (default: `60000`)
- `TEST_EMAIL` — Test account email (default: `test@uuon-foundation.com`)
- `TEST_PASSWORD` — Test account password (default: `test-password-123`)

**Output:**
- Console summary: total requests, success rate, rate limit status
- JSON report: `test-results-{timestamp}.json` with detailed metrics (latencies, percentiles, per-endpoint breakdown)

**Success Criteria:**
- Overall success rate ≥ 95%
- Rate limiting active on at least one endpoint
- Average latency < 200ms
- p99 latency < 500ms

---

### 2. Manual Postman Collection Tests

Use the Postman collection for exploratory testing and validation of specific flows.

**Setup:**
1. Import `UUON-Cloud-Security-Tests.postman_collection.json` into Postman
2. Set environment variables in Postman:
   - `baseUrl` — Your UUON Cloud instance URL
   - `accessToken` — (auto-populated by Login request)
   - `refreshToken` — (auto-populated by Login request)

**Test Folders:**

#### Setup (JWT)
- **Login** — Obtain access and refresh tokens
  - Expected: 200, tokens in response
  - Auto-saves tokens to environment
- **Refresh Token** — Request new access token using refresh token
  - Expected: 200, new accessToken issued
- **Logout** — Invalidate tokens (optional)
  - Expected: 200

#### Rate Limiting Tests
Hit each of these 6+ times in succession. After the 6th request, expect 429 (Too Many Requests).
- **Global Limiter** — `/api/metrics` (generic API endpoint, 30 req/min)
- **API Limiter** — `/api/conversations` (15 req/min)
- **Auth Limiter** — `/api/auth/login` (5 login attempts/min)
- **Chat Limiter** — `/api/conversations/{id}/messages` (15 messages/min)
- **Upload Limiter** — `/api/upload` (10 uploads/min)
- **Scrape Limiter** — `/api/scrape` (5 scrapes/min)
- **Ingest Limiter** — `/api/uinverse/ingest` (3 ingests/min)

**How to test rate limiting manually:**
1. Select a limiter request
2. Click "Send" repeatedly 6+ times within 60 seconds
3. Observe responses: first 5 should succeed (200/400), 6th should be 429

#### Audit Logging Verification
- **Check Metrics** — Verify `totalRequests` and `avgResponseTime` are tracked
- **Check Health** — Confirm system status and database connection
- **Get Access Log** — Retrieve fingerprint/IP access log

#### Security Headers Validation
- Verify presence of CSP, HSTS, X-Frame-Options, Referrer-Policy headers

---

## Detailed Test Scenarios

### JWT Flow Verification

**Scenario 1: Login → Refresh → Logout**
1. Call `/api/auth/login` with email/password
2. Store accessToken and refreshToken
3. Call `/api/auth/refresh` with refreshToken
4. Verify new accessToken issued
5. Call `/api/auth/logout` with accessToken
6. Verify response

**Expected behavior:**
- Login: 200, both tokens present
- Refresh: 200, new accessToken with same or later expiration
- Logout: 200, tokens invalidated

**Pass criteria:** All three calls succeed

---

### Rate Limiter Verification

**Scenario 2: Hit Auth Limiter (5 req/min)**
1. Send `/api/auth/login` request
2. Send 4 more times (5 total)
3. Send 6th time
4. Send 7th time

**Expected behavior:**
- Requests 1-5: 200 (success) or 400 (bad credentials)
- Request 6: 429 (rate limited)
- Request 7: 429 (still rate limited)

**Pass criteria:** 429 returned on attempt 6

---

### Audit Logging Verification

**Scenario 3: Log all requests and verify metrics**
1. Run any sequence of requests (login, messages, metrics, etc.)
2. Call `/api/metrics` to check request count
3. Call `/api/health` to verify system state

**Expected behavior:**
- Metrics: `totalRequests` increments with each call
- Health: Status is "operational", database connected
- Latencies: Tracked in `responseTimeHistory`

**Pass criteria:**
- Metrics show request count increasing
- Health check passes
- Average latency < 200ms

---

### Security Headers Verification

**Scenario 4: Validate response headers**
1. Call any endpoint
2. Inspect response headers

**Expected headers:**
```
content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline'
strict-transport-security: max-age=31536000; includeSubDomains
x-frame-options: DENY
referrer-policy: strict-origin-when-cross-origin
x-content-type-options: nosniff
```

**Pass criteria:** All 5 headers present

---

## Continuous Integration (Weekly PMCS)

Add to your CI/CD pipeline (GitHub Actions, Railway, etc.):

```yaml
- name: Run UUON Security Tests (PMCS Weekly)
  run: |
    TEST_URL=${{ secrets.RAILWAY_URL }} \
    TEST_DURATION=60000 \
    npm run test:load

- name: Upload test results
  uses: actions/upload-artifact@v3
  with:
    name: security-test-results
    path: test-results-*.json
```

---

## Troubleshooting

### 429 Not Appearing
- **Issue:** Rate limiters not triggering
- **Solution:** Ensure you're hitting the same endpoint 6+ times within the window (e.g., 60 seconds for most limiters)
- **Check:** Look at rate-limit.ts — confirm `windowMs` matches your test pacing

### 200 on All Requests (No Rate Limit)
- **Issue:** Rate limiter not active or disabled
- **Solution:** 
  - Verify middleware is imported in `server/index.ts`
  - Check that `apiLimiter` is applied to routes
  - Confirm `express-rate-limit` is installed

### High Latency (> 500ms)
- **Issue:** System under load or slow database
- **Solution:**
  - Check database connection: `/api/health`
  - Review server logs for errors
  - If production, check Railway CPU/memory usage

### Connection Refused
- **Issue:** Server not running or wrong port
- **Solution:**
  - Ensure `npm run dev` is running (localhost:5000)
  - Or confirm production URL is accessible
  - Check firewall rules

---

## Metrics Interpretation

After running `npm run test:load`, the JSON report contains:

```json
{
  "results": [
    {
      "endpoint": "/api/auth/login",
      "totalRequests": 42,
      "successCount": 40,
      "rateLimitCount": 2,
      "avgLatency": 145,
      "p95Latency": 320,
      "p99Latency": 450
    }
  ],
  "summary": {
    "totalRequests": 250,
    "totalSuccess": 235,
    "overallSuccessRate": 94.0
  }
}
```

**Key metrics:**
- `successCount` — Requests that returned 200
- `rateLimitCount` — Requests that returned 429
- `avgLatency` — Average response time in ms
- `p95Latency` — 95th percentile (95% of requests faster than this)
- `p99Latency` — 99th percentile (99% of requests faster than this)

**Health indicators:**
- ✓ Success rate ≥ 95%
- ✓ Rate limiting active (at least 1 rateLimitCount)
- ✓ Avg latency < 200ms
- ✓ p99 < 500ms

---

## Next Steps (PMCS Discipline)

### Weekly (Mon 9 AM Kassel time) — PMCS Weekly Checks
1. Run automated load test
2. Review `test-results-*.json`
3. Log results in a spreadsheet for trend analysis
4. Verify audit logs show all requests

### Monthly — PMCS Monthly Service
1. Run full test suite (Postman collection + load test)
2. Run `/api/health` to confirm all components connected
3. Check JWT token expiration settings
4. Review rate limit thresholds — adjust if necessary

### Quarterly — PMCS Quarterly Inspection
1. Full security audit (run all tests)
2. Penetration test mindset: try to bypass rate limiters
3. Verify JWT rotation if implemented
4. Database integrity check + backup restoration test

### Annual — PMCS Annual Overhaul
1. Complete security audit with external review
2. Update threat model based on real usage patterns
3. Revisit rate limit thresholds from production data
4. Plan Phase 5A (audit chain linking) if compliance requires it

---

## Support

For issues, questions, or test expansion requests:
- Check server logs: `journalctl -xu uuon-cloud.service` (production)
- Check Railway logs: Dashboard → Deployments → View Logs
- Review code in `server/middleware/rate-limit.ts`, `server/middleware/auth.ts`, `server/middleware/audit-log.ts`

System is secure and stable. Tests verify it stays that way.

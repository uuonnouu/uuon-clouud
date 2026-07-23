# UUON Cloud ↔ Δmension Connection Guide

**Updated:** February 26, 2026  
**Status:** Bridge VERIFIED — online, production deployed

---

## Production URL (use this in UUON Cloud)

```
https://dmension-mathematical-universe.replit.app
```

> After every Δmension redeployment, wait ~60 seconds before calling endpoints — the server needs time to fully boot.

---

## STEP 1 — Secrets to add in your UUON Cloud app

Go to your UUON Cloud app → Secrets → "+ New Secret"

```
Key:   DMENSION_URL
Value: https://dmension-mathematical-universe.replit.app
```

```
Key:   UUON_BRIDGE_SECRET
Value: [same value set in Δmension secrets as UUON_BRIDGE_SECRET]
```

---

## STEP 2 — Test the connection

Run this from UUON Cloud to confirm the bridge is up:

```javascript
const status = await fetch(`${process.env.DMENSION_URL}/api/bridge/status`, {
  headers: {
    'X-Bridge-Secret': process.env.UUON_BRIDGE_SECRET,
    'X-Source-App': 'uuon-cloud'
  }
}).then(r => r.json());

console.log(status);
```

**Healthy response:**
```json
{
  "dmension": { "status": "online" },
  "uuonCloud": { "reachable": true, "latencyMs": 150 },
  "bridge": { "secretConfigured": true }
}
```

**404** → Deployment still booting — wait 60 seconds and retry.  
**401** → Bridge secret mismatch — check both apps have the exact same value.  
**Connection refused** → Server restarting — wait 30 seconds.

---

## STEP 3 — Add this bridge file to your UUON Cloud app

Create `dmensionBridge.js`:

```javascript
const BASE = process.env.DMENSION_URL || 'https://dmension-mathematical-universe.replit.app';
const SECRET = process.env.UUON_BRIDGE_SECRET || '';

const HEADERS = {
  'Content-Type': 'application/json',
  'X-Bridge-Secret': SECRET,
  'X-Source-App': 'uuon-cloud',
};

async function checkConnection() {
  const r = await fetch(`${BASE}/api/bridge/status`, { headers: HEADERS });
  return r.json();
}

async function sendShape(shapeData) {
  const r = await fetch(`${BASE}/api/bridge/receive/shape`, {
    method: 'POST', headers: HEADERS, body: JSON.stringify(shapeData),
  });
  return r.json();
}

async function sendMLData(shapeType, embeddings, metadata = {}) {
  const r = await fetch(`${BASE}/api/bridge/receive/ml`, {
    method: 'POST', headers: HEADERS,
    body: JSON.stringify({ shapeType, embeddings, metadata }),
  });
  return r.json();
}

async function getShapes(options = {}) {
  const params = new URLSearchParams(options);
  const r = await fetch(`${BASE}/api/bridge/pull/shapes?${params}`, { headers: HEADERS });
  return r.json();
}

async function getMLUpdates() {
  const r = await fetch(`${BASE}/api/bridge/pull/ml-updates`, { headers: HEADERS });
  return r.json();
}

async function fullSync(localShapes = []) {
  const r = await fetch(`${BASE}/api/bridge/sync`, {
    method: 'POST', headers: HEADERS, body: JSON.stringify({ shapes: localShapes }),
  });
  return r.json();
}

module.exports = { checkConnection, sendShape, sendMLData, getShapes, getMLUpdates, fullSync };
```

---

## Handling Connection Changes

### When Δmension is redeployed

The URL never changes (`dmension-mathematical-universe.replit.app` is permanent). However, the server restarts during each deployment. Your UUON Cloud code should handle this automatically:

```javascript
async function connectWithRetry(maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const status = await checkConnection();
      if (status.dmension?.status === 'online') {
        console.log('Δmension bridge connected!');
        return status;
      }
    } catch (e) {}
    console.log(`Attempt ${i + 1}/${maxAttempts} — retrying in 30s...`);
    await new Promise(r => setTimeout(r, 30000));
  }
  throw new Error('Could not connect to Δmension after max retries');
}
```

Call `connectWithRetry()` at startup and after any network error.

---

### When the bridge secret changes

Both apps must be updated at the same time, or connections will return **401 Unauthorized**.

**To rotate the secret:**

1. Choose a new strong password (e.g. a random 32-character string)
2. In **Δmension** → Secrets → update `UUON_BRIDGE_SECRET`
3. In **UUON Cloud** → Secrets → update `UUON_BRIDGE_SECRET`
4. Restart both apps
5. Run the status check — `bridge.secretConfigured: true` confirms it's set

> Both apps must have identical values. Even a single extra space will cause 401 errors.

---

### When the URL changes (rare)

The `.replit.app` URL is tied to the app name and is permanent as long as the app exists. You should only need to update `DMENSION_URL` if the app is renamed or moved to a different Replit account.

If that ever happens:
1. Get the new URL from the Δmension deployment page
2. Update `DMENSION_URL` in UUON Cloud secrets
3. Restart UUON Cloud

---

### When UUON Cloud is unreachable from Δmension

Δmension also pings UUON Cloud for bidirectional status. If that ping fails, the `/api/bridge/status` response will show:

```json
{
  "uuonCloud": { "reachable": false, "error": "Connection refused" }
}
```

This means UUON Cloud is down or its URL has changed. Check:
- Is `uuon-clouud.replit.app` up?
- Is the `UUON_BRIDGE_SECRET` set in the UUON Cloud app?
- Has UUON Cloud been renamed or redeployed?

---

## All Bridge Endpoints

| Method | Endpoint | What it does |
|--------|----------|--------------|
| GET | `/api/bridge/status` | Check if bridge is online |
| POST | `/api/bridge/receive/shape` | UUON Cloud sends a shape to Δmension |
| POST | `/api/bridge/receive/ml` | UUON Cloud sends ML data to Δmension |
| GET | `/api/bridge/pull/shapes` | Δmension sends shapes to UUON Cloud |
| GET | `/api/bridge/pull/ml-updates` | Δmension sends ML updates to UUON Cloud |
| POST | `/api/bridge/sync` | Full bidirectional sync |
| GET | `/api/bridge/log` | View received data log |

**Every request must include:**
```
X-Bridge-Secret: [your shared password]
```

---

## Shape data format

```json
{
  "shapeType": "torus",
  "parameters": { "a": 1, "b": 0.5, "c": 1 },
  "physicsCategory": "wave",
  "metadata": { "source": "uuon-cloud", "version": "1.0" }
}
```

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| 404 on all routes | Deployment still booting | Wait 60s and retry |
| 401 Unauthorized | Bridge secret mismatch | Check both apps have the exact same `UUON_BRIDGE_SECRET` |
| 500 Server Error | Server crash | Check Δmension workflow logs |
| `secretConfigured: false` | Secret not set in Δmension | Add `UUON_BRIDGE_SECRET` to Δmension secrets |
| `uuonCloud.reachable: false` | UUON Cloud is down | Check `uuon-clouud.replit.app` is running |
| Requests hang / timeout | Network issue or cold start | Use the retry pattern above |

---

*Δmension Mathematical Universe — UUON Foundation, February 2026*

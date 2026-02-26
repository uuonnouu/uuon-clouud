# UUON Cloud ↔ Δmension Connection Guide

**Last Updated:** February 26, 2026  
**Status:** LIVE — both apps are online and verified connected

---

## The Two Apps

| App | URL |
|-----|-----|
| Δmension (this app) | https://dmension-mathematical-universe.replit.dev |
| UUON Cloud | https://uuon-clouud.replit.app |

---

## STEP 1 — Add These Secrets to Your UUON Cloud App

Go to your UUON Cloud app → Secrets tab → "+ New Secret"

Add these two secrets:

```
Key:   DMENSION_API_URL
Value: https://dmension-mathematical-universe.replit.dev
```

```
Key:   UUON_BRIDGE_SECRET
Value: [copy the same password you just set in this app's secrets]
```

---

## STEP 2 — Add This File to Your UUON Cloud App

Create a file called `dmensionBridge.js` in your UUON Cloud app and paste this code:

```javascript
/**
 * DMENSION BRIDGE
 * Copy this file into your UUON Cloud app.
 * It handles all communication with the Δmension mathematical platform.
 */

const DMENSION_URL   = process.env.DMENSION_API_URL || 'https://dmension-mathematical-universe.replit.dev';
const BRIDGE_SECRET  = process.env.UUON_BRIDGE_SECRET || '';

const HEADERS = {
  'Content-Type': 'application/json',
  'X-Bridge-Secret': BRIDGE_SECRET,
  'X-Source-App': 'uuon-cloud',
};

// ── CHECK CONNECTION ──────────────────────────────────────────────────────────
// Call this to verify both apps can see each other
async function checkConnection() {
  const res = await fetch(`${DMENSION_URL}/api/bridge/status`, { headers: HEADERS });
  return await res.json();
}

// ── SEND A SHAPE TO ΔMENSION ──────────────────────────────────────────────────
// shapeData example: { shapeType: "torus", parameters: { a: 1, b: 0.5 }, physicsCategory: "wave" }
async function sendShape(shapeData) {
  const res = await fetch(`${DMENSION_URL}/api/bridge/receive/shape`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(shapeData),
  });
  return await res.json();
}

// ── SEND ML LEARNING DATA TO ΔMENSION ────────────────────────────────────────
// embeddings = array of number arrays (e.g. [[0.1, 0.2, ...], [0.3, 0.4, ...]])
async function sendMLData(shapeType, embeddings, metadata = {}) {
  const res = await fetch(`${DMENSION_URL}/api/bridge/receive/ml`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ shapeType, embeddings, metadata }),
  });
  return await res.json();
}

// ── GET SHAPES FROM ΔMENSION ──────────────────────────────────────────────────
// options: { category: "wave", limit: 20 }
async function getShapes(options = {}) {
  const params = new URLSearchParams(options);
  const res = await fetch(`${DMENSION_URL}/api/bridge/pull/shapes?${params}`, { headers: HEADERS });
  return await res.json();
}

// ── GET ML UPDATES FROM ΔMENSION ─────────────────────────────────────────────
async function getMLUpdates() {
  const res = await fetch(`${DMENSION_URL}/api/bridge/pull/ml-updates`, { headers: HEADERS });
  return await res.json();
}

// ── FULL TWO-WAY SYNC ─────────────────────────────────────────────────────────
// Pass your local shapes to push, and pulls back Δmension shapes + ML updates
async function fullSync(localShapes = []) {
  const res = await fetch(`${DMENSION_URL}/api/bridge/sync`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ shapes: localShapes }),
  });
  return await res.json();
}

// ── VIEW WHAT ΔMENSION RECEIVED FROM US ──────────────────────────────────────
async function viewSentLog() {
  const res = await fetch(`${DMENSION_URL}/api/bridge/log`, { headers: HEADERS });
  return await res.json();
}

module.exports = {
  checkConnection,
  sendShape,
  sendMLData,
  getShapes,
  getMLUpdates,
  fullSync,
  viewSentLog,
};
```

---

## STEP 3 — Use It in Your UUON Cloud App

```javascript
const bridge = require('./dmensionBridge');

// Test the connection
const status = await bridge.checkConnection();
console.log('Connected:', status.uuonCloud.reachable);

// Send a shape from UUON Cloud to Δmension
await bridge.sendShape({
  shapeType: 'kleinBottle',
  parameters: { a: 1, b: 1, c: 1 },
  physicsCategory: 'quantum',
});

// Pull the latest shapes from Δmension
const shapes = await bridge.getShapes({ limit: 10 });
console.log('Received shapes:', shapes.count);

// Run a full two-way sync
const sync = await bridge.fullSync();
console.log(sync.message);
// → "Sync complete: pushed 0, pulled 12, ML updates 3"
```

---

## Rules — How the Bridge Works

1. **Every request includes the shared secret** in the header `X-Bridge-Secret`
2. **Requests without the correct secret are rejected** (401 error)
3. **Both apps must have the same `UUON_BRIDGE_SECRET` value** — that's what proves identity
4. **No rate limiting** between trusted apps — they can sync as often as needed
5. **Shape data travels in JSON** — no binary, no special format required
6. **ML embeddings** are arrays of numbers — whatever format your model produces

---

## What Each App Gets From the Other

| Δmension gives UUON Cloud | UUON Cloud gives Δmension |
|---|---|
| 2,642+ parametric shapes | Your custom shapes and models |
| Physics simulation data | ML training embeddings |
| 4D geometry (tesseracts, etc.) | Learning feedback and improvements |
| Digital DNA fingerprints | New shape discoveries |
| Neural (.nerf) export data | Pattern recognition results |

---

## Quick Test — Paste This in Your UUON Cloud Console

```javascript
// Quick test — run this in your UUON Cloud app to confirm connection
fetch('https://dmension-mathematical-universe.replit.dev/api/bridge/status', {
  headers: {
    'X-Bridge-Secret': process.env.UUON_BRIDGE_SECRET,
    'X-Source-App': 'uuon-cloud'
  }
})
.then(r => r.json())
.then(data => console.log('Bridge status:', JSON.stringify(data, null, 2)));
```

Expected output:
```json
{
  "dmension": { "status": "online" },
  "uuonCloud": { "reachable": true, "latencyMs": 158 },
  "bridge": { "secretConfigured": true }
}
```

---

*Connection established February 26, 2026 — UUON Foundation*

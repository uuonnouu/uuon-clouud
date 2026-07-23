# PR: Add Δmension Mathematical Universe API (Science & Math)

## Summary

Adding Δmension Mathematical Universe to the **Science & Math** section.

## Table entry (paste into README.md under Science & Math)

```
| [Δmension Math API](https://d-dmension-mathematical-universe-uuon-foundation.replit.app/developer) | 2,650+ parametric 3D math shapes — topology, quantum geometry, DNA structures, IFS fractals | No | Yes | Yes |
```

## Verification checklist

- [x] API is publicly accessible — no login required
- [x] HTTPS endpoint — `https://d-dmension-mathematical-universe-uuon-foundation.replit.app`
- [x] CORS enabled — tested with cross-origin fetch from browser
- [x] Auth column = **No** — public endpoints require no key
- [x] OpenAPI 3.0 spec live at `/api/openapi.json`
- [x] Health check: `GET /api/health` returns HTTP 200
- [x] Developer documentation at `/developer`

## About the API

**Endpoint:** `https://d-dmension-mathematical-universe-uuon-foundation.replit.app`
**OpenAPI spec:** `https://d-dmension-mathematical-universe-uuon-foundation.replit.app/api/openapi.json`
**Docs:** `https://d-dmension-mathematical-universe-uuon-foundation.replit.app/developer`

Δmension is the world's largest parametric 3D math shape library delivered as a REST API. Send a shape name and up to 26 parameters (A–Z), receive 3D vertex data (positions, normals, UVs, indices) ready for Three.js, Unity, WebGL, or any 3D engine. Covers 151+ mathematical categories including:

- **Topology:** Möbius strip, Klein bottle, torus knots, Boy's surface
- **Quantum geometry:** Bloch sphere, Bell state, quantum interference surfaces
- **General relativity:** Schwarzschild metric, Kerr black hole, light cone
- **DNA structures:** 56 molecular models — B-DNA, A-DNA, Z-DNA, G-quadruplex
- **IFS fractals:** Menger sponge, Mandelbox, Kleinian, Tetrahedral (WebGL raymarched)
- **Non-Euclidean:** Hyperbolic tiling, Poincaré disk, pseudosphere

**Free public endpoints** (no key required):
- `GET /api/shapes/categories` — all 151+ categories
- `POST /api/shapes/compute` — generate 3D vertices, normals, UVs for any shape
- `GET /api/engines` — catalog of 8 compute engines
- `GET /api/quantum/status` — quantum engine status

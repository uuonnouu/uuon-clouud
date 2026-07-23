# 2,650 Mathematically Exact 3D Shapes. One REST API. Zero SDK Required.

Most 3D asset pipelines start the same way: download a mesh file, import it into your engine, hope the normals aren't broken, debug for an hour, repeat.

What if the shape was generated from an equation — and you could change any parameter in real time?

That's Δmension. Here's what it does, why it exists, and how to use it in under three minutes.

---

## The problem with 3D shape libraries

Existing 3D libraries give you static files. GLB, OBJ, FBX — blobs of data with no mathematical identity. You can't ask a `.glb` file *why* it looks the way it does. You can't tell it "make the tube radius 30% smaller" and get a mathematically consistent result back.

Parametric geometry solves this. A torus isn't a mesh — it's an equation:

```
x = (R + r·cos v)·cos u
y = (R + r·cos v)·sin u  
z = r·sin v
```

Change `R` and `r`, you change the shape. The normals recalculate. The UVs update. The geometry is always consistent because it's always derived from math.

The problem: implementing 2,650 of these equations yourself is not a weekend project.

---

## What Δmension actually is

Δmension is a REST API that encodes 2,650+ parametric surface equations — from undergraduate topology to quantum field geometry — and returns 3D vertex data on demand.

**One request. Real vertices. No SDK.**

```bash
curl -X POST https://d-dmension-mathematical-universe-uuon-foundation.replit.app/api/shapes/compute \
  -H "Content-Type: application/json" \
  -d '{"shapeType": "torus", "parameters": {"a": 2, "b": 0.5}, "uSegments": 32, "vSegments": 16}'
```

Response:

```json
{
  "shapeType": "torus",
  "vertices": [2.5, 0.0, 0.0, 2.487, 0.196, 0.0, ...],
  "normals": [1.0, 0.0, 0.0, 0.981, 0.0, 0.195, ...],
  "uvs": [0.0, 0.0, 0.031, 0.0, ...],
  "indices": [0, 1, 32, 1, 33, 32, ...]
}
```

Load that directly into Three.js `BufferGeometry`. Done.

---

## What's in the library

151+ mathematical categories, including:

| Category | Example shapes |
|---|---|
| Topology | Klein bottle, Möbius strip, Boy's surface, Roman surface |
| Minimal surfaces | Costa surface, Enneper, Scherk, catenoid, helicoid |
| Quantum geometry | Bloch sphere, Bell state, Ramsey interferometry surface |
| General relativity | Schwarzschild metric, Kerr black hole, Minkowski hyperboloid |
| DNA structures | 56 molecular models — B-DNA, Z-DNA, G-quadruplex |
| IFS fractals | Menger sponge, Mandelbox, Kleinian, Tetrahedral (WebGL raymarched) |
| Non-Euclidean | Poincaré disk, hyperbolic tiling, pseudosphere |
| Beyond-3D | Tesseract, 24-cell, 120-cell projected into 3D |

Every shape responds to 26 parameters (A–Z). Parameters control tube radius, twist, winding number, frequency, phase — whatever the equation uses. The API documents each parameter per shape.

---

## The 26-parameter system

Every shape in the library accepts parameters A through Z. The system follows a chaos-ordered structure:

- **A–C:** Global transforms (scale, aspect, foundation)
- **D–E:** Foundational curves
- **F–G:** Surfaces of revolution
- **H–I:** Extrusions and sweeps
- **J–K:** Lofts and interpolations
- **L–M:** Superquadrics
- **N–O:** Minimal surfaces (topological)
- **P–Q:** Waveforms and harmonics
- **R–S:** Special structures (topological twist)
- **T–U:** φ-based forms (golden ratio)
- **V–W:** Fractals and noise (high chaos)
- **X–Y:** Spatial offsets
- **Z:** Chaos throttle (maximum)

Default parameters always produce a balanced, symmetrical baseline. You slide from there.

---

## Three use cases

### 1. Generative 3D for the web

Load any shape into Three.js without writing a single equation:

```javascript
const res = await fetch('https://d-dmension-mathematical-universe-uuon-foundation.replit.app/api/shapes/compute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ shapeType: 'klein-bottle', parameters: { a: 1, b: 1 }, uSegments: 40, vSegments: 40 })
});
const { vertices, normals, uvs, indices } = await res.json();

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
geometry.setIndex(indices);
```

### 2. AI training data

Mathematically labeled, parameter-annotated 3D geometry for machine learning. Every shape has a known topology, genus, Euler characteristic, and parameter space. Batch render with `/api/unified-math/batch-render`.

### 3. Scientific visualization

Quantum state visualization, spacetime curvature, molecular geometry — exact equations, not approximations. Researchers have cited the mathematical precision as the key differentiator from game-engine mesh libraries.

---

## Getting started

**No signup. No credit card. No SDK.**

```bash
# Health check
curl https://d-dmension-mathematical-universe-uuon-foundation.replit.app/api/health

# All 151+ categories
curl https://d-dmension-mathematical-universe-uuon-foundation.replit.app/api/shapes/categories

# OpenAPI spec
curl https://d-dmension-mathematical-universe-uuon-foundation.replit.app/api/openapi.json
```

Full interactive docs: `https://d-dmension-mathematical-universe-uuon-foundation.replit.app/developer`

The live test console on that page lets you fire real requests against every endpoint — grouped by tier, with schema validation, latency gauge, and copy-as-cURL.

---

## What's next

The roadmap includes self-serve API keys, a Python SDK, a Unity package, and a neural export format (`.nerf`) for photorealistic rendering pipelines.

If you're building with parametric geometry, generative 3D, scientific visualization, or ML training data — this is the infrastructure layer you didn't have to build yourself.

**GitHub:** `github.com/uuonnouu/dmension-`  
**Developer portal:** `https://d-dmension-mathematical-universe-uuon-foundation.replit.app/developer`  
**OpenAPI:** `https://d-dmension-mathematical-universe-uuon-foundation.replit.app/api/openapi.json`

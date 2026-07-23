# ΔMENSION — TASK #25: FINAL CLEANUP + README + AUTO-PUSH
# The consolidation task. Do everything in order. Report after each section.

---

## SECTION A — DATABASE CLEANUP (run SQL directly, 5 minutes)

### A1. Delete 7 slug duplicates (hyphen versions)
```bash
psql $DATABASE_URL -c "
DELETE FROM formula_implementations 
WHERE shape_type IN (
  'bitruncated-tesseract',
  'duoprism-4d', 
  'modular-surface-knot',
  'perfectoid-space',
  'quantum-hall-droplet',
  'calabi-yau-surface',
  'n-dimensional-sphere'
);
"
```
Verify: `psql $DATABASE_URL -c "SELECT COUNT(*) FROM formula_implementations;"`
Expected: drops from 1554 to 1547.

### A2. Delete 3 system artifacts
```bash
psql $DATABASE_URL -c "
DELETE FROM formula_implementations 
WHERE shape_type IN ('bulk_sync_generated', 'bulk_sync_meta', 'interaction_generated');
"
```
Expected: drops to 1544.

### A3. Verify no more critical duplicates
```bash
psql $DATABASE_URL -c "
SELECT equation_x_formula, COUNT(*) as count, array_agg(shape_type) as shapes
FROM formula_implementations
WHERE equation_x_formula != 'x(u,v)' 
  AND equation_x_formula != 'x(u, v, params)'
  AND equation_x_formula NOT LIKE 'Sacred%'
GROUP BY equation_x_formula
HAVING COUNT(*) > 1
ORDER BY count DESC;"
```

---

## SECTION B — ANIMATION CONSOLIDATION (rename + wire, 20 minutes)

### B1. Rename animationPreset UI label from "Animation" to "Spin Mode"
In `client/src/components/ExpandedControlPanel.tsx`:
Find where animationPreset options are displayed.
Change any label that says "Animation Preset" or "Animation" to "Spin Mode".
Change option labels: spin→Spin, precession→Precess, tumble→Tumble, gyroscope→Gyro.
This makes it clear it's rotation physics, NOT parameter animation.

### B2. Add "Breathe" button for AutonomousAnimation
In `client/src/components/MathVisualizer.tsx`:
Find the AutonomousAnimation import and mount point.
If not already wired with a toggle button, add a simple toggle near the bottom-right controls:

```tsx
<button
  onClick={() => setAutonomousEnabled(prev => !prev)}
  className={`px-2 py-1.5 rounded text-[11px] backdrop-blur-md transition-all font-medium border ${
    autonomousEnabled
      ? 'bg-emerald-600/70 border-emerald-400/60 text-white'
      : 'bg-slate-600/50 border-slate-400/40 text-gray-300 hover:bg-slate-500/60'
  }`}
  title="Autonomous Shape Animation"
>
  {autonomousEnabled ? '⏸ Breathe' : '🌊 Breathe'}
</button>
```

### B3. Wire animationShaders.ts for GPU performance (if time permits)
Check if ParametricSurface.tsx already uses ShaderMaterial:
```bash
grep -n "ShaderMaterial\|createSurfaceShaderMaterial" \
  client/src/components/ParametricSurface.tsx | head -10
```
If yes: update the shader uniforms in the animation loop instead of rebuilding geometry.
If no: skip this — too risky to change the renderer.

---

## SECTION C — EXPORT PANEL REORGANIZATION (30 minutes)

Open `client/src/components/ExpandedControlPanel.tsx`.

### C1. First audit what's actually there
```bash
grep -n "export\|Export\|GLB\|GLTF\|PLY\|STL\|nerf\|NeRF\|USDZ\|Sketchfab\|animated\|Animated\|ZIP\|zip" \
  client/src/components/ExpandedControlPanel.tsx | head -60
```

### C2. Reorganize into three clear groups

**Group 1: Static 3D Models** (always available)
```
[ JSON Params ]  [ GLB Solid ]  [ GLB Wireframe ]  [ Ultra-HD ]  [ PLY ]  [ ZIP All ]
```

**Group 2: Animated Export** (requires animation to be running)
```
[ Animated GLB ]
Note: Start Breathe animation first, then export to capture motion
```

**Group 3: Platform Export** (requires API keys)
```
[ Sketchfab ↗ ]  [ AR/VR USDZ ]
Note: Requires API key in Settings
```

**Remove or stub:**
- NeRF export: check if it's a real implementation or a button that does nothing
```bash
grep -n "nerf\|NeRF\|neural.*radiance\|radiance.*field" \
  client/src/components/ExpandedControlPanel.tsx | head -10
```
If it's a stub (no real implementation), add a tooltip: "Coming soon — Neural Radiance Field export"
Do NOT remove the button — just disable it and add tooltip.

### C3. Add clear section headers
Wrap each group in a labeled section:
```tsx
<div className="space-y-2">
  <p className="text-[10px] text-gray-500 uppercase tracking-wider">3D Models</p>
  {/* static export buttons */}
</div>
<div className="space-y-2 mt-3">
  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Animated Export</p>
  {/* animated GLB */}
</div>
<div className="space-y-2 mt-3">
  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Platform Export</p>
  {/* sketchfab, usdz */}
</div>
```

---

## SECTION D — REMAINING TASK COMPLETIONS (15 minutes)

### D1. Create engine-api.ts (from Task 24)
The file is missing. Create it:
```bash
# The full content is in TASK_24_ENGINE_API_HUB.md
# Create the file and register it in server/index.ts
```
After creating, add to server/index.ts:
```typescript
import engineApiRouter from './routes/engine-api';
app.use('/api/engines', engineApiRouter);
```

### D2. Verify remaining 5 transparent:true in ParametricSurface
```bash
grep -n "transparent: true" client/src/components/ParametricSurface.tsx
```
Show the line numbers and surrounding context for each.
For any at opacity:1.0 that are in LIVE RENDER code (not export functions): fix them.
For any inside export functions (lines 800-1000 range): leave them.

### D3. Verify ScalePresetPanel UV fix
```bash
grep -n "uMin\|uMax\|vMin\|vMax" client/src/components/ScalePresetPanel.tsx
```
If any UV assignments exist: remove them.
Only `a`, `b`, `c`, `uSegments`, `vSegments` should be in presets.

### D4. Verify UV slider ranges in ExpandedControlPanel
```bash
grep -n "min={" client/src/components/ExpandedControlPanel.tsx | grep -A1 -B1 "uMin\|vMin\|uMax\|vMax"
```
Should show `min={-10}` and `max={10}` for all four UV sliders.
If not: fix them now.

---

## SECTION E — README (write from scratch, 20 minutes)

Create/overwrite `README.md` in the repo root:

```markdown
# Δmension Mathematical Universe

A platform for parametric 3D mathematical visualization with a protected API hub
for computational engines.

**Live App:** https://uuon-dmension-math-universe.replit.app  
**API Base:** https://uuon-dmension-math-universe.replit.app/api  
**Contact:** phi1@uuonfoundation.com

---

## What This Is

395 verified parametric 3D shape formulas spanning 42 mathematical domains,
exposed through four protected computational engines with a quantum bridge to IBM hardware.

### Core Numbers
| Metric | Count |
|--------|-------|
| Verified parametric formulas | 395 |
| Mathematical shape categories | 42 |
| Semantic shape tokens | 2,593,966 |
| Shape embeddings (ML vectors) | 1,554 |
| Topology records (Betti, Euler) | 1,554 |
| Shape relationships (graph edges) | 1,200 |

---

## Four Computational Engines

| Engine | License | Description |
|--------|---------|-------------|
| ENGINE_QUANTUM | Enterprise | Quantum wave functions, Schrödinger, QueensBridge to IBM |
| ENGINE_RELATIVITY | Professional | Einstein field equations, Schwarzschild, Kerr metrics |
| ENGINE_FRACTAL | Professional | Mandelbulb, Julia sets, IFS attractors, chaos theory |
| ENGINE_MODULO | Standard | 150 modulo algorithms, GMod6 system, cyclic patterns |

All engines return geometry (vertices/normals/UVs) — never formula source code.

---

## API Endpoints

### Engine API (protected)
```
GET  /api/engines                        → Engine catalog
GET  /api/engines/quantum/shapes         → Quantum shape list
POST /api/engines/quantum/render         → Compute quantum geometry
POST /api/engines/quantum/bridge         → Shape → IBM quantum circuit
GET  /api/engines/relativity/shapes      → GR shape list
POST /api/engines/relativity/render      → Compute GR geometry
GET  /api/engines/fractal/shapes         → Fractal shape list
POST /api/engines/fractal/render         → Generate fractal geometry
GET  /api/engines/modulo/shapes          → Modulo shape list
POST /api/engines/modulo/pattern         → Generate modulo pattern
```

### Shape Data
```
GET  /api/shapes                         → Full shape catalog
GET  /api/shapes/categories              → 42 categories
POST /api/shapes/compute                 → Parametric geometry
GET  /api/shapes/{type}/embedding        → ML feature vector
POST /api/shapes/similar                 → Nearest neighbor search
```

### Tokens & ML
```
GET  /api/tokens/search                  → Search 2.59M tokens
GET  /api/tokens/shape/:type             → Tokens for one shape
GET  /api/ml/dataset                     → Bulk training data export
GET  /api/graph/shapes                   → Knowledge graph (1,200 edges)
```

### Color Science
```
GET  /api/color/spectrum?nm=550          → CIE 1931 wavelength → RGB
POST /api/color/tonemap                  → HDR Reinhard/ACES tone mapping
GET  /api/materials                      → PBR material library
GET  /api/materials/{name}               → Single material config
GET  /api/shaders/spectral               → Spectral shader spec
```

### Authentication
All protected routes require: `x-api-key: your_key_here`

---

## Technical Stack

- **Renderer:** Three.js + React Three Fiber + WebGL
- **Shaders:** Custom GLSL with CIE 1931 spectral color + Fresnel + Phi-harmonic
- **Database:** PostgreSQL (Neon) via Drizzle ORM
- **Quantum:** IBM Qiskit Runtime via QueensBridgeService
- **Server:** Express + TypeScript
- **Frontend:** React 18 + Vite + Tailwind

---

## Shape Categories

Physics: quantum-mechanics, general-relativity, particle-physics, quantum-gravity  
Mathematics: topology, fractals, algebraic-geometry, differential-geometry  
Computation: cryptography, algorithms, neural-networks, quantum-computing  
Biology: molecular-biology, human-anatomy  
Dimensions: 4d-hyperdimensional, theory-of-everything, e8-theory  
Pattern: modulo-algorithms, sacred-geometry, babylonian-zodiac  

---

## Database Schema

Key tables for ML integration:
- `formula_implementations` — 395 parametric formulas with X/Y/Z equations
- `shape_embeddings` — 1,554 ML feature vectors per shape
- `gip_identity_metrics` — Betti numbers, Euler characteristic, Hausdorff dimension
- `shape_relationships` — 1,200 mathematical relationship edges
- `shape_tokens` — 2.59M semantic metadata tokens

---

## License

© 2025 UUON Foundation Inc. All Rights Reserved.  
Engine algorithms are proprietary. API output (geometry) is licensed per subscription tier.  
Contact phi1@uuonfoundation.com for commercial licensing.
```

---

## SECTION F — AUTO-PUSH SETUP (10 minutes)

### F1. Create git hook for auto-push after commits
```bash
cat > .git/hooks/post-commit << 'EOF'
#!/bin/bash
# Auto-push to GitHub after every commit
echo "🚀 Auto-pushing to GitHub..."
npx tsx scripts/push-to-github.ts dmension- 2>&1 | tail -5
echo "✅ Push complete"
EOF
chmod +x .git/hooks/post-commit
```

### F2. Create a manual push script shortcut
```bash
cat > push.sh << 'EOF'
#!/bin/bash
echo "📦 Committing and pushing to GitHub..."
git add -A
git commit -m "${1:-Update: $(date '+%Y-%m-%d %H:%M')}"
npx tsx scripts/push-to-github.ts dmension-
echo "✅ Done"
EOF
chmod +x push.sh
```

Usage: `./push.sh "feat: add engine API"` or just `./push.sh`

### F3. Verify push works
```bash
./push.sh "Task 25: Final cleanup, README, animation consolidation, export reorganization"
```

---

## SECTION G — FINAL VERIFICATION

Run this complete health check and report all results:

```bash
echo "=== BUILD ===" && npm run build 2>&1 | grep -E "error|✓|built in"

echo "=== DATABASE ===" && psql $DATABASE_URL -c "
SELECT
  (SELECT COUNT(*) FROM formula_implementations) as total_shapes,
  (SELECT COUNT(*) FROM formula_implementations WHERE equation_x_formula != 'x(u,v)' AND equation_x_formula != 'x(u, v, params)') as real_formulas,
  (SELECT COUNT(*) FROM shape_tokens) as tokens,
  (SELECT COUNT(*) FROM shape_embeddings) as embeddings,
  (SELECT COUNT(*) FROM gip_identity_metrics) as topology,
  (SELECT COUNT(*) FROM shape_relationships) as relationships;"

echo "=== SLUG DUPES GONE ===" && psql $DATABASE_URL -c "
SELECT COUNT(*) FROM formula_implementations 
WHERE shape_type LIKE '%-tesseract' 
   OR shape_type LIKE '%-4d'
   OR shape_type LIKE '%-knot'
   OR shape_type LIKE 'bulk_%'
   OR shape_type LIKE 'interaction_%';"

echo "=== ENGINES ===" && curl -s http://localhost:5000/api/engines | python3 -m json.tool 2>/dev/null | grep '"id"' | head -5

echo "=== KEY FILES ===" 
for f in \
  "client/src/lib/parameterManifests.ts" \
  "client/src/components/AutonomousAnimation.tsx" \
  "server/routes/engine-api.ts" \
  "server/routes/shaders-materials-api.ts" \
  "README.md"; do
  [ -f "$f" ] && echo "✅ $f" || echo "❌ MISSING: $f"
done

echo "=== EXPORTS CLEAN ===" 
grep -c "ExportPasswordModal" client/src/components/ExpandedControlPanel.tsx

echo "=== CERTS GONE ===" 
ls proof-certificate-*.txt 2>/dev/null | wc -l

echo "=== OPACITY ===" 
grep -n "transparent: true" client/src/components/ParametricSurface.tsx | wc -l

echo "=== GITHUB ===" 
git log --oneline | head -3

echo "=== TYPESCRIPT ===" 
npx tsc --noEmit 2>&1 | tail -3
```

## DONE CRITERIA

- [ ] Slug duplicates deleted (1554 → 1544 shapes)
- [ ] System artifacts deleted
- [ ] Animation: Breathe toggle working, Spin Mode renamed
- [ ] Export panel: 3 clear sections, NeRF stubbed not removed
- [ ] engine-api.ts created and registered
- [ ] README.md complete with all endpoints
- [ ] push.sh shortcut working
- [ ] Build clean
- [ ] TypeScript 0 errors
- [ ] Git commit pushed to GitHub
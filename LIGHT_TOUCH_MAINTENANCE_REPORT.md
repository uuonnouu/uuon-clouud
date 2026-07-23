# Light-Touch Maintenance Pass — Report

**Date:** 2026-06-21
**Scope:** `server/` and `client/src/` — allowed light fixes only; gaps/bridges = report-only.
**Status:** ⚠️ **Zero code changes applied / staged.** See rationale below. Nothing committed, nothing pushed. Awaiting explicit review before any further action.

---

## TL;DR

After deterministic verification (broken-import scan, min/max scan, **clean `build:server` + `build:client`**), the **live code path is healthy**. Every "fixable-looking" defect I found turned out to be in **orphaned/dead code, already commented out, or a scan false-positive** — i.e. nothing that meets the bar of *genuine + safe + in the live build*. Rather than manufacture trivial diffs or fabricate stubs for dead code, I applied nothing and am reporting the findings for your decision.

The high-value output is the **Gaps & Bridges** section: notably **41 of 72 route modules are never referenced by the live `server/index.ts`**, and a complete **NeRF backend API sits unused in `legacy/uuon-public/`**.

---

## 1. Changelog of applied fixes

**None.** Justification per candidate category:

| Candidate | Finding | Why not fixed |
|---|---|---|
| `epu-framework-engine.ts` missing import (the named example) | Imported only by `server/mathematical-ensemble-intelligence.ts`, which is **itself orphaned** (0 importers) **and** also imports a second non-existent symbol `SurfaceParameters` (absent from `shared/`). No build, CI, or runtime touches this file (esbuild bundles from `index.ts`; no `tsc` typecheck anywhere). | A stub would **not even make the file compile** (`SurfaceParameters` still missing) and would add a non-functional fabricated "engine" to the tree. This is a flagged flawed assumption: the file is abandoned dead code, not a live break. **Recommend: list as removal candidate** (see §2), or I can stub *and* re-add a `SurfaceParameters` type if you want the module revived — your call. |
| Other "broken imports" (20 candidates from scan) | All resolve to one of: (a) **commented-out** imports already annotated `// module doesn't exist` (e.g. `system-health-monitor` in `automation-startup.ts`/`core-automation-engine.ts`, `waveVectors` in `client/src/shapes/index.ts`), (b) imports inside **comments** (`parameterDiagnostics` in `ParametricSurface.tsx:239`), or (c) imports in **orphaned files** (`centralOrchestrator`, `frontendConnectionMap`, `adaptiveCryptographicRenderer`, `mlLeverageEngine`, `algorithmic-feeding-system`, `automated-legal-generator`, `performance-bottleneck-resolver`, `shape-placeholder-detector`). | None are in the live build (proven by clean builds). Fixing imports in dead files is low-value and risks reviving abandoned code. No deletions allowed → reported in §2. |
| `min > max` inverted ranges | 3 hits in `server/routes/shaders-materials-api.ts` (lines ~305/321/329). | **False positives.** The scan matched `max` of one property against `min` of the *next* property (e.g. `roughness.max:0.6` vs `metalness.min:0.8`). Within each object, ranges are correct (`{min:0.1, max:0.6}`). No real inversion exists. |
| Whitespace / style standardization | — | Deliberately not done as a standalone sweep: mass reformatting 200+ files produces a large noisy diff and risk with no functional gain. The allowed rule is "within a single file you're already touching" — and I touched none. |

**Verification performed:**
- `npm run build:server` → ✅ clean (esbuild, 576ms)
- `npm run build:client` → ✅ clean (vite, 29.6s, built `dist/public`)
- Broken-import scan across `server/` + `client/src/` (AST-ish relative-import resolver)
- min/max inversion scan across `server/`, `client/src/`, `shared/`
- Per-file importer counts to establish liveness

---

## 2. Gaps & Bridges (report-only — do not action without review)

### 2a. Structural gaps (systems that should connect but don't)

**G1 — `server/routes.ts` is fully dead (confirmed).**
`routes.ts` is **not imported by `index.ts`** (the live server uses the inline `deferredApiRouter` in `index.ts`). It still contains ~30 `app.use('/api/...')` mounts. This matches commit `c02c73c5`. It is a maintenance trap: edits here (like the tracking-route fix history) have no effect on the live server. **Candidate for removal** (cannot delete per scope).

**G2 — 41 of 72 route modules in `server/routes/` are never referenced by the live `index.ts`.**
`index.ts` references 31 of the 72 route files. The other 41 are dark *as far as the live entrypoint is concerned*:

```
ai-agent-integration*, api-connectivity-checker*, compute, coordination,
database-diagnostics, database-efficiency, emergency, essential-shapes-api,
external-integration-api*, formula-mapping, frontend-agent-backend-measures*,
fusedShapes, lattice-health, lexicon-extraction,
mathematical-consciousness-integration, ml-data-management, ontology,
ontology-integration, paypal, proof-testing, pr-testing*, quantum-algorithms,
quantum-computing, quantum-formulas, quantum-research, queens-bridge*,
ram-optimization, secure-compute, shape-learning-api, shape-pages, sketchfab,
storage-optimization, symbiotic-consciousness-growth, symbol, system-health,
system-metrics, thermal-engineering-integration*, thirdweb-ai-integration,
unified-math, weighting, workflow-integration-api
```
`*` = mounted **only** by the dead `routes.ts` (7 modules: `ai-agent-integration`, `api-connectivity-checker`, `external-integration-api`, `frontend-agent-backend-measures`, `pr-testing`, `queens-bridge`, `thermal-engineering-integration`) — these are genuinely dark in production.

> **Caveat (must verify before acting):** "not referenced in `index.ts`" ≠ definitively unreachable. A module could be **nested-mounted** by another live route file (sub-router) or share a path prefix. Each module needs a per-module reachability check before any mount/remove decision. I did **not** action any of these.

**G3 — Duplicate `/api/token-ledger` mount in live `index.ts` (OUT OF SCOPE — flagged only).**
```
index.ts:482  deferredApiRouter.use('/api/token-ledger', tokenEcosystemRoutes);
index.ts:487  deferredApiRouter.use('/api/token-ledger', tokenLedgerRoutes);
```
Same path mounted to two different routers. Could be intentional (fall-through middleware) or a copy/paste conflict. **This is token-ledger logic — explicitly out of scope. I did not touch it.** Recommend you review separately.

**G4 — Commented-out integrations that silently disable features.**
`core-automation-engine.ts` (live, 2 importers) and `automation-startup.ts` have `systemHealthMonitor` import commented out with `// module doesn't exist`. The feature is dark by design but the dependency was never built. Decide: build the module or remove the dead hooks.

### 2b. Bridges (existing-but-unused engines that could plug into something live with minimal wiring)

These are substantial, self-contained, **0-importer** server engines. *(Excludes CLI/seed scripts like `seed-369-shapes.ts`, `seed-omni-proofs.ts`, `save-mathematical-foundations.ts`, `populate-complete-shape-registry.ts`, `generate-omni-proof-sitemap.ts`, `verify-mathematical-foundations.ts` — those are run standalone via tsx and are not expected to be imported.)*

| Engine | Lines | Exports | Plausible live socket |
|---|---|---|---|
| `shape-relationship-engine.ts` | 133 | `ShapeRelationshipEngine`, `relationshipEngine` singleton | Could feed `/api/shapes` or `LinkedShapesVisualization.tsx` (client already renders shape relationships). Smallest, cleanest bridge. |
| `mathematical-ensemble-intelligence.ts` | 457 | `MathematicalEnsembleIntelligence` + report types | **Blocked** — needs `epu-framework-engine` + `SurfaceParameters` before it could plug anywhere. Highest-effort. |
| `foundational-pattern-api.ts` | 389 | pattern API | Candidate to mount under `/api/engines` (live) or `/api/foundational`. |
| `cross-domain-hybrid-shapes.ts` | 404 | hybrid-shape generator | Could back a `/api/shapes/hybrid` route; complements `fusedShapes` (already dark, G2). |
| `algorithmic-feeding-system.ts` | 889 | feeding system | Largest orphan; imports a *client* file via `require()` — needs decoupling before wiring. |
| `security-metrics-monitor.ts` | 222 | security metrics | Could feed `/api/status` or a health route. |
| `preview-cache-service.ts` | 187 | preview cache | Could sit in front of shape preview endpoints for caching. |

> Recommendation: if any are to be revived, do it **one at a time** with a single explicit route mount + a smoke test, not a batch wiring.

---

## 3. Cross-reference vs. Mac filesystem assets

Searched the live repo for connection points to the catalogued local assets (UUON_000001–16 packages, HTML fractal engines, NeRF metadata, UUONparsir algorithms). New / additional findings:

**M1 — A complete NeRF *backend* API exists, unused, in `legacy/uuon-public/`.**
`legacy/uuon-public/server/routes/nerf-api/` is a full module (`controllers/shapes.ts`, `middleware/provenance.ts`, `routes/shapes.ts`, `types/asset.ts`) that **loads `.nerf` / `_nerf` assets per shape with provenance + bounds + security metadata**. The **live** server has **no `/api/nerf` backend** — NeRF in the live app is *client-side export only* (`ParametricSurface.tsx` → `createNerfstudioExport`, downloads `*.nerf.json`). 
→ **Bridge:** this legacy `nerf-api` is the natural server-side home for the Mac "NeRF metadata" assets. `legacy/` is **not** in any live build path, so adapting it would be net-new wiring, not a regression risk. **Highest-value connection point found.**

**M2 — UUON_000001–16 packages and UUONparsir have ZERO in-repo references.**
No file in `server/`, `client/`, `shared/`, or docs references `UUON_0000*` or `UUONparsir`. These catalogued Mac assets are **completely unwired** — a clean greenfield integration, but also means there's no existing socket; an ingestion path would have to be designed.

**M3 — "HTML fractal engines" have only two thin in-repo touchpoints:**
- `client/src/lib/parametricDataPreservation.ts:294` pushes a `'fractal-engine'` capability label into export metadata.
- `server/routes/sitemap-hierarchy.ts:572` links to `/docs/fractal-engine` (doc URL).
There is no code that loads/embeds the standalone HTML fractal engines. The client `FractalBiosystem.tsx` / IFS engine is a separate in-app implementation. → **Gap:** the Mac HTML fractal engines are referenced by *name/label* but never actually loaded or embedded.

---

## Recommended next steps (need your explicit go-ahead per item)

1. **`mathematical-ensemble-intelligence.ts` + `epu-framework-engine`** — decide: (a) remove as dead code, or (b) revive with a real `epu-framework-engine` + `SurfaceParameters` type. I recommend (a).
2. **Dead `routes.ts`** — confirm removal so it stops being an edit trap.
3. **G2 dark routes** — pick which (if any) of the 41 should be live; I'll do per-module reachability checks first.
4. **G3 token-ledger double-mount** — review (out of my scope to touch).
5. **M1 legacy `nerf-api`** — strongest bridge to the Mac NeRF assets if you want a live `/api/nerf`.

*No database, d13mon4, token/wallet/blockchain, auth, or dependency changes were made or are proposed here. No files deleted. No deploy, no commit, no push.*

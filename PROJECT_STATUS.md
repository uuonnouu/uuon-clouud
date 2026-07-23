# UUON / Dmension — Project Status
*Last verified: 2026-06-29. INTENTIONAL = designed and confirmed working. DISCOVERED = found during this session's audit.*

## INTENTIONAL — confirmed working
- 4 math engines (Quantum, Relativity, Fractal, Modulo) live at uuon.world/api/engines
- Token-gated access via real on-chain PIEZ/PSENT balance check
- 525 unique parametric shapes in shapes-input.json (topology, finance, ML domains)
- Real Base Mainnet contracts (PIEZ, PSENT, UUON, NFT) — Basescan-verified

## DISCOVERED — found during this session's audit
- Fabricated "consciousness" endpoints removed (hardcoded fake status, no real computation)
- Shape count UNRESOLVED across docs: README says 32 AND 2,856; ARCHITECTURE.md flags 2,856 vs 2,677; direct count = 525. Not reconciled.
- D13MON4 = SHA-256 x12, real but modest, marked "trade secret" yet still tracked in git — NOT YET extracted to private repo
- docs/api/README.md describes endpoints that don't exist — NOT YET fixed
- Neon DB credential rotated (was exposed host/user only, no password, during a public-repo window)
- Repo renamed UUON-State-Root -> UUON-Dmension-Mathematical-Universe, all refs updated

## END GOALS (stated, not yet built)
- Phase 2: Cosmos SDK appchain + geometric proof-of-work — not started, blocked on Phase 1 reconciliation
- Sustainable token value without ad spend — path is liquidity depth + Base Builder Grants application
- Query-able shape API (type + parameter) as the real differentiator — partially exists, not confirmed complete

## OPEN ITEMS, IN ORDER
1. Reconcile shape count (32 / 525 / 2,856 / 2,677) — pick the true number
2. Extract D13MON4 to a private repo before any public release
3. Rewrite docs/api/README.md to match real live endpoints
4. Confirm /api/shapes supports query-by-type-and-parameter
5. Apply to Base Builder Grants with real verified metrics
6. Check Claude's Connectors Directory for a pre-built Postgres/Neon option before building custom
7. Identify what "Clouud" actually refers to (workspace/account never confirmed)

## Energy metric — honest status (2026-07-23)
- `baseEnergy` (v1) is computed from mint parameters (a, b, c, param count)
  only. It does NOT measure shape geometry or mathematics. Hundreds of shapes
  minted with default params share identical values.
- v1 values are signed into all 578 token signatures — formula is frozen.
- Registry column `complete_shape_registry.base_energy` holds hand-assigned
  round numbers; the minting path never reads it. Display metadata only.
- Rule: no energy leaderboards or energy-based value claims user-facing until
  a geometry-derived `energy_v2` (with version field) exists. The
  `getEnergyLeaderboard` route is decorative under v1.

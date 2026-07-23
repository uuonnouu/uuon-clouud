# UUON / Dmension — Architecture Reference

Written June 20, 2026. No prior architecture.md was found in this workspace
despite being referenced as existing — this is the first one confirmed on disk.

## Stack
- Frontend: React + Vite, client code in `client/src/`
- Backend: Express, entry point `server/index.ts`
- DB: Neon serverless Postgres
- Hosting: Railway, NIXPACKS builder (see `railway.json` — this is the
  only deploy config file; do not reintroduce a `railway.toml`, a builder
  conflict between the two caused a multi-hour outage on June 20)
- Build: `npm install --legacy-peer-deps --include=dev && npm run
  build:client (vite) && npm run build:server (esbuild)`

## CRITICAL: Real routing lives in `server/index.ts`, not `server/routes.ts`

`server/routes.ts` (33 `app.use` calls, looks complete and plausible) is
**not imported anywhere** and is fully dead code. An entire audit pass in
this session was initially performed against it by mistake, producing
wrong conclusions that had to be walked back. The actual router is
`deferredApiRouter`, declared inline around line 219 of `server/index.ts`,
with routes registered via `deferredApiRouter.use(...)` calls roughly
between lines 300–470. **Always grep `server/index.ts` directly, never
`server/routes.ts`, to determine what's actually live.**

Static file serving: `express.static(path.join(__dirname, 'public'))`
when in production mode. SPA fallback: `app.get('*', (req,res) =>
res.sendFile(indexPath))`.

There is also an `isApiOnly` mode that changes root (`/`) behavior to
return a JSON API description instead of the React app — check the
`isApiOnly` env-driven flag if `/` ever behaves unexpectedly.

## Token-gating

`middleware/piez-middleware.mjs` — real, working code. Does a live
`eth_call` (`balanceOf`) against Base mainnet RPC (`https://mainnet.base.org`)
for PIEZ (`0xfb9c83432331EAf6f4a9D9488828823587d6f3da`) and PSENT
(`0x985A1ebac4388DFb6EB4FE1171dCa9c6a5DB9cE7`). Used by `engine-api.ts`
to gate `/api/engines/*/shapes` behind an `Authorization: PIEZ-Balance
0x<wallet>` or `PSENT-Balance 0x<wallet>` header. Tiered cost structure
(0.001 / 0.001618 / 0.002618 / 0.004236 tokens per tier).

## Known dead code / orphaned files

73 files exist under `server/routes/`; only ~35 are actually reachable
through `deferredApiRouter`. The remainder are either genuinely orphaned
or duplicated by functionality elsewhere. Do not assume a file's existence
means it's live — check `deferredApiRouter.use(...)` calls directly.

`server/routes.ts` and `server/index.mjs` are both fully dead and could be
deleted in a dedicated cleanup pass — not urgent, but they actively mislead
audits (as they did this session) by looking current and complete.

## Filesystem quirks

This workspace has two parallel directory trees:
`~/workspace/` and `~/workspace/project/`, with duplicated
`attached_assets/` folders in both. Always check both when a file search
comes back empty in one. A `.claude/` directory contains an
agent-orchestration framework (`commands/swarm`, `commands/hive-mind`,
`agents/sparc`) — present in the repo, not verified as tested/working
for this specific codebase.

## On-chain assets

- Genesis hash: `cf114022b5e4e1d6fdeb36890f35f605857cf2de93b53ebcb9c8e5652413ca04`
- Merkle root: `54fff9e19a729a3bfffbf9926d1e09d5134cb6e12a0723211ea04904d68530af`
- Network: Base mainnet
- PIEZ: `0xfb9c83432331EAf6f4a9D9488828823587d6f3da`
- PSENT: `0x985A1ebac4388DFb6EB4FE1171dCa9c6a5DB9cE7`
- UUON token and NFT ERC-1155 contract addresses not recovered this
  session — not found in any code, doc, or referenced file. Retrieve
  directly from Basescan transaction history or Railway secrets.

## Open architectural decisions (not urgent, but unresolved)

- `/api/token-ledger` double-mounted to two different routers
- Canonical shape/category count not established (2,856 vs 2,677 conflict)
- Whether `/api/export/*` gets built-and-gated or formally removed

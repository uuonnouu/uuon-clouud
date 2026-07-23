# UUON FOUNDATION — SESSION STATUS

Last updated: Saturday, June 20, 2026 — this file supersedes any earlier dated
version. If a previous session readme existed, it was not found on disk during
this session despite being referenced as authoritative — treat all prior
session docs as unverified until you confirm them on disk yourself.

Read this file FIRST in any new session. Then read ARCHITECTURE.md.

---

## CONFIRMED LIVE (verified this session, not assumed)

- uuon.world serving correctly: Railway + NIXPACKS builder, build command
  `npm install --legacy-peer-deps --include=dev && npm run build:client && npm run build:server`
- `/health` responding with real genesis/merkle data, db:true
- Real routing lives in `deferredApiRouter` (defined inline in `server/index.ts`,
  ~line 219). See ARCHITECTURE.md — this is the single most important fact
  in this file.
- PIEZ contract: `0xfb9c83432331EAf6f4a9D9488828823587d6f3da`
- PSENT contract: `0x985A1ebac4388DFb6EB4FE1171dCa9c6a5DB9cE7`
  (source: `middleware/piez-middleware.mjs`, does live `eth_call` balanceOf
  against `https://mainnet.base.org` — this is real, working, gating code)
- Genesis hash: `cf114022b5e4e1d6fdeb36890f35f605857cf2de93b53ebcb9c8e5652413ca04`
- Merkle root: `54fff9e19a729a3bfffbf9926d1e09d5134cb6e12a0723211ea04904d68530af`
- `/api/changelog/export` and `/api/nft-minting/*` — fixed and verified live
  this session (200, not 404)

## FIXED THIS SESSION (June 20)

1. Production blank-page outage — three compounding root causes:
   - `railway.json`/`railway.toml` had conflicting builders (RAILPACK vs
     NIXPACKS). Deleted `railway.toml`, standardized on NIXPACKS.
   - RAILPACK auto-detected a stray root `requirements.txt` (qiskit/scipy,
     unrelated Python tooling) as a Python project and failed building scipy
     (missing gfortran). Avoided by staying on NIXPACKS.
   - `vite` (a devDependency) was being skipped under production install
     defaults. Fixed by adding `--include=dev` to the buildCommand.
2. Landing page content regression — a prior `git revert` of commit
   `8b20be48` had undone the actual intended redesign (real genesis tx,
   real engine tiers, real stats), not a bug. Restored via
   `git checkout 8b20be48 -- client/src/pages/LandingPage.tsx LandingPage.css`.
3. `client/index.html` cleanup — removed fabricated PTSD/medical claims,
   fake `aggregateRating` review counts, a domain mismatch
   (`uuon-foundation.com` → `uuon.world`), and ~500 lines of unused
   "energy generation" CSS/keyword-stuffing meta tags.
4. Wired up `/api/changelog` (file existed, was never imported or mounted)
   and aliased `/api/nft-minting` + `/api/nft` onto the existing
   `nftMintingRoutes` router (was only reachable at `/api/ipfs`, frontend
   never called that path). Also transitively fixed `MetaMaskWalletPanel.tsx`,
   which depends on the same router.

## KNOWN RECURRING BUGS

- `/tmp/git-cred-helper.sh` missing on every `git push` (warns, falls back
  fine, root cause never fixed — multiple sessions now).
- Terminal/paste corruption: pasted multi-line commands intermittently lose
  leading characters (`git` → ` it`, `find` → `ind`). Always verify a command
  echoed correctly before trusting its output. Caused real misdiagnosis
  multiple times this session.
- Pattern of referenced files that don't exist on disk: `landing-page-redesign.html`,
  `UUON_DB_Truth_v1.docx`, and this readme's own predecessor were all
  treated as authoritative in past sessions/docs and were not found on disk.
  **Do not trust a referenced filename until you have found it yourself.**

## CONFIRMED DEAD (exist as files or are called by frontend, never mounted)

- `server/routes.ts` — the entire file. 33 `app.use` calls, none reachable.
  Not imported by `server/index.ts` at all. Includes dangling imports for
  `enterprise-api.ts`/`educational-integration.ts`, which don't exist on
  disk either (confirmed deleted in an earlier session, import never cleaned
  up — harmless only because the whole file is unreachable).
- `server/index.mjs` — also dead, same status, documented previously.
- `/api/export/*` — the entire export family. Means "no exports" is
  currently true by accident, not by design. Decide deliberately.
- `/api/autonomous/*`, `/api/security/incident`, `/api/wallet/verify`
  (no backend file exists for this at all — `find server/routes -iname "*wallet*"`
  returns nothing)
- The `uuon-compute/secure/lattice/proof/symbol/ai` route family
- `/api/paypal/*` — checkout has no backend
- `/api/queens-bridge/*` — IBM quantum hardware bridge panel, no backend
- `/api/token-ledger` is double-mounted to two different routers
  (`tokenEcosystemRoutes` and `tokenLedgerRoutes`) — unresolved, needs a
  decision on which is canonical.

## NOT YET BUILT / NOT YET DECIDED

- Etherscan API V2 integration (Base = chainid 8453) — scoped, blocked on
  user obtaining an API key. Intended scope: verify genesis tx + contract
  verification status. Real addresses available above.
- Uniswap v4 pool data for PIEZ/PSENT (price, liquidity) — scoped, same
  blocker.
- Shape/category count inconsistency never resolved: landing page says
  2,856 shapes/107 categories; `MuseumPage.tsx`, `AboutPages.tsx`,
  `about-sitemap.ts`, `system-performance.ts` all hardcode 2,677/150+.
  Get the real live count from `/api/shapes/categories` (sum all category
  counts) before propagating any single number everywhere.
- `.claude/commands/swarm/`, `.claude/commands/hive-mind/`,
  `.claude/agents/sparc/` — a real agent-orchestration framework is
  installed in this repo. Not verified as tested/working for this codebase.
  Don't grant it broad autonomous authority without first confirming what
  it actually does.

## DO NOT

- Trust any filename referenced in chat, docs, or memory until you've
  found it on disk yourself this session.
- Audit or modify routing based on `server/routes.ts` — it is not live.
  All real routing is in `deferredApiRouter` in `server/index.ts`.
- Assume a `git push` succeeding means Railway redeployed. Check uptime
  on `/health` and the actual served bundle hash/content.
- Re-litigate anything in "CONFIRMED LIVE" without a fresh failing test —
  these were verified directly, not assumed.

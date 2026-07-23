# UUON Foundation — Master Handoff Document
**Created:** June 17, 2026  
**Status:** Phase 1 Security Hardening ✓ COMPLETE  
**Next Phase:** Phase 2 — Repository Consolidation  

---

## SESSION SUMMARY

**Completed this session (June 17, 2026):**
- ✓ Phase 0: Foundation integrity (git, credentials, codebase state verified)
- ✓ Phase 0.5: Landing page live at https://uuon.world (Status 200)
- ✓ Phase 1 Group A: 4 security fixes (F-H10, F-H11, F-H14, F-H5)
- ✓ Phase 1 Group B: 3 security fixes (F-H8, F-H4, F-H6) — ALL DEPLOYED

**Total security fixes deployed: 8**

---

## LIVE SYSTEMS

### API & Infrastructure
- **Landing Page:** https://uuon.world (Status 200, live)
- **Deployment:** Railway (auto-deploys from UUON-Dmension-Mathematical-Universe GitHub)
- **API Status:** /health, /shapes, /compute, /quantum, /engines, /status all operational
- **Database:** Neon PostgreSQL, 2,856 shapes in formula_implementations (canonical)
- **Blockchain:** Base Mainnet (UUON, PSENT, PIEZ ERC-20 + NFT ERC-1155)

### Git Remote Configuration
---

## PHASE 1 SECURITY FIXES (COMPLETE)

### Group A (Previous Session)
| Fix | Location | Change | Commit |
|-----|----------|--------|--------|
| F-H10 | .env.production | SCARF_ANALYTICS=false | 630782b5 |
| F-H11 | package.json | solc → devDependencies | 630782b5 |
| F-H14 | server/index.ts | /health confirmed | 630782b5 |
| F-H5 | client/src/lib/d13mon4HashEngine.ts | webcrypto guard | 6f238708 |

### Group B (This Session)
| Fix | Location | Change | Commit |
|-----|----------|--------|--------|
| F-H8 | server/routes/nft-minting.ts | MIME validation + 10MB limit | ca0b0cfa |
| F-H8 | server/routes/ml-data-management.ts | MIME validation + 10MB limit | ca0b0cfa |
| F-H4 | client/src/lib/algorithmRenderer.ts | isFinitePoint guard (NaN/Infinity) | 9665b9d0 |
| F-H6 | server/populate-complete-shape-registry.ts | Transaction wrapping + batch (100 rows) | a43318fa |

**All deployed to production via Railway.**

---

## CRITICAL FILE LOCATIONS

### Source of Truth
- **Database:** `formula_implementations` (2,856 rows) — CANONICAL
- **Frontend:** `client/src/pages/LandingPage.tsx` (live at uuon.world)
- **Backend:** `server/index.ts` (Express API)
- **ORM Schema:** `shared/schema.ts` (Drizzle)
- **Rendering:** `client/src/lib/algorithmRenderer.ts` (F-H4 guard applied)
- **Registry Population:** `server/populate-complete-shape-registry.ts` (F-H6 transactions applied)
- **Token Gate:** `server/middleware/token-gate.mjs` (PSENT/PIEZ validation)
- **D13MON4 (Trade Secret):** `./engine/d13mon4HashEngine.ts` (never public)

### Never Use As Primary Source
- `complete_shape_registry` (570 rows, outdated Phase II data)

---

## GITHUB REPOSITORY TIER SYSTEM

**TIER 1 — CANONICAL (production):**
- dmension- (Railway deploys from here)
- UUON-Dmension-Mathematical-Universe (current 'origin')
- UUON-Foundation-Private (private remote)

**TIER 2 — AUDIT PENDING (likely duplicates):**
- UUON-Foundation-Public (wrong contract address 0x29b056..., stale Phase II data)
- UUON-Foundation-Public-PVT-
- uuon-dmension-public
- uuon-public
- dmension-platform

**TIER 3 — UNIQUE (verify scope):**
- uuon-fractal-api ✓ CONFIRMED UNIQUE (5 active GitHub issues, separate API)
- uuon-clouud / uuon-clouud-api (CHECK for unauthorized Clouud Æye work)
- uuon-foundation-node (Python, unclear)

**Next action:** Diff Tier 2/3 against dmension-, decide merge/archive per findings.

---

## ENVIRONMENT & SECRETS

### Replit Secrets (Required)
- METAMASK_PRIVATE_KEY (⚠️ Risk: deployer key, needs AWS KMS migration)
- PINATA_JWT (active key, uuon-phase3-jwt)
- NEON_DATABASE_URL (pooling OFF)
- THIRDWEB_SECRET_KEY / THIRDWEB_CLIENT_ID
- DATABASE_URL (same as Neon)

### Constraints
1. UUON token: Locked minimum 1 year (no pool, no promotion)
2. D13MON4: Trade secret (never public, never patented)
3. Clouud Æye: Requires 5-council review before any build
4. Neon v1.1.0: Only tagged template literals work (no .query() or .unsafe())

---

## IMMEDIATE NEXT ACTIONS (Phase 2)

1. **Audit Tier 2/3 repos** against canonical dmension- (diff-and-verdict for merge/archive)
2. **Fix public READMEs** (contract addresses, shape counts, Phase III data)
3. **Consolidate git remotes** (set dmension- as origin after audit)
4. **Verify Neon endpoint** (currently may be disabled)
5. **Test token-gated API** (verify /api/engines/* requires PSENT/PIEZ balance)

---

## LAST 3 COMMITS (ALL DEPLOYED)
---

## ROADMAP

| Phase | Status | Work | Est. Effort |
|-------|--------|------|------------|
| 0 | ✓ | Foundation, git, creds | 2 hrs |
| 0.5 | ✓ | Landing page live | 1 hr |
| 1 | ✓ | 8 security fixes | 6 hrs |
| 2 | ⏳ | Repo consolidation | 4-6 hrs |
| 3 | Queued | PSENT pool, image capture | 6-8 hrs |
| 4 | Queued | White paper, Basescan | 3-4 hrs |
| 5 | Optional | Ruflo swarm | 2-3 hrs |
| 6 | Do Not Start | Native chain (gPoW) | TBD |

---

**End Handoff. Phase 1 Complete. Ready for Phase 2.**

---

## APPENDIX: VIBE CODE AUDIT (2-Year Checkpoint History)

### Discovery
**Status:** Broken/Incomplete  
**Size:** 624MB proof-archive + 15+ checkpoint commits from previous Claude agents

### What Exists (In Code)

### What Doesn't Work
1. SDK Portal missing front-end assets (expected at `/app/dist/public/index.html`)
2. Developer docs incomplete (references exist, endpoint doesn't)
3. Certificate storage system mentioned but not audited
4. Revenue tracking objects in code but unclear if active

### What This Means
- Previous Claude agents built features that aren't fully integrated
- These routes may conflict with Phase 2 cleanup work
- Could cause deployment issues if not addressed
- 624MB proof-archive suggests validation testing (unclear purpose)

### Next Session Action
**VIBE CODE AUDIT (separate focused task, NOT part of Phase 2):**
1. Remove broken /sdk-portal and /docs route handlers
2. Archive proof-archive to external storage (too large, not in repo)
3. Clean up new-year-2026-revenue-activation.ts and related revenue code
4. Verify no conflicts with Phase 1 token-gated API
5. Document what was intended vs what's actually deployed
6. Decide: integrate fully, or deprecate completely

**Do not start Phase 2 until vibe code is audited** — it may be blocking deployment.


---

## APPENDIX: VIBE CODE AUDIT (2-Year Checkpoint History)

### Discovery
**Status:** Broken/Incomplete  
**Size:** 624MB proof-archive + 15+ checkpoint commits from previous Claude agents

### What Exists (In Code)
### What Doesn't Work
1. SDK Portal missing front-end assets (expected at `/app/dist/public/index.html`)
2. Developer docs incomplete (references exist, endpoint doesn't)
3. Certificate storage system mentioned but not audited
4. Revenue tracking objects in code but unclear if active

### What This Means
- Previous Claude agents built features that aren't fully integrated
- These routes may conflict with Phase 2 cleanup work
- Could cause deployment issues if not addressed
- 624MB proof-archive suggests validation testing (unclear purpose)

### Next Session Action
**VIBE CODE AUDIT (separate focused task, NOT part of Phase 2):**
1. Remove broken /sdk-portal and /docs route handlers
2. Archive proof-archive to external storage (too large, not in repo)
3. Clean up new-year-2026-revenue-activation.ts and related revenue code
4. Verify no conflicts with Phase 1 token-gated API
5. Document what was intended vs what's actually deployed
6. Decide: integrate fully, or deprecate completely

**Do not start Phase 2 until vibe code is audited** — it may be blocking deployment.


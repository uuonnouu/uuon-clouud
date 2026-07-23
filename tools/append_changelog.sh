#!/bin/bash
set -e

cp client/src/lib/CHANGELOG.md client/src/lib/CHANGELOG.md.bak.$(date +%s)
echo "[backed up] client/src/lib/CHANGELOG.md"

# Prepend new entry at the top (most recent first)
python3 << 'PYEOF'
path = "client/src/lib/CHANGELOG.md"
with open(path) as f:
    existing = f.read()

title_line = "# Δmension Mathematical Universe - CHANGELOG"
if existing.startswith(title_line):
    existing_body = existing[len(title_line):].lstrip("\n")
else:
    existing_body = existing

new_entry = """## [2026-06-29] - Repo Audit, Cleanup, and Documentation Correction

**This entry supersedes conflicting claims in older documents below and
elsewhere in the repo. Where a date conflict exists, this entry is authoritative.**

### REMOVED (confirmed non-functional, never live in production)
- `server/routes/mathematical-consciousness-integration.ts` — endpoints
  returned hardcoded fabricated status strings (e.g. "consciousnessLevel:
  operational"), no underlying computation
- `server/routes/symbiotic-consciousness-growth.ts` — hardcoded relationship
  data with no computation
- `server/routes/lexicon-extraction.ts` — fed the above, no independent function
- `server/routes/quantum-computing.ts` — redundant subset of `quantum.ts`
- `server/routes/ontology-integration.ts` — redundant subset of `ontology.ts`
- `/consciousness/*` and `/physical-embodiment/*` endpoints inside
  `lexicon.ts` — same fabricated-status pattern, confirmed live at
  `/api/lexicon` prior to removal

### FIXED
- Orphaned import of deleted `quantum-computing.ts` in `server/routes.ts`
  (note: `server/routes.ts` itself is dead code, not used by the live
  `deferredApiRouter` in `server/index.ts` — confirmed by direct inspection)
- Unresolved git merge conflict markers in `uuon-public/README.md`
- Swapped PIEZ/PSENT contract addresses in `public-release/README.md`
  (corrected against live Basescan verification)
- `README.md`, `uuon-public/README.md`, `public-release/README.md` rewritten
  for factual accuracy; added direct Basescan and Uniswap links for all
  listed contracts

### VERIFIED LIVE (2026-06-29, direct check, not assumed)
- `https://uuon.world/health` — responding, `db: true`
- `https://uuon.world/api/engines` — 4 engines live (Quantum, Relativity,
  Fractal, Modulo), policy confirmed: geometry returned, formula source
  never transmitted
- PIEZ (`0xfb9c83432331EAf6f4a9D9488828823587d6f3da`) and PSENT
  (`0x985A1ebac4388DFb6EB4FE1171dCa9c6a5DB9cE7`) contracts verified on
  Basescan, Uniswap v4 pools confirmed live with real (currently thin)
  liquidity — price impact 20-35% on ~$15 trades, disclosed in README

### KNOWN STALE / NOT YET RECONCILED (flagged, not yet fixed)
- `docs/api/README.md` describes endpoints (`/api/compute`,
  `/api/token-ecosystem/generate`) that do not exist in the live router —
  needs rewrite to reflect actual `/api/engines` surface
- `enhancements/README.md` ("NJIN OPTIMIZER") makes claims ("Zero Risk:
  Original engines cannot be damaged") not yet verified against actual code
  — treat as unverified until audited

### OPEN ITEMS (not part of this session's changes)
- Neon DB password rotation — pending, hostname/user was briefly exposed
  during a public-repo window earlier in this session
- Repo renamed from `UUON-State-Root` to `UUON Dmension Mathematical
  Universe` — see rename note below

"""

with open(path, "w") as f:
    f.write(title_line + "\n\n" + new_entry + "\n---\n\n" + existing_body)
print("[written] new changelog entry prepended")
PYEOF
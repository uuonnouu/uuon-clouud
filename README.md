# UUON Foundation — UUON State Root
### Mathematical Operating System (MOS) · Geometric Proof of Work (gPoW) · Base Mainnet

**Creator:** Phillip Aguilar Ruiz III  
**Organization:** UUON Foundation Inc.  
**Genesis Hash:** `cf114022b5e4e1d6fdeb36890f35f605857cf2de93b53ebcb9c8e5652413ca04`  
**Phase III Merkle Root:** `54fff9e19a729a3bfffbf9926d1e09d5134cb6e12a0723211ea04904d68530af`

---

## What This Is

The Dmension Mathematical Universe is a **Mathematical Operating System** where parametric 3D geometric shapes serve as cryptographic objects. Every token, proof, and block in the ecosystem is derived from a unique geometric primitive anchored on-chain.

**Core innovation:** Geometric Proof of Work (gPoW). Validators prove they computed a valid parametric surface within defined mathematical bounds. The shape is the proof. Computational energy produces a real mathematical asset — not heat.

This is not primarily a blockchain project. The parametric shape generation engine came first. Blockchain infrastructure is one of its output layers.

---

## Monorepo Structure

This repository (`UUON-Dmension-Mathematical-Universe`) is the canonical monorepo consolidating the full UUON Foundation codebase. Previously tracked across five separate remotes, all history branches have been unified here.

```
UUON-Dmension-Mathematical-Universe/
├── server/               # Express API server (TypeScript → compiled via esbuild)
├── client/               # React + Vite + Three.js frontend
├── middleware/            # Token gate middleware (PSENT / PIEZ on-chain checks)
├── scripts/              # Extraction tools, seeding, DB utilities
├── docs/                 # Architecture docs, shape catalog, session context
└── legacy/               # Archived history branches from consolidated repos
```

**Consolidated repositories:**
- `dmension-` — Railway-deployed production API (canonical source)
- `UUON-Foundation-Private` — private infrastructure layer
- `UUON-Foundation-Public` — public research layer
- `uuon-dmension-public` — public dataset mirror
- `uuon-public` — community-facing documentation

---

## Live Contracts — Base Mainnet

All addresses verifiable on [Basescan](https://basescan.org).

| Token | Contract Address | Details |
|---|---|---|
| UUON ERC-20 | `0x1981B92B97Ba024BC5663Ce36809Da15B80B22dE` | 4M circulating / 10M hard cap |
| PSENT ERC-20 | `0x985A1ebac4388DFb6EB4FE1171dCa9c6a5DB9cE7` | 10M minted — API signal token |
| PIEZ ERC-20 | `0xfb9c83432331EAf6f4a9D9488828823587d6f3da` | 10M minted — API compute token |
| NFT ERC-1155 | `0xa14c3015E6b9Ad30337bD72c94Dc236835f61165` | 2,856 unique shape proofs |
| UUONLevelRegistry | `0xEa615FC3Cdf8B02b6cB3e19859C86105F397ed35` | On-chain level registry |
| PIEZDistributor | `0xC6A82eEfA8786B0860E451334e17948a81FBD14E` | PIEZ distribution contract |

**Founder Wallet:** `0x14a918D01D1a2B31C7c4411df057386A6b44e0b8`  
**Treasury:** `0x425734a7fd13E9994b66a7909206007A1EF7030B`

---

## Phase III Anchor — Canonical Proof

| Field | Value |
|---|---|
| Transaction | `0xaafd9865cedca7932838d7006a27b14898faca5c908e0fa092615f892aea8d05` |
| Block | 47403435 |
| Shapes anchored | 2,425 (with equation DNA) |
| Total shapes | 2,856 (unique, verified) |
| IPFS CID | `QmU7zUDNF3pyuWqNsfH9QCUJcT4oCUBr5JQfeptdCVT7t8` |
| Anchored | 2026-06-16 |

---

## Live Infrastructure

| Service | Endpoint / Details | Status |
|---|---|---|
| Production API | `https://uuon.world` | ✅ Live (Railway) |
| Health endpoint | `https://uuon.world/health` | ✅ `{"status":"ok","db":true}` |
| Engine API | `https://uuon.world/api/engines` | ✅ 4 engines live |
| Database | Neon PostgreSQL `ep-curly-unit-atlt2cb4` | ✅ 2,856 shapes |
| IPFS | Pinata PICNIC plan, 1TB | ✅ Active |
| Uniswap v4 | PIEZ/ETH + PSENT/ETH pools | ✅ Live on Base |

**Liquidity pool price:** 314,159.265359 tokens/ETH (π to 6 decimal places — deliberate.)

---

## Token-Gated Engine API

Access to engine endpoints requires holding PSENT or PIEZ on Base Mainnet.

```
GET  /api/engines                          # Public — lists all engines
GET  /api/engines/quantum/shapes           # Requires PIEZ balance
GET  /api/engines/relativity/shapes        # Requires PIEZ balance
GET  /api/engines/fractal/shapes           # Requires PSENT balance
GET  /api/engines/modulo/shapes            # Requires PSENT balance
```

**Authorization header format:**
```
Authorization: PIEZ-Balance 0x<your_wallet_address>
Authorization: PSENT-Balance 0x<your_wallet_address>
```

Balance is checked against the live contract on Base Mainnet per request. Formula source code is never transmitted — endpoints return geometry only (vertices, normals, UVs).

---

## Engine Tiers

| Engine | Tier | Shapes | Description |
|---|---|---|---|
| Quantum | Enterprise | 15 | Quantum wave functions, Schrödinger solver, IBM quantum bridge |
| Relativity | Professional | 18 | Einstein field equations, geodesics, gravitational waves |
| Fractal | Professional | 16 | Parametric fractals, GMod6 chaos attractors, recursive geometry |
| Modulo | Standard | 5 | 150 modulo algorithms, GMod6 system, cyclic number-theoretic geometry |

---

## Shape Asset Inventory — Genesis Dataset v1.0

32 NeRF shapes across 6 domains, each with 4 source files (metadata, formulas, camera transforms, Instant-NGP config):

| Domain | Shapes |
|---|---|
| Cryptographic | SHA-256, Keccak/SHA-3, AES Rijndael, ECC, Kyber/NTRU, Hash Avalanche, Blockchain Merkle Tree |
| Financial | Black-Scholes Surface, Volatility Surface, Monte Carlo Risk, Crypto Price Fractal |
| AI / ML | Transformer Attention, Neural Loss Landscape, Gradient Descent Path, Kolmogorov Complexity |
| Quantum States | Qubit Bloch Sphere, Qubit State Vector, Qubit Superposition, Two-Qubit Entangled, Two-Qubit Product, 3-Qubit GHZ, Multi-Qubit Tensor Product, 3-Qubit Error Correction, Shor 9-Qubit Code |
| Quantum Gates | Pauli-X, Pauli-Y, Pauli-Z, Hadamard, Phase Gate S, Phase Gate T, CNOT Gate |
| Quantum Networks | Quantum Information Flow |

---

## Completed Milestones

- [x] Genesis hash established and anchored — `cf114022...`
- [x] UUON ERC-20 deployed on Base Mainnet — `0x1981B9...`
- [x] PSENT ERC-20 deployed on Base Mainnet — `0x985A1e...`
- [x] PIEZ ERC-20 deployed on Base Mainnet — `0xfb9c83...`
- [x] NFT ERC-1155 deployed — `0xa14c30...`
- [x] UUONLevelRegistry deployed — `0xEa615F...`
- [x] PIEZDistributor deployed — `0xC6A82e...`
- [x] Phase III: 2,856 shapes verified and anchored on-chain (2026-06-16)
- [x] Phase III: Merkle root `54fff9e1...` anchored at Block 47403435
- [x] OpenSea metadata generated for all 2,856 shapes — pinned to IPFS
- [x] `contractURI` set on-chain: `ipfs://QmR4YyHCkZqkueQ3WzWAEAxeyzP4jdjcQ83Y3ituzEsSJD`
- [x] PIEZ/ETH and PSENT/ETH liquidity pools live on Uniswap v4 Base
- [x] Phase IV Security Hardening — 8 fixes deployed (HMAC fallback, simulation mode, mint validation, webcrypto guard, MIME validation, transaction wrapping, SCARF analytics, solc devDeps)
- [x] Token-gated engine API live — on-chain PSENT/PIEZ balance check confirmed in production
- [x] `uuon.world` live and routing to Railway (HTTP 200, db:true)
- [x] `/health` endpoint live with genesis + merkle verification
- [x] All repos consolidated into `UUON-Dmension-Mathematical-Universe` monorepo

---

## Open — In Progress

- [ ] Shape image auto-capture (`?capture=true` → IPFS → MANIFEST.json update)
- [ ] White paper — sequenced after token gate proven (now unblocked)
- [ ] Basescan token info forms for PIEZ and PSENT
- [ ] Vibe code deprecation audit — ~80% of checkpoint features are abandoned; audit required before Phase 2 repo consolidation
- [ ] Stale public documentation reconciliation across remaining public-facing surfaces
- [ ] AWS migration for KMS-grade secrets management (deployer key, `UUON_TOKEN_SECRET`, Pinata keys) — deferred until shape capture and white paper complete

---

## Phase Roadmap

| Phase | Description | Status |
|---|---|---|
| Phase 1 | ERC-20s on Base Mainnet, public API, shape registry, token-gated engine access | ✅ Live |
| Phase 2 | Cosmos SDK appchain, gPoW implementation, validator recruitment | 🔲 Not started |
| Phase 3 | Native chain, Shape VM (MintShape / TransferShape / FuseShapes / BurnShape / ProveShape), quantum-resistant signatures (CRYSTALS-Dilithium + Kyber) | 🔲 Future |

**Quantum resistance:** Phase 1 uses standard ECC (required for EVM compatibility). Phase 3 launches with post-quantum cryptography natively — no future hard fork required.

---

## Architectural Principles (Immutable)

**Probabilistic verification.** Binary pass/fail is misaligned with the underlying mathematical objects — quantum surfaces as probability amplitudes, financial surfaces as distributions, Kolmogorov complexity as a lower bound. The verifier uses a confidence threshold model.

**Mathematical null as foundation.** All architecture builds outward from the null-ground state. Every component traces back to this foundation.

**Non-destructive layering.** New components are added as distinct layers. Existing on-chain assets are never modified.

**Genesis hash is immutable.** `cf114022b5e4e1d6fdeb36890f35f605857cf2de93b53ebcb9c8e5652413ca04` — this is the trust root threaded through the entire system.

---

## Public / Private Boundary

This repository follows the **UUON Foundation Public Repository Protection Framework**.

**Public:** Mathematical models, geometry engines, simulation engines, visualizers, benchmark suites, public datasets, documentation, white papers, API specifications, reference implementations, tutorials, examples.

**Private (never published here):** CI/CD pipelines, production orchestration, enterprise integrations, calibration datasets, internal telemetry, NeRF conversion pipelines, LUT generation systems, field-composition recipes, secret coefficients, anti-abuse systems, proprietary validation methods, anything under patent evaluation. D13MON4 is a registered trade secret and is not disclosed in any public repository.

---

## License & Attribution

Copyright © UUON Foundation Inc.  
Creator: Phillip Aguilar Ruiz III  
Contributors: as listed in repository history and contributor records.

All contributions are subject to the Contributor License Agreement (CLA). Contributors retain authorship while granting UUON Foundation the right to distribute, modify, sublicense, and commercially license contributions as permitted by project policy.

---

*UUON Foundation Inc. · Genesis: `cf114022b5e4e1d6fdeb36890f35f605857cf2de93b53ebcb9c8e5652413ca04`*

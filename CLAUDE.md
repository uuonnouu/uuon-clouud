# CLAUDE.md — UUON Foundation / Δmension Mathematical Universe

This file gives Claude (chat, Claude Code, or any Ruflo-orchestrated agent) the real
context needed to work on this project safely and effectively. It replaces a prior
version of this file that had been corrupted with an unrelated GitHub page dump plus
boilerplate Replit notes — that content was not legitimate project documentation.

## What this project is

A Mathematical Operating System (MOS): 2,856 parametric 3D geometric shapes serve as
cryptographic proof objects under a planned Geometric Proof of Work (gPoW) consensus
mechanism (Phase III, spec-only — not implemented in code yet). Production stack:
React/Vite frontend + Express/TypeScript backend on Railway, Neon PostgreSQL, three
live ERC-20 tokens (UUON, PIEZ, PSENT) and an NFT collection on Base Mainnet.

Public site: https://uuon.world
Live API root: https://uuon.world/api

## Critical trade secret — read this before touching anything crypto-related

**D13MON4** (`server/services/d13mon4HashEngine.ts`) is a 12-tetrahedron geometric hash
engine — core proprietary IP. It must:
- Never appear in any public client bundle
- Never be exposed via any public-facing API route beyond the existing,
  intentionally-scoped `/api/d13mon4/*` endpoints
- Never be discussed, reproduced, or summarized in public documentation, README files,
  or any content destined for a public repo

If a task touches this file, treat it as maximum-sensitivity and confirm scope with
Phillip before committing or deploying anything that changes its public exposure.

## Architecture quick reference

- **Database**: `formula_implementations` (2,856 rows) is the canonical shape source of
  truth. `complete_shape_registry` (570 rows) is legacy — do not treat as authoritative.
- **Tokens**: UUON = off-market reserve (no DEX pool, 1-year min lock). PIEZ/PSENT =
  traded utility tokens with live Uniswap v4 Base pools.
- **Auth**: GitHub OAuth (`passport-github2`, see `server/auth/githubStrategy.ts`),
  requires `OAUTH_CLIENT_ID`/`OAUTH_CLIENT_SECRET` env vars (Railway Variables, not
  Replit Secrets — they don't sync). Local username/password auth also exists in
  `server/routes/auth.ts`. Both write to the same `users` table.
- **Routing**: static pages (`/`, `/apps`, `/developer`, `/dashboard`, etc.) are served
  from `client/public/*.html` via `resolveStaticHtml()` in `server/index.ts` — this
  works independent of the Vite client build, by design, so the site stays up even
  when the React build is broken.

## Build & verification commands that actually work

```bash
# Server build (always works, esbuild, no type-checking)
npm run build:server

# Client build (Vite — historically had a peer-dep conflict with
# @vitejs/plugin-react; resolved as of June 21, 2026, but verify it still
# completes clean before assuming it's fixed long-term)
npm run build:client

# Full production build (what Railway actually runs)
npm install --legacy-peer-deps && npm run build:server && npm run build:client

# Local dev server — IMPORTANT: static file serving only activates with
# NODE_ENV=production set. Without it, requests fall through to the SPA
# catch-all and you'll get misleading results when testing static routes.
NODE_ENV=production npx tsx server/index.ts
```

## Hard-learned lessons (do not repeat these mistakes)

1. **Never run `drizzle-kit push` without checking `drizzle-kit check` first.** It
   diffs your *entire* schema against the *entire* live DB, including tables you
   didn't touch — it has previously proposed truncating `formula_implementations`
   (2,856 rows) to satisfy an unrelated unique-constraint mismatch. For any single-
   table change, write a targeted `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` script
   instead.
2. **A missing/invalid env var should never crash the whole process.** Wrap optional
   integrations (OAuth strategies, third-party API clients) in a guard that logs a
   warning and disables the feature, rather than throwing at module load time. This
   already caused one full production outage (missing `OAUTH_CLIENT_ID` on Railway).
3. **Background shell commands do not persist across separate tool calls in this
   environment.** Starting a server with `nohup ... &` in one command and then
   curling it in the next command will fail — the process is gone. Start and test in
   a single combined command block.
4. **Always use `git --no-pager` or pipe to `cat`** for `git show`/`git diff` — the
   interactive pager hijacks the terminal in this environment and there's no way to
   exit it cleanly mid-script.
5. **`esbuild` does not type-check.** A clean, fast server build proves nothing about
   whether the code actually runs correctly — schema/code mismatches (e.g. a route
   referencing a DB column that doesn't exist) will ship silently and only surface as
   runtime errors.
6. **Verify before claiming.** Prior agent sessions have fabricated completed work
   (a "Cosmos SDK implementation" with zero git footprint, hallucinated Ruflo swarm
   "findings" from a swarm that was never actually executed). Any claim of completed
   work must be checked against actual file contents, git history, or live system
   state — not asserted from pattern-matching on commit messages or file names.

## Working style

- Phillip expects direct pushback on flawed assumptions, not default agreement.
- Grouped multi-command bash blocks are preferred over single isolated commands.
- Verification (curl, grep, direct DB query) is preferred over trusting documentation
  or prior claims.
- On-chain transactions and other irreversible actions require explicit confirmation
  before execution — never execute these autonomously based on inferred intent.
- See `skills.md` for domain-specific guidelines used by audit/research agents.
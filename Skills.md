# skills.md — Domain Guidelines for UUON / Δmension Agents

Format note: `systems_check.py` reads this file and checks each bullet item against
`repo_report.json`'s "usable" file list to compute skill coverage. Keep top-level
skill names short and matchable to real file/module names where possible.

## Frontend (client/)

- parametric-surface-rendering
- shape-explorer-interaction
- responsive-layout-consistency
- design-system-bw-arial-narrow
- mobile-desktop-parity

**Guideline:** Any new UI must match the existing black/white, Arial Narrow design
system established on the landing page (`client/public/uuonworld.html`) — same CSS
variables (`--black`, `--line`, `--white`, `--dim`), same hairline-border card style.
Do not introduce a second visual language. Mobile and desktop must render the same
component tree; if a deliberate mobile-only layout is needed, it must be flagged
explicitly in the PR/report, not silently diverge.

## Backend (server/)

- api-route-completeness
- token-gate-enforcement
- error-handling-no-crash-loop
- timestamp-type-correctness
- auth-session-integrity

**Guideline:** Every route that should require a PIEZ/PSENT balance must use the
token-gate middleware — check this explicitly, don't assume. Any optional integration
(third-party API key, OAuth provider) must degrade gracefully on missing config, never
throw at module load. Drizzle `timestamp()` columns require real `Date` objects, not
`Date.now()` numbers or ISO strings — this caused a real production bug.

## Integration & validation

- frontend-backend-contract-accuracy
- dead-endpoint-detection
- docs-vs-live-reality-check
- on-chain-claim-verification

**Guideline:** A documented API endpoint, UI link, or token claim is only "done" when
verified live (curl, on-chain read call, actual page load) — not when the code is
written. Treat documentation and code as two separate things that must be checked
against each other, not assumed to match.

## Security

- secret-exposure-scanning
- dependency-cve-monitoring
- session-cookie-flags
- rate-limit-verification
- injection-probe-testing

**Guideline:** Re-run the baseline security pass (headers, CORS, exposed paths, npm
audit, auth-gate coverage) periodically and diff against the prior run, dated. Flag
new findings; don't silently accept drift from a previously-clean baseline.

## Mathematical / domain-specific (Δmension engine)

- fibonacci-level-structure-integrity
- shape-formula-correctness
- d13mon4-trade-secret-boundary
- token-supply-cap-reconciliation

**Guideline:** The 6-level/32-shape Fibonacci structure and any associated token
supply caps must be reconciled against the canonical UUON Foundation Public repo
before being treated as settled fact — verbal specs and prior internal docs are not
automatically authoritative if they conflict with the public repo. D13MON4 internals
are out of scope for any public-facing report, ever — flag and stop, don't summarize.

## Agent operating mode (current)

All domain agents currently operate in **report-only mode**: audit, research, and
propose. No agent has autonomous write, commit, or deploy access to this codebase.
Findings are reviewed by Phillip before any change is applied. This restriction stays
in place until a track record of accurate, non-hallucinated findings is established
per domain — see `CLAUDE.md` section "Hard-learned lessons" for why.
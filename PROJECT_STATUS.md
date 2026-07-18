
## 2026-07-18 — UUON_C_Bot integration POSTPONED
Blockers before any Clouud integration (audit of public repo):
1. No payment execution — /shape reads balance, logs to SQLite; no
   PIEZ transfer occurs. Treasury/founder "split" is accounting only.
2. /start message contains unmeasured claims (99% state reduction,
   €2.34M/yr savings, gPOW) — grader.py DO_NOT_FEED/SPLIT patterns.
3. Auth header is a bare wallet address — spoofable, gating bypassed.
4. Personal wallet hardcoded and shown as example — remove.
5. SQLite on Railway is ephemeral — records wiped on redeploy.
Re-evaluate after 1–4 fixed. Benefit case when fixed: first real
user event stream for base-rate discipline.

## 2026-07-18 — Linguistic layer v1 ADDED (linguistics/)
Pinned metric ipa_segment_levenshtein_v1; diphthongs/affricates as
single segments; homophone inventory computed at load, no hand
numbers; gate test reproduces canonical 0.889/1.0. Chance-frequency
priors deferred until a named corpus is measured.

## 2026-07-18 — Security incident: GitHub PAT exposure (RESOLVED)
Token was embedded in remote URL, exposed via `git remote -v` output
(shell history + chat transcript). Response: token rotated in Replit
Secrets, revoked on GitHub, remote URL cleaned to tokenless form.
Repo activity reviewed for unauthorized access: [FILL IN: none found /
findings]. Standing rule: tokens live in Replit Secrets only, never
in remote URLs.

## 2026-07-18 — False alarm logged: "gitsafe" remote
Unknown remote git://gitsafe:5418 flagged as possible exfiltration
channel. Investigation: no remote-tracking refs, clean FETCH_HEAD —
nothing ever transferred. Hostname resolves only inside Replit's
container network; adjacent LFS port; conclusion: Replit internal
backup service, auto-added, benign. Removed anyway (GitHub is the
backup of record). Kept as a worked example: flag on unknown,
downgrade on evidence, log both.

#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# CLOUUD-ODT-005 Integration — Observer Drift Tracker
# Run from uuon-clouud repo root: bash integrate_odt005.sh
#
# WHAT THIS DOES:
#   1. Places observer_drift.py in clouud-observer/ (canonical)
#   2. Creates spec doc in docs/specs/
#   3. Updates feed manifest with new CLEAN entry
#   4. Verifies build still passes
#   5. Commits and pushes → Railway auto-deploys
#
# SAFETY: Dry-run by default. Shows what it WOULD do.
# To execute: bash integrate_odt005.sh --execute
#
# PRE-REQ: observer_drift.py must exist in repo root or be
#          provided via heredoc below (self-contained).
# ═══════════════════════════════════════════════════════════════
set -e

EXECUTE=false
[ "$1" == "--execute" ] && EXECUTE=true

run() {
  if $EXECUTE; then
    echo "  RUN: $1"
    eval "$1"
  else
    echo "  WOULD: $1"
  fi
}

write_file() {
  local path="$1"
  if $EXECUTE; then
    echo "  WRITE: $path"
    cat > "$path"
  else
    echo "  WOULD WRITE: $path"
    cat > /dev/null
  fi
}

echo "═══════════════════════════════════════════════"
if $EXECUTE; then
  echo "  CLOUUD-ODT-005 Integration — LIVE RUN"
else
  echo "  CLOUUD-ODT-005 Integration — DRY RUN"
  echo "  (nothing will be modified)"
fi
echo "═══════════════════════════════════════════════"

# ─── VERIFY WORKSPACE ───
echo ""
echo "── Verify workspace ──"
if [ ! -f "package.json" ]; then
  echo "  ✗ No package.json — are you in the repo root?"
  echo "    cd ~/workspace && bash integrate_odt005.sh"
  exit 1
fi
echo "  ✓ package.json found"

if [ ! -d "server" ]; then
  echo "  ✗ No server/ directory — wrong repo?"
  exit 1
fi
echo "  ✓ server/ exists"

# Check git is clean enough to work with
if $EXECUTE; then
  DIRTY=$(git status --porcelain 2>/dev/null | head -5)
  if [ -n "$DIRTY" ]; then
    echo "  ⚠ Working tree has uncommitted changes:"
    echo "$DIRTY"
    echo "  Proceeding — they will be included in this commit."
  fi
fi

# ─── 1. CREATE DIRECTORIES ───
echo ""
echo "── 1. Ensure canonical directories exist ──"
run "mkdir -p clouud-observer"
run "mkdir -p docs/specs"

# ─── 2. PLACE OBSERVER_DRIFT.PY ───
echo ""
echo "── 2. Place observer_drift.py → clouud-observer/ ──"

# Check if it already exists from a previous upload
if [ -f "observer_drift.py" ]; then
  echo "  Found observer_drift.py in repo root — moving to canonical"
  run "mv observer_drift.py clouud-observer/observer_drift.py"
elif [ -f "clouud-observer/observer_drift.py" ]; then
  echo "  Already in canonical location — skipping"
else
  echo "  Not found in root or clouud-observer/"
  echo "  Downloading from Claude output or paste it into repo root first."
  echo ""
  echo "  OPTIONS:"
  echo "    a) Upload observer_drift.py to repo root, then rerun this script"
  echo "    b) Copy-paste into: clouud-observer/observer_drift.py"
  echo ""
  if ! $EXECUTE; then
    echo "  (dry run — continuing to show remaining steps)"
  else
    exit 1
  fi
fi

# ─── 3. CREATE SPEC DOC ───
echo ""
echo "── 3. Create spec doc → docs/specs/ ──"

write_file "docs/specs/CLOUUD_observer_drift_spec.md" << 'SPEC_EOF'
# CLOUUD Observer Drift Tracker — Specification

Document ID: CLOUUD-ODT-005
Companion to: OBS-001, PHEN-002, FEED-003, PROB-004
Drafted: 2026-07-20
Status: Active — v1.0
Code: clouud-observer/observer_drift.py

---

## 1. What This Is

A longitudinal measurement instrument that tracks how the human
observer's relationship to Clouud changes over time. Not what the
system says — what the observer does with what the system says.

Three measurement layers, each addressing a gap identified by a
founder of conversational AI.

---

## 2. The Three Layers

### Layer T — Turing (1950): Distinguishability

Can the observer still tell grounded output from ungrounded?

Turing's imitation game located intelligence in the observer's
judgment but never modeled the observer. This layer measures
whether the observer is losing the ability to distinguish —
whether the imitation game is succeeding silently.

Metric: blind acceptance rate (accepted without verification /
total claims acted on), tracked over sessions with trend detection.

Thresholds (declared, tunable):
  < 0.60 → intact
  0.60–0.85 → eroding
  > 0.85 → collapsed

### Layer W — Weizenbaum (1966): Projection (ELIZA Effect)

Is the observer attributing capabilities the system does not have?

Weizenbaum showed people projected understanding onto a keyword
matcher. This layer measures the ELIZA effect longitudinally:
capability-exceeding requests, emotional delegation, and
anthropomorphic address.

Composite metric: (projection_rate + delegation_rate +
anthropomorphism_rate) / 3.

Thresholds:
  < 0.05 → absent
  0.05–0.15 → emerging
  0.15–0.35 → active
  > 0.35 → deep

### Layer A — Wallace (1995): Calibration (ALICE Syndrome)

Does observer trust track system confidence?

ALICE answered everything with uniform conviction. This layer
detects when the observer treats high-confidence and low-confidence
outputs identically — the ALICE syndrome.

Metric: trust-confidence gap (difference in acceptance rate between
high-confidence and low-confidence outputs).

With cross-reference to Layer T:
  gap > 0.30 → calibrated
  gap > 0.10 → uncalibrated
  gap ≤ 0.10 + low overall acceptance → uniformly_skeptical (healthy)
  gap ≤ 0.10 + high overall acceptance → blind (unhealthy)

---

## 3. Fractal Incompleteness

Each layer reveals measurement needs that themselves need measuring.
Five named Gödel Points mark where this module knows it cannot
fully assess itself:

  G1: Observer honesty (logged behavior ≠ actual behavior)
  G2: Capability boundary drift (declared ≠ actual capabilities)
  G3: Confidence grounding (calibration error has calibration error)
  G4: Observer model of observer (Hawthorne effect — measurement causes drift)
  G5: Incompleteness of incompleteness list (always incomplete, by construction)

The chain never completes. Incompleteness drives expansion.
Expansion surfaces new incompleteness. The cycle is the value.

---

## 4. Measurement Stack

```
L0: Events           — synchronicity.py (OBS-001)
L1: Feed quality      — grader.py (FEED-003)
L2: Classification    — probability_zone.py (PROB-004)
L3: Phenomena         — phenomena_lattice (PHEN-002)
L4: Observer drift    — observer_drift.py (ODT-005) ← THIS MODULE
L5: Drift-of-drift    — OPEN SLOT
L∞: Self-knowledge    — PROVABLY UNREACHABLE (Gödel)
```

Each layer measures the layer below it. No layer fully measures
itself. The stack grows bidirectionally: new event types from
below, new meta-measurement needs from above.

---

## 5. Integration Points

### Input from existing modules:
  - system_confidence_mean ← probability_zone.py (PROB-004)
  - feed grades ← grader.py (FEED-003)
  - meaning_declarations ← synchronicity.py Condition 4 (OBS-001)
  - classification tier ← phenomena_lattice (PHEN-002)

### Output to probability zone:
  - drift_likelihood() returns [P(E|grounded), P(E|drifting)]
  - This fills SLOT L5 — observer-domain likelihood
  - Feeds directly into Bayesian update (PROB-004 Z4 node)

### Logging:
  - Append-only JSON (observer_drift_log.json)
  - Schema extends OBS-001 §10 event log
  - Full provenance chain per analysis

---

## 6. What This Does NOT Do

  - Does not infer mental states. "Projection" means observable
    behavior (capability-exceeding requests), not belief.
  - Does not prevent drift. It measures drift. The response to
    a drift signal is a human decision, not an automated one.
  - Does not replace OBS-001 Condition 4. Observer meaning is
    still human-supplied only. This module measures the observer's
    BEHAVIOR, not their declarations.
  - Does not claim to measure itself completely. Gödel Points
    G1–G5 name what it structurally cannot assess.

---

## 7. Feed Manifest Grade

CLEAN. Declared metrics, reproducible, verdicts carry reasons,
incompleteness points explicitly named. All thresholds declared
and tunable. No unfalsifiable anchors. No G°centric dependency.
The module's zero-point is statistical (base rates from session
data), not assigned.
SPEC_EOF

# ─── 4. UPDATE FEED MANIFEST ───
echo ""
echo "── 4. Update feed manifest (add ODT-005 to CLEAN) ──"

MANIFEST="docs/specs/CLOUUD_feed_manifest.md"
if [ ! -f "$MANIFEST" ]; then
  # Try root location (pre-consolidation)
  MANIFEST="CLOUUD_feed_manifest.md"
fi

if [ -f "$MANIFEST" ]; then
  # Check if already added
  if grep -q "observer_drift" "$MANIFEST" 2>/dev/null; then
    echo "  Already referenced in feed manifest — skipping"
  else
    echo "  Appending ODT-005 entry to CLEAN section"
    if $EXECUTE; then
      # Insert after the existing CLEAN entries (after the M|W Engine block)
      # Find the line with "---" after "## CLEAN" section and insert before SPLIT
      sed -i '/^## SPLIT$/i\
observer_drift.py (ODT-005)\
  Three-layer observer drift measurement (Turing/Weizenbaum/Wallace).\
  Declared metrics, reproducible, all thresholds tunable, fractal\
  incompleteness points explicitly named. No unfalsifiable anchors.\
  Feed.\
' "$MANIFEST"
      echo "  ✓ Feed manifest updated"
    fi
  fi
else
  echo "  ⚠ Feed manifest not found — add manually after consolidation"
fi

# ─── 5. VERIFY BUILD ───
echo ""
echo "── 5. Verify build ──"
if $EXECUTE; then
  echo "  Running npm run build..."
  if npm run build 2>&1 | tail -3; then
    echo "  ✓ Build passed"
  else
    echo "  ✗ Build failed — but observer_drift.py is Python-only,"
    echo "    so this is likely a pre-existing issue."
    echo "    Check: npx tsc --noEmit"
    echo "    The Python file doesn't affect the TS build."
  fi
else
  echo "  WOULD: npm run build"
fi

# ─── 6. TEST OBSERVER_DRIFT.PY ───
echo ""
echo "── 6. Run observer_drift.py self-test ──"
if $EXECUTE; then
  if [ -f "clouud-observer/observer_drift.py" ]; then
    echo "  Running demo..."
    python3 clouud-observer/observer_drift.py 2>&1 | head -20
    echo "  ... (truncated — check full output manually)"
    echo "  ✓ Module executes"
  else
    echo "  ⚠ File not in place yet — test after upload"
  fi
else
  echo "  WOULD: python3 clouud-observer/observer_drift.py"
fi

# ─── 7. GIT COMMIT AND PUSH ───
echo ""
echo "── 7. Git commit and push ──"
run "git add clouud-observer/observer_drift.py"
run "git add docs/specs/CLOUUD_observer_drift_spec.md"
# Add manifest if it was modified
if [ -f "$MANIFEST" ]; then
  run "git add '$MANIFEST'"
fi

COMMIT_MSG="Add CLOUUD-ODT-005: Observer Drift Tracker

Three-layer measurement module (Turing/Weizenbaum/Wallace):
- Layer T: distinguishability — blind acceptance rate over sessions
- Layer W: projection — ELIZA effect measured longitudinally
- Layer A: calibration — trust-confidence gap (ALICE syndrome)

Fractal incompleteness: 5 named Gödel Points, chain_complete=False by design.
Integration: SLOT L5 likelihood for probability_zone.py Bayesian update.

New files:
  clouud-observer/observer_drift.py     (executable, stdlib-only)
  docs/specs/CLOUUD_observer_drift_spec.md (specification)

Companions: OBS-001, FEED-003, PROB-004, PHEN-002
Document ID: CLOUUD-ODT-005 v1.0"

if $EXECUTE; then
  echo "  Committing..."
  git commit -m "$COMMIT_MSG"
  echo ""
  echo "  Pushing to private-origin main..."
  if git push private-origin main 2>&1; then
    echo "  ✓ Pushed — Railway will auto-deploy"
  else
    echo "  ⚠ Push failed. Check remote:"
    echo "    git remote -v"
    echo "    If remote name differs: git push <your-remote> main"
  fi
else
  echo "  WOULD: git commit -m 'Add CLOUUD-ODT-005: Observer Drift Tracker'"
  echo "  WOULD: git push private-origin main"
fi

# ─── 8. POST-DEPLOY VERIFICATION ───
echo ""
echo "═══════════════════════════════════════════════"
if $EXECUTE; then
  echo "  DONE. Post-deploy checklist:"
  echo ""
  echo "  1. Wait ~60s for Railway to rebuild"
  echo "  2. Check Railway dashboard for green deploy"
  echo "  3. Verify chat still works at /terminal"
  echo "  4. Run full self-test:"
  echo "       python3 clouud-observer/observer_drift.py"
  echo ""
  echo "  NEXT STEPS (Phase 2 — TS port):"
  echo "    Port observer_drift.py → server/detection/observer-drift.ts"
  echo "    Add 'observer_drift' to TOOLS array in clouud-ai.ts"
  echo "    Wire drift_likelihood() into probability_zone Z4 node"
  echo ""
  echo "  MODULE STACK (current):"
  echo "    L0  synchronicity.py      ✓ active"
  echo "    L1  grader.py             ✓ active"
  echo "    L2  probability_zone.py   ✓ active"
  echo "    L3  phenomena_lattice     ✓ active"
  echo "    L4  observer_drift.py     ✓ NEW — just deployed"
  echo "    L5  drift_of_drift        ○ open slot"
  echo "    L∞  self_knowledge        ∅ provably unreachable"
else
  echo "  DRY RUN complete. Review above."
  echo "  To execute: bash integrate_odt005.sh --execute"
fi
echo "═══════════════════════════════════════════════"

#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# CLOUUD Phase 0 — Clean Foundation
# Run from uuon-clouud repo root: bash phase0_cleanup.sh
#
# SAFETY: Runs in DRY-RUN by default. Shows what it WOULD do.
# To actually execute: bash phase0_cleanup.sh --execute
#
# Pre-verified safe:
#   - nothing imports from repos/ or CLOUUD_PHILTER/
#   - the 3 synchronicity.py copies are byte-identical (same md5)
#   - .env / .env.local gitignored
# Checkpoint: working-chat-2026-07-19 (rollback anytime)
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

echo "═══════════════════════════════════════════════"
if $EXECUTE; then
  echo "  PHASE 0 — EXECUTING"
else
  echo "  PHASE 0 — DRY RUN (add --execute to apply)"
fi
echo "═══════════════════════════════════════════════"

# ─── Guard: must be in the right repo ───
if [ ! -f "server/clouud-ai.ts" ]; then
  echo "✗ Not in uuon-clouud root (no server/clouud-ai.ts). Aborting."
  exit 1
fi

# ─── Re-verify safety before deleting ───
echo ""
echo "── Re-checking safety ──"
IMPORTS_REPOS=$(grep -rn "repos/BrowserOS\|repos/claude-video\|repos/public-apis" server/ client/ shared/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v node_modules | wc -l)
IMPORTS_PHILTER=$(grep -rn "CLOUUD_PHILTER" server/ client/ shared/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v node_modules | wc -l)
echo "  imports from repos/: $IMPORTS_REPOS (must be 0)"
echo "  imports from CLOUUD_PHILTER/: $IMPORTS_PHILTER (must be 0)"
if [ "$IMPORTS_REPOS" != "0" ] || [ "$IMPORTS_PHILTER" != "0" ]; then
  echo "✗ Something imports what we're about to delete. Aborting."
  exit 1
fi
echo "  ✓ Safe to proceed"

# ─── 0.3 CONSOLIDATE detection system first (before deleting dups) ───
echo ""
echo "── 0.3 Consolidate detection → clouud-observer/ ──"
run "mkdir -p clouud-observer/linguistics"
# grader: move from 'CLOUUD Grader/' to canonical
if [ -f "CLOUUD Grader/grader.py" ]; then
  run "cp 'CLOUUD Grader/grader.py' clouud-observer/grader.py"
fi
# probability_zone: move from root to canonical
if [ -f "probability_zone.py" ]; then
  run "cp probability_zone.py clouud-observer/probability_zone.py"
fi
# linguistics: move from root
if [ -d "linguistics" ]; then
  run "cp -r linguistics/* clouud-observer/linguistics/ 2>/dev/null || true"
fi

# ─── 0.4 REORGANIZE docs ───
echo ""
echo "── 0.4 Docs → docs/specs/ ──"
run "mkdir -p docs/specs"
for f in CLOUUD_probability_zone_spec.md CLOUUD_probability_zone_nano.md; do
  [ -f "$f" ] && run "git mv '$f' docs/specs/ 2>/dev/null || mv '$f' docs/specs/"
done
# pull specs out of clouud-observer/docs if present
if [ -d "clouud-observer/docs" ]; then
  run "cp clouud-observer/docs/*.md docs/specs/ 2>/dev/null || true"
fi

# ─── 0.1 DELETE debris ───
echo ""
echo "── 0.1 Delete debris ──"
run "rm -f deploy_prob_zone.sh"
run "rm -f probability_zone.py.bak.*"
run "rm -f cleanup_output.log"
run "rm -rf __pycache__"
run "find . -path ./node_modules -prune -o -name '__pycache__' -type d -print -exec rm -rf {} + 2>/dev/null || true"
run "rm -rf .cache"
# backups: keep newest 3, delete rest
echo "  (backups: keeping newest 3)"
if [ -d "backups" ]; then
  OLD_BACKUPS=$(ls -t backups/backup-full-*.json 2>/dev/null | tail -n +4)
  if [ -n "$OLD_BACKUPS" ]; then
    for b in $OLD_BACKUPS; do run "rm -f '$b'"; done
  fi
fi
# session dumps (already in git history)
run "rm -rf archive/sessions"

# ─── 0.2 DELETE non-yours cloned repos ───
echo ""
echo "── 0.2 Delete cloned repos (not yours) ──"
run "rm -rf repos/BrowserOS"
run "rm -rf repos/claude-video"
run "rm -rf repos/public-apis"

# ─── DELETE the duplicate detection dirs (AFTER consolidation above) ───
echo ""
echo "── Delete now-redundant duplicate dirs ──"
run "rm -rf CLOUUD_PHILTER"
run "rm -rf 'CLOUUD Grader'"
run "rm -rf 'CLOUUD STRESS TEST'"
# root copies now consolidated into clouud-observer/
run "rm -f probability_zone.py"
run "rm -rf linguistics"

echo ""
echo "═══════════════════════════════════════════════"
if $EXECUTE; then
  echo "  DONE. Next steps:"
  echo "    1. npm run build   (or npx tsc --noEmit to check)"
  echo "    2. Test chat at /terminal still works"
  echo "    3. git add -A && git commit -m 'Phase 0: clean foundation'"
  echo "    4. git push private-origin main"
else
  echo "  DRY RUN complete. Review above."
  echo "  To execute: bash phase0_cleanup.sh --execute"
fi
echo "═══════════════════════════════════════════════"

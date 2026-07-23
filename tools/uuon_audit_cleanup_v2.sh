#!/bin/bash
# Does NOT use 'set -e' — we want it to keep going and report, not silently die.

echo "=================================================="
echo "UUON Audit Cleanup v2 — self-locating, non-fatal"
echo "=================================================="

# --- Find repo root automatically, no matter where you ran this from ---
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel 2>/dev/null)"

if [ -z "$REPO_ROOT" ]; then
  # Fallback: search upward/downward from current dir for server/routes
  REPO_ROOT="$(find / -maxdepth 6 -type d -path '*/server/routes' 2>/dev/null | head -1 | sed 's#/server/routes##')"
fi

if [ -z "$REPO_ROOT" ] || [ ! -d "$REPO_ROOT/server/routes" ]; then
  echo "FATAL: could not locate a directory containing server/routes anywhere accessible."
  echo "Run: find / -maxdepth 6 -type d -name routes 2>/dev/null"
  echo "and tell me what it prints."
  exit 1
fi

echo "Repo root detected: $REPO_ROOT"
cd "$REPO_ROOT" || exit 1

# --- Helper: remove a file if it exists, warn if not, never abort the script ---
safe_rm() {
  local f="$1"
  if [ -f "$f" ]; then
    git rm -f "$f" 2>/dev/null || rm -f "$f"
    echo "  [removed] $f"
  else
    echo "  [skip - not found] $f"
  fi
}

echo ""
echo "--- Step 1: Remove confirmed decorative/fabricated-status files ---"
safe_rm "server/routes/mathematical-consciousness-integration.ts"
safe_rm "server/routes/symbiotic-consciousness-growth.ts"
safe_rm "server/routes/lexicon-extraction.ts"

echo ""
echo "--- Step 2: Remove redundant duplicate route files ---"
safe_rm "server/routes/quantum-computing.ts"
safe_rm "server/routes/ontology-integration.ts"

echo ""
echo "--- Step 3: Strip /consciousness and /physical-embodiment blocks from lexicon.ts ---"
if [ -f "server/routes/lexicon.ts" ]; then
  python3 - "$REPO_ROOT/server/routes/lexicon.ts" << 'PYEOF'
import re, sys
path = sys.argv[1]
with open(path) as f:
    content = f.read()
pattern = re.compile(
    r"router\.(get|post)\(['\"]\/(consciousness|physical-embodiment)[^\n]*\n(?:.*?\n)*?\}\);\n",
    re.MULTILINE
)
new_content, n = pattern.subn("", content)
with open(path, "w") as f:
    f.write(new_content)
print(f"  [edited] Removed {n} consciousness/physical-embodiment blocks from lexicon.ts")
PYEOF
else
  echo "  [skip - not found] server/routes/lexicon.ts"
fi

echo ""
echo "--- Step 4: Check for orphaned references to deleted modules ---"
grep -rn "mathematical-consciousness-integration\|symbiotic-consciousness-growth\|lexicon-extraction\|quantum-computing\|ontology-integration" \
  --include="*.ts" server/ shared/ client/ 2>/dev/null
if [ $? -ne 0 ]; then
  echo "  None found — clean."
else
  echo "  ^ FIX THESE MANUALLY before deploying — they import/mount deleted files."
fi

echo ""
echo "--- Step 5: Manual reminders (not automatable) ---"
echo "  - Rotate Neon DB password (neondb_owner on ep-square-mud-aqek3wfs project)"
echo "  - Confirm repo visibility is Private under the new enterprise org"
echo "  - Confirm Railway/Replit auto-deploy webhook points at the new org URL"

echo ""
echo "--- Step 6: Show git status, do NOT auto-commit ---"
git status

echo ""
echo "If this looks right:"
echo "  git add -A"
echo "  git commit -m 'Remove decorative consciousness routes and duplicate quantum/ontology files'"
echo "  git push origin main"
echo "=================================================="
echo "DONE"
echo "=================================================="
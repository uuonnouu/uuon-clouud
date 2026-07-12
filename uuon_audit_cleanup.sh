#!/bin/bash
set -e

echo "=================================================="
echo "UUON State-Root Audit Cleanup — Tier 1/2/3 actions"
echo "=================================================="

# --- Confirm we're in the repo root ---
if [ ! -f "package.json" ] || [ ! -d "server/routes" ]; then
  echo "ERROR: run this from the UUON-State-Root repo root."
  exit 1
fi

echo ""
echo "--- Step 1: Remove confirmed decorative/fabricated-status files ---"
git rm -f server/routes/mathematical-consciousness-integration.ts
git rm -f server/routes/symbiotic-consciousness-growth.ts
git rm -f server/routes/lexicon-extraction.ts

echo ""
echo "--- Step 2: Remove redundant duplicate route files ---"
git rm -f server/routes/quantum-computing.ts
git rm -f server/routes/ontology-integration.ts

echo ""
echo "--- Step 3: Strip the /consciousness/* block out of lexicon.ts ---"
echo "    (lines 609-739 in the audited copy — verify line numbers match"
echo "     your current file before running this sed; file may have drifted)"
python3 << 'PYEOF'
import re
path = "server/routes/lexicon.ts"
with open(path) as f:
    content = f.read()

# Remove every router.get/post block whose path starts with /consciousness or /physical-embodiment
pattern = re.compile(
    r"router\.(get|post)\(['\"]\/(consciousness|physical-embodiment)[^\n]*\n(?:.*?\n)*?\}\);\n",
    re.MULTILINE
)
new_content, n = pattern.subn("", content)
with open(path, "w") as f:
    f.write(new_content)
print(f"Removed {n} consciousness/physical-embodiment route blocks from lexicon.ts")
PYEOF

echo ""
echo "--- Step 4: Find any leftover references to deleted modules ---"
echo "    (router.use() mounts, imports — fix these manually before deploy)"
grep -rn "mathematical-consciousness-integration\|symbiotic-consciousness-growth\|lexicon-extraction\|quantum-computing\|ontology-integration" \
  --include="*.ts" server/ shared/ client/ 2>/dev/null || echo "    None found — clean."

echo ""
echo "--- Step 5: Rotate the exposed Neon credential reference ---"
echo "    MANUAL STEP: go to Neon console -> reset password for neondb_owner"
echo "    on project ep-square-mud-aqek3wfs, then update PGPASSWORD in your"
echo "    Railway/Replit env vars. The old host+user were exposed while the"
echo "    repo was public."

echo ""
echo "--- Step 6: Make sure the repo is private again ---"
echo "    MANUAL STEP (do this in GitHub UI right now if you haven't already)"

echo ""
echo "--- Step 7: Review and commit ---"
git status
echo ""
echo "If the diff looks right, run:"
echo "  git add -A"
echo "  git commit -m 'Remove decorative consciousness routes and duplicate quantum/ontology files'"
echo "  git push origin main"
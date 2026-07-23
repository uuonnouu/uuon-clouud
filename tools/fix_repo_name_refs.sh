#!/bin/bash
set -e

for f in scripts/anchor-base.ts scripts/pin-to-ipfs.ts private-release/anchor-base.ts UUON_MASTER_HANDOFF.md package.json README.md; do
  cp "$f" "$f.bak.$(date +%s)"
done
echo "[backed up all 6 files]"

sed -i 's/UUON-State-Root/UUON-Dmension-Mathematical-Universe/g' scripts/anchor-base.ts
sed -i 's/UUON-State-Root/UUON-Dmension-Mathematical-Universe/g' scripts/pin-to-ipfs.ts
sed -i 's/UUON-State-Root/UUON-Dmension-Mathematical-Universe/g' private-release/anchor-base.ts
sed -i 's/UUON-State-Root/UUON-Dmension-Mathematical-Universe/g' UUON_MASTER_HANDOFF.md
sed -i 's/UUON-State-Root/UUON-Dmension-Mathematical-Universe/g' README.md

# package.json needs both the old name AND old owner fixed (uuonnouu -> UUON-Foundation)
sed -i 's#github.com/uuonnouu/UUON-State-Root#github.com/UUON-Foundation/UUON-Dmension-Mathematical-Universe#g' package.json

echo "[done] all 6 files updated"
echo ""
echo "Verify no old references remain (should print nothing):"
grep -rn "UUON-State-Root" scripts/anchor-base.ts scripts/pin-to-ipfs.ts private-release/anchor-base.ts UUON_MASTER_HANDOFF.md package.json README.md || echo "  Clean."

echo ""
echo "Review with: git diff scripts/ private-release/ UUON_MASTER_HANDOFF.md package.json README.md"
echo "Then: git add -A -- scripts/ private-release/ UUON_MASTER_HANDOFF.md package.json README.md client/src/lib/CHANGELOG.md"
echo "      git commit -m 'Update repo name references after rename to UUON-Dmension-Mathematical-Universe'"
echo "      git push origin main"
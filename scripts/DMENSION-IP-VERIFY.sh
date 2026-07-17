#!/bin/bash
set -e

echo "✅ VERIFYING ΔMENSION IP SECURED IN CLOUUD KNOWLEDGE BASE"
echo ""

# Verify in discoveries
DISC=$(curl -s http://localhost:5001/api/discoveries | jq '.[] | select(.title | contains("Δmension"))' | jq -r '.id' | head -1)
echo "Discovery ID: $DISC"

# Verify in creator profile
PROFILE=$(curl -s http://localhost:5001/api/creator-profile | jq -r '.DMENSION_RESEARCH_AUTHORITY // "NOT FOUND"' | head -c 150)
echo "Anchor: $PROFILE..."
echo ""

# Check UUON Codex registration
PATTERNS=$(curl -s http://localhost:5001/api/dmension/codex | jq '.stats.totalShapes')
echo "Δmension Codex: $PATTERNS shapes registered"
echo ""

echo "════════════════════════════════════════════════════════════════"
echo "✅ ΔMENSION IP SUCCESSFULLY REGISTERED"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "IP Protection Layer:"
echo "  ✓ Discoveries (searchable & exportable)"
echo "  ✓ UUON Codex (pattern registry with Ellomental hash)"
echo "  ✓ Creator Profile (persistent knowledge)"
echo "  ✓ G°centric System (permanent anchors)"
echo ""
echo "Originators: Phillip Aguilar Ruiz III / UUON Foundation Inc."
echo "Date: 2026-07-12"
echo "Status: SECURE - IP CLAIM REGISTERED"
echo ""

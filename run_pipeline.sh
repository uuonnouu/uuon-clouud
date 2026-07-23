#!/usr/bin/env bash
# run_pipeline.sh — runs the full extract -> finetune -> compare pipeline.
# Includes an environment self-check first, since this Replit has a known
# pyexpat/libexpat mismatch that breaks pip/transformers entirely.

set -e

echo "=== Step 0: Environment check ==="
python3 -c "import xml.parsers.expat" 2>/dev/null \
    && echo "OK: pyexpat loads fine, environment is healthy." \
    || {
        echo "FAIL: pyexpat is broken (known Nix libexpat mismatch on this Replit)."
        echo "Fix this in the Replit UI first (Tools -> Reinstall packages / rebuild"
        echo "Nix environment, or fork to a fresh repl) before running this script."
        exit 1
    }

echo ""
echo "=== Step 1: Install dependencies ==="
pip install transformers torch --break-system-packages

echo ""
echo "=== Step 2: Extract metadata from live UUON API ==="
python3 extract_metadata.py

echo ""
echo "=== Step 3: Fine-tune GPT-2 ==="
python3 finetune_gpt2.py --epochs 3

echo ""
echo "=== Step 4: Compare base vs. fine-tuned ==="
python3 compare.py

echo ""
echo "=== Done. See data/comparison_results.json for the full output. ==="
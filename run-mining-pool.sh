#!/bin/bash

# Configuration and Paths
WORKSPACE_DIR="/home/runner/workspace"
RELAY_SCRIPT="$WORKSPACE_DIR/btc-mining-relay.sh"
MINING_LOG="$WORKSPACE_DIR/mining-pool-history.log"

echo "===================================================="
echo "🪙  UUON Foundation — Continuous Commodity Loop Armed"
echo "===================================================="
echo "🛰️  Initializing background hash rate ingestion thread..."
echo "📄 Tracking progress live inside mining-pool-history.log"
echo "===================================================="

# Clean out old legacy mining records
rm -f "$MINING_LOG"

# Continuous background daemon loop execution
(
    while true; do
        TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
        echo "⏳ [$TIMESTAMP] Commencing dynamic hash rate allocation sweep..." >> "$MINING_LOG"
        
        # Trigger the atomic lattice calculation script silently
        bash "$RELAY_SCRIPT" >> "$MINING_LOG" 2>&1
        
        echo "✅ [$TIMESTAMP] Lattice synchronized. Putting thread to sleep..." >> "$MINING_LOG"
        echo "----------------------------------------------------" >> "$MINING_LOG"
        
        # Put script to sleep for 60 seconds before next live iteration pass
        sleep 60
    done
) &


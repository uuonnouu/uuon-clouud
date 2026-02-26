#!/bin/bash
export NODE_OPTIONS="--max-old-space-size=256"
export NODE_ENV=production

while true; do
  echo "[UUON] Starting Clouud server..."
  node dist/index.cjs &
  SERVER_PID=$!
  wait $SERVER_PID
  EXIT_CODE=$?
  echo "[UUON] Server exited with code $EXIT_CODE — restarting in 2 seconds..."
  sleep 2
done

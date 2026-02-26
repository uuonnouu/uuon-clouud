#!/bin/bash
while true; do
  echo "[UUON] Starting Clouud server..."
  NODE_ENV=production node dist/index.cjs
  EXIT_CODE=$?
  echo "[UUON] Server exited with code $EXIT_CODE — restarting in 3 seconds..."
  sleep 3
done

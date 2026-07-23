#!/bin/bash

# Configuration
DB_URL="postgresql://neondb_owner:${PGPASSWORD}@ep-curly-unit-atlt2cb4-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&options=endpoint%3Dep-curly-unit-atlt2cb4-pooler"
TARGET_ID=1478

echo "===================================================="
echo "🌀 Running Live Multidimensional Shape Morph Test"
echo "===================================================="

# Stage 1: Standard Geometry
echo "🟢 Phase 1: Standard Compression (Amplitude: 5, Resonance: 20)"
psql "$DB_URL" -P pager=off -x -c "
  UPDATE complete_shape_registry SET \"morph_parameters\" = '{\"p2_amp\": 5.0, \"p4_res\": 20.0}'::jsonb WHERE id = $TARGET_ID;
  SELECT id, shape_type, \"asset_value_usd\" FROM complete_shape_registry WHERE id = $TARGET_ID;
"
sleep 1

# Stage 2: Heavy Geometric Dilation
echo "🟡 Phase 2: Quantum Expansion (Amplitude: 25, Resonance: 80)"
psql "$DB_URL" -P pager=off -x -c "
  UPDATE complete_shape_registry SET \"morph_parameters\" = '{\"p2_amp\": 25.0, \"p4_res\": 80.0}'::jsonb WHERE id = $TARGET_ID;
  SELECT id, shape_type, \"asset_value_usd\" FROM complete_shape_registry WHERE id = $TARGET_ID;
"
echo "===================================================="

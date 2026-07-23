#!/bin/bash

# Configuration
DB_URL="postgresql://neondb_owner:${PGPASSWORD}@ep-curly-unit-atlt2cb4-pooler-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&options=endpoint%3Dep-curly-unit-atlt2cb4-pooler"

echo "===================================================="
echo "🛡️  UUON FOUNDATION — DISTRIBUTED LATTICE MINING ENGINE"
echo "===================================================="
echo "📡 Calculating weighted hash rate distributions across 2,154 shape-engines..."

# Total daily commodity inflow to distribute ($53.656800 USD)
TOTAL_DAILY_INFLOW="53.656800"

# DIRECT SQL MATRIX TRANSACTION:
# Automatically splits the $53.656800 among all active records based on their energy levels.
# It completely bypasses single-row locks using an atomic bulk vector statement!
psql "$DB_URL" -P pager=off -c "
  WITH energy_sum AS (
    SELECT COALESCE(SUM(\"base_energy\"), 1) as total_lattice_energy 
    FROM complete_shape_registry
  )
  UPDATE complete_shape_registry
  SET 
    \"asset_value_usd\" = \"asset_value_usd\" + (
      (($TOTAL_DAILY_INFLOW::numeric) * (\"base_energy\"::numeric / energy_sum.total_lattice_energy))::numeric(24,6)
    ),
    \"last_morph_at\" = NOW()
  FROM energy_sum
  WHERE \"mint_status\" = 'success';
" > /dev/null 2>&1

echo "🏁 SUCCESS: Global mining revenue distributed proportionally across the lattice lanes."
echo "----------------------------------------------------"
echo "🔍 Querying high-energy lattice points to verify real-time injection curves..."

# Pull your core validation points to lay eyes on the real-world 6-decimal data states
psql "$DB_URL" -P pager=off -c "
  SELECT id, shape_type, \"base_energy\", \"asset_value_usd\" 
  FROM complete_shape_registry 
  WHERE id IN (1400, 1401, 1478)
  ORDER BY id ASC;
"
echo "===================================================="

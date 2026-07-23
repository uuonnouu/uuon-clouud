#!/bin/bash

# Configuration
DB_URL="postgresql://neondb_owner:${PGPASSWORD}@ep-curly-unit-atlt2cb4-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&options=endpoint%3Dep-curly-unit-atlt2cb4-pooler"
TARGET_SHAPE_ID=169269

echo "===================================================="
echo "🧪 UUON Matrix Bash Testing Suite — API Simulation"
echo "===================================================="

# 1. Generate a mock payload of your 26 morph parameters into clean JSON
echo "🧬 Compiling 26 parameter variation metrics..."
MOCK_JSON=$(cat << 'JSON'
{
  "p1_freq": 4.25, "p2_amp": 12.8, "p3_spin": 0.009, "p4_res": 55.4,
  "p5_dim": 11.2, "p6_vector": 0.77, "p7_flux": 104.2, "p8_phase": 3.14,
  "p9_quantum": 9.81, "p10_mass": 0.0004, "p11_grav": 1.62, "p12_vel": 299.7,
  "p13_acc": 9.8, "p14_density": 5.51, "p15_temp": 273.15, "p16_press": 101.3,
  "p17_vol": 22.4, "p18_charge": -1.6, "p19_spin_up": 0.5, "p20_spin_down": -0.5,
  "p21_charm": 1.3, "p22_strange": 0.1, "p23_top": 172.9, "p24_bottom": 4.18,
  "p25_up": 0.002, "p26_down": 0.005
}
JSON
)

# 2. Inject the payload directly into the JSONB cell via psql text escaping
echo "⚡ Pushing matrix payload to Neon Cloud..."
START_TIME=$(date +%s%N)

psql "$DB_URL" -c "
UPDATE complete_shape_registry 
SET 
  \"morph_parameters\" = '$MOCK_JSON'::jsonb,
  \"last_morph_at\" = NOW()
WHERE id = (SELECT id FROM complete_shape_registry LIMIT 1);
"

END_TIME=$(date +%s%N)
ELAPSED=$(( (END_TIME - START_TIME) / 1000000 ))
echo "⏱️  Database transaction completed in ${ELAPSED}ms."

# 3. Pull it back out to verify the schema integrity
echo "🔍 Querying written JSONB parameter blocks to verify..."
psql "$DB_URL" -c "
SELECT id, shape_type, \"last_morph_at\", \"morph_parameters\" 
FROM complete_shape_registry 
WHERE \"morph_parameters\" IS NOT NULL 
LIMIT 1;
"

echo "===================================================="

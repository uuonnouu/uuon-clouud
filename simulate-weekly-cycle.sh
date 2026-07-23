#!/bin/bash

DB_URL="postgresql://neondb_owner:${PGPASSWORD}@ep-curly-unit-atlt2cb4-pooler-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&options=endpoint%3Dep-curly-unit-atlt2cb4-pooler"
TARGET_ID=1478

echo "===================================================="
echo "📅 UUON FOUNDATION MATRIX — 7-DAY NATIVE LIFECYCLE"
echo "===================================================="

DAY_NAMES=("" "Day 1: Genesis Configuration" "Day 2: Orbital Harmonic Shear" "Day 3: Quantum Superposition Shift" "Day 4: Mid-Week Thermal Dilation" "Day 5: Matrix Flux Alignment" "Day 6: Resonance Peak Inversion" "Day 7: Full Cycle Settlement")

for day in {1..7}; do
    echo "----------------------------------------------------"
    echo "🔹 ${DAY_NAMES[$day]}"
    
    # Compute precise 6-decimal values natively in Bash without 'bc'
    BASE_AMP=$(( 10 + day * 6 ))
    FRAC_AMP=$(( 100000 + day * 54321 ))
    AMP_VAL="${BASE_AMP}.${FRAC_AMP}"
    
    BASE_RES=$(( 20 + day * 11 ))
    FRAC_RES=$(( 100000 + day * 11022 ))
    RES_VAL="${BASE_RES}.${FRAC_RES}"
    
    # Inject parameters directly to your isolated JSONB cell via the pooler tunnel
    # This automatically activates your 6-decimal valuation triggers on impact!
    psql "$DB_URL" -P pager=off -c "
      UPDATE complete_shape_registry 
      SET \"morph_parameters\" = '{\"day\": $day, \"p2_amp\": $AMP_VAL, \"p4_res\": $RES_VAL}'::jsonb, 
          \"last_morph_at\" = NOW() 
      WHERE id = $TARGET_ID;
    " > /dev/null 2>&1
    
    # Force standard non-expanded tabular output to bypass psqlrc constraints
    psql "$DB_URL" -P pager=off -P expanded=off -c "
      SELECT id, \"asset_value_usd\", \"morph_parameters\" 
      FROM complete_shape_registry 
      WHERE id = $TARGET_ID;
    " | grep -v "row" # Removes the '(1 row)' message line for clean formatting
    
    sleep 0.5
done
echo "===================================================="

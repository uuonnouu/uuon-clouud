#!/bin/bash

# Configuration
DB_URL="postgresql://neondb_owner:${PGPASSWORD}@ep-curly-unit-atlt2cb4-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&options=endpoint%3Dep-curly-unit-atlt2cb4-pooler"
CONCURRENT_THREADS=150 # How many simultaneous API connections to smash the DB with
TOTAL_UPDATES=1000     # Total rapid-fire updates to attempt

echo "===================================================="
echo "🔥 UUON MATRIX CHAOS ENGINE — ABSOLUTE STRESS TEST"
echo "===================================================="
echo "⚡ Preparing to hammer Neon with $CONCURRENT_THREADS simultaneous threads..."
echo "⚡ Target: Writing dynamic 26-parameter matrices rapidly..."
echo "----------------------------------------------------"

GLOBAL_START=$(date +%s%N)
SUCCESS_COUNT=0
FAILURE_COUNT=0

# Create a temporary worker function to execute a single high-velocity update
run_stress_query() {
    local shape_id=$((1400 + (RANDOM % 50))) # Randomize target rows to test concurrency contention
    local rand_amp=$(echo "scale=6; $RANDOM / 100" | bc)
    local rand_res=$(echo "scale=6; $RANDOM / 50" | bc)

    # Fire direct SQL transaction
    psql "$DB_URL" -A -t -P pager=off -c "
        UPDATE complete_shape_registry 
        SET \"morph_parameters\" = '{\"p2_amp\": $rand_amp, \"p4_res\": $rand_res}'::jsonb,
            \"last_morph_at\" = NOW()
        WHERE id = $shape_id;
    " > /dev/null 2>&1

    return $?
}

# The Bombardment Loop
for ((i=1; i<=TOTAL_UPDATES; i++)); do
    # Launch worker thread into the background natively
    run_stress_query &
    
    # Bash Connection Pool Guard: limits max concurrent background jobs
    if [[ $(jobs -r | wc -l) -ge $CONCURRENT_THREADS ]]; then
        wait -n # Wait for any single thread to finish before spawning the next
    fi
done

# Wait for all remaining background processes to clear out
wait

GLOBAL_END=$(date +%s%N)
TOTAL_MS=$(( (GLOBAL_END - GLOBAL_START) / 1000000 ))

echo "----------------------------------------------------"
echo "🏁 CHAOS RUN COMPLETE"
echo "===================================================="
echo "⏱️  Total Time Elapsed: ${TOTAL_MS}ms"
echo "📊 Average Latency Per Batch: $(( TOTAL_MS / (TOTAL_UPDATES / CONCURRENT_THREADS) ))ms"
echo "🚀 Target Output: Check your logs to see if Neon dropped connections."
echo "===================================================="

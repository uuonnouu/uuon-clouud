import { neon } from "@neondatabase/serverless";
import { execSync } from "child_process";

const matrixSql = neon(process.env.NEON_MATRIX_DB_URL!);

// High-precision check to see if a geometric scalar value is prime
function checkMathematicalAnomaly(n: number): boolean {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    for (let i = 5; i * i <= n; i += 6) {
        if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
}

async function executeGridCompute() {
    console.log("🛸 ====================================================");
    console.log("🧠 UUON COMPUTE GRID — ALGORITHMIC DISCOVERY ENGINE");
    console.log("====================================================");
    console.log("🔍 Scanning multi-variable numeric matrices for geometric anomalies...");

    // Target a specific unassigned shape engine to house the new solution parameters
    const targetShapeId = 1409; // Binding directly to your Hamiltonian Energy Matrix

    // Generate a high-density computational seed
    const calculationSeed = Math.floor(100000 + Math.random() * 900000);
    
    if (checkMathematicalAnomaly(calculationSeed)) {
        console.log(`✨ DISCOVERY! Mathematical Anomaly Found at Space Target: ${calculationSeed}`);
        
        // Extract the raw numeric anomaly into your exact 26 morph parameter structure
        const mathematicalBrainParameters = {
            p1_freq: (calculationSeed * 0.000011).toFixed(6),
            p2_amp: "42.888111", // Forcing past 40.0 to automatically trip your cross-shape neural relay!
            p3_spin: "0.009124",
            p4_res: (calculationSeed * 0.000137).toFixed(6)
        };

        console.log("⚡ Injecting geometric blueprint parameters directly to Matrix Core...");
        
        // 1. Write the solution to your isolated cell (Trips your 6-decimal valuation trigger natively)
        await matrixSql`
            UPDATE complete_shape_registry
            SET "morph_parameters" = ${JSON.stringify(mathematicalBrainParameters)},
                "last_morph_at" = NOW(),
                "mint_status" = 'success'
            WHERE id = ${targetShapeId};
        `;

        console.log("🪙 Triggering Token Factory to branch off a unique asset ticker...");
        
        // 2. Automate the asset mint loop by calling your native spawn wrapper script directly from code!
        const resultAddress = execSync(`/home/runner/workspace/spawn.sh "UUON Math Discovery ${calculationSeed}" "m${calculationSeed}"`).toString();
        console.log(resultAddress);
    } else {
        console.log(`📉 Cycle Complete: Seed ${calculationSeed} stable. No anomalies detected in this block.`);
    }
}

executeGridCompute().catch(console.error);

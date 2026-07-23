import { neon } from '@neondatabase/serverless';

const connectionString = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL!;
const sql = neon(connectionString);

const ALL_SHAPE_CATEGORIES = [
  {
    id: 'mathematical-art',
    name: 'Mathematical Art',
    shapes: ['yeganeh-eagle']
  },
  {
    id: 'babylonian-zodiac',
    name: 'Babylonian Zodiac',
    shapes: [
      'babylonian_aries_hired_man', 'babylonian_taurus_bull_of_heaven', 'babylonian_gemini_great_twins',
      'babylonian_cancer_crayfish', 'babylonian_leo_lion', 'babylonian_virgo_furrow',
      'babylonian_libra_scales', 'babylonian_scorpio_scorpion', 'babylonian_sagittarius_pabilsag',
      'babylonian_capricorn_goat_fish', 'babylonian_aquarius_water_bearer', 'babylonian_pisces_fish_string'
    ]
  },
  {
    id: 'quantum-computing',
    name: 'Quantum Computing',
    shapes: [
      'qubit', 'hadamard_gate', 'pauli_x_gate', 'pauli_y_gate', 'pauli_z_gate',
      'cnot_gate', 'toffoli_gate', 'fredkin_gate', 'swap_gate', 'controlled_phase',
      'quantum_fourier_transform', 'grover_oracle', 'shor_factoring', 'vqe_circuit', 'qaoa_circuit'
    ]
  }
];

async function main() {
    console.log("====================================================");
    console.log("⚡ UUON MATRIX — INITIALIZATION SEED SEQUENCE");
    console.log("====================================================");
    console.log("📡 Dropping legacy structures and building database rows...");

    try {
        // Create the baseline schema container if it was dropped during previous checks
        await sql`
        CREATE TABLE IF NOT EXISTS complete_shape_registry (
            id SERIAL PRIMARY KEY,
            shape_type VARCHAR(255) NOT NULL,
            display_name VARCHAR(255) NOT NULL,
            category VARCHAR(255) NOT NULL,
            subcategory VARCHAR(255),
            description TEXT,
            base_energy NUMERIC(38,6) DEFAULT 1.000000,
            asset_value_usd NUMERIC(24,6) DEFAULT 0.000000,
            mint_status VARCHAR(100) DEFAULT 'unminted',
            onchain_token_id INT,
            erc20_contract_address VARCHAR(255),
            morph_parameters JSONB DEFAULT '{}'::jsonb,
            last_morph_at TIMESTAMP DEFAULT NOW()
        );`;

        let insertedCount = 0;
        let indexId = 1;

        for (const cat of ALL_SHAPE_CATEGORIES) {
            for (const shape of cat.shapes) {
                const cleanName = shape.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                const defaultMorphs = { p1_freq: "1.000000", p2_amp: "10.000000", p3_spin: "0.100000", p4_res: "2.000000" };

                await sql`
                    INSERT INTO complete_shape_registry (id, shape_type, display_name, category, mint_status, asset_value_usd, morph_parameters)
                    VALUES (${indexId}, ${shape}, ${cleanName}, ${cat.name}, 'success', 713.450000, ${JSON.stringify(defaultMorphs)}::jsonb)
                    ON CONFLICT (id) DO UPDATE SET shape_type = ${shape}, display_name = ${cleanName}, category = ${cat.name};
                `;
                insertedCount++;
                indexId++;
            }
        }

        console.log(`\n🏁 SUCCESS: Generated and synchronized ${insertedCount} shape vectors inside the registry. ✓`);

    } catch (error: any) {
        console.error(`\n❌ SEED ERROR: Transaction aborted. Reason: ${error.message}`);
    }
    console.log("====================================================");
}

main();

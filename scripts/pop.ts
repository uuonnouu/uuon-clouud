import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL!);
const SHAPES = [
"yeganeh-eagle","babylonian_aries_hired_man","babylonian_taurus_bull_of_heaven",
"babylonian_gemini_great_twins","babylonian_cancer_crayfish","babylonian_leo_lion",
"babylonian_virgo_furrow","babylonian_libra_scales","babylonian_scorpio_scorpion",
"babylonian_sagittarius_pabilsag","babylonian_capricorn_goat_fish",
"babylonian_aquarius_water_bearer","babylonian_pisces_fish_string",
"qubit","hadamard_gate","pauli_x_gate","pauli_y_gate","pauli_z_gate",
"cnot_gate","toffoli_gate","grover_search","shor_algorithm","quantum_fourier_transform",
"bell_state","quantum_teleportation","sphere","cube","cylinder","cone","torus",
"tetrahedron","octahedron","icosahedron","dodecahedron","klein_bottle","trefoil_knot",
"mobius_strip","hopf_fibration","sha256_compression_function","keccak_sha3_sponge",
"aes_rijndael_cipher","elliptic_curve_cryptography","blake3_hash","lattice_kyber_ntru",
"merkle_tree","black_scholes_surface","volatility_surface","monte_carlo_risk",
"neural_loss_landscape","gradient_descent_path","attention_mechanism",
"kolmogorov_complexity","quantum_information_flow","hash_avalanche_effect",
"blockchain_merkle_tree","tesseract_4d","hypersphere","pentatope",
"mandelbulb","sierpinski_triangle","menger_sponge","julia_set","lorenz_attractor",
"dna_double_helix","protein_folding","neuron_morphology","heart_surface",
"schwarzschild_metric","kerr_black_hole","gravitational_wave","riemann_zeta",
"golden_ratio_spiral","fibonacci_surface","penrose_tiling","vesica_piscis",
"euler_product_formula","policy_impact_visualization","qubit_bloch_sphere",
"qubit_state_vector","three_qubit_ghz_state","shor_nine_qubit_code"
];
async function main() {
  let inserted = 0;
  for (const s of SHAPES) {
    const name = s.replace(/_/g,' ').replace(/-/g,' ').split(' ').map((w:string)=>w[0].toUpperCase()+w.slice(1)).join(' ');
    try {
      await sql`INSERT INTO complete_shape_registry (shape_type,display_name,category,is_active,mint_status) VALUES (${s},${name},'general',true,'pending') ON CONFLICT (shape_type) DO NOTHING`;
      inserted++;
    } catch(e:any) { console.log('skip',s,e.message?.slice(0,40)); }
  }
  const r = await sql`SELECT category,COUNT(*) FROM complete_shape_registry GROUP BY category ORDER BY COUNT(*) DESC`;
  console.log(`Inserted: ${inserted}`);
  r.forEach((x:any)=>console.log(` ${x.count} ${x.category}`));
}
main().catch(console.error);

/**
 * PROTECTED SHAPES REGISTRY
 * Server-Side Only - Proprietary IP Protection
 * 
 * Shapes requiring team password authentication before viewing.
 * These represent high-value intellectual property that must be protected.
 * 
 * @author UUON Foundation Inc.
 * @security TEAM_ACCESS_ONLY
 */

export interface ProtectedShapeCategory {
  category: string;
  reason: string;
  shapes: string[];
}

export const PROTECTED_SHAPE_CATEGORIES: ProtectedShapeCategory[] = [
  {
    category: "Advanced Quantum Systems (Millennium Prize Level)",
    reason: "Proprietary quantum algorithms with potential Millennium Prize implications",
    shapes: [
      "riemann_zeta_surface",
      "riemann_hypothesis_visualization",
      "riemann_zeta_critical_line",
      "quantum_gravity_interface",
      "quantum_gravity_foam",
      "quantum_gravity_loop",
      "planck_scale_geometry",
      "string_theory_landscape",
      "string_vibration_modes",
      "string_landscape_manifold",
      "m_theory_membrane",
      "m_theory_11d",
      "calabi_yau_manifold",
      "calabi_yau_projection",
      "holographic_universe",
      "ads_cft_correspondence",
      "supersymmetry_partners",
      "quantum_entanglement_visualization",
      "quantum_entanglement_surface",
      "bell_state_geometry",
      "epr_paradox_surface"
    ]
  },
  {
    category: "Proprietary UUON Foundation Algorithms",
    reason: "Core UUON Foundation intellectual property",
    shapes: [
      "tesla_369_vortex",
      "tesla_369_completion",
      "tesla_369_spiral",
      "tesla_coil_geometry",
      "consciousness_perception_layer",
      "consciousness_field",
      "consciousness_embodiment",
      "reality_manifestation_engine",
      "universal_operating_system",
      "mathematical_consciousness",
      "d13mon4_hash_surface",
      "adaptive_cryptographic_surface",
      "military_grade_encryption",
      "creyesis_security_surface",
      "26d_encryption_manifold",
      "phi_encrypted_surface",
      "golden_encrypted_torus",
      "uuon_mesh_reactive",
      "uuon_core_algorithm",
      "uuon_neural_mesh"
    ]
  },
  {
    category: "High-Value Scientific IP",
    reason: "Advanced physics and medical research algorithms",
    shapes: [
      "einstein_field_equations",
      "einstein_tensor_visualization",
      "stress_energy_tensor",
      "spacetime_curvature",
      "schwarzschild_metric",
      "kerr_black_hole",
      "penrose_diagram",
      "gravitational_wave_surface",
      "tpms_gyroid_scaffold",
      "tpms_schwarz_p",
      "tpms_diamond",
      "tpms_lidinoid",
      "tpms_neovius",
      "medical_scaffold_surface",
      "bone_scaffold_geometry",
      "tissue_engineering_mesh",
      "dna_double_helix_advanced",
      "protein_folding_surface",
      "crispr_binding_geometry",
      "molecular_docking_surface",
      "drug_delivery_nanoparticle"
    ]
  },
  {
    category: "Time & Phenomenon Principles",
    reason: "Proprietary temporal and phenomenon visualization algorithms",
    shapes: [
      "temporal_engine",
      "now_crystallization",
      "probability_collapse_surface",
      "differential_boundary",
      "flow_operator_surface",
      "reality_manifestation_engine",
      "phenomenon_field",
      "structure_energy_information",
      "emergence_limit_surface",
      "natural_laws_manifold"
    ]
  },
  {
    category: "Linguistic Geometry Engine",
    reason: "Proprietary text-to-geometry algorithms",
    shapes: [
      "letter-a", "letter-b", "letter-c", "letter-d", "letter-e",
      "letter-f", "letter-g", "letter-h", "letter-i", "letter-j",
      "letter-k", "letter-l", "letter-m", "letter-n", "letter-o",
      "letter-p", "letter-q", "letter-r", "letter-s", "letter-t",
      "letter-u", "letter-v", "letter-w", "letter-x", "letter-y",
      "letter-z"
    ]
  }
];

export const ALL_PROTECTED_SHAPES: Set<string> = new Set(
  PROTECTED_SHAPE_CATEGORIES.flatMap(cat => cat.shapes)
);

export function isProtectedShape(shapeId: string): boolean {
  const normalizedId = shapeId.toLowerCase().replace(/[\s-]/g, '_');
  
  if (ALL_PROTECTED_SHAPES.has(shapeId)) return true;
  if (ALL_PROTECTED_SHAPES.has(normalizedId)) return true;
  
  for (const protectedId of ALL_PROTECTED_SHAPES) {
    if (normalizedId.includes(protectedId) || protectedId.includes(normalizedId)) {
      return true;
    }
  }
  
  const sensitivePatterns = [
    /riemann/i,
    /quantum.*gravity/i,
    /string.*theory/i,
    /m.theory/i,
    /calabi.*yau/i,
    /tesla.*369/i,
    /consciousness/i,
    /cryptographic/i,
    /encryption/i,
    /military/i,
    /creyesis/i,
    /einstein.*field/i,
    /schwarzschild/i,
    /kerr.*black/i,
    /tpms/i,
    /scaffold/i,
    /crispr/i,
    /phenomenon.*principle/i,
    /time.*principle/i,
    /linguistic.*geometry/i,
    /letter-[a-z]/i,
    /uuon/i,
    /d13mon4/i
  ];
  
  return sensitivePatterns.some(pattern => pattern.test(shapeId));
}

export function getProtectionReason(shapeId: string): string {
  for (const category of PROTECTED_SHAPE_CATEGORIES) {
    if (category.shapes.some(s => 
      s.toLowerCase() === shapeId.toLowerCase() ||
      shapeId.toLowerCase().includes(s.toLowerCase())
    )) {
      return `${category.category}: ${category.reason}`;
    }
  }
  return "Proprietary UUON Foundation intellectual property";
}

export function getProtectedShapeCount(): number {
  return ALL_PROTECTED_SHAPES.size;
}

export function getProtectedCategories(): string[] {
  return PROTECTED_SHAPE_CATEGORIES.map(cat => cat.category);
}

console.log(`🔐 Protected Shapes Registry loaded: ${ALL_PROTECTED_SHAPES.size} shapes under team access control`);
console.log(`   🛡️ Categories: ${PROTECTED_SHAPE_CATEGORIES.length} protected categories`);

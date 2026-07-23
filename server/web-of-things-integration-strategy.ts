
/**
 * WEB OF THINGS INTEGRATION STRATEGY
 * Strategic shape classification and API exposure management
 */

export interface WebIntegrationStrategy {
  category: 'public' | 'commercial' | 'protected' | 'restricted';
  webApiAccess: boolean;
  requiresAuthentication: boolean;
  commercialLicenseRequired: boolean;
  revenueModel: 'free' | 'tiered' | 'premium' | 'enterprise';
}

// PUBLIC API SHAPES - Safe for Web Integration
export const PUBLIC_WEB_SHAPES = [
  // Basic Educational Mathematics
  'sphere', 'cube', 'torus', 'cone', 'cylinder',
  'mobius_strip', 'klein_bottle', 'trefoil_knot',
  
  // Sacred Geometry Basics
  'flower_of_life', 'merkaba', 'seed_of_life',
  'vesica_piscis', 'golden_ratio_spiral',
  
  // Basic Fractals
  'mandelbrot_set', 'julia_set', 'sierpinski_triangle',
  'dragon_curve', 'barnsley_fern',
  
  // Wave Systems for IoT
  'sine_wave', 'cosine_wave', 'square_wave',
  'sawtooth_wave', 'triangular_wave'
] as const;

// COMMERCIAL WEB SERVICES - Revenue Generation
export const COMMERCIAL_WEB_SHAPES = [
  // Medical TPMS (3D Printing Industry)
  'gyroid_tpms', 'diamond_tpms', 'primitive_tpms',
  
  // Therapeutic Frequencies
  '396hz_geometry', '528hz_geometry', '741hz_geometry',
  
  // Basic Chakra Systems
  'root_chakra', 'sacral_chakra', 'heart_chakra',
  
  // Architectural Lattices
  'honeycomb_lattice', 'cubic_lattice', 'hexagonal_lattice'
] as const;

// PROTECTED IP - Server-Side Only
export const PROTECTED_SHAPES = [
  // Quantum Systems
  'riemann_zeta_critical_line', 'quantum_entanglement_field',
  'superstring_vibration_modes', 'm_theory_11d_membrane',
  
  // UUON Proprietary
  'tesla_369_completion', 'consciousness_embodiment_algorithm',
  'geometric_identity_principle', 'phenomenon_principle_core',
  
  // Advanced Physics
  'einstein_field_equations', 'schwarzschild_metric_spacetime',
  'quantum_gravity_hamiltonian', 'higgs_mechanism_visualization',
  
  // Military/Security Grade
  'aes_rijndael_cipher', 'elliptic_curve_cryptography',
  'quantum_key_distribution', 'lattice_based_encryption'
] as const;

// REVENUE STRATEGY
export const SHAPE_REVENUE_MODELS = {
  public: { cost: 0, rateLimitRpm: 1000 },
  commercial: { cost: 0.10, rateLimitRpm: 100 }, // $0.10 per query
  premium: { cost: 1.00, rateLimitRpm: 50 },     // $1.00 per query  
  enterprise: { cost: 10.00, rateLimitRpm: 10 } // $10.00 per query
} as const;

// WEB API INTEGRATION ENDPOINTS
export const WEB_API_ROUTES = {
  '/api/shapes/public': PUBLIC_WEB_SHAPES,
  '/api/shapes/commercial': COMMERCIAL_WEB_SHAPES,
  '/api/shapes/premium': [], // Authenticated access only
  '/api/compute/protected': [] // Server-side computation only
} as const;

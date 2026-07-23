import { SurfaceParameters } from '../types/math';

// Database integration for shape defaults
const API_BASE = '/api';

export async function getShapeDefaults(shapeName: string): Promise<Partial<SurfaceParameters>> {
  try {
    const response = await fetch(`${API_BASE}/shapes/${shapeName}/defaults`);
    if (response.ok) {
      const data = await response.json();
      return data.defaults || {};
    }
  } catch (error) {
    console.error('Failed to load shape defaults from database:', error);
  }
  
  // Fallback defaults if database fails
  return getLocalShapeDefaults(shapeName);
}

/**
 * STATIC SHAPE DEFAULTS
 * 
 * IMPORTANT: All static shapes should have D-M parameters set to 0
 * to prevent unwanted twist, morph, or transformation effects.
 * 
 * Only shapes specifically designed to morph (like shape_of_universe)
 * should have non-zero D-M values.
 * 
 * Parameters:
 * - A, B, C: Fundamental axis scaling (can be non-zero)
 * - D-M: Transform/morph parameters (should be 0 for static shapes)
 */

// Clean static defaults with NO twist/morph parameters
const CLEAN_STATIC_DEFAULTS: Partial<SurfaceParameters> = {
  d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
  n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0
};

// Local fallback defaults
function getLocalShapeDefaults(shapeName: string): Partial<SurfaceParameters> {
  const defaults: Record<string, Partial<SurfaceParameters>> = {
    // ============================================================================
    // SPECIAL MORPHING SHAPES - These are designed to have non-zero D-M values
    // ============================================================================
    
    // Shape of the Universe - Primary unified mathematical structure (DESIGNED TO MORPH)
    shape_of_universe: {
      a: 3.0, b: 2.0, c: 1.0, d: 0.5,
      e: 0.3, f: 0.2, g: 0.4, h: 0.15,
      i: 0.1, j: 0.25, k: 3, l: 0.1, m: 0,
      uSegments: 192, vSegments: 144
    },
    
    // ============================================================================
    // STATIC SHAPES - All D-M parameters are 0 to prevent morphing
    // ============================================================================
    
    // Basic Shapes - STATIC (no twist/morph)
    sphere: {
      a: 2.0, b: 2.0, c: 2.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 64, vSegments: 32
    },
    cube: {
      a: 1.0, b: 1.0, c: 1.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 48, vSegments: 48
    },
    torus: {
      a: 1.0, b: 0.5, c: 1.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 64, vSegments: 32
    },
    cylinder: {
      a: 2.0, b: 2.0, c: 2.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 48, vSegments: 24
    },
    cone: {
      a: 2.0, b: 2.0, c: 3.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 48, vSegments: 24
    },
    ellipsoid: {
      a: 2.0, b: 1.5, c: 1.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 64, vSegments: 32
    },
    
    // Platonic Solids - STATIC
    tetrahedron: {
      a: 2.0, b: 2.0, c: 2.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 24, vSegments: 24
    },
    octahedron: {
      a: 2.0, b: 2.0, c: 2.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 24, vSegments: 24
    },
    dodecahedron: {
      a: 2.0, b: 2.0, c: 2.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 32, vSegments: 32
    },
    icosahedron: {
      a: 2.0, b: 2.0, c: 2.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 24, vSegments: 24
    },
    
    // Chakra Shapes - STATIC (use fixed internal values, not params)
    chakra_root_muladhara: {
      a: 2.0, b: 1.0, c: 1.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 64, vSegments: 32
    },
    chakra_sacral_svadhisthana: {
      a: 2.0, b: 1.0, c: 1.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 64, vSegments: 32
    },
    chakra_solar_plexus_manipura: {
      a: 2.0, b: 1.0, c: 1.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 64, vSegments: 32
    },
    chakra_heart_anahata: {
      a: 2.0, b: 1.0, c: 1.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 64, vSegments: 32
    },
    chakra_throat_vishuddha: {
      a: 2.0, b: 1.0, c: 1.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 64, vSegments: 32
    },
    chakra_third_eye_ajna: {
      a: 2.0, b: 1.0, c: 1.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 64, vSegments: 32
    },
    chakra_crown_sahasrara: {
      a: 2.0, b: 1.0, c: 1.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 64, vSegments: 32
    },
    chakra_full_alignment: {
      a: 2.0, b: 1.0, c: 1.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 96, vSegments: 48
    },
    kundalini_spiral: {
      a: 2.0, b: 1.0, c: 1.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 96, vSegments: 48
    },
    solfeggio_mandala: {
      a: 2.0, b: 1.0, c: 1.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 96, vSegments: 48
    },
    
    // DNA Structures - STATIC
    dna_double_helix: {
      a: 2.0, b: 1.0, c: 1.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 96, vSegments: 48
    },
    a_dna_helix: {
      a: 2.0, b: 1.0, c: 1.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 96, vSegments: 48
    },
    z_dna_helix: {
      a: 2.0, b: 1.0, c: 1.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 96, vSegments: 48
    },
    rna_polymerase: {
      a: 2.0, b: 1.0, c: 1.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 96, vSegments: 48
    },
    centromere: {
      a: 2.0, b: 1.0, c: 1.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 64, vSegments: 32
    },
    
    // Set Theory Shapes - STATIC
    null_set_empty: {
      a: 2.0, b: 1.0, c: 1.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 64, vSegments: 32
    },
    singleton_set: {
      a: 2.0, b: 1.0, c: 1.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 64, vSegments: 32
    },
    venn_diagram_sets: {
      a: 2.0, b: 1.0, c: 1.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 96, vSegments: 48
    },
    
    // 4D Polytopes - STATIC (rotation is separate from morph)
    tesseract_4d: {
      a: 1.5, b: 1.5, c: 1.5,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 32, vSegments: 32
    },
    hypersphere_4d: {
      a: 2.0, b: 2.0, c: 2.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 64, vSegments: 32
    },
    hypersphere: {
      a: 2.0, b: 2.0, c: 2.0, d: 1,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 64, vSegments: 48
    },
    hypercube: {
      a: 1.2, b: 1.2, c: 1.2,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 128, vSegments: 16
    },
    hypersimplex: {
      a: 1.5, b: 1.5, c: 1.5,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 80, vSegments: 16
    },
    klein_bottle_4d: {
      a: 2.0, b: 1.0, c: 1.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 96, vSegments: 48
    },
    
    // Minimal Surfaces - STATIC
    enneper_surface: {
      a: 1.0, b: 1.0, c: 1.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 80, vSegments: 80
    },
    catenoid: {
      a: 1.0, b: 1.0, c: 2.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 64, vSegments: 32
    },
    helicoid: {
      a: 1.0, b: 1.0, c: 2.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 64, vSegments: 32
    },
    costa_minimal_surface: {
      a: 1.0, b: 1.0, c: 1.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 96, vSegments: 48
    },
    
    // Topology - STATIC
    mobius_strip: {
      a: 2.0, b: 0.5, c: 1.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 64, vSegments: 16
    },
    klein_bottle: {
      a: 2.0, b: 1.0, c: 1.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 96, vSegments: 48
    },
    trefoil_knot: {
      a: 2.0, b: 0.5, c: 1.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 128, vSegments: 32
    },
    
    // Fractals - STATIC
    mandelbrot_3d: {
      a: 2.0, b: 2.0, c: 2.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 128, vSegments: 64
    },
    julia_3d_classic: {
      a: 2.0, b: 2.0, c: 2.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 128, vSegments: 64
    },
    
    // Quantum & Physics - STATIC
    hydrogen_1s_orbital: {
      a: 2.0, b: 1.0, c: 1.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 64, vSegments: 32
    },
    hydrogen_2p_orbital: {
      a: 2.0, b: 1.0, c: 1.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 64, vSegments: 32
    },
    hydrogen_3d_orbital: {
      a: 2.0, b: 1.0, c: 1.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 64, vSegments: 32
    },
    qubit_bloch_sphere: {
      a: 2.0, b: 2.0, c: 2.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 64, vSegments: 32
    },
    
    // Cryptography - STATIC
    aes_rijndael_cipher: {
      a: 2.0, b: 1.0, c: 1.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 64, vSegments: 32
    },
    sha256_compression_function: {
      a: 2.0, b: 1.0, c: 1.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 64, vSegments: 32
    },
    elliptic_curve_cryptography: {
      a: 2.0, b: 1.0, c: 1.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 96, vSegments: 48
    },
    
    // Diamonds - STATIC
    diamond_round_brilliant: {
      a: 2.0, b: 2.0, c: 1.5,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 64, vSegments: 32
    },
    diamond_princess: {
      a: 2.0, b: 2.0, c: 1.2,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 48, vSegments: 48
    },
    diamond_emerald: {
      a: 2.5, b: 1.8, c: 1.2,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 48, vSegments: 48
    },
    
    // Default fallback - STATIC (NO twist/morph)
    default: {
      a: 2.0, b: 1.5, c: 1.0,
      ...CLEAN_STATIC_DEFAULTS,
      uSegments: 64, vSegments: 32
    }
  };
  
  return defaults[shapeName] || defaults.default;
}

/**
 * Get clean static defaults for any shape
 * Forces all D-M parameters to 0 for static rendering
 */
export function getCleanStaticDefaults(shapeName: string): Partial<SurfaceParameters> {
  const baseDefaults = getLocalShapeDefaults(shapeName);
  
  // Force all transform parameters to 0 for truly static shapes
  // Only exception is shape_of_universe which is designed to morph
  if (shapeName !== 'shape_of_universe') {
    return {
      ...baseDefaults,
      ...CLEAN_STATIC_DEFAULTS
    };
  }
  
  return baseDefaults;
}

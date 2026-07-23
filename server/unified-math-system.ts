/**
 * UNIFIED MATHEMATICAL AND SYMBOL SYSTEM — PLAINTEXT MODE
 * Single source of truth for plaintext math symbols, emoji translations, and 3D mappings
 * All symbols work in plaintext mode using code-names
 */

import Graphemer from 'graphemer';

// Handle CommonJS/ESM compatibility
const GraphemerClass = (Graphemer as any).default || Graphemer;
const graphemer = new GraphemerClass();

// SECTION A — GEOMETRY SYMBOLS
export const GEOMETRY_SYMBOLS = {
  x: {
    code_name: "spatial_coordinate_x",
    description: "Spatial coordinate X-axis",
    latex: "x",
    "3d": { method: "semantic" as const, geometry_type: "axis_line", parameters: { axis: 0 } }
  },
  y: {
    code_name: "spatial_coordinate_y",
    description: "Spatial coordinate Y-axis",
    latex: "y",
    "3d": { method: "semantic" as const, geometry_type: "axis_line", parameters: { axis: 1 } }
  },
  z: {
    code_name: "spatial_coordinate_z",
    description: "Spatial coordinate Z-axis",
    latex: "z",
    "3d": { method: "semantic" as const, geometry_type: "axis_line", parameters: { axis: 2 } }
  },
  r: {
    code_name: "radius",
    description: "Radius parameter",
    latex: "r",
    "3d": { method: "semantic" as const, geometry_type: "circle", parameters: { radius: 1.0 } }
  },
  theta: {
    code_name: "rotation_angle",
    description: "Rotation angle in radians",
    latex: "\\theta",
    "3d": { method: "semantic" as const, geometry_type: "angle_arc", parameters: { angle_degrees: 45 } }
  },
  phi: {
    code_name: "golden_ratio_phase",
    description: "Golden ratio phase angle",
    latex: "\\phi",
    "3d": { method: "semantic" as const, geometry_type: "golden_spiral", parameters: { ratio: 1.618033988749 } }
  },
  psi: {
    code_name: "secondary_phase",
    description: "Secondary phase parameter",
    latex: "\\psi",
    "3d": { method: "semantic" as const, geometry_type: "wave", parameters: { frequency: 1.0, amplitude: 0.5 } }
  },
  delta: {
    code_name: "change_in_shape",
    description: "Change or delta",
    latex: "\\Delta",
    "3d": { method: "semantic" as const, geometry_type: "stepped_pyramid", parameters: { steps: 5 } }
  },
  grad: {
    code_name: "gradient",
    description: "Gradient operator",
    latex: "\\nabla",
    "3d": { method: "semantic" as const, geometry_type: "vector_field", parameters: { intensity: 1.0, field_lines: 12 } }
  },
  perp: {
    code_name: "perpendicular",
    description: "Perpendicular symbol",
    latex: "\\perp",
    "3d": { method: "semantic" as const, geometry_type: "perpendicular_lines", parameters: { length: 2.0, thickness: 0.1 } }
  },
  parallel: {
    code_name: "parallel",
    description: "Parallel symbol",
    latex: "\\parallel",
    "3d": { method: "semantic" as const, geometry_type: "parallel_lines", parameters: { length: 2.0, spacing: 0.3 } }
  }
};

// SECTION B — TRIGONOMETRY FUNCTIONS
export const TRIGONOMETRY_FUNCTIONS = {
  sin: {
    code_name: "sine_wave",
    description: "Sine wave function",
    latex: "\\sin",
    "3d": { method: "semantic" as const, geometry_type: "sinusoidal_surface", parameters: { frequency: 1.0, amplitude: 1.0 } }
  },
  cos: {
    code_name: "cosine_wave",
    description: "Cosine wave function",
    latex: "\\cos",
    "3d": { method: "semantic" as const, geometry_type: "cosinusoidal_surface", parameters: { frequency: 1.0, amplitude: 1.0 } }
  },
  tan: {
    code_name: "tangent_wave",
    description: "Tangent wave function",
    latex: "\\tan",
    "3d": { method: "semantic" as const, geometry_type: "tangent_surface", parameters: { frequency: 1.0 } }
  },
  asin: {
    code_name: "inverse_sine",
    description: "Inverse sine (arcsin)",
    latex: "\\arcsin",
    "3d": { method: "semantic" as const, geometry_type: "arcsin_surface", parameters: {} }
  },
  acos: {
    code_name: "inverse_cosine",
    description: "Inverse cosine (arccos)",
    latex: "\\arccos",
    "3d": { method: "semantic" as const, geometry_type: "arccos_surface", parameters: {} }
  },
  atan2: {
    code_name: "two_argument_atan",
    description: "Two-argument arctangent",
    latex: "\\text{atan2}",
    "3d": { method: "semantic" as const, geometry_type: "atan2_surface", parameters: {} }
  },
  omega: {
    code_name: "angular_frequency",
    description: "Angular frequency",
    latex: "\\omega",
    "3d": { method: "semantic" as const, geometry_type: "rotating_field", parameters: { frequency: 2.0 } }
  },
  lambda: {
    code_name: "wavelength",
    description: "Wavelength parameter",
    latex: "\\lambda",
    "3d": { method: "semantic" as const, geometry_type: "wave", parameters: { wavelength: 1.0 } }
  },
  pi: {
    code_name: "rotation_constant",
    description: "Pi constant (3.14159...)",
    latex: "\\pi",
    value: Math.PI,
    "3d": { method: "semantic" as const, geometry_type: "circle", parameters: { radius: Math.PI, segments: 64 } }
  }
};

// SECTION C — CALCULUS OPERATORS
export const CALCULUS_OPERATORS = {
  d_dt: {
    code_name: "first_derivative",
    description: "First time derivative",
    latex: "\\frac{d}{dt}",
    "3d": { method: "semantic" as const, geometry_type: "tangent_vector", parameters: { length: 1.0 } }
  },
  d2_dt2: {
    code_name: "second_derivative",
    description: "Second time derivative",
    latex: "\\frac{d^2}{dt^2}",
    "3d": { method: "semantic" as const, geometry_type: "curvature_indicator", parameters: { strength: 1.0 } }
  },
  partial_x: {
    code_name: "partial_derivative_x",
    description: "Partial derivative with respect to x",
    latex: "\\frac{\\partial}{\\partial x}",
    "3d": { method: "semantic" as const, geometry_type: "gradient_field_x", parameters: { intensity: 1.0 } }
  },
  integral: {
    code_name: "accumulation",
    description: "Integration operator",
    latex: "\\int",
    "3d": { method: "semantic" as const, geometry_type: "curved_surface", parameters: { curve_intensity: 1.5, height: 2.0 } }
  },
  div: {
    code_name: "divergence",
    description: "Divergence operator",
    latex: "\\nabla \\cdot",
    "3d": { method: "semantic" as const, geometry_type: "diverging_field", parameters: { strength: 1.0 } }
  },
  curl: {
    code_name: "rotational_flow",
    description: "Curl operator",
    latex: "\\nabla \\times",
    "3d": { method: "semantic" as const, geometry_type: "vortex_field", parameters: { intensity: 1.0 } }
  },
  delta_t: {
    code_name: "time_smoothing",
    description: "Time step delta",
    latex: "\\Delta t",
    "3d": { method: "semantic" as const, geometry_type: "time_interval", parameters: { duration: 1.0 } }
  }
};

// SECTION D — ALGEBRA STRUCTURES
export const ALGEBRA_STRUCTURES = {
  f: {
    code_name: "base_function",
    description: "Generic function",
    latex: "f(x)",
    "3d": { method: "semantic" as const, geometry_type: "function_graph", parameters: {} }
  },
  abs: {
    code_name: "magnitude",
    description: "Absolute value/magnitude",
    latex: "|x|",
    "3d": { method: "semantic" as const, geometry_type: "absolute_surface", parameters: {} }
  },
  exp: {
    code_name: "exponential",
    description: "Exponential function",
    latex: "e^x",
    "3d": { method: "semantic" as const, geometry_type: "exponential_surface", parameters: { base: Math.E } }
  },
  log: {
    code_name: "logarithm",
    description: "Natural logarithm",
    latex: "\\ln",
    "3d": { method: "semantic" as const, geometry_type: "logarithmic_surface", parameters: {} }
  },
  sum: {
    code_name: "summation",
    description: "Summation operator",
    latex: "\\sum",
    "3d": { method: "semantic" as const, geometry_type: "stepped_pyramid", parameters: { steps: 10 } }
  },
  matrix: {
    code_name: "transformation_matrix",
    description: "Transformation matrix",
    latex: "M",
    "3d": { method: "semantic" as const, geometry_type: "matrix_grid", parameters: { rows: 3, cols: 3 } }
  },
  vector: {
    code_name: "coordinate_group",
    description: "Vector (coordinate group)",
    latex: "\\vec{v}",
    "3d": { method: "semantic" as const, geometry_type: "arrow_vector", parameters: { length: 1.0 } }
  },
  det: {
    code_name: "distortion_factor",
    description: "Determinant (distortion factor)",
    latex: "\\det",
    "3d": { method: "semantic" as const, geometry_type: "volume_indicator", parameters: { scale: 1.0 } }
  }
};

// SECTION E — SPECIAL CONSTANTS
export const SPECIAL_CONSTANTS = {
  PHI: {
    code_name: "golden_ratio",
    value: 1.618033988749,
    description: "Golden ratio (φ)",
    latex: "\\phi",
    "3d": { method: "semantic" as const, geometry_type: "golden_spiral", parameters: { ratio: 1.618033988749 } }
  },
  PHI_INV: {
    code_name: "golden_ratio_inverse",
    value: 0.618033988749,
    description: "Inverse golden ratio (1/φ)",
    latex: "\\phi^{-1}",
    "3d": { method: "semantic" as const, geometry_type: "inverse_golden_spiral", parameters: { ratio: 0.618033988749 } }
  },
  PHI_MIRROR: {
    code_name: "range_1.000_to_2.000_phi",
    description: "PHI mirrored range [1.000, 2.000]",
    value_range: [1.0, 2.0],
    "3d": { method: "semantic" as const, geometry_type: "phi_range_surface", parameters: { min: 1.0, max: 2.0 } }
  },
  PI_MIRROR: {
    code_name: "range_1.000_to_2.000_pi",
    description: "PI mirrored range [1.000, 2.000]",
    value_range: [1.0, 2.0],
    "3d": { method: "semantic" as const, geometry_type: "pi_range_surface", parameters: { min: 1.0, max: 2.0 } }
  },
  TON_202: {
    code_name: "ton_202_constant",
    value: 1.202,
    description: "TON constant 202",
    "3d": { method: "semantic" as const, geometry_type: "ton_surface", parameters: { ton_value: 1.202 } }
  },
  TON_1480: {
    code_name: "ton_1480_constant",
    value: 1.1480,
    description: "TON constant 1480",
    "3d": { method: "semantic" as const, geometry_type: "ton_surface", parameters: { ton_value: 1.1480 } }
  },
  TON_256: {
    code_name: "ton_256_constant",
    value: 1.256,
    description: "TON constant 256",
    "3d": { method: "semantic" as const, geometry_type: "ton_surface", parameters: { ton_value: 1.256 } }
  },
  TON_618: {
    code_name: "ton_618_constant",
    value: 1.618,
    description: "TON constant 618 (aligned with PHI)",
    "3d": { method: "semantic" as const, geometry_type: "ton_surface", parameters: { ton_value: 1.618 } }
  },
  KAPPA: {
    code_name: "curvature_constant",
    description: "Curvature constant κ",
    latex: "\\kappa",
    "3d": { method: "semantic" as const, geometry_type: "curvature_field", parameters: { curvature: 1.0 } }
  },
  PORTAL_H: {
    code_name: "portal_harmonic",
    description: "Portal harmonic constant",
    "3d": { method: "semantic" as const, geometry_type: "portal_surface", parameters: { harmonic: 1.0 } }
  }
};

// SECTION F — EMOJI TRANSLATION & VISUAL ELEMENTS
export const EMOJI_TRANSLATIONS = {
  // TOP MOST USED EMOJIS WORLDWIDE 🌍
  face_with_tears_of_joy: {
    code_name: "face_with_tears_of_joy", // 😂 #1 most used
    mesh_type: "joy_particle_system",
    description: "Emotional joy particle explosion",
    "3d": { method: "procedural" as const, geometry_type: "emotional_field", parameters: { joy_intensity: 2.0, particle_count: 200 } }
  },
  red_heart: {
    code_name: "red_heart", // ❤️ #2 most used
    mesh_type: "heart_geometric_mesh",
    description: "Mathematical heart curve",
    equation: "x = 16sin³(t), y = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)",
    "3d": { method: "semantic" as const, geometry_type: "heart_curve", parameters: { love_amplitude: 1.5 } }
  },
  pleading_face: {
    code_name: "pleading_face", // 🥺 #3 most used
    mesh_type: "emotional_wave_field",
    description: "Gentle emotional wave patterns",
    "3d": { method: "procedural" as const, geometry_type: "soft_wave_field", parameters: { gentleness: 0.8, ripple_freq: 0.3 } }
  },
  smiling_face_with_heart_eyes: {
    code_name: "smiling_face_with_heart_eyes", // 😍 #4 most used
    mesh_type: "love_field_visualization",
    description: "Heart-shaped energy field",
    "3d": { method: "procedural" as const, geometry_type: "love_energy_field", parameters: { heart_resonance: 1.2 } }
  },
  rolling_on_floor_laughing: {
    code_name: "rolling_on_floor_laughing", // 🤣 #5 most used
    mesh_type: "laughter_wave_system",
    description: "Oscillating laughter wave patterns",
    "3d": { method: "procedural" as const, geometry_type: "oscillating_joy", parameters: { frequency: 8.0, amplitude: 1.5 } }
  },
  
  // EXISTING EMOJIS ENHANCED
  fire_emoji: {
    code_name: "fire_emoji", // 🔥
    mesh_type: "volumetric_flame_mesh",
    description: "Fire/flame 3D mesh",
    "3d": { method: "procedural" as const, geometry_type: "volumetric_flame", parameters: { intensity: 1.0, flicker: 0.3 } }
  },
  wave_emoji: {
    code_name: "wave_emoji", // 🌊
    mesh_type: "sinusoidal_surface_mesh",
    description: "Sinusoidal wave surface",
    equation: "z = sin(x * lambda + t * omega)",
    "3d": { method: "semantic" as const, geometry_type: "sinusoidal_surface", parameters: { lambda: 1.0, omega: 1.0 } }
  },
  star_emoji: {
    code_name: "star_emoji", // ⭐
    mesh_type: "parametric_star_mesh",
    description: "Parametric star shape",
    equation: "r(theta) = base_r * (1 + 0.2 * sin(5*theta))",
    "3d": { method: "semantic" as const, geometry_type: "star_shape", parameters: { base_r: 1.0, points: 5 } }
  },
  
  // MORE TOP EMOJIS
  thumbs_up: {
    code_name: "thumbs_up", // 👍
    mesh_type: "positive_energy_field",
    description: "Upward energy spiral",
    "3d": { method: "procedural" as const, geometry_type: "ascending_spiral", parameters: { positivity: 1.5 } }
  },
  clapping_hands: {
    code_name: "clapping_hands", // 👏
    mesh_type: "rhythmic_wave_pattern",
    description: "Rhythmic applause waves",
    "3d": { method: "procedural" as const, geometry_type: "clap_waves", parameters: { rhythm: 2.0, sync: 0.8 } }
  },
  rainbow: {
    code_name: "rainbow", // 🌈
    mesh_type: "spectrum_arc_mesh",
    description: "Mathematical rainbow arc",
    equation: "Spectral wavelength mapping: 380nm-700nm",
    "3d": { method: "semantic" as const, geometry_type: "spectrum_arc", parameters: { wavelength_range: 320 } }
  },
  sparkles: {
    code_name: "sparkles", // ✨
    mesh_type: "particle_sparkle_system",
    description: "Glittering particle field",
    "3d": { method: "procedural" as const, geometry_type: "sparkle_particles", parameters: { twinkle_rate: 5.0 } }
  },
  rocket: {
    code_name: "rocket", // 🚀
    mesh_type: "trajectory_mesh",
    description: "Rocket trajectory curve",
    equation: "Parabolic trajectory with exhaust trail",
    "3d": { method: "semantic" as const, geometry_type: "rocket_trajectory", parameters: { thrust: 2.5 } }
  },
  
  // GEOMETRIC SHAPES
  cube_emoji: {
    code_name: "cube_emoji", // ⬜
    mesh_type: "cube_mesh",
    description: "Cube primitive",
    "3d": { method: "semantic" as const, geometry_type: "cube", parameters: { size: 1.0 } }
  },
  sphere_emoji: {
    code_name: "sphere_emoji", // ⚪
    mesh_type: "uv_sphere_mesh",
    description: "Perfect sphere",
    "3d": { method: "semantic" as const, geometry_type: "sphere", parameters: { radius: 1.0 } }
  },
  diamond_emoji: {
    code_name: "diamond_emoji", // 💎
    mesh_type: "diamond_cut_mesh",
    description: "Brilliant cut diamond",
    "3d": { method: "semantic" as const, geometry_type: "brilliant_cut", parameters: { facets: 58, brilliance: 2.0 } }
  }
};

// SECTION F2 — STICKER & GIF SUPPORT
export const VISUAL_ELEMENT_SUPPORT = {
  stickers: {
    supported: true,
    formats: ["webp", "png", "svg"],
    max_size: "2MB",
    animation_support: true,
    to_3d_conversion: {
      method: "texture_mapping",
      geometry_types: ["plane", "curved_surface", "billboard"],
      depth_extrusion: true
    }
  },
  gifs: {
    supported: true,
    formats: ["gif", "webp_animated", "apng"],
    max_duration: "10s",
    frame_extraction: true,
    to_3d_conversion: {
      method: "animated_texture_sequence",
      geometry_types: ["plane", "cylinder", "sphere_mapped"],
      temporal_morphing: true
    }
  },
  svg_graphics: {
    supported: true,
    vector_to_mesh: true,
    extrusion_depth: "configurable",
    path_to_curve: true
  },
  unicode_symbols: {
    supported: true,
    font_extrusion: true,
    mathematical_symbols: true,
    custom_geometry_mapping: true
  }
};

// SECTION F3 — QUICK EMOJI TO SHAPE MAPPING
export const QUICK_EMOJI_SHAPES = {
  "😀": "joy_sphere",
  "😂": "laughter_waves", 
  "❤️": "heart_curve",
  "🔥": "flame_mesh",
  "🌊": "wave_surface",
  "⭐": "star_geometry",
  "🌈": "rainbow_arc",
  "✨": "sparkle_field",
  "🚀": "rocket_trail",
  "💎": "diamond_cut",
  "🎵": "sound_wave",
  "🌸": "flower_fractal",
  "🦋": "butterfly_wing_surface",
  "🌟": "stellar_burst",
  "💫": "cosmic_spiral",
  "🎯": "target_rings",
  "⚡": "lightning_bolt",
  "🌀": "vortex_spiral",
  "🎨": "color_palette_mesh",
  "🔮": "crystal_sphere"
};

// SECTION G — UNIFIED LOOKUP
export function getUnifiedSymbol(key: string): any {
  // Search in all sections
  return (
    GEOMETRY_SYMBOLS[key as keyof typeof GEOMETRY_SYMBOLS] ||
    TRIGONOMETRY_FUNCTIONS[key as keyof typeof TRIGONOMETRY_FUNCTIONS] ||
    CALCULUS_OPERATORS[key as keyof typeof CALCULUS_OPERATORS] ||
    ALGEBRA_STRUCTURES[key as keyof typeof ALGEBRA_STRUCTURES] ||
    SPECIAL_CONSTANTS[key as keyof typeof SPECIAL_CONSTANTS] ||
    EMOJI_TRANSLATIONS[key as keyof typeof EMOJI_TRANSLATIONS] ||
    null
  );
}

// SECTION H — EMOJI CODE-NAME PARSER
export function parseEmojiCodeNames(input: string): string {
  let output = input;
  
  // Enhanced Unicode-aware parsing for mathematical symbols
  const graphemes = parseInputToGraphemes(input);
  
  graphemes.forEach(grapheme => {
    Object.entries(EMOJI_TRANSLATIONS).forEach(([key, value]) => {
      if (grapheme === key || grapheme.includes(key)) {
        output = output.replace(grapheme, value.mesh_type);
      }
    });
  });
  
  return output;
}

function parseInputToGraphemes(input: string): string[] {
  // Use Graphemer for professional-grade Unicode grapheme cluster handling
  return graphemer.splitGraphemes(input);
}

// SECTION I — 3D MESH OUTPUT FORMAT
export function outputFormat(codeNameOrEmoji: string): {
  symbol: string;
  mesh_type?: string;
  "3d_representation": any;
  description: string;
} {
  const symbol = getUnifiedSymbol(codeNameOrEmoji);
  
  if (!symbol) {
    return {
      symbol: codeNameOrEmoji,
      "3d_representation": null,
      description: "Unknown symbol"
    };
  }
  
  return {
    symbol: codeNameOrEmoji,
    mesh_type: symbol.mesh_type || symbol.code_name,
    "3d_representation": symbol["3d"],
    description: symbol.description
  };
}

// SECTION J — GET ALL UNIFIED SYMBOLS
export function getAllUnifiedSymbols() {
  return {
    geometry: GEOMETRY_SYMBOLS,
    trigonometry: TRIGONOMETRY_FUNCTIONS,
    calculus: CALCULUS_OPERATORS,
    algebra: ALGEBRA_STRUCTURES,
    constants: SPECIAL_CONSTANTS,
    emojis: EMOJI_TRANSLATIONS
  };
}

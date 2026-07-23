
/**
 * UNIVERSAL MATHEMATICAL SYMBOL DATABASE
 * Single source of truth for all mathematical notation across platforms
 */

export interface MathSymbol {
  symbol: string;
  unicode: string;
  draw_js: string;
  html: string;
  latex: string;
  python_safe: string;
  json_safe: string;
  description: string;
  category: string;
  aliases: string[];
  "3d": {
    method: "font_extrusion" | "semantic" | "procedural";
    mesh?: string;
    geometry_type?: string;
    parameters?: Record<string, number>;
  };
}

export const MATHEMATICAL_SYMBOLS: Record<string, MathSymbol> = {
  // BASIC OPERATORS
  "nabla": {
    symbol: "∇",
    unicode: "U+2207",
    draw_js: "\\u2207",
    html: "&#x2207;",
    latex: "\\nabla",
    python_safe: "nabla",
    json_safe: "\\u2207",
    description: "Del operator, gradient",
    category: "differential_operators",
    aliases: ["del", "gradient"],
    "3d": {
      method: "semantic",
      geometry_type: "vector_field",
      parameters: { intensity: 1.0, field_lines: 12 }
    }
  },

  "partial": {
    symbol: "∂",
    unicode: "U+2202",
    draw_js: "\\u2202",
    html: "&#x2202;",
    latex: "\\partial",
    python_safe: "partial",
    json_safe: "\\u2202",
    description: "Partial derivative",
    category: "differential_operators",
    aliases: ["d", "partial_derivative"],
    "3d": {
      method: "font_extrusion",
      parameters: { depth: 0.2, bevel: 1 }
    }
  },

  "integral": {
    symbol: "∫",
    unicode: "U+222B",
    draw_js: "\\u222B",
    html: "&#x222B;",
    latex: "\\int",
    python_safe: "integral",
    json_safe: "\\u222B",
    description: "Integral sign",
    category: "integration",
    aliases: ["int"],
    "3d": {
      method: "semantic",
      geometry_type: "curved_surface",
      parameters: { curve_intensity: 1.5, height: 2.0 }
    }
  },

  // GREEK LETTERS
  "pi": {
    symbol: "π",
    unicode: "U+03C0",
    draw_js: "\\u03C0",
    html: "&#x03C0;",
    latex: "\\pi",
    python_safe: "pi",
    json_safe: "\\u03C0",
    description: "Pi constant",
    category: "constants",
    aliases: ["PI"],
    "3d": {
      method: "semantic",
      geometry_type: "circle",
      parameters: { radius: Math.PI, segments: 64 }
    }
  },

  "phi": {
    symbol: "φ",
    unicode: "U+03C6",
    draw_js: "\\u03C6",
    html: "&#x03C6;",
    latex: "\\phi",
    python_safe: "phi",
    json_safe: "\\u03C6",
    description: "Golden ratio",
    category: "constants",
    aliases: ["PHI", "golden_ratio"],
    "3d": {
      method: "semantic",
      geometry_type: "golden_spiral",
      parameters: { ratio: 1.618033988749 }
    }
  },

  "lambda": {
    symbol: "λ",
    unicode: "U+03BB",
    draw_js: "\\u03BB",
    html: "&#x03BB;",
    latex: "\\lambda",
    python_safe: "lambda_",
    json_safe: "\\u03BB",
    description: "Lambda",
    category: "variables",
    aliases: ["wavelength"],
    "3d": {
      method: "semantic",
      geometry_type: "wave",
      parameters: { frequency: 1.0, amplitude: 0.5 }
    }
  },

  // SET THEORY
  "intersection": {
    symbol: "∩",
    unicode: "U+2229",
    draw_js: "\\u2229",
    html: "&#x2229;",
    latex: "\\cap",
    python_safe: "intersection",
    json_safe: "\\u2229",
    description: "Set intersection",
    category: "set_theory",
    aliases: ["cap", "and"],
    "3d": {
      method: "semantic",
      geometry_type: "intersecting_spheres",
      parameters: { sphere1_radius: 1.0, sphere2_radius: 1.0, offset: 0.5 }
    }
  },

  "union": {
    symbol: "∪",
    unicode: "U+222A",
    draw_js: "\\u222A",
    html: "&#x222A;",
    latex: "\\cup",
    python_safe: "union",
    json_safe: "\\u222A",
    description: "Set union",
    category: "set_theory",
    aliases: ["cup", "or"],
    "3d": {
      method: "semantic",
      geometry_type: "merged_spheres",
      parameters: { sphere1_radius: 1.0, sphere2_radius: 1.0 }
    }
  },

  // QUANTUM MECHANICS
  "psi": {
    symbol: "ψ",
    unicode: "U+03C8",
    draw_js: "\\u03C8",
    html: "&#x03C8;",
    latex: "\\psi",
    python_safe: "psi",
    json_safe: "\\u03C8",
    description: "Wave function",
    category: "quantum",
    aliases: ["wavefunction"],
    "3d": {
      method: "semantic",
      geometry_type: "probability_cloud",
      parameters: { amplitude: 1.0 }
    }
  },

  "hbar": {
    symbol: "ℏ",
    unicode: "U+210F",
    draw_js: "\\u210F",
    html: "&#x210F;",
    latex: "\\hbar",
    python_safe: "hbar",
    json_safe: "\\u210F",
    description: "Reduced Planck constant",
    category: "quantum",
    aliases: ["h_bar", "planck_reduced"],
    "3d": {
      method: "semantic",
      geometry_type: "quantum_spiral",
      parameters: { quantum_scale: 1e-34 }
    }
  },

  // TOPOLOGY
  "aleph": {
    symbol: "ℵ",
    unicode: "U+2135",
    draw_js: "\\u2135",
    html: "&#x2135;",
    latex: "\\aleph",
    python_safe: "aleph",
    json_safe: "\\u2135",
    description: "Aleph number (infinite cardinality)",
    category: "topology",
    aliases: ["aleph_null"],
    "3d": {
      method: "semantic",
      geometry_type: "infinite_fractal",
      parameters: { recursion_depth: 8, scale_factor: 0.618 }
    }
  },

  // GEOMETRIC SYMBOLS
  "angle": {
    symbol: "∠",
    unicode: "U+2220",
    draw_js: "\\u2220",
    html: "&#x2220;",
    latex: "\\angle",
    python_safe: "angle",
    json_safe: "\\u2220",
    description: "Angle",
    category: "geometry",
    aliases: [],
    "3d": {
      method: "semantic",
      geometry_type: "angle_arc",
      parameters: { angle_degrees: 90, radius: 1.0, thickness: 0.05 }
    }
  },

  "perpendicular": {
    symbol: "⊥",
    unicode: "U+22A5",
    draw_js: "\\u22A5",
    html: "&#x22A5;",
    latex: "\\perp",
    python_safe: "perpendicular",
    json_safe: "\\u22A5",
    description: "Perpendicular",
    category: "geometry",
    aliases: ["perp"],
    "3d": {
      method: "semantic",
      geometry_type: "perpendicular_lines",
      parameters: { length: 2.0, thickness: 0.1 }
    }
  },

  // COMPLEX ANALYSIS
  "infinity": {
    symbol: "∞",
    unicode: "U+221E",
    draw_js: "\\u221E",
    html: "&#x221E;",
    latex: "\\infty",
    python_safe: "infinity",
    json_safe: "\\u221E",
    description: "Infinity",
    category: "limits",
    aliases: ["inf"],
    "3d": {
      method: "semantic",
      geometry_type: "mobius_strip",
      parameters: { radius: 1.0, twists: 1 }
    }
  },

  // SUMMATION & PRODUCTS
  "sum": {
    symbol: "∑",
    unicode: "U+2211",
    draw_js: "\\u2211",
    html: "&#x2211;",
    latex: "\\sum",
    python_safe: "sum",
    json_safe: "\\u2211",
    description: "Summation",
    category: "operators",
    aliases: ["sigma"],
    "3d": {
      method: "semantic",
      geometry_type: "stepped_pyramid",
      parameters: { steps: 10, height: 2.0, base_width: 2.0 }
    }
  },

  "product": {
    symbol: "∏",
    unicode: "U+220F",
    draw_js: "\\u220F",
    html: "&#x220F;",
    latex: "\\prod",
    python_safe: "product",
    json_safe: "\\u220F",
    description: "Product",
    category: "operators",
    aliases: ["pi_product"],
    "3d": {
      method: "semantic",
      geometry_type: "interlocked_rings",
      parameters: { ring_count: 5, radius: 0.5, thickness: 0.1 }
    }
  },

  // LOGIC
  "forall": {
    symbol: "∀",
    unicode: "U+2200",
    draw_js: "\\u2200",
    html: "&#x2200;",
    latex: "\\forall",
    python_safe: "forall",
    json_safe: "\\u2200",
    description: "For all (universal quantifier)",
    category: "logic",
    aliases: ["universal"],
    "3d": {
      method: "font_extrusion",
      parameters: { depth: 0.3, bevel: 1 }
    }
  },

  "exists": {
    symbol: "∃",
    unicode: "U+2203",
    draw_js: "\\u2203",
    html: "&#x2203;",
    latex: "\\exists",
    python_safe: "exists",
    json_safe: "\\u2203",
    description: "There exists (existential quantifier)",
    category: "logic",
    aliases: ["existential"],
    "3d": {
      method: "font_extrusion",
      parameters: { depth: 0.3, bevel: 1 }
    }
  }
};

// Category mappings for quick access
export const SYMBOL_CATEGORIES = {
  differential_operators: ["nabla", "partial"],
  integration: ["integral"],
  constants: ["pi", "phi"],
  variables: ["lambda"],
  set_theory: ["intersection", "union"],
  quantum: ["psi", "hbar"],
  topology: ["aleph"],
  geometry: ["angle", "perpendicular"],
  limits: ["infinity"],
  operators: ["sum", "product"],
  logic: ["forall", "exists"]
};

/**
 * Get symbol by name or alias
 */
export function getSymbol(name: string): MathSymbol | null {
  // Direct lookup
  if (MATHEMATICAL_SYMBOLS[name]) {
    return MATHEMATICAL_SYMBOLS[name];
  }

  // Alias lookup
  for (const [key, symbol] of Object.entries(MATHEMATICAL_SYMBOLS)) {
    if (symbol.aliases.includes(name)) {
      return symbol;
    }
  }

  return null;
}

/**
 * Get all symbols in category
 */
export function getSymbolsByCategory(category: string): MathSymbol[] {
  return Object.values(MATHEMATICAL_SYMBOLS).filter(symbol => symbol.category === category);
}

/**
 * Search symbols by description
 */
export function searchSymbols(query: string): MathSymbol[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(MATHEMATICAL_SYMBOLS).filter(symbol => 
    symbol.description.toLowerCase().includes(lowerQuery) ||
    symbol.category.toLowerCase().includes(lowerQuery) ||
    symbol.aliases.some(alias => alias.toLowerCase().includes(lowerQuery))
  );
}

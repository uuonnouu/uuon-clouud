/**
 * GLOBAL VARIABLE ONTOLOGY
 * Unified symbol translation layer for cross-domain mathematical formula compatibility
 * 
 * Addresses publication weakness 5.1: "Some formulas reuse symbols inconsistently (r, L, T, Θ)"
 * Provides consistent variable semantics across all domains
 * 
 * @author UUON Foundation
 * @license Proprietary
 */

export interface VariableDefinition {
  canonical: string;
  aliases: string[];
  domain: string[];
  dataType: 'scalar' | 'vector' | 'tensor' | 'complex' | 'quaternion';
  units?: string[];
  range: [number, number] | 'unbounded' | 'positive' | 'non-negative';
  semanticMeaning: string;
  physicalInterpretation: Record<string, string>;
}

export interface DomainMapping {
  domain: string;
  symbols: Record<string, string>;
  conventions: string[];
}

export const GLOBAL_VARIABLE_ONTOLOGY: Record<string, VariableDefinition> = {
  u: {
    canonical: 'u',
    aliases: ['s', 'param1', 'θ_norm'],
    domain: ['parametric', 'surface', 'thermal', 'quantum'],
    dataType: 'scalar',
    range: [0, 1],
    semanticMeaning: 'Primary parametric coordinate (normalized)',
    physicalInterpretation: {
      'parametric': 'Surface parameter 1 (0-1)',
      'thermal': 'Heat transfer coordinate',
      'quantum': 'Wavefunction parameter',
      'geometry': 'Curve/surface parameter'
    }
  },

  v: {
    canonical: 'v',
    aliases: ['t', 'param2', 'φ_norm'],
    domain: ['parametric', 'surface', 'thermal', 'quantum'],
    dataType: 'scalar',
    range: [0, 1],
    semanticMeaning: 'Secondary parametric coordinate (normalized)',
    physicalInterpretation: {
      'parametric': 'Surface parameter 2 (0-1)',
      'thermal': 'Cross-sectional coordinate',
      'quantum': 'Time evolution parameter',
      'geometry': 'Surface second parameter'
    }
  },

  r: {
    canonical: 'r',
    aliases: ['radius', 'rho', 'R', 'distance'],
    domain: ['geometry', 'physics', 'thermal', 'quantum', 'relativity'],
    dataType: 'scalar',
    range: 'non-negative',
    units: ['m', 'mm', 'dimensionless'],
    semanticMeaning: 'Radial distance from origin or center',
    physicalInterpretation: {
      'geometry': 'Distance from center point',
      'thermal': 'Radial position in pipe/cylinder',
      'quantum': 'Electron orbital radius',
      'relativity': 'Schwarzschild radial coordinate',
      'physics': 'Distance from source'
    }
  },

  theta: {
    canonical: 'θ',
    aliases: ['theta', 'angle', 'azimuth', 'rotation'],
    domain: ['geometry', 'physics', 'thermal', 'quantum', 'relativity'],
    dataType: 'scalar',
    range: [0, 6.28318530718],
    units: ['rad'],
    semanticMeaning: 'Angular coordinate (azimuthal)',
    physicalInterpretation: {
      'geometry': 'Rotation angle in xy-plane',
      'thermal': 'Angular position in cooling system',
      'quantum': 'Phase angle of wavefunction',
      'relativity': 'Boyer-Lindquist coordinate',
      'physics': 'Spherical polar angle'
    }
  },

  phi: {
    canonical: 'φ',
    aliases: ['phi', 'phase', 'elevation', 'inclination'],
    domain: ['geometry', 'physics', 'thermal', 'quantum', 'relativity'],
    dataType: 'scalar',
    range: [0, 3.14159265359],
    units: ['rad'],
    semanticMeaning: 'Polar angle from z-axis',
    physicalInterpretation: {
      'geometry': 'Angle from vertical axis',
      'thermal': 'Elevation angle in 3D flow',
      'quantum': 'Spherical harmonic polar angle',
      'relativity': 'Colatitude coordinate',
      'physics': 'Elevation in spherical system'
    }
  },

  T: {
    canonical: 'T',
    aliases: ['temp', 'temperature', 'T_ambient', 'T_surface'],
    domain: ['thermal', 'physics', 'relativity'],
    dataType: 'scalar',
    range: 'positive',
    units: ['K', '°C', '°F'],
    semanticMeaning: 'Temperature (absolute or relative)',
    physicalInterpretation: {
      'thermal': 'Thermodynamic temperature',
      'physics': 'System temperature',
      'relativity': 'Hawking temperature (black hole)',
      'quantum': 'Thermal de Broglie wavelength parameter'
    }
  },

  L: {
    canonical: 'L',
    aliases: ['load', 'length', 'L_ratio', 'lambda'],
    domain: ['thermal', 'mechanics', 'geometry'],
    dataType: 'scalar',
    range: 'positive',
    units: ['m', 'dimensionless', '%'],
    semanticMeaning: 'Load ratio or characteristic length',
    physicalInterpretation: {
      'thermal': 'Partial load ratio (0-1)',
      'mechanics': 'Applied load or moment arm',
      'geometry': 'Characteristic length scale',
      'physics': 'Angular momentum quantum number'
    }
  },

  COP: {
    canonical: 'COP',
    aliases: ['cop', 'efficiency', 'eta_cooling'],
    domain: ['thermal'],
    dataType: 'scalar',
    range: 'positive',
    units: ['dimensionless'],
    semanticMeaning: 'Coefficient of Performance',
    physicalInterpretation: {
      'thermal': 'Cooling efficiency = Q_c / W',
      'hvac': 'Chiller performance metric',
      'physics': 'Energy transfer ratio'
    }
  },

  alpha: {
    canonical: 'α',
    aliases: ['alpha', 'thermal_diffusivity', 'angle_of_attack'],
    domain: ['thermal', 'physics', 'relativity'],
    dataType: 'scalar',
    range: 'positive',
    units: ['m²/s', 'rad'],
    semanticMeaning: 'Thermal diffusivity or angular parameter',
    physicalInterpretation: {
      'thermal': 'α = k/(ρ·cₚ) thermal diffusivity',
      'physics': 'Fine structure constant ≈ 1/137',
      'relativity': 'Kerr parameter (spin)',
      'geometry': 'Rotation or scaling factor'
    }
  },

  omega: {
    canonical: 'ω',
    aliases: ['omega', 'frequency', 'angular_velocity'],
    domain: ['physics', 'quantum', 'thermal'],
    dataType: 'scalar',
    range: 'unbounded',
    units: ['rad/s', 'Hz'],
    semanticMeaning: 'Angular frequency or velocity',
    physicalInterpretation: {
      'physics': 'Angular velocity (rad/s)',
      'quantum': 'Energy/ℏ frequency',
      'thermal': 'Oscillation rate in heat transfer',
      'relativity': 'Frame dragging angular velocity'
    }
  },

  k: {
    canonical: 'k',
    aliases: ['k_thermal', 'wavenumber', 'spring_constant'],
    domain: ['thermal', 'physics', 'quantum'],
    dataType: 'scalar',
    range: 'positive',
    units: ['W/(m·K)', '1/m', 'N/m'],
    semanticMeaning: 'Thermal conductivity or wavenumber',
    physicalInterpretation: {
      'thermal': 'Thermal conductivity k [W/(m·K)]',
      'physics': 'Wavenumber k = 2π/λ',
      'quantum': 'Momentum/ℏ wave vector',
      'mechanics': 'Spring stiffness constant'
    }
  },

  G: {
    canonical: 'G',
    aliases: ['G_N', 'gravitational_constant', 'conductance'],
    domain: ['relativity', 'physics', 'thermal'],
    dataType: 'scalar',
    range: 'positive',
    units: ['m³/(kg·s²)', 'W/K'],
    semanticMeaning: 'Gravitational constant or thermal conductance',
    physicalInterpretation: {
      'relativity': 'Newton gravitational constant = 6.674×10⁻¹¹',
      'physics': 'Universal gravitation constant',
      'thermal': 'Thermal conductance (W/K)'
    }
  },

  h: {
    canonical: 'h',
    aliases: ['planck', 'h_conv', 'height'],
    domain: ['quantum', 'thermal', 'geometry'],
    dataType: 'scalar',
    range: 'positive',
    units: ['J·s', 'W/(m²·K)', 'm'],
    semanticMeaning: 'Planck constant or heat transfer coefficient',
    physicalInterpretation: {
      'quantum': 'Planck constant h = 6.626×10⁻³⁴ J·s',
      'thermal': 'Convective heat transfer coefficient [W/(m²·K)]',
      'geometry': 'Height or elevation'
    }
  },

  c: {
    canonical: 'c',
    aliases: ['speed_of_light', 'c_p', 'c_v', 'curvature'],
    domain: ['relativity', 'thermal', 'geometry'],
    dataType: 'scalar',
    range: 'positive',
    units: ['m/s', 'J/(kg·K)'],
    semanticMeaning: 'Speed of light or specific heat capacity',
    physicalInterpretation: {
      'relativity': 'Speed of light c = 299,792,458 m/s',
      'thermal': 'Specific heat capacity [J/(kg·K)]',
      'geometry': 'Curvature parameter',
      'physics': 'Wave propagation speed'
    }
  },

  psi: {
    canonical: 'ψ',
    aliases: ['psi', 'wavefunction', 'stream_function'],
    domain: ['quantum', 'fluid'],
    dataType: 'complex',
    range: 'unbounded',
    semanticMeaning: 'Quantum wavefunction or stream function',
    physicalInterpretation: {
      'quantum': 'Probability amplitude |ψ|² = probability density',
      'fluid': 'Stream function for 2D flow'
    }
  }
};

export const DOMAIN_MAPPINGS: DomainMapping[] = [
  {
    domain: 'thermal_engineering',
    symbols: {
      'r': 'radial position',
      'L': 'load ratio',
      'T': 'temperature',
      'COP': 'coefficient of performance',
      'α': 'thermal diffusivity',
      'k': 'thermal conductivity',
      'h': 'heat transfer coefficient'
    },
    conventions: [
      'T always in Kelvin for calculations',
      'L normalized to 0-1 range',
      'COP always positive (efficiency metric)'
    ]
  },
  {
    domain: 'quantum_physics',
    symbols: {
      'r': 'radial distance from nucleus',
      'θ': 'azimuthal angle',
      'φ': 'polar angle',
      'ψ': 'wavefunction',
      'ℏ': 'reduced Planck constant',
      'k': 'wavenumber'
    },
    conventions: [
      'ℏ = h/(2π)',
      'Probability = |ψ|²',
      'Energy quantized: E = nℏω'
    ]
  },
  {
    domain: 'general_relativity',
    symbols: {
      'r': 'Schwarzschild radial coordinate',
      'θ': 'polar angle',
      'φ': 'azimuthal angle',
      't': 'coordinate time',
      'G': 'gravitational constant',
      'c': 'speed of light',
      'M': 'mass'
    },
    conventions: [
      'c = G = 1 in natural units',
      'Metric signature (-,+,+,+)',
      'Christoffel symbols: Γᵃ_bc'
    ]
  },
  {
    domain: 'harmonic_analysis',
    symbols: {
      'l': 'degree (angular momentum)',
      'm': 'order (magnetic quantum number)',
      'θ': 'colatitude',
      'φ': 'longitude/azimuth',
      'Y_lm': 'spherical harmonic'
    },
    conventions: [
      '-l ≤ m ≤ l',
      'Orthonormality: ∫Y_lm Y*_l\'m\' dΩ = δ_ll\'δ_mm\'',
      'Condon-Shortley phase convention'
    ]
  },
  {
    domain: 'geia_phenomenon',
    symbols: {
      'G': 'Geometry/Structure (2,281 mathematical shapes)',
      'E': 'Energy flows (cross-learning engine)',
      'I': 'Information patterns (consciousness system)',
      'Λ': 'Natural laws (parameter authority)',
      'P': 'Phenomenon field',
      'S': 'Structural topology',
      'H': 'Information entropy',
      'Now': 'Temporal transformation operator',
      'Ψ': 'Probability field (potential states)'
    },
    conventions: [
      'P = f(G, E, I, Λ): Phenomenon Principle equation',
      'Phenomenon exists only when S ≠ 0, E ≠ 0, I ≠ 0',
      'Now = Collapse(Ψ_future) → Ψ_real: Time Principle',
      'Present = lim(Δt→0) dReality/dt: Differential boundary',
      'Reality(t) = F(Potential, Laws): Flow operator',
      'Emergence = lim(n→∞) F^(n)(x₀): Iterative manifestation'
    ]
  },
  {
    domain: 'time_principle',
    symbols: {
      'Now': 'Present moment operator',
      'Δt': 'Infinitesimal time slice',
      'Ψ_future': 'Unfixed possibility field',
      'Ψ_real': 'Crystallized reality',
      'F': 'Universal transformation function',
      'x_t': 'Current state (committed)',
      'x_{t-1}': 'Previous state (past)',
      'Potential': 'All possible states',
      'Laws': 'Governing constraints (Λ)'
    },
    conventions: [
      'Present = lim(Δt→0) dReality/dt: Differential boundary',
      'Now = Collapse(Ψ_future) → Ψ_real: Quantum-like measurement',
      'Now(x) = f(x_{t-1}) → x_t: Algorithmic commit step',
      'Reality(t) = F(Potential, Laws): Flow operator execution',
      'The Now is the only place where energy moves, objects interact, consciousness perceives'
    ]
  },
  {
    domain: 'linguistic_geometry',
    symbols: {
      'L_n': 'Letter surface (n = ordinal 1-26)',
      'W(u,v)': 'Word composition surface',
      'ordinal': 'Letter position (A=1, Z=26)',
      'phonetic': 'vowel or consonant classification',
      'semantic': 'Meaning/interpretation of letter/word',
      'Blend()': 'Letter combination operator',
      'rhythm': 'Cadence and flow energy',
      'grammar': 'Structural constraints (Λ)'
    },
    conventions: [
      'Vowels (A,E,I,O,U): Smooth/flowing surfaces, openness',
      'Consonants (B-Z except vowels): Angular/structured surfaces',
      'Ordinal affects complexity: higher = more intricate',
      'Word_Surface = Blend(Letter₁, Letter₂, ..., Letterₙ)',
      'GEIA alignment: G=letters, E=rhythm, I=meaning, Λ=grammar'
    ]
  }
];

export class GlobalVariableOntologyEngine {
  private ontology = GLOBAL_VARIABLE_ONTOLOGY;
  private domainMappings = DOMAIN_MAPPINGS;

  translateVariable(symbol: string, fromDomain: string, toDomain: string): {
    translatedSymbol: string;
    semanticShift: string;
    confidenceScore: number;
    warnings: string[];
  } {
    const warnings: string[] = [];
    let translatedSymbol = symbol;
    let semanticShift = 'identical';
    let confidenceScore = 1.0;

    const varDef = this.findVariableDefinition(symbol);
    
    if (!varDef) {
      warnings.push(`Symbol '${symbol}' not found in ontology`);
      return { translatedSymbol: symbol, semanticShift: 'unknown', confidenceScore: 0.3, warnings };
    }

    const fromInterp = varDef.physicalInterpretation[fromDomain];
    const toInterp = varDef.physicalInterpretation[toDomain];

    if (fromInterp && toInterp) {
      if (fromInterp === toInterp) {
        semanticShift = 'identical';
        confidenceScore = 1.0;
      } else {
        semanticShift = `${fromInterp} → ${toInterp}`;
        confidenceScore = 0.8;
        warnings.push(`Semantic meaning changes between domains`);
      }
    } else if (!toInterp) {
      semanticShift = 'domain_extension';
      confidenceScore = 0.6;
      warnings.push(`Target domain '${toDomain}' not defined for this variable`);
    }

    return { translatedSymbol, semanticShift, confidenceScore, warnings };
  }

  findVariableDefinition(symbol: string): VariableDefinition | null {
    const lowerSymbol = symbol.toLowerCase();
    
    for (const [key, def] of Object.entries(this.ontology)) {
      if (key.toLowerCase() === lowerSymbol || 
          def.canonical.toLowerCase() === lowerSymbol ||
          def.aliases.map(a => a.toLowerCase()).includes(lowerSymbol)) {
        return def;
      }
    }
    return null;
  }

  getUnifiedSymbolTable(domains: string[]): Record<string, {
    symbol: string;
    interpretations: Record<string, string>;
    conflicts: string[];
  }> {
    const unified: Record<string, any> = {};

    for (const [key, def] of Object.entries(this.ontology)) {
      const relevantDomains = domains.filter(d => 
        def.domain.includes(d) || Object.keys(def.physicalInterpretation).includes(d)
      );

      if (relevantDomains.length > 0) {
        const interpretations: Record<string, string> = {};
        relevantDomains.forEach(d => {
          if (def.physicalInterpretation[d]) {
            interpretations[d] = def.physicalInterpretation[d];
          }
        });

        const conflicts: string[] = [];
        const interpValues = Object.values(interpretations);
        const uniqueValues = interpValues.filter((v, i, arr) => arr.indexOf(v) === i);
        if (uniqueValues.length > 1) {
          conflicts.push('Multiple interpretations exist - verify context');
        }

        unified[key] = {
          symbol: def.canonical,
          interpretations,
          conflicts
        };
      }
    }

    return unified;
  }

  validateCrossdomainFormula(
    formula: string, 
    sourceDomain: string, 
    targetDomain: string
  ): {
    isValid: boolean;
    symbolMappings: Record<string, { from: string; to: string; confidence: number }>;
    warnings: string[];
    recommendations: string[];
  } {
    const symbolMappings: Record<string, any> = {};
    const warnings: string[] = [];
    const recommendations: string[] = [];

    const symbols = formula.match(/[a-zA-Zα-ωΑ-Ω_]+/g) || [];
    const uniqueSymbols = [...new Set(symbols)];

    for (const symbol of uniqueSymbols) {
      const translation = this.translateVariable(symbol, sourceDomain, targetDomain);
      symbolMappings[symbol] = {
        from: symbol,
        to: translation.translatedSymbol,
        confidence: translation.confidenceScore
      };
      warnings.push(...translation.warnings);
    }

    const avgConfidence = Object.values(symbolMappings).reduce(
      (sum: number, m: any) => sum + m.confidence, 0
    ) / Object.keys(symbolMappings).length;

    if (avgConfidence < 0.7) {
      recommendations.push('Consider explicit variable renaming for clarity');
    }

    return {
      isValid: avgConfidence > 0.5,
      symbolMappings,
      warnings,
      recommendations
    };
  }

  generateOntologyReport(): string {
    let report = '═══════════════════════════════════════════════════════════════\n';
    report += '              GLOBAL VARIABLE ONTOLOGY REPORT\n';
    report += '              DMENSION MATHEMATICAL UNIVERSE\n';
    report += '═══════════════════════════════════════════════════════════════\n\n';

    report += `Total Variables Defined: ${Object.keys(this.ontology).length}\n`;
    report += `Domain Mappings: ${this.domainMappings.length}\n\n`;

    report += '───────────────────────────────────────────────────────────────\n';
    report += '                    CANONICAL SYMBOLS\n';
    report += '───────────────────────────────────────────────────────────────\n\n';

    for (const [key, def] of Object.entries(this.ontology)) {
      report += `${def.canonical} (${key})\n`;
      report += `  Aliases: ${def.aliases.join(', ')}\n`;
      report += `  Type: ${def.dataType}\n`;
      report += `  Range: ${JSON.stringify(def.range)}\n`;
      report += `  Meaning: ${def.semanticMeaning}\n`;
      report += `  Domains: ${def.domain.join(', ')}\n`;
      report += '\n';
    }

    report += '───────────────────────────────────────────────────────────────\n';
    report += '                    DOMAIN CONVENTIONS\n';
    report += '───────────────────────────────────────────────────────────────\n\n';

    for (const mapping of this.domainMappings) {
      report += `${mapping.domain.toUpperCase()}\n`;
      for (const conv of mapping.conventions) {
        report += `  • ${conv}\n`;
      }
      report += '\n';
    }

    return report;
  }
}

export const globalVariableOntology = new GlobalVariableOntologyEngine();

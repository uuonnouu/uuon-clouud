/**
 * DOMAIN WEIGHTING SYSTEM (Truth Weighting)
 * Assigns significance weights to formulas based on physical/mathematical truth
 * 
 * Addresses publication weakness 5.4: "Some formulas are more meaningful physically"
 * Provides domain-specific weighting for formula significance
 * 
 * @author UUON Foundation
 * @license Proprietary
 */

export type WeightingCategory = 
  | 'fundamental_law'      // Newton, Einstein, Maxwell, Schrödinger (highest)
  | 'derived_principle'    // Derived from fundamental laws
  | 'empirical_model'      // Based on experimental data
  | 'engineering_formula'  // Practical engineering approximations
  | 'mathematical_form'    // Pure mathematical construction
  | 'heuristic'            // Rules of thumb
  | 'aesthetic';           // Visual/artistic priority

export interface FormulaWeight {
  formulaId: string;
  category: WeightingCategory;
  physicalWeight: number;       // 0-1: How physically meaningful
  mathematicalWeight: number;   // 0-1: How mathematically rigorous
  engineeringWeight: number;    // 0-1: How practically useful
  aestheticWeight: number;      // 0-1: How visually interesting
  compositeWeight: number;      // Weighted combination
  justification: string;
  citations: string[];
}

export interface DomainWeightProfile {
  domain: string;
  priorityMatrix: {
    physicalWeight: number;
    mathematicalWeight: number;
    engineeringWeight: number;
    aestheticWeight: number;
  };
  description: string;
}

export const DOMAIN_WEIGHT_PROFILES: Record<string, DomainWeightProfile> = {
  'thermal_engineering': {
    domain: 'thermal_engineering',
    priorityMatrix: {
      physicalWeight: 0.30,
      mathematicalWeight: 0.20,
      engineeringWeight: 0.40,
      aestheticWeight: 0.10
    },
    description: 'Engineering applications prioritize practical utility'
  },
  'quantum_physics': {
    domain: 'quantum_physics',
    priorityMatrix: {
      physicalWeight: 0.45,
      mathematicalWeight: 0.35,
      engineeringWeight: 0.10,
      aestheticWeight: 0.10
    },
    description: 'Quantum domain emphasizes physical truth and mathematical rigor'
  },
  'general_relativity': {
    domain: 'general_relativity',
    priorityMatrix: {
      physicalWeight: 0.50,
      mathematicalWeight: 0.35,
      engineeringWeight: 0.05,
      aestheticWeight: 0.10
    },
    description: 'Relativity prioritizes fundamental physics'
  },
  'geometry': {
    domain: 'geometry',
    priorityMatrix: {
      physicalWeight: 0.15,
      mathematicalWeight: 0.45,
      engineeringWeight: 0.15,
      aestheticWeight: 0.25
    },
    description: 'Geometric domain values mathematical elegance and aesthetics'
  },
  'harmonic_analysis': {
    domain: 'harmonic_analysis',
    priorityMatrix: {
      physicalWeight: 0.20,
      mathematicalWeight: 0.50,
      engineeringWeight: 0.15,
      aestheticWeight: 0.15
    },
    description: 'Harmonic analysis emphasizes mathematical structure'
  },
  'visualization': {
    domain: 'visualization',
    priorityMatrix: {
      physicalWeight: 0.10,
      mathematicalWeight: 0.20,
      engineeringWeight: 0.20,
      aestheticWeight: 0.50
    },
    description: 'Visualization prioritizes visual impact'
  }
};

export const CATEGORY_BASE_WEIGHTS: Record<WeightingCategory, {
  physical: number;
  mathematical: number;
  engineering: number;
  aesthetic: number;
}> = {
  'fundamental_law': {
    physical: 1.0,
    mathematical: 0.95,
    engineering: 0.7,
    aesthetic: 0.6
  },
  'derived_principle': {
    physical: 0.85,
    mathematical: 0.85,
    engineering: 0.75,
    aesthetic: 0.5
  },
  'empirical_model': {
    physical: 0.7,
    mathematical: 0.6,
    engineering: 0.9,
    aesthetic: 0.4
  },
  'engineering_formula': {
    physical: 0.5,
    mathematical: 0.5,
    engineering: 0.95,
    aesthetic: 0.3
  },
  'mathematical_form': {
    physical: 0.3,
    mathematical: 0.9,
    engineering: 0.4,
    aesthetic: 0.7
  },
  'heuristic': {
    physical: 0.4,
    mathematical: 0.3,
    engineering: 0.8,
    aesthetic: 0.2
  },
  'aesthetic': {
    physical: 0.2,
    mathematical: 0.5,
    engineering: 0.2,
    aesthetic: 1.0
  }
};

export const FORMULA_TRUTH_REGISTRY: Record<string, {
  category: WeightingCategory;
  justification: string;
  citations: string[];
}> = {
  'einstein_field_equations': {
    category: 'fundamental_law',
    justification: 'Core equation of General Relativity: Gμν + Λgμν = (8πG/c⁴)Tμν',
    citations: ['Einstein (1915)', 'Misner, Thorne, Wheeler (1973)']
  },
  'schrodinger_equation': {
    category: 'fundamental_law',
    justification: 'Fundamental equation of quantum mechanics: iℏ∂ψ/∂t = Ĥψ',
    citations: ['Schrödinger (1926)', 'Dirac (1930)']
  },
  'navier_stokes_momentum': {
    category: 'fundamental_law',
    justification: 'Conservation of momentum for viscous fluids',
    citations: ['Navier (1822)', 'Stokes (1845)']
  },
  'heat_equation': {
    category: 'fundamental_law',
    justification: 'Fourier heat conduction: ∂T/∂t = α∇²T',
    citations: ['Fourier (1822)']
  },
  'cop_coefficient_performance': {
    category: 'engineering_formula',
    justification: 'Practical cooling efficiency metric from thermodynamics',
    citations: ['ASHRAE Handbook']
  },
  'polynomial_cop_surface': {
    category: 'empirical_model',
    justification: 'Polynomial fit to measured chiller performance data',
    citations: ['DOE Building Energy Codes', 'AHRI Standards']
  },
  'spherical_harmonic_cop': {
    category: 'mathematical_form',
    justification: 'Spherical harmonic expansion applied to efficiency surfaces',
    citations: ['UUON Foundation (2025)']
  },
  'unified_polar_field': {
    category: 'mathematical_form',
    justification: 'Universal cross-domain polar field generator',
    citations: ['UUON Foundation (2025)']
  },
  'interference_enhanced_cooling': {
    category: 'derived_principle',
    justification: 'Wave interference applied to thermal optimization',
    citations: ['UUON Foundation (2025)']
  }
};

export class DomainWeightingEngine {
  private profiles = DOMAIN_WEIGHT_PROFILES;
  private categoryWeights = CATEGORY_BASE_WEIGHTS;
  private truthRegistry = FORMULA_TRUTH_REGISTRY;
  private weights: Map<string, FormulaWeight> = new Map();

  calculateFormulaWeight(
    formulaId: string,
    targetDomain: string,
    overrideCategory?: WeightingCategory
  ): FormulaWeight {
    const registry = this.truthRegistry[formulaId];
    const category = overrideCategory || registry?.category || 'mathematical_form';
    const baseWeights = this.categoryWeights[category];
    const profile = this.profiles[targetDomain] || this.profiles['geometry'];

    const physicalWeight = baseWeights.physical;
    const mathematicalWeight = baseWeights.mathematical;
    const engineeringWeight = baseWeights.engineering;
    const aestheticWeight = baseWeights.aesthetic;

    const compositeWeight = 
      physicalWeight * profile.priorityMatrix.physicalWeight +
      mathematicalWeight * profile.priorityMatrix.mathematicalWeight +
      engineeringWeight * profile.priorityMatrix.engineeringWeight +
      aestheticWeight * profile.priorityMatrix.aestheticWeight;

    const weight: FormulaWeight = {
      formulaId,
      category,
      physicalWeight,
      mathematicalWeight,
      engineeringWeight,
      aestheticWeight,
      compositeWeight,
      justification: registry?.justification || 'Unregistered formula',
      citations: registry?.citations || []
    };

    this.weights.set(formulaId, weight);
    return weight;
  }

  rankFormulasForDomain(formulaIds: string[], domain: string): {
    formulaId: string;
    rank: number;
    compositeWeight: number;
    category: WeightingCategory;
  }[] {
    const weights = formulaIds.map(id => this.calculateFormulaWeight(id, domain));
    
    return weights
      .sort((a, b) => b.compositeWeight - a.compositeWeight)
      .map((w, index) => ({
        formulaId: w.formulaId,
        rank: index + 1,
        compositeWeight: w.compositeWeight,
        category: w.category
      }));
  }

  getFusionTruthScore(formula1Id: string, formula2Id: string, domain: string): {
    score: number;
    recommendation: string;
    warnings: string[];
  } {
    const weight1 = this.calculateFormulaWeight(formula1Id, domain);
    const weight2 = this.calculateFormulaWeight(formula2Id, domain);
    const warnings: string[] = [];

    const avgPhysical = (weight1.physicalWeight + weight2.physicalWeight) / 2;
    const avgMath = (weight1.mathematicalWeight + weight2.mathematicalWeight) / 2;
    
    const categoryDiff = Math.abs(
      Object.keys(CATEGORY_BASE_WEIGHTS).indexOf(weight1.category) -
      Object.keys(CATEGORY_BASE_WEIGHTS).indexOf(weight2.category)
    );

    let score = (avgPhysical + avgMath) / 2;
    
    if (categoryDiff > 2) {
      score *= 0.8;
      warnings.push('Large category gap - fusion may lose physical meaning');
    }

    if (weight1.category === 'fundamental_law' || weight2.category === 'fundamental_law') {
      if (weight1.category !== weight2.category) {
        warnings.push('Fusing with fundamental law - preserve physical constraints');
      }
    }

    let recommendation = 'Proceed with fusion';
    if (score < 0.5) {
      recommendation = 'Consider alternative fusion partners';
    } else if (score < 0.7) {
      recommendation = 'Fusion viable with careful parameter tuning';
    } else if (score >= 0.85) {
      recommendation = 'Excellent fusion candidate - high truth preservation';
    }

    return { score, recommendation, warnings };
  }

  registerFormula(
    formulaId: string,
    category: WeightingCategory,
    justification: string,
    citations: string[] = []
  ): void {
    (this.truthRegistry as Record<string, any>)[formulaId] = {
      category,
      justification,
      citations
    };
  }

  generateWeightingReport(domain: string): string {
    let report = '═══════════════════════════════════════════════════════════════\n';
    report += '              DOMAIN WEIGHTING SYSTEM REPORT\n';
    report += `              Domain: ${domain.toUpperCase()}\n`;
    report += '═══════════════════════════════════════════════════════════════\n\n';

    const profile = this.profiles[domain];
    if (profile) {
      report += 'PRIORITY MATRIX:\n';
      report += `  Physical Weight:     ${(profile.priorityMatrix.physicalWeight * 100).toFixed(0)}%\n`;
      report += `  Mathematical Weight: ${(profile.priorityMatrix.mathematicalWeight * 100).toFixed(0)}%\n`;
      report += `  Engineering Weight:  ${(profile.priorityMatrix.engineeringWeight * 100).toFixed(0)}%\n`;
      report += `  Aesthetic Weight:    ${(profile.priorityMatrix.aestheticWeight * 100).toFixed(0)}%\n`;
      report += `\nDescription: ${profile.description}\n\n`;
    }

    report += '───────────────────────────────────────────────────────────────\n';
    report += '                    REGISTERED FORMULAS\n';
    report += '───────────────────────────────────────────────────────────────\n\n';

    const formulas = Object.keys(this.truthRegistry);
    const ranked = this.rankFormulasForDomain(formulas, domain);

    for (const item of ranked) {
      const reg = this.truthRegistry[item.formulaId];
      report += `#${item.rank}. ${item.formulaId}\n`;
      report += `    Category: ${item.category}\n`;
      report += `    Composite Weight: ${(item.compositeWeight * 100).toFixed(1)}%\n`;
      if (reg) {
        report += `    Justification: ${reg.justification}\n`;
        if (reg.citations.length > 0) {
          report += `    Citations: ${reg.citations.join(', ')}\n`;
        }
      }
      report += '\n';
    }

    return report;
  }

  getStatistics(): {
    totalRegistered: number;
    byCategory: Record<WeightingCategory, number>;
    averageWeights: Record<string, number>;
  } {
    const byCategory: Record<WeightingCategory, number> = {
      'fundamental_law': 0,
      'derived_principle': 0,
      'empirical_model': 0,
      'engineering_formula': 0,
      'mathematical_form': 0,
      'heuristic': 0,
      'aesthetic': 0
    };

    for (const reg of Object.values(this.truthRegistry)) {
      byCategory[reg.category]++;
    }

    const cachedWeights = Array.from(this.weights.values());
    const avgPhysical = cachedWeights.length > 0 
      ? cachedWeights.reduce((s, w) => s + w.physicalWeight, 0) / cachedWeights.length 
      : 0;
    const avgMath = cachedWeights.length > 0
      ? cachedWeights.reduce((s, w) => s + w.mathematicalWeight, 0) / cachedWeights.length
      : 0;
    const avgEng = cachedWeights.length > 0
      ? cachedWeights.reduce((s, w) => s + w.engineeringWeight, 0) / cachedWeights.length
      : 0;

    return {
      totalRegistered: Object.keys(this.truthRegistry).length,
      byCategory,
      averageWeights: {
        physical: avgPhysical,
        mathematical: avgMath,
        engineering: avgEng
      }
    };
  }
}

export const domainWeightingEngine = new DomainWeightingEngine();

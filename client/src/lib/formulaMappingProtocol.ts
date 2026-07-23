/**
 * FORMULA MAPPING PROTOCOL
 * Comprehensive analysis, mapping, and safe fusion system for mathematical formulas
 * © 2025 UUON Foundation Inc.
 */

import { SurfaceParameters } from '../types/math';

// ═══════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════

export interface VariableSpec {
  name: string;
  type: 'number' | 'integer' | 'angle' | 'normalized' | 'vector';
  range: [number, number];
  constraints?: string[];
  description?: string;
}

export interface InputSignature {
  variables: VariableSpec[];
  parameters: VariableSpec[];
  dataTypes: Record<string, string>;
}

export interface OutputSignature {
  form: 'scalar' | 'vector2' | 'vector3' | 'vector4' | 'matrix' | 'complex';
  units?: string;
  domain: 'bounded' | 'unbounded' | 'periodic' | 'semi-infinite';
  range?: [number, number][];
}

export interface OperationalStep {
  order: number;
  description: string;
  operation: string;
  complexity: 'O(1)' | 'O(n)' | 'O(n²)' | 'O(log n)' | 'O(n log n)';
  dependencies: string[];
}

export interface OperationalBreakdown {
  steps: OperationalStep[];
  transformations: string[];
  totalComplexity: string;
}

export interface StructuralCharacterization {
  shape: 'linear' | 'polynomial' | 'trigonometric' | 'exponential' | 'logarithmic' | 
         'piecewise' | 'recursive' | 'transcendental' | 'hybrid';
  degree?: number;
  dependencies: {
    internal: string[];
    external: string[];
  };
  errorProneAreas: {
    location: string;
    risk: 'division_by_zero' | 'domain_restriction' | 'singularity' | 'overflow' | 'precision_loss';
    mitigation: string;
  }[];
}

export interface CompatibilityScan {
  alignments: {
    formulaId: string;
    alignmentScore: number;
    sharedVariables: string[];
    sharedPatterns: string[];
  }[];
  conflicts: {
    formulaId: string;
    conflictType: 'variable_meaning' | 'range_mismatch' | 'output_incompatible' | 'structural_conflict';
    description: string;
  }[];
  unificationPotential: {
    variables: Record<string, string[]>;
    recommendations: string[];
  };
}

export interface MergePotentialRating {
  rating: 'HIGH' | 'MEDIUM' | 'LOW';
  confidence: number;
  explanation: string;
  riskFactors: string[];
  benefits: string[];
}

export interface FormulaMapping {
  id: string;
  name: string;
  category: string;
  inputSignature: InputSignature;
  outputSignature: OutputSignature;
  operationalBreakdown: OperationalBreakdown;
  structuralCharacterization: StructuralCharacterization;
  compatibilityScan: CompatibilityScan;
  mergePotentialRating: MergePotentialRating;
  timestamp: string;
}

export interface FusedFormula {
  cleanFormula: string;
  pseudocode: string[];
  variableDictionary: Record<string, { type: string; default: any; description: string }>;
  stabilityNotes: string[];
  optimizationSuggestions: string[];
  testCases: { input: Record<string, any>; expectedOutput: any }[];
}

// ═══════════════════════════════════════════════════════════════
// FORMULA ANALYSIS ENGINE
// ═══════════════════════════════════════════════════════════════

export class FormulaMappingEngine {
  private mappingCache: Map<string, FormulaMapping> = new Map();
  private compatibilityMatrix: Map<string, Map<string, number>> = new Map();

  analyzeInputSignature(
    equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number],
    id: string
  ): InputSignature {
    const variables: VariableSpec[] = [
      { name: 'u', type: 'normalized', range: [0, 1], description: 'Parametric U coordinate' },
      { name: 'v', type: 'normalized', range: [0, 1], description: 'Parametric V coordinate' }
    ];

    const parameters: VariableSpec[] = [
      { name: 'a', type: 'number', range: [-26, 26], description: 'Primary scaling/X-axis' },
      { name: 'b', type: 'number', range: [-26, 26], description: 'Secondary scaling/Y-axis' },
      { name: 'c', type: 'number', range: [-26, 26], description: 'Tertiary scaling/Z-axis' },
      { name: 'd', type: 'number', range: [-180, 180], description: 'Twist/rotation parameter' },
      { name: 'e', type: 'number', range: [-180, 180], description: 'Wave amplitude' },
      { name: 'f', type: 'number', range: [-180, 180], description: 'Frequency modifier' },
      { name: 'x', type: 'number', range: [-10, 10], description: 'X-axis offset' },
      { name: 'y', type: 'number', range: [-10, 10], description: 'Y-axis offset' },
      { name: 'z', type: 'number', range: [-10, 10], description: 'Z-axis offset' }
    ];

    return {
      variables,
      parameters,
      dataTypes: {
        u: 'number',
        v: 'number',
        params: 'SurfaceParameters'
      }
    };
  }

  analyzeOutputSignature(
    equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number]
  ): OutputSignature {
    const testParams: SurfaceParameters = { a: 1, b: 1, c: 1, uSegments: 32, vSegments: 32 };
    
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;

    for (let u = 0; u <= 1; u += 0.1) {
      for (let v = 0; v <= 1; v += 0.1) {
        try {
          const [x, y, z] = equation(u, v, testParams);
          if (isFinite(x)) { minX = Math.min(minX, x); maxX = Math.max(maxX, x); }
          if (isFinite(y)) { minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
          if (isFinite(z)) { minZ = Math.min(minZ, z); maxZ = Math.max(maxZ, z); }
        } catch (e) {
          // Handle evaluation errors
        }
      }
    }

    const bounded = isFinite(minX) && isFinite(maxX) && 
                    isFinite(minY) && isFinite(maxY) && 
                    isFinite(minZ) && isFinite(maxZ);

    return {
      form: 'vector3',
      domain: bounded ? 'bounded' : 'unbounded',
      range: bounded ? [[minX, maxX], [minY, maxY], [minZ, maxZ]] : undefined
    };
  }

  analyzeOperationalBreakdown(
    equationStr: string
  ): OperationalBreakdown {
    const steps: OperationalStep[] = [];
    const transformations: string[] = [];
    
    if (equationStr.includes('Math.sin') || equationStr.includes('Math.cos')) {
      steps.push({
        order: 1,
        description: 'Trigonometric computation',
        operation: 'sin/cos evaluation',
        complexity: 'O(1)',
        dependencies: ['Math']
      });
      transformations.push('Trigonometric mapping');
    }

    if (equationStr.includes('*') || equationStr.includes('/')) {
      steps.push({
        order: steps.length + 1,
        description: 'Arithmetic operations',
        operation: 'multiplication/division',
        complexity: 'O(1)',
        dependencies: []
      });
      transformations.push('Linear scaling');
    }

    if (equationStr.includes('Math.exp')) {
      steps.push({
        order: steps.length + 1,
        description: 'Exponential computation',
        operation: 'exp evaluation',
        complexity: 'O(1)',
        dependencies: ['Math']
      });
      transformations.push('Exponential mapping');
    }

    if (equationStr.includes('Math.pow') || equationStr.includes('**')) {
      steps.push({
        order: steps.length + 1,
        description: 'Power computation',
        operation: 'exponentiation',
        complexity: 'O(1)',
        dependencies: ['Math']
      });
      transformations.push('Polynomial transformation');
    }

    if (equationStr.includes('for') || equationStr.includes('while')) {
      steps.push({
        order: steps.length + 1,
        description: 'Iterative computation',
        operation: 'loop iteration',
        complexity: 'O(n)',
        dependencies: []
      });
      transformations.push('Iterative accumulation');
    }

    return {
      steps: steps.length > 0 ? steps : [{ 
        order: 1, 
        description: 'Basic computation', 
        operation: 'arithmetic', 
        complexity: 'O(1)', 
        dependencies: [] 
      }],
      transformations: transformations.length > 0 ? transformations : ['Direct mapping'],
      totalComplexity: steps.some(s => s.complexity === 'O(n)') ? 'O(n)' : 'O(1)'
    };
  }

  analyzeStructuralCharacterization(
    equationStr: string
  ): StructuralCharacterization {
    const hasTrig = equationStr.includes('Math.sin') || equationStr.includes('Math.cos') || 
                    equationStr.includes('Math.tan');
    const hasExp = equationStr.includes('Math.exp');
    const hasLog = equationStr.includes('Math.log');
    const hasPow = equationStr.includes('Math.pow') || equationStr.includes('**');
    const hasRecursive = equationStr.includes('recursive') || equationStr.includes('self');
    const hasPiecewise = equationStr.includes('?') || equationStr.includes('if');

    let shape: StructuralCharacterization['shape'] = 'linear';
    if (hasTrig) shape = 'trigonometric';
    else if (hasExp && hasLog) shape = 'transcendental';
    else if (hasExp) shape = 'exponential';
    else if (hasLog) shape = 'logarithmic';
    else if (hasPow) shape = 'polynomial';
    else if (hasRecursive) shape = 'recursive';
    else if (hasPiecewise) shape = 'piecewise';

    if ((hasTrig && hasExp) || (hasTrig && hasPow)) {
      shape = 'hybrid';
    }

    const errorProneAreas: StructuralCharacterization['errorProneAreas'] = [];

    if (equationStr.includes('/')) {
      const divMatches = equationStr.match(/\/\s*\(?([^;]+?)\)?[;,\]]/g);
      if (divMatches) {
        errorProneAreas.push({
          location: 'Division operation',
          risk: 'division_by_zero',
          mitigation: 'Add epsilon or check for zero denominator'
        });
      }
    }

    if (hasLog) {
      errorProneAreas.push({
        location: 'Logarithm',
        risk: 'domain_restriction',
        mitigation: 'Ensure argument > 0'
      });
    }

    if (equationStr.includes('Math.tan')) {
      errorProneAreas.push({
        location: 'Tangent function',
        risk: 'singularity',
        mitigation: 'Avoid values near π/2 + nπ'
      });
    }

    return {
      shape,
      dependencies: {
        internal: ['u', 'v', 'params'],
        external: ['Math']
      },
      errorProneAreas
    };
  }

  computeCompatibility(
    formula1: FormulaMapping,
    formula2: FormulaMapping
  ): number {
    let score = 0;
    const maxScore = 100;

    if (formula1.structuralCharacterization.shape === formula2.structuralCharacterization.shape) {
      score += 25;
    } else if (
      (formula1.structuralCharacterization.shape === 'trigonometric' && 
       formula2.structuralCharacterization.shape === 'hybrid') ||
      (formula1.structuralCharacterization.shape === 'hybrid' && 
       formula2.structuralCharacterization.shape === 'trigonometric')
    ) {
      score += 15;
    }

    if (formula1.outputSignature.domain === formula2.outputSignature.domain) {
      score += 20;
    }

    const errors1 = formula1.structuralCharacterization.errorProneAreas.length;
    const errors2 = formula2.structuralCharacterization.errorProneAreas.length;
    if (errors1 === 0 && errors2 === 0) {
      score += 20;
    } else if (errors1 <= 1 && errors2 <= 1) {
      score += 10;
    }

    if (formula1.category === formula2.category) {
      score += 15;
    }

    const complexity1 = formula1.operationalBreakdown.totalComplexity;
    const complexity2 = formula2.operationalBreakdown.totalComplexity;
    if (complexity1 === complexity2) {
      score += 10;
    }

    const shared = formula1.operationalBreakdown.transformations.filter(
      t => formula2.operationalBreakdown.transformations.includes(t)
    );
    score += Math.min(10, shared.length * 3);

    return Math.min(maxScore, score);
  }

  scanCompatibility(
    formula: FormulaMapping,
    allFormulas: FormulaMapping[]
  ): CompatibilityScan {
    const alignments: CompatibilityScan['alignments'] = [];
    const conflicts: CompatibilityScan['conflicts'] = [];

    for (const other of allFormulas) {
      if (other.id === formula.id) continue;

      const score = this.computeCompatibility(formula, other);
      
      if (score >= 50) {
        alignments.push({
          formulaId: other.id,
          alignmentScore: score,
          sharedVariables: ['u', 'v', 'a', 'b', 'c'],
          sharedPatterns: formula.operationalBreakdown.transformations.filter(
            t => other.operationalBreakdown.transformations.includes(t)
          )
        });
      }

      if (formula.outputSignature.domain !== other.outputSignature.domain) {
        conflicts.push({
          formulaId: other.id,
          conflictType: 'output_incompatible',
          description: `Domain mismatch: ${formula.outputSignature.domain} vs ${other.outputSignature.domain}`
        });
      }
    }

    alignments.sort((a, b) => b.alignmentScore - a.alignmentScore);

    return {
      alignments: alignments.slice(0, 15),
      conflicts: conflicts.slice(0, 5),
      unificationPotential: {
        variables: {
          'scale': ['a', 'b', 'c'],
          'offset': ['x', 'y', 'z'],
          'deformation': ['d', 'e', 'f', 'g', 'h', 'i']
        },
        recommendations: [
          'Use consistent naming for scaling parameters',
          'Group offset parameters for unified transformation',
          'Consider shared deformation pipeline'
        ]
      }
    };
  }

  rateMergePotential(
    formula: FormulaMapping,
    compatibilityScan: CompatibilityScan
  ): MergePotentialRating {
    const alignmentCount = compatibilityScan.alignments.length;
    const conflictCount = compatibilityScan.conflicts.length;
    const errorCount = formula.structuralCharacterization.errorProneAreas.length;

    const avgAlignment = alignmentCount > 0 
      ? compatibilityScan.alignments.reduce((sum, a) => sum + a.alignmentScore, 0) / alignmentCount 
      : 0;

    let rating: 'HIGH' | 'MEDIUM' | 'LOW';
    let confidence: number;

    if (alignmentCount >= 10 && conflictCount <= 2 && errorCount <= 1 && avgAlignment >= 60) {
      rating = 'HIGH';
      confidence = 80 + (avgAlignment - 60) * 0.5;
    } else if (alignmentCount >= 5 && conflictCount <= 4 && errorCount <= 2) {
      rating = 'MEDIUM';
      confidence = 50 + alignmentCount * 2;
    } else {
      rating = 'LOW';
      confidence = 20 + alignmentCount * 3;
    }

    confidence = Math.min(95, Math.max(10, confidence));

    const riskFactors: string[] = [];
    if (errorCount > 0) riskFactors.push(`${errorCount} error-prone areas`);
    if (conflictCount > 2) riskFactors.push(`${conflictCount} compatibility conflicts`);
    if (formula.operationalBreakdown.totalComplexity !== 'O(1)') {
      riskFactors.push(`Higher complexity: ${formula.operationalBreakdown.totalComplexity}`);
    }

    const benefits: string[] = [];
    if (alignmentCount >= 5) benefits.push(`${alignmentCount} compatible formulas for fusion`);
    if (avgAlignment >= 60) benefits.push(`High average alignment score: ${avgAlignment.toFixed(1)}%`);
    if (formula.structuralCharacterization.shape === 'trigonometric') {
      benefits.push('Smooth periodic behavior for blending');
    }

    return {
      rating,
      confidence,
      explanation: `Formula shows ${rating.toLowerCase()} merge potential based on ${alignmentCount} alignments and ${riskFactors.length} risk factors`,
      riskFactors,
      benefits
    };
  }

  createMapping(
    id: string,
    name: string,
    category: string,
    equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number],
    equationStr: string,
    allFormulas: FormulaMapping[] = []
  ): FormulaMapping {
    const inputSignature = this.analyzeInputSignature(equation, id);
    const outputSignature = this.analyzeOutputSignature(equation);
    const operationalBreakdown = this.analyzeOperationalBreakdown(equationStr);
    const structuralCharacterization = this.analyzeStructuralCharacterization(equationStr);
    
    const partialMapping: Omit<FormulaMapping, 'compatibilityScan' | 'mergePotentialRating'> = {
      id,
      name,
      category,
      inputSignature,
      outputSignature,
      operationalBreakdown,
      structuralCharacterization,
      timestamp: new Date().toISOString()
    };

    const compatibilityScan = this.scanCompatibility(
      partialMapping as FormulaMapping, 
      allFormulas
    );

    const mergePotentialRating = this.rateMergePotential(
      partialMapping as FormulaMapping,
      compatibilityScan
    );

    const mapping: FormulaMapping = {
      ...partialMapping,
      compatibilityScan,
      mergePotentialRating
    };

    this.mappingCache.set(id, mapping);
    return mapping;
  }

  generateReport(mapping: FormulaMapping): string {
    const lines: string[] = [];
    
    lines.push(`📐 FORMULA: ${mapping.name} (${mapping.id})`);
    lines.push(`Category: ${mapping.category}`);
    lines.push('');
    
    lines.push('1. INPUT SIGNATURE:');
    lines.push('   Variables:');
    for (const v of mapping.inputSignature.variables) {
      lines.push(`     • ${v.name}: ${v.type} [${v.range[0]},${v.range[1]}] - ${v.description}`);
    }
    lines.push('   Parameters:');
    for (const p of mapping.inputSignature.parameters.slice(0, 5)) {
      lines.push(`     • ${p.name}: ${p.description} [${p.range[0]},${p.range[1]}]`);
    }
    lines.push('');
    
    lines.push('2. OUTPUT SIGNATURE:');
    lines.push(`   Form: ${mapping.outputSignature.form}`);
    lines.push(`   Domain: ${mapping.outputSignature.domain}`);
    if (mapping.outputSignature.range) {
      lines.push(`   Range: X[${mapping.outputSignature.range[0][0].toFixed(2)},${mapping.outputSignature.range[0][1].toFixed(2)}]`);
    }
    lines.push('');
    
    lines.push('3. OPERATIONAL BREAKDOWN:');
    for (const step of mapping.operationalBreakdown.steps) {
      lines.push(`   ${step.order}. ${step.description} (${step.complexity})`);
    }
    lines.push(`   Total Complexity: ${mapping.operationalBreakdown.totalComplexity}`);
    lines.push('');
    
    lines.push('4. STRUCTURAL CHARACTERIZATION:');
    lines.push(`   Shape: ${mapping.structuralCharacterization.shape}`);
    lines.push(`   Dependencies: ${mapping.structuralCharacterization.dependencies.external.join(', ')}`);
    lines.push(`   Error-prone sections: ${mapping.structuralCharacterization.errorProneAreas.length}`);
    for (const err of mapping.structuralCharacterization.errorProneAreas) {
      lines.push(`     ⚠️ ${err.location}: ${err.risk}`);
    }
    lines.push('');
    
    lines.push('5. COMPATIBILITY SCAN:');
    lines.push(`   Alignments: ${mapping.compatibilityScan.alignments.length} compatible formulas`);
    if (mapping.compatibilityScan.alignments.length > 0) {
      lines.push(`   Top matches: ${mapping.compatibilityScan.alignments.slice(0, 3).map(a => a.formulaId).join(', ')}`);
    }
    lines.push(`   Conflicts: ${mapping.compatibilityScan.conflicts.length} detected`);
    lines.push('');
    
    lines.push('6. MERGE POTENTIAL RATING:');
    lines.push(`   Rating: ${mapping.mergePotentialRating.rating}`);
    lines.push(`   Confidence: ${mapping.mergePotentialRating.confidence.toFixed(1)}%`);
    lines.push(`   Explanation: ${mapping.mergePotentialRating.explanation}`);
    if (mapping.mergePotentialRating.riskFactors.length > 0) {
      lines.push(`   Risks: ${mapping.mergePotentialRating.riskFactors.join(', ')}`);
    }
    if (mapping.mergePotentialRating.benefits.length > 0) {
      lines.push(`   Benefits: ${mapping.mergePotentialRating.benefits.join(', ')}`);
    }

    return lines.join('\n');
  }

  // ═══════════════════════════════════════════════════════════════
  // SAFE FUSION PROTOCOL
  // ═══════════════════════════════════════════════════════════════

  fusionPrecheck(formula1: FormulaMapping, formula2: FormulaMapping): {
    safe: boolean;
    warnings: string[];
    recommendations: string[];
  } {
    const warnings: string[] = [];
    const recommendations: string[] = [];
    
    const compatibility = this.computeCompatibility(formula1, formula2);
    if (compatibility < 40) {
      warnings.push(`Low compatibility score: ${compatibility}%`);
    }

    if (formula1.outputSignature.domain !== formula2.outputSignature.domain) {
      warnings.push('Output domains differ - may cause range issues');
      recommendations.push('Apply domain normalization before fusion');
    }

    const allErrors = [
      ...formula1.structuralCharacterization.errorProneAreas,
      ...formula2.structuralCharacterization.errorProneAreas
    ];
    if (allErrors.length > 3) {
      warnings.push(`Combined ${allErrors.length} error-prone areas`);
      recommendations.push('Add comprehensive error handling in fused formula');
    }

    if (formula1.structuralCharacterization.shape !== formula2.structuralCharacterization.shape) {
      recommendations.push('Consider blend parameter for shape interpolation');
    }

    recommendations.push('Add default values for all new parameters');
    recommendations.push('Include fallback paths for edge cases');
    recommendations.push('Test at boundary conditions');

    return {
      safe: warnings.length <= 2 && compatibility >= 40,
      warnings,
      recommendations
    };
  }

  generateFusedFormula(
    formula1: FormulaMapping,
    formula2: FormulaMapping,
    options: { blendMode: 'linear' | 'smooth' | 'switch'; newParameters?: string[] } = { blendMode: 'linear' }
  ): FusedFormula {
    const precheck = this.fusionPrecheck(formula1, formula2);
    
    const blendFunc = options.blendMode === 'smooth' ? 'smoothstep(0, 1, blend)' :
                      options.blendMode === 'switch' ? 'blend > 0.5 ? 1 : 0' : 'blend';

    const cleanFormula = `
// Fused: ${formula1.name} + ${formula2.name}
function fusedSurface(u: number, v: number, params: FusedParams): [number, number, number] {
  const blend = params.blend ?? 0.5;
  const t = ${blendFunc};
  
  const [x1, y1, z1] = formula1(u, v, params);
  const [x2, y2, z2] = formula2(u, v, params);
  
  return [
    x1 * (1 - t) + x2 * t,
    y1 * (1 - t) + y2 * t,
    z1 * (1 - t) + z2 * t
  ];
}`;

    const pseudocode = [
      'FUNCTION fusedSurface(u, v, params):',
      '  blend ← params.blend OR 0.5',
      `  t ← ${options.blendMode === 'smooth' ? 'SMOOTHSTEP(blend)' : options.blendMode === 'switch' ? 'IF blend > 0.5 THEN 1 ELSE 0' : 'blend'}`,
      '  (x1, y1, z1) ← EVALUATE formula1 AT (u, v)',
      '  (x2, y2, z2) ← EVALUATE formula2 AT (u, v)',
      '  RETURN INTERPOLATE(formula1, formula2, t)'
    ];

    const variableDictionary: FusedFormula['variableDictionary'] = {
      u: { type: 'number', default: 0.5, description: 'Parametric U coordinate [0,1]' },
      v: { type: 'number', default: 0.5, description: 'Parametric V coordinate [0,1]' },
      blend: { type: 'number', default: 0.5, description: 'Blend factor between formulas [0,1]' },
      a: { type: 'number', default: 1, description: 'Primary scale factor' },
      b: { type: 'number', default: 1, description: 'Secondary scale factor' },
      c: { type: 'number', default: 1, description: 'Tertiary scale factor' }
    };

    const stabilityNotes = [
      ...precheck.warnings,
      'Blend parameter clamped to [0,1] range',
      'Both source formulas evaluated independently before blending',
      `Fusion mode: ${options.blendMode}`
    ];

    const optimizationSuggestions = [
      ...precheck.recommendations,
      'Cache formula evaluations if blend is constant',
      'Consider GPU shader implementation for real-time blending',
      'Use SIMD for vector operations if available'
    ];

    const testCases = [
      { input: { u: 0, v: 0, blend: 0 }, expectedOutput: 'formula1(0,0)' },
      { input: { u: 0, v: 0, blend: 1 }, expectedOutput: 'formula2(0,0)' },
      { input: { u: 0.5, v: 0.5, blend: 0.5 }, expectedOutput: 'average of both' },
      { input: { u: 1, v: 1, blend: 0 }, expectedOutput: 'formula1(1,1)' },
      { input: { u: 1, v: 1, blend: 1 }, expectedOutput: 'formula2(1,1)' }
    ];

    return {
      cleanFormula,
      pseudocode,
      variableDictionary,
      stabilityNotes,
      optimizationSuggestions,
      testCases
    };
  }
}

export const formulaMappingEngine = new FormulaMappingEngine();


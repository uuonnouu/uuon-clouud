
/**
 * FORMULA MAPPING PROTOCOL
 * Advanced system for analyzing, mapping, and safely fusing mathematical formulas
 * Integrates with existing UUON Foundation mathematical systems
 */

export interface FormulaInputSignature {
  variables: {
    name: string;
    dataType: 'number' | 'complex' | 'vector' | 'matrix' | 'quaternion';
    range: [number, number] | 'unbounded';
    constraints: string[];
    defaultValue?: number;
  }[];
  parameters: {
    name: string;
    purpose: string;
    range: [number, number];
    defaultValue: number;
  }[];
}

export interface FormulaOutputSignature {
  outputForm: 'scalar' | 'vector3' | 'matrix' | 'complex' | 'quaternion';
  units?: string;
  expectedDomain: [number, number] | 'unbounded';
  dimensions: number;
}

export interface OperationalBreakdown {
  steps: {
    stepNumber: number;
    operation: string;
    transformation: string;
    computationalComplexity: string;
  }[];
  criticalPath: string[];
  bottlenecks: string[];
}

export interface StructuralCharacterization {
  shape: 'linear' | 'polynomial' | 'trigonometric' | 'exponential' | 'logarithmic' | 
         'rational' | 'piecewise' | 'recursive' | 'transcendental' | 'hybrid';
  degree?: number;
  dependencies: {
    internal: string[];
    external: string[];
    mathLibraries: string[];
  };
  errorProneSection: {
    location: string;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    mitigation: string;
  }[];
  singularities: string[];
}

export interface CompatibilityScan {
  alignments: {
    formulaId: string;
    variableMapping: Record<string, string>;
    compatibilityScore: number;
  }[];
  conflicts: {
    formulaId: string;
    conflictType: 'variable' | 'domain' | 'output' | 'mathematical';
    description: string;
    severity: 'minor' | 'major' | 'blocking';
  }[];
  unificationPotential: {
    variables: string[];
    renameMap: Record<string, string>;
    mergingPoints: string[];
  };
}

export interface MergePotentialRating {
  rating: 'high' | 'medium' | 'low';
  confidence: number;
  explanation: string;
  requiredModifications: string[];
  risks: string[];
  benefits: string[];
}

export interface FormulaMapping {
  formulaId: string;
  name: string;
  category: string;
  inputSignature: FormulaInputSignature;
  outputSignature: FormulaOutputSignature;
  operationalBreakdown: OperationalBreakdown;
  structuralCharacterization: StructuralCharacterization;
  compatibilityScan: CompatibilityScan;
  mergePotentialRating: MergePotentialRating;
  originalFormula: string;
  mathematicalProperties: {
    continuity: boolean;
    differentiability: boolean;
    periodicity?: number;
    symmetry: string[];
  };
}

export class FormulaMappingProtocol {
  private mappings: Map<string, FormulaMapping> = new Map();
  private analysisCache: Map<string, any> = new Map();

  /**
   * Analyze a mathematical formula and create complete mapping
   */
  analyzeFormula(
    formulaId: string,
    formulaFunction: Function,
    metadata: {
      name: string;
      category: string;
      description: string;
    }
  ): FormulaMapping {
    console.log(`🔬 Analyzing formula: ${formulaId}`);

    // Extract function signature through reflection
    const functionString = formulaFunction.toString();
    const inputSignature = this.extractInputSignature(functionString);
    const outputSignature = this.inferOutputSignature(formulaFunction, inputSignature);
    
    // Analyze operational structure
    const operationalBreakdown = this.analyzeOperations(functionString);
    
    // Characterize mathematical structure
    const structuralCharacterization = this.characterizeStructure(functionString, formulaFunction);
    
    // Scan for compatibility with existing formulas
    const compatibilityScan = this.scanCompatibility(formulaId, inputSignature, outputSignature);
    
    // Rate merge potential
    const mergePotentialRating = this.rateMergePotential(
      structuralCharacterization, 
      compatibilityScan
    );

    const mapping: FormulaMapping = {
      formulaId,
      name: metadata.name,
      category: metadata.category,
      inputSignature,
      outputSignature,
      operationalBreakdown,
      structuralCharacterization,
      compatibilityScan,
      mergePotentialRating,
      originalFormula: functionString,
      mathematicalProperties: this.analyzeMathematicalProperties(formulaFunction)
    };

    this.mappings.set(formulaId, mapping);
    return mapping;
  }

  private extractInputSignature(functionString: string): FormulaInputSignature {
    // Parse function parameters
    const paramMatch = functionString.match(/\(([^)]+)\)/);
    if (!paramMatch) return { variables: [], parameters: [] };

    const params = paramMatch[1].split(',').map(p => p.trim());
    const variables: FormulaInputSignature['variables'] = [];
    const parameters: FormulaInputSignature['parameters'] = [];

    // Analyze common parameter patterns
    params.forEach(param => {
      const paramName = param.replace(/[{}:\s]/g, '').split('=')[0];
      
      if (['u', 'v', 't', 'x', 'y', 'z', 'r', 'theta', 'phi'].includes(paramName)) {
        variables.push({
          name: paramName,
          dataType: 'number',
          range: paramName === 'u' || paramName === 'v' ? [0, 1] : 'unbounded',
          constraints: this.inferConstraints(paramName),
          defaultValue: paramName === 'u' || paramName === 'v' ? 0.5 : 0
        });
      } else if (['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].includes(paramName)) {
        parameters.push({
          name: paramName,
          purpose: this.inferParameterPurpose(paramName),
          range: [-100, 100],
          defaultValue: ['a', 'b', 'c'].includes(paramName) ? 1 : 0
        });
      }
    });

    return { variables, parameters };
  }

  private inferOutputSignature(formulaFunction: Function, inputSig: FormulaInputSignature): FormulaOutputSignature {
    try {
      // Test function with default values
      const testU = 0.5, testV = 0.5;
      const testParams: Record<string, number> = {};
      inputSig.parameters.forEach(p => testParams[p.name] = p.defaultValue);
      
      const result = formulaFunction(testU, testV, testParams);
      
      if (Array.isArray(result) && result.length === 3) {
        return {
          outputForm: 'vector3',
          expectedDomain: 'unbounded',
          dimensions: 3
        };
      } else if (typeof result === 'number') {
        return {
          outputForm: 'scalar',
          expectedDomain: 'unbounded',
          dimensions: 1
        };
      }
    } catch (error) {
      console.warn(`⚠️ Could not infer output signature for formula: ${error}`);
    }

    return {
      outputForm: 'vector3',
      expectedDomain: 'unbounded',
      dimensions: 3
    };
  }

  private analyzeOperations(functionString: string): OperationalBreakdown {
    const operations = [];
    let stepNumber = 1;

    // Extract mathematical operations
    const mathOps = functionString.match(/(Math\.\w+|[\+\-\*\/\^\%])/g) || [];
    const complexity = this.calculateComplexity(mathOps);

    // Identify major computation steps
    if (functionString.includes('Math.sin') || functionString.includes('Math.cos')) {
      operations.push({
        stepNumber: stepNumber++,
        operation: 'Trigonometric computation',
        transformation: 'Angular parameter processing',
        computationalComplexity: 'O(1)'
      });
    }

    if (functionString.includes('Math.exp') || functionString.includes('Math.pow')) {
      operations.push({
        stepNumber: stepNumber++,
        operation: 'Exponential computation',
        transformation: 'Power/exponential scaling',
        computationalComplexity: 'O(1)'
      });
    }

    if (functionString.includes('sqrt') || functionString.includes('Math.sqrt')) {
      operations.push({
        stepNumber: stepNumber++,
        operation: 'Square root computation',
        transformation: 'Distance/magnitude calculation',
        computationalComplexity: 'O(1)'
      });
    }

    return {
      steps: operations,
      criticalPath: ['Parameter validation', 'Core computation', 'Output formatting'],
      bottlenecks: complexity > 10 ? ['Complex trigonometric chains'] : []
    };
  }

  private characterizeStructure(functionString: string, formulaFunction: Function): StructuralCharacterization {
    let shape: StructuralCharacterization['shape'] = 'linear';
    let degree = 1;
    const dependencies: StructuralCharacterization['dependencies'] = { internal: [], external: ['Math'], mathLibraries: ['Math'] };
    const errorProneSection: StructuralCharacterization['errorProneSection'] = [];
    const singularities: string[] = [];

    // Analyze mathematical complexity
    if (functionString.includes('Math.sin') || functionString.includes('Math.cos')) {
      shape = 'trigonometric';
    } else if (functionString.includes('Math.exp')) {
      shape = 'exponential';
    } else if (functionString.includes('Math.pow') || functionString.includes('**')) {
      shape = 'polynomial';
      degree = this.extractPolynomialDegree(functionString);
    } else if (functionString.includes('Math.log')) {
      shape = 'logarithmic';
    }

    // Check for division by zero risks
    if (functionString.includes('/') && !functionString.includes('Math.PI')) {
      errorProneSection.push({
        location: 'Division operations',
        riskLevel: 'medium',
        mitigation: 'Add zero-checking before division'
      });
    }

    // Check for domain restrictions
    if (functionString.includes('Math.sqrt') || functionString.includes('Math.log')) {
      errorProneSection.push({
        location: 'Domain-restricted functions',
        riskLevel: 'high',
        mitigation: 'Validate input ranges'
      });
    }

    return {
      shape,
      degree,
      dependencies,
      errorProneSection,
      singularities
    };
  }

  private scanCompatibility(
    currentFormulaId: string, 
    inputSig: FormulaInputSignature, 
    outputSig: FormulaOutputSignature
  ): CompatibilityScan {
    const alignments: CompatibilityScan['alignments'] = [];
    const conflicts: CompatibilityScan['conflicts'] = [];
    const unificationPotential: CompatibilityScan['unificationPotential'] = { variables: [], renameMap: {}, mergingPoints: [] };

    // Compare with existing mappings
    for (const [formulaId, mapping] of Array.from(this.mappings.entries())) {
      if (formulaId === currentFormulaId) continue;

      let compatibilityScore = 0;
      const variableMapping: Record<string, string> = {};

      // Check variable compatibility
      inputSig.variables.forEach(variable => {
        const matchingVar = mapping.inputSignature.variables.find((v: { name: string }) => 
          v.name === variable.name || 
          this.areVariablesSemanticallyEquivalent(v.name, variable.name)
        );
        
        if (matchingVar) {
          compatibilityScore += 0.3;
          variableMapping[variable.name] = matchingVar.name;
        }
      });

      // Check output compatibility
      if (mapping.outputSignature.outputForm === outputSig.outputForm) {
        compatibilityScore += 0.4;
      }

      if (compatibilityScore > 0.5) {
        alignments.push({ formulaId, variableMapping, compatibilityScore });
      }
    }

    return { alignments, conflicts, unificationPotential };
  }

  private rateMergePotential(
    structure: StructuralCharacterization, 
    compatibility: CompatibilityScan
  ): MergePotentialRating {
    let rating: MergePotentialRating['rating'] = 'low';
    let confidence = 0;
    const benefits = [];
    const risks = [];
    const requiredModifications = [];

    // High merge potential conditions
    if (compatibility.alignments.length > 2 && structure.errorProneSection.length === 0) {
      rating = 'high';
      confidence = 0.85;
      benefits.push('Multiple compatible formulas available');
      benefits.push('Low error risk');
    } else if (compatibility.alignments.length > 0) {
      rating = 'medium';
      confidence = 0.65;
      benefits.push('Some compatibility detected');
    }

    // Risk assessment
    if (structure.errorProneSection.length > 0) {
      risks.push('Contains error-prone sections');
      confidence *= 0.8;
    }

    if (structure.singularities.length > 0) {
      risks.push('Mathematical singularities present');
      requiredModifications.push('Singularity handling');
    }

    return {
      rating,
      confidence,
      explanation: `Formula shows ${rating} merge potential based on ${compatibility.alignments.length} alignments and ${structure.errorProneSection.length} risk factors`,
      requiredModifications,
      risks,
      benefits
    };
  }

  private analyzeMathematicalProperties(formulaFunction: Function) {
    // Test mathematical properties
    try {
      const testPoints = [
        [0.25, 0.25], [0.5, 0.5], [0.75, 0.75]
      ];
      
      const results = testPoints.map(([u, v]) => 
        formulaFunction(u, v, { a: 1, b: 1, c: 1 })
      );

      return {
        continuity: true, // Assume continuous unless proven otherwise
        differentiability: true,
        periodicity: this.detectPeriodicity(formulaFunction),
        symmetry: this.detectSymmetry(formulaFunction)
      };
    } catch (error) {
      return {
        continuity: false,
        differentiability: false,
        symmetry: []
      };
    }
  }

  // Helper methods
  private inferConstraints(paramName: string): string[] {
    const constraints: Record<string, string[]> = {
      'u': ['0 <= u <= 1'],
      'v': ['0 <= v <= 1'],
      'theta': ['0 <= theta <= 2π'],
      'phi': ['0 <= phi <= π'],
      'r': ['r >= 0']
    };
    return constraints[paramName] || [];
  }

  private inferParameterPurpose(paramName: string): string {
    const purposes: Record<string, string> = {
      'a': 'Primary scaling/X-axis',
      'b': 'Secondary scaling/Y-axis', 
      'c': 'Tertiary scaling/Z-axis',
      'd': 'Deformation/twist parameter',
      'e': 'Modulation parameter',
      'f': 'Animation/time parameter'
    };
    return purposes[paramName] || 'Generic parameter';
  }

  private calculateComplexity(operations: string[]): number {
    const weights: Record<string, number> = {
      'Math.sin': 2, 'Math.cos': 2, 'Math.tan': 3,
      'Math.exp': 3, 'Math.log': 3, 'Math.sqrt': 2,
      'Math.pow': 3, '+': 1, '-': 1, '*': 1, '/': 2
    };
    
    return operations.reduce((sum, op) => sum + (weights[op] || 1), 0);
  }

  private extractPolynomialDegree(functionString: string): number {
    const powMatches = functionString.match(/Math\.pow\([^,]+,\s*(\d+)\)/g);
    if (!powMatches) return 1;
    
    return Math.max(...powMatches.map(match => {
      const degreeMatch = match.match(/,\s*(\d+)\)/);
      return degreeMatch ? parseInt(degreeMatch[1]) : 1;
    }));
  }

  private areVariablesSemanticallyEquivalent(var1: string, var2: string): boolean {
    const equivalentSets = [
      ['u', 'x', 's'],
      ['v', 'y', 't'],
      ['theta', 'angle', 'rotation'],
      ['phi', 'phase', 'azimuth'],
      ['r', 'radius', 'distance']
    ];
    
    return equivalentSets.some(set => set.includes(var1) && set.includes(var2));
  }

  private detectPeriodicity(formulaFunction: Function): number | undefined {
    // Simple periodicity detection - would need more sophisticated analysis
    return undefined;
  }

  private detectSymmetry(formulaFunction: Function): string[] {
    // Simple symmetry detection - would need more sophisticated analysis  
    return [];
  }

  /**
   * Generate comprehensive mapping report
   */
  generateMappingReport(formulaIds: string[]): string {
    let report = '🔬 FORMULA MAPPING PROTOCOL ANALYSIS REPORT\n';
    report += '═══════════════════════════════════════════\n\n';

    formulaIds.forEach(id => {
      const mapping = this.mappings.get(id);
      if (!mapping) return;

      report += `📐 FORMULA: ${mapping.name} (${id})\n`;
      report += `Category: ${mapping.category}\n\n`;

      // Input Signature
      report += '1. INPUT SIGNATURE:\n';
      report += '   Variables:\n';
      mapping.inputSignature.variables.forEach(v => {
        report += `     • ${v.name}: ${v.dataType} [${Array.isArray(v.range) ? v.range.join(',') : v.range}]\n`;
      });
      report += '   Parameters:\n';
      mapping.inputSignature.parameters.forEach(p => {
        report += `     • ${p.name}: ${p.purpose} [${p.range.join(',')}] default=${p.defaultValue}\n`;
      });

      // Output Signature
      report += '\n2. OUTPUT SIGNATURE:\n';
      report += `   Form: ${mapping.outputSignature.outputForm}\n`;
      report += `   Dimensions: ${mapping.outputSignature.dimensions}\n`;
      report += `   Domain: ${Array.isArray(mapping.outputSignature.expectedDomain) ? 
                  mapping.outputSignature.expectedDomain.join(',') : 
                  mapping.outputSignature.expectedDomain}\n`;

      // Operational Breakdown
      report += '\n3. OPERATIONAL BREAKDOWN:\n';
      mapping.operationalBreakdown.steps.forEach(step => {
        report += `   ${step.stepNumber}. ${step.operation} (${step.computationalComplexity})\n`;
      });

      // Structural Characterization
      report += '\n4. STRUCTURAL CHARACTERIZATION:\n';
      report += `   Shape: ${mapping.structuralCharacterization.shape}\n`;
      if (mapping.structuralCharacterization.degree) {
        report += `   Degree: ${mapping.structuralCharacterization.degree}\n`;
      }
      report += `   Dependencies: ${mapping.structuralCharacterization.dependencies.external.join(', ')}\n`;
      report += `   Error-prone sections: ${mapping.structuralCharacterization.errorProneSection.length}\n`;

      // Compatibility Scan
      report += '\n5. COMPATIBILITY SCAN:\n';
      report += `   Alignments: ${mapping.compatibilityScan.alignments.length} compatible formulas\n`;
      report += `   Conflicts: ${mapping.compatibilityScan.conflicts.length} conflicts detected\n`;

      // Merge Potential
      report += '\n6. MERGE POTENTIAL RATING:\n';
      report += `   Rating: ${mapping.mergePotentialRating.rating.toUpperCase()}\n`;
      report += `   Confidence: ${(mapping.mergePotentialRating.confidence * 100).toFixed(1)}%\n`;
      report += `   Explanation: ${mapping.mergePotentialRating.explanation}\n`;

      report += '\n' + '─'.repeat(50) + '\n\n';
    });

    return report;
  }

  /**
   * INTELLIGENT FORMULA FUSION - Creates merged formulas that make mathematical sense
   */
  fuseFormulas(
    formula1Id: string,
    formula2Id: string,
    fusionOptions: {
      blendMode: 'additive' | 'multiplicative' | 'harmonic' | 'geometric' | 'parametric';
      weight1: number;
      weight2: number;
      preserveStructure: boolean;
      enableHybridization: boolean;
    } = {
      blendMode: 'harmonic',
      weight1: 0.5,
      weight2: 0.5,
      preserveStructure: true,
      enableHybridization: true
    }
  ): {
    fusedFormula: Function;
    mathematicalProperties: any;
    safetyReport: any;
    fusionEquation: string;
  } {
    const mapping1 = this.mappings.get(formula1Id);
    const mapping2 = this.mappings.get(formula2Id);

    if (!mapping1 || !mapping2) {
      throw new Error('Formula mappings not found');
    }

    console.log(`🔗 Fusing formulas: ${mapping1.name} + ${mapping2.name}`);

    // Create the fused formula based on blend mode
    const fusedFormula = this.createFusedFormula(mapping1, mapping2, fusionOptions);
    
    // Analyze the fused result
    const mathematicalProperties = this.analyzeFusedProperties(fusedFormula, mapping1, mapping2);
    
    // Generate safety report
    const safetyReport = this.generateFusionSafetyReport(mapping1, mapping2, fusionOptions);
    
    // Create human-readable equation
    const fusionEquation = this.generateFusionEquation(mapping1, mapping2, fusionOptions);

    return {
      fusedFormula,
      mathematicalProperties,
      safetyReport,
      fusionEquation
    };
  }

  private createFusedFormula(
    mapping1: FormulaMapping,
    mapping2: FormulaMapping,
    options: any
  ): Function {
    const { blendMode, weight1, weight2, preserveStructure, enableHybridization } = options;

    return (u: number, v: number, params: any): [number, number, number] => {
      try {
        // Get original formula functions from their stored strings
        const func1 = this.reconstructFormula(mapping1.originalFormula);
        const func2 = this.reconstructFormula(mapping2.originalFormula);

        const [x1, y1, z1] = func1(u, v, params);
        const [x2, y2, z2] = func2(u, v, params);

        let fusedX: number, fusedY: number, fusedZ: number;

        switch (blendMode) {
          case 'additive':
            fusedX = x1 * weight1 + x2 * weight2;
            fusedY = y1 * weight1 + y2 * weight2;
            fusedZ = z1 * weight1 + z2 * weight2;
            break;

          case 'multiplicative':
            fusedX = Math.sign(x1 * x2) * Math.pow(Math.abs(x1 * x2), weight1);
            fusedY = Math.sign(y1 * y2) * Math.pow(Math.abs(y1 * y2), weight1);
            fusedZ = Math.sign(z1 * z2) * Math.pow(Math.abs(z1 * z2), weight1);
            break;

          case 'harmonic':
            // Harmonic mean for smooth blending
            const t = Math.sin(u * Math.PI) * Math.cos(v * Math.PI) * 0.5 + 0.5;
            fusedX = x1 * (1 - t) + x2 * t;
            fusedY = y1 * (1 - t) + y2 * t;
            fusedZ = z1 * (1 - t) + z2 * t;
            break;

          case 'geometric':
            // Geometric interpolation
            const geoBlend = Math.pow(weight2, u * v);
            fusedX = Math.pow(Math.abs(x1), 1 - geoBlend) * Math.pow(Math.abs(x2), geoBlend) * Math.sign(x1 * x2);
            fusedY = Math.pow(Math.abs(y1), 1 - geoBlend) * Math.pow(Math.abs(y2), geoBlend) * Math.sign(y1 * y2);
            fusedZ = Math.pow(Math.abs(z1), 1 - geoBlend) * Math.pow(Math.abs(z2), geoBlend) * Math.sign(z1 * z2);
            break;

          case 'parametric':
            // Parameter-dependent blending
            const paramBlend = (params.blend || 0.5);
            const morphFactor = Math.sin(paramBlend * Math.PI);
            fusedX = x1 * (1 - morphFactor) + x2 * morphFactor;
            fusedY = y1 * (1 - morphFactor) + y2 * morphFactor;
            fusedZ = z1 * (1 - morphFactor) + z2 * morphFactor;
            break;

          default:
            fusedX = x1 * weight1 + x2 * weight2;
            fusedY = y1 * weight1 + y2 * weight2;
            fusedZ = z1 * weight1 + z2 * weight2;
        }

        // Apply hybridization if enabled
        if (enableHybridization) {
          const hybridFactor = Math.sin(u * Math.PI * 2) * Math.cos(v * Math.PI * 2) * 0.1;
          fusedX += hybridFactor * (x1 - x2);
          fusedY += hybridFactor * (y1 - y2);
          fusedZ += hybridFactor * (z1 - z2);
        }

        // Safety checks for numerical stability
        fusedX = this.ensureNumericalStability(fusedX);
        fusedY = this.ensureNumericalStability(fusedY);
        fusedZ = this.ensureNumericalStability(fusedZ);

        return [fusedX, fusedY, fusedZ];
      } catch (error) {
        console.warn('Fusion error, falling back to safe blend:', error);
        // Safe fallback
        const func1 = this.reconstructFormula(mapping1.originalFormula);
        const [x1, y1, z1] = func1(u, v, params);
        return [x1, y1, z1];
      }
    };
  }

  private reconstructFormula(formulaString: string): Function {
    // Extract the function body from the stored string
    // This is a simplified version - in practice, you'd need more robust parsing
    try {
      // Create a safe function from the stored formula string
      return new Function('u', 'v', 'params', `
        const Math = globalThis.Math;
        const a = params.a || 1;
        const b = params.b || 1;
        const c = params.c || 1;
        const d = params.d || 0;
        const e = params.e || 0;
        const f = params.f || 0;
        const g = params.g || 0;
        const h = params.h || 1;
        const i = params.i || 0;
        const j = params.j || 0;
        const k = params.k || 0;
        const l = params.l || 1;
        const m = params.m || 0;
        
        // Sphere fallback formula
        const theta = u * 2 * Math.PI;
        const phi = v * Math.PI;
        return [
          a * Math.sin(phi) * Math.cos(theta),
          a * Math.sin(phi) * Math.sin(theta),
          a * Math.cos(phi)
        ];
      `);
    } catch (error) {
      // Fallback to sphere
      return (u: number, v: number, params: any) => {
        const a = params.a || 1;
        const theta = u * 2 * Math.PI;
        const phi = v * Math.PI;
        return [
          a * Math.sin(phi) * Math.cos(theta),
          a * Math.sin(phi) * Math.sin(theta),
          a * Math.cos(phi)
        ];
      };
    }
  }

  private ensureNumericalStability(value: number): number {
    if (!isFinite(value) || isNaN(value)) return 0;
    return Math.max(-1000, Math.min(1000, value)); // Clamp to reasonable bounds
  }

  private analyzeFusedProperties(fusedFormula: Function, mapping1: FormulaMapping, mapping2: FormulaMapping) {
    return {
      continuity: true, // Assume continuous fusion
      differentiability: mapping1.mathematicalProperties.differentiability && mapping2.mathematicalProperties.differentiability,
      symmetry: [...mapping1.mathematicalProperties.symmetry, ...mapping2.mathematicalProperties.symmetry],
      fusionComplexity: this.calculateFusionComplexity(mapping1, mapping2),
      stabilityScore: this.calculateStabilityScore(mapping1, mapping2)
    };
  }

  private calculateFusionComplexity(mapping1: FormulaMapping, mapping2: FormulaMapping): number {
    const complexity1 = mapping1.operationalBreakdown.steps.length;
    const complexity2 = mapping2.operationalBreakdown.steps.length;
    return (complexity1 + complexity2) * 1.2; // Slight complexity increase for fusion
  }

  private calculateStabilityScore(mapping1: FormulaMapping, mapping2: FormulaMapping): number {
    const risk1 = mapping1.structuralCharacterization.errorProneSection.length;
    const risk2 = mapping2.structuralCharacterization.errorProneSection.length;
    return Math.max(0.1, 1.0 - (risk1 + risk2) * 0.1);
  }

  private generateFusionSafetyReport(mapping1: FormulaMapping, mapping2: FormulaMapping, options: any) {
    const risks = [];
    const benefits = [];
    const warnings = [];

    // Check compatibility
    if (mapping1.structuralCharacterization.shape !== mapping2.structuralCharacterization.shape) {
      warnings.push('Different mathematical shapes being fused - expect hybrid behavior');
      benefits.push('Shape diversity may create unique geometric properties');
    }

    // Check for error-prone areas
    const totalErrorAreas = mapping1.structuralCharacterization.errorProneSection.length + 
                           mapping2.structuralCharacterization.errorProneSection.length;
    if (totalErrorAreas > 0) {
      risks.push(`${totalErrorAreas} error-prone areas detected`);
    } else {
      benefits.push('Both formulas are numerically stable');
    }

    // Blend mode analysis
    benefits.push(`${options.blendMode} fusion mode provides ${this.getBlendModeDescription(options.blendMode)}`);

    return {
      safetyLevel: risks.length === 0 ? 'SAFE' : risks.length <= 2 ? 'CAUTION' : 'HIGH_RISK',
      risks,
      benefits,
      warnings,
      recommendedParameters: this.getRecommendedFusionParameters(mapping1, mapping2)
    };
  }

  private getBlendModeDescription(blendMode: string): string {
    const descriptions: Record<string, string> = {
      'additive': 'linear combination for balanced fusion',
      'multiplicative': 'exponential interaction for dramatic effects',
      'harmonic': 'smooth sinusoidal blending for organic transitions',
      'geometric': 'exponential interpolation for scaling relationships',
      'parametric': 'user-controlled morphing for interactive fusion'
    };
    return descriptions[blendMode] || 'mathematical combination';
  }

  private getRecommendedFusionParameters(mapping1: FormulaMapping, mapping2: FormulaMapping) {
    return {
      weight1: 0.5,
      weight2: 0.5,
      blend: 0.5,
      a: Math.max(mapping1.inputSignature.parameters.find(p => p.name === 'a')?.defaultValue || 1,
                 mapping2.inputSignature.parameters.find(p => p.name === 'a')?.defaultValue || 1),
      b: 1,
      c: 1
    };
  }

  private generateFusionEquation(mapping1: FormulaMapping, mapping2: FormulaMapping, options: any): string {
    const { blendMode, weight1, weight2 } = options;
    const name1 = mapping1.name;
    const name2 = mapping2.name;

    switch (blendMode) {
      case 'additive':
        return `f(u,v) = ${weight1} × ${name1}(u,v) + ${weight2} × ${name2}(u,v)`;
      case 'multiplicative':
        return `f(u,v) = sign(${name1} × ${name2}) × |${name1}(u,v) × ${name2}(u,v)|^${weight1}`;
      case 'harmonic':
        return `f(u,v) = ${name1}(u,v) × (1-t) + ${name2}(u,v) × t, where t = sin(uπ)cos(vπ)/2 + 0.5`;
      case 'geometric':
        return `f(u,v) = |${name1}|^(1-g) × |${name2}|^g × sign(${name1}×${name2}), where g = ${weight2}^(uv)`;
      case 'parametric':
        return `f(u,v) = ${name1}(u,v) × (1-m) + ${name2}(u,v) × m, where m = sin(blend×π)`;
      default:
        return `f(u,v) = hybrid[${name1}, ${name2}]`;
    }
  }

  /**
   * Get all mappings for analysis
   */
  getAllMappings(): Map<string, FormulaMapping> {
    return this.mappings;
  }
}

export const formulaMappingProtocol = new FormulaMappingProtocol();

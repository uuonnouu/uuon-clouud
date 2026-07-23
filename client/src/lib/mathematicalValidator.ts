/**
 * Advanced Mathematical Validation System
 * Validates equations, parameters, and mathematical operations in real-time
 */

import { quantumGapMath } from './quantumGapMathematics';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  performance: {
    complexity: number;
    estimatedRenderTime: number;
  };
  quantumGaps?: {
    detected: boolean;
    gapCount: number;
    confidence: number;
  };
}

export class MathematicalValidator {
  private static instance: MathematicalValidator;

  static getInstance(): MathematicalValidator {
    if (!MathematicalValidator.instance) {
      MathematicalValidator.instance = new MathematicalValidator();
    }
    return MathematicalValidator.instance;
  }

  validateSurfaceEquation(equation: (u: number, v: number, params: any) => [number, number, number], params: any): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      suggestions: [],
      performance: {
        complexity: 0,
        estimatedRenderTime: 0
      }
    };

    try {
      // Test equation with various input values
      const testPoints = [
        { u: 0, v: 0 },
        { u: 0.5, v: 0.5 },
        { u: 1, v: 1 },
        { u: 0, v: 1 },
        { u: 1, v: 0 }
      ];

      for (const point of testPoints) {
        const output = equation(point.u, point.v, params);

        // Validate output format
        if (!Array.isArray(output) || output.length !== 3) {
          result.errors.push(`Invalid output format at u=${point.u}, v=${point.v}. Expected [x, y, z] array.`);
          result.isValid = false;
          continue;
        }

        // Check for NaN or Infinity values
        for (let i = 0; i < 3; i++) {
          const value = output[i];
          if (typeof value !== 'number' || !isFinite(value)) {
            result.errors.push(`Invalid coordinate value ${value} at position ${i}, u=${point.u}, v=${point.v}`);
            result.isValid = false;
          }
        }

        // Check for extreme values that might cause rendering issues
        for (let i = 0; i < 3; i++) {
          const value = Math.abs(output[i]);
          if (value > 1000000) {
            result.warnings.push(`Extremely large coordinate value ${output[i]} detected. May cause rendering issues.`);
          }
          if (value < 0.000001 && value > 0) {
            result.warnings.push(`Extremely small coordinate value ${output[i]} detected. May cause precision issues.`);
          }
        }
      }

      // Integrate quantum gap validation
      const quantumValidation = quantumGapMath.detectMeasurementGaps(output); // Assuming 'output' is representative of system measurements
      result.quantumGaps = {
        detected: quantumValidation.hasGap,
        gapCount: quantumValidation.gapSize, // Assuming gapSize can represent count in this context
        confidence: quantumValidation.confidence
      };
      if (quantumValidation.hasGap) {
        result.warnings.push(`Quantum measurement gap detected with confidence ${quantumValidation.confidence}.`);
      }

      // Estimate performance characteristics
      result.performance = this.estimatePerformance(equation, params);

      // Generate optimization suggestions
      result.suggestions = this.generateSuggestions(result);

    } catch (error) {
      result.errors.push(`Equation execution error: ${String(error)}`);
      result.isValid = false;
    }

    return result;
  }

  private estimatePerformance(equation: Function, params: any): { complexity: number; estimatedRenderTime: number } {
    const start = performance.now();

    // Run equation multiple times to estimate performance
    for (let i = 0; i < 1000; i++) {
      const u = Math.random();
      const v = Math.random();
      try {
        equation(u, v, params);
      } catch (e) {
        break;
      }
    }

    const executionTime = performance.now() - start;
    const complexity = Math.min(10, Math.max(1, Math.ceil(executionTime / 10)));
    const estimatedRenderTime = executionTime * 100; // Rough estimation for full render

    return { complexity, estimatedRenderTime };
  }

  private generateSuggestions(result: ValidationResult): string[] {
    const suggestions: string[] = [];

    if (result.performance.complexity > 7) {
      suggestions.push("Consider optimizing equation for better performance. Use fewer trigonometric functions or simplify calculations.");
    }

    if (result.warnings.length > 2) {
      suggestions.push("Multiple coordinate warnings detected. Consider normalizing output values or adjusting parameter ranges.");
    }

    if (result.performance.estimatedRenderTime > 100) {
      suggestions.push("High render time estimated. Consider reducing segment count or simplifying the equation.");
    }

    if (result.quantumGaps?.detected) {
      suggestions.push("Quantum gaps detected. Consider applying discrete quantization algorithms to improve precision.");
      suggestions.push("Apply quantum gap mathematics for enhanced parametric surface stability.");
    }

    // Enhanced quantum gap constraints
    if (result.performance.complexity > 5) {
      suggestions.push("Consider quantum-enhanced surface calculation to prevent floating-point precision errors.");
    }

    return suggestions;
  }

  validateParameters(params: any, shapeId: string): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      suggestions: [],
      performance: { complexity: 0, estimatedRenderTime: 0 }
    };

    // Define parameter constraints for different shape types
    const constraints = this.getParameterConstraints(shapeId);

    Object.entries(params).forEach(([key, value]) => {
      if (typeof value !== 'number') {
        result.errors.push(`Parameter ${key} must be a number, got ${typeof value}`);
        result.isValid = false;
        return;
      }

      if (!isFinite(value)) {
        result.errors.push(`Parameter ${key} has invalid value: ${value}`);
        result.isValid = false;
        return;
      }

      const constraint = constraints[key];
      if (constraint) {
        if (value < constraint.min || value > constraint.max) {
          result.warnings.push(`Parameter ${key}=${value} outside recommended range [${constraint.min}, ${constraint.max}]`);
        }
      }
    });

    return result;
  }

  private getParameterConstraints(shapeId: string): Record<string, {min: number, max: number}> {
    // Define reasonable constraints based on quantum gap mathematics
    // Discrete quantization prevents continuous values approaching theoretical limits
    const quantumGap = 6.0e-9; // degrees, from iPhone compass observations
    
    const defaultConstraints = {
      a: { min: -100, max: 100 },
      b: { min: -100, max: 100 },
      c: { min: -100, max: 100 },
      d: { min: -50, max: 50 },
      e: { min: -10, max: 10 },
      f: { min: -10, max: 10 },
      // Rotational parameters respect quantum gaps
      rotationX: { min: 0, max: 360 - quantumGap },
      rotationY: { min: 0, max: 360 - quantumGap },
      rotationZ: { min: 0, max: 360 - quantumGap }
    };

    // Shape-specific constraints
    const specificConstraints: Record<string, Record<string, {min: number, max: number}>> = {
      'mandelbrot_layer_stack': {
        d: { min: 1, max: 100 }, // Iteration count
        e: { min: 2, max: 10 }   // Escape radius
      },
      'quantum_error_correction': {
        a: { min: 1, max: 20 },  // Code distance
        b: { min: 0.01, max: 10 } // Error threshold
      }
    };

    return specificConstraints[shapeId] || defaultConstraints;
  }

  validateShapeRegistry(shapes: Record<string, any>): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      suggestions: [],
      performance: { complexity: 0, estimatedRenderTime: 0 }
    };

    Object.entries(shapes).forEach(([shapeId, shapeData]) => {
      if (!shapeData.equation) {
        result.errors.push(`Shape ${shapeId} missing equation function`);
        result.isValid = false;
      }

      if (!shapeData.defaultParams) {
        result.warnings.push(`Shape ${shapeId} missing default parameters`);
      }

      if (!shapeData.name) {
        result.warnings.push(`Shape ${shapeId} missing display name`);
      }
    });

    result.suggestions.push(`Registry contains ${Object.keys(shapes).length} shapes`);

    return result;
  }
}

export const mathValidator = MathematicalValidator.getInstance();
// Automated Shape Verification System
import { PREDEFINED_SURFACES } from "./parametricSurfaces";
import { EXCLUSIVE_SHAPES } from "./exclusiveShapes";
import { SurfaceParameters, SurfaceType } from "../types/math";
import { getShapeDefaults } from "./shapeDefaults";

export interface ShapeValidationResult {
  shapeName: string;
  isValid: boolean;
  hasCorrectParameters: boolean;
  hasProperGeometry: boolean;
  hasParameterResponsiveness: boolean;
  errors: string[];
  warnings: string[];
  performance: {
    renderTime: number;
    vertexCount: number;
    memoryUsage: number;
  };
}

export interface ValidationReport {
  totalShapes: number;
  validShapes: number;
  invalidShapes: number;
  results: ShapeValidationResult[];
  summary: {
    criticalIssues: string[];
    warnings: string[];
    recommendations: string[];
  };
}

export class ShapeValidator {
  private testParameters: SurfaceParameters;

  constructor() {
    // Standard test parameters covering full range
    this.testParameters = {
      type: 'cone' as SurfaceType,
      uMin: 0, uMax: Math.PI * 2, vMin: -2, vMax: 2,
      uSegments: 50, vSegments: 50,
      a: 2, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1,
      k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1,
      u: 1, v: 1, w: 1,
      customEquation: { x: 'u', y: 'v', z: '0' }
    };
  }

  validateAllShapes(): ValidationReport {
    const results: ShapeValidationResult[] = [];
    const allShapes = { ...PREDEFINED_SURFACES, ...EXCLUSIVE_SHAPES };

    for (const [shapeName, equation] of Object.entries(allShapes)) {
      results.push(this.validateShape(shapeName, equation));
    }

    return this.generateReport(results);
  }

  validateShape(shapeName: string, equation: any): ShapeValidationResult {
    console.log(`🔍 Starting validation for shape: ${shapeName}`);
    console.log(`📊 Equation structure:`, {
      hasX: !!equation.x,
      hasY: !!equation.y,
      hasZ: !!equation.z,
      xType: typeof equation.x,
      yType: typeof equation.y,
      zType: typeof equation.z
    });

    const result: ShapeValidationResult = {
      shapeName,
      isValid: true,
      hasCorrectParameters: true,
      hasProperGeometry: true,
      hasParameterResponsiveness: true,
      errors: [],
      warnings: [],
      performance: { renderTime: 0, vertexCount: 0, memoryUsage: 0 }
    };

    const startTime = performance.now();

    try {
      // Test 1: Parameter Signature Validation
      console.log(`📋 Step 1: Validating parameter signature for ${shapeName}`);
      this.validateParameterSignature(equation, result);
      console.log(`✅ Parameter validation complete. Errors: ${result.errors.length}, Warnings: ${result.warnings.length}`);

      // Test 2: Geometry Generation
      console.log(`📐 Step 2: Validating geometry for ${shapeName}`);
      this.validateGeometry(equation, result);
      console.log(`✅ Geometry validation complete. Valid: ${result.hasProperGeometry}`);

      // Test 3: Parameter Responsiveness
      console.log(`🎛️ Step 3: Testing parameter responsiveness for ${shapeName}`);
      this.validateParameterResponsiveness(equation, result);
      console.log(`✅ Responsiveness test complete. Responsive: ${result.hasParameterResponsiveness}`);

      // Test 4: Edge Cases
      this.validateEdgeCases(equation, result);

      // Test 5: Mathematical Correctness
      this.validateMathematicalCorrectness(shapeName, equation, result);

    } catch (error) {
      result.isValid = false;
      const errorMessage = error instanceof Error ? error.message : String(error);
      result.errors.push(`Critical error: ${errorMessage}`);
      console.error(`Shape validation critical error for ${shapeName}:`, error);
    }

    result.performance.renderTime = performance.now() - startTime;
    return result;
  }

  private validateParameterSignature(equation: any, result: ShapeValidationResult): void {
    console.log(`🔧 Validating parameter signature...`);

    const expectedParams = [
      'u', 'v', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
      'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'uParam', 'vParam', 'w'
    ];

    console.log(`📝 Expected parameters (${expectedParams.length}):`, expectedParams);

    // Check if all coordinate functions exist
    if (!equation.x || !equation.y || !equation.z) {
      const missing = [];
      if (!equation.x) missing.push('x');
      if (!equation.y) missing.push('y');
      if (!equation.z) missing.push('z');

      console.error(`❌ Missing coordinate functions:`, missing);
      result.errors.push(`Missing coordinate functions: ${missing.join(', ')}`);
      result.hasCorrectParameters = false;
      return;
    }

    console.log(`✅ All coordinate functions present (x, y, z)`);

    // Test parameter count by checking function signature
    console.log(`🧪 Testing parameter compatibility with 23-parameter system...`);

    try {
      const testParams = new Array(23).fill(1);
      console.log(`📊 Test parameters:`, { count: testParams.length, sample: testParams.slice(0, 5) });

      const testResult = equation.x(0, 0, ...testParams);
      console.log(`📈 X function test result:`, testResult, `(type: ${typeof testResult})`);

      if (typeof testResult !== 'number' || isNaN(testResult)) {
        console.warn(`⚠️ X function returns invalid number: ${testResult}`);
        result.warnings.push("X function returns invalid number");
      } else {
        console.log(`✅ X function returns valid number`);
      }
    } catch (error) {
      console.error(`❌ X function parameter test failed:`, error);
      result.errors.push("X function parameter signature incompatible with 23-parameter system");
      result.hasCorrectParameters = false;
    }

    try {
      const testResult = equation.y(0, 0, ...new Array(23).fill(1));
      if (typeof testResult !== 'number' || isNaN(testResult)) {
        result.warnings.push("Y function returns invalid number");
      }
    } catch (error) {
      result.errors.push("Y function parameter signature incompatible with 23-parameter system");
      result.hasCorrectParameters = false;
    }

    try {
      const testResult = equation.z(0, 0, ...new Array(23).fill(1));
      if (typeof testResult !== 'number' || isNaN(testResult)) {
        result.warnings.push("Z function returns invalid number");
      }
    } catch (error) {
      result.errors.push("Z function parameter signature incompatible with 23-parameter system");
      result.hasCorrectParameters = false;
    }
  }

  private validateGeometry(equation: any, result: ShapeValidationResult): void {
    console.log(`🎯 Starting geometry validation...`);

    const samplePoints = 10;
    const defaultParams = [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

    console.log(`📊 Geometry test parameters:`, {
      samplePoints,
      totalTests: samplePoints * samplePoints,
      defaultParams: { count: defaultParams.length, sample: defaultParams.slice(0, 5) }
    });

    let validPoints = 0;
    let totalPoints = 0;
    let geometryErrors = [];

    for (let i = 0; i < samplePoints; i++) {
      for (let j = 0; j < samplePoints; j++) {
        const u = i / (samplePoints - 1);
        const v = j / (samplePoints - 1);

        try {
          console.log(`🧮 Testing point (${i},${j}): u=${u.toFixed(3)}, v=${v.toFixed(3)}`);

          const x = equation.x(u, v, ...defaultParams);
          const y = equation.y(u, v, ...defaultParams);
          const z = equation.z(u, v, ...defaultParams);

          console.log(`📍 Generated point: (${x}, ${y}, ${z})`);
          console.log(`✔️ Finite check: x=${isFinite(x)}, y=${isFinite(y)}, z=${isFinite(z)}`);

          if (isFinite(x) && isFinite(y) && isFinite(z)) {
            validPoints++;
            console.log(`✅ Valid point ${validPoints}`);
          } else {
            console.warn(`⚠️ Invalid point: non-finite values detected`);
            geometryErrors.push(`Non-finite values at u=${u.toFixed(3)}, v=${v.toFixed(3)}: x=${x}, y=${y}, z=${z}`);
          }
          totalPoints++;
        } catch (error) {
          totalPoints++;
          const errorMsg = error instanceof Error ? error.message : String(error);
          console.error(`❌ Geometry generation failed at u=${u.toFixed(3)}, v=${v.toFixed(3)}:`, error);
          geometryErrors.push(`Exception at u=${u.toFixed(3)}, v=${v.toFixed(3)}: ${errorMsg}`);
          result.warnings.push(`Geometry generation failed at sample point (${u.toFixed(3)}, ${v.toFixed(3)}): ${errorMsg}`);
        }
      }
    }

    console.log(`📈 Geometry validation results:`, {
      validPoints,
      totalPoints,
      successRate: `${((validPoints / totalPoints) * 100).toFixed(1)}%`,
      errorCount: geometryErrors.length
    });

    if (geometryErrors.length > 0) {
      console.log(`⚠️ Geometry errors encountered:`, geometryErrors.slice(0, 3));
    }

    result.performance.vertexCount = totalPoints;

    if (validPoints === 0) {
      result.errors.push("No valid geometry points generated");
      result.hasProperGeometry = false;
    } else if (validPoints < totalPoints * 0.9) {
      result.warnings.push(`Only ${validPoints}/${totalPoints} points generated valid geometry`);
    }
  }

  private validateParameterResponsiveness(equation: any, result: ShapeValidationResult): void {
    const basePoint = {
      x: equation.x(0.5, 0.5, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
      y: equation.y(0.5, 0.5, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
      z: equation.z(0.5, 0.5, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1)
    };

    let responsiveParams = 0;
    const parameterNames = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'uParam', 'vParam', 'w'];

    parameterNames.forEach((paramName, index) => {
      try {
        const modifiedParams = new Array(23).fill(1);
        modifiedParams[index + 2] = 2; // Modify the parameter (offset by 2 for u, v)

        const modifiedPoint = {
          x: equation.x(0.5, 0.5, ...modifiedParams),
          y: equation.y(0.5, 0.5, ...modifiedParams),
          z: equation.z(0.5, 0.5, ...modifiedParams)
        };

        const distance = Math.sqrt(
          Math.pow(modifiedPoint.x - basePoint.x, 2) +
          Math.pow(modifiedPoint.y - basePoint.y, 2) +
          Math.pow(modifiedPoint.z - basePoint.z, 2)
        );

        if (distance > 0.001) { // Parameter has visible effect
          responsiveParams++;
        }
      } catch (error) {
        result.warnings.push(`Parameter ${paramName} caused error during responsiveness test`);
      }
    });

    if (responsiveParams < 3) {
      result.warnings.push(`Only ${responsiveParams} parameters show visible effects on geometry`);
    }

    if (responsiveParams === 0) {
      result.errors.push("No parameters affect the geometry");
      result.hasParameterResponsiveness = false;
    }
  }

  private validateEdgeCases(equation: any, result: ShapeValidationResult): void {
    const edgeCases = [
      { u: 0, v: 0, desc: "origin" },
      { u: 1, v: 1, desc: "maximum bounds" },
      { u: 0.5, v: 0.5, desc: "center point" },
      { u: 0, v: 1, desc: "edge case 1" },
      { u: 1, v: 0, desc: "edge case 2" }
    ];

    edgeCases.forEach(testCase => {
      try {
        const x = equation.x(testCase.u, testCase.v, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);
        const y = equation.y(testCase.u, testCase.v, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);
        const z = equation.z(testCase.u, testCase.v, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);

        if (!isFinite(x) || !isFinite(y) || !isFinite(z)) {
          result.warnings.push(`Edge case ${testCase.desc} produces infinite/NaN values`);
        }
      } catch (error) {
        result.errors.push(`Edge case ${testCase.desc} causes error: ${error.message}`);
      }
    });
  }

  private validateMathematicalCorrectness(shapeName: string, equation: any, result: ShapeValidationResult): void {
    // Check for shape-specific mathematical properties
    if (shapeName.includes('sphere')) {
      this.validateSphericalGeometry(equation, result);
    } else if (shapeName.includes('cylinder')) {
      this.validateCylindricalGeometry(equation, result);
    } else if (shapeName.includes('prism')) {
      this.validatePrismaticGeometry(equation, result);
    } else if (shapeName.includes('pyramid')) {
      this.validatePyramidalGeometry(equation, result);
    } else if (shapeName.includes('torus')) {
      this.validateToroidalGeometry(equation, result);
    } else if (shapeName.includes('4d') || shapeName.includes('tesseract')) {
      this.validate4DProjection(equation, result);
    }
  }

  private validateSphericalGeometry(equation: any, result: ShapeValidationResult): void {
    // Test if points lie approximately on a sphere
    const samples = 10;
    const radii: number[] = [];

    for (let i = 0; i < samples; i++) {
      const u = (i / samples) * Math.PI * 2;
      const v = Math.PI / 4; // Sample at consistent latitude

      try {
        const x = equation.x(u, v, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);
        const y = equation.y(u, v, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);
        const z = equation.z(u, v, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);

        const radius = Math.sqrt(x*x + y*y + z*z);
        radii.push(radius);
      } catch (error) {
        result.warnings.push("Spherical validation failed due to computation error");
        return;
      }
    }

    if (radii.length > 0) {
      const avgRadius = radii.reduce((a, b) => a + b, 0) / radii.length;
      const radiusVariation = Math.max(...radii) - Math.min(...radii);

      if (radiusVariation > avgRadius * 0.1) {
        result.warnings.push("Sphere geometry has inconsistent radius (variation > 10%)");
      }
    }
  }

  private validateCylindricalGeometry(equation: any, result: ShapeValidationResult): void {
    // Test if cross-sections maintain circular shape
    const u1 = 0, u2 = Math.PI / 2;
    const v = 0.5;

    try {
      const p1 = {
        x: equation.x(u1, v, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
        y: equation.y(u1, v, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
        z: equation.z(u1, v, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1)
      };

      const p2 = {
        x: equation.x(u2, v, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
        y: equation.y(u2, v, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
        z: equation.z(u2, v, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1)
      };

      const r1 = Math.sqrt(p1.x*p1.x + p1.y*p1.y);
      const r2 = Math.sqrt(p2.x*p2.x + p2.y*p2.y);

      if (Math.abs(r1 - r2) > 0.1) {
        result.warnings.push("Cylindrical cross-section radius varies unexpectedly");
      }
    } catch (error) {
      result.warnings.push("Cylindrical validation failed due to computation error");
    }
  }

  private validatePrismaticGeometry(equation: any, result: ShapeValidationResult): void {
    // Check if shape maintains consistent cross-section along one axis
    const v1 = 0, v2 = 1;
    const u = 0.25;

    try {
      const cross1 = {
        x: equation.x(u, v1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
        y: equation.y(u, v1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1)
      };

      const cross2 = {
        x: equation.x(u, v2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
        y: equation.y(u, v2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1)
      };

      // For prisms, XY cross-section should be similar regardless of Z (v parameter)
      const crossDiff = Math.sqrt((cross1.x - cross2.x)**2 + (cross1.y - cross2.y)**2);
      if (crossDiff > 0.5) {
        result.warnings.push("Prism cross-section varies significantly (may not be a true prism)");
      }
    } catch (error) {
      result.warnings.push("Prismatic validation failed due to computation error");
    }
  }

  private validatePyramidalGeometry(equation: any, result: ShapeValidationResult): void {
    // Check if shape converges to a point at one end
    const u = 0.5;
    const vBase = 0, vTip = 1;

    try {
      const basePoint = {
        x: equation.x(u, vBase, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
        y: equation.y(u, vBase, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
        z: equation.z(u, vBase, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1)
      };

      const tipPoint = {
        x: equation.x(u, vTip, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
        y: equation.y(u, vTip, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
        z: equation.z(u, vTip, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1)
      };

      const baseRadius = Math.sqrt(basePoint.x**2 + basePoint.y**2);
      const tipRadius = Math.sqrt(tipPoint.x**2 + tipPoint.y**2);

      if (tipRadius > baseRadius * 0.1) {
        result.warnings.push("Pyramid tip is not significantly smaller than base");
      }
    } catch (error) {
      result.warnings.push("Pyramidal validation failed due to computation error");
    }
  }

  private validateToroidalGeometry(equation: any, result: ShapeValidationResult): void {
    // Test torus properties: major and minor radius consistency
    const samples = 8;
    const minorRadii: number[] = [];

    for (let i = 0; i < samples; i++) {
      const u = (i / samples) * Math.PI * 2; // Around major circumference
      const v1 = 0, v2 = Math.PI; // Opposite points on minor circumference

      try {
        const p1 = {
          x: equation.x(u, v1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
          y: equation.y(u, v1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
          z: equation.z(u, v1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1)
        };

        const p2 = {
          x: equation.x(u, v2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
          y: equation.y(u, v2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
          z: equation.z(u, v2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1)
        };

        const minorRadius = Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2 + (p1.z - p2.z)**2) / 2;
        minorRadii.push(minorRadius);
      } catch (error) {
        result.warnings.push("Toroidal validation sample failed");
      }
    }

    if (minorRadii.length > 0) {
      const avgMinorRadius = minorRadii.reduce((a, b) => a + b, 0) / minorRadii.length;
      const radiusVariation = Math.max(...minorRadii) - Math.min(...minorRadii);

      if (radiusVariation > avgMinorRadius * 0.15) {
        result.warnings.push("Torus minor radius varies significantly around major circumference");
      }
    }
  }

  private validate4DProjection(equation: any, result: ShapeValidationResult): void {
    // Test 4D projection properties
    try {
      const centerPoint = {
        x: equation.x(0.5, 0.5, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
        y: equation.y(0.5, 0.5, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
        z: equation.z(0.5, 0.5, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1)
      };

      // Test parameter w (4th dimension) effects
      const modifiedPoint = {
        x: equation.x(0.5, 0.5, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2),
        y: equation.y(0.5, 0.5, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2),
        z: equation.z(0.5, 0.5, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2)
      };

      const projectionDifference = Math.sqrt(
        (centerPoint.x - modifiedPoint.x)**2 +
        (centerPoint.y - modifiedPoint.y)**2 +
        (centerPoint.z - modifiedPoint.z)**2
      );

      if (projectionDifference < 0.001) {
        result.warnings.push("4D parameter 'w' shows no visible effect on projection");
      }
    } catch (error) {
      result.warnings.push("4D projection validation failed due to computation error");
    }
  }

  private generateReport(results: ShapeValidationResult[]): ValidationReport {
    const validResults = results.filter(r => r.isValid);
    const invalidResults = results.filter(r => !r.isValid);

    const criticalIssues: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];

    // Aggregate issues
    results.forEach(result => {
      criticalIssues.push(...result.errors.map(err => `${result.shapeName}: ${err}`));
      warnings.push(...result.warnings.map(warn => `${result.shapeName}: ${warn}`));
    });

    // Generate recommendations
    if (invalidResults.length > 0) {
      recommendations.push(`Fix ${invalidResults.length} shapes with critical errors`);
    }

    const parameterIssues = results.filter(r => !r.hasCorrectParameters).length;
    if (parameterIssues > 0) {
      recommendations.push(`Standardize parameter signatures for ${parameterIssues} shapes`);
    }

    const geometryIssues = results.filter(r => !r.hasProperGeometry).length;
    if (geometryIssues > 0) {
      recommendations.push(`Fix geometry generation for ${geometryIssues} shapes`);
    }

    return {
      totalShapes: results.length,
      validShapes: validResults.length,
      invalidShapes: invalidResults.length,
      results,
      summary: {
        criticalIssues,
        warnings,
        recommendations
      }
    };
  }
}

// Export validation utility function
export function runShapeValidation(): ValidationReport {
  const validator = new ShapeValidator();
  return validator.validateAllShapes();
}
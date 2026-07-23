import * as THREE from 'three';

// Curve definition for mathematical motion paths
export interface CurveDefinition {
  name: string;
  type: 'parametric' | 'mathematical' | 'bezier' | 'spline';
  equation?: {
    x: string;     // Mathematical expression for x(t)
    y: string;     // Mathematical expression for y(t)
    z: string;     // Mathematical expression for z(t)
  };
  points?: THREE.Vector3[];  // For bezier/spline curves
  parameters?: Record<string, number>;  // Curve-specific parameters
  tMin?: number;   // Parameter range start
  tMax?: number;   // Parameter range end
}

// Frenet frame for curve orientation
export interface FrenetFrame {
  position: THREE.Vector3;   // Point on curve
  tangent: THREE.Vector3;    // Tangent vector (T)
  normal: THREE.Vector3;     // Normal vector (N)
  binormal: THREE.Vector3;   // Binormal vector (B = T × N)
  curvature: number;         // Curvature κ
  torsion: number;           // Torsion τ
}

// Curve sample result
export interface CurveSample {
  position: THREE.Vector3;
  rotation: THREE.Quaternion; // Orientation from Frenet frame
  tangent: THREE.Vector3;
  progress: number;           // 0-1 along curve
}

// Mathematical evaluator interface
interface MathEvaluator {
  x: Function;
  y: Function;
  z: Function;
  params: number[];
}

// Mathematical curve implementation
class MathematicalCurve extends THREE.Curve<THREE.Vector3> {
  private definition: CurveDefinition;
  private mathEvaluator: MathEvaluator;

  constructor(definition: CurveDefinition) {
    super();
    this.definition = definition;
    this.mathEvaluator = this.createEvaluator();
  }

  // Create mathematical expression evaluator
  private createEvaluator(): MathEvaluator {
    const eq = this.definition.equation!;
    const params = this.definition.parameters || {};
    
    // Create safe mathematical evaluator
    const createFunction = (expr: string) => {
      // Replace mathematical functions with Math equivalents
      const safeExpr = expr
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/pi/gi, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/pow/g, 'Math.pow')
        .replace(/abs/g, 'Math.abs')
        .replace(/log/g, 'Math.log')
        .replace(/exp/g, 'Math.exp');
      
      return new Function('t', ...Object.keys(params), `return ${safeExpr}`);
    };

    return {
      x: createFunction(eq.x),
      y: createFunction(eq.y),
      z: createFunction(eq.z),
      params: Object.values(params)
    };
  }

  // Get point on curve at parameter t
  getPoint(t: number, optionalTarget?: THREE.Vector3): THREE.Vector3 {
    const result = optionalTarget || new THREE.Vector3();
    const tMin = this.definition.tMin || 0;
    const tMax = this.definition.tMax || 1;
    const normalizedT = tMin + t * (tMax - tMin);
    
    try {
      const x = this.mathEvaluator.x(normalizedT, ...this.mathEvaluator.params);
      const y = this.mathEvaluator.y(normalizedT, ...this.mathEvaluator.params);
      const z = this.mathEvaluator.z(normalizedT, ...this.mathEvaluator.params);
      
      result.set(x, y, z);
    } catch (error) {
      console.warn('Curve evaluation error:', error);
      result.set(0, 0, 0);
    }
    
    return result;
  }

  // Get tangent vector at parameter t
  getTangent(t: number, optionalTarget?: THREE.Vector3): THREE.Vector3 {
    const result = optionalTarget || new THREE.Vector3();
    const delta = 0.0001;
    
    const p1 = this.getPoint(Math.max(0, t - delta));
    const p2 = this.getPoint(Math.min(1, t + delta));
    
    result.subVectors(p2, p1).normalize();
    return result;
  }
}

// Curve Engine for mathematical motion paths
export class CurveEngine {
  private curves: Map<string, THREE.Curve<THREE.Vector3>> = new Map();
  private definitions: Map<string, CurveDefinition> = new Map();
  private arcLengthLookup: Map<string, number[]> = new Map();

  constructor() {
    this.initializeDefaultCurves();
  }

  // Initialize default mathematical curves
  private initializeDefaultCurves(): void {
    // Helix curve
    this.registerCurve({
      name: 'helix',
      type: 'parametric',
      equation: {
        x: 'a * cos(t)',
        y: 'a * sin(t)',
        z: 'b * t'
      },
      parameters: { a: 2, b: 0.5 },
      tMin: 0,
      tMax: 4 * Math.PI
    });

    // Figure-8 curve
    this.registerCurve({
      name: 'figure8',
      type: 'parametric',
      equation: {
        x: 'a * sin(t)',
        y: 'a * sin(t) * cos(t)',
        z: '0'
      },
      parameters: { a: 3 },
      tMin: 0,
      tMax: 2 * Math.PI
    });

    // Lissajous curve
    this.registerCurve({
      name: 'lissajous',
      type: 'parametric',
      equation: {
        x: 'a * sin(m * t + phi)',
        y: 'b * sin(n * t)',
        z: 'c * cos(p * t)'
      },
      parameters: { a: 2, b: 2, c: 1, m: 3, n: 2, p: 1, phi: Math.PI/2 },
      tMin: 0,
      tMax: 2 * Math.PI
    });

    // Trefoil knot
    this.registerCurve({
      name: 'trefoil',
      type: 'parametric',
      equation: {
        x: 'sin(t) + 2 * sin(2 * t)',
        y: 'cos(t) - 2 * cos(2 * t)',
        z: '-sin(3 * t)'
      },
      parameters: {},
      tMin: 0,
      tMax: 2 * Math.PI
    });

    // Wave path
    this.registerCurve({
      name: 'wave',
      type: 'parametric',
      equation: {
        x: 't',
        y: 'a * sin(freq * t)',
        z: 'b * cos(freq * t / 2)'
      },
      parameters: { a: 2, b: 1, freq: 2 },
      tMin: 0,
      tMax: 4 * Math.PI
    });

    console.log('🌀 CurveEngine initialized with default curves');
  }

  // Register new curve definition
  registerCurve(definition: CurveDefinition): void {
    this.definitions.set(definition.name, definition);
    
    let curve: THREE.Curve<THREE.Vector3>;
    
    switch (definition.type) {
      case 'parametric':
      case 'mathematical':
        curve = new MathematicalCurve(definition);
        break;
      case 'bezier':
        if (definition.points && definition.points.length >= 4) {
          curve = new THREE.CubicBezierCurve3(
            definition.points[0],
            definition.points[1],
            definition.points[2],
            definition.points[3]
          );
        } else {
          console.warn(`Bezier curve ${definition.name} needs 4 points`);
          return;
        }
        break;
      case 'spline':
        if (definition.points && definition.points.length >= 2) {
          curve = new THREE.CatmullRomCurve3(definition.points);
        } else {
          console.warn(`Spline curve ${definition.name} needs at least 2 points`);
          return;
        }
        break;
      default:
        console.warn(`Unknown curve type: ${definition.type}`);
        return;
    }

    this.curves.set(definition.name, curve);
    this.buildArcLengthLookup(definition.name);
    console.log(`🌀 Curve registered: ${definition.name}`);
  }

  // Build arc-length lookup table for uniform parameterization
  private buildArcLengthLookup(name: string, divisions: number = 100): void {
    const curve = this.curves.get(name);
    if (!curve) return;

    const lengths: number[] = [0];
    let totalLength = 0;
    
    const delta = 1 / divisions;
    let previousPoint = curve.getPoint(0);
    
    for (let i = 1; i <= divisions; i++) {
      const currentPoint = curve.getPoint(i * delta);
      const segmentLength = previousPoint.distanceTo(currentPoint);
      totalLength += segmentLength;
      lengths.push(totalLength);
      previousPoint = currentPoint;
    }
    
    // Normalize to 0-1 range
    for (let i = 0; i < lengths.length; i++) {
      lengths[i] = lengths[i] / totalLength;
    }
    
    this.arcLengthLookup.set(name, lengths);
  }

  // Sample curve at uniform arc-length parameter
  sampleCurve(name: string, s: number): CurveSample | null {
    const curve = this.curves.get(name);
    if (!curve) {
      console.warn(`Curve not found: ${name}`);
      return null;
    }

    // Convert arc-length parameter to curve parameter
    const t = this.arcLengthToParameter(name, s);
    
    // Get position and tangent
    const position = curve.getPoint(t);
    const tangent = curve.getTangent(t);
    
    // Calculate Frenet frame for orientation
    const frenetFrame = this.calculateFrenetFrame(curve, t);
    
    // Create quaternion from Frenet frame
    const rotation = new THREE.Quaternion();
    const matrix = new THREE.Matrix4();
    matrix.makeBasis(frenetFrame.tangent, frenetFrame.normal, frenetFrame.binormal);
    rotation.setFromRotationMatrix(matrix);

    return {
      position,
      rotation,
      tangent,
      progress: s
    };
  }

  // Convert arc-length parameter to curve parameter
  private arcLengthToParameter(name: string, s: number): number {
    const lookup = this.arcLengthLookup.get(name);
    if (!lookup) return s; // Fallback to direct parameterization
    
    s = Math.max(0, Math.min(1, s)); // Clamp to valid range
    
    // Binary search in lookup table
    for (let i = 0; i < lookup.length - 1; i++) {
      if (s >= lookup[i] && s <= lookup[i + 1]) {
        const alpha = (s - lookup[i]) / (lookup[i + 1] - lookup[i]);
        return (i + alpha) / (lookup.length - 1);
      }
    }
    
    return s;
  }

  // Calculate Frenet frame (T, N, B) for curve orientation
  private calculateFrenetFrame(curve: THREE.Curve<THREE.Vector3>, t: number): FrenetFrame {
    const delta = 0.001;
    
    // First derivative (tangent)
    const p1 = curve.getPoint(Math.max(0, t - delta));
    const p2 = curve.getPoint(Math.min(1, t + delta));
    const tangent = new THREE.Vector3().subVectors(p2, p1).normalize();
    
    // Second derivative (for curvature)
    const p0 = curve.getPoint(Math.max(0, t - 2 * delta));
    const p3 = curve.getPoint(Math.min(1, t + 2 * delta));
    const secondDerivative = new THREE.Vector3()
      .subVectors(p3, p1)
      .sub(new THREE.Vector3().subVectors(p1, p0))
      .divideScalar((2 * delta) * (2 * delta));
    
    // Normal vector (principal normal)
    const normal = new THREE.Vector3().crossVectors(
      tangent,
      new THREE.Vector3().crossVectors(tangent, secondDerivative)
    ).normalize();
    
    // Handle degenerate case
    if (normal.length() === 0) {
      // Use arbitrary perpendicular vector
      const arbitrary = Math.abs(tangent.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
      normal.crossVectors(tangent, arbitrary).normalize();
    }
    
    // Binormal vector
    const binormal = new THREE.Vector3().crossVectors(tangent, normal);
    
    // Curvature
    const curvature = secondDerivative.length();
    
    return {
      position: curve.getPoint(t),
      tangent,
      normal,
      binormal,
      curvature,
      torsion: 0 // Simplified - would need third derivative for full calculation
    };
  }

  // Get list of available curves
  getCurveNames(): string[] {
    return Array.from(this.curves.keys());
  }

  // Get curve definition
  getCurveDefinition(name: string): CurveDefinition | null {
    return this.definitions.get(name) || null;
  }

  // Get THREE.js curve for direct use
  getCurve(name: string): THREE.Curve<THREE.Vector3> | null {
    return this.curves.get(name) || null;
  }

  // Update curve parameters dynamically
  updateCurveParameters(name: string, newParameters: Record<string, number>): void {
    const definition = this.definitions.get(name);
    if (definition) {
      definition.parameters = { ...definition.parameters, ...newParameters };
      
      // Re-register curve with new parameters
      this.registerCurve(definition);
      console.log(`🌀 Curve parameters updated: ${name}`);
    }
  }

  // Create curve from mathematical equation
  createCurveFromEquation(
    name: string,
    equations: { x: string; y: string; z: string },
    parameters: Record<string, number> = {},
    tMin: number = 0,
    tMax: number = 2 * Math.PI
  ): void {
    this.registerCurve({
      name,
      type: 'parametric',
      equation: equations,
      parameters,
      tMin,
      tMax
    });
  }
}

// Global curve engine instance
export const curveEngine = new CurveEngine();
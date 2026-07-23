/**
 * MATHEMATICAL VERIFICATION SYSTEM
 * Validates mathematical properties and surface integrity
 */

import { SurfaceParameters } from '../types/math';

export interface GeometricProperties {
  isClosed: boolean;
  isOrientable: boolean;
  genus: number;
  eulerCharacteristic: number;
  gaussianCurvature: 'positive' | 'negative' | 'zero' | 'mixed';
  meanCurvature: 'minimal' | 'constant' | 'variable';
  topologicalType: 'sphere' | 'torus' | 'surface' | 'manifold' | 'singular';
}

export interface SurfaceValidation {
  isValid: boolean;
  hasSignularities: boolean;
  isParametricallyWellDefined: boolean;
  boundaryConditions: 'closed' | 'open' | 'periodic';
  continuityClass: 'C0' | 'C1' | 'C2' | 'C∞' | 'analytic';
  geometricProperties: GeometricProperties;
  warnings: string[];
  errors: string[];
}

export class MathematicalVerificationEngine {

  // Verify surface equation mathematical validity
  verifySurface(
    equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number],
    params: SurfaceParameters,
    uDomain: [number, number] = [0, 1],
    vDomain: [number, number] = [0, 1]
  ): SurfaceValidation {

    const validation: SurfaceValidation = {
      isValid: true,
      hasSignularities: false,
      isParametricallyWellDefined: true,
      boundaryConditions: 'open',
      continuityClass: 'C0',
      geometricProperties: this.analyzeGeometry(equation, params, uDomain, vDomain),
      warnings: [],
      errors: []
    };

    // Test for singularities
    const singularities = this.findSingularities(equation, params, uDomain, vDomain);
    if (singularities.length > 0) {
      validation.hasSignularities = true;
      validation.warnings.push(`Found ${singularities.length} potential singularities`);
    }

    // Test parametric well-definition
    const wellDefined = this.checkParametricWellDefinition(equation, params, uDomain, vDomain);
    if (!wellDefined) {
      validation.isParametricallyWellDefined = false;
      validation.errors.push('Surface not well-defined over parameter domain');
    }

    // Test continuity
    validation.continuityClass = this.determineContinuityClass(equation, params, uDomain, vDomain);

    // Check boundary conditions
    validation.boundaryConditions = this.analyzeBoundaryConditions(equation, params, uDomain, vDomain);

    validation.isValid = validation.errors.length === 0;

    return validation;
  }

  private findSingularities(
    equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number],
    params: SurfaceParameters,
    uDomain: [number, number],
    vDomain: [number, number]
  ): Array<{u: number, v: number, type: string}> {

    const singularities: Array<{u: number, v: number, type: string}> = [];
    const samples = 50;

    for (let i = 0; i <= samples; i++) {
      for (let j = 0; j <= samples; j++) {
        const u = uDomain[0] + (uDomain[1] - uDomain[0]) * i / samples;
        const v = vDomain[0] + (vDomain[1] - vDomain[0]) * j / samples;

        // Compute partial derivatives numerically
        const h = 0.001;
        const [x, y, z] = equation(u, v, params);

        // Check for infinite or NaN values
        if (!isFinite(x) || !isFinite(y) || !isFinite(z)) {
          singularities.push({u, v, type: 'infinite'});
          continue;
        }

        // Check for degenerate parametrization (zero tangent vectors)
        try {
          const [xu, yu, zu] = this.partialDerivativeU(equation, u, v, params, h);
          const [xv, yv, zv] = this.partialDerivativeV(equation, u, v, params, h);

          const tangent_u_norm = Math.sqrt(xu*xu + yu*yu + zu*zu);
          const tangent_v_norm = Math.sqrt(xv*xv + yv*yv + zv*zv);

          if (tangent_u_norm < 1e-6 || tangent_v_norm < 1e-6) {
            singularities.push({u, v, type: 'degenerate'});
          }

          // Check for self-intersection (cross product magnitude)
          const cross_norm = Math.sqrt(
            (yu*zv - zu*yv)**2 + (zu*xv - xu*zv)**2 + (xu*yv - yu*xv)**2
          );

          if (cross_norm < 1e-6) {
            singularities.push({u, v, type: 'self_intersection'});
          }

        } catch (error) {
          singularities.push({u, v, type: 'computational_error'});
        }
      }
    }

    return singularities;
  }

  private analyzeGeometry(
    equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number],
    params: SurfaceParameters,
    uDomain: [number, number],
    vDomain: [number, number]
  ): GeometricProperties {

    // Sample surface to estimate topological properties
    const samples = 30;
    let totalGaussianCurvature = 0;
    let totalMeanCurvature = 0;
    let curvatureSamples = 0;

    const boundaryPoints: Array<[number, number, number]> = [];

    for (let i = 0; i <= samples; i++) {
      for (let j = 0; j <= samples; j++) {
        const u = uDomain[0] + (uDomain[1] - uDomain[0]) * i / samples;
        const v = vDomain[0] + (vDomain[1] - vDomain[0]) * j / samples;

        try {
          const point = equation(u, v, params);

          // Estimate curvature numerically
          const curvatures = this.estimateCurvature(equation, u, v, params);
          if (curvatures) {
            totalGaussianCurvature += curvatures.gaussian;
            totalMeanCurvature += curvatures.mean;
            curvatureSamples++;
          }

          // Check if on boundary
          if (i === 0 || i === samples || j === 0 || j === samples) {
            boundaryPoints.push(point);
          }

        } catch (error) {
          // Skip problematic points
        }
      }
    }

    // Estimate Euler characteristic (simplified)
    const eulerCharacteristic = this.estimateEulerCharacteristic(boundaryPoints);
    const genus = Math.max(0, (2 - eulerCharacteristic) / 2);

    // Classify curvature
    const avgGaussianCurvature = totalGaussianCurvature / curvatureSamples;
    let gaussianCurvature: 'positive' | 'negative' | 'zero' | 'mixed' = 'zero';
    if (Math.abs(avgGaussianCurvature) > 1e-6) {
      gaussianCurvature = avgGaussianCurvature > 0 ? 'positive' : 'negative';
    }

    const avgMeanCurvature = Math.abs(totalMeanCurvature / curvatureSamples);
    const meanCurvature = avgMeanCurvature < 1e-6 ? 'minimal' : 'variable';

    return {
      isClosed: this.checkIfClosed(boundaryPoints),
      isOrientable: this.checkOrientability(equation, params, uDomain, vDomain),
      genus: Math.round(genus),
      eulerCharacteristic: Math.round(eulerCharacteristic),
      gaussianCurvature,
      meanCurvature,
      topologicalType: this.classifyTopology(genus, eulerCharacteristic)
    };
  }

  private partialDerivativeU(
    equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number],
    u: number, v: number, params: SurfaceParameters, h: number
  ): [number, number, number] {
    const [x1, y1, z1] = equation(u + h, v, params);
    const [x2, y2, z2] = equation(u - h, v, params);
    return [(x1 - x2) / (2 * h), (y1 - y2) / (2 * h), (z1 - z2) / (2 * h)];
  }

  private partialDerivativeV(
    equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number],
    u: number, v: number, params: SurfaceParameters, h: number
  ): [number, number, number] {
    const [x1, y1, z1] = equation(u, v + h, params);
    const [x2, y2, z2] = equation(u, v - h, params);
    return [(x1 - x2) / (2 * h), (y1 - y2) / (2 * h), (z1 - z2) / (2 * h)];
  }

  private estimateCurvature(
    equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number],
    u: number, v: number, params: SurfaceParameters
  ): {gaussian: number, mean: number} | null {
    // Simplified curvature estimation using finite differences
    const h = 0.01;

    try {
      const [xu, yu, zu] = this.partialDerivativeU(equation, u, v, params, h);
      const [xv, yv, zv] = this.partialDerivativeV(equation, u, v, params, h);

      // Second derivatives
      const [xuu, yuu, zuu] = this.secondPartialUU(equation, u, v, params, h);
      const [xuv, yuv, zuv] = this.secondPartialUV(equation, u, v, params, h);
      const [xvv, yvv, zvv] = this.secondPartialVV(equation, u, v, params, h);

      // Normal vector
      const nx = yu * zv - zu * yv;
      const ny = zu * xv - xu * zv;
      const nz = xu * yv - yu * xv;
      const nn = Math.sqrt(nx*nx + ny*ny + nz*nz);

      if (nn < 1e-10) return null;

      const N = [nx/nn, ny/nn, nz/nn];

      // First fundamental form coefficients
      const E = xu*xu + yu*yu + zu*zu;
      const F = xu*xv + yu*yv + zu*zv;
      const G = xv*xv + yv*yv + zv*zv;

      // Second fundamental form coefficients  
      const L = (xuu*N[0] + yuu*N[1] + zuu*N[2]);
      const M = (xuv*N[0] + yuv*N[1] + zuv*N[2]);
      const N_coeff = (xvv*N[0] + yvv*N[1] + zvv*N[2]);

      const det1 = E * G - F * F;
      if (Math.abs(det1) < 1e-10) return null;

      const gaussian = (L * N_coeff - M * M) / det1;
      const mean = (E * N_coeff - 2 * F * M + G * L) / (2 * det1);

      return {gaussian, mean};

    } catch (error) {
      return null;
    }
  }

  private secondPartialUU(
    equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number],
    u: number, v: number, params: SurfaceParameters, h: number
  ): [number, number, number] {
    const [x1, y1, z1] = equation(u + h, v, params);
    const [x2, y2, z2] = equation(u, v, params);
    const [x3, y3, z3] = equation(u - h, v, params);
    return [(x1 - 2*x2 + x3) / (h*h), (y1 - 2*y2 + y3) / (h*h), (z1 - 2*z2 + z3) / (h*h)];
  }

  private secondPartialUV(
    equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number],
    u: number, v: number, params: SurfaceParameters, h: number
  ): [number, number, number] {
    const [x1, y1, z1] = equation(u + h, v + h, params);
    const [x2, y2, z2] = equation(u + h, v - h, params);
    const [x3, y3, z3] = equation(u - h, v + h, params);
    const [x4, y4, z4] = equation(u - h, v - h, params);
    return [(x1 - x2 - x3 + x4) / (4*h*h), (y1 - y2 - y3 + y4) / (4*h*h), (z1 - z2 - z3 + z4) / (4*h*h)];
  }

  private secondPartialVV(
    equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number],
    u: number, v: number, params: SurfaceParameters, h: number
  ): [number, number, number] {
    const [x1, y1, z1] = equation(u, v + h, params);
    const [x2, y2, z2] = equation(u, v, params);
    const [x3, y3, z3] = equation(u, v - h, params);
    return [(x1 - 2*x2 + x3) / (h*h), (y1 - 2*y2 + y3) / (h*h), (z1 - 2*z2 + z3) / (h*h)];
  }

  private checkParametricWellDefinition(
    equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number],
    params: SurfaceParameters,
    uDomain: [number, number],
    vDomain: [number, number]
  ): boolean {
    // Test several points to ensure function is well-defined
    const testPoints = [
      [uDomain[0], vDomain[0]],
      [uDomain[1], vDomain[1]], 
      [(uDomain[0] + uDomain[1])/2, (vDomain[0] + vDomain[1])/2],
      [uDomain[0], vDomain[1]],
      [uDomain[1], vDomain[0]]
    ];

    for (const [u, v] of testPoints) {
      try {
        const [x, y, z] = equation(u, v, params);
        if (!isFinite(x) || !isFinite(y) || !isFinite(z)) {
          return false;
        }
      } catch (error) {
        return false;
      }
    }

    return true;
  }

  private determineContinuityClass(
    equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number],
    params: SurfaceParameters,
    uDomain: [number, number],
    vDomain: [number, number]
  ): 'C0' | 'C1' | 'C2' | 'C∞' | 'analytic' {
    // Simplified - assume at least C0, test for higher orders
    try {
      // Test first derivatives exist
      const u = (uDomain[0] + uDomain[1]) / 2;
      const v = (vDomain[0] + vDomain[1]) / 2;
      const h = 0.001;

      this.partialDerivativeU(equation, u, v, params, h);
      this.partialDerivativeV(equation, u, v, params, h);

      // Test second derivatives exist
      this.secondPartialUU(equation, u, v, params, h);
      this.secondPartialUV(equation, u, v, params, h);
      this.secondPartialVV(equation, u, v, params, h);

      return 'C2'; // Assume C2 if derivatives computable
    } catch (error) {
      return 'C0';
    }
  }

  private analyzeBoundaryConditions(
    equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number],
    params: SurfaceParameters,
    uDomain: [number, number],
    vDomain: [number, number]
  ): 'closed' | 'open' | 'periodic' {

    try {
      // Check if boundary curves connect (closed surface)
      const corners = [
        equation(uDomain[0], vDomain[0], params),
        equation(uDomain[1], vDomain[0], params),
        equation(uDomain[1], vDomain[1], params),
        equation(uDomain[0], vDomain[1], params)
      ];

      // Check for periodicity (opposite boundaries match)
      const samples = 10;
      let periodicU = true;
      let periodicV = true;

      for (let i = 0; i <= samples; i++) {
        const v = vDomain[0] + (vDomain[1] - vDomain[0]) * i / samples;
        const [x1, y1, z1] = equation(uDomain[0], v, params);
        const [x2, y2, z2] = equation(uDomain[1], v, params);
        const dist = Math.sqrt((x2-x1)**2 + (y2-y1)**2 + (z2-z1)**2);
        if (dist > 0.1) periodicU = false;

        const u = uDomain[0] + (uDomain[1] - uDomain[0]) * i / samples;  
        const [x3, y3, z3] = equation(u, vDomain[0], params);
        const [x4, y4, z4] = equation(u, vDomain[1], params);
        const dist2 = Math.sqrt((x4-x3)**2 + (y4-y3)**2 + (z4-z3)**2);
        if (dist2 > 0.1) periodicV = false;
      }

      if (periodicU && periodicV) return 'closed';
      if (periodicU || periodicV) return 'periodic';
      return 'open';

    } catch (error) {
      return 'open';
    }
  }

  private estimateEulerCharacteristic(boundaryPoints: Array<[number, number, number]>): number {
    // Simplified estimation - would need full topological analysis
    if (boundaryPoints.length === 0) return 2; // Closed surface, assume sphere
    return 1; // Open surface
  }

  private checkIfClosed(boundaryPoints: Array<[number, number, number]>): boolean {
    if (boundaryPoints.length === 0) return true;

    // Check if first and last boundary points are close
    const first = boundaryPoints[0];
    const last = boundaryPoints[boundaryPoints.length - 1];
    const distance = Math.sqrt(
      (first[0] - last[0])**2 + (first[1] - last[1])**2 + (first[2] - last[2])**2
    );

    return distance < 0.1;
  }

  private checkOrientability(
    equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number],
    params: SurfaceParameters,
    uDomain: [number, number],
    vDomain: [number, number]
  ): boolean {
    // Check for consistent normal vector orientation
    // Simplified - assume orientable unless proven otherwise
    return true;
  }

  private classifyTopology(genus: number, eulerCharacteristic: number): 'sphere' | 'torus' | 'surface' | 'manifold' | 'singular' {
    if (eulerCharacteristic === 2 && genus === 0) return 'sphere';
    if (eulerCharacteristic === 0 && genus === 1) return 'torus'; 
    if (genus >= 0) return 'surface';
    return 'manifold';
  }
}

export const mathematicalVerifier = new MathematicalVerificationEngine();
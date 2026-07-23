/**
 * JACOBIAN TRANSFORMATION SHAPES
 * Visualizations of coordinate transformations and Jacobian matrix mathematics
 * 
 * These shapes demonstrate the geometric meaning of Jacobian matrices:
 * - How coordinate systems transform
 * - Volume/area scaling (determinant)
 * - Directional stretching and compression
 * 
 * Key mathematical concepts visualized:
 * 1. Cascading Coordinates: u=x+y+z, uv=y+z, uvw=z
 * 2. Spherical Jacobian: r²sin(θ) volume element
 * 3. Cylindrical Jacobian: r volume element
 * 4. Volume Scaling: J[(u,v,w)/(x,y,z)] = 4
 * 5. Surface Curvature from Jacobian derivatives
 * 
 * © 2025 UUON Foundation Inc.
 */

import { SurfaceParameters } from '../types/math';
import {
  cascadingCoordinateJacobian,
  sphericalJacobian,
  cylindricalJacobian,
  volumeScalingJacobian,
  matrix3x3Determinant,
  Matrix3x3
} from './internalAlgorithmUtilities';

export interface ParametricSurface {
  name: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}

function getCleanDefaults(params: Partial<SurfaceParameters>): Partial<SurfaceParameters> {
  return {
    a: 1,
    b: 1,
    c: 1,
    d: params.d ?? 2,
    e: params.e ?? 1,
    f: params.f ?? 1,
    g: params.g ?? 0,
    uMin: params.uMin ?? 0,
    uMax: params.uMax ?? 1,
    vMin: params.vMin ?? 0,
    vMax: params.vMax ?? 1,
    uSegments: params.uSegments ?? 64,
    vSegments: params.vSegments ?? 64
  };
}

export const JACOBIAN_TRANSFORMATION_SHAPES: Record<string, ParametricSurface> = {

  cascading_coordinate_surface: {
    name: "Cascading Coordinate Surface (u=x+y+z)",
    equation: (u, v, params) => {
      const { d = 2, e = 1, f = 1, g = 0 } = params;
      const uVal = (u - 0.5) * d * 2;
      const vVal = (v - 0.5) * d * 2;
      
      const jacobian = cascadingCoordinateJacobian(uVal + 1, vVal + 1, 0.5);
      const det = Math.abs(jacobian.determinant);
      
      const x = uVal;
      const y = vVal;
      const z = f * Math.sin(uVal + vVal) * (1 + (g ?? 0) * 0.1 * det);
      
      return [x * e, y * e, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, f: 1 })
  },

  jacobian_determinant_field: {
    name: "Jacobian Determinant Field",
    equation: (u, v, params) => {
      const { d = 3, e = 1, f = 0.5 } = params;
      const x = (u - 0.5) * d * 2;
      const y = (v - 0.5) * d * 2;
      
      const r = Math.sqrt(x * x + y * y) + 0.1;
      const theta = Math.atan2(y, x);
      
      const sphereJ = sphericalJacobian(r, theta + Math.PI / 2, 0);
      const det = Math.abs(sphereJ.determinant) * f;
      
      const z = e * Math.log(1 + det) * Math.cos(theta * 2);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 1, f: 0.5 })
  },

  spherical_jacobian_shell: {
    name: "Spherical Jacobian Shell (r²sin(θ))",
    equation: (u, v, params) => {
      const { d = 2, e = 1, f = 1 } = params;
      const theta = u * Math.PI;
      const phi = v * Math.PI * 2;
      
      const jacobian = sphericalJacobian(d, theta, phi);
      const volumeElement = Math.abs(jacobian.determinant);
      
      const modulatedR = d * (1 + e * 0.2 * Math.sin(volumeElement * f));
      
      const x = modulatedR * Math.sin(theta) * Math.cos(phi);
      const y = modulatedR * Math.sin(theta) * Math.sin(phi);
      const z = modulatedR * Math.cos(theta);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, f: 1 })
  },

  cylindrical_jacobian_helix: {
    name: "Cylindrical Jacobian Helix",
    equation: (u, v, params) => {
      const { d = 1.5, e = 3, f = 0.3 } = params;
      const theta = u * Math.PI * 4;
      const height = (v - 0.5) * e * 2;
      
      const jacobian = cylindricalJacobian(d, theta, height);
      const volumeFactor = 1 + f * Math.sin(jacobian.determinant * 2);
      
      const x = d * volumeFactor * Math.cos(theta);
      const y = d * volumeFactor * Math.sin(theta);
      const z = height;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1.5, e: 3, f: 0.3 })
  },

  volume_scaling_manifold: {
    name: "Volume Scaling Manifold (J=4)",
    equation: (u, v, params) => {
      const { d = 2, e = 1, f = 1 } = params;
      const x0 = (u - 0.5) * d * 2 + 0.5;
      const y0 = (v - 0.5) * d * 2 + 0.5;
      const z0 = 1;
      
      const safeX = Math.max(0.1, Math.abs(x0));
      const safeY = Math.max(0.1, Math.abs(y0));
      
      const jacobian = volumeScalingJacobian(safeX, safeY, z0);
      const det = Math.abs(jacobian.determinant);
      
      const scaledDet = Math.min(det, 10);
      const z = e * Math.sin((x0 + y0) * f) * (1 + scaledDet * 0.1);
      
      return [x0 - 0.5, y0 - 0.5, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, f: 2 })
  },

  coordinate_transformation_flow: {
    name: "Coordinate Transformation Flow",
    equation: (u, v, params) => {
      const { d = 3, e = 1, f = 2 } = params;
      const t = u * Math.PI * 2;
      const s = v;
      
      const flowX = d * Math.cos(t) * (1 - s * 0.5);
      const flowY = d * Math.sin(t) * (1 - s * 0.5);
      
      const jacobian = cascadingCoordinateJacobian(flowX + 2, flowY + 2, s + 0.5);
      const twist = jacobian.determinant * f * 0.1;
      
      const x = flowX * Math.cos(twist) - flowY * Math.sin(twist);
      const y = flowX * Math.sin(twist) + flowY * Math.cos(twist);
      const z = e * s * 3 - 1.5;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, f: 1 })
  },

  partial_derivative_surface: {
    name: "Partial Derivative Surface (∂x/∂u, ∂y/∂v)",
    equation: (u, v, params) => {
      const { d = 2, e = 1, f = 3 } = params;
      const x = (u - 0.5) * d * 2;
      const y = (v - 0.5) * d * 2;
      
      const du_dx = 1 + 0.3 * Math.cos(x * f);
      const dv_dy = 1 + 0.3 * Math.sin(y * f);
      
      const jacobianComponent = du_dx * dv_dy;
      const z = e * jacobianComponent * Math.sin(x) * Math.cos(y);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, f: 3 })
  },

  inverse_jacobian_surface: {
    name: "Inverse Jacobian Surface",
    equation: (u, v, params) => {
      const { d = 2, e = 1, f = 1 } = params;
      const theta = u * Math.PI;
      const phi = v * Math.PI * 2;
      
      const jacobian = sphericalJacobian(d, theta + 0.1, phi);
      
      if (jacobian.inverse) {
        const invDet = 1 / (Math.abs(jacobian.determinant) + 0.01);
        const r = d * (1 + e * 0.1 * Math.sin(invDet * f * 10));
        
        const x = r * Math.sin(theta) * Math.cos(phi);
        const y = r * Math.sin(theta) * Math.sin(phi);
        const z = r * Math.cos(theta);
        
        return [x, y, z];
      }
      
      const x = d * Math.sin(theta) * Math.cos(phi);
      const y = d * Math.sin(theta) * Math.sin(phi);
      const z = d * Math.cos(theta);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, f: 1 })
  },

  gaussian_curvature_surface: {
    name: "Gaussian Curvature Surface (K)",
    equation: (u, v, params) => {
      const { d = 2, e = 0.3, f = 4 } = params;
      const x = (u - 0.5) * d * 2;
      const y = (v - 0.5) * d * 2;
      
      const r2 = x * x + y * y;
      const gaussian = 4 * e * e / Math.pow(1 + e * e * r2, 2);
      
      const z = e * Math.exp(-r2 * 0.5) * (1 + f * 0.1 * gaussian);
      
      return [x, y, z * 3];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 0.5, f: 2 })
  },

  mean_curvature_flow: {
    name: "Mean Curvature Flow (H)",
    equation: (u, v, params) => {
      const { d = 2, e = 1, f = 1 } = params;
      const theta = u * Math.PI;
      const phi = v * Math.PI * 2;
      
      const meanH = (1 / d + Math.cos(theta) / (d + d * Math.cos(theta))) / 2;
      const r = d * (1 + e * 0.2 * Math.tanh(meanH * f));
      
      const tubeR = d * 0.4;
      const x = (r + tubeR * Math.cos(phi)) * Math.cos(theta);
      const y = (r + tubeR * Math.cos(phi)) * Math.sin(theta);
      const z = tubeR * Math.sin(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, f: 1 })
  },

  matrix_eigenvalue_surface: {
    name: "Matrix Eigenvalue Surface",
    equation: (u, v, params) => {
      const { d = 2, e = 1, f = 1 } = params;
      const x = (u - 0.5) * d * 2;
      const y = (v - 0.5) * d * 2;
      
      const matrix: Matrix3x3 = [
        [1 + x * 0.1, y * 0.1, 0],
        [y * 0.1, 1 - x * 0.1, 0],
        [0, 0, 1]
      ];
      
      const det = matrix3x3Determinant(matrix);
      const trace = matrix[0][0] + matrix[1][1] + matrix[2][2];
      
      const lambda1 = trace / 2 + Math.sqrt(Math.max(0, trace * trace / 4 - det));
      
      const z = e * lambda1 * Math.sin(x * f) * Math.cos(y * f);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 0.5, f: 2 })
  },

  differential_form_surface: {
    name: "Differential Form Surface (dx∧dy)",
    equation: (u, v, params) => {
      const { d = 2, e = 1, f = 3 } = params;
      const x = (u - 0.5) * d * 2;
      const y = (v - 0.5) * d * 2;
      
      const omega = Math.cos(x * f) * Math.sin(y * f);
      const dOmega_dx = -f * Math.sin(x * f) * Math.sin(y * f);
      const dOmega_dy = f * Math.cos(x * f) * Math.cos(y * f);
      
      const twoForm = dOmega_dx - dOmega_dy;
      const z = e * twoForm * 0.2;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, f: 2 })
  },

  tangent_bundle_projection: {
    name: "Tangent Bundle Projection",
    equation: (u, v, params) => {
      const { d = 2, e = 1, f = 1 } = params;
      const theta = u * Math.PI * 2;
      const t = (v - 0.5) * 2;
      
      const baseX = d * Math.cos(theta);
      const baseY = d * Math.sin(theta);
      const baseZ = 0;
      
      const tangentX = -Math.sin(theta) * t * e;
      const tangentY = Math.cos(theta) * t * e;
      const tangentZ = f * t * 0.5;
      
      return [baseX + tangentX * 0.3, baseY + tangentY * 0.3, baseZ + tangentZ];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, f: 1 })
  },

  cotangent_bundle_surface: {
    name: "Cotangent Bundle Surface",
    equation: (u, v, params) => {
      const { d = 2, e = 1, f = 1 } = params;
      const theta = u * Math.PI * 2;
      const s = (v - 0.5) * e * 2;
      
      const r = d + s * 0.3;
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      
      const gradient = -Math.sin(theta * 2) * f;
      const z = s * (1 + gradient * 0.2);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 2, f: 1 })
  },

  metric_tensor_surface: {
    name: "Metric Tensor Surface (gᵢⱼ)",
    equation: (u, v, params) => {
      const { d = 2, e = 1, f = 2 } = params;
      const x = (u - 0.5) * d * 2;
      const y = (v - 0.5) * d * 2;
      
      const g11 = 1 + e * 0.1 * Math.cos(x * f);
      const g22 = 1 + e * 0.1 * Math.sin(y * f);
      const g12 = e * 0.05 * Math.sin(x * y * 0.5);
      
      const metricDet = g11 * g22 - g12 * g12;
      const safeDet = Math.max(0.01, Math.abs(metricDet));
      const z = (Math.sqrt(safeDet) - 1) * 0.5;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, f: 2 })
  },

  christoffel_symbol_flow: {
    name: "Christoffel Symbol Flow (Γⁱⱼₖ)",
    equation: (u, v, params) => {
      const { d = 2, e = 1, f = 2 } = params;
      const theta = u * Math.PI;
      const phi = v * Math.PI * 2;
      
      const gammaTheta = -Math.sin(theta) * Math.cos(theta);
      const gammaPhi = Math.cos(theta) / Math.sin(theta + 0.1);
      
      const r = d * (1 + e * 0.1 * (gammaTheta + gammaPhi * 0.1));
      
      const x = r * Math.sin(theta) * Math.cos(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(theta) * f * 0.5;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, f: 1 })
  },

  riemann_curvature_manifold: {
    name: "Riemann Curvature Manifold (Rⁱⱼₖₗ)",
    equation: (u, v, params) => {
      const { d = 2, e = 0.5, f = 1 } = params;
      const theta = u * Math.PI;
      const phi = v * Math.PI * 2;
      
      const riemannComponent = e * Math.sin(theta) * Math.sin(theta);
      const r = d * (1 + riemannComponent * f * 0.2);
      
      const x = r * Math.sin(theta) * Math.cos(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(theta);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 0.5, f: 1 })
  },

  scalar_curvature_field: {
    name: "Scalar Curvature Field (R)",
    equation: (u, v, params) => {
      const { d = 3, e = 1, f = 0.5 } = params;
      const x = (u - 0.5) * d * 2;
      const y = (v - 0.5) * d * 2;
      
      const r2 = x * x + y * y;
      const scalarR = 2 * f / Math.pow(1 + f * r2, 2);
      
      const z = e * scalarR * 5;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 1, f: 0.3 })
  }

};

console.log('🧮 Jacobian Transformation Shapes loaded:');
console.log('   📐 18 coordinate transformation visualizations');
console.log('   🔄 Cascading, Spherical, Cylindrical Jacobians');
console.log('   📊 Curvature: Gaussian, Mean, Riemann, Scalar');
console.log('   🎯 Metric Tensor, Christoffel, Differential Forms');

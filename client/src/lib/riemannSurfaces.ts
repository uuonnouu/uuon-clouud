/**
 * RIEMANN SURFACES & DIFFERENTIAL GEOMETRY LIBRARY
 * Bernhard Riemann (1826-1866) - Foundational work 1854
 * 
 * Multi-valued function visualizations with branch cuts and sheets
 * Including core Riemannian geometry algorithms
 */

import { SurfaceParameters } from '../types/math';
import { ParametricSurface, getCleanDefaults } from '../types/shapes';

export const RIEMANN_SURFACES: Record<string, ParametricSurface> = {
  
  // Square root function: z^(1/2) - two-sheeted surface (Riemann 1851)
  square_root_riemann: {
    name: "Square Root Riemann Surface",
    description: "Two-sheeted surface for w = sqrt(z), Riemann 1851",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const a = params.d ?? 1;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      
      const rho = a * u + 0.5;
      const theta = c * v * 2 * Math.PI;
      const sheet = Math.floor(theta / (2 * Math.PI)) % 2;
      const adjustedTheta = theta - 2 * Math.PI * sheet;
      
      const sqrtRho = Math.sqrt(Math.abs(rho));
      const sqrtTheta = adjustedTheta / 2 + sheet * Math.PI;
      
      const x = b * sqrtRho * Math.cos(sqrtTheta);
      const y = b * sqrtRho * Math.sin(sqrtTheta);
      const z = sheet * 0.5 + 0.1 * Math.sin(u * 3);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, f: 2, uMin: 0, uMax: 2, vMin: 0, vMax: 2 })
  },

  // Logarithm function: ln(z) - infinite sheeted surface (Riemann 1851)
  logarithm_riemann: {
    name: "Logarithmic Riemann Surface",
    description: "Helical surface for w = ln(z), Riemann 1851",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const a = params.d ?? 1;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      
      const rho = Math.exp(a * (u - 0.5));
      const theta = b * v * 4 * Math.PI;
      
      const x = rho * Math.cos(theta);
      const y = rho * Math.sin(theta);
      const z = c * theta / (2 * Math.PI);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 1, f: 0.5, uMin: -1, uMax: 1, vMin: 0, vMax: 1 })
  },

  // Complex exponential: e^z - periodic in imaginary direction
  exponential_riemann: {
    name: "Exponential Riemann Surface",
    description: "Complex exponential e^z visualization",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const a = params.d ?? 1;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      
      const realPart = a * (u - 0.5) * 2;
      const imagPart = b * v * 2 * Math.PI;
      
      const magnitude = Math.exp(realPart);
      const cappedMag = Math.min(magnitude, 5);
      
      const x = cappedMag * Math.cos(imagPart);
      const y = cappedMag * Math.sin(imagPart);
      const z = c * imagPart / Math.PI;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 1, f: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1 })
  },

  // Nth root function: z^(1/n) - n-sheeted surface
  nth_root_riemann: {
    name: "Nth Root Riemann Surface",
    description: "N-sheeted surface for z^(1/n)",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const a = params.d ?? 1;
      const b = params.e ?? 1;
      const c = params.f ?? 3;
      
      const rootOrder = Math.max(2, Math.floor(c));
      const rho = Math.abs(a * u + 0.5);
      const theta = b * v * 2 * Math.PI * rootOrder;
      const sheet = Math.floor(theta / (2 * Math.PI)) % rootOrder;
      
      const nthRootRho = Math.pow(rho, 1 / rootOrder);
      const nthRootTheta = theta / rootOrder;
      
      const x = nthRootRho * Math.cos(nthRootTheta);
      const y = nthRootRho * Math.sin(nthRootTheta);
      const z = sheet * 0.3;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, f: 3, uMin: 0, uMax: 2, vMin: 0, vMax: 1 })
  },

  // Elliptic function - doubly periodic (Jacobi, Weierstrass)
  elliptic_function: {
    name: "Elliptic Function Surface",
    description: "Doubly periodic meromorphic function, Jacobi/Weierstrass",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const a = params.d ?? 1;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      
      const modulus = 0.5;
      const uScaled = a * (u - 0.5) * 4;
      const vScaled = b * (v - 0.5) * 4;
      
      const sn = Math.sin(uScaled) / Math.cosh(vScaled);
      const cn = Math.cos(uScaled) / Math.cosh(vScaled);
      const dn = Math.sqrt(1 - modulus * sn * sn);
      
      const x = sn * c;
      const y = cn * c;
      const z = dn * c * 0.5;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 1, f: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1 })
  },

  // Christoffel Symbols Field (Christoffel 1869)
  christoffel_symbols_surface: {
    name: "Christoffel Symbols Field",
    description: "Connection coefficients, Christoffel 1869",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const a = params.d ?? 1;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      
      const uScaled = (u - 0.5) * 4 * a;
      const vScaled = (v - 0.5) * 4 * b;
      
      const gamma111 = -Math.sin(uScaled) * Math.cos(vScaled);
      const gamma122 = Math.cos(uScaled) * Math.sin(vScaled);
      const gamma212 = -0.5 * Math.sin(uScaled + vScaled);
      
      const x = gamma111 * c;
      const y = gamma122 * c;
      const z = gamma212 * c;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 1, f: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1 })
  },

  // Riemann Curvature Tensor (Riemann 1854)
  riemann_curvature_surface: {
    name: "Riemann Curvature Tensor",
    description: "R^l_ijk curvature tensor, Riemann 1854",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const a = params.d ?? 1;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      
      const uScaled = (u - 0.5) * 2 * Math.PI * a;
      const vScaled = (v - 0.5) * 2 * Math.PI * b;
      
      const K = Math.sin(uScaled) * Math.cos(vScaled);
      const rho = 1 + 0.3 * K;
      
      const x = rho * Math.cos(uScaled) * Math.sin(vScaled) * c;
      const y = rho * Math.sin(uScaled) * Math.sin(vScaled) * c;
      const z = rho * Math.cos(vScaled) * c;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 1, f: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1 })
  },

  // Ricci Curvature Tensor (Ricci 1887, Levi-Civita 1900)
  ricci_curvature_surface: {
    name: "Ricci Curvature Tensor",
    description: "R_ij = R^k_ikj, Ricci 1887",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const a = params.d ?? 1;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      
      const uScaled = (u - 0.5) * 2 * Math.PI * a;
      const vScaled = (v - 0.5) * 2 * Math.PI * b;
      
      const R11 = Math.cos(uScaled) * Math.cos(vScaled);
      const R22 = Math.sin(uScaled) * Math.sin(vScaled);
      const R = R11 + R22;
      
      const x = (1 + 0.2 * R11) * Math.cos(uScaled) * c;
      const y = (1 + 0.2 * R22) * Math.sin(uScaled) * c;
      const z = 0.5 * R * c;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 1, f: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1 })
  },

  // Scalar Curvature (Ricci scalar)
  scalar_curvature_surface: {
    name: "Scalar Curvature Surface",
    description: "R = g^ij R_ij, total curvature",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const a = params.d ?? 1;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      
      const uScaled = (u - 0.5) * 2 * Math.PI * a;
      const vScaled = (v - 0.5) * 2 * Math.PI * b;
      
      const R = 2 * Math.cos(uScaled) * Math.cos(vScaled);
      const rho = 1 + 0.3 * R;
      
      const x = rho * Math.cos(uScaled) * c;
      const y = rho * Math.sin(uScaled) * c;
      const z = R * 0.5 * c;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 1, f: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1 })
  },

  // Geodesic Flow Surface
  geodesic_flow_surface: {
    name: "Geodesic Flow Surface",
    description: "Shortest paths on curved manifold",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const a = params.d ?? 1;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      
      const t = u * 2 * Math.PI * a;
      const s = (v - 0.5) * 2 * b;
      
      const x = Math.cos(t) * (1 + 0.3 * Math.cos(3 * t)) * c;
      const y = Math.sin(t) * (1 + 0.3 * Math.cos(3 * t)) * c;
      const z = s + 0.2 * Math.sin(5 * t) * c;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 1, f: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1 })
  },

  // Parallel Transport Surface (Levi-Civita 1917)
  parallel_transport_surface: {
    name: "Parallel Transport Surface",
    description: "Vector transport along curves, Levi-Civita 1917",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const a = params.d ?? 1;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      
      const theta = u * 2 * Math.PI * a;
      const phi = v * Math.PI * b;
      
      const holonomy = 0.2 * Math.sin(theta) * Math.sin(phi);
      
      const x = (1 + holonomy) * Math.cos(theta) * Math.sin(phi) * c;
      const y = (1 + holonomy) * Math.sin(theta) * Math.sin(phi) * c;
      const z = (1 + holonomy) * Math.cos(phi) * c;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 1, f: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1 })
  },

  // Exponential Map Surface
  exponential_map_surface: {
    name: "Exponential Map Surface",
    description: "exp_p: T_pM to M mapping",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const a = params.d ?? 1;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      
      const r = u * 2 * a;
      const theta = v * 2 * Math.PI * b;
      
      const geodesicDist = r;
      const curvatureEffect = 1 - 0.1 * r * r;
      
      const x = geodesicDist * Math.cos(theta) * curvatureEffect * c;
      const y = geodesicDist * Math.sin(theta) * curvatureEffect * c;
      const z = 0.1 * r * r * c;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 1, f: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1 })
  },

  // Sectional Curvature Surface
  sectional_curvature_surface: {
    name: "Sectional Curvature Surface",
    description: "K(sigma) = R(X,Y,Y,X) / area",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const a = params.d ?? 1;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      
      const uScaled = (u - 0.5) * 2 * Math.PI * a;
      const vScaled = (v - 0.5) * Math.PI * b;
      
      const K = Math.cos(2 * uScaled) * Math.cos(vScaled);
      const rho = 1 + 0.4 * K;
      
      const x = rho * Math.cos(uScaled) * Math.sin(vScaled + Math.PI / 2) * c;
      const y = rho * Math.sin(uScaled) * Math.sin(vScaled + Math.PI / 2) * c;
      const z = rho * Math.cos(vScaled + Math.PI / 2) * c;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 1, f: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1 })
  },

  // Weyl Tensor Surface (Conformal Curvature)
  weyl_tensor_surface: {
    name: "Weyl Tensor Surface",
    description: "Conformal curvature tensor, Hermann Weyl 1918",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const a = params.d ?? 1;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      
      const uScaled = u * 2 * Math.PI * a;
      const vScaled = v * 2 * Math.PI * b;
      
      const weylComponent = Math.sin(2 * uScaled) * Math.cos(2 * vScaled);
      const rho = 1 + 0.3 * weylComponent;
      
      const x = rho * Math.cos(uScaled) * c;
      const y = rho * Math.sin(uScaled) * c;
      const z = weylComponent * c * 0.5;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 1, f: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1 })
  },

  // Laplace-Beltrami Operator Surface
  laplace_beltrami_surface: {
    name: "Laplace-Beltrami Operator",
    description: "Generalized Laplacian on manifolds",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const a = params.d ?? 1;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      
      const uScaled = (u - 0.5) * 4 * a;
      const vScaled = (v - 0.5) * 4 * b;
      
      const f = Math.exp(-(uScaled * uScaled + vScaled * vScaled) / 2);
      const laplacianF = (uScaled * uScaled + vScaled * vScaled - 2) * f;
      
      const x = uScaled * c * 0.5;
      const y = vScaled * c * 0.5;
      const z = laplacianF * c;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 1, f: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1 })
  },

  // Metric Tensor Surface
  metric_tensor_riemann: {
    name: "Metric Tensor Surface",
    description: "g_ij fundamental form, Riemann 1854",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const a = params.d ?? 1;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      
      const uScaled = u * 2 * Math.PI * a;
      const vScaled = v * Math.PI * b;
      
      const g11 = 1 + 0.3 * Math.cos(uScaled);
      const g22 = Math.sin(vScaled) * Math.sin(vScaled);
      
      const x = g11 * Math.cos(uScaled) * Math.sin(vScaled) * c;
      const y = g11 * Math.sin(uScaled) * Math.sin(vScaled) * c;
      const z = g22 * Math.cos(vScaled) * c;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 1, f: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1 })
  },

  // Covariant Derivative Surface
  covariant_derivative_surface: {
    name: "Covariant Derivative Surface",
    description: "Coordinate-independent differentiation",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const a = params.d ?? 1;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      
      const uScaled = u * 2 * Math.PI * a;
      const vScaled = v * 2 * b;
      
      const nablaV = Math.cos(uScaled) + 0.2 * Math.sin(3 * uScaled);
      
      const x = Math.cos(uScaled) * (1 + 0.2 * nablaV) * c;
      const y = Math.sin(uScaled) * (1 + 0.2 * nablaV) * c;
      const z = vScaled * 0.5 * c;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 1, f: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1 })
  },

  // Volume Form Surface
  volume_form_surface: {
    name: "Volume Form Surface",
    description: "dV = sqrt(det(g)) measure on manifolds",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const a = params.d ?? 1;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      
      const uScaled = u * 2 * Math.PI * a;
      const vScaled = v * Math.PI * b;
      
      const detG = Math.sin(vScaled) * Math.sin(vScaled);
      const sqrtDetG = Math.abs(Math.sin(vScaled));
      
      const x = sqrtDetG * Math.cos(uScaled) * c;
      const y = sqrtDetG * Math.sin(uScaled) * c;
      const z = Math.cos(vScaled) * c;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 1, f: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1 })
  }
};

export function getRiemannSurfaceInfo(type: string): {
  name: string;
  description: string;
  mathematicalBasis: string;
  attribution: string;
  year: number;
} {
  const info: Record<string, { name: string; description: string; mathematicalBasis: string; attribution: string; year: number }> = {
    square_root_riemann: {
      name: "Square Root Riemann Surface",
      description: "Two-sheeted surface for w = sqrt(z) with branch cut",
      mathematicalBasis: "Multi-valued square root function z^(1/2)",
      attribution: "Bernhard Riemann",
      year: 1851
    },
    logarithm_riemann: {
      name: "Logarithmic Riemann Surface",
      description: "Infinite-sheeted helical surface for w = ln(z)",
      mathematicalBasis: "Multi-valued logarithm function",
      attribution: "Bernhard Riemann",
      year: 1851
    },
    riemann_curvature_surface: {
      name: "Riemann Curvature Tensor",
      description: "Intrinsic curvature of a manifold",
      mathematicalBasis: "R^l_ijk = dGamma^l_jk/dx^i - dGamma^l_ik/dx^j + Gamma^m_jk*Gamma^l_im - Gamma^m_ik*Gamma^l_jm",
      attribution: "Bernhard Riemann",
      year: 1854
    },
    ricci_curvature_surface: {
      name: "Ricci Curvature Tensor",
      description: "Average curvature contraction of Riemann tensor",
      mathematicalBasis: "R_ij = R^k_ikj",
      attribution: "Gregorio Ricci-Curbastro",
      year: 1887
    },
    christoffel_symbols_surface: {
      name: "Christoffel Symbols",
      description: "Connection coefficients for parallel transport",
      mathematicalBasis: "Gamma^k_ij = (1/2) g^kl (dg_jl/dx^i + dg_il/dx^j - dg_ij/dx^l)",
      attribution: "Elwin Bruno Christoffel",
      year: 1869
    },
    parallel_transport_surface: {
      name: "Parallel Transport",
      description: "Moving vectors along curves while keeping them parallel",
      mathematicalBasis: "DV^k/dt = dV^k/dt + Gamma^k_ij (dx^i/dt) V^j = 0",
      attribution: "Tullio Levi-Civita",
      year: 1917
    },
    weyl_tensor_surface: {
      name: "Weyl Tensor",
      description: "Conformal curvature preserved under angle-preserving transformations",
      mathematicalBasis: "C_ijkl = R_ijkl - Schouten terms",
      attribution: "Hermann Weyl",
      year: 1918
    }
  };

  return info[type] || {
    name: "Riemannian Surface",
    description: "Differential geometry visualization",
    mathematicalBasis: "Riemannian geometry",
    attribution: "Bernhard Riemann",
    year: 1854
  };
}

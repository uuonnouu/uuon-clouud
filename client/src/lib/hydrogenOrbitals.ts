/**
 * HYDROGEN ATOMIC ORBITALS
 * Complete p, d, and f orbital visualizations with proper angular shapes
 * 
 * Orbital shapes based on spherical harmonics Y_l^m(θ,φ)
 * 
 * p-orbitals (l=1): Dumbbell shape, 3 orientations (px, py, pz)
 * d-orbitals (l=2): Cloverleaf shape, 5 orientations (dxy, dxz, dyz, dx²-y², dz²)
 * f-orbitals (l=3): Complex 8-lobe shapes, 7 orientations
 */

import { SurfaceParameters } from '../types/math';

const a0 = 1; // Bohr radius (normalized)

function getCleanDefaults(overrides: Partial<SurfaceParameters> = {}): Partial<SurfaceParameters> {
  return {
    a: 1, b: 1, c: 1, d: 2, e: 1,
    f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
    uMin: 0, uMax: 1, vMin: 0, vMax: 1,
    uSegments: 96, vSegments: 72,
    ...overrides
  };
}

export const HYDROGEN_ORBITALS: Record<string, any> = {

  // ═══════════════════════════════════════════════════════════════════
  // P-ORBITALS (l=1): DUMBBELL SHAPE - Two lobes on opposite sides
  // ═══════════════════════════════════════════════════════════════════

  p_orbital_x: {
    name: "⚛️ p_x Orbital - Dumbbell Along X-Axis",
    description: "l=1, m=±1: Two lobes along x-axis, Y₁¹ ∝ sin(θ)cos(φ)",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const scale = params.d ?? 2;
      const intensity = params.e ?? 1;
      
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      
      // Angular part: |Y₁¹|² ∝ sin²(θ)cos²(φ)
      const angularPart = Math.sin(theta) * Math.cos(phi);
      const angularMagnitude = Math.abs(angularPart);
      
      // Radial part for 2p orbital: R₂₁ ∝ r·e^(-r/2a₀)
      const baseRadius = scale * (0.3 + intensity * angularMagnitude * 1.5);
      
      // Create dumbbell shape with sign information (positive/negative lobes)
      const radius = baseRadius * (1 + 0.8 * Math.pow(angularMagnitude, 0.7));
      
      return [
        radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(theta)
      ];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 64 })
  },

  p_orbital_y: {
    name: "⚛️ p_y Orbital - Dumbbell Along Y-Axis",
    description: "l=1, m=±1: Two lobes along y-axis, Y₁¹ ∝ sin(θ)sin(φ)",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const scale = params.d ?? 2;
      const intensity = params.e ?? 1;
      
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      
      // Angular part: |Y₁¹|² ∝ sin²(θ)sin²(φ)
      const angularPart = Math.sin(theta) * Math.sin(phi);
      const angularMagnitude = Math.abs(angularPart);
      
      const baseRadius = scale * (0.3 + intensity * angularMagnitude * 1.5);
      const radius = baseRadius * (1 + 0.8 * Math.pow(angularMagnitude, 0.7));
      
      return [
        radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(theta)
      ];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, uSegments: 80, vSegments: 64 })
  },

  p_orbital_z: {
    name: "⚛️ p_z Orbital - Dumbbell Along Z-Axis",
    description: "l=1, m=0: Two lobes along z-axis, Y₁⁰ ∝ cos(θ)",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const scale = params.d ?? 2;
      const intensity = params.e ?? 1;
      
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      
      // Angular part: |Y₁⁰|² ∝ cos²(θ)
      const angularPart = Math.cos(theta);
      const angularMagnitude = Math.abs(angularPart);
      
      const baseRadius = scale * (0.3 + intensity * angularMagnitude * 1.5);
      const radius = baseRadius * (1 + 0.8 * Math.pow(angularMagnitude, 0.7));
      
      return [
        radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(theta)
      ];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, uSegments: 80, vSegments: 64 })
  },

  // ═══════════════════════════════════════════════════════════════════
  // D-ORBITALS (l=2): CLOVERLEAF SHAPE - Four lobes (except dz²)
  // ═══════════════════════════════════════════════════════════════════

  d_orbital_xy: {
    name: "⚛️ d_xy Orbital - Cloverleaf in XY Plane",
    description: "l=2, m=±2: Four lobes between x and y axes, Y₂² ∝ sin²(θ)sin(2φ)",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const scale = params.d ?? 2;
      const intensity = params.e ?? 1;
      
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      
      // Angular part: |Y₂²|² ∝ sin⁴(θ)sin²(2φ) = sin⁴(θ)(2sinφcosφ)²
      const sinTheta = Math.sin(theta);
      const angularPart = sinTheta * sinTheta * Math.sin(2 * phi);
      const angularMagnitude = Math.abs(angularPart);
      
      const baseRadius = scale * (0.25 + intensity * angularMagnitude * 1.2);
      const radius = baseRadius * (1 + 0.9 * Math.pow(angularMagnitude, 0.6));
      
      return [
        radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(theta)
      ];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, uSegments: 96, vSegments: 72 })
  },

  d_orbital_xz: {
    name: "⚛️ d_xz Orbital - Cloverleaf in XZ Plane",
    description: "l=2, m=±1: Four lobes between x and z axes, Y₂¹ ∝ sin(θ)cos(θ)cos(φ)",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const scale = params.d ?? 2;
      const intensity = params.e ?? 1;
      
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      
      // Angular part: Y₂¹ ∝ sin(θ)cos(θ)cos(φ) = (1/2)sin(2θ)cos(φ)
      const angularPart = Math.sin(2 * theta) * Math.cos(phi);
      const angularMagnitude = Math.abs(angularPart);
      
      const baseRadius = scale * (0.25 + intensity * angularMagnitude * 1.2);
      const radius = baseRadius * (1 + 0.9 * Math.pow(angularMagnitude, 0.6));
      
      return [
        radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(theta)
      ];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, uSegments: 96, vSegments: 72 })
  },

  d_orbital_yz: {
    name: "⚛️ d_yz Orbital - Cloverleaf in YZ Plane",
    description: "l=2, m=±1: Four lobes between y and z axes, Y₂¹ ∝ sin(θ)cos(θ)sin(φ)",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const scale = params.d ?? 2;
      const intensity = params.e ?? 1;
      
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      
      // Angular part: Y₂¹ ∝ sin(θ)cos(θ)sin(φ) = (1/2)sin(2θ)sin(φ)
      const angularPart = Math.sin(2 * theta) * Math.sin(phi);
      const angularMagnitude = Math.abs(angularPart);
      
      const baseRadius = scale * (0.25 + intensity * angularMagnitude * 1.2);
      const radius = baseRadius * (1 + 0.9 * Math.pow(angularMagnitude, 0.6));
      
      return [
        radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(theta)
      ];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, uSegments: 96, vSegments: 72 })
  },

  d_orbital_x2_y2: {
    name: "⚛️ d_x²-y² Orbital - Cloverleaf Along Axes",
    description: "l=2, m=±2: Four lobes along x and y axes, Y₂² ∝ sin²(θ)cos(2φ)",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const scale = params.d ?? 2;
      const intensity = params.e ?? 1;
      
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      
      // Angular part: |Y₂²|² ∝ sin⁴(θ)cos²(2φ)
      const sinTheta = Math.sin(theta);
      const angularPart = sinTheta * sinTheta * Math.cos(2 * phi);
      const angularMagnitude = Math.abs(angularPart);
      
      const baseRadius = scale * (0.25 + intensity * angularMagnitude * 1.2);
      const radius = baseRadius * (1 + 0.9 * Math.pow(angularMagnitude, 0.6));
      
      return [
        radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(theta)
      ];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, uSegments: 96, vSegments: 72 })
  },

  d_orbital_z2: {
    name: "⚛️ d_z² Orbital - Two Lobes + Donut Ring",
    description: "l=2, m=0: Two lobes along z-axis with torus in xy-plane, Y₂⁰ ∝ 3cos²(θ)-1",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const scale = params.d ?? 2;
      const intensity = params.e ?? 1;
      
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      
      // Angular part: Y₂⁰ ∝ (3cos²θ - 1)
      const cosTheta = Math.cos(theta);
      const angularPart = 3 * cosTheta * cosTheta - 1;
      
      // The dz² orbital has a unique shape: two lobes along z + a donut ring
      // Near equator (θ ≈ 90°), 3cos²θ-1 ≈ -1 (negative, creates the ring)
      // At poles (θ ≈ 0° or 180°), 3cos²θ-1 ≈ 2 (positive, creates lobes)
      
      const positiveContribution = Math.max(0, angularPart);
      const negativeContribution = Math.max(0, -angularPart);
      
      // Create the lobes and ring with different contributions
      const lobeFactor = positiveContribution * 1.5;
      const ringFactor = negativeContribution * 0.6;
      
      const baseRadius = scale * (0.4 + intensity * (lobeFactor + ringFactor));
      const radius = baseRadius * (1 + 0.7 * Math.abs(angularPart) * 0.5);
      
      return [
        radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(theta)
      ];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, uSegments: 96, vSegments: 72 })
  },

  // ═══════════════════════════════════════════════════════════════════
  // F-ORBITALS (l=3): COMPLEX 8-LOBE SHAPES
  // ═══════════════════════════════════════════════════════════════════

  f_orbital_z3: {
    name: "⚛️ f_z³ Orbital - Complex Lobes Along Z",
    description: "l=3, m=0: Complex shape with lobes along z-axis, Y₃⁰ ∝ cos(θ)(5cos²θ-3)",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const scale = params.d ?? 2;
      const intensity = params.e ?? 1;
      
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      
      // Angular part: Y₃⁰ ∝ cos(θ)(5cos²θ - 3)
      const cosTheta = Math.cos(theta);
      const angularPart = cosTheta * (5 * cosTheta * cosTheta - 3);
      const angularMagnitude = Math.abs(angularPart);
      
      const baseRadius = scale * (0.3 + intensity * angularMagnitude * 1.0);
      const radius = baseRadius * (1 + 0.8 * Math.pow(angularMagnitude, 0.5));
      
      return [
        radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(theta)
      ];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, uSegments: 112, vSegments: 84 })
  },

  f_orbital_xz2: {
    name: "⚛️ f_xz² Orbital - 8 Lobes in XZ Plane",
    description: "l=3, m=±1: Eight-lobe structure, Y₃¹ ∝ sin(θ)(5cos²θ-1)cos(φ)",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const scale = params.d ?? 2;
      const intensity = params.e ?? 1;
      
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      
      // Angular part: Y₃¹ ∝ sin(θ)(5cos²θ - 1)cos(φ)
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);
      const angularPart = sinTheta * (5 * cosTheta * cosTheta - 1) * Math.cos(phi);
      const angularMagnitude = Math.abs(angularPart);
      
      const baseRadius = scale * (0.25 + intensity * angularMagnitude * 1.1);
      const radius = baseRadius * (1 + 0.85 * Math.pow(angularMagnitude, 0.55));
      
      return [
        radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(theta)
      ];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, uSegments: 112, vSegments: 84 })
  },

  f_orbital_yz2: {
    name: "⚛️ f_yz² Orbital - 8 Lobes in YZ Plane",
    description: "l=3, m=±1: Eight-lobe structure, Y₃¹ ∝ sin(θ)(5cos²θ-1)sin(φ)",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const scale = params.d ?? 2;
      const intensity = params.e ?? 1;
      
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      
      // Angular part: Y₃¹ ∝ sin(θ)(5cos²θ - 1)sin(φ)
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);
      const angularPart = sinTheta * (5 * cosTheta * cosTheta - 1) * Math.sin(phi);
      const angularMagnitude = Math.abs(angularPart);
      
      const baseRadius = scale * (0.25 + intensity * angularMagnitude * 1.1);
      const radius = baseRadius * (1 + 0.85 * Math.pow(angularMagnitude, 0.55));
      
      return [
        radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(theta)
      ];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, uSegments: 112, vSegments: 84 })
  },

  f_orbital_xyz: {
    name: "⚛️ f_xyz Orbital - 8 Lobes in All Octants",
    description: "l=3, m=±2: Eight lobes in octants, Y₃² ∝ sin²(θ)cos(θ)sin(2φ)",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const scale = params.d ?? 2;
      const intensity = params.e ?? 1;
      
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      
      // Angular part: Y₃² ∝ sin²(θ)cos(θ)sin(2φ)
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);
      const angularPart = sinTheta * sinTheta * cosTheta * Math.sin(2 * phi);
      const angularMagnitude = Math.abs(angularPart);
      
      const baseRadius = scale * (0.25 + intensity * angularMagnitude * 1.3);
      const radius = baseRadius * (1 + 0.9 * Math.pow(angularMagnitude, 0.5));
      
      return [
        radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(theta)
      ];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, uSegments: 112, vSegments: 84 })
  },

  f_orbital_z_x2_y2: {
    name: "⚛️ f_z(x²-y²) Orbital - Complex 8-Lobe",
    description: "l=3, m=±2: Complex shape, Y₃² ∝ sin²(θ)cos(θ)cos(2φ)",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const scale = params.d ?? 2;
      const intensity = params.e ?? 1;
      
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      
      // Angular part: Y₃² ∝ sin²(θ)cos(θ)cos(2φ)
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);
      const angularPart = sinTheta * sinTheta * cosTheta * Math.cos(2 * phi);
      const angularMagnitude = Math.abs(angularPart);
      
      const baseRadius = scale * (0.25 + intensity * angularMagnitude * 1.3);
      const radius = baseRadius * (1 + 0.9 * Math.pow(angularMagnitude, 0.5));
      
      return [
        radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(theta)
      ];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, uSegments: 112, vSegments: 84 })
  },

  f_orbital_x_x2_3y2: {
    name: "⚛️ f_x(x²-3y²) Orbital - Trifoliate Shape",
    description: "l=3, m=±3: Three-fold symmetric lobes, Y₃³ ∝ sin³(θ)cos(3φ)",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const scale = params.d ?? 2;
      const intensity = params.e ?? 1;
      
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      
      // Angular part: Y₃³ ∝ sin³(θ)cos(3φ)
      const sinTheta = Math.sin(theta);
      const angularPart = Math.pow(sinTheta, 3) * Math.cos(3 * phi);
      const angularMagnitude = Math.abs(angularPart);
      
      const baseRadius = scale * (0.2 + intensity * angularMagnitude * 1.4);
      const radius = baseRadius * (1 + 0.95 * Math.pow(angularMagnitude, 0.45));
      
      return [
        radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(theta)
      ];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, uSegments: 112, vSegments: 84 })
  },

  f_orbital_y_3x2_y2: {
    name: "⚛️ f_y(3x²-y²) Orbital - Trifoliate Shape",
    description: "l=3, m=±3: Three-fold symmetric lobes, Y₃³ ∝ sin³(θ)sin(3φ)",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const scale = params.d ?? 2;
      const intensity = params.e ?? 1;
      
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      
      // Angular part: Y₃³ ∝ sin³(θ)sin(3φ)
      const sinTheta = Math.sin(theta);
      const angularPart = Math.pow(sinTheta, 3) * Math.sin(3 * phi);
      const angularMagnitude = Math.abs(angularPart);
      
      const baseRadius = scale * (0.2 + intensity * angularMagnitude * 1.4);
      const radius = baseRadius * (1 + 0.95 * Math.pow(angularMagnitude, 0.45));
      
      return [
        radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(theta)
      ];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, uSegments: 112, vSegments: 84 })
  }
};

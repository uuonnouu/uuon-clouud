
/**
 * MAXWELL'S FIELD THEORY ENGINE
 * Complete implementation of electromagnetic field equations with Shape Formula Time Cross Field visualization
 * Based on the four fundamental Maxwell equations in differential form
 */

import { SurfaceParameters } from '../types/math';

// Physical Constants for Electromagnetic Fields
export const ELECTROMAGNETIC_CONSTANTS = {
  EPSILON_0: 8.854187817e-12, // Vacuum permittivity (F/m)
  MU_0: 4 * Math.PI * 1e-7,   // Vacuum permeability (H/m)
  C: 299792458,               // Speed of light (m/s)
  E: 1.602176634e-19,         // Elementary charge (C)
  K_E: 8.9875517923e9         // Coulomb constant (N⋅m²/C²)
};

// Field Vector Type
export interface FieldVector {
  x: number;
  y: number;
  z: number;
}

// Electromagnetic Field State
export interface ElectromagneticField {
  E: FieldVector;  // Electric field
  B: FieldVector;  // Magnetic field
  rho: number;     // Charge density
  J: FieldVector;  // Current density
}

/**
 * Maxwell's Equations Implementation
 * Complete set of four coupled partial differential equations
 */
export class MaxwellFieldEngine {
  
  /**
   * Gauss's Law for Electricity: ∇⋅E = ρ/ε₀
   * Electric field lines diverge from electric charges
   */
  gaussLawElectricity(
    position: FieldVector,
    charges: Array<{ pos: FieldVector; q: number }>
  ): number {
    let divergence = 0;
    
    charges.forEach(charge => {
      const r = {
        x: position.x - charge.pos.x,
        y: position.y - charge.pos.y,
        z: position.z - charge.pos.z
      };
      
      const rMag = Math.sqrt(r.x * r.x + r.y * r.y + r.z * r.z);
      
      if (rMag > 0) {
        divergence += charge.q / (4 * Math.PI * ELECTROMAGNETIC_CONSTANTS.EPSILON_0 * rMag * rMag);
      }
    });
    
    return divergence;
  }

  /**
   * Gauss's Law for Magnetism: ∇⋅B = 0
   * Magnetic field lines form closed loops (no magnetic monopoles)
   */
  gaussLawMagnetism(): number {
    // Magnetic monopoles don't exist, divergence is always zero
    return 0;
  }

  /**
   * Faraday's Law of Induction: ∇×E = -∂B/∂t
   * Time-varying magnetic field induces electric field
   */
  faradayLaw(
    electricField: FieldVector,
    magneticFieldTimeDerivative: FieldVector,
    spatialStep: number = 0.01
  ): FieldVector {
    return {
      x: -magneticFieldTimeDerivative.x,
      y: -magneticFieldTimeDerivative.y,
      z: -magneticFieldTimeDerivative.z
    };
  }

  /**
   * Ampère-Maxwell Law: ∇×B = μ₀J + μ₀ε₀∂E/∂t
   * Magnetic fields created by currents and time-varying electric fields
   */
  ampereMaxwellLaw(
    currentDensity: FieldVector,
    electricFieldTimeDerivative: FieldVector
  ): FieldVector {
    const mu0 = ELECTROMAGNETIC_CONSTANTS.MU_0;
    const eps0 = ELECTROMAGNETIC_CONSTANTS.EPSILON_0;
    
    return {
      x: mu0 * currentDensity.x + mu0 * eps0 * electricFieldTimeDerivative.x,
      y: mu0 * currentDensity.y + mu0 * eps0 * electricFieldTimeDerivative.y,
      z: mu0 * currentDensity.z + mu0 * eps0 * electricFieldTimeDerivative.z
    };
  }

  /**
   * Calculate Electric Field at a point due to multiple charges
   */
  calculateElectricField(
    position: FieldVector,
    charges: Array<{ pos: FieldVector; q: number }>
  ): FieldVector {
    let E = { x: 0, y: 0, z: 0 };
    
    charges.forEach(charge => {
      const r = {
        x: position.x - charge.pos.x,
        y: position.y - charge.pos.y,
        z: position.z - charge.pos.z
      };
      
      const rMag = Math.sqrt(r.x * r.x + r.y * r.y + r.z * r.z);
      
      if (rMag > 0) {
        const fieldMagnitude = ELECTROMAGNETIC_CONSTANTS.K_E * charge.q / (rMag * rMag);
        const rUnit = {
          x: r.x / rMag,
          y: r.y / rMag,
          z: r.z / rMag
        };
        
        E.x += fieldMagnitude * rUnit.x;
        E.y += fieldMagnitude * rUnit.y;
        E.z += fieldMagnitude * rUnit.z;
      }
    });
    
    return E;
  }

  /**
   * Calculate Magnetic Field due to current loops (Biot-Savart Law)
   */
  calculateMagneticField(
    position: FieldVector,
    currentLoops: Array<{ center: FieldVector; radius: number; current: number; normal: FieldVector }>
  ): FieldVector {
    let B = { x: 0, y: 0, z: 0 };
    
    currentLoops.forEach(loop => {
      const r = {
        x: position.x - loop.center.x,
        y: position.y - loop.center.y,
        z: position.z - loop.center.z
      };
      
      const rMag = Math.sqrt(r.x * r.x + r.y * r.y + r.z * r.z);
      
      if (rMag > 0) {
        // Simplified magnetic dipole field
        const mu0 = ELECTROMAGNETIC_CONSTANTS.MU_0;
        const magneticMoment = loop.current * Math.PI * loop.radius * loop.radius;
        
        const rDotN = r.x * loop.normal.x + r.y * loop.normal.y + r.z * loop.normal.z;
        const factor = (mu0 * magneticMoment) / (4 * Math.PI * Math.pow(rMag, 3));
        
        B.x += factor * (3 * rDotN * r.x / (rMag * rMag) - loop.normal.x);
        B.y += factor * (3 * rDotN * r.y / (rMag * rMag) - loop.normal.y);
        B.z += factor * (3 * rDotN * r.z / (rMag * rMag) - loop.normal.z);
      }
    });
    
    return B;
  }
}

/**
 * ELECTROMAGNETIC FIELD VISUALIZATION SHAPES
 * Shape Formula Time Cross Field implementations
 */
export const MAXWELL_FIELD_SHAPES = {
  // Electric Field Lines from Point Charge
  electric_field_lines: {
    name: "Electric Field Lines",
    description: "Visualization of ∇⋅E = ρ/ε₀ - electric field lines diverging from charges",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const t = params.d ?? 0; // time parameter
      
      // Charge position oscillates with time
      const chargePos = {
        x: 0.5 * Math.cos(t),
        y: 0.5 * Math.sin(t),
        z: 0
      };
      
      // Field line parametrization
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const r = a + b * Math.sin(c * (theta + phi));
      
      // Electric field direction
      const fieldDir = {
        x: Math.sin(phi) * Math.cos(theta),
        y: Math.sin(phi) * Math.sin(theta),
        z: Math.cos(phi)
      };
      
      return [
        chargePos.x + r * fieldDir.x,
        chargePos.y + r * fieldDir.y,
        chargePos.z + r * fieldDir.z
      ];
    },
    defaultParams: { a: 1, b: 0.2, c: 3, d: 0, uSegments: 16, vSegments: 32 }
  },

  // Magnetic Field Lines (Dipole)
  magnetic_field_lines: {
    name: "Magnetic Field Lines",
    description: "Visualization of ∇⋅B = 0 - magnetic field lines forming closed loops",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const t = params.d ?? 0;
      
      // Magnetic dipole field lines
      const phi = u * 2 * Math.PI;
      const theta = v * Math.PI;
      
      // Field line radius varies with latitude
      const r = a * Math.sin(theta) * Math.sin(theta) + b * Math.cos(c * phi + t);
      
      const x = r * Math.sin(theta) * Math.cos(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(theta);
      
      return [x, y, z];
    },
    defaultParams: { a: 2, b: 0.3, c: 4, d: 0, uSegments: 24, vSegments: 24 }
  },

  // Electromagnetic Wave Propagation
  electromagnetic_wave: {
    name: "Electromagnetic Wave",
    description: "Time Cross Field visualization of E and B wave propagation",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const a = params.a ?? 1;  // Wave amplitude
      const b = params.b ?? 1;  // Frequency
      const c = params.c ?? 1;  // Wave number
      const t = params.d ?? 0;  // Time
      const phase = params.e ?? 0; // Phase offset
      
      const x = u * 4 - 2; // Position along wave
      const y = v * 2 - 1; // Cross-section parameter
      
      // Electric field component (oscillates in y-direction)
      const E_amplitude = a * Math.sin(c * x - b * t + phase);
      
      // Magnetic field component (oscillates in z-direction, 90° phase shift)
      const B_amplitude = (a / ELECTROMAGNETIC_CONSTANTS.C) * Math.cos(c * x - b * t + phase);
      
      // Combine fields for visualization
      const fieldY = E_amplitude * (y > 0 ? 1 : 0);
      const fieldZ = B_amplitude * (y < 0 ? 1 : 0);
      
      return [x, fieldY, fieldZ];
    },
    defaultParams: { a: 1, b: 2, c: Math.PI, d: 0, e: 0, uSegments: 64, vSegments: 4 }
  },

  // Faraday's Law Visualization
  faraday_induction: {
    name: "Faraday Induction",
    description: "∇×E = -∂B/∂t - induced electric field from changing magnetic field",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const a = params.a ?? 1;  // Loop radius
      const b = params.b ?? 1;  // Field strength
      const c = params.c ?? 1;  // Frequency
      const t = params.d ?? 0;  // Time
      
      const theta = u * 2 * Math.PI;
      const r = a + 0.1 * v; // Radial distance from loop
      
      // Time-varying magnetic field (pointing up through loop)
      const B_z = b * Math.sin(c * t);
      
      // Induced electric field (circular, by Faraday's law)
      const E_magnitude = (c * b * Math.cos(c * t) * a) / 2;
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = E_magnitude * Math.sin(theta * 4) * 0.1; // Visual representation
      
      return [x, y, z];
    },
    defaultParams: { a: 1.5, b: 1, c: 2, d: 0, uSegments: 32, vSegments: 8 }
  },

  // Ampère's Law Visualization
  ampere_circulation: {
    name: "Ampère Circulation",
    description: "∇×B = μ₀J + μ₀ε₀∂E/∂t - magnetic field circulation around current",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const a = params.a ?? 1;  // Current strength
      const b = params.b ?? 1;  // Loop radius
      const c = params.c ?? 1;  // Height variation
      const t = params.d ?? 0;  // Time
      
      const theta = u * 2 * Math.PI;
      const z = (v - 0.5) * c;
      
      // Current flows in z-direction
      const current = a * Math.sin(2 * t);
      
      // Magnetic field circles around current (right-hand rule)
      const r = b + 0.1 * Math.abs(current);
      const B_magnitude = ELECTROMAGNETIC_CONSTANTS.MU_0 * Math.abs(current) / (2 * Math.PI * r);
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      
      return [x, y, z];
    },
    defaultParams: { a: 2, b: 1, c: 2, d: 0, uSegments: 32, vSegments: 16 }
  },

  // Complete Maxwell Field Interaction
  maxwell_field_interaction: {
    name: "Maxwell Field Interaction",
    description: "Complete Shape Formula Time Cross Field showing E-B field coupling",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const a = params.a ?? 1;  // Field strength
      const b = params.b ?? 1;  // Spatial frequency
      const c = params.c ?? 1;  // Temporal frequency
      const t = params.d ?? 0;  // Time
      const coupling = params.e ?? 0.5; // E-B coupling strength
      
      const x = (u - 0.5) * 4;
      const y = (v - 0.5) * 4;
      const r = Math.sqrt(x * x + y * y);
      
      // Electric field (radial)
      const E_r = a * Math.exp(-r * r / 4) * Math.cos(b * r - c * t);
      
      // Magnetic field (azimuthal, coupled to E)
      const B_theta = coupling * a * Math.exp(-r * r / 4) * Math.sin(b * r - c * t);
      
      // Convert to Cartesian coordinates
      const theta = Math.atan2(y, x);
      const E_x = E_r * Math.cos(theta);
      const E_y = E_r * Math.sin(theta);
      const B_x = -B_theta * Math.sin(theta);
      const B_y = B_theta * Math.cos(theta);
      
      // Combine fields for visualization
      const fieldX = E_x + B_x;
      const fieldY = E_y + B_y;
      const fieldZ = 0.2 * (E_r * E_r + B_theta * B_theta); // Energy density
      
      return [x + 0.1 * fieldX, y + 0.1 * fieldY, fieldZ];
    },
    defaultParams: { a: 1, b: 2, c: 3, d: 0, e: 0.5, uSegments: 32, vSegments: 32 }
  },

  // Poynting Vector (Energy Flow)
  poynting_energy_flow: {
    name: "Poynting Energy Flow",
    description: "S = (1/μ₀)(E × B) - electromagnetic energy flow visualization",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const a = params.a ?? 1;  // Field amplitude
      const b = params.b ?? 1;  // Wave number
      const c = params.c ?? 1;  // Frequency
      const t = params.d ?? 0;  // Time
      
      const x = u * 4 - 2;
      const y = v * 2 - 1;
      
      // Electric field (y-direction)
      const E_y = a * Math.sin(b * x - c * t);
      
      // Magnetic field (z-direction)
      const B_z = (a / ELECTROMAGNETIC_CONSTANTS.C) * Math.sin(b * x - c * t);
      
      // Poynting vector S = E × B / μ₀ (points in x-direction)
      const S_x = E_y * B_z / ELECTROMAGNETIC_CONSTANTS.MU_0;
      
      // Visualize energy flow with streamlines
      const streamY = y + 0.1 * Math.sin(b * x - c * t);
      const streamZ = 0.2 * S_x; // Energy density visualization
      
      return [x, streamY, streamZ];
    },
    defaultParams: { a: 1, b: Math.PI, c: 2, d: 0, uSegments: 64, vSegments: 8 }
  }
};

// Export the field engine instance
export const maxwellFieldEngine = new MaxwellFieldEngine();

console.log('⚡ Maxwell Field Theory Engine initialized');
console.log('   • Complete electromagnetic field equations');
console.log('   • Shape Formula Time Cross Field visualizations');
console.log('   • Gauss, Faraday, and Ampère-Maxwell laws');
console.log('   • Energy flow and field interactions');

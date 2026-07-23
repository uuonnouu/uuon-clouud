import { SurfaceParameters } from '../types/math';

/**
 * QUANTUM COMPUTING FORMULAS & PHENOMENA LIBRARY
 * 
 * Comprehensive visualization of quantum computing concepts including:
 * - Qubit Fundamentals & Bloch Sphere
 * - Multi-Qubit Systems & Entanglement
 * - Quantum Gates (Single & Multi-Qubit)
 * - Quantum Algorithms (QFT, Grover, Shor, VQE, QAOA)
 * - Quantum Error Correction
 * - Quantum Decoherence & Noise
 * - Quantum Communication & Teleportation
 * - Physical Implementations
 * 
 * Product of UUON Foundation Inc.
 * Author: Phillip A. Ruiz III
 */

export interface ParametricSurface {
  name: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}

function getCleanDefaults(overrides: Partial<SurfaceParameters> = {}): Partial<SurfaceParameters> {
  return {
    a: 1, b: 1, c: 1,
    d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
    uMin: 0, uMax: 1, vMin: 0, vMax: 1,
    uSegments: 96, vSegments: 96,
    ...overrides
  };
}

const pow2 = (x: number) => x * x;

export const QUANTUM_COMPUTING_ALGORITHMS: Record<string, ParametricSurface> = {

  // ============================================================================
  // 1. QUBIT FUNDAMENTALS
  // ============================================================================

  qubit_superposition_state: {
    name: "Qubit Superposition - |psi> = alpha|0> + beta|1>",
    equation: (u, v, params) => {
      const alpha = params.d ?? 0.7;
      const beta = Math.sqrt(1 - alpha * alpha);
      const phase = params.e ?? 0;
      
      const theta = u * Math.PI;
      const phi = v * Math.PI * 2;
      
      const prob0 = alpha * alpha;
      const prob1 = beta * beta;
      
      const x = Math.sin(theta) * Math.cos(phi);
      const y = Math.sin(theta) * Math.sin(phi);
      const z = Math.cos(theta);
      
      const superposition = prob0 * Math.cos(theta) + prob1 * Math.sin(theta) * Math.cos(phi + phase);
      
      return [x * 0.8, y * 0.8, z * 0.8 + superposition * 0.2];
    },
    defaultParams: getCleanDefaults({ d: 0.7, e: 0, uSegments: 64, vSegments: 64 })
  },

  bloch_sphere_full: {
    name: "Bloch Sphere - Complete Qubit State Space",
    equation: (u, v, params) => {
      const theta = params.d ?? Math.PI / 4;
      const phi = params.e ?? 0;
      const showState = params.f ?? 1;
      
      const sphereTheta = u * Math.PI;
      const spherePhi = v * Math.PI * 2;
      
      const x = Math.sin(sphereTheta) * Math.cos(spherePhi);
      const y = Math.sin(sphereTheta) * Math.sin(spherePhi);
      const z = Math.cos(sphereTheta);
      
      const stateX = Math.sin(theta) * Math.cos(phi);
      const stateY = Math.sin(theta) * Math.sin(phi);
      const stateZ = Math.cos(theta);
      
      const distToState = Math.sqrt(
        pow2(x - stateX) + pow2(y - stateY) + pow2(z - stateZ)
      );
      const highlight = showState * Math.exp(-distToState * 5) * 0.3;
      
      return [x * 0.9, y * 0.9, z * 0.9 + highlight];
    },
    defaultParams: getCleanDefaults({ d: Math.PI / 4, e: 0, f: 1, uSegments: 64, vSegments: 64 })
  },

  computational_basis_states: {
    name: "Computational Basis - |0> and |1> States",
    equation: (u, v, params) => {
      const separation = params.d ?? 1.5;
      
      const x = (u - 0.5) * 2;
      const y = (v - 0.5) * 2;
      
      const dist0 = Math.sqrt(x * x + pow2(y - separation / 2));
      const dist1 = Math.sqrt(x * x + pow2(y + separation / 2));
      
      const state0 = Math.exp(-dist0 * dist0 * 3);
      const state1 = Math.exp(-dist1 * dist1 * 3);
      
      return [x, y, (state0 - state1) * 0.5];
    },
    defaultParams: getCleanDefaults({ d: 1.5, uSegments: 64, vSegments: 64 })
  },

  // ============================================================================
  // 2. MULTI-QUBIT SYSTEMS
  // ============================================================================

  two_qubit_product_state: {
    name: "Two-Qubit Product State - |psi>x|phi>",
    equation: (u, v, params) => {
      const alpha1 = params.d ?? 0.7;
      const alpha2 = params.e ?? 0.6;
      
      const beta1 = Math.sqrt(1 - alpha1 * alpha1);
      const beta2 = Math.sqrt(1 - alpha2 * alpha2);
      
      const x = (u - 0.5) * 4;
      const y = (v - 0.5) * 4;
      
      const prob00 = alpha1 * alpha1 * alpha2 * alpha2;
      const prob01 = alpha1 * alpha1 * beta2 * beta2;
      const prob10 = beta1 * beta1 * alpha2 * alpha2;
      const prob11 = beta1 * beta1 * beta2 * beta2;
      
      const z = prob00 * Math.exp(-(pow2(x + 1.5) + pow2(y + 1.5))) +
                prob01 * Math.exp(-(pow2(x + 1.5) + pow2(y - 1.5))) +
                prob10 * Math.exp(-(pow2(x - 1.5) + pow2(y + 1.5))) +
                prob11 * Math.exp(-(pow2(x - 1.5) + pow2(y - 1.5)));
      
      return [x * 0.4, y * 0.4, z * 0.8];
    },
    defaultParams: getCleanDefaults({ d: 0.7, e: 0.6, uSegments: 80, vSegments: 80 })
  },

  hilbert_space_dimension: {
    name: "Hilbert Space - 2^n Dimensional",
    equation: (u, v, params) => {
      const nQubits = Math.floor(params.d ?? 3);
      const dim = Math.pow(2, nQubits);
      
      const x = (u - 0.5) * 3;
      const y = (v - 0.5) * 3;
      
      let z = 0;
      for (let i = 0; i < dim; i++) {
        const angle = (i / dim) * Math.PI * 2;
        const radius = 0.8 + 0.2 * (i / dim);
        const px = radius * Math.cos(angle);
        const py = radius * Math.sin(angle);
        z += Math.exp(-(pow2(x - px) + pow2(y - py)) * 3) / dim;
      }
      
      return [x, y, z * 2];
    },
    defaultParams: getCleanDefaults({ d: 3, uSegments: 80, vSegments: 80 })
  },

  // ============================================================================
  // 3. QUANTUM ENTANGLEMENT
  // ============================================================================

  bell_state_phi_plus: {
    name: "Bell State |Phi+> - (|00> + |11>)/sqrt2",
    equation: (u, v, params) => {
      const entanglement = params.d ?? 1;
      
      const x = (u - 0.5) * 4;
      const y = (v - 0.5) * 4;
      
      const state00 = Math.exp(-(pow2(x + 1) + pow2(y + 1)) * 2);
      const state11 = Math.exp(-(pow2(x - 1) + pow2(y - 1)) * 2);
      
      const correlation = entanglement * Math.cos(x * y * 2) * 0.2;
      const z = (state00 + state11) / Math.sqrt(2) + correlation;
      
      return [x * 0.4, y * 0.4, z * 0.6];
    },
    defaultParams: getCleanDefaults({ d: 1, uSegments: 80, vSegments: 80 })
  },

  bell_state_psi_minus: {
    name: "Bell State |Psi-> - (|01> - |10>)/sqrt2",
    equation: (u, v, params) => {
      const x = (u - 0.5) * 4;
      const y = (v - 0.5) * 4;
      
      const state01 = Math.exp(-(pow2(x + 1) + pow2(y - 1)) * 2);
      const state10 = Math.exp(-(pow2(x - 1) + pow2(y + 1)) * 2);
      
      const z = (state01 - state10) / Math.sqrt(2);
      
      return [x * 0.4, y * 0.4, z * 0.6];
    },
    defaultParams: getCleanDefaults({ uSegments: 80, vSegments: 80 })
  },

  concurrence_measure: {
    name: "Concurrence - Entanglement Measure",
    equation: (u, v, params) => {
      const x = (u - 0.5) * 2;
      const y = (v - 0.5) * 2;
      
      const r = Math.sqrt(x * x + y * y);
      const concurrence = Math.max(0, 1 - r);
      
      const z = concurrence * (1 + 0.3 * Math.sin(r * 10));
      
      return [x, y, z * 0.8];
    },
    defaultParams: getCleanDefaults({ uSegments: 64, vSegments: 64 })
  },

  von_neumann_entropy: {
    name: "Von Neumann Entropy - S(rho) = -Tr(rho log rho)",
    equation: (u, v, params) => {
      const x = (u - 0.5) * 2;
      const y = (v - 0.5) * 2;
      
      const p = (1 + x) / 2;
      const q = 1 - p;
      
      const entropy = p > 0.01 && q > 0.01 ? 
        -(p * Math.log2(p) + q * Math.log2(q)) : 0;
      
      const modulation = 1 + 0.2 * Math.sin(y * 5);
      
      return [x, y, entropy * modulation * 0.5];
    },
    defaultParams: getCleanDefaults({ uSegments: 64, vSegments: 64 })
  },

  schmidt_decomposition: {
    name: "Schmidt Decomposition - sqrt(lambda)|i>x|i>",
    equation: (u, v, params) => {
      const rank = Math.floor(params.d ?? 3);
      
      const x = (u - 0.5) * 3;
      const y = (v - 0.5) * 3;
      
      let z = 0;
      for (let i = 0; i < rank; i++) {
        const lambda = 1 / (i + 1);
        const angle = (i / rank) * Math.PI;
        z += Math.sqrt(lambda) * Math.exp(-(pow2(x - Math.cos(angle)) + pow2(y - Math.sin(angle))) * 2);
      }
      
      return [x, y, z * 0.5];
    },
    defaultParams: getCleanDefaults({ d: 3, uSegments: 64, vSegments: 64 })
  },

  // ============================================================================
  // 4. QUANTUM GATES (Single-Qubit)
  // ============================================================================

  pauli_x_gate: {
    name: "Pauli-X Gate - Bit Flip",
    equation: (u, v, params) => {
      const theta = u * Math.PI;
      const phi = v * Math.PI * 2;
      
      const x = Math.sin(theta) * Math.cos(phi);
      const y = Math.sin(theta) * Math.sin(phi);
      const z = Math.cos(theta);
      
      const xNew = x;
      const yNew = -y;
      const zNew = -z;
      
      const blend = 0.5 + 0.5 * Math.sin(u * Math.PI);
      
      return [
        x * (1 - blend) + xNew * blend,
        y * (1 - blend) + yNew * blend,
        z * (1 - blend) + zNew * blend
      ];
    },
    defaultParams: getCleanDefaults({ uSegments: 48, vSegments: 48 })
  },

  pauli_y_gate: {
    name: "Pauli-Y Gate - Bit + Phase Flip",
    equation: (u, v, params) => {
      const theta = u * Math.PI;
      const phi = v * Math.PI * 2;
      
      const x = Math.sin(theta) * Math.cos(phi);
      const y = Math.sin(theta) * Math.sin(phi);
      const z = Math.cos(theta);
      
      const xNew = -x;
      const yNew = y;
      const zNew = -z;
      
      return [xNew * 0.8, yNew * 0.8, zNew * 0.8];
    },
    defaultParams: getCleanDefaults({ uSegments: 48, vSegments: 48 })
  },

  pauli_z_gate: {
    name: "Pauli-Z Gate - Phase Flip",
    equation: (u, v, params) => {
      const theta = u * Math.PI;
      const phi = v * Math.PI * 2;
      
      const x = Math.sin(theta) * Math.cos(phi + Math.PI);
      const y = Math.sin(theta) * Math.sin(phi + Math.PI);
      const z = Math.cos(theta);
      
      return [x * 0.8, y * 0.8, z * 0.8];
    },
    defaultParams: getCleanDefaults({ uSegments: 48, vSegments: 48 })
  },

  hadamard_gate: {
    name: "Hadamard Gate - Superposition Creator",
    equation: (u, v, params) => {
      const theta = u * Math.PI;
      const phi = v * Math.PI * 2;
      
      const x = Math.sin(theta) * Math.cos(phi);
      const y = Math.sin(theta) * Math.sin(phi);
      const z = Math.cos(theta);
      
      const xNew = (x + z) / Math.sqrt(2);
      const yNew = y;
      const zNew = (x - z) / Math.sqrt(2);
      
      return [xNew * 0.8, yNew * 0.8, zNew * 0.8];
    },
    defaultParams: getCleanDefaults({ uSegments: 48, vSegments: 48 })
  },

  phase_gate_s: {
    name: "S Gate - pi/2 Phase",
    equation: (u, v, params) => {
      const theta = u * Math.PI;
      const phi = v * Math.PI * 2 + Math.PI / 2;
      
      const x = Math.sin(theta) * Math.cos(phi);
      const y = Math.sin(theta) * Math.sin(phi);
      const z = Math.cos(theta);
      
      return [x * 0.8, y * 0.8, z * 0.8];
    },
    defaultParams: getCleanDefaults({ uSegments: 48, vSegments: 48 })
  },

  phase_gate_t: {
    name: "T Gate - pi/4 Phase",
    equation: (u, v, params) => {
      const theta = u * Math.PI;
      const phi = v * Math.PI * 2 + Math.PI / 4;
      
      const x = Math.sin(theta) * Math.cos(phi);
      const y = Math.sin(theta) * Math.sin(phi);
      const z = Math.cos(theta);
      
      return [x * 0.8, y * 0.8, z * 0.8];
    },
    defaultParams: getCleanDefaults({ uSegments: 48, vSegments: 48 })
  },

  rotation_gate_rx: {
    name: "Rx(theta) - X-Axis Rotation",
    equation: (u, v, params) => {
      const rotAngle = params.d ?? Math.PI / 4;
      const sphereTheta = u * Math.PI;
      const spherePhi = v * Math.PI * 2;
      
      const x = Math.sin(sphereTheta) * Math.cos(spherePhi);
      const y = Math.sin(sphereTheta) * Math.sin(spherePhi);
      const z = Math.cos(sphereTheta);
      
      const yNew = y * Math.cos(rotAngle) - z * Math.sin(rotAngle);
      const zNew = y * Math.sin(rotAngle) + z * Math.cos(rotAngle);
      
      return [x * 0.8, yNew * 0.8, zNew * 0.8];
    },
    defaultParams: getCleanDefaults({ d: Math.PI / 4, uSegments: 48, vSegments: 48 })
  },

  rotation_gate_ry: {
    name: "Ry(theta) - Y-Axis Rotation",
    equation: (u, v, params) => {
      const rotAngle = params.d ?? Math.PI / 4;
      const sphereTheta = u * Math.PI;
      const spherePhi = v * Math.PI * 2;
      
      const x = Math.sin(sphereTheta) * Math.cos(spherePhi);
      const y = Math.sin(sphereTheta) * Math.sin(spherePhi);
      const z = Math.cos(sphereTheta);
      
      const xNew = x * Math.cos(rotAngle) + z * Math.sin(rotAngle);
      const zNew = -x * Math.sin(rotAngle) + z * Math.cos(rotAngle);
      
      return [xNew * 0.8, y * 0.8, zNew * 0.8];
    },
    defaultParams: getCleanDefaults({ d: Math.PI / 4, uSegments: 48, vSegments: 48 })
  },

  rotation_gate_rz: {
    name: "Rz(phi) - Z-Axis Rotation",
    equation: (u, v, params) => {
      const rotAngle = params.d ?? Math.PI / 4;
      const sphereTheta = u * Math.PI;
      const spherePhi = v * Math.PI * 2 + rotAngle;
      
      const x = Math.sin(sphereTheta) * Math.cos(spherePhi);
      const y = Math.sin(sphereTheta) * Math.sin(spherePhi);
      const z = Math.cos(sphereTheta);
      
      return [x * 0.8, y * 0.8, z * 0.8];
    },
    defaultParams: getCleanDefaults({ d: Math.PI / 4, uSegments: 48, vSegments: 48 })
  },

  // ============================================================================
  // 5. QUANTUM GATES (Multi-Qubit)
  // ============================================================================

  cnot_gate_surface: {
    name: "CNOT Gate - Controlled-NOT",
    equation: (u, v, params) => {
      const x = (u - 0.5) * 4;
      const y = (v - 0.5) * 4;
      
      const control = x > 0 ? 1 : 0;
      const targetFlip = control === 1 ? -1 : 1;
      
      const z = Math.exp(-(x * x + y * y) / 4) * targetFlip * 0.5;
      
      return [x * 0.4, y * 0.4, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 64, vSegments: 64 })
  },

  controlled_z_gate: {
    name: "CZ Gate - Controlled-Z",
    equation: (u, v, params) => {
      const x = (u - 0.5) * 4;
      const y = (v - 0.5) * 4;
      
      const isCorner = (x > 0.5 && y > 0.5) ? -1 : 1;
      const z = Math.exp(-(x * x + y * y) / 3) * isCorner * 0.4;
      
      return [x * 0.4, y * 0.4, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 64, vSegments: 64 })
  },

  swap_gate_surface: {
    name: "SWAP Gate - State Exchange",
    equation: (u, v, params) => {
      const x = (u - 0.5) * 3;
      const y = (v - 0.5) * 3;
      
      const swapped = Math.sin(x * 2) * Math.cos(y * 2);
      const z = swapped * 0.3 + Math.exp(-(x * x + y * y) / 2) * 0.2;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 64, vSegments: 64 })
  },

  toffoli_gate_surface: {
    name: "Toffoli Gate - CCNOT (3-Qubit)",
    equation: (u, v, params) => {
      const x = (u - 0.5) * 4;
      const y = (v - 0.5) * 4;
      
      const control1 = x > 0 ? 1 : 0;
      const control2 = y > 0 ? 1 : 0;
      const flip = (control1 === 1 && control2 === 1) ? -1 : 1;
      
      const z = Math.exp(-(x * x + y * y) / 4) * flip * 0.4;
      
      return [x * 0.4, y * 0.4, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 64, vSegments: 64 })
  },

  // ============================================================================
  // 6. QUANTUM MEASUREMENT
  // ============================================================================

  projective_measurement: {
    name: "Projective Measurement - P = |m><m|",
    equation: (u, v, params) => {
      const measurementAxis = params.d ?? 0;
      
      const x = (u - 0.5) * 3;
      const y = (v - 0.5) * 3;
      
      const angle = measurementAxis * Math.PI / 2;
      const projX = x * Math.cos(angle) - y * Math.sin(angle);
      const projY = x * Math.sin(angle) + y * Math.cos(angle);
      
      const collapsed = Math.exp(-projX * projX * 5) * Math.exp(-projY * projY * 0.5);
      
      return [x, y, collapsed * 0.5];
    },
    defaultParams: getCleanDefaults({ d: 0, uSegments: 64, vSegments: 64 })
  },

  measurement_probability: {
    name: "Measurement Probability - |<m|psi>|^2",
    equation: (u, v, params) => {
      const alpha = params.d ?? 0.7;
      const beta = Math.sqrt(1 - alpha * alpha);
      
      const x = (u - 0.5) * 3;
      const y = (v - 0.5) * 3;
      
      const prob0 = alpha * alpha * Math.exp(-(pow2(x + 0.8) + y * y) * 2);
      const prob1 = beta * beta * Math.exp(-(pow2(x - 0.8) + y * y) * 2);
      
      return [x, y, (prob0 + prob1) * 0.6];
    },
    defaultParams: getCleanDefaults({ d: 0.7, uSegments: 64, vSegments: 64 })
  },

  povm_measurement: {
    name: "POVM - Positive Operator-Valued Measure",
    equation: (u, v, params) => {
      const numElements = Math.floor(params.d ?? 4);
      
      const x = (u - 0.5) * 3;
      const y = (v - 0.5) * 3;
      
      let z = 0;
      for (let i = 0; i < numElements; i++) {
        const angle = (i / numElements) * Math.PI * 2;
        const ex = Math.cos(angle) * 0.8;
        const ey = Math.sin(angle) * 0.8;
        z += Math.exp(-(pow2(x - ex) + pow2(y - ey)) * 3) / numElements;
      }
      
      return [x, y, z * 0.8];
    },
    defaultParams: getCleanDefaults({ d: 4, uSegments: 64, vSegments: 64 })
  },

  // ============================================================================
  // 7. QUANTUM DECOHERENCE
  // ============================================================================

  density_matrix_pure: {
    name: "Density Matrix - Pure State rho = |psi><psi|",
    equation: (u, v, params) => {
      const x = (u - 0.5) * 2;
      const y = (v - 0.5) * 2;
      
      const diag1 = Math.exp(-(pow2(x + 0.5) + pow2(y + 0.5)) * 4);
      const diag2 = Math.exp(-(pow2(x - 0.5) + pow2(y - 0.5)) * 4);
      const offDiag = Math.exp(-(pow2(x + 0.5) + pow2(y - 0.5)) * 4) +
                      Math.exp(-(pow2(x - 0.5) + pow2(y + 0.5)) * 4);
      
      return [x, y, (diag1 + diag2 + offDiag * 0.5) * 0.4];
    },
    defaultParams: getCleanDefaults({ uSegments: 64, vSegments: 64 })
  },

  t1_relaxation: {
    name: "T1 Relaxation - Energy Decay",
    equation: (u, v, params) => {
      const T1 = params.d ?? 50;
      
      const t = u * 100;
      const x = t * 0.02 - 1;
      const y = (v - 0.5) * 2;
      
      const population = Math.exp(-t / T1);
      const z = population * Math.exp(-y * y * 2);
      
      return [x, y, z * 0.5];
    },
    defaultParams: getCleanDefaults({ d: 50, uSegments: 80, vSegments: 40 })
  },

  t2_dephasing: {
    name: "T2 Dephasing - Coherence Decay",
    equation: (u, v, params) => {
      const T2 = params.d ?? 30;
      
      const t = u * 100;
      const x = t * 0.02 - 1;
      const y = (v - 0.5) * 2;
      
      const coherence = Math.exp(-t / T2) * Math.cos(t * 0.2);
      const z = coherence * Math.exp(-y * y);
      
      return [x, y, z * 0.5];
    },
    defaultParams: getCleanDefaults({ d: 30, uSegments: 80, vSegments: 40 })
  },

  bloch_vector_decay: {
    name: "Bloch Vector Decay - Decoherence Trajectory",
    equation: (u, v, params) => {
      const T1 = params.d ?? 50;
      const T2 = params.e ?? 30;
      
      const t = u * 100;
      const phi = v * Math.PI * 2;
      
      const x0 = 0.7, y0 = 0.5, z0 = 0.5;
      
      const x = x0 * Math.exp(-t / T2) * Math.cos(phi);
      const y = y0 * Math.exp(-t / T2) * Math.sin(phi);
      const z = z0 * Math.exp(-t / T1) + (1 - Math.exp(-t / T1)) * (-1);
      
      return [x * 0.8, y * 0.8, z * 0.4];
    },
    defaultParams: getCleanDefaults({ d: 50, e: 30, uSegments: 64, vSegments: 32 })
  },

  // ============================================================================
  // 8. QUANTUM NOISE & ERRORS
  // ============================================================================

  bit_flip_channel: {
    name: "Bit Flip Channel - X Error",
    equation: (u, v, params) => {
      const p = params.d ?? 0.1;
      
      const x = (u - 0.5) * 3;
      const y = (v - 0.5) * 3;
      
      const original = Math.exp(-(x * x + y * y) * 2);
      const flipped = Math.exp(-(x * x + pow2(y - 1.5)) * 2);
      
      const z = (1 - p) * original + p * flipped;
      
      return [x, y, z * 0.5];
    },
    defaultParams: getCleanDefaults({ d: 0.1, uSegments: 64, vSegments: 64 })
  },

  phase_flip_channel: {
    name: "Phase Flip Channel - Z Error",
    equation: (u, v, params) => {
      const p = params.d ?? 0.1;
      
      const x = (u - 0.5) * 3;
      const y = (v - 0.5) * 3;
      
      const original = Math.sin(x * 3) * Math.cos(y * 3);
      const flipped = -original;
      
      const z = ((1 - p) * original + p * flipped) * 0.3 + 
                Math.exp(-(x * x + y * y) / 2) * 0.2;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 0.1, uSegments: 64, vSegments: 64 })
  },

  depolarizing_channel: {
    name: "Depolarizing Channel - Uniform Noise",
    equation: (u, v, params) => {
      const p = params.d ?? 0.1;
      
      const x = (u - 0.5) * 3;
      const y = (v - 0.5) * 3;
      
      const pure = Math.exp(-(x * x + y * y));
      const mixed = 0.25;
      
      const z = (1 - p) * pure + p * mixed;
      
      return [x, y, z * 0.5];
    },
    defaultParams: getCleanDefaults({ d: 0.1, uSegments: 64, vSegments: 64 })
  },

  amplitude_damping: {
    name: "Amplitude Damping - Energy Loss",
    equation: (u, v, params) => {
      const gamma = params.d ?? 0.3;
      
      const x = (u - 0.5) * 3;
      const y = (v - 0.5) * 3;
      
      const excited = Math.exp(-(x * x + pow2(y - 0.8)) * 3);
      const ground = Math.exp(-(x * x + pow2(y + 0.8)) * 3);
      
      const z = (1 - gamma) * excited + gamma * ground + 
                Math.sqrt(gamma * (1 - gamma)) * Math.sin(x * y * 5) * 0.1;
      
      return [x, y, z * 0.5];
    },
    defaultParams: getCleanDefaults({ d: 0.3, uSegments: 64, vSegments: 64 })
  },

  // ============================================================================
  // 9. QUANTUM ERROR CORRECTION
  // ============================================================================

  three_qubit_code: {
    name: "3-Qubit Code - |0>_L = |000>",
    equation: (u, v, params) => {
      const x = (u - 0.5) * 4;
      const y = (v - 0.5) * 4;
      
      const logical0 = Math.exp(-(pow2(x + 1) + pow2(y + 1)) * 2) +
                       Math.exp(-(x * x + pow2(y + 1)) * 2) +
                       Math.exp(-(pow2(x - 1) + pow2(y + 1)) * 2);
      
      const logical1 = Math.exp(-(pow2(x + 1) + pow2(y - 1)) * 2) +
                       Math.exp(-(x * x + pow2(y - 1)) * 2) +
                       Math.exp(-(pow2(x - 1) + pow2(y - 1)) * 2);
      
      return [x * 0.4, y * 0.4, (logical0 + logical1) * 0.3];
    },
    defaultParams: getCleanDefaults({ uSegments: 80, vSegments: 80 })
  },

  shor_nine_qubit: {
    name: "Shor 9-Qubit Code - Full Protection",
    equation: (u, v, params) => {
      const x = (u - 0.5) * 6;
      const y = (v - 0.5) * 6;
      
      let z = 0;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const px = -2 + i * 2;
          const py = -2 + j * 2;
          z += Math.exp(-(pow2(x - px) + pow2(y - py)) * 1.5);
        }
      }
      
      return [x * 0.25, y * 0.25, z * 0.15];
    },
    defaultParams: getCleanDefaults({ uSegments: 80, vSegments: 80 })
  },

  stabilizer_code: {
    name: "Stabilizer Code - Syndrome Measurement",
    equation: (u, v, params) => {
      const numStabilizers = Math.floor(params.d ?? 4);
      
      const x = (u - 0.5) * 4;
      const y = (v - 0.5) * 4;
      
      let z = 0;
      for (let s = 0; s < numStabilizers; s++) {
        const angle = (s / numStabilizers) * Math.PI * 2;
        const sx = Math.cos(angle) * 1.2;
        const sy = Math.sin(angle) * 1.2;
        z += Math.cos(x * sx + y * sy) * 0.3 / numStabilizers;
      }
      
      z += Math.exp(-(x * x + y * y) / 3) * 0.3;
      
      return [x * 0.4, y * 0.4, z];
    },
    defaultParams: getCleanDefaults({ d: 4, uSegments: 64, vSegments: 64 })
  },

  surface_code_lattice: {
    name: "Surface Code - Topological Protection",
    equation: (u, v, params) => {
      const distance = Math.floor(params.d ?? 3);
      
      const x = (u - 0.5) * 4;
      const y = (v - 0.5) * 4;
      
      let z = 0;
      for (let i = 0; i < distance; i++) {
        for (let j = 0; j < distance; j++) {
          const px = -1.5 + i * (3 / distance);
          const py = -1.5 + j * (3 / distance);
          const isData = (i + j) % 2 === 0;
          z += Math.exp(-(pow2(x - px) + pow2(y - py)) * 3) * (isData ? 1 : 0.5);
        }
      }
      
      return [x * 0.4, y * 0.4, z * 0.4];
    },
    defaultParams: getCleanDefaults({ d: 3, uSegments: 80, vSegments: 80 })
  },

  // ============================================================================
  // 10. QUANTUM ALGORITHMS
  // ============================================================================

  qft_surface: {
    name: "Quantum Fourier Transform - QFT",
    equation: (u, v, params) => {
      const nQubits = Math.floor(params.d ?? 4);
      const N = Math.pow(2, nQubits);
      
      const j = Math.floor(u * N);
      const k = Math.floor(v * N);
      
      const phase = 2 * Math.PI * j * k / N;
      const amplitude = Math.cos(phase) / Math.sqrt(N);
      
      const x = (j / N - 0.5) * 2;
      const y = (k / N - 0.5) * 2;
      
      return [x, y, amplitude * 0.8];
    },
    defaultParams: getCleanDefaults({ d: 4, uSegments: 64, vSegments: 64 })
  },

  grover_oracle: {
    name: "Grover Oracle - Target Marking",
    equation: (u, v, params) => {
      const targetX = params.d ?? 0.3;
      const targetY = params.e ?? 0.3;
      
      const x = (u - 0.5) * 3;
      const y = (v - 0.5) * 3;
      
      const uniform = 0.25;
      const target = Math.exp(-(pow2(x - targetX) + pow2(y - targetY)) * 5);
      
      const oracleEffect = uniform - 2 * target;
      
      return [x, y, oracleEffect * 0.5 + 0.3];
    },
    defaultParams: getCleanDefaults({ d: 0.3, e: 0.3, uSegments: 64, vSegments: 64 })
  },

  grover_diffusion: {
    name: "Grover Diffusion - Amplitude Amplification",
    equation: (u, v, params) => {
      const iterations = Math.floor(params.d ?? 3);
      
      const x = (u - 0.5) * 3;
      const y = (v - 0.5) * 3;
      const r = Math.sqrt(x * x + y * y);
      
      const theta = Math.asin(1 / Math.sqrt(16));
      const amplifiedAngle = (2 * iterations + 1) * theta;
      const amplitude = Math.sin(amplifiedAngle);
      
      const z = amplitude * Math.exp(-r * r) + 
                (1 - amplitude * amplitude) * 0.1;
      
      return [x, y, z * 0.5];
    },
    defaultParams: getCleanDefaults({ d: 3, uSegments: 64, vSegments: 64 })
  },

  phase_estimation: {
    name: "Quantum Phase Estimation - QPE",
    equation: (u, v, params) => {
      const targetPhase = params.d ?? 0.25;
      
      const x = (u - 0.5) * 2;
      const y = (v - 0.5) * 2;
      
      const peak = Math.exp(-(pow2(x - targetPhase * 2) + y * y) * 5);
      
      return [x, y, peak * 0.6];
    },
    defaultParams: getCleanDefaults({ d: 0.25, e: 4, uSegments: 64, vSegments: 64 })
  },

  shor_period_finding: {
    name: "Shor Algorithm - Period Finding",
    equation: (u, v, params) => {
      const period = Math.floor(params.d ?? 6);
      
      const x = (u - 0.5) * 4;
      const y = (v - 0.5) * 4;
      
      let z = 0;
      for (let k = 0; k < 8; k++) {
        const peakPos = k / period * 2 - 1;
        z += Math.exp(-pow2(x - peakPos) * 3) * Math.exp(-y * y);
      }
      
      return [x * 0.4, y * 0.4, z * 0.3];
    },
    defaultParams: getCleanDefaults({ d: 6, uSegments: 80, vSegments: 40 })
  },

  vqe_energy_surface: {
    name: "VQE - Variational Energy Landscape",
    equation: (u, v, params) => {
      const theta1 = (u - 0.5) * 2 * Math.PI;
      const theta2 = (v - 0.5) * 2 * Math.PI;
      
      const energy = -1 + 
        0.3 * Math.cos(theta1) + 
        0.3 * Math.cos(theta2) +
        0.2 * Math.cos(theta1 + theta2) +
        0.1 * Math.cos(2 * theta1 - theta2);
      
      return [theta1 / Math.PI, theta2 / Math.PI, energy * 0.4];
    },
    defaultParams: getCleanDefaults({ d: 2, uSegments: 64, vSegments: 64 })
  },

  // ============================================================================
  // 11. QAOA
  // ============================================================================

  qaoa_cost_landscape: {
    name: "QAOA - Cost Function Landscape",
    equation: (u, v, params) => {
      const layers = Math.floor(params.d ?? 2);
      
      const gamma = (u - 0.5) * 2 * Math.PI;
      const beta = (v - 0.5) * Math.PI;
      
      let cost = 0;
      for (let p = 0; p < layers; p++) {
        cost += Math.sin(gamma * (p + 1)) * Math.cos(beta * (p + 1));
      }
      cost = cost / layers + 0.5;
      
      return [gamma / Math.PI, beta / (Math.PI / 2), cost * 0.5];
    },
    defaultParams: getCleanDefaults({ d: 2, uSegments: 64, vSegments: 64 })
  },

  qaoa_mixer_hamiltonian: {
    name: "QAOA Mixer - Sum Xi",
    equation: (u, v, params) => {
      const numQubits = Math.floor(params.d ?? 4);
      
      const x = (u - 0.5) * 3;
      const y = (v - 0.5) * 3;
      
      let mixer = 0;
      for (let i = 0; i < numQubits; i++) {
        const phase = (i / numQubits) * Math.PI * 2;
        mixer += Math.cos(x * Math.cos(phase) + y * Math.sin(phase));
      }
      
      return [x, y, mixer / numQubits * 0.4];
    },
    defaultParams: getCleanDefaults({ d: 4, uSegments: 64, vSegments: 64 })
  },

  // ============================================================================
  // 12. QUANTUM TELEPORTATION
  // ============================================================================

  teleportation_protocol: {
    name: "Quantum Teleportation - Protocol",
    equation: (u, v, params) => {
      const stage = params.d ?? 0.5;
      
      const x = (u - 0.5) * 4;
      const y = (v - 0.5) * 4;
      
      const aliceState = Math.exp(-(pow2(x + 1.5) + y * y) * 2) * (1 - stage);
      const entangled = Math.exp(-(x * x + y * y) * 1.5) * Math.sin(stage * Math.PI);
      const bobState = Math.exp(-(pow2(x - 1.5) + y * y) * 2) * stage;
      
      return [x * 0.4, y * 0.4, (aliceState + entangled * 0.5 + bobState) * 0.5];
    },
    defaultParams: getCleanDefaults({ d: 0.5, uSegments: 80, vSegments: 80 })
  },

  // ============================================================================
  // 13-15. ADIABATIC/ANNEALING/QML
  // ============================================================================

  adiabatic_evolution: {
    name: "Adiabatic Evolution - H(t) Path",
    equation: (u, v, params) => {
      const gapSize = params.d ?? 0.3;
      
      const s = u;
      const state = v * 2 - 1;
      
      const E0 = -Math.sqrt(1 + pow2(s - 0.5)) - gapSize * Math.cos(s * Math.PI);
      const E1 = Math.sqrt(1 + pow2(s - 0.5)) + gapSize * Math.cos(s * Math.PI);
      
      const energy = state < 0 ? E0 : E1;
      
      return [(s - 0.5) * 2, state, energy * 0.3];
    },
    defaultParams: getCleanDefaults({ d: 0.3, uSegments: 80, vSegments: 40 })
  },

  ising_model_energy: {
    name: "Ising Model - Spin Configuration",
    equation: (u, v, params) => {
      const J = params.d ?? 1;
      const h = params.e ?? 0.5;
      
      const x = (u - 0.5) * 4;
      const y = (v - 0.5) * 4;
      
      const s1 = Math.sign(Math.sin(x * 2));
      const s2 = Math.sign(Math.sin(y * 2));
      
      const energy = -J * s1 * s2 - h * (s1 + s2);
      const visual = energy * 0.2 + Math.exp(-(x * x + y * y) / 4) * 0.3;
      
      return [x * 0.4, y * 0.4, visual];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 0.5, uSegments: 64, vSegments: 64 })
  },

  quantum_kernel: {
    name: "Quantum Kernel - K(x,x') = |<phi(x)|phi(x')>|^2",
    equation: (u, v, params) => {
      const featureMapDepth = Math.floor(params.d ?? 2);
      
      const x1 = (u - 0.5) * 4;
      const x2 = (v - 0.5) * 4;
      
      let kernel = 0;
      for (let l = 0; l < featureMapDepth; l++) {
        kernel += Math.cos((x1 - x2) * (l + 1)) / (l + 1);
      }
      kernel = (1 + kernel / featureMapDepth) / 2;
      
      return [x1 * 0.4, x2 * 0.4, kernel * kernel * 0.5];
    },
    defaultParams: getCleanDefaults({ d: 2, uSegments: 64, vSegments: 64 })
  },

  qnn_circuit: {
    name: "Quantum Neural Network - Parameterized Circuit",
    equation: (u, v, params) => {
      const layers = Math.floor(params.d ?? 3);
      
      const theta = (u - 0.5) * 2 * Math.PI;
      const phi = (v - 0.5) * 2 * Math.PI;
      
      let output = 0;
      for (let l = 0; l < layers; l++) {
        output += Math.sin(theta * (l + 1)) * Math.cos(phi * (l + 1)) / (l + 1);
      }
      
      return [theta / Math.PI, phi / Math.PI, output * 0.4];
    },
    defaultParams: getCleanDefaults({ d: 3, uSegments: 64, vSegments: 64 })
  },

  parameter_shift_gradient: {
    name: "Parameter Shift - Gradient Computation",
    equation: (u, v, params) => {
      const theta = (u - 0.5) * 2 * Math.PI;
      const y = (v - 0.5) * 2;
      
      const fPlus = Math.sin(theta + Math.PI / 4);
      const fMinus = Math.sin(theta - Math.PI / 4);
      const gradient = (fPlus - fMinus) / 2;
      
      return [theta / Math.PI, y, gradient * Math.exp(-y * y) * 0.5];
    },
    defaultParams: getCleanDefaults({ uSegments: 80, vSegments: 40 })
  },

  // ============================================================================
  // 16-17. TOPOLOGICAL & SENSING
  // ============================================================================

  fibonacci_anyon: {
    name: "Fibonacci Anyon - tau x tau = 1 + tau",
    equation: (u, v, params) => {
      const phi = (1 + Math.sqrt(5)) / 2;
      
      const theta = u * Math.PI * 4;
      const r = 0.3 + v * 0.7;
      
      const x = r * Math.cos(theta) * Math.cos(theta / phi);
      const y = r * Math.sin(theta);
      const z = r * Math.cos(theta) * Math.sin(theta / phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 128, vSegments: 32 })
  },

  anyon_braiding: {
    name: "Anyon Braiding - Topological Gates",
    equation: (u, v, params) => {
      const braidAngle = params.d ?? Math.PI;
      
      const t = u * Math.PI * 2;
      const strand = Math.floor(v * 2);
      
      const offset = strand === 0 ? 0.5 : -0.5;
      const x = offset * Math.cos(t * 2) + Math.sin(t) * 0.3;
      const y = offset * Math.sin(t * 2) * Math.cos(braidAngle);
      const z = t / (Math.PI * 2) - 0.5;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: Math.PI, uSegments: 100, vSegments: 8 })
  },

  heisenberg_limit: {
    name: "Heisenberg Limit - Delta phi >= 1/N",
    equation: (u, v, params) => {
      const x = (u - 0.5) * 3;
      const N = 1 + v * 99;
      
      const shotNoise = 1 / Math.sqrt(N);
      const heisenberg = 1 / N;
      
      const y = v * 2 - 1;
      const z = x < 0 ? shotNoise : heisenberg;
      
      return [x, y, Math.log10(z + 0.001) * 0.2 + 0.5];
    },
    defaultParams: getCleanDefaults({ uSegments: 64, vSegments: 64 })
  },

  ramsey_interferometry: {
    name: "Ramsey Interferometry - Phase Sensing",
    equation: (u, v, params) => {
      const omega = params.d ?? 5;
      
      const tau = u * 2;
      const phase = v * Math.PI * 2;
      
      const x = tau - 1;
      const y = (phase / Math.PI) - 1;
      
      const cosVal = Math.cos(omega * tau + phase);
      const signal = cosVal * cosVal;
      
      return [x, y, signal * 0.5];
    },
    defaultParams: getCleanDefaults({ d: 5, uSegments: 80, vSegments: 80 })
  },

  // ============================================================================
  // 18-19. COMMUNICATION & IMPLEMENTATIONS
  // ============================================================================

  bb84_protocol: {
    name: "BB84 Protocol - QKD Basis States",
    equation: (u, v, params) => {
      const x = (u - 0.5) * 4;
      const y = (v - 0.5) * 4;
      
      const basis1_0 = Math.exp(-(pow2(x + 1) + pow2(y + 1)) * 2);
      const basis1_1 = Math.exp(-(pow2(x - 1) + pow2(y - 1)) * 2);
      const basis2_plus = Math.exp(-(pow2(x + 1) + pow2(y - 1)) * 2);
      const basis2_minus = Math.exp(-(pow2(x - 1) + pow2(y + 1)) * 2);
      
      return [x * 0.4, y * 0.4, (basis1_0 + basis1_1 + basis2_plus + basis2_minus) * 0.3];
    },
    defaultParams: getCleanDefaults({ uSegments: 64, vSegments: 64 })
  },

  entanglement_fidelity: {
    name: "Entanglement Fidelity - F = <Phi+|rho|Phi+>",
    equation: (u, v, params) => {
      const noise = params.d ?? 0.1;
      
      const x = (u - 0.5) * 3;
      const y = (v - 0.5) * 3;
      const r = Math.sqrt(x * x + y * y);
      
      const fidelity = (1 - noise) * Math.exp(-r * r) + noise * 0.25;
      
      return [x, y, fidelity * 0.6];
    },
    defaultParams: getCleanDefaults({ d: 0.1, uSegments: 64, vSegments: 64 })
  },

  transmon_energy_levels: {
    name: "Transmon Qubit - Energy Levels",
    equation: (u, v, params) => {
      const EJ_EC = params.d ?? 50;
      
      const ng = (u - 0.5) * 2;
      const level = Math.floor(v * 4);
      
      const x = ng;
      const y = level / 2 - 1;
      
      const E = Math.sqrt(8 * EJ_EC) * (level + 0.5) - 
                (level * level + level + 0.5) / (8 * EJ_EC);
      
      const chargeDispersion = Math.cos(2 * Math.PI * ng) / EJ_EC;
      
      return [x, y, (E + chargeDispersion) * 0.1];
    },
    defaultParams: getCleanDefaults({ d: 50, uSegments: 64, vSegments: 16 })
  },

  ion_trap_rabi: {
    name: "Ion Trap - Rabi Oscillations",
    equation: (u, v, params) => {
      const rabiFreq = params.d ?? 5;
      
      const t = u * 4;
      const detuning = (v - 0.5) * 4;
      
      const x = t - 2;
      const y = detuning;
      
      const generalizedRabi = Math.sqrt(rabiFreq * rabiFreq + detuning * detuning);
      const ratio = rabiFreq / generalizedRabi;
      const sinVal = Math.sin(generalizedRabi * t / 2);
      const prob = ratio * ratio * sinVal * sinVal;
      
      return [x * 0.4, y * 0.4, prob * 0.5];
    },
    defaultParams: getCleanDefaults({ d: 5, uSegments: 80, vSegments: 80 })
  },

  hom_interference: {
    name: "Hong-Ou-Mandel - Photon Coalescence",
    equation: (u, v, params) => {
      const coherenceLength = params.d ?? 1;
      
      const delay = (u - 0.5) * 4;
      const y = (v - 0.5) * 2;
      
      const visibility = Math.exp(-Math.pow(delay / coherenceLength, 2));
      const coincidence = 0.5 * (1 - visibility);
      
      return [delay * 0.4, y, coincidence * Math.exp(-y * y) * 0.5];
    },
    defaultParams: getCleanDefaults({ d: 1, uSegments: 80, vSegments: 40 })
  }
};

export default QUANTUM_COMPUTING_ALGORITHMS;

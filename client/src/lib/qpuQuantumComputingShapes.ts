import { SurfaceParameters } from '../types/math';
import { getCleanDefaults } from '../types/shapes';

/**
 * QPU & QUANTUM COMPUTING SHAPES
 * 40 Quantum Algorithm Visualizations
 * 
 * Author: UUON Foundation Inc.
 * These shapes were previously placeholders - now fully implemented
 */

export const QPU_QUANTUM_COMPUTING_SHAPES: Record<string, {
  name: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}> = {

  qubit_bloch_sphere: {
    name: "⚛️ Qubit Bloch Sphere",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const stateTheta = params.e ?? 0.5;
      const statePhi = params.f ?? 0;
      
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const blochMod = 0.1 * Math.exp(-10 * Math.pow(theta - stateTheta * Math.PI, 2));
      
      const x = scale * (1 + blochMod) * Math.sin(theta) * Math.cos(phi);
      const y = scale * (1 + blochMod) * Math.sin(theta) * Math.sin(phi);
      const z = scale * Math.cos(theta);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 0.5, f: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 48 })
  },

  qubit_state_vector: {
    name: "📍 Qubit State Vector",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const alpha = params.e ?? 0.7;
      const beta = Math.sqrt(1 - alpha * alpha);
      
      const t = u * 2;
      const phi = v * 2 * Math.PI;
      const r = params.f ?? 0.1;
      
      const stateTheta = 2 * Math.acos(alpha);
      
      const x = scale * (t * Math.sin(stateTheta) * Math.cos(0) + r * Math.cos(phi));
      const y = scale * (t * Math.sin(stateTheta) * Math.sin(0) + r * Math.sin(phi));
      const z = scale * t * Math.cos(stateTheta);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 0.7, f: 0.1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 24, vSegments: 24 })
  },

  quantum_superposition_state: {
    name: "🌀 Quantum Superposition",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const superpositionRatio = params.e ?? 0.5;
      
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const wave1 = Math.sin(theta * 2) * superpositionRatio;
      const wave2 = Math.cos(theta * 3) * (1 - superpositionRatio);
      const interference = wave1 + wave2;
      
      const x = scale * (1 + 0.3 * interference) * Math.sin(theta) * Math.cos(phi);
      const y = scale * (1 + 0.3 * interference) * Math.sin(theta) * Math.sin(phi);
      const z = scale * Math.cos(theta) * (1 + 0.2 * interference);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 })
  },

  quantum_gate_pauli_x: {
    name: "❌ Pauli-X Gate (NOT)",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const xFlip = Math.cos(theta);
      const gateEffect = 1 + 0.3 * Math.abs(Math.sin(2 * theta));
      
      const x = scale * gateEffect * Math.sin(phi) * Math.cos(theta);
      const y = scale * Math.sin(phi) * Math.sin(theta);
      const z = scale * gateEffect * Math.cos(phi);
      
      return [x, -z, y];
    },
    defaultParams: getCleanDefaults({ d: 1.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 24 })
  },

  quantum_gate_pauli_y: {
    name: "🔄 Pauli-Y Gate",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const yRotation = Math.sin(theta) * Math.cos(phi);
      const gateEffect = 1 + 0.3 * Math.abs(yRotation);
      
      const x = scale * Math.sin(phi) * Math.cos(theta);
      const y = scale * gateEffect * Math.sin(phi) * Math.sin(theta);
      const z = scale * Math.cos(phi);
      
      return [-z, x, y];
    },
    defaultParams: getCleanDefaults({ d: 1.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 24 })
  },

  quantum_gate_pauli_z: {
    name: "⬆️ Pauli-Z Gate (Phase)",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const zPhase = Math.cos(2 * phi);
      const gateEffect = 1 + 0.3 * Math.abs(zPhase);
      
      const x = scale * Math.sin(phi) * Math.cos(theta);
      const y = scale * Math.sin(phi) * Math.sin(theta);
      const z = scale * gateEffect * Math.cos(phi);
      
      return [x, y, z * (phi < Math.PI / 2 ? 1 : -1)];
    },
    defaultParams: getCleanDefaults({ d: 1.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 24 })
  },

  quantum_gate_hadamard: {
    name: "🔀 Hadamard Gate",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const sqrt2inv = 1 / Math.sqrt(2);
      const hadamardMod = sqrt2inv * (Math.sin(phi) + Math.cos(phi));
      
      const x = scale * (1 + 0.3 * hadamardMod) * Math.sin(phi) * Math.cos(theta);
      const y = scale * (1 + 0.3 * hadamardMod) * Math.sin(phi) * Math.sin(theta);
      const z = scale * Math.cos(phi) * hadamardMod;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 24 })
  },

  quantum_gate_cnot: {
    name: "⊕ CNOT Gate",
    equation: (u, v, params) => {
      const scale = params.d ?? 1;
      
      const theta = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const R = 2;
      const r = 0.5;
      
      const controlBit = Math.floor(theta / Math.PI);
      const targetFlip = controlBit === 1 ? -1 : 1;
      
      const x = scale * (R + r * Math.cos(phi)) * Math.cos(theta);
      const y = scale * (R + r * Math.cos(phi)) * Math.sin(theta);
      const z = scale * r * Math.sin(phi) * targetFlip;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 0.8, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 36 })
  },

  quantum_gate_toffoli: {
    name: "⊕⊕ Toffoli Gate (CCNOT)",
    equation: (u, v, params) => {
      const scale = params.d ?? 1;
      
      const theta = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const R = 2.5;
      const r = 0.4;
      
      const control1 = Math.floor(theta * 2 / Math.PI) % 2;
      const control2 = Math.floor(phi * 2 / Math.PI) % 2;
      const targetFlip = (control1 === 1 && control2 === 1) ? -1 : 1;
      
      const gateComplexity = 1 + 0.2 * (control1 + control2);
      
      const x = scale * (R + r * Math.cos(phi) * gateComplexity) * Math.cos(theta);
      const y = scale * (R + r * Math.cos(phi) * gateComplexity) * Math.sin(theta);
      const z = scale * r * Math.sin(phi) * targetFlip;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 0.6, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 36 })
  },

  multi_qubit_tensor_product: {
    name: "⊗ Multi-Qubit Tensor",
    equation: (u, v, params) => {
      const scale = params.d ?? 1;
      const qubits = Math.floor(params.e ?? 3);
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const tensorDim = Math.pow(2, qubits);
      const tensorMod = Math.sin(tensorDim * theta / 4) * Math.cos(tensorDim * phi / 4);
      
      const x = scale * (1 + 0.2 * tensorMod) * Math.sin(phi) * Math.cos(theta);
      const y = scale * (1 + 0.2 * tensorMod) * Math.sin(phi) * Math.sin(theta);
      const z = scale * (1 + 0.15 * tensorMod) * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 })
  },

  two_qubit_entangled_state: {
    name: "🔗 2-Qubit Entanglement",
    equation: (u, v, params) => {
      const scale = params.d ?? 1;
      
      const theta = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const R = 2;
      const r = 0.6;
      
      const entanglementPhase = Math.sin(theta - phi);
      const bellMod = 1 + 0.3 * entanglementPhase;
      
      const x = scale * (R + r * Math.cos(phi) * bellMod) * Math.cos(theta);
      const y = scale * (R + r * Math.cos(phi) * bellMod) * Math.sin(theta);
      const z = scale * r * Math.sin(phi) * (1 + 0.2 * entanglementPhase);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 0.8, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 36 })
  },

  three_qubit_ghz_state: {
    name: "🌐 3-Qubit GHZ State",
    equation: (u, v, params) => {
      const scale = params.d ?? 1;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const ghzMod = Math.cos(3 * theta) * Math.sin(phi);
      
      const x = scale * (1 + 0.3 * ghzMod) * Math.sin(phi) * Math.cos(theta);
      const y = scale * (1 + 0.3 * ghzMod) * Math.sin(phi) * Math.sin(theta);
      const z = scale * Math.cos(phi) * (1 + 0.2 * Math.abs(ghzMod));
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 36 })
  },

  hamiltonian_energy_matrix: {
    name: "⚡ Hamiltonian Energy Matrix",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const energyLevel = params.e ?? 3;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const energyMod = Math.sin(energyLevel * theta) * Math.sin(energyLevel * phi);
      
      const x = scale * (1 + 0.25 * energyMod) * Math.sin(phi) * Math.cos(theta);
      const y = scale * (1 + 0.25 * energyMod) * Math.sin(phi) * Math.sin(theta);
      const z = scale * Math.cos(phi) + 0.3 * energyMod;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1.5, e: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 36 })
  },

  unitary_time_evolution: {
    name: "⏱️ Unitary Time Evolution",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const time = params.e ?? 1;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const evolutionPhase = time * theta;
      const unitaryMod = Math.cos(evolutionPhase) + Math.sin(2 * evolutionPhase) * 0.3;
      
      const x = scale * (1 + 0.2 * unitaryMod) * Math.sin(phi) * Math.cos(theta);
      const y = scale * (1 + 0.2 * unitaryMod) * Math.sin(phi) * Math.sin(theta);
      const z = scale * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1.5, e: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 36 })
  },

  schrodinger_evolution_operator: {
    name: "📐 Schrödinger Evolution",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const hbar = params.e ?? 1;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const psi = Math.exp(-hbar * phi) * Math.cos(theta * 2);
      
      const x = scale * (1 + 0.3 * psi) * Math.sin(phi) * Math.cos(theta);
      const y = scale * (1 + 0.3 * psi) * Math.sin(phi) * Math.sin(theta);
      const z = scale * Math.cos(phi) * (1 + 0.2 * psi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1.5, e: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 36 })
  },

  quantum_phase_rotation: {
    name: "🔄 Quantum Phase Rotation",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const phaseAngle = params.e ?? Math.PI / 4;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const rotatedTheta = theta + phaseAngle * Math.sin(phi);
      
      const x = scale * Math.sin(phi) * Math.cos(rotatedTheta);
      const y = scale * Math.sin(phi) * Math.sin(rotatedTheta);
      const z = scale * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 0.785, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 })
  },

  quantum_interference_pattern: {
    name: "〰️ Quantum Interference",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const slitSeparation = params.e ?? 2;
      
      const x = (u - 0.5) * 4 * scale;
      const z = (v - 0.5) * 4 * scale;
      
      const d = slitSeparation;
      const k = 10;
      
      const r1 = Math.sqrt((x - d/2) * (x - d/2) + z * z + 1);
      const r2 = Math.sqrt((x + d/2) * (x + d/2) + z * z + 1);
      
      const interference = Math.cos(k * (r1 - r2));
      const amplitude = Math.exp(-0.1 * (x*x + z*z));
      
      const y = scale * 0.5 * interference * amplitude;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 96 })
  },

  grover_search_algorithm: {
    name: "🔍 Grover's Search",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const iterations = Math.floor(params.e ?? 3);
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const amplification = Math.pow(Math.sin(theta), iterations) * Math.sin(phi);
      
      const x = scale * (1 + 0.4 * amplification) * Math.sin(phi) * Math.cos(theta);
      const y = scale * (1 + 0.4 * amplification) * Math.sin(phi) * Math.sin(theta);
      const z = scale * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1.5, e: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 36 })
  },

  shor_factorization_algorithm: {
    name: "🔢 Shor's Algorithm",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const period = Math.floor(params.e ?? 4);
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const qft = Math.cos(period * theta) * Math.sin(period * phi / 2);
      const periodicity = Math.sin(2 * Math.PI * period * u);
      
      const x = scale * (1 + 0.3 * qft) * Math.sin(phi) * Math.cos(theta);
      const y = scale * (1 + 0.3 * qft) * Math.sin(phi) * Math.sin(theta);
      const z = scale * Math.cos(phi) + 0.3 * periodicity;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1.5, e: 4, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 })
  },

  quantum_fourier_transform: {
    name: "🌊 Quantum Fourier Transform",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const n = Math.floor(params.e ?? 4);
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      let qftSum = 0;
      for (let k = 0; k < n; k++) {
        qftSum += Math.cos(2 * Math.PI * k * u / n) / n;
      }
      
      const x = scale * (1 + 0.3 * qftSum) * Math.sin(phi) * Math.cos(theta);
      const y = scale * (1 + 0.3 * qftSum) * Math.sin(phi) * Math.sin(theta);
      const z = scale * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1.5, e: 4, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 36 })
  },

  quantum_phase_estimation: {
    name: "📊 Phase Estimation",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const eigenphase = params.e ?? 0.25;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const phaseKickback = Math.cos(2 * Math.PI * eigenphase * Math.floor(4 * u));
      
      const x = scale * (1 + 0.2 * phaseKickback) * Math.sin(phi) * Math.cos(theta);
      const y = scale * (1 + 0.2 * phaseKickback) * Math.sin(phi) * Math.sin(theta);
      const z = scale * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1.5, e: 0.25, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 36 })
  },

  variational_quantum_eigensolver: {
    name: "⚛️ VQE Surface",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const ansatzDepth = Math.floor(params.e ?? 2);
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      let energyLandscape = 0;
      for (let l = 1; l <= ansatzDepth; l++) {
        energyLandscape += Math.sin(l * theta) * Math.cos(l * phi) / l;
      }
      
      const x = scale * (1 + 0.3 * energyLandscape) * Math.sin(phi) * Math.cos(theta);
      const y = scale * (1 + 0.3 * energyLandscape) * Math.sin(phi) * Math.sin(theta);
      const z = scale * Math.cos(phi) + 0.2 * energyLandscape;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1.5, e: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 36 })
  },

  qaoa_optimization_surface: {
    name: "📈 QAOA Optimization",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const pLayers = Math.floor(params.e ?? 3);
      
      const gamma = u * Math.PI;
      const beta = v * Math.PI;
      
      let costFunction = 0;
      for (let p = 1; p <= pLayers; p++) {
        costFunction += Math.sin(p * gamma) * Math.cos(p * beta);
      }
      costFunction /= pLayers;
      
      const x = scale * gamma / Math.PI * 2 - scale;
      const y = scale * costFunction;
      const z = scale * beta / Math.PI * 2 - scale;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1.5, e: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 })
  },

  quantum_annealing_landscape: {
    name: "🌡️ Quantum Annealing",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const temperature = params.e ?? 0.5;
      
      const x = (u - 0.5) * 4 * scale;
      const z = (v - 0.5) * 4 * scale;
      
      const potential = Math.sin(x) * Math.sin(z) + 0.5 * Math.sin(2*x) * Math.cos(2*z);
      const tunneling = temperature * Math.exp(-0.1 * (x*x + z*z));
      
      const y = scale * 0.5 * (potential + tunneling);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 })
  },

  quantum_error_correction_code: {
    name: "🛡️ Quantum Error Correction",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const codeDistance = Math.floor(params.e ?? 3);
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const stabilizer = Math.cos(codeDistance * theta) * Math.sin(codeDistance * phi);
      
      const x = scale * (1 + 0.2 * stabilizer) * Math.sin(phi) * Math.cos(theta);
      const y = scale * (1 + 0.2 * stabilizer) * Math.sin(phi) * Math.sin(theta);
      const z = scale * Math.cos(phi) * (1 + 0.15 * Math.abs(stabilizer));
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1.5, e: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 36 })
  },

  surface_code_lattice: {
    name: "🔲 Surface Code Lattice",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const latticeSize = Math.floor(params.e ?? 5);
      
      const x = (u - 0.5) * latticeSize * scale;
      const z = (v - 0.5) * latticeSize * scale;
      
      const xStab = Math.sin(2 * Math.PI * u * latticeSize);
      const zStab = Math.sin(2 * Math.PI * v * latticeSize);
      const defect = 0.3 * xStab * zStab;
      
      const y = scale * 0.2 * (xStab + zStab + defect);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 0.5, e: 5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 })
  },

  stabilizer_code_graph: {
    name: "📊 Stabilizer Code Graph",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const generators = Math.floor(params.e ?? 4);
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      let stabilizerProduct = 1;
      for (let g = 1; g <= generators; g++) {
        stabilizerProduct *= Math.cos(g * theta / generators);
      }
      
      const x = scale * (1 + 0.2 * stabilizerProduct) * Math.sin(phi) * Math.cos(theta);
      const y = scale * (1 + 0.2 * stabilizerProduct) * Math.sin(phi) * Math.sin(theta);
      const z = scale * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1.5, e: 4, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 36 })
  },

  quantum_decoherence_trajectory: {
    name: "📉 Decoherence Trajectory",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const T2 = params.e ?? 1;
      
      const t = u * 4;
      const phi = v * 2 * Math.PI;
      
      const coherence = Math.exp(-t / T2);
      const r = 0.3 + 0.5 * coherence;
      
      const x = scale * r * Math.cos(phi) * coherence;
      const y = scale * t;
      const z = scale * r * Math.sin(phi) * coherence;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 })
  },

  noise_channel_visualization: {
    name: "📶 Noise Channel",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const noiseStrength = params.e ?? 0.3;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const depolarizing = noiseStrength * (Math.sin(5 * theta) * Math.cos(5 * phi));
      const dephasing = noiseStrength * Math.sin(3 * theta);
      
      const x = scale * (1 + depolarizing) * Math.sin(phi) * Math.cos(theta + dephasing);
      const y = scale * (1 + depolarizing) * Math.sin(phi) * Math.sin(theta + dephasing);
      const z = scale * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1.5, e: 0.3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 36 })
  },

  quantum_tomography_reconstruction: {
    name: "🔬 Quantum Tomography",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const measurements = Math.floor(params.e ?? 6);
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      let reconstructed = 0;
      for (let m = 0; m < measurements; m++) {
        const mAngle = (m / measurements) * Math.PI;
        reconstructed += Math.cos(theta - mAngle) * Math.sin(phi);
      }
      reconstructed /= measurements;
      
      const x = scale * (1 + 0.2 * reconstructed) * Math.sin(phi) * Math.cos(theta);
      const y = scale * (1 + 0.2 * reconstructed) * Math.sin(phi) * Math.sin(theta);
      const z = scale * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1.5, e: 6, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 36 })
  },

  density_matrix_visualization: {
    name: "🎲 Density Matrix",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const purity = params.e ?? 0.8;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const blochRadius = Math.sqrt(2 * purity - 1);
      const densityMod = blochRadius * Math.sin(phi);
      
      const x = scale * densityMod * Math.cos(theta);
      const y = scale * densityMod * Math.sin(theta);
      const z = scale * blochRadius * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1.5, e: 0.8, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 24 })
  },

  fidelity_metric_surface: {
    name: "📏 Fidelity Metric",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      
      const theta1 = u * Math.PI;
      const theta2 = v * Math.PI;
      
      const fidelity = Math.pow(Math.cos((theta1 - theta2) / 2), 2);
      
      const x = scale * theta1 / Math.PI;
      const y = scale * fidelity;
      const z = scale * theta2 / Math.PI;
      
      return [x - scale/2, y, z - scale/2];
    },
    defaultParams: getCleanDefaults({ d: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 48 })
  },

  quantum_discord_geometry: {
    name: "🔀 Quantum Discord",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const classicalCorrelation = params.e ?? 0.5;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const mutualInfo = Math.sin(phi) * Math.cos(phi);
      const discord = mutualInfo - classicalCorrelation * Math.pow(Math.sin(phi), 2);
      
      const x = scale * (1 + 0.3 * discord) * Math.sin(phi) * Math.cos(theta);
      const y = scale * (1 + 0.3 * discord) * Math.sin(phi) * Math.sin(theta);
      const z = scale * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1.5, e: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 36 })
  },

  quantum_coherence_measure: {
    name: "💎 Quantum Coherence",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const basisDim = Math.floor(params.e ?? 3);
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      let coherence = 0;
      for (let i = 1; i < basisDim; i++) {
        for (let j = i + 1; j <= basisDim; j++) {
          coherence += Math.cos((i - j) * theta) * Math.sin(phi);
        }
      }
      coherence /= (basisDim * (basisDim - 1) / 2);
      
      const x = scale * (1 + 0.2 * coherence) * Math.sin(phi) * Math.cos(theta);
      const y = scale * (1 + 0.2 * coherence) * Math.sin(phi) * Math.sin(theta);
      const z = scale * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1.5, e: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 36 })
  },

  adiabatic_quantum_evolution: {
    name: "🐌 Adiabatic Evolution",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const evolutionTime = params.e ?? 1;
      
      const s = u;
      const phi = v * 2 * Math.PI;
      
      const initialH = Math.cos(2 * Math.PI * s);
      const finalH = Math.sin(2 * Math.PI * s);
      const adiabatic = (1 - s) * initialH + s * finalH;
      
      const r = 1 + 0.3 * adiabatic;
      
      const x = scale * r * Math.cos(phi) * s;
      const y = scale * s * evolutionTime;
      const z = scale * r * Math.sin(phi) * s;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1.5, e: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 48 })
  },

  quantum_walk_graph: {
    name: "🚶 Discrete Quantum Walk",
    equation: (u, v, params) => {
      const scale = params.d ?? 1;
      const steps = Math.floor(params.e ?? 10);
      
      const position = Math.floor(u * steps * 2) - steps;
      const coinState = v;
      
      const amplitude = Math.exp(-Math.abs(position) / 3) * Math.sin(Math.PI * coinState);
      
      const x = scale * position / steps * 2;
      const y = scale * amplitude;
      const z = scale * (coinState - 0.5) * 2;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 10, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 })
  },

  continuous_time_quantum_walk: {
    name: "⏳ Continuous Quantum Walk",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const gamma = params.e ?? 1;
      
      const x = (u - 0.5) * 4 * scale;
      const t = v * 2;
      
      const amplitude = Math.exp(-gamma * t) * Math.cos(x * 2 - t);
      const spreading = Math.sqrt(1 + gamma * t);
      
      const z = (v - 0.5) * 4 * scale;
      const y = scale * amplitude / spreading;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 })
  },

  quantum_cellular_automaton: {
    name: "🔢 Quantum Cellular Automaton",
    equation: (u, v, params) => {
      const scale = params.d ?? 1;
      const rule = Math.floor(params.e ?? 30);
      
      const cellX = Math.floor(u * 20);
      const timeStep = Math.floor(v * 20);
      
      const ruleApplication = ((rule >> ((cellX + timeStep) % 8)) & 1);
      const amplitude = ruleApplication * Math.sin(Math.PI * u) * Math.sin(Math.PI * v);
      
      const x = scale * (u - 0.5) * 4;
      const y = scale * amplitude * 0.5;
      const z = scale * (v - 0.5) * 4;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 30, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 })
  },

  topological_quantum_code: {
    name: "🔷 Topological Quantum Code",
    equation: (u, v, params) => {
      const scale = params.d ?? 1;
      const genus = Math.floor(params.e ?? 1);
      
      const theta = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const R = 2;
      const r = 0.8;
      
      const topoCharge = Math.sin(genus * theta) * Math.cos(genus * phi);
      
      const x = scale * (R + r * Math.cos(phi) * (1 + 0.2 * topoCharge)) * Math.cos(theta);
      const y = scale * (R + r * Math.cos(phi) * (1 + 0.2 * topoCharge)) * Math.sin(theta);
      const z = scale * r * Math.sin(phi) * (1 + 0.3 * topoCharge);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 0.7, e: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 36 })
  }

};

export default QPU_QUANTUM_COMPUTING_SHAPES;

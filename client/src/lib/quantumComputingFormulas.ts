
/**
 * Quantum Computing Formulas & Phenomena
 * Comprehensive mathematical foundation for quantum visualization
 */

export interface QubitState {
  alpha: { real: number; imag: number };
  beta: { real: number; imag: number };
  theta: number;
  phi: number;
}

export interface BlochSphereCoords {
  x: number;
  y: number;
  z: number;
}

export interface BellState {
  name: string;
  coefficients: Array<{ real: number; imag: number }>;
  basis: string[];
}

export class QuantumComputingFormulas {
  
  // 1. QUBIT FUNDAMENTALS
  static createQubitState(alpha: { real: number; imag: number }, beta: { real: number; imag: number }): QubitState {
    // Normalize the state
    const norm = Math.sqrt(alpha.real ** 2 + alpha.imag ** 2 + beta.real ** 2 + beta.imag ** 2);
    
    const normalizedAlpha = { real: alpha.real / norm, imag: alpha.imag / norm };
    const normalizedBeta = { real: beta.real / norm, imag: beta.imag / norm };
    
    // Convert to spherical coordinates
    const alphaAbs = Math.sqrt(normalizedAlpha.real ** 2 + normalizedAlpha.imag ** 2);
    const betaAbs = Math.sqrt(normalizedBeta.real ** 2 + normalizedBeta.imag ** 2);
    
    const theta = 2 * Math.acos(alphaAbs);
    const phi = Math.atan2(normalizedBeta.imag, normalizedBeta.real) - Math.atan2(normalizedAlpha.imag, normalizedAlpha.real);
    
    return {
      alpha: normalizedAlpha,
      beta: normalizedBeta,
      theta,
      phi
    };
  }

  static qubitToBlochSphere(state: QubitState): BlochSphereCoords {
    return {
      x: Math.sin(state.theta) * Math.cos(state.phi),
      y: Math.sin(state.theta) * Math.sin(state.phi),
      z: Math.cos(state.theta)
    };
  }

  static blochSphereToQubit(coords: BlochSphereCoords): QubitState {
    const theta = Math.acos(coords.z);
    const phi = Math.atan2(coords.y, coords.x);
    
    const alpha = { real: Math.cos(theta / 2), imag: 0 };
    const beta = { 
      real: Math.sin(theta / 2) * Math.cos(phi), 
      imag: Math.sin(theta / 2) * Math.sin(phi) 
    };
    
    return { alpha, beta, theta, phi };
  }

  // 2. BELL STATES (Maximally Entangled)
  static getBellStates(): BellState[] {
    const sqrt2Inv = 1 / Math.sqrt(2);
    
    return [
      {
        name: "Φ⁺",
        coefficients: [
          { real: sqrt2Inv, imag: 0 }, // |00⟩
          { real: 0, imag: 0 },        // |01⟩
          { real: 0, imag: 0 },        // |10⟩
          { real: sqrt2Inv, imag: 0 }  // |11⟩
        ],
        basis: ["00", "01", "10", "11"]
      },
      {
        name: "Φ⁻",
        coefficients: [
          { real: sqrt2Inv, imag: 0 },
          { real: 0, imag: 0 },
          { real: 0, imag: 0 },
          { real: -sqrt2Inv, imag: 0 }
        ],
        basis: ["00", "01", "10", "11"]
      },
      {
        name: "Ψ⁺",
        coefficients: [
          { real: 0, imag: 0 },
          { real: sqrt2Inv, imag: 0 },
          { real: sqrt2Inv, imag: 0 },
          { real: 0, imag: 0 }
        ],
        basis: ["00", "01", "10", "11"]
      },
      {
        name: "Ψ⁻",
        coefficients: [
          { real: 0, imag: 0 },
          { real: sqrt2Inv, imag: 0 },
          { real: -sqrt2Inv, imag: 0 },
          { real: 0, imag: 0 }
        ],
        basis: ["00", "01", "10", "11"]
      }
    ];
  }

  // 3. QUANTUM GATES
  static getPauliGates() {
    return {
      X: [[0, 1], [1, 0]], // Pauli-X (NOT gate)
      Y: [[0, { real: 0, imag: -1 }], [{ real: 0, imag: 1 }, 0]], // Pauli-Y
      Z: [[1, 0], [0, -1]], // Pauli-Z
    };
  }

  static getHadamardGate() {
    const sqrt2Inv = 1 / Math.sqrt(2);
    return [[sqrt2Inv, sqrt2Inv], [sqrt2Inv, -sqrt2Inv]];
  }

  static getRotationGates() {
    return {
      Rx: (theta: number) => [
        [Math.cos(theta / 2), { real: 0, imag: -Math.sin(theta / 2) }],
        [{ real: 0, imag: -Math.sin(theta / 2) }, Math.cos(theta / 2)]
      ],
      Ry: (theta: number) => [
        [Math.cos(theta / 2), -Math.sin(theta / 2)],
        [Math.sin(theta / 2), Math.cos(theta / 2)]
      ],
      Rz: (phi: number) => [
        [{ real: Math.cos(-phi / 2), imag: Math.sin(-phi / 2) }, 0],
        [0, { real: Math.cos(phi / 2), imag: Math.sin(phi / 2) }]
      ]
    };
  }

  // 4. ENTANGLEMENT MEASURES
  static calculateConcurrence(state: number[]): number {
    // Simplified concurrence calculation for 2-qubit pure states
    // |ψ⟩ = c00|00⟩ + c01|01⟩ + c10|10⟩ + c11|11⟩
    if (state.length !== 4) return 0;
    
    const [c00, c01, c10, c11] = state;
    return 2 * Math.abs(c00 * c11 - c01 * c10);
  }

  static calculateSchmidtCoefficients(state: number[]): number[] {
    // Simplified Schmidt decomposition for 2-qubit states
    // Returns Schmidt coefficients (square roots of eigenvalues)
    const [c00, c01, c10, c11] = state;
    
    // Construct reduced density matrix for subsystem A
    const rhoA = [
      [c00 ** 2 + c01 ** 2, c00 * c10 + c01 * c11],
      [c00 * c10 + c01 * c11, c10 ** 2 + c11 ** 2]
    ];
    
    // Calculate eigenvalues (simplified)
    const trace = rhoA[0][0] + rhoA[1][1];
    const det = rhoA[0][0] * rhoA[1][1] - rhoA[0][1] * rhoA[1][0];
    const discriminant = trace ** 2 - 4 * det;
    
    if (discriminant < 0) return [0, 0];
    
    const lambda1 = (trace + Math.sqrt(discriminant)) / 2;
    const lambda2 = (trace - Math.sqrt(discriminant)) / 2;
    
    return [Math.sqrt(Math.max(0, lambda1)), Math.sqrt(Math.max(0, lambda2))];
  }

  // 5. DECOHERENCE MODELING
  static applyT1Decay(state: QubitState, time: number, T1: number): QubitState {
    // Energy relaxation: |1⟩ → |0⟩
    const decayFactor = Math.exp(-time / T1);
    
    return {
      ...state,
      alpha: { 
        real: state.alpha.real + state.beta.real * (1 - decayFactor), 
        imag: state.alpha.imag + state.beta.imag * (1 - decayFactor)
      },
      beta: { 
        real: state.beta.real * decayFactor, 
        imag: state.beta.imag * decayFactor 
      }
    };
  }

  static applyT2Dephasing(state: QubitState, time: number, T2: number): QubitState {
    // Phase decoherence
    const dephase = Math.exp(-time / T2);
    
    return {
      ...state,
      beta: {
        real: state.beta.real * dephase,
        imag: state.beta.imag * dephase
      }
    };
  }

  // 6. QUANTUM ALGORITHM COMPONENTS
  static quantumFourierTransform(n: number): number[][][] {
    // Returns QFT matrix for n qubits (simplified representation)
    const N = 2 ** n;
    const qft: number[][][] = [];
    
    for (let j = 0; j < N; j++) {
      qft[j] = [];
      for (let k = 0; k < N; k++) {
        const angle = (2 * Math.PI * j * k) / N;
        qft[j][k] = [Math.cos(angle) / Math.sqrt(N), Math.sin(angle) / Math.sqrt(N)];
      }
    }
    
    return qft;
  }

  static groverIterations(N: number, M: number): number {
    // Calculate optimal number of Grover iterations
    // N = search space size, M = number of solutions
    return Math.floor((Math.PI / 4) * Math.sqrt(N / M));
  }

  static groverSuccessProbability(k: number, N: number, M: number): number {
    // Success probability after k iterations
    const theta = Math.asin(Math.sqrt(M / N));
    return Math.sin((2 * k + 1) * theta) ** 2;
  }

  // 7. QUANTUM ERROR CORRECTION
  static threeBitFlipSyndromes(): { [key: string]: string } {
    return {
      "00": "no error",
      "01": "qubit 3 error",
      "10": "qubit 2 error", 
      "11": "qubit 1 error"
    };
  }

  static calculateLogicalErrorRate(physicalErrorRate: number, distance: number, threshold: number = 0.01): number {
    // Surface code logical error rate
    if (physicalErrorRate > threshold) {
      return physicalErrorRate; // Above threshold
    }
    return Math.pow(physicalErrorRate / threshold, (distance + 1) / 2);
  }

  // 8. QUANTUM SENSING & METROLOGY
  static heisenbergLimit(N: number): number {
    // Quantum-enhanced precision scaling
    return 1 / N; // vs classical 1/√N
  }

  static ramseyFringe(phi: number, contrast: number = 1): number {
    // Ramsey interferometry signal
    return contrast * Math.cos(phi);
  }

  static spinSqueezingParameter(variance: number, N: number): number {
    // Spin squeezing parameter ξ²
    return (4 * variance) / N;
  }

  // 9. PHYSICAL IMPLEMENTATION PARAMETERS
  static transmonFrequency(EJ: number, EC: number): number {
    // Transmon qubit frequency (GHz)
    return Math.sqrt(8 * EJ * EC) - EC;
  }

  static transmonAnharmonicity(EC: number): number {
    // Anharmonicity α = ω₁₂ - ω₀₁
    return -EC;
  }

  static ionTrapFrequency(k: number, m: number): number {
    // Ion trap frequency ω = √(k/m)
    return Math.sqrt(k / m);
  }

  // 10. QUANTUM MACHINE LEARNING UTILITIES
  static quantumKernel(x1: number[], x2: number[], U: (x: number[]) => number[][]): number {
    // Quantum kernel K(x1, x2) = |⟨φ(x1)|φ(x2)⟩|²
    const phi1 = U(x1);
    const phi2 = U(x2);
    
    // Simplified inner product calculation
    let innerProduct = 0;
    for (let i = 0; i < phi1.length; i++) {
      for (let j = 0; j < phi1[i].length; j++) {
        innerProduct += phi1[i][j] * phi2[i][j];
      }
    }
    
    return Math.abs(innerProduct) ** 2;
  }

  static parameterShiftRule(f: (theta: number) => number, theta: number, shift: number = Math.PI / 4): number {
    // Gradient computation for quantum neural networks
    return (f(theta + shift) - f(theta - shift)) / 2;
  }

  // 11. QUANTUM COMMUNICATION
  static bb84ErrorRate(eavesdropperProb: number): number {
    // BB84 quantum bit error rate with eavesdropping
    return eavesdropperProb / 4; // Simplified model
  }

  static fidelityMeasure(rho: number[][], sigma: number[][]): number {
    // Quantum state fidelity F = Tr(√(√ρ σ √ρ))
    // Simplified calculation for 2x2 density matrices
    let trace = 0;
    for (let i = 0; i < rho.length; i++) {
      for (let j = 0; j < rho[i].length; j++) {
        trace += Math.sqrt(rho[i][j] * sigma[i][j]);
      }
    }
    return trace;
  }

  // 12. QUANTUM PHENOMENA CALCULATORS
  static quantumInterferenceVisibility(maxIntensity: number, minIntensity: number): number {
    // Interference fringe visibility
    return (maxIntensity - minIntensity) / (maxIntensity + minIntensity);
  }

  static bellInequalityViolation(E_ab: number, E_ac: number, E_bc: number, E_abc: number): number {
    // CHSH inequality: |E(a,b) + E(a,c) + E(b,c) - E(a,b,c)| ≤ 2
    return Math.abs(E_ab + E_ac + E_bc - E_abc);
  }

  static contextualityWitness(measurements: number[]): number {
    // Kochen-Specker contextuality witness
    return measurements.reduce((sum, val, idx) => sum + val * (idx % 2 === 0 ? 1 : -1), 0);
  }

  // 13. QUANTUM ADVANTAGE METRICS
  static quantumSupremacyMetric(classicalTime: number, quantumTime: number): number {
    // Quantum advantage factor
    return classicalTime / quantumTime;
  }

  static crossEntropyBenchmark(sampledProbabilities: number[]): number {
    // Cross-entropy benchmarking for random circuit sampling
    const n = Math.log2(sampledProbabilities.length);
    const avgProb = sampledProbabilities.reduce((sum, p) => sum + p, 0) / sampledProbabilities.length;
    return Math.pow(2, n) * avgProb - 1;
  }

  // 14. TOPOLOGICAL QUANTUM COMPUTING
  static fibonacciAnyon(n: number): number {
    // Fibonacci anyon fusion rules - golden ratio powers
    const phi = (1 + Math.sqrt(5)) / 2;
    return Math.pow(phi, n);
  }

  static braidingPhase(anyon1: string, anyon2: string): number {
    // Simplified braiding phase calculation
    const phases: { [key: string]: number } = {
      "ee": 0,
      "eτ": Math.PI / 4,
      "ττ": Math.PI / 8
    };
    return phases[anyon1 + anyon2] || 0;
  }
}

// Quantum Computing Constants
export const QUANTUM_CONSTANTS = {
  // Physical constants
  PLANCK_CONSTANT: 6.62607015e-34, // J⋅Hz⁻¹
  REDUCED_PLANCK: 1.054571817e-34, // J⋅s
  ELEMENTARY_CHARGE: 1.602176634e-19, // C
  BOLTZMANN_CONSTANT: 1.380649e-23, // J⋅K⁻¹
  
  // Quantum computing specific
  GOLDEN_RATIO: (1 + Math.sqrt(5)) / 2, // φ for topological qubits
  SQRT_2: Math.sqrt(2),
  SQRT_2_INV: 1 / Math.sqrt(2),
  
  // Common quantum gates phases
  PAULI_PHASE: Math.PI,
  S_GATE_PHASE: Math.PI / 2,
  T_GATE_PHASE: Math.PI / 4,
  
  // Error correction thresholds
  SURFACE_CODE_THRESHOLD: 0.01, // ~1%
  STEANE_CODE_THRESHOLD: 0.0003, // ~0.03%
  
  // Decoherence timescales (typical values in nanoseconds)
  TYPICAL_T1: 100000, // 100 μs
  TYPICAL_T2: 50000,  // 50 μs
  TYPICAL_T2_STAR: 10000, // 10 μs
};

export default QuantumComputingFormulas;

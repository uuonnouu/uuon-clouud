
/**
 * Quantum Visualization Shapes
 * Advanced quantum phenomena visualizations based on the formulas
 */

import { QuantumComputingFormulas, QubitState, BlochSphereCoords, QUANTUM_CONSTANTS } from './quantumComputingFormulas';

export const QUANTUM_VISUALIZATION_SHAPES = {
  // 1. BLOCH SPHERE VISUALIZATION
  bloch_sphere_dynamic: {
    name: "Dynamic Bloch Sphere",
    category: "quantum-physics",
    equation: "|ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩",
    description: "Interactive Bloch sphere showing qubit state evolution",
    parametric: {
      x: (u: number, v: number, params: any) => {
        const time = params.time || 0;
        const theta = params.a ?? Math.PI / 2;
        const phi = params.b ?? 0;
        
        // Sphere surface
        const sphereX = Math.sin(u) * Math.cos(v);
        
        // Qubit state vector
        const qubitCoords = QuantumComputingFormulas.qubitToBlochSphere({
          alpha: { real: Math.cos(theta / 2), imag: 0 },
          beta: { real: Math.sin(theta / 2) * Math.cos(phi + time), imag: Math.sin(theta / 2) * Math.sin(phi + time) },
          theta,
          phi: phi + time
        });
        
        return sphereX + qubitCoords.x * 0.1; // Add state indicator
      },
      y: (u: number, v: number, params: any) => {
        const time = params.time || 0;
        const theta = params.a ?? Math.PI / 2;
        const phi = params.b ?? 0;
        
        const sphereY = Math.sin(u) * Math.sin(v);
        
        const qubitCoords = QuantumComputingFormulas.qubitToBlochSphere({
          alpha: { real: Math.cos(theta / 2), imag: 0 },
          beta: { real: Math.sin(theta / 2) * Math.cos(phi + time), imag: Math.sin(theta / 2) * Math.sin(phi + time) },
          theta,
          phi: phi + time
        });
        
        return sphereY + qubitCoords.y * 0.1;
      },
      z: (u: number, v: number, params: any) => {
        const time = params.time || 0;
        const theta = params.a ?? Math.PI / 2;
        const phi = params.b ?? 0;
        
        const sphereZ = Math.cos(u);
        
        const qubitCoords = QuantumComputingFormulas.qubitToBlochSphere({
          alpha: { real: Math.cos(theta / 2), imag: 0 },
          beta: { real: Math.sin(theta / 2) * Math.cos(phi + time), imag: Math.sin(theta / 2) * Math.sin(phi + time) },
          theta,
          phi: phi + time
        });
        
        return sphereZ + qubitCoords.z * 0.1;
      }
    },
    defaultParams: { a: Math.PI / 2, b: 0, c: 1, time: 0 }
  },

  // 2. QUANTUM ENTANGLEMENT VISUALIZATION  
  bell_state_correlation: {
    name: "Bell State Correlation",
    category: "quantum-physics",
    equation: "|Φ⁺⟩ = (1/√2)(|00⟩ + |11⟩)",
    description: "Visualization of quantum entanglement correlations",
    parametric: {
      x: (u: number, v: number, params: any) => {
        const bellType = Math.floor(params.a ?? 0) % 4;
        const bellStates = QuantumComputingFormulas.getBellStates();
        const coeffs = bellStates[bellType].coefficients;
        
        // Create entanglement pattern
        const correlation = Math.abs(coeffs[0].real * coeffs[3].real - coeffs[1].real * coeffs[2].real);
        return Math.cos(u) * (1 + correlation * Math.sin(v * (params.b ?? 1)));
      },
      y: (u: number, v: number, params: any) => {
        const bellType = Math.floor(params.a ?? 0) % 4;
        const bellStates = QuantumComputingFormulas.getBellStates();
        const coeffs = bellStates[bellType].coefficients;
        
        const correlation = Math.abs(coeffs[0].real * coeffs[3].real - coeffs[1].real * coeffs[2].real);
        return Math.sin(u) * (1 + correlation * Math.cos(v * (params.b ?? 1)));
      },
      z: (u: number, v: number, params: any) => {
        const bellType = Math.floor(params.a ?? 0) % 4;
        const phase = params.c ?? 0;
        return Math.sin(v + phase) * (params.d ?? 0.5);
      }
    },
    defaultParams: { a: 0, b: 4, c: 0, d: 0.5 }
  },

  // 3. QUANTUM GATE VISUALIZATION
  quantum_gate_rotation: {
    name: "Quantum Gate Rotation",
    category: "quantum-physics", 
    equation: "Rx(θ) = cos(θ/2)I - i*sin(θ/2)σx",
    description: "Visualization of quantum gate operations on Bloch sphere",
    parametric: {
      x: (u: number, v: number, params: any) => {
        const gateAngle = params.a ?? 0;
        const axis = params.b ?? 0; // 0=X, 1=Y, 2=Z rotation
        
        // Initial state on Bloch sphere
        let coords = { x: Math.sin(u) * Math.cos(v), y: Math.sin(u) * Math.sin(v), z: Math.cos(u) };
        
        // Apply rotation based on gate type
        if (axis < 1) {
          // X rotation
          const newY = coords.y * Math.cos(gateAngle) - coords.z * Math.sin(gateAngle);
          const newZ = coords.y * Math.sin(gateAngle) + coords.z * Math.cos(gateAngle);
          coords.y = newY;
          coords.z = newZ;
        }
        
        return coords.x;
      },
      y: (u: number, v: number, params: any) => {
        const gateAngle = params.a ?? 0;
        const axis = params.b ?? 0;
        
        let coords = { x: Math.sin(u) * Math.cos(v), y: Math.sin(u) * Math.sin(v), z: Math.cos(u) };
        
        if (axis < 1) {
          // X rotation
          const newY = coords.y * Math.cos(gateAngle) - coords.z * Math.sin(gateAngle);
          coords.y = newY;
        }
        
        return coords.y;
      },
      z: (u: number, v: number, params: any) => {
        const gateAngle = params.a ?? 0;
        const axis = params.b ?? 0;
        
        let coords = { x: Math.sin(u) * Math.cos(v), y: Math.sin(u) * Math.sin(v), z: Math.cos(u) };
        
        if (axis < 1) {
          // X rotation
          const newZ = coords.y * Math.sin(gateAngle) + coords.z * Math.cos(gateAngle);
          coords.z = newZ;
        }
        
        return coords.z;
      }
    },
    defaultParams: { a: 0, b: 0, c: 1, d: 1 }
  },

  // 4. QUANTUM DECOHERENCE VISUALIZATION
  decoherence_evolution: {
    name: "Quantum Decoherence",
    category: "quantum-physics",
    equation: "ρ(t) = e^(-t/T₂)ρ(0) + (1-e^(-t/T₁))|0⟩⟨0|",
    description: "Visualization of quantum decoherence over time",
    parametric: {
      x: (u: number, v: number, params: any) => {
        const time = params.time || 0;
        const T1 = params.a ?? QUANTUM_CONSTANTS.TYPICAL_T1;
        const T2 = params.b ?? QUANTUM_CONSTANTS.TYPICAL_T2;
        
        // Initial coherent state
        const initialX = Math.sin(u) * Math.cos(v);
        
        // Apply T2 dephasing
        const dephasing = Math.exp(-time / T2);
        return initialX * dephasing;
      },
      y: (u: number, v: number, params: any) => {
        const time = params.time || 0;
        const T2 = params.b ?? QUANTUM_CONSTANTS.TYPICAL_T2;
        
        const initialY = Math.sin(u) * Math.sin(v);
        const dephasing = Math.exp(-time / T2);
        return initialY * dephasing;
      },
      z: (u: number, v: number, params: any) => {
        const time = params.time || 0;
        const T1 = params.a ?? QUANTUM_CONSTANTS.TYPICAL_T1;
        
        const initialZ = Math.cos(u);
        const relaxation = Math.exp(-time / T1);
        
        // Decay towards |0⟩ state (z = 1)
        return initialZ * relaxation + (1 - relaxation);
      }
    },
    defaultParams: { a: 50000, b: 25000, c: 1, time: 0 }
  },

  // 5. QUANTUM FOURIER TRANSFORM VISUALIZATION
  quantum_fourier_transform: {
    name: "Quantum Fourier Transform",
    category: "quantum-physics",
    equation: "QFT|j⟩ = (1/√N)∑ₖ e^(2πijk/N)|k⟩",
    description: "Visualization of quantum Fourier transform basis states",
    parametric: {
      x: (u: number, v: number, params: any) => {
        const n = Math.floor(params.a ?? 3); // Number of qubits
        const N = Math.pow(2, n);
        const k = Math.floor(u * N) % N;
        const j = Math.floor(v * N) % N;
        
        const angle = (2 * Math.PI * j * k) / N;
        return Math.cos(angle) / Math.sqrt(N);
      },
      y: (u: number, v: number, params: any) => {
        const n = Math.floor(params.a ?? 3);
        const N = Math.pow(2, n);
        const k = Math.floor(u * N) % N;
        const j = Math.floor(v * N) % N;
        
        const angle = (2 * Math.PI * j * k) / N;
        return Math.sin(angle) / Math.sqrt(N);
      },
      z: (u: number, v: number, params: any) => {
        const phase = params.b ?? 0;
        return Math.sin(u * (params.c ?? 6.28)) * Math.exp(-v * phase);
      }
    },
    defaultParams: { a: 3, b: 0.1, c: 6.28, d: 1, uSegments: 32, vSegments: 32 }
  },

  // 6. GROVER'S ALGORITHM VISUALIZATION
  grover_amplitude_amplification: {
    name: "Grover's Amplitude Amplification",
    category: "quantum-physics",
    equation: "G = (2|s⟩⟨s| - I)(2|ω⟩⟨ω| - I)",
    description: "Visualization of amplitude amplification in Grover's search",
    parametric: {
      x: (u: number, v: number, params: any) => {
        const N = Math.pow(2, Math.floor(params.a ?? 4)); // Search space size
        const M = Math.floor(params.b ?? 1); // Number of solutions
        const iterations = Math.floor(u * 20); // Current iteration
        
        const theta = Math.asin(Math.sqrt(M / N));
        const amplitude = Math.sin((2 * iterations + 1) * theta);
        
        return Math.cos(v) * amplitude;
      },
      y: (u: number, v: number, params: any) => {
        const N = Math.pow(2, Math.floor(params.a ?? 4));
        const M = Math.floor(params.b ?? 1);
        const iterations = Math.floor(u * 20);
        
        const theta = Math.asin(Math.sqrt(M / N));
        const amplitude = Math.sin((2 * iterations + 1) * theta);
        
        return Math.sin(v) * amplitude;
      },
      z: (u: number, v: number, params: any) => {
        const iterations = Math.floor(u * 20);
        const maxIterations = QuantumComputingFormulas.groverIterations(16, 1);
        
        return (params.c ?? 0.5) * Math.sin((iterations / maxIterations) * Math.PI);
      }
    },
    defaultParams: { a: 4, b: 1, c: 0.5, d: 1 }
  },

  // 7. QUANTUM ERROR CORRECTION VISUALIZATION
  surface_code_lattice: {
    name: "Surface Code Lattice",
    category: "quantum-physics",
    equation: "H = ∑ᵢ Aᵢ + ∑ⱼ Bⱼ",
    description: "Visualization of surface code error correction lattice",
    parametric: {
      x: (u: number, v: number, params: any) => {
        const distance = Math.floor(params.a ?? 3);
        const errorRate = params.b ?? 0.01;
        
        // Lattice points
        const i = Math.floor(u * distance);
        const j = Math.floor(v * distance);
        
        // Add error visualization
        const errorProb = QuantumComputingFormulas.calculateLogicalErrorRate(errorRate, distance);
        return i + errorProb * Math.sin(u * Math.PI * 4);
      },
      y: (u: number, v: number, params: any) => {
        const distance = Math.floor(params.a ?? 3);
        const errorRate = params.b ?? 0.01;
        
        const j = Math.floor(v * distance);
        const errorProb = QuantumComputingFormulas.calculateLogicalErrorRate(errorRate, distance);
        
        return j + errorProb * Math.cos(v * Math.PI * 4);
      },
      z: (u: number, v: number, params: any) => {
        const stabilizer = Math.sin(u * (params.c ?? 6.28)) * Math.sin(v * (params.c ?? 6.28));
        return stabilizer * (params.d ?? 0.3);
      }
    },
    defaultParams: { a: 3, b: 0.01, c: 6.28, d: 0.3 }
  },

  // 8. QUANTUM SENSING VISUALIZATION  
  ramsey_interferometry: {
    name: "Ramsey Interferometry",
    category: "quantum-physics",
    equation: "P(|1⟩) = ½(1 + cos(ωτ + φ))",
    description: "Visualization of Ramsey interference fringes",
    parametric: {
      x: (u: number, v: number, params: any) => {
        const frequency = params.a ?? 1;
        const phase = params.b ?? 0;
        const tau = u * 10; // Evolution time
        
        const fringe = QuantumComputingFormulas.ramseyFringe(frequency * tau + phase);
        return Math.cos(v) * (1 + fringe);
      },
      y: (u: number, v: number, params: any) => {
        const frequency = params.a ?? 1;
        const phase = params.b ?? 0;
        const tau = u * 10;
        
        const fringe = QuantumComputingFormulas.ramseyFringe(frequency * tau + phase);
        return Math.sin(v) * (1 + fringe);
      },
      z: (u: number, v: number, params: any) => {
        const sensitivity = params.c ?? 1;
        return Math.sin(u * Math.PI) * sensitivity;
      }
    },
    defaultParams: { a: 1, b: 0, c: 1, d: 1 }
  },

  // 9. TOPOLOGICAL QUANTUM COMPUTING
  fibonacci_anyon_braiding: {
    name: "Fibonacci Anyon Braiding",
    category: "quantum-physics",
    equation: "τ × τ = 1 + τ, φ = (1+√5)/2",
    description: "Visualization of topological qubit braiding operations",
    parametric: {
      x: (u: number, v: number, params: any) => {
        const n = params.a ?? 1;
        const phi = QUANTUM_CONSTANTS.GOLDEN_RATIO;
        const braidingStrength = QuantumComputingFormulas.fibonacciAnyon(n);
        
        return Math.cos(u) * (1 + braidingStrength * Math.sin(v * phi));
      },
      y: (u: number, v: number, params: any) => {
        const n = params.a ?? 1;
        const phi = QUANTUM_CONSTANTS.GOLDEN_RATIO;
        const braidingStrength = QuantumComputingFormulas.fibonacciAnyon(n);
        
        return Math.sin(u) * (1 + braidingStrength * Math.cos(v * phi));
      },
      z: (u: number, v: number, params: any) => {
        const braidingPhase = QuantumComputingFormulas.braidingPhase("e", "τ");
        return Math.sin(v + braidingPhase) * (params.b ?? 0.618);
      }
    },
    defaultParams: { a: 1, b: 0.618, c: 1, d: 1 }
  },

  // 10. QUANTUM MACHINE LEARNING VISUALIZATION
  quantum_neural_network: {
    name: "Quantum Neural Network",
    category: "quantum-physics", 
    equation: "f(x;θ) = ⟨0|U†(θ)MU(θ)|0⟩",
    description: "Visualization of parameterized quantum circuit for ML",
    parametric: {
      x: (u: number, v: number, params: any) => {
        const layers = Math.floor(params.a ?? 3);
        const rotation = params.b ?? Math.PI / 4;
        
        // Parameterized quantum circuit visualization
        let x = Math.cos(u);
        for (let l = 0; l < layers; l++) {
          x = x * Math.cos(rotation + l * v) + Math.sin(rotation + l * v);
        }
        return x;
      },
      y: (u: number, v: number, params: any) => {
        const layers = Math.floor(params.a ?? 3);
        const rotation = params.b ?? Math.PI / 4;
        
        let y = Math.sin(u);
        for (let l = 0; l < layers; l++) {
          y = y * Math.sin(rotation + l * v) + Math.cos(rotation + l * v);
        }
        return y;
      },
      z: (u: number, v: number, params: any) => {
        const gradient = QuantumComputingFormulas.parameterShiftRule(
          (theta: number) => Math.sin(theta), 
          u, 
          params.c ?? Math.PI / 4
        );
        return gradient;
      }
    },
    defaultParams: { a: 3, b: Math.PI / 4, c: Math.PI / 4, d: 1 }
  }
};

export default QUANTUM_VISUALIZATION_SHAPES;

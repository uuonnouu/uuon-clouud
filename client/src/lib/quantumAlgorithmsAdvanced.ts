
import * as THREE from 'three';

interface QuantumState {
  amplitude: number;
  phase: number;
}

interface QuantumCircuit {
  qubits: number;
  gates: QuantumGate[];
  measurements?: number[];
}

interface QuantumGate {
  type: 'H' | 'X' | 'Y' | 'Z' | 'CNOT' | 'CZ' | 'RZ' | 'Phase' | 'Toffoli' | 'Swap';
  target: number | number[];
  control?: number | number[];
  angle?: number;
  name?: string;
}

export class ShorsAlgorithmVisualizer {
  private readonly N: number;
  private readonly a: number;
  private readonly numQubits: number;
  
  constructor(N: number = 15, a: number = 2) {
    this.N = N;
    this.a = a;
    this.numQubits = Math.ceil(Math.log2(N)) + 1;
  }

  /**
   * Create modular multiplication gate M_a mod N
   */
  createModularMultiplier(a: number, N: number): QuantumCircuit {
    const circuit: QuantumCircuit = {
      qubits: this.numQubits,
      gates: []
    };

    // For N=15, a=2: implement swap-based permutation
    if (N === 15 && a === 2) {
      circuit.gates = [
        { type: 'Swap', target: [2, 3] },
        { type: 'Swap', target: [1, 2] },
        { type: 'Swap', target: [0, 1] }
      ];
    } else if (N === 15 && a === 4) {
      circuit.gates = [
        { type: 'Swap', target: [1, 3] },
        { type: 'Swap', target: [0, 2] }
      ];
    }

    return circuit;
  }

  /**
   * Create controlled modular exponentiation M_a^k mod N
   */
  createControlledModExp(k: number): QuantumCircuit {
    const b = Math.pow(this.a, Math.pow(2, k)) % this.N;
    const baseCircuit = this.createModularMultiplier(b, this.N);
    
    // Add control qubit to all gates
    const controlledGates = baseCircuit.gates.map(gate => ({
      ...gate,
      control: 0 // Control qubit index
    }));

    return {
      qubits: baseCircuit.qubits + 1,
      gates: controlledGates
    };
  }

  /**
   * Quantum Fourier Transform implementation
   */
  createQFT(numQubits: number, inverse: boolean = false): QuantumCircuit {
    const gates: QuantumGate[] = [];

    for (let i = 0; i < numQubits; i++) {
      gates.push({ type: 'H', target: i });
      
      for (let j = i + 1; j < numQubits; j++) {
        const angle = Math.PI / Math.pow(2, j - i);
        gates.push({
          type: 'RZ',
          target: j,
          control: i,
          angle: inverse ? -angle : angle
        });
      }
    }

    // Swap gates to reverse qubit order
    for (let i = 0; i < Math.floor(numQubits / 2); i++) {
      gates.push({
        type: 'Swap',
        target: [i, numQubits - 1 - i]
      });
    }

    return { qubits: numQubits, gates };
  }

  /**
   * Complete Shor's algorithm circuit
   */
  createShorsCircuit(): QuantumCircuit {
    const controlQubits = 2 * this.numQubits;
    const targetQubits = this.numQubits;
    const totalQubits = controlQubits + targetQubits;
    
    const gates: QuantumGate[] = [];

    // Initialize target register to |1⟩
    gates.push({ type: 'X', target: controlQubits });

    // Apply Hadamard to control qubits
    for (let i = 0; i < controlQubits; i++) {
      gates.push({ type: 'H', target: i });
    }

    // Apply controlled modular exponentiation
    for (let i = 0; i < controlQubits; i++) {
      const modExpCircuit = this.createControlledModExp(i);
      gates.push(...modExpCircuit.gates.map(gate => ({
        ...gate,
        target: Array.isArray(gate.target) 
          ? gate.target.map(t => t + controlQubits)
          : gate.target + controlQubits,
        control: i
      })));
    }

    // Apply inverse QFT to control register
    const iqftCircuit = this.createQFT(controlQubits, true);
    gates.push(...iqftCircuit.gates);

    return {
      qubits: totalQubits,
      gates,
      measurements: Array.from({ length: controlQubits }, (_, i) => i)
    };
  }

  /**
   * Visualize the algorithm as 3D quantum gates
   */
  createVisualization(scene: THREE.Scene): THREE.Group {
    const group = new THREE.Group();
    const circuit = this.createShorsCircuit();
    
    // Create qubit lines
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-5, 0, 0),
      new THREE.Vector3(5, 0, 0)
    ]);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });

    for (let i = 0; i < circuit.qubits; i++) {
      const line = new THREE.Line(lineGeometry, lineMaterial);
      line.position.y = i * 0.5;
      group.add(line);
    }

    // Create gate visualizations
    circuit.gates.forEach((gate, index) => {
      const gateGroup = this.createGateVisualization(gate, index * 0.3);
      group.add(gateGroup);
    });

    scene.add(group);
    return group;
  }

  private createGateVisualization(gate: QuantumGate, xOffset: number): THREE.Group {
    const gateGroup = new THREE.Group();
    
    const boxGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    let material: THREE.Material;
    
    switch (gate.type) {
      case 'H':
        material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        break;
      case 'X':
        material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        break;
      case 'CNOT':
        material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        break;
      case 'RZ':
        material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        break;
      default:
        material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    }
    
    const mesh = new THREE.Mesh(boxGeometry, material);
    const target = Array.isArray(gate.target) ? gate.target[0] : gate.target;
    mesh.position.set(xOffset, target * 0.5, 0);
    gateGroup.add(mesh);
    
    // Add control lines for controlled gates
    if (gate.control !== undefined) {
      const controlTarget = Array.isArray(gate.control) ? gate.control[0] : gate.control;
      const lineGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, controlTarget * 0.5, 0),
        new THREE.Vector3(0, target * 0.5, 0)
      ]);
      const controlLine = new THREE.Line(lineGeom, new THREE.LineBasicMaterial({ color: 0xff00ff }));
      controlLine.position.x = xOffset;
      gateGroup.add(controlLine);
    }
    
    return gateGroup;
  }

  /**
   * Simulate classical post-processing for factorization
   */
  classicalPostProcessing(measurements: string[]): { factors: number[], phases: number[] } {
    const phases: number[] = [];
    const factors: number[] = [];
    
    measurements.forEach(bitstring => {
      const decimal = parseInt(bitstring, 2);
      const phase = decimal / Math.pow(2, bitstring.length);
      phases.push(phase);
      
      if (phase !== 0) {
        const fraction = this.continuedFraction(phase, this.N);
        const r = fraction.denominator;
        
        if (r % 2 === 0) {
          const x = Math.pow(this.a, r / 2) % this.N - 1;
          const factor = this.gcd(x, this.N);
          if (factor > 1 && factor < this.N) {
            factors.push(factor);
          }
        }
      }
    });
    
    return { factors, phases };
  }

  private continuedFraction(decimal: number, maxDenominator: number): { numerator: number, denominator: number } {
    let best = { numerator: 0, denominator: 1 };
    let bestError = Math.abs(decimal);
    
    for (let denom = 1; denom <= maxDenominator; denom++) {
      const num = Math.round(decimal * denom);
      const error = Math.abs(decimal - num / denom);
      if (error < bestError) {
        best = { numerator: num, denominator: denom };
        bestError = error;
      }
    }
    
    return best;
  }

  private gcd(a: number, b: number): number {
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }
}

export class GroversAlgorithmVisualizer {
  private readonly numQubits: number;
  private readonly markedStates: string[];
  
  constructor(numQubits: number, markedStates: string[]) {
    this.numQubits = numQubits;
    this.markedStates = markedStates;
  }

  /**
   * Create oracle for marking specific states
   */
  createOracle(): QuantumCircuit {
    const gates: QuantumGate[] = [];
    
    this.markedStates.forEach(state => {
      const reversedState = state.split('').reverse().join('');
      
      // Apply X gates for '0' positions
      const zeroIndices = [];
      for (let i = 0; i < reversedState.length; i++) {
        if (reversedState[i] === '0') {
          zeroIndices.push(i);
          gates.push({ type: 'X', target: i });
        }
      }
      
      // Multi-controlled Z gate
      if (this.numQubits === 1) {
        gates.push({ type: 'Z', target: 0 });
      } else {
        gates.push({
          type: 'CZ',
          target: this.numQubits - 1,
          control: Array.from({ length: this.numQubits - 1 }, (_, i) => i)
        });
      }
      
      // Undo X gates
      zeroIndices.forEach(index => {
        gates.push({ type: 'X', target: index });
      });
    });
    
    return { qubits: this.numQubits, gates };
  }

  /**
   * Create diffusion operator
   */
  createDiffuser(): QuantumCircuit {
    const gates: QuantumGate[] = [];
    
    // Apply H to all qubits
    for (let i = 0; i < this.numQubits; i++) {
      gates.push({ type: 'H', target: i });
    }
    
    // Apply X to all qubits
    for (let i = 0; i < this.numQubits; i++) {
      gates.push({ type: 'X', target: i });
    }
    
    // Multi-controlled Z on last qubit
    if (this.numQubits === 1) {
      gates.push({ type: 'Z', target: 0 });
    } else {
      gates.push({
        type: 'CZ',
        target: this.numQubits - 1,
        control: Array.from({ length: this.numQubits - 1 }, (_, i) => i)
      });
    }
    
    // Undo X gates
    for (let i = 0; i < this.numQubits; i++) {
      gates.push({ type: 'X', target: i });
    }
    
    // Undo H gates
    for (let i = 0; i < this.numQubits; i++) {
      gates.push({ type: 'H', target: i });
    }
    
    return { qubits: this.numQubits, gates };
  }

  /**
   * Calculate optimal number of iterations
   */
  getOptimalIterations(): number {
    const totalStates = Math.pow(2, this.numQubits);
    const markedStates = this.markedStates.length;
    
    return Math.floor(
      Math.PI / (4 * Math.asin(Math.sqrt(markedStates / totalStates)))
    );
  }

  /**
   * Create complete Grover's circuit
   */
  createGroversCircuit(): QuantumCircuit {
    const gates: QuantumGate[] = [];
    const oracle = this.createOracle();
    const diffuser = this.createDiffuser();
    const iterations = this.getOptimalIterations();
    
    // Initialize superposition
    for (let i = 0; i < this.numQubits; i++) {
      gates.push({ type: 'H', target: i });
    }
    
    // Apply Grover operator (oracle + diffuser) multiple times
    for (let iter = 0; iter < iterations; iter++) {
      gates.push(...oracle.gates);
      gates.push(...diffuser.gates);
    }
    
    return {
      qubits: this.numQubits,
      gates,
      measurements: Array.from({ length: this.numQubits }, (_, i) => i)
    };
  }

  /**
   * Create 3D visualization
   */
  createVisualization(scene: THREE.Scene): THREE.Group {
    const group = new THREE.Group();
    const circuit = this.createGroversCircuit();
    
    // Visualize search space as a grid
    const searchSpaceGroup = this.createSearchSpaceVisualization();
    group.add(searchSpaceGroup);
    
    // Visualize quantum circuit
    const circuitGroup = this.createCircuitVisualization(circuit);
    circuitGroup.position.y = 2;
    group.add(circuitGroup);
    
    scene.add(group);
    return group;
  }

  private createSearchSpaceVisualization(): THREE.Group {
    const group = new THREE.Group();
    const totalStates = Math.pow(2, this.numQubits);
    const gridSize = Math.ceil(Math.sqrt(totalStates));
    
    for (let i = 0; i < totalStates; i++) {
      const binary = i.toString(2).padStart(this.numQubits, '0');
      const isMarked = this.markedStates.includes(binary);
      
      const geometry = new THREE.SphereGeometry(0.1);
      const material = new THREE.MeshBasicMaterial({
        color: isMarked ? 0xff0000 : 0x0088ff
      });
      
      const sphere = new THREE.Mesh(geometry, material);
      const x = (i % gridSize) * 0.3;
      const z = Math.floor(i / gridSize) * 0.3;
      sphere.position.set(x, 0, z);
      
      group.add(sphere);
    }
    
    return group;
  }

  private createCircuitVisualization(circuit: QuantumCircuit): THREE.Group {
    const group = new THREE.Group();
    
    // Create qubit lines
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-3, 0, 0),
      new THREE.Vector3(3, 0, 0)
    ]);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });

    for (let i = 0; i < circuit.qubits; i++) {
      const line = new THREE.Line(lineGeometry, lineMaterial);
      line.position.y = i * 0.3;
      group.add(line);
    }
    
    return group;
  }
}

/**
 * Quantum Phase Estimation for general use
 */
export class QuantumPhaseEstimation {
  private readonly precision: number;
  private readonly unitary: number[][];
  
  constructor(precision: number, unitary: number[][]) {
    this.precision = precision;
    this.unitary = unitary;
  }

  createCircuit(): QuantumCircuit {
    const controlQubits = this.precision;
    const targetQubits = Math.log2(this.unitary.length);
    const gates: QuantumGate[] = [];
    
    // Initialize control qubits in superposition
    for (let i = 0; i < controlQubits; i++) {
      gates.push({ type: 'H', target: i });
    }
    
    // Controlled unitary operations
    for (let i = 0; i < controlQubits; i++) {
      const power = Math.pow(2, i);
      // This would require implementing controlled-U^{2^k} operations
      gates.push({
        type: 'RZ',
        target: controlQubits + Math.floor(targetQubits / 2),
        control: i,
        angle: 2 * Math.PI * power / Math.pow(2, controlQubits)
      });
    }
    
    // Inverse QFT on control qubits
    const iqft = this.createInverseQFT(controlQubits);
    gates.push(...iqft.gates);
    
    return {
      qubits: controlQubits + targetQubits,
      gates,
      measurements: Array.from({ length: controlQubits }, (_, i) => i)
    };
  }

  private createInverseQFT(numQubits: number): QuantumCircuit {
    const gates: QuantumGate[] = [];
    
    // Reverse swap pattern
    for (let i = 0; i < Math.floor(numQubits / 2); i++) {
      gates.push({
        type: 'Swap',
        target: [i, numQubits - 1 - i]
      });
    }
    
    // QFT gates in reverse order
    for (let i = numQubits - 1; i >= 0; i--) {
      for (let j = i + 1; j < numQubits; j++) {
        gates.push({
          type: 'RZ',
          target: j,
          control: i,
          angle: -Math.PI / Math.pow(2, j - i)
        });
      }
      gates.push({ type: 'H', target: i });
    }
    
    return { qubits: numQubits, gates };
  }
}

/**
 * Multi-Product Formula (MPF) for reduced Trotter error
 * Based on IBM Quantum tutorial for advanced quantum time evolution
 */
export class MultiProductFormulaVisualizer {
  private readonly trotterSteps: number[];
  private readonly order: number;
  private readonly symmetric: boolean;
  private readonly hamiltonian: any;
  
  constructor(trotterSteps: number[] = [1, 2, 4], order: number = 2, symmetric: boolean = false) {
    this.trotterSteps = trotterSteps;
    this.order = order;
    this.symmetric = symmetric;
  }

  /**
   * Setup Linear System of Equations (LSE) for MPF coefficients
   */
  setupStaticLSE(): { A: number[][], b: number[], coefficients: number[] } {
    const numSteps = this.trotterSteps.length;
    const A: number[][] = [];
    const b: number[] = [];
    
    // First row: sum of coefficients = 1
    A.push(Array(numSteps).fill(1));
    b.push(1);
    
    // Additional constraints for error cancellation
    const s = this.symmetric ? 2 : 1; // symmetry factor
    
    for (let i = 1; i < numSteps; i++) {
      const row: number[] = [];
      for (let j = 0; j < numSteps; j++) {
        const exponent = this.order + s * (i - 1);
        row.push(Math.pow(this.trotterSteps[j], -exponent));
      }
      A.push(row);
      b.push(0);
    }
    
    // Solve the linear system using Gaussian elimination
    const coefficients = this.solveLinearSystem(A, b);
    
    return { A, b, coefficients };
  }

  /**
   * Solve linear system Ax = b using Gaussian elimination
   */
  private solveLinearSystem(A: number[][], b: number[]): number[] {
    const n = A.length;
    const augmented = A.map((row, i) => [...row, b[i]]);
    
    // Forward elimination
    for (let i = 0; i < n; i++) {
      // Partial pivoting
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
          maxRow = k;
        }
      }
      [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
      
      // Make all rows below this one 0 in current column
      for (let k = i + 1; k < n; k++) {
        const factor = augmented[k][i] / augmented[i][i];
        for (let j = i; j < n + 1; j++) {
          augmented[k][j] -= factor * augmented[i][j];
        }
      }
    }
    
    // Back substitution
    const solution = new Array(n);
    for (let i = n - 1; i >= 0; i--) {
      solution[i] = augmented[i][n];
      for (let j = i + 1; j < n; j++) {
        solution[i] -= augmented[i][j] * solution[j];
      }
      solution[i] /= augmented[i][i];
    }
    
    return solution;
  }

  /**
   * Create MPF time evolution circuits
   */
  createMPFCircuits(totalTime: number, numQubits: number): QuantumCircuit[] {
    const circuits: QuantumCircuit[] = [];
    
    for (const steps of this.trotterSteps) {
      const circuit: QuantumCircuit = {
        qubits: numQubits,
        gates: []
      };
      
      // Create Suzuki-Trotter decomposition
      const timeStep = totalTime / steps;
      
      for (let step = 0; step < steps; step++) {
        // Add Trotter step gates (simplified Heisenberg model)
        for (let i = 0; i < numQubits - 1; i++) {
          // XX + YY interaction
          circuit.gates.push({
            type: 'RZ',
            target: i,
            angle: timeStep * 2 // Simplified coupling strength
          });
          circuit.gates.push({
            type: 'CNOT',
            target: i + 1,
            control: i
          });
          circuit.gates.push({
            type: 'RZ', 
            target: i + 1,
            angle: timeStep * 2
          });
          circuit.gates.push({
            type: 'CNOT',
            target: i + 1,
            control: i
          });
          
          // ZZ interaction
          circuit.gates.push({
            type: 'CNOT',
            target: i + 1,
            control: i
          });
          circuit.gates.push({
            type: 'RZ',
            target: i + 1,
            angle: timeStep * 4 // Stronger Z coupling for XXZ model
          });
          circuit.gates.push({
            type: 'CNOT',
            target: i + 1,
            control: i
          });
        }
      }
      
      circuits.push(circuit);
    }
    
    return circuits;
  }

  /**
   * Calculate MPF expectation value
   */
  calculateMPFExpectation(
    individualResults: number[], 
    coefficients: number[]
  ): { value: number, error: number, l1Norm: number } {
    let mpfValue = 0;
    let mpfError = 0;
    
    for (let i = 0; i < individualResults.length; i++) {
      mpfValue += coefficients[i] * individualResults[i];
      mpfError += Math.pow(coefficients[i], 2) * Math.pow(0.01, 2); // Simplified error
    }
    
    const l1Norm = coefficients.reduce((sum, coeff) => sum + Math.abs(coeff), 0);
    
    return {
      value: mpfValue,
      error: Math.sqrt(mpfError),
      l1Norm
    };
  }

  /**
   * Estimate runtime on IBM hardware
   */
  estimateHardwareRuntime(numQubits: number, shots: number = 1000): string {
    const maxTrotterSteps = Math.max(...this.trotterSteps);
    const gateCount = maxTrotterSteps * (numQubits - 1) * 6; // Rough gate count
    
    // Based on IBM Quantum processors
    if (gateCount < 100) {
      return "under 1 minute on Eagle r3 processor";
    } else if (gateCount < 500) {
      return "2-5 minutes on Heron r2 processor";  
    } else {
      return "5-30 minutes on Eagle r3 processor";
    }
  }

  /**
   * Create 3D visualization of MPF performance
   */
  createVisualization(scene: THREE.Scene): THREE.Group {
    const group = new THREE.Group();
    
    // Visualize different Trotter steps as spheres
    this.trotterSteps.forEach((steps, index) => {
      const geometry = new THREE.SphereGeometry(0.1 + steps * 0.02);
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(index / this.trotterSteps.length, 0.7, 0.5)
      });
      
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.x = (index - this.trotterSteps.length / 2) * 0.5;
      sphere.position.y = Math.sin(steps * 0.5) * 0.3;
      
      group.add(sphere);
      
      // Add connecting lines to show MPF combination
      if (index > 0) {
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3((index - 1 - this.trotterSteps.length / 2) * 0.5, 
                           Math.sin(this.trotterSteps[index - 1] * 0.5) * 0.3, 0),
          new THREE.Vector3((index - this.trotterSteps.length / 2) * 0.5,
                           Math.sin(steps * 0.5) * 0.3, 0)
        ]);
        
        const line = new THREE.Line(
          lineGeometry, 
          new THREE.LineBasicMaterial({ color: 0xff00ff })
        );
        group.add(line);
      }
    });
    
    scene.add(group);
    return group;
  }
}

// Export utility functions
export const quantumAlgorithmsUtils = {
  /**
   * Simulate quantum measurement probabilities
   */
  simulateMeasurement(circuit: QuantumCircuit, shots: number = 1000): { [key: string]: number } {
    const results: { [key: string]: number } = {};
    
    // Simplified simulation - in reality would need full quantum state evolution
    const numStates = Math.pow(2, circuit.qubits);
    for (let i = 0; i < shots; i++) {
      const randomState = Math.floor(Math.random() * numStates);
      const bitstring = randomState.toString(2).padStart(circuit.qubits, '0');
      results[bitstring] = (results[bitstring] || 0) + 1;
    }
    
    return results;
  },

  /**
   * Calculate quantum circuit depth
   */
  calculateDepth(circuit: QuantumCircuit): number {
    // Simplified depth calculation
    return circuit.gates.length;
  },

  /**
   * Estimate quantum resource requirements
   */
  estimateResources(circuit: QuantumCircuit): {
    qubits: number;
    gates: number;
    depth: number;
    twoQubitGates: number;
  } {
    const twoQubitGates = circuit.gates.filter(gate => 
      ['CNOT', 'CZ', 'Swap'].includes(gate.type) || gate.control !== undefined
    ).length;
    
    return {
      qubits: circuit.qubits,
      gates: circuit.gates.length,
      depth: this.calculateDepth(circuit),
      twoQubitGates
    };
  },

  /**
   * Simulate MPF time evolution with reduced Trotter error
   */
  simulateMPFTimeEvolution(
    hamiltonian: any,
    totalTime: number,
    trotterSteps: number[] = [1, 2, 4],
    order: number = 2
  ): {
    mpfResult: number;
    individualResults: number[];
    coefficients: number[];
    l1Norm: number;
    estimatedError: number;
  } {
    const mpf = new MultiProductFormulaVisualizer(trotterSteps, order);
    const lse = mpf.setupStaticLSE();
    
    // Simulate individual Trotter results
    const individualResults = trotterSteps.map(steps => {
      // Simplified time evolution simulation
      const trotterError = Math.pow(totalTime / steps, order + 1);
      const baseValue = Math.cos(totalTime * 0.5); // Simplified dynamics
      return baseValue + trotterError * (Math.random() - 0.5) * 0.1;
    });
    
    const mpfResult = mpf.calculateMPFExpectation(individualResults, lse.coefficients);
    
    return {
      mpfResult: mpfResult.value,
      individualResults,
      coefficients: lse.coefficients,
      l1Norm: mpfResult.l1Norm,
      estimatedError: mpfResult.error
    };
  }
};

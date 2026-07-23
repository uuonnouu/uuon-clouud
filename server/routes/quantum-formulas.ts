
import { Router } from 'express';
import { QuantumComputingFormulas, QUANTUM_CONSTANTS } from '../../client/src/lib/quantumComputingFormulas';

const router = Router();

// Get quantum formulas and constants
router.get('/formulas', (req, res) => {
  try {
    res.json({
      success: true,
      formulas: {
        qubit_fundamentals: {
          basic_state: "|ψ⟩ = α|0⟩ + β|1⟩",
          normalization: "|α|² + |β|² = 1",
          bloch_sphere: "x = sin(θ)cos(φ), y = sin(θ)sin(φ), z = cos(θ)"
        },
        bell_states: {
          phi_plus: "|Φ⁺⟩ = (1/√2)(|00⟩ + |11⟩)",
          phi_minus: "|Φ⁻⟩ = (1/√2)(|00⟩ - |11⟩)",
          psi_plus: "|Ψ⁺⟩ = (1/√2)(|01⟩ + |10⟩)",
          psi_minus: "|Ψ⁻⟩ = (1/√2)(|01⟩ - |10⟩)"
        },
        quantum_gates: {
          pauli_x: "X = [[0,1],[1,0]]",
          pauli_y: "Y = [[0,-i],[i,0]]", 
          pauli_z: "Z = [[1,0],[0,-1]]",
          hadamard: "H = (1/√2)[[1,1],[1,-1]]"
        },
        entanglement_measures: {
          concurrence: "C(|ψ⟩) = |⟨ψ|σᵧ ⊗ σᵧ|ψ*⟩|",
          von_neumann_entropy: "S(ρₐ) = -Tr(ρₐ log₂ ρₐ)"
        },
        quantum_algorithms: {
          grover_iterations: "k ≈ (π/4)√(N/M)",
          qft_definition: "QFT|j⟩ = (1/√N)∑ₖ e^(2πijk/N)|k⟩"
        },
        error_correction: {
          surface_code_threshold: "pₜₕ ≈ 1%",
          logical_error_rate: "p_L ≈ (p/p_th)^((d+1)/2)"
        },
        quantum_sensing: {
          heisenberg_limit: "Dφ ≥ 1/N",
          ramsey_fringe: "P = ½(1 + cos(ωτ + φ))"
        }
      },
      constants: QUANTUM_CONSTANTS,
      visualization_shapes: Object.keys(require('../../client/src/lib/quantumVisualizationShapes').QUANTUM_VISUALIZATION_SHAPES)
    });
  } catch (error) {
    console.error('Error fetching quantum formulas:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch quantum formulas' });
  }
});

// Calculate Bloch sphere coordinates
router.post('/bloch-sphere', (req, res) => {
  try {
    const { alpha, beta } = req.body;
    
    if (!alpha || !beta) {
      return res.status(400).json({ success: false, error: 'Alpha and beta required' });
    }
    
    const qubitState = QuantumComputingFormulas.createQubitState(alpha, beta);
    const blochCoords = QuantumComputingFormulas.qubitToBlochSphere(qubitState);
    
    res.json({
      success: true,
      qubit_state: qubitState,
      bloch_coordinates: blochCoords,
      probabilities: {
        zero: alpha.real ** 2 + alpha.imag ** 2,
        one: beta.real ** 2 + beta.imag ** 2
      }
    });
  } catch (error) {
    console.error('Error calculating Bloch sphere:', error);
    res.status(500).json({ success: false, error: 'Bloch sphere calculation failed' });
  }
});

// Get Bell state information
router.get('/bell-states', (req, res) => {
  try {
    const bellStates = QuantumComputingFormulas.getBellStates();
    
    res.json({
      success: true,
      bell_states: bellStates.map(state => ({
        ...state,
        entanglement: QuantumComputingFormulas.calculateConcurrence(
          state.coefficients.map(c => c.real)
        ),
        schmidt_coefficients: QuantumComputingFormulas.calculateSchmidtCoefficients(
          state.coefficients.map(c => c.real)
        )
      }))
    });
  } catch (error) {
    console.error('Error fetching Bell states:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch Bell states' });
  }
});

// Calculate Grover algorithm parameters
router.post('/grover-algorithm', (req, res) => {
  try {
    const { search_space_size, num_solutions } = req.body;
    
    if (!search_space_size || !num_solutions) {
      return res.status(400).json({ 
        success: false, 
        error: 'Search space size and number of solutions required' 
      });
    }
    
    const iterations = QuantumComputingFormulas.groverIterations(search_space_size, num_solutions);
    const successProb = QuantumComputingFormulas.groverSuccessProbability(
      iterations, search_space_size, num_solutions
    );
    
    res.json({
      success: true,
      optimal_iterations: iterations,
      success_probability: successProb,
      speedup_factor: Math.sqrt(search_space_size) / search_space_size,
      classical_time: search_space_size,
      quantum_time: iterations
    });
  } catch (error) {
    console.error('Error calculating Grover parameters:', error);
    res.status(500).json({ success: false, error: 'Grover calculation failed' });
  }
});

// Quantum error correction analysis
router.post('/error-correction', (req, res) => {
  try {
    const { physical_error_rate, code_distance } = req.body;
    
    if (physical_error_rate === undefined || !code_distance) {
      return res.status(400).json({
        success: false,
        error: 'Physical error rate and code distance required'
      });
    }
    
    const logicalErrorRate = QuantumComputingFormulas.calculateLogicalErrorRate(
      physical_error_rate, code_distance
    );
    
    const improvement = physical_error_rate / logicalErrorRate;
    
    res.json({
      success: true,
      physical_error_rate,
      logical_error_rate: logicalErrorRate,
      improvement_factor: improvement,
      code_distance,
      threshold: QUANTUM_CONSTANTS.SURFACE_CODE_THRESHOLD,
      is_below_threshold: physical_error_rate < QUANTUM_CONSTANTS.SURFACE_CODE_THRESHOLD
    });
  } catch (error) {
    console.error('Error calculating error correction:', error);
    res.status(500).json({ success: false, error: 'Error correction calculation failed' });
  }
});

// Quantum sensing precision calculation
router.post('/quantum-sensing', (req, res) => {
  try {
    const { num_particles, sensing_type } = req.body;
    
    if (!num_particles) {
      return res.status(400).json({ 
        success: false, 
        error: 'Number of particles required' 
      });
    }
    
    const classicalLimit = 1 / Math.sqrt(num_particles); // Shot noise limit
    const heisenbergLimit = QuantumComputingFormulas.heisenbergLimit(num_particles);
    const quantumAdvantage = classicalLimit / heisenbergLimit;
    
    res.json({
      success: true,
      classical_precision: classicalLimit,
      quantum_precision: heisenbergLimit,
      quantum_advantage: quantumAdvantage,
      improvement: `${quantumAdvantage.toFixed(1)}x better`,
      sensing_type: sensing_type || 'frequency_estimation'
    });
  } catch (error) {
    console.error('Error calculating quantum sensing:', error);
    res.status(500).json({ success: false, error: 'Quantum sensing calculation failed' });
  }
});

// Decoherence evolution simulation
router.post('/decoherence', (req, res) => {
  try {
    const { initial_state, time, T1, T2 } = req.body;
    
    if (!initial_state || time === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Initial state and time required'
      });
    }
    
    const t1 = T1 || QUANTUM_CONSTANTS.TYPICAL_T1;
    const t2 = T2 || QUANTUM_CONSTANTS.TYPICAL_T2;
    
    let evolved_state = initial_state;
    evolved_state = QuantumComputingFormulas.applyT1Decay(evolved_state, time, t1);
    evolved_state = QuantumComputingFormulas.applyT2Dephasing(evolved_state, time, t2);
    
    const coherence = Math.exp(-time / t2);
    const population = Math.exp(-time / t1);
    
    res.json({
      success: true,
      initial_state,
      evolved_state,
      coherence_factor: coherence,
      population_factor: population,
      T1: t1,
      T2: t2,
      time
    });
  } catch (error) {
    console.error('Error simulating decoherence:', error);
    res.status(500).json({ success: false, error: 'Decoherence simulation failed' });
  }
});

// Topological quantum computing parameters
router.post('/topological', (req, res) => {
  try {
    const { anyon_type, braiding_sequence } = req.body;
    
    const fibonacciSequence = [];
    for (let n = 0; n <= 10; n++) {
      fibonacciSequence.push({
        n,
        value: QuantumComputingFormulas.fibonacciAnyon(n)
      });
    }
    
    const braidingPhases = {
      "ee": QuantumComputingFormulas.braidingPhase("e", "e"),
      "eτ": QuantumComputingFormulas.braidingPhase("e", "τ"),
      "ττ": QuantumComputingFormulas.braidingPhase("τ", "τ")
    };
    
    res.json({
      success: true,
      fibonacci_sequence: fibonacciSequence,
      braiding_phases: braidingPhases,
      golden_ratio: QUANTUM_CONSTANTS.GOLDEN_RATIO,
      anyon_type: anyon_type || "fibonacci"
    });
  } catch (error) {
    console.error('Error calculating topological parameters:', error);
    res.status(500).json({ success: false, error: 'Topological calculation failed' });
  }
});

export { router as quantumFormulasRoutes };
export default router;


/**
 * PHYSICS DATA SCHEMA
 * Enhanced database structure for physics equation metadata
 */

export const physicsDataSchema = {
  physicsEquations: {
    id: 'integer PRIMARY KEY',
    equation_name: 'text NOT NULL',
    equation_latex: 'text',
    physical_constants: 'json', // Store G, c, h, etc.
    dimensional_analysis: 'json', // [M, L, T] dimensions
    physics_domain: 'text', // 'relativity', 'quantum', 'thermodynamics'
    accuracy_level: 'real', // Precision of approximation
    computational_complexity: 'integer',
    created_at: 'timestamp DEFAULT CURRENT_TIMESTAMP'
  },
  
  quantumStates: {
    id: 'integer PRIMARY KEY',
    shape_id: 'text REFERENCES shapes(id)',
    quantum_numbers: 'json', // n, l, m, s quantum numbers
    energy_eigenvalue: 'real',
    wavefunction_parameters: 'json',
    probability_density: 'blob', // 3D probability cloud data
    entanglement_pairs: 'json' // Connected quantum states
  },
  
  relativisticMetrics: {
    id: 'integer PRIMARY KEY',
    shape_id: 'text REFERENCES shapes(id)',
    metric_tensor: 'json', // 4x4 spacetime metric
    curvature_scalar: 'real',
    stress_energy_tensor: 'json',
    geodesic_equations: 'json'
  }
};

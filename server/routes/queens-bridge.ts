
import express from 'express';
import { queensBridgeService } from '../services/queensBridgeService';

const router = express.Router();

/**
 * POST /api/queens-bridge/submit
 * Submit classical parameters for quantum processing
 */
router.post('/submit', async (req, res) => {
  try {
    const {
      portal_value = 1.0,
      scale_factor = 1.0,
      lattice_nodes = [0, 1, 2, 3],
      adjacency_matrix = [[0, 1, 0, 0], [1, 0, 1, 0], [0, 1, 0, 1], [0, 0, 1, 0]],
      ansatz_name = 'hardware_efficient',
      rotation_gates = ['rx', 'ry'],
      entanglement_pattern = 'linear',
      depth = 3,
      backend = 'ibmq_qasm_simulator',
      shots = 1024
    } = req.body;

    const portalParams = {
      portal_value,
      scale_factor,
      lattice_nodes,
      adjacency_matrix
    };

    const ansatzTemplate = {
      name: ansatz_name,
      rotation_gates,
      entanglement_pattern,
      depth
    };

    const job = await queensBridgeService.bridgeToQuantum(
      portalParams,
      ansatzTemplate,
      backend,
      shots
    );

    res.json({
      success: true,
      job_id: job.job_id,
      message: 'Queens Bridge job submitted to quantum backend',
      estimated_completion: '2-5 minutes'
    });

  } catch (error: any) {
    console.error('Queens Bridge submission error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/queens-bridge/status/:jobId
 * Get job status and extract classical features
 */
router.get('/status/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const job = await queensBridgeService.getJobStatus(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Try to extract classical features if quantum job is complete
    if (job.status === 'RUNNING') {
      try {
        const features = await queensBridgeService.extractClassicalFeatures(jobId);
        job.classical_features = features;
        job.status = 'COMPLETED';
      } catch (error) {
        // Still processing
      }
    }

    res.json({
      success: true,
      job: {
        job_id: job.job_id,
        status: job.status,
        portal_params: job.portal_params,
        ansatz: job.ansatz,
        backend: job.backend,
        shots: job.shots,
        classical_features: job.classical_features
      }
    });

  } catch (error: any) {
    console.error('Queens Bridge status error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/queens-bridge/krylov
 * Run Krylov quantum diagonalization
 */
router.post('/krylov', async (req, res) => {
  try {
    const {
      portal_value = 1.0,
      scale_factor = 1.0,
      lattice_nodes = [0, 1, 2, 3, 4, 5, 6, 7], // 8 qubits for SIAM
      adjacency_matrix = [
        [0, 1, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 0, 0, 0, 0, 0],
        [0, 1, 0, 1, 0, 0, 0, 0],
        [0, 0, 1, 0, 1, 0, 0, 0], // Impurity at center
        [0, 0, 0, 1, 0, 1, 0, 0],
        [0, 0, 0, 0, 1, 0, 1, 0],
        [0, 0, 0, 0, 0, 1, 0, 1],
        [0, 0, 0, 0, 0, 0, 1, 0]
      ],
      time_step = 0.2,
      krylov_dimension = 8,
      backend = 'ibmq_qasm_simulator'
    } = req.body;

    const portalParams = {
      portal_value,
      scale_factor,
      lattice_nodes,
      adjacency_matrix
    };

    console.log(`🚀 Starting Krylov Quantum Diagonalization for SIAM model`);
    console.log(`⚛️ Parameters: time_step=${time_step}, krylov_dim=${krylov_dimension}`);

    const results = await queensBridgeService.runKrylovDiagonalization(
      portalParams,
      time_step,
      krylov_dimension,
      backend
    );

    res.json({
      success: true,
      message: 'Krylov quantum diagonalization completed',
      results: {
        ground_state_energy: results.ground_state_energy,
        method: results.method,
        krylov_dimension: results.krylov_dimension,
        time_step: results.time_step,
        convergence_guaranteed: results.convergence_guaranteed,
        backend_used: backend
      }
    });

  } catch (error: any) {
    console.error('Krylov diagonalization error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/queens-bridge/optimize
 * Run hybrid optimization loop
 */
router.post('/optimize', async (req, res) => {
  try {
    const {
      portal_value = 1.0,
      scale_factor = 1.0,
      lattice_nodes = [0, 1, 2, 3],
      adjacency_matrix = [[0, 1, 0, 0], [1, 0, 1, 0], [0, 1, 0, 1], [0, 0, 1, 0]],
      ansatz_name = 'hardware_efficient',
      rotation_gates = ['rx', 'ry'],
      entanglement_pattern = 'linear',
      depth = 3,
      objective = 'maximize_entropy', // or 'minimize_energy'
      max_iterations = 5,
      learning_rate = 0.1
    } = req.body;

    const portalParams = {
      portal_value,
      scale_factor,
      lattice_nodes,
      adjacency_matrix
    };

    const ansatzTemplate = {
      name: ansatz_name,
      rotation_gates,
      entanglement_pattern,
      depth
    };

    // Define objective function
    const objectiveFunction = (features: any) => {
      switch (objective) {
        case 'maximize_entropy':
          return features.entropy;
        case 'minimize_energy':
          return -Math.abs(features.expectation_values.reduce((sum: number, val: number) => sum + val, 0));
        default:
          return features.entropy;
      }
    };

    console.log(`🚀 Starting Queens Bridge hybrid optimization: ${objective}`);

    const results = await queensBridgeService.runHybridOptimization(
      portalParams,
      ansatzTemplate,
      objectiveFunction,
      max_iterations,
      learning_rate
    );

    res.json({
      success: true,
      message: 'Queens Bridge optimization completed',
      results: {
        best_score: results.best_score,
        best_portal_value: results.best_portal.portal_value,
        best_scale_factor: results.best_portal.scale_factor,
        optimization_history: results.optimization_history,
        total_iterations: results.total_iterations
      }
    });

  } catch (error: any) {
    console.error('Queens Bridge optimization error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/queens-bridge/qaoa
 * Run QAOA optimization for Max-Cut and combinatorial problems
 */
router.post('/qaoa', async (req, res) => {
  try {
    const {
      graph_nodes = [0, 1, 2, 3, 4],
      graph_edges = [[0, 1], [0, 2], [0, 4], [1, 2], [2, 3], [3, 4]],
      qaoa_layers = 1,
      max_iterations = 30,
      backend = 'ibmq_qasm_simulator',
      shots = 10000,
      algorithm_type = 'max_cut'
    } = req.body;

    console.log(`🔬 Starting QAOA ${algorithm_type} optimization with ${qaoa_layers} layers`);

    const graphStructure = {
      nodes: graph_nodes,
      edges: graph_edges
    };

    const results = await queensBridgeService.runQAOAOptimization(
      graphStructure,
      qaoa_layers,
      max_iterations,
      backend,
      shots
    );

    res.json({
      success: true,
      message: 'QAOA optimization completed',
      algorithm: 'QAOA',
      problem_type: algorithm_type,
      results: {
        best_cost: results.best_cost,
        best_cut_value: results.best_cut_value,
        best_bitstring: results.best_bitstring,
        best_parameters: results.best_parameters,
        optimization_history: results.optimization_history,
        convergence_iterations: results.total_iterations,
        graph_info: results.graph_info,
        quantum_advantage_metrics: {
          problem_size: graph_nodes.length,
          search_space_size: Math.pow(2, graph_nodes.length),
          cut_ratio: results.best_cut_value / results.graph_info.max_possible_cut,
          quantum_layers: qaoa_layers
        }
      }
    });

  } catch (error: any) {
    console.error('QAOA optimization error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/queens-bridge/qaoa/templates
 * Get predefined QAOA problem templates
 */
router.get('/qaoa/templates', (req, res) => {
  const templates = [
    {
      name: 'Small Max-Cut',
      description: '5-node graph for testing QAOA implementation',
      graph_nodes: [0, 1, 2, 3, 4],
      graph_edges: [[0, 1], [0, 2], [0, 4], [1, 2], [2, 3], [3, 4]],
      recommended_layers: 1,
      expected_runtime: '2-5 minutes'
    },
    {
      name: 'Medium Max-Cut',
      description: '10-node graph for moderate complexity',
      graph_nodes: Array.from({length: 10}, (_, i) => i),
      graph_edges: [
        [0, 1], [0, 2], [0, 3], [1, 4], [1, 5],
        [2, 6], [2, 7], [3, 8], [3, 9], [4, 5],
        [6, 7], [8, 9], [4, 6], [5, 7], [1, 8]
      ],
      recommended_layers: 2,
      expected_runtime: '5-15 minutes'
    },
    {
      name: 'Utility Scale Max-Cut',
      description: '100-node graph matching IBM hardware topology',
      graph_nodes: Array.from({length: 100}, (_, i) => i),
      graph_edges: [], // Will be populated based on backend coupling map
      recommended_layers: 1,
      expected_runtime: '15-30 minutes',
      requires_hardware: true
    },
    {
      name: 'Complete Graph K5',
      description: 'Complete graph on 5 vertices - theoretical maximum',
      graph_nodes: [0, 1, 2, 3, 4],
      graph_edges: [
        [0, 1], [0, 2], [0, 3], [0, 4],
        [1, 2], [1, 3], [1, 4],
        [2, 3], [2, 4],
        [3, 4]
      ],
      recommended_layers: 2,
      expected_runtime: '3-8 minutes'
    }
  ];

  res.json({
    success: true,
    templates,
    usage_notes: {
      small_problems: 'Good for learning and testing QAOA concepts',
      medium_problems: 'Demonstrate quantum advantage potential',
      utility_scale: 'Real quantum utility demonstration',
      hardware_requirements: 'Larger problems benefit from actual quantum hardware'
    }
  });
});

/**
 * GET /api/queens-bridge/health
 * Check quantum backend health
 */
router.get('/health', async (req, res) => {
  try {
    const health = await queensBridgeService.getQuantumBackendHealth();
    res.json({ success: true, health });
  } catch (error: any) {
    console.error('Queens Bridge health check error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/queens-bridge/templates
 * Get available ansatz templates
 */
router.get('/templates', (req, res) => {
  const templates = [
    {
      name: 'hardware_efficient',
      description: 'Hardware-efficient ansatz with rotation + entanglement layers',
      rotation_gates: ['rx', 'ry'],
      entanglement_pattern: 'linear',
      recommended_depth: 3
    },
    {
      name: 'quantum_alternating',
      description: 'QAOA-style alternating cost and mixer layers',
      rotation_gates: ['rx', 'rz'],
      entanglement_pattern: 'circular',
      recommended_depth: 2
    },
    {
      name: 'symmetric',
      description: 'Symmetric ansatz preserving system symmetries',
      rotation_gates: ['ry'],
      entanglement_pattern: 'all_to_all',
      recommended_depth: 2
    }
  ];

  res.json({
    success: true,
    templates
  });
});

export default router;

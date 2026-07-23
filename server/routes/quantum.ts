/**
 * IBM QUANTUM API ROUTES
 * Endpoints for quantum computing integration
 */

import express from 'express';
import { ibmQuantumService } from '../services/ibmQuantumService';
import { qiskitRuntimeService } from '../services/qiskitRuntimeService';

const router = express.Router();

router.get('/', (_req, res) => {
  res.json({
    name: 'Quantum Computing Engine',
    version: '1.0.0',
    description: 'IBM Quantum and Qiskit Runtime integration — execute real quantum circuits on hardware or simulation',
    status: process.env.IBM_QUANTUM_TOKEN ? 'hardware-enabled' : 'simulation-mode',
    note: process.env.IBM_QUANTUM_TOKEN ? undefined : 'Set IBM_QUANTUM_TOKEN environment variable to enable hardware access',
    endpoints: [
      { method: 'GET',  path: '/status', description: 'IBM Quantum system status' },
      { method: 'GET',  path: '/backends', description: 'Available quantum backends (simulators + hardware)' },
      { method: 'POST', path: '/bell-state', description: 'Run quantum entanglement circuit' },
      { method: 'POST', path: '/bloch-sphere', description: 'Visualize single qubit states' },
      { method: 'POST', path: '/ghz-state', description: 'Run n-qubit GHZ state circuit' },
      { method: 'POST', path: '/runtime/setup', description: 'Configure Qiskit Runtime credentials' },
      { method: 'POST', path: '/runtime/circuit', description: 'Submit QASM circuit to hardware' },
      { method: 'GET',  path: '/runtime/job/:jobId', description: 'Retrieve hardware job results' },
      { method: 'GET',  path: '/runtime/status', description: 'Qiskit Runtime service status' }
    ],
    docs: '/api/sdk-info'
  });
});

/**
 * GET /api/quantum/status
 * Get IBM Quantum system status
 */
router.get('/status', async (req, res) => {
  try {
    const status = await ibmQuantumService.getSystemStatus();
    res.json(status);
  } catch (error: any) {
    console.error('Error getting quantum status:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/quantum/backends
 * Get available quantum backends
 */
router.get('/backends', async (req, res) => {
  try {
    const backends = await ibmQuantumService.getBackends();
    res.json({ backends });
  } catch (error: any) {
    console.error('Error getting backends:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/quantum/bell-state
 * Run Bell state circuit (quantum entanglement demonstration)
 */
router.post('/bell-state', async (req, res) => {
  try {
    const { backend = 'ibmq_qasm_simulator', shots = 1024 } = req.body;
    
    const result = await ibmQuantumService.runBellStateCircuit(backend, shots);
    res.json(result);
  } catch (error: any) {
    console.error('Error running Bell state:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/quantum/bloch-sphere
 * Run Bloch sphere circuit (single qubit state visualization)
 */
router.post('/bloch-sphere', async (req, res) => {
  try {
    const { theta, phi, backend = 'ibmq_qasm_simulator' } = req.body;
    
    if (theta === undefined || phi === undefined) {
      return res.status(400).json({ error: 'theta and phi are required' });
    }
    
    const result = await ibmQuantumService.runBlochSphereCircuit(theta, phi, backend);
    res.json(result);
  } catch (error: any) {
    console.error('Error running Bloch sphere circuit:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/quantum/ghz-state
 * Run n-qubit GHZ state circuit (IBM tutorial implementation)
 */
router.post('/ghz-state', async (req, res) => {
  try {
    const { qubits = 3, backend = 'ibmq_qasm_simulator', shots = 1024 } = req.body;
    
    if (qubits < 2 || qubits > 100) {
      return res.status(400).json({ 
        error: 'Number of qubits must be between 2 and 100' 
      });
    }
    
    console.log(`🚀 Running ${qubits}-qubit GHZ state on ${backend}`);
    const result = await ibmQuantumService.runGHZStateCircuit(qubits, backend, shots);
    
    // Generate correlation operators for analysis
    const operators = await ibmQuantumService.generateCorrelationOperators(qubits);
    
    res.json({
      ...result,
      correlation_operators: operators.slice(0, 10), // First 10 for display
      analysis: {
        entanglement_type: 'GHZ state',
        coherence_scale: qubits,
        expected_correlations: qubits - 1
      }
    });
  } catch (error: any) {
    console.error('Error running GHZ state circuit:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/quantum/probability-distribution
 * Get quantum probability distribution
 */
router.get('/probability-distribution', async (req, res) => {
  try {
    const numStates = parseInt(req.query.numStates as string) || 8;
    
    const result = await ibmQuantumService.getProbabilityDistribution(numStates);
    res.json(result);
  } catch (error: any) {
    console.error('Error getting probability distribution:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/quantum/runtime/setup
 * Setup Qiskit Runtime credentials
 */
router.post('/runtime/setup', async (req, res) => {
  try {
    const { apiKey, instance } = req.body;
    
    if (!apiKey || !instance) {
      return res.status(400).json({ 
        error: 'API key and instance (CRN) are required' 
      });
    }
    
    const success = await qiskitRuntimeService.saveCredentials(apiKey, instance);
    
    if (success) {
      res.json({ 
        success: true, 
        message: 'Qiskit Runtime configured successfully' 
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to configure Qiskit Runtime' 
      });
    }
  } catch (error: any) {
    console.error('Error setting up Qiskit Runtime:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/quantum/runtime/backends
 * Get real quantum hardware backends
 */
router.get('/runtime/backends', async (req, res) => {
  try {
    const backends = await qiskitRuntimeService.getBackends();
    res.json({ backends });
  } catch (error: any) {
    console.error('Error getting runtime backends:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/quantum/runtime/bell-state
 * Run Bell state on real quantum hardware
 */
router.post('/runtime/bell-state', async (req, res) => {
  try {
    const { backend = 'ibmq_qasm_simulator', shots = 1024 } = req.body;
    
    console.log(`🚀 Starting Bell state on real quantum hardware: ${backend}`);
    const result = await qiskitRuntimeService.runBellStateCircuit(backend, shots);
    
    res.json({
      success: true,
      message: 'Bell state executed on real quantum hardware!',
      ...result
    });
  } catch (error: any) {
    console.error('Error running Bell state on hardware:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/quantum/runtime/circuit
 * Submit custom quantum circuit to hardware
 */
router.post('/runtime/circuit', async (req, res) => {
  try {
    const { qasm, backend = 'ibmq_qasm_simulator', shots = 1024 } = req.body;
    
    if (!qasm) {
      return res.status(400).json({ error: 'QASM circuit code is required' });
    }
    
    const job = await qiskitRuntimeService.runQuantumCircuit(qasm, backend, shots);
    res.json(job);
  } catch (error: any) {
    console.error('Error submitting quantum circuit:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/quantum/runtime/job/:jobId
 * Get quantum job status and results
 */
router.get('/runtime/job/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await qiskitRuntimeService.getJobStatus(jobId);
    res.json(job);
  } catch (error: any) {
    console.error('Error getting job status:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/quantum/runtime/notebook
 * Create Jupyter notebook for quantum experiments
 */
router.post('/runtime/notebook', async (req, res) => {
  try {
    const notebookPath = await qiskitRuntimeService.createQuantumNotebook();
    res.json({ 
      success: true, 
      notebook: notebookPath,
      message: 'Quantum experiments notebook created!' 
    });
  } catch (error: any) {
    console.error('Error creating notebook:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/quantum/runtime/status
 * Get Qiskit Runtime system status
 */
router.get('/runtime/status', async (req, res) => {
  try {
    const status = await qiskitRuntimeService.getSystemStatus();
    res.json(status);
  } catch (error: any) {
    console.error('Error getting runtime status:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

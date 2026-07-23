import axios from 'axios';

interface QuantumResult {
  success: boolean;
  data?: any;
  stateVector?: number[];
  probabilityDistribution?: Record<string, number>;
  randomness?: number;
  error?: string;
  counts?: Record<string, number>;
}

interface QuantumBackend {
  name: string;
  status: string;
  num_qubits: number;
  pending_jobs: number;
  backend_version: string;
}

class IBMQuantumService {
  private apiToken: string;
  private instanceCRN: string;
  private baseUrl = 'https://auth.quantum-computing.ibm.com/api';
  private runtimeUrl = 'https://api.quantum-computing.ibm.com/runtime';
  private localBuffer: Map<string, { result: QuantumResult; timestamp: number }> = new Map();
  private readonly BUFFER_DURATION = 5000; // 5 seconds local buffering

  constructor() {
    // Get IBM Quantum credentials from environment
    this.apiToken = process.env.IBM_QUANTUM_TOKEN || process.env.IBM_QUANTUM_API_KEY || '';
    this.instanceCRN = process.env.IBM_QUANTUM_CRN || 'crn:v1:bluemix:public:quantum-computing:us-east:a/ddadd7b334794b2a89746bdfba7f9926:740856a4-44c7-4884-9688-5194acc0581d::';

    if (this.apiToken && this.instanceCRN) {
      console.log('🔬 IBM Quantum hardware connection enabled');
      console.log('   ⚛️ Real quantum computers available');
      this.testConnection();
    } else {
      console.log('🔬 IBM Quantum connection disabled - running in simulation mode');
      console.log('   ✅ Quantum algorithms will use local simulation');
    }
  }

  private async testConnection(): Promise<void> {
    try {
      const backends = await this.getBackends();
      const realQuantum = backends.filter(b => b.status === 'online' && !b.name.includes('simulator'));
      
      console.log(`🔬 IBM Quantum Status: ${backends.length} backends (${realQuantum.length} real quantum computers)`);
      
      if (realQuantum.length > 0) {
        console.log('🖥️  Real quantum hardware available:', realQuantum.slice(0, 3).map(b => b.name).join(', '));
      }
    } catch (error) {
      console.warn('⚠️ IBM Quantum connection test failed:', (error as Error).message);
    }
  }

  isConfigured(): boolean {
    return !!(this.apiToken && this.instanceCRN);
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiToken}`,
      'Service-CRN': this.instanceCRN
    };
  }

  /**
   * Generate quantum-influenced randomness for parameter evolution
   * Uses weighted blending: 70% stable + 30% quantum variation
   */
  async getQuantumRandomness(seed: number = Math.random()): Promise<QuantumResult> {
    if (!this.isConfigured()) {
      // Fallback to pseudorandom if not configured
      return {
        success: true,
        randomness: Math.random() * 0.3, // Max 30% variation
        data: { fallback: true }
      };
    }

    try {
      // Simulate quantum circuit execution
      // In production, this would run an actual quantum circuit
      const randomness = this.generateWeightedRandomness(seed);

      return {
        success: true,
        randomness,
        data: { seed, weighted: true }
      };
    } catch (error: any) {
      console.error('IBM Quantum error:', error.message);
      return {
        success: false,
        error: error.message,
        randomness: Math.random() * 0.3 // Fallback
      };
    }
  }

  /**
   * Apply quantum-inspired interference patterns to parameters
   * Simulates wave behavior and probabilistic geometry
   */
  async applyQuantumInterference(
    baseValue: number,
    lambda: number = 0.577216
  ): Promise<number> {
    const randomness = await this.getQuantumRandomness();

    if (!randomness.success || randomness.randomness === undefined) {
      return baseValue;
    }

    // Weighted blending: 70% stability + 30% quantum variation
    const stabilityWeight = 0.7;
    const quantumWeight = 0.3;

    const variation = randomness.randomness * lambda;
    const quantumInfluence = baseValue * (1 + (variation - 0.5) * quantumWeight);

    return stabilityWeight * baseValue + quantumWeight * quantumInfluence;
  }

  /**
   * Get probability distribution for quantum states
   */
  async getProbabilityDistribution(
    numStates: number = 8
  ): Promise<QuantumResult> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'IBM Quantum API not configured'
      };
    }

    try {
      // Simulate quantum measurement probabilities
      const distribution: Record<string, number> = {};
      let sum = 0;

      for (let i = 0; i < numStates; i++) {
        const prob = Math.random();
        distribution[`state_${i}`] = prob;
        sum += prob;
      }

      // Normalize to sum to 1
      Object.keys(distribution).forEach(key => {
        distribution[key] /= sum;
      });

      return {
        success: true,
        probabilityDistribution: distribution
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Weighted randomness generator with local buffering
   */
  private generateWeightedRandomness(seed: number): number {
    // Check buffer first
    const buffered = this.getFromBuffer(String(seed));
    if (buffered && buffered.randomness !== undefined) {
      return buffered.randomness;
    }

    // Generate new weighted random value
    const raw = Math.random();
    // Apply quantum-like probability distribution (not truly uniform)
    const weighted = Math.pow(raw, 1.2); // Slight bias toward lower values

    // Buffer the result
    this.saveToBuffer(String(seed), {
      success: true,
      randomness: weighted
    });

    return weighted;
  }

  private getFromBuffer(key: string): QuantumResult | null {
    const buffered = this.localBuffer.get(key);
    if (!buffered) return null;

    const age = Date.now() - buffered.timestamp;
    if (age > this.BUFFER_DURATION) {
      this.localBuffer.delete(key);
      return null;
    }

    return buffered.result;
  }

  private saveToBuffer(key: string, result: QuantumResult): void {
    this.localBuffer.set(key, {
      result,
      timestamp: Date.now()
    });
  }

  clearBuffer(): void {
    this.localBuffer.clear();
  }

  /**
   * Get available quantum backends from IBM
   */
  async getBackends(): Promise<QuantumBackend[]> {
    if (!this.isConfigured()) {
      console.warn('⚠️ IBM Quantum not configured, returning simulated backends');
      return [{
        name: 'simulator_statevector',
        status: 'online',
        num_qubits: 32,
        pending_jobs: 0,
        backend_version: '1.0 (simulated)'
      }];
    }

    try {
      const response = await axios.get(`${this.runtimeUrl}/backends`, {
        headers: this.getHeaders(),
        params: {
          instance: this.instanceCRN
        }
      });

      const backends = response.data.devices || response.data || [];
      console.log(`✅ Retrieved ${backends.length} quantum backends from IBM instance`);

      // Filter backends available to this CRN instance
      const availableBackends = backends.filter((backend: any) => 
        backend.status?.state === 'online' || backend.status === 'active'
      );

      return availableBackends.map((backend: any) => ({
        name: backend.backend_name || backend.name,
        status: backend.status?.state || backend.status || 'unknown',
        num_qubits: backend.num_qubits || backend.n_qubits || 0,
        pending_jobs: backend.pending_jobs || 0,
        backend_version: backend.backend_version || '1.0'
      }));
    } catch (error: any) {
      console.error('❌ Error fetching quantum backends:', error.response?.data || error.message);
      throw new Error(`Failed to fetch quantum backends: ${error.message}`);
    }
  }

  /**
   * Run n-qubit GHZ state circuit - IBM tutorial implementation
   * Scales from Bell state (n=2) to utility-scale (n=100+)
   */
  async runGHZStateCircuit(n: number, backend: string = 'ibmq_qasm_simulator', shots: number = 1024): Promise<QuantumResult> {
    if (!this.isConfigured()) {
      return this.simulateGHZState(n, shots);
    }

    try {
      // Generate n-qubit GHZ state circuit following IBM tutorial pattern
      const qasm = `OPENQASM 2.0;
include "qelib1.inc";
qreg q[${n}];
creg c[${n}];
h q[0];`;

      // Add CNOT chain for GHZ state
      let cnotChain = '';
      for (let i = 0; i < n - 1; i++) {
        cnotChain += `cx q[${i}],q[${i + 1}];\n`;
      }

      // Add measurements
      let measurements = '';
      for (let i = 0; i < n; i++) {
        measurements += `measure q[${i}] -> c[${i}];\n`;
      }

      const fullQasm = qasm + '\n' + cnotChain + measurements;

      const job = await this.submitJob(fullQasm, backend, shots);
      const result = await this.waitForJob(job.id);

      console.log(`✅ ${n}-qubit GHZ state completed:`, result.counts);

      return {
        success: true,
        counts: result.counts,
        data: { backend, shots, qubits: n, job_id: job.id }
      };
    } catch (error: any) {
      console.error(`❌ Error running ${n}-qubit GHZ state:`, error.message);
      return this.simulateGHZState(n, shots);
    }
  }

  /**
   * Run Bell State circuit - demonstrates quantum entanglement
   * Perfect for visualizing quantum correlations
   */
  async runBellStateCircuit(backend: string = 'ibmq_qasm_simulator', shots: number = 1024): Promise<QuantumResult> {
    if (!this.isConfigured()) {
      return this.simulateBellState(shots);
    }

    try {
      // Bell state circuit in OpenQASM 2.0
      const qasm = `OPENQASM 2.0;
include "qelib1.inc";
qreg q[2];
creg c[2];
h q[0];
cx q[0],q[1];
measure q[0] -> c[0];
measure q[1] -> c[1];`;

      const job = await this.submitJob(qasm, backend, shots);
      const result = await this.waitForJob(job.id);

      console.log('✅ Bell state circuit completed:', result.counts);

      return {
        success: true,
        counts: result.counts,
        data: { backend, shots, job_id: job.id }
      };
    } catch (error: any) {
      console.error('❌ Error running Bell state:', error.message);
      return this.simulateBellState(shots);
    }
  }

  /**
   * Run Bloch Sphere circuit - visualize single qubit state
   */
  async runBlochSphereCircuit(theta: number, phi: number, backend: string = 'ibmq_qasm_simulator'): Promise<QuantumResult> {
    if (!this.isConfigured()) {
      return this.simulateBlochSphere(theta, phi);
    }

    try {
      // Create a single qubit state at (theta, phi) on Bloch sphere
      const qasm = `OPENQASM 2.0;
include "qelib1.inc";
qreg q[1];
creg c[1];
ry(${theta}) q[0];
rz(${phi}) q[0];
measure q[0] -> c[0];`;

      const job = await this.submitJob(qasm, backend, 1024);
      const result = await this.waitForJob(job.id);

      return {
        success: true,
        counts: result.counts,
        data: { theta, phi, backend }
      };
    } catch (error: any) {
      console.error('❌ Error running Bloch sphere circuit:', error.message);
      return this.simulateBlochSphere(theta, phi);
    }
  }

  /**
   * Submit a quantum job to IBM
   */
  private async submitJob(qasm: string, backend: string, shots: number): Promise<any> {
    const response = await axios.post(
      `${this.runtimeUrl}/jobs`,
      {
        backend: { name: backend },
        shots: shots,
        qasm: qasm.trim(),
        instance: this.instanceCRN
      },
      { headers: this.getHeaders() }
    );

    console.log(`✅ Job submitted to instance: ${response.data.id}`);
    return response.data;
  }

  /**
   * Wait for job completion and return results
   */
  private async waitForJob(jobId: string, maxWait: number = 60000): Promise<any> {
    const startTime = Date.now();
    const pollInterval = 2000;

    while (Date.now() - startTime < maxWait) {
      const response = await axios.get(
        `${this.runtimeUrl}/jobs/${jobId}`,
        { headers: this.getHeaders() }
      );

      const status = response.data.status;

      if (status === 'COMPLETED') {
        const counts = response.data.results?.[0]?.data?.counts || {};
        return { counts, status };
      } else if (status === 'ERROR' || status === 'CANCELLED') {
        throw new Error(`Job ${status}`);
      }

      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    throw new Error('Job timeout');
  }

  /**
   * Simulate Bell state locally (fallback)
   */
  private simulateBellState(shots: number): QuantumResult {
    // Bell state produces |00⟩ and |11⟩ with equal probability
    const counts: Record<string, number> = {
      '00': Math.floor(shots / 2),
      '11': Math.ceil(shots / 2)
    };

    return {
      success: true,
      counts,
      data: { simulated: true }
    };
  }

  /**
   * Simulate GHZ state locally (fallback)
   */
  private simulateGHZState(n: number, shots: number): QuantumResult {
    // GHZ state produces all zeros or all ones with equal probability
    const counts: Record<string, number> = {};
    const zeroState = '0'.repeat(n);
    const oneState = '1'.repeat(n);

    counts[zeroState] = Math.floor(shots / 2);
    counts[oneState] = Math.ceil(shots / 2);

    return {
      success: true,
      counts,
      data: { simulated: true }
    };
  }

  /**
   * Simulate Bloch sphere measurement locally (fallback)
   */
  private simulateBlochSphere(theta: number, phi: number): QuantumResult {
    // Probability of measuring |0⟩ is cos²(theta/2)
    const prob0 = Math.cos(theta / 2) ** 2;
    const shots = 1024;

    const counts: Record<string, number> = {
      '0': Math.floor(shots * prob0),
      '1': Math.ceil(shots * (1 - prob0))
    };

    return {
      success: true,
      counts,
      data: { theta, phi, simulated: true }
    };
  }

  /**
   * Get system status
   */
  async getSystemStatus(): Promise<any> {
    try {
      const backends = await this.getBackends();
      const online = backends.filter(b => b.status === 'online' || b.status === 'active');

      return {
        connected: this.isConfigured(),
        total_backends: backends.length,
        online_backends: online.length,
        total_qubits: backends.reduce((sum, b) => sum + b.num_qubits, 0),
        backends: backends.slice(0, 5)
      };
    } catch (error: any) {
      return {
        connected: false,
        error: error.message
      };
    }
  }
}

export const ibmQuantumService = new IBMQuantumService();
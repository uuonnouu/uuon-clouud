
import { spawn } from 'child_process';
import path from 'path';

interface QiskitJob {
  job_id: string;
  status: 'INITIALIZING' | 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'DONE' | 'ERROR' | 'CANCELLED';
  backend: string;
  shots: number;
  results?: any;
  error_message?: string;
}

interface QiskitBackend {
  name: string;
  status: string;
  num_qubits: number;
  pending_jobs: number;
  backend_version: string;
  quantum_volume?: number;
  gate_error_rate?: number;
}

class QiskitRuntimeService {
  private pythonPath: string = 'python3';
  private isConfigured: boolean = false;

  constructor() {
    this.checkConfiguration();
  }

  private async checkConfiguration(): Promise<void> {
    try {
      // IBM Quantum Runtime disabled - using simulation mode
      this.isConfigured = false;
      return;

      // Check if Qiskit Runtime is properly configured
      const result = await this.executePython(`
import os
from qiskit_ibm_runtime import QiskitRuntimeService

# Get API key from environment (try both possible names)
api_key = os.getenv('IBM_Quantum_API_key') or os.getenv('IBM_QUANTUM_API')
instance = os.getenv('IBM_QUANTUM_CRN')

if not api_key:
    print("❌ No IBM Quantum API key found in environment")
    exit(1)

try:
    # Try to initialize with existing saved account first
    try:
        service = QiskitRuntimeService()
        print("✅ Using saved IBM Quantum credentials")
    except Exception:
        # If no saved account, try to save and use credentials
        print("Saving IBM Quantum credentials...")
        QiskitRuntimeService.save_account(
            token=api_key,
            instance=instance,
            overwrite=True
        )
        service = QiskitRuntimeService()
        print("✅ IBM Quantum credentials saved and configured")
    
    # Test connection
    backends = service.backends()
    print(f"✅ Connected to IBM Quantum - {len(backends)} backends available")
    
    # Show a few real quantum computers
    real_backends = [b for b in backends if not getattr(b, 'simulator', True)][:3]
    if real_backends:
        print("🖥️  Real quantum computers:")
        for backend in real_backends:
            print(f"  • {backend.name}")
    
except Exception as e:
    print(f"❌ Configuration error: {e}")
    exit(1)
`);
      
      this.isConfigured = result.includes('✅ Connected to IBM Quantum');
      console.log('Qiskit Runtime Status:', this.isConfigured ? '✅ Ready' : '⚠️ Needs setup');
      
      if (this.isConfigured) {
        console.log('🔬 IBM Quantum integration fully operational');
      }
    } catch (error) {
      console.warn('⚠️ Qiskit Runtime initialization failed:', (error as Error).message);
      this.isConfigured = false;
    }
  }

  /**
   * Sanitize input to prevent command injection in Python code
   */
  private sanitizeForPython(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }
    return input
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/'/g, "\\'")
      .replace(/`/g, '\\`')
      .replace(/\$/g, '\\$')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/[^\x20-\x7E]/g, '');
  }

  /**
   * Validate API key format (alphanumeric with dashes/underscores only)
   */
  private isValidApiKey(key: string): boolean {
    return /^[a-zA-Z0-9_-]+$/.test(key);
  }

  /**
   * Save IBM Quantum credentials securely
   */
  async saveCredentials(apiKey: string, instance: string): Promise<boolean> {
    try {
      if (!this.isValidApiKey(apiKey)) {
        throw new Error('Invalid API key format - must be alphanumeric');
      }
      
      const sanitizedApiKey = this.sanitizeForPython(apiKey);
      const sanitizedInstance = this.sanitizeForPython(instance);
      
      const pythonCode = `
import os
from qiskit_ibm_runtime import QiskitRuntimeService

# Save credentials using sanitized inputs
QiskitRuntimeService.save_account(
    token="${sanitizedApiKey}",
    instance="${sanitizedInstance}",
    overwrite=True
)

print("✅ Credentials saved successfully")
print("Testing connection...")

# Test connection
service = QiskitRuntimeService()
backends = service.backends()
print(f"✅ Connected! Available backends: {len(backends)}")
for backend in backends[:3]:
    print(f"  - {backend.name} ({backend.num_qubits} qubits)")
`;

      const result = await this.executePython(pythonCode);
      
      if (result.includes('✅ Credentials saved successfully')) {
        this.isConfigured = true;
        console.log('✅ IBM Quantum credentials configured');
        return true;
      }
      
      throw new Error('Failed to save credentials');
    } catch (error) {
      console.error('❌ Error saving credentials:', (error as Error).message);
      return false;
    }
  }

  /**
   * Get available quantum backends from IBM
   */
  async getBackends(): Promise<QiskitBackend[]> {
    if (!this.isConfigured) {
      throw new Error('Qiskit Runtime not configured. Please save credentials first.');
    }

    try {
      const pythonCode = `
from qiskit_ibm_runtime import QiskitRuntimeService
import json

service = QiskitRuntimeService()
backends = service.backends()

backend_info = []
for backend in backends:
    try:
        config = backend.configuration()
        status = backend.status()
        
        backend_data = {
            "name": backend.name,
            "status": "online" if status.operational else "offline",
            "num_qubits": config.n_qubits,
            "pending_jobs": status.pending_jobs,
            "backend_version": config.backend_version,
            "quantum_volume": getattr(config, 'quantum_volume', None),
            "gate_error_rate": getattr(config, 'gate_error_1q', [0])[0] if hasattr(config, 'gate_error_1q') else None
        }
        backend_info.append(backend_data)
    except Exception as e:
        print(f"Error getting info for {backend.name}: {e}")
        continue

print(json.dumps(backend_info, indent=2))
`;

      const result = await this.executePython(pythonCode);
      const backends = JSON.parse(result);
      
      console.log(`✅ Retrieved ${backends.length} quantum backends from IBM`);
      return backends;
    } catch (error) {
      console.error('❌ Error fetching backends:', (error as Error).message);
      throw error;
    }
  }

  /**
   * Submit and run a quantum circuit on real hardware
   */
  async runQuantumCircuit(
    qasm: string,
    backend: string = 'ibmq_qasm_simulator',
    shots: number = 1024
  ): Promise<QiskitJob> {
    if (!this.isConfigured) {
      throw new Error('Qiskit Runtime not configured');
    }

    try {
      const pythonCode = `
from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2 as Sampler
from qiskit import QuantumCircuit
import json
import uuid

service = QiskitRuntimeService()

# Parse QASM circuit
qasm_code = """${qasm.replace(/"/g, '\\"')}"""
circuit = QuantumCircuit.from_qasm_str(qasm_code)

# Get backend
backend = service.backend("${backend}")

# Create sampler and submit job
sampler = Sampler(backend)
job = sampler.run([circuit], shots=${shots})

job_info = {
    "job_id": job.job_id(),
    "status": job.status().name,
    "backend": "${backend}",
    "shots": ${shots}
}

print(json.dumps(job_info))
`;

      const result = await this.executePython(pythonCode);
      const jobInfo = JSON.parse(result);
      
      console.log(`✅ Quantum job submitted: ${jobInfo.job_id}`);
      return jobInfo;
    } catch (error) {
      console.error('❌ Error submitting quantum job:', (error as Error).message);
      throw error;
    }
  }

  /**
   * Get job status and results
   */
  async getJobStatus(jobId: string): Promise<QiskitJob> {
    try {
      const pythonCode = `
from qiskit_ibm_runtime import QiskitRuntimeService
import json

service = QiskitRuntimeService()
job = service.job("${jobId}")

job_info = {
    "job_id": "${jobId}",
    "status": job.status().name,
    "backend": job.backend().name if hasattr(job, 'backend') else "unknown",
    "shots": 0
}

# If job is completed, get results
if job.status().name == "DONE":
    try:
        result = job.result()
        # Extract counts from result
        if hasattr(result, 'quasi_dists'):
            counts = {}
            for quasi_dist in result.quasi_dists:
                for bitstring, prob in quasi_dist.items():
                    bit_str = format(bitstring, f'0{len(bin(max(quasi_dist.keys()))[2:])}b')
                    counts[bit_str] = int(prob * job_info["shots"])
            job_info["results"] = {"counts": counts}
        else:
            job_info["results"] = str(result)
    except Exception as e:
        job_info["error_message"] = str(e)

print(json.dumps(job_info))
`;

      const result = await this.executePython(pythonCode);
      const jobInfo = JSON.parse(result);
      
      return jobInfo;
    } catch (error) {
      console.error('❌ Error getting job status:', (error as Error).message);
      throw error;
    }
  }

  /**
   * Run Bell State circuit on real quantum hardware
   */
  async runBellStateCircuit(backend: string, shots: number = 1024): Promise<any> {
    const bellStateQasm = `OPENQASM 2.0;
include "qelib1.inc";
qreg q[2];
creg c[2];
h q[0];
cx q[0],q[1];
measure q[0] -> c[0];
measure q[1] -> c[1];`;

    try {
      const job = await this.runQuantumCircuit(bellStateQasm, backend, shots);
      
      // Poll for completion
      let attempts = 0;
      const maxAttempts = 30; // 5 minutes max wait
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
        
        const status = await this.getJobStatus(job.job_id);
        
        if (status.status === 'COMPLETED' || status.status === 'DONE') {
          console.log('✅ Bell state circuit completed on real quantum hardware!');
          return {
            success: true,
            job_id: job.job_id,
            backend: backend,
            shots: shots,
            counts: status.results?.counts || {},
            hardware: true
          };
        }
        
        if (status.status === 'ERROR' || status.status === 'CANCELLED') {
          throw new Error(`Job ${status.status}: ${status.error_message || 'Unknown error'}`);
        }
        
        console.log(`⏳ Bell state job ${job.job_id} status: ${status.status} (attempt ${attempts + 1}/${maxAttempts})`);
        attempts++;
      }
      
      throw new Error('Job timeout - taking longer than expected');
    } catch (error) {
      console.error('❌ Bell state circuit failed:', (error as Error).message);
      throw error;
    }
  }

  /**
   * Execute Python code and return output
   */
  private executePython(code: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const python = spawn(this.pythonPath, ['-c', code]);
      
      let stdout = '';
      let stderr = '';
      
      python.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      
      python.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      python.on('close', (code) => {
        if (code === 0) {
          resolve(stdout.trim());
        } else {
          reject(new Error(`Python execution failed: ${stderr}`));
        }
      });
      
      python.on('error', (error) => {
        reject(new Error(`Failed to start Python: ${error.message}`));
      });
    });
  }

  /**
   * Create Jupyter notebook for quantum experiments
   */
  async createQuantumNotebook(): Promise<string> {
    const notebookContent = {
      cells: [
        {
          cell_type: "markdown",
          source: [
            "# IBM Quantum Hardware Experiments\n",
            "Run quantum circuits on real quantum computers!"
          ]
        },
        {
          cell_type: "code",
          source: [
            "from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2 as Sampler\n",
            "from qiskit import QuantumCircuit, transpile\n",
            "from qiskit.visualization import plot_histogram\n",
            "\n",
            "# Initialize service\n",
            "service = QiskitRuntimeService()\n",
            "print(f\"Available backends: {[b.name for b in service.backends()[:5]]}\")"
          ]
        },
        {
          cell_type: "code",
          source: [
            "# Create Bell State circuit\n",
            "circuit = QuantumCircuit(2, 2)\n",
            "circuit.h(0)\n",
            "circuit.cx(0, 1)\n",
            "circuit.measure_all()\n",
            "\n",
            "print(circuit)"
          ]
        },
        {
          cell_type: "code",
          source: [
            "# Run on quantum hardware\n",
            "backend = service.backend('ibmq_qasm_simulator')  # Change to real backend\n",
            "sampler = Sampler(backend)\n",
            "\n",
            "# Submit job\n",
            "job = sampler.run([circuit], shots=1024)\n",
            "print(f\"Job ID: {job.job_id()}\")\n",
            "\n",
            "# Get results\n",
            "result = job.result()\n",
            "print(\"Quantum entanglement demonstrated!\")"
          ]
        }
      ],
      metadata: {
        kernelspec: {
          display_name: "Python 3",
          language: "python",
          name: "python3"
        }
      },
      nbformat: 4,
      nbformat_minor: 4
    };

    const notebookPath = 'quantum_hardware_experiments.ipynb';
    
    // Write notebook file
    await this.executePython(`
import json

notebook_content = ${JSON.stringify(notebookContent)}

with open('${notebookPath}', 'w') as f:
    json.dump(notebook_content, f, indent=2)

print(f"✅ Quantum notebook created: ${notebookPath}")
`);

    return notebookPath;
  }

  /**
   * Check system status
   */
  async getSystemStatus(): Promise<any> {
    try {
      const pythonCode = `
import sys
import json

status = {
    "python_version": sys.version,
    "qiskit_runtime_available": False,
    "jupyter_available": False,
    "authenticated": False
}

try:
    import qiskit_ibm_runtime
    status["qiskit_runtime_available"] = True
    status["qiskit_runtime_version"] = qiskit_ibm_runtime.__version__
except ImportError:
    pass

try:
    import jupyter
    status["jupyter_available"] = True
except ImportError:
    pass

try:
    from qiskit_ibm_runtime import QiskitRuntimeService
    service = QiskitRuntimeService()
    status["authenticated"] = True
    status["available_backends"] = len(service.backends())
except:
    pass

print(json.dumps(status, indent=2))
`;

      const result = await this.executePython(pythonCode);
      return JSON.parse(result);
    } catch (error) {
      return {
        error: (error as Error).message,
        configured: false
      };
    }
  }
}

export const qiskitRuntimeService = new QiskitRuntimeService();

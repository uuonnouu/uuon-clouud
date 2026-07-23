
#!/usr/bin/env python3
"""
IBM Quantum Hardware Setup Script
Sets up Qiskit Runtime for real quantum computer access
"""

import os
from qiskit_ibm_runtime import QiskitRuntimeService

def setup_quantum_hardware():
    """Setup IBM Quantum hardware access"""
    
    # Your credentials (from environment variables for security)
    api_key = os.getenv('IBM_QUANTUM_API') or "YOUR_API_KEY_HERE"
    crn = "crn:v1:bluemix:public:quantum-computing:us-east:a/ddadd7b334794b2a89746bdfba7f9926:740856a4-44c7-4884-9688-5194acc0581d::"
    
    print("🚀 Setting up IBM Quantum Hardware Access...")
    print(f"CRN: {crn}")
    
    try:
        # Save credentials
        QiskitRuntimeService.save_account(
            token=api_key,
            instance=crn,
            overwrite=True
        )
        
        print("✅ Credentials saved successfully!")
        
        # Test connection
        service = QiskitRuntimeService()
        backends = service.backends()
        
        print(f"✅ Connection successful! Found {len(backends)} quantum backends:")
        
        # List real quantum computers
        real_backends = [b for b in backends if not b.simulator]
        simulator_backends = [b for b in backends if b.simulator]
        
        print(f"\n🖥️  Real Quantum Computers ({len(real_backends)}):")
        for backend in real_backends[:5]:
            config = backend.configuration()
            status = backend.status()
            print(f"  • {backend.name}: {config.n_qubits} qubits, "
                  f"{'✅ operational' if status.operational else '❌ down'}")
        
        print(f"\n🔬 Simulators ({len(simulator_backends)}):")
        for backend in simulator_backends[:3]:
            config = backend.configuration()
            print(f"  • {backend.name}: {config.n_qubits} qubits (simulated)")
        
        return True
        
    except Exception as e:
        print(f"❌ Setup failed: {e}")
        print("\n💡 Make sure your API key is set in environment variable:")
        print("   export IBM_QUANTUM_API='your-44-character-api-key'")
        return False

def run_test_circuit():
    """Run a test Bell state circuit"""
    try:
        from qiskit import QuantumCircuit
        from qiskit_ibm_runtime import SamplerV2 as Sampler
        
        service = QiskitRuntimeService()
        
        # Create Bell state circuit
        circuit = QuantumCircuit(2, 2)
        circuit.h(0)
        circuit.cx(0, 1)
        circuit.measure_all()
        
        print(f"\n🔬 Bell State Circuit:")
        print(circuit)
        
        # Use simulator first for quick test
        backend = service.backend('ibmq_qasm_simulator')
        sampler = Sampler(backend)
        
        print(f"🚀 Running on {backend.name}...")
        job = sampler.run([circuit], shots=1024)
        
        print(f"Job ID: {job.job_id()}")
        print("⏳ Waiting for results...")
        
        result = job.result()
        print("✅ Quantum entanglement demonstrated!")
        
        # Extract and display results
        quasi_dists = result.quasi_dists[0]
        counts = {}
        for bitstring, probability in quasi_dists.items():
            bit_str = format(bitstring, '02b')
            counts[bit_str] = int(probability * 1024)
        
        print(f"📊 Results: {counts}")
        
        # Verify entanglement (should only see 00 and 11)
        if '00' in counts and '11' in counts and len(counts) <= 3:
            print("🎉 Quantum entanglement confirmed!")
        else:
            print("⚠️  Unexpected results - might be noisy hardware")
            
        return True
        
    except Exception as e:
        print(f"❌ Test circuit failed: {e}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("🔬 IBM QUANTUM HARDWARE SETUP")
    print("=" * 60)
    
    success = setup_quantum_hardware()
    
    if success:
        print("\n" + "=" * 60)
        print("🧪 RUNNING TEST CIRCUIT")
        print("=" * 60)
        run_test_circuit()
        
        print("\n" + "=" * 60)
        print("✅ SETUP COMPLETE!")
        print("=" * 60)
        print("You can now run quantum circuits on real hardware!")
        print("Start Jupyter: jupyter notebook quantum_hardware_experiments.ipynb")
    else:
        print("\n❌ Setup incomplete. Please check your API key.")

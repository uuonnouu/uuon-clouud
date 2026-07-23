import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ShorsAlgorithmVisualizer, 
  GroversAlgorithmVisualizer,
  QuantumPhaseEstimation,
  quantumAlgorithmsUtils
} from '../lib/quantumAlgorithmsAdvanced';
import { 
  IBMQuantumService, 
  QuantumResourceEstimator,
  QuantumBackend,
  QuantumJob 
} from '../lib/quantumHardwareIntegration';
import { sdkClient } from '../lib/unifiedSDKClient';

interface Props {
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.WebGLRenderer;
}

export default function QuantumAlgorithmsPanel({ scene, camera, renderer }: Props) {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('shors');
  const [backends, setBackends] = useState<QuantumBackend[]>([]);
  const [selectedBackend, setSelectedBackend] = useState<string>('');
  const [jobs, setJobs] = useState<QuantumJob[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [resourceEstimates, setResourceEstimates] = useState<any>(null);

  // Algorithm parameters
  const [shorsN, setShorsN] = useState(15);
  const [shorsA, setShorsA] = useState(2);
  const [groversStates, setGroversStates] = useState(['011', '100']);
  const [groversQubits, setGroversQubits] = useState(3);
  const [pceNodes, setPceNodes] = useState(100);
  const [pceQubits, setPceQubits] = useState(50);

  // MPF Parameters
  const [mpfTime, setMpfTime] = useState(1.0);
  const [mpfOrder, setMpfOrder] = useState(2);
  const [mpfTrotterSteps, setMpfTrotterSteps] = useState([1, 2, 4]); // Example steps

  const ibmService = useRef(new IBMQuantumService());
  const visualizationRef = useRef<THREE.Group>();

  useEffect(() => {
    loadBackends();
  }, []);

  useEffect(() => {
    updateResourceEstimates();
  }, [selectedAlgorithm, shorsN, groversQubits, mpfTime, mpfOrder]); // Added MPF params

  useEffect(() => {
    updateVisualization();
  }, [selectedAlgorithm, shorsN, shorsA, groversQubits, groversStates]); // MPF visualization not yet implemented

  const loadBackends = async () => {
    try {
      const availableBackends = await ibmService.current.getBackends();
      setBackends(availableBackends);
      if (availableBackends.length > 0) {
        setSelectedBackend(availableBackends[0].name);
      }
    } catch (error) {
      console.error('Failed to load quantum backends:', error);
    }
  };

  const updateResourceEstimates = () => {
    let estimates = null;

    switch (selectedAlgorithm) {
      case 'shors':
        estimates = QuantumResourceEstimator.estimateShorsResources(shorsN);
        break;
      case 'grovers':
        const searchSpace = Math.pow(2, groversQubits);
        estimates = QuantumResourceEstimator.estimateGroversResources(searchSpace);
        break;
      case 'mpf': // Add MPF resource estimation
        estimates = QuantumResourceEstimator.estimateMPFResources(mpfTime, mpfOrder, groversQubits); // Placeholder, needs actual implementation
        break;
    }

    setResourceEstimates(estimates);
  };

  const updateVisualization = () => {
    // Clear previous visualization
    if (visualizationRef.current) {
      scene.remove(visualizationRef.current);
    }

    let visualizer;
    switch (selectedAlgorithm) {
      case 'shors':
        visualizer = new ShorsAlgorithmVisualizer(shorsN, shorsA);
        visualizationRef.current = visualizer.createVisualization(scene);
        break;
      case 'grovers':
        visualizer = new GroversAlgorithmVisualizer(groversQubits, groversStates);
        visualizationRef.current = visualizer.createVisualization(scene);
        break;
      // MPF visualization can be added here
    }
  };

  const runQuantumAlgorithm = async () => {
    if (!selectedBackend) return;

    setIsRunning(true);
    setResults(null);

    try {
      let circuit;
      switch (selectedAlgorithm) {
        case 'shors':
          const shorsViz = new ShorsAlgorithmVisualizer(shorsN, shorsA);
          circuit = shorsViz.createShorsCircuit();
          break;
        case 'grovers':
          const groversViz = new GroversAlgorithmVisualizer(groversQubits, groversStates);
          circuit = groversViz.createGroversCircuit();
          break;
        case 'qpe':
          // PCE MaxCut algorithm
          const pceResult = await sdkClient.runQuantumComputation({
            algorithm: 'pce-maxcut',
            num_nodes: pceNodes,
            num_qubits: pceQubits,
            backend: selectedBackend,
            max_iterations: 50
          });

          if (pceResult.success) {
            const pceJob = pceResult.data;
            setJobs(prev => [...prev, { 
              id: pceJob.jobId, 
              circuit: { qubits: pceQubits }, 
              backend: selectedBackend, 
              shots: 1000, 
              status: 'pending' 
            }]);

            // Poll for results
            setTimeout(async () => {
              const statusResult = await sdkClient.runQuantumComputation({ jobId: pceJob.jobId, action: 'status' });
              if (statusResult.success && statusResult.data?.job?.results) {
                const jobResults = statusResult.data.job.results;
                setResults({
                  cut_size: jobResults.cut_size,
                  compression_ratio: jobResults.compression_ratio,
                  iterations: jobResults.iterations.length,
                  barren_plateau_mitigation: jobResults.barren_plateau_mitigation
                });
              }
              setIsRunning(false);
            }, 4000);
          }
          return;
        case 'mpf': // Add MPF circuit creation
          // Placeholder for MPF circuit generation. 
          // This would involve using the mpfTrotterSteps and mpfOrder
          // to construct a circuit that simulates time evolution.
          console.warn("MPF circuit creation not yet implemented.");
          // circuit = quantumAlgorithmsUtils.createMPFCircuit(mpfTime, mpfOrder, mpfTrotterSteps); 
          return; // Return early as MPF circuit creation is a placeholder
        default:
          throw new Error('Unknown algorithm');
      }

      const job = await ibmService.current.submitJob(circuit, selectedBackend, 1000);
      setJobs(prev => [...prev, job]);

      // Simulate job completion for demo
      setTimeout(() => {
        const simulatedResults = quantumAlgorithmsUtils.simulateMeasurement(circuit, 1000);
        setResults(simulatedResults);
        setIsRunning(false);
      }, 3000);

    } catch (error) {
      console.error('Failed to run quantum algorithm:', error);
      setIsRunning(false);
    }
  };

  const exportResults = () => {
    if (!results) return;

    const exportData = {
      algorithm: selectedAlgorithm,
      parameters: {
        ...(selectedAlgorithm === 'shors' && { N: shorsN, a: shorsA }),
        ...(selectedAlgorithm === 'grovers' && { qubits: groversQubits, markedStates: groversStates }),
        ...(selectedAlgorithm === 'mpf' && { time: mpfTime, order: mpfOrder, trotterSteps: mpfTrotterSteps }),
        // Add other algorithm parameters as needed
      },
      backend: selectedBackend,
      results,
      resourceEstimates,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantum_algorithm_results_${selectedAlgorithm}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 p-4 bg-gray-900/95 backdrop-blur-sm rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-purple-300">🔬 Quantum Algorithms Lab</h3>
        <Badge variant="outline" className="text-purple-300 border-purple-500">
          IBM Quantum Integration
        </Badge>
      </div>

      <Tabs value={selectedAlgorithm} onValueChange={setSelectedAlgorithm} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="shors" className="text-xs">Shor's Algorithm</TabsTrigger>
          <TabsTrigger value="grovers" className="text-xs">Grover's Search</TabsTrigger>
          <TabsTrigger value="qpe" className="text-xs">Phase Estimation</TabsTrigger>
          <TabsTrigger value="mpf" className="text-xs">MPF Time Evolution</TabsTrigger>
        </TabsList>

        <TabsContent value="shors" className="space-y-4">
          <Card className="bg-gray-800/50 border-purple-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-purple-300">Shor's Factorization</CardTitle>
              <CardDescription className="text-xs">
                Factor integers using quantum phase estimation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-300">Number to Factor (N)</label>
                  <Select value={shorsN.toString()} onValueChange={(v) => setShorsN(parseInt(v))}>
                    <SelectTrigger className="h-8 text-xs bg-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800">
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="21">21</SelectItem>
                      <SelectItem value="35">35</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-gray-300">Base (a)</label>
                  <Select value={shorsA.toString()} onValueChange={(v) => setShorsA(parseInt(v))}>
                    <SelectTrigger className="h-8 text-xs bg-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800">
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="7">7</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grovers" className="space-y-4">
          <Card className="bg-gray-800/50 border-purple-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-purple-300">Grover's Search</CardTitle>
              <CardDescription className="text-xs">
                Quantum search with quadratic speedup
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs text-gray-300">Search Space Qubits</label>
                <Select value={groversQubits.toString()} onValueChange={(v) => setGroversQubits(parseInt(v))}>
                  <SelectTrigger className="h-8 text-xs bg-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800">
                    <SelectItem value="2">2 qubits (4 states)</SelectItem>
                    <SelectItem value="3">3 qubits (8 states)</SelectItem>
                    <SelectItem value="4">4 qubits (16 states)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-gray-300 block mb-1">Marked States</label>
                <div className="text-xs text-gray-400">
                  Currently marked: {groversStates.join(', ')}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qpe" className="space-y-4">
          <Card className="bg-gray-800/50 border-purple-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-purple-300">Quantum Phase Estimation</CardTitle>
              <CardDescription className="text-xs">
                General-purpose phase estimation protocol
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-gray-400">
                Quantum Phase Estimation implementation coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mpf" className="space-y-4">
          <Card className="bg-gray-800/50 border-purple-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-purple-300">Multi-Product Formula</CardTitle>
              <CardDescription className="text-xs">
                Reduce Trotter error in quantum time evolution
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-300">Evolution Time (t)</label>
                  <Select value={mpfTime.toString()} onValueChange={(v) => setMpfTime(parseFloat(v))}>
                    <SelectTrigger className="h-8 text-xs bg-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800">
                      <SelectItem value="0.5">0.5</SelectItem>
                      <SelectItem value="1.0">1.0</SelectItem>
                      <SelectItem value="2.0">2.0</SelectItem>
                      <SelectItem value="3.0">3.0</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-gray-300">Trotter Order</label>
                  <Select value={mpfOrder.toString()} onValueChange={(v) => setMpfOrder(parseInt(v))}>
                    <SelectTrigger className="h-8 text-xs bg-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800">
                      <SelectItem value="1">Order 1</SelectItem>
                      <SelectItem value="2">Order 2</SelectItem>
                      <SelectItem value="4">Order 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-300 block mb-1">Trotter Steps</label>
                <div className="text-xs text-gray-400">
                  Using steps: [{mpfTrotterSteps.join(', ')}] (reduces circuit depth vs. single deep circuit)
                </div>
              </div>
              <div className="text-xs text-blue-300 bg-blue-900/20 p-2 rounded">
                <strong>MPF Advantage:</strong> Achieves lower Trotter error using shallow circuits 
                instead of single deep circuit, improving results on NISQ devices.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Backend Selection */}
      <Card className="bg-gray-800/50 border-purple-500/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-purple-300">🖥️ Quantum Backend</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedBackend} onValueChange={setSelectedBackend}>
            <SelectTrigger className="h-8 text-xs bg-gray-700">
              <SelectValue placeholder="Select quantum backend" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800">
              {backends.map(backend => (
                <SelectItem key={backend.name} value={backend.name}>
                  {backend.name} ({backend.qubits} qubits, {backend.provider})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedBackend && (
            <div className="mt-2 p-2 bg-gray-700/50 rounded text-xs">
              {(() => {
                const backend = backends.find(b => b.name === selectedBackend);
                return backend ? (
                  <div className="space-y-1">
                    <div>Provider: {backend.provider}</div>
                    <div>Qubits: {backend.qubits}</div>
                    <div>T1: {backend.coherenceTime.t1}μs, T2: {backend.coherenceTime.t2}μs</div>
                    <div>Error Rate: {(backend.errorRates.twoQubit * 100).toFixed(2)}%</div>
                  </div>
                ) : null;
              })()}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resource Estimates */}
      {resourceEstimates && (
        <Card className="bg-gray-800/50 border-purple-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-300">📊 Resource Estimates</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-2">
            {selectedAlgorithm === 'shors' && (
              <>
                <div>Logical Qubits: {resourceEstimates.logicalQubits}</div>
                <div>Physical Qubits: {resourceEstimates.physicalQubits.toLocaleString()}</div>
                <div>Gate Count: {resourceEstimates.gateCount.toLocaleString()}</div>
                <div>Runtime: {resourceEstimates.runtime}</div>
                <div>Fidelity Required: {(resourceEstimates.fidelityRequired * 100).toFixed(2)}%</div>
              </>
            )}
            {selectedAlgorithm === 'grovers' && (
              <>
                <div>Qubits: {resourceEstimates.qubits}</div>
                <div>Iterations: {resourceEstimates.iterations}</div>
                <div>Gate Count: {resourceEstimates.gateCount}</div>
                <div>Success Probability: {(resourceEstimates.successProbability * 100).toFixed(1)}%</div>
              </>
            )}
            {selectedAlgorithm === 'mpf' && ( // Display MPF estimates
              <>
                <div>Qubits: {resourceEstimates.qubits}</div>
                <div>Trotter Steps: {resourceEstimates.trotterSteps}</div>
                <div>Gate Count: {resourceEstimates.gateCount}</div>
                <div>Estimated Error: {resourceEstimates.error}</div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Controls */}
      <div className="flex gap-2">
        <Button 
          onClick={runQuantumAlgorithm}
          disabled={isRunning || !selectedBackend}
          className="flex-1 bg-purple-600 hover:bg-purple-700"
          size="sm"
        >
          {isRunning ? '🔄 Running...' : '▶️ Run Algorithm'}
        </Button>

        {results && (
          <Button 
            onClick={exportResults}
            variant="outline"
            size="sm"
            className="border-purple-500 text-purple-300"
          >
            💾 Export
          </Button>
        )}
      </div>

      {/* Progress */}
      {isRunning && (
        <div className="space-y-2">
          <div className="text-xs text-gray-300">Quantum computation in progress...</div>
          <Progress value={66} className="h-1" />
        </div>
      )}

      {/* Results */}
      {results && (
        <Card className="bg-gray-800/50 border-green-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-300">🎯 Results</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-2">
            <div className="max-h-32 overflow-y-auto space-y-1">
              {Object.entries(results).slice(0, 8).map(([bitstring, count]) => (
                <div key={bitstring} className="flex justify-between">
                  <span className="font-mono">{bitstring}</span>
                  <span>{count as number} counts</span>
                </div>
              ))}
            </div>
            {Object.keys(results).length > 8 && (
              <div className="text-gray-400">... and {Object.keys(results).length - 8} more states</div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Jobs */}
      {jobs.length > 0 && (
        <Card className="bg-gray-800/50 border-blue-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-blue-300">📋 Recent Jobs</CardTitle>
          </CardHeader>
          <CardContent className="text-xs">
            <div className="max-h-24 overflow-y-auto space-y-1">
              {jobs.slice(-3).map(job => (
                <div key={job.id} className="flex justify-between items-center">
                  <span className="font-mono text-gray-400">{job.id.slice(-8)}</span>
                  <Badge 
                    variant={job.status === 'completed' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {job.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Slider } from './ui/slider';
import { sdkClient } from '../lib/unifiedSDKClient';

interface QueensBridgeJob {
  job_id: string;
  status: string;
  classical_features?: any;
  quantum_results?: any;
}

interface BackendHealth {
  status: string;
  healthy_backends: number;
  total_backends: number;
  recommended_backend?: string;
  rate_limit_remaining?: number;
  shot_budget_remaining?: number;
}

interface ObservableMetrics {
  entropy: number;
  mutual_information: number;
  pauli_x_expectation: number;
  pauli_y_expectation: number;
  pauli_z_expectation: number;
  purity: number;
  total_shots: number;
  unique_states: number;
}

export default function QueensBridgePanel() {
  const [activeTab, setActiveTab] = useState('bridge');
  const [currentJob, setCurrentJob] = useState<QueensBridgeJob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [backendHealth, setBackendHealth] = useState<BackendHealth | null>(null);
  const [jobHistory, setJobHistory] = useState<QueensBridgeJob[]>([]);

  // Bridge Parameters
  const [portalValue, setPortalValue] = useState(1.0);
  const [scaleFactor, setScaleFactor] = useState(1.0);
  const [latticeNodes, setLatticeNodes] = useState('0,1,2,3');
  const [ansatzTemplate, setAnsatzTemplate] = useState('hardware_efficient');
  const [circuitDepth, setCircuitDepth] = useState(3);
  const [backend, setBackend] = useState('ibmq_qasm_simulator');
  const [shots, setShots] = useState(1024);

  // Enhanced Parameter Mapping Mode
  const [mappingMode, setMappingMode] = useState<'linear' | 'modular' | 'mirror'>('modular');
  const [rotationGates, setRotationGates] = useState(['rx', 'ry']);
  const [entanglementPattern, setEntanglementPattern] = useState<'linear' | 'circular' | 'all_to_all'>('linear');

  // Optimization Parameters
  const [objective, setObjective] = useState('maximize_entropy');
  const [maxIterations, setMaxIterations] = useState(5);
  const [learningRate, setLearningRate] = useState(0.1);

  // QAOA Parameters
  const [algorithmType, setAlgorithmType] = useState<'hybrid' | 'qaoa'>('hybrid');
  const [qaoaTemplate, setQaoaTemplate] = useState('small_maxcut');
  const [qaoaLayers, setQaoaLayers] = useState(1);
  const [customGraph, setCustomGraph] = useState('0-1,1-2,2-3,3-0');

  // Computed Observables Display
  const [observables, setObservables] = useState<ObservableMetrics | null>(null);

  useEffect(() => {
    checkBackendHealth();
    const healthInterval = setInterval(checkBackendHealth, 30000);
    return () => clearInterval(healthInterval);
  }, []);

  const checkBackendHealth = async () => {
    try {
      const result = await sdkClient.queensBridgeHealth();
      if (result.success && result.data?.success) {
        setBackendHealth(result.data.health);
        if (result.data.health?.recommended_backend) {
          setBackend(result.data.health.recommended_backend);
        }
      }
    } catch (error) {
      console.error('Failed to check backend health:', error);
    }
  };

  const parseAdjacencyMatrix = (nodes: string): number[][] => {
    const nodeArray = nodes.split(',').map(n => parseInt(n.trim()));
    const size = nodeArray.length;
    const matrix = Array(size).fill(null).map(() => Array(size).fill(0));

    if (entanglementPattern === 'linear') {
      for (let i = 0; i < size - 1; i++) {
        matrix[i][i + 1] = 1;
        matrix[i + 1][i] = 1;
      }
    } else if (entanglementPattern === 'circular') {
      for (let i = 0; i < size; i++) {
        matrix[i][(i + 1) % size] = 1;
        matrix[(i + 1) % size][i] = 1;
      }
    } else if (entanglementPattern === 'all_to_all') {
      for (let i = 0; i < size; i++) {
        for (let j = i + 1; j < size; j++) {
          matrix[i][j] = 1;
          matrix[j][i] = 1;
        }
      }
    }

    return matrix;
  };

  const submitBridgeJob = async () => {
    try {
      setIsProcessing(true);

      const payload = {
        portal_value: portalValue,
        scale_factor: scaleFactor,
        lattice_nodes: latticeNodes.split(',').map(n => parseInt(n.trim())),
        adjacency_matrix: parseAdjacencyMatrix(latticeNodes),
        ansatz_name: ansatzTemplate,
        rotation_gates: rotationGates,
        entanglement_pattern: entanglementPattern,
        depth: circuitDepth,
        backend,
        shots,
        mapping_mode: mappingMode
      };

      const result = await sdkClient.queensBridgeSubmit(payload);

      if (result.success && result.data?.success) {
        const newJob: QueensBridgeJob = { job_id: result.data.job_id, status: 'QUEUED' };
        setCurrentJob(newJob);
        setJobHistory(prev => [newJob, ...prev].slice(0, 10));
        pollJobStatus(result.data.job_id);
      } else {
        throw new Error(result.data?.error || result.error);
      }
    } catch (error) {
      console.error('Bridge job submission failed:', error);
      alert('Job submission failed: ' + (error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const pollJobStatus = async (jobId: string) => {
    const maxAttempts = 60;
    let attempts = 0;

    const poll = async () => {
      try {
        const result = await sdkClient.queensBridgeStatus(jobId);

        if (result.success && result.data?.success) {
          setCurrentJob(result.data.job);

          if (result.data.job.classical_features) {
            extractObservables(result.data.job.classical_features);
          }

          setJobHistory(prev => 
            prev.map(j => j.job_id === jobId ? result.data.job : j)
          );

          if (result.data.job.status === 'COMPLETED' || result.data.job.status === 'ERROR') {
            return;
          }

          if (attempts < maxAttempts) {
            attempts++;
            setTimeout(poll, 5000);
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    };

    setTimeout(poll, 2000);
  };

  const extractObservables = (features: any) => {
    if (!features) return;

    setObservables({
      entropy: features.entropy ?? 0,
      mutual_information: features.mutual_information ?? 0,
      pauli_x_expectation: features.pauli_expectations?.X ?? 0,
      pauli_y_expectation: features.pauli_expectations?.Y ?? 0,
      pauli_z_expectation: features.pauli_expectations?.Z ?? 0,
      purity: features.purity ?? 1,
      total_shots: features.total_shots ?? 0,
      unique_states: features.unique_states ?? 0
    });
  };

  const runOptimization = async () => {
    try {
      setIsProcessing(true);
      setCurrentJob({ job_id: 'opt_' + Date.now(), status: 'RUNNING' });

      const payload = {
        portal_value: portalValue,
        scale_factor: scaleFactor,
        lattice_nodes: latticeNodes.split(',').map(n => parseInt(n.trim())),
        adjacency_matrix: parseAdjacencyMatrix(latticeNodes),
        ansatz_name: ansatzTemplate,
        rotation_gates: rotationGates,
        entanglement_pattern: entanglementPattern,
        depth: circuitDepth,
        objective,
        max_iterations: maxIterations,
        learning_rate: learningRate,
        mapping_mode: mappingMode
      };

      const result = await sdkClient.queensBridgeOptimize(payload);

      if (result.success && result.data?.success) {
        const completedJob = {
          job_id: 'optimization_complete',
          status: 'COMPLETED',
          classical_features: result.data.results
        };
        setCurrentJob(completedJob);
        extractObservables(result.data.results);
      } else {
        throw new Error(result.data?.error || result.error);
      }
    } catch (error) {
      console.error('Optimization failed:', error);
      alert('Optimization failed: ' + (error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const runQAOAOptimization = async () => {
    try {
      setIsProcessing(true);
      setCurrentJob({ job_id: 'qaoa_' + Date.now(), status: 'RUNNING' });

      // Parse graph structure based on template
      let graphNodes: number[] = [];
      let graphEdges: Array<[number, number]> = [];

      switch (qaoaTemplate) {
        case 'small_maxcut':
          graphNodes = [0, 1, 2, 3, 4];
          graphEdges = [[0, 1], [0, 2], [0, 4], [1, 2], [2, 3], [3, 4]];
          break;
        case 'medium_maxcut':
          graphNodes = Array.from({length: 10}, (_, i) => i);
          graphEdges = [
            [0, 1], [0, 2], [0, 3], [1, 4], [1, 5],
            [2, 6], [2, 7], [3, 8], [3, 9], [4, 5],
            [6, 7], [8, 9], [4, 6], [5, 7], [1, 8]
          ];
          break;
        case 'complete_k5':
          graphNodes = [0, 1, 2, 3, 4];
          graphEdges = [
            [0, 1], [0, 2], [0, 3], [0, 4],
            [1, 2], [1, 3], [1, 4],
            [2, 3], [2, 4], [3, 4]
          ];
          break;
        case 'custom':
          const maxNode = Math.max(...customGraph.split(',').flatMap(edge => 
            edge.split('-').map(n => parseInt(n.trim()))
          ));
          graphNodes = Array.from({length: maxNode + 1}, (_, i) => i);
          graphEdges = customGraph.split(',').map(edge => {
            const [a, b] = edge.split('-').map(n => parseInt(n.trim()));
            return [a, b] as [number, number];
          });
          break;
      }

      const payload = {
        graph_nodes: graphNodes,
        graph_edges: graphEdges,
        qaoa_layers: qaoaLayers,
        max_iterations: maxIterations,
        backend,
        shots: shots * 10,
        algorithm_type: 'max_cut'
      };

      const result = await sdkClient.queensBridgeQaoa(payload);

      if (result.success && result.data?.success) {
        const completedJob = {
          job_id: 'qaoa_complete',
          status: 'COMPLETED',
          classical_features: result.data.results
        };
        setCurrentJob(completedJob);
        extractObservables(result.data.results);
      } else {
        throw new Error(result.data?.error || result.error);
      }
    } catch (error) {
      console.error('QAOA optimization failed:', error);
      alert('QAOA optimization failed: ' + (error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-600';
      case 'RUNNING': return 'bg-blue-600';
      case 'QUEUED': return 'bg-yellow-600';
      case 'ERROR': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-4 p-4 bg-gray-900 text-white max-h-screen overflow-y-auto">
      <Card className="bg-gray-800 border-purple-500">
        <CardHeader>
          <CardTitle className="text-purple-400 flex items-center gap-2">
            <span className="text-xl">👑</span>
            Queens Bridge: Quantum-Classical Interface
          </CardTitle>
          {backendHealth && (
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={backendHealth.status === 'operational' ? 'default' : 'destructive'}>
                {backendHealth.status}
              </Badge>
              <span className="text-xs text-gray-400">
                {backendHealth.healthy_backends}/{backendHealth.total_backends} backends
              </span>
              {backendHealth.rate_limit_remaining !== undefined && (
                <span className="text-xs text-cyan-400">
                  {backendHealth.rate_limit_remaining} jobs/hr remaining
                </span>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 gap-1 bg-gray-700">
              <TabsTrigger value="bridge" className="text-xs">Bridge</TabsTrigger>
              <TabsTrigger value="advanced" className="text-xs">Advanced</TabsTrigger>
              <TabsTrigger value="optimize" className="text-xs">Optimize</TabsTrigger>
              <TabsTrigger value="results" className="text-xs">Results</TabsTrigger>
            </TabsList>

            <TabsContent value="bridge" className="space-y-3">
              <h3 className="text-purple-300 font-semibold">Classical → Quantum Bridge</h3>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-400">Portal Value</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={portalValue}
                    onChange={(e) => setPortalValue(parseFloat(e.target.value) || 1.0)}
                    className="bg-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Scale Factor</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={scaleFactor}
                    onChange={(e) => setScaleFactor(parseFloat(e.target.value) || 1.0)}
                    className="bg-gray-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400">Lattice Nodes (comma-separated)</label>
                <Input
                  value={latticeNodes}
                  onChange={(e) => setLatticeNodes(e.target.value)}
                  placeholder="0,1,2,3"
                  className="bg-gray-700 text-white"
                />
                <span className="text-xs text-gray-500">Max: 16 qubits</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-400">Mapping Mode</label>
                  <Select value={mappingMode} onValueChange={(v) => setMappingMode(v as any)}>
                    <SelectTrigger className="bg-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linear">Linear (p·s mod 2π)</SelectItem>
                      <SelectItem value="modular">Modular (p mod 2π)·s</SelectItem>
                      <SelectItem value="mirror">Mirror (symmetric)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-gray-400">Ansatz</label>
                  <Select value={ansatzTemplate} onValueChange={setAnsatzTemplate}>
                    <SelectTrigger className="bg-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hardware_efficient">Hardware Efficient</SelectItem>
                      <SelectItem value="quantum_alternating">QAOA-style</SelectItem>
                      <SelectItem value="symmetric">Symmetric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-400">Backend</label>
                  <Input
                    value={backend}
                    onChange={(e) => setBackend(e.target.value)}
                    className="bg-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Shots ({shots})</label>
                  <Slider
                    value={[shots]}
                    min={1024}
                    max={16384}
                    step={1024}
                    onValueChange={([v]) => setShots(v)}
                    className="mt-2"
                  />
                </div>
              </div>

              <Button 
                onClick={submitBridgeJob} 
                disabled={isProcessing}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isProcessing ? 'Bridging to Quantum...' : '🌉 Bridge to Quantum'}
              </Button>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-3">
              <h3 className="text-purple-300 font-semibold">Advanced Circuit Parameters</h3>

              <div>
                <label className="text-xs text-gray-400">Circuit Depth (1-250)</label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[circuitDepth]}
                    min={1}
                    max={50}
                    step={1}
                    onValueChange={([v]) => setCircuitDepth(v)}
                    className="flex-1"
                  />
                  <span className="text-sm w-8">{circuitDepth}</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400">Rotation Gates</label>
                <div className="flex gap-2 mt-1">
                  {['rx', 'ry', 'rz'].map(gate => (
                    <Button
                      key={gate}
                      variant={rotationGates.includes(gate) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        if (rotationGates.includes(gate)) {
                          setRotationGates(rotationGates.filter(g => g !== gate));
                        } else {
                          setRotationGates([...rotationGates, gate]);
                        }
                      }}
                      className={rotationGates.includes(gate) ? 'bg-purple-600' : 'border-gray-600'}
                    >
                      {gate.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400">Entanglement Pattern</label>
                <Select value={entanglementPattern} onValueChange={(v) => setEntanglementPattern(v as any)}>
                  <SelectTrigger className="bg-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">Linear (chain)</SelectItem>
                    <SelectItem value="circular">Circular (ring)</SelectItem>
                    <SelectItem value="all_to_all">All-to-All (full mesh)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Card className="bg-gray-700 p-3">
                <h4 className="text-xs text-cyan-400 mb-2">Parameter Mapping Preview</h4>
                <div className="text-xs font-mono text-gray-300">
                  {mappingMode === 'linear' && `θ = (${portalValue.toFixed(2)} × ${scaleFactor.toFixed(2)}) mod 2π = ${((portalValue * scaleFactor) % (2 * Math.PI)).toFixed(4)} rad`}
                  {mappingMode === 'modular' && `θ = (${portalValue.toFixed(2)} mod 2π) × ${scaleFactor.toFixed(2)} = ${((portalValue % (2 * Math.PI)) * scaleFactor).toFixed(4)} rad`}
                  {mappingMode === 'mirror' && `θ = mirror(${portalValue.toFixed(2)}, ${scaleFactor.toFixed(2)}) = ${((portalValue % (2 * Math.PI)) * scaleFactor).toFixed(4)} rad`}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="optimize" className="space-y-3">
              <h3 className="text-purple-300 font-semibold">Quantum Optimization Algorithms</h3>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <Button
                  variant={algorithmType === 'hybrid' ? 'default' : 'outline'}
                  onClick={() => setAlgorithmType('hybrid')}
                  className="text-xs"
                >
                  Hybrid VQE
                </Button>
                <Button
                  variant={algorithmType === 'qaoa' ? 'default' : 'outline'}
                  onClick={() => setAlgorithmType('qaoa')}
                  className="text-xs"
                >
                  QAOA Max-Cut
                </Button>
              </div>

              {algorithmType === 'hybrid' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-400">Optimization Objective</label>
                    <Select value={objective} onValueChange={setObjective}>
                      <SelectTrigger className="bg-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maximize_entropy">Maximize Entropy</SelectItem>
                        <SelectItem value="minimize_energy">Minimize Energy</SelectItem>
                        <SelectItem value="maximize_purity">Maximize Purity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-400">Max Iterations</label>
                      <Input
                        type="number"
                        min="1"
                        max="20"
                        value={maxIterations}
                        onChange={(e) => setMaxIterations(parseInt(e.target.value) || 5)}
                        className="bg-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Learning Rate</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={learningRate}
                        onChange={(e) => setLearningRate(parseFloat(e.target.value) || 0.1)}
                        className="bg-gray-700 text-white"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={runOptimization} 
                    disabled={isProcessing}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {isProcessing ? 'Optimizing...' : '🔄 Run Hybrid Optimization'}
                  </Button>
                </div>
              )}

              {algorithmType === 'qaoa' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-400">QAOA Problem Template</label>
                    <Select value={qaoaTemplate} onValueChange={setQaoaTemplate}>
                      <SelectTrigger className="bg-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small_maxcut">Small Max-Cut (5 nodes)</SelectItem>
                        <SelectItem value="medium_maxcut">Medium Max-Cut (10 nodes)</SelectItem>
                        <SelectItem value="complete_k5">Complete Graph K5</SelectItem>
                        <SelectItem value="custom">Custom Graph</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-400">QAOA Layers</label>
                      <Select value={qaoaLayers.toString()} onValueChange={(v) => setQaoaLayers(parseInt(v))}>
                        <SelectTrigger className="bg-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Layer (p=1)</SelectItem>
                          <SelectItem value="2">2 Layers (p=2)</SelectItem>
                          <SelectItem value="3">3 Layers (p=3)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Max Iterations</label>
                      <Input
                        type="number"
                        min="5"
                        max="50"
                        value={maxIterations}
                        onChange={(e) => setMaxIterations(parseInt(e.target.value) || 30)}
                        className="bg-gray-700 text-white"
                      />
                    </div>
                  </div>

                  {qaoaTemplate === 'custom' && (
                    <div>
                      <label className="text-xs text-gray-400">Graph Edges (comma-separated pairs)</label>
                      <Input
                        value={customGraph}
                        onChange={(e) => setCustomGraph(e.target.value)}
                        placeholder="0-1,1-2,2-3,3-0"
                        className="bg-gray-700 text-white"
                      />
                      <span className="text-xs text-gray-500">Format: node1-node2,node3-node4,...</span>
                    </div>
                  )}

                  <Card className="bg-gray-700 p-3">
                    <h4 className="text-xs text-cyan-400 mb-2">QAOA Algorithm Info</h4>
                    <div className="text-xs text-gray-300 space-y-1">
                      <p>🎯 <strong>Goal:</strong> Find maximum cut of graph</p>
                      <p>⚛️ <strong>Method:</strong> Quantum approximate optimization</p>
                      <p>📈 <strong>Scaling:</strong> Exponential quantum advantage potential</p>
                      <p>🔬 <strong>Applications:</strong> Network analysis, clustering, logistics</p>
                    </div>
                  </Card>

                  <Button 
                    onClick={runQAOAOptimization} 
                    disabled={isProcessing}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                  >
                    {isProcessing ? 'Running QAOA...' : '🧮 Run QAOA Max-Cut'}
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="results" className="space-y-3">
              <h3 className="text-purple-300 font-semibold">Quantum Results & Observables</h3>

              {currentJob ? (
                <Card className="bg-gray-700 border-green-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-green-400 text-sm flex items-center justify-between">
                      <span>Job: {currentJob.job_id.substring(0, 20)}...</span>
                      <Badge className={getStatusColor(currentJob.status)}>
                        {currentJob.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {currentJob.status === 'RUNNING' && (
                      <Progress value={33} className="w-full" />
                    )}

                    {observables && (
                      <div className="space-y-3">
                        <h4 className="text-xs text-cyan-400 font-semibold">Comprehensive Observables</h4>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-gray-800 p-2 rounded">
                            <span className="text-xs text-gray-400">Entropy S(ρ)</span>
                            <p className="text-lg font-mono text-green-400">
                              {observables.entropy.toFixed(4)}
                            </p>
                          </div>
                          <div className="bg-gray-800 p-2 rounded">
                            <span className="text-xs text-gray-400">Purity Tr(ρ²)</span>
                            <p className="text-lg font-mono text-blue-400">
                              {observables.purity.toFixed(4)}
                            </p>
                          </div>
                        </div>

                        <div className="bg-gray-800 p-2 rounded">
                          <span className="text-xs text-gray-400">Mutual Information I(A:B)</span>
                          <p className="text-lg font-mono text-purple-400">
                            {observables.mutual_information.toFixed(4)}
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-gray-800 p-2 rounded text-center">
                            <span className="text-xs text-gray-400">⟨X⟩</span>
                            <p className="text-sm font-mono text-yellow-400">
                              {observables.pauli_x_expectation.toFixed(3)}
                            </p>
                          </div>
                          <div className="bg-gray-800 p-2 rounded text-center">
                            <span className="text-xs text-gray-400">⟨Y⟩</span>
                            <p className="text-sm font-mono text-orange-400">
                              {observables.pauli_y_expectation.toFixed(3)}
                            </p>
                          </div>
                          <div className="bg-gray-800 p-2 rounded text-center">
                            <span className="text-xs text-gray-400">⟨Z⟩</span>
                            <p className="text-sm font-mono text-red-400">
                              {observables.pauli_z_expectation.toFixed(3)}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Shots: {observables.total_shots}</span>
                          <span>Unique States: {observables.unique_states}</span>
                        </div>
                      </div>
                    )}

                    {currentJob.classical_features && !observables && (
                      <div className="space-y-2">
                        {Object.entries(currentJob.classical_features).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center">
                            <span className="text-xs text-gray-300 capitalize">
                              {key.replace(/_/g, ' ')}:
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {typeof value === 'number' ? 
                                value.toFixed(4) : 
                                JSON.stringify(value).substring(0, 30)
                              }
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  No active jobs. Submit a bridge job or run optimization to see results.
                </div>
              )}

              {jobHistory.length > 1 && (
                <Card className="bg-gray-700 p-3">
                  <h4 className="text-xs text-cyan-400 mb-2">Recent Jobs</h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {jobHistory.slice(1).map(job => (
                      <div key={job.job_id} className="flex justify-between text-xs">
                        <span className="text-gray-400 truncate max-w-[60%]">
                          {job.job_id}
                        </span>
                        <Badge className={`${getStatusColor(job.status)} text-xs`}>
                          {job.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
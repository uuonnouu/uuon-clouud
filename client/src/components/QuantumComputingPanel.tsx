
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { sdkClient } from '../lib/unifiedSDKClient';

interface QuantumJob {
  id: string;
  type: 'qaoa' | 'shor' | 'grover' | 'vqe' | 'transpilation' | 'pce';
  status: 'pending' | 'running' | 'completed' | 'failed';
  parameters: Record<string, any>;
  result?: any;
  createdAt: string;
  completedAt?: string;
  error?: string;
}

export const QuantumComputingPanel: React.FC = () => {
  const [jobs, setJobs] = useState<QuantumJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // QAOA parameters
  const [qaoaNodes, setQaoaNodes] = useState('10');
  const [qaoaReps, setQaoaReps] = useState('1');

  // Shor's algorithm parameters
  const [shorNumber, setShorNumber] = useState('15');

  // Grover's algorithm parameters
  const [groverQubits, setGroverQubits] = useState('3');
  const [groverStates, setGroverStates] = useState('111');

  useEffect(() => {
    initializeQuantumService();
    loadJobs();
  }, []);

  const initializeQuantumService = async () => {
    try {
      const result = await sdkClient.runQuantumComputation({ action: 'initialize' });
      setInitialized(result.success);
    } catch (error) {
      console.error('Failed to initialize quantum service:', error);
    }
  };

  const loadJobs = async () => {
    try {
      const result = await sdkClient.getQuantumAlgorithms();
      if (result.success && result.data?.jobs) {
        setJobs(result.data.jobs);
      }
    } catch (error) {
      console.error('Failed to load jobs:', error);
    }
  };

  const runQAOA = async () => {
    setLoading(true);
    try {
      const numNodes = parseInt(qaoaNodes);
      const graphEdges: number[][] = [];
      
      for (let i = 0; i < numNodes; i++) {
        for (let j = i + 1; j < numNodes; j++) {
          if (Math.random() > 0.7) {
            graphEdges.push([i, j]);
          }
        }
      }

      const result = await sdkClient.runQuantumComputation({
        algorithm: 'qaoa',
        graphEdges,
        numNodes,
        reps: parseInt(qaoaReps)
      });

      if (result.success) {
        console.log('QAOA job started:', result.data);
        loadJobs();
      }
    } catch (error) {
      console.error('QAOA failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const runShor = async () => {
    setLoading(true);
    try {
      const result = await sdkClient.runQuantumComputation({
        algorithm: 'shor',
        number: parseInt(shorNumber)
      });

      if (result.success) {
        console.log('Shor job started:', result.data);
        loadJobs();
      }
    } catch (error) {
      console.error('Shor failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const runGrover = async () => {
    setLoading(true);
    try {
      const result = await sdkClient.runQuantumComputation({
        algorithm: 'grover',
        numQubits: parseInt(groverQubits),
        markedStates: [groverStates]
      });

      if (result.success) {
        console.log('Grover job started:', result.data);
        loadJobs();
      }
    } catch (error) {
      console.error('Grover failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const migrateAssets = async () => {
    setLoading(true);
    try {
      const result = await sdkClient.runQuantumComputation({ action: 'migrate-assets' });

      if (result.success) {
        console.log('Assets migrated successfully');
      }
    } catch (error) {
      console.error('Migration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'running': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>🔬</span>
            <span>Quantum Computing Integration</span>
            <Badge variant={initialized ? "default" : "destructive"}>
              {initialized ? "Initialized" : "Not Ready"}
            </Badge>
          </CardTitle>
          <CardDescription>
            Advanced quantum algorithms for mathematical optimization and cryptography
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Button onClick={migrateAssets} disabled={loading}>
              Migrate Quantum Assets
            </Button>
            <Button onClick={loadJobs} variant="outline">
              Refresh Jobs
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="algorithms" className="w-full">
        <TabsList>
          <TabsTrigger value="algorithms">Quantum Algorithms</TabsTrigger>
          <TabsTrigger value="jobs">Job Status</TabsTrigger>
        </TabsList>

        <TabsContent value="algorithms" className="space-y-6">
          {/* QAOA */}
          <Card>
            <CardHeader>
              <CardTitle>QAOA - Quantum Approximate Optimization Algorithm</CardTitle>
              <CardDescription>
                Solve optimization problems using quantum-classical hybrid approach
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="qaoa-nodes">Number of Nodes</Label>
                  <Input
                    id="qaoa-nodes"
                    value={qaoaNodes}
                    onChange={(e) => setQaoaNodes(e.target.value)}
                    placeholder="10"
                  />
                </div>
                <div>
                  <Label htmlFor="qaoa-reps">QAOA Repetitions</Label>
                  <Input
                    id="qaoa-reps"
                    value={qaoaReps}
                    onChange={(e) => setQaoaReps(e.target.value)}
                    placeholder="1"
                  />
                </div>
              </div>
              <Button onClick={runQAOA} disabled={loading || !initialized}>
                Run QAOA
              </Button>
            </CardContent>
          </Card>

          {/* Shor's Algorithm */}
          <Card>
            <CardHeader>
              <CardTitle>Shor's Algorithm</CardTitle>
              <CardDescription>
                Factor integers exponentially faster than classical algorithms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="shor-number">Number to Factor</Label>
                <Input
                  id="shor-number"
                  value={shorNumber}
                  onChange={(e) => setShorNumber(e.target.value)}
                  placeholder="15"
                />
              </div>
              <Button onClick={runShor} disabled={loading || !initialized}>
                Run Shor's Algorithm
              </Button>
            </CardContent>
          </Card>

          {/* Grover's Algorithm */}
          <Card>
            <CardHeader>
              <CardTitle>Grover's Algorithm</CardTitle>
              <CardDescription>
                Search unsorted databases with quadratic speedup
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="grover-qubits">Number of Qubits</Label>
                  <Input
                    id="grover-qubits"
                    value={groverQubits}
                    onChange={(e) => setGroverQubits(e.target.value)}
                    placeholder="3"
                  />
                </div>
                <div>
                  <Label htmlFor="grover-states">Marked State</Label>
                  <Input
                    id="grover-states"
                    value={groverStates}
                    onChange={(e) => setGroverStates(e.target.value)}
                    placeholder="111"
                  />
                </div>
              </div>
              <Button onClick={runGrover} disabled={loading || !initialized}>
                Run Grover's Algorithm
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          {jobs.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-gray-500">No quantum jobs yet</p>
              </CardContent>
            </Card>
          ) : (
            jobs.map((job) => (
              <Card key={job.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">
                      {job.type.toUpperCase()} - {job.id}
                    </CardTitle>
                    <Badge className={getStatusColor(job.status)}>
                      {job.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    Created: {new Date(job.createdAt).toLocaleString()}
                    {job.completedAt && (
                      <>
                        <br />
                        Completed: {new Date(job.completedAt).toLocaleString()}
                      </>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <strong>Parameters:</strong>
                      <pre className="text-sm bg-gray-100 p-2 rounded">
                        {JSON.stringify(job.parameters, null, 2)}
                      </pre>
                    </div>
                    {job.result && (
                      <div>
                        <strong>Result:</strong>
                        <pre className="text-sm bg-gray-100 p-2 rounded">
                          {JSON.stringify(job.result, null, 2)}
                        </pre>
                      </div>
                    )}
                    {job.error && (
                      <div>
                        <strong>Error:</strong>
                        <pre className="text-sm bg-red-100 p-2 rounded">
                          {job.error}
                        </pre>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuantumComputingPanel;

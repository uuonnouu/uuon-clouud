import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Brain, Zap, Infinity, Globe, AlertTriangle, Play, Pause } from 'lucide-react';
import { sdkClient } from '../lib/unifiedSDKClient';

interface HypercomputationPanelProps {
  onShapeChange: (shapeType: string) => void;
  onParameterChange: (params: Partial<any>) => void;
}

interface HypercomputationResult {
  iterations: number;
  converged: boolean;
  oracleConsultations: number;
  computationTime: number;
  result: number | 'undecidable' | 'infinite';
  method: 'oracle' | 'zeno' | 'infinite-time' | 'malament-hogarth';
}

export default function HypercomputationPanel({ onShapeChange, onParameterChange }: HypercomputationPanelProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentResults, setCurrentResults] = useState<HypercomputationResult | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<'oracle' | 'zeno' | 'infinite-time' | 'malament-hogarth'>('oracle');

  const hypercomputationMethods = [
    {
      id: 'oracle',
      name: 'Oracle Machine',
      icon: Brain,
      description: 'Solves uncomputable problems instantly',
      shape: 'oracle_black_box',
      color: 'bg-purple-500/20 border-purple-500/50',
      problems: ['halting', 'collatz', 'goldbach', 'riemann'],
      status: 'theoretical'
    },
    {
      id: 'zeno',
      name: 'Zeno Machine',
      icon: Zap,
      description: 'Infinite steps in finite time',
      shape: 'zeno_machine_spiral',
      color: 'bg-yellow-500/20 border-yellow-500/50',
      problems: ['harmonic_series', 'exponential_decay', 'sine_series'],
      status: 'simulated'
    },
    {
      id: 'infinite-time',
      name: 'Infinite Time Turing Machine',
      icon: Infinity,
      description: 'Transfinite ordinal computation',
      shape: 'infinite_time_manifold',
      color: 'bg-blue-500/20 border-blue-500/50',
      problems: ['fibonacci_like', 'logistic_map', 'newton_method'],
      status: 'mathematical'
    },
    {
      id: 'malament-hogarth',
      name: 'Malament-Hogarth Spacetime',
      icon: Globe,
      description: 'Relativistic hypercomputation',
      shape: 'malament_hogarth_spacetime',
      color: 'bg-green-500/20 border-green-500/50',
      problems: ['oscillatory', 'exponential', 'polynomial'],
      status: 'relativistic'
    }
  ] as const;

  const handleRunComputation = async (method: typeof selectedMethod, problemType: string) => {
    setIsRunning(true);
    
    try {
      let result;
      
      switch (method) {
        case 'oracle':
          result = await sdkClient.hypercomputationOracle({
            type: problemType,
            input: [42, 17],
            complexity: 5
          });
          break;
          
        case 'zeno':
          result = await sdkClient.hypercomputationZeno({
            computationType: problemType,
            target: 0
          });
          break;
          
        case 'infinite-time':
          result = await sdkClient.hypercomputationInfiniteTime({
            initialValue: 1.5,
            transformationType: problemType
          });
          break;
          
        case 'malament-hogarth':
          result = await sdkClient.hypercomputationMalamentHogarth({
            computationType: problemType,
            maxTime: 1.0
          });
          break;
      }
      
      if (result?.success && result.data) {
        setCurrentResults(result.data.result);
        
        onParameterChange({
          e: result.data.result.computationTime / 1000,
          f: result.data.result.iterations / 100,
          g: result.data.result.converged ? 1 : 0
        });
      }
    } catch (error) {
      console.error('Hypercomputation failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleMethodSelect = (method: typeof selectedMethod) => {
    setSelectedMethod(method);
    const methodData = hypercomputationMethods.find(m => m.id === method);
    if (methodData) {
      onShapeChange(methodData.shape);
    }
  };

  return (
    <div className="space-y-4">
      {/* Warning Banner */}
      <Card className="border-orange-500/50 bg-orange-500/10">
        <CardContent className="pt-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            <span className="text-orange-300 text-sm font-medium">
              Theoretical Computing Models - Classical Simulation Only
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Method Selection */}
      <Card className="bg-black/40 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 text-lg">Hypercomputation Methods</CardTitle>
          <CardDescription className="text-gray-400">
            Theoretical computing models beyond Church-Turing thesis limitations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {hypercomputationMethods.map((method) => {
              const Icon = method.icon;
              const isSelected = selectedMethod === method.id;
              
              return (
                <Card
                  key={method.id}
                  className={`cursor-pointer transition-all ${
                    isSelected 
                      ? method.color + ' ring-2 ring-cyan-500' 
                      : 'bg-black/20 border-gray-600/50 hover:bg-gray-800/30'
                  }`}
                  onClick={() => handleMethodSelect(method.id as typeof selectedMethod)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-cyan-400' : 'text-gray-400'}`} />
                        <div>
                          <h4 className={`font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                            {method.name}
                          </h4>
                          <p className="text-sm text-gray-400 mt-1">{method.description}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {method.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Problem Types */}
      {selectedMethod && (
        <Card className="bg-black/40 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-purple-400 text-sm">
              {hypercomputationMethods.find(m => m.id === selectedMethod)?.name} Problems
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {hypercomputationMethods
                .find(m => m.id === selectedMethod)
                ?.problems.map((problem) => (
                  <Button
                    key={problem}
                    variant="outline"
                    size="sm"
                    onClick={() => handleRunComputation(selectedMethod, problem)}
                    disabled={isRunning}
                    className="text-xs bg-black/20 border-gray-600/50 hover:bg-purple-900/20"
                  >
                    {isRunning ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                    {problem.replace('_', ' ')}
                  </Button>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Display */}
      {currentResults && (
        <Card className="bg-black/40 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-green-400 text-sm">Computation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Method:</span>
                <span className="text-white">{currentResults.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Iterations:</span>
                <span className="text-white">{currentResults.iterations.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Time:</span>
                <span className="text-white">{currentResults.computationTime.toFixed(3)}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Converged:</span>
                <Badge variant={currentResults.converged ? "default" : "destructive"} className="text-xs">
                  {currentResults.converged ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Result:</span>
                <span className="text-white font-mono">
                  {typeof currentResults.result === 'number' 
                    ? currentResults.result.toFixed(6) 
                    : currentResults.result}
                </span>
              </div>
              {currentResults.oracleConsultations > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Oracle Calls:</span>
                  <span className="text-white">{currentResults.oracleConsultations}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hypercomputation Shapes */}
      <Card className="bg-black/40 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 text-sm">Visualization Shapes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2">
            {[
              { key: 'oracle_black_box', name: '🔮 Oracle Black Box' },
              { key: 'turing_jump_hierarchy', name: '🪜 Turing Jump Hierarchy' },
              { key: 'zeno_machine_spiral', name: '⚡ Zeno Machine Spiral' },
              { key: 'infinite_time_manifold', name: '♾️ Infinite Time Manifold' },
              { key: 'malament_hogarth_spacetime', name: '🌌 Malament-Hogarth Spacetime' },
              { key: 'halting_problem_landscape', name: '🛑 Halting Problem Landscape' },
              { key: 'super_recursive_surface', name: '🚀 Super-Recursive Surface' },
              { key: 'quantum_oracle_hybrid', name: '⚛️ Quantum Oracle Hybrid' }
            ].map((shape) => (
              <Button
                key={shape.key}
                variant="outline"
                size="sm"
                onClick={() => onShapeChange(shape.key)}
                className="justify-start text-xs bg-black/20 border-gray-600/50 hover:bg-cyan-900/20"
              >
                {shape.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

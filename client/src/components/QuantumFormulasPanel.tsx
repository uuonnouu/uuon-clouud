import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { sdkClient } from '../lib/unifiedSDKClient';

interface QuantumFormulasInterface {
  formulas: any;
  constants: any;
}

export default function QuantumFormulasPanel() {
  const [formulasData, setFormulasData] = useState<QuantumFormulasInterface | null>(null);
  const [activeCalculator, setActiveCalculator] = useState('bloch-sphere');
  const [calculationResults, setCalculationResults] = useState<any>(null);
  
  // Bloch Sphere Calculator State
  const [alpha, setAlpha] = useState({ real: 1, imag: 0 });
  const [beta, setBeta] = useState({ real: 0, imag: 0 });
  
  // Grover Algorithm Calculator State
  const [searchSpaceSize, setSearchSpaceSize] = useState(16);
  const [numSolutions, setNumSolutions] = useState(1);
  
  // Error Correction Calculator State
  const [physicalErrorRate, setPhysicalErrorRate] = useState(0.001);
  const [codeDistance, setCodeDistance] = useState(3);
  
  // Quantum Sensing Calculator State
  const [numParticles, setNumParticles] = useState(100);

  useEffect(() => {
    fetchQuantumFormulas();
  }, []);

  const fetchQuantumFormulas = async () => {
    try {
      const result = await sdkClient.getQuantumFormulas();
      if (result.success && result.data?.success) {
        setFormulasData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch quantum formulas:', error);
    }
  };

  const calculateBlochSphere = async () => {
    try {
      const result = await sdkClient.blochSphere({ alpha, beta });
      if (result.success) {
        setCalculationResults(result.data);
      }
    } catch (error) {
      console.error('Bloch sphere calculation failed:', error);
    }
  };

  const calculateGrover = async () => {
    try {
      const result = await sdkClient.groverAlgorithm({ 
        search_space_size: searchSpaceSize, 
        num_solutions: numSolutions 
      });
      if (result.success) {
        setCalculationResults(result.data);
      }
    } catch (error) {
      console.error('Grover calculation failed:', error);
    }
  };

  const calculateErrorCorrection = async () => {
    try {
      const result = await sdkClient.errorCorrection({ 
        physical_error_rate: physicalErrorRate,
        code_distance: codeDistance
      });
      if (result.success) {
        setCalculationResults(result.data);
      }
    } catch (error) {
      console.error('Error correction calculation failed:', error);
    }
  };

  const calculateQuantumSensing = async () => {
    try {
      const result = await sdkClient.quantumSensing({ num_particles: numParticles });
      if (result.success) {
        setCalculationResults(result.data);
      }
    } catch (error) {
      console.error('Quantum sensing calculation failed:', error);
    }
  };

  if (!formulasData) {
    return (
      <div className="p-4">
        <div className="animate-pulse">Loading quantum formulas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 bg-gray-900 text-white max-h-screen overflow-y-auto">
      <Card className="bg-gray-800 border-purple-500">
        <CardHeader>
          <CardTitle className="text-purple-400">🔬 Quantum Computing Formulas & Calculators</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeCalculator} onValueChange={setActiveCalculator}>
            <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-1 bg-gray-700">
              <TabsTrigger value="bloch-sphere" className="text-xs">Bloch Sphere</TabsTrigger>
              <TabsTrigger value="grover" className="text-xs">Grover</TabsTrigger>
              <TabsTrigger value="error-correction" className="text-xs">Error Correction</TabsTrigger>
              <TabsTrigger value="sensing" className="text-xs">Sensing</TabsTrigger>
            </TabsList>

            <TabsContent value="bloch-sphere" className="space-y-3">
              <h3 className="text-purple-300 font-semibold">Qubit State Calculator</h3>
              <p className="text-sm text-gray-300">|ψ⟩ = α|0⟩ + β|1⟩</p>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-400">α (real)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={alpha.real}
                    onChange={(e) => setAlpha({...alpha, real: parseFloat(e.target.value) || 0})}
                    className="bg-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">α (imag)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={alpha.imag}
                    onChange={(e) => setAlpha({...alpha, imag: parseFloat(e.target.value) || 0})}
                    className="bg-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">β (real)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={beta.real}
                    onChange={(e) => setBeta({...beta, real: parseFloat(e.target.value) || 0})}
                    className="bg-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">β (imag)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={beta.imag}
                    onChange={(e) => setBeta({...beta, imag: parseFloat(e.target.value) || 0})}
                    className="bg-gray-700 text-white"
                  />
                </div>
              </div>
              
              <Button onClick={calculateBlochSphere} className="w-full bg-purple-600 hover:bg-purple-700">
                Calculate Bloch Sphere
              </Button>
            </TabsContent>

            <TabsContent value="grover" className="space-y-3">
              <h3 className="text-purple-300 font-semibold">Grover's Algorithm</h3>
              <p className="text-sm text-gray-300">k ≈ (π/4)√(N/M)</p>
              
              <div>
                <label className="text-xs text-gray-400">Search Space Size (N)</label>
                <Input
                  type="number"
                  value={searchSpaceSize}
                  onChange={(e) => setSearchSpaceSize(parseInt(e.target.value) || 16)}
                  className="bg-gray-700 text-white"
                />
              </div>
              
              <div>
                <label className="text-xs text-gray-400">Number of Solutions (M)</label>
                <Input
                  type="number"
                  value={numSolutions}
                  onChange={(e) => setNumSolutions(parseInt(e.target.value) || 1)}
                  className="bg-gray-700 text-white"
                />
              </div>
              
              <Button onClick={calculateGrover} className="w-full bg-purple-600 hover:bg-purple-700">
                Calculate Grover Parameters
              </Button>
            </TabsContent>

            <TabsContent value="error-correction" className="space-y-3">
              <h3 className="text-purple-300 font-semibold">Error Correction</h3>
              <p className="text-sm text-gray-300">p_L ≈ (p/p_th)^((d+1)/2)</p>
              
              <div>
                <label className="text-xs text-gray-400">Physical Error Rate</label>
                <Input
                  type="number"
                  step="0.0001"
                  value={physicalErrorRate}
                  onChange={(e) => setPhysicalErrorRate(parseFloat(e.target.value) || 0.001)}
                  className="bg-gray-700 text-white"
                />
              </div>
              
              <div>
                <label className="text-xs text-gray-400">Code Distance</label>
                <Input
                  type="number"
                  value={codeDistance}
                  onChange={(e) => setCodeDistance(parseInt(e.target.value) || 3)}
                  className="bg-gray-700 text-white"
                />
              </div>
              
              <Button onClick={calculateErrorCorrection} className="w-full bg-purple-600 hover:bg-purple-700">
                Calculate Error Rates
              </Button>
            </TabsContent>

            <TabsContent value="sensing" className="space-y-3">
              <h3 className="text-purple-300 font-semibold">Quantum Sensing</h3>
              <p className="text-sm text-gray-300">Δφ ≥ 1/N (Heisenberg limit)</p>
              
              <div>
                <label className="text-xs text-gray-400">Number of Particles</label>
                <Input
                  type="number"
                  value={numParticles}
                  onChange={(e) => setNumParticles(parseInt(e.target.value) || 100)}
                  className="bg-gray-700 text-white"
                />
              </div>
              
              <Button onClick={calculateQuantumSensing} className="w-full bg-purple-600 hover:bg-purple-700">
                Calculate Sensing Precision
              </Button>
            </TabsContent>
          </Tabs>

          {/* Results Display */}
          {calculationResults && (
            <Card className="mt-4 bg-gray-700 border-green-500">
              <CardHeader>
                <CardTitle className="text-green-400 text-sm">Calculation Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(calculationResults).map(([key, value]) => (
                  key !== 'success' && (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-xs text-gray-300 capitalize">
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {typeof value === 'number' ? 
                          (value < 0.001 ? value.toExponential(3) : value.toFixed(6)) : 
                          JSON.stringify(value).substring(0, 30)
                        }
                      </Badge>
                    </div>
                  )
                ))}
              </CardContent>
            </Card>
          )}

          {/* Formula Reference */}
          <Card className="mt-4 bg-gray-700 border-blue-500">
            <CardHeader>
              <CardTitle className="text-blue-400 text-sm">Quick Reference</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-xs space-y-1">
                <div><strong className="text-yellow-400">Bell States:</strong> |Φ±⟩ = (1/√2)(|00⟩ ± |11⟩)</div>
                <div><strong className="text-yellow-400">Hadamard:</strong> H = (1/√2)[[1,1],[1,-1]]</div>
                <div><strong className="text-yellow-400">QFT:</strong> QFT|j⟩ = (1/√N)∑ₖ e^(2πijk/N)|k⟩</div>
                <div><strong className="text-yellow-400">Concurrence:</strong> C = |⟨ψ|σᵧ⊗σᵧ|ψ*⟩|</div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}

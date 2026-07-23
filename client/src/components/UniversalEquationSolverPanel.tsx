
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { universalEquationSolver } from '../lib/universalEquationSolver';

interface SolutionDisplayProps {
  result: any;
}

const SolutionDisplay: React.FC<SolutionDisplayProps> = ({ result }) => {
  if (!result) return null;
  
  return (
    <div className="space-y-4 p-4 bg-black/20 rounded-lg border border-white/20">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-green-400 border-green-400">
          {result.method.toUpperCase()}
        </Badge>
        <span className="text-sm text-gray-400">
          {result.convergence ? '✅ Converged' : '❌ No convergence'}
        </span>
        {result.iterations && (
          <span className="text-xs text-gray-500">
            ({result.iterations} iterations)
          </span>
        )}
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm font-medium">Solutions:</Label>
        <div className="grid gap-2 max-h-40 overflow-y-auto">
          {result.solutions.length > 0 ? (
            result.solutions.map((solution: any, index: number) => (
              <div key={index} className="p-2 bg-black/30 rounded text-sm font-mono">
                {typeof solution === 'number' 
                  ? `x = ${solution.toFixed(6)}` 
                  : JSON.stringify(solution, null, 2)
                }
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-sm">No solutions found</div>
          )}
        </div>
      </div>
      
      {result.visualizationData && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Visualization Data:</Label>
          <div className="p-2 bg-black/30 rounded text-xs text-gray-300">
            Type: {result.visualizationData.type}
            {result.visualizationData.points && (
              <div>Points: {result.visualizationData.points.length}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function UniversalEquationSolverPanel() {
  const [equation, setEquation] = useState('x^2 - 4');
  const [variables, setVariables] = useState('x');
  const [initialGuess, setInitialGuess] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [classification, setClassification] = useState<any>(null);
  const [examples, setExamples] = useState<any>({});

  // Predefined equation examples
  const equationExamples = {
    linear: [
      { name: 'Simple Linear', eq: '2*x - 4', vars: 'x' },
      { name: 'Multi-variable', eq: 'x + 2*y - 5', vars: 'x,y' }
    ],
    polynomial: [
      { name: 'Quadratic', eq: 'x^2 - 5*x + 6', vars: 'x' },
      { name: 'Cubic', eq: 'x^3 - 6*x^2 + 11*x - 6', vars: 'x' },
      { name: 'System', eq: 'x^2 + y^2 - 1', vars: 'x,y' }
    ],
    transcendental: [
      { name: 'Exponential', eq: 'exp(x) - x - 2', vars: 'x' },
      { name: 'Trigonometric', eq: 'sin(x) - 0.5', vars: 'x' },
      { name: 'Logarithmic', eq: 'log(x) - x + 3', vars: 'x' }
    ],
    differential: [
      { name: 'Simple ODE', eq: "diff(y, x) - x", vars: 'y,x' },
      { name: 'Harmonic', eq: "diff(y, x, 2) + y", vars: 'y,x' }
    ]
  };

  useEffect(() => {
    // Classify equation when it changes
    if (equation.trim()) {
      try {
        const vars = variables.split(',').map(v => v.trim());
        const classResult = universalEquationSolver.classifyEquation(equation, vars);
        setClassification(classResult);
      } catch (error) {
        console.log('Classification error:', error);
      }
    }
  }, [equation, variables]);

  const handleSolve = async () => {
    if (!equation.trim()) return;
    
    setIsLoading(true);
    try {
      const vars = variables.split(',').map(v => v.trim());
      const guess = initialGuess.split(',').map(g => parseFloat(g.trim()));
      
      console.log('🔧 Solving equation:', equation);
      const solutionResult = await universalEquationSolver.solveUniversal(
        equation, 
        vars, 
        guess
      );
      
      setResult(solutionResult);
      
      // Dispatch event for 3D visualization integration
      window.dispatchEvent(new CustomEvent('equationSolved', {
        detail: {
          equation,
          variables: vars,
          result: solutionResult
        }
      }));
      
    } catch (error) {
      console.error('Solving failed:', error);
      setResult({
        method: 'error',
        solutions: [],
        convergence: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadExample = (category: string, example: any) => {
    setEquation(example.eq);
    setVariables(example.vars);
    setResult(null);
  };

  return (
    <Card className="w-full bg-black/40 border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          🔧 Universal Equation Solver
          {classification && (
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              {classification.type} ({classification.complexity})
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs defaultValue="solver" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-black/60">
            <TabsTrigger value="solver" className="data-[state=active]:bg-white/20">
              Solver
            </TabsTrigger>
            <TabsTrigger value="examples" className="data-[state=active]:bg-white/20">
              Examples
            </TabsTrigger>
            <TabsTrigger value="theory" className="data-[state=active]:bg-white/20">
              Theory
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="solver" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="equation" className="text-white">
                  Equation (set equal to 0)
                </Label>
                <Textarea
                  id="equation"
                  value={equation}
                  onChange={(e) => setEquation(e.target.value)}
                  placeholder="Enter equation: x^2 - 4, exp(x) - x - 2, etc."
                  className="bg-black/30 border-white/20 text-white min-h-[80px] font-mono"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="variables" className="text-white">
                    Variables (comma-separated)
                  </Label>
                  <Input
                    id="variables"
                    value={variables}
                    onChange={(e) => setVariables(e.target.value)}
                    placeholder="x, y, z"
                    className="bg-black/30 border-white/20 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="guess" className="text-white">
                    Initial Guess (comma-separated)
                  </Label>
                  <Input
                    id="guess"
                    value={initialGuess}
                    onChange={(e) => setInitialGuess(e.target.value)}
                    placeholder="0, 1, -1"
                    className="bg-black/30 border-white/20 text-white"
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleSolve}
                disabled={isLoading || !equation.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? '🔄 Solving...' : '🎯 Solve Equation'}
              </Button>
              
              {classification && (
                <div className="p-3 bg-black/20 rounded-lg border border-white/10">
                  <div className="text-sm text-gray-300">
                    <div><strong>Type:</strong> {classification.type}</div>
                    <div><strong>Variables:</strong> {classification.variables.join(', ')}</div>
                    <div><strong>Complexity:</strong> {classification.complexity}</div>
                    {classification.degree && (
                      <div><strong>Degree:</strong> {classification.degree}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {result && <SolutionDisplay result={result} />}
          </TabsContent>
          
          <TabsContent value="examples" className="space-y-4">
            <div className="space-y-4">
              {Object.entries(equationExamples).map(([category, examples]) => (
                <div key={category} className="space-y-2">
                  <Label className="text-white capitalize font-medium">
                    {category} Equations
                  </Label>
                  <div className="grid gap-2">
                    {(examples as any[]).map((example, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => loadExample(category, example)}
                        className="justify-start text-left h-auto p-3 bg-black/20 border-white/20 text-white hover:bg-white/10"
                      >
                        <div>
                          <div className="font-medium">{example.name}</div>
                          <div className="text-xs text-gray-400 font-mono">
                            {example.eq}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="theory" className="space-y-4">
            <div className="space-y-4 text-sm text-gray-300">
              <div className="p-4 bg-black/20 rounded-lg border border-white/10">
                <h3 className="font-medium text-white mb-2">🔧 Algorithm Selection</h3>
                <ul className="space-y-1 text-xs">
                  <li>• <strong>Linear:</strong> Gaussian Elimination</li>
                  <li>• <strong>Polynomial (≤4):</strong> Analytical formulas</li>
                  <li>• <strong>Polynomial (≥5):</strong> Gröbner Bases + Numerical</li>
                  <li>• <strong>Transcendental:</strong> Newton-Raphson</li>
                  <li>• <strong>Systems:</strong> Multidimensional Newton</li>
                  <li>• <strong>Differential:</strong> Runge-Kutta methods</li>
                </ul>
              </div>
              
              <div className="p-4 bg-black/20 rounded-lg border border-white/10">
                <h3 className="font-medium text-white mb-2">📚 Mathematical Foundations</h3>
                <ul className="space-y-1 text-xs">
                  <li>• <strong>Gröbner Bases:</strong> Buchberger's Algorithm (1965)</li>
                  <li>• <strong>Newton-Raphson:</strong> Quadratic convergence</li>
                  <li>• <strong>Galois Theory:</strong> Solvability by radicals</li>
                  <li>• <strong>Abel-Ruffini:</strong> No general formula for degree ≥5</li>
                </ul>
              </div>
              
              <div className="p-4 bg-black/20 rounded-lg border border-white/10">
                <h3 className="font-medium text-white mb-2">🎯 Integration with Δmension</h3>
                <ul className="space-y-1 text-xs">
                  <li>• Solutions automatically generate 3D visualizations</li>
                  <li>• Root surfaces rendered as parametric shapes</li>
                  <li>• Function plots integrated with existing geometry</li>
                  <li>• Export solutions as GLB mathematical models</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

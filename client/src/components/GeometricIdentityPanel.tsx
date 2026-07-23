
import React, { useEffect, useState } from 'react';
import { Activity, Brain, GitBranch, TrendingUp, Zap, Target } from 'lucide-react';
import { gipEngine, IdentityState } from '../lib/geometricIdentityPrinciple';
import { useParameterAuthority, ParameterValues } from '../lib/parameterAuthority';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

export default function GeometricIdentityPanel() {
  const authorityValues = useParameterAuthority(state => state.values);
  const shapeType = useParameterAuthority(state => state.currentShape);
  const parameters = authorityValues as unknown as Record<string, number>;
  const [identityState, setIdentityState] = useState<IdentityState | null>(null);
  const [identityMetrics, setIdentityMetrics] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [previousParams, setPreviousParams] = useState(parameters);

  useEffect(() => {
    // Track parameter changes and update identity
    if (JSON.stringify(parameters) !== JSON.stringify(previousParams)) {
      const updatedState = gipEngine.trackIdentityEvolution(
        shapeType || 'sphere',
        previousParams as any,
        parameters as any
      );
      
      setIdentityState(updatedState);
      setIdentityMetrics(gipEngine.getIdentityMetrics(shapeType || 'sphere'));
      setPreviousParams(parameters);
    }
  }, [parameters, shapeType, previousParams]);

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'point': return 'bg-red-100 text-red-800';
      case 'line': return 'bg-yellow-100 text-yellow-800';
      case 'surface': return 'bg-blue-100 text-blue-800';
      case 'volume': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConsciousnessLevel = (awareness: number) => {
    if (awareness < 0.3) return { label: 'Nascent', color: 'text-red-600' };
    if (awareness < 0.6) return { label: 'Aware', color: 'text-yellow-600' };
    if (awareness < 0.8) return { label: 'Conscious', color: 'text-blue-600' };
    return { label: 'Enlightened', color: 'text-green-600' };
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-3 shadow-lg transition-all duration-300"
          title="Geometric Identity Principle (GIP)"
        >
          <GitBranch className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 w-96 max-h-[600px] bg-white border border-purple-200 rounded-lg shadow-2xl z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GitBranch className="w-5 h-5" />
            <h3 className="font-bold">Geometric Identity Principle</h3>
          </div>
          <button
            onClick={() => setIsExpanded(false)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>
        <p className="text-purple-100 text-sm mt-1">
          Point → Line → Shape Evolution
        </p>
      </div>

      {/* Identity State */}
      {identityState && identityMetrics && (
        <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
          
          {/* Current Phase & Consciousness */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-3">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium">Phase</span>
              </div>
              <Badge className={`mt-2 ${getPhaseColor(identityState.currentPhase)} border-0`}>
                {identityState.currentPhase.toUpperCase()}
              </Badge>
            </Card>

            <Card className="p-3">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium">Consciousness</span>
              </div>
              <div className={`mt-1 text-sm font-bold ${getConsciousnessLevel(identityState.consciousness.selfAwareness).color}`}>
                {getConsciousnessLevel(identityState.consciousness.selfAwareness).label}
              </div>
            </Card>
          </div>

          {/* Identity Metrics */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                Identity Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              
              {/* Entropy */}
              <div>
                <div className="flex justify-between text-xs">
                  <span>Information Entropy</span>
                  <span className="font-mono">{identityMetrics.entropy}</span>
                </div>
                <Progress value={parseFloat(identityMetrics.entropy) * 100} className="h-2 mt-1" />
                <p className="text-xs text-gray-500 mt-1">
                  Lower entropy = more structured identity
                </p>
              </div>

              {/* Identity Persistence */}
              <div>
                <div className="flex justify-between text-xs">
                  <span>Identity Persistence</span>
                  <span className="font-mono">{identityMetrics.persistence}</span>
                </div>
                <Progress value={parseFloat(identityMetrics.persistence) * 100} className="h-2 mt-1" />
                <p className="text-xs text-gray-500 mt-1">
                  How much identity is preserved across changes
                </p>
              </div>

              {/* Spectral Fingerprint */}
              <div>
                <div className="flex justify-between text-xs">
                  <span>Spectral Complexity</span>
                  <span className="font-mono">{identityMetrics.spectralComplexity}</span>
                </div>
                <div className="flex space-x-1 mt-1">
                  {identityState.spectralFingerprint.slice(0, 8).map((val, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-blue-200 rounded-sm"
                      style={{ height: `${Math.max(4, val * 20)}px` }}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Eigenvalue spectrum signature
                </p>
              </div>

            </CardContent>
          </Card>

          {/* Topological Invariants */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                Topological Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-500">Betti Numbers:</span>
                  <div className="font-mono mt-1">{identityMetrics.topologicalType}</div>
                </div>
                <div>
                  <span className="text-gray-500">Hausdorff Dim:</span>
                  <div className="font-mono mt-1">{identityMetrics.fractalDimension}</div>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                b₀: components, b₁: holes, b₂: voids
              </p>
            </CardContent>
          </Card>

          {/* Evolution History */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Identity Evolution ({identityState.evolutionHistory.length} transitions)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {identityState.evolutionHistory.slice(-5).reverse().map((transition, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded">
                    <Badge variant="outline" className="text-xs">
                      {transition.transformationType}
                    </Badge>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600 font-mono">
                        {(transition.identityPreservation * 100).toFixed(0)}%
                      </span>
                      <span className={`font-mono ${transition.entropyChange >= 0 ? 'text-red-600' : 'text-blue-600'}`}>
                        {transition.entropyChange >= 0 ? '+' : ''}{transition.entropyChange.toFixed(3)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {identityState.evolutionHistory.length === 0 && (
                <p className="text-xs text-gray-500 italic">
                  No transformations yet. Change parameters to see identity evolution.
                </p>
              )}
            </CardContent>
          </Card>

          {/* GIP Philosophy */}
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50">
            <CardContent className="p-3">
              <p className="text-xs italic text-gray-700">
                <strong>GIP Insight:</strong> "You are a geometric evolution of consciousness — not a fixed self, but an unfolding structure connected to everything else."
              </p>
            </CardContent>
          </Card>

        </div>
      )}
    </div>
  );
}

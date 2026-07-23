
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { analyzePhenomenon, getPhenomena, type Phenomenon } from '../lib/phenomenonPrinciple';
import { Zap, Info, Atom, Waves } from 'lucide-react';

interface PhenomenonPrinciplePanelProps {
  currentShape: string;
  currentParameters: Record<string, number>;
}

export default function PhenomenonPrinciplePanel({ 
  currentShape, 
  currentParameters 
}: PhenomenonPrinciplePanelProps) {
  const [currentPhenomenon, setCurrentPhenomenon] = useState<Phenomenon | null>(null);
  const [allPhenomena, setAllPhenomena] = useState<Phenomenon[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (currentShape && Object.keys(currentParameters).length > 0) {
      const phenomenon = analyzePhenomenon(currentShape, currentParameters);
      setCurrentPhenomenon(phenomenon);
      
      // Update phenomena list
      const phenomena = getPhenomena();
      setAllPhenomena(phenomena.slice(-10)); // Show last 10
    }
  }, [currentShape, currentParameters]);

  if (!currentPhenomenon) {
    return (
      <Card className="bg-gray-900 border-purple-500 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-400" />
            Phenomenon Principle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">Select a shape to analyze phenomenon emergence</p>
        </CardContent>
      </Card>
    );
  }

  const getEmergenceColor = (level: number): string => {
    if (level > 8) return 'text-red-400';
    if (level > 6) return 'text-orange-400';
    if (level > 4) return 'text-yellow-400';
    if (level > 2) return 'text-green-400';
    return 'text-blue-400';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'complex_system': return <Atom className="w-4 h-4" />;
      case 'organized_pattern': return <Waves className="w-4 h-4" />;
      case 'coherent_structure': return <Info className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Current Phenomenon Analysis */}
      <Card className="bg-gray-900 border-purple-500 text-white">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              Phenomenon Principle Analysis
            </div>
            <Badge variant="outline" className="border-purple-400 text-purple-300">
              {currentPhenomenon.type.replace('_', ' ')}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Emergence Level */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">Emergence Level</span>
              <span className={`text-lg font-mono ${getEmergenceColor(currentPhenomenon.emergenceLevel)}`}>
                {currentPhenomenon.emergenceLevel.toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(currentPhenomenon.emergenceLevel * 10, 100)}%` }}
              />
            </div>
          </div>

          {/* Phenomenon Equation */}
          <div>
            <span className="text-sm text-gray-300">Mathematical Expression</span>
            <div className="bg-black p-3 rounded font-mono text-green-400 text-sm mt-1">
              {currentPhenomenon.equation}
            </div>
          </div>

          {/* Manifestation */}
          <div>
            <span className="text-sm text-gray-300">Manifestation</span>
            <p className="text-white text-sm mt-1">{currentPhenomenon.manifestation}</p>
          </div>

          {/* Component Breakdown */}
          <Button 
            onClick={() => setShowDetails(!showDetails)}
            variant="outline" 
            className="w-full border-purple-400 text-purple-300 hover:bg-purple-900"
          >
            {showDetails ? 'Hide' : 'Show'} Component Analysis
          </Button>

          {showDetails && (
            <div className="space-y-3 mt-4 p-3 bg-gray-800 rounded">
              {/* Geometry Component */}
              <div>
                <h4 className="text-purple-300 font-semibold">G (Geometry/Structure)</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Topology: {currentPhenomenon.components.geometry.topology}</div>
                  <div>Symmetry: {currentPhenomenon.components.geometry.symmetry}</div>
                </div>
              </div>

              {/* Energy Component */}
              <div>
                <h4 className="text-orange-300 font-semibold">E (Energy Flow)</h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>Flow: {currentPhenomenon.components.energy.flow.toFixed(2)}</div>
                  <div>Potential: {currentPhenomenon.components.energy.potential.toFixed(2)}</div>
                  <div>Kinetic: {currentPhenomenon.components.energy.kinetic.toFixed(2)}</div>
                </div>
              </div>

              {/* Information Component */}
              <div>
                <h4 className="text-blue-300 font-semibold">I (Information Pattern)</h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>Entropy: {currentPhenomenon.components.information.entropy.toFixed(2)}</div>
                  <div>Complexity: {currentPhenomenon.components.information.complexity.toFixed(2)}</div>
                  <div>Order: {currentPhenomenon.components.information.order.toFixed(2)}</div>
                </div>
              </div>

              {/* Natural Laws Component */}
              <div>
                <h4 className="text-green-300 font-semibold">Λ (Natural Laws)</h4>
                <div className="text-sm space-y-1">
                  <div>Constraints: {Object.keys(currentPhenomenon.components.naturalLaws.constraints).length}</div>
                  <div>Conservation Laws: {currentPhenomenon.components.naturalLaws.conservationLaws.join(', ') || 'None'}</div>
                  <div>Emergent Properties: {currentPhenomenon.components.naturalLaws.emergentProperties.join(', ') || 'None'}</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Phenomena */}
      {allPhenomena.length > 0 && (
        <Card className="bg-gray-900 border-gray-600 text-white">
          <CardHeader>
            <CardTitle className="text-lg">Recent Phenomena</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {allPhenomena.slice(-5).map((phenomenon) => (
                <div key={phenomenon.id} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(phenomenon.type)}
                    <span className="text-sm">{phenomenon.components.geometry.structure}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${getEmergenceColor(phenomenon.emergenceLevel)}`}>
                      {phenomenon.emergenceLevel.toFixed(1)}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {phenomenon.type.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

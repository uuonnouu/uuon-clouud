
/**
 * PROGRAMMING MATRIX VISUALIZATION PANEL
 * Interactive dashboard showing system integration status
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { programmingMatrix, PROGRAMMING_MATRIX, FORMULA_CROSS_REFERENCE } from '../systems/programmingMatrix';

export const ProgrammingMatrixPanel: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const integrationStatus = programmingMatrix.getIntegrationMatrix();
  const recommendations = programmingMatrix.recommendNextImplementation().slice(0, 5);
  
  const categories = ['core', 'math_physics', 'ui_interaction', 'ai_automation', 'integration'];
  
  const filteredModules = selectedCategory === 'all' 
    ? Object.values(PROGRAMMING_MATRIX)
    : Object.values(PROGRAMMING_MATRIX).filter(m => m.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implemented': return 'bg-green-500';
      case 'enhanced': return 'bg-blue-500';
      case 'planned': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="programming-matrix-panel p-4 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📊 Programming Matrix Integration
            <Badge variant="secondary">
              {Object.values(PROGRAMMING_MATRIX).filter(m => m.status === 'implemented' || m.status === 'enhanced').length} / {Object.keys(PROGRAMMING_MATRIX).length} Implemented
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Universal framework cross-referencing formulas, engines, and modules for systematic expansion.
          </p>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('all')}
        >
          All Modules
        </Button>
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category.replace('_', ' ')} ({integrationStatus[category]?.implemented || 0}/{integrationStatus[category]?.total || 0})
          </Button>
        ))}
      </div>

      {/* Integration Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {categories.map(category => {
          const status = integrationStatus[category];
          if (!status) return null;
          
          const completionRate = (status.implemented / status.total) * 100;
          
          return (
            <Card key={category}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {status.implemented}
                </div>
                <div className="text-sm text-gray-500">
                  {category.replace('_', ' ')}
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {completionRate.toFixed(0)}% Complete
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Modules List */}
      <Card>
        <CardHeader>
          <CardTitle>System Modules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {filteredModules.map(module => (
              <div key={module.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(module.status)}`}></div>
                  <div>
                    <div className="font-medium">{module.name}</div>
                    <div className="text-sm text-gray-500">
                      {module.connections.length} connections • {module.category.replace('_', ' ')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={module.status === 'implemented' ? 'default' : 'secondary'}>
                    {module.status}
                  </Badge>
                  {module.uuonIntegration && (
                    <Badge variant="outline" className="text-purple-600">
                      UUON
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Formula Cross-Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Formula Cross-Reference Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {Object.entries(FORMULA_CROSS_REFERENCE).map(([id, formula]) => (
              <div key={id} className="border rounded-lg p-4">
                <div className="font-mono text-sm bg-gray-100 p-2 rounded mb-2">
                  {formula.formula}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-600">Engines:</div>
                    <div className="flex flex-wrap gap-1">
                      {formula.engines.map(engine => (
                        <Badge key={engine} variant="outline" className="text-xs">
                          {engine.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-600">Parameters:</div>
                    <div className="flex gap-1">
                      {formula.parameters.map(param => (
                        <Badge key={param} variant="secondary" className="text-xs">
                          {param}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-600">Portal Values:</div>
                    <div className="text-xs text-blue-600">
                      {formula.portalValues.map(val => val.toFixed(3)).join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Implementation Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Next Implementations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div key={rec.module.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">#{index + 1}</Badge>
                  <div>
                    <div className="font-medium">{rec.module.name}</div>
                    <div className="text-sm text-gray-500">{rec.reason}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-blue-600">
                    Priority: {rec.priority}
                  </div>
                  <Badge variant="secondary">{rec.module.category.replace('_', ' ')}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgrammingMatrixPanel;


/**
 * BLOCKCHAIN ALGORITHMS VISUALIZATION PANEL
 * Interactive interface for exploring consensus mechanisms, cryptographic primitives,
 * and proof systems from the blockchain ecosystem
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Shield, Zap, Lock, Network, Eye, Cpu } from 'lucide-react';
import { 
  ALL_BLOCKCHAIN_ALGORITHMS, 
  getAlgorithmsByCategory, 
  BlockchainAlgorithm,
  ALGORITHM_METRICS,
  AlgorithmMetrics
} from '../lib/blockchainAlgorithmsEngine';

interface BlockchainAlgorithmsPanelProps {
  onAlgorithmSelect: (algorithm: BlockchainAlgorithm) => void;
  isVisible?: boolean;
}

const CATEGORY_ICONS = {
  consensus: Shield,
  cryptographic: Lock,
  proof_systems: Eye,
  layer2: Network,
  privacy: Eye,
  post_quantum: Cpu
};

const CATEGORY_COLORS = {
  consensus: 'bg-blue-500',
  cryptographic: 'bg-green-500', 
  proof_systems: 'bg-purple-500',
  layer2: 'bg-orange-500',
  privacy: 'bg-pink-500',
  post_quantum: 'bg-red-500'
};

export default function BlockchainAlgorithmsPanel({ 
  onAlgorithmSelect, 
  isVisible = true 
}: BlockchainAlgorithmsPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | BlockchainAlgorithm['category']>('all');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<BlockchainAlgorithm | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAlgorithms = selectedCategory === 'all' 
    ? ALL_BLOCKCHAIN_ALGORITHMS 
    : getAlgorithmsByCategory(selectedCategory);

  const searchFilteredAlgorithms = filteredAlgorithms.filter(algo =>
    algo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    algo.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAlgorithmClick = (algorithm: BlockchainAlgorithm) => {
    setSelectedAlgorithm(algorithm);
    onAlgorithmSelect(algorithm);
  };

  const getMetrics = (algorithmId: string): AlgorithmMetrics | null => {
    return ALGORITHM_METRICS[algorithmId] || null;
  };

  if (!isVisible) return null;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            Blockchain & Cryptographic Algorithms Visualizer
          </CardTitle>
          <CardDescription>
            Explore {ALL_BLOCKCHAIN_ALGORITHMS.length} cutting-edge algorithms from consensus mechanisms 
            to post-quantum cryptography through interactive 3D visualizations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search algorithms..."
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              size="sm"
            >
              All ({ALL_BLOCKCHAIN_ALGORITHMS.length})
            </Button>
            {Object.keys(CATEGORY_ICONS).map((category) => {
              const Icon = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS];
              const count = getAlgorithmsByCategory(category as BlockchainAlgorithm['category']).length;
              return (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category as BlockchainAlgorithm['category'])}
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Icon className="w-4 h-4" />
                  {category.replace('_', ' ')} ({count})
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Algorithm Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {searchFilteredAlgorithms.map((algorithm) => {
          const Icon = CATEGORY_ICONS[algorithm.category];
          const colorClass = CATEGORY_COLORS[algorithm.category];
          const metrics = getMetrics(algorithm.id);
          
          return (
            <Card 
              key={algorithm.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedAlgorithm?.id === algorithm.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handleAlgorithmClick(algorithm)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${colorClass}`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold">
                        {algorithm.name}
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {algorithm.category.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {algorithm.description}
                </p>
                
                {metrics && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Scalability:</span>
                      <Badge 
                        variant={metrics.scalability === 'high' ? 'default' : 
                                metrics.scalability === 'medium' ? 'secondary' : 'outline'}
                      >
                        {metrics.scalability}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Quantum Resistance:</span>
                      <Badge 
                        variant={metrics.quantumResistance === 'quantum_safe' ? 'default' : 
                                metrics.quantumResistance === 'resistant' ? 'secondary' : 'outline'}
                      >
                        {metrics.quantumResistance.replace('_', ' ')}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Energy:</span>
                      <Badge 
                        variant={metrics.energyEfficiency === 'high' ? 'default' : 
                                metrics.energyEfficiency === 'medium' ? 'secondary' : 'outline'}
                      >
                        {metrics.energyEfficiency}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Algorithm Details */}
      {selectedAlgorithm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {React.createElement(CATEGORY_ICONS[selectedAlgorithm.category], { 
                className: "w-5 h-5" 
              })}
              {selectedAlgorithm.name} - Technical Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
                <TabsTrigger value="parameters">Parameters</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">How it Works</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedAlgorithm.description}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Category</h4>
                  <Badge className={CATEGORY_COLORS[selectedAlgorithm.category]}>
                    {selectedAlgorithm.category.replace('_', ' ')}
                  </Badge>
                </div>
              </TabsContent>
              
              <TabsContent value="metrics" className="space-y-4">
                {getMetrics(selectedAlgorithm.id) ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(getMetrics(selectedAlgorithm.id)!).map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <span className="text-sm font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <div className="text-sm">
                          {Array.isArray(value) ? (
                            <div className="flex flex-wrap gap-1">
                              {value.map((item, idx) => (
                                <Badge key={idx} variant="outline">{item}</Badge>
                              ))}
                            </div>
                          ) : (
                            <Badge variant="secondary">{value}</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No metrics available for this algorithm.</p>
                )}
              </TabsContent>
              
              <TabsContent value="parameters" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Default Parameters</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Object.entries(selectedAlgorithm.defaultParams).map(([key, value]) => (
                      <div key={key} className="text-xs">
                        <span className="font-mono text-blue-600">{key}:</span>
                        <span className="ml-1">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button
                  onClick={() => onAlgorithmSelect(selectedAlgorithm)}
                  className="w-full"
                >
                  Visualize Algorithm
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
            {Object.entries(CATEGORY_ICONS).map(([category, Icon]) => {
              const count = getAlgorithmsByCategory(category as BlockchainAlgorithm['category']).length;
              return (
                <div key={category} className="space-y-1">
                  <div className={`p-3 rounded-lg ${CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]} mx-auto w-fit`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-sm font-semibold">{count}</div>
                  <div className="text-xs text-gray-500 capitalize">
                    {category.replace('_', ' ')}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Search, BookOpen, Bridge, TrendingUp, Zap } from 'lucide-react';
import { sdkClient } from '../lib/unifiedSDKClient';

interface DynamicGapAnalysisResult {
  totalPassagesAnalyzed: number;
  dynamicGapsFound: Array<{
    reference: string;
    gaps: string[];
    bridges: string[];
    completions: string[];
    text: string;
  }>;
  gapTypes: Record<string, number>;
  bridgeEffectiveness: Record<string, number>;
  completionPatterns: Record<string, Array<{
    reference: string;
    pattern: string;
  }>>;
  summary: {
    totalGapsIdentified: number;
    totalBridgingMechanisms: number;
    mostCommonGapTypes: Array<[string, number]>;
    mostEffectiveBridges: Array<[string, number]>;
    keyInsights: string[];
    averageCompletionRatio: number;
  };
}

export default function BiblicalAnalysisPanel() {
  const [analysisResult, setAnalysisResult] = useState<DynamicGapAnalysisResult | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [bridgingAnalysis, setBridgingAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runDynamicGapAnalysis = async () => {
    setIsLoading(true);
    try {
      const result = await sdkClient.legacyCall('/api/biblical/analyze-dynamic-gaps', 'GET');
      
      if (result.success && result.data?.success) {
        setAnalysisResult(result.data.analysis);
      } else {
        console.error('Analysis failed:', result.error || result.data?.error);
      }
    } catch (error) {
      console.error('Error running Biblical gap analysis:', error);
    }
    setIsLoading(false);
  };

  const searchGapPatterns = async () => {
    if (!searchKeyword.trim()) return;
    
    setIsLoading(true);
    try {
      const result = await sdkClient.legacyCall(`/api/biblical/search-gap-patterns/${encodeURIComponent(searchKeyword)}`, 'GET');
      
      if (result.success && result.data?.success) {
        setSearchResults(result.data.results);
      }
    } catch (error) {
      console.error('Error searching gap patterns:', error);
    }
    setIsLoading(false);
  };

  const analyzeDynamicBridging = async () => {
    setIsLoading(true);
    try {
      const result = await sdkClient.legacyCall('/api/biblical/dynamic-bridging-analysis', 'GET');
      
      if (result.success && result.data?.success) {
        setBridgingAnalysis(result.data.analysis);
      }
    } catch (error) {
      console.error('Error analyzing dynamic bridging:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Bridge className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Biblical Dynamic Gap Analysis</h2>
        </div>
        
        <p className="text-gray-600 mb-6">
          Analyze Biblical texts for dynamic gaps, bridging mechanisms, and completion patterns.
        </p>

        <Tabs defaultValue="gaps" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="gaps">Dynamic Gaps</TabsTrigger>
            <TabsTrigger value="search">Pattern Search</TabsTrigger>
            <TabsTrigger value="bridging">Bridging Analysis</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          {/* Dynamic Gap Analysis Tab */}
          <TabsContent value="gaps" className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Comprehensive Dynamic Gap Analysis</h3>
                <Button 
                  onClick={runDynamicGapAnalysis} 
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {isLoading ? 'Analyzing...' : 'Run Analysis'}
                </Button>
              </div>
              
              {analysisResult && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {analysisResult.summary.totalGapsIdentified}
                      </div>
                      <div className="text-sm text-red-800">Dynamic Gaps Found</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {analysisResult.summary.totalBridgingMechanisms}
                      </div>
                      <div className="text-sm text-blue-800">Bridging Mechanisms</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {Object.keys(analysisResult.completionPatterns).length}
                      </div>
                      <div className="text-sm text-green-800">Completion Patterns</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {(analysisResult.summary.averageCompletionRatio * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-purple-800">Avg Completion Rate</div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-800 mb-3">Key Insights</h4>
                    <div className="space-y-2">
                      {analysisResult.summary.keyInsights.map((insight, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-gray-700">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Most Common Gap Types</h4>
                      <div className="space-y-2">
                        {analysisResult.summary.mostCommonGapTypes.map(([type, count]) => (
                          <div key={type} className="flex justify-between items-center p-2 bg-red-50 rounded">
                            <span className="text-sm font-medium">{type}</span>
                            <Badge variant="secondary">{count}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Most Effective Bridges</h4>
                      <div className="space-y-2">
                        {analysisResult.summary.mostEffectiveBridges.map(([bridge, count]) => (
                          <div key={bridge} className="flex justify-between items-center p-2 bg-green-50 rounded">
                            <span className="text-sm font-medium">{bridge}</span>
                            <Badge variant="secondary">{count}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Pattern Search Tab */}
          <TabsContent value="search" className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-4">
                <Search className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Gap Pattern Search</h3>
              </div>
              
              <div className="flex space-x-2 mb-4">
                <Input
                  placeholder="Enter keyword (e.g., 'void', 'bridge', 'gap', 'divide')"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={searchGapPatterns} 
                  disabled={isLoading || !searchKeyword.trim()}
                >
                  Search
                </Button>
              </div>

              {searchResults && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">
                      Results for "{searchResults.keyword}" ({searchResults.totalMatches} matches)
                    </h4>
                  </div>

                  <div className="space-y-3">
                    {searchResults.passages.map((passage: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            {passage.reference}
                          </Badge>
                          <div className="text-xs text-gray-500">
                            Gap/Bridge Ratio: {passage.gapBridgeRatio.toFixed(2)} | 
                            Sum: {passage.numericalSignificance.sum}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">"{passage.text}"</p>
                        
                        {passage.relevantGaps.length > 0 && (
                          <div className="mb-2">
                            <span className="text-xs font-medium text-red-600">Gaps: </span>
                            <div className="flex flex-wrap gap-1">
                              {passage.relevantGaps.map((gap: string, i: number) => (
                                <Badge key={i} variant="destructive" className="text-xs">
                                  {gap}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {passage.relevantBridges.length > 0 && (
                          <div>
                            <span className="text-xs font-medium text-green-600">Bridges: </span>
                            <div className="flex flex-wrap gap-1">
                              {passage.relevantBridges.map((bridge: string, i: number) => (
                                <Badge key={i} variant="secondary" className="text-xs bg-green-100">
                                  {bridge}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Bridging Analysis Tab */}
          <TabsContent value="bridging" className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Bridge className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">Dynamic Bridging Mechanisms</h3>
                </div>
                <Button 
                  onClick={analyzeDynamicBridging} 
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Analyze
                </Button>
              </div>

              {bridgingAnalysis && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Bridge Types</h4>
                    <div className="grid gap-4">
                      {bridgingAnalysis.bridgeTypes.map((bridge: any, index: number) => (
                        <div key={index} className="border rounded-lg p-3 bg-blue-50">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">{bridge.type}</Badge>
                            <span className="text-xs text-blue-600">{bridge.effectiveness}</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-1">
                            <strong>Mechanism:</strong> {bridge.mechanism}
                          </p>
                          <p className="text-xs text-blue-700">
                            <strong>Examples:</strong> {bridge.examples.join(', ')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Dynamic Properties</h4>
                    <div className="grid gap-3">
                      {bridgingAnalysis.dynamicProperties.map((prop: any, index: number) => (
                        <div key={index} className="border rounded-lg p-3 bg-purple-50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-lg font-bold text-purple-600">{prop.property}</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-1">
                            <strong>Biblical Principle:</strong> {prop.biblicalPrinciple}
                          </p>
                          <p className="text-sm text-gray-700 mb-1">
                            <strong>Dynamic Aspect:</strong> {prop.dynamicAspect}
                          </p>
                          <p className="text-xs text-purple-700">
                            <strong>System Application:</strong> {prop.systemApplication}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Mathematical Models</h4>
                    <div className="space-y-3">
                      {bridgingAnalysis.mathematicalModels.map((model: any, index: number) => (
                        <div key={index} className="border rounded-lg p-3 bg-green-50">
                          <h5 className="font-medium text-green-800 mb-2">{model.concept}</h5>
                          <div className="text-sm space-y-1">
                            <div className="bg-white p-2 rounded font-mono text-xs">
                              {model.equation}
                            </div>
                            <p><strong>Biblical Basis:</strong> {model.biblicalBasis}</p>
                            <p className="text-green-700">
                              <strong>Application Example:</strong> {model.applicationExample}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Results Summary Tab */}
          <TabsContent value="results" className="space-y-4">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Gap Analysis Summary</h3>
              
              {analysisResult ? (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Dynamic Gaps & Bridges Found</h4>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {analysisResult.dynamicGapsFound.map((finding, index) => (
                        <div key={index} className="border rounded-lg p-3 bg-gray-50">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">{finding.reference}</Badge>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">"{finding.text}"</p>
                          
                          {finding.gaps.length > 0 && (
                            <div className="mb-2">
                              <span className="text-xs font-medium text-red-600">Gaps: </span>
                              <div className="flex flex-wrap gap-1">
                                {finding.gaps.map((gap, i) => (
                                  <Badge key={i} variant="destructive" className="text-xs">
                                    {gap}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {finding.bridges.length > 0 && (
                            <div className="mb-2">
                              <span className="text-xs font-medium text-green-600">Bridges: </span>
                              <div className="flex flex-wrap gap-1">
                                {finding.bridges.map((bridge, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs bg-green-100">
                                    {bridge}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {finding.completions.length > 0 && (
                            <div>
                              <span className="text-xs font-medium text-blue-600">Completions: </span>
                              <div className="flex flex-wrap gap-1">
                                {finding.completions.map((completion, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs bg-blue-100">
                                    {completion}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Bridge className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Run the Dynamic Gap Analysis to see detailed results here.</p>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

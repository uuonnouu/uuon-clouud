
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { UNIFIED_SHAPES } from '../lib/unifiedShapes';
import { Microscope, FlaskConical, Zap, AlertTriangle } from 'lucide-react';
import { sdkClient } from '../lib/unifiedSDKClient';

interface FormulaMapping {
  formulaId: string;
  name: string;
  category: string;
  inputSignature: any;
  outputSignature: any;
  operationalBreakdown: any;
  structuralCharacterization: any;
  compatibilityScan: any;
  mergePotentialRating: any;
}

export default function FormulaMappingPanel() {
  const [selectedFormulas, setSelectedFormulas] = useState<string[]>([]);
  const [mappingResults, setMappingResults] = useState<FormulaMapping[]>([]);
  const [analysisReport, setAnalysisReport] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'select' | 'analyze' | 'fusion' | 'report'>('select');
  
  // Fusion state
  const [selectedFormula1, setSelectedFormula1] = useState<string>('');
  const [selectedFormula2, setSelectedFormula2] = useState<string>('');
  const [fusionMode, setFusionMode] = useState<string>('harmonic');
  const [fusionResult, setFusionResult] = useState<any>(null);

  const availableFormulas = Object.keys(UNIFIED_SHAPES).slice(0, 50); // Limit for demo

  const handleAnalyzeFormula = async (formulaId: string) => {
    try {
      setLoading(true);
      const result = await sdkClient.analyzeFormula(formulaId, {});
      
      if (result.success && result.data?.mapping) {
        setMappingResults(prev => [...prev.filter(m => m.formulaId !== formulaId), result.data.mapping]);
      }
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (selectedFormulas.length === 0) return;

    try {
      setLoading(true);
      const result = await sdkClient.legacyCall('/api/formula-mapping/report', 'POST', { formulaIds: selectedFormulas });
      
      if (result.success && result.data?.report) {
        setAnalysisReport(result.data.report);
        setActiveTab('report');
      }
    } catch (error) {
      console.error('Report generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFuseFormulas = async () => {
    if (!selectedFormula1 || !selectedFormula2) return;

    try {
      setLoading(true);
      const result = await sdkClient.legacyCall('/api/formula-mapping/fuse', 'POST', {
        formula1Id: selectedFormula1,
        formula2Id: selectedFormula2,
        blendMode: fusionMode,
        weight1: 0.5,
        weight2: 0.5,
        preserveStructure: true,
        enableHybridization: true
      });
      
      if (result.success && result.data?.fusion) {
        setFusionResult(result.data.fusion);
        console.log('🔗 Fusion successful:', result.data.fusion.equation);
      }
    } catch (error) {
      console.error('Fusion error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMergePotentialColor = (rating: string) => {
    switch (rating) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Microscope className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold">Formula Mapping Protocol</h2>
        <Badge variant="outline">Advanced Analysis System</Badge>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2">
        <Button 
          variant={activeTab === 'select' ? 'default' : 'outline'}
          onClick={() => setActiveTab('select')}
          className="flex items-center gap-2"
        >
          <FlaskConical className="w-4 h-4" />
          Select Formulas
        </Button>
        <Button 
          variant={activeTab === 'analyze' ? 'default' : 'outline'}
          onClick={() => setActiveTab('analyze')}
          className="flex items-center gap-2"
        >
          <Zap className="w-4 h-4" />
          Analysis Results
        </Button>
        <Button 
          variant={activeTab === 'fusion' ? 'default' : 'outline'}
          onClick={() => setActiveTab('fusion')}
          className="flex items-center gap-2"
          disabled={mappingResults.length < 2}
        >
          🔗 Formula Fusion
        </Button>
        <Button 
          variant={activeTab === 'report' ? 'default' : 'outline'}
          onClick={() => setActiveTab('report')}
          className="flex items-center gap-2"
        >
          <Microscope className="w-4 h-4" />
          Mapping Report
        </Button>
      </div>

      {/* Formula Selection Tab */}
      {activeTab === 'select' && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Select Formulas for Analysis</h3>
          
          <div className="space-y-4">
            <Select onValueChange={(value) => {
              if (value && !selectedFormulas.includes(value)) {
                setSelectedFormulas([...selectedFormulas, value]);
                handleAnalyzeFormula(value);
              }
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a formula to analyze..." />
              </SelectTrigger>
              <SelectContent>
                {availableFormulas.map(formulaId => (
                  <SelectItem key={formulaId} value={formulaId}>
                    {UNIFIED_SHAPES[formulaId]?.name || formulaId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedFormulas.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Selected Formulas:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedFormulas.map(formulaId => (
                    <Badge 
                      key={formulaId} 
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => setSelectedFormulas(prev => 
                        prev.filter(f => f !== formulaId)
                      )}
                    >
                      {UNIFIED_SHAPES[formulaId]?.name || formulaId} ×
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Button 
              onClick={handleGenerateReport}
              disabled={loading || selectedFormulas.length === 0}
              className="w-full"
            >
              {loading ? 'Generating Analysis...' : 'Generate Mapping Report'}
            </Button>
          </div>
        </Card>
      )}

      {/* Analysis Results Tab */}
      {activeTab === 'analyze' && (
        <div className="space-y-4">
          {mappingResults.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-600">No formulas analyzed yet. Select formulas to begin analysis.</p>
            </Card>
          ) : (
            mappingResults.map((mapping) => (
              <Card key={mapping.formulaId} className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{mapping.name}</h3>
                    <p className="text-sm text-gray-600">{mapping.category} • {mapping.formulaId}</p>
                  </div>
                  <Badge className={getMergePotentialColor(mapping.mergePotentialRating.rating)}>
                    {mapping.mergePotentialRating.rating.toUpperCase()} MERGE POTENTIAL
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Input/Output Signatures */}
                  <div>
                    <h4 className="font-medium mb-2">Input/Output Signature</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Variables:</strong> {mapping.inputSignature.variables.map(v => v.name).join(', ')}</p>
                      <p><strong>Parameters:</strong> {mapping.inputSignature.parameters.map(p => p.name).join(', ')}</p>
                      <p><strong>Output:</strong> {mapping.outputSignature.outputForm} ({mapping.outputSignature.dimensions}D)</p>
                    </div>
                  </div>

                  {/* Structural Info */}
                  <div>
                    <h4 className="font-medium mb-2">Structure Analysis</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Shape:</strong> {mapping.structuralCharacterization.shape}</p>
                      <p><strong>Dependencies:</strong> {mapping.structuralCharacterization.dependencies.external.join(', ')}</p>
                      <p><strong>Error Risks:</strong> 
                        {mapping.structuralCharacterization.errorProneSection.map((error, i) => (
                          <span key={i} className={`ml-2 ${getRiskLevelColor(error.riskLevel)}`}>
                            {error.riskLevel}
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Compatibility */}
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Compatibility Analysis</h4>
                  <div className="flex gap-4 text-sm">
                    <span className="text-green-600">
                      ✓ {mapping.compatibilityScan.alignments.length} Compatible
                    </span>
                    <span className="text-red-600">
                      ⚠ {mapping.compatibilityScan.conflicts.length} Conflicts
                    </span>
                    <span className="text-blue-600">
                      Confidence: {(mapping.mergePotentialRating.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Mapping Report Tab */}
      {activeTab === 'report' && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Microscope className="w-5 h-5" />
            Comprehensive Mapping Report
          </h3>
          
          {analysisReport ? (
            <div className="space-y-4">
              <Textarea 
                value={analysisReport}
                readOnly
                className="font-mono text-sm h-96 bg-gray-50"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={() => navigator.clipboard.writeText(analysisReport)}
                  variant="outline"
                >
                  Copy Report
                </Button>
                <Button 
                  onClick={() => {
                    const blob = new Blob([analysisReport], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'formula-mapping-report.txt';
                    a.click();
                  }}
                  variant="outline"
                >
                  Download Report
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">
              Generate a mapping report by selecting formulas and clicking "Generate Mapping Report"
            </p>
          )}
        </Card>
      )}

      {/* Formula Fusion Tab */}
      {activeTab === 'fusion' && (
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              🔗 Intelligent Formula Fusion
            </h3>
            
            {mappingResults.length < 2 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Need at least 2 analyzed formulas to enable fusion.</p>
                <p className="text-sm text-gray-500 mt-2">Analyze more formulas in the "Select Formulas" tab.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Formula 1</h4>
                    <Select onValueChange={(value) => setSelectedFormula1(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose first formula..." />
                      </SelectTrigger>
                      <SelectContent>
                        {mappingResults.map(mapping => (
                          <SelectItem key={mapping.formulaId} value={mapping.formulaId}>
                            {mapping.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Formula 2</h4>
                    <Select onValueChange={(value) => setSelectedFormula2(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose second formula..." />
                      </SelectTrigger>
                      <SelectContent>
                        {mappingResults.map(mapping => (
                          <SelectItem key={mapping.formulaId} value={mapping.formulaId}>
                            {mapping.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Fusion Mode</h4>
                  <Select onValueChange={(value) => setFusionMode(value)} defaultValue="harmonic">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="additive">Additive - Linear combination</SelectItem>
                      <SelectItem value="multiplicative">Multiplicative - Exponential interaction</SelectItem>
                      <SelectItem value="harmonic">Harmonic - Smooth sinusoidal blending</SelectItem>
                      <SelectItem value="geometric">Geometric - Exponential interpolation</SelectItem>
                      <SelectItem value="parametric">Parametric - User-controlled morphing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleFuseFormulas}
                  disabled={!selectedFormula1 || !selectedFormula2 || selectedFormula1 === selectedFormula2 || loading}
                  className="w-full"
                >
                  {loading ? 'Fusing Formulas...' : '🔗 Fuse Formulas'}
                </Button>

                {fusionResult && (
                  <Card className="p-4 bg-green-50 border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">✅ Fusion Complete!</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Equation:</strong> {fusionResult.equation}</p>
                      <p><strong>Safety Level:</strong> 
                        <Badge className={`ml-2 ${
                          fusionResult.safetyReport.safetyLevel === 'SAFE' ? 'bg-green-100 text-green-800' :
                          fusionResult.safetyReport.safetyLevel === 'CAUTION' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {fusionResult.safetyReport.safetyLevel}
                        </Badge>
                      </p>
                      <p><strong>Stability Score:</strong> {(fusionResult.mathematicalProperties.stabilityScore * 100).toFixed(1)}%</p>
                      
                      {fusionResult.safetyReport.benefits.length > 0 && (
                        <div>
                          <strong>Benefits:</strong>
                          <ul className="list-disc list-inside ml-2">
                            {fusionResult.safetyReport.benefits.map((benefit, i) => (
                              <li key={i} className="text-green-700">{benefit}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {fusionResult.safetyReport.warnings.length > 0 && (
                        <div>
                          <strong>Warnings:</strong>
                          <ul className="list-disc list-inside ml-2">
                            {fusionResult.safetyReport.warnings.map((warning, i) => (
                              <li key={i} className="text-yellow-700">{warning}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Status Information */}
      <Card className="p-4 bg-blue-50">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-800">Formula Mapping Protocol Status</p>
            <p className="text-blue-700">
              This system analyzes mathematical formulas and creates intelligent fused combinations.
              Use this for safe formula fusion and optimization workflows.
            </p>
            <p className="text-blue-700 mt-2">
              <strong>Current Analysis:</strong> {mappingResults.length} formulas mapped
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

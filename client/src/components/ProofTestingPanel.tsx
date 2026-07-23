
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Download, Play, Shield, CheckCircle, XCircle, Clock } from 'lucide-react';
import { sdkClient } from '../lib/unifiedSDKClient';

interface ProofTestingPanelProps {
  className?: string;
}

export default function ProofTestingPanel({ className }: ProofTestingPanelProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);

  const runProofTests = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults(null);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 5, 90));
      }, 200);

      const result = await sdkClient.runProofTests({});

      clearInterval(progressInterval);
      setProgress(100);

      if (result.success && result.data) {
        setResults(result.data.report);
      } else {
        throw new Error('Proof testing failed');
      }
    } catch (error) {
      console.error('Proof testing error:', error);
      alert('Proof testing failed');
    } finally {
      setIsRunning(false);
    }
  };

  const downloadCertificate = async () => {
    if (!results) return;

    try {
      const result = await sdkClient.generateCertificate({ report: results });

      if (result.success && result.data) {
        const blob = new Blob([result.data.certificate], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `mathematical-proof-certificate-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Certificate download failed:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-blue-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="w-4 h-4 text-green-400" />;
    if (score >= 70) return <Clock className="w-4 h-4 text-yellow-400" />;
    return <XCircle className="w-4 h-4 text-red-400" />;
  };

  return (
    <Card className={`bg-black/40 border-cyan-500/30 ${className}`}>
      <CardHeader>
        <CardTitle className="text-cyan-400 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Mathematical Proof Testing & System Health
        </CardTitle>
        <div className="text-xs text-gray-400 flex items-center gap-4">
          <span>Platform: Δmension v2.1</span>
          <span>Status: Active</span>
          <span>Shapes: 676</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!results && !isRunning && (
          <div className="space-y-3">
            <p className="text-gray-300 text-sm">
              Verify mathematical accuracy, numerical stability, and algorithmic correctness
            </p>
            <Button 
              onClick={runProofTests}
              className="w-full bg-cyan-600 hover:bg-cyan-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Run Comprehensive Proof Tests
            </Button>
          </div>
        )}

        {isRunning && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 animate-pulse text-cyan-400" />
              <span className="text-cyan-400">Running proof tests...</span>
            </div>
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-400">{progress}% complete</p>
          </div>
        )}

        {results && (
          <div className="space-y-4">
            {/* Overall Results */}
            <div className="bg-gray-900/50 p-4 rounded space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Overall Score</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(results.averageScore)}
                  <span className={`font-bold text-lg ${getScoreColor(results.averageScore)}`}>
                    {results.averageScore.toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="text-gray-400">Total Shapes</div>
                  <div className="text-cyan-400 font-bold">{results.totalShapes}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400">Passed</div>
                  <div className="text-green-400 font-bold">{results.passedTests}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400">Failed</div>
                  <div className="text-red-400 font-bold">{results.failedTests}</div>
                </div>
              </div>

              <Badge 
                variant={results.averageScore >= 90 ? "default" : results.averageScore >= 70 ? "secondary" : "destructive"}
                className="w-full justify-center"
              >
                {results.averageScore >= 90 ? 'MATHEMATICALLY CERTIFIED' : 
                 results.averageScore >= 70 ? 'ACCEPTABLE ACCURACY' : 
                 'REQUIRES IMPROVEMENT'}
              </Badge>
            </div>

            {/* Critical Issues */}
            {results.criticalIssues.length > 0 && (
              <div className="bg-red-900/20 border border-red-500/30 p-3 rounded">
                <h4 className="text-red-400 font-semibold mb-2 text-sm">Critical Issues</h4>
                <div className="space-y-1 text-xs">
                  {results.criticalIssues.slice(0, 3).map((issue: string, index: number) => (
                    <div key={index} className="text-red-300">• {issue}</div>
                  ))}
                  {results.criticalIssues.length > 3 && (
                    <div className="text-red-400">... and {results.criticalIssues.length - 3} more</div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={downloadCertificate}
                className="flex-1 text-xs"
                disabled={results.averageScore < 70}
              >
                <Download className="w-3 h-3 mr-1" />
                Certificate
              </Button>
              <Button
                onClick={runProofTests}
                size="sm"
                className="flex-1 bg-cyan-600/80 hover:bg-cyan-700 text-xs"
              >
                Re-test
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

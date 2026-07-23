
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { sdkClient } from '../lib/unifiedSDKClient';

interface StorageMetrics {
  diskUsage: string;
  cacheHitRatio: string;
  assetLoadTime: string;
  optimizationStatus: string;
  lastOptimization: string;
}

export default function StorageOptimizationPanel() {
  const [metrics, setMetrics] = useState<StorageMetrics | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [report, setReport] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const result = await sdkClient.legacyCall('/api/storage-optimization/metrics', 'GET');
      if (result.success && result.data?.success) {
        setMetrics(result.data.metrics);
      }
    } catch (error) {
      console.error('Failed to fetch storage metrics:', error);
    }
  };

  const initializeOptimization = async () => {
    setLoading(true);
    try {
      const result = await sdkClient.legacyCall('/api/storage-optimization/initialize', 'POST');
      if (result.success && result.data?.success) {
        console.log('Storage optimization initialized');
        fetchMetrics();
      }
    } catch (error) {
      console.error('Failed to initialize storage optimization:', error);
    } finally {
      setLoading(false);
    }
  };

  const optimizeForMath = async () => {
    setIsOptimizing(true);
    try {
      const result = await sdkClient.legacyCall('/api/storage-optimization/optimize-mathematical', 'POST');
      if (result.success && result.data?.success) {
        console.log('Mathematical visualization optimization complete');
        fetchMetrics();
      }
    } catch (error) {
      console.error('Failed to optimize for mathematical visualization:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      const result = await sdkClient.legacyCall('/api/storage-optimization/report', 'GET');
      if (result.success && result.data?.success) {
        setReport(result.data.report);
      }
    } catch (error) {
      console.error('Failed to generate optimization report:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCacheHitPercentage = (ratio: string): number => {
    const match = ratio.match(/(\d+)%/);
    return match ? parseInt(match[1]) : 0;
  };

  return (
    <div className="space-y-4 p-4 bg-gray-900 text-white max-h-screen overflow-y-auto">
      <Card className="bg-gray-800 border-blue-500">
        <CardHeader>
          <CardTitle className="text-blue-400">🗄️ Storage Optimization Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Control Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={initializeOptimization}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1"
            >
              {loading ? 'Initializing...' : 'Initialize System'}
            </Button>
            
            <Button 
              onClick={optimizeForMath}
              disabled={isOptimizing}
              className="bg-purple-600 hover:bg-purple-700 text-xs px-2 py-1"
            >
              {isOptimizing ? 'Optimizing...' : 'Optimize for Math'}
            </Button>
            
            <Button 
              onClick={generateReport}
              disabled={loading}
              variant="outline"
              className="text-xs px-2 py-1"
            >
              Generate Report
            </Button>
          </div>

          {/* Storage Metrics */}
          {metrics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-cyan-400">Storage Status</h4>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Disk Usage:</span>
                  <Badge variant="secondary" className="text-xs">
                    {metrics.diskUsage}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Cache Hit Ratio:</span>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getCacheHitPercentage(metrics.cacheHitRatio) > 80 ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}
                  >
                    {metrics.cacheHitRatio}
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  <span className="text-xs text-gray-400">Cache Performance:</span>
                  <Progress 
                    value={getCacheHitPercentage(metrics.cacheHitRatio)} 
                    className="h-2"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-orange-400">Performance</h4>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Asset Load Time:</span>
                  <Badge variant="secondary" className="text-xs">
                    {metrics.assetLoadTime}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Status:</span>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${metrics.optimizationStatus === 'Active' ? 'bg-green-900 text-green-300' : 'bg-gray-700'}`}
                  >
                    {metrics.optimizationStatus}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Last Optimized:</span>
                  <span className="text-xs text-gray-300">
                    {new Date(metrics.lastOptimization).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Optimization Report */}
          {report && (
            <Card className="bg-gray-700 border-green-500">
              <CardHeader>
                <CardTitle className="text-green-400 text-sm">Optimization Report</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono overflow-x-auto">
                  {report}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-blue-900/30 p-2 rounded">
              <div className="text-lg font-bold text-blue-400">344+</div>
              <div className="text-xs text-gray-400">Math Shapes</div>
            </div>
            <div className="bg-green-900/30 p-2 rounded">
              <div className="text-lg font-bold text-green-400">~7.5GB</div>
              <div className="text-xs text-gray-400">Total Assets</div>
            </div>
            <div className="bg-purple-900/30 p-2 rounded">
              <div className="text-lg font-bold text-purple-400">SSD</div>
              <div className="text-xs text-gray-400">Storage Type</div>
            </div>
          </div>

          {/* Optimization Tips */}
          <Card className="bg-gray-700 border-yellow-500">
            <CardHeader>
              <CardTitle className="text-yellow-400 text-sm">💡 Optimization Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-gray-300 space-y-1">
              <div>• Frequently used mathematical shapes are cached in memory</div>
              <div>• Texture assets are compressed and tiered by usage</div>
              <div>• Formula computation results cached for &lt;50ms response</div>
              <div>• Export files are automatically cleaned up after generation</div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}

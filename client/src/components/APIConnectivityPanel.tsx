import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Wifi, WifiOff, AlertTriangle, CheckCircle, Settings, RefreshCw } from 'lucide-react';
import { sdkClient } from '../lib/unifiedSDKClient';

interface APIStatus {
  name: string;
  configured: boolean;
  tested: boolean;
  working: boolean;
  error?: string;
  requiredSecrets: string[];
  missingSecrets: string[];
}

interface ConnectivityData {
  success: boolean;
  summary: {
    totalAPIs: number;
    configuredAPIs: number;
    workingAPIs: number;
    criticalIssues: number;
    overallHealth: number;
  };
  apis: APIStatus[];
  recommendations: string[];
  timestamp: string;
}

export default function APIConnectivityPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [data, setData] = useState<ConnectivityData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  useEffect(() => {
    if (isExpanded) {
      checkConnectivity();
    }
  }, [isExpanded]);

  const checkConnectivity = async () => {
    setIsLoading(true);
    try {
      const result = await sdkClient.legacyCall('/api/connectivity/status', 'GET');
      if (result.success) {
        setData(result.data);
      }
      setLastCheck(new Date());
    } catch (error) {
      console.error('Failed to check API connectivity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const runQuickFix = async (apiNames: string[]) => {
    setIsLoading(true);
    try {
      const result = await sdkClient.legacyCall('/api/connectivity/quick-fix', 'POST', { apis: apiNames });
      console.log('Quick fix results:', result.data);
      // Refresh connectivity status
      await checkConnectivity();
    } catch (error) {
      console.error('Quick fix failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 0.9) return 'text-green-500';
    if (health >= 0.7) return 'text-yellow-500';
    if (health >= 0.4) return 'text-orange-500';
    return 'text-red-500';
  };

  const getHealthIcon = (health: number) => {
    if (health >= 0.9) return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (health >= 0.7) return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    return <WifiOff className="w-4 h-4 text-red-500" />;
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Button 
          onClick={() => setIsExpanded(true)}
          className={`${
            data?.summary.overallHealth >= 0.9 ? 'bg-green-600 hover:bg-green-700' :
            data?.summary.overallHealth >= 0.7 ? 'bg-yellow-600 hover:bg-yellow-700' :
            'bg-red-600 hover:bg-red-700'
          } shadow-lg text-white font-bold px-4 py-2`}
        >
          <Wifi className="w-4 h-4 mr-2" />
          API Status
          {data && (
            <span className="ml-2 text-xs">
              {data.summary.workingAPIs}/{data.summary.totalAPIs}
            </span>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 w-96">
      <Card className="bg-slate-900/95 border-purple-500/50 shadow-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-purple-300 text-sm">
            <span className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              API Connectivity Status
              {data && getHealthIcon(data.summary.overallHealth)}
            </span>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={checkConnectivity}
                disabled={isLoading}
                className="h-6 w-6 p-0"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsExpanded(false)}
                className="h-6 w-6 p-0 text-gray-400 hover:text-white"
              >
                ✕
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-3 pt-0">
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              <span className="text-sm">Checking API connectivity...</span>
            </div>
          )}

          {data && (
            <>
              {/* Overall Health */}
              <div className="bg-slate-800 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-300">Overall Health</span>
                  <span className={`text-sm font-bold ${getHealthColor(data.summary.overallHealth)}`}>
                    {Math.round(data.summary.overallHealth * 100)}%
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400">Working: </span>
                    <span className="text-green-400">{data.summary.workingAPIs}/{data.summary.totalAPIs}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Issues: </span>
                    <span className="text-red-400">{data.summary.criticalIssues}</span>
                  </div>
                </div>
              </div>

              {/* Individual API Status */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-gray-300">Service Status</h4>
                {data.apis.map((api) => (
                  <div key={api.name} className="bg-slate-800 p-2 rounded text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-white truncate">{api.name}</span>
                      <div className="flex gap-1">
                        <Badge className={`text-[10px] px-1 py-0 ${
                          api.working ? 'bg-green-600' : 
                          api.configured ? 'bg-yellow-600' : 'bg-red-600'
                        }`}>
                          {api.working ? 'OK' : api.configured ? 'ERR' : 'NONE'}
                        </Badge>
                      </div>
                    </div>
                    
                    {api.error && (
                      <div className="text-red-400 text-[10px] truncate">
                        {api.error}
                      </div>
                    )}
                    
                    {api.missingSecrets.length > 0 && (
                      <div className="text-orange-400 text-[10px]">
                        Missing: {api.missingSecrets.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              {data.recommendations.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-gray-300">Recommendations</h4>
                  <div className="bg-slate-800 p-2 rounded">
                    {data.recommendations.map((rec, index) => (
                      <div key={index} className="text-[10px] text-gray-300 mb-1">
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => window.open('/secrets', '_blank')}
                  className="flex-1 text-xs"
                >
                  Configure Secrets
                </Button>
                {data.summary.criticalIssues > 0 && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => runQuickFix(data.apis.filter(api => !api.working).map(api => api.name))}
                    disabled={isLoading}
                    className="flex-1 text-xs"
                  >
                    Quick Fix
                  </Button>
                )}
              </div>

              {lastCheck && (
                <div className="text-[10px] text-gray-400 text-center">
                  Last checked: {lastCheck.toLocaleTimeString()}
                </div>
              )}
            </>
          )}

          {!data && !isLoading && (
            <Alert>
              <AlertDescription className="text-xs">
                Click "Check Status" to test API connectivity
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

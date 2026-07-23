import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { CheckCircle, XCircle, AlertCircle, Play, BarChart3, Shield, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { sdkClient } from '../lib/unifiedSDKClient';

interface TestResult {
  testId: string;
  status: string;
  timestamp: string;
  [key: string]: any;
}

export default function PRTestingPanel() {
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTest, setSelectedTest] = useState<string>('health');

  const testCategories = [
    {
      id: 'health',
      name: 'System Health',
      icon: CheckCircle,
      description: 'Basic system status and performance',
      color: 'text-green-500'
    },
    {
      id: 'parameters',
      name: 'Parameter Validation',
      icon: BarChart3,
      description: 'Mathematical parameter testing',
      color: 'text-blue-500'
    },
    {
      id: 'security',
      name: 'Security Testing',
      icon: Shield,
      description: 'Input validation and security checks',
      color: 'text-yellow-500'
    },
    {
      id: 'performance',
      name: 'Performance Benchmark',
      icon: Zap,
      description: 'Computational performance testing',
      color: 'text-purple-500'
    }
  ];

  const runTest = async (testType: string) => {
    setIsRunning(true);

    try {
      let result;

      switch (testType) {
        case 'health':
          result = await sdkClient.legacyCall('/api/pr/health', 'GET');
          break;
        case 'parameters':
          result = await sdkClient.legacyCall('/api/pr/validate-parameters', 'POST', {
            parameters: { a: 1, b: 2, c: 3, d: 0 }
          });
          break;
        case 'security':
          result = await sdkClient.legacyCall('/api/pr/security-test', 'POST', {
            inputs: ['normal_value', '<script>alert("test")</script>', 'eval("test")', 123, 'safe_string']
          });
          break;
        case 'performance':
          result = await sdkClient.legacyCall('/api/pr/benchmark', 'POST', { iterations: 500 });
          break;
        default:
          throw new Error('Unknown test type');
      }

      if (!result.success) {
        throw new Error(result.error || 'Request failed');
      }

      setTestResults(prev => ({
        ...prev,
        [testType]: result.data
      }));

      toast.success(`${testCategories.find(t => t.id === testType)?.name} test completed`);
    } catch (error: any) {
      toast.error(`Test failed: ${error.message}`);
      setTestResults(prev => ({
        ...prev,
        [testType]: {
          testId: `error_${Date.now()}`,
          status: 'error',
          error: error.message,
          timestamp: new Date().toISOString()
        }
      }));
    } finally {
      setIsRunning(false);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);

    try {
      const result = await sdkClient.legacyCall('/api/pr/test-suite', 'GET');

      if (!result.success) {
        throw new Error(result.error || 'Request failed');
      }

      setTestResults(prev => ({
        ...prev,
        comprehensive: result.data
      }));

      toast.success('Comprehensive test suite completed');
    } catch (error: any) {
      toast.error(`Comprehensive test failed: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'pass':
      case 'excellent':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
      case 'good':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error':
      case 'needs_attention':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'pass':
      case 'excellent':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'warning':
      case 'good':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'error':
      case 'needs_attention':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const renderTestResults = (testType: string) => {
    const result = testResults[testType];

    if (!result) {
      return (
        <div className="text-center py-8 text-gray-400">
          <p>No test results available</p>
          <p className="text-sm">Run the test to see results</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(result.status)}
            <Badge className={getStatusColor(result.status)}>
              {result.status?.toUpperCase()}
            </Badge>
          </div>
          <div className="text-xs text-gray-500">
            {new Date(result.timestamp).toLocaleString()}
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4 font-mono text-sm">
          <pre className="whitespace-pre-wrap text-gray-300">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">System Testing Framework</h2>
          <p className="text-gray-400 text-sm">Comprehensive system testing and validation - Contact: phi1@uuonfoundation.com</p>
        </div>
        <Button
          onClick={runAllTests}
          disabled={isRunning}
          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500"
        >
          <Play className="w-4 h-4 mr-2" />
          {isRunning ? 'Running...' : 'Run All Tests'}
        </Button>
      </div>

      <Tabs value={selectedTest} onValueChange={setSelectedTest}>
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          {testCategories.map(category => {
            const Icon = category.icon;
            const result = testResults[category.id];

            return (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex items-center gap-2 data-[state=active]:bg-gray-700"
              >
                <Icon className={`w-4 h-4 ${category.color}`} />
                <span className="hidden sm:inline">{category.name}</span>
                {result && (
                  <div className="ml-1">
                    {getStatusIcon(result.status)}
                  </div>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {testCategories.map(category => (
          <TabsContent key={category.id} value={category.id}>
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <category.icon className={`w-5 h-5 ${category.color}`} />
                  {category.name}
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <Button
                    onClick={() => runTest(category.id)}
                    disabled={isRunning}
                    variant="outline"
                    className="border-gray-600"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {isRunning ? 'Running...' : 'Run Test'}
                  </Button>

                  {testResults[category.id] && (
                    <Badge className={getStatusColor(testResults[category.id].status)}>
                      Last run: {testResults[category.id].status}
                    </Badge>
                  )}
                </div>

                {renderTestResults(category.id)}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {testResults.comprehensive && (
        <Card className="bg-gray-900 border-gray-700 mt-6">
          <CardHeader>
            <CardTitle className="text-white">Comprehensive Test Results</CardTitle>
            <CardDescription>Overall system assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {testResults.comprehensive.passedTests || 0}
                </div>
                <div className="text-sm text-gray-400">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">
                  {testResults.comprehensive.failedTests || 0}
                </div>
                <div className="text-sm text-gray-400">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {testResults.comprehensive.successRate || 0}%
                </div>
                <div className="text-sm text-gray-400">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {testResults.comprehensive.executionTime || 0}ms
                </div>
                <div className="text-sm text-gray-400">Execution Time</div>
              </div>
            </div>

            {testResults.comprehensive.recommendations && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-white mb-2">Recommendations:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  {testResults.comprehensive.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
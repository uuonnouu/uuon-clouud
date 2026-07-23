
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { sdkClient } from '../lib/unifiedSDKClient';

interface ChangelogReport {
  totalChanges: number;
  recentChanges: any[];
  categoryBreakdown: Record<string, number>;
  impactAnalysis: Record<string, number>;
}

const ChangelogViewer: React.FC = () => {
  const [report, setReport] = useState<ChangelogReport | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchChangelogReport = async () => {
    setLoading(true);
    try {
      const result = await sdkClient.legacyCall('/api/changelog/report', 'GET');
      if (result.success && result.data?.success) {
        setReport(result.data.report);
      }
    } catch (error) {
      console.error('Failed to fetch changelog report:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportChangelog = async () => {
    try {
      const result = await sdkClient.legacyCall('/api/changelog/export', 'GET');
      if (result.success && result.data) {
        const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'changelog-export.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to export changelog:', error);
    }
  };

  useEffect(() => {
    fetchChangelogReport();
  }, []);

  const getCategoryColor = (category: string) => {
    const colors = {
      feature: 'bg-green-500',
      fix: 'bg-red-500',
      optimization: 'bg-yellow-500',
      security: 'bg-purple-500',
      documentation: 'bg-blue-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const getImpactColor = (impact: string) => {
    const colors = {
      low: 'bg-gray-400',
      medium: 'bg-blue-400',
      high: 'bg-orange-400',
      critical: 'bg-red-600'
    };
    return colors[impact as keyof typeof colors] || 'bg-gray-400';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>📝 System Changelog</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          📝 System Changelog
          <div className="flex gap-2">
            <Button size="sm" onClick={fetchChangelogReport}>
              🔄 Refresh
            </Button>
            <Button size="sm" onClick={exportChangelog} variant="outline">
              📤 Export
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {report && (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{report.totalChanges}</div>
                <div className="text-sm text-gray-600">Total Changes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{report.recentChanges.length}</div>
                <div className="text-sm text-gray-600">Recent Changes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Object.keys(report.categoryBreakdown).length}
                </div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Change Categories</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(report.categoryBreakdown).map(([category, count]) => (
                  <Badge 
                    key={category} 
                    className={`${getCategoryColor(category)} text-white`}
                  >
                    {category}: {count}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Impact Analysis */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Impact Analysis</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(report.impactAnalysis).map(([impact, count]) => (
                  <Badge 
                    key={impact} 
                    className={`${getImpactColor(impact)} text-white`}
                  >
                    {impact}: {count}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Recent Changes */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Recent Changes</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {report.recentChanges.map((change, index) => (
                  <div key={index} className="border rounded p-3 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={`${getCategoryColor(change.category)} text-white`}>
                        {change.category}
                      </Badge>
                      <Badge className={`${getImpactColor(change.impact)} text-white`}>
                        {change.impact}
                      </Badge>
                    </div>
                    <div className="font-medium">{change.component}</div>
                    <div className="text-sm text-gray-600 mt-1">{change.description}</div>
                    <div className="text-xs text-gray-500 mt-2">
                      {new Date(change.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChangelogViewer;

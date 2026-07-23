
/**
 * INTELLIGENCE METRICS ENHANCEMENT MODULE
 * Drop-in extension for existing UUON Foundation metrics systems
 * © 2025 UUON Foundation Inc.
 */

interface MetricSnapshot {
  value: number;
  timestamp: number;
  confidence: number;
}

interface TrendData {
  direction: 'ascending' | 'descending' | 'stable';
  velocity: number;
  volatility: number;
}

interface AutonomousRecommendation {
  metric: string;
  action: 'optimize' | 'maintain' | 'investigate' | 'emergency';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  expectedImpact: number;
  autoApply: boolean;
}

export class IntelligenceMetricsEnhancer {
  private history: Map<string, MetricSnapshot[]> = new Map();
  private maxHistorySize = 15; // Ultra-reduced to 15 snapshots for minimal memory
  private autonomousMode = true; // UUON: Enable autonomous decision making
  private autonomousRecommendations: AutonomousRecommendation[] = [];
  
  // Integration point: Call this whenever your metrics update
  recordMetric(metricName: string, value: number, confidence: number = 0.95) {
    if (!this.history.has(metricName)) {
      this.history.set(metricName, []);
    }
    
    const snapshots = this.history.get(metricName)!;
    snapshots.push({
      value,
      timestamp: Date.now(),
      confidence
    });
    
    // Keep history bounded
    if (snapshots.length > this.maxHistorySize) {
      snapshots.shift();
    }

    // AUTONOMOUS: Auto-analyze trends and generate recommendations
    if (this.autonomousMode && snapshots.length >= 5) {
      this.generateAutonomousRecommendations(metricName);
    }
  }
  
  // Get trend analysis for any metric
  getTrend(metricName: string): TrendData | null {
    const snapshots = this.history.get(metricName);
    if (!snapshots || snapshots.length < 5) return null;
    
    const recent = snapshots.slice(-10);
    const values = recent.map(s => s.value);
    
    // Calculate simple linear trend
    const avg = values.reduce((a, b) => a + b) / values.length;
    const slope = (values[values.length - 1] - values[0]) / values.length;
    
    // Calculate volatility (standard deviation)
    const variance = values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length;
    const volatility = Math.sqrt(variance);
    
    return {
      direction: slope > 0.01 ? 'ascending' : slope < -0.01 ? 'descending' : 'stable',
      velocity: Math.abs(slope),
      volatility
    };
  }
  
  // Get improvement rate over time
  getImprovementRate(metricName: string, timeWindowMs: number = 3600000): number | null {
    const snapshots = this.history.get(metricName);
    if (!snapshots || snapshots.length < 2) return null;
    
    const cutoff = Date.now() - timeWindowMs;
    const recentSnapshots = snapshots.filter(s => s.timestamp >= cutoff);
    
    if (recentSnapshots.length < 2) return null;
    
    const first = recentSnapshots[0].value;
    const last = recentSnapshots[recentSnapshots.length - 1].value;
    const timeDiff = recentSnapshots[recentSnapshots.length - 1].timestamp - recentSnapshots[0].timestamp;
    
    return ((last - first) / first) * (3600000 / timeDiff); // Normalized to per-hour rate
  }
  
  // Get health score (0-1) based on all metrics
  getSystemHealth(): number {
    const allMetrics = Array.from(this.history.keys());
    if (allMetrics.length === 0) return 1.0;
    
    let totalHealth = 0;
    let count = 0;
    
    for (const metric of allMetrics) {
      const snapshots = this.history.get(metric)!;
      if (snapshots.length > 0) {
        const latest = snapshots[snapshots.length - 1];
        const trend = this.getTrend(metric);
        
        // Health factors: latest value, confidence, trend direction
        let health = latest.value * latest.confidence;
        if (trend && trend.direction === 'descending') {
          health *= 0.9; // Slight penalty for declining metrics
        }
        
        totalHealth += health;
        count++;
      }
    }
    
    return count > 0 ? totalHealth / count : 1.0;
  }

  // AUTONOMOUS: Generate intelligent recommendations
  private generateAutonomousRecommendations(metricName: string): void {
    const trend = this.getTrend(metricName);
    const snapshots = this.history.get(metricName)!;
    const latest = snapshots[snapshots.length - 1];
    
    if (!trend) return;

    // Clear old recommendations for this metric
    this.autonomousRecommendations = this.autonomousRecommendations.filter(r => r.metric !== metricName);

    // Performance degradation detected
    if (trend.direction === 'descending' && trend.velocity > 0.05) {
      this.autonomousRecommendations.push({
        metric: metricName,
        action: 'optimize',
        urgency: trend.velocity > 0.2 ? 'critical' : 'high',
        description: `${metricName} declining at ${(trend.velocity * 100).toFixed(1)}% per update`,
        expectedImpact: trend.velocity * 2,
        autoApply: trend.velocity < 0.1 // Only auto-apply minor optimizations
      });
    }

    // High volatility detected
    if (trend.volatility > 0.3) {
      this.autonomousRecommendations.push({
        metric: metricName,
        action: 'investigate',
        urgency: 'medium',
        description: `${metricName} showing high volatility (${trend.volatility.toFixed(3)})`,
        expectedImpact: 0.2,
        autoApply: false
      });
    }

    // Low confidence detected
    if (latest.confidence < 0.7) {
      this.autonomousRecommendations.push({
        metric: metricName,
        action: 'investigate',
        urgency: 'medium',
        description: `${metricName} confidence below threshold (${(latest.confidence * 100).toFixed(1)}%)`,
        expectedImpact: 0.3,
        autoApply: false
      });
    }

    // Excellent performance - maintain
    if (latest.value > 0.9 && latest.confidence > 0.9 && trend.direction === 'ascending') {
      this.autonomousRecommendations.push({
        metric: metricName,
        action: 'maintain',
        urgency: 'low',
        description: `${metricName} performing excellently - maintain current settings`,
        expectedImpact: 0.1,
        autoApply: true
      });
    }
  }

  // AUTONOMOUS: Get actionable recommendations
  getAutonomousRecommendations(): AutonomousRecommendation[] {
    return [...this.autonomousRecommendations].sort((a, b) => {
      const urgencyOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
    });
  }

  // AUTONOMOUS: Apply safe recommendations automatically
  applyAutonomousOptimizations(): number {
    let appliedCount = 0;
    const safeRecommendations = this.autonomousRecommendations.filter(r => r.autoApply);

    for (const rec of safeRecommendations) {
      try {
        this.executeRecommendation(rec);
        appliedCount++;
        console.log(`🤖 Auto-applied: ${rec.description}`);
      } catch (error) {
        console.warn(`Failed to auto-apply recommendation for ${rec.metric}:`, error);
      }
    }

    // Remove applied recommendations
    this.autonomousRecommendations = this.autonomousRecommendations.filter(r => !r.autoApply);
    
    return appliedCount;
  }

  private executeRecommendation(recommendation: AutonomousRecommendation): void {
    // UUON: Integration points for your existing systems
    const event = new CustomEvent('autonomousOptimization', {
      detail: {
        metric: recommendation.metric,
        action: recommendation.action,
        expectedImpact: recommendation.expectedImpact
      }
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(event);
    }
  }
  
  // Export current state for persistence
  exportState(): string {
    const data: any = {};
    this.history.forEach((snapshots, key) => {
      data[key] = snapshots;
    });
    return JSON.stringify(data);
  }
  
  // Import previous state
  importState(state: string) {
    try {
      const data = JSON.parse(state);
      Object.keys(data).forEach(key => {
        this.history.set(key, data[key]);
      });
    } catch (e) {
      console.warn('Failed to import metrics state:', e);
    }
  }
  
  // Get comprehensive summary report
  getSummaryReport(): object {
    const report: any = {
      systemHealth: this.getSystemHealth(),
      timestamp: new Date().toISOString(),
      totalMetrics: this.history.size,
      autonomousMode: this.autonomousMode,
      pendingRecommendations: this.autonomousRecommendations.length,
      metrics: {}
    };
    
    this.history.forEach((snapshots, metricName) => {
      if (snapshots.length > 0) {
        const latest = snapshots[snapshots.length - 1];
        const trend = this.getTrend(metricName);
        const improvementRate = this.getImprovementRate(metricName);
        
        report.metrics[metricName] = {
          current: latest.value,
          confidence: latest.confidence,
          trend: trend?.direction || 'unknown',
          velocity: trend?.velocity || 0,
          improvementRate: improvementRate || 0,
          dataPoints: snapshots.length,
          volatility: trend?.volatility || 0
        };
      }
    });
    
    return report;
  }
  
  // UUON-specific: Generate mathematical insight report
  generateMathematicalInsights(): string {
    const report = this.getSummaryReport() as any;
    const health = report.systemHealth;
    const recommendations = this.getAutonomousRecommendations();
    
    let insights = `
🧮 UUON Foundation Autonomous Intelligence Analysis
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 System Health: ${(health * 100).toFixed(1)}% (φ-normalized)
🤖 Autonomous Mode: ${this.autonomousMode ? 'ACTIVE' : 'DISABLED'}
🎯 Pending Recommendations: ${recommendations.length}
🕐 Analysis Time: ${report.timestamp}
📈 Active Metrics: ${report.totalMetrics}

🚀 AUTONOMOUS RECOMMENDATIONS:
`;

    recommendations.slice(0, 5).forEach((rec, index) => {
      const urgencyEmoji = rec.urgency === 'critical' ? '🚨' : 
                          rec.urgency === 'high' ? '⚠️' : 
                          rec.urgency === 'medium' ? '🔶' : '💡';
      const autoEmoji = rec.autoApply ? '🤖' : '👤';
      
      insights += `${urgencyEmoji} ${autoEmoji} ${rec.description}
   Impact: ${(rec.expectedImpact * 100).toFixed(1)}% | Action: ${rec.action.toUpperCase()}
   
`;
    });

    insights += `
📊 METRIC ANALYSIS:
`;

    // Analyze each metric with UUON mathematical context
    Object.entries(report.metrics).forEach(([name, data]: [string, any]) => {
      const trendEmoji = data.trend === 'ascending' ? '📈' : data.trend === 'descending' ? '📉' : '➡️';
      const confidenceBar = '█'.repeat(Math.floor(data.confidence * 10));
      
      insights += `${trendEmoji} ${name.toUpperCase()}:
   Current: ${data.current.toFixed(4)} | Confidence: ${confidenceBar}
   Trend: ${data.trend} @ ${(data.velocity * 1000).toFixed(2)}/ms
   Improvement Rate: ${(data.improvementRate * 100).toFixed(1)}%/hour
   Volatility: ${data.volatility.toFixed(4)} (stability index)
   
`;
    });
    
    return insights;
  }

  // AUTONOMOUS: Toggle autonomous mode
  setAutonomousMode(enabled: boolean): void {
    this.autonomousMode = enabled;
    console.log(`🤖 Autonomous mode ${enabled ? 'ENABLED' : 'DISABLED'}`);
    
    if (enabled) {
      // Start autonomous optimization cycle
      this.startAutonomousCycle();
    }
  }

  private autonomousCycleInterval?: NodeJS.Timeout;

  private startAutonomousCycle(): void {
    if (this.autonomousCycleInterval) {
      clearInterval(this.autonomousCycleInterval);
    }

    this.autonomousCycleInterval = setInterval(() => {
      if (this.autonomousMode) {
        const applied = this.applyAutonomousOptimizations();
        if (applied > 0) {
          console.log(`🤖 Autonomous cycle: Applied ${applied} optimizations`);
        }
      }
    }, 300000); // Every 5 minutes - massive reduction in CPU usage
  }
}

// Global instance for UUON Foundation systems
export const intelligenceMetricsEnhancer = new IntelligenceMetricsEnhancer();

// Auto-restore state from localStorage if available
if (typeof window !== 'undefined') {
  // Migrate old key to UUON kebab-case format
  const oldState = localStorage.getItem('uuon_intelligence_metrics');
  if (oldState) {
    localStorage.setItem('uuon-intelligence-metrics', oldState);
    localStorage.removeItem('uuon_intelligence_metrics');
  }
  
  const savedState = localStorage.getItem('uuon-intelligence-metrics');
  if (savedState) {
    intelligenceMetricsEnhancer.importState(savedState);
  }
  
  // Auto-save every 5 minutes
  setInterval(() => {
    localStorage.setItem('uuon-intelligence-metrics', intelligenceMetricsEnhancer.exportState());
  }, 300000);

  // Enable autonomous mode by default for UUON
  intelligenceMetricsEnhancer.setAutonomousMode(true);
}

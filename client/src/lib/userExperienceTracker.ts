
/**
 * User Experience Tracker
 * Monitors user interactions and provides insights for optimization
 */

export class UserExperienceTracker {
  private static instance: UserExperienceTracker;
  private sessionData = {
    startTime: Date.now(),
    shapesViewed: new Set<string>(),
    parametersChanged: 0,
    totalInteractions: 0,
    frustratedActions: 0, // Actions that were quickly undone
    engagementScore: 100
  };
  
  private interactionHistory: Array<{
    action: string;
    timestamp: number;
    context: string;
    duration?: number;
  }> = [];

  static getInstance(): UserExperienceTracker {
    if (!UserExperienceTracker.instance) {
      UserExperienceTracker.instance = new UserExperienceTracker();
    }
    return UserExperienceTracker.instance;
  }

  constructor() {
    this.setupUXTracking();
  }

  private setupUXTracking() {
    // Track user attention/focus
    document.addEventListener('visibilitychange', () => {
      this.trackInteraction(
        document.hidden ? 'page-blur' : 'page-focus',
        'window-focus'
      );
    });

    // Track scrolling behavior (indicates engagement)
    let scrollTimeout: NodeJS.Timeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.trackInteraction('scroll-engagement', 'scroll-area');
      }, 150);
    });
  }

  trackShapeView(shapeId: string, viewDuration: number) {
    this.sessionData.shapesViewed.add(shapeId);
    this.trackInteraction('shape-view', shapeId, viewDuration);
    
    // Adjust engagement score based on view duration
    if (viewDuration > 10000) { // 10+ seconds indicates high engagement
      this.sessionData.engagementScore += 2;
    } else if (viewDuration < 2000) { // Less than 2 seconds might indicate frustration
      this.sessionData.engagementScore -= 1;
    }
  }

  trackParameterChange(parameter: string, value: number, previousValue: number) {
    this.sessionData.parametersChanged++;
    this.trackInteraction('parameter-change', parameter);
    
    // Detect if user quickly reverts parameter (frustration indicator)
    const recentChanges = this.interactionHistory
      .filter(i => i.timestamp > Date.now() - 5000 && i.context === parameter)
      .length;
      
    if (recentChanges > 5) {
      this.sessionData.frustratedActions++;
      this.sessionData.engagementScore -= 3;
    }
  }

  trackInteraction(action: string, context: string, duration?: number) {
    this.sessionData.totalInteractions++;
    this.interactionHistory.push({
      action,
      timestamp: Date.now(),
      context,
      duration
    });

    // Keep history manageable
    if (this.interactionHistory.length > 1000) {
      this.interactionHistory = this.interactionHistory.slice(-800);
    }
  }

  trackError(error: string, context: string, wasRecovered: boolean) {
    this.trackInteraction('error-encountered', context);
    
    if (!wasRecovered) {
      this.sessionData.engagementScore -= 10;
      this.sessionData.frustratedActions++;
    } else {
      // Good recovery maintains user confidence
      this.sessionData.engagementScore -= 2;
    }
  }

  getUXInsights() {
    const sessionDuration = Date.now() - this.sessionData.startTime;
    const avgInteractionRate = this.sessionData.totalInteractions / (sessionDuration / 60000); // per minute
    
    return {
      sessionMetrics: {
        duration: Math.round(sessionDuration / 1000), // in seconds
        shapesExplored: this.sessionData.shapesViewed.size,
        interactionRate: Math.round(avgInteractionRate * 100) / 100,
        engagementScore: Math.max(0, Math.min(100, this.sessionData.engagementScore)),
        frustrationLevel: this.calculateFrustrationLevel()
      },
      recommendations: this.generateUXRecommendations(),
      popularShapes: this.getPopularShapes(),
      usagePatterns: this.analyzeUsagePatterns()
    };
  }

  private calculateFrustrationLevel(): 'low' | 'medium' | 'high' {
    const frustrationRatio = this.sessionData.frustratedActions / Math.max(1, this.sessionData.totalInteractions);
    
    if (frustrationRatio > 0.15) return 'high';
    if (frustrationRatio > 0.05) return 'medium';
    return 'low';
  }

  private generateUXRecommendations(): string[] {
    const recommendations: string[] = [];
    const insights = this.getUXInsights();
    
    if (insights.sessionMetrics.frustrationLevel === 'high') {
      recommendations.push('Consider simplifying the interface or providing more guidance');
    }
    
    if (insights.sessionMetrics.interactionRate < 2) {
      recommendations.push('Interface might benefit from more engaging elements');
    }
    
    if (this.sessionData.shapesViewed.size < 3) {
      recommendations.push('Consider highlighting shape variety or providing shape recommendations');
    }
    
    return recommendations;
  }

  private getPopularShapes(): Array<{shape: string, viewCount: number}> {
    const shapeCounts = new Map<string, number>();
    
    this.interactionHistory
      .filter(i => i.action === 'shape-view')
      .forEach(i => {
        shapeCounts.set(i.context, (shapeCounts.get(i.context) || 0) + 1);
      });
      
    return Array.from(shapeCounts.entries())
      .map(([shape, count]) => ({shape, viewCount: count}))
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 10);
  }

  private analyzeUsagePatterns(): {
    peakActivityTimes: string[];
    commonSequences: string[];
    averageSessionLength: number;
  } {
    const now = new Date();
    const currentHour = now.getHours();
    
    // Simple pattern analysis
    return {
      peakActivityTimes: [`${currentHour}:00-${currentHour + 1}:00`],
      commonSequences: ['shape-view -> parameter-change'],
      averageSessionLength: Math.round((Date.now() - this.sessionData.startTime) / 1000)
    };
  }

  // Export data for analytics
  exportSessionData() {
    return {
      session: this.sessionData,
      interactions: this.interactionHistory,
      insights: this.getUXInsights(),
      timestamp: new Date().toISOString()
    };
  }
}

export const uxTracker = UserExperienceTracker.getInstance();

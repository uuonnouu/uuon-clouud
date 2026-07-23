/**
 * Smart Flow Manager - Intelligent UI/UX flow optimization
 * Manages user interaction patterns and optimizes response timing
 */

interface FlowState {
  lastInteraction: number;
  interactionCount: number;
  currentMode: 'exploring' | 'focused' | 'idle';
  preferredCategory: string | null;
  parameterHistory: Array<{ param: string; value: number; timestamp: number }>;
}

interface FlowPrediction {
  likelyNextAction: string;
  suggestedPreload: string[];
  optimalResponseDelay: number;
}

export class SmartFlowManager {
  private static instance: SmartFlowManager;
  private state: FlowState = {
    lastInteraction: Date.now(),
    interactionCount: 0,
    currentMode: 'exploring',
    preferredCategory: null,
    parameterHistory: []
  };
  private categoryPatterns = new Map<string, number>();
  private parameterPatterns = new Map<string, number[]>();
  
  static getInstance(): SmartFlowManager {
    if (!SmartFlowManager.instance) {
      SmartFlowManager.instance = new SmartFlowManager();
    }
    return SmartFlowManager.instance;
  }
  
  /**
   * Record a user interaction
   */
  recordInteraction(type: 'shape_change' | 'parameter_adjust' | 'category_browse' | 'export', details?: any): void {
    const now = Date.now();
    const timeSinceLast = now - this.state.lastInteraction;
    
    this.state.lastInteraction = now;
    this.state.interactionCount++;
    
    // Determine interaction mode based on timing
    if (timeSinceLast < 500) {
      this.state.currentMode = 'focused'; // Rapid interactions
    } else if (timeSinceLast < 5000) {
      this.state.currentMode = 'exploring';
    } else {
      this.state.currentMode = 'idle';
    }
    
    // Track category patterns
    if (type === 'category_browse' && details?.category) {
      const count = this.categoryPatterns.get(details.category) || 0;
      this.categoryPatterns.set(details.category, count + 1);
      this.updatePreferredCategory();
    }
    
    // Track parameter patterns
    if (type === 'parameter_adjust' && details?.param) {
      this.state.parameterHistory.push({
        param: details.param,
        value: details.value,
        timestamp: now
      });
      
      // Keep last 50 parameter changes
      if (this.state.parameterHistory.length > 50) {
        this.state.parameterHistory.shift();
      }
      
      // Track which parameters are adjusted most
      const paramValues = this.parameterPatterns.get(details.param) || [];
      paramValues.push(details.value);
      if (paramValues.length > 10) paramValues.shift();
      this.parameterPatterns.set(details.param, paramValues);
    }
  }
  
  /**
   * Get prediction for next likely action
   */
  getPrediction(): FlowPrediction {
    const prediction: FlowPrediction = {
      likelyNextAction: 'explore',
      suggestedPreload: [],
      optimalResponseDelay: 16
    };
    
    // Based on mode, suggest preloading
    if (this.state.currentMode === 'focused') {
      prediction.optimalResponseDelay = 0; // Immediate response when user is engaged
      prediction.likelyNextAction = 'parameter_adjust';
    } else if (this.state.currentMode === 'exploring') {
      prediction.optimalResponseDelay = 50;
      prediction.likelyNextAction = 'shape_change';
      
      // Suggest shapes from preferred category
      if (this.state.preferredCategory) {
        prediction.suggestedPreload = this.getRelatedShapes(this.state.preferredCategory);
      }
    } else {
      prediction.optimalResponseDelay = 100;
      prediction.likelyNextAction = 'idle';
    }
    
    return prediction;
  }
  
  /**
   * Get optimal parameter defaults based on user patterns
   */
  getOptimalDefaults(): Record<string, number> {
    const defaults: Record<string, number> = {};
    
    this.parameterPatterns.forEach((values, param) => {
      if (values.length >= 3) {
        // Use median of recent values
        const sorted = [...values].sort((a, b) => a - b);
        defaults[param] = sorted[Math.floor(sorted.length / 2)];
      }
    });
    
    return defaults;
  }
  
  /**
   * Get shapes related to a category for preloading
   */
  private getRelatedShapes(category: string): string[] {
    const categoryShapes: Record<string, string[]> = {
      'surfaces': ['sphere', 'torus', 'klein_bottle', 'mobius_strip'],
      'fractals': ['mandelbulb', 'julia_set', 'sierpinski', 'menger_sponge'],
      'topology': ['trefoil_knot', 'figure_eight', "boy's_surface"],
      'biology': ['seashell', 'nautilus', 'dna_helix', 'protein_fold'],
      'physics': ['quantum_harmonic', 'wave_function', 'field_lines']
    };
    
    return categoryShapes[category] || [];
  }
  
  /**
   * Update preferred category based on usage patterns
   */
  private updatePreferredCategory(): void {
    let maxCount = 0;
    let preferred: string | null = null;
    
    this.categoryPatterns.forEach((count, category) => {
      if (count > maxCount) {
        maxCount = count;
        preferred = category;
      }
    });
    
    this.state.preferredCategory = preferred;
  }
  
  /**
   * Get current flow state
   */
  getState(): FlowState {
    return { ...this.state };
  }
  
  /**
   * Reset flow tracking
   */
  reset(): void {
    this.state = {
      lastInteraction: Date.now(),
      interactionCount: 0,
      currentMode: 'exploring',
      preferredCategory: null,
      parameterHistory: []
    };
    this.categoryPatterns.clear();
    this.parameterPatterns.clear();
  }
}

export const smartFlowManager = SmartFlowManager.getInstance();

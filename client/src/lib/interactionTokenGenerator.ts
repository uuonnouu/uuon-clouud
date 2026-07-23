/**
 * INTERACTION TOKEN GENERATOR
 * Automatically generates tokens on every meaningful user interaction
 * Ensures continuous platform growth and value creation
 */

// Import token batch generator from cross learning engine
let generateTokenBatch: any;
try {
  const crossLearning = require('./crossLearningEngine');
  generateTokenBatch = crossLearning.generateTokenBatch;
} catch (e) {
  // Fallback if cross learning not available
  generateTokenBatch = (size: number) => ({
    tokens: Array(size).fill({ value: 1 }),
    totalValue: size * 25,
    totalRWA: size * 10,
    stockpileSize: size
  });
}

class InteractionTokenGenerator {
  private interactionCount = 0;
  private lastBatchGeneration = 0;
  private isGenerating = false;

  // Track all meaningful interactions
  trackInteraction(interactionType: string, shapeId?: string, parameters?: any) {
    this.interactionCount++;

    const interactionValue = this.calculateInteractionValue(interactionType);

    // Interaction silently tracked (no console output for security)

    // Generate tokens based on interaction frequency
    this.conditionalTokenGeneration(interactionType, interactionValue);
  }

  private calculateInteractionValue(type: string): number {
    const valueMap = {
      'shape_view': 2,
      'parameter_change': 5,
      'export_action': 15,
      'save_action': 10,
      'share_action': 8,
      'animation_play': 3,
      'material_change': 4,
      'camera_movement': 1,
      'lighting_change': 6,
      'physics_interaction': 12,
      'tutorial_complete': 25,
      'discovery_action': 20
    };

    return valueMap[type as keyof typeof valueMap] || 1;
  }

  private conditionalTokenGeneration(interactionType: string, value: number) {
    if (this.isGenerating) return;

    const shouldGenerate =
      this.interactionCount % 3 === 0 || // Every 3rd interaction
      value >= 10 || // High-value interactions
      (Date.now() - this.lastBatchGeneration) > 30000; // Every 30 seconds minimum

    if (shouldGenerate) {
      this.generateTokensFromInteraction(interactionType, value);
    }
  }

  private async generateTokensFromInteraction(interactionType: string, value: number) {
    this.isGenerating = true;
    this.lastBatchGeneration = Date.now();

    try {
      // Calculate batch size based on interaction value
      const batchSize = Math.max(3, Math.floor(value * 1.5));

      const batch = generateTokenBatch(batchSize);

      // Token generation silently tracked (no console output for security)

      // Update localStorage for persistence
      localStorage.setItem('uuon-interaction-count', this.interactionCount.toString());
      localStorage.setItem('uuon-last-generation', this.lastBatchGeneration.toString());

    } catch (error) {
      console.error('Token generation error:', error);
    } finally {
      this.isGenerating = false;
    }
  }

  // Get interaction statistics
  getStats() {
    return {
      totalInteractions: this.interactionCount,
      lastBatchGeneration: this.lastBatchGeneration,
      averageGenerationRate: this.interactionCount / Math.max(1, Math.floor((Date.now() - this.lastBatchGeneration) / 60000))
    };
  }

  // Reset counters
  reset() {
    this.interactionCount = 0;
    this.lastBatchGeneration = 0;
    localStorage.removeItem('uuon-interaction-count');
    localStorage.removeItem('uuon-last-generation');
  }

  // Load persisted state
  loadPersistedState() {
    const savedCount = localStorage.getItem('uuon-interaction-count');
    const savedLastGeneration = localStorage.getItem('uuon-last-generation');

    if (savedCount) this.interactionCount = parseInt(savedCount);
    if (savedLastGeneration) this.lastBatchGeneration = parseInt(savedLastGeneration);
  }
}

export const interactionTokenGenerator = new InteractionTokenGenerator();

// Initialize with persisted state
interactionTokenGenerator.loadPersistedState();

// Get current shape type for token attribution
function getCurrentShapeType(): string {
  if (typeof window !== 'undefined' && (window as any).ParameterAuthority) {
    return (window as any).ParameterAuthority.currentShape || 'sphere';
  }
  return 'sphere';
}

// Auto-generate tokens every 45 seconds regardless of interaction
let tokenAutoGenerationInterval: ReturnType<typeof setInterval> | null = null;

export function startTokenAutoGeneration() {
  if (tokenAutoGenerationInterval) return;
  tokenAutoGenerationInterval = setInterval(() => {
    try {
      const batch = generateTokenBatch(Math.floor(Math.random() * 5) + 2);
      const shapeType = getCurrentShapeType();
      // Sync to backend silently
      fetch('/api/token-ecosystem/generate-interaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokens: batch.tokens?.length || 1,
          energy: batch.stockpileSize || 1,
          value: batch.totalValue || 1,
          timestamp: Date.now(),
          source: 'auto_generation',
          shapeType: shapeType
        })
      }).catch(() => {});
    } catch (e) {
      // Silent fail for auto generation
    }
  }, 45000);
}

export function stopTokenAutoGeneration() {
  if (tokenAutoGenerationInterval) {
    clearInterval(tokenAutoGenerationInterval);
    tokenAutoGenerationInterval = null;
  }
}

// Start automatically but provide cleanup
startTokenAutoGeneration();
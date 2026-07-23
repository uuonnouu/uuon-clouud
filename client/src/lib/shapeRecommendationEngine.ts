
/**
 * Shape Recommendation Engine
 * Provides intelligent shape suggestions based on user preferences and patterns
 */

import { uxTracker } from './userExperienceTracker';

interface ShapeRecommendation {
  shapeId: string;
  confidence: number;
  reason: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export class ShapeRecommendationEngine {
  private static instance: ShapeRecommendationEngine;
  private userPreferences = {
    preferredCategories: new Map<string, number>(),
    complexityPreference: 'intermediate' as 'beginner' | 'intermediate' | 'advanced',
    interactionStyle: 'explorer' as 'explorer' | 'focused' | 'creative',
    mathematicalBackground: 'intermediate' as 'beginner' | 'intermediate' | 'advanced'
  };

  static getInstance(): ShapeRecommendationEngine {
    if (!ShapeRecommendationEngine.instance) {
      ShapeRecommendationEngine.instance = new ShapeRecommendationEngine();
    }
    return ShapeRecommendationEngine.instance;
  }

  constructor() {
    this.loadUserPreferences();
    this.analyzeUserBehavior();
  }

  async getRecommendations(currentShape?: string, limit: number = 5): Promise<ShapeRecommendation[]> {
    const allRecommendations: ShapeRecommendation[] = [];

    // Content-based recommendations (similar shapes)
    if (currentShape) {
      allRecommendations.push(...await this.getContentBasedRecommendations(currentShape));
    }

    // Collaborative filtering (popular among similar users)
    allRecommendations.push(...await this.getCollaborativeRecommendations());

    // Preference-based recommendations
    allRecommendations.push(...await this.getPreferenceBasedRecommendations());

    // Novelty recommendations (unexplored areas)
    allRecommendations.push(...await this.getNoveltyRecommendations());

    // Sort by confidence and remove duplicates
    const uniqueRecommendations = this.removeDuplicates(allRecommendations)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, limit);

    return uniqueRecommendations;
  }

  private async getContentBasedRecommendations(currentShape: string): Promise<ShapeRecommendation[]> {
    const recommendations: ShapeRecommendation[] = [];
    
    try {
      // Import shape categories to find related shapes
      const { shapeCategories } = await import('../systems/shapeCategories');
      
      // Find category of current shape
      let currentCategory = '';
      for (const [category, shapes] of Object.entries(shapeCategories)) {
        if ((shapes as any).shapes?.includes(currentShape)) {
          currentCategory = category;
          break;
        }
      }

      if (currentCategory) {
        const categoryShapes = (shapeCategories as any)[currentCategory]?.shapes || [];
        const relatedShapes = categoryShapes
          .filter((shape: string) => shape !== currentShape)
          .slice(0, 3);

        relatedShapes.forEach((shape: string) => {
          recommendations.push({
            shapeId: shape,
            confidence: 0.8,
            reason: `Similar to ${currentShape} (same category: ${currentCategory})`,
            category: currentCategory,
            difficulty: this.estimateShapeDifficulty(shape)
          });
        });
      }
    } catch (error) {
      console.warn('Content-based recommendations failed:', error);
    }

    return recommendations;
  }

  private async getCollaborativeRecommendations(): Promise<ShapeRecommendation[]> {
    const recommendations: ShapeRecommendation[] = [];
    const uxInsights = uxTracker.getUXInsights();
    
    // Simulate collaborative filtering based on similar engagement patterns
    const popularShapes = uxInsights.popularShapes.slice(0, 2);
    
    popularShapes.forEach(({shape}) => {
      recommendations.push({
        shapeId: shape,
        confidence: 0.7,
        reason: 'Popular among users with similar interests',
        category: 'popular',
        difficulty: this.estimateShapeDifficulty(shape)
      });
    });

    return recommendations;
  }

  private async getPreferenceBasedRecommendations(): Promise<ShapeRecommendation[]> {
    const recommendations: ShapeRecommendation[] = [];
    
    // Get top preferred categories
    const topCategories = Array.from(this.userPreferences.preferredCategories.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2);

    for (const [category] of topCategories) {
      try {
        const { shapeCategories } = await import('../systems/shapeCategories');
        const categoryShapes = (shapeCategories as any)[category]?.shapes || [];
        
        if (categoryShapes.length > 0) {
          const randomShape = categoryShapes[Math.floor(Math.random() * categoryShapes.length)];
          recommendations.push({
            shapeId: randomShape,
            confidence: 0.75,
            reason: `Matches your preference for ${category} shapes`,
            category,
            difficulty: this.userPreferences.complexityPreference
          });
        }
      } catch (error) {
        console.warn(`Failed to get recommendations for category ${category}:`, error);
      }
    }

    return recommendations;
  }

  private async getNoveltyRecommendations(): Promise<ShapeRecommendation[]> {
    const recommendations: ShapeRecommendation[] = [];
    
    // Recommend shapes from less explored categories
    const leastUsedCategories = Array.from(this.userPreferences.preferredCategories.entries())
      .sort(([,a], [,b]) => a - b)
      .slice(0, 2);

    if (leastUsedCategories.length === 0) {
      // If no history, recommend from diverse categories
      const diverseCategories = ['sacred-geometry', 'fractals', 'quantum-computing'];
      
      for (const category of diverseCategories) {
        try {
          const { shapeCategories } = await import('../systems/shapeCategories');
          const categoryShapes = (shapeCategories as any)[category]?.shapes || [];
          
          if (categoryShapes.length > 0) {
            const randomShape = categoryShapes[Math.floor(Math.random() * categoryShapes.length)];
            recommendations.push({
              shapeId: randomShape,
              confidence: 0.6,
              reason: `Discover something new in ${category}`,
              category,
              difficulty: 'intermediate'
            });
          }
        } catch (error) {
          continue;
        }
      }
    }

    return recommendations;
  }

  private removeDuplicates(recommendations: ShapeRecommendation[]): ShapeRecommendation[] {
    const seen = new Set<string>();
    return recommendations.filter(rec => {
      if (seen.has(rec.shapeId)) return false;
      seen.add(rec.shapeId);
      return true;
    });
  }

  private estimateShapeDifficulty(shapeId: string): 'beginner' | 'intermediate' | 'advanced' {
    const beginnerKeywords = ['basic', 'simple', 'sphere', 'cube', 'plane'];
    const advancedKeywords = ['quantum', '4d', 'hyperbolic', 'differential', 'topology'];
    
    const shapeLower = shapeId.toLowerCase();
    
    if (beginnerKeywords.some(keyword => shapeLower.includes(keyword))) {
      return 'beginner';
    }
    
    if (advancedKeywords.some(keyword => shapeLower.includes(keyword))) {
      return 'advanced';
    }
    
    return 'intermediate';
  }

  updateUserInteraction(shapeId: string, category: string, interactionDuration: number) {
    // Update category preferences based on interaction time
    const currentPreference = this.userPreferences.preferredCategories.get(category) || 0;
    const engagementScore = Math.min(10, interactionDuration / 1000); // Convert to engagement score
    
    this.userPreferences.preferredCategories.set(category, currentPreference + engagementScore);
    
    // Update complexity preference based on shape difficulty
    const difficulty = this.estimateShapeDifficulty(shapeId);
    if (interactionDuration > 10000) { // 10+ seconds indicates comfort with complexity
      if (difficulty === 'advanced' && this.userPreferences.complexityPreference !== 'advanced') {
        this.userPreferences.complexityPreference = 'advanced';
      } else if (difficulty === 'intermediate' && this.userPreferences.complexityPreference === 'beginner') {
        this.userPreferences.complexityPreference = 'intermediate';
      }
    }

    this.saveUserPreferences();
  }

  private analyzeUserBehavior() {
    const uxInsights = uxTracker.getUXInsights();
    
    // Determine interaction style based on behavior
    if (uxInsights.sessionMetrics.shapesExplored > 10) {
      this.userPreferences.interactionStyle = 'explorer';
    } else if (uxInsights.sessionMetrics.interactionRate > 5) {
      this.userPreferences.interactionStyle = 'creative';
    } else {
      this.userPreferences.interactionStyle = 'focused';
    }
  }

  private loadUserPreferences() {
    try {
      const stored = localStorage.getItem('shapeRecommendationPreferences');
      if (stored) {
        const preferences = JSON.parse(stored);
        Object.assign(this.userPreferences, preferences);
        
        // Restore Map from stored data
        if (preferences.preferredCategories) {
          this.userPreferences.preferredCategories = new Map(preferences.preferredCategories);
        }
      }
    } catch (error) {
      console.warn('Failed to load recommendation preferences:', error);
    }
  }

  private saveUserPreferences() {
    try {
      const preferencesToStore = {
        ...this.userPreferences,
        preferredCategories: Array.from(this.userPreferences.preferredCategories.entries())
      };
      localStorage.setItem('shapeRecommendationPreferences', JSON.stringify(preferencesToStore));
    } catch (error) {
      console.warn('Failed to save recommendation preferences:', error);
    }
  }
}

export const recommendationEngine = ShapeRecommendationEngine.getInstance();

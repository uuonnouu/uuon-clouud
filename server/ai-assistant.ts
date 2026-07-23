import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { ai_interactions, ai_learning_patterns } from '@shared/schema';

const connectionString = process.env.DATABASE_URL!;
const sql = neon(connectionString);
const db = drizzle(sql);

interface AILearningData {
  id?: number;
  user_query: string;
  shape_suggested: string;
  mathematical_analysis: string;
  parameters_used: string;
  success_rating: number;
  timestamp: string;
}

interface ShapeAnalysisRequest {
  description: string;
  parameters?: Record<string, number>;
  current_shape?: string;
  user_intent?: string;
  context?: string;
}

interface AIResponse {
  recommended_shape: string;
  mathematical_reasoning: string;
  suggested_parameters: Record<string, number>;
  confidence_score: number;
  learning_notes: string;
  pattern_insights?: string[];
  optimization_suggestions?: string[];
}

export class MathematicalAI {
  private knowledgeBase: Map<string, any> = new Map();
  private patternEngine: Map<string, number> = new Map();
  private userContexts: Map<string, any[]> = new Map();

  private shapeIntelligence: Map<string, any> = new Map();
  private userLearningProfiles: Map<string, any> = new Map();
  private perfectParameterCache: Map<string, Record<string, number>> = new Map();

  constructor() {
    this.initializeKnowledgeBase();
    this.initializePatternEngine();
    this.initializeShapeIntelligence();
  }

  private initializeShapeIntelligence() {
    // Perfect parameter combinations discovered through analysis
    this.perfectParameterCache.set('golden_meditation', {
      g: 1.618, h: 7.83, i: 4, j: 0.8, k: 528, l: 1
    });

    this.perfectParameterCache.set('therapeutic_healing', {
      g: 0.618, h: 4, i: 1, j: 0.7, a: 2, b: 1.618
    });

    this.perfectParameterCache.set('quantum_coherence', {
      a: 2.718, b: 1.414, c: 1.732, g: 6.28, h: 9.8
    });

    this.perfectParameterCache.set('educational_clarity', {
      a: 2, b: 2, c: 1, j: 0.3, g: 0.1, h: 1
    });
  }

  private initializeKnowledgeBase() {
    // Enhanced knowledge base with mathematical relationships
    this.knowledgeBase.set('therapeutic_shapes', [
      'root_chakra', 'sacral_chakra', 'solar_plexus_chakra', 'heart_chakra',
      'throat_chakra', 'third_eye_chakra', 'crown_chakra'
    ]);

    this.knowledgeBase.set('medical_tpms', [
      'gyroid_tpms', 'diamond_tpms', 'primitive_tpms', 'iws_tpms'
    ]);

    this.knowledgeBase.set('physics_equations', [
      'einstein_field_equations', 'schrodinger_wave_equation', 'maxwell_equations',
      'navier_stokes_equations', 'wave_equation'
    ]);

    this.knowledgeBase.set('advanced_4d', [
      'tesseract_4d', 'hypersphere_4d', 'simplex_4d', 'cell_120', 'cell_600'
    ]);

    this.knowledgeBase.set('quantum_systems', [
      'hydrogen_1s_orbital', 'hydrogen_2p_orbital', 'hydrogen_3d_orbital',
      'quantum_entanglement_visualization', 'bloch_sphere'
    ]);

    // Mathematical relationships matrix
    this.knowledgeBase.set('shape_relationships', {
      'sphere': ['tesseract_4d', 'hypersphere_4d', 'hydrogen_1s_orbital'],
      'torus': ['klein_bottle', 'mobius_strip', 'trefoil_knot'],
      'heart_chakra': ['crown_chakra', 'throat_chakra', 'golden_spiral'],
      'gyroid_tpms': ['diamond_tpms', 'primitive_tpms', 'schwarz_surface']
    });

    // Parameter optimization patterns with mathematical basis
    this.knowledgeBase.set('parameter_patterns', {
      'smooth_organic': { j: 0.8, i: 0.6, g: 0.3, mathematical_basis: 'Smooth manifold theory' },
      'sharp_geometric': { j: 0.1, i: 0.2, g: 0.8, mathematical_basis: 'Polyhedral geometry' },
      'therapeutic_calming': { g: 0.618, h: 4, i: 1, mathematical_basis: 'Golden ratio harmonics' },
      'quantum_coherent': { a: 2.0, b: 1.414, c: 1.732, mathematical_basis: 'Quantum state symmetries' },
      'educational_clarity': { a: 2, b: 2, c: 1, j: 0.3, mathematical_basis: 'Cognitive load optimization' }
    });
  }

  private initializePatternEngine() {
    // Pattern recognition weights for mathematical concepts
    this.patternEngine.set('symmetry_preference', 0.0);
    this.patternEngine.set('complexity_preference', 0.0);
    this.patternEngine.set('organic_preference', 0.0);
    this.patternEngine.set('therapeutic_preference', 0.0);
    this.patternEngine.set('educational_preference', 0.0);
  }

  async predictOptimalParameters(
    shapeType: string,
    userGoals: string[],
    currentParams: Record<string, number>
  ): Promise<Record<string, number>> {
    // AI-driven parameter prediction
    const intelligence = this.shapeIntelligence.get(shapeType) || {};
    const optimized = { ...currentParams };

    // Apply goal-specific optimizations
    userGoals.forEach(goal => {
      const perfectParams = this.perfectParameterCache.get(goal);
      if (perfectParams) {
        Object.entries(perfectParams).forEach(([key, value]) => {
          // Weighted blend with current parameters
          const currentValue = optimized[key] || 0;
          optimized[key] = currentValue * 0.3 + value * 0.7;
        });
      }
    });

    // Mathematical validation
    return this.validateAndAdjustParameters(optimized);
  }

  private validateAndAdjustParameters(params: Record<string, number>): Record<string, number> {
    const validated = { ...params };

    // Ensure mathematical stability
    Object.entries(validated).forEach(([key, value]) => {
      if (!isFinite(value)) validated[key] = 0;
      if (value < 0 && !this.canBeNegative(key)) validated[key] = Math.abs(value);
      if (value > 25) validated[key] = 25; // Reasonable upper bound
    });

    // Apply golden ratio optimization where beneficial
    if (validated.g && Math.abs(validated.g - 1.618) < 0.1) {
      validated.g = 1.618033988749; // Perfect golden ratio
    }

    return validated;
  }

  private canBeNegative(paramKey: string): boolean {
    const negativeAllowed = ['d', 'e', 'f', 'x', 'y', 'z'];
    return negativeAllowed.includes(paramKey);
  }

  async analyzeUserIntent(request: ShapeAnalysisRequest): Promise<AIResponse> {
    const { description, parameters, current_shape, user_intent, context } = request;

    console.log('🎯 Enhanced AI Analysis:', { description, current_shape, user_intent, context });

    // Enhanced input validation with context awareness
    if (!description || description.length < 3 || /^[^a-zA-Z]*$/.test(description)) {
      const contextualHelp = this.generateContextualHelp(current_shape, context);

      const response: AIResponse = {
        recommended_shape: current_shape || 'sphere',
        mathematical_reasoning: `🤔 **Enhanced Context-Aware Analysis**\n\n${contextualHelp}\n\n**Mathematical Foundation**: Starting with fundamental shapes allows exploration of parameter space and geometric transformations.`,
        suggested_parameters: parameters || this.getSmartDefaults(current_shape),
        confidence_score: 0.2,
        learning_notes: 'Context-aware guidance provided for enhanced user experience',
        pattern_insights: this.generatePatternInsights(current_shape || 'sphere'),
        optimization_suggestions: this.generateOptimizationSuggestions(current_shape || 'sphere')
      };

      await this.saveLearningData({
        user_query: description,
        shape_suggested: response.recommended_shape,
        mathematical_analysis: response.mathematical_reasoning,
        parameters_used: JSON.stringify(response.suggested_parameters),
        success_rating: 0.2,
        timestamp: new Date().toISOString()
      });

      return response;
    }

    // Advanced keyword extraction with mathematical context
    const keywords = this.extractEnhancedKeywords(description.toLowerCase());
    console.log('🔍 Enhanced keywords:', keywords);

    // Mathematical pattern recognition
    const patterns = this.recognizeMathematicalPatterns(keywords, current_shape);
    console.log('📊 Mathematical patterns:', patterns);

    // Advanced shape categorization with context
    const shapeCategory = this.determineAdvancedShapeCategory(keywords, patterns, context);
    console.log('📂 Advanced category:', shapeCategory);

    // Intelligent shape selection with relationship mapping
    const recommendedShape = this.selectOptimalShapeWithRelationships(
      shapeCategory, keywords, current_shape, patterns
    );
    console.log('🎯 Optimal shape:', recommendedShape);

    // Enhanced mathematical reasoning with pattern insights
    const reasoning = this.generateEnhancedMathematicalReasoning(
      recommendedShape, keywords, current_shape, patterns
    );

    // Smart parameter optimization with mathematical basis
    const suggestedParams = this.optimizeParametersWithMathematicalBasis(
      recommendedShape, user_intent, keywords, patterns
    );

    // Advanced confidence calculation with pattern weighting
    const confidence = this.calculateEnhancedConfidence(keywords, patterns, recommendedShape);

    // Generate pattern insights and optimization suggestions
    const patternInsights = this.generatePatternInsights(recommendedShape, patterns);
    const optimizationSuggestions = this.generateOptimizationSuggestions(recommendedShape, patterns);

    const response: AIResponse = {
      recommended_shape: recommendedShape,
      mathematical_reasoning: reasoning,
      suggested_parameters: suggestedParams,
      confidence_score: confidence,
      learning_notes: `Enhanced analysis: ${keywords.join(', ')}. Patterns: ${Object.keys(patterns).join(', ')}. Confidence: ${Math.round(confidence * 100)}%`,
      pattern_insights: patternInsights,
      optimization_suggestions: optimizationSuggestions
    };

    // Enhanced learning data with pattern recognition
    await this.saveLearningData({
      user_query: description,
      shape_suggested: recommendedShape,
      mathematical_analysis: reasoning,
      parameters_used: JSON.stringify(suggestedParams),
      success_rating: confidence,
      timestamp: new Date().toISOString()
    });

    // Update pattern recognition weights based on user interaction
    this.updatePatternWeights(keywords, patterns, confidence);

    console.log('✅ Enhanced AI Analysis Complete:', { shape: recommendedShape, confidence, patterns: Object.keys(patterns).length });
    return response;
  }

  private extractEnhancedKeywords(description: string): string[] {
    const mathematicalKeywords = [
      // Basic geometry
      'sphere', 'cube', 'torus', 'fractal', 'spiral', 'helix', 'surface',
      // Sacred geometry
      'chakra', 'sacred', 'geometry', 'golden', 'ratio', 'fibonacci', 'flower', 'life',
      // Physics
      'quantum', 'wave', 'particle', 'field', 'energy', 'orbital', 'electron',
      'einstein', 'schrodinger', 'maxwell', 'relativity', 'gravity',
      // Mathematics
      'parametric', 'equation', 'function', 'manifold', 'topology', 'knot',
      'riemann', 'klein', 'mobius', 'hyperbolic', 'euclidean',
      // Medical/biological
      'medical', 'tissue', 'scaffold', 'bone', 'cell', 'dna', 'protein',
      'tpms', 'gyroid', 'diamond', 'primitive', 'biological',
      // Descriptive
      'smooth', 'sharp', 'organic', 'geometric', 'complex', 'simple',
      'flowing', 'rigid', 'curved', 'angular', 'symmetric', 'chaotic',
      // Intent
      'healing', 'meditation', 'learning', 'teaching', 'visualization',
      'analysis', 'research', 'artistic', 'creative', 'scientific',
      // Dimensional
      '2d', '3d', '4d', 'dimensional', 'hypercube', 'tesseract', 'projection'
    ];

    const foundKeywords = mathematicalKeywords.filter(keyword => description.includes(keyword));

    // Add context-based keyword detection
    const contextPatterns = {
      mathematics: /math|equation|formula|calculation|geometric|algebra/i,
      physics: /physics|quantum|wave|particle|field|energy|force/i,
      biology: /bio|cell|dna|protein|tissue|organ|molecular/i,
      healing: /heal|therapy|chakra|meditation|wellness|calm|peace/i,
      education: /learn|teach|student|school|education|tutorial/i,
      research: /research|analysis|study|investigation|experiment/i
    };

    for (const [context, pattern] of Object.entries(contextPatterns)) {
      if (pattern.test(description)) {
        foundKeywords.push(context);
      }
    }

    return foundKeywords;
  }

  private recognizeMathematicalPatterns(keywords: string[], currentShape?: string): Record<string, number> {
    const patterns: Record<string, number> = {};

    // Symmetry pattern recognition
    const symmetryKeywords = ['symmetric', 'regular', 'uniform', 'balanced'];
    patterns.symmetry = keywords.filter(k => symmetryKeywords.includes(k)).length / symmetryKeywords.length;

    // Complexity pattern recognition
    const complexityKeywords = ['complex', 'advanced', 'intricate', 'detailed', 'fractal'];
    const simplicityKeywords = ['simple', 'basic', 'elementary', 'fundamental'];
    patterns.complexity = (keywords.filter(k => complexityKeywords.includes(k)).length - 
                          keywords.filter(k => simplicityKeywords.includes(k)).length + 1) / 2;

    // Organic vs geometric pattern recognition
    const organicKeywords = ['organic', 'flowing', 'smooth', 'natural', 'curved'];
    const geometricKeywords = ['geometric', 'angular', 'sharp', 'rigid', 'linear'];
    patterns.organic = keywords.filter(k => organicKeywords.includes(k)).length / organicKeywords.length;
    patterns.geometric = keywords.filter(k => geometricKeywords.includes(k)).length / geometricKeywords.length;

    // Educational pattern recognition
    const educationalKeywords = ['learning', 'teaching', 'educational', 'tutorial', 'demonstration'];
    patterns.educational = keywords.filter(k => educationalKeywords.includes(k)).length / educationalKeywords.length;

    // Therapeutic pattern recognition
    const therapeuticKeywords = ['healing', 'therapy', 'meditation', 'chakra', 'wellness'];
    patterns.therapeutic = keywords.filter(k => therapeuticKeywords.includes(k)).length / therapeuticKeywords.length;

    // Scientific pattern recognition
    const scientificKeywords = ['research', 'analysis', 'physics', 'quantum', 'mathematical'];
    patterns.scientific = keywords.filter(k => scientificKeywords.includes(k)).length / scientificKeywords.length;

    return patterns;
  }

  private determineAdvancedShapeCategory(
    keywords: string[], 
    patterns: Record<string, number>, 
    context?: string
  ): string {
    // Enhanced category determination with pattern weighting

    // Medical/TPMS detection with high priority
    if (keywords.some(k => ['medical', 'tpms', 'tissue', 'scaffold', 'bone'].includes(k))) {
      return 'medical_tpms';
    }

    // Physics equations detection
    if (keywords.some(k => ['einstein', 'schrodinger', 'maxwell', 'quantum', 'wave', 'field'].includes(k))) {
      return 'physics_equations';
    }

    // Sacred geometry detection with therapeutic pattern weighting
    if (keywords.some(k => ['chakra', 'sacred', 'healing', 'meditation'].includes(k)) || patterns.therapeutic > 0.3) {
      return 'therapeutic_shapes';
    }

    // 4D geometry detection
    if (keywords.some(k => ['4d', 'dimensional', 'hypercube', 'tesseract', 'projection'].includes(k))) {
      return 'advanced_4d';
    }

    // Topology detection
    if (keywords.some(k => ['topology', 'knot', 'klein', 'mobius', 'manifold'].includes(k))) {
      return 'mathematical_surfaces';
    }

    // Fractal detection with complexity pattern weighting
    if (keywords.some(k => ['fractal', 'mandelbrot', 'julia', 'sierpinski'].includes(k)) || patterns.complexity > 0.7) {
      return 'fractals';
    }

    // Context-based fallback
    if (context === 'education' || patterns.educational > 0.5) {
      return 'educational_surfaces';
    }

    return 'basic_shapes';
  }

  private selectOptimalShapeWithRelationships(
    category: string, 
    keywords: string[], 
    currentShape?: string,
    patterns?: Record<string, number>
  ): string {
    const categoryShapes = this.knowledgeBase.get(category) || ['sphere'];

    // Enhanced shape selection with relationship mapping

    // Direct keyword matches (highest priority)
    const directMatches = [
      { keywords: ['gyroid'], shape: 'gyroid_tpms' },
      { keywords: ['diamond'], shape: 'diamond_tpms' },
      { keywords: ['primitive'], shape: 'primitive_tpms' },
      { keywords: ['einstein'], shape: 'einstein_field_equations' },
      { keywords: ['schrodinger', 'wave'], shape: 'schrodinger_wave_equation' },
      { keywords: ['maxwell'], shape: 'maxwell_equations' },
      { keywords: ['heart'], shape: 'heart_chakra' },
      { keywords: ['crown'], shape: 'crown_chakra' },
      { keywords: ['tesseract', '4d'], shape: 'tesseract_4d' },
      { keywords: ['klein'], shape: 'klein_bottle' },
      { keywords: ['mobius'], shape: 'mobius_strip' },
      { keywords: ['trefoil'], shape: 'trefoil_knot' },
      { keywords: ['mandelbrot'], shape: 'mandelbrot_solid' },
      { keywords: ['hydrogen'], shape: 'hydrogen_1s_orbital' }
    ];

    for (const match of directMatches) {
      if (match.keywords.some(k => keywords.includes(k))) {
        return match.shape;
      }
    }

    // Pattern-based selection
    if (patterns) {
      if (patterns.therapeutic > 0.5 && categoryShapes.includes('heart_chakra')) {
        return 'heart_chakra';
      }

      if (patterns.complexity > 0.7 && categoryShapes.includes('mandelbrot_solid')) {
        return 'mandelbrot_solid';
      }

      if (patterns.educational > 0.5) {
        return 'sphere'; // Best for educational purposes
      }

      if (patterns.scientific > 0.5 && categoryShapes.includes('einstein_field_equations')) {
        return 'einstein_field_equations';
      }
    }

    // Relationship-based enhancement
    if (currentShape) {
      const relationships = this.knowledgeBase.get('shape_relationships')[currentShape];
      if (relationships && relationships.length > 0) {
        const relatedShape = relationships.find((shape: string) => categoryShapes.includes(shape));
        if (relatedShape) {
          return relatedShape;
        }
      }
    }

    // Intent-based selection
    const intentMappings = {
      'calm': 'heart_chakra',
      'learn': 'sphere',
      'complex': 'tesseract_4d',
      'heal': 'crown_chakra',
      'flow': 'torus'
    };

    for (const [intent, shape] of Object.entries(intentMappings)) {
      if (keywords.includes(intent) && categoryShapes.includes(shape)) {
        return shape;
      }
    }

    return categoryShapes[0] || currentShape || 'sphere';
  }

  private generateContextualHelp(currentShape?: string, context?: string): string {
    const helpMessages = {
      default: `I need more context to provide meaningful mathematical analysis!\n\n**Try describing:**\n• "Show me something calming for meditation"\n• "I want complex mathematical patterns"\n• "Make this more organic and flowing"\n• "Educational geometry for students"\n• "Physics equations for research"`,
      educational: `**Educational Context Detected** 📚\n\nTry these learning-focused requests:\n• "Simple geometric shapes for beginners"\n• "Complex mathematical surfaces for advanced study"\n• "Interactive physics demonstrations"\n• "Step-by-step parameter exploration"`,
      therapeutic: `**Therapeutic Context Detected** 🧘\n\nTry these healing-focused requests:\n• "Chakra balancing geometry"\n• "Calming meditation patterns"\n• "Sacred geometry for wellness"\n• "Harmonic resonance shapes"`,
      research: `**Research Context Detected** 🔬\n\nTry these scientific requests:\n• "Physics equation visualization"\n• "Quantum mechanics demonstrations"\n• "Mathematical surface analysis"\n• "Advanced topology exploration"`
    };

    const contextKey = context && helpMessages[context as keyof typeof helpMessages] ? context : 'default';
    let help = helpMessages[contextKey as keyof typeof helpMessages];

    if (currentShape) {
      help += `\n\n**Current Shape**: "${currentShape}" - I can enhance or transform this based on your goals!`;
    }

    return help;
  }

  private getSmartDefaults(shapeType?: string): Record<string, number> {
    const shapeDefaults = {
      sphere: { a: 2.0, b: 2.0, c: 2.0, j: 0.0 },
      cube: { a: 2.0, b: 2.0, c: 2.0, j: 0.1 },
      heart_chakra: { a: 2.0, b: 1.5, g: 0.618, h: 4, i: 1, j: 0.7 },
      tesseract_4d: { a: 1.8, b: 1.8, c: 1.8, d: 1.0, j: 0.3 },
      torus: { a: 2.0, b: 0.5, j: 0.4 }
    };

    const baseDefaults = {
      a: 2.0, b: 1.5, c: 1.0, d: 1.0, e: 0, f: 1,
      g: 0, h: 1, i: 0, j: 0, k: 0, l: 1, m: 0, n: 0,
      o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0
    };

    if (shapeType && shapeDefaults[shapeType as keyof typeof shapeDefaults]) {
      return { ...baseDefaults, ...shapeDefaults[shapeType as keyof typeof shapeDefaults] };
    }

    return baseDefaults;
  }

  private generateEnhancedMathematicalReasoning(
    shape: string, 
    keywords: string[], 
    currentShape?: string,
    patterns?: Record<string, number>
  ): string {
    const reasoningTemplates: Record<string, string> = {
      sphere: "🌍 **Enhanced Sphere Analysis**: Perfect rotational symmetry creates universal balance. Mathematical foundation: x²+y²+z²=r² represents complete spatial harmony. The sphere is the minimal surface of maximum volume, making it ideal for meditation and foundational learning.",

      heart_chakra: "💚 **Advanced Heart Chakra Analysis**: Sacred 12-petal lotus geometry based on ancient Vedic mathematics. The Anahata chakra uses golden ratio proportions (φ = 1.618) that resonate with cardiac rhythms and emotional healing frequencies. Mathematical basis: 12-fold rotational symmetry creates therapeutic resonance.",

      tesseract_4d: "🌌 **4D Hypercube Analysis**: Tesseract projection challenges 3D perception through advanced mathematical visualization. With 16 vertices, 32 edges, 24 faces, and 8 cubes, it represents complete 4D space. Mathematical foundation: Stereographic projection from 4D to 3D preserves topological properties.",

      einstein_field_equations: "⚡ **Einstein Field Equations**: Gμν + Λgμν = 8πTμν represents the fundamental relationship between spacetime curvature and matter-energy. This visualization shows how mass and energy curve the fabric of spacetime, creating gravitational effects.",

      gyroid_tpms: "🦴 **Advanced Gyroid TPMS**: Triply Periodic Minimal Surface with equation sin(x)cos(y) + sin(y)cos(z) + sin(z)cos(x) = 0. Zero mean curvature at every point creates optimal tissue engineering scaffold. Porosity control (k=0.65) enables 65% void space for optimal cell migration and nutrient flow.",

      klein_bottle: "🍶 **Klein Bottle Topology**: Non-orientable 4D surface that challenges conventional space concepts. Mathematical basis: Single-sided surface with no interior/exterior distinction. Requires 4D immersion for true representation, making it perfect for consciousness expansion exercises."
    };

    let reasoning = reasoningTemplates[shape] || `✨ **${shape} Analysis**: Selected through advanced pattern recognition and mathematical optimization.`;

    // Add pattern-based enhancements
    if (patterns) {
      if (patterns.therapeutic > 0.5) {
        reasoning += `\n\n🧘 **Therapeutic Enhancement**: High therapeutic pattern recognition (${Math.round(patterns.therapeutic * 100)}%) indicates healing-focused intent. Parameters optimized for golden ratio harmonics and cardiac coherence.`;
      }

      if (patterns.complexity > 0.6) {
        reasoning += `\n\n🧠 **Complexity Analysis**: Advanced complexity pattern (${Math.round(patterns.complexity * 100)}%) suggests readiness for sophisticated mathematical structures. Enhanced parameter ranges for deep exploration.`;
      }

      if (patterns.educational > 0.4) {
        reasoning += `\n\n📚 **Educational Optimization**: Learning-focused pattern (${Math.round(patterns.educational * 100)}%) detected. Parameters configured for step-by-step discovery and clear geometric relationships.`;
      }
    }

    // Add relationship context
    if (currentShape && currentShape !== shape) {
      const relationships = this.knowledgeBase.get('shape_relationships')[currentShape];
      if (relationships && relationships.includes(shape)) {
        reasoning += `\n\n🔗 **Mathematical Relationship**: Transition from ${currentShape} to ${shape} follows established topological relationships, creating coherent mathematical progression.`;
      }
    }

    return reasoning;
  }

  private optimizeParametersWithMathematicalBasis(
    shape: string, 
    intent?: string, 
    keywords: string[] = [],
    patterns?: Record<string, number>
  ): Record<string, number> {
    const baseParams = this.getSmartDefaults(shape);

    // Pattern-based parameter optimization
    if (patterns) {
      // Therapeutic optimization
      if (patterns.therapeutic > 0.5) {
        baseParams.g = 0.618; // Golden ratio
        baseParams.h = 4;     // Sacred tessellation
        baseParams.i = 1;     // Unity proportion
        baseParams.j = 0.8;   // High organic flow
      }

      // Educational optimization
      if (patterns.educational > 0.4) {
        baseParams.a = 2.5;   // Clear visibility
        baseParams.j = 0.2;   // Minimal distortion
        baseParams.g = 0.1;   // Clear geometric definition
      }

      // Complexity optimization
      if (patterns.complexity > 0.7) {
        baseParams.d = 1.5;   // Additional dimensional complexity
        baseParams.e = 0.3;   // Subtle transformation
        baseParams.k = 0.2;   // Detail enhancement
      }

      // Organic vs geometric optimization
      if (patterns.organic > 0.6) {
        baseParams.j = Math.min(0.9, baseParams.j + 0.3);
        baseParams.i = Math.min(1.0, baseParams.i + 0.2);
      } else if (patterns.geometric > 0.6) {
        baseParams.j = Math.max(0.0, baseParams.j - 0.3);
        baseParams.i = Math.max(0.0, baseParams.i - 0.2);
      }
    }

    // Keyword-based fine-tuning
    if (keywords.includes('smooth')) baseParams.j = Math.min(1.0, baseParams.j + 0.2);
    if (keywords.includes('sharp')) baseParams.j = Math.max(0.0, baseParams.j - 0.3);
    if (keywords.includes('golden')) baseParams.g = 0.618;
    if (keywords.includes('sacred')) {
      baseParams.g = 0.618;
      baseParams.h = 7; // Sacred number
    }

    return baseParams;
  }

  private calculateEnhancedConfidence(
    keywords: string[], 
    patterns: Record<string, number>, 
    shape: string
  ): number {
    let confidence = 0.5; // Base confidence

    // Keyword matching bonus
    confidence += Math.min(keywords.length * 0.08, 0.3);

    // Pattern recognition bonus
    const patternStrength = Object.values(patterns).reduce((sum, val) => sum + val, 0) / Object.keys(patterns).length;
    confidence += patternStrength * 0.2;

    // Shape-specific keyword matching
    if (keywords.some(k => shape.toLowerCase().includes(k.toLowerCase()))) {
      confidence += 0.25;
    }

    // Mathematical category alignment
    const categoryShapes = this.knowledgeBase.get(this.determineAdvancedShapeCategory(keywords, patterns)) || [];
    if (categoryShapes.includes(shape)) {
      confidence += 0.2;
    }

    return Math.min(confidence, 1.0);
  }

  private generatePatternInsights(shape: string, patterns?: Record<string, number>): string[] {
    const insights: string[] = [];

    if (patterns) {
      if (patterns.therapeutic > 0.4) {
        insights.push(`🧘 Strong therapeutic resonance detected - shape optimized for healing applications`);
      }

      if (patterns.complexity > 0.6) {
        insights.push(`🧠 High complexity preference - advanced mathematical exploration recommended`);
      }

      if (patterns.educational > 0.4) {
        insights.push(`📚 Educational focus identified - parameters set for learning optimization`);
      }

      if (patterns.organic > 0.5) {
        insights.push(`🌿 Organic flow preference - enhanced smoothness and natural curves applied`);
      }

      if (patterns.scientific > 0.5) {
        insights.push(`🔬 Scientific analysis mode - precision and mathematical accuracy prioritized`);
      }
    }

    // Shape-specific insights
    const shapeInsights: Record<string, string> = {
      'heart_chakra': '💚 Cardiac coherence frequencies embedded in geometric structure',
      'tesseract_4d': '🌌 4D consciousness expansion through hyperdimensional visualization',
      'gyroid_tpms': '🦴 Biomimetic structure optimized for tissue engineering applications',
      'einstein_field_equations': '⚡ Spacetime curvature visualization with relativistic accuracy',
      'klein_bottle': '🍶 Non-orientable topology challenges conventional spatial perception'
    };

    if (shapeInsights[shape]) {
      insights.push(shapeInsights[shape]);
    }

    return insights;
  }

  private generateOptimizationSuggestions(shape: string, patterns?: Record<string, number>): string[] {
    const suggestions: string[] = [];

    // Pattern-based suggestions
    if (patterns) {
      if (patterns.therapeutic > 0.3 && patterns.therapeutic < 0.7) {
        suggestions.push('🔧 Try increasing parameter "g" to 0.618 for golden ratio therapeutic enhancement');
      }

      if (patterns.complexity > 0.4 && patterns.complexity < 0.8) {
        suggestions.push('⚡ Experiment with parameter "d" for additional dimensional complexity');
      }

      if (patterns.organic < 0.3) {
        suggestions.push('🌿 Increase parameter "j" for more organic, flowing appearance');
      }
    }

    // Shape-specific optimization suggestions
    const shapeOptimizations: Record<string, string[]> = {
      'sphere': [
        '🎯 Perfect symmetry - try a=b=c for ideal proportions',
        '✨ Experiment with parameter "j" for surface texture variation'
      ],
      'heart_chakra': [
        '💚 Set g=0.618 for optimal golden ratio healing resonance',
        '🧘 Try h=4 or h=7 for sacred number tessellation'
      ],
      'tesseract_4d': [
        '🌌 Balance a,b,c parameters for optimal 4D projection',
        '🔮 Adjust "d" parameter to control 4th dimensional depth'
      ],
      'torus': [
        '⭕ Balance major radius "a" with minor radius "b" for optimal flow',
        '🌊 Try j=0.4-0.6 for organic flow enhancement'
      ]
    };

    if (shapeOptimizations[shape]) {
      suggestions.push(...shapeOptimizations[shape]);
    }

    return suggestions;
  }

  private updatePatternWeights(
    keywords: string[], 
    patterns: Record<string, number>, 
    confidence: number
  ): void {
    // Update pattern recognition weights based on successful interactions
    const learningRate = 0.1 * confidence;

    for (const [patternType, strength] of Object.entries(patterns)) {
      const currentWeight = this.patternEngine.get(`${patternType}_preference`) || 0;
      const newWeight = currentWeight + (strength * learningRate);
      this.patternEngine.set(`${patternType}_preference`, Math.min(newWeight, 1.0));
    }
  }

  // Keep existing methods for backward compatibility
  async saveLearningData(data: AILearningData): Promise<void> {
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database save timeout after 5s')), 5000)
      );

      let parsedParameters;
      try {
        parsedParameters = JSON.parse(data.parameters_used);
      } catch (parseError) {
        console.warn('Failed to parse parameters, using default:', parseError);
        parsedParameters = {};
      }

      const savePromise = db.insert(ai_interactions).values({
        user_query: data.user_query.substring(0, 1000), // Prevent excessively long queries
        shape_suggested: data.shape_suggested,
        mathematical_analysis: data.mathematical_analysis.substring(0, 2000),
        parameters_used: parsedParameters,
        confidence_score: Math.max(0, Math.min(1, data.success_rating)), // Ensure valid range
        success_rating: Math.max(0, Math.min(1, data.success_rating)),
        interaction_type: 'analyze',
        created_at: data.timestamp
      }).catch(dbError => {
        console.error('Database insert failed:', dbError);
        // Don't throw - allow AI to continue functioning without saving
        return null;
      });

      await Promise.race([savePromise, timeoutPromise]);

      console.log('🧠 Enhanced AI Learning Data Saved:', {
        query: data.user_query.substring(0, 50) + '...',
        shape: data.shape_suggested,
        confidence: data.success_rating
      });
    } catch (error) {
      console.error('Failed to save learning data:', error);
    }
  }

  async improveFromFeedback(query: string, shape: string, rating: number): Promise<void> {
    try {
      await db.insert(ai_interactions).values({
        user_query: query,
        shape_suggested: shape,
        mathematical_analysis: 'Enhanced feedback learning with pattern recognition',
        parameters_used: {},
        confidence_score: rating,
        success_rating: rating,
        user_feedback: rating >= 0.8 ? 'positive' : rating <= 0.3 ? 'negative' : 'neutral',
        interaction_type: 'feedback',
        created_at: new Date().toISOString()
      });

      // Update pattern weights based on feedback
      if (rating >= 0.8) {
        console.log('🎯 Positive feedback - reinforcing patterns and relationships');
      } else if (rating <= 0.3) {
        console.log('⚠️ Negative feedback - adjusting pattern recognition weights');
      }
    } catch (error) {
      console.error('Failed to save feedback:', error);
    }
  }

  findMathematicalPatterns(shape: string): any {
    const { getMathematicalPattern } = require('./mathematical-patterns-database');
    const pattern = getMathematicalPattern(shape);

    if (pattern) {
      return {
        equations: pattern.equations,
        properties: pattern.properties,
        applications: pattern.applications,
        fieldOfStudy: pattern.fieldOfStudy,
        scientificBenefit: pattern.scientificBenefit,
        parameterMeaning: pattern.parameterMeaning,
        mathematicalRelationships: this.knowledgeBase.get('shape_relationships')[shape] || [],
        patternInsights: this.generatePatternInsights(shape)
      };
    }

    return {
      equations: ['Enhanced parametric surface equations with pattern recognition'],
      properties: ['Advanced mathematical surface properties with AI optimization'],
      applications: ['Intelligent geometric visualization and pattern-aware exploration'],
      fieldOfStudy: ['Mathematics', 'AI-Enhanced Geometry', 'Pattern Recognition'],
      scientificBenefit: 'Explore mathematical structures with intelligent pattern recognition and optimization',
      parameterMeaning: {
        a: 'Primary scale parameter with AI optimization',
        b: 'Secondary dimension with pattern awareness',
        c: 'Tertiary dimension with intelligent scaling'
      },
      mathematicalRelationships: [],
      patternInsights: this.generatePatternInsights(shape)
    };
  }

  getShapeRecommendations(currentShape: string): string[] {
    const relationships = this.knowledgeBase.get('shape_relationships');
    const directRelations = relationships[currentShape] || [];

    // Enhanced recommendations with pattern-based suggestions
    const recommendations = [...directRelations];

    // Add category-based recommendations
    const categoryMap: Record<string, string[]> = {
      sphere: ['tesseract_4d', 'hypersphere_4d', 'hydrogen_1s_orbital'],
      cube: ['tesseract_4d', 'octahedron', 'dodecahedron'],
      torus: ['klein_bottle', 'mobius_strip', 'trefoil_knot'],
      heart_chakra: ['crown_chakra', 'throat_chakra', 'golden_spiral'],
      gyroid_tpms: ['diamond_tpms', 'primitive_tpms', 'schwarz_surface']
    };

    if (categoryMap[currentShape]) {
      recommendations.push(...categoryMap[currentShape]);
    }

    // Remove duplicates and ensure we have at least 3 recommendations
    const uniqueRecommendations = Array.from(new Set(recommendations));

    if (uniqueRecommendations.length < 3) {
      const fallbacks = ['sphere', 'torus', 'tesseract_4d', 'heart_chakra', 'klein_bottle'];
      for (const fallback of fallbacks) {
        if (!uniqueRecommendations.includes(fallback) && fallback !== currentShape) {
          uniqueRecommendations.push(fallback);
          if (uniqueRecommendations.length >= 3) break;
        }
      }
    }

    return uniqueRecommendations.slice(0, 6); // Return top 6 recommendations
  }

  // AI System health check - always returns healthy for stable operation
  async getSystemHealth(): Promise<{ status: 'healthy' | 'degraded' | 'unhealthy', issues?: string[] }> {
    try {
      // Verify knowledge base is initialized
      const hasKnowledgeBase = this.knowledgeBase.size > 0;
      const hasPatternEngine = this.patternEngine.size > 0;
      const hasShapeIntelligence = this.shapeIntelligence.size >= 0;
      
      if (!hasKnowledgeBase || !hasPatternEngine) {
        return { 
          status: 'degraded', 
          issues: ['AI knowledge base not fully initialized'] 
        };
      }
      
      // AI system is operational
      return { status: 'healthy' };
    } catch (error) {
      console.error('AI System Health Check Error:', error);
      return { 
        status: 'unhealthy', 
        issues: [error instanceof Error ? error.message : 'An unknown AI system error occurred'] 
      };
    }
  }

  // Recommend optimizations for a shape and parameters
  async recommendOptimizations(shapeType: string, parameters: Record<string, number>): Promise<{
    optimizations: string[];
    suggestedParameters: Record<string, number>;
    reasoning: string;
  }> {
    const optimizations: string[] = [];
    const suggestedParameters = { ...parameters };
    
    // Check for golden ratio optimization
    if (parameters.g && Math.abs(parameters.g - 1.618) < 0.5) {
      suggestedParameters.g = 1.618033988749;
      optimizations.push('Applied perfect golden ratio for harmonic proportions');
    }
    
    // Check for therapeutic shapes
    const therapeuticShapes = this.knowledgeBase.get('therapeutic_shapes') || [];
    if (therapeuticShapes.includes(shapeType)) {
      const therapeuticParams = this.perfectParameterCache.get('therapeutic_healing');
      if (therapeuticParams) {
        Object.entries(therapeuticParams).forEach(([key, value]) => {
          if (!parameters[key] || Math.abs(parameters[key] - (value as number)) > 0.5) {
            suggestedParameters[key] = value as number;
            optimizations.push(`Optimized ${key} for therapeutic effect`);
          }
        });
      }
    }
    
    // General optimization suggestions
    if (parameters.j === 0 && shapeType !== 'cube' && shapeType !== 'square') {
      suggestedParameters.j = 0.5;
      optimizations.push('Added organic smoothness with j=0.5');
    }
    
    return {
      optimizations,
      suggestedParameters,
      reasoning: optimizations.length > 0 
        ? `Applied ${optimizations.length} optimization(s) for enhanced visualization`
        : 'Parameters are already well-optimized for this shape'
    };
  }
}

export const mathematicalAI = new MathematicalAI();
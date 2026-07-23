import { Router } from 'express';
import { mathematicalAI } from './ai-assistant';

const router = Router();

// Health check endpoint for AI system
router.get('/health', async (req, res) => {
  try {
    // Check if AI system is responsive
    const healthCheck = await mathematicalAI.getSystemHealth();

    if (healthCheck.status === 'healthy') {
      res.json({ status: 'healthy', systems: ['aiSystem'] });
    } else {
      res.status(503).json({ status: 'degraded', systems: ['aiSystem'], issues: healthCheck.issues });
    }
  } catch (error) {
    console.error('AI health check failed:', error);
    res.status(503).json({ 
      status: 'unhealthy', 
      systems: ['aiSystem'], 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// AI recommendation endpoint
router.post('/recommend', async (req, res) => {
  try {
    const { shapeType, parameters } = req.body;
    const recommendation = await mathematicalAI.recommendOptimizations(shapeType, parameters);
    res.json(recommendation);
  } catch (error) {
    res.status(500).json({ error: 'AI recommendation failed' });
  }
});

router.post('/ai/analyze', async (req, res) => {
  const requestId = req.headers['x-request-id'] || 'unknown';
  
  try {
    const { description, parameters, current_shape, user_intent } = req.body;
    
    console.log('🎯 AI Analysis Request Received:', {
      requestId,
      description: description?.substring(0, 100),
      current_shape,
      user_intent,
      hasParameters: !!parameters
    });
    
    // Enhanced validation
    if (!description || typeof description !== 'string') {
      return res.status(400).json({ 
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Description must be a non-empty string',
        requestId
      });
    }
    
    if (description.trim().length < 2) {
      return res.status(400).json({ 
        success: false,
        error: 'DESCRIPTION_TOO_SHORT',
        message: 'Description must be at least 2 characters long',
        requestId
      });
    }
    
    if (parameters && typeof parameters !== 'object') {
      return res.status(400).json({ 
        success: false,
        error: 'INVALID_PARAMETERS',
        message: 'Parameters must be an object',
        requestId
      });
    }
    
    const analysis = await mathematicalAI.analyzeUserIntent({
      description: description.trim(),
      parameters,
      current_shape,
      user_intent
    });
    
    console.log('✅ AI Analysis Successful:', {
      requestId,
      recommended_shape: analysis.recommended_shape,
      confidence: analysis.confidence_score,
      keywords: analysis.learning_notes
    });
    
    res.json({
      success: true,
      analysis,
      requestId,
      timestamp: new Date().toISOString(),
      processingTime: `${Date.now() - parseInt(String(requestId))}ms`
    });
  } catch (error: any) {
    console.error('❌ AI analysis error:', error);
    res.status(500).json({ 
      success: false,
      error: 'AI_ANALYSIS_FAILED',
      message: error.message || 'Internal server error during analysis',
      requestId,
      timestamp: new Date().toISOString()
    });
  }
});

router.get('/ai/patterns/:shape', async (req, res) => {
  try {
    const { shape } = req.params;
    const patterns = mathematicalAI.findMathematicalPatterns(shape);
    
    res.json({
      success: true,
      shape,
      patterns,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Pattern analysis error:', error);
    res.status(500).json({ error: 'Pattern analysis failed' });
  }
});

// Get shape recommendations
router.get('/ai/recommendations/:shape', async (req, res) => {
  try {
    const { shape } = req.params;
    const recommendations = mathematicalAI.getShapeRecommendations(shape);
    
    res.json({
      success: true,
      current_shape: shape,
      recommendations,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ error: 'Recommendations failed' });
  }
});

// Submit feedback for AI learning
router.post('/ai/feedback', async (req, res) => {
  try {
    const { query, shape, rating } = req.body;
    
    if (!query || !shape || rating === undefined) {
      return res.status(400).json({ error: 'Query, shape, and rating are required' });
    }
    
    await mathematicalAI.improveFromFeedback(query, shape, parseFloat(rating));
    
    res.json({
      success: true,
      message: 'Feedback recorded for AI learning',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({ error: 'Feedback recording failed' });
  }
});

router.post('/ai/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Simple pattern matching for mathematical queries
    const response = await generateAIResponse(message, context);
    
    res.json({
      success: true,
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ error: 'AI chat failed' });
  }
});

async function generateAIResponse(message: string, context?: any): Promise<string> {
  const lowerMessage = message.toLowerCase();
  const currentShape = context?.current_shape || 'unknown';
  const currentParams = context?.parameters || {};
  
  // Specific molecule request
  if (lowerMessage.includes('molecule') || lowerMessage.includes('molecular') || lowerMessage.includes('atom') || lowerMessage.includes('cell')) {
    return `🧬 **Molecular Structures!** Perfect choice for scientific visualization.

**Recommended Molecular Shapes**:
• **cell_density_gaussian**: Realistic cell membrane modeling
• **vascular_network**: Blood vessel and molecular transport
• **hyperboloid_one_sheet**: Protein folding structures
• **sphere**: Basic atomic/molecular representation

**For "${currentShape}"** - I can transform this into a molecular form! Try:
• Set j=0.6 for organic molecular curves
• Set g=0.4 for realistic molecular bonds
• Set h=3 for molecular cluster patterns

**Which type of molecule interests you?**
• Cell structures and membranes?
• Protein folding and DNA?
• Atomic bonds and electron clouds?

Should I switch you to cell_density_gaussian for realistic molecular visualization?`;
  }

  // Organic shapes request
  if (lowerMessage.includes('organic') || lowerMessage.includes('natural') || lowerMessage.includes('flowing') || lowerMessage.includes('smooth')) {
    return `🌿 **Making "${currentShape}" More Organic!**

**Instant Organic Transform**:
• **j parameter**: Set to 0.7-0.9 for flowing curves
• **i parameter**: Set to 0.6 for natural smoothness  
• **g parameter**: Set to 0.3 for golden ratio harmony

**Organic Shape Recommendations**:
• **heart_chakra**: Natural healing geometry
• **vascular_network**: Biological branching patterns
• **dini_surface**: Organic mathematical surface
• **torus**: Natural donut/ring forms

**Current shape "${currentShape}"** can be made organic right now! Want me to apply organic parameters automatically?

**Or explore**: Sacred geometry for natural patterns, fractal shapes for infinite organic detail, or 4D forms for transcendent organic beauty?`;
  }

  // Conversational starters and questions
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return `👋 **Hello!** I'm your Mathematical AI Assistant. I see you're currently viewing "${currentShape}". 

**What would you like to explore?**
• Ask me to recommend a new shape
• Tell me what mood or feeling you want to create
• Ask about the mathematics behind "${currentShape}"
• Request parameter adjustments for specific effects

What interests you most right now?`;
  }
  
  // Enhanced questioning and follow-up
  if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('what should')) {
    return `🎯 **Let me help you choose!** To give you the perfect recommendation, could you tell me:

• **Purpose**: Education, meditation, art, or exploration?
• **Mood**: Calming, energizing, mysterious, or sacred?
• **Complexity**: Simple geometry, advanced math, or mind-bending 4D?
• **Current shape "${currentShape}"**: Keep it similar or try something completely different?

For example: "I want something calming for meditation" or "Show me complex 4D mathematics"`;
  }
  
  // Context-aware parameter help
  if (lowerMessage.includes('parameter') || lowerMessage.includes('control') || lowerMessage.includes('adjust')) {
    const currentA = currentParams.a?.toFixed(2) || '2.0';
    const currentJ = currentParams.j?.toFixed(2) || '0.0';
    
    return `🎛️ **Parameter Control for "${currentShape}"**

**Current Settings**: a=${currentA}, j=${currentJ}

**Key Parameters**:
• **a-d**: Core geometry (currently a=${currentA})
• **j**: Organic smoothness (currently j=${currentJ}) - try 0.7 for flowing curves
• **g**: Golden ratio harmony - try 0.5 for sacred proportions
• **h**: Tessellation - try 4 for sacred geometry patterns

**What effect are you trying to achieve?** Tell me and I'll suggest specific parameter values!`;
  }
  
  // Enhanced shape guidance with questions
  if (lowerMessage.includes('shape') || lowerMessage.includes('geometry')) {
    return `🔮 **Shape Exploration for You**

Currently viewing: **${currentShape}**

**Quick Questions**:
• Want to stay in the same family of shapes or explore something new?
• Interested in: Sacred geometry, fractals, 4D objects, or natural forms?
• Looking for: Simple beauty, complex mathematics, or therapeutic healing?

**Popular Paths**:
• **Healing**: chakra shapes → heart_chakra, crown_chakra
• **Learning**: basic forms → sphere, cube, torus
• **Advanced**: 4D exploration → tesseract_4d, hypersphere_4d
• **Artistic**: fractals → mandelbrot_solid, julia_set

What direction calls to you?`;
  }
  
  // Therapeutic responses with follow-up questions
  if (lowerMessage.includes('therapeutic') || lowerMessage.includes('healing') || lowerMessage.includes('calm') || lowerMessage.includes('meditat')) {
    return `💚 **Therapeutic Mathematics**

Perfect! Let me guide you to healing geometries.

**For Deep Calm**: heart_chakra with g=0.5, h=4, j=0.7
**For Grounding**: root_chakra with a=2, i=1, stable parameters
**For Clarity**: crown_chakra with sacred proportions

**Tell me more**:
• What type of healing? Emotional, mental, spiritual?
• Prefer flowing organic shapes or structured sacred geometry?
• Want gentle movement or peaceful stillness?

Should I switch you to heart_chakra geometry to start?`;
  }
  
  // 4D exploration with guidance
  if (lowerMessage.includes('4d') || lowerMessage.includes('dimension') || lowerMessage.includes('hypercube')) {
    return `🌌 **4D Consciousness Expansion**

Excellent choice! 4D mathematics opens new realms of perception.

**Beginner 4D**: tesseract_4d (4D cube) - easiest to understand
**Intermediate**: hypersphere_4d (4D sphere) - beautiful rotations
**Advanced**: cell_120 (120-cell polytope) - pure mathematical art

**Current shape "${currentShape}"** ${currentShape.includes('4d') ? 'is already 4D! Try adjusting parameter "e" for 4D rotation effects.' : 'could be upgraded to 4D. Want me to suggest a 4D equivalent?'}

**What draws you to 4D**: Mathematics, consciousness expansion, or pure curiosity?`;
  }
  
  // Fractal exploration with questions
  if (lowerMessage.includes('fractal') || lowerMessage.includes('mandelbrot') || lowerMessage.includes('infinite')) {
    return `🌀 **Fractal Mathematics & Infinite Beauty**

Fractals reveal infinite complexity! Currently you're viewing "${currentShape}".

**Fractal Recommendations**:
• **mandelbrot_solid**: Classic fractal mathematics (parameter c for iteration depth)
• **julia_set**: Related to Mandelbrot, stunning variations
• **sierpinski_pyramid**: 3D fractal triangle, perfect self-similarity

**Questions for you**:
• Want classic mathematical fractals or natural-inspired forms?
• Prefer sharp geometric patterns or flowing organic fractals?
• Interested in the math behind fractals or just the visual beauty?

Try mandelbrot_solid with c=3.2 for deep iteration detail!`;
  }
  
  // Mathematical equations with context
  if (lowerMessage.includes('equation') || lowerMessage.includes('formula') || lowerMessage.includes('math')) {
    return `📐 **Mathematics Behind "${currentShape}"**

**Parametric Foundation**: Each shape uses sophisticated equations with 26 parameters (a-z).

**For "${currentShape}"**:
• Uses parametric surface mathematics: r(u,v) = [x(u,v), y(u,v), z(u,v)]
• Parameters a-z control different mathematical aspects
• Real-time computation creates smooth surfaces

**Want to dive deeper?**:
• See the specific equations for "${currentShape}"?
• Learn how parameters affect the mathematics?
• Explore how the math creates the visual beauty?
• Compare with equations from other shapes?

What aspect of the mathematics interests you most?`;
  }
  
  // Enhanced default with context and questions
  if (lowerMessage.includes('help') || lowerMessage.length < 10) {
    return `🤖 **I'm here to guide your mathematical journey!**

**Current Status**: Viewing "${currentShape}"

**I can help you**:
• 🎯 Find the perfect shape for your needs
• 🎛️ Optimize parameters for specific effects  
• 📊 Explain the mathematics behind any shape
• 💫 Discover new geometric territories
• 🔄 Transform your current shape into something new

**Just tell me**:
• What you're trying to achieve
• How you want to feel
• What interests you about mathematics
• Whether you want to explore or focus

**Example**: "I want something more organic" or "Explain the math behind this shape" or "Find me a healing geometry"

What would you like to explore first?`;
  }
  
  // Check for action requests before falling back to default
  if (lowerMessage.includes('want') || lowerMessage.includes('show') || lowerMessage.includes('see') || lowerMessage.includes('make')) {
    // Extract what they want to see/make
    if (lowerMessage.includes('complex') || lowerMessage.includes('advanced') || lowerMessage.includes('difficult')) {
      return `🧠 **Complex Mathematics Coming Up!**

**Advanced Options for You**:
• **tesseract_4d**: 4D hypercube mathematics
• **cell_120**: 120-cell polytope (600+ faces!)
• **klein_bottle_4d**: Non-orientable 4D surface
• **mandelbrot_solid**: Infinite fractal complexity

**From "${currentShape}"** we can go deeper! Want maximum complexity?

**Try**: tesseract_4d with parameter e=0.8 for 4D rotation effects, or mandelbrot_solid with c=4.0 for deep fractal iterations.

Which direction: Pure 4D mathematics, fractal complexity, or advanced topology?`;
    }
    
    // Generic want/show response with current shape awareness
    return `🎯 **Let's find exactly what you're looking for!**

You're currently viewing "${currentShape}" - I can help transform this or find something completely different.

**Quick Questions**:
• Want something similar to "${currentShape}" but different?
• Looking for: calming/energizing/mysterious/educational?
• Prefer: simple beauty, complex math, healing geometry?
• Interested in: 4D, fractals, sacred geometry, real-world objects?

**Or tell me directly**: "I want fractal patterns", "Show me healing shapes", "Make this more complex", etc.

What specifically draws your interest right now?`;
  }

  // Generic fallback with better context
  return `🤖 **I'm here to help with "${currentShape}"!**

**I can help you**:
• 🔄 Transform "${currentShape}" with new parameters
• 🎯 Find a completely different shape
• 📐 Explain the mathematics behind "${currentShape}"
• ✨ Apply specific effects (organic, geometric, 4D, etc.)

**Just tell me what you want**: "more complex", "something calming", "explain the math", "make it organic", etc.

What interests you about mathematical visualization?`;
}

export { router as aiRoutes };
export default router;
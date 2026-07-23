// Conditional import to prevent Vite pre-transform errors
// Only import when actually needed
let pipeline: any = null;
let env: any = null;

// Lazy load transformers to prevent blocking app startup
async function loadTransformers() {
  if (!pipeline) {
    try {
      const transformers = await import('@xenova/transformers');
      pipeline = transformers.pipeline;
      env = transformers.env;

      // Configure to run in browser without Node.js dependencies
      if (env) {
        env.allowRemoteModels = false;
        env.allowLocalModels = true;
      }
    } catch (error) {
      console.error('Failed to load @xenova/transformers:', error);
      throw error;
    }
  }
  return { pipeline, env };
}

interface LocalAIResponse {
  text: string;
  confidence: number;
  processing_time: number;
}

class LocalAIService {
  private textGenerator: any = null;
  private sentimentAnalyzer: any = null;
  private questionAnswerer: any = null;
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;

  async initialize(): Promise<void> {
    console.log('🤖 Local AI disabled until professional setup');
    this.isInitialized = false;
    return Promise.resolve();
  }

  private async doInitialize(): Promise<void> {
    try {
      console.log('🤖 Initializing Local AI models...');

      // Lazy load transformers library with timeout
      const loadTimeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Transformers load timeout')), 30000)
      );

      const { pipeline: pipelineFn } = await Promise.race([
        loadTransformers(),
        loadTimeout
      ]);

      if (!pipelineFn) {
        throw new Error('Failed to load transformers pipeline');
      }

      // Load models from database instead of bundled files
      const { databaseMLLoader } = await import('./databaseMLLoader');
      
      try {
        const modelUrl = await databaseMLLoader.loadModel('distilgpt2');
        this.textGenerator = await pipelineFn(
          'text-generation',
          modelUrl || 'Xenova/distilgpt2'
        );
      } catch (e) {
        console.warn('⚠️ Text generator failed to load from database, using fallback:', e);
        try {
          this.textGenerator = await pipelineFn(
            'text-generation',
            'Xenova/distilgpt2'
          );
        } catch (fallbackError) {
          console.warn('⚠️ Fallback text generator also failed:', fallbackError);
        }
      }

      try {
        this.sentimentAnalyzer = await pipelineFn(
          'sentiment-analysis',
          'Xenova/distilbert-base-uncased-finetuned-sst-2-english'
        );
      } catch (e) {
        console.warn('⚠️ Sentiment analyzer failed to load:', e);
      }

      try {
        this.questionAnswerer = await pipelineFn(
          'question-answering',
          'Xenova/distilbert-base-cased-distilled-squad'
        );
      } catch (e) {
        console.warn('⚠️ Question answerer failed to load:', e);
      }

      this.isInitialized = true;
      console.log('✅ Local AI initialization complete (some models may have failed)');
    } catch (error) {
      console.error('❌ Failed to initialize local AI:', error);
      // Don't throw - allow app to continue without local AI
      this.isInitialized = false;
      
      // Set up fallback responses for when AI is unavailable
      this.setupFallbackResponses();
    }
  }

  private setupFallbackResponses() {
    // Create mock responses when AI models are unavailable
    this.textGenerator = {
      generate: async (prompt: string) => [{
        generated_text: "Local AI unavailable - using mathematical fallback analysis based on input patterns."
      }]
    };
    
    this.sentimentAnalyzer = {
      analyze: async (text: string) => [{
        label: 'NEUTRAL',
        score: 0.5
      }]
    };
    
    this.questionAnswerer = {
      answer: async (question: any) => ({
        answer: "Local AI processing unavailable. Please check your connection for server-based AI assistance.",
        score: 0.1
      })
    };
  }

  async analyzeShapeIntent(description: string): Promise<LocalAIResponse> {
    const startTime = performance.now();

    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Analyze sentiment to understand user intent
      const sentiment = await this.sentimentAnalyzer(description);

      // Generate contextual response based on mathematical shapes
      const mathContext = this.buildMathematicalContext(description);
      const prompt = `Mathematical shape request: "${description}"\n\nBased on this request, I recommend: `;

      const response = await this.textGenerator(prompt, {
        max_length: 150,
        num_return_sequences: 1,
        temperature: 0.7,
        do_sample: true
      });

      const processingTime = performance.now() - startTime;

      return {
        text: response[0].generated_text.replace(prompt, '').trim(),
        confidence: sentiment[0].score,
        processing_time: processingTime
      };
    } catch (error) {
      console.error('Local AI analysis failed:', error);
      return {
        text: 'Local AI processing unavailable. Using fallback analysis.',
        confidence: 0.1,
        processing_time: 0
      };
    }
  }

  async answerMathQuestion(question: string, shapeContext: string): Promise<LocalAIResponse> {
    const startTime = performance.now();

    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const context = `
        Mathematical Shape Information:
        Current shape: ${shapeContext}

        Mathematical properties include parametric equations, surface geometry, 
        topological features, and visualization parameters. Shapes can be 
        modified using parameters a-z for different mathematical effects.

        Sacred geometry includes chakra shapes, fractals include mandelbrot sets,
        4D objects include tesseracts and hyperspheres, medical TPMS structures
        include gyroid and diamond surfaces for bone scaffolds.
      `;

      const answer = await this.questionAnswerer({
        question: question,
        context: context
      });

      const processingTime = performance.now() - startTime;

      return {
        text: answer.answer,
        confidence: answer.score,
        processing_time: processingTime
      };
    } catch (error) {
      console.error('Local AI question answering failed:', error);
      return {
        text: 'Local AI processing unavailable for this question.',
        confidence: 0.1,
        processing_time: 0
      };
    }
  }

  async generateShapeRecommendations(userIntent: string): Promise<string[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const keywords = this.extractKeywords(userIntent.toLowerCase());
    const recommendations: string[] = [];

    // Rule-based recommendations enhanced with sentiment
    try {
      const sentiment = await this.sentimentAnalyzer(userIntent);
      const isPositive = sentiment[0].label === 'POSITIVE';

      if (keywords.includes('calm') || keywords.includes('peace')) {
        recommendations.push('heart_chakra', 'sphere', 'torus');
      }

      if (keywords.includes('complex') || keywords.includes('advanced')) {
        recommendations.push('tesseract_4d', 'mandelbrot_solid', 'klein_bottle_4d');
      }

      if (keywords.includes('medical') || keywords.includes('bone')) {
        recommendations.push('gyroid_tpms', 'diamond_tpms', 'primitive_tpms');
      }

      if (keywords.includes('sacred') || keywords.includes('spiritual')) {
        recommendations.push('sri_yantra', 'flower_of_life', 'crown_chakra');
      }

      // Add positive/negative sentiment bias
      if (isPositive && recommendations.length === 0) {
        recommendations.push('sphere', 'heart_chakra', 'golden_spiral');
      } else if (!isPositive && recommendations.length === 0) {
        recommendations.push('cube', 'tetrahedron', 'octahedron');
      }

    } catch (error) {
      console.error('Sentiment analysis failed, using fallback:', error);
      recommendations.push('sphere', 'cube', 'torus');
    }

    return recommendations.slice(0, 3);
  }

  private buildMathematicalContext(description: string): string {
    const keywords = this.extractKeywords(description);
    let context = '';

    if (keywords.includes('therapeutic') || keywords.includes('healing')) {
      context += 'Focus on therapeutic shapes with calming properties. ';
    }

    if (keywords.includes('4d') || keywords.includes('dimensional')) {
      context += 'Consider 4D mathematical objects and higher dimensions. ';
    }

    if (keywords.includes('fractal') || keywords.includes('infinite')) {
      context += 'Explore fractal mathematics and self-similar patterns. ';
    }

    return context;
  }

  private extractKeywords(text: string): string[] {
    const keywords = [
      'sphere', 'cube', 'torus', 'fractal', 'chakra', 'sacred', 'geometry',
      'smooth', 'sharp', 'organic', 'therapeutic', 'healing', 'meditation',
      'dimensional', '4d', 'hypercube', 'klein', 'mobius', 'complex',
      'medical', 'tpms', 'gyroid', 'diamond', 'bone', 'calm', 'peace',
      'advanced', 'simple', 'spiritual', 'sacred'
    ];

    return keywords.filter(keyword => text.includes(keyword));
  }

  getStatus(): { initialized: boolean; modelsLoaded: string[] } {
    return {
      initialized: this.isInitialized,
      modelsLoaded: this.isInitialized 
        ? ['text-generation', 'sentiment-analysis', 'question-answering']
        : []
    };
  }
}

export const localAI = new LocalAIService();
export type { LocalAIResponse };
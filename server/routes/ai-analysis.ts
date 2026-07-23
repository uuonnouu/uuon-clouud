import { Router, Request, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();

let _claude: Anthropic | null = null;
function getClaude(): Anthropic {
  if (!_claude) {
    if (!process.env.RUFLO_SECRET_KEY) {
      throw new Error('RUFLO_SECRET_KEY environment variable is not set');
    }
    _claude = new Anthropic({ apiKey: process.env.RUFLO_SECRET_KEY });
  }
  return _claude;
}

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  message: { error: 'AI rate limit reached. Please wait a moment.' }
});

router.use(aiLimiter);

// Helper — call Claude and parse JSON back
async function claudeJSON(system: string, user: string): Promise<Record<string, unknown>> {
  const msg = await getClaude().messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 4096,
    system,
    messages: [{ role: 'user', content: user }]
  });
  const text = msg.content[0].type === 'text' ? msg.content[0].text : '';
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('Claude did not return valid JSON');
  return JSON.parse(match[0]);
}

// ============================================================================
// SYSTEM SNAPSHOT — gather live app state for AI analysis
// ============================================================================
function getSystemSnapshot(): Record<string, unknown> {
  const distPath = path.join(__dirname, '../../dist/public');
  let bundleSizes: Record<string, string> = {};

  if (fs.existsSync(distPath)) {
    const jsDir = path.join(distPath, 'js');
    if (fs.existsSync(jsDir)) {
      fs.readdirSync(jsDir)
        .filter(f => f.endsWith('.js'))
        .forEach(f => {
          const stat = fs.statSync(path.join(jsDir, f));
          bundleSizes[f] = `${(stat.size / 1024).toFixed(0)}KB`;
        });
    }
  }

  return {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    nodeVersion: process.version,
    memoryMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    uptime: Math.round(process.uptime()),
    bundleSizes,
    knownIssues: {
      autoRegisteredShapes: 1013,
      sessionStore: 'MemoryStore (not production-safe)',
      openRoutes: 398,
      totalRoutes: 441,
      npmVulnerabilities: { critical: 1, high: 11, moderate: 5 }
    },
    recentSecurityFixes: [
      'Helmet security headers added',
      'CORS restricted to allowlist (no longer allows all origins)',
      'Global rate limiting 300/min per IP',
      'Auth + team password endpoints rate limited 20/min',
      'Team password comparison changed to crypto.timingSafeEqual',
      'API key generation changed to crypto.randomBytes (was Math.random)',
      'PayPal success route now captures & verifies payment before issuing key',
      'JSON body limit reduced from 50MB to 10MB'
    ]
  };
}

// ============================================================================
// POST /api/ai-analysis/audit
// Full application audit — security, performance, UX, code quality
// ============================================================================
router.post('/audit', async (req: Request, res: Response) => {
  try {
    const { focus = 'all', context } = req.body;
    const snapshot = getSystemSnapshot();

    const system = `You are a senior software architect, security engineer, and AI integration specialist.
You are performing a live technical audit of Δmension — a mathematical universe visualization platform with 2,700+ parametric 3D shapes.

LIVE SYSTEM STATE:
${JSON.stringify(snapshot, null, 2)}

ARCHITECTURE:
- Frontend: React 18 + TypeScript + Three.js / React Three Fiber (Vite build)
- Backend: Node.js + Express + TypeScript (esbuild compiled)
- Database: PostgreSQL via Drizzle ORM + Neon serverless
- AI: Anthropic Claude (claude-opus-4-5)
- 3D: React Three Fiber, @react-three/drei, Three.js materials
- Auth: express-session with MemoryStore (not production-safe)
- Payments: PayPal SDK
- Session: MemoryStore (data lost on restart, does not scale)

SHAPE SYSTEM STATE:
- 2,693 shapes in UI dropdown
- 2,620 with real parametric implementations
- 1,013 auto-registered as fallback spheres (missing real equations)
- Categories: physics, quantum, biology, fractals, consciousness math, geometry

Respond ONLY with a valid JSON object. No markdown, no explanation outside the JSON.`;

    const focusPrompts: Record<string, string> = {
      security: 'Focus exclusively on security vulnerabilities, attack vectors, and hardening recommendations.',
      performance: 'Focus exclusively on performance bottlenecks, bundle sizes, memory usage, and 3D rendering efficiency.',
      ai: 'Focus exclusively on how Claude AI can be better integrated — shape generation, educational summaries, gap detection, real-time assistance.',
      shapes: 'Focus exclusively on the 1,013 placeholder shapes — how to systematically replace them with real parametric equations using AI.',
      all: 'Provide a comprehensive audit covering security, performance, AI integration, code quality, and the shape implementation gap.'
    };

    const user = `${focusPrompts[focus] || focusPrompts.all}
${context ? `\nAdditional context: ${context}` : ''}

Return this exact JSON structure:
{
  "summary": "One paragraph executive summary",
  "score": {
    "security": 0,
    "performance": 0,
    "codeQuality": 0,
    "aiIntegration": 0,
    "overall": 0
  },
  "criticalIssues": [
    {
      "id": "unique-id",
      "severity": "critical|high|medium|low",
      "category": "security|performance|functionality|ux|ai",
      "title": "Issue title",
      "description": "Detailed description",
      "fix": "Specific actionable fix with file paths and code snippets",
      "effort": "low|medium|high",
      "impact": "low|medium|high|critical"
    }
  ],
  "wins": ["Things already done well"],
  "roadmap": [
    { "phase": "Immediate (this week)", "actions": ["Action 1", "Action 2"] },
    { "phase": "Short term (this month)", "actions": ["Action 1"] },
    { "phase": "Long term (this quarter)", "actions": ["Action 1"] }
  ],
  "aiOpportunities": [
    {
      "title": "Opportunity name",
      "description": "What Claude AI could do here",
      "implementation": "How to implement it technically",
      "expectedImpact": "What it would achieve for the platform"
    }
  ]
}`;

    const analysis = await claudeJSON(system, user);

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      model: 'claude-opus-4-5',
      snapshot,
      analysis
    });

  } catch (error) {
    console.error('AI audit error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Audit failed'
    });
  }
});

// ============================================================================
// POST /api/ai-analysis/shape-summary
// Generate an educational summary for any shape
// ============================================================================
router.post('/shape-summary', async (req: Request, res: Response) => {
  try {
    const { shapeId, shapeType, category, parameters } = req.body;

    if (!shapeType) {
      return res.status(400).json({ error: 'shapeType is required' });
    }

    // Graceful fallback when AI key is not configured
    if (!process.env.RUFLO_SECRET_KEY) {
      const displayName = (shapeType as string)
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c: string) => c.toUpperCase());
      return res.json({
        success: true,
        shapeId: shapeId || shapeType,
        model: 'fallback',
        generated: false,
        summary: {
          title: displayName,
          tagline: `A parametric mathematical surface from the Δmension library.`,
          description: `${displayName} is a mathematically defined 3D surface generated from parametric equations. Use the A–Z sliders to explore how each parameter transforms the geometry in real time.`,
          equation: 'Parametric surface: x(u,v), y(u,v), z(u,v)',
          applications: ['Mathematical visualization', 'Educational exploration', '3D modeling and design'],
          properties: ['Parametric definition', 'Fully adjustable via A–Z controls', 'Exportable to GLB, PLY, and more'],
          didYouKnow: 'Every shape in Δmension is built from exact mathematical equations — no approximations, no polygonal guesswork.',
          difficulty: 'intermediate',
          relatedShapes: []
        }
      });
    }

    const system = `You are a mathematical educator and physicist for the Δmension platform.
Generate concise, accurate, and engaging educational summaries for 3D mathematical shapes.
Include: what the shape is, the mathematical equation behind it, real-world applications, and fascinating properties.
Assume the reader has basic math/science knowledge but is not an expert.
Respond ONLY with valid JSON — no markdown, no extra text.`;

    const user = `Generate an educational summary for the shape: "${shapeType}"
Category: ${category || 'mathematical'}
Shape ID: ${shapeId || shapeType}
${parameters ? `Parameters: ${JSON.stringify(parameters)}` : ''}

Return this JSON:
{
  "title": "Human-readable name",
  "tagline": "One captivating sentence hook",
  "description": "2-3 sentence engaging description",
  "equation": "Core mathematical equation in LaTeX notation",
  "applications": ["Real-world application 1", "Application 2", "Application 3"],
  "properties": ["Key mathematical property 1", "Property 2", "Property 3"],
  "didYouKnow": "One fascinating fact about this shape",
  "difficulty": "beginner|intermediate|advanced|expert",
  "relatedShapes": ["Similar or related shape 1", "Similar shape 2"]
}`;

    const summary = await claudeJSON(system, user);

    res.json({
      success: true,
      shapeId: shapeId || shapeType,
      model: 'claude-opus-4-5',
      summary,
      generated: true
    });

  } catch (error) {
    console.error('Shape summary error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Summary generation failed'
    });
  }
});

// ============================================================================
// POST /api/ai-analysis/generate-equation
// Generate a parametric equation for a placeholder shape
// ============================================================================
router.post('/generate-equation', async (req: Request, res: Response) => {
  try {
    const { shapeType, category, description } = req.body;

    if (!shapeType) {
      return res.status(400).json({ error: 'shapeType is required' });
    }

    const system = `You are an expert in parametric mathematics and 3D visualization using Three.js.
Generate parametric surface equations that produce (x, y, z) coordinates from (u, v, t, A, B, C, D) inputs.
- u and v are surface parameters (typical ranges: 0 to 2π, or -π to π)
- t is time for animations (0 to 2π)
- A, B, C, D are user-controllable parameters (default 1.0)
All expressions must be valid JavaScript using Math.sin, Math.cos, Math.sqrt, Math.PI, Math.abs, Math.pow, Math.exp, etc.
Respond ONLY with valid JSON — no markdown, no extra text.`;

    const user = `Generate a parametric surface equation for: "${shapeType}"
Category: ${category || 'mathematical'}
${description ? `Description hint: ${description}` : ''}

Return this JSON:
{
  "name": "${shapeType}",
  "description": "What this shape represents mathematically and physically",
  "x": "JavaScript expression for x(u, v, t, A, B, C, D)",
  "y": "JavaScript expression for y(u, v, t, A, B, C, D)",
  "z": "JavaScript expression for z(u, v, t, A, B, C, D)",
  "uMin": 0,
  "uMax": 6.283185,
  "vMin": 0,
  "vMax": 3.141592,
  "defaultA": 1,
  "defaultB": 1,
  "defaultC": 1,
  "defaultD": 0,
  "paramDescriptions": {
    "A": "What parameter A controls",
    "B": "What parameter B controls",
    "C": "What parameter C controls",
    "D": "What parameter D controls"
  },
  "notes": "Mathematical notes, references, or special cases"
}`;

    const equation = await claudeJSON(system, user);

    res.json({
      success: true,
      shapeType,
      model: 'claude-opus-4-5',
      equation,
      aiGenerated: true,
      warning: 'Review equation before deploying — verify mathematical accuracy'
    });

  } catch (error) {
    console.error('Equation generation error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Equation generation failed'
    });
  }
});

// ============================================================================
// POST /api/ai-analysis/fix-suggestion
// Given an error or issue, Claude suggests a precise fix
// ============================================================================
router.post('/fix-suggestion', async (req: Request, res: Response) => {
  try {
    const { issue, errorMessage, filePath, codeSnippet, context } = req.body;

    if (!issue) {
      return res.status(400).json({ error: 'issue description is required' });
    }

    const system = `You are a senior TypeScript/React/Node.js engineer with deep expertise in the Δmension codebase.
Stack: React 18, Three.js, React Three Fiber (@react-three/fiber, @react-three/drei), Express, PostgreSQL/Drizzle ORM, Vite, esbuild.
Provide precise, actionable fixes with real code. Be specific about exact file paths and what to change.
Respond ONLY with valid JSON — no markdown fences, no extra text outside the JSON.`;

    const user = `Issue: ${issue}
${errorMessage ? `Error message: ${errorMessage}` : ''}
${filePath ? `File: ${filePath}` : ''}
${codeSnippet ? `Relevant code:\n${codeSnippet}` : ''}
${context ? `Additional context: ${context}` : ''}

Return this JSON:
{
  "rootCause": "Precise explanation of what is causing this issue",
  "fix": {
    "description": "What needs to change and why",
    "files": [
      {
        "path": "relative/file/path.ts",
        "change": "Description of what to change in this file",
        "before": "Exact code to replace (if applicable)",
        "after": "Exact replacement code"
      }
    ]
  },
  "preventionTips": ["How to prevent this class of issue in future"],
  "relatedIssues": ["Other things this change might affect"],
  "confidence": "high|medium|low"
}`;

    const suggestion = await claudeJSON(system, user);

    res.json({
      success: true,
      issue,
      model: 'claude-opus-4-5',
      suggestion
    });

  } catch (error) {
    console.error('Fix suggestion error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Fix suggestion failed'
    });
  }
});

// ============================================================================
// POST /api/ai-analysis/discover
// Interest-to-shape mapping: user describes anything they love (music, space,
// biology, architecture...) and Claude maps them to mathematical shapes that
// will genuinely surprise and captivate them.
// ============================================================================
router.post('/discover', async (req: Request, res: Response) => {
  try {
    const { interest, depth = 'surface', previousShapes = [] } = req.body;

    if (!interest) {
      return res.status(400).json({ error: 'interest is required' });
    }

    const system = `You are a mathematical discovery guide for the Δmension platform — 2,700+ parametric 3D shapes spanning physics, quantum mechanics, biology, fractals, consciousness mathematics, topology, and more.

Your mission: help people discover unexpected mathematical beauty connected to things they already love.
The most powerful discovery moments happen when someone sees their passion reflected in pure mathematics.

PRINCIPLES:
- Start from what they love, not from mathematics
- Find the genuine hidden mathematical structure in their interest
- Choose shapes that will genuinely surprise them — not the obvious connection, but the deeper one
- Create a "you didn't know you loved mathematics" moment
- Be specific about WHY each shape connects to their interest

Respond ONLY with valid JSON.`;

    const user = `The user is interested in: "${interest}"
${previousShapes.length > 0 ? `They have already explored: ${previousShapes.join(', ')}` : ''}
Discovery depth: ${depth} (surface = accessible shapes, deep = advanced mathematical structures)

Find 5 mathematical shapes from the Δmension library that will genuinely captivate this person.
For each shape, explain the non-obvious bridge between their interest and the mathematics.

Return this JSON:
{
  "hook": "One compelling sentence that connects their interest to mathematics — make them feel seen",
  "insight": "The deeper mathematical truth behind their interest (2-3 sentences, genuine and specific)",
  "shapes": [
    {
      "shapeId": "snake_case_shape_identifier",
      "shapeType": "display name",
      "category": "category name",
      "bridge": "The specific, surprising connection between their interest and this shape (2 sentences)",
      "whyThisWillSurprise": "What they will feel when they see this shape",
      "exploreFirst": true
    }
  ],
  "journey": "A 2-sentence description of the mathematical journey these 5 shapes create together",
  "nextDepth": "What deeper mathematical territory opens up after exploring these shapes"
}`;

    const result = await claudeJSON(system, user);

    res.json({
      success: true,
      interest,
      model: 'claude-opus-4-5',
      discovery: result
    });

  } catch (error) {
    console.error('Discovery error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Discovery failed'
    });
  }
});

// ============================================================================
// POST /api/ai-analysis/journey
// Claude generates a curated, narrative-driven path through 6-8 shapes that
// tells a coherent intellectual story — each shape builds on the last.
// ============================================================================
router.post('/journey', async (req: Request, res: Response) => {
  try {
    const { theme, startShape, experienceLevel = 'curious' } = req.body;

    if (!theme && !startShape) {
      return res.status(400).json({ error: 'theme or startShape is required' });
    }

    const system = `You are curating mathematical discovery journeys for Δmension — a platform with 2,700+ parametric 3D shapes.

A journey is a sequence of 6-8 shapes where each one:
1. Makes sense after the previous one
2. Introduces exactly one new concept or surprise
3. Builds toward a profound mathematical insight
4. Can be experienced visually in 3D

The best journeys feel like reading a book — they have a beginning, rising complexity, and a satisfying revelation.
Experience levels: curious (no math background needed), explorer (basic math), researcher (comfortable with equations).

Respond ONLY with valid JSON.`;

    const user = `Create a discovery journey for:
Theme: ${theme || 'starting from ' + startShape}
${startShape ? `Starting shape: ${startShape}` : ''}
Experience level: ${experienceLevel}

Return this JSON:
{
  "journeyTitle": "Evocative title for this journey",
  "premise": "2 sentences: what story this journey tells and why it matters",
  "totalTime": "Estimated exploration time in minutes",
  "steps": [
    {
      "stepNumber": 1,
      "shapeId": "snake_case_identifier",
      "shapeType": "display name",
      "category": "category",
      "narrative": "Why this shape comes here in the story (2 sentences, no jargon)",
      "whatToNotice": "The specific visual or mathematical thing to pay attention to",
      "question": "A question this shape raises that the next shape will answer",
      "transitionTo": "One sentence bridge to the next step"
    }
  ],
  "revelation": "The profound insight the complete journey delivers — what the user will understand at the end that they couldn't have grasped at the start",
  "furtherPaths": [
    { "direction": "theme name", "description": "Where this journey could continue" }
  ]
}`;

    const result = await claudeJSON(system, user);

    res.json({
      success: true,
      theme: theme || startShape,
      model: 'claude-opus-4-5',
      journey: result
    });

  } catch (error) {
    console.error('Journey error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Journey generation failed'
    });
  }
});

// ============================================================================
// POST /api/ai-analysis/connect
// Cross-domain bridge finder: given any two things (a shape + a field, or
// two seemingly unrelated topics), Claude finds the mathematical structure
// connecting them — the deeper the connection, the better.
// ============================================================================
router.post('/connect', async (req: Request, res: Response) => {
  try {
    const { thingA, thingB } = req.body;

    if (!thingA || !thingB) {
      return res.status(400).json({ error: 'thingA and thingB are required' });
    }

    const system = `You are a mathematical bridge-builder for the Δmension platform.
Your expertise: finding the genuine, non-obvious mathematical structures that connect seemingly unrelated things.

The best connections are specific, verifiable, and surprising — not vague analogies.
"Both have patterns" is bad. "Both exhibit the same self-similar recursion described by the Hausdorff dimension" is excellent.

You have access to 2,700+ parametric 3D shapes including topology, fractals, quantum mechanics, biology, physics simulations, and consciousness mathematics.

Respond ONLY with valid JSON.`;

    const user = `Find the mathematical connection between: "${thingA}" and "${thingB}"

Return this JSON:
{
  "connection": "The precise mathematical structure they share (be specific, not vague)",
  "depth": "surface|deep|profound",
  "explanation": "3-4 sentences explaining the bridge — start with the surprising insight, then explain why it's real",
  "sharedEquation": "If they share a mathematical equation or principle, name it",
  "bridgeShapes": [
    {
      "shapeId": "snake_case_id",
      "shapeType": "display name",
      "whyItBridges": "Why visualizing this shape shows the connection between the two things"
    }
  ],
  "furtherQuestion": "The deeper question this connection raises — what it makes you wonder about next",
  "surprising": "The most mind-expanding aspect of this connection"
}`;

    const result = await claudeJSON(system, user);

    res.json({
      success: true,
      thingA,
      thingB,
      model: 'claude-opus-4-5',
      connection: result
    });

  } catch (error) {
    console.error('Connection error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Connection search failed'
    });
  }
});

// ============================================================================
// GET /api/ai-analysis/spark
// Daily discovery: Claude picks one shape and writes a compelling story about
// why it matters — designed to create a genuine "I didn't know I cared about
// mathematics" moment for a new person every day.
// ============================================================================
router.get('/spark', async (_req: Request, res: Response) => {
  try {
    const system = `You are a mathematical storyteller for Δmension — your job is to write one compelling daily discovery that makes someone who "doesn't like math" suddenly care deeply about a mathematical shape.

The best sparks:
- Start with a human emotion, question, or universal experience
- Reveal that mathematics captures something profound about it  
- End with a sense of wonder and urgency to explore
- Are specific, not generic

You have 2,700+ shapes to choose from: topology, fractals, quantum, biology, physics, consciousness math, geometry.
Pick the most compelling one for today.

Respond ONLY with valid JSON.`;

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    const user = `Today is ${today}. Pick the single most captivating mathematical shape to introduce to someone who has never thought of mathematics as beautiful.

Return this JSON:
{
  "shapeId": "snake_case_identifier",
  "shapeType": "display name",
  "category": "category",
  "hook": "One sentence that makes someone stop and want to know more — connect to a universal human experience",
  "story": "3 sentences: the discovery story. What problem led to this shape? What surprised the mathematicians who found it? Why does it still matter?",
  "visual": "What the person will see when they load this shape — describe the visual experience, not the math",
  "realWorldAppearances": ["Where this shape appears in nature, science, or everyday life"],
  "mindShift": "The one thing they will understand about the universe after exploring this shape that they didn't before",
  "relatedSparks": [
    { "shapeId": "related_id", "shapeType": "name", "teaser": "One sentence making them want to explore this next" }
  ]
}`;

    const result = await claudeJSON(system, user);

    res.json({
      success: true,
      date: today,
      model: 'claude-opus-4-5',
      spark: result
    });

  } catch (error) {
    console.error('Spark error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Spark generation failed'
    });
  }
});

// ============================================================================
// POST /api/ai-analysis/reference-image
// Generates a DALL-E reference image showing what a shape should look like
// ============================================================================
router.post('/reference-image', aiLimiter, async (req: Request, res: Response) => {
  try {
    const { shapeType, shapeName, description } = req.body;
    if (!shapeType) {
      return res.status(400).json({ error: 'shapeType is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.json({
        status: 'needs_api_key',
        message: 'Add OPENAI_API_KEY to generate reference images',
        shapeType
      });
    }

    const openai = getOpenAI();

    // Build a focused prompt for this archetypal shape
    const prompt = `A mathematically precise, educational illustration of "${shapeName || shapeType}". ${description || ''}
Rendered as a clean 3D visualization on a dark background with subtle lighting. Museum-quality, accurate, iconic representation. No text or labels. High detail, dramatic lighting.`;

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'url'
    });

    const imageUrl = response.data[0]?.url;
    if (!imageUrl) {
      return res.status(500).json({ error: 'No image URL returned from DALL-E' });
    }

    res.json({
      status: 'success',
      imageUrl,
      shapeType,
      prompt
    });

  } catch (error: any) {
    console.error('Reference image generation error:', error);
    res.status(500).json({
      status: 'error',
      error: error?.message || 'Reference image generation failed'
    });
  }
});

// ============================================================================
// POST /api/ai-analysis/fix-shape
// Uses Claude to rewrite a broken shape's parametric equation
// ============================================================================
router.post('/fix-shape', aiLimiter, async (req: Request, res: Response) => {
  try {
    const { shapeType, shapeName, currentIssue } = req.body;
    if (!shapeType) return res.status(400).json({ error: 'shapeType is required' });

    if (!process.env.RUFLO_SECRET_KEY) {
      return res.json({ status: 'needs_api_key', message: 'Add RUFLO_SECRET_KEY to fix shapes with AI' });
    }

    const claude = getClaude();
    const message = await claude.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1200,
      messages: [{
        role: 'user',
        content: `You are a mathematical visualization expert. The shape "${shapeName || shapeType}" is not rendering correctly.

Issue: ${currentIssue || 'The parametric equation produces an unrecognizable shape'}

Provide:
1. A brief explanation of what this shape should look like (2-3 sentences)
2. What geometric properties define it
3. A recommended parametric equation approach as a JavaScript snippet (u, v in [0,1])
4. 3 specific parameter values (a, b, c) that would produce the most recognizable version

Format your response as JSON:
{
  "whatItShouldLookLike": "...",
  "geometricProperties": "...",
  "equationApproach": "...",
  "recommendedParams": { "a": number, "b": number, "c": number },
  "visualTip": "..."
}`
      }]
    });

    let result: any = {};
    const text = message.content[0]?.type === 'text' ? message.content[0].text : '';
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) result = JSON.parse(jsonMatch[0]);
    } catch {
      result = { whatItShouldLookLike: text };
    }

    res.json({ status: 'success', shapeType, ...result });
  } catch (error: any) {
    console.error('Fix shape error:', error);
    res.status(500).json({ status: 'error', error: error?.message || 'Shape fix failed' });
  }
});

// ============================================================================
// GET /api/ai-analysis/health
// ============================================================================
router.get('/health', (_req: Request, res: Response) => {
  const keyConfigured = !!process.env.RUFLO_SECRET_KEY;
  res.json({
    status: keyConfigured ? 'operational' : 'needs_api_key',
    model: 'claude-opus-4-5',
    keyConfigured,
    endpoints: [
      { path: '/audit', method: 'POST', description: 'Full app audit — security, performance, AI, code quality' },
      { path: '/shape-summary', method: 'POST', description: 'Educational summary for any shape' },
      { path: '/generate-equation', method: 'POST', description: 'Generate parametric equation for placeholder shapes' },
      { path: '/fix-suggestion', method: 'POST', description: 'Claude-powered fix suggestions for any issue' },
      { path: '/discover', method: 'POST', description: 'Map any interest to captivating mathematical shapes' },
      { path: '/journey', method: 'POST', description: 'Generate a narrative discovery path through shapes' },
      { path: '/connect', method: 'POST', description: 'Find the mathematical bridge between any two things' },
      { path: '/spark', method: 'GET', description: 'Daily discovery — one shape that will change how you see the world' }
    ],
    rateLimit: '15 requests per minute'
  });
});

export default router;

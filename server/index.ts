import nftMintingRoutes from './routes/nft-minting';
import changelogRoutes from './routes/changelog';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import trackingRoutes from './routes/tracking';
import { dirname } from 'path';
import session from 'express-session';
import passport from './auth/githubStrategy';
import crypto from 'crypto';
import pg from 'pg';
import connectPgSimple from 'connect-pg-simple';
import { neon } from '@neondatabase/serverless';

// ── REQUIRED ENV VAR GUARD ──────────────────────────────────────────────────
const REQUIRED_ENV: string[] = ['DATABASE_URL'];
const missingEnv = REQUIRED_ENV.filter(k => !process.env[k]);
if (missingEnv.length > 0) {
  console.error(
    `\n❌ Missing required environment variable(s): ${missingEnv.join(', ')}\n` +
    '   Set these in Railway → Project → Variables before deploying.\n'
  );
  process.exit(1);
}
// ────────────────────────────────────────────────────────────────────────────

const sql = neon(process.env.DATABASE_URL!);

const PgSession = connectPgSimple(session);
const sessionPool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);
const isProduction = process.env.NODE_ENV === 'production';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ── STATIC HTML RESOLVER ─────────────────────────────────────────────────────
function resolveStaticHtml(filename: string): string {
  const prodPath = path.join(__dirname, 'public', filename);
  const devPath = path.join(__dirname, '../client/public', filename);
  return fs.existsSync(prodPath) ? prodPath : devPath;
}
// ────────────────────────────────────────────────────────────────────────────

app.set('trust proxy', 1);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'blob:'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
      connectSrc: ["'self'", 'https:', 'wss:'],
      workerSrc: ["'self'", 'blob:'],
      mediaSrc: ["'self'", 'blob:'],
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false
}));

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'https://dmension-mathematical-universe.replit.dev',
  'https://uuon.world',
  'https://www.uuon.world',
  'https://dmension.app',
  'https://www.dmension.app',
  'https://uuon.uuorld',
  ...(process.env.REPLIT_DEV_DOMAIN ? [`https://${process.env.REPLIT_DEV_DOMAIN}`] : []),
  ...(process.env.REPLIT_DOMAINS ? process.env.REPLIT_DOMAINS.split(',').map(d => `https://${d.trim()}`) : [])
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(o => origin === o)) return callback(null, true);
    if (origin.endsWith('.replit.dev') || origin.endsWith('.replit.app')) return callback(null, true);
    return callback(null, false);
  },
  credentials: true
}));

const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please slow down.' }
});
app.use('/api/', globalLimiter);

const strictLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts, please try again later.' }
});
app.use('/api/auth/', strictLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const SESSION_SECRET = process.env.SESSION_SECRET || (() => {
  console.warn('⚠️  SESSION_SECRET is not set. A random secret is being used — sessions will be invalidated on every restart.');
  return crypto.randomBytes(32).toString('hex');
})();

app.use(session({
  store: new PgSession({
    pool: sessionPool,
    createTableIfMissing: true,
    tableName: 'session',
    pruneSessionInterval: 60 * 60,
  }),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  proxy: isProduction,
  cookie: {
    secure: isProduction,
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: isProduction ? 'none' : 'lax'
  }
}));

app.use(passport.initialize());
app.use(passport.session());

const isApiOnly = !!(process.env.API_ONLY);

const publicPath = isProduction
  ? path.join(__dirname, 'public')
  : path.join(__dirname, '../client/public');

const indexPath = isProduction
  ? path.join(__dirname, 'public/index.html')
  : path.join(__dirname, '../dist/public/index.html');

if (!isApiOnly) {
  app.use('/assets', express.static(publicPath));
  app.use('/exports', express.static(path.join(__dirname, '../exports')));
  app.use('/uploads', express.static('uploads'));
}

// ── HEALTH ENDPOINTS ────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'dmension-api', timestamp: new Date().toISOString() });
});

app.get('/health', async (_req, res) => {
  let dbStatus = false;
  let dbLatencyMs: number | null = null;
  try {
    const t0 = Date.now();
    await sql`SELECT 1`;
    dbLatencyMs = Date.now() - t0;
    dbStatus = true;
  } catch (e) {
    console.error('Health check DB error:', e);
    dbStatus = false;
  }
  res.json({
    status: 'ok',
    db: dbStatus,
    db_latency_ms: dbLatencyMs,
    uptime: Math.floor(process.uptime()),
    genesis: 'cf114022b5e4e1d6fdeb36890f35f605857cf2de93b53ebcb9c8e5652413ca04',
    merkle_root: '54fff9e19a729a3bfffbf9926d1e09d5134cb6e12a0723211ea04904d68530af',
    build_marker: process.env.RAILWAY_GIT_COMMIT_SHA || 'unknown',
    timestamp: new Date().toISOString()
  });
});
// ────────────────────────────────────────────────────────────────────────────

app.get(/^\/sitemap.*\.xml$/, (req, res) => {
  const sitemapFile = req.path;
  const searchPaths = isProduction
    ? [path.join(__dirname, 'public', sitemapFile)]
    : [path.join(__dirname, '../client/public', sitemapFile), path.join('client/public', sitemapFile)];
  const filePath = searchPaths.find(p => fs.existsSync(p));
  if (!filePath) return res.status(404).type('xml').send('<?xml version="1.0"?><error>Sitemap not found</error>');
  try {
    const actualHost = req.hostname && req.hostname !== 'localhost'
      ? req.hostname
      : (process.env.REPLIT_DOMAINS ? process.env.REPLIT_DOMAINS.split(',')[0].trim() : null);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const fixed = actualHost
      ? raw.replace(/https?:\/\/(www\.)?uuon-foundation\.com/g, `https://${actualHost}`)
      : raw;
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.send(fixed);
  } catch (e) {
    res.status(500).type('xml').send('<?xml version="1.0"?><error>Error serving sitemap</error>');
  }
});

if (isProduction && !isApiOnly) {
  app.use(express.static(path.join(__dirname, 'public'), { index: false }));
}

if (isApiOnly) {
  app.get('/', (_req, res) => {
    res.json({
      name: 'Δmension Mathematical Universe API',
      description: '2,856 parametric 3D shapes · Merkle-anchored equation DNA · Real-time geometry computation',
      version: '1.0.0',
      genesis: 'cf114022b5e4e1d6fdeb36890f35f605857cf2de93b53ebcb9c8e5652413ca04',
      merkle_root: '54fff9e19a729a3bfffbf9926d1e09d5134cb6e12a0723211ea04904d68530af',
      endpoints: {
        health: '/health',
        shapes: '/api/shapes/categories',
        compute: 'POST /api/shapes/compute',
        quantum: '/api/quantum/status',
        engines: '/api/engines',
        status: '/api/status'
      }
    });
  });
}

// ── STATIC PORTAL LANDING PAGE (uuon.world root) ────────────────────────────
if (!isApiOnly) {
  app.get('/', (_req, res) => {
    res.sendFile(resolveStaticHtml('uuonworld.html'));
  });

  app.get('/apps', (_req, res) => {
    res.sendFile(resolveStaticHtml('apps.html'));
  });
}
// ────────────────────────────────────────────────────────────────────────────

let routesReady = false;
const deferredApiRouter = express.Router();
app.use('/', deferredApiRouter);

app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    if (!routesReady) {
      return res.status(503).json({
        error: 'API loading, retry shortly',
        hint: 'The server is still registering routes. Please wait a few seconds and try again.',
      });
    }
    return res.status(404).json({
      error: `API endpoint not found: ${req.method} ${req.path}`,
      hint: 'Check /api/status for available endpoints.',
    });
  }
  next();
});

if (!isApiOnly) {
  app.get('*', (req, res) => {
    res.sendFile(indexPath);
  });
} else {
  app.get('*', (_req, res) => {
    res.status(404).json({ error: 'Not found', hint: 'This is an API-only endpoint. See / for available routes.' });
  });
}

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    endpoint: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
🚀 Δmension Mathematical Universe Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Server running on http://0.0.0.0:${PORT}
🔧 Environment: ${process.env.NODE_ENV || 'development'}
🌐 Public API Access: ENABLED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

  setImmediate(() => {
    loadDeferredRoutes().catch(err => {
      console.error('❌ Failed to load deferred API routes:', err);
    });
  });
});

async function autoSeedDatabase() {
  try {
    const { seeder } = await import('./database-seeder');
    await seeder.seedAll();
  } catch (err) {
    console.error('⚠️ Auto-seed failed (non-fatal):', err instanceof Error ? err.message : err);
  }
}

async function loadDeferredRoutes() {
  console.log('⏳ Loading API route modules in background…');


  const [
    { default: authRoutes },
    { unifiedSDK },
    { default: agentCoordinationRoutes },
    { shapeRoutes },
    { healthRouter },
    { default: quantumRoutes },
    { systemPerformanceRouter },
  ] = await Promise.all([
    import('./routes/auth'),
    import('./unified-sdk-implementation'),
    import('./routes/agent-coordination'),
    import('./shape-routes'),
    import('./routes/health'),
    import('./routes/quantum'),
    import('./routes/system-performance'),
  ]);

  deferredApiRouter.use('/api/auth', authRoutes);
  deferredApiRouter.use('/api/sdk', unifiedSDK.getRouter());
  deferredApiRouter.get('/api/sdk-info', (_req, res) => {
    res.json({
      name: 'Δmension Unified SDK',
      version: '1.0.0',
      description: 'Unified API gateway consolidating all mathematical, quantum, and biological services',
      endpoints: {
        unified: '/api/sdk/unified/:module/:operation',
        health: '/api/sdk/health',
        discover: '/api/sdk/discover'
      },
      modules: {
        shapes: 'Parametric surface computation and management',
        quantum: 'Quantum computing algorithms and circuits',
        physics: 'Physics simulations and field calculations',
        biology: 'Biological system modeling and analysis',
        mathematics: 'Mathematical proof verification and solving',
        export: 'Multi-format export and token generation',
        aiml: 'AI/ML recognition and optimization'
      }
    });
  });
  deferredApiRouter.use('/api/agents', requireAdmin, agentCoordinationRoutes);
  deferredApiRouter.use('/api/shapes', shapeRoutes);
  deferredApiRouter.use('/api/health', healthRouter);
  deferredApiRouter.use('/api/quantum', quantumRoutes);
  deferredApiRouter.use('/api/system-performance', systemPerformanceRouter);

  console.log('✅ Core API routes registered.');

  const [
    { sitemapRoutes },
    { standardizedSitemapRoutes },
    { sitemapFrameworkRoutes },
    { sitemapHierarchyRouter },
    { default: aboutSitemapRouter },
    { deploymentOptimizationRoutes },
    { deploymentStatusRoutes },
    { showcaseRoutes },
    { default: uuonCloudBridgeRoutes },
    { default: d13mon4Routes },
    { comprehensiveDatabaseTrackerRoutes },
    { sdkInfoRoutes },
    { apiStatusRoutes },
    { default: githubRoutes },
    { default: aiAnalysisRoutes },
    { default: shadersMaterialsApi },
    { default: engineApiRouter },
    { pageRoutes },
    { tokenEcosystemRoutes },
    { default: lexiconRoutes },
    { default: tokenLedgerRoutes },
    { default: aiRoutes },
    { default: seoShapesRoutes },
    { default: seoGlossaryRoutes },
    { default: seoApiDocsRoutes },
  ] = await Promise.all([
    import('./routes/sitemap-generator'),
    import('./routes/standardized-sitemaps'),
    import('./routes/sitemap-framework'),
    import('./routes/sitemap-hierarchy'),
    import('./routes/about-sitemap'),
    import('./routes/deployment-optimization'),
    import('./routes/deployment-status'),
    import('./showcase-routes'),
    import('./routes/uuon-cloud-bridge'),
    import('./routes/d13mon4'),
    import('./routes/comprehensive-database-tracker'),
    import('./routes/sdk-info'),
    import('./routes/api-status'),
    import('./routes/github'),
    import('./routes/ai-analysis'),
    import('./routes/shaders-materials-api'),
    import('./routes/engine-api'),
    import('./routes/page-routes'),
    import('./routes/token-ecosystem'),
    import('./routes/lexicon'),
    import('./routes/token-ledger'),
    import('./ai-routes'),
    import('./routes/seo-shapes'),
    import('./routes/seo-glossary'),
    import('./routes/seo-apidocs'),
  ]);

  deferredApiRouter.use('/api/sitemap', sitemapRoutes);
  deferredApiRouter.use('/api/sitemap-standard', standardizedSitemapRoutes);
  deferredApiRouter.use('/api/sitemap-framework', sitemapFrameworkRoutes);
  deferredApiRouter.use('/api/sitemap-hierarchy', sitemapHierarchyRouter);
  deferredApiRouter.use('/api/about', aboutSitemapRouter);

  deferredApiRouter.get('/sitemap*.xml', (req, res) => {
    const sitemapFile = req.path;
    try {
      const filePath = path.join('client/public', sitemapFile);
      if (fs.existsSync(filePath)) {
        const actualHost = req.hostname || (process.env.REPLIT_DOMAINS ? process.env.REPLIT_DOMAINS.split(',')[0].trim() : null);
        const raw = fs.readFileSync(path.resolve(filePath), 'utf-8');
        const fixed = actualHost
          ? raw.replace(/https?:\/\/uuon-foundation\.com/g, `https://${actualHost}`)
              .replace(/https?:\/\/www\.uuon-foundation\.com/g, `https://${actualHost}`)
          : raw;
        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
        res.send(fixed);
      } else {
        res.status(404).send('Sitemap not found');
      }
    } catch (error) {
      res.status(500).send('Error serving sitemap');
    }
  });

  // ── Admin-only gate for internal/ops routes ────────────────────────────────
  function requireAdmin(req: any, res: any, next: any) {
    const isAuthed = req.isAuthenticated && req.isAuthenticated();
    const role = req.user?.role;
    const isFounder = req.user?.github_username === 'uuonnouu';
    if (!isAuthed || !req.user || (!isFounder && !['admin', 'founder', 'owner'].includes(role))) {
      return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Admin access required.' });
    }
    next();
  }

  deferredApiRouter.use('/api/deployment', requireAdmin, deploymentOptimizationRoutes);
  deferredApiRouter.use('/api/deployment-status', requireAdmin, deploymentStatusRoutes);
  deferredApiRouter.use('/api/showcase', showcaseRoutes);
  deferredApiRouter.use('/api/bridge', uuonCloudBridgeRoutes);
  deferredApiRouter.use('/api/d13mon4', d13mon4Routes);
  deferredApiRouter.use('/api/database-tracker', requireAdmin, comprehensiveDatabaseTrackerRoutes);

  deferredApiRouter.get('/api/migration-status', (_req, res) => {
    res.json({
      status: 'SDK_TRANSITION_ACTIVE',
      unifiedSDK: { status: 'operational' },
      legacyAPIs: { status: 'deprecated_but_functional', sunsetDate: '2027-01-01' }
    });
  });

  deferredApiRouter.use('/api/sdk-info', sdkInfoRoutes);
  deferredApiRouter.use('/api/status', apiStatusRoutes);
  deferredApiRouter.use('/api/github', requireAdmin, githubRoutes);
  deferredApiRouter.use('/api/ai-analysis', aiAnalysisRoutes);

  deferredApiRouter.get('/api', (_req, res) => {
    res.json({
      name: 'Δmension Mathematical Universe API',
      version: '1.0.0',
      genesis: 'cf114022b5e4e1d6fdeb36890f35f605857cf2de93b53ebcb9c8e5652413ca04',
      docs: '/api/sdk-info'
    });
  });

  deferredApiRouter.use('/api', shadersMaterialsApi);
  deferredApiRouter.use('/api/engines', engineApiRouter);
  deferredApiRouter.use('/api/ipfs', nftMintingRoutes);
  deferredApiRouter.use('/api/nft-minting', nftMintingRoutes);
  deferredApiRouter.use('/api/nft', nftMintingRoutes);
  deferredApiRouter.use('/api/token-ecosystem', tokenEcosystemRoutes);
  deferredApiRouter.use('/api/tracking', trackingRoutes);
  deferredApiRouter.use('/api/token-ledger', tokenEcosystemRoutes);
  deferredApiRouter.use(pageRoutes);
  deferredApiRouter.use('/api/lexicon', lexiconRoutes);
  deferredApiRouter.use('/api/changelog', changelogRoutes);
  deferredApiRouter.use('/api/tokens', tokenLedgerRoutes);
  deferredApiRouter.use('/api/token-ledger', tokenLedgerRoutes);
  deferredApiRouter.use('/api', aiRoutes);
  deferredApiRouter.use('/shapes', seoShapesRoutes);
  deferredApiRouter.use('/glossary', seoGlossaryRoutes);
  deferredApiRouter.use('/api/docs', seoApiDocsRoutes);

  deferredApiRouter.get('/apis', (_req, res) => {
    res.sendFile(resolveStaticHtml('developer.html'));
  });

  // ── GitHub OAuth ──────────────────────────────────────────────────────────
  deferredApiRouter.get('/auth/github/login', passport.authenticate('github'));

  deferredApiRouter.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/?auth=failed' }),
    (req, res) => {
      res.redirect('/dashboard');
    }
  );

  deferredApiRouter.get('/auth/github/status', (req: any, res) => {
    res.json({
      authenticated: req.isAuthenticated ? req.isAuthenticated() : false,
      user: req.user ? {
        id: req.user.id,
        username: req.user.username,
        github_username: req.user.github_username,
        role: req.user.role,
      } : null,
    });
  });
  // ──────────────────────────────────────────────────────────────────────────

  deferredApiRouter.get('/rapidapi', (_req, res) => {
    res.sendFile(resolveStaticHtml('rapidapi.html'));
  });

  deferredApiRouter.get('/science', (_req, res) => {
    res.sendFile(resolveStaticHtml('science.html'));
  });

  deferredApiRouter.get('/ai', (_req, res) => {
    res.sendFile(resolveStaticHtml('ai.html'));
  });

  deferredApiRouter.get('/token', (_req, res) => {
    res.sendFile(resolveStaticHtml('token.html'));
  });

  deferredApiRouter.get('/dashboard', (_req, res) => {
    res.sendFile(resolveStaticHtml('dashboard.html'));
  });

  deferredApiRouter.get('/developer', (_req, res) => {
    res.redirect(301, '/apis');
  });

  routesReady = true;
  console.log('✅ All API route modules loaded and registered.');
}

export default app;

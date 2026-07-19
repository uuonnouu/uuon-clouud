import helmet from 'helmet';
import type { Express } from 'express';

/**
 * Configure security headers using Helmet
 * Protects against common web vulnerabilities
 */
export function configureSecurityHeaders(app: Express): void {
  // Helmet middleware with custom CSP and HSTS configuration
  app.use(
    helmet({
      // Content Security Policy
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"], // TODO: Remove unsafe-inline for production
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
          fontSrc: ["'self'", 'data:'],
          connectSrc: ["'self'", 'https://openrouter.ai', 'https://uuon-foundation.com'],
          mediaSrc: ["'self'"],
          objectSrc: ["'none'"],
          frameSrc: ["'self'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          frameAncestors: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      // HTTP Strict Transport Security
      // Max age 1 year, include subdomains, preload list
      hsts: {
        maxAge: 31536000, // 1 year in seconds
        includeSubDomains: true,
        preload: true,
      },
      // Prevent clickjacking attacks
      frameguard: {
        action: 'deny',
      },
      // Remove X-Powered-By header
      hidePoweredBy: true,
      // Prevent MIME type sniffing
      noSniff: true,
      // Enable XSS filter in older browsers
      xssFilter: true,
      // Referrer Policy
      referrerPolicy: {
        policy: 'strict-origin-when-cross-origin',
      },
      // Remove the Server header
      removeHeader: true,
      // Expect-CT header (Certificate Transparency)
      expectCt: {
        maxAge: 86400, // 24 hours
        enforce: false,
      },
      // Permissions Policy (formerly Feature Policy)
      permittedCrossDomainPolicies: false,
    })
  );

  // Additional security middleware: disable caching for sensitive endpoints
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/auth/') || req.path.startsWith('/api/private/')) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
    next();
  });
}

/**
 * Configure CORS policy
 * Restrict cross-origin requests to trusted domains
 */
export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'https://uuon-foundation.com',
      'https://uuon.world',
      'https://uuon-clouud-production.up.railway.app',
      'https://distinguished-rebirth-production.up.railway.app',
      ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
      ...(process.env.CORS_EXTRA_ORIGINS ? process.env.CORS_EXTRA_ORIGINS.split(',').map(o => o.trim()) : []),
    ];

    if (!origin) {
      // Allow requests with no origin (mobile apps, Postman, curl requests)
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS policy'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'X-Request-ID'],
  exposedHeaders: ['X-Request-ID', 'X-Response-Time'],
  maxAge: 86400, // 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 200,
};

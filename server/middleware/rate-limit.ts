import rateLimit from 'express-rate-limit';

// Global rate limiter: 100 requests per 15 minutes per IP
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || 'unknown',
});

// API rate limiter: 30 requests per minute per IP
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: { error: 'Too many API requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || 'unknown',
});

// Auth rate limiter: 5 attempts per 15 minutes per IP
// Strict: only counts failed attempts
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many authentication attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || 'unknown',
  skip: (req) => {
    // Skip rate limit on successful auth (marked in response)
    return req.res?.locals?.authSuccess === true;
  },
});

// Chat rate limiter: 15 messages per minute per IP
export const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  message: { error: 'Rate limit exceeded. Maximum 15 messages per minute.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || 'unknown',
});

// Upload rate limiter: 10 uploads per minute per IP
export const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Rate limit exceeded. Maximum 10 uploads per minute.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || 'unknown',
});

// Scrape rate limiter: 5 scrapes per minute per IP
export const scrapeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'Rate limit exceeded. Maximum 5 scrape requests per minute.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || 'unknown',
});

// Ingest rate limiter: 3 ingests per minute per IP
export const ingestLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  message: { error: 'Rate limit exceeded. Maximum 3 ingests per minute.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || 'unknown',
});

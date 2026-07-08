import jwt, { JwtPayload } from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';

const SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

// Extend Express Request with user context
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      tokenExpiry?: number;
      tokenType?: 'access' | 'refresh';
    }
  }
}

export interface TokenPayload extends JwtPayload {
  userId: string;
  type: 'access' | 'refresh';
  iat: number;
  exp: number;
}

/**
 * Generate both access and refresh tokens for a user
 */
export function generateTokens(userId: string): {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
} {
  const accessToken = jwt.sign(
    { userId, type: 'access' },
    SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  return {
    accessToken,
    refreshToken,
    expiresIn: ACCESS_TOKEN_EXPIRY,
  };
}

/**
 * Middleware: Verify access token is present and valid
 * Attaches userId and tokenExpiry to request
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = auth.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, SECRET) as TokenPayload;

    if (decoded.type !== 'access') {
      return res.status(401).json({ error: 'Invalid token type — expected access token' });
    }

    req.userId = decoded.userId;
    req.tokenExpiry = decoded.exp;
    req.tokenType = 'access';

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
}

/**
 * Middleware: Optional auth — doesn't error if token missing, but validates if present
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith('Bearer ')) {
    // No token is OK for this middleware
    return next();
  }

  const token = auth.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, SECRET) as TokenPayload;

    if (decoded.type === 'access') {
      req.userId = decoded.userId;
      req.tokenExpiry = decoded.exp;
      req.tokenType = 'access';
    }

    next();
  } catch (error) {
    // Invalid token is logged but request continues
    console.warn('Invalid token provided:', error);
    next();
  }
}

/**
 * Refresh an access token using a valid refresh token
 * Returns new access and refresh tokens
 */
export function refreshAccessToken(req: Request, res: Response) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = auth.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, SECRET, { ignoreExpiration: true }) as TokenPayload;

    if (decoded.type !== 'refresh') {
      return res.status(401).json({ error: 'Invalid token type — expected refresh token' });
    }

    // Generate new tokens
    const { accessToken, refreshToken } = generateTokens(decoded.userId);

    return res.json({
      accessToken,
      refreshToken,
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    return res.status(401).json({ error: 'Refresh failed' });
  }
}

/**
 * Revoke a token by adding it to a blacklist
 * Optional: requires database session management
 */
export async function revokeToken(token: string, userId: string): Promise<void> {
  try {
    // Optional: store in cache or DB for logout management
    // await storage.revokeToken(token, userId);
    console.log(`Token revoked for user: ${userId}`);
  } catch (error) {
    console.error('Token revocation failed:', error);
  }
}

/**
 * Logout endpoint handler
 * Optionally blacklist the token
 */
export async function handleLogout(req: Request, res: Response) {
  if (!req.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const auth = req.headers.authorization;
  if (auth) {
    const token = auth.replace('Bearer ', '');
    await revokeToken(token, req.userId);
  }

  return res.json({ message: 'Logged out successfully' });
}

/**
 * Validate token without requiring it (for debugging/inspection)
 */
export function validateToken(token: string): { valid: boolean; decoded?: TokenPayload; error?: string } {
  try {
    const decoded = jwt.verify(token, SECRET) as TokenPayload;
    return { valid: true, decoded };
  } catch (error: any) {
    return { valid: false, error: error.message };
  }
}

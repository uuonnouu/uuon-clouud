import type { Request, Response, NextFunction } from 'express';

const API_KEY = process.env.BRAIN_API_KEY || '';

export function requireApiKey(req: Request, res: Response, next: NextFunction) {
  const key = req.headers['x-api-key'] as string;

  if (!key) {
    return res.status(401).json({ error: 'Missing x-api-key header' });
  }

  if (key !== API_KEY) {
    return res.status(403).json({ error: 'Invalid API key' });
  }

  next();
}

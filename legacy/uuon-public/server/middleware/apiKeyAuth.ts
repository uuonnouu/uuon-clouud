import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import pg from 'pg';

let pool: pg.Pool | null = null;
function getPool(): pg.Pool {
  if (!pool) {
    pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  }
  return pool;
}

export async function apiKeyAuth(req: Request, res: Response, next: NextFunction) {
  if ((req.session as any)?.user) return next();

  const rawKey = req.headers['x-api-key'] as string | undefined;

  if (!rawKey) {
    return res.status(401).json({
      error: 'API key required',
      hint: 'Pass your key in the X-API-Key request header.',
    });
  }

  try {
    const client = getPool();
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

    // Check new hashed api_keys table first
    const { rows: newRows } = await client.query(
      'SELECT id FROM api_keys WHERE key_hash = $1 LIMIT 1',
      [keyHash]
    );
    if (newRows.length > 0) {
      client.query('UPDATE api_keys SET last_used = NOW() WHERE id = $1', [newRows[0].id]).catch(() => {});
      return next();
    }

    // Legacy: check api_customers plain-text key
    const { rows: legacyRows } = await client.query(
      'SELECT id FROM api_customers WHERE api_key = $1 LIMIT 1',
      [rawKey]
    );
    if (legacyRows.length > 0) return next();

    return res.status(401).json({
      error: 'Invalid API key',
    });
  } catch (err) {
    console.error('[apiKeyAuth] DB error:', err instanceof Error ? err.message : err);
    return res.status(503).json({ error: 'Auth service unavailable, retry shortly' });
  }
}

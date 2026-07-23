import type { Request, Response } from 'express';

const MINT_ACCESS_SECRET = process.env.UUON_TOKEN_SECRET;

export function requireMintAuth(req: Request, res: Response): boolean {
  if (!MINT_ACCESS_SECRET) {
    res.status(503).json({ success: false, error: 'Minting disabled: UUON_TOKEN_SECRET not configured' });
    return false;
  }
  if (req.headers['x-uuon-token-secret'] !== MINT_ACCESS_SECRET) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return false;
  }
  return true;
}

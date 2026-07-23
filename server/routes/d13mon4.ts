/**
 * D13MON4 ROUTES — server-side only access to the trade-secret hash engine.
 * Clients receive computed results only — never the algorithm.
 */
import { Router, Request, Response } from 'express';
import d13mon4HashEngine from '../services/d13mon4HashEngine';

const router = Router();

function requireSession(req: any, res: Response): boolean {
  if (!req.session || !req.session.user) {
    res.status(401).json({ error: 'Sign-in required to use this feature.' });
    return false;
  }
  return true;
}

router.post('/hash', (req: Request, res: Response) => {
  if (!requireSession(req, res)) return;
  const { inputText } = req.body;
  if (typeof inputText !== 'string' || !inputText) {
    return res.status(400).json({ error: 'inputText (string) is required' });
  }
  res.json(d13mon4HashEngine.generateHash(inputText));
});

router.post('/lattice-tokens', (req: Request, res: Response) => {
  if (!requireSession(req, res)) return;
  const { latitude, longitude, dimensionalOffset } = req.body;
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return res.status(400).json({ error: 'latitude and longitude (numbers) are required' });
  }
  res.json(d13mon4HashEngine.generateLatticeTokens(latitude, longitude, dimensionalOffset ?? 0));
});

router.post('/harmonic-resonance', (req: Request, res: Response) => {
  if (!requireSession(req, res)) return;
  const { hash } = req.body;
  if (typeof hash !== 'string' || !hash) {
    return res.status(400).json({ error: 'hash (string) is required' });
  }
  res.json({ resonance: d13mon4HashEngine.calculateHarmonicResonance(hash) });
});

export default router;
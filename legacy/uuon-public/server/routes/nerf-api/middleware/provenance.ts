import { Request, Response, NextFunction } from 'express';

export function provenanceHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader('X-UUON-Author',    'UUON Foundation Inc.');
  res.setHeader('X-UUON-License',   'CC BY-NC 4.0');
  res.setHeader('X-UUON-Copyright', '© 2025 UUON Foundation Inc. All Rights Reserved.');
  res.setHeader('X-UUON-Org',       'Δmension Mathematical Universe');
  next();
}

import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import type { ShapeMetadataResponse } from '../types/asset';

const ASSETS_DIR = path.resolve(process.cwd(), 'assets/nerf');

function ensureDir(): void {
  if (!fs.existsSync(ASSETS_DIR)) fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

function loadAsset(shapeId: string, suffix: string): unknown | null {
  ensureDir();
  let candidates: string[];
  try {
    candidates = fs.readdirSync(ASSETS_DIR).filter(
      f => f.startsWith(shapeId) && f.endsWith(`${suffix}.json`)
    );
  } catch {
    return null;
  }
  if (!candidates.length) return null;
  try {
    return JSON.parse(fs.readFileSync(path.join(ASSETS_DIR, candidates[0]), 'utf-8'));
  } catch {
    return null;
  }
}

export function listShapes(_req: Request, res: Response): void {
  ensureDir();
  let files: string[] = [];
  try { files = fs.readdirSync(ASSETS_DIR); } catch { /* empty dir is fine */ }

  const ids = [...new Set(
    files
      .map(f => f
        .replace(/_neural_\d+.*/, '')
        .replace(/_metadata.*/, '')
        .replace(/_formulas.*/, '')
        .replace(/_transforms.*/, '')
        .replace(/\.json$/, '')
      )
      .filter(Boolean)
  )];

  res.json({ shapes: ids, count: ids.length });
}

export function getShapeMetadata(req: Request, res: Response): void {
  const { shapeId } = req.params;

  // Try v2 decomposed metadata first
  let meta = loadAsset(shapeId, '_metadata') as any;

  // Fall back to v1 monolithic nerf.json
  if (!meta) {
    const nerf = (loadAsset(shapeId, '_nerf') ?? loadAsset(shapeId, '.nerf')) as any;
    if (!nerf) {
      res.status(404).json({ error: 'Shape not found', shapeId });
      return;
    }
    meta = { ...nerf.metadata, security: nerf.security, bounds: nerf.bounds };
  }

  // Strip raw hash internals — never expose cryptographic internals
  const security = meta.security || {};
  const response: ShapeMetadataResponse = {
    shapeId:          meta.shapeId          || shapeId,
    shapeName:        meta.shapeName        || meta.metadata?.shapeName || shapeId,
    dmension_version: meta.dmension_version || '1.0',
    integrityVersion: security.integrityVersion || '1.0.0',
    exportDate:       meta.exportDate       || security.timestamp || new Date().toISOString(),
    parameters:       meta.parameters       || {},
    scene_bounds:     meta.scene_bounds     || meta.bounds || null,
    license:          security.license      || 'CC BY-NC 4.0',
    author:           security.author       || 'UUON Foundation Inc.',
  };

  res.json(response);
}

export function getShapeFormulas(req: Request, res: Response): void {
  const { shapeId } = req.params;
  const formulas = loadAsset(shapeId, '_formulas');
  if (!formulas) {
    res.status(404).json({ error: 'Formulas not available for this shape', shapeId });
    return;
  }
  res.json(formulas);
}

export function getShapeTransforms(req: Request, res: Response): void {
  const { shapeId } = req.params;
  const transforms = loadAsset(shapeId, '_transforms');
  if (!transforms) {
    res.status(404).json({ error: 'Transforms not available for this shape', shapeId });
    return;
  }

  // Sanitize: strip internal file_path references from frame data
  const t = transforms as any;
  const sanitized = {
    camera_model: t.camera_model,
    fl_x:         t.fl_x,
    fl_y:         t.fl_y,
    cx:           t.cx,
    cy:           t.cy,
    w:            t.w,
    h:            t.h,
    aabb_scale:   t.aabb_scale,
    frame_count:  t.frames?.length ?? 0,
    time_range:   t.frames?.length
      ? [t.frames[0].time, t.frames[t.frames.length - 1].time]
      : null,
    transforms: (t.frames ?? []).map((f: any) => ({
      transform_matrix: f.transform_matrix,
      sharpness:        f.sharpness,
      time:             f.time,
      // file_path intentionally omitted — do not expose internal paths
    })),
  };

  res.json(sanitized);
}

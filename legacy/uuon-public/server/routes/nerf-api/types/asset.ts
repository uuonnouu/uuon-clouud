export type AssetTier = 'metadata' | 'formulas' | 'transforms' | 'ngp_config' | 'weights';

export const ASSET_ACCESS: Record<AssetTier, 'public_auth' | 'protected' | 'internal'> = {
  metadata:   'public_auth',
  formulas:   'public_auth',
  transforms: 'protected',
  ngp_config: 'internal',
  weights:    'internal',
};

export interface ShapeMetadataResponse {
  shapeId:          string;
  shapeName:        string;
  dmension_version: string;
  integrityVersion: string;
  exportDate:       string;
  parameters:       Record<string, unknown>;
  scene_bounds?:    Record<string, unknown> | null;
  license:          string;
  author:           string;
}

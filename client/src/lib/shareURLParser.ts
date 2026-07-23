import { SurfaceParameters, SurfaceType } from '../types/math';

export interface ParsedShareParams {
  type: string;
  parameters: Partial<SurfaceParameters>;
  isSharedLink: boolean;
  isLockedPreview: boolean;
  previewName?: string;
  previewExpiry?: number;
}

export function parseShareURL(): ParsedShareParams {
  const urlParams = new URLSearchParams(window.location.search);
  
  const shape = urlParams.get('shape');
  const locked = urlParams.get('locked') === '1' || urlParams.get('preview') === '1';
  const previewName = urlParams.get('name') || undefined;
  const expiry = urlParams.get('exp') ? parseInt(urlParams.get('exp')!) : undefined;
  
  if (!shape) {
    return {
      type: 'cube',
      parameters: {},
      isSharedLink: false,
      isLockedPreview: false
    };
  }

  const parameters: Partial<SurfaceParameters> = {
    type: shape as SurfaceType,
    a: parseFloat(urlParams.get('a') || '2'),
    b: parseFloat(urlParams.get('b') || '2'),
    c: parseFloat(urlParams.get('c') || '2'),
  };

  if (urlParams.has('d')) parameters.d = parseFloat(urlParams.get('d')!);
  if (urlParams.has('e')) parameters.e = parseFloat(urlParams.get('e')!);
  if (urlParams.has('f')) parameters.f = parseFloat(urlParams.get('f')!);
  if (urlParams.has('g')) parameters.g = parseFloat(urlParams.get('g')!);
  if (urlParams.has('h')) parameters.h = parseFloat(urlParams.get('h')!);
  if (urlParams.has('i')) parameters.i = parseFloat(urlParams.get('i')!);
  if (urlParams.has('j')) parameters.j = parseFloat(urlParams.get('j')!);
  if (urlParams.has('k')) parameters.k = parseFloat(urlParams.get('k')!);
  if (urlParams.has('l')) parameters.l = parseFloat(urlParams.get('l')!);
  if (urlParams.has('m')) parameters.m = parseFloat(urlParams.get('m')!);
  
  if (urlParams.has('uMin')) parameters.uMin = parseFloat(urlParams.get('uMin')!);
  if (urlParams.has('uMax')) parameters.uMax = parseFloat(urlParams.get('uMax')!);
  if (urlParams.has('vMin')) parameters.vMin = parseFloat(urlParams.get('vMin')!);
  if (urlParams.has('vMax')) parameters.vMax = parseFloat(urlParams.get('vMax')!);
  
  if (urlParams.has('uSeg')) parameters.uSegments = parseInt(urlParams.get('uSeg')!);
  if (urlParams.has('vSeg')) parameters.vSegments = parseInt(urlParams.get('vSeg')!);

  if (locked) {
    console.log(`🔒 Loaded LOCKED preview shape: ${shape}`, parameters);
  } else {
    console.log(`📎 Loaded shared shape: ${shape}`, parameters);
  }

  return {
    type: shape,
    parameters,
    isSharedLink: true,
    isLockedPreview: locked,
    previewName,
    previewExpiry: expiry
  };
}

export function generatePromotionalLink(
  parameters: SurfaceParameters,
  shapeName?: string
): string {
  const baseUrl = window.location.origin + window.location.pathname;
  const params = new URLSearchParams();
  
  params.set('shape', parameters.type);
  params.set('preview', '1');
  
  if (shapeName) {
    params.set('name', shapeName);
  }
  
  params.set('a', String(parameters.a ?? 1));
  params.set('b', String(parameters.b ?? 1));
  params.set('c', String(parameters.c ?? 1));
  
  if (parameters.d !== undefined && parameters.d !== 0) params.set('d', String(parameters.d));
  if (parameters.e !== undefined && parameters.e !== 0) params.set('e', String(parameters.e));
  if (parameters.f !== undefined && parameters.f !== 0) params.set('f', String(parameters.f));
  if (parameters.g !== undefined && parameters.g !== 0) params.set('g', String(parameters.g));
  if (parameters.h !== undefined && parameters.h !== 0) params.set('h', String(parameters.h));
  if (parameters.i !== undefined && parameters.i !== 0) params.set('i', String(parameters.i));
  if (parameters.j !== undefined && parameters.j !== 0) params.set('j', String(parameters.j));
  if (parameters.k !== undefined && parameters.k !== 0) params.set('k', String(parameters.k));
  if (parameters.l !== undefined && parameters.l !== 0) params.set('l', String(parameters.l));
  if (parameters.m !== undefined && parameters.m !== 0) params.set('m', String(parameters.m));
  
  if (parameters.uMin !== undefined) params.set('uMin', String(parameters.uMin));
  if (parameters.uMax !== undefined) params.set('uMax', String(parameters.uMax));
  if (parameters.vMin !== undefined) params.set('vMin', String(parameters.vMin));
  if (parameters.vMax !== undefined) params.set('vMax', String(parameters.vMax));
  if (parameters.uSegments !== undefined) params.set('uSeg', String(parameters.uSegments));
  if (parameters.vSegments !== undefined) params.set('vSeg', String(parameters.vSegments));
  
  return `${baseUrl}?${params.toString()}`;
}

export function clearShareParams(): void {
  const url = new URL(window.location.href);
  url.search = '';
  window.history.replaceState({}, '', url.toString());
}

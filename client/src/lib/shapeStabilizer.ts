import { SurfaceParameters } from '../types/math';

// Stabilization utility to prevent chaotic shapes
export function stabilizeParameters(params: SurfaceParameters): SurfaceParameters {
  const stabilized = { ...params };
  
  // Constrain all mathematical parameters to safe ranges
  const constrainValue = (value: number, min = -2, max = 2) => {
    if (!isFinite(value)) return 0;
    return Math.max(min, Math.min(max, value));
  };
  
  // Apply constraints to all letter parameters
  stabilized.a = constrainValue(stabilized.a);
  stabilized.b = constrainValue(stabilized.b);
  stabilized.c = constrainValue(stabilized.c);
  stabilized.d = constrainValue(stabilized.d);
  stabilized.e = constrainValue(stabilized.e);
  stabilized.f = constrainValue(stabilized.f);
  stabilized.g = constrainValue(stabilized.g);
  stabilized.h = constrainValue(stabilized.h);
  stabilized.i = constrainValue(stabilized.i);
  stabilized.j = constrainValue(stabilized.j);
  stabilized.k = constrainValue(stabilized.k);
  stabilized.l = constrainValue(stabilized.l);
  stabilized.m = constrainValue(stabilized.m);
  stabilized.n = constrainValue(stabilized.n);
  stabilized.o = constrainValue(stabilized.o);
  stabilized.p = constrainValue(stabilized.p);
  stabilized.q = constrainValue(stabilized.q);
  stabilized.r = constrainValue(stabilized.r);
  stabilized.s = constrainValue(stabilized.s);
  stabilized.t = constrainValue(stabilized.t);
  stabilized.u = constrainValue(stabilized.u);
  stabilized.v = constrainValue(stabilized.v);
  stabilized.w = constrainValue(stabilized.w);
  
  // Constrain UV ranges to prevent extreme distortion
  stabilized.uMin = constrainValue(stabilized.uMin, -10, 10);
  stabilized.uMax = constrainValue(stabilized.uMax, -10, 50);
  stabilized.vMin = constrainValue(stabilized.vMin, -10, 10);
  stabilized.vMax = constrainValue(stabilized.vMax, -10, 50);
  
  // Constrain segments to reasonable values (max 128 for detailed shapes)
  stabilized.uSegments = Math.max(3, Math.min(stabilized.uSegments, 128));
  stabilized.vSegments = Math.max(3, Math.min(stabilized.vSegments, 128));
  
  return stabilized;
}

// Check if coordinates are within reasonable bounds
// Validate and clamp coordinates to prevent infinite values
export function validateCoordinates(x: number, y: number, z: number): [number, number, number] {
  const maxValue = 25; // Reasonable limit for wireframe visualization
  
  const validX = isFinite(x) && Math.abs(x) < maxValue ? x : 0;
  const validY = isFinite(y) && Math.abs(y) < maxValue ? y : 0;
  const validZ = isFinite(z) && Math.abs(z) < maxValue ? z : 0;
  
  return [validX, validY, validZ];
}
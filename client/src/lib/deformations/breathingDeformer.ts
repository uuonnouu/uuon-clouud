
import { DeformationFunction, SurfaceParameters } from '../anatomy-engine-v2';

/**
 * Breathing deformer: Simulates respiratory motion
 * - Expands/contracts lung volume based on respiratory cycle
 * - Different regions move with realistic breathing mechanics
 * - Amplitude controlled by breathing parameter
 */
export const breathingDeformer: DeformationFunction = (
  position,
  normal,
  uv,
  params,
  vertexIndex = 0
) => {
  const t = params.time ?? 0;
  const breathing = params.breathing ?? 1.0;
  
  // Respiratory cycle: inspiration and expiration
  const breathFreq = 0.25; // 15 breaths per minute (0.25 Hz)
  const phase = t * Math.PI * 2 * breathFreq;
  
  // Inspiration (expansion) vs expiration (contraction)
  const expansion = Math.sin(phase) * 0.5 + 0.5; // 0-1 range
  
  // Different lung regions move differently during breathing
  const regionFactor = 1 + (vertexIndex % 3) * 0.1; // Slight variation
  
  // Scale deformation (realistic lung expansion ~1-2cm)
  const amplitude = 0.015 * breathing * (expansion - 0.5) * regionFactor;
  
  if (normal) {
    // Move along surface normal for realistic lung expansion
    return {
      x: position.x + normal.x * amplitude,
      y: position.y + normal.y * amplitude,
      z: position.z + normal.z * amplitude,
    };
  }
  
  // Fallback: expand from lung center
  const len = Math.sqrt(position.x * position.x + position.y * position.y + position.z * position.z) || 1;
  return {
    x: position.x + (position.x / len) * amplitude,
    y: position.y + (position.y / len) * amplitude,
    z: position.z + (position.z / len) * amplitude,
  };
};

export default breathingDeformer;

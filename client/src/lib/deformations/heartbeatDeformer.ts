
import { DeformationFunction, SurfaceParameters } from '../anatomy-engine-v2';

/**
 * Heartbeat deformer: Creates realistic cardiac contraction/expansion
 * - Radial displacement based on cardiac cycle
 * - Different regions contract at slightly different phases
 * - Amplitude scales with heartbeat parameter
 */
export const heartbeatDeformer: DeformationFunction = (
  position,
  normal,
  uv,
  params,
  vertexIndex = 0
) => {
  const t = params.time ?? 0;
  const heartbeat = params.heartbeat ?? 1.0;
  
  // Cardiac cycle: systole (contraction) and diastole (relaxation)
  const cycleFreq = 1.2; // beats per second
  const phase = t * Math.PI * 2 * cycleFreq;
  
  // Different regions contract with slight phase delays (realistic electrical conduction)
  const regionPhase = (vertexIndex % 7) * 0.15; // Small phase offset per vertex cluster
  const contractPhase = phase + regionPhase;
  
  // Contraction intensity (systole = positive, diastole = negative)
  const contraction = Math.sin(contractPhase) * 0.5 + 0.5; // 0-1 range
  
  // Scale deformation (small millimeter-scale movements)
  const amplitude = 0.005 * heartbeat * (contraction - 0.5); // ±2.5mm max
  
  if (normal) {
    // Move along surface normal (most realistic)
    return {
      x: position.x + normal.x * amplitude,
      y: position.y + normal.y * amplitude,
      z: position.z + normal.z * amplitude,
    };
  }
  
  // Fallback: radial from heart center
  const len = Math.sqrt(position.x * position.x + position.y * position.y + position.z * position.z) || 1;
  return {
    x: position.x + (position.x / len) * amplitude,
    y: position.y + (position.y / len) * amplitude,
    z: position.z + (position.z / len) * amplitude,
  };
};

export default heartbeatDeformer;

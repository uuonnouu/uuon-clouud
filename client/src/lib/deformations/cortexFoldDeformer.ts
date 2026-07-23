
import { DeformationFunction, SurfaceParameters } from '../anatomy-engine-v2';

/**
 * Cortex fold deformer: Enhances gyri and sulci patterns
 * - Amplifies existing cortical folding patterns
 * - Uses UV coordinates or position-based noise for realistic variation
 * - Maintains anatomical accuracy while adding visual depth
 */
export const cortexFoldDeformer: DeformationFunction = (
  position,
  normal,
  uv,
  params,
  vertexIndex = 0
) => {
  const foldAmount = params.foldAmount ?? 1.0;
  const time = params.time ?? 0;
  
  // Use UV coordinates if available, otherwise derive from position
  const u = uv?.u ?? (Math.abs(position.x * 3.7) % 1);
  const v = uv?.v ?? (Math.abs(position.y * 2.3) % 1);
  
  // Multi-scale folding patterns (mimicking real cortical folding)
  const primaryFolds = Math.sin(u * 12 + v * 8) * 0.003; // Large gyri/sulci
  const secondaryFolds = Math.sin(u * 25 + v * 18) * 0.001; // Smaller folds
  const tertiaryFolds = Math.sin(u * 40 + v * 35 + time * 0.1) * 0.0005; // Fine detail
  
  // Combine fold patterns
  const totalFold = (primaryFolds + secondaryFolds + tertiaryFolds) * foldAmount;
  
  if (normal) {
    // Displace along surface normal for realistic cortical depth
    return {
      x: position.x + normal.x * totalFold,
      y: position.y + normal.y * totalFold,
      z: position.z + normal.z * totalFold,
    };
  }
  
  // Fallback: minimal z-displacement
  return {
    x: position.x,
    y: position.y,
    z: position.z + totalFold,
  };
};

export default cortexFoldDeformer;

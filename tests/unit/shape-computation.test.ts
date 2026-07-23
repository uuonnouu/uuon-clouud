
import { describe, it, expect } from 'vitest';
import { computeParametricSurface } from '../../server/lib/shapes/shapeComputer';

describe('Shape Computation', () => {
  it('should compute sphere correctly', () => {
    const result = computeParametricSurface('sphere', { a: 1, b: 1, c: 1 });
    expect(result).toBeDefined();
    expect(result.vertices).toHaveLength(3072); // 64*32*3/2
  });

  it('should handle invalid parameters gracefully', () => {
    const result = computeParametricSurface('sphere', { a: 0 });
    expect(result.vertices).toBeDefined();
  });
});

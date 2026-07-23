import type { GeometryShape } from "./schema";

/**
 * Create a new shape in the engine
 */
export function createShape(type: GeometryShape["type"]): GeometryShape {
  return {
    id: crypto.randomUUID(),
    type,
    energy: 1,
    phiAlignment: 0,
    piRatio: 0,
    state: "stable",
  };
}

/**
 * Apply energy changes to a shape
 */
export function applyEnergy(shape: GeometryShape, delta: number): GeometryShape {
  const energy = shape.energy + delta;

  return {
    ...shape,
    energy,
    state:
      energy <= 0
        ? "collapsed"
        : energy < 5
        ? "dynamic"
        : "stable",
  };
}

/**
 * Apply harmonic resonance (phi/pi effects)
 */
export function resonate(shape: GeometryShape): GeometryShape {
  return {
    ...shape,
    phiAlignment: Math.sin(shape.energy) * 1.618,
    piRatio: shape.energy / Math.PI,
  };
}

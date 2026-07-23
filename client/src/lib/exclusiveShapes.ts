// ============================================================================
// HISTORICAL DOCUMENTATION - DO NOT USE FOR NEW SHAPES
// ============================================================================
// This file is kept for historical reference only.
// ALL NEW SHAPES must be added to: client/src/lib/unifiedShapes.ts
// ============================================================================

interface SurfaceEquation {
  x: (u: number, v: number, ...args: number[]) => number;
  y: (u: number, v: number, ...args: number[]) => number;
  z: (u: number, v: number, ...args: number[]) => number;
}
import NON_EUCLIDEAN_GEOMETRIES from "./nonEuclideanGeometries";

// **Product of UUON Foundation, no undocumented reproduction or any use without written consent.**
// **Author: Phillip A. Ruiz III, Organization: UUON Foundation Inc.**
// **Contact: www.uuonfoundation.com, phi1@uuonfoundation.com, @uuon.foundation**
// **YouTube: https://www.youtube.com/channel/UC4sESexz8vYUW2WNZsYwOfQ**
// **3D Models: https://www.cgtrader.com/designers/uuon-foundation**

// Essential shapes only - NO POLYGON SERIES
export const EXCLUSIVE_SHAPES: Record<string, SurfaceEquation> = {
  // Import Non-Euclidean geometries
  ...NON_EUCLIDEAN_GEOMETRIES,
  
  // Basic curved shapes
  cylinder: {
    x: (u, v, a = 2, b = 1, c = 1) => a * Math.cos(u) * b,
    y: (u, v, a = 2, b = 1, c = 1) => a * Math.sin(u) * b,
    z: (u, v, a = 2, b = 1, c = 1) => v * c
  },

  sphere: {
    x: (u, v, a = 2, b = 1, c = 1) => a * Math.sin(v) * Math.cos(u) * b,
    y: (u, v, a = 2, b = 1, c = 1) => a * Math.sin(v) * Math.sin(u) * b,
    z: (u, v, a = 2, b = 1, c = 1) => a * Math.cos(v) * c
  },

  torus: {
    x: (u, v, a = 3, b = 1, c = 1) => (a + b * Math.cos(v)) * Math.cos(u),
    y: (u, v, a = 3, b = 1, c = 1) => (a + b * Math.cos(v)) * Math.sin(u),
    z: (u, v, a = 3, b = 1, c = 1) => b * Math.sin(v) * c
  },

  ellipsoid: {
    x: (u, v, a = 3, b = 2, c = 1) => a * Math.sin(v) * Math.cos(u),
    y: (u, v, a = 3, b = 2, c = 1) => b * Math.sin(v) * Math.sin(u),
    z: (u, v, a = 3, b = 2, c = 1) => c * Math.cos(v)
  },

  cone: {
    x: (u, v, a = 2, b = 1, c = 1) => a * v * Math.cos(u) * b,
    y: (u, v, a = 2, b = 1, c = 1) => a * v * Math.sin(u) * b,
    z: (u, v, a = 2, b = 1, c = 1) => (1 - v) * c
  }
};

export default EXCLUSIVE_SHAPES;
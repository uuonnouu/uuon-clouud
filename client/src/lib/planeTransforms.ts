import { SurfaceParameters } from '../types/math';

export interface PlaneTransform {
  name: string;
  description: string;
  transform: (point: [number, number, number], params: SurfaceParameters) => [number, number, number];
}

export const PLANE_TRANSFORMS: Record<string, PlaneTransform> = {
  xy_slice: {
    name: "XY Plane Slicing",
    description: "Dramatic slicing along XY plane with wave distortions",
    transform: ([x, y, z], params) => {
      const { a = 1, b = 0.5, c = 2 } = params;
      // Dramatic wave slicing in XY plane
      const sliceWave = a * Math.sin(b * (x + y)) * Math.cos(c * z);
      const newZ = z + sliceWave * Math.abs(Math.sin(x * y * 0.1));
      return [x, y, newZ];
    }
  },

  yz_slice: {
    name: "YZ Plane Slicing", 
    description: "Dramatic slicing along YZ plane with spiral cuts",
    transform: ([x, y, z], params) => {
      const { a = 1, b = 0.3, c = 1.5 } = params;
      // Spiral slicing in YZ plane
      const angle = Math.atan2(z, y);
      const radius = Math.sqrt(y*y + z*z);
      const spiralCut = a * Math.sin(b * angle + c * radius);
      const newX = x + spiralCut * Math.cos(angle * 3);
      return [newX, y, z];
    }
  },

  wxy_dimensional: {
    name: "WXY 4D Projection",
    description: "Dramatic 4D to 3D projection with hyperplane cuts", 
    transform: ([x, y, z], params) => {
      const { a = 2, b = 1, c = 0.5, d = 1.5 } = params;
      // 4D hyperplane projection (W dimension simulated)
      const w = a * Math.sin(b * x) + c * Math.cos(d * y);
      const projectionFactor = 1 / (1 + Math.abs(w) * 0.1);
      
      // Dramatic 4D cutting effect
      const hyperCut = w * Math.sin(x * y * z * 0.01);
      const newX = x * projectionFactor + hyperCut * 0.3;
      const newY = y * projectionFactor;
      const newZ = z * projectionFactor + hyperCut * 0.5;
      
      return [newX, newY, newZ];
    }
  },

  xyz_vortex: {
    name: "XYZ Vortex Transform",
    description: "Dramatic vortex transformation with multi-plane twisting",
    transform: ([x, y, z], params) => {
      const { a = 1, b = 2, c = 0.5 } = params;
      const radius = Math.sqrt(x*x + y*y);
      const angle = Math.atan2(y, x);
      
      // Vortex with Z-dependent twisting
      const twist = a * z * 0.1;
      const vortexAngle = angle + twist + b * Math.sin(c * radius);
      
      const newX = radius * Math.cos(vortexAngle);
      const newY = radius * Math.sin(vortexAngle);
      const newZ = z + a * Math.sin(radius * b) * Math.cos(c * angle);
      
      return [newX, newY, newZ];
    }
  },

  fractal_slice: {
    name: "Fractal Plane Cutting", 
    description: "Dramatic fractal-based plane cutting with recursive patterns",
    transform: ([x, y, z], params) => {
      const { a = 1, b = 3, c = 2 } = params;
      
      // Recursive fractal cutting pattern
      const scale1 = Math.sin(a * x) * Math.cos(b * y);
      const scale2 = Math.sin(b * y) * Math.cos(c * z);  
      const scale3 = Math.sin(c * z) * Math.cos(a * x);
      
      const fractalCut = (scale1 + scale2 + scale3) * 0.3;
      
      const newX = x + fractalCut * Math.sign(x);
      const newY = y + fractalCut * Math.sign(y);
      const newZ = z + fractalCut * Math.sign(z);
      
      return [newX, newY, newZ];
    }
  }
};

export function applyPlaneTransform(
  points: [number, number, number][], 
  transformType: string, 
  params: SurfaceParameters
): [number, number, number][] {
  const transform = PLANE_TRANSFORMS[transformType];
  if (!transform) return points;
  
  return points.map(point => transform.transform(point, params));
}

export function getPlaneTransformNames(): string[] {
  return Object.keys(PLANE_TRANSFORMS);
}
/**
 * Yeganeh Eagle Mathematical Art
 * Based on Hamid Naderi Yeganeh's famous Eagle visualization
 * 
 * This creates ellipses with foci at:
 *   A(m,n) + i*B(m,n) + C(m,n)*e^(i*D(m,n)) and
 *   A(m,n) + i*B(m,n) - C(m,n)*e^(i*D(m,n))
 * with eccentricity 95/100 for m = 1,2,...,200 and n = 0,1,...,35
 */

export interface YeganehEllipse {
  focus1: { x: number; y: number };
  focus2: { x: number; y: number };
  center: { x: number; y: number };
  semiMajor: number;
  semiMinor: number;
  rotation: number;
  m: number;
  n: number;
}

const ECCENTRICITY = 0.95;

function E(m: number, n: number): number {
  const term1 = Math.PI / 2 + Math.atan((3 * m) / 2 - 120);
  const term2 = Math.PI / 2 - Math.atan((4 * m) / 20 - 20);
  const term3 = Math.PI / 2 + Math.atan((8 * n) / 7 - 16);
  const term4 = Math.PI / 2 - Math.atan((8 * n) / 7 - 104 / 3);
  const term5 = -Math.PI / 4 + Math.atan(4000 * (n / 35 - 19 / 30));
  
  return (1 / 2500) * term1 * term2 * term3 * term4 * term5;
}

function A(m: number, n: number): number {
  const mRatio = m / 200;
  const nRatio = n / 35;
  
  const term1 = (1 / 40) * Math.atan(400 * (-8 / 30 + nRatio)) * Math.pow(1 - mRatio, 10);
  const term2 = -mRatio * (1 - (17 * m) / 6000 * (1 - nRatio));
  const term3 = -(1 / 20) * Math.pow(1 - mRatio, 40);
  
  return term1 + term2 + term3;
}

function B(m: number, n: number): number {
  const mRatio = m / 200;
  const nRatio = n / 35;
  const eVal = E(m, n);
  
  const term1 = eVal;
  const term2 = -(10 / 25) * Math.pow(mRatio, 7);
  const term3 = (1 / 10) * (Math.PI / 2 - Math.atan((7 * m) / 20 - 84 / 3)) * 
                Math.atan(4000 * (-8 / 30 + nRatio)) * (4 / 10 - mRatio);
  const term4 = (1 / 5 + (7 / (100 * Math.PI)) * (Math.PI / 2 + Math.atan(m / 2 - 100 / 3))) *
                (Math.pow(-1, n) / 70 + nRatio) * (1 - Math.pow(1 - mRatio, 10));
  const term5 = -(1 / 12) * Math.pow(1 - mRatio, 20) * Math.atan(400 * (-8 / 30 + nRatio));
  
  return term1 + term2 + term3 + term4 + term5;
}

function C(m: number, n: number): number {
  const mRatio = m / 200;
  const eVal = E(m, n);
  
  return (1 / 200 + (1 / 10) * Math.pow(mRatio, 2)) * (1 - 4 * Math.pow(eVal, 2));
}

function D(m: number, n: number): number {
  const mRatio = m / 200;
  const nRatio = n / 35;
  
  const innerTerm = nRatio * Math.pow(mRatio, 6) + (1 - nRatio) * Math.pow(mRatio, 2);
  
  return -Math.PI / 6 + (-nRatio * (10 * Math.PI) / 26 + Math.PI) * innerTerm;
}

export function generateYeganehEagleEllipses(
  mMax: number = 200,
  nMax: number = 35,
  mStep: number = 1,
  nStep: number = 1
): YeganehEllipse[] {
  const ellipses: YeganehEllipse[] = [];
  
  for (let m = 1; m <= mMax; m += mStep) {
    for (let n = 0; n <= nMax; n += nStep) {
      const aVal = A(m, n);
      const bVal = B(m, n);
      const cVal = C(m, n);
      const dVal = D(m, n);
      
      const cosD = Math.cos(dVal);
      const sinD = Math.sin(dVal);
      
      const focus1 = {
        x: aVal + cVal * cosD,
        y: bVal + cVal * sinD
      };
      
      const focus2 = {
        x: aVal - cVal * cosD,
        y: bVal - cVal * sinD
      };
      
      const center = {
        x: (focus1.x + focus2.x) / 2,
        y: (focus1.y + focus2.y) / 2
      };
      
      const focalDistance = Math.sqrt(
        Math.pow(focus1.x - focus2.x, 2) + Math.pow(focus1.y - focus2.y, 2)
      );
      
      const c = focalDistance / 2;
      const semiMajor = c / ECCENTRICITY;
      const semiMinor = semiMajor * Math.sqrt(1 - ECCENTRICITY * ECCENTRICITY);
      
      const rotation = Math.atan2(focus1.y - focus2.y, focus1.x - focus2.x);
      
      if (isFinite(semiMajor) && isFinite(semiMinor) && semiMajor > 0 && semiMinor > 0) {
        ellipses.push({
          focus1,
          focus2,
          center,
          semiMajor,
          semiMinor,
          rotation,
          m,
          n
        });
      }
    }
  }
  
  return ellipses;
}

export function generateEllipsePoints(
  ellipse: YeganehEllipse,
  segments: number = 32
): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * 2 * Math.PI;
    const localX = ellipse.semiMajor * Math.cos(t);
    const localY = ellipse.semiMinor * Math.sin(t);
    
    const cos = Math.cos(ellipse.rotation);
    const sin = Math.sin(ellipse.rotation);
    
    points.push({
      x: ellipse.center.x + localX * cos - localY * sin,
      y: ellipse.center.y + localX * sin + localY * cos
    });
  }
  
  return points;
}

export function yeganehEagleToParametricSurface(
  scale: number = 3,
  mStep: number = 2,
  nStep: number = 1
): {
  name: string;
  x: (u: number, v: number, params: any) => number;
  y: (u: number, v: number, params: any) => number;
  z: (u: number, v: number, params: any) => number;
  uRange: [number, number];
  vRange: [number, number];
  category: string;
} {
  const ellipses = generateYeganehEagleEllipses(200, 35, mStep, nStep);
  
  return {
    name: "Yeganeh Eagle",
    category: "Mathematical Art",
    uRange: [0, 1] as [number, number],
    vRange: [0, 2 * Math.PI] as [number, number],
    x: (u: number, v: number, params: any = {}) => {
      const ellipseIndex = Math.floor(u * (ellipses.length - 1));
      const ellipse = ellipses[Math.min(ellipseIndex, ellipses.length - 1)];
      
      if (!ellipse) return 0;
      
      const d = (params.d ?? 1) * scale;
      const localX = ellipse.semiMajor * Math.cos(v);
      const localY = ellipse.semiMinor * Math.sin(v);
      const cos = Math.cos(ellipse.rotation);
      const sin = Math.sin(ellipse.rotation);
      
      return (ellipse.center.x + localX * cos - localY * sin) * d;
    },
    y: (u: number, v: number, params: any = {}) => {
      const ellipseIndex = Math.floor(u * (ellipses.length - 1));
      const ellipse = ellipses[Math.min(ellipseIndex, ellipses.length - 1)];
      
      if (!ellipse) return 0;
      
      const e = (params.e ?? 1) * scale;
      const localX = ellipse.semiMajor * Math.cos(v);
      const localY = ellipse.semiMinor * Math.sin(v);
      const cos = Math.cos(ellipse.rotation);
      const sin = Math.sin(ellipse.rotation);
      
      return (ellipse.center.y + localX * sin + localY * cos) * e;
    },
    z: (u: number, v: number, params: any = {}) => {
      const ellipseIndex = Math.floor(u * (ellipses.length - 1));
      const ellipse = ellipses[Math.min(ellipseIndex, ellipses.length - 1)];
      
      if (!ellipse) return 0;
      
      const f = (params.f ?? 0.1) * scale;
      const depth = (ellipse.m / 200) * 0.3 + (ellipse.n / 35) * 0.1;
      
      return depth * f;
    }
  };
}

const eagleSurface = yeganehEagleToParametricSurface();

export const YEGANEH_EAGLE_SHAPE = {
  id: 'yeganeh-eagle',
  name: 'Yeganeh Eagle',
  category: 'Mathematical Art',
  description: 'Famous Eagle visualization by Hamid Naderi Yeganeh using ~7000 ellipses with complex parametric equations',
  formula: 'Ellipses with foci A(m,n) ± C(m,n)·e^(iD(m,n)) + iB(m,n), eccentricity 0.95',
  equation: (u: number, v: number, params: any = {}): [number, number, number] => {
    return [
      eagleSurface.x(u, v, params),
      eagleSurface.y(u, v, params),
      eagleSurface.z(u, v, params)
    ];
  },
  uRange: eagleSurface.uRange,
  vRange: eagleSurface.vRange,
  defaultParams: {
    a: 1,
    b: 1,
    c: 1,
    d: 1,
    e: 1,
    f: 0.1
  }
};

export default YEGANEH_EAGLE_SHAPE;

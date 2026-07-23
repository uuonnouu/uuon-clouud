export type GeometryShape = {
  id: string;
  type: "circle" | "polygon" | "fractal" | "vector";
  energy: number;
  phiAlignment?: number;
  piRatio?: number;
  state: "stable" | "dynamic" | "collapsed";
};
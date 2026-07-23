/**
 * IFS GLB Exporter
 * Two export paths:
 *   1. Texture-plane GLB  — canvas frame → PNG texture → plane mesh → GLB (fast, always works)
 *   2. Real-mesh GLB      — CPU SDF evaluation → fan-triangulation isosurface → GLB (Menger + Mandelbulb)
 */

import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { IFSParams } from '../stores/ifsStore';

// ── GLB download helper ───────────────────────────────────────────────────────
function downloadGLBBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Export progress callback ───────────────────────────────────────────────────
export type ExportProgress = (msg: string, pct: number) => void;

// ──────────────────────────────────────────────────────────────────────────────
//  PATH 1 — Canvas texture → PlaneGeometry GLB
// ──────────────────────────────────────────────────────────────────────────────
export async function exportIFSTextureGLB(
  dataUrl: string,
  shapeType: string,
  params: IFSParams,
  onProgress?: ExportProgress,
): Promise<void> {
  onProgress?.('Loading frame…', 10);

  // Load the PNG into a texture
  const texture = await new Promise<THREE.Texture>((resolve, reject) => {
    new THREE.TextureLoader().load(dataUrl, resolve, undefined, reject);
  });
  texture.flipY = false;
  texture.colorSpace = THREE.SRGBColorSpace;

  onProgress?.('Building plane mesh…', 40);

  // Create a screen-aligned plane (no UVs needed, PlaneGeometry has them by default)
  const w = 2, h = 2;
  const geo = new THREE.PlaneGeometry(w, h, 1, 1);

  const mat = new THREE.MeshStandardMaterial({
    map: texture,
    side: THREE.DoubleSide,
    roughness: 0.4,
    metalness: 0.1,
    envMapIntensity: 0.0,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = `ifs_${shapeType}_frame`;

  // Embed metadata as userData
  mesh.userData = {
    source: 'UUON Δmension IFS Engine',
    shapeType,
    engine: params.mode === 1 ? 'Mandelbulb' : 'Menger IFS',
    exportMode: 'texture-plane',
    params: {
      ft: params.ft, mi: params.mi, sc: params.sc, ox: params.ox, oy: params.oy,
      mode: params.mode, pow: params.pow, variant: params.variant,
    },
  };

  const scene = new THREE.Scene();
  scene.name = 'ifs_scene';
  scene.add(mesh);

  onProgress?.('Encoding GLB…', 70);

  const exporter = new GLTFExporter();
  await new Promise<void>((resolve, reject) => {
    exporter.parse(
      scene,
      (result) => {
        onProgress?.('Downloading…', 95);
        const blob = new Blob([result as ArrayBuffer], { type: 'model/gltf-binary' });
        const ts = Date.now();
        downloadGLBBlob(blob, `ifs_${shapeType}_texture_${ts}.glb`);
        resolve();
      },
      (err) => reject(err),
      { binary: true, includeCustomExtensions: false },
    );
  });

  onProgress?.('Done.', 100);
}


// ──────────────────────────────────────────────────────────────────────────────
//  PATH 2 — CPU SDF → isosurface mesh → GLB
// ──────────────────────────────────────────────────────────────────────────────

// ── SDF functions (JS ports of the GLSL shaders) ─────────────────────────────

/** Menger IFS signed distance estimate */
function mengerSDF(
  px: number, py: number, pz: number,
  sc: number, ox: number, oy: number, oz: number,
  mi: number,
): number {
  let x = px, y = py, z = pz, scale = 1.0;
  for (let i = 0; i < mi; i++) {
    x = Math.abs(x); y = Math.abs(y); z = Math.abs(z);
    // sort descending
    if (x < y) { const t = x; x = y; y = t; }
    if (x < z) { const t = x; x = z; z = t; }
    if (y < z) { const t = y; y = z; z = t; }
    x = sc * x - ox * (sc - 1);
    y = sc * y - oy * (sc - 1);
    z = sc * z - oz * (sc - 1);
    scale *= sc;
  }
  const cyl = Math.min(
    Math.sqrt(x * x + y * y),
    Math.sqrt(x * x + z * z),
    Math.sqrt(y * y + z * z),
  );
  const d = (cyl - 1.0) / scale;
  // Bounding box clamp
  const gr = Math.max(ox * 1.2, 2.0);
  const bx = Math.abs(px) - gr, by = Math.abs(py) - gr, bz = Math.abs(pz) - gr;
  const boxD = (
    Math.sqrt(Math.max(bx, 0) ** 2 + Math.max(by, 0) ** 2 + Math.max(bz, 0) ** 2) +
    Math.min(Math.max(bx, Math.max(by, bz)), 0)
  ) * 0.12;
  return Math.max(d, boxD);
}

// ── Platonic fold functions (JS ports of GLSL in IFSCanvas.tsx) ───────────────

const PHI = 1.61803398875;
const INV_PHI = 0.61803398875;

/** Reflect p in plane with unit normal n if dot(p,n)<0 */
function reflectIfNeg(p: [number,number,number], n: [number,number,number]): [number,number,number] {
  const d = p[0]*n[0] + p[1]*n[1] + p[2]*n[2];
  if (d < 0) return [p[0] - 2*d*n[0], p[1] - 2*d*n[1], p[2] - 2*d*n[2]];
  return p;
}

function norm3(v: [number,number,number]): [number,number,number] {
  const l = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
  return l > 0 ? [v[0]/l, v[1]/l, v[2]/l] : v;
}

function icosaFold(p: [number,number,number]): [number,number,number] {
  const n1 = norm3([ 1, PHI, 0]);
  const n2 = norm3([-1, PHI, 0]);
  const n3 = norm3([ 0, 1,  PHI]);
  const n4 = norm3([ 0,-1,  PHI]);
  const n5 = norm3([ PHI, 0,  1]);
  const n6 = norm3([-PHI, 0,  1]);
  for (let k = 0; k < 3; k++) {
    p = reflectIfNeg(p, n1);
    p = reflectIfNeg(p, n2);
    p = reflectIfNeg(p, n3);
    p = reflectIfNeg(p, n4);
    p = reflectIfNeg(p, n5);
    p = reflectIfNeg(p, n6);
  }
  return [Math.abs(p[0]), Math.abs(p[1]), Math.abs(p[2])];
}

function octaFold(p: [number,number,number]): [number,number,number] {
  let [x, y, z] = [Math.abs(p[0]), Math.abs(p[1]), Math.abs(p[2])];
  if (x < y) { const t = x; x = y; y = t; }
  if (x < z) { const t = x; x = z; z = t; }
  if (y < z) { const t = y; y = z; z = t; }
  return [x, y, z];
}

function dodecaFold(p: [number,number,number]): [number,number,number] {
  const n1 = norm3([ 1,  1,  1]);
  const n2 = norm3([-1,  1,  1]);
  const n3 = norm3([ 1, -1,  1]);
  const n4 = norm3([ 1,  1, -1]);
  const n5 = norm3([ 0, INV_PHI, PHI]);
  const n6 = norm3([ 0,-INV_PHI, PHI]);
  const n7 = norm3([ PHI, 0, INV_PHI]);
  const n8 = norm3([-PHI, 0, INV_PHI]);
  for (let k = 0; k < 3; k++) {
    p = reflectIfNeg(p, n1);
    p = reflectIfNeg(p, n2);
    p = reflectIfNeg(p, n3);
    p = reflectIfNeg(p, n4);
    p = reflectIfNeg(p, n5);
    p = reflectIfNeg(p, n6);
    p = reflectIfNeg(p, n7);
    p = reflectIfNeg(p, n8);
  }
  return [Math.abs(p[0]), Math.abs(p[1]), Math.abs(p[2])];
}

/**
 * Full Platonic IFS SDF — JS port of ifsDE() in IFSCanvas.tsx
 * for fold types 5 (icosa), 6 (octa), 7 (dodeca).
 */
function platonicIFSSDF(
  px: number, py: number, pz: number,
  ft: number,          // 5=icosa, 6=octa, 7=dodeca
  fi: number,          // fold pretransform iterations
  fs: number,          // fold size
  fsc: number,         // fold scale
  mi: number,          // menger iterations
  sc: number,          // menger scale
  ox: number, oy: number, oz: number,
  bl: number,          // blend 0=fold, 1=original
): number {
  let [x, y, z] = [px, py, pz] as [number,number,number];

  // Fold pretransform
  for (let i = 0; i < fi; i++) {
    let p: [number,number,number] = [x, y, z];
    if (ft === 5) {
      p = icosaFold(p);
      x = p[0] * fsc - fs * 0.618;
      y = p[1] * fsc - fs * 0.618;
      z = p[2] * fsc - fs * 0.618;
    } else if (ft === 6) {
      p = octaFold(p);
      x = p[0] * fsc - fs;
      y = p[1] * fsc - fs;
      z = p[2] * fsc - fs;
    } else {
      p = dodecaFold(p);
      x = p[0] * fsc - fs * 0.5;
      y = p[1] * fsc - fs * 0.5;
      z = p[2] * fsc - fs * 0.5;
    }
  }

  // Blend with original position
  const qx = x + (px - x) * bl;
  const qy = y + (py - y) * bl;
  const qz = z + (pz - z) * bl;

  let [mx, my, mz] = [qx, qy, qz];
  let scale = 1.0;

  // Menger IFS iterations
  for (let i = 0; i < mi; i++) {
    let ax = Math.abs(mx), ay = Math.abs(my), az = Math.abs(mz);
    if (ax < ay) { const t = ax; ax = ay; ay = t; }
    if (ax < az) { const t = ax; ax = az; az = t; }
    if (ay < az) { const t = ay; ay = az; az = t; }
    mx = sc * ax - ox * (sc - 1);
    my = sc * ay - oy * (sc - 1);
    mz = sc * az - oz * (sc - 1);
    scale *= sc;
  }

  const cyl = Math.min(
    Math.sqrt(mx*mx + my*my),
    Math.sqrt(mx*mx + mz*mz),
    Math.sqrt(my*my + mz*mz),
  );
  const d = (cyl - 1.0) / scale;

  // Bounding box
  const guideR = Math.max(fs * fsc * 1.2, 2.0);
  const bx = Math.abs(px) - guideR;
  const by = Math.abs(py) - guideR;
  const bz = Math.abs(pz) - guideR;
  const boxD = (
    Math.sqrt(Math.max(bx,0)**2 + Math.max(by,0)**2 + Math.max(bz,0)**2) +
    Math.min(Math.max(bx, Math.max(by, bz)), 0)
  ) * 0.12;

  return Math.max(d, boxD);
}

/** Mandelbulb triplex power */
function triplexPow(zx: number, zy: number, zz: number, n: number): [number, number, number] {
  const r = Math.sqrt(zx * zx + zy * zy + zz * zz);
  if (r < 1e-6) return [0, 0, 0];
  const theta = Math.acos(Math.max(-1, Math.min(1, zz / r))) * n;
  const phi = Math.atan2(zy, zx) * n;
  const rn = Math.pow(r, n);
  const st = Math.sin(theta);
  return [rn * st * Math.cos(phi), rn * st * Math.sin(phi), rn * Math.cos(theta)];
}

/** Mandelbulb signed distance estimate (Nylander/White) */
function mandelbulbSDF(
  px: number, py: number, pz: number,
  power: number, maxIter: number, bail: number,
): number {
  let x = px, y = py, z = pz, dr = 1.0, r = 0.0;
  for (let i = 0; i < maxIter; i++) {
    r = Math.sqrt(x * x + y * y + z * z);
    if (r > bail) break;
    const [nx, ny, nz] = triplexPow(x, y, z, power);
    dr = Math.pow(r, power - 1) * power * dr + 1.0;
    x = nx + px; y = ny + py; z = nz + pz;
  }
  if (r < 1e-9) return 0;
  return 0.5 * Math.log(r) * r / dr;
}

// ──────────────────────────────────────────────────────────────────────────────
//  FULL IFS DE — JS port of ifsDE() in FS_STANDARD
//  Handles fold types 0 (Menger), 1 (Mandelbox), 2 (Kleinian),
//  3 (Lattice), 4 (Tetrahedral). ft 5/6/7 use platonicIFSSDF above.
// ──────────────────────────────────────────────────────────────────────────────

/** Box fold: clamp-reflect each component into [-s, s] */
function boxFoldJS(px: number, py: number, pz: number, s: number): [number,number,number] {
  return [
    Math.max(-s, Math.min(s, px)) * 2 - px,
    Math.max(-s, Math.min(s, py)) * 2 - py,
    Math.max(-s, Math.min(s, pz)) * 2 - pz,
  ];
}

/** Sphere fold: invert/scale if inside minR or fixR shell */
function sphereFoldJS(px: number, py: number, pz: number, minR: number, fixR: number): [number,number,number] {
  const r2 = Math.max(px*px + py*py + pz*pz, 1e-8);
  if (r2 < minR * minR) {
    const s = (fixR * fixR) / (minR * minR);
    return [px * s, py * s, pz * s];
  } else if (r2 < fixR * fixR) {
    const s = (fixR * fixR) / r2;
    return [px * s, py * s, pz * s];
  }
  return [px, py, pz];
}

/** Lattice fold: periodic wrapping into cubic cell of half-size s */
function latticeFoldJS(px: number, py: number, pz: number, s: number): [number,number,number] {
  const m2 = 2 * s;
  const wrap = (v: number) => ((v + s) % m2 + m2) % m2 - s;
  return [wrap(px), wrap(py), wrap(pz)];
}

/** Tetrahedral fold: Td symmetry group (24 ops) */
function tetraFoldJS(px: number, py: number, pz: number): [number,number,number] {
  let x = px, y = py, z = pz;
  if (x + y < 0) { const t = x; x = -y; y = -t; }
  if (x + z < 0) { const t = x; x = -z; z = -t; }
  if (y + z < 0) { const t = y; y = -z; z = -t; }
  if (x - y < 0) { const t = x; x = y; y = t; }
  return [Math.abs(x), Math.abs(y), Math.abs(z)];
}

/**
 * Full IFS SDF — direct JS port of ifsDE() in FS_STANDARD.
 * Supports fold types 0 (bare Menger), 1 (Mandelbox), 2 (Kleinian),
 * 3 (Lattice), 4 (Tetrahedral).
 */
function fullIFSSDF(
  px: number, py: number, pz: number,
  ft: number, fi: number, fs: number, fsc: number, mr: number, bl: number,
  mi: number, sc: number, ox: number, oy: number, oz: number,
): number {
  let x = px, y = py, z = pz;

  // Fold pretransform — fi iterations of the chosen fold
  for (let i = 0; i < fi; i++) {
    if (ft === 1) {
      // Mandelbox: box fold then sphere fold (fixR = 1.0)
      [x, y, z] = boxFoldJS(x, y, z, fs);
      [x, y, z] = sphereFoldJS(x, y, z, mr, 1.0);
      x *= fsc; y *= fsc; z *= fsc;
    } else if (ft === 2) {
      // Kleinian: box fold + sphere fold(fixR = fs) + add original c
      [x, y, z] = boxFoldJS(x, y, z, fs);
      [x, y, z] = sphereFoldJS(x, y, z, mr, fs);
      x = x * fsc + px; y = y * fsc + py; z = z * fsc + pz;
    } else if (ft === 3) {
      // Lattice: periodic fold
      [x, y, z] = latticeFoldJS(x, y, z, fs);
      x *= fsc; y *= fsc; z *= fsc;
    } else if (ft === 4) {
      // Tetrahedral: Td symmetry fold
      [x, y, z] = tetraFoldJS(x, y, z);
      x = x * fsc - fs; y = y * fsc - fs; z = z * fsc - fs;
    } else {
      // ft === 0: no fold — break immediately (matches GLSL `else break`)
      break;
    }
  }

  // Blend folded position back toward original (matches GLSL mix(p, pos, uBL))
  const qx = x + (px - x) * bl;
  const qy = y + (py - y) * bl;
  const qz = z + (pz - z) * bl;

  // Menger IFS iterations
  let mx = qx, my = qy, mz = qz, ms = 1.0;
  for (let i = 0; i < mi; i++) {
    let ax = Math.abs(mx), ay = Math.abs(my), az = Math.abs(mz);
    if (ax < ay) { const t = ax; ax = ay; ay = t; }
    if (ax < az) { const t = ax; ax = az; az = t; }
    if (ay < az) { const t = ay; ay = az; az = t; }
    mx = sc * ax - ox * (sc - 1);
    my = sc * ay - oy * (sc - 1);
    mz = sc * az - oz * (sc - 1);
    ms *= sc;
  }

  const cyl = Math.min(
    Math.sqrt(mx * mx + my * my),
    Math.sqrt(mx * mx + mz * mz),
    Math.sqrt(my * my + mz * mz),
  );
  const d = (cyl - 1.0) / ms;

  // Bounding box (same formula as GLSL ifsDE default case)
  const guideR = Math.max(fs * fsc * 1.2, 2.0);
  const bx = Math.abs(px) - guideR;
  const by = Math.abs(py) - guideR;
  const bz = Math.abs(pz) - guideR;
  const boxD = (
    Math.sqrt(Math.max(bx, 0) ** 2 + Math.max(by, 0) ** 2 + Math.max(bz, 0) ** 2) +
    Math.min(Math.max(bx, Math.max(by, bz)), 0)
  ) * 0.12;

  return Math.max(d, boxD);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Perpendicular to a unit vector (Frisvad's method) */
function perpendicular(nx: number, ny: number, nz: number): [number, number, number] {
  if (Math.abs(nx) <= Math.abs(ny) && Math.abs(nx) <= Math.abs(nz)) {
    const l = Math.sqrt(ny * ny + nz * nz);
    return [0, -nz / l, ny / l];
  } else if (Math.abs(ny) <= Math.abs(nz)) {
    const l = Math.sqrt(nx * nx + nz * nz);
    return [-nz / l, 0, nx / l];
  } else {
    const l = Math.sqrt(nx * nx + ny * ny);
    return [-ny / l, nx / l, 0];
  }
}

function cross(
  ax: number, ay: number, az: number,
  bx: number, by: number, bz: number,
): [number, number, number] {
  return [ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx];
}

// ── Edge connectivity for a unit cube ────────────────────────────────────────
// Corner numbering: bit 0=X, bit 1=Y, bit 2=Z
const CUBE_CX = [0, 1, 1, 0, 0, 1, 1, 0];
const CUBE_CY = [0, 0, 1, 1, 0, 0, 1, 1];
const CUBE_CZ = [0, 0, 0, 0, 1, 1, 1, 1];
const CUBE_EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 0], // bottom face edges
  [4, 5], [5, 6], [6, 7], [7, 4], // top face edges
  [0, 4], [1, 5], [2, 6], [3, 7], // vertical edges
];

/**
 * Extract isosurface from SDF using fan-triangulation.
 * For each grid cell with a sign change, the crossing points on each edge
 * are projected onto the local tangent plane, sorted by angle, then fanned
 * from the centroid. Produces correct normals via SDF gradient.
 */
function extractIsosurface(
  sdf: (x: number, y: number, z: number) => number,
  bounds: number,
  resolution: number,
  onProgress?: (pct: number) => void,
): { positions: Float32Array; normals: Float32Array; indices: Uint32Array } {
  const N = resolution;
  const step = (bounds * 2) / N;
  const eps = step * 0.3;   // gradient finite-difference step

  // Evaluate SDF on a (N+1)^3 grid
  const gridSize = (N + 1) * (N + 1) * (N + 1);
  const grid = new Float32Array(gridSize);
  const gidx = (ix: number, iy: number, iz: number) =>
    ix + (N + 1) * (iy + (N + 1) * iz);

  for (let iz = 0; iz <= N; iz++) {
    for (let iy = 0; iy <= N; iy++) {
      for (let ix = 0; ix <= N; ix++) {
        grid[gidx(ix, iy, iz)] = sdf(
          -bounds + ix * step,
          -bounds + iy * step,
          -bounds + iz * step,
        );
      }
    }
    if (onProgress && iz % 4 === 0) onProgress(20 + (iz / N) * 35);
  }

  const positions: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];

  for (let iz = 0; iz < N; iz++) {
    for (let iy = 0; iy < N; iy++) {
      for (let ix = 0; ix < N; ix++) {
        const bx = -bounds + ix * step;
        const by = -bounds + iy * step;
        const bz = -bounds + iz * step;

        // Evaluate 8 corners
        const v = [
          grid[gidx(ix, iy, iz)],     grid[gidx(ix+1, iy, iz)],
          grid[gidx(ix+1, iy+1, iz)], grid[gidx(ix, iy+1, iz)],
          grid[gidx(ix, iy, iz+1)],   grid[gidx(ix+1, iy, iz+1)],
          grid[gidx(ix+1, iy+1, iz+1)], grid[gidx(ix, iy+1, iz+1)],
        ];

        // Quick reject: no sign change
        const minV = Math.min(...v), maxV = Math.max(...v);
        if (minV >= 0 || maxV <= 0) continue;

        // Find edge crossings
        const crossings: [number, number, number][] = [];
        for (const [v0, v1] of CUBE_EDGES) {
          if ((v[v0] < 0) === (v[v1] < 0)) continue;
          const t = v[v0] / (v[v0] - v[v1]);
          crossings.push([
            bx + (CUBE_CX[v0] + (CUBE_CX[v1] - CUBE_CX[v0]) * t) * step,
            by + (CUBE_CY[v0] + (CUBE_CY[v1] - CUBE_CY[v0]) * t) * step,
            bz + (CUBE_CZ[v0] + (CUBE_CZ[v1] - CUBE_CZ[v0]) * t) * step,
          ]);
        }
        if (crossings.length < 3) continue;

        // Centroid of crossings
        const mx = crossings.reduce((s, p) => s + p[0], 0) / crossings.length;
        const my = crossings.reduce((s, p) => s + p[1], 0) / crossings.length;
        const mz = crossings.reduce((s, p) => s + p[2], 0) / crossings.length;

        // Surface normal via SDF gradient at centroid
        const ngx = sdf(mx + eps, my, mz) - sdf(mx - eps, my, mz);
        const ngy = sdf(mx, my + eps, mz) - sdf(mx, my - eps, mz);
        const ngz = sdf(mx, my, mz + eps) - sdf(mx, my, mz - eps);
        const nlen = Math.sqrt(ngx * ngx + ngy * ngy + ngz * ngz);
        const nx = nlen > 0 ? ngx / nlen : 0;
        const ny = nlen > 0 ? ngy / nlen : 1;
        const nz_ = nlen > 0 ? ngz / nlen : 0;

        // Project crossings onto tangent plane for angular sorting
        const [rx, ry, rz] = perpendicular(nx, ny, nz_);
        const [ux, uy, uz] = cross(nx, ny, nz_, rx, ry, rz);

        // Sort crossings by angle on tangent plane
        const withAngle = crossings.map(([px, py, pz]) => {
          const dx = px - mx, dy = py - my, dz = pz - mz;
          const pr = dx * rx + dy * ry + dz * rz;
          const pu = dx * ux + dy * uy + dz * uz;
          return { p: [px, py, pz] as [number, number, number], angle: Math.atan2(pu, pr) };
        });
        withAngle.sort((a, b) => a.angle - b.angle);
        const sorted = withAngle.map(w => w.p);

        // Determine winding from normal direction (inside is negative SDF)
        // The surface normal points outward (away from negative region)
        // Fan triangulation: centroid + each adjacent pair of sorted crossings
        const base = positions.length / 3;

        // Emit centroid vertex
        positions.push(mx, my, mz);
        normals.push(nx, ny, nz_);

        // Emit crossing vertices
        for (const [px, py, pz] of sorted) {
          positions.push(px, py, pz);
          // Interpolate normal at each crossing too
          const cngx = sdf(px + eps, py, pz) - sdf(px - eps, py, pz);
          const cngy = sdf(px, py + eps, pz) - sdf(px, py - eps, pz);
          const cngz = sdf(px, py, pz + eps) - sdf(px, py, pz - eps);
          const cnl = Math.sqrt(cngx*cngx + cngy*cngy + cngz*cngz);
          normals.push(cnl > 0 ? cngx/cnl : nx, cnl > 0 ? cngy/cnl : ny, cnl > 0 ? cngz/cnl : nz_);
        }

        // Fan triangles: centroid + i + i+1 (for i in 1..n-1), closing the loop
        const n = sorted.length;
        for (let i = 0; i < n; i++) {
          const i0 = base;                     // centroid
          const i1 = base + 1 + i;             // current crossing
          const i2 = base + 1 + ((i + 1) % n); // next crossing
          indices.push(i0, i1, i2);
        }
      }
    }
    if (onProgress && iz % 4 === 0) onProgress(55 + (iz / N) * 30);
  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    indices: new Uint32Array(indices),
  };
}

// ──────────────────────────────────────────────────────────────────────────────
//  FRACTAL WEAVE SDF — JS port of weaveDE() in IFSCanvas.tsx FS_WEAVE shader
// ──────────────────────────────────────────────────────────────────────────────

type V3 = [number, number, number];

function v3abs(p: V3): V3 { return [Math.abs(p[0]), Math.abs(p[1]), Math.abs(p[2])]; }
function v3scale(p: V3, s: number): V3 { return [p[0]*s, p[1]*s, p[2]*s]; }
function v3norm(p: V3): V3 {
  const l = Math.sqrt(p[0]**2 + p[1]**2 + p[2]**2);
  return l > 0 ? [p[0]/l, p[1]/l, p[2]/l] : [0, 1, 0];
}
function v3cross(a: V3, b: V3): V3 {
  return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
}
function v3dot(a: V3, b: V3): number { return a[0]*b[0] + a[1]*b[1] + a[2]*b[2]; }
function sortDesc(p: V3): V3 {
  let [x, y, z] = p;
  if (x < y) { const t=x; x=y; y=t; }
  if (x < z) { const t=x; x=z; z=t; }
  if (y < z) { const t=y; y=z; z=t; }
  return [x, y, z];
}

// ── 6 weave fold functions ────────────────────────────────────────────────────
function wPlainFold(p: V3, wp: number, wf: number): V3 {
  let [x, y, z] = v3abs(p);
  const tx = wp / (wp + wf);
  if (x < tx) { const t=x; x=y; y=t; }
  if (x < z)  { const t=x; x=z; z=t; }
  if (y < z)  { const t=y; y=z; z=t; }
  return [x, y, z];
}
function wTwillFold(p: V3, fl: number, tw: number): V3 {
  const [xi, yi, zi] = v3abs(p);
  const ang = fl * Math.PI / 8 + tw * 2 * Math.PI;
  const ca = Math.cos(ang), sa = Math.sin(ang);
  return sortDesc([Math.abs(xi*ca - yi*sa), Math.abs(xi*sa + yi*ca), zi]);
}
function wSateenFold(p: V3, fl: number, tr: number): V3 {
  let x = Math.max(-1, Math.min(1, p[0]))*2 - p[0];
  let y = Math.max(-1, Math.min(1, p[1]))*2 - p[1];
  let z = Math.max(-1, Math.min(1, p[2]))*2 - p[2];
  const r2 = Math.max(x*x + y*y + z*z, 1e-4);
  const fR = tr * fl, fixR = fR * 1.5;
  if (r2 < fR*fR) { const s=(fixR*fixR)/(fR*fR); x*=s; y*=s; z*=s; }
  else if (r2 < fixR*fixR) { const s=(fixR*fixR)/r2; x*=s; y*=s; z*=s; }
  x = Math.abs(x); y = Math.abs(y); z = Math.abs(z);
  if (x < y) { const t=x; x=y; y=t; }
  if (x < z) { const t=x; x=z; z=t; }
  return [x, y, z];
}
function wHoneycombFold(p: V3): V3 {
  let x = Math.abs(p[0]), y = Math.abs(p[1]), z = Math.abs(p[2]);
  let hx = x, hy = y;
  const s3 = Math.sqrt(3);
  const s = hx + hy * s3;
  if (s > 2) { hx -= (s-2); hy -= (s-2)*s3; }
  if (hx*2 < hy*s3 - 1) { const t=hx; hx=0.5*(hx+hy*s3); hy=0.5*(hy-t*s3/3); }
  hx = Math.abs(hx); hy = Math.abs(hy);
  if (hx < hy) { const t=hx; hx=hy; hy=t; }
  if (hx < z)  { const t=hx; hx=z; z=t; }
  return [hx, hy, z];
}
function wLenoFold(p: V3, tw: number): V3 {
  const ang = tw * Math.PI * 0.5;
  const ca = Math.cos(ang), sa = Math.sin(ang);
  let x = p[0]*ca + p[2]*sa, y = p[1], z = -p[0]*sa + p[2]*ca;
  if (x+y < 0) { const t=x; x=-y; y=-t; }
  if (x+z < 0) { const t=x; x=-z; z=-t; }
  if (y+z < 0) { const t=y; y=-z; z=-t; }
  if (x-y < 0) { const t=x; x=y; y=t; }
  return [Math.abs(x), Math.abs(y), Math.abs(z)];
}
function wJacquardFold(p: V3, fl: number): V3 {
  const PH = 1.61803398875;
  const n1 = v3norm([1,PH,0]), n2 = v3norm([PH,0,1]), n3 = v3norm([0,1,PH]);
  let q = v3abs(p);
  for (const n of [n1, n2, n3]) {
    const d = v3dot(q, n);
    if (d < 0) q = [q[0]-2*d*n[0], q[1]-2*d*n[1], q[2]-2*d*n[2]] as V3;
    q = v3abs(q);
  }
  const sc2 = 1 + (fl - 1) * (PH - 1) / 7;
  return sortDesc(v3scale(q, sc2));
}
function applyWeaveFold(p: V3, wt: number, wp: number, wf: number, tr: number, fl: number, tw: number): V3 {
  if (wt === 0) return wPlainFold(p, wp, wf);
  if (wt === 1) return wTwillFold(p, fl, tw);
  if (wt === 2) return wSateenFold(p, fl, tr);
  if (wt === 3) return wHoneycombFold(p);
  if (wt === 4) return wLenoFold(p, tw);
  return wJacquardFold(p, fl);
}

/** Fractal Weave signed distance estimate — JS port of weaveDE() */
function weaveSDF(
  px: number, py: number, pz: number,
  wt: number, wp: number, wf: number, tr: number,
  fl: number, tw: number, dpt: number, sr: number, bl: number,
): number {
  let p: V3 = [px, py, pz];
  const sc = sr;
  const ox = wp / (wp + wf);
  const oy = wf / (wp + wf);

  // Weave fold pretransform (2 iterations, matching GLSL)
  for (let i = 0; i < 2; i++) {
    p = applyWeaveFold(p, wt, wp, wf, tr, fl, tw);
    p = v3scale(p, sc);
  }

  // Blend with original
  const qx = p[0] + (px - p[0]) * bl;
  const qy = p[1] + (py - p[1]) * bl;
  const qz = p[2] + (pz - p[2]) * bl;

  let mx = qx, my = qy, mz = qz, ms = 1;
  for (let i = 0; i < dpt; i++) {
    [mx, my, mz] = sortDesc([Math.abs(mx), Math.abs(my), Math.abs(mz)]);
    mx = sc*mx - ox*(sc-1);
    my = sc*my - oy*(sc-1);
    mz = sc*mz - ox*(sc-1);
    ms *= sc;
  }

  const warpD = (Math.sqrt(mx*mx + my*my) - tr) / ms;
  const weftD = (Math.sqrt(mx*mx + mz*mz) - tr) / ms;
  const fillD = (Math.sqrt(my*my + mz*mz) - tr) / ms;
  let d = wt === 3 ? Math.min(warpD, weftD) : Math.min(warpD, Math.min(weftD, fillD));

  const bx = Math.abs(px)-3, by = Math.abs(py)-3, bz = Math.abs(pz)-3;
  const boxD = (Math.sqrt(Math.max(bx,0)**2 + Math.max(by,0)**2 + Math.max(bz,0)**2) +
    Math.min(Math.max(bx, Math.max(by, bz)), 0)) * 0.12;
  return Math.max(d, boxD);
}

// ──────────────────────────────────────────────────────────────────────────────
//  L-SYSTEM + IFS SDF — JS port of sceneDE() in IFSCanvas.tsx FS_LSYSTEM shader
// ──────────────────────────────────────────────────────────────────────────────

/** Capsule SDF: min distance from point p to segment a→b minus radius r */
function sdCapsule(
  px: number, py: number, pz: number,
  ax: number, ay: number, az: number,
  bx: number, by: number, bz: number,
  r: number,
): number {
  const abx=bx-ax, aby=by-ay, abz=bz-az;
  const apx=px-ax, apy=py-ay, apz=pz-az;
  const ab2 = abx*abx + aby*aby + abz*abz;
  const t = ab2 > 0 ? Math.max(0, Math.min(1, (apx*abx+apy*aby+apz*abz)/ab2)) : 0;
  const dx=apx-t*abx, dy=apy-t*aby, dz=apz-t*abz;
  return Math.sqrt(dx*dx + dy*dy + dz*dz) - r;
}

/** IFS background SDF used inside the L-System and RD shaders */
function lsIFSBackgroundSDF(
  px: number, py: number, pz: number,
  ft: number, mi: number, sc: number, ox: number, fsc: number, bl: number,
): number {
  let p: V3 = [px, py, pz];
  // Fold pretransform (simplified port matching the L-System shader's ifsDE)
  const ifsBlend = 0; // internal IFS blend is fixed to 0 in the L-System shader
  if (ft === 1) {
    for (let i = 0; i < 2; i++) {
      p = [Math.max(-1,Math.min(1,p[0]))*2-p[0], Math.max(-1,Math.min(1,p[1]))*2-p[1], Math.max(-1,Math.min(1,p[2]))*2-p[2]];
      const r2 = Math.max(p[0]**2+p[1]**2+p[2]**2, 1e-4);
      if (r2 < 0.25) { const s=1/0.25; p=v3scale(p,s); } else if (r2 < 1) p=v3scale(p, 1/r2);
      p = v3scale(p, fsc);
    }
  } else if (ft === 4) {
    let [x,y,z] = p;
    if (x+y<0){const t=x;x=-y;y=-t;} if(x+z<0){const t=x;x=-z;z=-t;} if(y+z<0){const t=y;y=-z;z=-t;} if(x-y<0){const t=x;x=y;y=t;}
    p=[Math.abs(x)*fsc-0.8, Math.abs(y)*fsc-0.8, Math.abs(z)*fsc-0.8];
  } else if (ft === 5) {
    // icosa fold simplified (same as icosaFold above)
    const inv=0.52573111882, PH2=1.61803398875;
    for (let k=0;k<3;k++){
      p=v3abs(p);
      let t=(p[0]*PH2+p[1])*inv; if(t>0){p=[p[0]-2*t*PH2*inv, p[1]-2*t*inv, p[2]];}
      t=(p[1]*PH2+p[2])*inv; if(t>0){p=[p[0], p[1]-2*t*PH2*inv, p[2]-2*t*inv];}
      t=(p[2]*PH2+p[0])*inv; if(t>0){p=[p[0]-2*t*inv, p[1], p[2]-2*t*PH2*inv];}
    }
    p=[Math.abs(p[0])*fsc-0.618, Math.abs(p[1])*fsc-0.618, Math.abs(p[2])*fsc-0.618];
  }

  let [mx, my, mz] = p, ms = 1;
  for (let i = 0; i < mi; i++) {
    [mx, my, mz] = sortDesc([Math.abs(mx), Math.abs(my), Math.abs(mz)]);
    mx = sc*mx - ox*(sc-1);
    my = sc*my - ox*(sc-1);
    mz = sc*mz - ox*(sc-1);
    ms *= sc;
  }
  const cyl = Math.min(Math.sqrt(mx*mx+my*my), Math.min(Math.sqrt(mx*mx+mz*mz), Math.sqrt(my*my+mz*mz)));
  const d = (cyl - 1) / ms;
  const gr = Math.max(fsc, 2);
  const bx=Math.abs(px)-gr, by=Math.abs(py)-gr, bz=Math.abs(pz)-gr;
  const boxD = (Math.sqrt(Math.max(bx,0)**2+Math.max(by,0)**2+Math.max(bz,0)**2) +
    Math.min(Math.max(bx,Math.max(by,bz)),0)) * 0.12;
  return Math.max(d, boxD);
}

/** L-System tree SDF — JS port of lsystemDE() in FS_LSYSTEM */
function lsystemTreeSDF(
  px: number, py: number, pz: number,
  ls: number, depth: number, r0: number, ang: number, grow: number, lt: number,
): number {
  const cos = Math.cos, sin = Math.sin;
  const PH = 1.61803398875;
  const norm = (x: number, y: number, z: number): V3 => v3norm([x, y, z]);
  const cap = (x: number, y: number, z: number, ax: number, ay: number, az: number, bx: number, by: number, bz: number, r: number) =>
    sdCapsule(x, y, z, ax, ay, az, bx, by, bz, r);

  let d = 1e10;
  const len0 = r0 * 16 * grow;
  // Trunk: from (0,-1,0) to (0,-1+len0,0)
  const e0: V3 = [0, -1 + len0, 0];
  d = Math.min(d, cap(px, py, pz, 0,-1,0, e0[0],e0[1],e0[2], r0));

  const r1 = r0 * 0.794, len1 = r1 * 16 * grow;
  let d1a: V3, d1b: V3;

  if (ls === 0) { // VASCULAR
    d1a = norm(sin(ang), cos(ang), 0);
    d1b = norm(-sin(ang), cos(ang), 0);
    d1a = norm(d1a[0], d1a[1]-lt*0.3, d1a[2]);
    d1b = norm(d1b[0], d1b[1]-lt*0.3, d1b[2]);
  } else if (ls === 1) { // NEURAL
    const pa = ang * PH;
    d1a = norm(sin(ang), cos(ang), 0);
    d1b = norm(-sin(pa), cos(pa), sin(pa)*0.4);
    d1a = norm(d1a[0], d1a[1]-lt*0.15, d1a[2]);
    d1b = norm(d1b[0], d1b[1]-lt*0.1, d1b[2]);
  } else if (ls === 2) { // MYCELIUM: ternary
    const a120 = 2*Math.PI/3;
    d1a = norm(sin(ang), cos(ang), 0);
    d1b = norm(cos(a120)*sin(ang), cos(ang), sin(a120)*sin(ang));
    const d1c = norm(cos(2*a120)*sin(ang), cos(ang), sin(2*a120)*sin(ang));
    const e1c: V3 = [e0[0]+d1c[0]*len1, e0[1]+d1c[1]*len1, e0[2]+d1c[2]*len1];
    d = Math.min(d, cap(px,py,pz, e0[0],e0[1],e0[2], e1c[0],e1c[1],e1c[2], r1));
    const ac = norm(-d1c[0]+0.3, 0, -d1c[2]+0.3);
    d = Math.min(d, cap(px,py,pz, e1c[0],e1c[1],e1c[2], e1c[0]+ac[0]*r1*6, e1c[1]+ac[1]*r1*6, e1c[2]+ac[2]*r1*6, r1*0.35));
  } else { // CRYSTAL
    d1a = [1, 0, 0];
    d1b = [0, 0, 1];
    const d1c = norm(1, 0.5, 1), d1dd = norm(-1, 0.5, 1);
    d = Math.min(d, cap(px,py,pz, e0[0],e0[1],e0[2], e0[0]+d1c[0]*len1, e0[1]+d1c[1]*len1, e0[2]+d1c[2]*len1, r1));
    d = Math.min(d, cap(px,py,pz, e0[0],e0[1],e0[2], e0[0]+d1dd[0]*len1, e0[1]+d1dd[1]*len1, e0[2]+d1dd[2]*len1, r1));
  }

  const e1a: V3 = [e0[0]+d1a[0]*len1, e0[1]+d1a[1]*len1, e0[2]+d1a[2]*len1];
  const e1b: V3 = [e0[0]+d1b[0]*len1, e0[1]+d1b[1]*len1, e0[2]+d1b[2]*len1];
  d = Math.min(d, cap(px,py,pz, e0[0],e0[1],e0[2], e1a[0],e1a[1],e1a[2], r1));
  d = Math.min(d, cap(px,py,pz, e0[0],e0[1],e0[2], e1b[0],e1b[1],e1b[2], r1));

  if (depth >= 2) {
    const r2 = r1 * 0.794, len2 = r2 * 16 * grow;
    const xref: V3 = [0.01, 1, 0.01];
    const p2a = v3norm(v3cross(d1a, xref));
    const p2b = v3norm(v3cross(d1b, xref));
    let d2aa = norm(d1a[0]*cos(ang)+p2a[0]*sin(ang), d1a[1]*cos(ang)+p2a[1]*sin(ang), d1a[2]*cos(ang)+p2a[2]*sin(ang));
    let d2ab = norm(d1a[0]*cos(ang)-p2a[0]*sin(ang), d1a[1]*cos(ang)-p2a[1]*sin(ang), d1a[2]*cos(ang)-p2a[2]*sin(ang));
    let d2ba = norm(d1b[0]*cos(ang)+p2b[0]*sin(ang), d1b[1]*cos(ang)+p2b[1]*sin(ang), d1b[2]*cos(ang)+p2b[2]*sin(ang));
    let d2bb = norm(d1b[0]*cos(ang)-p2b[0]*sin(ang), d1b[1]*cos(ang)-p2b[1]*sin(ang), d1b[2]*cos(ang)-p2b[2]*sin(ang));
    if (ls === 0 || ls === 1) {
      const tr2 = lt * 0.12;
      d2aa = norm(d2aa[0], d2aa[1]-tr2, d2aa[2]);
      d2ab = norm(d2ab[0], d2ab[1]-tr2, d2ab[2]);
      d2ba = norm(d2ba[0], d2ba[1]-tr2, d2ba[2]);
      d2bb = norm(d2bb[0], d2bb[1]-tr2, d2bb[2]);
    }
    const e2aa: V3 = [e1a[0]+d2aa[0]*len2, e1a[1]+d2aa[1]*len2, e1a[2]+d2aa[2]*len2];
    const e2ab: V3 = [e1a[0]+d2ab[0]*len2, e1a[1]+d2ab[1]*len2, e1a[2]+d2ab[2]*len2];
    const e2ba: V3 = [e1b[0]+d2ba[0]*len2, e1b[1]+d2ba[1]*len2, e1b[2]+d2ba[2]*len2];
    const e2bb: V3 = [e1b[0]+d2bb[0]*len2, e1b[1]+d2bb[1]*len2, e1b[2]+d2bb[2]*len2];
    d = Math.min(d, cap(px,py,pz, e1a[0],e1a[1],e1a[2], e2aa[0],e2aa[1],e2aa[2], r2));
    d = Math.min(d, cap(px,py,pz, e1a[0],e1a[1],e1a[2], e2ab[0],e2ab[1],e2ab[2], r2));
    d = Math.min(d, cap(px,py,pz, e1b[0],e1b[1],e1b[2], e2ba[0],e2ba[1],e2ba[2], r2));
    d = Math.min(d, cap(px,py,pz, e1b[0],e1b[1],e1b[2], e2bb[0],e2bb[1],e2bb[2], r2));
    if (depth >= 3) {
      const r3 = r2 * 0.794, len3 = r3 * 16 * grow;
      for (const [dd, ee] of [[d2aa,e2aa],[d2ab,e2ab],[d2ba,e2ba],[d2bb,e2bb]] as [V3,V3][]) {
        const pp = v3norm(v3cross(dd, xref));
        const dA = norm(dd[0]*cos(ang)+pp[0]*sin(ang), dd[1]*cos(ang)+pp[1]*sin(ang), dd[2]*cos(ang)+pp[2]*sin(ang));
        const dB = norm(dd[0]*cos(ang)-pp[0]*sin(ang), dd[1]*cos(ang)-pp[1]*sin(ang), dd[2]*cos(ang)-pp[2]*sin(ang));
        d = Math.min(d, cap(px,py,pz, ee[0],ee[1],ee[2], ee[0]+dA[0]*len3, ee[1]+dA[1]*len3, ee[2]+dA[2]*len3, r3));
        d = Math.min(d, cap(px,py,pz, ee[0],ee[1],ee[2], ee[0]+dB[0]*len3, ee[1]+dB[1]*len3, ee[2]+dB[2]*len3, r3));
      }
    }
  }
  return d;
}

/** Combined L-System + IFS SDF (blended via smooth-min, matching sceneDE) */
function lsystemSceneSDF(
  px: number, py: number, pz: number,
  ls: number, depth: number, r0: number, ang: number, grow: number, lt: number,
  lbl: number,
  ft: number, mi: number, sc: number, ox: number, fsc: number,
): number {
  const ifsD = lsIFSBackgroundSDF(px, py, pz, ft, mi, sc, ox, fsc, 0);
  const treeD = lsystemTreeSDF(px, py, pz, ls, depth, r0, ang, grow, lt);
  if (lbl < 0.05) return ifsD;
  if (lbl > 0.95) return treeD;
  const k = 0.15 * (1 - lbl) * lbl * 4;
  const h = Math.max(k - Math.abs(ifsD - treeD), 0) / k;
  return Math.min(ifsD, treeD) - h*h*k/4;
}

// ── Build Three.js geometry from extracted mesh ───────────────────────────────
function buildThreeGeometry(
  positions: Float32Array,
  normals: Float32Array,
  indices: Uint32Array,
): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  geo.setIndex(new THREE.BufferAttribute(indices, 1));
  return geo;
}

// ── Real mesh export ──────────────────────────────────────────────────────────
export async function exportIFSMeshGLB(
  shapeType: string,
  params: IFSParams,
  resolution = 36,
  onProgress?: ExportProgress,
): Promise<void> {
  const isMandelbulb = params.mode === 1 ||
    shapeType === 'mandelbulb_raymarched';

  onProgress?.('Evaluating SDF…', 5);

  // Choose the SDF function based on shape type
  let sdf: (x: number, y: number, z: number) => number;
  let bounds: number;
  let meshName: string;

  const isPlatonic = [5, 6, 7].includes(params.ft ?? 0);
  const foldLabel: Record<number,string> = { 5: 'icosahedral', 6: 'octahedral', 7: 'dodecahedral' };

  if (isMandelbulb) {
    const power = params.pow ?? 8;
    const bail = params.bail ?? 2.0;
    const mbIter = params.mbIter ?? 7;
    sdf = (x, y, z) => mandelbulbSDF(x, y, z, power, mbIter, bail);
    bounds = 1.35;
    meshName = `mandelbulb_p${power}`;

  } else if (shapeType === 'fractal_weave') {
    // Fractal Weave — 6 textile fold types drive a thread-cylinder IFS
    const wt  = params.ft;                                   // weave type 0-5
    const wp  = Math.max(1, params.ox * 6);                  // warp count
    const wf  = Math.max(1, params.oy * 6);                  // weft count
    const tr  = params.mr;                                    // thread radius
    const fl  = Math.max(1, params.fs);                      // float length
    const tw  = Math.max(0, (params.fsc - 1) / 3);           // twist
    const dpt = Math.min(params.mi, 4);                      // weave depth (capped)
    const sr  = params.sc;                                    // scale ratio
    const bl  = params.bl;
    sdf = (x, y, z) => weaveSDF(x, y, z, wt, wp, wf, tr, fl, tw, dpt, sr, bl);
    bounds = 3.2;
    meshName = `weave_wt${wt}`;

  } else if (shapeType === 'lsystem_ifs') {
    // L-System branching tree blended with IFS background
    const ls   = params.ls;
    const dep  = Math.min(3, params.mi);                     // tree depth max 3
    const r0   = Math.max(0.02, params.mr);
    const ang  = params.fs * 0.6;                            // branch angle (radians)
    const grow = Math.min(1.1, params.lg);
    const lt2  = params.lt;
    const lbl  = params.bl;                                  // IFS/lsystem blend
    const ft   = params.ft; const fsc = params.fsc;
    const mi   = Math.min(params.mi, 4); const sc2 = params.sc; const ox = params.ox;
    sdf = (x, y, z) => lsystemSceneSDF(x, y, z, ls, dep, r0, ang, grow, lt2, lbl, ft, mi, sc2, ox, fsc);
    // Bounds: trunk is ~r0*16*grow tall, starting at y=-1
    bounds = Math.max(r0 * 16 * grow * Math.max(dep, 1) * 1.4, 2.5);
    meshName = `lsystem_ls${ls}_d${dep}`;

  } else if (shapeType === 'reaction_diffusion_ifs') {
    // RD IFS — use the seeding IFS surface (RD field is GPU-only)
    // The visible shape is the IFS attractor seeded from the orbit trap
    const ft2  = params.ft; const fsc2 = params.fsc;
    const mi2  = Math.min(params.mi, 4); const sc3 = params.sc; const ox2 = params.ox;
    const bl2  = params.bl;
    sdf = (x, y, z) => lsIFSBackgroundSDF(x, y, z, ft2, mi2, sc3, ox2, fsc2, bl2);
    bounds = Math.max(fsc2 * 1.5, 2.0);
    meshName = `rd_ifs_ft${ft2}`;

  } else if (isPlatonic) {
    // Platonic IFS (icosahedral/octahedral/dodecahedral) — proper fold SDF
    const ft  = params.ft  ?? 5;
    const fi  = Math.min(params.fi  ?? 2, 4);
    const fs  = params.fs  ?? 1.0;
    const fsc = params.fsc ?? 1.5;
    const mi  = Math.min(params.mi  ?? 3, 3);
    const sc  = params.sc  ?? 3.0;
    const ox  = params.ox  ?? 1.0;
    const oy  = params.oy  ?? 1.0;
    const oz  = params.oz  ?? 1.0;
    const bl  = params.bl  ?? 0.0;
    sdf = (x, y, z) => platonicIFSSDF(x, y, z, ft, fi, fs, fsc, mi, sc, ox, oy, oz, bl);
    bounds = Math.max(fs * fsc * 1.5, 2.0);
    meshName = `${foldLabel[ft] ?? 'platonic'}_ifs_ft${ft}`;

  } else {
    // Full IFS SDF — handles ft 0 (Menger), 1 (Mandelbox), 2 (Kleinian),
    // 3 (Lattice), 4 (Tetrahedral). Exact JS port of ifsDE() in FS_STANDARD.
    const ft  = params.ft  ?? 0;
    const fi  = Math.min(params.fi  ?? 1, 4);
    const fs  = params.fs  ?? 1.0;
    const fsc = params.fsc ?? 2.0;
    const mr  = params.mr  ?? 0.5;
    const bl  = params.bl  ?? 0.0;
    const mi  = Math.min(params.mi  ?? 3, 4);
    const sc  = params.sc  ?? 3.0;
    const ox  = params.ox  ?? 1.0;
    const oy  = params.oy  ?? 1.0;
    const oz  = params.oz  ?? 1.0;
    sdf = (x, y, z) => fullIFSSDF(x, y, z, ft, fi, fs, fsc, mr, bl, mi, sc, ox, oy, oz);
    // Bounds: for Menger-only (ft=0) tight; for fold types use fold radius
    bounds = ft === 0 ? Math.max(ox * 1.3, 1.6) : Math.max(fs * fsc * 1.5, 2.0);
    const ftLabel: Record<number,string> = { 0:'menger', 1:'mandelbox', 2:'kleinian', 3:'lattice', 4:'tetrahedral' };
    meshName = `${ftLabel[ft] ?? 'ifs'}_ft${ft}_mi${mi}`;
  }

  onProgress?.('Sampling isosurface…', 15);

  // Run on a microtask to allow UI updates
  const { positions, normals, indices } = await new Promise<{
    positions: Float32Array; normals: Float32Array; indices: Uint32Array;
  }>((resolve) => {
    setTimeout(() => {
      const result = extractIsosurface(sdf, bounds, resolution, (pct) => {
        onProgress?.(`Extracting surface… ${pct.toFixed(0)}%`, pct);
      });
      resolve(result);
    }, 0);
  });

  if (indices.length === 0) {
    throw new Error('No surface found — try adjusting IFS parameters');
  }

  onProgress?.(`Building mesh (${(indices.length / 3).toLocaleString()} triangles)…`, 80);

  const geo = buildThreeGeometry(positions, normals, indices);

  // Iridescent teal material matching the IFS shader aesthetic
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x00e5cc),
    roughness: 0.25,
    metalness: 0.55,
    side: THREE.DoubleSide,
  });
  mat.name = 'ifs_material';

  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = meshName;
  const engineLabel = isMandelbulb
    ? 'Mandelbulb'
    : isPlatonic
      ? `${foldLabel[params.ft ?? 5] ?? 'Platonic'} IFS`
      : 'Menger IFS';

  mesh.userData = {
    source: 'UUON Δmension IFS Engine',
    shapeType,
    engine: engineLabel,
    exportMode: 'real-mesh',
    triangleCount: indices.length / 3,
    resolution,
    params: {
      ft: params.ft, mi: params.mi, sc: params.sc, ox: params.ox,
      oy: params.oy, oz: params.oz, mode: params.mode, pow: params.pow,
    },
  };

  const scene = new THREE.Scene();
  scene.name = 'ifs_mesh_scene';
  scene.add(mesh);

  // Add a directional light so the mesh looks good in GLTF viewers
  const light = new THREE.DirectionalLight(0xffffff, 1.5);
  light.position.set(2, 4, 3);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x404060, 0.6));

  onProgress?.('Encoding GLB…', 88);

  const exporter = new GLTFExporter();
  await new Promise<void>((resolve, reject) => {
    exporter.parse(
      scene,
      (result) => {
        onProgress?.('Downloading…', 96);
        const blob = new Blob([result as ArrayBuffer], { type: 'model/gltf-binary' });
        const ts = Date.now();
        downloadGLBBlob(blob, `ifs_${shapeType}_mesh_${ts}.glb`);
        resolve();
      },
      (err) => reject(err),
      { binary: true },
    );
  });

  onProgress?.('Done.', 100);
}

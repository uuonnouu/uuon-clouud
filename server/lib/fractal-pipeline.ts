/**
 * UUON Recursive Fractal Engine — CPU Pipeline
 * Phillip Aguilar Ruiz III / UUON Foundation Inc.
 * USAL-1.0
 *
 * CPU-side port of the WebGL2 GLSL iteration loop.
 * Every vec2 in GLSL is [re, im] here.
 * Matches the shader exactly — same generator indices, same coloring modes.
 */

// ── Complex math ─────────────────────────────────────────────────────────────

type C = [number, number]; // [re, im]

const cmul  = ([ax,ay]: C, [bx,by]: C): C => [ax*bx - ay*by, ax*by + ay*bx];
const cdiv  = ([ax,ay]: C, [bx,by]: C): C => { const d = bx*bx+by*by; return [(ax*bx+ay*by)/d, (ay*bx-ax*by)/d]; };
const cabs2 = ([x,y]: C): number => x*x + y*y;
const cabs  = (z: C): number => Math.sqrt(cabs2(z));
const carg  = ([x,y]: C): number => Math.atan2(y, x);
const cinv  = (z: C): C => cdiv([1,0], z);
const cexp  = ([x,y]: C): C => { const e = Math.exp(x); return [e*Math.cos(y), e*Math.sin(y)]; };
const clog  = (z: C): C => [Math.log(cabs(z)), carg(z)];
const cpow  = (z: C, p: number): C => { const r = Math.pow(cabs(z), p), a = p*carg(z); return [r*Math.cos(a), r*Math.sin(a)]; };
const cpowc = (z: C, w: C): C => cexp(cmul(w, clog(z)));
const csin  = ([x,y]: C): C => [Math.sin(x)*Math.cosh(y),  Math.cos(x)*Math.sinh(y)];
const ccos  = ([x,y]: C): C => [Math.cos(x)*Math.cosh(y), -Math.sin(x)*Math.sinh(y)];
const ctan  = (z: C): C => cdiv(csin(z), ccos(z));
const csinh = ([x,y]: C): C => [Math.sinh(x)*Math.cos(y), Math.cosh(x)*Math.sin(y)];
const ccosh = ([x,y]: C): C => [Math.cosh(x)*Math.cos(y), Math.sinh(x)*Math.sin(y)];
const csqrt = ([x,y]: C): C => { const r = cabs([x,y]); return [Math.sqrt((r+x)*0.5), Math.sign(y)*Math.sqrt((r-x)*0.5)]; };

const guard = (z: C, eps = 1e-5): C => cabs2(z) < 1e-9 ? [eps, 0] : z;
const isFiniteC = ([x,y]: C): boolean => isFinite(x) && isFinite(y);

// ── Generator step ────────────────────────────────────────────────────────────

function genStep(z: C, c: C, generator: number, power: number, escape: number): C {
  switch (generator) {
    case 0:  return [z[0]*z[0]-z[1]*z[1]+c[0], 2*z[0]*z[1]+c[1]]; // z²+c fast path
    case 1:  return [cmul(cmul(z,z),z)[0]+c[0], cmul(cmul(z,z),z)[1]+c[1]]; // z³+c
    case 2:  { const z2=cmul(z,z); const z4=cmul(z2,z2); return [z4[0]+c[0],z4[1]+c[1]]; }
    case 3:  { const p=cpow(z,power); return [p[0]+c[0],p[1]+c[1]]; }
    case 4:  { const e=cexp(z); return [e[0]+c[0],e[1]+c[1]]; }
    case 5:  { const s=csin(z); return [s[0]+c[0],s[1]+c[1]]; }
    case 6:  { const co=ccos(z); return [co[0]+c[0],co[1]+c[1]]; }
    case 7:  { const t=ctan(z); return [t[0]+c[0],t[1]+c[1]]; }
    case 8:  { const sh=csinh(z); return [sh[0]+c[0],sh[1]+c[1]]; }
    case 9:  { const ch=ccosh(z); return [ch[0]+c[0],ch[1]+c[1]]; }
    case 10: { const zg: C = [z[0]+1e-6, z[1]]; const lg=clog(zg); return [lg[0]+c[0],lg[1]+c[1]]; }
    case 11: { // Newton z³−1
      const z2=cmul(z,z); const z3=cmul(z2,z);
      const denom: C = [3*z2[0]+1e-8, 3*z2[1]];
      const step=cdiv([z3[0]-1,z3[1]], denom);
      return [z[0]-step[0], z[1]-step[1]];
    }
    case 12: { // Nova
      const z2=cmul(z,z); const z3=cmul(z2,z);
      const denom: C = [3*z2[0]+1e-8, 3*z2[1]];
      const step=cdiv([z3[0]-1,z3[1]], denom);
      return [z[0]-step[0]+c[0], z[1]-step[1]+c[1]];
    }
    case 13: { const s=csin(z),co=ccos(z); return [s[0]+co[0]+c[0],s[1]+co[1]+c[1]]; }
    case 14: { // Quantum Wave — ψ·e^(i|ψ|²·p/2)+c  [UUON IP]
      const prob = cabs2(z);
      const phase = prob * power * 0.5;
      const rot: C = [Math.cos(phase), Math.sin(phase)];
      const psi = cmul(z, rot);
      return [psi[0]+c[0], psi[1]+c[1]];
    }
    case 15: { // Schrödinger Oscillator  [UUON IP]
      const prob  = cabs2(z);
      const R2    = escape * escape;
      const norm  = 1 - prob / Math.max(R2, 0.001);
      const phase = carg(z) * power;
      const rot: C = [Math.cos(phase), Math.sin(phase)];
      const psi = cmul(z, rot);
      return [psi[0]*norm+c[0], psi[1]*norm+c[1]];
    }
    default: return [z[0]*z[0]-z[1]*z[1]+c[0], 2*z[0]*z[1]+c[1]];
  }
}

// ── Pre-transform ─────────────────────────────────────────────────────────────

function safePre(z: C, pretransform: number, power: number, pa: number, pb: number, symk: number): C {
  if (pretransform === 0) return z;
  const zg = guard(z);
  switch (pretransform) {
    case 1:  return cinv(zg);
    case 2:  return cinv([zg[0]+pa, zg[1]+pb]);
    case 3:  { // Möbius
      const ab = [cmul([pa,pb],zg)[0]+pa*0.5, cmul([pa,pb],zg)[1]+pb*0.5] as C;
      const cd = [cmul([pb,-pa],zg)[0]+1, cmul([pb,-pa],zg)[1]] as C;
      return cabs2(cd) < 1e-10 ? zg : cdiv(ab, cd);
    }
    case 4:  return [Math.abs(z[0]), Math.abs(z[1])];
    case 5:  return [Math.abs(z[0]), z[1]];
    case 6:  return [z[0], Math.abs(z[1])];
    case 7:  return [Math.abs(z[0]), Math.abs(z[1])];
    case 8:  return csqrt(zg);
    case 9:  return clog(zg);
    case 10: return cexp(z);
    case 11: return csin(z);
    case 12: return ccos(z);
    case 13: return csin(cinv(zg));
    case 14: return cexp(cinv(zg));
    case 15: { const lg: C = [Math.max(-6,Math.min(6,clog(zg)[0])), Math.max(-6,Math.min(6,clog(zg)[1]))]; return csin(lg); }
    case 16: return cexp(csin(z));
    case 17: { const sz=csin(z); return clog(cabs2(sz)<1e-9?[1e-5,sz[1]]:sz); }
    case 18: return csin(cmul(z,z));
    case 19: { const r=Math.pow(Math.max(cabs(z),1e-6),power),a=carg(z); return [r*Math.cos(a),r*Math.sin(a)]; }
    case 20: { const r=Math.max(cabs(z),1e-6),a=carg(z)*symk; return [r*Math.cos(a),r*Math.sin(a)]; }
    case 21: { const r=Math.max(cabs(z),1e-6),a=carg(z)+Math.log(r); return [r*Math.cos(a),r*Math.sin(a)]; }
    default: return z;
  }
}

function preIsPerLoop(pretransform: number): boolean {
  return (pretransform>=4&&pretransform<=7)||(pretransform>=11&&pretransform<=21)||(pretransform===19||pretransform===20||pretransform===21);
}

// ── Symmetry fold ─────────────────────────────────────────────────────────────

function symFold(z: C, k: number, symRot: number): C {
  if (k <= 1) return z;
  const TAU = Math.PI * 2;
  const r   = cabs(z);
  let ang   = carg(z);
  ang += symRot * (Math.PI / 180);
  const sector = TAU / k;
  ang = ((ang % sector) + sector) % sector;
  if (ang > sector * 0.5) ang = sector - ang;
  ang -= symRot * (Math.PI / 180);
  return [r * Math.cos(ang), r * Math.sin(ang)];
}

// ── Core iterate ──────────────────────────────────────────────────────────────

export interface FractalParams {
  mode:          number;   // 0=Mandelbrot, 1=Julia
  generator:     number;   // 0–15
  pretransform:  number;   // 0–21
  posttransform: number;   // 0–10 (unused in field output, used in render)
  iter:          number;   // max iterations
  escape:        number;   // escape radius
  power:         number;
  pa:            number;
  pb:            number;
  symk:          number;
  sym_rot:       number;
  tessellation:  number;
  cx:            number;   // center re
  cy:            number;   // center im
  zoom:          number;
  julia_re:      number;
  julia_im:      number;
  coloring:      number;   // 0–19
  palette:       number;   // 0–10
  width:         number;
  height:        number;
  // visual
  cycles?:       number;
  col_offset?:   number;
  col_phase?:    number;
  contrast?:     number;
  smooth?:       number;   // 0|1
  invert?:       number;   // 0|1
  interior?:     number;   // 0|1
}

export interface IterResult {
  escapeI:    number;   // smooth escape count, or maxIter if interior
  escaped:    boolean;
  finalZ:     C;
  trapMin:    number;
  stripeSum:  number;
  qProbSum:   number;
  qPhaseSum:  number;
}

export function iterate(
  worldX: number,
  worldY: number,
  p: FractalParams
): IterResult {
  const PI  = Math.PI;
  const esc2 = p.escape * p.escape;
  const maxI = Math.min(p.iter, 512);
  const perloop = preIsPerLoop(p.pretransform);

  let z: C, c: C;
  if (p.mode === 0) {
    c = [worldX, worldY];
    z = [0, 0];
    if (!perloop) c = safePre(c, p.pretransform, p.power, p.pa, p.pb, p.symk);
  } else {
    z = [worldX, worldY];
    c = [p.julia_re, p.julia_im];
    if (!perloop) z = safePre(z, p.pretransform, p.power, p.pa, p.pb, p.symk);
  }

  // Tessellation
  if (p.tessellation > 0.001) {
    const grid = 8 + (64 - 8) * p.tessellation;
    const tess: C = [Math.sin(worldX * grid * PI) * 0.015 * p.tessellation,
                     Math.sin(worldY * grid * PI) * 0.015 * p.tessellation];
    if (p.mode === 0) c = [c[0]+tess[0], c[1]+tess[1]];
    else              z = [z[0]+tess[0], z[1]+tess[1]];
  }

  const doSym  = p.symk > 1.5;
  const doWarp = p.coloring !== 4 && (Math.abs(p.pa) > 0.001 || Math.abs(p.pb) > 0.001);
  const warpA  = p.pa * 0.10;
  const warpB  = p.pb * 0.10;

  const needTrap   = p.coloring >= 2 && p.coloring <= 4;
  const needStripe = p.coloring === 7;
  const needQProb  = p.coloring === 18;
  const needQPhase = p.coloring === 19;

  let trapMin   = 1e9;
  let stripeSum = 0;
  let qProbSum  = 0;
  let qPhaseSum = 0;
  let escaped   = false;
  let escapeI   = maxI;

  for (let i = 0; i < maxI; i++) {
    if (perloop) z = safePre(z, p.pretransform, p.power, p.pa, p.pb, p.symk);
    if (doSym)   z = symFold(z, p.symk, p.sym_rot);

    z = genStep(z, c, p.generator, p.power, p.escape);

    if (!isFiniteC(z) || cabs2(z) > 1e30) {
      z = [p.escape + 0.001, 0];
      escapeI = i;
      escaped = true;
      break;
    }

    if (doWarp) {
      const r      = cabs(z);
      const aScale = Math.log(r + 1) * 0.5;
      const bScale = i / Math.max(maxI, 1);
      let   nx     = warpA * aScale;
      let   ny     = warpB * bScale;
      const nd2    = nx*nx + ny*ny;
      const denom  = 1 + nd2 * 2;
      z = [z[0] + nx/denom, z[1] + ny/denom];
    }

    const r2 = cabs2(z);
    const r  = Math.sqrt(r2);

    if (needTrap) {
      if      (p.coloring === 2) trapMin = Math.min(trapMin, Math.abs(r - 0.5));
      else if (p.coloring === 3) trapMin = Math.min(trapMin, Math.min(Math.abs(z[0]), Math.abs(z[1])));
      else                       trapMin = Math.min(trapMin, Math.sqrt((z[0]-p.pa)**2 + (z[1]-p.pb)**2));
    }
    if (needStripe) stripeSum += 0.5 * Math.sin(p.symk * carg(z)) + 0.5;
    if (needQProb)  qProbSum  += r2;
    if (needQPhase) qPhaseSum += carg(z) * r2;

    if (r2 > esc2) {
      escapeI = i;
      if ((p.smooth ?? 1) === 1) {
        const lzn = Math.log(r2) * 0.5;
        const nu  = Math.log(lzn / Math.log(p.escape)) / Math.log(Math.max(p.power, 2));
        escapeI   = i + 1 - nu;
      }
      escaped = true;
      break;
    }
  }

  return { escapeI, escaped, finalZ: z, trapMin, stripeSum, qProbSum, qPhaseSum };
}

// ── Field generator (Float32Array of escape values) ──────────────────────────

export function generateField(p: FractalParams): Float32Array {
  const { width, height } = p;
  const field   = new Float32Array(width * height);
  const aspect  = width / height;
  const scale   = 3.0 / Math.pow(2, p.zoom);
  const cosR    = Math.cos(0); // rotation not exposed in API v1
  const sinR    = Math.sin(0);

  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      const ux = px / width;
      const uy = 1 - py / height;
      const fx = (ux - 0.5) * aspect;
      const fy = (uy - 0.5);
      const wx = fx * scale + p.cx;
      const wy = fy * scale + p.cy;

      const { escapeI, escaped } = iterate(wx, wy, p);
      field[py * width + px] = escaped ? escapeI / p.iter : 0;
    }
  }
  return field;
}

// ── Palette ───────────────────────────────────────────────────────────────────

function palFinish(r: number, g: number, b: number): [number,number,number] {
  const PEAK = 0.950, FLOOR = 0.05;
  r = Math.min(r, 1) * PEAK;
  g = Math.min(g, 1) * PEAK;
  b = Math.min(b, 1) * PEAK;
  const lum = 0.299*r + 0.587*g + 0.114*b;
  if (lum < FLOOR) { r = (r+FLOOR)*0.5; g = (g+FLOOR)*0.5; b = (b+FLOOR)*0.5; }
  return [r, g, b];
}

function smoothStep(a: number, b: number, t: number): number {
  const x = Math.max(0, Math.min(1, (t-a)/(b-a)));
  return x*x*(3-2*x);
}

function mixC(a: number, b: number, t: number): number { return a*(1-t)+b*t; }

export function palette(
  rawT: number,
  palIdx: number,
  cycles = 1,
  offset = 0,
  phase  = 0,
  contrast = 0.65,
  invert = 0
): [number, number, number] {
  const TAU = Math.PI * 2;
  let t = ((rawT * cycles + offset + phase) % 1 + 1) % 1;
  if (invert) t = 1 - t;
  t = Math.pow(Math.max(0.001, Math.min(0.999, t)), contrast);
  t = smoothStep(0, 1, t);
  const t2 = t*t;

  let r=0, g=0, b=0;

  switch (palIdx) {
    case 0: { // Stealth Neon
      const edge = Math.pow(Math.max(0,t-0.55)*2.22, 2.5);
      const cyan = Math.pow(Math.max(0,t-0.72)*3.5,  2.0);
      r = 0.02+t2*0.04+cyan*0.05; g = 0.03+t2*0.05+edge*0.82; b = 0.04+t2*0.06+cyan*0.90;
      const hot = Math.pow(Math.max(0,t-0.90)*10, 3)*0.30;
      r+=hot; g+=hot; b+=hot; break;
    }
    case 1: { // Electric Pulse
      const pulse = Math.pow(Math.sin(t*Math.PI), 3);
      const core  = Math.pow(Math.max(0,t-0.80)*5, 3);
      r = 0.02+pulse*0.05+core*0.60; g = 0.03+pulse*0.72+core*0.85; b = 0.04+pulse*0.88+core*0.95;
      r+=core*0.40; g+=core*0.40; b+=core*0.40; break;
    }
    case 2: { // Gilded Clock
      const sm1=smoothStep(0,0.5,t),sm2=smoothStep(0.4,0.8,t),sm3=smoothStep(0.82,1,t);
      r=mixC(mixC(0.08,0.52,sm1),mixC(0.52,0.90,sm2),sm2); r=mixC(r,0.95,sm3);
      g=mixC(mixC(0.06,0.34,sm1),mixC(0.34,0.72,sm2),sm2); g=mixC(g,0.90,sm3);
      b=mixC(mixC(0.04,0.10,sm1),mixC(0.10,0.18,sm2),sm2); b=mixC(b,0.70,sm3);
      const shim=Math.sin(t*42)*smoothStep(0.3,0.7,t)*0.5;
      r+=0.04*shim; g+=0.03*shim; break;
    }
    case 3: { // Obsidian Gold
      const veinAmt=Math.exp(-Math.pow((t-0.28)*7,2));
      const sm1=smoothStep(0.50,0.80,t),sm2=smoothStep(0.85,1,t);
      r=0.04+0.68*veinAmt*0.85; r=mixC(r,0.85,sm1); r=mixC(r,0.96,sm2);
      g=0.03+0.48*veinAmt*0.85; g=mixC(g,0.62,sm1); g=mixC(g,0.88,sm2);
      b=0.05+0.08*veinAmt*0.85; b=mixC(b,0.20,sm1); b=mixC(b,0.55,sm2); break;
    }
    case 4: { r=g=b=0.04+Math.pow(t,0.65)*0.88; break; } // Mono
    case 5: { // Digital Pastel
      const s1=smoothStep(0,0.35,t),s2=smoothStep(0.30,0.60,t),s3=smoothStep(0.55,0.80,t),s4=smoothStep(0.80,1,t);
      r=mixC(mixC(0.42,0.96,s1),mixC(0.96,0.80,s2),s2); r=mixC(r,mixC(r,0.70,s3),s3); r=mixC(r,0.97,s4);
      g=mixC(mixC(0.34,0.78,s1),mixC(0.78,0.72,s2),s2); g=mixC(g,mixC(g,0.92,s3),s3); g=mixC(g,0.95,s4);
      b=mixC(mixC(0.52,0.84,s1),mixC(0.84,0.94,s2),s2); b=mixC(b,mixC(b,0.84,s3),s3); b=mixC(b,0.90,s4); break;
    }
    case 6: { // Void Cyan
      const s1=smoothStep(0,0.18,t),s2=smoothStep(0.15,0.50,t),s3=smoothStep(0.45,0.80,t),s4=smoothStep(0.85,1,t);
      r=mixC(mixC(0.02,0.02,s1),mixC(0.02,0.10,s2),s2); r=mixC(r,0.20,s3); r=mixC(r,0.82,s4);
      g=mixC(mixC(0.02,0.02,s1),mixC(0.02,0.22,s2),s2); g=mixC(g,0.78,s3); g=mixC(g,0.96,s4);
      b=mixC(mixC(0.03,0.03,s1),mixC(0.03,0.28,s2),s2); b=mixC(b,0.88,s3); b=mixC(b,1.00,s4); break;
    }
    case 7: { // Copper Brown
      r=0.06+0.50*t; g=0.04+0.28*t; b=0.02+0.05*t;
      const m=Math.max(0,t-0.58)*2.2;
      r=mixC(r,0.93,m); g=mixC(g,0.84,m); b=mixC(b,0.65,m); break;
    }
    case 8: { // Quantum Field
      const fringe=0.5+0.5*Math.sin(t*Math.PI*8);
      const s1=smoothStep(0,0.40,t),s2=smoothStep(0.35,0.70,t),s3=smoothStep(0.72,1,t);
      r=mixC(mixC(0.01,0.05,s1),0.22,s2); r=mixC(r,0.88,s3); r+=fringe*smoothStep(0.15,0.65,t)*0;
      g=mixC(mixC(0.01,0.18,s1),0.68,s2); g=mixC(g,0.96,s3); g+=fringe*smoothStep(0.15,0.65,t)*0.04;
      b=mixC(mixC(0.04,0.72,s1),0.90,s2); b=mixC(b,1.00,s3); b+=fringe*smoothStep(0.15,0.65,t)*0.12; break;
    }
    case 9: { // Neon Magenta
      const edge=Math.pow(Math.max(0,t-0.52)*2.08,2.8),violet=Math.pow(Math.max(0,t-0.74)*3.8,2);
      r=0.03+t2*0.05+edge*0.92+violet*0.40; g=0.02+t2*0.03+edge*0.08; b=0.04+t2*0.04+violet*0.70;
      const hot=Math.pow(Math.max(0,t-0.91)*10,3);
      r+=hot*0.25; g+=hot*0.10; b+=hot*0.20; break;
    }
    default: { // Spectral — Quilez cosine palette
      r=0.5+0.5*Math.cos(TAU*(t+0.000));
      g=0.5+0.5*Math.cos(TAU*(t+0.333));
      b=0.5+0.5*Math.cos(TAU*(t+0.667)); break;
    }
  }
  return palFinish(r, g, b);
}

// ── Coloring ──────────────────────────────────────────────────────────────────

export function colorPixel(res: IterResult, p: FractalParams): [number,number,number] {
  const { escapeI, escaped, finalZ, trapMin, stripeSum, qProbSum, qPhaseSum } = res;
  const esc2 = p.escape * p.escape;
  const TAU  = Math.PI * 2;

  if (!escaped && (p.interior ?? 0) === 0) return [0.04, 0.04, 0.04];

  let t = 0;
  const col = p.coloring ?? 0;

  if      (col <= 1)              t = escapeI / p.iter;
  else if (col >= 2 && col <= 4)  t = Math.max(0, Math.min(1, trapMin));
  else if (col === 5)             t = carg(finalZ) / TAU + 0.5;
  else if (col === 6)             t = Math.max(0, Math.min(1, Math.log(cabs(finalZ)) / 10));
  else if (col === 7)             t = stripeSum / Math.max(escapeI, 1);
  else if (col === 9)             t = Math.pow(escapeI / p.iter, 0.3);

  if (!escaped && (p.interior ?? 0) === 1) {
    t = ((Math.log(cabs(finalZ)) * 0.5) % 1 + 1) % 1;
  }

  // Quantum coloring modes [UUON IP]
  if (col === 18) {
    const probNorm = qProbSum / Math.max(escapeI * esc2, 0.0001);
    const pp = Math.max(0, Math.min(1, probNorm));
    const fringe = 0.5 + 0.5 * Math.sin(pp * Math.PI * p.symk * 4);
    let r = pp*0.30+fringe*0.15, g = pp*0.55+fringe*0.20, b = pp*0.90+fringe*0.40;
    if (escaped) {
      const pal = palette(escapeI/p.iter, p.palette, p.cycles, p.col_offset, p.col_phase, p.contrast, p.invert);
      b = r*0.7 + pal[2]*0.85*0.3; g = g*0.7 + pal[2]*0.92*0.3; r = r*0.7 + pal[2]*0.85*0.3;
    }
    return palFinish(r, g, b);
  }

  if (col === 19) {
    const totalProb = Math.max(qProbSum, 0.0001);
    const avgPhase  = qPhaseSum / totalProb;
    const h = avgPhase / Math.PI * 0.5 + 0.5;
    const pal = palette(escapeI/p.iter, p.palette, p.cycles, p.col_offset, p.col_phase, p.contrast, p.invert);
    const val = escaped ? pal[0]*0.8+0.2 : 0.12;
    let r = val*(0.5+0.5*Math.cos(TAU*(h+0.000)));
    let g = val*(0.5+0.5*Math.cos(TAU*(h+0.333)));
    let b = val*(0.5+0.5*Math.cos(TAU*(h+0.667)));
    const node = Math.pow(Math.abs(Math.sin(avgPhase*p.symk)), 0.3);
    r*=mixC(0.15,1,node); g*=mixC(0.15,1,node); b*=mixC(0.15,1,node);
    return palFinish(r, g, b);
  }

  return palette(t, p.palette, p.cycles ?? 1, p.col_offset ?? 0, p.col_phase ?? 0, p.contrast ?? 0.65, p.invert ?? 0);
}

function mixC(a: number, b: number, t: number): number { return a*(1-t)+b*t; }

import fs from "fs";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { embedWatermark } from "./stego-watermark";

function hashStr(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

type Vec2 = { x: number; y: number };

function noise2D(x: number, y: number, seed: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed) * 43758.5453;
  return n - Math.floor(n);
}

function smoothNoise(x: number, y: number, seed: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const n00 = noise2D(ix, iy, seed);
  const n10 = noise2D(ix + 1, iy, seed);
  const n01 = noise2D(ix, iy + 1, seed);
  const n11 = noise2D(ix + 1, iy + 1, seed);
  return n00 * (1 - sx) * (1 - sy) + n10 * sx * (1 - sy) + n01 * (1 - sx) * sy + n11 * sx * sy;
}

function fbm(x: number, y: number, seed: number, octaves: number = 6): number {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  for (let i = 0; i < octaves; i++) {
    value += amplitude * smoothNoise(x * frequency, y * frequency, seed + i * 100);
    amplitude *= 0.5;
    frequency *= 2;
  }
  return value;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
}

function blendColor(c1: string, c2: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(c1);
  const [r2, g2, b2] = hexToRgb(c2);
  return rgbToHex(lerp(r1, r2, t), lerp(g1, g2, t), lerp(b1, b2, t));
}

function detectDomain(concept: string, prompt: string): string {
  const text = (concept + " " + prompt).toLowerCase();
  if (/galaxy|collision|cosmic|star|orbit|nebula|supernova|black hole|spacetime/.test(text)) return "galaxy";
  if (/tensor|field|curvature|riemann|metric|christoffel|manifold/.test(text)) return "tensor";
  if (/wave|quantum|interference|diffraction|frequency|oscillat|harmonic/.test(text)) return "wave";
  if (/fractal|mandelbrot|julia|sierpinski|iteration|recursive|self-similar/.test(text)) return "fractal";
  if (/molecule|atom|bond|protein|dna|cell|bio|organic|neural/.test(text)) return "molecular";
  if (/flow|fluid|stream|current|river|navier|reynolds|turbul/.test(text)) return "flow";
  if (/waste|reduc|efficien|entropy|energy|sustain|carbon|thermal|heat/.test(text)) return "entropy";
  if (/lattice|crystal|grid|symmetr|tessellat|pattern|sacred|geometry/.test(text)) return "lattice";
  if (/earth|tree|root|branch|grow|leaf|nature|ecosystem/.test(text)) return "growth";
  if (/geomorphology|terrain|landscape|topography|erosion|geological|mountain|valley|topo/.test(text)) return "geomorphology";
  if (/network|connect|graph|node|mesh|distributed|web/.test(text)) return "network";
  return "universal";
}

const PALETTES: Record<string, string[][]> = {
  galaxy: [["#6366f1","#0f0a2e","#a5b4fc","#818cf8","#312e81"], ["#f59e0b","#1a0800","#fcd34d","#fbbf24","#78350f"]],
  tensor: [["#ec4899","#1a0412","#f9a8d4","#f472b6","#831843"], ["#8b5cf6","#0f0525","#c4b5fd","#a78bfa","#4c1d95"]],
  wave: [["#06b6d4","#021b22","#67e8f9","#22d3ee","#164e63"], ["#3b82f6","#050e20","#93c5fd","#60a5fa","#1e3a8a"]],
  fractal: [["#10b981","#010f08","#6ee7b7","#34d399","#064e3b"], ["#8b5cf6","#0a0320","#ddd6fe","#a78bfa","#4c1d95"]],
  molecular: [["#22c55e","#011a07","#86efac","#4ade80","#14532d"], ["#06b6d4","#010d14","#67e8f9","#22d3ee","#083344"]],
  flow: [["#3b82f6","#030b1c","#93c5fd","#60a5fa","#1e3a8a"], ["#06b6d4","#011218","#a5f3fc","#22d3ee","#164e63"]],
  entropy: [["#f97316","#1a0800","#fdba74","#fb923c","#7c2d12"], ["#ef4444","#1a0505","#fca5a5","#f87171","#7f1d1d"]],
  lattice: [["#f0b93b","#1a0f00","#fde68a","#fbbf24","#78350f"], ["#4a8cd4","#050e1c","#93c5fd","#60a5fa","#1e3a5f"]],
  growth: [["#22c55e","#011a07","#bbf7d0","#4ade80","#14532d"], ["#84cc16","#0a1200","#d9f99d","#a3e635","#365314"]],
  geomorphology: [["#92400e","#0d0400","#d97706","#b45309","#451a03"], ["#065f46","#010d08","#10b981","#059669","#064e3b"]],
  network: [["#4a8cd4","#050e1c","#7ab8f5","#60a5fa","#1a3a5c"], ["#a855f7","#0d0320","#d8b4fe","#c084fc","#581c87"]],
  universal: [["#4a8cd4","#050e1c","#7ab8f5","#60a5fa","#1a3a5c"], ["#f0b93b","#1a0f00","#ffd970","#fbbf24","#8b6914"]],
};

function renderDefs(w: number, h: number, primary: string, dark: string, light: string, accent: string): string {
  return `
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="75%">
      <stop offset="0%" stop-color="${dark}"/>
      <stop offset="60%" stop-color="${blendColor(dark, '#000000', 0.5)}"/>
      <stop offset="100%" stop-color="#010204"/>
    </radialGradient>
    <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${primary}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${primary}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="50%" cy="40%" r="40%">
      <stop offset="0%" stop-color="${light}" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="${light}" stop-opacity="0"/>
    </radialGradient>
    <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="heavyGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="20" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feBlend in="SourceGraphic" mode="multiply"/>
    </filter>
    <filter id="blur4"><feGaussianBlur stdDeviation="4"/></filter>
    <filter id="blur12"><feGaussianBlur stdDeviation="12"/></filter>
    <filter id="blur24"><feGaussianBlur stdDeviation="24"/></filter>
  </defs>`;
}

function renderAtmosphere(w: number, h: number, rand: () => number, primary: string, light: string, dark: string): string {
  let svg = `<rect width="${w}" height="${h}" fill="url(#bg)"/>`;
  svg += `<rect width="${w}" height="${h}" fill="url(#glow1)"/>`;
  svg += `<rect width="${w}" height="${h}" fill="url(#glow2)"/>`;

  for (let i = 0; i < 600; i++) {
    const x = rand() * w;
    const y = rand() * h;
    const r = 0.2 + rand() * 1.2;
    const op = 0.05 + rand() * 0.2;
    svg += `<circle cx="${x}" cy="${y}" r="${r}" fill="${rand() > 0.5 ? light : '#ffffff'}" opacity="${op}"/>`;
  }

  for (let i = 0; i < 3; i++) {
    const cx = w * (0.2 + rand() * 0.6);
    const cy = h * (0.2 + rand() * 0.6);
    const rx = 80 + rand() * 200;
    const ry = 60 + rand() * 150;
    svg += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${primary}" opacity="${0.02 + rand() * 0.03}" filter="url(#blur24)"/>`;
  }

  return svg;
}

function renderGalaxyCollision(cx: number, cy: number, w: number, h: number, rand: () => number, primary: string, light: string, accent: string): string {
  let svg = "";
  const g1 = { x: cx - w * 0.18, y: cy - h * 0.1 };
  const g2 = { x: cx + w * 0.18, y: cy + h * 0.1 };

  for (const g of [g1, g2]) {
    for (let ring = 0; ring < 8; ring++) {
      const r = 5 + ring * 12;
      svg += `<circle cx="${g.x}" cy="${g.y}" r="${r}" fill="none" stroke="${light}" stroke-width="0.3" opacity="${0.03 + (8 - ring) * 0.01}"/>`;
    }

    const arms = 4 + Math.floor(rand() * 2);
    for (let arm = 0; arm < arms; arm++) {
      const offset = (arm / arms) * Math.PI * 2;
      const dir = g === g1 ? 1 : -1;
      for (let pass = 0; pass < 3; pass++) {
        let d = `M ${g.x} ${g.y}`;
        for (let t = 0; t < 200; t++) {
          const angle = offset + t * 0.06 * dir + (pass - 1) * 0.15;
          const r = t * 1.2 + rand() * 2;
          d += ` L ${g.x + Math.cos(angle) * r} ${g.y + Math.sin(angle) * r}`;
        }
        svg += `<path d="${d}" fill="none" stroke="${pass === 1 ? light : primary}" stroke-width="${0.3 + (2 - pass) * 0.2}" opacity="${0.06 + (2 - pass) * 0.04}"/>`;
      }
    }

    svg += `<circle cx="${g.x}" cy="${g.y}" r="20" fill="${light}" opacity="0.08" filter="url(#blur12)"/>`;
    svg += `<circle cx="${g.x}" cy="${g.y}" r="6" fill="${light}" opacity="0.4" filter="url(#softGlow)"/>`;
    svg += `<circle cx="${g.x}" cy="${g.y}" r="2" fill="#ffffff" opacity="0.9"/>`;
  }

  const bridgeStars = 120;
  for (let i = 0; i < bridgeStars; i++) {
    const t = rand();
    const spread = (1 - Math.abs(t - 0.5) * 2) * 80;
    const x = g1.x + (g2.x - g1.x) * t + (rand() - 0.5) * spread;
    const y = g1.y + (g2.y - g1.y) * t + (rand() - 0.5) * spread;
    const r = 0.2 + rand() * 2;
    const c = rand() > 0.7 ? accent : light;
    svg += `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity="${0.1 + rand() * 0.5}"/>`;
  }

  const fieldStars = 300;
  for (let i = 0; i < fieldStars; i++) {
    const x = rand() * w;
    const y = rand() * h;
    const r = 0.15 + rand() * 0.6;
    svg += `<circle cx="${x}" cy="${y}" r="${r}" fill="${rand() > 0.9 ? accent : '#ffffff'}" opacity="${0.05 + rand() * 0.2}"/>`;
  }

  return svg;
}

function renderTensorField(cx: number, cy: number, w: number, h: number, rand: () => number, primary: string, light: string, accent: string, seed: number): string {
  let svg = "";
  const gridSize = 28;
  const cellW = w / gridSize;
  const cellH = h / gridSize;

  for (let gx = 1; gx < gridSize; gx++) {
    for (let gy = 1; gy < gridSize; gy++) {
      const px = gx * cellW;
      const py = gy * cellH;
      const dx = px - cx;
      const dy = py - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = Math.sqrt(cx * cx + cy * cy);
      const strength = 1 - (dist / maxDist);
      const noiseVal = fbm(px * 0.003, py * 0.003, seed, 4);
      const angle = Math.atan2(dy, dx) + Math.sin(dist * 0.012 + noiseVal * 4) * 2;
      const len = 6 + strength * 24 + noiseVal * 8;

      const x1 = px - Math.cos(angle) * len * 0.5;
      const y1 = py - Math.sin(angle) * len * 0.5;
      const x2 = px + Math.cos(angle) * len * 0.5;
      const y2 = py + Math.sin(angle) * len * 0.5;

      const color = strength > 0.6 ? accent : (strength > 0.3 ? light : primary);
      svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${0.3 + strength * 1.5}" opacity="${0.06 + strength * 0.35}" stroke-linecap="round"/>`;

      if (strength > 0.5 && rand() > 0.7) {
        svg += `<circle cx="${px}" cy="${py}" r="${0.8 + strength * 2.5}" fill="${accent}" opacity="${0.1 + strength * 0.25}" filter="url(#softGlow)"/>`;
      }
    }
  }

  for (let ring = 1; ring <= 8; ring++) {
    const r = ring * Math.min(w, h) * 0.055;
    svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${light}" stroke-width="0.4" opacity="${0.04 + (8 - ring) * 0.015}" stroke-dasharray="${1 + ring} ${3 + ring * 2}"/>`;
  }

  svg += `<circle cx="${cx}" cy="${cy}" r="40" fill="${accent}" opacity="0.06" filter="url(#blur12)"/>`;
  svg += `<circle cx="${cx}" cy="${cy}" r="3" fill="${accent}" opacity="0.6"/>`;

  return svg;
}

function renderWaveInterference(cx: number, cy: number, w: number, h: number, rand: () => number, primary: string, light: string, accent: string): string {
  let svg = "";
  const sources = [
    { x: cx - w * 0.22, y: cy - h * 0.05 },
    { x: cx + w * 0.22, y: cy + h * 0.05 },
    { x: cx, y: cy - h * 0.25 },
  ];

  for (const src of sources) {
    const rings = 20;
    for (let i = 1; i <= rings; i++) {
      const r = i * 18;
      svg += `<circle cx="${src.x}" cy="${src.y}" r="${r}" fill="none" stroke="${primary}" stroke-width="${0.3 + (1 - i / rings) * 0.8}" opacity="${0.02 + (1 - i / rings) * 0.08}"/>`;
    }
    svg += `<circle cx="${src.x}" cy="${src.y}" r="8" fill="${light}" opacity="0.1" filter="url(#softGlow)"/>`;
    svg += `<circle cx="${src.x}" cy="${src.y}" r="2.5" fill="${accent}" opacity="0.8"/>`;
  }

  const resolution = 3;
  for (let x = 0; x < w; x += resolution) {
    for (let y = 0; y < h; y += resolution) {
      let amplitude = 0;
      for (const src of sources) {
        const dx = x - src.x;
        const dy = y - src.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        amplitude += Math.sin(dist * 0.06) / (1 + dist * 0.003);
      }
      if (Math.abs(amplitude) > 0.8) {
        const opacity = Math.min(Math.abs(amplitude) * 0.08, 0.3);
        const color = amplitude > 0 ? light : (amplitude > -0.5 ? primary : accent);
        svg += `<rect x="${x}" y="${y}" width="${resolution}" height="${resolution}" fill="${color}" opacity="${opacity}"/>`;
      }
    }
  }

  return svg;
}

function renderFractalSpiral(cx: number, cy: number, w: number, h: number, rand: () => number, primary: string, light: string, accent: string): string {
  let svg = "";
  const maxR = Math.min(w, h) * 0.42;

  for (let i = 0; i < 500; i++) {
    const angle = i * 2.39996;
    const r = Math.sqrt(i / 500) * maxR;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    const size = 0.5 + (1 - i / 500) * 4;
    const opacity = 0.1 + (1 - i / 500) * 0.5;
    const c = i % 5 === 0 ? accent : (i % 3 === 0 ? light : primary);
    svg += `<circle cx="${x}" cy="${y}" r="${size}" fill="${c}" opacity="${opacity}"/>`;
    if (i > 0 && i % 5 === 0) {
      const prevAngle = (i - 5) * 2.39996;
      const prevR = Math.sqrt((i - 5) / 500) * maxR;
      const px = cx + Math.cos(prevAngle) * prevR;
      const py = cy + Math.sin(prevAngle) * prevR;
      svg += `<line x1="${px}" y1="${py}" x2="${x}" y2="${y}" stroke="${light}" stroke-width="0.2" opacity="0.06"/>`;
    }
  }

  for (let s = 0; s < 4; s++) {
    let spiralPath = `M ${cx} ${cy}`;
    const phaseOffset = s * Math.PI * 0.5;
    for (let t = 0; t < 500; t++) {
      const angle = t * 0.08 + phaseOffset;
      const r = t * 0.4;
      spiralPath += ` L ${cx + Math.cos(angle) * r} ${cy + Math.sin(angle) * r}`;
    }
    svg += `<path d="${spiralPath}" fill="none" stroke="${s % 2 === 0 ? primary : light}" stroke-width="0.3" opacity="0.06"/>`;
  }

  svg += `<circle cx="${cx}" cy="${cy}" r="4" fill="${accent}" opacity="0.5" filter="url(#softGlow)"/>`;

  return svg;
}

function renderFlowField(cx: number, cy: number, w: number, h: number, rand: () => number, primary: string, light: string, accent: string, seed: number): string {
  let svg = "";
  const streamlines = 80;

  for (let s = 0; s < streamlines; s++) {
    let x = rand() * w;
    let y = rand() * h;
    let d = `M ${x} ${y}`;
    const steps = 80 + Math.floor(rand() * 60);
    
    for (let t = 0; t < steps; t++) {
      const noiseVal = fbm(x * 0.004, y * 0.004, seed, 5);
      const angle = noiseVal * Math.PI * 4;
      const speed = 1.5 + Math.sin(noiseVal * 6) * 0.8;
      x += Math.cos(angle) * speed;
      y += Math.sin(angle) * speed;
      if (x < -10 || x > w + 10 || y < -10 || y > h + 10) break;
      d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    
    const c = rand() > 0.8 ? accent : (rand() > 0.5 ? light : primary);
    svg += `<path d="${d}" fill="none" stroke="${c}" stroke-width="${0.3 + rand() * 0.8}" opacity="${0.04 + rand() * 0.12}" stroke-linecap="round"/>`;
  }

  for (let i = 0; i < 50; i++) {
    const x = rand() * w;
    const y = rand() * h;
    svg += `<circle cx="${x}" cy="${y}" r="${0.3 + rand() * 1.8}" fill="${rand() > 0.5 ? accent : light}" opacity="${0.1 + rand() * 0.2}"/>`;
  }

  return svg;
}

function renderEntropyReduction(cx: number, cy: number, w: number, h: number, rand: () => number, primary: string, light: string, dark: string, accent: string): string {
  let svg = "";
  const leftX = w * 0.25;
  const rightX = w * 0.75;
  
  for (let i = 0; i < 100; i++) {
    const x = leftX + (rand() - 0.5) * w * 0.35;
    const y = cy + (rand() - 0.5) * h * 0.7;
    const size = 0.5 + rand() * 5;
    const angle = rand() * 360;
    const c = rand() > 0.6 ? primary : accent;
    svg += `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${c}" opacity="${0.08 + rand() * 0.15}" transform="rotate(${angle} ${x + size/2} ${y + size/2})"/>`;
  }

  for (let i = 0; i < 30; i++) {
    const x1 = leftX + (rand() - 0.5) * w * 0.3;
    const y1 = cy + (rand() - 0.5) * h * 0.5;
    const x2 = x1 + (rand() - 0.5) * 40;
    const y2 = y1 + (rand() - 0.5) * 40;
    svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${primary}" stroke-width="0.3" opacity="0.08"/>`;
  }

  const orderedNodes: Vec2[] = [];
  const rings = 5;
  for (let ring = 0; ring < rings; ring++) {
    const count = 6 + ring * 6;
    const r = 15 + ring * 22;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = rightX + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      orderedNodes.push({ x, y });
      const c = ring < 2 ? accent : light;
      svg += `<circle cx="${x}" cy="${y}" r="${1.8 - ring * 0.2}" fill="${c}" opacity="${0.3 + (rings - ring) * 0.1}"/>`;
    }
  }

  for (let i = 0; i < orderedNodes.length; i++) {
    for (let j = i + 1; j < orderedNodes.length; j++) {
      const dx = orderedNodes[i].x - orderedNodes[j].x;
      const dy = orderedNodes[i].y - orderedNodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 30) {
        svg += `<line x1="${orderedNodes[i].x}" y1="${orderedNodes[i].y}" x2="${orderedNodes[j].x}" y2="${orderedNodes[j].y}" stroke="${light}" stroke-width="0.25" opacity="0.08"/>`;
      }
    }
  }

  const arrowCount = 8;
  for (let i = 0; i < arrowCount; i++) {
    const t = (i + 0.5) / arrowCount;
    const ax = leftX + (rightX - leftX) * t;
    const ay = cy + Math.sin(t * Math.PI * 2) * 15;
    svg += `<path d="M ${ax - 4} ${ay} L ${ax + 4} ${ay} L ${ax + 2} ${ay - 2} M ${ax + 4} ${ay} L ${ax + 2} ${ay + 2}" fill="none" stroke="${accent}" stroke-width="0.8" opacity="${0.15 + t * 0.2}"/>`;
  }

  return svg;
}

function renderGrowthPattern(cx: number, cy: number, w: number, h: number, rand: () => number, primary: string, light: string, accent: string): string {
  let svg = "";

  function branch(x: number, y: number, angle: number, len: number, depth: number) {
    if (depth <= 0 || len < 2) return;
    const x2 = x + Math.cos(angle) * len;
    const y2 = y + Math.sin(angle) * len;
    const c = depth > 5 ? primary : (depth > 3 ? light : accent);
    svg += `<line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${0.2 + depth * 0.5}" opacity="${0.1 + depth * 0.06}" stroke-linecap="round"/>`;
    
    if (depth <= 2) {
      svg += `<circle cx="${x2}" cy="${y2}" r="${1 + rand() * 3}" fill="${accent}" opacity="${0.15 + rand() * 0.2}"/>`;
    }
    
    const spread = 0.25 + rand() * 0.45;
    branch(x2, y2, angle - spread, len * (0.62 + rand() * 0.12), depth - 1);
    branch(x2, y2, angle + spread, len * (0.62 + rand() * 0.12), depth - 1);
    if (rand() > 0.5) {
      branch(x2, y2, angle + (rand() - 0.5) * 0.3, len * (0.45 + rand() * 0.15), depth - 1);
    }
  }

  branch(cx, h * 0.82, -Math.PI / 2, h * 0.2, 10);

  const rootCount = 8;
  for (let i = 0; i < rootCount; i++) {
    const angle = Math.PI / 2 + (rand() - 0.5) * 1.5;
    let rx = cx + (rand() - 0.5) * 30;
    let ry = h * 0.82;
    let d = `M ${rx} ${ry}`;
    for (let t = 0; t < 25; t++) {
      rx += Math.cos(angle + Math.sin(t * 0.4) * 0.4) * 5;
      ry += Math.sin(angle) * 4;
      d += ` L ${rx} ${ry}`;
    }
    svg += `<path d="${d}" fill="none" stroke="${primary}" stroke-width="${0.3 + rand() * 0.4}" opacity="0.08"/>`;
  }

  return svg;
}

function renderLatticeGrid(cx: number, cy: number, w: number, h: number, rand: () => number, primary: string, light: string, accent: string): string {
  let svg = "";
  const hexR = 22;
  const rows = Math.ceil(h / (hexR * Math.sqrt(3))) + 2;
  const cols = Math.ceil(w / (hexR * 1.5)) + 2;
  const offsetX = cx - (cols * hexR * 1.5) / 2;
  const offsetY = cy - (rows * hexR * Math.sqrt(3)) / 2;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const hx = offsetX + col * hexR * 1.5;
      const hy = offsetY + row * hexR * Math.sqrt(3) + (col % 2 === 0 ? 0 : hexR * Math.sqrt(3) / 2);
      const dx = hx - cx;
      const dy = hy - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) / (Math.min(w, h) * 0.45);
      const intensity = Math.max(0, 1 - dist);

      let hexPath = "";
      for (let i = 0; i < 6; i++) {
        const angle = (i * 60 - 30) * Math.PI / 180;
        const px = hx + Math.cos(angle) * hexR * 0.92;
        const py = hy + Math.sin(angle) * hexR * 0.92;
        hexPath += (i === 0 ? "M" : "L") + ` ${px} ${py}`;
      }
      hexPath += " Z";
      const c = intensity > 0.7 ? accent : (intensity > 0.4 ? light : primary);
      svg += `<path d="${hexPath}" fill="none" stroke="${c}" stroke-width="${0.2 + intensity * 1}" opacity="${0.03 + intensity * 0.2}"/>`;

      if (intensity > 0.3) {
        svg += `<circle cx="${hx}" cy="${hy}" r="${0.5 + intensity * 2.5}" fill="${intensity > 0.6 ? accent : light}" opacity="${0.1 + intensity * 0.3}"/>`;
      }
    }
  }

  for (let i = 0; i < 6; i++) {
    const angle = (i * 60) * Math.PI / 180;
    const r = Math.min(w, h) * 0.3;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    svg += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="${accent}" stroke-width="0.4" opacity="0.08"/>`;
  }

  svg += `<circle cx="${cx}" cy="${cy}" r="5" fill="${accent}" opacity="0.4" filter="url(#softGlow)"/>`;

  return svg;
}

function renderNetwork(cx: number, cy: number, w: number, h: number, rand: () => number, primary: string, light: string, accent: string): string {
  let svg = "";
  const nodeCount = 80;
  const nodes: (Vec2 & { importance: number })[] = [];

  for (let i = 0; i < nodeCount; i++) {
    const angle = rand() * Math.PI * 2;
    const dist = 15 + rand() * Math.min(w, h) * 0.4;
    const x = cx + Math.cos(angle) * dist + (rand() - 0.5) * 60;
    const y = cy + Math.sin(angle) * dist + (rand() - 0.5) * 60;
    const dx = x - cx;
    const dy = y - cy;
    const d = Math.sqrt(dx * dx + dy * dy);
    const importance = 1 - Math.min(d / (Math.min(w, h) * 0.45), 1);
    nodes.push({ x, y, importance });
  }

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 80 && rand() > 0.3) {
        const avgImp = (nodes[i].importance + nodes[j].importance) / 2;
        const c = avgImp > 0.5 ? accent : (avgImp > 0.3 ? light : primary);
        svg += `<line x1="${nodes[i].x}" y1="${nodes[i].y}" x2="${nodes[j].x}" y2="${nodes[j].y}" stroke="${c}" stroke-width="${0.2 + avgImp * 0.5}" opacity="${0.03 + (1 - dist/80) * 0.1}"/>`;
      }
    }
  }

  for (const n of nodes) {
    const r = 0.8 + n.importance * 4;
    const c = n.importance > 0.6 ? accent : (n.importance > 0.3 ? light : primary);
    svg += `<circle cx="${n.x}" cy="${n.y}" r="${r}" fill="${c}" opacity="${0.15 + n.importance * 0.4}"/>`;
    if (n.importance > 0.5) {
      svg += `<circle cx="${n.x}" cy="${n.y}" r="${r * 3}" fill="${c}" opacity="0.04" filter="url(#blur4)"/>`;
    }
  }

  svg += `<circle cx="${cx}" cy="${cy}" r="15" fill="${accent}" opacity="0.08" filter="url(#blur12)"/>`;
  svg += `<circle cx="${cx}" cy="${cy}" r="4" fill="${accent}" opacity="0.6"/>`;

  return svg;
}

function renderMolecular(cx: number, cy: number, w: number, h: number, rand: () => number, primary: string, light: string, accent: string): string {
  let svg = "";
  const atoms: Vec2[] = [];
  const bonds: [number, number][] = [];
  
  atoms.push({ x: cx, y: cy });
  const shellCount = 5;
  for (let shell = 1; shell <= shellCount; shell++) {
    const count = shell * 5 + 3;
    const r = shell * 30;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + shell * 0.3;
      atoms.push({
        x: cx + Math.cos(angle) * r + (rand() - 0.5) * 12,
        y: cy + Math.sin(angle) * r + (rand() - 0.5) * 12,
      });
    }
  }

  for (let i = 0; i < atoms.length; i++) {
    let connections = 0;
    for (let j = i + 1; j < atoms.length; j++) {
      if (connections >= 4) break;
      const dx = atoms[i].x - atoms[j].x;
      const dy = atoms[i].y - atoms[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 42) {
        bonds.push([i, j]);
        connections++;
      }
    }
  }

  for (const [a, b] of bonds) {
    const double = rand() > 0.75;
    if (double) {
      const dx = atoms[b].x - atoms[a].x;
      const dy = atoms[b].y - atoms[a].y;
      const len = Math.sqrt(dx * dx + dy * dy);
      const nx = -dy / len * 2;
      const ny = dx / len * 2;
      svg += `<line x1="${atoms[a].x + nx}" y1="${atoms[a].y + ny}" x2="${atoms[b].x + nx}" y2="${atoms[b].y + ny}" stroke="${light}" stroke-width="0.8" opacity="0.15"/>`;
      svg += `<line x1="${atoms[a].x - nx}" y1="${atoms[a].y - ny}" x2="${atoms[b].x - nx}" y2="${atoms[b].y - ny}" stroke="${light}" stroke-width="0.8" opacity="0.15"/>`;
    } else {
      svg += `<line x1="${atoms[a].x}" y1="${atoms[a].y}" x2="${atoms[b].x}" y2="${atoms[b].y}" stroke="${primary}" stroke-width="1" opacity="0.12"/>`;
    }
  }

  for (let i = 0; i < atoms.length; i++) {
    const dx = atoms[i].x - cx;
    const dy = atoms[i].y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const imp = 1 - Math.min(dist / 150, 1);
    const r = i === 0 ? 7 : 1.5 + imp * 3 + rand() * 1.5;
    const c = i === 0 ? accent : (imp > 0.5 ? light : primary);
    svg += `<circle cx="${atoms[i].x}" cy="${atoms[i].y}" r="${r}" fill="${c}" opacity="${i === 0 ? 0.6 : 0.15 + imp * 0.3}"/>`;
    if (i === 0) {
      svg += `<circle cx="${atoms[i].x}" cy="${atoms[i].y}" r="18" fill="${accent}" opacity="0.06" filter="url(#blur4)"/>`;
    }
  }

  return svg;
}

function renderGeomorphology(cx: number, cy: number, w: number, h: number, rand: () => number, primary: string, light: string, accent: string, seed: number): string {
  let svg = "";

  const layers = 12;
  for (let l = 0; l < layers; l++) {
    const yBase = h * (0.15 + (l / layers) * 0.75);
    let d = `M -10 ${h + 10}`;
    d += ` L -10 ${yBase}`;
    const step = 4;
    for (let x = -10; x <= w + 10; x += step) {
      const n1 = fbm(x * 0.005 + l * 0.7, l * 2.3, seed, 5);
      const n2 = fbm(x * 0.012 + l * 1.1, l * 0.8, seed + 50, 4);
      const n3 = fbm(x * 0.002, l * 0.5, seed + 100, 3);
      const amplitude = 30 + n3 * 40;
      const py = yBase + (n1 * amplitude + n2 * amplitude * 0.4) * (1 - l / (layers * 1.5));
      d += ` L ${x} ${py.toFixed(1)}`;
    }
    d += ` L ${w + 10} ${h + 10} Z`;
    const t = l / layers;
    const fillColor = blendColor(blendColor(primary, light, t), accent, t * 0.3);
    svg += `<path d="${d}" fill="${fillColor}" opacity="${0.04 + t * 0.18}"/>`;
  }

  const contourCount = 30;
  for (let c = 0; c < contourCount; c++) {
    const yBase = h * (0.1 + (c / contourCount) * 0.8);
    let contour = "";
    const step = 3;
    for (let x = -10; x <= w + 10; x += step) {
      const n = fbm(x * 0.006 + c * 0.5, c * 1.7, seed, 6);
      const py = yBase + n * 35;
      contour += (x <= -10 ? "M" : " L") + ` ${x} ${py.toFixed(1)}`;
    }
    const op = 0.03 + (1 - Math.abs(c / contourCount - 0.5) * 2) * 0.12;
    const col = c % 4 === 0 ? accent : (c % 2 === 0 ? light : primary);
    svg += `<path d="${contour}" fill="none" stroke="${col}" stroke-width="${c % 5 === 0 ? 0.8 : 0.3}" opacity="${op}"/>`;
  }

  for (let i = 0; i < 40; i++) {
    const x = rand() * w;
    const y = h * 0.15 + rand() * h * 0.7;
    const n = fbm(x * 0.01, y * 0.01, seed + 200, 3);
    if (n > 0.55) {
      svg += `<circle cx="${x}" cy="${y}" r="${0.5 + n * 2}" fill="${accent}" opacity="${0.1 + n * 0.15}"/>`;
    }
  }

  for (let r = 0; r < 5; r++) {
    let rx = w * (0.1 + rand() * 0.8);
    let ry = h * (0.3 + rand() * 0.5);
    let d = `M ${rx} ${ry}`;
    for (let t = 0; t < 60; t++) {
      const n = fbm(rx * 0.008, ry * 0.008, seed + 300 + r * 50, 4);
      const angle = n * Math.PI * 3 + Math.PI * 0.4;
      rx += Math.cos(angle) * 3;
      ry += Math.sin(angle) * 2.5 + 0.5;
      if (rx < 0 || rx > w || ry < 0 || ry > h) break;
      d += ` L ${rx.toFixed(1)} ${ry.toFixed(1)}`;
    }
    svg += `<path d="${d}" fill="none" stroke="${accent}" stroke-width="0.6" opacity="0.1" stroke-linecap="round"/>`;
  }

  return svg;
}

function renderUuonStamp(w: number, h: number, primary: string): string {
  const sx = w - 52;
  const sy = h - 52;
  let stamp = `<g transform="translate(${sx}, ${sy})" opacity="0.5">`;
  stamp += `<circle cx="16" cy="16" r="14" fill="none" stroke="${primary}" stroke-width="1.2"/>`;
  stamp += `<path d="M 6 16 L 26 16 M 16 6 L 16 26" stroke="${primary}" stroke-width="1.2"/>`;
  stamp += `<circle cx="16" cy="16" r="3" fill="${primary}" opacity="0.3"/>`;
  stamp += `<text x="16" y="38" text-anchor="middle" fill="${primary}" font-family="monospace" font-size="5" letter-spacing="1">UUON VERIFIED</text>`;
  stamp += `</g>`;
  return stamp;
}

const DOMAIN_LABELS: Record<string, string> = {
  galaxy: "Galaxy Collision Simulation",
  tensor: "Tensor Field Visualization",
  wave: "Wave Interference Pattern",
  fractal: "Fractal Spiral Structure",
  molecular: "Molecular Bond Network",
  flow: "Fluid Flow Dynamics",
  entropy: "Entropy Reduction Model",
  lattice: "Lattice Grid Structure",
  growth: "Organic Growth Pattern",
  geomorphology: "Terrain Topology Map",
  network: "Network Graph Topology",
  universal: "Concept Visualization",
};

function renderBrandedPlaceholder(cx: number, cy: number, w: number, h: number, rand: () => number, primary: string, light: string, accent: string): string {
  let svg = "";

  for (let ring = 1; ring <= 12; ring++) {
    const r = ring * Math.min(w, h) * 0.035;
    const dashLen = 2 + ring * 1.5;
    const gapLen = 4 + ring * 2;
    svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${ring % 3 === 0 ? accent : (ring % 2 === 0 ? light : primary)}" stroke-width="${0.4 + (12 - ring) * 0.08}" opacity="${0.05 + (12 - ring) * 0.025}" stroke-dasharray="${dashLen} ${gapLen}"/>`;
  }

  for (let i = 0; i < 6; i++) {
    const angle = (i * 60) * Math.PI / 180;
    const innerR = Math.min(w, h) * 0.08;
    const outerR = Math.min(w, h) * 0.38;
    svg += `<line x1="${cx + Math.cos(angle) * innerR}" y1="${cy + Math.sin(angle) * innerR}" x2="${cx + Math.cos(angle) * outerR}" y2="${cy + Math.sin(angle) * outerR}" stroke="${primary}" stroke-width="0.3" opacity="0.06"/>`;
  }

  svg += `<circle cx="${cx}" cy="${cy}" r="20" fill="${accent}" opacity="0.06" filter="url(#blur12)"/>`;
  svg += `<circle cx="${cx}" cy="${cy}" r="6" fill="${accent}" opacity="0.3" filter="url(#softGlow)"/>`;
  svg += `<circle cx="${cx}" cy="${cy}" r="2" fill="#ffffff" opacity="0.7"/>`;

  svg += `<text x="${cx}" y="${cy + Math.min(w,h) * 0.28}" text-anchor="middle" fill="${light}" opacity="0.3" font-family="monospace" font-size="11" letter-spacing="3">UUON CLOUUD ÆYE</text>`;

  return svg;
}

function renderTitle(cx: number, w: number, concept: string, domain: string, primary: string, light: string): string {
  let svg = "";
  const domainLabel = DOMAIN_LABELS[domain] || DOMAIN_LABELS.universal;
  const title = concept.length > 40 ? concept.slice(0, 37) + "..." : concept;

  svg += `<text x="${cx}" y="36" text-anchor="middle" fill="${light}" opacity="0.5" font-family="monospace" font-size="14" font-weight="bold" letter-spacing="2">${title.toUpperCase()}</text>`;
  svg += `<text x="${cx}" y="54" text-anchor="middle" fill="${primary}" opacity="0.3" font-family="monospace" font-size="9" letter-spacing="3">${domainLabel.toUpperCase()}</text>`;
  svg += `<line x1="${cx - 80}" y1="62" x2="${cx + 80}" y2="62" stroke="${primary}" stroke-width="0.4" opacity="0.15"/>`;

  return svg;
}

export function generateSvgVisualization(concept: string, prompt: string, aspectRatio: string = "1:1"): string {
  const seed = hashStr(concept + prompt);
  const rand = seededRandom(seed);
  
  const width = aspectRatio === "16:9" ? 1920 : aspectRatio === "4:3" ? 1600 : 1200;
  const height = aspectRatio === "16:9" ? 1080 : aspectRatio === "4:3" ? 1200 : 1200;
  const cx = width / 2;
  const cy = height / 2;

  const domain = detectDomain(concept, prompt);
  const palettes = PALETTES[domain] || PALETTES.universal;
  const palette = palettes[Math.floor(rand() * palettes.length)];
  const [primary, dark, light, accent, deep] = palette;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
  svg += renderDefs(width, height, primary, dark, light, accent);
  svg += renderAtmosphere(width, height, rand, primary, light, dark);

  switch (domain) {
    case "galaxy":
      svg += renderGalaxyCollision(cx, cy, width, height, rand, primary, light, accent);
      break;
    case "tensor":
      svg += renderTensorField(cx, cy, width, height, rand, primary, light, accent, seed);
      break;
    case "wave":
      svg += renderWaveInterference(cx, cy, width, height, rand, primary, light, accent);
      break;
    case "fractal":
      svg += renderFractalSpiral(cx, cy, width, height, rand, primary, light, accent);
      break;
    case "flow":
      svg += renderFlowField(cx, cy, width, height, rand, primary, light, accent, seed);
      break;
    case "entropy":
      svg += renderEntropyReduction(cx, cy, width, height, rand, primary, light, dark, accent);
      break;
    case "growth":
      svg += renderGrowthPattern(cx, cy, width, height, rand, primary, light, accent);
      break;
    case "lattice":
      svg += renderLatticeGrid(cx, cy, width, height, rand, primary, light, accent);
      break;
    case "network":
      svg += renderNetwork(cx, cy, width, height, rand, primary, light, accent);
      break;
    case "molecular":
      svg += renderMolecular(cx, cy, width, height, rand, primary, light, accent);
      break;
    case "geomorphology":
      svg += renderGeomorphology(cx, cy, width, height, rand, primary, light, accent, seed);
      break;
    default:
      svg += renderBrandedPlaceholder(cx, cy, width, height, rand, primary, light, accent);
      break;
  }

  svg += renderTitle(cx, width, concept, domain, primary, light);
  svg += renderUuonStamp(width, height, primary);
  svg += `</svg>@VERIFIED-IRREPLACEABLE`;

  return svg;
}

export async function generateImageForClouud(img: {
  id: string;
  prompt: string;
  concept: string;
  aspectRatio: string;
  outputPath: string;
  status: string;
}) {
  console.log(`[IMAGE] Generating physics visualization for "${img.concept}" (${img.id})`);
  
  try {
    if (!fs.existsSync("generated_images")) {
      await mkdir("generated_images", { recursive: true });
    }
    
    let svg = generateSvgVisualization(img.concept, img.prompt, img.aspectRatio);
    
    // Watermark before saving
    try {
      svg = embedWatermark(svg, {
        sessionId: "SESSION_" + img.id, // Using img.id as part of session identifier for now
        founderId: "FOUNDER_SYSTEM",
        timestamp: Date.now()
      });
    } catch (e) {
      console.error("[IMAGE] Watermarking failed", e);
    }

    const closingIdx = svg.lastIndexOf("</svg>");
    if (closingIdx !== -1) {
      svg = svg.substring(0, closingIdx + 6);
    }
    const svgPath = img.outputPath.replace(".png", ".svg");
    await writeFile(svgPath, svg);
    
    img.status = "complete";
    img.outputPath = svgPath;
    console.log(`[IMAGE] Complete: ${img.concept} → ${svgPath}`);
  } catch (err: any) {
    img.status = "failed";
    console.error(`[IMAGE] Error generating ${img.concept}:`, err.message);
  }
}

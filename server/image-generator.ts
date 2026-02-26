import fs from "fs";
import path from "path";

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
  if (/network|connect|graph|node|mesh|distributed|web/.test(text)) return "network";
  return "universal";
}

const PALETTES: Record<string, string[][]> = {
  galaxy: [["#6366f1","#1e1b4b","#a5b4fc"], ["#f59e0b","#78350f","#fcd34d"]],
  tensor: [["#ec4899","#831843","#f9a8d4"], ["#8b5cf6","#4c1d95","#c4b5fd"]],
  wave: [["#06b6d4","#164e63","#67e8f9"], ["#3b82f6","#1e3a8a","#93c5fd"]],
  fractal: [["#10b981","#064e3b","#6ee7b7"], ["#8b5cf6","#4c1d95","#ddd6fe"]],
  molecular: [["#22c55e","#14532d","#86efac"], ["#06b6d4","#083344","#67e8f9"]],
  flow: [["#3b82f6","#1e3a8a","#93c5fd"], ["#06b6d4","#164e63","#a5f3fc"]],
  entropy: [["#f97316","#7c2d12","#fdba74"], ["#ef4444","#7f1d1d","#fca5a5"]],
  lattice: [["#f0b93b","#78350f","#fde68a"], ["#4a8cd4","#1e3a5f","#93c5fd"]],
  growth: [["#22c55e","#14532d","#bbf7d0"], ["#84cc16","#365314","#d9f99d"]],
  network: [["#4a8cd4","#1a3a5c","#7ab8f5"], ["#a855f7","#581c87","#d8b4fe"]],
  universal: [["#4a8cd4","#1a3a5c","#7ab8f5"], ["#f0b93b","#8b6914","#ffd970"]],
};

function renderGalaxyCollision(cx: number, cy: number, w: number, h: number, rand: () => number, primary: string, light: string): string {
  let svg = "";
  const g1 = { x: cx - w * 0.15, y: cy - h * 0.08 };
  const g2 = { x: cx + w * 0.15, y: cy + h * 0.08 };

  for (const g of [g1, g2]) {
    const arms = 3 + Math.floor(rand() * 2);
    for (let arm = 0; arm < arms; arm++) {
      let d = `M ${g.x} ${g.y}`;
      const offset = (arm / arms) * Math.PI * 2;
      const dir = g === g1 ? 1 : -1;
      for (let t = 0; t < 100; t++) {
        const angle = offset + t * 0.09 * dir;
        const r = t * 1.8 + rand() * 3;
        d += ` L ${g.x + Math.cos(angle) * r} ${g.y + Math.sin(angle) * r}`;
      }
      svg += `<path d="${d}" fill="none" stroke="${primary}" stroke-width="0.6" opacity="${0.15 + rand() * 0.2}"/>`;
    }
    svg += `<circle cx="${g.x}" cy="${g.y}" r="${8 + rand() * 6}" fill="${light}" opacity="0.3"/>`;
    svg += `<circle cx="${g.x}" cy="${g.y}" r="${3}" fill="${light}" opacity="0.7"/>`;
  }

  const bridgeStars = 30 + Math.floor(rand() * 40);
  for (let i = 0; i < bridgeStars; i++) {
    const t = rand();
    const spread = (1 - Math.abs(t - 0.5) * 2) * 40;
    const x = g1.x + (g2.x - g1.x) * t + (rand() - 0.5) * spread;
    const y = g1.y + (g2.y - g1.y) * t + (rand() - 0.5) * spread;
    const r = 0.3 + rand() * 1.5;
    svg += `<circle cx="${x}" cy="${y}" r="${r}" fill="${light}" opacity="${0.2 + rand() * 0.5}"/>`;
  }

  const fieldStars = 60 + Math.floor(rand() * 40);
  for (let i = 0; i < fieldStars; i++) {
    const x = rand() * w;
    const y = rand() * h;
    const r = 0.2 + rand() * 0.8;
    svg += `<circle cx="${x}" cy="${y}" r="${r}" fill="${light}" opacity="${0.1 + rand() * 0.3}"/>`;
  }

  return svg;
}

function renderTensorField(cx: number, cy: number, w: number, h: number, rand: () => number, primary: string, light: string): string {
  let svg = "";
  const gridSize = 12;
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
      const angle = Math.atan2(dy, dx) + Math.sin(dist * 0.02) * 1.5;
      const len = 8 + strength * 18;

      const x1 = px - Math.cos(angle) * len * 0.5;
      const y1 = py - Math.sin(angle) * len * 0.5;
      const x2 = px + Math.cos(angle) * len * 0.5;
      const y2 = py + Math.sin(angle) * len * 0.5;

      svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${primary}" stroke-width="${0.4 + strength * 1.2}" opacity="${0.1 + strength * 0.4}" stroke-linecap="round"/>`;

      if (strength > 0.5 && rand() > 0.6) {
        svg += `<circle cx="${px}" cy="${py}" r="${1 + strength * 2}" fill="${light}" opacity="${0.15 + strength * 0.2}"/>`;
      }
    }
  }

  for (let ring = 1; ring <= 4; ring++) {
    const r = ring * Math.min(w, h) * 0.1;
    svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${primary}" stroke-width="0.5" opacity="${0.08 + (4 - ring) * 0.04}" stroke-dasharray="${2 + ring * 2} ${4 + ring * 3}"/>`;
  }

  return svg;
}

function renderWaveInterference(cx: number, cy: number, w: number, h: number, rand: () => number, primary: string, light: string): string {
  let svg = "";
  const sources = [
    { x: cx - w * 0.2, y: cy },
    { x: cx + w * 0.2, y: cy },
  ];

  for (const src of sources) {
    const rings = 12 + Math.floor(rand() * 6);
    for (let i = 1; i <= rings; i++) {
      const r = i * 15;
      svg += `<circle cx="${src.x}" cy="${src.y}" r="${r}" fill="none" stroke="${primary}" stroke-width="0.6" opacity="${0.04 + (1 - i / rings) * 0.12}"/>`;
    }
    svg += `<circle cx="${src.x}" cy="${src.y}" r="3" fill="${light}" opacity="0.7"/>`;
  }

  const resolution = 4;
  for (let x = 0; x < w; x += resolution) {
    for (let y = 0; y < h; y += resolution) {
      let amplitude = 0;
      for (const src of sources) {
        const dx = x - src.x;
        const dy = y - src.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        amplitude += Math.sin(dist * 0.08) / (1 + dist * 0.005);
      }
      if (Math.abs(amplitude) > 1.2) {
        const opacity = Math.min(Math.abs(amplitude) * 0.1, 0.35);
        const color = amplitude > 0 ? light : primary;
        svg += `<rect x="${x}" y="${y}" width="${resolution}" height="${resolution}" fill="${color}" opacity="${opacity}"/>`;
      }
    }
  }

  return svg;
}

function renderFractalSpiral(cx: number, cy: number, w: number, h: number, rand: () => number, primary: string, light: string): string {
  let svg = "";
  const phi = (1 + Math.sqrt(5)) / 2;
  const maxR = Math.min(w, h) * 0.4;

  for (let i = 0; i < 200; i++) {
    const angle = i * 2.39996; // golden angle
    const r = Math.sqrt(i / 200) * maxR;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    const size = 1 + (1 - i / 200) * 3;
    const opacity = 0.2 + (1 - i / 200) * 0.5;
    svg += `<circle cx="${x}" cy="${y}" r="${size}" fill="${primary}" opacity="${opacity}"/>`;
    if (i > 0 && i % 8 === 0) {
      const prevAngle = (i - 8) * 2.39996;
      const prevR = Math.sqrt((i - 8) / 200) * maxR;
      const px = cx + Math.cos(prevAngle) * prevR;
      const py = cy + Math.sin(prevAngle) * prevR;
      svg += `<line x1="${px}" y1="${py}" x2="${x}" y2="${y}" stroke="${light}" stroke-width="0.3" opacity="0.1"/>`;
    }
  }

  let spiralPath = `M ${cx} ${cy}`;
  for (let t = 0; t < 300; t++) {
    const angle = t * 0.1;
    const r = t * 0.5;
    spiralPath += ` L ${cx + Math.cos(angle) * r} ${cy + Math.sin(angle) * r}`;
  }
  svg += `<path d="${spiralPath}" fill="none" stroke="${light}" stroke-width="0.5" opacity="0.12"/>`;

  return svg;
}

function renderFlowField(cx: number, cy: number, w: number, h: number, rand: () => number, primary: string, light: string): string {
  let svg = "";
  const streamlines = 25 + Math.floor(rand() * 15);

  for (let s = 0; s < streamlines; s++) {
    let x = rand() * w;
    let y = rand() * h;
    let d = `M ${x} ${y}`;
    const steps = 40 + Math.floor(rand() * 30);
    
    for (let t = 0; t < steps; t++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) + Math.PI * 0.5 + Math.sin(dist * 0.015 + x * 0.01) * 0.8;
      const speed = 2 + Math.sin(dist * 0.01) * 1.5;
      x += Math.cos(angle) * speed;
      y += Math.sin(angle) * speed;
      if (x < 0 || x > w || y < 0 || y > h) break;
      d += ` L ${x} ${y}`;
    }
    
    svg += `<path d="${d}" fill="none" stroke="${primary}" stroke-width="${0.4 + rand() * 0.8}" opacity="${0.08 + rand() * 0.15}" stroke-linecap="round"/>`;
  }

  for (let i = 0; i < 20; i++) {
    const x = rand() * w;
    const y = rand() * h;
    svg += `<circle cx="${x}" cy="${y}" r="${0.5 + rand() * 1.5}" fill="${light}" opacity="${0.15 + rand() * 0.25}"/>`;
  }

  return svg;
}

function renderEntropyReduction(cx: number, cy: number, w: number, h: number, rand: () => number, primary: string, light: string, dark: string): string {
  let svg = "";

  const leftX = w * 0.25;
  const rightX = w * 0.75;
  
  for (let i = 0; i < 40; i++) {
    const x = leftX + (rand() - 0.5) * w * 0.3;
    const y = cy + (rand() - 0.5) * h * 0.6;
    const size = 1 + rand() * 4;
    const angle = rand() * 360;
    svg += `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${primary}" opacity="${0.15 + rand() * 0.2}" transform="rotate(${angle} ${x + size/2} ${y + size/2})"/>`;
  }

  const orderedNodes: Vec2[] = [];
  const rings = 3;
  for (let ring = 0; ring < rings; ring++) {
    const count = 6 + ring * 4;
    const r = 20 + ring * 22;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = rightX + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      orderedNodes.push({ x, y });
      svg += `<circle cx="${x}" cy="${y}" r="${1.5 - ring * 0.3}" fill="${light}" opacity="${0.4 + (rings - ring) * 0.15}"/>`;
    }
  }

  for (let i = 0; i < orderedNodes.length; i++) {
    for (let j = i + 1; j < orderedNodes.length; j++) {
      const dx = orderedNodes[i].x - orderedNodes[j].x;
      const dy = orderedNodes[i].y - orderedNodes[j].y;
      if (Math.sqrt(dx * dx + dy * dy) < 35) {
        svg += `<line x1="${orderedNodes[i].x}" y1="${orderedNodes[i].y}" x2="${orderedNodes[j].x}" y2="${orderedNodes[j].y}" stroke="${light}" stroke-width="0.3" opacity="0.12"/>`;
      }
    }
  }

  svg += `<text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="middle" fill="${primary}" opacity="0.25" font-family="monospace" font-size="18">→</text>`;

  return svg;
}

function renderGrowthPattern(cx: number, cy: number, w: number, h: number, rand: () => number, primary: string, light: string): string {
  let svg = "";

  function branch(x: number, y: number, angle: number, len: number, depth: number) {
    if (depth <= 0 || len < 3) return;
    const x2 = x + Math.cos(angle) * len;
    const y2 = y + Math.sin(angle) * len;
    svg += `<line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" stroke="${primary}" stroke-width="${0.3 + depth * 0.4}" opacity="${0.15 + depth * 0.08}" stroke-linecap="round"/>`;
    
    if (depth <= 2) {
      svg += `<circle cx="${x2}" cy="${y2}" r="${1 + rand() * 2}" fill="${light}" opacity="${0.2 + rand() * 0.2}"/>`;
    }
    
    const spread = 0.3 + rand() * 0.4;
    branch(x2, y2, angle - spread, len * (0.65 + rand() * 0.1), depth - 1);
    branch(x2, y2, angle + spread, len * (0.65 + rand() * 0.1), depth - 1);
    if (rand() > 0.6) {
      branch(x2, y2, angle + (rand() - 0.5) * 0.3, len * (0.5 + rand() * 0.15), depth - 1);
    }
  }

  branch(cx, h * 0.85, -Math.PI / 2, h * 0.18, 8);

  const rootCount = 5;
  for (let i = 0; i < rootCount; i++) {
    const angle = Math.PI / 2 + (rand() - 0.5) * 1.2;
    let rx = cx + (rand() - 0.5) * 20;
    let ry = h * 0.85;
    let d = `M ${rx} ${ry}`;
    for (let t = 0; t < 15; t++) {
      rx += Math.cos(angle + Math.sin(t * 0.5) * 0.3) * 6;
      ry += Math.sin(angle) * 5;
      d += ` L ${rx} ${ry}`;
    }
    svg += `<path d="${d}" fill="none" stroke="${primary}" stroke-width="0.6" opacity="0.12"/>`;
  }

  return svg;
}

function renderLatticeGrid(cx: number, cy: number, w: number, h: number, rand: () => number, primary: string, light: string): string {
  let svg = "";
  const hexR = 25;
  const rows = 6;
  const cols = 8;
  const offsetX = cx - (cols * hexR * 1.5) / 2;
  const offsetY = cy - (rows * hexR * Math.sqrt(3)) / 2;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const hx = offsetX + col * hexR * 1.5;
      const hy = offsetY + row * hexR * Math.sqrt(3) + (col % 2 === 0 ? 0 : hexR * Math.sqrt(3) / 2);
      const dx = hx - cx;
      const dy = hy - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) / (Math.min(w, h) * 0.4);
      const intensity = Math.max(0, 1 - dist);

      let hexPath = "";
      for (let i = 0; i < 6; i++) {
        const angle = (i * 60 - 30) * Math.PI / 180;
        const px = hx + Math.cos(angle) * hexR * 0.9;
        const py = hy + Math.sin(angle) * hexR * 0.9;
        hexPath += (i === 0 ? "M" : "L") + ` ${px} ${py}`;
      }
      hexPath += " Z";
      svg += `<path d="${hexPath}" fill="none" stroke="${primary}" stroke-width="${0.3 + intensity * 0.8}" opacity="${0.05 + intensity * 0.2}"/>`;

      if (intensity > 0.3) {
        svg += `<circle cx="${hx}" cy="${hy}" r="${1 + intensity * 2}" fill="${light}" opacity="${0.15 + intensity * 0.3}"/>`;
      }
    }
  }

  const triR = Math.min(w, h) * 0.25;
  for (let i = 0; i < 3; i++) {
    const angle = (i * 120 - 90) * Math.PI / 180;
    const x = cx + Math.cos(angle) * triR;
    const y = cy + Math.sin(angle) * triR;
    svg += `<circle cx="${x}" cy="${y}" r="3" fill="${light}" opacity="0.4"/>`;
    const nextAngle = ((i + 1) * 120 - 90) * Math.PI / 180;
    const nx = cx + Math.cos(nextAngle) * triR;
    const ny = cy + Math.sin(nextAngle) * triR;
    svg += `<line x1="${x}" y1="${y}" x2="${nx}" y2="${ny}" stroke="${light}" stroke-width="1" opacity="0.15"/>`;
  }

  return svg;
}

function renderNetwork(cx: number, cy: number, w: number, h: number, rand: () => number, primary: string, light: string): string {
  let svg = "";
  const nodeCount = 30 + Math.floor(rand() * 20);
  const nodes: Vec2[] = [];

  for (let i = 0; i < nodeCount; i++) {
    const angle = rand() * Math.PI * 2;
    const dist = 20 + rand() * Math.min(w, h) * 0.38;
    nodes.push({
      x: cx + Math.cos(angle) * dist + (rand() - 0.5) * 40,
      y: cy + Math.sin(angle) * dist + (rand() - 0.5) * 40,
    });
  }

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100 && rand() > 0.35) {
        svg += `<line x1="${nodes[i].x}" y1="${nodes[i].y}" x2="${nodes[j].x}" y2="${nodes[j].y}" stroke="${primary}" stroke-width="0.4" opacity="${0.06 + (1 - dist/100) * 0.12}"/>`;
      }
    }
  }

  for (const n of nodes) {
    const dx = n.x - cx;
    const dy = n.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = Math.min(w, h) * 0.45;
    const importance = 1 - Math.min(dist / maxDist, 1);
    const r = 1 + importance * 3.5;
    svg += `<circle cx="${n.x}" cy="${n.y}" r="${r}" fill="${light}" opacity="${0.2 + importance * 0.4}"/>`;
    svg += `<circle cx="${n.x}" cy="${n.y}" r="${r * 2.5}" fill="none" stroke="${primary}" stroke-width="0.3" opacity="${0.05 + importance * 0.1}"/>`;
  }

  svg += `<circle cx="${cx}" cy="${cy}" r="5" fill="${light}" opacity="0.6"/>`;
  svg += `<circle cx="${cx}" cy="${cy}" r="12" fill="none" stroke="${light}" stroke-width="0.8" opacity="0.2"/>`;

  return svg;
}

function renderMolecular(cx: number, cy: number, w: number, h: number, rand: () => number, primary: string, light: string): string {
  let svg = "";
  const atoms: Vec2[] = [];
  const bonds: [number, number][] = [];
  
  atoms.push({ x: cx, y: cy });
  const shellCount = 3;
  for (let shell = 1; shell <= shellCount; shell++) {
    const count = shell * 4 + 2;
    const r = shell * 35;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + shell * 0.3;
      atoms.push({
        x: cx + Math.cos(angle) * r + (rand() - 0.5) * 10,
        y: cy + Math.sin(angle) * r + (rand() - 0.5) * 10,
      });
    }
  }

  for (let i = 0; i < atoms.length; i++) {
    let connections = 0;
    for (let j = i + 1; j < atoms.length; j++) {
      if (connections >= 3) break;
      const dx = atoms[i].x - atoms[j].x;
      const dy = atoms[i].y - atoms[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 50) {
        bonds.push([i, j]);
        connections++;
      }
    }
  }

  for (const [a, b] of bonds) {
    const double = rand() > 0.7;
    if (double) {
      const dx = atoms[b].x - atoms[a].x;
      const dy = atoms[b].y - atoms[a].y;
      const len = Math.sqrt(dx * dx + dy * dy);
      const nx = -dy / len * 2;
      const ny = dx / len * 2;
      svg += `<line x1="${atoms[a].x + nx}" y1="${atoms[a].y + ny}" x2="${atoms[b].x + nx}" y2="${atoms[b].y + ny}" stroke="${primary}" stroke-width="1" opacity="0.2"/>`;
      svg += `<line x1="${atoms[a].x - nx}" y1="${atoms[a].y - ny}" x2="${atoms[b].x - nx}" y2="${atoms[b].y - ny}" stroke="${primary}" stroke-width="1" opacity="0.2"/>`;
    } else {
      svg += `<line x1="${atoms[a].x}" y1="${atoms[a].y}" x2="${atoms[b].x}" y2="${atoms[b].y}" stroke="${primary}" stroke-width="1.2" opacity="0.2"/>`;
    }
  }

  for (let i = 0; i < atoms.length; i++) {
    const r = i === 0 ? 6 : 2.5 + rand() * 2.5;
    const opacity = i === 0 ? 0.6 : 0.25 + rand() * 0.25;
    svg += `<circle cx="${atoms[i].x}" cy="${atoms[i].y}" r="${r}" fill="${i === 0 ? light : primary}" opacity="${opacity}"/>`;
    if (i === 0 || rand() > 0.7) {
      const orbR = r * 2.5;
      svg += `<circle cx="${atoms[i].x}" cy="${atoms[i].y}" r="${orbR}" fill="none" stroke="${light}" stroke-width="0.3" opacity="0.1"/>`;
    }
  }

  return svg;
}

export function generateSvgVisualization(concept: string, prompt: string, aspectRatio: string = "1:1"): string {
  const seed = hashStr(concept + prompt);
  const rand = seededRandom(seed);
  
  const width = aspectRatio === "16:9" ? 800 : aspectRatio === "4:3" ? 800 : 600;
  const height = aspectRatio === "16:9" ? 450 : aspectRatio === "4:3" ? 600 : 600;
  const cx = width / 2;
  const cy = height / 2;

  const domain = detectDomain(concept, prompt);
  const palettes = PALETTES[domain] || PALETTES.universal;
  const palette = palettes[Math.floor(rand() * palettes.length)];
  const [primary, dark, light] = palette;

  let shapes = "";

  switch (domain) {
    case "galaxy":
      shapes += renderGalaxyCollision(cx, cy, width, height, rand, primary, light);
      break;
    case "tensor":
      shapes += renderTensorField(cx, cy, width, height, rand, primary, light);
      break;
    case "wave":
      shapes += renderWaveInterference(cx, cy, width, height, rand, primary, light);
      break;
    case "fractal":
      shapes += renderFractalSpiral(cx, cy, width, height, rand, primary, light);
      break;
    case "flow":
      shapes += renderFlowField(cx, cy, width, height, rand, primary, light);
      break;
    case "entropy":
      shapes += renderEntropyReduction(cx, cy, width, height, rand, primary, light, dark);
      break;
    case "growth":
      shapes += renderGrowthPattern(cx, cy, width, height, rand, primary, light);
      break;
    case "lattice":
      shapes += renderLatticeGrid(cx, cy, width, height, rand, primary, light);
      break;
    case "network":
      shapes += renderNetwork(cx, cy, width, height, rand, primary, light);
      break;
    case "molecular":
      shapes += renderMolecular(cx, cy, width, height, rand, primary, light);
      break;
    default:
      shapes += renderLatticeGrid(cx, cy, width, height, rand, primary, light);
      shapes += renderFlowField(cx, cy, width, height, rand, primary, light);
      break;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#0d1b2a"/>
      <stop offset="100%" stop-color="#030810"/>
    </radialGradient>
    <radialGradient id="centralGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${light}" stop-opacity="0.5"/>
      <stop offset="60%" stop-color="${primary}" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="${dark}" stop-opacity="0"/>
    </radialGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  ${shapes}
  <text x="${cx}" y="${height - 16}" text-anchor="middle" fill="${primary}" opacity="0.35" font-family="monospace" font-size="8" letter-spacing="3">${concept.toUpperCase().slice(0, 40)}</text>
</svg>`;
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
      fs.mkdirSync("generated_images", { recursive: true });
    }
    
    const svg = generateSvgVisualization(img.concept, img.prompt, img.aspectRatio);
    const svgPath = img.outputPath.replace(".png", ".svg");
    fs.writeFileSync(svgPath, svg);
    
    img.status = "complete";
    img.outputPath = svgPath;
    console.log(`[IMAGE] Complete: ${img.concept} → ${svgPath}`);
  } catch (err: any) {
    img.status = "failed";
    console.error(`[IMAGE] Error generating ${img.concept}:`, err.message);
  }
}

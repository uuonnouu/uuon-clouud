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

export function generateSvgVisualization(concept: string, prompt: string, aspectRatio: string = "1:1"): string {
  const seed = hashStr(concept + prompt);
  const rand = seededRandom(seed);
  
  const width = aspectRatio === "16:9" ? 800 : aspectRatio === "4:3" ? 800 : 600;
  const height = aspectRatio === "16:9" ? 450 : aspectRatio === "4:3" ? 600 : 600;
  const cx = width / 2;
  const cy = height / 2;

  const colors = [
    ["#4a8cd4", "#1a3a5c", "#7ab8f5"],
    ["#f0b93b", "#8b6914", "#ffd970"],
    ["#8b5cf6", "#4c1d95", "#c4b5fd"],
    ["#22c55e", "#15803d", "#86efac"],
    ["#ef4444", "#991b1b", "#fca5a5"],
  ];
  const palette = colors[Math.floor(rand() * colors.length)];
  const primary = palette[0];
  const dark = palette[1];
  const light = palette[2];

  let shapes = "";

  const gridLines = 8 + Math.floor(rand() * 6);
  for (let i = 0; i < gridLines; i++) {
    const x1 = rand() * width;
    const y1 = rand() * height;
    const x2 = rand() * width;
    const y2 = rand() * height;
    shapes += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${primary}" stroke-width="0.3" opacity="0.15"/>`;
  }

  const orbits = 3 + Math.floor(rand() * 3);
  for (let i = 0; i < orbits; i++) {
    const r = 60 + rand() * (Math.min(width, height) * 0.35);
    const ox = cx + (rand() - 0.5) * 60;
    const oy = cy + (rand() - 0.5) * 60;
    const tilt = rand() * 40 - 20;
    shapes += `<ellipse cx="${ox}" cy="${oy}" rx="${r}" ry="${r * (0.3 + rand() * 0.4)}" fill="none" stroke="${primary}" stroke-width="0.8" opacity="${0.1 + rand() * 0.15}" transform="rotate(${tilt} ${ox} ${oy})"/>`;
  }

  const nodeCount = 12 + Math.floor(rand() * 20);
  const nodes: { x: number; y: number; r: number }[] = [];
  for (let i = 0; i < nodeCount; i++) {
    const angle = rand() * Math.PI * 2;
    const dist = 30 + rand() * (Math.min(width, height) * 0.38);
    const nx = cx + Math.cos(angle) * dist;
    const ny = cy + Math.sin(angle) * dist;
    const nr = 1.5 + rand() * 4;
    nodes.push({ x: nx, y: ny, r: nr });
    shapes += `<circle cx="${nx}" cy="${ny}" r="${nr}" fill="${primary}" opacity="${0.3 + rand() * 0.5}"/>`;
    shapes += `<circle cx="${nx}" cy="${ny}" r="${nr * 2.5}" fill="none" stroke="${primary}" stroke-width="0.3" opacity="${0.1 + rand() * 0.15}"/>`;
  }

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150 && rand() > 0.4) {
        shapes += `<line x1="${nodes[i].x}" y1="${nodes[i].y}" x2="${nodes[j].x}" y2="${nodes[j].y}" stroke="${light}" stroke-width="0.4" opacity="${0.08 + rand() * 0.12}"/>`;
      }
    }
  }

  const spiralArms = 2 + Math.floor(rand() * 3);
  for (let arm = 0; arm < spiralArms; arm++) {
    let d = `M ${cx} ${cy}`;
    const armOffset = (arm / spiralArms) * Math.PI * 2;
    for (let t = 0; t < 80; t++) {
      const angle = armOffset + t * 0.12;
      const r = t * 2.2;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      d += ` L ${x} ${y}`;
    }
    shapes += `<path d="${d}" fill="none" stroke="${light}" stroke-width="0.6" opacity="0.12"/>`;
  }

  const waveCount = 2 + Math.floor(rand() * 3);
  for (let w = 0; w < waveCount; w++) {
    let d = "";
    const yBase = height * 0.2 + rand() * height * 0.6;
    const amp = 15 + rand() * 30;
    const freq = 0.01 + rand() * 0.03;
    const phase = rand() * Math.PI * 2;
    for (let x = 0; x <= width; x += 3) {
      const y = yBase + Math.sin(x * freq + phase) * amp;
      d += (x === 0 ? "M" : " L") + ` ${x} ${y}`;
    }
    shapes += `<path d="${d}" fill="none" stroke="${primary}" stroke-width="0.8" opacity="0.12"/>`;
  }

  const centralR = 15 + rand() * 20;
  shapes += `<circle cx="${cx}" cy="${cy}" r="${centralR}" fill="url(#centralGlow)" opacity="0.8"/>`;
  shapes += `<circle cx="${cx}" cy="${cy}" r="${centralR * 2}" fill="none" stroke="${primary}" stroke-width="1" opacity="0.2"/>`;
  shapes += `<circle cx="${cx}" cy="${cy}" r="${centralR * 3}" fill="none" stroke="${primary}" stroke-width="0.5" opacity="0.1"/>`;

  const tetraPoints = [];
  for (let i = 0; i < 3; i++) {
    const angle = (i * 120 - 90) * Math.PI / 180;
    tetraPoints.push([cx + Math.cos(angle) * centralR * 1.2, cy + Math.sin(angle) * centralR * 1.2]);
  }
  shapes += `<polygon points="${tetraPoints.map(p => p.join(",")).join(" ")}" fill="none" stroke="${light}" stroke-width="1.5" opacity="0.4"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#0d1b2a"/>
      <stop offset="100%" stop-color="#030810"/>
    </radialGradient>
    <radialGradient id="centralGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${light}" stop-opacity="0.6"/>
      <stop offset="50%" stop-color="${primary}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="${dark}" stop-opacity="0"/>
    </radialGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  ${shapes}
  <text x="${cx}" y="${height - 20}" text-anchor="middle" fill="${primary}" opacity="0.4" font-family="monospace" font-size="9" letter-spacing="4">${concept.toUpperCase()}</text>
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
  console.log(`[IMAGE] Generating procedural visualization for "${img.concept}" (${img.id})`);
  
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

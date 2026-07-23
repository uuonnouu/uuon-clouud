/**
 * CATEGORY CARD GENERATOR — v2
 * Original glass-style SVG glyphs, semantically mapped per category.
 * No external icon packs — avoids any licensing question entirely.
 */

import { pinataService } from '../server/services/pinataService.js';
import fs from 'fs';

const API_URL = process.env.CAPTURE_BASE_URL ? `${process.env.CAPTURE_BASE_URL}/api/shapes/categories` : 'https://uuon.world/api/shapes/categories';
const OUTPUT_MANIFEST = './category-card-manifest-v2.json';

function accentColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return `hsl(${hash % 360}, 75%, 62%)`;
}

function categoryLabel(name) {
  return name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// Original glyph paths, centered roughly in a 0,0–200,200 box.
// Each is a simple geometric form, not copied from anywhere.
const GLYPHS = {
  atom: `<g stroke-width="3" fill="none">
    <circle cx="100" cy="100" r="6" fill="currentColor" stroke="none"/>
    <ellipse cx="100" cy="100" rx="80" ry="30"/>
    <ellipse cx="100" cy="100" rx="80" ry="30" transform="rotate(60 100 100)"/>
    <ellipse cx="100" cy="100" rx="80" ry="30" transform="rotate(120 100 100)"/>
  </g>`,
  helix: `<g stroke-width="4" fill="none">
    <path d="M70 20 C130 50, 70 90, 130 120 C70 150, 130 180, 70 200" />
    <path d="M130 20 C70 50, 130 90, 70 120 C130 150, 70 180, 130 200" />
    <line x1="74" y1="40" x2="126" y2="40"/>
    <line x1="78" y1="80" x2="122" y2="80"/>
    <line x1="78" y1="120" x2="122" y2="120"/>
    <line x1="74" y1="160" x2="126" y2="160"/>
  </g>`,
  hexlattice: `<g stroke-width="3" fill="none">
    <polygon points="100,30 150,60 150,120 100,150 50,120 50,60"/>
    <polygon points="100,60 130,78 130,112 100,130 70,112 70,78"/>
    <line x1="100" y1="30" x2="100" y2="60"/>
    <line x1="150" y1="60" x2="130" y2="78"/>
    <line x1="150" y1="120" x2="130" y2="112"/>
    <line x1="100" y1="150" x2="100" y2="130"/>
    <line x1="50" y1="120" x2="70" y2="112"/>
    <line x1="50" y1="60" x2="70" y2="78"/>
  </g>`,
  wave: `<g stroke-width="4" fill="none">
    <path d="M20 100 Q50 60, 80 100 T140 100 T180 100"/>
    <path d="M20 130 Q50 90, 80 130 T140 130 T180 130" opacity="0.5"/>
    <path d="M20 70 Q50 30, 80 70 T140 70 T180 70" opacity="0.5"/>
  </g>`,
  crystal: `<g stroke-width="3" fill="none">
    <polygon points="100,20 140,80 100,180 60,80"/>
    <line x1="60" y1="80" x2="140" y2="80"/>
    <line x1="100" y1="20" x2="100" y2="180"/>
  </g>`,
  network: `<g stroke-width="3" fill="none">
    <circle cx="100" cy="40" r="10"/>
    <circle cx="50" cy="120" r="10"/>
    <circle cx="150" cy="120" r="10"/>
    <circle cx="100" cy="170" r="10"/>
    <line x1="100" y1="50" x2="55" y2="112"/>
    <line x1="100" y1="50" x2="145" y2="112"/>
    <line x1="58" y1="128" x2="95" y2="165"/>
    <line x1="142" y1="128" x2="105" y2="165"/>
    <line x1="60" y1="120" x2="140" y2="120"/>
  </g>`,
  vortex: `<g stroke-width="4" fill="none">
    <path d="M100 30 A70 70 0 1 1 30 100" />
    <path d="M100 60 A40 40 0 1 1 60 100" />
    <path d="M100 90 A10 10 0 1 1 90 100" />
  </g>`,
  orbit: `<g stroke-width="3" fill="none">
    <circle cx="100" cy="100" r="12" fill="currentColor" stroke="none"/>
    <ellipse cx="100" cy="100" rx="85" ry="35" transform="rotate(20 100 100)"/>
    <circle cx="174" cy="80" r="6" fill="currentColor" stroke="none"/>
  </g>`,
  cube: `<g stroke-width="3" fill="none">
    <polygon points="100,30 160,60 160,130 100,160 40,130 40,60"/>
    <line x1="100" y1="30" x2="100" y2="95"/>
    <line x1="160" y1="60" x2="100" y2="95"/>
    <line x1="40" y1="60" x2="100" y2="95"/>
    <line x1="100" y1="95" x2="100" y2="160"/>
  </g>`,
  pulse: `<g stroke-width="4" fill="none">
    <path d="M20 100 H60 L80 60 L110 140 L130 100 H180"/>
  </g>`,
  knot: `<g stroke-width="3" fill="none">
    <path d="M60 60 C140 60, 60 140, 140 140 C60 140, 140 60, 60 60 Z"/>
  </g>`,
  spiral: `<g stroke-width="3" fill="none">
    <path d="M100 100 m0 -70 a70 70 0 1 1 -49.5 119.5"/>
    <path d="M100 100 m0 -45 a45 45 0 1 1 -31.8 76.8" opacity="0.6"/>
  </g>`,
  grid: `<g stroke-width="3" fill="none">
    <rect x="40" y="40" width="120" height="120"/>
    <line x1="80" y1="40" x2="80" y2="160"/>
    <line x1="120" y1="40" x2="120" y2="160"/>
    <line x1="40" y1="80" x2="160" y2="80"/>
    <line x1="40" y1="120" x2="160" y2="120"/>
  </g>`
};

// Keyword -> glyph mapping. Falls through in order; first match wins.
const GLYPH_RULES = [
  [/quantum|qubit|qpu|entangle|schrodinger|bloch/i, 'atom'],
  [/bio|dna|molecular|protein|diatom|anatomy|tissue|life/i, 'helix'],
  [/crypto|hash|cipher|security|cryptograph/i, 'hexlattice'],
  [/wave|harmon|signal|oscillat|frequency/i, 'wave'],
  [/crystal|gem|mineral|diamond|sacred-geometry/i, 'crystal'],
  [/network|lattice|graph|mesh|neural|ai|ml/i, 'network'],
  [/fractal|chaos|attractor|vortex|spiral/i, 'vortex'],
  [/orbit|planet|astro|cosmic|relativity|gravity|black-hole/i, 'orbit'],
  [/cube|tensor|matrix|algebra|topology|4d|polytope/i, 'cube'],
  [/pulse|field|engine|electromagnetic|maxwell/i, 'pulse'],
  [/knot|link|topology|braid/i, 'knot'],
  [/sequence|set|group|theory|modulo|algorithm/i, 'spiral'],
];

function pickGlyph(name) {
  for (const [pattern, glyph] of GLYPH_RULES) {
    if (pattern.test(name)) return glyph;
  }
  return 'grid'; // fallback for anything unmatched
}

function buildCardSVG(name, count) {
  const label = categoryLabel(name);
  const accent = accentColor(name);
  const glyphKey = pickGlyph(name);
  const glyphMarkup = GLYPHS[glyphKey];
  const gradId = `g-${name.replace(/[^a-z0-9]/gi, '')}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M0 0 H40 V40" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
    </pattern>
    <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0.35"/>
    </linearGradient>
    <filter id="glow-${gradId}" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="800" height="800" fill="#000000"/>
  <rect width="800" height="800" fill="url(#grid)"/>
  <g transform="translate(300,180) scale(1.0)" color="url(#${gradId})" stroke="url(#${gradId})" filter="url(#glow-${gradId})">
    ${glyphMarkup}
  </g>
  <text x="400" y="520" font-family="Arial, sans-serif" font-size="42" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="1">${label.toUpperCase()}</text>
  <text x="400" y="565" font-family="Arial, sans-serif" font-size="22" fill="rgba(255,255,255,0.55)" text-anchor="middle" letter-spacing="2">${count} SHAPES IN THIS CATEGORY</text>
  <line x1="300" y1="610" x2="500" y2="610" stroke="rgba(255,255,255,0.14)" stroke-width="1"/>
  <text x="400" y="650" font-family="Arial, sans-serif" font-size="16" fill="rgba(255,255,255,0.4)" text-anchor="middle" letter-spacing="3">UUON.UUORLD</text>
  <text x="400" y="675" font-family="Arial, sans-serif" font-size="12" fill="rgba(255,255,255,0.3)" text-anchor="middle" letter-spacing="2">DMENSION MATHEMATICAL UNIVERSE</text>
</svg>`;
}

async function main() {
  console.log('Fetching real category list from', API_URL);
  const res = await fetch(API_URL);
  const data = await res.json();

  if (!data.success || !Array.isArray(data.categories)) {
    console.error('Unexpected response shape:', JSON.stringify(data).slice(0, 200));
    process.exit(1);
  }

  console.log(`Loaded ${data.categories.length} real categories.`);

  const manifest = fs.existsSync(OUTPUT_MANIFEST)
    ? JSON.parse(fs.readFileSync(OUTPUT_MANIFEST, 'utf-8'))
    : {};

  let success = 0, failed = 0;

  for (const { name, count } of data.categories) {
    if (manifest[name] && manifest[name].ipfsHash !== 'QmDmensionPlaceholder') {
      console.log(`  (skip, already generated) ${name}`);
      continue;
    }

    const svg = buildCardSVG(name, count);
    const buffer = Buffer.from(svg, 'utf-8');

    try {
      const ipfsHash = await pinataService.uploadFile(buffer, `${name}-card-v2.svg`, 'image/svg+xml');

      if (ipfsHash === 'QmDmensionPlaceholder') {
        console.error(`  ✗ ${name}: Pinata returned a placeholder — treating as a real failure, not success`);
        failed++;
        continue;
      }

      manifest[name] = {
        count,
        glyph: pickGlyph(name),
        ipfsHash,
        imageUri: `ipfs://${ipfsHash}`,
        generatedAt: new Date().toISOString()
      };
      fs.writeFileSync(OUTPUT_MANIFEST, JSON.stringify(manifest, null, 2));
      console.log(`  ✓ ${name} [${pickGlyph(name)}] (${count} shapes) -> ipfs://${ipfsHash}`);
      success++;
    } catch (err) {
      console.error(`  ✗ Upload failed for ${name}:`, err.message);
      failed++;
    }
  }

  console.log(`\nDone. ${success} cards generated, ${failed} failed. Manifest: ${OUTPUT_MANIFEST}`);
}

main();
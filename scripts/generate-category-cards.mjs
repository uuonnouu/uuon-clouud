/**
 * CATEGORY CARD GENERATOR
 *
 * Fetches the real, live category list from /api/shapes/categories,
 * generates one branded SVG card per category (name + real shape count),
 * uploads each through the already-working pinataService.
 *
 * Run with: npx tsx scripts/generate-category-cards.mjs
 */

import { pinataService } from '../server/services/pinataService.js';
import fs from 'fs';

const API_URL = process.env.CAPTURE_BASE_URL ? `${process.env.CAPTURE_BASE_URL}/api/shapes/categories` : 'https://uuon.world/api/shapes/categories';
const OUTPUT_MANIFEST = './category-card-manifest.json';

// Deterministic accent color per category name, so the same category
// always gets the same color across runs — not random, not arbitrary.
function accentColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 60%)`;
}

function categoryLabel(name) {
  return name
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function buildCardSVG(name, count) {
  const label = categoryLabel(name);
  const accent = accentColor(name);
  const initial = label.charAt(0).toUpperCase();

  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M0 0 H40 V40" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="800" height="800" fill="#000000"/>
  <rect width="800" height="800" fill="url(#grid)"/>
  <circle cx="400" cy="300" r="120" fill="none" stroke="${accent}" stroke-width="3" opacity="0.9"/>
  <text x="400" y="335" font-family="Arial, sans-serif" font-size="110" font-weight="800" fill="${accent}" text-anchor="middle">${initial}</text>
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

  console.log(`Loaded ${data.categories.length} real categories, total field: ${data.total}`);

  const manifest = fs.existsSync(OUTPUT_MANIFEST)
    ? JSON.parse(fs.readFileSync(OUTPUT_MANIFEST, 'utf-8'))
    : {};

  let success = 0, failed = 0;

  for (const { name, count } of data.categories) {
    if (manifest[name]) {
      console.log(`  (skip, already generated) ${name}`);
      continue;
    }

    const svg = buildCardSVG(name, count);
    const buffer = Buffer.from(svg, 'utf-8');

    try {
      const ipfsHash = await pinataService.uploadFile(buffer, `${name}-card.svg`, 'image/svg+xml');
      manifest[name] = {
        count,
        ipfsHash,
        imageUri: `ipfs://${ipfsHash}`,
        generatedAt: new Date().toISOString()
      };
      fs.writeFileSync(OUTPUT_MANIFEST, JSON.stringify(manifest, null, 2));
      console.log(`  ✓ ${name} (${count} shapes) -> ipfs://${ipfsHash}`);
      success++;
    } catch (err) {
      console.error(`  ✗ Upload failed for ${name}:`, err.message);
      failed++;
    }
  }

  console.log(`\nDone. ${success} cards generated, ${failed} failed. Manifest: ${OUTPUT_MANIFEST}`);
}

main();
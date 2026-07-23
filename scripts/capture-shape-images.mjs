/**
 * NFT IMAGE CAPTURE SCRIPT
 *
 * Loads each shape via the existing share-link URL convention
 * (client/src/lib/shareURLParser.ts), screenshots the canvas,
 * uploads the PNG through the already-working pinataService,
 * and writes a manifest mapping shapeType -> ipfs hash.
 *
 * Requires: npm install puppeteer --save-dev (run in Replit shell)
 *
 * Usage:
 *   node scripts/capture-shape-images.mjs shapes-input.json
 *
 * shapes-input.json format:
 *   [
 *     { "shapeType": "torus", "parameters": { "a": 2, "b": 0.5 } },
 *     { "shapeType": "klein-bottle", "parameters": { "a": 1 } }
 *   ]
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { pinataService } from '../server/services/pinataService.js'; // adjust path if different

const BASE_URL = process.env.CAPTURE_BASE_URL || 'https://uuon.world/apps';
const OUTPUT_MANIFEST = './capture-manifest.json';
const RENDER_WAIT_MS = 2500; // time for WebGL to settle after navigation
const RATE_LIMIT_MS = 1500;  // pause between captures, be polite to Pinata + your own server

function buildShareURL(shapeType, parameters = {}) {
  const params = new URLSearchParams();
  params.set('shape', shapeType);
  for (const [key, value] of Object.entries(parameters)) {
    params.set(key, String(value));
  }
  return `${BASE_URL}?${params.toString()}`;
}

async function captureOne(browser, shapeType, parameters) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 1024, deviceScaleFactor: 2 });

  const url = buildShareURL(shapeType, parameters);
  console.log(`→ ${shapeType}: ${url}`);

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, RENDER_WAIT_MS));

    // Adjust this selector to whatever the actual canvas element is in your app
    const canvas = await page.$('canvas');
    if (!canvas) {
      console.error(`  ✗ No canvas found for ${shapeType} — check selector`);
      await page.close();
      return null;
    }

    const buffer = await canvas.screenshot({ type: 'png' });
    await page.close();
    return buffer;
  } catch (err) {
    console.error(`  ✗ Failed to capture ${shapeType}:`, err.message);
    await page.close();
    return null;
  }
}

async function main() {
  const inputFile = process.argv[2];
  if (!inputFile) {
    console.error('Usage: node capture-shape-images.mjs <shapes-input.json>');
    process.exit(1);
  }

  const shapes = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));
  console.log(`Loaded ${shapes.length} shapes to capture.`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=swiftshader', '--enable-webgl']
  });

  const manifest = fs.existsSync(OUTPUT_MANIFEST)
    ? JSON.parse(fs.readFileSync(OUTPUT_MANIFEST, 'utf-8'))
    : {};

  let success = 0, failed = 0;

  for (const { shapeType, parameters } of shapes) {
    if (manifest[shapeType]) {
      console.log(`  (skip, already captured) ${shapeType}`);
      continue;
    }

    const buffer = await captureOne(browser, shapeType, parameters);
    if (!buffer) {
      failed++;
      continue;
    }

    try {
      const ipfsHash = await pinataService.uploadFile(buffer, `${shapeType}.png`, 'image/png');
      manifest[shapeType] = {
        ipfsHash,
        imageUri: `ipfs://${ipfsHash}`,
        capturedAt: new Date().toISOString()
      };
      fs.writeFileSync(OUTPUT_MANIFEST, JSON.stringify(manifest, null, 2));
      console.log(`  ✓ ${shapeType} -> ipfs://${ipfsHash}`);
      success++;
    } catch (err) {
      console.error(`  ✗ Upload failed for ${shapeType}:`, err.message);
      failed++;
    }

    await new Promise(r => setTimeout(r, RATE_LIMIT_MS));
  }

  await browser.close();
  console.log(`\nDone. ${success} captured, ${failed} failed. Manifest: ${OUTPUT_MANIFEST}`);
}

main();
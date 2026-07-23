#!/usr/bin/env node
// UUON Shape Validator
// Usage: node validate_shape.js --all | --manifest | <metadata.json>
const fs = require('fs');
const path = require('path');

const GENESIS_HASH = 'cf114022b5e4e1d6fdeb36890f35f605857cf2de93b53ebcb9c8e5652413ca04';

function validateShape(p) {
  const m = JSON.parse(fs.readFileSync(p, 'utf8'));
  const notes = [];
  if (!m.shapeId) notes.push('missing shapeId');
  if (!m.security?.cryptographicHash) notes.push('missing hash');
  if (m.security?.author !== 'UUON Foundation Inc.') notes.push('unexpected author');
  if (!m.scene_bounds) notes.push('missing scene_bounds');
  return { shapeId: m.shapeId, valid: notes.length === 0, notes };
}

const args = process.argv.slice(2);
if (args[0] === '--manifest') {
  const m = JSON.parse(fs.readFileSync(path.join(__dirname,'../MANIFEST.json')));
  console.log('Genesis match:', m.genesis_hash === GENESIS_HASH ? '✓' : '✗');
  console.log('Total shapes:', m.total_shapes);
  let total = 0;
  for (const [k,v] of Object.entries(m.shape_categories)) { console.log(` ${k}: ${v.count}`); total += v.count; }
  console.log('Category total matches manifest:', total === m.total_shapes ? '✓' : '✗');
} else if (args[0] === '--all') {
  const base = path.join(__dirname, '../shapes');
  let passed = 0, failed = 0;
  for (const cat of fs.readdirSync(base)) {
    const cp = path.join(base, cat);
    if (!fs.statSync(cp).isDirectory()) continue;
    for (const f of fs.readdirSync(cp).filter(f => f.endsWith('_metadata.json'))) {
      const r = validateShape(path.join(cp, f));
      console.log((r.valid ? '✓' : '✗') + ' ' + r.shapeId);
      r.valid ? passed++ : failed++;
    }
  }
  console.log(`\n${passed} passed, ${failed} failed`);
} else if (args[0]) {
  const r = validateShape(args[0]);
  console.log(r.valid ? '✓ valid' : '✗ issues: ' + r.notes.join(', '));
} else {
  console.log('Usage: node validate_shape.js --all | --manifest | <metadata.json>');
}

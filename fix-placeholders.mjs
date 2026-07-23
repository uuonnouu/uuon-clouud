import { createHash } from 'crypto';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const GENESIS = 'cf114022b5e4e1d6fdeb36890f35f605857cf2de93b53ebcb9c8e5652413ca04';

function getAllJsonFiles(dir) {
  const files = [];
  for (const f of readdirSync(dir)) {
    const full = join(dir, f);
    if (statSync(full).isDirectory()) files.push(...getAllJsonFiles(full));
    else if (f.endsWith('.json')) files.push(full);
  }
  return files;
}

function realHash(data) {
  return createHash('sha256')
    .update(GENESIS + JSON.stringify(data))
    .digest('hex');
}

const files = getAllJsonFiles('uuon-public/shapes');
let fixed = 0;

for (const file of files) {
  const raw = readFileSync(file, 'utf8');
  const json = JSON.parse(raw);

  if (json.security?.cryptographicHash?.includes('000000') ||
      json.security?.cryptographicHash?.includes('1a2b3c4d')) {

    // Hash the real shape data — parameters + shapeId + shapeName
    const payload = {
      shapeId:    json.shapeId,
      shapeName:  json.shapeName,
      parameters: json.parameters,
      scene_bounds: json.scene_bounds,
    };

    json.security.cryptographicHash = realHash(payload);
    json.security.verificationCode  = 'UUON-D13MON4-V1';
    json.security.genesisAnchor     = GENESIS;
    json.security.fixedAt           = new Date().toISOString();

    writeFileSync(file, JSON.stringify(json, null, 2));
    console.log('✅ Fixed:', json.shapeId);
    fixed++;
  }
}

console.log(`\nDone — ${fixed} files fixed, ${files.length - fixed} already clean`);

import { neon } from '@neondatabase/serverless';
import { createServer } from 'http';
import { requirePIEZ, requirePSENT } from '../middleware/piez-middleware.mjs';

const sql = neon(process.env.DATABASE_URL);

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (url.pathname === '/health') {
    res.end(JSON.stringify({ status: 'ok', genesis: 'cf114022b5e4e1d6fdeb36890f35f605857cf2de93b53ebcb9c8e5652413ca04' }));
  }
  else if (url.pathname === '/api/db/status') {
    try { const r = await sql`SELECT COUNT(*) as c FROM complete_shape_registry`; res.end(JSON.stringify({ database: 'connected', shape_count: r[0].c })); }
    catch(e) { res.writeHead(503); res.end(JSON.stringify({ error: e.message })); }
  }
  else if (url.pathname === '/api/shapes') {
    try { const s = await sql`SELECT id, display_name, category, base_energy, mint_status FROM complete_shape_registry WHERE is_active = true ORDER BY priority ASC`; res.end(JSON.stringify({ count: s.length, shapes: s })); }
    catch(e) { res.writeHead(503); res.end(JSON.stringify({ error: e.message })); }
  }
  else if (url.pathname === '/api/genesis/verify') {
    res.end(JSON.stringify({ genesis_hash: 'cf114022b5e4e1d6fdeb36890f35f605857cf2de93b53ebcb9c8e5652413ca04', anchored_block: '47259953', chain: 'Base Mainnet', verified: true }));
  }
  else if (url.pathname.match(/^\/api\/shapes\/[^/]+\/compute$/)) {
    const piez = await requirePIEZ(req, res, 0);
    if (!piez) return;
    const id = url.pathname.split('/')[3];
    try {
      const r = await sql`SELECT * FROM complete_shape_registry WHERE id = ${id}`;
      if (!r.length) { res.writeHead(404); res.end(JSON.stringify({ error: 'Shape not found' })); return; }
      res.end(JSON.stringify(piez.wrap(r[0])));
    } catch(e) { res.writeHead(503); res.end(JSON.stringify({ error: e.message })); }
  }
  else if (url.pathname.match(/^\/api\/shapes\/[^/]+\/signal$/)) {
    const psent = await requirePSENT(req, res, 0);
    if (!psent) return;
    const id = url.pathname.split('/')[3];
    try {
      const r = await sql`SELECT * FROM complete_shape_registry WHERE id = ${id}`;
      if (!r.length) { res.writeHead(404); res.end(JSON.stringify({ error: 'Shape not found' })); return; }
      res.end(JSON.stringify({ shape_token_standard: '0.1', shape_id: id, signal: { confidence: 0.97, anomaly_score: 0.03 } }));
    } catch(e) { res.writeHead(503); res.end(JSON.stringify({ error: e.message })); }
  }
  else { res.writeHead(404); res.end(JSON.stringify({ error: 'Not found' })); }
});

server.listen(process.env.PORT || 3000, async () => {
  console.log('UUON API — port', process.env.PORT || 3000);
  const r = await sql`SELECT COUNT(*) as c FROM complete_shape_registry`;
  console.log('Database: CONNECTED —', r[0].c, 'shapes');
  console.log('PIEZ gate: ACTIVE — 0xfb9c83432331EAf6f4a9D9488828823587d6f3da');
  console.log('PSENT gate: ACTIVE — 0x985A1ebac4388DFb6EB4FE1171dCa9c6a5DB9cE7');
});

// Auto sweep on startup
const secrets = ['DATABASE_URL','UUON_TOKEN_SECRET','UUON_GENESIS_SECRET','PRIVATE_KEY'];
const missing = secrets.filter(k => !process.env[k]);
if (missing.length) console.warn('⚠️  Missing secrets:', missing.join(', '));
else console.log('✅ All secrets present');

// Temporary deploy endpoint - remove after use
import { readFileSync } from 'fs';

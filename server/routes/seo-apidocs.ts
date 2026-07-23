import { Router } from 'express';
import { seoShell } from '../seoShared';

const router = Router();

interface EndpointDoc {
  id: string;
  path: string;
  methods: string[];
  title: string;
  description: string;
  category: string;
  auth: boolean;
  params?: Array<{ name: string; type: string; required: boolean; description: string }>;
  example_response?: object;
}

const ENDPOINTS: EndpointDoc[] = [
  {
    id: 'engines-list',
    path: '/api/engines',
    methods: ['GET'],
    title: 'List Compute Engines',
    description: 'Returns all available geometric proof engines: Quantum, Relativity, Fractal, and Modulo. Engines return computed geometry only — formula source is never transmitted.',
    category: 'Engines',
    auth: false,
    example_response: { engines: ['ENGINE_QUANTUM', 'ENGINE_RELATIVITY', 'ENGINE_FRACTAL', 'ENGINE_MODULO'], totalEngines: 4 }
  },
  {
    id: 'quantum-shapes',
    path: '/api/engines/quantum/shapes',
    methods: ['GET'],
    title: 'List Quantum Shapes',
    description: 'Returns the catalog of quantum geometry shapes (Bloch sphere, Bell states, hydrogen orbitals, Schrodinger surfaces, and more).',
    category: 'Engines',
    auth: true
  },
  {
    id: 'quantum-render',
    path: '/api/engines/quantum/render',
    methods: ['POST'],
    title: 'Render Quantum Geometry',
    description: 'Computes and returns vertex/normal/UV geometry for a quantum shape. Requires PIEZ or PSENT token balance.',
    category: 'Engines',
    auth: true,
    params: [
      { name: 'shapeId', type: 'string', required: true, description: 'Quantum shape identifier (e.g. bloch_sphere_dynamic)' }
    ]
  },
  {
    id: 'relativity-shapes',
    path: '/api/engines/relativity/shapes',
    methods: ['GET'],
    title: 'List Relativity Shapes',
    description: 'Returns the catalog of relativity geometry shapes (gravitational wave, Lorentz factor, and general relativity surfaces).',
    category: 'Engines',
    auth: true
  },
  {
    id: 'relativity-render',
    path: '/api/engines/relativity/render',
    methods: ['POST'],
    title: 'Render Relativity Geometry',
    description: 'Computes and returns geometry for a relativity shape. Requires PIEZ or PSENT token balance.',
    category: 'Engines',
    auth: true,
    params: [
      { name: 'shapeId', type: 'string', required: true, description: 'Relativity shape identifier' }
    ]
  },
  {
    id: 'fractal-shapes',
    path: '/api/engines/fractal/shapes',
    methods: ['GET'],
    title: 'List Fractal Shapes',
    description: 'Returns the catalog of fractal geometry shapes (Mandelbrot, Burning Ship, fractal dimension analysis, and more).',
    category: 'Engines',
    auth: true
  },
  {
    id: 'fractal-render',
    path: '/api/engines/fractal/render',
    methods: ['POST'],
    title: 'Render Fractal Geometry',
    description: 'Computes and returns geometry for a fractal shape. Requires PIEZ or PSENT token balance.',
    category: 'Engines',
    auth: true,
    params: [
      { name: 'shapeId', type: 'string', required: true, description: 'Fractal shape identifier' }
    ]
  },
  {
    id: 'modulo-shapes',
    path: '/api/engines/modulo/shapes',
    methods: ['GET'],
    title: 'List Modulo Shapes',
    description: 'Returns the catalog of modulo/gmod6 pattern shapes.',
    category: 'Engines',
    auth: true
  },
  {
    id: 'modulo-pattern',
    path: '/api/engines/modulo/pattern',
    methods: ['POST'],
    title: 'Render Modulo Pattern',
    description: 'Computes and returns geometry for a modulo pattern. Requires PIEZ or PSENT token balance.',
    category: 'Engines',
    auth: true,
    params: [
      { name: 'shapeId', type: 'string', required: true, description: 'Modulo shape identifier' }
    ]
  },
  {
    id: 'quantum-compute',
    path: '/api/quantum/runtime/*',
    methods: ['GET', 'POST'],
    title: 'IBM Quantum Runtime (Coming Soon)',
    description: 'Real quantum circuit execution via IBM Qiskit Runtime — Shor\'s algorithm, Grover\'s algorithm, and custom circuits. Activating once IBM Quantum credits are provisioned.',
    category: 'Engines',
    auth: true
  },
  {
    id: 'token-ledger-list',
    path: '/api/token-ledger/list',
    methods: ['GET'],
    title: 'List Tokens',
    description: 'Returns all minted shape tokens with energy levels and verification hashes.',
    category: 'Token Ledger',
    auth: false,
    params: [
      { name: 'limit', type: 'number', required: false, description: 'Page size (default: 50)' },
      { name: 'offset', type: 'number', required: false, description: 'Pagination offset' }
    ]
  },
  {
    id: 'token-ledger-stats',
    path: '/api/token-ledger/stats',
    methods: ['GET'],
    title: 'Token Ledger Stats',
    description: 'Returns aggregate statistics across all minted tokens.',
    category: 'Token Ledger',
    auth: false
  },
  {
    id: 'token-ledger-leaderboard',
    path: '/api/token-ledger/leaderboard',
    methods: ['GET'],
    title: 'Token Leaderboard',
    description: 'Returns the top tokens ranked by energy level.',
    category: 'Token Ledger',
    auth: false
  },
  {
    id: 'token-ledger-detail',
    path: '/api/token-ledger/:tokenId',
    methods: ['GET'],
    title: 'Get Token Detail',
    description: 'Returns full details for a specific token, including its proof and transaction history.',
    category: 'Token Ledger',
    auth: false,
    params: [
      { name: 'tokenId', type: 'string', required: true, description: 'Token identifier' }
    ]
  },
  {
    id: 'token-ecosystem-overview',
    path: '/api/token-ecosystem/ecosystem-overview',
    methods: ['GET'],
    title: 'Token Ecosystem Overview',
    description: 'High-level overview of the UUON/PIEZ/PSENT token ecosystem.',
    category: 'Token Ecosystem',
    auth: false
  },
  {
    id: 'token-ecosystem-search',
    path: '/api/token-ecosystem/search',
    methods: ['GET'],
    title: 'Search Token Ecosystem',
    description: 'Search across tokens, shapes, and benefit categories.',
    category: 'Token Ecosystem',
    auth: false,
    params: [
      { name: 'q', type: 'string', required: true, description: 'Search query' }
    ]
  },
  {
    id: 'nft-smart-contract',
    path: '/api/nft/smart-contract/:network',
    methods: ['GET'],
    title: 'Get NFT Contract Info',
    description: 'Returns smart contract address and metadata for the UUON NFT collection on the given network.',
    category: 'NFT & Wallet',
    auth: false,
    params: [
      { name: 'network', type: 'string', required: true, description: 'Network identifier (e.g. base)' }
    ]
  },
  {
    id: 'nft-marketplace-metadata',
    path: '/api/nft/marketplace-metadata/:tokenId',
    methods: ['GET'],
    title: 'Get NFT Marketplace Metadata',
    description: 'Returns OpenSea-compatible metadata for a minted NFT token.',
    category: 'NFT & Wallet',
    auth: false,
    params: [
      { name: 'tokenId', type: 'string', required: true, description: 'NFT token ID' }
    ]
  },
  {
    id: 'nft-user-nfts',
    path: '/api/nft/user-nfts/:walletAddress',
    methods: ['GET'],
    title: 'Get Wallet NFTs',
    description: 'Returns all UUON NFTs owned by a given wallet address.',
    category: 'NFT & Wallet',
    auth: false,
    params: [
      { name: 'walletAddress', type: 'string', required: true, description: 'EVM wallet address' }
    ]
  },
  {
    id: 'nft-connect-wallet',
    path: '/api/nft/connect-wallet',
    methods: ['POST'],
    title: 'Connect Wallet',
    description: 'Registers a wallet connection for NFT and token purchase flows.',
    category: 'NFT & Wallet',
    auth: false,
    params: [
      { name: 'walletAddress', type: 'string', required: true, description: 'EVM wallet address' }
    ]
  },
  {
    id: 'sdk-info',
    path: '/api/sdk-info',
    methods: ['GET'],
    title: 'SDK Info',
    description: 'Returns SDK version, integration instructions, and available client libraries.',
    category: 'System',
    auth: false
  },
  {
    id: 'health',
    path: '/api/health',
    methods: ['GET'],
    title: 'Health Check',
    description: 'Returns server health status, database connection state, and genesis/merkle anchor.',
    category: 'System',
    auth: false
  }
];

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const METHOD_COLORS: Record<string, string> = {
  GET: '#10b981', POST: '#3b82f6', PUT: '#f59e0b', DELETE: '#ef4444', PATCH: '#8b5cf6'
};

function methodBadge(m: string): string {
  const color = METHOD_COLORS[m] || '#6b7280';
  return `<span style="display:inline-block;padding:2px 8px;border-radius:4px;background:${color}22;color:${color};font-family:monospace;font-size:.72rem;font-weight:700;border:1px solid ${color}44">${m}</span>`;
}

router.get('/', (_req, res) => {
  const byCategory: Record<string, EndpointDoc[]> = {};
  for (const ep of ENDPOINTS) {
    if (!byCategory[ep.category]) byCategory[ep.category] = [];
    byCategory[ep.category].push(ep);
  }

  const sections = Object.entries(byCategory).map(([cat, eps]) => `
    <div>
      <div class="sec-title">${escapeHtml(cat)}</div>
      <div style="margin-top:12px;display:flex;flex-direction:column;gap:10px">
        ${eps.map(ep => `
        <a href="/api/docs/${encodeURIComponent(ep.id)}" class="card" style="text-decoration:none;padding:14px 18px">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px">
            ${ep.methods.map(m => methodBadge(m)).join(' ')}
            <code style="color:#a78bfa;font-size:.82rem">${escapeHtml(ep.path)}</code>
            ${ep.auth ? '<span style="color:#f59e0b;font-size:.72rem">&#128274; Auth required</span>' : ''}
          </div>
          <h3 style="font-size:.88rem;color:#e2e8f0;margin-bottom:2px">${escapeHtml(ep.title)}</h3>
          <p>${escapeHtml(ep.description.substring(0, 100))}${ep.description.length > 100 ? '…' : ''}</p>
        </a>`).join('')}
      </div>
    </div>`).join('');

  const body = `
<div class="wrap">
  <div class="page-hero">
    <div class="page-label">API Reference</div>
    <h1><span>Δmension API</span> Documentation</h1>
    <p>REST API for parametric 3D shape computation, AI analysis, quantum circuits, Digital DNA tokens, and the Universal Lexicon Engine. ${ENDPOINTS.length} documented endpoints.</p>
    <a href="/apis" class="launch-btn">&#9654; Interactive API Explorer</a>
  </div>
  <div class="content">
    <div style="background:var(--bg3);border:1px solid var(--brd);border-radius:12px;padding:16px 20px;margin-bottom:24px">
      <span style="color:#10b981;font-weight:700">Base URL:</span>
      <code style="color:#a78bfa;margin-left:8px">https://uuon.world</code>
      <span style="color:#4b5563;margin-left:16px;font-size:.82rem">No authentication required for most endpoints</span>
    </div>
    ${sections}
  </div>
</div>`;

  const html = seoShell({
    title: 'Δmension API Documentation — Parametric 3D Shapes REST API',
    description: `REST API documentation for Δmension: ${ENDPOINTS.length} endpoints for parametric 3D shapes, AI analysis, quantum circuits, Digital DNA tokens, and mathematical lexicon.`,
    canonical: 'https://uuon.world/api/docs',
    keywords: 'parametric shapes API, 3D mathematics API, REST API documentation, shape generation API, quantum API',
    breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'API Docs', url: '/api/docs' }],
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      name: 'Δmension API Documentation',
      description: `REST API for parametric 3D shapes, AI analysis, quantum circuits, and mathematical tools`,
      url: 'https://uuon.world/api/docs',
      publisher: { '@type': 'Organization', name: 'UUON Foundation', url: 'https://uuon.world' }
    }
  }, body);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=7200');
  res.send(html);
});

router.get('/:endpointId', (req, res) => {
  const { endpointId } = req.params;
  const ep = ENDPOINTS.find(e => e.id === endpointId);

  if (!ep) {
    return res.status(404).send(seoShell({
      title: 'Endpoint Not Found — Δmension API Docs',
      description: 'This API endpoint was not found.',
      canonical: `https://uuon.world/api/docs/${endpointId}`
    }, `<div class="wrap" style="padding:80px 0;text-align:center"><h1 style="color:#6b7280">Endpoint not found</h1><p style="margin-top:12px"><a href="/api/docs">Browse all endpoints →</a></p></div>`));
  }

  const paramsTable = ep.params && ep.params.length > 0
    ? `<table class="params">
        <thead><tr><th>Parameter</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
        <tbody>
          ${ep.params.map(p => `<tr>
            <td class="mono">${escapeHtml(p.name)}</td>
            <td class="mono">${escapeHtml(p.type)}</td>
            <td style="color:${p.required ? '#10b981' : '#6b7280'}">${p.required ? 'Yes' : 'No'}</td>
            <td>${escapeHtml(p.description)}</td>
          </tr>`).join('')}
        </tbody>
      </table>`
    : '<p style="color:#4b5563;font-size:.85rem">No parameters required.</p>';

  const exampleBlock = ep.example_response
    ? `<div class="sec-title" style="margin-top:24px">Example Response</div>
       <div class="eq-block" style="margin-top:12px;color:#10b981">${escapeHtml(JSON.stringify(ep.example_response, null, 2))}</div>`
    : '';

  const related = ENDPOINTS.filter(e => e.id !== ep.id && e.category === ep.category).slice(0, 4);

  const body = `
<div class="wrap">
  <div class="page-hero">
    <div class="page-label">${escapeHtml(ep.category)}</div>
    <h1><span>${escapeHtml(ep.title)}</span></h1>
    <p>${escapeHtml(ep.description)}</p>
    <div style="margin-top:16px;display:flex;gap:10px;align-items:center;flex-wrap:wrap">
      ${ep.methods.map(m => methodBadge(m)).join(' ')}
      <code style="color:#a78bfa;font-size:.9rem">${escapeHtml(ep.path)}</code>
      ${ep.auth ? '<span style="color:#f59e0b;font-size:.82rem">&#128274; API key required</span>' : '<span style="color:#10b981;font-size:.82rem">&#10003; No auth required</span>'}
    </div>
  </div>
  <div class="content">
    <div class="grid-2">
      <div>
        <div class="sec-title">Parameters</div>
        <div class="sec-sub">Request ${ep.methods.includes('GET') ? 'query string' : 'body'} parameters</div>
        ${paramsTable}
        ${exampleBlock}
      </div>
      <div>
        <div class="sec-title">Quick Test</div>
        <div class="sec-sub">Try this endpoint in your browser or with curl</div>
        <div class="eq-block">curl -X ${ep.methods[0]} \\
  https://uuon.world${ep.path.replace(':type', 'torus').replace(':shape', 'torus').replace(':termId', 'genus').replace(':tokenId', '1').replace(':endpointId', ep.id)}</div>
        <div style="margin-top:12px">
          <a href="/apis" class="launch-btn" style="font-size:.82rem;padding:8px 18px">&#9654; Open API Explorer</a>
        </div>
        ${related.length ? `
        <div class="sec-title" style="margin-top:24px">Related Endpoints</div>
        <div style="margin-top:8px;display:flex;flex-direction:column;gap:8px">
          ${related.map(r => `<a href="/api/docs/${encodeURIComponent(r.id)}" style="display:flex;gap:8px;align-items:center;padding:8px 12px;background:var(--bg3);border:1px solid var(--brd);border-radius:8px;text-decoration:none">
            ${r.methods.map(m => methodBadge(m)).join(' ')}
            <span style="color:#c4b5fd;font-size:.82rem">${escapeHtml(r.title)}</span>
          </a>`).join('')}
        </div>` : ''}
      </div>
    </div>
  </div>
</div>`;

  const html = seoShell({
    title: `${ep.title} — ${ep.path} | Δmension API Docs`,
    description: `${ep.title}: ${ep.description.substring(0, 140)}`,
    canonical: `https://uuon.world/api/docs/${ep.id}`,
    keywords: `${ep.title}, ${ep.path}, Δmension API, ${ep.category} API, parametric shapes API`,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'API Docs', url: '/api/docs' },
      { name: ep.title, url: `/api/docs/${ep.id}` }
    ],
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      name: `${ep.title} API Endpoint`,
      description: ep.description,
      url: `https://uuon.world/api/docs/${ep.id}`,
      publisher: { '@type': 'Organization', name: 'UUON Foundation', url: 'https://uuon.world' }
    }
  }, body);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=7200');
  res.send(html);
});

export default router;

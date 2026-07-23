import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const WP_TABS = ['tokenomics', 'architecture', 'roadmap', 'governance', 'waves'] as const;
type WpTab = typeof WP_TABS[number];

const ENGINES = [
  { tier: 'enterprise', name: 'Quantum', desc: 'Wave functions, Schrödinger equation solver, IBM hardware bridge.', count: '15 shapes' },
  { tier: 'professional', name: 'Relativity', desc: 'Einstein field equations, geodesics, gravitational wave geometry.', count: '18 shapes' },
  { tier: 'professional', name: 'Fractal', desc: 'Parametric chaos attractors, recursive geometric structures.', count: '16 shapes' },
  { tier: 'standard', name: 'Modulo', desc: '150 modulo algorithms, cyclic number-theoretic geometry.', count: '5 shapes' },
];

const API_ROWS = [
  { method: 'GET', path: '/api/status', summary: 'Quick operational check — confirms the API is reachable and lists top-level endpoints.', url: 'https://uuon.world/api/status' },
  { method: 'GET', path: '/api/health', summary: 'Service heartbeat — status and timestamp only, used by uptime monitors.', url: 'https://uuon.world/api/health' },
  { method: 'GET', path: '/api/engines', summary: 'Lists all four compute engines with tier, shape count, and sub-endpoints.', url: 'https://uuon.world/api/engines' },
  { method: 'GET', path: '/api/shapes/categories', summary: 'Returns all 107 shape categories with per-category counts across the catalog.', url: 'https://uuon.world/api/shapes/categories' },
  { method: 'GET', path: '/api/sdk-info', summary: 'Unified SDK gateway description — lists shapes, quantum, physics, biology, math modules.', url: 'https://uuon.world/api/sdk-info' },
  { method: 'GET', path: '/api/sdk/discover', summary: 'Discovers available SDK modules and their operations — 12 operations across 4 modules.', url: 'https://uuon.world/api/sdk/discover' },
  { method: 'GET', path: '/api/engines/quantum/shapes', summary: 'Token-gated. Requires PIEZ balance — returns 401/402 without it, geometry with it.', url: 'https://uuon.world/api/engines/quantum/shapes' },
];

export default function LandingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTab, setActiveTab] = useState<WpTab>('tokenomics');

  useEffect(() => {
    // Load fonts used by this page only; doesn't affect rest of app
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;1,8..60,400&family=JetBrains+Mono:wght@400;500&display=swap';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let t = 0;
    let raf: number;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = canvas!.clientWidth * dpr;
      canvas!.height = canvas!.clientHeight * dpr;
      ctx!.scale(dpr, dpr);
    }
    resize();

    function handleResize() {
      ctx!.resetTransform();
      resize();
    }
    window.addEventListener('resize', handleResize);

    function draw() {
      const w = canvas!.clientWidth, h = canvas!.clientHeight;
      ctx!.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;
      const rings = 14;
      for (let r = 0; r < rings; r++) {
        const radius = 20 + r * (Math.min(w, h) / 2 - 30) / rings;
        ctx!.beginPath();
        for (let a = 0; a <= 360; a += 4) {
          const rad = (a * Math.PI) / 180;
          const wave = Math.sin(rad * 5 + t + r * 0.4) * 8 * Math.sin(t * 0.5 + r * 0.2);
          const x = cx + (radius + wave) * Math.cos(rad);
          const y = cy + (radius + wave) * Math.sin(rad) * 0.55;
          if (a === 0) ctx!.moveTo(x, y); else ctx!.lineTo(x, y);
        }
        ctx!.closePath();
        const fade = 1 - r / rings;
        const hue = r % 2 === 0 ? '0,212,255' : '192,133,82';
        ctx!.strokeStyle = `rgba(${hue},${0.5 * fade})`;
        ctx!.lineWidth = 1;
        ctx!.stroke();
      }
      t += 0.012;
      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="dmension-landing">
      <nav>
        <div className="logo-mark">
          <svg viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="#C08552" strokeWidth={2.5} />
            <circle cx="20" cy="20" r="13" stroke="#C08552" strokeWidth={0.6} opacity={0.5} />
            <path d="M16 12 L16 28 M16 12 L22 12 M16 19.5 L21 19.5" stroke="#E0A878" strokeWidth={2.2} strokeLinecap="round" fill="none" />
            <circle cx="20" cy="20" r="1.4" fill="#00D4FF" />
          </svg>
          <div className="logo-wordmark">UUON <span>Foundation</span></div>
        </div>
        <div className="nav-links">
          <button className="nav-link" onClick={() => goTo('engines')}>Engines</button>
          <button className="nav-link" onClick={() => goTo('api-directory')}>API</button>
          <button className="nav-link" onClick={() => goTo('compare')}>Compare</button>
          <button className="nav-link" onClick={() => goTo('whitepaper')}>Whitepaper</button>
          <button className="nav-link" onClick={() => goTo('access')}>Access</button>
          <Link className="nav-link" to="/museum">Museum</Link>
          <Link className="nav-link" to="/showcase">Showcase</Link>
          <a className="nav-link" href="https://github.com/uuonnouu/UUON-State-Root" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
        <button className="nav-cta" onClick={() => goTo('access')}>Get access</button>
      </nav>

      <section className="hero">
        <div className="eyebrow">Mathematical Operating System</div>
        <h1 className="headline">Geometry is the proof.<br /><em>Not a metaphor for it.</em></h1>
        <p className="subhead">Every shape in this system is a cryptographic object. Computed surfaces anchor on-chain as Geometric Proof of Work — the math you query is the asset you hold.</p>

        <div className="hero-canvas-wrap">
          <canvas id="surface" ref={canvasRef}></canvas>
        </div>

        <a href="https://basescan.org/tx/0xaafd9865cedca7932838d7006a27b14898faca5c908e0fa092615f892aea8d05" target="_blank" rel="noopener noreferrer" className="plaque">
          <span className="dot"></span>
          GENESIS · cf114022b5e4e1d6...52413ca04
        </a>

        <div className="hero-ctas">
          <button className="btn-primary" onClick={() => goTo('engines')}>Explore the engines</button>
          <a className="btn-secondary" href="https://uuon.world/api/status" target="_blank" rel="noopener noreferrer">Try the live API</a>
        </div>
      </section>

      <div className="console-strip">
        <div className="console-stat"><div className="num">2,856</div><div className="label">Shapes anchored</div></div>
        <div className="console-stat"><div className="num">107</div><div className="label">Categories</div></div>
        <div className="console-stat"><div className="num">4</div><div className="label">Engines live</div></div>
        <div className="console-stat"><div className="num">Base</div><div className="label">Mainnet</div></div>
      </div>

      <section className="section" id="engines">
        <div className="section-head">
          <div className="section-eyebrow">The instrument panel</div>
          <h2 className="section-title">Four engines. One proof system.</h2>
        </div>
        <div className="engines-grid">
          {ENGINES.map((e, i) => (
            <div className="engine-card" key={i}>
              <div className={`dial tier-${e.tier}`}></div>
              <div className="engine-tier">{e.tier[0].toUpperCase() + e.tier.slice(1)}</div>
              <div className="engine-name">{e.name}</div>
              <div className="engine-desc">{e.desc}</div>
              <div className="engine-count">{e.count}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="api-directory">
        <div className="section-head">
          <div className="section-eyebrow">Live and callable</div>
          <h2 className="section-title">Every endpoint, tested in the open</h2>
          <p className="section-intro">Each link below opens the real, live response from uuon.world in a new tab — not a mock, not a screenshot.</p>
        </div>
        <div className="api-directory">
          {API_ROWS.map((row, i) => (
            <div className="api-row" key={i}>
              <div><div className="api-method">{row.method}</div><div className="api-path">{row.path}</div></div>
              <div className="api-summary">{row.summary}</div>
              <a className="api-try" href={row.url} target="_blank" rel="noopener noreferrer">Open live response</a>
            </div>
          ))}
        </div>
        <div className="api-note">Source: github.com/uuonnouu/UUON-State-Root · Deployed: uuon.world (Railway)</div>
      </section>

      <section className="section" id="access">
        <div className="section-head">
          <div className="section-eyebrow">Token-gated access</div>
          <h2 className="section-title">Two keys to the substrate</h2>
        </div>
        <div className="tokens-grid">
          <div className="token-card">
            <svg className="token-logo" viewBox="0 0 32 32">
              <defs>
                <radialGradient id="bgp" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#0a1a2e" /><stop offset="100%" stopColor="#06060f" /></radialGradient>
                <radialGradient id="corep" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ffffff" /><stop offset="60%" stopColor="#00e5ff" /><stop offset="100%" stopColor="#0077cc" /></radialGradient>
              </defs>
              <circle cx="16" cy="16" r="16" fill="url(#bgp)" />
              <circle cx="16" cy="16" r="15" fill="none" stroke="#00d4ff" strokeWidth={0.9} opacity={0.95} />
              <path d="M 2,16 C 4.5,10 7.5,10 9,16 C 10.5,22 13.5,22 16,16 C 18.5,10 21.5,10 23,16 C 24.5,22 27.5,22 30,16" fill="none" stroke="#00d4ff" strokeWidth={1.1} strokeLinecap="round" opacity={0.92} />
              <circle cx="16" cy="16" r="2.0" fill="#00d4ff" opacity={0.85} />
              <circle cx="16" cy="16" r="1.0" fill="url(#corep)" opacity={0.98} />
            </svg>
            <div className="token-name" style={{ color: 'var(--piez)' }}>PIEZ</div>
            <div className="token-tagline">The compute key</div>
            <p className="token-desc">Gates the Quantum and Relativity engines. The standing wave's anchor node — the one point that doesn't move while everything around it resonates.</p>
            <div className="token-contract">0xfb9c83432331EAf6f4a9D9488828823587d6f3da</div>
            <a className="token-buy piez" href="https://app.uniswap.org/swap?outputCurrency=0xfb9c83432331EAf6f4a9D9488828823587d6f3da&chain=base" target="_blank" rel="noopener noreferrer">Acquire PIEZ on Uniswap</a>
          </div>
          <div className="token-card">
            <svg className="token-logo" viewBox="0 0 32 32">
              <defs>
                <radialGradient id="bgs" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#120a20" /><stop offset="100%" stopColor="#06060f" /></radialGradient>
                <radialGradient id="cores" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#f0d0ff" /><stop offset="100%" stopColor="#a855f7" /></radialGradient>
              </defs>
              <circle cx="16" cy="16" r="16" fill="url(#bgs)" />
              <circle cx="16" cy="16" r="15" fill="none" stroke="#a855f7" strokeWidth={0.9} opacity={0.95} />
              <circle cx="16" cy="16" r="10.5" fill="none" stroke="#8833cc" strokeWidth={0.55} strokeDasharray="2.2 1.8" opacity={0.72} />
              <circle cx="16" cy="16" r="6" fill="none" stroke="#7722bb" strokeWidth={0.55} strokeDasharray="1.4 1.6" opacity={0.62} />
              <circle cx="16" cy="16" r="2.4" fill="#a855f7" />
              <circle cx="16" cy="16" r="1.1" fill="url(#cores)" opacity={0.98} />
            </svg>
            <div className="token-name" style={{ color: 'var(--psent)' }}>PSENT</div>
            <div className="token-tagline">The signal key</div>
            <p className="token-desc">Gates the Fractal and Modulo engines. Pattern detection across scale — structures that recur whether you're reading a coastline or a hash function.</p>
            <div className="token-contract">0x985A1ebac4388DFb6EB4FE1171dCa9c6a5DB9cE7</div>
            <a className="token-buy psent" href="https://app.uniswap.org/swap?outputCurrency=0x985A1ebac4388DFb6EB4FE1171dCa9c6a5DB9cE7&chain=base" target="_blank" rel="noopener noreferrer">Acquire PSENT on Uniswap</a>
          </div>
        </div>

        <div id="compare"></div>
        <div className="section-head" style={{ marginTop: 8 }}>
          <div className="section-eyebrow">Side by side</div>
          <h2 className="section-title">PIEZ vs. PSENT — verified, not estimated</h2>
          <p className="section-intro">Structural facts pulled directly from Base Mainnet contracts. No price chart is shown here because no price oracle is wired up yet — that would mean inventing numbers, and we don't do that. Use the live pool links below for real, real-time price and TVL from Uniswap itself.</p>
        </div>
        <table className="compare-table">
          <thead><tr><th>Property</th><th>PIEZ</th><th>PSENT</th></tr></thead>
          <tbody>
            <tr><td className="label">Gates access to</td><td className="piez-col">Quantum + Relativity engines</td><td className="psent-col">Fractal + Modulo engines</td></tr>
            <tr><td className="label">Tier coverage</td><td className="piez-col">Enterprise + Professional</td><td className="psent-col">Professional + Standard</td></tr>
            <tr><td className="label">Total minted</td><td className="piez-col">10,000,000</td><td className="psent-col">10,000,000</td></tr>
            <tr><td className="label">Chain</td><td className="piez-col">Base Mainnet</td><td className="psent-col">Base Mainnet</td></tr>
            <tr><td className="label">Liquidity pool</td><td className="piez-col">PIEZ/ETH — Uniswap v4</td><td className="psent-col">PSENT/ETH — Uniswap v4</td></tr>
            <tr><td className="label">Contract</td><td className="piez-col">0xfb9c8343...87d6f3da</td><td className="psent-col">0x985A1eba...a5DB9cE7</td></tr>
          </tbody>
        </table>
        <div className="live-pool-panel">
          <div className="live-pool-card piez">
            <div className="pool-label">Live PIEZ/ETH pool — real-time on Uniswap</div>
            <a className="pool-link" href="https://app.uniswap.org/explore/tokens/base/0xfb9c83432331EAf6f4a9D9488828823587d6f3da" target="_blank" rel="noopener noreferrer">View live price &amp; TVL on Uniswap →</a>
          </div>
          <div className="live-pool-card psent">
            <div className="pool-label">Live PSENT/ETH pool — real-time on Uniswap</div>
            <a className="pool-link" href="https://app.uniswap.org/explore/tokens/base/0x985A1ebac4388DFb6EB4FE1171dCa9c6a5DB9cE7" target="_blank" rel="noopener noreferrer">View live price &amp; TVL on Uniswap →</a>
          </div>
        </div>
      </section>

      <section className="section" id="whitepaper">
        <div className="section-head">
          <div className="section-eyebrow">Documentation</div>
          <h2 className="section-title">Whitepaper</h2>
        </div>
        <div className="wp-tabs">
          {WP_TABS.map(tab => (
            <button key={tab} className={`wp-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab === 'waves' ? 'Future Waves' : tab[0].toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className={`wp-panel ${activeTab === 'tokenomics' ? 'active' : ''}`}>
          <h3>Tokenomics</h3>
          <p>Three tokens operate in the UUON ecosystem, each with a distinct, non-overlapping role. UUON is the base ERC-20 representing foundation ownership and is not pooled for trading. PIEZ and PSENT are the only tokens with live liquidity, because they are the only tokens designed for transactional use — gating API access.</p>
          <div className="wp-stat-row">
            <div className="wp-stat"><div className="v">10M</div><div className="l">UUON Hard Cap</div></div>
            <div className="wp-stat"><div className="v">4M</div><div className="l">UUON Circulating</div></div>
            <div className="wp-stat"><div className="v">10M</div><div className="l">PIEZ Minted</div></div>
            <div className="wp-stat"><div className="v">10M</div><div className="l">PSENT Minted</div></div>
          </div>
          <ul>
            <li><strong>UUON (ERC-20):</strong> Foundation ownership token. Not pooled — no open-market trading pair exists by design.</li>
            <li><strong>PIEZ (ERC-20):</strong> Compute-tier access. Required balance gates Quantum and Relativity engine endpoints. Liquidity live on Uniswap v4, Base.</li>
            <li><strong>PSENT (ERC-20):</strong> Signal-tier access. Required balance gates Fractal and Modulo engine endpoints. Liquidity live on Uniswap v4, Base.</li>
            <li><strong>NFT (ERC-1155):</strong> 2,856 unique parametric shapes, each anchored to verified equation DNA, Merkle-rooted on-chain.</li>
          </ul>
          <p>Initial pool pricing was set at 314,159.265359 tokens per ETH for both PIEZ and PSENT — π × 10⁵, a deliberate reference to the project's mathematical foundation rather than an arbitrary number.</p>
        </div>

        <div className={`wp-panel ${activeTab === 'architecture' ? 'active' : ''}`}>
          <h3>Technical Architecture</h3>
          <p>The Dmension Mathematical Universe is a Mathematical Operating System (MOS): parametric 3D geometric shapes function as both the computational output and the cryptographic proof. This is the core inversion from typical blockchain projects — the math is not a feature of the chain, the chain is a ledger for the math.</p>
          <ul>
            <li><strong>Geometric Proof of Work (gPoW):</strong> Validators prove a valid parametric surface was computed within defined mathematical bounds, using a probabilistic confidence-threshold model rather than binary pass/fail — appropriate given that the underlying objects (quantum amplitudes, financial distributions) are themselves probabilistic.</li>
            <li><strong>D13MON4:</strong> The proprietary cryptographic hashing algorithm underlying shape verification. Protected as a trade secret, not patented, and never published in any public repository.</li>
            <li><strong>Engine layer:</strong> Four compute engines (Quantum, Relativity, Fractal, Modulo) expose geometry — vertices, normals, UVs — over token-gated REST endpoints. Formula source code is never transmitted, only the resulting geometry.</li>
            <li><strong>On-chain anchoring:</strong> Shape batches are Merkle-rooted and anchored to Base Mainnet. The current Phase III anchor covers 2,425 equation-DNA shapes out of 2,856 total in the catalog.</li>
          </ul>
        </div>

        <div className={`wp-panel ${activeTab === 'roadmap' ? 'active' : ''}`}>
          <h3>Roadmap</h3>
          <ul>
            <li><strong>Phase 1 (live now):</strong> ERC-20 tokens on Base Mainnet, public API, shape registry, token-gated engine access. This is the current production state of uuon.world.</li>
            <li><strong>Phase 2 (not started):</strong> Cosmos SDK appchain, native gPoW consensus implementation, validator recruitment.</li>
            <li><strong>Phase 3 (future):</strong> Native chain launch, Shape VM with dedicated opcodes (MintShape, TransferShape, FuseShapes, BurnShape, ProveShape), and a transition to quantum-resistant signatures (CRYSTALS-Dilithium + Kyber) — designed in from day one to avoid a future hard fork for post-quantum migration.</li>
          </ul>
        </div>

        <div className={`wp-panel ${activeTab === 'governance' ? 'active' : ''}`}>
          <h3>Governance</h3>
          <p>UUON Foundation Inc. is currently founder-led by Phillip Aguilar Ruiz III, who serves as sole creator and technical lead. This is stated plainly rather than dressed up as decentralized governance it isn't — there is no DAO or token-voting mechanism live today.</p>
          <p>Architectural decisions on sensitive infrastructure are reviewed internally before implementation, with particular scrutiny applied to any component requiring full review before changes proceed. A transition toward broader community governance is part of the long-term roadmap but is not represented as current state.</p>
        </div>

        <div className={`wp-panel ${activeTab === 'waves' ? 'active' : ''}`}>
          <h3>Future Waves — Draft Structure</h3>
          <p style={{ color: 'var(--brass-bright)', fontWeight: 600, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em' }}>⚠ Draft — not yet implemented. Shown for transparency, not as a live feature.</p>
          <p>Beyond PIEZ and PSENT, the long-term token architecture is planned in six waves, where each wave's token count follows the Fibonacci sequence (skipping 0 and 1): 1, 2, 3, 5, 8, 13 — a total of 32 tokens across the full structure.</p>
          <div className="wp-stat-row">
            <div className="wp-stat"><div className="v">1</div><div className="l">Wave 1 — UUON</div></div>
            <div className="wp-stat"><div className="v">2</div><div className="l">Wave 2 — PIEZ, PSENT</div></div>
            <div className="wp-stat"><div className="v">3</div><div className="l">Wave 3 — planned</div></div>
            <div className="wp-stat"><div className="v">5+8+13</div><div className="l">Waves 4–6 — planned</div></div>
          </div>
          <ul>
            <li><strong>Wave progression:</strong> A new wave does not open until the previous wave's tokens reach a defined burn/distribution threshold. This requires a burn-on-use mechanic that does not exist yet — it is a prerequisite, not a detail.</li>
            <li><strong>Shape allocation:</strong> 54 of the catalog's 2,856 shapes are already gated by the live Quantum/Relativity/Fractal/Modulo engines. The remaining ~2,802 are earmarked for future waves, distributed proportionally to wave size.</li>
            <li><strong>Token caps:</strong> Planned at a fixed 10,000,000 per token for consistency, matching UUON/PIEZ/PSENT, unless a specific case emerges for variable caps.</li>
          </ul>
          <p>This structure is documented for transparency. None of waves 3 through 6 are live, named, or scheduled with a date. Treat this section as a roadmap of intent, not a commitment.</p>
        </div>
      </section>

      <footer>
        <div className="footer-top">
          <div className="footer-genesis">GENESIS cf114022b5e4e1d6fdeb36890f35f605857cf2de93b53ebcb9c8e5652413ca04</div>
          <div className="footer-links">
            <a href="https://uuon.world/api/status" target="_blank" rel="noopener noreferrer">API status</a>
            <a href="https://basescan.org/address/0x1981B92B97Ba024BC5663Ce36809Da15B80B22dE" target="_blank" rel="noopener noreferrer">Basescan</a>
            <a href="https://github.com/uuonnouu/UUON-State-Root" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>
        <div className="footer-top">
          <div className="footer-genesis" style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: 10 }}>UUON Foundation Inc.</div>
          <div className="social-row">
            <a href="https://github.com/uuonnouu" target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub">
              <svg viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.11.81 2.25 0 1.635-.015 2.945-.015 3.36 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
            <a href="https://opensea.io/pHIllIHd" target="_blank" rel="noopener noreferrer" aria-label="OpenSea" title="OpenSea">
              <svg viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zM5.92 12.403l.051-.081 3.123-4.884a.107.107 0 01.187.014c.52 1.169.972 2.623.76 3.528-.088.372-.335.876-.614 1.342a2.405 2.405 0 01-.117.199 1.182.182 0 01-.142.063H6.063c-.142 0-.211-.166-.143-.181zm13.914 1.378a.137.137 0 01-.081.128c-.31.142-1.359.65-1.785 1.295-.95 1.461-1.673 3.55-3.295 3.55h-5.46a4.473 4.473 0 01-4.467-4.479v-.1c0-.121.101-.221.227-.221h2.832c.146 0 .259.121.247.262-.012.13.014.262.069.378.121.249.378.402.65.402h2.41V14.6h-2.378c-.149 0-.27-.097-.314-.234-.044-.139.013-.292.143-.366.082-.047.169-.106.262-.171.51-.366 1.36-.974.886-2.103l-1.83-4.347a4.434 4.434 0 014.018-2.51h.005c.246 0 .445.2.445.446v.687c0 .247.2.446.446.446h1.518c.103 0 .186.083.186.186v.973a.186.186 0 01-.186.186h-1.487c-.247 0-.446.2-.446.446v.4c0 .246.2.446.446.446h2.46c.247 0 .446.2.446.446v.973a.186.186 0 01-.186.186h-2.72c-.247 0-.446.2-.446.446v.4c0 .247.2.446.446.446h3.343c.247 0 .446.2.446.446v.973z"/></svg>
            </a>
            <a href="https://www.linkedin.com/in/phillip-aguilar-ruiz-iii-a3a63a238/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn">
              <svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 110-4.124 2.062 2.062 0 010 4.124zM7.119 20.452H3.554V9h3.565v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="https://www.cgtrader.com/designers/uuon-foundation" target="_blank" rel="noopener noreferrer" aria-label="CGTrader" title="CGTrader — 3D models">
              <svg viewBox="0 0 24 24"><path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.25L19.5 8 12 11.75 4.5 8 12 4.25zM4 9.5l7 3.5v7l-7-3.5v-7zm9 10.5v-7l7-3.5v7l-7 3.5z"/></svg>
            </a>
            <a href="https://sketchfab.com/uuon_foundation" target="_blank" rel="noopener noreferrer" aria-label="Sketchfab" title="Sketchfab — 3D models">
              <svg viewBox="0 0 24 24"><path d="M12 0L1.5 6v12L12 24l10.5-6V6L12 0zm0 2.4l8.1 4.7-8.1 4.7-8.1-4.7L12 2.4zM3.4 8.5l7.6 4.4v8.7l-7.6-4.4V8.5zm17.2 0v8.7l-7.6 4.4v-8.7l7.6-4.4z"/></svg>
            </a>
            <a href="https://open.spotify.com/playlist/37i9dQZF1EpshNMxoiuh1m" target="_blank" rel="noopener noreferrer" aria-label="Spotify" title="Spotify">
              <svg viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 4.32-1.32 9.719-.66 13.439 1.62.361.181.54.78.302 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.18-1.2-.18-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

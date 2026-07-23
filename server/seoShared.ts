export interface SeoPageConfig {
  title: string;
  description: string;
  canonical: string;
  ogTitle?: string;
  ogImage?: string;
  keywords?: string;
  jsonLd?: object;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

export function seoShell(config: SeoPageConfig, bodyHtml: string): string {
  const jsonLdScript = config.jsonLd
    ? `<script type="application/ld+json">${JSON.stringify(config.jsonLd)}</script>`
    : '';

  const breadcrumbNav = config.breadcrumbs && config.breadcrumbs.length > 0
    ? `<nav class="breadcrumb" aria-label="breadcrumb">
        ${config.breadcrumbs.map((b, i) =>
          i < config.breadcrumbs!.length - 1
            ? `<a href="${b.url}">${b.name}</a><span aria-hidden="true"> / </span>`
            : `<span>${b.name}</span>`
        ).join('')}
       </nav>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${config.title}</title>
<meta name="description" content="${config.description}">
${config.keywords ? `<meta name="keywords" content="${config.keywords}">` : ''}
<link rel="canonical" href="${config.canonical}">
<meta property="og:title" content="${config.ogTitle || config.title}">
<meta property="og:description" content="${config.description}">
<meta property="og:type" content="website">
<meta property="og:url" content="${config.canonical}">
${config.ogImage ? `<meta property="og:image" content="${config.ogImage}">` : ''}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${config.ogTitle || config.title}">
<meta name="twitter:description" content="${config.description}">
${jsonLdScript}
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{--p:#8b5cf6;--pl:#a78bfa;--pd:#6d28d9;--b:#3b82f6;--c:#06b6d4;--g:#10b981;--bg:#04040e;--bg2:#07071a;--bg3:#0a0a20;--brd:#1e1b4b;--tx:#e2e8f0;--mu:#6b7280}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--tx);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;line-height:1.6;min-height:100vh}
a{color:var(--pl);text-decoration:none}
a:hover{text-decoration:underline}
nav.site-nav{position:sticky;top:0;z-index:100;background:rgba(4,4,14,.95);backdrop-filter:blur(20px);border-bottom:1px solid #0f0f28;padding:0 32px;display:flex;align-items:center;gap:24px;height:52px}
.nav-logo{font-weight:900;font-size:1rem;background:linear-gradient(135deg,#e9d5ff,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-right:auto}
nav.site-nav a{color:#6b7280;font-size:.8rem;font-weight:600;transition:color .15s}
nav.site-nav a:hover{color:#a78bfa;text-decoration:none}
.nav-btn{background:#1e1b4b;color:#a78bfa!important;padding:6px 16px;border-radius:6px;border:1px solid #3730a3}
.nav-btn:hover{background:#3730a3!important}
nav.breadcrumb{padding:10px 32px;background:var(--bg2);border-bottom:1px solid #0f0f28;font-size:.78rem;color:#4b5563}
nav.breadcrumb a{color:#6b7280}
nav.breadcrumb a:hover{color:var(--pl);text-decoration:none}
.wrap{max-width:1020px;margin:0 auto;padding:0 24px}
.page-hero{padding:48px 0 32px;border-bottom:1px solid #0f0f28}
.page-label{color:#7c3aed;font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.14em;display:flex;align-items:center;gap:10px;margin-bottom:10px}
.page-label::after{content:'';flex:1;height:1px;background:#1e1b4b}
.page-hero h1{font-size:clamp(1.8rem,4vw,2.8rem);font-weight:900;letter-spacing:-.04em;line-height:1.1;margin-bottom:12px}
.page-hero h1 span{background:linear-gradient(135deg,#e9d5ff 0%,#a78bfa 40%,#60a5fa 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.page-hero p{color:#9ca3af;max-width:640px;font-size:.95rem}
.launch-btn{display:inline-flex;align-items:center;gap:8px;background:var(--p);color:#fff;padding:10px 24px;border-radius:10px;font-weight:700;font-size:.88rem;margin-top:20px;border:1px solid #7c3aed;transition:all .2s}
.launch-btn:hover{background:#7c3aed;transform:translateY(-1px);box-shadow:0 8px 24px rgba(139,92,246,.3);text-decoration:none}
.content{padding:40px 0 80px}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:20px}
@media(max-width:700px){.grid-2{grid-template-columns:1fr}}
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
@media(max-width:900px){.grid-3{grid-template-columns:repeat(2,1fr)}}
@media(max-width:560px){.grid-3{grid-template-columns:1fr}}
.card{background:var(--bg3);border:1px solid var(--brd);border-radius:14px;padding:20px;position:relative;overflow:hidden}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--p),var(--b),var(--c))}
.card h3{font-size:.95rem;font-weight:700;color:#c4b5fd;margin-bottom:6px}
.card p{color:#6b7280;font-size:.82rem;line-height:1.6}
.card a{font-size:.82rem}
.sec-title{font-size:1.3rem;font-weight:800;letter-spacing:-.03em;margin-bottom:4px;margin-top:32px}
.sec-sub{color:#6b7280;font-size:.85rem;margin-bottom:20px}
.eq-block{background:var(--bg2);border:1px solid #1e1b4b;border-radius:10px;padding:16px 20px;font-family:monospace;font-size:.88rem;color:#a78bfa;overflow-x:auto;white-space:pre-wrap;word-break:break-all}
.tag{display:inline-block;padding:3px 10px;background:#1e1b4b;color:#a78bfa;border-radius:999px;font-size:.72rem;font-weight:600;margin:2px}
.stat-row{display:flex;gap:24px;flex-wrap:wrap;margin:20px 0}
.stat{text-align:center;min-width:80px}
.stat-num{font-size:1.5rem;font-weight:800;background:linear-gradient(135deg,var(--pl),var(--c));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.stat-lab{color:#4b5563;font-size:.65rem;text-transform:uppercase;letter-spacing:.08em;margin-top:2px}
table.params{width:100%;border-collapse:collapse;font-size:.82rem;margin-top:12px}
table.params th{background:#07071a;color:#6b7280;font-weight:600;text-align:left;padding:8px 12px;border-bottom:1px solid #1e1b4b;font-size:.72rem;text-transform:uppercase}
table.params td{padding:8px 12px;border-bottom:1px solid #0f0f28;color:#c4b5fd}
table.params tr:last-child td{border-bottom:none}
table.params td.mono{font-family:monospace;color:#a78bfa}
.related-list{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
footer{border-top:1px solid #0f0f28;padding:32px;text-align:center;color:#374151;font-size:.78rem;background:var(--bg2)}
footer a{color:#4b5563}
</style>
</head>
<body>
<nav class="site-nav">
  <span class="nav-logo">Δmension</span>
  <a href="/shapes">Shapes</a>
  <a href="/glossary">Glossary</a>
  <a href="/developer">API</a>
  <a href="/" class="nav-btn">Launch App</a>
</nav>
${breadcrumbNav}
${bodyHtml}
<footer>
  <div>© 2026 UUON Foundation — Δmension Mathematical Universe &nbsp;·&nbsp;
  <a href="/">Interactive 3D App</a> &nbsp;·&nbsp;
  <a href="/developer">API Docs</a> &nbsp;·&nbsp;
  <a href="/shapes">Browse Shapes</a> &nbsp;·&nbsp;
  <a href="/glossary">Glossary</a>
  </div>
</footer>
</body>
</html>`;
}

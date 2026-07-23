import { Router } from 'express';
import { neon } from '@neondatabase/serverless';
import { seoShell } from '../seoShared';

const router = Router();

function slugToType(slug: string): string {
  return slug.replace(/-/g, '_');
}

function typeToSlug(type: string): string {
  return type.replace(/_/g, '-');
}

function formatEq(val: string | null | undefined): string {
  if (!val) return 'N/A';
  return String(val).substring(0, 300);
}

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

router.get('/', async (_req, res) => {
  if (!process.env.DATABASE_URL) {
    return res.redirect('/');
  }
  try {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`
      SELECT category, COUNT(*) as count
      FROM complete_shape_registry
      WHERE is_active = true OR is_active IS NULL
      GROUP BY category
      ORDER BY count DESC
      LIMIT 60
    `;

    const categoryCards = (rows as any[]).map(r => `
      <a href="/shapes/${encodeURIComponent(String(r.category).toLowerCase().replace(/\s+/g,'-'))}" class="card" style="text-decoration:none">
        <h3>${escapeHtml(r.category || 'General')}</h3>
        <p style="margin-top:4px"><span class="stat-num" style="font-size:1.2rem">${r.count}</span> <span style="color:#4b5563;font-size:.75rem">shapes</span></p>
      </a>`).join('');

    const total = (rows as any[]).reduce((s, r) => s + Number(r.count), 0);

    const body = `
<div class="wrap">
  <div class="page-hero">
    <div class="page-label">Mathematical Universe</div>
    <h1><span>Browse All Shapes</span></h1>
    <p>Explore ${total.toLocaleString()}+ parametric 3D shapes across ${rows.length} mathematical categories — from topology and minimal surfaces to quantum geometry and fractals.</p>
    <a href="/" class="launch-btn">&#9654; Launch Interactive 3D App</a>
  </div>
  <div class="content">
    <div class="sec-title">Categories</div>
    <div class="sec-sub">${rows.length} categories of mathematical surfaces and volumes</div>
    <div class="grid-3">${categoryCards}</div>
  </div>
</div>`;

    const html = seoShell({
      title: 'Parametric 3D Shapes Library — Δmension Mathematical Universe',
      description: `Browse ${total.toLocaleString()}+ mathematically exact 3D parametric shapes across ${rows.length} categories including topology, minimal surfaces, quantum geometry, and fractals.`,
      canonical: 'https://dmension.replit.app/shapes',
      keywords: 'parametric 3D shapes, mathematical surfaces, topology, minimal surfaces, fractal geometry, 3D equations',
      breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'Shapes', url: '/shapes' }],
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Parametric 3D Shapes Library',
        description: `${total.toLocaleString()}+ mathematically exact parametric 3D shapes`,
        url: 'https://dmension.replit.app/shapes',
        publisher: { '@type': 'Organization', name: 'UUON Foundation', url: 'https://dmension.replit.app' }
      }
    }, body);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(html);
  } catch (err) {
    console.error('SEO shapes index error:', err);
    res.redirect('/');
  }
});

router.get('/category/:category', async (req, res) => {
  if (!process.env.DATABASE_URL) return res.redirect('/shapes');
  const { category } = req.params;
  const categoryName = decodeURIComponent(category).replace(/-/g, ' ');
  try {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`
      SELECT shape_type, display_name, seo_keywords, canonical_url, priority
      FROM complete_shape_registry
      WHERE LOWER(category) = LOWER(${categoryName})
         OR LOWER(category) LIKE LOWER(${'%' + categoryName + '%'})
      ORDER BY priority DESC NULLS LAST, display_name
      LIMIT 200
    `;

    if (!rows.length) return res.redirect('/shapes');

    const shapeCards = (rows as any[]).map(r => `
      <a href="/shapes/${typeToSlug(r.shape_type)}" class="card" style="text-decoration:none">
        <h3>${escapeHtml(r.display_name || r.shape_type)}</h3>
        ${r.seo_keywords ? `<p style="margin-top:4px;font-size:.75rem;color:#4b5563">${escapeHtml(String(r.seo_keywords).split(',').slice(0,3).join(' · '))}</p>` : ''}
      </a>`).join('');

    const displayCat = categoryName.replace(/\b\w/g, c => c.toUpperCase());

    const body = `
<div class="wrap">
  <div class="page-hero">
    <div class="page-label">${escapeHtml(displayCat)}</div>
    <h1><span>${escapeHtml(displayCat)}</span> Shapes</h1>
    <p>${rows.length} parametric 3D shapes in the ${escapeHtml(displayCat)} category, each defined by exact mathematical equations.</p>
    <a href="/" class="launch-btn">&#9654; Launch Interactive 3D App</a>
  </div>
  <div class="content">
    <div class="sec-title">Shapes in ${escapeHtml(displayCat)}</div>
    <div class="sec-sub">${rows.length} mathematically exact surfaces</div>
    <div class="grid-3">${shapeCards}</div>
  </div>
</div>`;

    const html = seoShell({
      title: `${displayCat} 3D Shapes — Δmension Mathematical Universe`,
      description: `${rows.length} parametric 3D ${displayCat.toLowerCase()} shapes with exact equations, topological properties, and interactive 3D visualization.`,
      canonical: `https://dmension.replit.app/shapes/category/${category}`,
      keywords: `${displayCat.toLowerCase()} shapes, parametric equations, 3D mathematics, ${categoryName}`,
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Shapes', url: '/shapes' },
        { name: displayCat, url: `/shapes/category/${category}` }
      ],
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${displayCat} 3D Shapes`,
        description: `${rows.length} parametric ${displayCat.toLowerCase()} shapes`,
        url: `https://dmension.replit.app/shapes/category/${category}`
      }
    }, body);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(html);
  } catch (err) {
    console.error('SEO category error:', err);
    res.redirect('/shapes');
  }
});

router.get('/:slug', async (req, res) => {
  if (!process.env.DATABASE_URL) return res.redirect('/');
  const { slug } = req.params;
  const shapeType = slugToType(slug);
  try {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`
      SELECT
        fi.shape_type,
        fi.formula_name,
        fi.equation_x_formula,
        fi.equation_y_formula,
        fi.equation_z_formula,
        fi.default_parameters,
        fi.uv_domain,
        fi.complexity_score,
        fi.category,
        fi.genus,
        fi.orientable,
        fi.closed_surface,
        fi.singularities,
        csr.display_name,
        csr.seo_keywords,
        csr.canonical_url
      FROM formula_implementations fi
      LEFT JOIN complete_shape_registry csr ON csr.shape_type = fi.shape_type
      WHERE fi.shape_type = ${shapeType}
      LIMIT 1
    `;

    if (!rows.length) {
      const fallback = await sql`
        SELECT shape_type, display_name, category, seo_keywords
        FROM complete_shape_registry
        WHERE shape_type = ${shapeType}
        LIMIT 1
      `;
      if (!fallback.length) {
        return res.status(404).send(seoShell({
          title: 'Shape Not Found — Δmension',
          description: 'This shape was not found in the Δmension library.',
          canonical: `https://dmension.replit.app/shapes/${slug}`
        }, `<div class="wrap" style="padding:80px 0;text-align:center"><h1 style="color:#6b7280">Shape not found</h1><p style="margin-top:12px"><a href="/shapes">Browse all shapes →</a></p></div>`));
      }
      const s = fallback[0] as any;
      return res.redirect(301, `/?shape=${s.shape_type}`);
    }

    const s = rows[0] as any;
    const displayName = s.display_name || s.formula_name || s.shape_type;
    const category = s.category || 'Mathematical Shapes';
    const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
    const keywords = s.seo_keywords || `${displayName}, parametric surface, 3D mathematics, ${category}`;
    const complexity = s.complexity_score ? `${s.complexity_score}/10` : 'N/A';

    const params = s.default_parameters
      ? Object.entries(s.default_parameters as Record<string, number>)
          .slice(0, 12)
          .map(([k, v]) => `<tr><td class="mono">${escapeHtml(k)}</td><td>${escapeHtml(String(v))}</td></tr>`)
          .join('')
      : '';

    const uvDomain = s.uv_domain
      ? Object.entries(s.uv_domain as Record<string, number>)
          .map(([k, v]) => `<tr><td class="mono">${escapeHtml(k)}</td><td>${escapeHtml(String(v))}</td></tr>`)
          .join('')
      : '';

    const body = `
<div class="wrap">
  <div class="page-hero">
    <div class="page-label">${escapeHtml(category)}</div>
    <h1><span>${escapeHtml(displayName)}</span></h1>
    <p>Parametric 3D surface defined by exact mathematical equations. Complexity ${complexity}${s.genus !== null && s.genus !== undefined ? ` · Genus ${s.genus}` : ''}${s.orientable !== null ? ` · ${s.orientable ? 'Orientable' : 'Non-orientable'}` : ''}${s.closed_surface !== null ? ` · ${s.closed_surface ? 'Closed' : 'Open'} surface` : ''}.</p>
    <a href="/?shape=${encodeURIComponent(s.shape_type)}" class="launch-btn">&#9654; View Interactive 3D Model</a>
  </div>
  <div class="content">
    <div class="grid-2">
      <div>
        <div class="sec-title">Parametric Equations</div>
        <div class="sec-sub">Exact mathematical definition</div>
        ${s.equation_x_formula ? `<p style="color:#6b7280;font-size:.78rem;margin-bottom:4px;margin-top:8px">x(u,v)</p><div class="eq-block">${escapeHtml(formatEq(s.equation_x_formula))}</div>` : ''}
        ${s.equation_y_formula ? `<p style="color:#6b7280;font-size:.78rem;margin-bottom:4px;margin-top:8px">y(u,v)</p><div class="eq-block">${escapeHtml(formatEq(s.equation_y_formula))}</div>` : ''}
        ${s.equation_z_formula ? `<p style="color:#6b7280;font-size:.78rem;margin-bottom:4px;margin-top:8px">z(u,v)</p><div class="eq-block">${escapeHtml(formatEq(s.equation_z_formula))}</div>` : ''}
      </div>
      <div>
        <div class="sec-title">Topological Properties</div>
        <div class="sec-sub">Mathematical invariants</div>
        <div class="stat-row">
          ${s.complexity_score ? `<div class="stat"><div class="stat-num">${s.complexity_score}</div><div class="stat-lab">Complexity</div></div>` : ''}
          ${s.genus !== null && s.genus !== undefined ? `<div class="stat"><div class="stat-num">${s.genus}</div><div class="stat-lab">Genus</div></div>` : ''}
          ${s.orientable !== null ? `<div class="stat"><div class="stat-num" style="font-size:1rem">${s.orientable ? 'Yes' : 'No'}</div><div class="stat-lab">Orientable</div></div>` : ''}
          ${s.closed_surface !== null ? `<div class="stat"><div class="stat-num" style="font-size:1rem">${s.closed_surface ? 'Yes' : 'No'}</div><div class="stat-lab">Closed</div></div>` : ''}
        </div>
        ${s.singularities ? `<div style="margin-top:12px"><span class="tag">Singularities: ${escapeHtml(s.singularities)}</span></div>` : ''}
        ${params ? `
        <div class="sec-title" style="margin-top:24px">Default Parameters</div>
        <table class="params"><thead><tr><th>Parameter</th><th>Default</th></tr></thead><tbody>${params}</tbody></table>` : ''}
      </div>
    </div>
    ${uvDomain ? `
    <div class="sec-title">UV Domain</div>
    <div class="sec-sub">Parameter sweep ranges for surface generation</div>
    <table class="params" style="max-width:400px"><thead><tr><th>Variable</th><th>Value</th></tr></thead><tbody>${uvDomain}</tbody></table>` : ''}
    <div class="sec-title" style="margin-top:32px">About ${escapeHtml(displayName)}</div>
    <p class="sec-sub">The ${escapeHtml(displayName)} is a parametric 3D surface in the ${escapeHtml(category)} category. It is defined by a set of mathematical equations that map UV parameters to 3D coordinates (x, y, z). This shape can be explored interactively in the Δmension 3D app, exported as GLB/PLY files, and used in game engines, VR environments, or as training data for AI/ML systems.</p>
    <div style="margin-top:16px"><a href="/shapes/category/${encodeURIComponent(categorySlug)}" class="tag" style="font-size:.8rem">&#8592; More ${escapeHtml(category)} shapes</a></div>
  </div>
</div>`;

    const html = seoShell({
      title: `${displayName} — Parametric 3D Surface | Δmension`,
      description: `${displayName}: exact parametric equations, topological properties${s.genus !== null && s.genus !== undefined ? `, genus ${s.genus}` : ''}, and interactive 3D visualization. Part of the ${category} category.`,
      canonical: s.canonical_url || `https://dmension.replit.app/shapes/${slug}`,
      keywords: String(keywords),
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Shapes', url: '/shapes' },
        { name: category, url: `/shapes/category/${categorySlug}` },
        { name: displayName, url: `/shapes/${slug}` }
      ],
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'LearningResource',
        name: displayName,
        description: `Parametric 3D mathematical surface: ${displayName}. Category: ${category}.`,
        url: s.canonical_url || `https://dmension.replit.app/shapes/${slug}`,
        educationalLevel: 'university',
        learningResourceType: '3D Mathematical Surface',
        keywords: String(keywords),
        publisher: { '@type': 'Organization', name: 'UUON Foundation', url: 'https://dmension.replit.app' }
      }
    }, body);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(html);
  } catch (err) {
    console.error('SEO shape page error:', err);
    res.redirect(`/?shape=${shapeType}`);
  }
});

export default router;

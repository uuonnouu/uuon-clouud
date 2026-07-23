import { Router } from 'express';
import { seoShell } from '../seoShared';

const router = Router();

interface GlossaryEntry {
  id: string;
  term: string;
  type: string;
  definition: string;
  synonyms: string[];
  category: string;
  seoTags: string[];
  formula?: string;
}

const GLOSSARY: GlossaryEntry[] = [
  { id: 'genus', term: 'Genus', type: 'concept', definition: 'The number of "holes" or handles in a closed surface. A sphere has genus 0, a torus has genus 1, a double torus has genus 2. The genus is a topological invariant — it does not change under continuous deformation.', synonyms: ['topological genus', 'handle number'], category: 'Topology', seoTags: ['topology', 'surfaces', 'invariant'], formula: 'χ = 2 − 2g (Euler characteristic for orientable surfaces)' },
  { id: 'euler-characteristic', term: 'Euler Characteristic', type: 'formula', definition: 'A topological invariant χ = V − E + F (vertices minus edges plus faces) for polyhedra, or χ = 2 − 2g for orientable closed surfaces. For a sphere χ = 2, for a torus χ = 0, for a Klein bottle χ = 0.', synonyms: ['Euler number', 'χ (chi)'], category: 'Topology', seoTags: ['topology', 'polyhedra', 'invariant'], formula: 'χ = V − E + F = 2 − 2g' },
  { id: 'parametric-surface', term: 'Parametric Surface', type: 'concept', definition: 'A surface defined by mapping two parameters (u, v) to 3D coordinates via functions x(u,v), y(u,v), z(u,v). This allows exact mathematical description of complex curved surfaces like tori, helicoids, and minimal surfaces.', synonyms: ['parametric map', 'UV surface'], category: 'Differential Geometry', seoTags: ['geometry', 'surface', 'equations'], formula: 'r(u,v) = (x(u,v), y(u,v), z(u,v))' },
  { id: 'minimal-surface', term: 'Minimal Surface', type: 'concept', definition: 'A surface that locally minimizes area — equivalently, a surface with zero mean curvature (H = 0) everywhere. Examples include soap films spanning wire frames, the catenoid (only minimal surface of revolution), helicoid, and Enneper surface.', synonyms: ['zero mean curvature surface', 'soap film surface'], category: 'Differential Geometry', seoTags: ['calculus of variations', 'soap films', 'curvature'], formula: 'H = (κ₁ + κ₂) / 2 = 0' },
  { id: 'gaussian-curvature', term: 'Gaussian Curvature', type: 'formula', definition: 'The product of the two principal curvatures K = κ₁ · κ₂. Positive for elliptic surfaces (sphere), zero for flat surfaces (plane, cylinder), negative for hyperbolic surfaces (saddle). Gaussian curvature is an intrinsic property — it does not change under bending.', synonyms: ['total curvature', 'intrinsic curvature', 'K'], category: 'Differential Geometry', seoTags: ['curvature', 'differential geometry', 'Gauss'], formula: 'K = κ₁ · κ₂ = det(II) / det(I)' },
  { id: 'orientability', term: 'Orientability', type: 'concept', definition: 'A surface is orientable if it has two distinct sides (like a sphere or torus). Non-orientable surfaces like the Möbius strip and Klein bottle have no consistent "inside" and "outside" — a path can continuously connect the two apparent sides.', synonyms: ['orientable surface', 'two-sided surface'], category: 'Topology', seoTags: ['topology', 'Möbius strip', 'Klein bottle'] },
  { id: 'betti-numbers', term: 'Betti Numbers', type: 'concept', definition: 'Topological invariants (β₀, β₁, β₂, ...) that count independent cycles of each dimension. β₀ = connected components, β₁ = independent loops (handles), β₂ = enclosed voids. Together they determine the Euler characteristic: χ = β₀ − β₁ + β₂.', synonyms: ['homology ranks', 'βₙ'], category: 'Algebraic Topology', seoTags: ['homology', 'topology', 'cycles'], formula: 'χ = Σ(−1)ⁿ βₙ' },
  { id: 'mean-curvature', term: 'Mean Curvature', type: 'formula', definition: 'The arithmetic mean of the principal curvatures H = (κ₁ + κ₂)/2. Minimal surfaces have H = 0 everywhere. The mean curvature vector points in the direction of fastest area decrease. It governs the shape of soap films and biological membranes.', synonyms: ['H', 'average curvature'], category: 'Differential Geometry', seoTags: ['curvature', 'principal curvatures', 'mean'], formula: 'H = (κ₁ + κ₂) / 2' },
  { id: 'manifold', term: 'Manifold', type: 'concept', definition: 'A topological space that locally resembles Euclidean space of a given dimension. A 2-manifold (surface) looks like a flat plane at every point. Smooth manifolds support calculus. The sphere, torus, and all parametric surfaces in Δmension are 2-manifolds embedded in 3D space.', synonyms: ['topological manifold', 'smooth manifold', 'n-manifold'], category: 'Topology', seoTags: ['topology', 'differential geometry', 'smooth'] },
  { id: 'immersion', term: 'Immersion', type: 'concept', definition: 'A smooth map from one manifold to another where the derivative is everywhere injective (no "pinching"), but the map may have self-intersections. Boy\'s surface and the Roman surface are immersions of the real projective plane RP² in ℝ³ — they are smooth but self-intersect.', synonyms: ['smooth immersion', 'immersed surface'], category: 'Differential Topology', seoTags: ['topology', 'Boy surface', 'self-intersection'] },
  { id: 'fractal-dimension', term: 'Fractal Dimension', type: 'formula', definition: 'A non-integer measure of how a fractal fills space, typically the Hausdorff dimension. For the Menger sponge D ≈ 2.727, for the Mandelbrot set boundary D ≈ 2. Unlike topological dimension, fractal dimension can be fractional.', synonyms: ['Hausdorff dimension', 'box-counting dimension'], category: 'Fractal Geometry', seoTags: ['fractals', 'chaos theory', 'self-similarity'], formula: 'D = log(N) / log(1/r)' },
  { id: 'weierstrass-enneper', term: 'Weierstrass–Enneper Representation', type: 'formula', definition: 'A way to construct all conformal minimal surfaces using complex analysis. Given a holomorphic function f and a meromorphic function g, the Weierstrass data (f, g) generates a minimal surface via integration. Used to define the Costa surface, Enneper surface, and catenoid.', synonyms: ['Weierstrass representation', 'complex representation of minimal surfaces'], category: 'Differential Geometry', seoTags: ['minimal surfaces', 'complex analysis', 'conformal'] },
  { id: 'geodesic', term: 'Geodesic', type: 'concept', definition: 'The shortest path between two points on a curved surface. On a sphere, geodesics are great circles. On a torus, they can wind around the surface multiple times. Geodesics generalize the concept of a straight line to curved spaces and play a fundamental role in general relativity.', synonyms: ['shortest path', 'geodesic curve'], category: 'Differential Geometry', seoTags: ['shortest path', 'Riemannian geometry', 'great circle'] },
  { id: 'fiber-bundle', term: 'Fiber Bundle', type: 'concept', definition: 'A mathematical structure where each point of a base space B has an attached fiber space F, creating a total space E. The Hopf fibration maps S³ → S² with fiber S¹ — every point on the 2-sphere corresponds to a circle of points on the 3-sphere. Fundamental to gauge field theories in physics.', synonyms: ['fibration', 'principal bundle'], category: 'Algebraic Topology', seoTags: ['Hopf fibration', 'gauge theory', 'topology'] },
  { id: 'knot-invariant', term: 'Knot Invariant', type: 'concept', definition: 'A quantity that remains unchanged under deformations of a knot, used to distinguish different knot types. Examples include the knot group (fundamental group of the complement), Alexander polynomial, Jones polynomial, and HOMFLY polynomial. The trefoil knot is the simplest non-trivial knot.', synonyms: ['topological invariant', 'knot polynomial'], category: 'Knot Theory', seoTags: ['knots', 'topology', 'trefoil'] },
];

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

router.get('/', (_req, res) => {
  const byCategory: Record<string, GlossaryEntry[]> = {};
  for (const e of GLOSSARY) {
    if (!byCategory[e.category]) byCategory[e.category] = [];
    byCategory[e.category].push(e);
  }

  const sections = Object.entries(byCategory).map(([cat, entries]) => `
    <div>
      <div class="sec-title">${escapeHtml(cat)}</div>
      <div class="grid-3" style="margin-top:12px">
        ${entries.map(e => `
        <a href="/glossary/${encodeURIComponent(e.id)}" class="card" style="text-decoration:none">
          <h3>${escapeHtml(e.term)}</h3>
          <p>${escapeHtml(e.definition.substring(0, 90))}…</p>
        </a>`).join('')}
      </div>
    </div>`).join('');

  const body = `
<div class="wrap">
  <div class="page-hero">
    <div class="page-label">Mathematical Reference</div>
    <h1><span>Math Glossary</span></h1>
    <p>Definitions for ${GLOSSARY.length}+ core mathematical concepts used across the Δmension shape library — topology, differential geometry, fractal theory, and more.</p>
    <a href="/" class="launch-btn">&#9654; Launch Interactive 3D App</a>
  </div>
  <div class="content">${sections}</div>
</div>`;

  const html = seoShell({
    title: 'Mathematical Glossary — Topology, Geometry, Fractals | Δmension',
    description: `Definitions for ${GLOSSARY.length}+ mathematical concepts — genus, Euler characteristic, minimal surfaces, Gaussian curvature, Betti numbers, manifolds, and more.`,
    canonical: 'https://dmension.replit.app/glossary',
    keywords: 'mathematical glossary, topology terms, differential geometry, fractal dimension, genus, Euler characteristic',
    breadcrumbs: [{ name: 'Home', url: '/' }, { name: 'Glossary', url: '/glossary' }],
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'DefinedTermSet',
      name: 'Δmension Mathematical Glossary',
      description: `Reference definitions for mathematical concepts used in parametric 3D geometry`,
      url: 'https://dmension.replit.app/glossary'
    }
  }, body);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=7200');
  res.send(html);
});

router.get('/:termId', (req, res) => {
  const { termId } = req.params;
  const entry = GLOSSARY.find(e => e.id === termId.toLowerCase());

  if (!entry) {
    return res.status(404).send(seoShell({
      title: 'Term Not Found — Δmension Glossary',
      description: 'This mathematical term was not found.',
      canonical: `https://dmension.replit.app/glossary/${termId}`
    }, `<div class="wrap" style="padding:80px 0;text-align:center"><h1 style="color:#6b7280">Term not found</h1><p style="margin-top:12px"><a href="/glossary">Browse the glossary →</a></p></div>`));
  }

  const related = GLOSSARY
    .filter(e => e.id !== entry.id && e.category === entry.category)
    .slice(0, 6);

  const body = `
<div class="wrap">
  <div class="page-hero">
    <div class="page-label">${escapeHtml(entry.category)}</div>
    <h1><span>${escapeHtml(entry.term)}</span></h1>
    <p>${escapeHtml(entry.definition)}</p>
    <a href="/" class="launch-btn">&#9654; Explore in 3D App</a>
  </div>
  <div class="content">
    ${entry.formula ? `
    <div class="sec-title">Formula</div>
    <div class="eq-block" style="margin-top:12px">${escapeHtml(entry.formula)}</div>` : ''}
    ${entry.synonyms?.length ? `
    <div class="sec-title" style="margin-top:24px">Also Known As</div>
    <div style="margin-top:8px">${entry.synonyms.map(s => `<span class="tag">${escapeHtml(s)}</span>`).join(' ')}</div>` : ''}
    ${entry.seoTags?.length ? `
    <div class="sec-title" style="margin-top:24px">Related Topics</div>
    <div style="margin-top:8px">${entry.seoTags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join(' ')}</div>` : ''}
    ${related.length ? `
    <div class="sec-title" style="margin-top:32px">More ${escapeHtml(entry.category)} Terms</div>
    <div class="grid-3" style="margin-top:12px">
      ${related.map(r => `
      <a href="/glossary/${encodeURIComponent(r.id)}" class="card" style="text-decoration:none">
        <h3>${escapeHtml(r.term)}</h3>
        <p>${escapeHtml(r.definition.substring(0, 80))}…</p>
      </a>`).join('')}
    </div>` : ''}
  </div>
</div>`;

  const html = seoShell({
    title: `${entry.term} — Mathematical Definition | Δmension Glossary`,
    description: `${entry.term}: ${entry.definition.substring(0, 155)}`,
    canonical: `https://dmension.replit.app/glossary/${entry.id}`,
    keywords: `${entry.term}, ${entry.synonyms?.join(', ')}, ${entry.seoTags?.join(', ')}`,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Glossary', url: '/glossary' },
      { name: entry.term, url: `/glossary/${entry.id}` }
    ],
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      name: entry.term,
      description: entry.definition,
      url: `https://dmension.replit.app/glossary/${entry.id}`,
      termCode: entry.id,
      inDefinedTermSet: {
        '@type': 'DefinedTermSet',
        name: 'Δmension Mathematical Glossary',
        url: 'https://dmension.replit.app/glossary'
      }
    }
  }, body);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=7200');
  res.send(html);
});

export default router;

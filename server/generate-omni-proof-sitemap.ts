import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as fs from 'fs';
import { formula_implementations } from '@shared/schema';
import { sql } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL!;
const sqlNeon = neon(connectionString);
const db = drizzle(sqlNeon);

interface ProofCategory {
  name: string;
  displayName: string;
  description: string;
  scientificImpact: string;
}

const PROOF_CATEGORIES: ProofCategory[] = [
  {
    name: 'cryptography',
    displayName: 'Cryptographic Proofs',
    description: 'Zero-knowledge proofs, hash collision resistance, elliptic curve security, and post-quantum algorithms',
    scientificImpact: 'Secures global financial systems, enables blockchain technology, protects digital identity'
  },
  {
    name: 'algorithms',
    displayName: 'Algorithm Verification',
    description: 'Computational complexity proofs, optimization guarantees, and algorithmic correctness',
    scientificImpact: 'Enables AI/ML systems, proves computational limits, optimizes resource allocation'
  },
  {
    name: 'quantum-mechanics',
    displayName: 'Quantum Proofs',
    description: 'Bell inequalities, uncertainty principles, quantum supremacy demonstrations',
    scientificImpact: 'Foundation of quantum computing, quantum cryptography, and quantum sensing'
  },
  {
    name: 'quantum-gravity',
    displayName: 'Quantum Gravity Proofs',
    description: 'Planck-scale physics, spacetime quantization, loop quantum gravity',
    scientificImpact: 'Unifying general relativity with quantum mechanics, understanding singularities'
  },
  {
    name: 'general-relativity',
    displayName: 'Relativistic Proofs',
    description: 'Einstein field equations, black hole solutions, gravitational wave predictions',
    scientificImpact: 'GPS corrections, gravitational lensing, understanding cosmic structure'
  },
  {
    name: 'theory-of-everything',
    displayName: 'Unification Proofs',
    description: 'String theory mathematics, supersymmetry, grand unified theories',
    scientificImpact: 'Quest for a single framework explaining all fundamental forces'
  },
  {
    name: 'topology',
    displayName: 'Topological Proofs',
    description: 'Knot invariants, manifold classification, homology and cohomology',
    scientificImpact: 'DNA topology, material science, quantum computing error correction'
  },
  {
    name: '4d-hyperdimensional',
    displayName: 'Higher-Dimensional Proofs',
    description: '4D polytopes, SO(4) rotations, hyperdimensional geometry',
    scientificImpact: 'Understanding extra dimensions, string theory compactification'
  },
  {
    name: 'fractals',
    displayName: 'Fractal & Chaos Proofs',
    description: 'Strange attractors, universal constants, self-similarity demonstrations',
    scientificImpact: 'Weather prediction limits, market dynamics, natural pattern formation'
  },
  {
    name: 'molecular-biology',
    displayName: 'Biological Proofs',
    description: 'DNA information theory, protein folding landscapes, evolutionary algorithms',
    scientificImpact: 'Drug discovery, synthetic biology, understanding life itself'
  },
  {
    name: 'sacred-geometry',
    displayName: 'Sacred Geometry Proofs',
    description: 'Golden ratio optimality, Platonic solid classification, harmonic proportions',
    scientificImpact: 'Architecture, art, natural pattern optimization'
  },
  {
    name: 'uuon-acas',
    displayName: 'UUON-ACAS Verification',
    description: 'Autonomous beacon synchronization, consciousness field models, E Pluribus Unum convergence',
    scientificImpact: 'Next-generation AI, collective intelligence, autonomous systems'
  }
];

async function generateOmniProofSitemap() {
  const baseUrl = 'https://uuon.world';
  const today = new Date().toISOString().split('T')[0];
  
  console.log('🔮 GENERATING OMNI-PROOF SITEMAP...');
  
  // Get all shapes grouped by category
  const allShapes = await db.select().from(formula_implementations);
  
  const shapesByCategory: Record<string, any[]> = {};
  allShapes.forEach(shape => {
    if (!shapesByCategory[shape.category]) {
      shapesByCategory[shape.category] = [];
    }
    shapesByCategory[shape.category].push(shape);
  });
  
  // Generate main omni-proof sitemap
  let omniProofUrls = '';
  
  // Add main proofs landing page
  omniProofUrls += `  <url>
    <loc>${baseUrl}/proofs</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>\n`;
  
  // Add each proof category and its shapes
  for (const category of PROOF_CATEGORIES) {
    const shapes = shapesByCategory[category.name] || [];
    
    // Category page
    omniProofUrls += `  <url>
    <loc>${baseUrl}/proofs/${category.name}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>\n`;
    
    // Individual proof pages
    for (const shape of shapes) {
      omniProofUrls += `  <url>
    <loc>${baseUrl}/proof/${shape.shape_type}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
    }
  }
  
  const omniProofSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${omniProofUrls}</urlset>`;
  
  fs.writeFileSync('client/public/sitemap-omni-proofs.xml', omniProofSitemap);
  console.log('✅ Generated sitemap-omni-proofs.xml');
  
  // Generate proof navigation JSON for frontend
  const proofNavigation = PROOF_CATEGORIES.map(cat => ({
    category: cat.name,
    displayName: cat.displayName,
    description: cat.description,
    scientificImpact: cat.scientificImpact,
    count: (shapesByCategory[cat.name] || []).length,
    shapes: (shapesByCategory[cat.name] || []).map(s => ({
      id: s.shape_type,
      url: `${baseUrl}/proof/${s.shape_type}`
    }))
  }));
  
  fs.writeFileSync('client/public/proof-navigation.json', JSON.stringify(proofNavigation, null, 2));
  console.log('✅ Generated proof-navigation.json');
  
  // Update sitemap-index.xml to include omni-proofs
  const existingIndex = fs.readFileSync('client/public/sitemap-index.xml', 'utf-8');
  if (!existingIndex.includes('sitemap-omni-proofs.xml')) {
    const updatedIndex = existingIndex.replace(
      '</sitemapindex>',
      `  <sitemap>
    <loc>${baseUrl}/sitemap-omni-proofs.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`
    );
    fs.writeFileSync('client/public/sitemap-index.xml', updatedIndex);
    console.log('✅ Updated sitemap-index.xml with omni-proofs');
  }
  
  // Print summary
  console.log('\n🎯 OMNI-PROOF SITEMAP COMPLETE!');
  console.log('═══════════════════════════════════════════════════════════');
  for (const cat of PROOF_CATEGORIES) {
    const count = (shapesByCategory[cat.name] || []).length;
    console.log(`📐 ${cat.displayName}: ${count} proofs`);
  }
  const totalProofs = PROOF_CATEGORIES.reduce((sum, cat) => sum + (shapesByCategory[cat.name] || []).length, 0);
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`📊 Total proof algorithms: ${totalProofs}`);
}

generateOmniProofSitemap().catch(console.error);


import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as fs from 'fs';
import { formula_implementations } from '@shared/schema';

const connectionString = process.env.DATABASE_URL!;
const sql = neon(connectionString);
const db = drizzle(sql);

interface SitemapNode {
  identifier: string;
  type: string;
  category?: string;
  algorithms?: string[];
  engines?: string[];
  url: string;
  lastmod: string;
  changefreq: string;
  priority: number;
  breadcrumb: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  schemaType: string;
}

interface SitemapFramework {
  categories: SitemapNode[];
  algorithms: SitemapNode[];
  engines: SitemapNode[];
  assets: SitemapNode[];
  api: SitemapNode[];
  products: SitemapNode[];
  documentation: SitemapNode[];
}

export class StandardizedSitemapGenerator {
  private baseUrl = 'https://uuon.world';
  private today = new Date().toISOString().split('T')[0];

  async generateSitemapFramework(): Promise<SitemapFramework> {
    const allShapes = await db.select().from(formula_implementations);
    
    // Abstract algorithm mapping
    const algorithmMap = new Map<string, SitemapNode>();
    const engineMap = new Map<string, SitemapNode>();
    const categoryMap = new Map<string, SitemapNode>();
    
    // Generate abstract categories
    const categories = [...new Set(allShapes.map(s => s.category))];
    categories.forEach((cat, index) => {
      const categoryId = `CATEGORY_${cat.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`;
      categoryMap.set(categoryId, {
        identifier: categoryId,
        type: 'Category',
        url: `${this.baseUrl}/category/${cat}`,
        lastmod: this.today,
        changefreq: 'weekly',
        priority: 1.0,
        breadcrumb: `Home > ${this.capitalizeWords(cat)}`,
        seoTitle: `${this.capitalizeWords(cat)} Mathematical Algorithms`,
        seoDescription: `Advanced ${cat} computational engines and mathematical algorithms for scientific visualization`,
        keywords: [cat, 'algorithms', 'mathematical', 'computational', 'visualization'],
        schemaType: 'Category'
      });
    });

    // Generate abstract algorithms
    allShapes.forEach((shape, index) => {
      const algoId = `ALGO${String(index + 1).padStart(3, '0')}`;
      const categoryId = `CATEGORY_${shape.category.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`;
      
      algorithmMap.set(algoId, {
        identifier: algoId,
        type: 'Algorithm',
        category: categoryId,
        url: `${this.baseUrl}/algorithm/${algoId}`,
        lastmod: this.today,
        changefreq: 'weekly',
        priority: 0.9,
        breadcrumb: `Home > ${this.capitalizeWords(shape.category)} > ${algoId}`,
        seoTitle: `${this.capitalizeWords(shape.category)} Algorithm ${algoId}`,
        seoDescription: `Abstract mathematical algorithm for ${shape.category} computational visualization`,
        keywords: [shape.category, 'algorithm', 'mathematical', 'computational'],
        schemaType: 'Algorithm'
      });
    });

    // Generate abstract engines
    const engineGroups = this.groupAlgorithmsIntoEngines(Array.from(algorithmMap.values()));
    engineGroups.forEach((engine, index) => {
      const engineId = `ENGINE${String(index + 1).padStart(3, '0')}`;
      engineMap.set(engineId, {
        identifier: engineId,
        type: 'Engine',
        category: engine.category,
        algorithms: engine.algorithms,
        url: `${this.baseUrl}/engine/${engineId}`,
        lastmod: this.today,
        changefreq: 'weekly',
        priority: 1.0,
        breadcrumb: `Home > Engine > ${engineId}`,
        seoTitle: `Mathematical Engine ${engineId}`,
        seoDescription: `Computational engine implementing multiple algorithms for visualization`,
        keywords: ['engine', 'mathematical', 'computational', 'visualization'],
        schemaType: 'Engine'
      });
    });

    return {
      categories: Array.from(categoryMap.values()),
      algorithms: Array.from(algorithmMap.values()),
      engines: Array.from(engineMap.values()),
      assets: this.generateAssetNodes(Array.from(engineMap.values())),
      api: this.generateAPINodes(Array.from(engineMap.values())),
      products: this.generateProductNodes(Array.from(engineMap.values())),
      documentation: this.generateDocumentationNodes(Array.from(categoryMap.values()))
    };
  }

  generateSitemapIndex(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${this.baseUrl}/sitemap-categories.xml</loc>
    <lastmod>${this.today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${this.baseUrl}/sitemap-algorithms.xml</loc>
    <lastmod>${this.today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${this.baseUrl}/sitemap-engines.xml</loc>
    <lastmod>${this.today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${this.baseUrl}/sitemap-assets.xml</loc>
    <lastmod>${this.today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${this.baseUrl}/sitemap-api.xml</loc>
    <lastmod>${this.today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${this.baseUrl}/sitemap-products.xml</loc>
    <lastmod>${this.today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${this.baseUrl}/sitemap-documentation.xml</loc>
    <lastmod>${this.today}</lastmod>
  </sitemap>
</sitemapindex>`;
  }

  generateCategorySitemap(categories: SitemapNode[]): string {
    const urls = categories.map(cat => `  <url>
    <loc>${cat.url}</loc>
    <lastmod>${cat.lastmod}</lastmod>
    <changefreq>${cat.changefreq}</changefreq>
    <priority>${cat.priority}</priority>
    <breadcrumb>${cat.breadcrumb}</breadcrumb>
    <schema>
      <type>${cat.schemaType}</type>
      <identifier>${cat.identifier}</identifier>
      <seo_title>${cat.seoTitle}</seo_title>
      <seo_description>${cat.seoDescription}</seo_description>
      <keywords>${cat.keywords.join(', ')}</keywords>
    </schema>
  </url>`).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  }

  generateAlgorithmSitemap(algorithms: SitemapNode[]): string {
    const urls = algorithms.map(algo => `  <url>
    <loc>${algo.url}</loc>
    <lastmod>${algo.lastmod}</lastmod>
    <changefreq>${algo.changefreq}</changefreq>
    <priority>${algo.priority}</priority>
    <breadcrumb>${algo.breadcrumb}</breadcrumb>
    <schema>
      <type>${algo.schemaType}</type>
      <identifier>${algo.identifier}</identifier>
      <category>${algo.category}</category>
      <seo_title>${algo.seoTitle}</seo_title>
      <seo_description>${algo.seoDescription}</seo_description>
      <keywords>${algo.keywords.join(', ')}</keywords>
    </schema>
  </url>`).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  }

  generateEngineSitemap(engines: SitemapNode[]): string {
    const urls = engines.map(engine => `  <url>
    <loc>${engine.url}</loc>
    <lastmod>${engine.lastmod}</lastmod>
    <changefreq>${engine.changefreq}</changefreq>
    <priority>${engine.priority}</priority>
    <breadcrumb>${engine.breadcrumb}</breadcrumb>
    <schema>
      <type>${engine.schemaType}</type>
      <identifier>${engine.identifier}</identifier>
      <category>${engine.category}</category>
      <algorithms>${(engine.algorithms || []).join(', ')}</algorithms>
      <seo_title>${engine.seoTitle}</seo_title>
      <seo_description>${engine.seoDescription}</seo_description>
      <keywords>${engine.keywords.join(', ')}</keywords>
    </schema>
  </url>`).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  }

  generateAssetSitemap(assets: SitemapNode[]): string {
    const urls = assets.map(asset => `  <url>
    <loc>${asset.url}</loc>
    <lastmod>${asset.lastmod}</lastmod>
    <changefreq>${asset.changefreq}</changefreq>
    <priority>${asset.priority}</priority>
    <breadcrumb>${asset.breadcrumb}</breadcrumb>
    <schema>
      <type>${asset.schemaType}</type>
      <identifier>${asset.identifier}</identifier>
      <associated_engine>${asset.engines?.[0] || 'ABSTRACT_ENGINE'}</associated_engine>
      <license>UUON_FOUNDATION_PROPRIETARY</license>
      <seo_title>${asset.seoTitle}</seo_title>
      <seo_description>${asset.seoDescription}</seo_description>
      <keywords>${asset.keywords.join(', ')}</keywords>
    </schema>
  </url>`).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  }

  generateAPISitemap(apis: SitemapNode[]): string {
    const urls = apis.map(api => `  <url>
    <loc>${api.url}</loc>
    <lastmod>${api.lastmod}</lastmod>
    <changefreq>${api.changefreq}</changefreq>
    <priority>${api.priority}</priority>
    <breadcrumb>${api.breadcrumb}</breadcrumb>
    <schema>
      <type>${api.schemaType}</type>
      <identifier>${api.identifier}</identifier>
      <method>POST</method>
      <authentication>API_KEY_REQUIRED</authentication>
      <rate_limit>1000_per_hour</rate_limit>
      <version>v1</version>
      <seo_title>${api.seoTitle}</seo_title>
      <seo_description>${api.seoDescription}</seo_description>
      <keywords>${api.keywords.join(', ')}</keywords>
    </schema>
  </url>`).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  }

  generateProductSitemap(products: SitemapNode[]): string {
    const urls = products.map(product => `  <url>
    <loc>${product.url}</loc>
    <lastmod>${product.lastmod}</lastmod>
    <changefreq>${product.changefreq}</changefreq>
    <priority>${product.priority}</priority>
    <breadcrumb>${product.breadcrumb}</breadcrumb>
    <schema>
      <type>${product.schemaType}</type>
      <identifier>${product.identifier}</identifier>
      <engine>${product.engines?.[0] || 'ABSTRACT_ENGINE'}</engine>
      <commercial_value>Tier_1</commercial_value>
      <license_type>UUON_PROPRIETARY</license_type>
      <purchase_endpoint>${this.baseUrl}/purchase/${product.identifier}</purchase_endpoint>
      <seo_title>${product.seoTitle}</seo_title>
      <seo_description>${product.seoDescription}</seo_description>
      <keywords>${product.keywords.join(', ')}</keywords>
    </schema>
  </url>`).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  }

  private groupAlgorithmsIntoEngines(algorithms: SitemapNode[]): Array<{ category: string; algorithms: string[] }> {
    const grouped = algorithms.reduce((acc, algo) => {
      const cat = algo.category || 'UNCATEGORIZED';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(algo.identifier);
      return acc;
    }, {} as Record<string, string[]>);

    return Object.entries(grouped).map(([category, algorithms]) => ({
      category,
      algorithms
    }));
  }

  private generateAssetNodes(engines: SitemapNode[]): SitemapNode[] {
    const assets: SitemapNode[] = [];
    
    engines.forEach((engine, index) => {
      // Generate image asset
      assets.push({
        identifier: `IMAGE${String(index + 1).padStart(3, '0')}`,
        type: 'Image',
        engines: [engine.identifier],
        url: `${this.baseUrl}/assets/IMAGE${String(index + 1).padStart(3, '0')}.png`,
        lastmod: this.today,
        changefreq: 'monthly',
        priority: 0.8,
        breadcrumb: `Home > Assets > IMAGE${String(index + 1).padStart(3, '0')}`,
        seoTitle: `Abstract Visualization IMAGE${String(index + 1).padStart(3, '0')}`,
        seoDescription: `Mathematical visualization render for engine ${engine.identifier}`,
        keywords: ['visualization', 'render', 'mathematical', 'abstract'],
        schemaType: 'ImageObject'
      });

      // Generate video asset
      assets.push({
        identifier: `VIDEO${String(index + 1).padStart(3, '0')}`,
        type: 'Video',
        engines: [engine.identifier],
        url: `${this.baseUrl}/assets/VIDEO${String(index + 1).padStart(3, '0')}.mp4`,
        lastmod: this.today,
        changefreq: 'monthly',
        priority: 0.8,
        breadcrumb: `Home > Assets > VIDEO${String(index + 1).padStart(3, '0')}`,
        seoTitle: `Abstract Animation VIDEO${String(index + 1).padStart(3, '0')}`,
        seoDescription: `Mathematical animation for engine ${engine.identifier}`,
        keywords: ['animation', 'video', 'mathematical', 'visualization'],
        schemaType: 'VideoObject'
      });
    });

    return assets;
  }

  private generateAPINodes(engines: SitemapNode[]): SitemapNode[] {
    return engines.map((engine, index) => ({
      identifier: `ENDPOINT${String(index + 1).padStart(3, '0')}`,
      type: 'API_Endpoint',
      engines: [engine.identifier],
      url: `${this.baseUrl}/api/endpoint${String(index + 1).padStart(3, '0')}`,
      lastmod: this.today,
      changefreq: 'weekly',
      priority: 0.9,
      breadcrumb: `Home > API > ENDPOINT${String(index + 1).padStart(3, '0')}`,
      seoTitle: `API Endpoint ${String(index + 1).padStart(3, '0')}`,
      seoDescription: `Abstract API endpoint for engine ${engine.identifier}`,
      keywords: ['api', 'endpoint', 'computational', 'interface'],
      schemaType: 'APIEndpoint'
    }));
  }

  private generateProductNodes(engines: SitemapNode[]): SitemapNode[] {
    return engines.map((engine, index) => ({
      identifier: `${engine.identifier}_LICENSE`,
      type: 'Product',
      engines: [engine.identifier],
      url: `${this.baseUrl}/product/${engine.identifier}_LICENSE`,
      lastmod: this.today,
      changefreq: 'monthly',
      priority: 0.9,
      breadcrumb: `Home > Products > ${engine.identifier}`,
      seoTitle: `${engine.identifier} Commercial License`,
      seoDescription: `Commercial licensing for mathematical engine ${engine.identifier}`,
      keywords: ['license', 'commercial', 'engine', 'intellectual-property'],
      schemaType: 'Product'
    }));
  }

  private generateDocumentationNodes(categories: SitemapNode[]): SitemapNode[] {
    const docs: SitemapNode[] = [];
    
    categories.forEach(category => {
      docs.push({
        identifier: `DOCS_${category.identifier}`,
        type: 'Documentation',
        category: category.identifier,
        url: `${this.baseUrl}/docs/${category.identifier.toLowerCase()}`,
        lastmod: this.today,
        changefreq: 'weekly',
        priority: 0.8,
        breadcrumb: `Home > Documentation > ${category.identifier}`,
        seoTitle: `${category.identifier} Documentation`,
        seoDescription: `Technical documentation for ${category.identifier} algorithms and engines`,
        keywords: ['documentation', 'technical', 'reference', 'guide'],
        schemaType: 'TechnicalArticle'
      });
    });

    // Add Shape Token ecosystem documentation
    docs.push({
      identifier: 'DOCS_SHAPE_TOKENS',
      type: 'Documentation',
      url: `${this.baseUrl}/docs/shape-token-ecosystem`,
      lastmod: this.today,
      changefreq: 'weekly',
      priority: 0.95,
      breadcrumb: 'Home > Documentation > Shape Token Ecosystem',
      seoTitle: 'Shape Token Ecosystem - Monetizable Mathematical Metadata',
      seoDescription: 'Comprehensive guide to Shape Tokens: unified metadata, AI classification, and token-based economy for mathematical shapes',
      keywords: ['shape-tokens', 'metadata', 'monetization', 'ai-classification', 'digital-assets'],
      schemaType: 'TechnicalArticle'
    });

    // Add token benefits documentation
    docs.push({
      identifier: 'DOCS_TOKEN_BENEFITS',
      type: 'Documentation',
      url: `${this.baseUrl}/docs/token-benefits`,
      lastmod: this.today,
      changefreq: 'monthly',
      priority: 0.9,
      breadcrumb: 'Home > Documentation > Token Benefits',
      seoTitle: 'Shape Token Benefits - Digital Asset Value Creation',
      seoDescription: 'Discover how Shape Tokens transform mathematical geometry into searchable, tradable, monetizable digital assets',
      keywords: ['token-benefits', 'digital-economy', 'shape-valuation', 'metadata-search'],
      schemaType: 'TechnicalArticle'
    });

    // Add API documentation
    docs.push({
      identifier: 'DOCS_API',
      type: 'Documentation',
      url: `${this.baseUrl}/docs/api`,
      lastmod: this.today,
      changefreq: 'weekly',
      priority: 0.9,
      breadcrumb: 'Home > Documentation > API',
      seoTitle: 'API Documentation',
      seoDescription: 'Complete API reference and integration guide',
      keywords: ['api', 'documentation', 'reference', 'integration'],
      schemaType: 'TechnicalArticle'
    });

    return docs;
  }

  private capitalizeWords(str: string): string {
    return str.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  async generateAllSitemaps(): Promise<void> {
    console.log('🗺️ Generating standardized sitemap framework...');
    
    const framework = await this.generateSitemapFramework();
    
    // Generate sitemap index
    const sitemapIndex = this.generateSitemapIndex();
    fs.writeFileSync('client/public/sitemap-index.xml', sitemapIndex);
    
    // Generate individual sitemaps
    fs.writeFileSync('client/public/sitemap-categories.xml', this.generateCategorySitemap(framework.categories));
    fs.writeFileSync('client/public/sitemap-algorithms.xml', this.generateAlgorithmSitemap(framework.algorithms));
    fs.writeFileSync('client/public/sitemap-engines.xml', this.generateEngineSitemap(framework.engines));
    fs.writeFileSync('client/public/sitemap-assets.xml', this.generateAssetSitemap(framework.assets));
    fs.writeFileSync('client/public/sitemap-api.xml', this.generateAPISitemap(framework.api));
    fs.writeFileSync('client/public/sitemap-products.xml', this.generateProductSitemap(framework.products));
    fs.writeFileSync('client/public/sitemap-documentation.xml', this.generateCategorySitemap(framework.documentation));
    
    console.log('✅ Standardized sitemap framework generated successfully');
    console.log(`📊 Categories: ${framework.categories.length}`);
    console.log(`📊 Algorithms: ${framework.algorithms.length}`);
    console.log(`📊 Engines: ${framework.engines.length}`);
    console.log(`📊 Assets: ${framework.assets.length}`);
    console.log(`📊 API Endpoints: ${framework.api.length}`);
    console.log(`📊 Products: ${framework.products.length}`);
    console.log(`📊 Documentation: ${framework.documentation.length}`);
  }
}

// Class is already exported at declaration

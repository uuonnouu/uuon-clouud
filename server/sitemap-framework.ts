
/**
 * UNIFIED SITEMAP FRAMEWORK SYSTEM
 * Generates standardized sitemaps for entire application ecosystem
 * Follows security rules - no proprietary code exposure
 */

interface SitemapMetadata {
  lastModified: string;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  canonicalUrl: string;
  breadcrumb: string[];
  categoryId: string;
  algorithmId?: string;
  engineId?: string;
}

interface SemanticNode {
  id: string;
  type: 'engine' | 'algorithm' | 'category' | 'product' | 'api';
  domain: string;
  relationships: string[];
  metadata: Record<string, any>;
}

export class UnifiedSitemapFramework {
  private baseUrl = 'https://uuon.world';
  private lastModified = new Date().toISOString().split('T')[0];

  // 1. STANDARDIZED XML SITEMAP GENERATION
  generateXMLSitemap(urls: Array<{
    loc: string;
    metadata: SitemapMetadata;
    schemaType?: string;
  }>): string {
    const urlEntries = urls.map(({ loc, metadata, schemaType }) => `
  <url>
    <loc>${this.baseUrl}${loc}</loc>
    <lastmod>${metadata.lastModified}</lastmod>
    <changefreq>${metadata.changeFrequency}</changefreq>
    <priority>${metadata.priority}</priority>
    <breadcrumb>${metadata.breadcrumb.join(' > ')}</breadcrumb>
    <category-id>${metadata.categoryId}</category-id>
    ${metadata.algorithmId ? `<algorithm-id>${metadata.algorithmId}</algorithm-id>` : ''}
    ${metadata.engineId ? `<engine-id>${metadata.engineId}</engine-id>` : ''}
    ${schemaType ? `<schema-type>${schemaType}</schema-type>` : ''}
    <canonical>${metadata.canonicalUrl}</canonical>
  </url>`).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                           http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">${urlEntries}
</urlset>`;
  }

  // 2. INDEX SITEMAP STANDARD
  generateSitemapIndex(sitemapGroups: Record<string, string[]>): string {
    const sitemapEntries = Object.entries(sitemapGroups)
      .flatMap(([type, sitemaps]) => 
        sitemaps.map(sitemap => `
  <sitemap>
    <loc>${this.baseUrl}/sitemap-${sitemap}.xml</loc>
    <lastmod>${this.lastModified}</lastmod>
    <type>${type}</type>
    <version>1.0</version>
  </sitemap>`)
      ).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapEntries}
</sitemapindex>`;
  }

  // 3. IMAGE/VIDEO SITEMAP STANDARD
  generateMediaSitemap(mediaAssets: Array<{
    url: string;
    caption: string;
    engineId: string;
    algorithmId: string;
    renderType: '2D' | '3D' | 'animation';
    licenseType: string;
  }>): string {
    const imageEntries = mediaAssets.map(asset => `
  <url>
    <loc>${this.baseUrl}/media/${asset.url}</loc>
    <image:image>
      <image:loc>${this.baseUrl}/assets/${asset.url}</image:loc>
      <image:caption>${asset.caption}</image:caption>
      <image:title>ENGINE_${asset.engineId} - ALGORITHM_${asset.algorithmId}</image:title>
    </image:image>
    <engine-ref>ENGINE_${asset.engineId}</engine-ref>
    <algorithm-ref>ALGORITHM_${asset.algorithmId}</algorithm-ref>
    <render-type>${asset.renderType}</render-type>
    <license>${asset.licenseType}</license>
    <lastmod>${this.lastModified}</lastmod>
  </url>`).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${imageEntries}
</urlset>`;
  }

  // 4. API SITEMAP STANDARD
  generateAPISitemap(endpoints: Array<{
    endpoint: string;
    method: string;
    summary: string;
    categoryId: string;
    algorithmId?: string;
    rateLimit: string;
    version: string;
    authRequired: boolean;
  }>): string {
    const apiEntries = endpoints.map(ep => `
  <url>
    <loc>${this.baseUrl}/api${ep.endpoint}</loc>
    <api:method>${ep.method}</api:method>
    <api:summary>${ep.summary}</api:summary>
    <api:category>CATEGORY_${ep.categoryId}</api:category>
    ${ep.algorithmId ? `<api:algorithm>ALGORITHM_${ep.algorithmId}</api:algorithm>` : ''}
    <api:rate-limit>${ep.rateLimit}</api:rate-limit>
    <api:version>${ep.version}</api:version>
    <api:auth-required>${ep.authRequired}</api:auth-required>
    <lastmod>${this.lastModified}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:api="http://schemas.example.com/api/1.0">${apiEntries}
</urlset>`;
  }

  // 5. PRODUCT/LICENSING SITEMAP STANDARD
  generateProductSitemap(products: Array<{
    engineId: string;
    purpose: string;
    commercialTier: 'basic' | 'premium' | 'enterprise';
    licenseOptions: string[];
    documentationPath: string;
  }>): string {
    const productEntries = products.map(product => `
  <url>
    <loc>${this.baseUrl}/product/ENGINE_${product.engineId}</loc>
    <product:engine-id>ENGINE_${product.engineId}</product:engine-id>
    <product:purpose>${product.purpose}</product:purpose>
    <product:commercial-tier>${product.commercialTier}</product:commercial-tier>
    <product:license-options>${product.licenseOptions.join(',')}</product:license-options>
    <product:documentation>${this.baseUrl}/docs${product.documentationPath}</product:documentation>
    <product:purchase-endpoint>${this.baseUrl}/purchase/ENGINE_${product.engineId}</product:purchase-endpoint>
    <lastmod>${this.lastModified}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:product="http://schemas.example.com/product/1.0">${productEntries}
</urlset>`;
  }

  // 6. SEMANTIC & KNOWLEDGE GRAPH SITEMAP
  generateSemanticSitemap(nodes: SemanticNode[]): string {
    const semanticEntries = nodes.map(node => {
      const jsonLD = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "@id": `ENGINE_${node.id}`,
        "name": `${node.id} Mathematical Engine`,
        "headline": `${node.id} - ${node.domain} Visualization Engine`,
        "description": `Interactive mathematical visualization engine for ${node.domain.toLowerCase()} computations`,
        "applicationCategory": node.domain,
        "operatingSystem": "Web Browser",
        "inLanguage": "en-US",
        "datePublished": "2025-01-01",
        "dateModified": this.lastModified,
        "author": {
          "@type": "Organization",
          "name": "UUON Foundation Inc.",
          "url": "https://uuon.world"
        },
        "publisher": {
          "@type": "Organization",
          "name": "UUON Foundation Inc.",
          "logo": {
            "@type": "ImageObject",
            "url": `${this.baseUrl}/dmension-logo.png`
          }
        },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        },
        "isPartOf": node.relationships.map(rel => ({ "@id": `ENGINE_${rel}` })),
        "keywords": "mathematical visualization, parametric surfaces, computational geometry"
      };

      return `
  <url>
    <loc>${this.baseUrl}/semantic/${node.type}/${node.id}</loc>
    <semantic:type>${node.type}</semantic:type>
    <semantic:domain>${node.domain}</semantic:domain>
    <semantic:relationships>${node.relationships.join(',')}</semantic:relationships>
    <semantic:json-ld><![CDATA[${JSON.stringify(jsonLD)}]]></semantic:json-ld>
    <lastmod>${this.lastModified}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:semantic="http://schemas.example.com/semantic/1.0">${semanticEntries}
</urlset>`;
  }

  // 7. SEO METADATA TEMPLATES - Enhanced for better SEO
  generateSEOMetadata(entityType: string, entityId: string): {
    title: string;
    description: string;
    keywords: string[];
    schemaMarkup: object;
    socialPreview: object;
  } {
    const today = new Date().toISOString().split('T')[0];
    const templates = {
      engine: {
        title: `${entityId} Mathematical Engine - Δmension Visualization`,
        description: `Explore ${entityId} with interactive 3D mathematical visualization, parametric control, and real-time rendering. Part of the UUON Foundation's 2,677+ shape library.`,
        keywords: ['mathematical visualization', '3D rendering', 'parametric surfaces', 'computational geometry', entityId.toLowerCase()],
        schemaMarkup: {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": `${entityId} Mathematical Engine`,
          "headline": `${entityId} - Advanced Mathematical Visualization Engine`,
          "description": `Interactive mathematical visualization engine for ${entityId.toLowerCase().replace(/_/g, ' ')} computations`,
          "applicationCategory": "Scientific Visualization",
          "operatingSystem": "Web Browser",
          "inLanguage": "en-US",
          "datePublished": "2025-01-01",
          "dateModified": today,
          "author": {
            "@type": "Organization",
            "name": "UUON Foundation Inc.",
            "url": "https://uuon.world"
          },
          "publisher": {
            "@type": "Organization",
            "name": "UUON Foundation Inc.",
            "logo": {
              "@type": "ImageObject",
              "url": "https://uuon.world/dmension-logo.png"
            }
          },
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          },
          "keywords": "mathematical visualization, parametric surfaces, computational geometry"
        }
      },
      algorithm: {
        title: `${entityId} Algorithm - Δmension Mathematical Implementation`,
        description: `Advanced mathematical algorithm ${entityId} for computational visualization with interactive parameter control and real-time 3D rendering.`,
        keywords: ['mathematical algorithm', 'computational mathematics', 'parametric equations', entityId.toLowerCase()],
        schemaMarkup: {
          "@context": "https://schema.org",
          "@type": "TechArticle",
          "name": `${entityId} Algorithm`,
          "headline": `${entityId} - Mathematical Algorithm Implementation`,
          "description": `Advanced mathematical algorithm implementation for ${entityId.toLowerCase().replace(/_/g, ' ')} with interactive visualization`,
          "about": "Mathematical Algorithm Implementation",
          "inLanguage": "en-US",
          "datePublished": "2025-01-01",
          "dateModified": today,
          "author": {
            "@type": "Organization",
            "name": "UUON Foundation Inc.",
            "url": "https://uuon.world"
          },
          "publisher": {
            "@type": "Organization",
            "name": "UUON Foundation Inc.",
            "logo": {
              "@type": "ImageObject",
              "url": "https://uuon.world/dmension-logo.png"
            }
          },
          "articleSection": "Algorithms",
          "keywords": "mathematical algorithms, computational mathematics, parametric equations"
        }
      }
    };

    const template = templates[entityType as keyof typeof templates] || templates.engine;
    
    return {
      ...template,
      socialPreview: {
        'og:title': template.title,
        'og:description': template.description,
        'og:type': 'website',
        'og:site_name': 'Δmension Mathematical Universe',
        'og:image': 'https://uuon.world/og-mathematical-universe.jpg',
        'twitter:card': 'summary_large_image',
        'twitter:site': '@UUONFoundation',
        'twitter:creator': '@UUONFoundation'
      }
    };
  }

  // 8. AUTO-GENERATION SYSTEM
  async autoGenerateForNewEntity(entity: {
    type: 'engine' | 'algorithm' | 'category';
    id: string;
    domain: string;
    relationships: string[];
    metadata: Record<string, any>;
  }): Promise<{
    sitemapNodes: any[];
    indexUpdate: string;
    semanticCluster: SemanticNode;
    knowledgeGraphEdges: string[];
    licensingMetadata: any;
    discoverabilityKeywords: string[];
  }> {
    // Generate abstract identifiers only
    const abstractId = `${entity.type.toUpperCase()}_${entity.id}`;
    
    const sitemapNodes = [{
      loc: `/${entity.type}/${entity.id}`,
      metadata: {
        lastModified: this.lastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
        canonicalUrl: `${this.baseUrl}/${entity.type}/${entity.id}`,
        breadcrumb: ['Home', entity.type, entity.id],
        categoryId: entity.domain,
        [`${entity.type}Id`]: entity.id
      }
    }];

    const semanticCluster: SemanticNode = {
      id: entity.id,
      type: entity.type,
      domain: entity.domain,
      relationships: entity.relationships,
      metadata: { ...entity.metadata, abstractId }
    };

    return {
      sitemapNodes,
      indexUpdate: `sitemap-${entity.type}-${entity.id}`,
      semanticCluster,
      knowledgeGraphEdges: entity.relationships.map(rel => `${abstractId}-->${rel}`),
      licensingMetadata: {
        entityId: abstractId,
        commercialTier: 'basic',
        licenseOptions: ['research', 'commercial', 'enterprise']
      },
      discoverabilityKeywords: [
        entity.type,
        entity.domain,
        entity.id.toLowerCase(),
        'mathematical',
        'visualization'
      ]
    };
  }

  // 9. MAIN ORCHESTRATION METHOD
  generateCompleteSitemapEcosystem(): {
    index: string;
    categories: string;
    algorithms: string;
    engines: string;
    apis: string;
    products: string;
    media: string;
    semantic: string;
  } {
    // Abstract category definitions
    const categories = [
      { id: 'PHYSICS', name: 'Physics', algorithms: ['ALGO001', 'ALGO003', 'ALGO007'] },
      { id: 'MATHEMATICS', name: 'Mathematics', algorithms: ['ALGO002', 'ALGO005'] },
      { id: 'BIOLOGY', name: 'Biology', algorithms: ['ALGO004', 'ALGO006'] }
    ];

    const engines = [
      { id: 'ENGINE001', category: 'PHYSICS', algorithms: ['ALGO001', 'ALGO003'] },
      { id: 'ENGINE002', category: 'PHYSICS', algorithms: ['ALGO007'] },
      { id: 'ENGINE003', category: 'MATHEMATICS', algorithms: ['ALGO002', 'ALGO005'] }
    ];

    // Generate all sitemaps using standardized format
    return {
      index: this.generateSitemapIndex({
        category: ['categories', 'physics', 'mathematics', 'biology'],
        algorithm: ['algorithms', 'physics-algorithms', 'math-algorithms'],
        engine: ['engines', 'physics-engines', 'math-engines'],
        api: ['api-endpoints', 'computation-api', 'export-api'],
        product: ['products', 'licensing', 'commercial'],
        media: ['images', 'videos', 'animations'],
        documentation: ['docs-categories', 'docs-algorithms', 'docs-engines']
      }),
      
      categories: this.generateXMLSitemap(categories.map(cat => ({
        loc: `/category/${cat.id.toLowerCase()}`,
        metadata: {
          lastModified: this.lastModified,
          changeFrequency: 'weekly' as const,
          priority: 1.0,
          canonicalUrl: `${this.baseUrl}/category/${cat.id.toLowerCase()}`,
          breadcrumb: ['Home', cat.name],
          categoryId: cat.id
        },
        schemaType: 'Category'
      }))),

      algorithms: this.generateXMLSitemap([
        'ALGO001', 'ALGO002', 'ALGO003', 'ALGO004', 'ALGO005', 'ALGO006', 'ALGO007'
      ].map(id => ({
        loc: `/algorithm/${id}`,
        metadata: {
          lastModified: this.lastModified,
          changeFrequency: 'monthly' as const,
          priority: 0.7,
          canonicalUrl: `${this.baseUrl}/algorithm/${id}`,
          breadcrumb: ['Home', 'Algorithms', id],
          categoryId: 'ALGORITHMS',
          algorithmId: id
        },
        schemaType: 'Algorithm'
      }))),

      engines: this.generateXMLSitemap(engines.map(engine => ({
        loc: `/engine/${engine.id}`,
        metadata: {
          lastModified: this.lastModified,
          changeFrequency: 'weekly' as const,
          priority: 0.9,
          canonicalUrl: `${this.baseUrl}/engine/${engine.id}`,
          breadcrumb: ['Home', 'Engines', engine.id],
          categoryId: engine.category,
          engineId: engine.id
        },
        schemaType: 'Engine'
      }))),

      apis: this.generateAPISitemap([
        { endpoint: '/shapes/generate', method: 'POST', summary: 'Generate 3D shape', categoryId: 'COMPUTATION', rateLimit: '100/hour', version: '1.0', authRequired: false },
        { endpoint: '/export/glb', method: 'POST', summary: 'Export GLB format', categoryId: 'EXPORT', rateLimit: '50/hour', version: '1.0', authRequired: true }
      ]),

      products: this.generateProductSitemap(engines.map(engine => ({
        engineId: engine.id,
        purpose: 'Mathematical Visualization',
        commercialTier: 'premium' as const,
        licenseOptions: ['research', 'commercial'],
        documentationPath: `/engines/${engine.id}`
      }))),

      media: this.generateMediaSitemap([
        { url: 'preview001.png', caption: 'ENGINE001 Preview', engineId: 'ENGINE001', algorithmId: 'ALGO001', renderType: '3D' as const, licenseType: 'commercial' }
      ]),

      semantic: this.generateSemanticSitemap(engines.map(engine => ({
        id: engine.id,
        type: 'engine' as const,
        domain: engine.category,
        relationships: engine.algorithms,
        metadata: { category: engine.category }
      })))
    };
  }
}

export const sitemapFramework = new UnifiedSitemapFramework();


/**
 * STANDARDIZED SITEMAP TEMPLATES
 * Consistent formatting for all sitemap types
 */

export const SITEMAP_TEMPLATES = {
  // XML Sitemap Template
  XML_HEADER: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                           http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`,
  
  XML_FOOTER: `</urlset>`,

  // Index Sitemap Template  
  INDEX_HEADER: `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  
  INDEX_FOOTER: `</sitemapindex>`,

  // URL Entry Template
  URL_ENTRY: (data: {
    loc: string;
    lastmod: string;
    changefreq: string;
    priority: number;
    breadcrumb: string;
    categoryId: string;
    algorithmId?: string;
    engineId?: string;
    schemaType?: string;
  }) => `
  <url>
    <loc>${data.loc}</loc>
    <lastmod>${data.lastmod}</lastmod>
    <changefreq>${data.changefreq}</changefreq>
    <priority>${data.priority}</priority>
    <breadcrumb>${data.breadcrumb}</breadcrumb>
    <category-id>${data.categoryId}</category-id>
    ${data.algorithmId ? `<algorithm-id>${data.algorithmId}</algorithm-id>` : ''}
    ${data.engineId ? `<engine-id>${data.engineId}</engine-id>` : ''}
    ${data.schemaType ? `<schema-type>${data.schemaType}</schema-type>` : ''}
  </url>`,

  // Sitemap Index Entry Template
  INDEX_ENTRY: (data: {
    loc: string;
    lastmod: string;
    type: string;
    version: string;
  }) => `
  <sitemap>
    <loc>${data.loc}</loc>
    <lastmod>${data.lastmod}</lastmod>
    <type>${data.type}</type>
    <version>${data.version}</version>
  </sitemap>`,

  // SEO Metadata Template
  SEO_TEMPLATE: (entityType: string, entityId: string) => ({
    title: `${entityType.toUpperCase()}_${entityId} - Δmension Mathematical Universe`,
    description: `Explore ${entityType.toUpperCase()}_${entityId} with advanced mathematical visualization and parametric control`,
    keywords: [
      'mathematical visualization',
      '3D rendering',
      'parametric surfaces',
      entityType.toLowerCase(),
      entityId.toLowerCase()
    ],
    canonical: `//${entityType}/${entityId}`,
    breadcrumb: ['Home', entityType, entityId]
  }),

  // Schema Markup Templates - Enhanced for SEO
  SCHEMA_TEMPLATES: {
    ENGINE: (id: string) => ({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "@id": `ENGINE_${id}`,
      "name": `${id} Mathematical Engine`,
      "headline": `${id} - Advanced Mathematical Visualization Engine`,
      "description": `Interactive mathematical visualization engine for ${id.toLowerCase().replace(/_/g, ' ')} computations and parametric surface generation`,
      "applicationCategory": "Scientific Visualization",
      "operatingSystem": "Web Browser",
      "inLanguage": "en-US",
      "datePublished": "2025-01-01",
      "dateModified": new Date().toISOString().split('T')[0],
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
      "keywords": "mathematical visualization, parametric surfaces, computational geometry, 3D rendering"
    }),
    
    ALGORITHM: (id: string) => ({
      "@context": "https://schema.org", 
      "@type": "TechArticle",
      "@id": `ALGORITHM_${id}`,
      "name": `${id} Algorithm`,
      "headline": `${id} - Mathematical Algorithm Implementation`,
      "description": `Advanced mathematical algorithm implementation for ${id.toLowerCase().replace(/_/g, ' ')} with interactive visualization`,
      "about": "Mathematical Algorithm Implementation",
      "inLanguage": "en-US",
      "datePublished": "2025-01-01",
      "dateModified": new Date().toISOString().split('T')[0],
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
      "keywords": "mathematical algorithms, computational mathematics, parametric equations, mathematical visualization"
    }),
    
    CATEGORY: (id: string) => ({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `CATEGORY_${id}`,
      "name": `${id} Category`,
      "headline": `${id} - Mathematical Shape Collection`,
      "description": `Comprehensive collection of ${id.toLowerCase().replace(/_/g, ' ')} mathematical shapes and parametric surfaces`,
      "about": "Mathematical Category Collection",
      "inLanguage": "en-US",
      "datePublished": "2025-01-01",
      "dateModified": new Date().toISOString().split('T')[0],
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
      "keywords": "mathematical shapes, parametric surfaces, 3D geometry, mathematical visualization"
    })
  }
};

export const CONSISTENCY_RULES = {
  // All sitemaps must follow these rules
  REQUIRED_FIELDS: ['loc', 'lastmod', 'changefreq', 'priority'],
  CHANGE_FREQUENCIES: ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'],
  PRIORITY_RANGE: [0.0, 1.0],
  ABSTRACT_ID_PATTERN: /^[A-Z]+_[A-Z0-9]+$/,
  
  // Validation functions
  validateAbstractId: (id: string) => CONSISTENCY_RULES.ABSTRACT_ID_PATTERN.test(id),
  validatePriority: (priority: number) => priority >= 0.0 && priority <= 1.0,
  validateChangeFreq: (freq: string) => CONSISTENCY_RULES.CHANGE_FREQUENCIES.includes(freq)
};

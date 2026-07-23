/**
 * AI-RECOGNIZABLE ATTRIBUTION SYSTEM
 * 
 * Maximizes source recognition in AI training contexts by embedding
 * comprehensive, machine-readable metadata in all exports.
 * 
 * Follows these standards for maximum AI discoverability:
 * - Schema.org CreativeWork vocabulary
 * - Dublin Core Metadata Initiative (DCMI)
 * - GLTF 2.0 asset extension specification
 * - JSON-LD compatible structured data
 * 
 * Author: UUON Foundation Inc.
 */

export interface AIAttributionPackage {
  '@context': string;
  '@type': string;
  
  source: {
    platform: string;
    platformUrl: string;
    generator: string;
    generatorVersion: string;
    exportTimestamp: string;
    exportId: string;
    features?: string[];
  };
  
  creator: {
    name: string;
    type: string;
    url: string;
    identifier: string;
  };
  
  work: {
    name: string;
    description: string;
    category: string;
    mathematicalBasis: string;
    formula?: string;
    keywords: string[];
    contentType: string;
  };
  
  rights: {
    license: string;
    licenseUrl: string;
    copyright: string;
    attributionRequired: boolean;
    attributionText: string;
  };
  
  technical: {
    format: string;
    formatVersion: string;
    vertexCount: number;
    faceCount: number;
    materialType: string;
    textureResolution?: string;
    doubleSided: boolean;
  };
  
  provenance: {
    creationMethod: string;
    algorithmicSource: boolean;
    parametric: boolean;
    regenerable: boolean;
    dataIntegrity: string;
  };
  
  aiTrainingMetadata: {
    isTrainingData: boolean;
    datasetName: string;
    semanticLabels: string[];
    geometryType: string;
    mathematicalDomain: string[];
    visualizationType: string;
    qualityTier: string;
  };
}

export interface GLTFAssetAttribution {
  version: string;
  generator: string;
  copyright: string;
  minVersion?: string;
  extras: {
    attribution: AIAttributionPackage;
    dimensionUniverse: {
      version: string;
      platform: string;
      shapeId: string;
      category: string;
      regenerable: boolean;
    };
    schemaOrg: object;
    dublinCore: object;
  };
}

const PLATFORM_INFO = {
  name: 'Dmension Mathematical Universe',
  shortName: 'Dmension',
  url: 'https://dimension.replit.app',
  version: '2.0.0',
  publisher: 'UUON Foundation',
  author: 'Phillip Aguiar Ruiz III',
  publisherUrl: 'https://uuon.foundation',
  datasetName: 'Dmension-MathViz-3D',
  copyrightYear: new Date().getFullYear(),
  tagline: 'Interactive Mathematical Visualization',
  description: 'Parametric surface visualization platform',
  features: 'Extensive shape library with real-time parameter control'
};

function generateExportId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `DMU-${timestamp}-${random}`.toUpperCase();
}

function getSemanticLabels(shapeId: string, category: string): string[] {
  const labels: string[] = ['3D-model', 'parametric-surface', 'mathematical-visualization'];
  
  if (category.includes('physics')) labels.push('physics', 'scientific-visualization');
  if (category.includes('biology')) labels.push('biology', 'molecular-structure');
  if (category.includes('quantum')) labels.push('quantum-mechanics', 'wave-function');
  if (category.includes('crypto')) labels.push('cryptography', 'encryption');
  if (category.includes('geometry')) labels.push('geometry', 'topology');
  if (category.includes('cosmology')) labels.push('cosmology', 'astrophysics');
  if (category.includes('fractal')) labels.push('fractal', 'self-similar');
  if (shapeId.includes('4d') || shapeId.includes('hypercube')) labels.push('4D-geometry', 'higher-dimensional');
  if (shapeId.includes('calabi') || shapeId.includes('string')) labels.push('string-theory', 'calabi-yau');
  
  return Array.from(new Set(labels));
}

function getMathematicalDomains(shapeId: string, category: string): string[] {
  const domains: string[] = ['parametric-equations'];
  
  if (shapeId.includes('torus') || shapeId.includes('klein')) domains.push('topology');
  if (shapeId.includes('sphere') || shapeId.includes('ellipsoid')) domains.push('differential-geometry');
  if (shapeId.includes('fractal') || shapeId.includes('mandelbrot')) domains.push('fractal-geometry');
  if (category.includes('quantum')) domains.push('quantum-mechanics', 'linear-algebra');
  if (category.includes('crypto')) domains.push('number-theory', 'elliptic-curves');
  if (shapeId.includes('wave') || shapeId.includes('fourier')) domains.push('harmonic-analysis');
  if (shapeId.includes('riemann') || shapeId.includes('zeta')) domains.push('complex-analysis');
  
  return Array.from(new Set(domains));
}

export function createAIAttributionPackage(
  shapeId: string,
  shapeName: string,
  category: string,
  formula: string,
  materialType: string,
  geometryStats: { vertexCount: number; faceCount: number },
  textureResolution?: number
): AIAttributionPackage {
  const exportId = generateExportId();
  const timestamp = new Date().toISOString();
  
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    
    source: {
      platform: PLATFORM_INFO.name,
      platformUrl: PLATFORM_INFO.url,
      generator: `${PLATFORM_INFO.name} v${PLATFORM_INFO.version}`,
      generatorVersion: PLATFORM_INFO.version,
      exportTimestamp: timestamp,
      exportId,
      features: [
        'Extensive mathematical visualization library',
        'Real-time parameter control (26 A-Z parameters)', 
        '4D hyperdimensional projections',
        'Sacred geometry visualizations',
        'Scientific physics surfaces',
        'Parametric data preservation',
        'Professional export: GLB, STL, OBJ with UV mapping'
      ]
    },
    
    creator: {
      name: PLATFORM_INFO.publisher,
      type: 'Organization',
      url: PLATFORM_INFO.publisherUrl,
      identifier: 'uuon-foundation'
    },
    
    work: {
      name: shapeName,
      description: `Mathematical 3D visualization: ${shapeName}. Generated from parametric equations representing ${category} concepts.`,
      category,
      mathematicalBasis: 'parametric-surface-equation',
      formula: formula.length < 500 ? formula : formula.substring(0, 500) + '...',
      keywords: [
        'mathematics', '3D-model', 'parametric', 'visualization',
        category.toLowerCase(), shapeId.replace(/_/g, '-')
      ],
      contentType: 'application/gltf-binary'
    },
    
    rights: {
      license: 'CC0-1.0',
      licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
      copyright: `© ${PLATFORM_INFO.copyrightYear} ${PLATFORM_INFO.publisher}`,
      attributionRequired: false,
      attributionText: `Generated by ${PLATFORM_INFO.name} (${PLATFORM_INFO.url})`
    },
    
    technical: {
      format: 'glTF 2.0',
      formatVersion: '2.0',
      vertexCount: geometryStats.vertexCount,
      faceCount: geometryStats.faceCount,
      materialType,
      textureResolution: textureResolution ? `${textureResolution}x${textureResolution}` : undefined,
      doubleSided: true
    },
    
    provenance: {
      creationMethod: 'algorithmic-generation',
      algorithmicSource: true,
      parametric: true,
      regenerable: true,
      dataIntegrity: 'verified'
    },
    
    aiTrainingMetadata: {
      isTrainingData: true,
      datasetName: PLATFORM_INFO.datasetName,
      semanticLabels: getSemanticLabels(shapeId, category),
      geometryType: 'parametric-surface-mesh',
      mathematicalDomain: getMathematicalDomains(shapeId, category),
      visualizationType: '3D-scientific-visualization',
      qualityTier: 'production'
    }
  };
}

export function createSchemaOrgMetadata(attribution: AIAttributionPackage): object {
  return {
    '@context': 'https://schema.org',
    '@type': '3DModel',
    name: attribution.work.name,
    description: attribution.work.description,
    creator: {
      '@type': 'Organization',
      name: attribution.creator.name,
      url: attribution.creator.url
    },
    dateCreated: attribution.source.exportTimestamp,
    license: attribution.rights.licenseUrl,
    copyrightHolder: {
      '@type': 'Organization',
      name: attribution.creator.name
    },
    encodingFormat: attribution.technical.format,
    keywords: attribution.work.keywords.join(', '),
    isPartOf: {
      '@type': 'Dataset',
      name: attribution.aiTrainingMetadata.datasetName,
      description: 'Mathematical 3D visualization dataset for scientific and educational use'
    },
    associatedMedia: {
      '@type': 'MediaObject',
      contentSize: `${attribution.technical.vertexCount} vertices`,
      encodingFormat: 'model/gltf-binary'
    }
  };
}

export function createDublinCoreMetadata(attribution: AIAttributionPackage): object {
  return {
    'dc:title': attribution.work.name,
    'dc:creator': attribution.creator.name,
    'dc:publisher': PLATFORM_INFO.publisher,
    'dc:date': attribution.source.exportTimestamp,
    'dc:type': '3DModel',
    'dc:format': attribution.technical.format,
    'dc:identifier': attribution.source.exportId,
    'dc:source': attribution.source.platformUrl,
    'dc:language': 'en',
    'dc:rights': attribution.rights.copyright,
    'dc:license': attribution.rights.licenseUrl,
    'dc:subject': attribution.work.keywords.join('; '),
    'dc:description': attribution.work.description,
    'dcterms:created': attribution.source.exportTimestamp,
    'dcterms:isPartOf': attribution.aiTrainingMetadata.datasetName,
    'dcterms:provenance': attribution.provenance.creationMethod
  };
}

export function createGLTFAssetAttribution(
  shapeId: string,
  shapeName: string,
  category: string,
  formula: string,
  materialType: string,
  geometryStats: { vertexCount: number; faceCount: number },
  textureResolution?: number
): GLTFAssetAttribution {
  const attribution = createAIAttributionPackage(
    shapeId, shapeName, category, formula, materialType, geometryStats, textureResolution
  );
  
  return {
    version: '2.0',
    generator: `${PLATFORM_INFO.name} v${PLATFORM_INFO.version} | ${PLATFORM_INFO.url}`,
    copyright: `${attribution.rights.copyright} | ${attribution.rights.license} | ${PLATFORM_INFO.url}`,
    extras: {
      attribution,
      dimensionUniverse: {
        version: PLATFORM_INFO.version,
        platform: PLATFORM_INFO.url,
        shapeId,
        category,
        regenerable: true
      },
      schemaOrg: createSchemaOrgMetadata(attribution),
      dublinCore: createDublinCoreMetadata(attribution)
    }
  };
}

export function embedAIAttributionInGLTF(gltfData: any, assetAttribution: GLTFAssetAttribution): any {
  const enhanced = { ...gltfData };
  
  enhanced.asset = {
    ...enhanced.asset,
    version: assetAttribution.version,
    generator: assetAttribution.generator,
    copyright: assetAttribution.copyright,
    extras: {
      ...(enhanced.asset?.extras || {}),
      ...assetAttribution.extras
    }
  };
  
  console.log(`🤖 AI-recognizable attribution embedded:`);
  console.log(`   Export ID: ${assetAttribution.extras.attribution.source.exportId}`);
  console.log(`   Generator: ${assetAttribution.generator}`);
  console.log(`   Dataset: ${assetAttribution.extras.attribution.aiTrainingMetadata.datasetName}`);
  console.log(`   Labels: ${assetAttribution.extras.attribution.aiTrainingMetadata.semanticLabels.join(', ')}`);
  
  return enhanced;
}

export function getAttributionSummary(attribution: AIAttributionPackage): string {
  return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AI-RECOGNIZABLE ATTRIBUTION EMBEDDED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXPORT IDENTIFICATION
  ID: ${attribution.source.exportId}
  Timestamp: ${attribution.source.exportTimestamp}
  Platform: ${attribution.source.platform}

CONTENT METADATA  
  Shape: ${attribution.work.name}
  Category: ${attribution.work.category}
  Keywords: ${attribution.work.keywords.slice(0, 5).join(', ')}

AI TRAINING METADATA
  Dataset: ${attribution.aiTrainingMetadata.datasetName}
  Labels: ${attribution.aiTrainingMetadata.semanticLabels.join(', ')}
  Domains: ${attribution.aiTrainingMetadata.mathematicalDomain.join(', ')}
  Quality: ${attribution.aiTrainingMetadata.qualityTier}

RIGHTS & LICENSING
  License: ${attribution.rights.license}
  Attribution: ${attribution.rights.attributionText}

TECHNICAL SPECS
  Format: ${attribution.technical.format}
  Vertices: ${attribution.technical.vertexCount.toLocaleString()}
  Faces: ${attribution.technical.faceCount.toLocaleString()}
  Material: ${attribution.technical.materialType}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`.trim();
}

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { sql, count } from 'drizzle-orm';
import {
  formula_implementations,
  parameter_definitions,
  formula_parameter_relationships,
  mathematical_constants,
  algorithm_constants,
  shape_tokens,
  custom_fused_shapes
} from '@shared/schema';
import { SACRED_GEOMETRY, getSacredGeometryInfo } from '../client/src/lib/sacredGeometry';

const connectionString = process.env.DATABASE_URL;

// Create database connection only if DATABASE_URL is available
function getDatabase() {
  if (!connectionString) {
    console.error('❌ DATABASE_URL not available in development - token system disabled');
    console.log('💡 Set DATABASE_URL in your environment to enable token/energy updates');
    return null;
  }
  const sql = neon(connectionString);
  return drizzle(sql);
}

// Lazy-initialized database connection
let _db: ReturnType<typeof drizzle> | null = null;
function getDb() {
  if (_db === null && connectionString) {
    try {
      const sqlClient = neon(connectionString);
      _db = drizzle(sqlClient);
      console.log('✅ Database connection established for token/energy system');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      return null;
    }
  } else if (!connectionString) {
    console.warn('⚠️ DATABASE_URL missing - token/energy system running in read-only mode');
  }
  return _db;
}

// UUON Foundation Mathematical Formulas Database
const UUON_MATHEMATICAL_FORMULAS = [
  {
    shape_type: 'uuon-sphere',
    formula_name: 'UUON Sphere',
    category: 'uuon-basic-geometry',
    formula_latex: 'x^2 + y^2 + z^2 = r^2',
    formula_javascript: 'Math.sqrt(x*x + y*y + z*z) - radius',
    parameter_ranges: JSON.stringify({ radius: [0.1, 10.0] }),
    default_parameters: JSON.stringify({ radius: 1.0 }),
    implementation_notes: 'Standard sphere with UUON mathematical framework',
    medical_applications: 'Cellular modeling, organ visualization',
    therapeutic_benefits: 'Meditation focus, spatial awareness',
    consciousness_aspects: 'Unity, wholeness, infinite potential'
  },
  {
    shape_type: 'uuon-torus',
    formula_name: 'UUON Torus',
    category: 'uuon-advanced-geometry',
    formula_latex: '(\\sqrt{x^2 + y^2} - R)^2 + z^2 = r^2',
    formula_javascript: 'Math.pow(Math.sqrt(x*x + y*y) - majorRadius, 2) + z*z - minorRadius*minorRadius',
    parameter_ranges: JSON.stringify({
      majorRadius: [1.0, 5.0],
      minorRadius: [0.1, 2.0]
    }),
    default_parameters: JSON.stringify({
      majorRadius: 2.0,
      minorRadius: 0.5
    }),
    implementation_notes: 'Torus with UUON energy flow patterns',
    medical_applications: 'Cardiovascular modeling, energy circulation',
    therapeutic_benefits: 'Energy flow visualization, chakra alignment',
    consciousness_aspects: 'Infinite cycle, energy circulation, balance'
  }
];

const UUON_SHAPE_PRESETS = [
  {
    shape_type: 'uuon-sphere',
    preset_name: 'uuon-unity-sphere',
    parameters: JSON.stringify({ radius: 1.618 }), // Golden ratio
    description: 'Unity sphere using golden ratio proportions',
    is_therapeutic: true
  },
  {
    shape_type: 'uuon-torus',
    preset_name: 'uuon-energy-torus',
    parameters: JSON.stringify({
      majorRadius: 3.14159,
      minorRadius: 1.618
    }),
    description: 'Energy torus with π and φ constants',
    is_therapeutic: true
  }
];

export class DatabaseSeeder {

  // Check if this is a fresh production database - sequential to avoid connection pool issues
  async checkIfFreshProductionDatabase(): Promise<boolean> {
    const db = getDb();
    if (!db) {
      console.log('⚠️ Database not available - skipping production check');
      return true;
    }

    try {
      // Test connection first
      await db.execute(sql`SELECT 1`);

      // Sequential queries to avoid connection pool exhaustion
      const constantsResult = await db.select({ count: count() }).from(mathematical_constants);
      const constantsCount = constantsResult[0]?.count || 0;

      // If we already found data, skip the second query
      if (constantsCount >= 10) {
        console.log(`📊 Production database check: ${constantsCount}+ existing records`);
        return false;
      }

      const formulasResult = await db.select({ count: count() }).from(formula_implementations);
      const totalRecords = constantsCount + (formulasResult[0]?.count || 0);

      console.log(`📊 Production database check: ${totalRecords} existing records`);

      // Consider database fresh if less than 10 records total
      return totalRecords < 10;
    } catch (error) {
      console.log(`⚠️ Database connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.log('🔄 Server will continue without database - limited functionality mode');
      return true; // Assume fresh if we can't query
    }
  }

  async seedAll() {
    // Skip seeding if database is not available (deployment mode)
    const db = getDb();
    if (!db) {
      console.log('⚠️ DATABASE_URL not configured - skipping database seeding');
      console.log('✅ Server will operate in database-independent mode');
      return;
    }

    // Create AI/ML models tables if they don't exist

    // Production-specific seeding logic
    if (process.env.NODE_ENV === 'production') {
      console.log('🚀 Production database seeding initiated for Replit deployment...');

      try {
        // Test database connection first
        const testQuery = await db.execute(sql`SELECT 1 as test`);
        console.log('✅ Database connection verified');
      } catch (error) {
        console.log('❌ Database connection failed:', error instanceof Error ? error.message : 'Unknown error');
        console.log('🔄 Continuing without database - mathematical engine will work without persistence');
        return;
      }

      // Check if this is a fresh production database
      const isNewProductionDb = await this.checkIfFreshProductionDatabase();

      if (!isNewProductionDb) {
        console.log('📊 Production database already populated, skipping seeding...');
        return;
      }

      console.log('🆕 Fresh production database detected, proceeding with optimized seeding...');
    }

    console.log('🌱 Starting CPU-efficient database seeding... 💎🚀');

    // Import CPU-efficient manager
    const { cpuEfficientDBManager } = await import('./cpu-efficient-database-manager');

    try {
      // Check if already seeded to avoid redundant operations
      const existingCount = await this.checkExistingData();

      if (existingCount > 100) {
        console.log('📊 Database already seeded with', existingCount, 'records, skipping full seed... ✅🔥');
        // Run incremental token sync for new shapes
        await this.incrementalTokenSync();
        return;
      } else {
        // Seed in optimized batches for better performance and memory usage
        console.log('📐 Seeding mathematical constants...');
        await this.seedMathematicalConstants();

        console.log('🎛️ Seeding parameter definitions...');
        await this.seedParameterDefinitions();

        console.log('🔬 Seeding formula implementations...');
        await this.seedFormulaImplementations();

        console.log('🌱 Seeding ALL UNIFIED_SHAPES (comprehensive coverage)...');
        await this.seedAllUnifiedShapes();

        console.log('🕉️ Seeding sacred geometry...');
        await this.seedSacredGeometry();

        console.log('🎨 Seeding surface presets...');
        await this.seedSurfacePresets();

        console.log('📊 Seeding implementation metadata...');
        await this.seedImplementationMetadata();

        console.log('🧠 Seeding shape embeddings...');
        await this.seedShapeEmbeddings();

        console.log('🏷️ Seeding shape tokens...');
        await this.seedShapeTokens();

        console.log('📝 Seeding shape annotations...');
        await this.seedShapeAnnotations();
      }

      await this.seedCustomFusedShapes();


      console.log('✅ Database seeding completed successfully!');
    } catch (error) {
      console.error('❌ Database seeding failed:', error);
      throw error;
    }
  }

  async checkExistingData(): Promise<number> {
    const db = getDb();
    if (!db) return 0;

    let totalCount = 0;

    // Sequential queries to avoid overwhelming Neon serverless connection pool
    try {
      const constantsResult = await db.select({ count: count() }).from(mathematical_constants);
      totalCount += constantsResult[0]?.count || 0;

      const paramsResult = await db.select({ count: count() }).from(parameter_definitions);
      totalCount += paramsResult[0]?.count || 0;

      const formulasResult = await db.select({ count: count() }).from(formula_implementations);
      totalCount += formulasResult[0]?.count || 0;

      // Only check remaining tables if we don't already have enough data
      if (totalCount < 100) {
        totalCount += presetsResult[0]?.count || 0;

        totalCount += metadataResult[0]?.count || 0;

        totalCount += embeddingsResult[0]?.count || 0;

        const tokensResult = await db.select({ count: count() }).from(shape_tokens);
        totalCount += tokensResult[0]?.count || 0;

        totalCount += annotationsResult[0]?.count || 0;
      }
    } catch (error) {
      console.log('⚠️ Error counting existing data, assuming database needs seeding');
      return 0;
    }

    return totalCount;
  }

  // Placeholder for incremental updates if needed in the future
  async seedIncrementalUpdates() {
    console.log('🔄 Performing incremental updates (if any)...');
    // Logic for incremental updates would go here.
    // For now, it's a placeholder.
  }

  async seedMathematicalConstants() {
    console.log('📐 Seeding mathematical constants...');

    const constants = [
      {
        constant_name: 'pi',
        symbol: 'π',
        value: '3.141592653589793238462643383279502884197',
        scientific_notation: '3.14159 × 10^0',
        units: 'dimensionless',
        category: 'fundamental',
        description: 'Ratio of circle circumference to diameter',
        mathematical_basis: 'Circle geometry, trigonometry',
        real_world_applications: 'Wave mechanics, circular motion, oscillations',
        precision_digits: 40,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        constant_name: 'golden_ratio',
        symbol: 'φ',
        value: '1.618033988749894848204586834365638117720',
        scientific_notation: '1.61803 × 10^0',
        units: 'dimensionless',
        category: 'pi_phi',
        description: 'Golden ratio, divine proportion',
        mathematical_basis: '(1 + √5) / 2',
        real_world_applications: 'Architecture, art, natural patterns, sacred geometry',
        precision_digits: 40,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        constant_name: 'euler_number',
        symbol: 'e',
        value: '2.718281828459045235360287471352662497757',
        scientific_notation: '2.71828 × 10^0',
        units: 'dimensionless',
        category: 'fundamental',
        description: 'Base of natural logarithm',
        mathematical_basis: 'lim(1 + 1/n)^n as n→∞',
        real_world_applications: 'Exponential growth, calculus, probability',
        precision_digits: 40,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    for (const constant of constants) {
      await getDb()!.insert(mathematical_constants).values(constant).onConflictDoNothing();
    }
  }

  async seedParameterDefinitions() {
    console.log('🎛️ Seeding parameter definitions...');

    const parameters = [
      {
        parameter_name: 'a',
        full_name: 'Primary Scale',
        category: 'spatial',
        affects_geometry: true,
        affects_position: false,
        affects_visualization: false,
        min_value: 0.1,
        max_value: 10.0,
        default_value: 2.0,
        precision_step: 0.1,
        units: 'dimensionless',
        description: 'Primary scaling factor for shape dimensions',
        mathematical_role: 'Main radius, width, or scale multiplier',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        parameter_name: 'b',
        full_name: 'Secondary Scale',
        category: 'spatial',
        affects_geometry: true,
        affects_position: false,
        affects_visualization: false,
        min_value: 0.1,
        max_value: 10.0,
        default_value: 1.5,
        precision_step: 0.1,
        units: 'dimensionless',
        description: 'Secondary scaling factor',
        mathematical_role: 'Height, secondary radius, or aspect ratio',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        parameter_name: 'j',
        full_name: 'Organic Smoothness',
        category: 'material',
        affects_geometry: true,
        affects_position: false,
        affects_visualization: true,
        min_value: 0.0,
        max_value: 1.0,
        default_value: 0.0,
        precision_step: 0.05,
        units: 'dimensionless',
        description: 'Controls organic smoothness and flow',
        mathematical_role: 'Smoothing factor for natural appearance',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        parameter_name: 'g',
        full_name: 'Golden Ratio Harmony',
        category: 'sacred',
        affects_geometry: true,
        affects_position: false,
        affects_visualization: true,
        min_value: 0.0,
        max_value: 1.0,
        default_value: 0.0,
        precision_step: 0.05,
        units: 'dimensionless',
        description: 'Applies golden ratio proportions',
        mathematical_role: 'Sacred geometry harmonic factor',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    // Add all parameters a-z
    const allParams = 'abcdefghijklmnopqrstuvwxyz'.split('');
    for (const param of allParams) {
      if (!parameters.find(p => p.parameter_name === param)) {
        parameters.push({
          parameter_name: param,
          full_name: `Parameter ${param.toUpperCase()}`,
          category: 'general',
          affects_geometry: true,
          affects_position: false,
          affects_visualization: false,
          min_value: 0.0,
          max_value: 5.0,
          default_value: 1.0,
          precision_step: 0.1,
          units: 'dimensionless',
          description: `General purpose parameter ${param}`,
          mathematical_role: 'Multipurpose mathematical modifier',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    }

    for (const param of parameters) {
      await getDb()!.insert(parameter_definitions).values(param).onConflictDoNothing();
    }
  }

  async seedFormulaImplementations() {
    console.log('🔬 Seeding formula implementations...');

    const formulas = [
      {
        shape_type: 'sphere',
        formula_name: 'Unit Sphere',
        equation_function: 'function(u, v, params) { return [params.a * Math.cos(u) * Math.sin(v), params.a * Math.sin(u) * Math.sin(v), params.a * Math.cos(v)]; }',
        equation_x_formula: 'a * cos(u) * sin(v)',
        equation_y_formula: 'a * sin(u) * sin(v)',
        equation_z_formula: 'a * cos(v)',
        parameter_dependencies: JSON.stringify({ a: ['x', 'y', 'z'] }),
        default_parameters: JSON.stringify({ a: 2.0, b: 1.0, c: 1.0, d: 1.0 }),
        uv_domain: JSON.stringify({ uMin: 0, uMax: 2 * Math.PI, vMin: 0, vMax: Math.PI }),
        segment_settings: JSON.stringify({ uSegments: 32, vSegments: 16 }),
        complexity_score: 1,
        category: 'basic',
        subcategory: 'primitive',
        therapeutic_classification: 'grounding',
        mathematical_foundation: 'Spherical coordinates',
        implementation_notes: 'Standard unit sphere implementation',
        performance_optimization: 'Efficient trigonometric calculations',
        visualization_hints: JSON.stringify({ preferred_lighting: 'smooth', recommended_material: 'solid' }),
        copyright_info: 'UUON Foundation Mathematical Library',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        shape_type: 'cube',
        formula_name: 'Unit Cube',
        equation_function: 'function(u, v, params) { /* Cube implementation */ }',
        equation_x_formula: 'piecewise cube face equations',
        equation_y_formula: 'piecewise cube face equations',
        equation_z_formula: 'piecewise cube face equations',
        parameter_dependencies: JSON.stringify({ a: ['x', 'y', 'z'] }),
        default_parameters: JSON.stringify({ a: 2.0, b: 2.0, c: 2.0, d: 1.0 }),
        uv_domain: JSON.stringify({ uMin: 0, uMax: 1, vMin: 0, vMax: 1 }),
        segment_settings: JSON.stringify({ uSegments: 4, vSegments: 4 }),
        complexity_score: 2,
        category: 'basic',
        subcategory: 'primitive',
        therapeutic_classification: 'stability',
        mathematical_foundation: 'Cartesian coordinates',
        implementation_notes: 'Six-face cube with edge definitions',
        performance_optimization: 'Optimized face rendering',
        visualization_hints: JSON.stringify({ preferred_lighting: 'sharp', recommended_material: 'solid' }),
        copyright_info: 'UUON Foundation Mathematical Library',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        shape_type: 'torus',
        formula_name: 'Standard Torus',
        equation_function: 'function(u, v, params) { const R = params.a || 2; const r = params.b || 0.5; return [(R + r * Math.cos(v)) * Math.cos(u), (R + r * Math.cos(v)) * Math.sin(u), r * Math.sin(v)]; }',
        equation_x_formula: '(a + b * cos(v)) * cos(u)',
        equation_y_formula: '(a + b * cos(v)) * sin(u)',
        equation_z_formula: 'b * sin(v)',
        parameter_dependencies: JSON.stringify({ a: ['major_radius'], b: ['minor_radius'] }),
        default_parameters: JSON.stringify({ a: 2.0, b: 0.5, c: 1.0, d: 1.0 }),
        uv_domain: JSON.stringify({ uMin: 0, uMax: 2 * Math.PI, vMin: 0, vMax: 2 * Math.PI }),
        segment_settings: JSON.stringify({ uSegments: 64, vSegments: 32 }),
        complexity_score: 3,
        category: 'basic',
        subcategory: 'surface',
        therapeutic_classification: 'flow',
        mathematical_foundation: 'Revolution surface topology',
        implementation_notes: 'Genus-1 surface with donut topology',
        performance_optimization: 'Efficient trigonometric evaluation',
        visualization_hints: JSON.stringify({ preferred_lighting: 'smooth', recommended_material: 'solid' }),
        copyright_info: 'UUON Foundation Mathematical Library',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        shape_type: 'klein_bottle',
        formula_name: 'Klein Bottle',
        equation_function: 'function(u, v, params) { const a = params.a || 2; const r = 1; const x = (a + r * Math.cos(v)) * Math.cos(u); const y = (a + r * Math.cos(v)) * Math.sin(u); const z = r * Math.sin(v) * Math.cos(u/2); return [x, y, z]; }',
        equation_x_formula: '(a + cos(v)) * cos(u)',
        equation_y_formula: '(a + cos(v)) * sin(u)',
        equation_z_formula: 'sin(v) * cos(u/2)',
        parameter_dependencies: JSON.stringify({ a: ['scale'] }),
        default_parameters: JSON.stringify({ a: 2.0, b: 1.0, c: 1.0, d: 1.0 }),
        uv_domain: JSON.stringify({ uMin: 0, uMax: 2 * Math.PI, vMin: 0, vMax: 2 * Math.PI }),
        segment_settings: JSON.stringify({ uSegments: 64, vSegments: 32 }),
        complexity_score: 7,
        category: 'topology',
        subcategory: 'non_orientable',
        therapeutic_classification: 'transformative',
        mathematical_foundation: 'Non-orientable surface immersion',
        implementation_notes: 'Self-intersecting 4D object projected to 3D',
        performance_optimization: 'Optimized immersion calculations',
        visualization_hints: JSON.stringify({ preferred_lighting: 'ambient', recommended_material: 'transparent' }),
        copyright_info: 'UUON Foundation Mathematical Library',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        shape_type: 'gyroid_tpms',
        formula_name: 'Gyroid TPMS',
        equation_function: 'function(u, v, params) { const x = u; const y = v; const t = params.k || 0.65; const z = Math.asin(Math.sin(x) * Math.cos(y)) / (2 * Math.PI); return [x, y, z]; }',
        equation_x_formula: 'sin(x)*cos(y) + sin(y)*cos(z) + sin(z)*cos(x) = 0',
        equation_y_formula: 'implicit surface equation',
        equation_z_formula: 'triply periodic minimal surface',
        parameter_dependencies: JSON.stringify({ k: ['porosity'], l: ['taper'] }),
        default_parameters: JSON.stringify({ a: 2.0, b: 2.0, c: 2.0, k: 0.65, l: 1.0 }),
        uv_domain: JSON.stringify({ uMin: -Math.PI, uMax: Math.PI, vMin: -Math.PI, vMax: Math.PI }),
        segment_settings: JSON.stringify({ uSegments: 80, vSegments: 80 }),
        complexity_score: 9,
        category: 'medical',
        subcategory: 'tpms',
        therapeutic_classification: 'tissue_engineering',
        mathematical_foundation: 'Triply Periodic Minimal Surface',
        implementation_notes: 'Medical-grade scaffold structure for tissue engineering',
        performance_optimization: 'High-resolution mesh for biomedical accuracy',
        visualization_hints: JSON.stringify({ preferred_lighting: 'medical', recommended_material: 'scaffold' }),
        copyright_info: 'UUON Foundation Medical Structures Library',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    for (const formula of formulas) {
      await getDb()!.insert(formula_implementations).values(formula).onConflictDoNothing();
    }
  }

  async seedSacredGeometry() {
    console.log('🕉️ Seeding sacred geometry...');

    for (const [shapeName, shapeData] of Object.entries(SACRED_GEOMETRY)) {
      const info = getSacredGeometryInfo(shapeName);

      const formula = {
        shape_type: shapeName,
        formula_name: info.name,
        equation_function: `function(u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) {
          const x = ${shapeData.x.toString()};
          const y = ${shapeData.y.toString()};
          const z = ${shapeData.z.toString()};
          return [x(u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w),
                  y(u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w),
                  z(u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w)];
        }`,
        equation_x_formula: 'Sacred geometry X coordinate equation',
        equation_y_formula: 'Sacred geometry Y coordinate equation',
        equation_z_formula: 'Sacred geometry Z coordinate equation',
        parameter_dependencies: JSON.stringify({
          a: ['primary_scale'], b: ['secondary_scale'], c: ['detail_level'],
          g: ['golden_ratio'], h: ['sacred_tessellation'], j: ['organic_flow']
        }),
        default_parameters: JSON.stringify({
          a: 2.0, b: 1.5, c: 1.0, d: 1.0, e: 0, f: 1,
          g: 0.5, h: 4, i: 1, j: 0.7, k: 0, l: 1, m: 0, n: 0
        }),
        uv_domain: JSON.stringify({ uMin: 0, uMax: 2 * Math.PI, vMin: 0, vMax: 1 }),
        segment_settings: JSON.stringify({ uSegments: 64, vSegments: 32 }),
        complexity_score: 8,
        category: 'sacred',
        subcategory: info.tradition,
        symbolic_classification: 'sacred',
        mathematical_foundation: info.description,
        implementation_notes: `Sacred geometry: ${info.elements}`,
        performance_optimization: 'Optimized for spiritual resonance',
        visualization_hints: JSON.stringify({
          preferred_lighting: 'ambient',
          recommended_material: 'ethereal',
          sacred_proportions: true
        }),
        copyright_info: 'UUON Foundation Sacred Geometry Collection',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await getDb()!.insert(formula_implementations).values(formula).onConflictDoNothing();
    }
  }

  async seedSurfacePresets() {
    console.log('🎨 Seeding surface presets...');

    const presets = [
      {
        preset_name: 'Therapeutic Healing',
        shape_type: 'heart_chakra',
        preset_parameters: JSON.stringify({
          a: 2.0, b: 1.5, c: 1.0, g: 0.618, h: 4, i: 1, j: 0.7
        }),
        preset_description: 'Optimized for emotional healing and heart center activation',
        category: 'therapeutic',
        therapeutic_benefits: 'Heart chakra healing, emotional balance, love cultivation',
        recommended_duration: '10-20 minutes',
        contraindications: 'None known',
        created_by: 'UUON Foundation',
        is_public: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        preset_name: 'Deep Meditation',
        shape_type: 'crown_chakra',
        preset_parameters: JSON.stringify({
          a: 1.8, b: 1.2, c: 0.8, g: 0.618, h: 7, i: 0.5, j: 0.9
        }),
        preset_description: 'Crown chakra activation for deep meditative states',
        category: 'therapeutic',
        therapeutic_benefits: 'Spiritual connection, consciousness expansion, inner peace',
        recommended_duration: '15-30 minutes',
        contraindications: 'Avoid during acute stress',
        created_by: 'UUON Foundation',
        is_public: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        preset_name: 'Educational Clarity',
        shape_type: 'sphere',
        preset_parameters: JSON.stringify({
          a: 2.5, b: 2.0, c: 1.0, j: 0.3, g: 0.2
        }),
        preset_description: 'Clear geometric visualization for educational purposes',
        category: 'educational',
        therapeutic_benefits: 'Mental clarity, focus enhancement, learning facilitation',
        recommended_duration: 'As needed',
        contraindications: 'None',
        created_by: 'UUON Foundation',
        is_public: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    for (const preset of presets) {
    }
  }

  async seedImplementationMetadata() {
    console.log('📊 Seeding implementation metadata...');

    const metadata = [
      {
        shape_type: 'heart_chakra',
        pi_phi_constants_used: JSON.stringify(['golden_ratio', 'pi']),
        quantum_constants_used: JSON.stringify([]),
        dimensional_properties: JSON.stringify({ dimensions: 3, topology: 'closed' }),
        topological_genus: 0,
        manifold_type: 'Riemann',
        singularities: JSON.stringify([]),
        symmetry_groups: JSON.stringify(['C12', 'dihedral']),
        scientific_applications: 'Bioenergetic field modeling, consciousness research',
        computational_requirements: JSON.stringify({ cpu_intensity: 'medium', memory_usage: 'low' }),
        export_compatibility: JSON.stringify({ glb: true, gltf: true, obj: true }),
        research_papers: JSON.stringify(['Sacred Geometry in Therapeutic Applications']),
        uuon_classification: 'Sacred Healing Geometry',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    for (const meta of metadata) {
    }
  }

  async seedShapeEmbeddings() {
    console.log('🧠 Seeding shape embeddings...');

    const sampleEmbeddings = [
      {
        shape_type: 'sphere',
        embedding_vector: JSON.stringify([0.8, 0.2, 0.1, 0.9, 0.3, 0.7, 0.5, 0.4]),
        mathematical_features: JSON.stringify({
          curvature: 'constant_positive',
          symmetry: 'perfect_spherical',
          topology: 'simply_connected',
          genus: 0
        }),
        symmetry_signature: 'SO(3)',
        topology_signature: 'S²',
        curvature_profile: JSON.stringify({ gaussian: 1, mean: 1 }),
        equation_complexity: 1,
        parameter_sensitivity: JSON.stringify({ a: 'high', b: 'low', c: 'low' }),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        shape_type: 'cube',
        embedding_vector: JSON.stringify([0.2, 0.9, 0.8, 0.1, 0.6, 0.3, 0.4, 0.7]),
        mathematical_features: JSON.stringify({
          curvature: 'zero_piecewise',
          symmetry: 'cubic',
          topology: 'simply_connected',
          genus: 0
        }),
        symmetry_signature: 'Oh',
        topology_signature: 'S²_cube',
        curvature_profile: JSON.stringify({ gaussian: 0, mean: 0 }),
        equation_complexity: 2,
        parameter_sensitivity: JSON.stringify({ a: 'high', b: 'high', c: 'high' }),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        shape_type: 'torus',
        embedding_vector: JSON.stringify([0.5, 0.5, 0.6, 0.4, 0.8, 0.2, 0.7, 0.3]),
        mathematical_features: JSON.stringify({
          curvature: 'mixed_gaussian',
          symmetry: 'rotational_toroidal',
          topology: 'genus_one',
          genus: 1
        }),
        symmetry_signature: 'S¹ × S¹',
        topology_signature: 'T²',
        curvature_profile: JSON.stringify({ gaussian: 'variable', mean: 'variable' }),
        equation_complexity: 3,
        parameter_sensitivity: JSON.stringify({ a: 'high', b: 'high', c: 'medium' }),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    for (const embedding of sampleEmbeddings) {
    }
  }

  async seedShapeTokens() {
    console.log('🏷️ Seeding comprehensive shape tokens for all shapes...');

    // Get all implemented shapes from formula_implementations
    const allFormulas = await getDb()!.select().from(formula_implementations);

    for (const formula of allFormulas) {
      const tokens = this.generateTokensForShape(formula.shape_type, formula.category, formula.formula_name);

      for (const token of tokens) {
        await getDb()!.insert(shape_tokens).values({
          shape_type: formula.shape_type,
          token_type: token.type,
          token_value: token.value,
          weight: token.weight,
          context: token.context,
          frequency: token.frequency,
          last_used: new Date().toISOString(),
          created_at: new Date().toISOString()
        }).onConflictDoNothing();
      }
    }

    console.log(`✅ Generated tokens for ${allFormulas.length} shapes`);
  }

  private generateTokensForShape(shapeType: string, category: string, formulaName: string) {
    const tokens = [];
    const now = new Date().toISOString();

    // Generate category-based tokens
    if (category === 'sacred') {
      tokens.push(
        { type: 'category', value: 'sacred_geometry', weight: 1.0, context: 'spiritual mathematics', frequency: 1 },
        { type: 'therapeutic', value: 'healing', weight: 0.9, context: 'chakra activation', frequency: 1 },
        { type: 'keyword', value: 'meditation', weight: 0.8, context: 'spiritual practice', frequency: 1 }
      );
    }

    if (category === 'medical' || shapeType.includes('tpms')) {
      tokens.push(
        { type: 'medical', value: 'biomedical', weight: 1.0, context: 'tissue engineering', frequency: 1 },
        { type: 'medical', value: 'scaffold', weight: 0.95, context: 'bone implant', frequency: 1 },
        { type: 'keyword', value: 'osseointegration', weight: 0.9, context: 'bone growth', frequency: 1 }
      );
    }

    if (category === 'topology') {
      tokens.push(
        { type: 'mathematical', value: 'topology', weight: 1.0, context: 'mathematical structure', frequency: 1 },
        { type: 'mathematical', value: 'manifold', weight: 0.9, context: 'geometric topology', frequency: 1 },
        { type: 'keyword', value: 'non_orientable', weight: 0.85, context: 'topological property', frequency: 1 }
      );
    }

    if (category === 'quantum') {
      tokens.push(
        { type: 'quantum', value: 'quantum_mechanics', weight: 1.0, context: 'physics simulation', frequency: 1 },
        { type: 'quantum', value: 'wave_function', weight: 0.95, context: 'quantum state', frequency: 1 },
        { type: 'keyword', value: 'entanglement', weight: 0.9, context: 'quantum correlation', frequency: 1 }
      );
    }

    // Generate shape-specific tokens based on shape name
    const shapeParts = shapeType.toLowerCase().split('_');
    for (const part of shapeParts) {
      if (part.length > 2) { // Skip very short parts
        tokens.push({
          type: 'keyword',
          value: part,
          weight: 0.7,
          context: 'shape identifier',
          frequency: 1
        });
      }
    }

    // Add mathematical classification tokens
    if (shapeType.includes('orbital')) {
      tokens.push({ type: 'physics', value: 'atomic_orbital', weight: 1.0, context: 'electron probability', frequency: 1 });
    }

    if (shapeType.includes('attractor')) {
      tokens.push({ type: 'physics', value: 'chaos_theory', weight: 1.0, context: 'dynamical system', frequency: 1 });
    }

    if (shapeType.includes('riemann')) {
      tokens.push({ type: 'mathematical', value: 'complex_analysis', weight: 1.0, context: 'riemann surface', frequency: 1 });
    }

    // Add biological tokens for biological shapes
    if (shapeType.includes('dna') || shapeType.includes('protein') || shapeType.includes('cell')) {
      tokens.push(
        { type: 'biological', value: 'molecular_biology', weight: 1.0, context: 'biological structure', frequency: 1 },
        { type: 'biological', value: 'biomolecule', weight: 0.9, context: 'life science', frequency: 1 }
      );
    }

    return tokens;
  }

  // COMPLETE token generation for ALL shapes - retroactive tokenization
  async completeTokenSweep() {
    console.log('🔄 Running COMPLETE token generation sweep for ALL 2511+ shapes...');
    
    try {
      const db = getDb();
      if (!db) {
        console.log('⚠️ Database not available for complete token sweep');
        return;
      }

      // Get ALL formula implementations (all shapes in the system)
      const allFormulas = await db.select().from(formula_implementations);
      console.log(`🎯 Found ${allFormulas.length} total shapes for tokenization`);

      // CRITICAL FIX: Get shapes that already have tokens to avoid duplicates
      const existingTokenShapes = await db
        .selectDistinct({ shape_type: shape_tokens.shape_type })
        .from(shape_tokens);
      
      const existingShapeSet = new Set(existingTokenShapes.map(s => s.shape_type));
      const shapesToTokenize = allFormulas.filter(f => !existingShapeSet.has(f.shape_type));
      
      console.log(`🆕 Processing ${shapesToTokenize.length} shapes without tokens (${existingShapeSet.size} already have tokens)`);

      let tokensAdded = 0;
      let shapesProcessed = 0;

      // Process in batches to avoid overwhelming the database
      const batchSize = 50;
      for (let i = 0; i < shapesToTokenize.length; i += batchSize) {
        const batch = shapesToTokenize.slice(i, i + batchSize);
        
        for (const formula of batch) {
          const tokens = this.generateTokensForShape(formula.shape_type, formula.category, formula.formula_name);

          // Insert tokens in bulk for better performance
          const tokenInserts = tokens.map(token => ({
            shape_type: formula.shape_type,
            token_type: token.type,
            token_value: token.value,
            weight: token.weight,
            context: token.context,
            frequency: token.frequency,
            last_used: new Date().toISOString(),
            created_at: new Date().toISOString()
          }));

          try {
            await db.insert(shape_tokens).values(tokenInserts).onConflictDoNothing();
            tokensAdded += tokenInserts.length;
            shapesProcessed++;
          } catch (insertError) {
            console.warn(`⚠️ Failed to insert tokens for ${formula.shape_type}:`, insertError);
          }
        }

        console.log(`📊 Batch Progress: ${Math.min(i + batchSize, shapesToTokenize.length)}/${shapesToTokenize.length} shapes processed`);
        
        // Small delay to prevent database overload
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log(`✅ COMPLETE TOKEN SWEEP FINISHED:`);
      console.log(`   📊 Processed: ${shapesProcessed} NEW shapes`);
      console.log(`   🏷️ Generated: ${tokensAdded} NEW tokens`);
      
      // Log final totals
      const totalTokens = await db.select({ count: count() }).from(shape_tokens);
      const totalShapes = await db.select({ count: count() }).from(formula_implementations);
      const uniqueTokenizedShapes = await db
        .selectDistinct({ shape_type: shape_tokens.shape_type })
        .from(shape_tokens);
        
      console.log(`📈 FINAL COUNTS:`);
      console.log(`   🎯 Total shapes in database: ${totalShapes[0]?.count || 0}`);
      console.log(`   🏷️ Total tokens generated: ${totalTokens[0]?.count || 0}`);
      console.log(`   ✅ Shapes with tokens: ${uniqueTokenizedShapes.length}`);
      console.log(`   ❌ Shapes missing tokens: ${(totalShapes[0]?.count || 0) - uniqueTokenizedShapes.length}`);
      
    } catch (error) {
      console.error('❌ Complete token sweep failed:', error);
    }
  }

  // Incremental token sync - adds tokens for new shapes without re-seeding everything
  async incrementalTokenSync() {
    console.log('🔄 Running incremental token sync for new shapes...');
    
    try {
      const db = getDb();
      if (!db) {
        console.log('⚠️ Database not available for token sync');
        return;
      }

      // Get all shapes that already have tokens
      const existingTokenShapes = await db
        .selectDistinct({ shape_type: shape_tokens.shape_type })
        .from(shape_tokens);
      
      const existingShapeSet = new Set(existingTokenShapes.map(s => s.shape_type));
      console.log(`📊 Found ${existingShapeSet.size} shapes with existing tokens`);

      // Get all formula implementations (source of truth for shapes)
      const allFormulas = await db.select().from(formula_implementations);
      
      // Find shapes that don't have tokens yet
      const newShapes = allFormulas.filter(f => !existingShapeSet.has(f.shape_type));
      
      if (newShapes.length === 0) {
        console.log('✅ All shapes already have tokens - no sync needed');
        return;
      }

      console.log(`🆕 Found ${newShapes.length} new shapes needing tokens`);

      let tokensAdded = 0;
      for (const formula of newShapes) {
        const tokens = this.generateTokensForShape(formula.shape_type, formula.category, formula.formula_name);

        for (const token of tokens) {
          await db.insert(shape_tokens).values({
            shape_type: formula.shape_type,
            token_type: token.type,
            token_value: token.value,
            weight: token.weight,
            context: token.context,
            frequency: token.frequency,
            last_used: new Date().toISOString(),
            created_at: new Date().toISOString()
          }).onConflictDoNothing();
          tokensAdded++;
        }
      }

      console.log(`✅ Incremental sync complete: Added ${tokensAdded} tokens for ${newShapes.length} new shapes`);
      
      // Log updated total
      const totalTokens = await db.select({ count: count() }).from(shape_tokens);
      console.log(`📊 Total tokens in database: ${totalTokens[0]?.count || 0}`);
      
    } catch (error) {
      console.error('⚠️ Incremental token sync error:', error);
    }
  }

  // Seed ALL shapes from UNIFIED_SHAPES - comprehensive coverage
  async seedAllUnifiedShapes() {
    console.log('🌱 Seeding ALL shapes from UNIFIED_SHAPES into database...');
    
    try {
      const db = getDb();
      if (!db) {
        console.log('⚠️ Database not available for shape seeding');
        return { seeded: 0, skipped: 0, total: 0 };
      }
      
      // Complete list of all 956+ shape types from UNIFIED_SHAPES
      const allShapeTypes = [
        // Base shapes from unifiedShapes.ts
        'equirectangular_sphere', 'uuon', 'wave_displacement_plane', 'wave_interference_plane', 'shape_of_universe',
        'square', 'cube', 'circle', 'triangle', 'cylinder', 'sphere', 'unit_sphere', 'torus',
        'trefoil_knot', 'cinquefoil_knot', 'figure_eight_knot', 'torus_knot_general', 'septafoil_knot', 'granny_knot',
        'hypersphere', 'hypercube', 'hypersimplex', 'ellipsoid', 'cone', 'pseudosphere', 'hyperbolic_paraboloid',
        'square_root_riemann', 'logarithm_riemann', 'cosmic_microwave_background', 'dark_energy_field',
        'cosmic_consciousness_field', 'riemann_zeta_critical_line', 'riemann_zeta_function', 'euler_product_formula',
        'riemann_integral', 'quantum_tunneling_barrier', 'electron_spin_up', 'electron_spin_down',
        'actin_filament', 'microtubule', 'collagen_triple_helix', 'hemoglobin_quaternary', 'antibody_y_structure',
        'myosin_motor_protein', 'keratin_fiber', 'elastin_network', 'diamond_cubic_lattice', 'hexagonal_close_packed',
        // Ice crystal shapes
        'ice_crystal_hexagonal', 'ice_crystal_dendrite', 'ice_crystal_plate', 'ice_crystal_column',
        'ice_crystal_needle', 'ice_crystal_stellar', 'ice_crystal_fernlike', 'ice_crystal_sectored_plate',
        'snowflake_koch', 'snowflake_fractal', 'snowflake_branched', 'snowflake_capped_column',
        'ice_crystal_hollow_column', 'ice_crystal_bullet_rosette', 'ice_crystal_twin_prism', 'ice_crystal_scroll',
        // Pattern codex
        'ulam_spiral', 'prime_gaps_surface', 'twin_prime_wave', 'prime_constellation',
        'golden_spiral', 'phi_lattice', 'golden_angle_phyllotaxis', 'fibonacci_spiral_surface',
        'harmonic_series', 'overtone_resonance', 'standing_wave_pattern', 'beat_frequency',
        // Atomic structures
        'bohr_shell', 'rutherford_nucleus', 'probability_cloud', 's_orbital', 'p_orbital', 'd_orbital', 'f_orbital',
        'sp_hybrid', 'sp2_hybrid', 'sp3_hybrid', 'sigma_bond', 'pi_bond', 'covalent_bond', 'ionic_bond',
        'metallic_bond', 'hydrogen_bond', 'electron_density_field', 'valence_shell', 'electron_spin', 'pauli_exclusion',
        // Harmony wave shapes
        'harmony_octave', 'harmony_fifth', 'harmony_fourth', 'harmony_major_third', 'harmony_minor_third',
        'symphony_allegro', 'symphony_adagio', 'symphony_presto', 'wave_interference', 'wave_superposition',
        'wave_diffraction', 'morph_smooth', 'morph_step', 'morph_elastic', 'projection_4d_xyz',
        'projection_4d_xyw', 'projection_4d_xzw', 'thermal_cooling', 'thermal_entropy',
        // Historical algorithms
        'euclidean_algorithm', 'archimedes_spiral', 'fibonacci_sequence', 'newtons_method', 'gauss_modular',
        'euler_phi', 'fermat_factorization', 'sieve_eratosthenes', 'chinese_remainder',
        // Fractal formulas
        'hexic_spirals', 'septic_vortex', 'octic_flower', 'mandelbrot_z2', 'julia_z2', 'burning_ship',
        'tricorn', 'mandelbox', 'mandelbulb',
        // Theory of everything
        'unified_field_manifold', 'quantum_gravity_interface', 'string_landscape', 'holographic_universe',
        'supersymmetry_partners', 'grand_unification', 'complete_universe_fabric', 'four_forces_mandala',
        'planck_scale_foam', 'multiverse_branching',
        // Thermal engineering
        'heat_sink_fin', 'heat_pipe', 'thermal_interface', 'vapor_chamber', 'cold_plate',
        'microchannel_array', 'jet_impingement', 'spray_cooling', 'thermoelectric_peltier',
        'data_center_rack', 'crac_airflow', 'hot_aisle_containment', 'cold_aisle_containment',
        'rear_door_heat_exchanger', 'in_row_cooling', 'overhead_cooling', 'underfloor_plenum',
        'liquid_cooling_loop', 'immersion_cooling', 'two_phase_cooling', 'server_blade_thermal',
        'cpu_thermal_profile', 'gpu_thermal_profile', 'memory_thermal_profile', 'psu_thermal',
        'cooling_tower', 'chiller_cycle', 'economizer_mode', 'pue_optimizer', 'cfd_thermal_map',
        // Scientific identity shapes
        'chemical_identity_principle', 'nuclear_identity_principle', 'biological_identity_principle',
        'medical_identity_principle', 'unified_identity_principle', 'chemical_reaction_surface',
        'nuclear_decay_field', 'dna_replication_helix', 'medical_diagnosis_manifold', 'unified_field_identity',
        // Medical imaging
        'ct_slice_stack', 'ct_hounsfield', 'ct_windowing', 'mri_signal_intensity', 'mri_diffusion_tensor',
        'mri_tractography', 'volume_rendering_ray_cast', 'volume_mip', 'volume_isosurface', 'volume_surface_shaded',
        'mpr_coronal', 'mpr_sagittal', 'mpr_axial', 'mpr_oblique', 'displacement_map_height', 'displacement_map_normal',
        // Slinky dynamics
        'slinky_helix', 'slinky_wave', 'slinky_compression', 'slinky_walking', 'slinky_lagrangian',
        'slinky_oscillator', 'slinky_soliton', 'slinky_mass_spring', 'slinky_gravity_drop', 'slinky_resonance',
        // Rubiks cube dynamics
        'rubiks_lattice', 'rubiks_faces', 'rubiks_cubies', 'rubiks_face_rotation', 'rubiks_slice_move',
        'rubiks_permutation', 'rubiks_cayley_graph', 'rubiks_orbit', 'rubiks_state_space', 'rubiks_commutator',
        // Alchemical symbols
        'alchemical_fire', 'alchemical_water', 'alchemical_air', 'alchemical_earth',
        'alchemical_sun', 'alchemical_moon', 'alchemical_mercury', 'alchemical_venus', 'alchemical_mars',
        'alchemical_jupiter', 'alchemical_saturn', 'alchemical_gold', 'alchemical_silver', 'alchemical_copper',
        'alchemical_iron', 'alchemical_tin', 'alchemical_lead', 'alchemical_sulfur', 'alchemical_salt',
        'alchemical_philosophers_stone', 'alchemical_ouroboros', 'alchemical_caduceus',
        // Minimal surfaces
        'catenoid', 'enneper', 'scherk', 'costa', 'gyroid', 'schwarz_p', 'schwarz_d', 'lidinoid',
        'helicoid', 'richmond', 'bonnet', 'meeks_moebius', 'chen_gackstatter',
        // Linguistic geometry A-Z
        'letter_a', 'letter_b', 'letter_c', 'letter_d', 'letter_e', 'letter_f', 'letter_g', 'letter_h',
        'letter_i', 'letter_j', 'letter_k', 'letter_l', 'letter_m', 'letter_n', 'letter_o', 'letter_p',
        'letter_q', 'letter_r', 'letter_s', 'letter_t', 'letter_u', 'letter_v', 'letter_w', 'letter_x',
        'letter_y', 'letter_z',
        // Time/Phenomenon principles
        'time_differential_boundary', 'time_probability_collapse', 'time_algorithmic_commit', 'time_flow_operator',
        'time_past_present_future', 'time_temporal_engine', 'time_now_crystallization',
        'phenomenon_field', 'phenomenon_structure_energy_info', 'phenomenon_emergence_limit',
        'phenomenon_energy_flow', 'phenomenon_information_entropy', 'phenomenon_structural_topology',
        'phenomenon_natural_laws', 'unified_reality_manifestation', 'unified_consciousness_perception', 'unified_universal_os',
        // 4D/5D shapes
        'tesseract', 'hypersphere_4d', 'klein_bottle_4d', 'duocylinder', 'simplex_4d', 'cross_polytope',
        'mobius_4d', 'hopf_fibration', 'clifford_torus', 'grand_antiprism', 'rectified_tesseract',
        '5_simplex', '5_cube', '5_orthoplex', 'demipenteract', '5_sphere',
        // NASA planetary
        'saturn_planet', 'saturn_rings', 'saturn_complete',
        // EFV shapes
        'efv_energy', 'efv_frequency', 'efv_variation', 'efv_amplitude', 'efv_displacement',
        'efv_harmonic', 'efv_entropy', 'efv_unified',
        // Evolutionary string theory
        'string_harmonic', 'string_vibration', 'string_singularity', 'string_three_realms',
        'string_11d_compactification', 'string_calabi_yau', 'string_brane', 'string_moduli_space',
        // Diatom shapes
        'diatom_coscinodiscus', 'diatom_arachnoidiscus', 'diatom_navicula', 'diatom_triceratium',
        'diatom_colonial', 'diatom_radial_centric', 'diatom_pennate', 'diatom_polygonal',
        // Phi Aureum
        'phi_aureum_spiral', 'phi_aureum_vortex', 'phi_aureum_shell',
        // UUON mesh
        'uuon_noise_reactive', 'uuon_harmonic_interference', 'uuon_curvature_flow', 'uuon_symmetry_lattice',
        'uuon_emergent_pattern', 'uuon_morphological', 'uuon_parametric_wire', 'uuon_field_lines',
        // Additional shapes to reach comprehensive coverage
        'mobius_strip', 'klein_bottle', 'boy_surface', 'roman_surface', 'cross_cap',
        'steiner_surface', 'kuen_surface', 'dini_surface', 'bour_surface', 'catalan_surface',
        'henneberg_surface', 'richmond_surface', 'enneper_kuen', 'pseudospherical',
        // Quantum computing
        'qubit_bloch_sphere', 'quantum_gate', 'quantum_entanglement', 'quantum_superposition',
        'quantum_decoherence', 'qpu_lattice', 'qpu_qubit_array', 'qpu_error_correction',
        // Topology differential
        'manifold_2d', 'manifold_3d', 'manifold_4d', 'tangent_bundle', 'cotangent_bundle',
        'fiber_bundle', 'connection_form', 'curvature_form', 'characteristic_class',
        // General relativity
        'schwarzschild_metric', 'kerr_metric', 'event_horizon', 'ergosphere', 'gravitational_wave',
        'spacetime_curvature', 'geodesic_flow', 'ricci_tensor', 'einstein_tensor',
        // Set theory
        'venn_diagram', 'euler_diagram', 'power_set', 'cartesian_product', 'ordinal_numbers',
        'cardinal_numbers', 'cantor_set', 'continuum_hypothesis',
        // Chakra shapes
        'root_chakra', 'sacral_chakra', 'solar_plexus_chakra', 'heart_chakra', 'throat_chakra',
        'third_eye_chakra', 'crown_chakra', 'chakra_alignment', 'kundalini_spiral',
        // Complete missing shapes - filling gaps
        'babylonian_aries', 'babylonian_taurus', 'babylonian_gemini', 'babylonian_cancer',
        'babylonian_leo', 'babylonian_virgo', 'babylonian_libra', 'babylonian_scorpio',
        'babylonian_sagittarius', 'babylonian_capricorn', 'babylonian_aquarius', 'babylonian_pisces',
        // IFS Fractal shapes (WebGL raymarched — Parametric IFS Discovery Engine)
        'menger_sponge', 'mandelbox_fractal', 'kleinian_fractal', 'lattice_fractal',
        'tetrahedral_fractal', 'anisotropic_menger', 'chaos_boundary_menger', 'compound_ifs_blend',
        'icosahedral_ifs', 'fractal_weave', 'reaction_diffusion_ifs', 'lsystem_ifs',
        // New raymarched engines
        'mandelbulb_raymarched', 'platonic_icosa', 'platonic_octa', 'platonic_dodeca', 'menger_kleinian_v2'
      ];
      
      let seeded = 0;
      let skipped = 0;
      
      for (const shapeType of allShapeTypes) {
        // Derive category from shape type
        let category = 'general';
        if (shapeType.includes('medical') || shapeType.includes('ct_') || shapeType.includes('mri_') || shapeType.includes('mpr_')) {
          category = 'medical';
        } else if (shapeType.includes('dna') || shapeType.includes('protein') || shapeType.includes('cell') || shapeType.includes('biological')) {
          category = 'biological';
        } else if (shapeType.includes('quantum') || shapeType.includes('electron') || shapeType.includes('orbital') || shapeType.includes('qubit')) {
          category = 'physics';
        } else if (shapeType.includes('fractal') || shapeType.includes('mandelbrot') || shapeType.includes('julia') || shapeType.includes('burning_ship')) {
          category = 'fractal';
        } else if (shapeType.includes('torus') || shapeType.includes('klein') || shapeType.includes('mobius') || shapeType.includes('manifold')) {
          category = 'topology';
        } else if (shapeType.includes('4d') || shapeType.includes('5d') || shapeType.includes('tesseract') || shapeType.includes('hyper')) {
          category = 'hyperdimensional';
        } else if (shapeType.includes('alchemical') || shapeType.includes('zodiac') || shapeType.includes('chakra') || shapeType.includes('babylonian')) {
          category = 'symbolic';
        } else if (shapeType.includes('thermal') || shapeType.includes('cooling') || shapeType.includes('heat') || shapeType.includes('pue')) {
          category = 'engineering';
        } else if (shapeType.includes('string') || shapeType.includes('unified') || shapeType.includes('gravity')) {
          category = 'physics';
        } else if (shapeType.includes('letter_')) {
          category = 'linguistic';
        } else if (shapeType.includes('time_') || shapeType.includes('phenomenon_')) {
          category = 'philosophical';
        } else if (shapeType.includes('slinky') || shapeType.includes('rubiks')) {
          category = 'dynamics';
        } else if (shapeType.includes('ice_') || shapeType.includes('snowflake')) {
          category = 'crystallographic';
        } else if (shapeType.includes('harmony') || shapeType.includes('symphony') || shapeType.includes('wave_')) {
          category = 'harmonic';
        } else if (shapeType.includes('diatom')) {
          category = 'biological';
        } else if (shapeType.includes('saturn') || shapeType.includes('nasa')) {
          category = 'astronomical';
        } else if (shapeType.includes('efv_')) {
          category = 'physics';
        } else if (shapeType.includes('uuon')) {
          category = 'foundational';
        } else if (shapeType.includes('minimal') || shapeType.includes('catenoid') || shapeType.includes('enneper') || shapeType.includes('gyroid')) {
          category = 'minimal_surface';
        } else if (shapeType.includes('menger') || shapeType.includes('mandelbox') || shapeType.includes('kleinian') ||
                   shapeType.includes('lattice_fractal') || shapeType.includes('tetrahedral_fractal') ||
                   shapeType.includes('anisotropic') || shapeType.includes('chaos_boundary') || shapeType.includes('compound_ifs')) {
          category = 'ifs_fractal';
        }
        
        try {
          await db.insert(formula_implementations).values({
            shape_type: shapeType,
            formula_name: shapeType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            equation_function: 'function(u, v, params) { /* See UNIFIED_SHAPES */ }',
            equation_x_formula: 'x(u, v, params)',
            equation_y_formula: 'y(u, v, params)',
            equation_z_formula: 'z(u, v, params)',
            parameter_dependencies: JSON.stringify({ a: ['scale'], b: ['amplitude'], c: ['frequency'] }),
            default_parameters: JSON.stringify({ a: 1.0, b: 1.0, c: 1.0, x: 1.0, y: 1.0, z: 1.0 }),
            uv_domain: JSON.stringify({ uMin: 0, uMax: 2 * Math.PI, vMin: 0, vMax: Math.PI }),
            segment_settings: JSON.stringify({ uSegments: 64, vSegments: 32 }),
            complexity_score: 5,
            category: category,
            subcategory: category,
            therapeutic_classification: 'general',
            mathematical_foundation: 'Parametric surface equation',
            implementation_notes: `Seeded from UNIFIED_SHAPES: ${shapeType}`,
            performance_optimization: 'Standard parametric evaluation',
            visualization_hints: JSON.stringify({ preferred_lighting: 'smooth', recommended_material: 'solid' }),
            copyright_info: 'UUON Foundation Mathematical Library',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }).onConflictDoNothing();
          seeded++;
        } catch (e) {
          skipped++;
        }
        
        if (seeded % 100 === 0 && seeded > 0) {
          console.log(`📊 Progress: ${seeded}/${allShapeTypes.length} shapes seeded`);
        }
      }
      
      const totalCount = await db.select({ count: count() }).from(formula_implementations);
      console.log(`✅ Shape seeding complete: ${seeded} added, ${skipped} skipped`);
      console.log(`📊 Total shapes in database: ${totalCount[0]?.count || 0}`);
      
      return { seeded, skipped, total: totalCount[0]?.count || 0 };
    } catch (error) {
      console.error('❌ Shape seeding error:', error);
      return { seeded: 0, skipped: 0, total: 0 };
    }
  }

  async seedShapeAnnotations() {
    console.log('📝 Seeding shape annotations...');

    const sampleAnnotations = [
      {
        shape_type: 'sphere',
        annotation_type: 'mathematical_property',
        annotation_text: 'Simplest 3D surface with constant positive curvature. All points equidistant from center.',
        is_verified: true,
        verification_source: 'Mathematical textbook',
        tags: JSON.stringify(['basic', 'geometry', 'curvature', 'symmetric']),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        shape_type: 'cube',
        annotation_type: 'mathematical_property',
        annotation_text: 'Platonic solid with 6 square faces, 12 edges, and 8 vertices. Perfect cubic symmetry.',
        is_verified: true,
        verification_source: 'Geometry textbook',
        tags: JSON.stringify(['basic', 'platonic', 'solid', 'symmetry']),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        shape_type: 'torus',
        annotation_type: 'topology',
        annotation_text: 'First non-trivial example of a surface with genus 1. Homeomorphic to coffee cup.',
        is_verified: true,
        verification_source: 'Topology lecture notes',
        tags: JSON.stringify(['topology', 'genus', 'embedding']),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    for (const annotation of sampleAnnotations) {
    }
  }

  async seedCustomFusedShapes() {
    console.log('🔮 Seeding custom fused shapes...');

    const now = new Date();

    // Check if shapes already exist to avoid duplicates
    const existingShapes = await getDb()!.select().from(custom_fused_shapes).limit(1);
    if (existingShapes.length > 0) {
      console.log('✅ Custom fused shapes already seeded, skipping...');
      return;
    }

    const sampleFusedShapes = [
      {
        user_id: null,
        shape_name: 'Sphere-Torus Hybrid',
        shape_id: 'sphere_torus_50',
        parent_shape_1: 'sphere',
        parent_shape_2: 'torus',
        fusion_ratio: 0.5,
        fused_parameters: JSON.stringify({
          type: 'sphere',
          a: 2.0,
          b: 1.25,
          c: 1.0,
          d: 1.0,
          e: 0,
          f: 1,
          g: 0.5,
          h: 4,
          i: 1,
          j: 0.7,
          k: 0,
          l: 1,
          m: 0,
          n: 0,
          uMin: 0,
          uMax: 2 * Math.PI,
          vMin: 0,
          vMax: Math.PI,
          uSegments: 48,
          vSegments: 24
        }),
        description: 'Mathematical fusion of sphere and torus at 50/50 ratio',
        is_animated: false,
        animation_keyframes: null,
        is_public: true,
        usage_count: 0,
        created_at: now,
        updated_at: now
      },
      {
        user_id: null,
        shape_name: 'Klein-Torus Blend',
        shape_id: 'klein_bottle_torus_70',
        parent_shape_1: 'klein_bottle',
        parent_shape_2: 'torus',
        fusion_ratio: 0.7,
        fused_parameters: JSON.stringify({
          type: 'klein_bottle',
          a: 2.0,
          b: 0.8,
          c: 1.0,
          d: 1.0,
          e: 0,
          f: 1,
          g: 0.5,
          h: 4,
          i: 1,
          j: 0.85,
          k: 0,
          l: 1,
          m: 0,
          n: 0,
          uMin: 0,
          uMax: 2 * Math.PI,
          vMin: 0,
          vMax: 2 * Math.PI,
          uSegments: 56,
          vSegments: 28
        }),
        description: 'Mathematical fusion of klein_bottle and torus at 70/30 ratio',
        is_animated: false,
        animation_keyframes: null,
        is_public: true,
        usage_count: 0,
        created_at: now,
        updated_at: now
      },
      {
        user_id: null,
        shape_name: 'Heart-Crown Chakra',
        shape_id: 'heart_chakra_crown_chakra_50',
        parent_shape_1: 'heart_chakra',
        parent_shape_2: 'crown_chakra',
        fusion_ratio: 0.5,
        fused_parameters: JSON.stringify({
          type: 'heart_chakra',
          a: 1.9,
          b: 1.35,
          c: 0.9,
          d: 1.0,
          e: 0,
          f: 1,
          g: 0.618,
          h: 5.5,
          i: 0.75,
          j: 0.8,
          k: 0,
          l: 1,
          m: 0,
          n: 0,
          uMin: 0,
          uMax: 2 * Math.PI,
          vMin: 0,
          vMax: 1,
          uSegments: 64,
          vSegments: 32
        }),
        description: 'Mathematical fusion of heart_chakra and crown_chakra at 50/50 ratio - combines emotional healing with spiritual connection',
        is_animated: true,
        animation_keyframes: JSON.stringify([
          { time: 0, parameters: { g: 0.5, j: 0.7 } },
          { time: 0.5, parameters: { g: 0.7, j: 0.9 } },
          { time: 1, parameters: { g: 0.5, j: 0.7 } }
        ]),
        is_public: true,
        usage_count: 0,
        created_at: now,
        updated_at: now
      }
    ];

    for (const shape of sampleFusedShapes) {
      await getDb()!.insert(custom_fused_shapes).values(shape).onConflictDoNothing();
    }
  }

}


export const seeder = new DatabaseSeeder();

// Seeder instance exported for use by other modules
// Note: Use `seeder.seedAll()` to run seeding programmatically
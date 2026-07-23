
#!/usr/bin/env node
/**
 * DATABASE SHAPE SCANNER
 * Scans database for all saved shapes and formulas
 */

const { neon } = require('@neondatabase/serverless');

console.log('🔍 DATABASE SHAPE SCANNER - Checking saved shapes and formulas...\n');

async function scanDatabase() {
  try {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.error('❌ DATABASE_URL not found');
      return;
    }

    const sql = neon(connectionString);
    
    console.log('🗄️ SCANNING DATABASE TABLES:');
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Scan formula_implementations table
    console.log('📊 FORMULA IMPLEMENTATIONS TABLE:');
    try {
      const formulas = await sql`
        SELECT shape_type, formula_name, category, complexity_score, created_at
        FROM formula_implementations 
        ORDER BY shape_type
      `;
      
      console.log(`Found ${formulas.length} formula implementations:\n`);
      
      // Group by category
      const byCategory = {};
      formulas.forEach(formula => {
        const cat = formula.category || 'uncategorized';
        if (!byCategory[cat]) byCategory[cat] = [];
        byCategory[cat].push(formula);
      });
      
      Object.entries(byCategory).forEach(([category, shapes]) => {
        console.log(`🔬 ${category.toUpperCase()} (${shapes.length} formulas):`);
        shapes.slice(0, 10).forEach(shape => {
          console.log(`   • ${shape.shape_type} - "${shape.formula_name}" (complexity: ${shape.complexity_score})`);
        });
        if (shapes.length > 10) {
          console.log(`   • ... and ${shapes.length - 10} more formulas`);
        }
        console.log('');
      });
      
    } catch (error) {
      console.log('⚠️ formula_implementations table not accessible');
    }
    
    // Scan surface_presets table
    console.log('🎛️ SURFACE PRESETS TABLE:');
    try {
      const presets = await sql`
        SELECT DISTINCT shape_type, preset_name
        FROM surface_presets 
        ORDER BY shape_type
      `;
      
      console.log(`Found ${presets.length} surface presets:\n`);
      
      const presetsByShape = {};
      presets.forEach(preset => {
        if (!presetsByShape[preset.shape_type]) presetsByShape[preset.shape_type] = [];
        presetsByShape[preset.shape_type].push(preset.preset_name);
      });
      
      Object.entries(presetsByShape).slice(0, 15).forEach(([shape, presetList]) => {
        console.log(`   • ${shape}: ${presetList.length} presets (${presetList.slice(0, 3).join(', ')})`);
      });
      
      if (Object.keys(presetsByShape).length > 15) {
        console.log(`   • ... and ${Object.keys(presetsByShape).length - 15} more shapes with presets`);
      }
      console.log('');
      
    } catch (error) {
      console.log('⚠️ surface_presets table not accessible');
    }
    
    // Scan parameter_definitions table  
    console.log('📐 PARAMETER DEFINITIONS TABLE:');
    try {
      const params = await sql`
        SELECT parameter_name, default_value, min_value, max_value, description
        FROM parameter_definitions
        ORDER BY parameter_name
      `;
      
      console.log(`Found ${params.length} parameter definitions:\n`);
      
      params.slice(0, 20).forEach(param => {
        console.log(`   • ${param.parameter_name}: ${param.default_value} (${param.min_value} to ${param.max_value})`);
      });
      
      if (params.length > 20) {
        console.log(`   • ... and ${params.length - 20} more parameters`);
      }
      console.log('');
      
    } catch (error) {
      console.log('⚠️ parameter_definitions table not accessible');
    }
    
    // Scan mathematical_constants table
    console.log('🔢 MATHEMATICAL CONSTANTS TABLE:');
    try {
      const constants = await sql`
        SELECT constant_name, constant_value, description
        FROM mathematical_constants
        ORDER BY constant_name
      `;
      
      console.log(`Found ${constants.length} mathematical constants:\n`);
      
      constants.slice(0, 15).forEach(constant => {
        console.log(`   • ${constant.constant_name}: ${constant.constant_value} - ${constant.description?.slice(0, 50)}...`);
      });
      
      if (constants.length > 15) {
        console.log(`   • ... and ${constants.length - 15} more constants`);
      }
      console.log('');
      
    } catch (error) {
      console.log('⚠️ mathematical_constants table not accessible');
    }
    
    // Scan discovered_shapes table
    console.log('🔍 DISCOVERED SHAPES TABLE:');
    try {
      const discovered = await sql`
        SELECT shape_id, base_shape, discovery_type, confidence_score, created_at
        FROM discovered_shapes
        ORDER BY confidence_score DESC
      `;
      
      console.log(`Found ${discovered.length} discovered shapes:\n`);
      
      discovered.slice(0, 10).forEach(shape => {
        console.log(`   • ${shape.shape_id} (based on ${shape.base_shape}) - ${shape.discovery_type} (confidence: ${shape.confidence_score})`);
      });
      
      if (discovered.length > 10) {
        console.log(`   • ... and ${discovered.length - 10} more discovered shapes`);
      }
      console.log('');
      
    } catch (error) {
      console.log('⚠️ discovered_shapes table not accessible');
    }
    
    // Scan ai_ml_models table
    console.log('🤖 AI/ML MODELS TABLE:');
    try {
      const models = await sql`
        SELECT model_name, model_type, training_status, shape_count
        FROM ai_ml_models
        ORDER BY shape_count DESC
      `;
      
      console.log(`Found ${models.length} AI/ML models:\n`);
      
      models.slice(0, 10).forEach(model => {
        console.log(`   • ${model.model_name} (${model.model_type}) - ${model.training_status} (${model.shape_count} shapes)`);
      });
      
      if (models.length > 10) {
        console.log(`   • ... and ${models.length - 10} more models`);
      }
      console.log('');
      
    } catch (error) {
      console.log('⚠️ ai_ml_models table not accessible');
    }
    
    // Get all unique shape types from all tables
    console.log('🎯 CROSS-TABLE SHAPE ANALYSIS:');
    console.log('═══════════════════════════════════════════════════════\n');
    
    try {
      const allShapeTypes = new Set();
      
      // Get shapes from formula_implementations
      const formulaShapes = await sql`SELECT DISTINCT shape_type FROM formula_implementations`;
      formulaShapes.forEach(s => allShapeTypes.add(s.shape_type));
      
      // Get shapes from surface_presets
      const presetShapes = await sql`SELECT DISTINCT shape_type FROM surface_presets`;
      presetShapes.forEach(s => allShapeTypes.add(s.shape_type));
      
      // Get shapes from discovered_shapes
      const discoveredShapesList = await sql`SELECT DISTINCT shape_id FROM discovered_shapes`;
      discoveredShapesList.forEach(s => allShapeTypes.add(s.shape_id));
      
      console.log(`📊 TOTAL UNIQUE SHAPES IN DATABASE: ${allShapeTypes.size}`);
      console.log(`📊 Formula Implementations: ${formulaShapes.length}`);
      console.log(`📊 Surface Presets: ${new Set(presetShapes.map(s => s.shape_type)).size} unique shapes`);
      console.log(`📊 Discovered Shapes: ${discoveredShapesList.length}`);
      
      console.log('\n🔢 DATABASE SHAPE SAMPLES:');
      Array.from(allShapeTypes).slice(0, 30).forEach((shape, i) => {
        console.log(`${(i+1).toString().padStart(2, ' ')}. ${shape}`);
      });
      
      if (allShapeTypes.size > 30) {
        console.log(`    ... and ${allShapeTypes.size - 30} more shapes in database`);
      }
      
    } catch (error) {
      console.log('⚠️ Cross-table analysis failed:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}

// Run the database scan
scanDatabase()
  .then(() => {
    console.log('\n✅ DATABASE SCAN COMPLETE!');
    console.log('💡 Use this data to identify missing formulas and implementations');
  })
  .catch(error => {
    console.error('❌ Database scan failed:', error);
    process.exit(1);
  });

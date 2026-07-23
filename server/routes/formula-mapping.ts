
import express from 'express';
import { formulaMappingProtocol } from '../formula-mapping-protocol';
import { UNIFIED_SHAPES } from '../../client/src/lib/unifiedShapes';

const router = express.Router();

/**
 * Analyze a specific formula and return mapping
 */
router.post('/analyze/:formulaId', (req, res) => {
  try {
    const { formulaId } = req.params;
    
    // Get formula from unified shapes
    const shapeData = UNIFIED_SHAPES[formulaId];
    if (!shapeData) {
      return res.status(404).json({ error: 'Formula not found' });
    }

    const mapping = formulaMappingProtocol.analyzeFormula(
      formulaId,
      shapeData.equation,
      {
        name: shapeData.name || formulaId,
        category: shapeData.category || 'unknown',
        description: shapeData.description || 'Mathematical formula'
      }
    );

    res.json({
      success: true,
      mapping,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error analyzing formula:', error);
    res.status(500).json({ 
      error: 'Analysis failed', 
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * Generate comprehensive mapping report for multiple formulas
 */
router.post('/report', (req, res) => {
  try {
    const { formulaIds } = req.body;
    
    if (!Array.isArray(formulaIds)) {
      return res.status(400).json({ error: 'formulaIds must be an array' });
    }

    // Analyze all requested formulas first
    formulaIds.forEach(formulaId => {
      const shapeData = UNIFIED_SHAPES[formulaId];
      if (shapeData) {
        formulaMappingProtocol.analyzeFormula(
          formulaId,
          shapeData.equation,
          {
            name: shapeData.name || formulaId,
            category: shapeData.category || 'unknown', 
            description: shapeData.description || 'Mathematical formula'
          }
        );
      }
    });

    const report = formulaMappingProtocol.generateMappingReport(formulaIds);
    
    res.json({
      success: true,
      report,
      formulaCount: formulaIds.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating mapping report:', error);
    res.status(500).json({ 
      error: 'Report generation failed',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * Get compatibility analysis between specific formulas
 */
router.post('/compatibility', (req, res) => {
  try {
    const { formula1Id, formula2Id } = req.body;
    
    // Analyze both formulas
    [formula1Id, formula2Id].forEach(formulaId => {
      const shapeData = UNIFIED_SHAPES[formulaId];
      if (shapeData) {
        formulaMappingProtocol.analyzeFormula(
          formulaId,
          shapeData.equation,
          {
            name: shapeData.name || formulaId,
            category: shapeData.category || 'unknown',
            description: shapeData.description || 'Mathematical formula'
          }
        );
      }
    });

    const mappings = formulaMappingProtocol.getAllMappings();
    const mapping1 = mappings.get(formula1Id);
    const mapping2 = mappings.get(formula2Id);

    if (!mapping1 || !mapping2) {
      return res.status(404).json({ error: 'One or both formulas not found' });
    }

    res.json({
      success: true,
      compatibility: {
        formula1: {
          id: formula1Id,
          name: mapping1.name,
          mergePotential: mapping1.mergePotentialRating
        },
        formula2: {
          id: formula2Id,
          name: mapping2.name,
          mergePotential: mapping2.mergePotentialRating
        },
        compatibilityScore: mapping1.compatibilityScan.alignments
          .find(a => a.formulaId === formula2Id)?.compatibilityScore || 0,
        conflicts: mapping1.compatibilityScan.conflicts
          .filter(c => c.formulaId === formula2Id)
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error analyzing compatibility:', error);
    res.status(500).json({ 
      error: 'Compatibility analysis failed',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * Get all analyzed mappings summary
 */
router.get('/summary', (req, res) => {
  try {
    const mappings = formulaMappingProtocol.getAllMappings();
    const summary = {
      totalMappings: mappings.size,
      categories: {} as Record<string, number>,
      shapeTypes: {} as Record<string, number>,
      mergePotentialDistribution: {
        high: 0,
        medium: 0,
        low: 0
      }
    };

    mappings.forEach(mapping => {
      // Count categories
      summary.categories[mapping.category] = (summary.categories[mapping.category] || 0) + 1;
      
      // Count shape types
      const shapeType = mapping.structuralCharacterization.shape;
      summary.shapeTypes[shapeType] = (summary.shapeTypes[shapeType] || 0) + 1;
      
      // Count merge potential
      summary.mergePotentialDistribution[mapping.mergePotentialRating.rating]++;
    });

    res.json({
      success: true,
      summary,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ 
      error: 'Summary generation failed',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * FORMULA FUSION - Create intelligent merged formulas
 */
router.post('/fuse', (req, res) => {
  try {
    const { 
      formula1Id, 
      formula2Id, 
      blendMode = 'harmonic',
      weight1 = 0.5,
      weight2 = 0.5,
      preserveStructure = true,
      enableHybridization = true
    } = req.body;

    if (!formula1Id || !formula2Id) {
      return res.status(400).json({ 
        error: 'Both formula1Id and formula2Id are required',
        availableFormulas: Array.from(formulaMappingProtocol.getAllMappings().keys())
      });
    }

    if (formula1Id === formula2Id) {
      return res.status(400).json({ error: 'Cannot fuse a formula with itself' });
    }

    console.log(`🔗 API: Fusing ${formula1Id} + ${formula2Id} with ${blendMode} mode`);

    const fusionResult = formulaMappingProtocol.fuseFormulas(formula1Id, formula2Id, {
      blendMode,
      weight1: Number(weight1),
      weight2: Number(weight2),
      preserveStructure,
      enableHybridization
    });

    // Test the fused formula at a few points
    const testPoints = [
      { u: 0.25, v: 0.25 },
      { u: 0.5, v: 0.5 },
      { u: 0.75, v: 0.75 }
    ];

    const sampleOutputs = testPoints.map(point => {
      try {
        const result = fusionResult.fusedFormula(point.u, point.v, { a: 1, b: 1, c: 1, blend: 0.5 });
        return { input: point, output: result };
      } catch (error) {
        return { input: point, output: [0, 0, 0], error: 'Evaluation failed' };
      }
    });

    res.json({
      success: true,
      fusion: {
        formulaIds: [formula1Id, formula2Id],
        blendMode,
        weights: [weight1, weight2],
        equation: fusionResult.fusionEquation,
        mathematicalProperties: fusionResult.mathematicalProperties,
        safetyReport: fusionResult.safetyReport,
        sampleOutputs,
        usage: {
          javascript: `fusedFormula(u, v, {a: 1, b: 1, c: 1, blend: 0.5})`,
          description: `Call this function with u,v ∈ [0,1] and parameter object`
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fusing formulas:', error);
    res.status(500).json({ 
      error: 'Formula fusion failed',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * Get fusion presets and recommendations
 */
router.get('/fusion-presets', (req, res) => {
  try {
    const presets = {
      organic: {
        blendMode: 'harmonic',
        weight1: 0.6,
        weight2: 0.4,
        enableHybridization: true,
        description: 'Smooth, natural-looking fusion'
      },
      dramatic: {
        blendMode: 'multiplicative',
        weight1: 0.7,
        weight2: 0.3,
        enableHybridization: false,
        description: 'Bold, expressive combination'
      },
      balanced: {
        blendMode: 'additive',
        weight1: 0.5,
        weight2: 0.5,
        enableHybridization: true,
        description: 'Equal contribution from both formulas'
      },
      morphing: {
        blendMode: 'parametric',
        weight1: 0.5,
        weight2: 0.5,
        enableHybridization: true,
        description: 'User-controlled blend parameter'
      },
      exponential: {
        blendMode: 'geometric',
        weight1: 0.4,
        weight2: 0.6,
        enableHybridization: false,
        description: 'Exponential scaling relationship'
      }
    };

    res.json({
      success: true,
      presets,
      blendModes: [
        { name: 'additive', description: 'Linear combination' },
        { name: 'multiplicative', description: 'Exponential interaction' },
        { name: 'harmonic', description: 'Smooth sinusoidal blending' },
        { name: 'geometric', description: 'Exponential interpolation' },
        { name: 'parametric', description: 'User-controlled morphing' }
      ],
      recommendations: 'Start with "organic" preset for most natural results',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting fusion presets:', error);
    res.status(500).json({ 
      error: 'Failed to get fusion presets',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;

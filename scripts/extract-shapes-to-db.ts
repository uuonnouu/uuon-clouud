/**
 * UUON Shape Extractor v2 — Full Library Sweep
 * Loads ALL shape libraries, maps to complete_shape_registry by key name
 * Writes equation_js + default_params to Neon
 */
import { neon } from '@neondatabase/serverless';

const DB_URL = process.env.CLEAN_DB || process.env.DATABASE_URL;
if (!DB_URL) { console.error('CLEAN_DB not set'); process.exit(1); }
const sql = neon(DB_URL);

async function main() {
  console.log('Loading ALL shape libraries...');

  const imports = await Promise.allSettled([
    import('../client/src/lib/unifiedShapes').then(m => m.UNIFIED_SHAPES),
    import('../client/src/lib/babylonianZodiacShapes').then(m => m.BABYLONIAN_ZODIAC_SHAPES),
    import('../client/src/lib/financialMathematics').then(m => m.FINANCIAL_MATHEMATICS),
    import('../client/src/lib/fourDimensionalShapes').then(m => m.FOUR_DIMENSIONAL_SHAPES),
    import('../client/src/lib/basicGeometryFormulas').then(m => m.BASIC_GEOMETRY_FORMULAS),
    import('../client/src/lib/attractorSystems').then(m => m.ATTRACTOR_SYSTEMS),
    import('../client/src/lib/chaosTheoryShapes').then(m => m.CHAOS_THEORY_SHAPES),
    import('../client/src/lib/sacredGeometry').then(m => m.default || m),
    import('../client/src/lib/cleanMathEngine').then(m => m.default || m),
    import('../client/src/lib/chakraShapes').then(m => m.CHAKRA_SHAPES),
    import('../client/src/lib/qpuQuantumComputingShapes').then(m => m.QPU_QUANTUM_COMPUTING_SHAPES),
    import('../client/src/lib/fieldTheoryEngine').then(m => m.default || m),
    import('../client/src/lib/quantumGravityEquations').then(m => m.QUANTUM_GRAVITY_EQUATIONS),
    import('../client/src/lib/generalRelativityShapes').then(m => m.GENERAL_RELATIVITY_SHAPES),
    import('../client/src/lib/schrodingerEquations').then(m => m.SCHRODINGER_EQUATIONS),
    import('../client/src/lib/entropicPrinciples').then(m => m.ENTROPIC_PRINCIPLES),
    import('../client/src/lib/theoryOfEverythingShapes').then(m => m.THEORY_OF_EVERYTHING_SHAPES),
    import('../client/src/lib/sequencePatterns').then(m => m.SEQUENCE_PATTERNS),
    import('../client/src/lib/setTheoryShapes').then(m => m.SET_THEORY_SHAPES),
    import('../client/src/lib/dnaStructures').then(m => m.DNA_STRUCTURES),
    import('../client/src/lib/advancedPhysicsEquations').then(m => m.ADVANCED_PHYSICS_EQUATIONS),
    import('../client/src/lib/hypercomputationSurfaces').then(m => m.HYPERCOMPUTATION_SURFACES),
    import('../client/src/lib/multidimensionalFractals').then(m => m.MULTIDIMENSIONAL_FRACTALS),
    import('../client/src/lib/entanglementAlgorithms').then(m => m.ENTANGLEMENT_ALGORITHMS),
    import('../client/src/lib/topologyDifferentialShapes').then(m => m.TOPOLOGY_DIFFERENTIAL_SHAPES),
    import('../client/src/lib/fractalAnalysisShapes').then(m => m.FRACTAL_ANALYSIS_SHAPES),
    import('../client/src/lib/completeMissingShapesLibrary').then(m => m.COMPLETE_MISSING_SHAPES),
    import('../client/src/lib/historicalAlgorithms').then(m => m.HISTORICAL_ALGORITHMS),
    import('../client/src/lib/thermalEngineeringShapes').then(m => m.THERMAL_ENGINEERING_SHAPES),
    import('../client/src/lib/medicalImagingShapes').then(m => m.MEDICAL_IMAGING_SHAPES),
    import('../client/src/lib/consciousnessMathShapes').then(m => m.CONSCIOUSNESS_MATH_SHAPES),
    import('../client/src/lib/minimalSurfacesLibrary').then(m => m.ALL_MINIMAL_SURFACES),
    import('../client/src/lib/parametricLibraryPack').then(m => m.PARAMETRIC_LIBRARY_PACK),
    import('../client/src/lib/higherDimensionalShapes').then(m => ({ ...m.FIVE_DIMENSIONAL_SHAPES, ...m.HIGHER_DIMENSIONAL_SHAPES })),
    import('../client/src/lib/higherDimensionalGaps').then(m => m.HIGHER_DIMENSIONAL_GAPS),
    import('../client/src/lib/fourDimensional4DShapes').then(m => m.FOUR_DIMENSIONAL_4D_SHAPES),
    import('../client/src/lib/alchemicalSymbolShapes').then(m => m.ALCHEMICAL_SYMBOL_SHAPES),
    import('../client/src/lib/ancientCivilizationShapes').then(m => m.ANCIENT_CIVILIZATION_SHAPES),
    import('../client/src/lib/harmonicWaveShapes').then(m => m.HARMONY_WAVE_SHAPES).catch(() => ({})),
    import('../client/src/lib/harmonyWaveShapes').then(m => m.HARMONY_WAVE_SHAPES).catch(() => ({})),
    import('../client/src/lib/atomicStructureShapes').then(m => m.ATOMIC_STRUCTURE_SHAPES),
    import('../client/src/lib/uuon-gmod6-engine').then(m => m.GMOD6_SURFACES),
    import('../client/src/lib/iceCrystalShapes').then(m => m.ICE_CRYSTAL_SHAPES),
    import('../client/src/lib/fractalShapeImplementations').then(m => m.FRACTAL_SHAPE_IMPLEMENTATIONS),
    import('../client/src/lib/missing19ShapesImplementation').then(m => m.MISSING_19_SHAPES),
    import('../client/src/lib/crossDomainHybridShapes').then(m => m.CROSS_DOMAIN_HYBRID_SHAPES),
    import('../client/src/lib/scientificIdentityShapes').then(m => m.SCIENTIFIC_IDENTITY_SHAPES),
    import('../client/src/lib/timePhenomenonShapes').then(m => ({ ...m.ALL_TIME_PHENOMENON_SHAPES, ...m.TIME_PRINCIPLE_SHAPES, ...m.PHENOMENON_PRINCIPLE_SHAPES, ...m.UNIFIED_PRINCIPLE_SHAPES })),
    import('../client/src/lib/linguisticGeometryShapes').then(m => m.LINGUISTIC_GEOMETRY_SHAPES),
    import('../client/src/lib/dmensionPatternCodex').then(m => m.DMENSION_PATTERN_CODEX),
    import('../client/src/lib/uuonMeshEngine').then(m => m.UUON_MESH_SHAPES),
    import('../client/src/lib/unifiedTOECanvas').then(m => m.UNIFIED_TOE_CANVAS),
    import('../client/src/lib/scientificExpansionShapes').then(m => m.SCIENTIFIC_EXPANSION_SHAPES),
    import('../client/src/lib/tenPercentShapes').then(m => m.TEN_PERCENT_SHAPES),
    import('../client/src/lib/lifeSciencesShapes').then(m => m.default || m),
    import('../client/src/lib/earthSciencesShapes').then(m => m.default || m),
    import('../client/src/lib/socialSciencesShapes').then(m => m.default || m),
    import('../client/src/lib/unifiedMasterEquation').then(m => m.default || m),
    import('../client/src/lib/quantumParametricFunctions').then(m => m.QUANTUM_PARAMETRIC_FUNCTIONS),
  ]);

  // Merge all into one lookup
  const ALL_SHAPES: Record<string, any> = {};
  let libCount = 0;

  for (const result of imports) {
    if (result.status === 'fulfilled' && result.value && typeof result.value === 'object') {
      const lib = result.value as Record<string, any>;
      for (const [key, shape] of Object.entries(lib)) {
        if (shape && typeof shape === 'object' && typeof shape.equation === 'function') {
          ALL_SHAPES[key] = shape;
          libCount++;
        }
      }
    } else if (result.status === 'rejected') {
      console.warn(`  WARN: Library failed to load: ${result.reason?.message?.substring(0, 80)}`);
    }
  }

  console.log(`Total unique shapes with equations: ${Object.keys(ALL_SHAPES).length}`);

  // Fetch registry
  const rows = await sql`SELECT id, shape_type FROM complete_shape_registry ORDER BY id`;
  console.log(`Registry rows: ${rows.length}\n`);

  let updated = 0, missing = 0;

  for (const row of rows) {
    const shape = ALL_SHAPES[row.shape_type];

    if (!shape || typeof shape.equation !== 'function') {
      missing++;
      process.stdout.write(`  MISS #${String(row.id).padStart(3)} ${row.shape_type}\n`);
      continue;
    }

    const eqStr = shape.equation.toString();
    let params = {};
    try {
      params = shape.defaultParams ? JSON.parse(JSON.stringify(shape.defaultParams)) : {};
    } catch {}

    await sql`
      UPDATE complete_shape_registry
      SET
        equation_js   = ${eqStr},
        default_params = ${JSON.stringify(params)},
        updated_at    = now()
      WHERE id = ${row.id}
    `;

    updated++;
    process.stdout.write(`  ✓ #${String(row.id).padStart(3)} ${row.shape_type}\n`);
  }

  console.log(`\n════════════════════════════════`);
  console.log(`  Updated: ${updated} / ${rows.length}`);
  console.log(`  Missing: ${missing}`);
  console.log(`════════════════════════════════`);

  if (missing > 0) {
    console.log('\nMISSING shapes have no equation in any loaded library.');
    console.log('These need either: aliasing, or a new equation written.');
  }
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });

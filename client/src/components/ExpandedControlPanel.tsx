import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { SurfaceParameters, VisualizationMode } from "../types/math";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { RotateCcw, Download, Share2, Settings, Grid as GridIcon, Save, Upload, X, Search, Lock, Sparkles, GitBranch, Package, ShieldAlert } from "lucide-react";
import { useAuthStore } from '../stores/authStore';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { getDefaultParameters } from '../lib/parametricSurfacesClean';
import { clearPreservedSettings } from '../lib/parameterValidator';
import { detectPhysicsCategory } from '../lib/physicsEngine';
import { UNIVERSAL_MATHEMATICS, getAllUniversalMathematicsShapes } from '../lib/universalMathematics';
import { trackingService } from '../lib/trackingService';
import { COMMERCIAL_PRESETS, getPresetsByType } from '../lib/commercialPresets';
import { UNIFIED_SHAPES } from '../lib/unifiedShapes';
import { CLEAN_SURFACES } from '../lib/cleanMathEngine';
import { PARAMETRIC_SURFACES } from '../lib/parametricSurfacesClean';
import { EXCLUSIVE_SHAPES } from '../lib/exclusiveShapes';
import { NON_EUCLIDEAN_SHAPES } from '../lib/nonEuclideanShapes';
import { RIEMANN_SURFACES } from '../lib/riemannSurfaces';
import { EDUCATIONAL_SURFACES } from '../lib/educationalSurfaces';
import { TOPOLOGY_KNOTS } from '../lib/topologyKnotsFixed';
import { CATEGORY_THEORY } from '../lib/categoryTheory';
import { GROUP_THEORY } from '../lib/groupTheory';
import { HISTORICAL_ALGORITHMS } from '../lib/historicalAlgorithms';
import { MATHEMATICAL_CONSTANTS } from '../lib/mathematicalConstants';
import { FOUR_DIMENSIONAL_SHAPES } from '../lib/fourDimensionalShapes';
import { SHAPE_CATEGORIES as ORGANIZED_CATEGORIES, getCategoriesSortedByDimension, getCategorySectionName, formatShapeName } from '../lib/shapeCategories';
import { UNIFIED_MATH_SYMBOLS } from '../lib/unifiedMathSymbols';
import { ADVANCED_PHYSICS_EQUATIONS } from '../lib/advancedPhysicsEquations';
import { QUANTUM_GRAVITY_EQUATIONS } from '../lib/quantumGravityEquations';
import CollaborativeSharing from './CollaborativeSharing';
import SaveShapeModal from './SaveShapeModal';
import { getManifest } from '../lib/parameterManifests';
import { customTextureManager, CustomMaterialPreset } from '../lib/customTextureManager';
import UVEnvironmentalPresets from './UVEnvironmentalPresets';
import UVMorphingControls from './UVMorphingControls';
import EmojiShapeConverter from './EmojiShapeConverter';
import ColorToShapeConverter from './ColorToShapeConverter';
import LightingControls from './LightingControls';
import NerfStudio from './NerfStudio';
import { Lightbulb, Cpu } from 'lucide-react';
import { AnimationExportModal, AnimationType, GeometryStyle } from './AnimationExportModal';
import MediaExportPanel from './MediaExportPanel';
import EnergyStoragePanel from './EnergyStoragePanel';
import { Zap } from 'lucide-react';
import { PARAMETER_SPECS, ParameterKey } from '../lib/parameterAuthority';
import ScalePresetPanel from './ScalePresetPanel';
import ShapeFormulaBar from './ShapeFormulaBar';
import WireGenesisPanel from './WireGenesisPanel'; // Import the new component
import { NFTMintingModal } from './NFTMintingModal';
import { OsdrStudyPanel } from './OsdrStudyPanel';
import { isSpaceBiologyShape } from '@/lib/osdrShapeMapping';
import GitHubPushStatus from './GitHubPushStatus';
import { SPACE_BIOLOGY_SHAPES } from '@/lib/spaceBiologyShapes';
import TensorAnimationPanel from './TensorAnimationPanel';

type TensorAnimType = 'spin' | 'precession' | 'tumble' | 'stable' | 'gyroscope' | 'tensor';

interface ExpandedControlPanelProps {
  parameters: SurfaceParameters;
  visualMode: VisualizationMode;
  colorMode: string;
  backgroundMode: string;
  showGrid: boolean;
  animationPreset?: string;
  isAnimating?: boolean;
  tensorAnimType?: TensorAnimType;
  animationVelocity?: number;
  onParameterChange: (params: Partial<SurfaceParameters>) => void;
  onVisualizationModeChange: (mode: VisualizationMode) => void;
  onColorModeChange: (mode: string) => void;
  onBackgroundModeChange: (mode: string) => void;
  onShowGridChange: (show: boolean) => void;
  onAnimationPresetChange?: (preset: string) => void;
  onAnimToggle?: () => void;
  onTensorAnimTypeChange?: (type: TensorAnimType) => void;
  onAnimationVelocityChange?: (v: number) => void;
  breatheIntensity?: number;
  dynamicsMode?: 'rigid' | 'soft';
  onBreatheIntensityChange?: (v: number) => void;
  onDynamicsModeChange?: (mode: 'rigid' | 'soft') => void;
  onExport: (format?: 'json' | 'gltf' | 'zip', exportType?: 'solid' | 'wireframe' | 'points' | 'ultra-hd' | 'fractal-map') => void;
}

// All 26 parameters from a through z (complete alphabetical parameters)
const PARAMETER_NAMES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'] as const;

// UNIFIED SHAPE REGISTRY - Combine ALL mathematical shapes
const ALL_UNIFIED_SHAPES = {
  ...UNIFIED_SHAPES,          // Master template - new shapes
  ...CLEAN_SURFACES,          // Core mathematical surfaces
  ...PARAMETRIC_SURFACES,     // Classic parametric shapes
  ...EXCLUSIVE_SHAPES,        // Exclusive mathematical forms
  ...NON_EUCLIDEAN_SHAPES,    // Hyperbolic/spherical geometry
  ...RIEMANN_SURFACES,        // Multi-valued complex functions
  ...EDUCATIONAL_SURFACES,    // Basic teaching shapes
  ...TOPOLOGY_KNOTS,          // Topological structures
  ...CATEGORY_THEORY,         // Abstract algebra
  ...GROUP_THEORY,            // Symmetry groups
  ...HISTORICAL_ALGORITHMS,   // Original algorithms from history and nature
  ...MATHEMATICAL_CONSTANTS,  // Mathematical constants (φ, π, e, √2, etc.)
  ...FOUR_DIMENSIONAL_SHAPES, // 4D polytopes and hyperdimensional objects
  ...UNIFIED_MATH_SYMBOLS,     // Unified math symbols (geometry, emojis, trig, constants)
  ...UNIVERSAL_MATHEMATICS,     // Universal Mathematics framework
  ...ADVANCED_PHYSICS_EQUATIONS, // Advanced physics calculations
  ...QUANTUM_GRAVITY_EQUATIONS, // Quantum gravity formulations
  ...SPACE_BIOLOGY_SHAPES     // NASA OSDR Space Biology shapes
  // Total: 400+ unique mathematical and biological shapes across 30 categories ✅
};

// Generate complete list of all available shapes
const ALL_SHAPES = Object.keys(ALL_UNIFIED_SHAPES);

// Systematically categorize ALL shapes - ORGANIZED BY DIMENSION for optimal loading
// ORDER: Hello UUorld → Basic 3D → Mathematical 3D → 4D Shapes → 5D+ Higher Dimensional
const SHAPE_CATEGORIES = [
  // ═══════════════════════════════════════════════════════════════════════════
  // WELCOME - Default startup shapes
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: "👋 Welcome",
    shapes: ['equirectangular_sphere', 'uuon'],
    description: "Welcome shapes - Basic 3D visualization"
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 1: BASIC 3D SHAPES (Fastest to load, most common)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: "🔷 Basic 3D Shapes",
    shapes: ALL_SHAPES.filter(shape => ['square', 'cube', 'circle', 'triangle', 'cylinder', 'torus', 'cone', 'sphere', 'ellipsoid', 'pyramid', 'prism', 'octahedron', 'dodecahedron', 'icosahedron', 'tetrahedron'].includes(shape) && !shape.includes('discovered_')),
    description: "Fundamental 3D geometric primitives - fastest to render"
  },
  {
    name: "🕉️ Sacred Geometry",
    shapes: ALL_SHAPES.filter(shape => !shape.includes('discovered_') && ['flower_of_life', 'merkaba', 'sri_yantra', 'seed_of_life', 'metatrons_cube', 'vesica_piscis', 'torus_knot'].includes(shape))
  },
  {
    name: "🌊 Waves & Oscillations",
    shapes: ALL_SHAPES.filter(shape => !shape.includes('discovered_') && (shape.includes('_wave') || shape === 'electromagnetic_wave' || shape === 'sound_wave' || shape === 'brain_wave' || shape === 'seismic_wave' || shape === 'ocean_wave' || shape === 'gravitational_wave' || shape === 'cardiac_wave' || shape === 'quantum_wave' || shape === 'atmospheric_wave' || shape === 'circadian_wave'))
  },
  {
    name: "🎶 Frequencies & Harmonics",
    shapes: ALL_SHAPES.filter(shape => !shape.includes('discovered_') && (shape.includes('solfeggio') || shape.includes('hz')))
  },
  {
    name: "🧘 Chakras & Energy",
    shapes: ALL_SHAPES.filter(shape => !shape.includes('discovered_') && shape.includes('chakra'))
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 2: MATHEMATICAL 3D SURFACES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: "📐 Mathematical Surfaces",
    shapes: ALL_SHAPES.filter(shape => !shape.includes('discovered_') && (shape.includes('surface') || shape.includes('knot') || shape.includes('klein') || shape.includes('mobius')))
  },
  {
    name: "📈 Riemann Surfaces",
    shapes: ALL_SHAPES.filter(shape => !shape.includes('discovered_') && (shape.includes('riemann') || shape.includes('modular') || shape.includes('elliptic_function') || shape.includes('euler_product') || shape.includes('zeta')))
  },
  {
    name: "🌐 Non-Euclidean Geometry",
    shapes: ALL_SHAPES.filter(shape => !shape.includes('discovered_') && (shape.includes('hyperbolic') || shape.includes('spherical') || shape.includes('minkowski') || shape.includes('light_cone')) && !shape.includes('spacetime'))
  },
  {
    name: "✨ Fractals",
    shapes: ALL_SHAPES.filter(shape => !shape.includes('discovered_') && (shape.includes('mandelbrot') || shape.includes('julia') || shape.includes('multibrot') || shape.includes('burning_ship') || shape.includes('mandelbox') || shape.includes('newton_fractal') || shape.includes('buddhabrot') || shape.includes('sierpinski') || shape.includes('koch')))
  },
  {
    name: "🧮 Jacobian & Coordinate Transforms",
    shapes: ALL_SHAPES.filter(shape => !shape.includes('discovered_') && (shape.includes('jacobian') || shape.includes('cascading_coordinate') || shape.includes('curvature_surface') || shape.includes('christoffel') || shape.includes('metric_tensor') || shape.includes('differential_form') || shape.includes('tangent_bundle') || shape.includes('cotangent_bundle')))
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 3: BIOLOGICAL & SCIENTIFIC 3D
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: "🧬 Biological Structures",
    shapes: ALL_SHAPES.filter(shape => {
      if (shape.match(/^cell_\d/)) return false;
      if (shape.includes('discovered_')) return false;
      const isBiological = (shape.includes('dna') || shape.includes('protein') || shape.includes('cell') || shape.includes('membrane') || shape.includes('organelle') || shape.includes('phage') || shape.includes('virus') || shape.includes('bacterial') || shape.includes('ribosome') || shape.includes('chloroplast') || shape.includes('mitochondria') || shape.includes('h_dna') || shape.includes('i_motif') || shape.includes('holliday') || shape.includes('origami') || shape.includes('tad') || shape.includes('r_loop') || shape.includes('trefoil') || shape.includes('catenane') || shape.includes('nanotube') || shape.includes('cruciform'));
      return isBiological;
    })
  },
  {
    name: "⚕️ Medical & TPMS",
    shapes: ALL_SHAPES.filter(shape => !shape.includes('discovered_') && shape.includes('_tpms'))
  },
  {
    name: "🚀 Space Biology (NASA OSDR)",
    shapes: Object.keys(SPACE_BIOLOGY_SHAPES),
    description: "Space biology shapes backed by NASA Open Science Data Repository research"
  },
  {
    name: "⚙️ Algorithms & Patterns",
    shapes: ALL_SHAPES.filter(shape => !shape.includes('discovered_') && (
      shape.includes('euclidean') || shape.includes('sieve') || shape.includes('newton_raphson') ||
      shape.includes('fibonacci') || shape.includes('kepler') || shape.includes('binary_tree') ||
      shape.includes('quicksort') || shape.includes('crystal_lattice')
    ))
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 4: 4D SHAPES (Higher complexity)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: "🧊 4D Polytopes & Hypercubes",
    shapes: ALL_SHAPES.filter(shape => !shape.includes('discovered_') && (shape.includes('cell_') || shape.includes('tesseract') || shape.includes('simplex') || shape.includes('hypercube') || shape.includes('hypersphere') || shape.includes('4d_') || shape.includes('_4d'))),
    description: "Four-dimensional geometric objects"
  },
  {
    name: "🌌 Spacetime & Relativity",
    shapes: ALL_SHAPES.filter(shape => !shape.includes('discovered_') && (shape.includes('spacetime') || shape.includes('lorentz') || shape.includes('einstein') || shape.includes('geodesic') || shape.includes('metric_tensor') || shape.includes('schwarzschild') || shape.includes('kerr_'))),
    description: "4D spacetime manifolds and relativistic geometry"
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 5: 5D+ HIGHER DIMENSIONAL & QUANTUM
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: "⚛️ Quantum Mechanics",
    shapes: ALL_SHAPES.filter(shape => !shape.includes('discovered_') && (
      shape.includes('quantum_tunneling') || shape.includes('schrodinger') ||
      shape.includes('heisenberg') || shape.includes('superposition') ||
      shape.includes('entanglement') || shape.includes('wave_function') ||
      shape.includes('spin_state') || shape.includes('orbital')
    ))
  },
  {
    name: "🕸️ Quantum Gravity & Planck Scale",
    shapes: ALL_SHAPES.filter(shape => !shape.includes('discovered_') && (
      shape.includes('planck') || shape.includes('loop_quantum') ||
      shape.includes('spin_network') || shape.includes('spin_foam') ||
      shape.includes('wheeler_dewitt') || shape.includes('causal_set')
    ))
  },
  {
    name: "🎻 String Theory & M-Theory",
    shapes: ALL_SHAPES.filter(shape => !shape.includes('discovered_') && (
      shape.includes('string_') || shape.includes('brane') || shape.includes('calabi_yau') ||
      shape.includes('compactif') || shape.includes('extra_dimension') || shape.includes('kaluza_klein') ||
      shape.includes('nambu_goto') || shape.includes('m_theory')
    )),
    description: "10D/11D string theory and M-theory visualizations"
  },
  {
    name: "⚫ Black Holes & Cosmic",
    shapes: [
      'schwarzschild_radius', 'kerr_rotating_black_hole', 'event_horizon',
      'hawking_radiation_spectrum', 'penrose_diagram_spacetime', 'accretion_disk',
      'gravitational_lensing', 'gravity_well', 'information_paradox_surface'
    ].filter(shape => ALL_SHAPES.includes(shape))
  },
  {
    name: "🌑 Dark Matter & Exotic",
    shapes: ALL_SHAPES.filter(shape => !shape.includes('discovered_') && (
      shape.includes('dark_matter') || shape.includes('dark_energy') ||
      shape.includes('exotic') || shape.includes('tachyon') || shape.includes('axion')
    ))
  },
  {
    name: "🔬 Theory of Everything",
    shapes: ALL_SHAPES.filter(shape => !shape.includes('discovered_') && (
      shape.includes('grand_unified') || shape.includes('supersymmetry') ||
      shape.includes('holographic') || shape.includes('ads_cft') ||
      shape.includes('theory_of_everything') || shape.includes('polyakov')
    ))
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 6: SPECIAL COLLECTIONS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: "🌌 Shape of the Universe",
    shapes: ['shape_of_universe'],
    description: "Unified mathematical structure of reality"
  },
  {
    name: "🌟 Universal Mathematics",
    shapes: getAllUniversalMathematicsShapes().map(shape => shape.id),
    description: "Complete mathematical framework"
  },
  {
    name: "🚀 All Other Shapes",
    shapes: ALL_SHAPES.filter(shape => {
      const basicShapes = ['square', 'cube', 'circle', 'triangle', 'cylinder', 'torus', 'cone', 'sphere', 'ellipsoid'];
      const isBasic = basicShapes.includes(shape);
      const isDiscovered = shape.includes('discovered_');
      const isAlreadyCategorized =
        shape.includes('_wave') || shape.includes('chakra') || shape.includes('surface') ||
        shape.includes('knot') || shape.includes('klein') || shape.includes('mobius') ||
        shape.includes('cell_') || shape.includes('tesseract') || shape.includes('hypercube') ||
        shape.includes('quantum') || shape.includes('spacetime') || shape.includes('string_') ||
        shape.includes('brane') || shape.includes('jacobian') || shape.includes('riemann') ||
        shape.includes('mandelbrot') || shape.includes('julia') || shape.includes('fractal');
      return !isBasic && !isDiscovered && !isAlreadyCategorized;
    })
  }
];

// Validation: Ensure all shapes are categorized
const totalCategorized = SHAPE_CATEGORIES.reduce((sum, category) => sum + category.shapes.length, 0);

// Helper function to get shape display name with proper error handling
// FIXED: Prevent double-naming by detecting if name already contains the formatted key
// FIXED: Uses formatShapeName for proper DNA, RNA, CRISPR, TAD capitalization
const getShapeDisplayName = (shapeKey: string): string => {
  try {
    if (!shapeKey || typeof shapeKey !== 'string') {
      console.warn('⚠️ Invalid shape key:', shapeKey);
      return 'Unknown Shape';
    }

    // Format the key first for comparison - using proper acronym capitalization
    const formattedKey = formatShapeName(shapeKey);

    // Check UNIVERSAL_MATHEMATICS first
    const universalMathShape = UNIVERSAL_MATHEMATICS[shapeKey as keyof typeof UNIVERSAL_MATHEMATICS];
    if (universalMathShape && universalMathShape.name) {
      const name = universalMathShape.name;
      // Clean emoji prefixes and check for double-naming
      const cleanName = name.replace(/^[^\w\s]+\s*/, '').trim();
      if (cleanName.toLowerCase().includes(formattedKey.toLowerCase() + formattedKey.toLowerCase())) {
        return formattedKey; // Prevent double naming
      }
      return name;
    }

    // Then check ALL_UNIFIED_SHAPES
    const shapeData = ALL_UNIFIED_SHAPES[shapeKey as keyof typeof ALL_UNIFIED_SHAPES];
    if (shapeData && typeof shapeData === 'object' && 'name' in shapeData) {
      const name = shapeData.name as string;
      // Clean emoji prefixes and check for double-naming
      const cleanName = name.replace(/^[^\w\s]+\s*/, '').trim();
      if (cleanName.toLowerCase().includes(formattedKey.toLowerCase() + formattedKey.toLowerCase())) {
        return formattedKey; // Prevent double naming
      }
      return name;
    }

    // Fallback: Format shape key into readable name with proper capitalization
    return formattedKey;
  } catch (error) {
    console.warn(`⚠️ Could not get display name for shape: ${shapeKey}`, error);
    return shapeKey ? formatShapeName(shapeKey) : 'Unknown Shape';
  }
};

export default function ExpandedControlPanel({
  parameters,
  visualMode,
  colorMode,
  backgroundMode,
  showGrid,
  animationPreset = 'off',
  isAnimating = false,
  tensorAnimType = 'tensor',
  animationVelocity = 1,
  breatheIntensity = 0.5,
  dynamicsMode = 'soft',
  onParameterChange,
  onVisualizationModeChange,
  onColorModeChange,
  onBackgroundModeChange,
  onShowGridChange,
  onAnimationPresetChange,
  onAnimToggle,
  onTensorAnimTypeChange,
  onAnimationVelocityChange,
  onBreatheIntensityChange,
  onDynamicsModeChange,
  onExport,
}: ExpandedControlPanelProps) {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showAnimationModal, setShowAnimationModal] = useState(false);
  const [pendingAnimationType, setPendingAnimationType] = useState<AnimationType | null>(null);
  const [pendingGeometryStyle, setPendingGeometryStyle] = useState<GeometryStyle>('solid');
  const [pendingExportType, setPendingExportType] = useState<'solid' | 'solid-wire' | 'wireframe' | 'points' | 'ply-points' | 'sketchfab' | 'transform-anim' | 'physics-anim' | 'ar-vr' | 'neural' | null>(null);
  const [customPresets, setCustomPresets] = useState<CustomMaterialPreset[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showShapeSearch, setShowShapeSearch] = useState(false);
  const [shapeSearchTerm, setShapeSearchTerm] = useState('');
  const manifest = useMemo(() => getManifest(parameters.type || ''), [parameters.type]);
  const showSlider = (p: string) => !manifest || manifest.activeParams.includes(p);
  const sliderLabel = (p: string) => manifest?.labels?.[p] ?? '';
  const [showNFTModal, setShowNFTModal] = useState(false);

  const MAX_SHAPES_PER_CATEGORY = 15;

  const { isAdmin } = useAuthStore();

  const ALLOWED_SECTIONS_PUBLIC = [
    'Basic 3D',
    'Classic Surfaces', 
    'Educational',
    '4D Polytopes',
    '5D Geometry',
    'Mathematical Constants',
    'Basic Geometry',
    'Topology & Knots',
    'Biological Forms'
  ];

  // Get dimensionally sorted categories (Basic 3D → 4D → 5D+ → Chaotic)
  const sortedCategories = React.useMemo(() => {
    const allCategories = getCategoriesSortedByDimension();
    if (isAdmin) return allCategories;
    
    return allCategories.filter(category => {
      const sectionName = getCategorySectionName(category.id);
      return ALLOWED_SECTIONS_PUBLIC.some(allowed => 
        sectionName.toLowerCase().includes(allowed.toLowerCase()) ||
        category.name.toLowerCase().includes('basic') ||
        category.name.toLowerCase().includes('sphere') ||
        category.name.toLowerCase().includes('torus') ||
        category.name.toLowerCase().includes('cube') ||
        category.name.toLowerCase().includes('educational') ||
        category.name.toLowerCase().includes('classic')
      );
    });
  }, [isAdmin]);

  // Filter shapes based on search term - limit to prevent mobile glitching
  const filteredCategories = React.useMemo(() => {
    if (!shapeSearchTerm.trim()) {
      return sortedCategories.map(category => ({
        ...category,
        sectionName: getCategorySectionName(category.id),
        shapes: category.shapes.slice(0, MAX_SHAPES_PER_CATEGORY),
        hasMore: category.shapes.length > MAX_SHAPES_PER_CATEGORY
      }));
    }

    const searchLower = shapeSearchTerm.toLowerCase();
    return sortedCategories.map(category => {
      const matchingShapes = category.shapes.filter(shape => {
        const displayName = getShapeDisplayName(shape).toLowerCase();
        const shapeKey = shape.toLowerCase();
        return displayName.includes(searchLower) || shapeKey.includes(searchLower);
      });
      return {
        ...category,
        sectionName: getCategorySectionName(category.id),
        shapes: matchingShapes.slice(0, 30),
        hasMore: matchingShapes.length > 30
      };
    }).filter(category => category.shapes.length > 0);
  }, [shapeSearchTerm, sortedCategories]);

  // Handle shape selection from search
  // FIXED: Preserve user's custom U/V segment values when switching shapes
  const handleSelectShapeFromSearch = (shape: string) => {
    try {
      const defaults = getDefaultParameters(shape);
      console.log('🎯 Loading PURE mathematical form:', shape, 'with EXACT defaults:', defaults);

      if (!defaults || Object.keys(defaults).length === 0) {
        console.warn('⚠️ No defaults found for shape:', shape);
        throw new Error(`Shape ${shape} has no default parameters`);
      }

      onParameterChange({
        ...defaults,
        type: shape as any, // Shape validated from ORGANIZED_CATEGORIES
        uMin: defaults.uMin ?? 0,
        uMax: defaults.uMax ?? 1,
        vMin: defaults.vMin ?? 0,
        vMax: defaults.vMax ?? 1,
        // Always reset to shape defaults (or 360) on shape switch — no carry-over
        uSegments: defaults.uSegments ?? 360,
        vSegments: defaults.vSegments ?? 360
      });

      setShowShapeSearch(false);
      setShapeSearchTerm('');
    } catch (error) {
      console.error('❌ Error loading shape:', shape, error);
    }
  };

  // Load custom presets on mount
  useEffect(() => {
    const presets = customTextureManager.getAllCustomPresets();
    setCustomPresets(presets);
  }, []);

  // Handle texture upload
  const handleTextureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      const file = files[0];
      const name = file.name.replace(/\.[^/.]+$/, ''); // Remove extension

      console.log(`⬆️ Uploading texture: ${name}`);
      await customTextureManager.uploadTexture(file, name, 'albedo');

      // Refresh custom presets
      const presets = customTextureManager.getAllCustomPresets();
      setCustomPresets(presets);

      console.log(`✅ Texture uploaded successfully: ${name}`);
    } catch (error) {
      console.error('❌ Error uploading texture:', error);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Delete custom texture
  const handleDeleteCustomTexture = (presetId: string) => {
    const textureId = presetId.replace('preset_', '');
    customTextureManager.deleteTexture(textureId);

    // Refresh custom presets
    const presets = customTextureManager.getAllCustomPresets();
    setCustomPresets(presets);
  };

  // LOCAL STATE for instant visual feedback during drag
  const [localValues, setLocalValues] = useState<Record<string, number>>({});


  // DEBOUNCE system - waits until user STOPS moving slider (prevents jumpy/glitchy visuals)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingUpdateRef = useRef<Record<string, number>>({});

  // Smooth parameter change handler with instant visual feedback
  const handleParameterSliderChange = useCallback((paramName: string, value: number[]) => {
    const parameterValue = value[0];

    // INSTANT: Update local display value immediately (no lag)
    setLocalValues(prev => ({ ...prev, [paramName]: parameterValue }));

    // Store the latest value for geometry update
    pendingUpdateRef.current[paramName] = parameterValue;

    // Clear any pending update
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // IMMEDIATE UPDATE: Minimal delay for snappy controls
    // 16ms = one frame at 60fps for responsive feel
    debounceTimerRef.current = setTimeout(() => {
      if (Object.keys(pendingUpdateRef.current).length > 0) {
        onParameterChange({ ...pendingUpdateRef.current });
        pendingUpdateRef.current = {};
        // Clear local values after committing
        setLocalValues({});
      }
    }, 16); // 16ms = 1 frame for snappy response
  }, [onParameterChange]);

  // Get presets for current surface type
  const currentPresets = getPresetsByType(parameters.type);

  const applyPreset = (presetName: string) => {
    const preset = currentPresets?.presets.find(p => p.name === presetName);
    if (preset) {
      console.log(`Applying ${preset.marketValue} preset: ${preset.name}`);
      onParameterChange({
        ...preset.parameters,
        type: parameters.type,
        uMin: parameters.uMin,
        uMax: parameters.uMax,
        vMin: parameters.vMin,
        vMax: parameters.vMax,
        uSegments: parameters.uSegments,
        vSegments: parameters.vSegments
      });
    }
  };

  const handleResetShape = () => {
    // Clear all user-modified parameter tracking for clean reset
    clearPreservedSettings();

    const shapeDefaults = getDefaultParameters(parameters.type);
    console.log('🔄 Resetting to PURE mathematical form:', parameters.type, 'with exact defaults:', shapeDefaults);

    // COMPLETE RESET: Build full A-Z parameter set with explicit defaults
    // This ensures NO stale parameters bleed through from previous shapes
    const fullResetParams = {
      type: parameters.type,
      // A/B/C: Pure axis scaling (always 1 for static shape)
      a: shapeDefaults.a ?? 1,
      b: shapeDefaults.b ?? 1,
      c: shapeDefaults.c ?? 1,
      // D-Z: Shape-specific transforms (default to 0 for clean static render)
      d: shapeDefaults.d ?? 0,
      e: shapeDefaults.e ?? 0,
      f: shapeDefaults.f ?? 0,
      g: shapeDefaults.g ?? 0,
      h: shapeDefaults.h ?? 0,
      i: shapeDefaults.i ?? 0,
      j: shapeDefaults.j ?? 0,
      k: shapeDefaults.k ?? 0,
      l: shapeDefaults.l ?? 0,
      m: shapeDefaults.m ?? 0,
      n: shapeDefaults.n ?? 0,
      o: shapeDefaults.o ?? 0,
      p: shapeDefaults.p ?? 0,
      q: shapeDefaults.q ?? 0,
      r: shapeDefaults.r ?? 0,
      s: shapeDefaults.s ?? 0,
      t: shapeDefaults.t ?? 0,
      u: shapeDefaults.u ?? 0,
      v: shapeDefaults.v ?? 0,
      w: shapeDefaults.w ?? 0,
      x: shapeDefaults.x ?? 1,
      y: shapeDefaults.y ?? 1,
      z: shapeDefaults.z ?? 1,
      time: 0,
      // UV controls reset to clean state
      uMin: shapeDefaults.uMin ?? 0,
      uMax: shapeDefaults.uMax ?? 1,
      vMin: shapeDefaults.vMin ?? 0,
      vMax: shapeDefaults.vMax ?? 1,
      uSegments: shapeDefaults.uSegments ?? 360,
      vSegments: shapeDefaults.vSegments ?? 360
    };

    onParameterChange(fullResetParams);
    console.log('🔄 Shape completely reset - ALL A-Z parameters cleared to defaults');
  };

  const handleExportClick = (exportType: 'solid' | 'solid-wire' | 'wireframe' | 'points' | 'ply-points') => {
    setPendingExportType(exportType);
    setTimeout(() => handlePasswordSuccess(), 0);
  };

  const handleManifoldsReport = () => {
    window.open('/docs/manifolds-report.md', '_blank');
  };

  const handleAnimationExportClick = (animationType: AnimationType) => {
    setPendingAnimationType(animationType);
    setShowAnimationModal(true);
  };

  const handleAnimationStyleSelect = (geometryStyle: GeometryStyle) => {
    setPendingGeometryStyle(geometryStyle);
    setShowAnimationModal(false);
    setPendingExportType(pendingAnimationType);
    setTimeout(() => handlePasswordSuccess(), 0);
  };

  const handleHolographicExport = () => {
    setPendingGeometryStyle('holographic');
    setPendingAnimationType('sketchfab');
    setPendingExportType('sketchfab');
    setTimeout(() => handlePasswordSuccess(), 0);
  };

  const handleARVRExport = () => {
    setPendingExportType('ar-vr');
    setTimeout(() => handlePasswordSuccess(), 0);
  };

  const handleGridSceneExport = () => {
    window.dispatchEvent(new CustomEvent('exportGridScene'));
  };

  const handleNeuralExport = () => {
    setPendingExportType('neural');
    setTimeout(() => handlePasswordSuccess(), 0);
  };

  const handleNFTMint = () => {
    setShowNFTModal(true);
  };

  const handlePasswordSuccess = () => {
    if (pendingExportType) {
      // Track export to database
      trackingService.trackExport(
        parameters.type,
        pendingExportType,
        parameters,
        {
          materialSettings: {},
          exportResolution: pendingGeometryStyle
        }
      );

      if (pendingExportType === 'ar-vr') {
        const event = new CustomEvent('exportARVR', {
          detail: {
            shapeId: parameters.type,
            parameters: parameters
          }
        });
        window.dispatchEvent(event);
      } else if (pendingExportType === 'neural') {
        const event = new CustomEvent('exportNeural', {
          detail: {
            shapeId: parameters.type,
            parameters: parameters
          }
        });
        window.dispatchEvent(event);
      } else {
        const event = new CustomEvent('exportGLTF', {
          detail: {
            exportType: pendingExportType,
            geometryStyle: pendingGeometryStyle
          }
        });
        window.dispatchEvent(event);
      }
      setPendingExportType(null);
      setPendingAnimationType(null);
      setPendingGeometryStyle('solid');
    }
  };

  // Function to update parameters, used by converters
  const updateParameters = (params: Partial<SurfaceParameters>) => {
    onParameterChange(params);
  };

  return (
    <div className="relative sm:absolute sm:top-4 sm:left-4 w-full sm:w-72 md:w-80 bg-gradient-to-br from-gray-900 to-black backdrop-blur-md rounded-xl p-3 sm:p-4 md:p-5 border-2 border-teal-500/30 shadow-2xl text-teal-200 z-10 max-h-[calc(100vh-2rem)] overflow-y-auto">
      {/* Professional Header with Bezzeled Design */}
      <div className="mb-3 sm:mb-4 pb-2 sm:pb-3 border-b-2 border-teal-500/20">
        <h2 className="text-base sm:text-lg font-bold text-teal-400 tracking-wide">Control Panel</h2>
        <p className="text-[10px] sm:text-xs text-teal-300/70 mt-0.5 sm:mt-1">Mathematical Visualization Controls</p>
      </div>

      <Tabs defaultValue="parameters" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gray-800/80 mb-3 sm:mb-4 rounded-lg border border-teal-500/20 p-0.5 sm:p-1">
          <TabsTrigger value="parameters" className="text-[10px] sm:text-xs flex items-center justify-center gap-0.5 sm:gap-1 text-teal-300 data-[state=active]:bg-teal-600 data-[state=active]:text-white rounded-md transition-all px-1 sm:px-2 py-1">
            <Settings className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span className="hidden sm:inline">Params</span>
          </TabsTrigger>
          <TabsTrigger value="energy" className="text-[10px] sm:text-xs flex items-center justify-center gap-0.5 sm:gap-1 text-yellow-300 data-[state=active]:bg-yellow-600 data-[state=active]:text-white rounded-md transition-all px-1 sm:px-2 py-1">
            <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span className="hidden sm:inline">Energy</span>
          </TabsTrigger>
          <TabsTrigger value="nerf" className="text-[10px] sm:text-xs flex items-center justify-center gap-0.5 sm:gap-1 text-cyan-300 data-[state=active]:bg-cyan-600 data-[state=active]:text-white rounded-md transition-all px-1 sm:px-2 py-1">
            <Cpu className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span className="hidden sm:inline">NeRF</span>
          </TabsTrigger>
          <TabsTrigger value="wiregenesis" className="text-[10px] sm:text-xs flex items-center justify-center gap-0.5 sm:gap-1 text-green-300 data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md transition-all px-1 sm:px-2 py-1">
            <Upload className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span className="hidden sm:inline">3D</span>
          </TabsTrigger>
          <TabsTrigger value="sharing" className="text-[10px] sm:text-xs flex items-center justify-center gap-0.5 sm:gap-1 text-teal-300 data-[state=active]:bg-teal-600 data-[state=active]:text-white rounded-md transition-all px-1 sm:px-2 py-1">
            <Share2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span className="hidden sm:inline">Share</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="parameters" className="space-y-4">
          {/* HIDDEN FOR NOW - Reserved for future emoji/icon analysis features */}
          {/* <EmojiShapeConverter
            onShapeSelect={(params) => updateParameters(params)}
            className="mb-4"
          /> */}

          {/* HIDDEN FOR NOW - Reserved for future color analysis features */}
          {/* <ColorToShapeConverter
            onShapeSelect={(params) => updateParameters(params)}
            className="mb-4"
          /> */}

        {/* Action Buttons: Reset & Save Current Shape */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-teal-400 uppercase tracking-wide">Reset</Label>
            <Button
              onClick={handleResetShape}
              className="h-9 w-full bg-gradient-to-br from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 rounded-lg border-2 border-teal-500/40 shadow-lg transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </Button>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-teal-400 uppercase tracking-wide">Save Shape</Label>
            <Button
              onClick={() => setShowSaveModal(true)}
              className="h-9 w-full bg-gradient-to-br from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 rounded-lg border-2 border-teal-500/40 shadow-lg transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              Save
            </Button>
          </div>
        </div>

        {/* Grid/Axis & Animation Toggles */}
        <div className="space-y-3 bg-gray-800/50 p-3 rounded-lg border-2 border-teal-500/20">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-teal-400 uppercase tracking-wide">Grid & Axis</Label>
            <Button
              onClick={() => onShowGridChange(!showGrid)}
              className={`h-9 w-full ${showGrid ? 'bg-gradient-to-br from-teal-600 to-teal-700' : 'bg-gradient-to-br from-gray-700 to-gray-800'} hover:from-teal-500 hover:to-teal-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 rounded-lg border-2 border-teal-500/40 shadow-lg transition-all`}
            >
              <GridIcon className="w-3.5 h-3.5" />
              {showGrid ? 'Hide Grid' : 'Show Grid'}
            </Button>
          </div>

          {onAnimToggle && (
            <TensorAnimationPanel
              isAnimating={isAnimating}
              animationType={tensorAnimType}
              animationVelocity={animationVelocity}
              breatheIntensity={breatheIntensity}
              dynamicsMode={dynamicsMode as 'rigid' | 'soft'}
              onToggle={onAnimToggle}
              onTypeChange={onTensorAnimTypeChange ?? (() => {})}
              onVelocityChange={onAnimationVelocityChange ?? (() => {})}
              onBreatheIntensityChange={onBreatheIntensityChange ?? (() => {})}
              onDynamicsModeChange={onDynamicsModeChange ?? (() => {})}
            />
          )}
        </div>


        {/* Mesh Density Controls - Tessellation Detail */}
        <div className="space-y-3 bg-gray-800/50 p-3 rounded-lg border-2 border-purple-500/20">
          <Label className="text-sm font-semibold text-purple-400 flex items-center gap-2 uppercase tracking-wide">
            🔷 Mesh Density - Tessellation Control
          </Label>
          <div className="text-xs text-purple-200 bg-purple-900/30 p-2 rounded-lg border border-purple-500/20">
            U Segments = Horizontal density | V Segments = Vertical density (5 to 360) - Optimized mesh control
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <Label className="text-xs text-cyan-400 font-bold">U Segments (Horizontal):</Label>
                <span className="text-cyan-200 font-mono text-xs">{(parameters.uSegments ?? 0).toFixed(1)}</span>
              </div>
              <Slider
                value={[parameters.uSegments ?? 360]}
                onValueChange={(value) => onParameterChange({ uSegments: parseFloat(value[0].toFixed(1)) })}
                min={5}
                max={360}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <Label className="text-xs text-green-400 font-bold">V Segments (Vertical):</Label>
                <span className="text-green-200 font-mono text-xs">{(parameters.vSegments ?? 0).toFixed(1)}</span>
              </div>
              <Slider
                value={[parameters.vSegments ?? 360]}
                onValueChange={(value) => onParameterChange({ vSegments: parseFloat(value[0].toFixed(1)) })}
                min={5}
                max={360}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* UV Domain Controls - Shape Unfolding System */}
        <div className="space-y-3 bg-gray-800/50 p-3 rounded-lg border-2 border-cyan-500/20">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-semibold text-cyan-400 flex items-center gap-2 uppercase tracking-wide">
              🔄 UV Domain Controls
            </Label>
            <button
              onClick={() => {
                const defaults = getDefaultParameters(parameters.type);
                onParameterChange({
                  uMin: defaults.uMin ?? 0,
                  uMax: defaults.uMax ?? 1,
                  vMin: defaults.vMin ?? 0,
                  vMax: defaults.vMax ?? 1
                });
              }}
              className="text-[10px] px-2 py-1 rounded bg-cyan-700 text-white hover:bg-cyan-600 transition-colors"
            >
              Reset UV
            </button>
          </div>
          <div className="text-xs text-cyan-200 bg-cyan-900/30 p-2 rounded-lg border border-cyan-500/20">
            Control parametric surface domain ranges (-50.0 to 50.0). Stable shape dynamics.
          </div>

          {/* U Parameter Domain */}
          <div className="space-y-2">
            <Label className="text-xs text-cyan-400 font-bold uppercase">U Parameter Domain</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <Label className="text-xs text-cyan-400 font-bold">U Min:</Label>
                  <span className="text-cyan-200 font-mono text-xs">{((localValues.uMin ?? parameters.uMin ?? 0)).toFixed(1)}</span>
                </div>
                <Slider
                  value={[localValues.uMin ?? parameters.uMin ?? 0]}
                  onValueChange={(value) => handleParameterSliderChange('uMin', value)}
                  min={-50}
                  max={50}
                  step={0.1}
                  className="w-full"
                />
                <Select value={String(Math.round(parameters.uMin ?? 0))} onValueChange={(val) => onParameterChange({ uMin: parseFloat(val) })}>
                  <SelectTrigger className="h-7 text-xs bg-cyan-900/50 border-cyan-700">
                    <SelectValue placeholder="Preset" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] bg-gray-900 border-cyan-700">
                    {Array.from({ length: 101 }, (_, i) => i - 50).map(n => (
                      <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <Label className="text-xs text-cyan-400 font-bold">U Max:</Label>
                  <span className="text-cyan-200 font-mono text-xs">{((localValues.uMax ?? parameters.uMax ?? 1)).toFixed(1)}</span>
                </div>
                <Slider
                  value={[localValues.uMax ?? parameters.uMax ?? 1]}
                  onValueChange={(value) => handleParameterSliderChange('uMax', value)}
                  min={-50}
                  max={50}
                  step={0.1}
                  className="w-full"
                />
                <Select value={String(Math.round(parameters.uMax ?? 1))} onValueChange={(val) => onParameterChange({ uMax: parseFloat(val) })}>
                  <SelectTrigger className="h-7 text-xs bg-cyan-900/50 border-cyan-700">
                    <SelectValue placeholder="Preset" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] bg-gray-900 border-cyan-700">
                    {Array.from({ length: 101 }, (_, i) => i - 50).map(n => (
                      <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* V Parameter Domain */}
          <div className="space-y-2">
            <Label className="text-xs text-green-400 font-bold uppercase">V Parameter Domain</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <Label className="text-xs text-green-400 font-bold">V Min:</Label>
                  <span className="text-green-200 font-mono text-xs">{((localValues.vMin ?? parameters.vMin ?? 0)).toFixed(1)}</span>
                </div>
                <Slider
                  value={[localValues.vMin ?? parameters.vMin ?? 0]}
                  onValueChange={(value) => handleParameterSliderChange('vMin', value)}
                  min={-50}
                  max={50}
                  step={0.1}
                  className="w-full"
                />
                <Select value={String(Math.round(parameters.vMin ?? 0))} onValueChange={(val) => onParameterChange({ vMin: parseFloat(val) })}>
                  <SelectTrigger className="h-7 text-xs bg-green-900/50 border-green-700">
                    <SelectValue placeholder="Preset" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] bg-gray-900 border-green-700">
                    {Array.from({ length: 101 }, (_, i) => i - 50).map(n => (
                      <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <Label className="text-xs text-green-400 font-bold">V Max:</Label>
                  <span className="text-green-200 font-mono text-xs">{((localValues.vMax ?? parameters.vMax ?? 1)).toFixed(1)}</span>
                </div>
                <Slider
                  value={[localValues.vMax ?? parameters.vMax ?? 1]}
                  onValueChange={(value) => handleParameterSliderChange('vMax', value)}
                  min={-50}
                  max={50}
                  step={0.1}
                  className="w-full"
                />
                <Select value={String(Math.round(parameters.vMax ?? 1))} onValueChange={(val) => onParameterChange({ vMax: parseFloat(val) })}>
                  <SelectTrigger className="h-7 text-xs bg-green-900/50 border-green-700">
                    <SelectValue placeholder="Preset" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] bg-gray-900 border-green-700">
                    {Array.from({ length: 101 }, (_, i) => i - 50).map(n => (
                      <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* fBm / Triplanar Material Detail Controls */}
        <div className="space-y-3 bg-gray-800/50 p-3 rounded-lg border-2 border-purple-500/20">
          <Label className="text-sm font-semibold text-purple-400 flex items-center gap-2 uppercase tracking-wide">
            🌀 Triplanar fBm Detail
          </Label>
          <div className="text-xs text-purple-200 bg-purple-900/20 p-2 rounded-lg border border-purple-500/20">
            World-space triplanar projection with fBm noise — seamless on any shape. Active on: Voronoi, Cellular, Fractal, Hexagonal, Truchet, Mandelbrot, Fibonacci, Penrose, Delaunay.
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <Label className="text-xs text-purple-400 font-bold">fBm Layers:</Label>
                <span className="text-purple-200 font-mono text-xs">{parameters.fBmLayers ?? 3}</span>
              </div>
              <Slider
                value={[parameters.fBmLayers ?? 3]}
                onValueChange={(value) => onParameterChange({ fBmLayers: Math.round(value[0]) })}
                min={1}
                max={6}
                step={1}
                className="w-full"
              />
              <span className="text-[10px] text-gray-400">Octaves (1 = fast, 6 = rich detail)</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <Label className="text-xs text-purple-400 font-bold">Domain Warp:</Label>
                <span className="text-purple-200 font-mono text-xs">{(parameters.domainWarp ?? 0).toFixed(2)}</span>
              </div>
              <Slider
                value={[parameters.domainWarp ?? 0]}
                onValueChange={(value) => onParameterChange({ domainWarp: parseFloat(value[0].toFixed(2)) })}
                min={0}
                max={1}
                step={0.01}
                className="w-full"
              />
              <span className="text-[10px] text-gray-400">0 = flat, 1 = marble/fluid warp</span>
            </div>
          </div>
        </div>

        {/* A-Z MATHEMATICAL PARAMETERS - 3-Column Precision Controls */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium text-yellow-400">A-Z Parameters</Label>
            <span className="text-[10px] px-2 py-1 rounded bg-cyan-600 text-white">
              3-COL PRECISION
            </span>
          </div>
          <p className="text-[9px] text-gray-500">Hold SHIFT for 5x finer precision</p>

          {/* 3-COLUMN PRECISION CONTROLS */}
          <div className="grid grid-cols-3 gap-3">
            {showSlider('a') && (
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-blue-400 tracking-wide flex flex-col">
                <span>A {Math.abs((localValues.a ?? parameters.a ?? 1) - 1) > 0.001 && <span className="text-cyan-400">●</span>}</span>
                {sliderLabel('a') && <span className="text-[9px] normal-case font-normal text-blue-300 truncate">{sliderLabel('a')}</span>}
              </Label>
              <Slider
                value={[localValues.a ?? parameters.a ?? 1]}
                onValueChange={(value) => handleParameterSliderChange('a', value)}
                min={-50}
                max={50}
                step={0.01}
                className="w-full"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 block truncate">{(localValues.a ?? parameters.a ?? 1).toFixed(2)}</span>
                {Math.abs((localValues.a ?? parameters.a ?? 1) - 1) > 0.5 && (
                  <button onClick={() => handleParameterSliderChange('a', [1.0])} className="text-xs text-cyan-400 hover:text-cyan-300 underline" title="Reset to 1">Reset</button>
                )}
              </div>
            </div>
            )}

            {showSlider('b') && (
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-blue-400 tracking-wide flex flex-col">
                <span>B {Math.abs((localValues.b ?? parameters.b ?? 1) - 1) > 0.001 && <span className="text-cyan-400">●</span>}</span>
                {sliderLabel('b') && <span className="text-[9px] normal-case font-normal text-blue-300 truncate">{sliderLabel('b')}</span>}
              </Label>
              <Slider
                value={[localValues.b ?? parameters.b ?? 1]}
                onValueChange={(value) => handleParameterSliderChange('b', value)}
                min={-50}
                max={50}
                step={0.01}
                className="w-full"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 block truncate">{(localValues.b ?? parameters.b ?? 1).toFixed(2)}</span>
                {Math.abs((localValues.b ?? parameters.b ?? 1) - 1) > 0.5 && (
                  <button onClick={() => handleParameterSliderChange('b', [1.0])} className="text-xs text-cyan-400 hover:text-cyan-300 underline" title="Reset to 1">Reset</button>
                )}
              </div>
            </div>
            )}

            {showSlider('c') && (
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-blue-400 tracking-wide flex flex-col">
                <span>C {Math.abs((localValues.c ?? parameters.c ?? 1) - 1) > 0.001 && <span className="text-cyan-400">●</span>}</span>
                {sliderLabel('c') && <span className="text-[9px] normal-case font-normal text-blue-300 truncate">{sliderLabel('c')}</span>}
              </Label>
              <Slider
                value={[localValues.c ?? parameters.c ?? 1]}
                onValueChange={(value) => handleParameterSliderChange('c', value)}
                min={-50}
                max={50}
                step={0.01}
                className="w-full"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 block truncate">{(localValues.c ?? parameters.c ?? 1).toFixed(2)}</span>
                {Math.abs((localValues.c ?? parameters.c ?? 1) - 1) > 0.5 && (
                  <button onClick={() => handleParameterSliderChange('c', [1.0])} className="text-xs text-cyan-400 hover:text-cyan-300 underline" title="Reset to 1">Reset</button>
                )}
              </div>
            </div>
            )}

            {showSlider('d') && (
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-purple-400 tracking-wide flex flex-col">
                <span>D {Math.abs(localValues.d ?? parameters.d ?? 0) > 0.001 && <span className="text-purple-300">●</span>}</span>
                {sliderLabel('d') && <span className="text-[9px] normal-case font-normal text-purple-300 truncate">{sliderLabel('d')}</span>}
              </Label>
              <Slider
                value={[localValues.d ?? parameters.d ?? 0]}
                onValueChange={(value) => handleParameterSliderChange('d', value)}
                min={-50}
                max={50}
                step={PARAMETER_SPECS.d.step}
                className="w-full"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 block truncate">{(localValues.d ?? parameters.d ?? 0).toFixed(2)}</span>
                {Math.abs(localValues.d ?? parameters.d ?? 0) > 0.001 && (
                  <button onClick={() => handleParameterSliderChange('d', [0.0])} className="text-xs text-yellow-400 hover:text-yellow-300 underline" title="Reset to 0">Reset</button>
                )}
              </div>
            </div>
            )}

            {showSlider('e') && (
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-purple-400 tracking-wide flex flex-col">
                <span>E</span>
                {sliderLabel('e') && <span className="text-[9px] normal-case font-normal text-purple-300 truncate">{sliderLabel('e')}</span>}
              </Label>
              <Slider
                value={[localValues.e ?? parameters.e ?? 0]}
                onValueChange={(value) => handleParameterSliderChange('e', value)}
                min={-50}
                max={50}
                step={PARAMETER_SPECS.d.step}
                className="w-full"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 block truncate">{(localValues.e ?? parameters.e ?? 0).toFixed(2)}</span>
                {Math.abs(localValues.e ?? parameters.e ?? 0) > 0.001 && (
                  <button onClick={() => handleParameterSliderChange('e', [0.0])} className="text-xs text-yellow-400 hover:text-yellow-300 underline" title="Reset to 0">Reset</button>
                )}
              </div>
            </div>
            )}

            {showSlider('f') && (
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-purple-400 tracking-wide flex flex-col">
                <span>F</span>
                {sliderLabel('f') && <span className="text-[9px] normal-case font-normal text-purple-300 truncate">{sliderLabel('f')}</span>}
              </Label>
              <Slider
                value={[localValues.f ?? parameters.f ?? 0]}
                onValueChange={(value) => handleParameterSliderChange('f', value)}
                min={-50}
                max={50}
                step={PARAMETER_SPECS.d.step}
                className="w-full"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 block truncate">{(localValues.f ?? parameters.f ?? 0).toFixed(2)}</span>
                {Math.abs(localValues.f ?? parameters.f ?? 0) > 0.001 && (
                  <button onClick={() => handleParameterSliderChange('f', [0.0])} className="text-xs text-yellow-400 hover:text-yellow-300 underline" title="Reset to 0">Reset</button>
                )}
              </div>
            </div>
            )}
          </div>

          {/* Secondary Parameters (g-z) - Geometric Transformation Controls */}
          <div className="grid grid-cols-3 gap-3">
            {showSlider('g') && (
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-green-400 tracking-wide flex flex-col">
                <span>G</span>
                {sliderLabel('g') && <span className="text-[9px] normal-case font-normal text-green-300 truncate">{sliderLabel('g')}</span>}
              </Label>
              <Slider
                value={[localValues.g ?? parameters.g ?? 0]}
                onValueChange={(value) => handleParameterSliderChange('g', value)}
                min={-50}
                max={50}
                step={PARAMETER_SPECS.d.step}
                className="w-full"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 block truncate">{(localValues.g ?? parameters.g ?? 0).toFixed(2)}</span>
                {Math.abs(localValues.g ?? parameters.g ?? 0) > 0.001 && (
                  <button onClick={() => handleParameterSliderChange('g', [0.0])} className="text-xs text-yellow-400 hover:text-yellow-300 underline" title="Reset to 0">Reset</button>
                )}
              </div>
            </div>
            )}

            {showSlider('h') && (
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-green-400 tracking-wide flex flex-col">
                <span>H</span>
                {sliderLabel('h') && <span className="text-[9px] normal-case font-normal text-green-300 truncate">{sliderLabel('h')}</span>}
              </Label>
              <Slider
                value={[localValues.h ?? parameters.h ?? 0]}
                onValueChange={(value) => handleParameterSliderChange('h', value)}
                min={-50}
                max={50}
                step={PARAMETER_SPECS.d.step}
                className="w-full"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 block truncate">{(localValues.h ?? parameters.h ?? 0).toFixed(2)}</span>
                {Math.abs(localValues.h ?? parameters.h ?? 0) > 0.001 && (
                  <button onClick={() => handleParameterSliderChange('h', [0.0])} className="text-xs text-yellow-400 hover:text-yellow-300 underline" title="Reset to 0">Reset</button>
                )}
              </div>
            </div>
            )}

            {showSlider('i') && (
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-green-400 tracking-wide flex flex-col">
                <span>I</span>
                {sliderLabel('i') && <span className="text-[9px] normal-case font-normal text-green-300 truncate">{sliderLabel('i')}</span>}
              </Label>
              <Slider
                value={[localValues.i ?? parameters.i ?? 0]}
                onValueChange={(value) => handleParameterSliderChange('i', value)}
                min={-50}
                max={50}
                step={PARAMETER_SPECS.d.step}
                className="w-full"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 block truncate">{(localValues.i ?? parameters.i ?? 0).toFixed(2)}</span>
                {Math.abs(localValues.i ?? parameters.i ?? 0) > 0.001 && (
                  <button onClick={() => handleParameterSliderChange('i', [0.0])} className="text-xs text-yellow-400 hover:text-yellow-300 underline" title="Reset to 0">Reset</button>
                )}
              </div>
            </div>
            )}

            {showSlider('j') && (
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-green-400 tracking-wide flex flex-col">
                <span>J</span>
                {sliderLabel('j') && <span className="text-[9px] normal-case font-normal text-green-300 truncate">{sliderLabel('j')}</span>}
              </Label>
              <Slider
                value={[localValues.j ?? parameters.j ?? 0]}
                onValueChange={(value) => handleParameterSliderChange('j', value)}
                min={-50}
                max={50}
                step={PARAMETER_SPECS.j.step}
                className="w-full"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 block truncate">{(localValues.j ?? parameters.j ?? 0).toFixed(2)}</span>
                {Math.abs(localValues.j ?? parameters.j ?? 0) > 0.001 && (
                  <button onClick={() => handleParameterSliderChange('j', [0.0])} className="text-xs text-yellow-400 hover:text-yellow-300 underline" title="Reset to 0">Reset</button>
                )}
              </div>
            </div>
            )}

            {showSlider('k') && (
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-green-400 tracking-wide flex flex-col">
                <span>K</span>
                {sliderLabel('k') && <span className="text-[9px] normal-case font-normal text-green-300 truncate">{sliderLabel('k')}</span>}
              </Label>
              <Slider
                value={[localValues.k ?? parameters.k ?? 0]}
                onValueChange={(value) => handleParameterSliderChange('k', value)}
                min={-50}
                max={50}
                step={PARAMETER_SPECS.j.step}
                className="w-full"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 block truncate">{(localValues.k ?? parameters.k ?? 0).toFixed(2)}</span>
                {Math.abs(localValues.k ?? parameters.k ?? 0) > 0.001 && (
                  <button onClick={() => handleParameterSliderChange('k', [0.0])} className="text-xs text-yellow-400 hover:text-yellow-300 underline" title="Reset to 0">Reset</button>
                )}
              </div>
            </div>
            )}

            {showSlider('l') && (
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-green-400 tracking-wide flex flex-col">
                <span>L</span>
                {sliderLabel('l') && <span className="text-[9px] normal-case font-normal text-green-300 truncate">{sliderLabel('l')}</span>}
              </Label>
              <Slider
                value={[localValues.l ?? parameters.l ?? 0]}
                onValueChange={(value) => handleParameterSliderChange('l', value)}
                min={-50}
                max={50}
                step={PARAMETER_SPECS.j.step}
                className="w-full"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 block truncate">{(localValues.l ?? parameters.l ?? 0).toFixed(2)}</span>
                {Math.abs(localValues.l ?? parameters.l ?? 0) > 0.001 && (
                  <button onClick={() => handleParameterSliderChange('l', [0.0])} className="text-xs text-yellow-400 hover:text-yellow-300 underline" title="Reset to 0">Reset</button>
                )}
              </div>
            </div>
            )}

            {showSlider('m') && (
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-green-400 tracking-wide flex flex-col">
                <span>M</span>
                {sliderLabel('m') && <span className="text-[9px] normal-case font-normal text-green-300 truncate">{sliderLabel('m')}</span>}
              </Label>
              <Slider
                value={[localValues.m ?? parameters.m ?? 0]}
                onValueChange={(value) => handleParameterSliderChange('m', value)}
                min={-50}
                max={50}
                step={PARAMETER_SPECS.j.step}
                className="w-full"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 block truncate">{(localValues.m ?? parameters.m ?? 0).toFixed(2)}</span>
                {Math.abs(localValues.m ?? parameters.m ?? 0) > 0.001 && (
                  <button onClick={() => handleParameterSliderChange('m', [0.0])} className="text-xs text-yellow-400 hover:text-yellow-300 underline" title="Reset to 0">Reset</button>
                )}
              </div>
            </div>
            )}

            {showSlider('n') && (
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-purple-400 tracking-wide flex flex-col">
                <span>N</span>
                {sliderLabel('n') && <span className="text-[9px] normal-case font-normal text-purple-300 truncate">{sliderLabel('n')}</span>}
              </Label>
              <Slider
                value={[localValues.n ?? parameters.n ?? 0]}
                onValueChange={(value) => handleParameterSliderChange('n', value)}
                min={-50}
                max={50}
                step={PARAMETER_SPECS.j.step}
                className="w-full"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 block truncate">{(localValues.n ?? parameters.n ?? 0).toFixed(2)}</span>
                {Math.abs(localValues.n ?? parameters.n ?? 0) > 0.001 && (
                  <button onClick={() => handleParameterSliderChange('n', [0.0])} className="text-xs text-purple-400 hover:text-purple-300 underline" title="Reset to 0">Reset</button>
                )}
              </div>
            </div>
            )}

            {showSlider('o') && (
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-purple-400 tracking-wide flex flex-col">
                <span>O</span>
                {sliderLabel('o') && <span className="text-[9px] normal-case font-normal text-purple-300 truncate">{sliderLabel('o')}</span>}
              </Label>
              <Slider
                value={[localValues.o ?? parameters.o ?? 0]}
                onValueChange={(value) => handleParameterSliderChange('o', value)}
                min={-50}
                max={50}
                step={PARAMETER_SPECS.j.step}
                className="w-full"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 block truncate">{(localValues.o ?? parameters.o ?? 0).toFixed(2)}</span>
                {Math.abs(localValues.o ?? parameters.o ?? 0) > 0.001 && (
                  <button onClick={() => handleParameterSliderChange('o', [0.0])} className="text-xs text-purple-400 hover:text-purple-300 underline" title="Reset to 0">Reset</button>
                )}
              </div>
            </div>
            )}

            {showSlider('p') && (
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-blue-400 tracking-wide flex flex-col">
                <span>P</span>
                {sliderLabel('p') && <span className="text-[9px] normal-case font-normal text-blue-300 truncate">{sliderLabel('p')}</span>}
              </Label>
              <Slider
                value={[localValues.p ?? parameters.p ?? 0]}
                onValueChange={(value) => handleParameterSliderChange('p', value)}
                min={-50}
                max={50}
                step={PARAMETER_SPECS.j.step}
                className="w-full"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 block truncate">{(localValues.p ?? parameters.p ?? 0).toFixed(2)}</span>
                {Math.abs(localValues.p ?? parameters.p ?? 0) > 0.001 && (
                  <button onClick={() => handleParameterSliderChange('p', [0.0])} className="text-xs text-blue-400 hover:text-blue-300 underline" title="Reset to 0">Reset</button>
                )}
              </div>
            </div>
            )}

            {showSlider('q') && (
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-blue-400 tracking-wide flex flex-col">
                <span>Q</span>
                {sliderLabel('q') && <span className="text-[9px] normal-case font-normal text-blue-300 truncate">{sliderLabel('q')}</span>}
              </Label>
              <Slider
                value={[localValues.q ?? parameters.q ?? 0]}
                onValueChange={(value) => handleParameterSliderChange('q', value)}
                min={-50}
                max={50}
                step={PARAMETER_SPECS.j.step}
                className="w-full"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 block truncate">{(localValues.q ?? parameters.q ?? 0).toFixed(2)}</span>
                {Math.abs(localValues.q ?? parameters.q ?? 0) > 0.001 && (
                  <button onClick={() => handleParameterSliderChange('q', [0.0])} className="text-xs text-blue-400 hover:text-blue-300 underline" title="Reset to 0">Reset</button>
                )}
              </div>
            </div>
            )}

            {showSlider('r') && (
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-pink-400 tracking-wide flex flex-col">
                <span>R</span>
                {sliderLabel('r') && <span className="text-[9px] normal-case font-normal text-pink-300 truncate">{sliderLabel('r')}</span>}
              </Label>
              <Slider
                value={[localValues.r ?? parameters.r ?? 0]}
                onValueChange={(value) => handleParameterSliderChange('r', value)}
                min={-50}
                max={50}
                step={PARAMETER_SPECS.j.step}
                className="w-full"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 block truncate">{(localValues.r ?? parameters.r ?? 0).toFixed(2)}</span>
                {Math.abs(localValues.r ?? parameters.r ?? 0) > 0.001 && (
                  <button onClick={() => handleParameterSliderChange('r', [0.0])} className="text-xs text-pink-400 hover:text-pink-300 underline" title="Reset to 0">Reset</button>
                )}
              </div>
            </div>
            )}

            {showSlider('s') && (
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-pink-400 tracking-wide flex flex-col">
                <span>S</span>
                {sliderLabel('s') && <span className="text-[9px] normal-case font-normal text-pink-300 truncate">{sliderLabel('s')}</span>}
              </Label>
              <Slider
                value={[localValues.s ?? parameters.s ?? 0]}
                onValueChange={(value) => handleParameterSliderChange('s', value)}
                min={-50}
                max={50}
                step={PARAMETER_SPECS.j.step}
                className="w-full"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 block truncate">{(localValues.s ?? parameters.s ?? 0).toFixed(2)}</span>
                {Math.abs(localValues.s ?? parameters.s ?? 0) > 0.001 && (
                  <button onClick={() => handleParameterSliderChange('s', [0.0])} className="text-xs text-pink-400 hover:text-pink-300 underline" title="Reset to 0">Reset</button>
                )}
              </div>
            </div>
            )}

            {showSlider('t') && (
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-amber-400 tracking-wide flex flex-col">
                <span>T</span>
                {sliderLabel('t') && <span className="text-[9px] normal-case font-normal text-amber-300 truncate">{sliderLabel('t')}</span>}
              </Label>
              <Slider
                value={[localValues.t ?? parameters.t ?? 0]}
                onValueChange={(value) => handleParameterSliderChange('t', value)}
                min={-50}
                max={50}
                step={PARAMETER_SPECS.d.step}
                className="w-full"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 block truncate">{(localValues.t ?? parameters.t ?? 0).toFixed(2)}</span>
                {Math.abs(localValues.t ?? parameters.t ?? 0) > 0.001 && (
                  <button onClick={() => handleParameterSliderChange('t', [0.0])} className="text-xs text-amber-400 hover:text-amber-300 underline" title="Reset to 0">Reset</button>
                )}
              </div>
            </div>
            )}

            {showSlider('u') && (
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-amber-400 tracking-wide flex flex-col">
                <span>U</span>
                {sliderLabel('u') && <span className="text-[9px] normal-case font-normal text-amber-300 truncate">{sliderLabel('u')}</span>}
              </Label>
              <Slider
                value={[localValues.u ?? parameters.u ?? 0]}
                onValueChange={(value) => handleParameterSliderChange('u', value)}
                min={-50}
                max={50}
                step={PARAMETER_SPECS.d.step}
                className="w-full"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 block truncate">{(localValues.u ?? parameters.u ?? 0).toFixed(2)}</span>
                {Math.abs(localValues.u ?? parameters.u ?? 0) > 0.001 && (
                  <button onClick={() => handleParameterSliderChange('u', [0.0])} className="text-xs text-amber-400 hover:text-amber-300 underline" title="Reset to 0">Reset</button>
                )}
              </div>
            </div>
            )}

            {showSlider('v') && (
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-red-400 tracking-wide flex flex-col">
                <span>V</span>
                {sliderLabel('v') && <span className="text-[9px] normal-case font-normal text-red-300 truncate">{sliderLabel('v')}</span>}
              </Label>
              <Slider
                value={[localValues.v ?? parameters.v ?? 0]}
                onValueChange={(value) => handleParameterSliderChange('v', value)}
                min={-50}
                max={50}
                step={PARAMETER_SPECS.a.step}
                className="w-full"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 block truncate">{(localValues.v ?? parameters.v ?? 0).toFixed(2)}</span>
                {Math.abs(localValues.v ?? parameters.v ?? 0) > 0.001 && (
                  <button onClick={() => handleParameterSliderChange('v', [0.0])} className="text-xs text-red-400 hover:text-red-300 underline" title="Reset to 0">Reset</button>
                )}
              </div>
            </div>
            )}

            {showSlider('w') && (
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-red-400 tracking-wide flex flex-col">
                <span>W</span>
                {sliderLabel('w') && <span className="text-[9px] normal-case font-normal text-red-300 truncate">{sliderLabel('w')}</span>}
              </Label>
              <Slider
                value={[localValues.w ?? parameters.w ?? 0]}
                onValueChange={(value) => handleParameterSliderChange('w', value)}
                min={-50}
                max={50}
                step={PARAMETER_SPECS.a.step}
                className="w-full"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 block truncate">{(localValues.w ?? parameters.w ?? 0).toFixed(2)}</span>
                {Math.abs(localValues.w ?? parameters.w ?? 0) > 0.001 && (
                  <button onClick={() => handleParameterSliderChange('w', [0.0])} className="text-xs text-red-400 hover:text-red-300 underline" title="Reset to 0">Reset</button>
                )}
              </div>
            </div>
            )}

            {showSlider('x') && (
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-gray-400 tracking-wide flex flex-col">
                <span>X</span>
                {sliderLabel('x') && <span className="text-[9px] normal-case font-normal text-gray-300 truncate">{sliderLabel('x')}</span>}
              </Label>
              <Slider
                value={[localValues.x ?? parameters.x ?? 0]}
                onValueChange={(value) => handleParameterSliderChange('x', value)}
                min={-50}
                max={50}
                step={PARAMETER_SPECS.x.step}
                className="w-full"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 block truncate">{(localValues.x ?? parameters.x ?? 0).toFixed(2)}</span>
                {Math.abs(localValues.x ?? parameters.x ?? 0) > 0.001 && (
                  <button onClick={() => handleParameterSliderChange('x', [0.0])} className="text-xs text-gray-400 hover:text-gray-300 underline" title="Reset to 0">Reset</button>
                )}
              </div>
            </div>
            )}

            {showSlider('y') && (
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-gray-400 tracking-wide flex flex-col">
                <span>Y</span>
                {sliderLabel('y') && <span className="text-[9px] normal-case font-normal text-gray-300 truncate">{sliderLabel('y')}</span>}
              </Label>
              <Slider
                value={[localValues.y ?? parameters.y ?? 0]}
                onValueChange={(value) => handleParameterSliderChange('y', value)}
                min={-50}
                max={50}
                step={PARAMETER_SPECS.x.step}
                className="w-full"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 block truncate">{(localValues.y ?? parameters.y ?? 0).toFixed(2)}</span>
                {Math.abs(localValues.y ?? parameters.y ?? 0) > 0.001 && (
                  <button onClick={() => handleParameterSliderChange('y', [0.0])} className="text-xs text-gray-400 hover:text-gray-300 underline" title="Reset to 0">Reset</button>
                )}
              </div>
            </div>
            )}

            {showSlider('z') && (
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-rose-500 tracking-wide flex flex-col">
                <span>Z</span>
                {sliderLabel('z') && <span className="text-[9px] normal-case font-normal text-rose-400 truncate">{sliderLabel('z')}</span>}
              </Label>
              <Slider
                value={[localValues.z ?? parameters.z ?? 0]}
                onValueChange={(value) => handleParameterSliderChange('z', value)}
                min={-50}
                max={50}
                step={PARAMETER_SPECS.x.step}
                className="w-full"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 block truncate">{(localValues.z ?? parameters.z ?? 0).toFixed(2)}</span>
                {Math.abs(localValues.z ?? parameters.z ?? 0) > 0.001 && (
                  <button onClick={() => handleParameterSliderChange('z', [0.0])} className="text-xs text-rose-500 hover:text-rose-400 underline" title="Reset to 0">Reset</button>
                )}
              </div>
            </div>
            )}

          </div>

        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button
            onClick={handleResetShape}
            className="h-9 text-xs bg-gray-800 border border-gray-600 hover:bg-gray-700 text-white font-medium"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset to Defaults
          </Button>
          <Button
            onClick={() => {
              // STABILIZE: Smooth parameters to nearest harmonic values
              // Minimizes visual disruption while cleaning floating-point noise
              // Uses PHI (golden ratio) harmonic snapping for aesthetically pleasing results
              const PHI = 1.618033988749895;

              // Snap to nearest harmonic: 0, 1, PHI, PHI², 5, 10, 15, 30, 45, 60, 90, 180
              const harmonicValues = [0, 1, PHI, PHI*PHI, 5, 10, 15, 30, 45, 60, 90, 120, 180];
              const snapToHarmonic = (val: number): number => {
                if (Math.abs(val) < 0.01) return 0; // Near zero stays zero
                const sign = val < 0 ? -1 : 1;
                const absVal = Math.abs(val);
                // Find nearest harmonic
                let nearest = harmonicValues[0];
                let minDist = Math.abs(absVal - nearest);
                for (const h of harmonicValues) {
                  const dist = Math.abs(absVal - h);
                  if (dist < minDist) {
                    minDist = dist;
                    nearest = h;
                  }
                }
                return sign * nearest;
              };

              // Round to 2 decimals for precision without noise
              const roundPrecise = (val: number) => Math.round(val * 100) / 100;

              const stabilized = {
                ...parameters,
                // Core dimensions: snap to harmonic values (preserve shape intent)
                a: snapToHarmonic(parameters.a || 1),
                b: snapToHarmonic(parameters.b || 1),
                c: snapToHarmonic(parameters.c || 1),
                // D-W: snap to harmonics with clamping
                d: snapToHarmonic(parameters.d || 0),
                e: snapToHarmonic(parameters.e || 0),
                f: snapToHarmonic(parameters.f || 0),
                g: snapToHarmonic(parameters.g || 0),
                h: snapToHarmonic(parameters.h || 0),
                i: snapToHarmonic(parameters.i || 0),
                j: snapToHarmonic(parameters.j || 0),
                k: snapToHarmonic(parameters.k || 0),
                l: snapToHarmonic(parameters.l || 0),
                m: snapToHarmonic(parameters.m || 0),
                n: snapToHarmonic(parameters.n || 0),
                o: snapToHarmonic(parameters.o || 0),
                p: snapToHarmonic(parameters.p || 0),
                q: snapToHarmonic(parameters.q || 0),
                r: snapToHarmonic(parameters.r || 0),
                s: snapToHarmonic(parameters.s || 0),
                t: snapToHarmonic(parameters.t || 0),
                u: snapToHarmonic(parameters.u || 0),
                v: snapToHarmonic(parameters.v || 0),
                w: snapToHarmonic(parameters.w || 0),
                // X-Y-Z: precision rounding for axis offsets
                x: roundPrecise(parameters.x || 1),
                y: roundPrecise(parameters.y || 1),
                z: roundPrecise(parameters.z || 1)
              };
              onParameterChange(stabilized);
              console.log('⚡ Parameters stabilized to nearest harmonic values');
            }}
            className="h-9 text-xs bg-orange-900 border border-orange-600 hover:bg-orange-800 text-orange-200 font-medium"
          >
            <Zap className="w-3 h-3 mr-1" />
            Stabilize
          </Button>
        </div>

        {/* Export Controls Section */}
        <div className="space-y-2">
            <div className="flex items-center gap-1.5 mb-1">
              <Download className="w-3.5 h-3.5 text-purple-400" />
              <Label className="text-xs font-semibold text-purple-400 uppercase tracking-wide">
                Export System
              </Label>
            </div>

            {/* ── GROUP 1: STATIC 3D MODELS ─────────────────────────────── */}
            <div className="space-y-2">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">3D Models</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => handleExportClick('solid')}
                  className="h-10 w-full text-white text-xs font-bold rounded-lg border-2 shadow-lg transition-all bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 border-green-500/40"
                >
                  <Download className="w-3 h-3 mr-1" />
                  🧊 GLB Solid
                </Button>
                <Button
                  onClick={() => handleExportClick('wireframe')}
                  className="h-10 w-full text-white text-xs font-bold rounded-lg border-2 shadow-lg transition-all bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 border-blue-500/40"
                >
                  <Download className="w-3 h-3 mr-1" />
                  🕸️ GLB Wire
                </Button>
                <Button
                  onClick={() => handleExportClick('points')}
                  className="h-10 w-full text-white text-xs font-bold rounded-lg border-2 shadow-lg transition-all bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 border-purple-500/40"
                >
                  <Download className="w-3 h-3 mr-1" />
                  ✨ GLB Points
                </Button>
                <Button
                  onClick={() => handleExportClick('ply-points')}
                  className="h-10 w-full text-white text-xs font-bold rounded-lg border-2 shadow-lg transition-all bg-gradient-to-br from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600 border-amber-500/40"
                >
                  <Download className="w-3 h-3 mr-1" />
                  ☁️ PLY Cloud
                </Button>
              </div>
              {/* Solid + Wireframe combined export */}
              <Button
                onClick={() => handleExportClick('solid-wire')}
                className="h-11 w-full text-white text-xs font-bold rounded-lg border-2 shadow-lg transition-all bg-gradient-to-r from-green-700 via-teal-600 to-blue-700 hover:from-green-600 hover:via-teal-500 hover:to-blue-600 border-teal-400/50 shadow-teal-500/20"
              >
                <Download className="w-3 h-3 mr-1.5" />
                🧊🕸️ GLB Solid + Wire — bakes the grid lines into the model
              </Button>
              <p className="text-[10px] text-teal-300/70 leading-tight">
                Exports the filled surface AND the edge grid together — exactly what you see in Wireframe mode.
              </p>
            </div>

            {/* ── MANIFOLDS RESEARCH REPORT ─────────────────────────────── */}
            <div className="space-y-1 mt-1 pt-2 border-t border-gray-700/40">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Research Documentation</p>
              <Button
                onClick={handleManifoldsReport}
                className="h-10 w-full text-white text-xs font-bold rounded-lg border-2 shadow-lg transition-all bg-gradient-to-r from-indigo-800 to-violet-800 hover:from-indigo-700 hover:to-violet-700 border-violet-500/40"
              >
                📄 3D Manifolds Support Report
              </Button>
              <p className="text-[10px] text-violet-300/60 leading-tight">
                Due-diligence doc — how the engine covers topology, minimal surfaces, non-Euclidean geometry, 4D projections &amp; more.
              </p>
            </div>

            {/* ── GROUP 2: ANIMATED EXPORT ──────────────────────────────── */}
            <div className="space-y-2 mt-3">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Animated Export</p>
              <p className="text-[10px] text-fuchsia-300/70">Start Breathe animation first to capture motion</p>
              <Button
                onClick={() => handleAnimationExportClick('physics-anim')}
                className="h-14 w-full text-white text-sm font-bold rounded-xl border-2 shadow-xl transition-all bg-gradient-to-br from-fuchsia-600 via-purple-600 to-indigo-600 hover:from-fuchsia-500 hover:via-purple-500 hover:to-indigo-500 border-fuchsia-400/60 shadow-purple-500/30 animate-pulse"
              >
                <Download className="w-4 h-4 mr-2" />
                🎬 Animated GLB (Physics + Parametric)
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => handleAnimationExportClick('transform-anim')}
                  className="h-10 w-full text-white text-xs font-bold rounded-lg border-2 shadow-lg transition-all bg-gradient-to-br from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 border-indigo-500/40"
                >
                  <Download className="w-3 h-3 mr-1" />
                  🔄 Transform Anim
                </Button>
                <Button
                  onClick={() => handleHolographicExport()}
                  className="h-10 w-full text-white text-xs font-bold rounded-lg border-2 shadow-lg transition-all bg-gradient-to-br from-cyan-500 via-purple-600 to-pink-500 hover:from-cyan-400 hover:via-purple-500 hover:to-pink-400 border-cyan-400/60 shadow-cyan-500/30"
                >
                  <Download className="w-3 h-3 mr-1" />
                  🌌 Holographic
                </Button>
              </div>
            </div>

            {/* ── GROUP 3: PLATFORM EXPORT ──────────────────────────────── */}
            <div className="space-y-2 mt-3">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Platform Export</p>
              <p className="text-[10px] text-gray-400/70">Sketchfab requires an API key in Settings</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => handleAnimationExportClick('sketchfab')}
                  className="h-10 w-full text-white text-xs font-bold rounded-lg border-2 shadow-lg transition-all bg-gradient-to-br from-cyan-600 to-teal-700 hover:from-cyan-500 hover:to-teal-600 border-cyan-500/40"
                >
                  <Download className="w-3 h-3 mr-1" />
                  🎬 Sketchfab ↗
                </Button>
                <Button
                  onClick={() => handleARVRExport()}
                  className="h-10 w-full text-white text-xs font-bold rounded-lg border-2 shadow-lg transition-all bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-500 hover:from-emerald-400 hover:via-teal-500 hover:to-cyan-400 border-emerald-400/60 shadow-emerald-500/30"
                >
                  <Download className="w-3 h-3 mr-1" />
                  📱 AR/VR
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  onClick={() => handleGridSceneExport()}
                  className="h-10 w-full text-white text-xs font-bold rounded-lg border-2 shadow-lg transition-all bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:via-purple-500 hover:to-indigo-500 border-violet-400/60 shadow-violet-500/30"
                  title="Export model + spacetime grid together as animated GLB"
                >
                  <Download className="w-3 h-3 mr-1" />
                  🌐 Export Scene (Grid + Model)
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  disabled
                  title="Coming soon — Neural Radiance Field export"
                  className="h-10 w-full text-xs font-bold rounded-lg border-2 shadow-lg transition-all bg-gray-700/50 border-gray-600/40 text-gray-500 cursor-not-allowed"
                >
                  🧠 NeRF (Soon)
                </Button>
                <Button
                  onClick={() => handleNFTMint()}
                  className="h-10 w-full text-white text-xs font-bold rounded-lg border-2 shadow-lg transition-all bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-400 hover:via-amber-400 hover:to-yellow-400 border-orange-400/60 shadow-orange-500/30"
                >
                  <Download className="w-3 h-3 mr-1" />
                  🎨 Mint NFT
                </Button>
              </div>
            </div>
        </div>

        {/* Media Export Panel - Screenshots and Video Recording */}
        <MediaExportPanel shapeName={parameters.type} />

        </TabsContent>

        <TabsContent value="energy" className="space-y-4">
          {isAdmin ? (
            <EnergyStoragePanel />
          ) : (
            <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4 text-center">
              <ShieldAlert className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <p className="text-amber-300 font-medium">Admin Access Required</p>
              <p className="text-amber-200/70 text-sm mt-1">
                Energy management is restricted to administrators.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="nerf" className="space-y-4">
          <div className="h-[500px] -m-5 rounded-lg overflow-hidden border border-cyan-500/30">
            <NerfStudio />
          </div>
        </TabsContent>

        <TabsContent value="wiregenesis" className="space-y-4 mt-0">
          <WireGenesisPanel
            onMeshGenerated={(output) => {
              console.log('🎯 WireGenesis mesh generated:', output);
              // Mesh will be displayed automatically via Parameter Authority sync
            }}
            onParameterChange={(params) => {
              console.log('⚡ WireGenesis parameters updated:', params);
              // Parameters automatically synced to Parameter Authority
            }}
          />
        </TabsContent>

        <TabsContent value="sharing" className="space-y-4 mt-0">
          <div className="space-y-4">
            {/* Export Functions */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-cyan-300">Export Options</Label>
                <Badge variant="outline" className="text-xs">3D Files</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => handleExportClick('solid')}
                  variant="outline"
                  size="sm"
                  className="text-xs hover:bg-green-900/30 hover:border-green-500"
                >
                  <Lock className="w-3 h-3 mr-1" />
                  GLB Export
                </Button>
                <Button
                  onClick={() => {
                    setPendingExportType('solid');
                    setPendingGeometryStyle('ultra-hd');
                    setTimeout(() => handlePasswordSuccess(), 0);
                  }}
                  variant="outline"
                  size="sm"
                  className="text-xs hover:bg-purple-900/30 hover:border-purple-500"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Ultra-HD
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => handleExportClick('wireframe')}
                  variant="outline"
                  size="sm"
                  className="text-xs hover:bg-blue-900/30 hover:border-blue-500"
                >
                  <Lock className="w-3 h-3 mr-1" />
                  Wireframe
                </Button>
                <Button
                  onClick={() => handleExportClick('points')}
                  variant="outline"
                  size="sm"
                  className="text-xs hover:bg-orange-900/30 hover:border-orange-500"
                >
                  <Lock className="w-3 h-3 mr-1" />
                  Full ZIP
                </Button>
              </div>
              <div className="text-xs text-purple-300/70 bg-purple-900/20 p-2 rounded border border-purple-500/30 flex items-center gap-2">
                <Download className="w-3 h-3" />
                Export your mathematical shape in multiple formats
              </div>
            </div>

            <Separator />

            {/* Scale Presets */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-indigo-300">Scale Dynamics</Label>
                <Badge variant="outline" className="text-xs">Cosmic</Badge>
              </div>
              <ScalePresetPanel
                currentPreset="meso"
                shapeType={parameters.type}
                onPresetChange={() => {}}
              />
            </div>

            <Separator />

            {/* GitHub Push Status */}
            <GitHubPushStatus />
          </div>
        </TabsContent>
      </Tabs>

      {/* NASA OSDR Study Panel - Shows for Space Biology shapes */}
      {isSpaceBiologyShape(parameters.type || '') && (
        <div className="mt-4">
          <OsdrStudyPanel
            shapeName={parameters.type || ''}
            currentParams={parameters as unknown as Record<string, number>}
          />
        </div>
      )}

      <SaveShapeModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        currentParameters={parameters}
        currentShapeType={parameters.type}
      />

      <AnimationExportModal
        isOpen={showAnimationModal}
        onClose={() => {
          setShowAnimationModal(false);
          setPendingAnimationType(null);
        }}
        onConfirm={handleAnimationStyleSelect}
        animationType={pendingAnimationType || 'sketchfab'}
      />

      <NFTMintingModal
        isOpen={showNFTModal}
        onClose={() => setShowNFTModal(false)}
        shapeId={parameters.type || 'sphere'}
        shapeName={parameters.type ? formatShapeName(parameters.type) : 'Mathematical Shape'}
        parameters={parameters as unknown as Record<string, number>}
      />
    </div>
  );
}
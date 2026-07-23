import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SurfaceParameters, VisualizationMode } from "../types/math";
import { selectOptimalMesh, calculateSegmentCount } from "../lib/meshOptimizer";
import { useAdaptiveCamera } from "../hooks/useAdaptiveCamera";
import * as DiamondGeometry from "../lib/diamondGeometry";
import { COMPREHENSIVE_SHAPE_LIBRARY } from '../lib/shapeRegistryIntegration';

// PERMANENT COLORS FOR AZTEC FIVE SUNS - CANNOT BE CHANGED
const LOCKED_SHAPE_COLORS: Record<string, string> = {
  'nahui_ocelotl': '#8B4513',    // Jaguar/Earth Sun - Ochre/Brown
  'nahui_ehecatl': '#40E0D0',    // Wind Sun - Turquoise/Cyan
  'nahui_quiahuitl': '#DC143C',  // Fire Sun - Crimson
  'nahui_atl': '#00A86B',        // Water Sun - Jade Green
  'nahui_ollin': '#FFBF00',      // Movement Sun - Amber/Gold
};

interface WorkingParametricSurfaceProps {
  parameters: SurfaceParameters;
  visualMode: VisualizationMode;
  colorMode: string;
}

export default function WorkingParametricSurface({ parameters, visualMode, colorMode }: WorkingParametricSurfaceProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const optimalMesh = useMemo(() => selectOptimalMesh(parameters.type), [parameters.type]);

  // Adaptive camera that adjusts zoom based on object size
  useAdaptiveCamera(meshRef);

  // Disable frustum culling to prevent objects from disappearing during rotation
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.frustumCulled = false;
    }
  }, []);

  const geometry = useMemo(() => {
    const { type, a, b, c, d } = parameters;

    const { uSegments, vSegments } = calculateSegmentCount(
      optimalMesh.meshType,
      optimalMesh.tessellationDensity
    );

    console.log(`🔷 Optimal mesh for ${type}:`, {
      meshType: optimalMesh.meshType,
      density: optimalMesh.tessellationDensity,
      segments: { uSegments, vSegments },
      reason: optimalMesh.reason
    });

    // CRITICAL: Sanitize parameters to prevent morphing from invalid values
    // Ensure all size parameters are positive and within reasonable bounds

    // Create proper solid geometries based on shape type
    switch (type) {
      case 'cube':
        // Perfect equal-sided cube using parameter a for uniform scaling
        const cubeSize = Math.max(0.1, Math.abs(a)); // Ensure positive size
        return new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize, 8, 8, 8);

      case 'sphere':
        const sphereRadius = Math.max(0.1, Math.abs(a));
        return new THREE.SphereGeometry(sphereRadius, uSegments, vSegments);

      case 'tetrahedron':
        const tetraRadius = Math.max(0.1, Math.abs(a));
        return new THREE.TetrahedronGeometry(tetraRadius);

      case 'square':
        // 2D square using PlaneGeometry
        const squareSize = Math.max(0.1, Math.abs(a));
        return new THREE.PlaneGeometry(squareSize, squareSize, 8, 8);

      case 'triangular_prism':
        const triPrismRadius = Math.max(0.1, Math.abs(a));
        const triPrismHeight = Math.max(0.1, Math.abs(b));
        return new THREE.CylinderGeometry(triPrismRadius, triPrismRadius, triPrismHeight, 3);

      case 'square_prism':
        // Rectangular prism with different dimensions
        const prismA = Math.max(0.1, Math.abs(a));
        const prismB = Math.max(0.1, Math.abs(b));
        const prismC = Math.max(0.1, Math.abs(c));
        return new THREE.BoxGeometry(prismA, prismB, prismC, 8, 8, 8);

      case 'pentagonal_prism':
        const pentaRadius = Math.max(0.1, Math.abs(a));
        const pentaHeight = Math.max(0.1, Math.abs(b));
        return new THREE.CylinderGeometry(pentaRadius, pentaRadius, pentaHeight, 5);

      case 'hexagonal_prism':
        const hexaRadius = Math.max(0.1, Math.abs(a));
        const hexaHeight = Math.max(0.1, Math.abs(b));
        return new THREE.CylinderGeometry(hexaRadius, hexaRadius, hexaHeight, 6);

      case 'triangular_pyramid':
        const triPyramidRadius = Math.max(0.1, Math.abs(a));
        const triPyramidHeight = Math.max(0.1, Math.abs(b));
        return new THREE.ConeGeometry(triPyramidRadius, triPyramidHeight, 3);

      case 'square_pyramid':
        const squarePyramidRadius = Math.max(0.1, Math.abs(a));
        const squarePyramidHeight = Math.max(0.1, Math.abs(b));
        return new THREE.ConeGeometry(squarePyramidRadius, squarePyramidHeight, 4);

      case 'pentagonal_pyramid':
        const pentaPyramidRadius = Math.max(0.1, Math.abs(a));
        const pentaPyramidHeight = Math.max(0.1, Math.abs(b));
        return new THREE.ConeGeometry(pentaPyramidRadius, pentaPyramidHeight, 5);

      case 'hexagonal_pyramid':
        const hexaPyramidRadius = Math.max(0.1, Math.abs(a));
        const hexaPyramidHeight = Math.max(0.1, Math.abs(b));
        return new THREE.ConeGeometry(hexaPyramidRadius, hexaPyramidHeight, 6);

      case 'octagonal_pyramid':
        const octaPyramidRadius = Math.max(0.1, Math.abs(a));
        const octaPyramidHeight = Math.max(0.1, Math.abs(b));
        return new THREE.ConeGeometry(octaPyramidRadius, octaPyramidHeight, 8);

      case 'octagonal_prism':
        const octaRadius = Math.max(0.1, Math.abs(a));
        const octaHeight = Math.max(0.1, Math.abs(b));
        return new THREE.CylinderGeometry(octaRadius, octaRadius, octaHeight, 8);

      case 'dodecagonal_prism':
        const dodecaRadius = Math.max(0.1, Math.abs(a));
        const dodecaHeight = Math.max(0.1, Math.abs(b));
        return new THREE.CylinderGeometry(dodecaRadius, dodecaRadius, dodecaHeight, 12);

      case 'icosahedron':
        return new THREE.IcosahedronGeometry(a);

      case 'dodecahedron':
        return new THREE.DodecahedronGeometry(a);

      case 'octahedron':
        return new THREE.OctahedronGeometry(a);

      // Diamond Cuts - Professional Gemstone Faceting Geometries
      case 'diamond_round_brilliant':
        return DiamondGeometry.generateRoundBrilliant({
          diameter: Math.max(0.5, Math.abs(a)),
          crownHeight: parameters.b || 0.16,
          pavilionDepth: parameters.c || 0.43
        });

      case 'diamond_princess':
        return DiamondGeometry.generatePrincessCut({
          diameter: Math.max(0.5, Math.abs(a)),
          crownHeight: parameters.b || 0.14,
          pavilionDepth: parameters.c || 0.45
        });

      case 'diamond_emerald':
        return DiamondGeometry.generateEmeraldCut({
          diameter: Math.max(0.5, Math.abs(a)),
          crownHeight: parameters.b || 0.12,
          pavilionDepth: parameters.c || 0.42
        });

      case 'diamond_oval':
        return DiamondGeometry.generateOvalCut({
          diameter: Math.max(0.5, Math.abs(a)),
          crownHeight: parameters.b || 0.16,
          pavilionDepth: parameters.c || 0.43
        });

      case 'diamond_marquise':
        return DiamondGeometry.generateMarquiseCut({
          diameter: Math.max(0.5, Math.abs(a)),
          crownHeight: parameters.b || 0.15,
          pavilionDepth: parameters.c || 0.42
        });

      case 'diamond_pear':
        return DiamondGeometry.generatePearCut({
          diameter: Math.max(0.5, Math.abs(a)),
          crownHeight: parameters.b || 0.15,
          pavilionDepth: parameters.c || 0.42
        });

      case 'diamond_heart':
        return DiamondGeometry.generateHeartCut({
          diameter: Math.max(0.5, Math.abs(a)),
          crownHeight: parameters.b || 0.14,
          pavilionDepth: parameters.c || 0.40
        });

      case 'diamond_asscher':
        return DiamondGeometry.generateAsscherCut({
          diameter: Math.max(0.5, Math.abs(a)),
          crownHeight: parameters.b || 0.12,
          pavilionDepth: parameters.c || 0.42
        });

      default:
        // Use the comprehensive library for geometry generation
        const shapeDefinition = COMPREHENSIVE_SHAPE_LIBRARY[parameters.type];
        if (shapeDefinition) {
          return shapeDefinition({ uSegments, vSegments, parameters });
        }
        // Fallback to a default geometry if type is not found
        console.warn(`Shape type "${type}" not found in comprehensive library. Falling back to BoxGeometry.`);
        return new THREE.BoxGeometry(a * 2, b * 2, c * 2);
    }
  }, [parameters.type, parameters.a, parameters.b, parameters.c, parameters.d, uSegments, vSegments, optimalMesh.meshType, optimalMesh.tessellationDensity, parameters]);

  const material = useMemo(() => {
    const getColor = () => {
      // LOCKEDCOLORS: Aztec Suns always use their mythological colors
      const lockedColor = LOCKED_SHAPE_COLORS[parameters.type];
      if (lockedColor) {
        return lockedColor;
      }

      // Regular color modes for all other shapes - FIXED to match names
      switch (colorMode) {
        case 'neon_green': return '#00ff00';     // Bright neon green
        case 'neon_blue': return '#00ffff';      // Bright cyan/neon blue (was wrong: #0080ff)
        case 'neon_pink': return '#ff00ff';      // Bright magenta/neon pink (was wrong: #ff0080)
        case 'plasma': return '#8b00ff';         // Deep purple (plasma color, was wrong: #ff4080)
        case 'rainbow': return '#ff0080';        // Use magenta as base (rainbow is animated in ParametricSurface)
        case 'pure_white': return '#ffffff';
        case 'pure_black': return '#000000';
        default: return '#00ff00';
      }
    };

    const color = getColor();

    if (visualMode === 'wireframe') {
      return new THREE.MeshBasicMaterial({
        color,
        wireframe: true,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
      });
    } else {
      // Use MeshBasicMaterial for solid mode to prevent lighting-based color shifts
      // This keeps colors uniform regardless of geometry changes
      return new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
      });
    }
  }, [visualMode, colorMode, parameters.type]);

  // No default animation - objects stay in place for user control

  return (
    <mesh ref={meshRef} geometry={geometry} material={material} />
  );
}
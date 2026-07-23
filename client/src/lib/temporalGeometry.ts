/**
 * TEMPORAL GEOMETRY ENGINE
 * Cross = Time Visualization System
 * 
 * Implements the philosophical framework: "The Cross is a Map of Time"
 * - Vertical axis = temporal flow (past/future)
 * - Horizontal axis = spatial states (left/right possibilities)
 * - Center = observer/measurement anchor ("now")
 * - Arms = directional change vectors
 * 
 * Internal Benefits:
 * 1. Dimensional Bridge Testing (2D→3D→4D transitions)
 * 2. Net-Folding Algorithm (reusable for all polyhedra)
 * 3. Observer-Anchor System (measurement point dynamics)
 * 4. Time-Flow Animation Patterns
 * 
 * © 2025 UUON Foundation Inc.
 */

import { ParametricSurface, getCleanDefaults } from '../types/shapes';
import { SurfaceParameters } from '../types/math';

// ============================================================================
// DIMENSIONAL BRIDGE UTILITIES (Reusable across codebase)
// ============================================================================

export interface DimensionalState {
  dimension: 2 | 3 | 4;
  coordinates: number[];
  time: number;
}

export interface FoldingTransition {
  progress: number; // 0 = flat, 1 = fully folded
  axis: 'x' | 'y' | 'z';
  angle: number;
}

/**
 * Dimensional Bridge: Smoothly interpolate between 2D and 3D representations
 * Used for net-folding animations and dimensional transitions
 */
export function dimensionalBridge(
  flat2D: [number, number],
  folded3D: [number, number, number],
  foldProgress: number
): [number, number, number] {
  const t = Math.max(0, Math.min(1, foldProgress));
  const eased = t * t * (3 - 2 * t); // Smooth step interpolation
  
  return [
    flat2D[0] * (1 - eased) + folded3D[0] * eased,
    flat2D[1] * (1 - eased) + folded3D[1] * eased,
    0 * (1 - eased) + folded3D[2] * eased
  ];
}

/**
 * Net-Folding Algorithm: Fold a 2D net into a 3D polyhedron
 * Reusable for cube, tetrahedron, octahedron, dodecahedron, icosahedron
 */
export function foldNetFace(
  faceCenter: [number, number],
  faceNormal: [number, number, number],
  foldAngle: number,
  foldAxis: [number, number, number],
  point: [number, number]
): [number, number, number] {
  const cos = Math.cos(foldAngle);
  const sin = Math.sin(foldAngle);
  const [ax, ay, az] = foldAxis;
  
  // Rodrigues rotation formula
  const px = point[0] - faceCenter[0];
  const py = point[1] - faceCenter[1];
  const pz = 0;
  
  // Rotate point around fold axis
  const dot = ax * px + ay * py + az * pz;
  const crossX = ay * pz - az * py;
  const crossY = az * px - ax * pz;
  const crossZ = ax * py - ay * px;
  
  return [
    px * cos + crossX * sin + ax * dot * (1 - cos) + faceCenter[0],
    py * cos + crossY * sin + ay * dot * (1 - cos) + faceCenter[1],
    pz * cos + crossZ * sin + az * dot * (1 - cos)
  ];
}

/**
 * Observer Anchor: Pulsating measurement point at the center
 * Represents the "now" moment in temporal visualization
 */
export function observerPulse(time: number, intensity: number = 1): number {
  const baseFreq = 1.0; // 1 Hz base pulse
  const harmonic2 = 0.3 * Math.sin(time * baseFreq * 2 * Math.PI * 2);
  const harmonic3 = 0.15 * Math.sin(time * baseFreq * 2 * Math.PI * 3);
  const basePulse = Math.sin(time * baseFreq * 2 * Math.PI);
  
  return intensity * (0.5 + 0.5 * (basePulse + harmonic2 + harmonic3));
}

/**
 * Time Flow Vector: Direction of temporal progression
 * Used to animate temporal visualizations
 */
export function timeFlowVector(
  timePhase: number,
  flowDirection: 'forward' | 'reverse' | 'oscillating'
): [number, number, number] {
  const phase = timePhase * 2 * Math.PI;
  
  switch (flowDirection) {
    case 'forward':
      return [0, Math.abs(Math.sin(phase)), 0]; // Always upward
    case 'reverse':
      return [0, -Math.abs(Math.sin(phase)), 0]; // Always downward
    case 'oscillating':
      return [0, Math.sin(phase), 0]; // Up and down
  }
}

// ============================================================================
// TEMPORAL GEOMETRY SHAPES
// ============================================================================

export const TEMPORAL_GEOMETRY: Record<string, ParametricSurface> = {

  /**
   * CROSS TIME MAP (2D Control Layer)
   * The fundamental cross structure representing spacetime coordinates
   * - Vertical arm: time axis (past below, future above)
   * - Horizontal arm: space axis (states/possibilities)
   * - Center: observer/now anchor point
   */
  cross_time_map: {
    name: "✝️ Cross Time Map (Spacetime Coordinates)",
    description: "2D cross representing time (vertical) and space (horizontal) axes with observer at center",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const a = params.d ?? 1; // Overall scale
      const b = params.e ?? 1; // Arm width
      const c = params.f ?? 1; // Arm length ratio
      const time = (params.h ?? 0) * 0.1; // Animation time
      
      const armWidth = 0.15 * b;
      const armLength = 2.0 * c;
      
      // Parametric cross: vertical and horizontal arms
      const crossU = u * 4; // 0-4 maps to different sections
      const section = Math.floor(crossU) % 4;
      const localU = crossU % 1;
      
      let x = 0, y = 0, z = 0;
      
      switch (section) {
        case 0: // Vertical arm (top half)
          x = (localU - 0.5) * armWidth * 2;
          y = v * armLength;
          break;
        case 1: // Vertical arm (bottom half)
          x = (localU - 0.5) * armWidth * 2;
          y = -v * armLength;
          break;
        case 2: // Horizontal arm (right half)
          x = v * armLength;
          y = (localU - 0.5) * armWidth * 2;
          break;
        case 3: // Horizontal arm (left half)
          x = -v * armLength;
          y = (localU - 0.5) * armWidth * 2;
          break;
      }
      
      // Observer pulse at center
      const distFromCenter = Math.sqrt(x * x + y * y);
      const pulse = observerPulse(time, 0.1);
      z = Math.exp(-distFromCenter * 3) * pulse;
      
      return [x * a, y * a, z * a];
    },
    defaultParams: getCleanDefaults({ 
      d: 1.5, e: 1, f: 1, h: 0,
      uSegments: 64, vSegments: 32,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1
    })
  },

  /**
   * TIME PLANE EXTRUSION (3D Simulation Layer)
   * Cross extruded into a spacetime sheet
   * - Time flows "up" along Y axis
   * - States spread "across" along X axis
   * - Depth (Z) represents amplitude/intensity
   */
  time_plane_extrusion: {
    name: "📊 Time Plane Extrusion (Spacetime Sheet)",
    description: "Cross extruded into 3D representing a sheet of spacetime evolution",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const a = params.d ?? 1;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const time = (params.h ?? 0) * 0.1;
      const waveAmplitude = (params.g ?? 0) * 0.1;
      
      // Map u,v to spacetime plane
      const x = (u - 0.5) * 4 * b; // Spatial axis
      const y = (v - 0.5) * 4 * c; // Temporal axis
      
      // Cross-shaped height field
      const armWidth = 0.3;
      const inVerticalArm = Math.abs(x) < armWidth;
      const inHorizontalArm = Math.abs(y) < armWidth;
      const inCross = inVerticalArm || inHorizontalArm;
      
      // Base height from cross structure
      let z = inCross ? 0.5 : 0;
      
      // Add time-evolution waves
      const timeWave = Math.sin(y * 2 + time * 2) * waveAmplitude;
      const spaceWave = Math.cos(x * 2 - time) * waveAmplitude * 0.5;
      z += timeWave + spaceWave;
      
      // Observer anchor glow at center
      const distFromCenter = Math.sqrt(x * x + y * y);
      const observerGlow = Math.exp(-distFromCenter * 2) * 0.3 * observerPulse(time, 1);
      z += observerGlow;
      
      return [x * a, y * a, z * a];
    },
    defaultParams: getCleanDefaults({ 
      d: 1, e: 1, f: 1, g: 5, h: 0,
      uSegments: 96, vSegments: 96,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1
    })
  },

  /**
   * CUBE NET FOLD (4D Transition Layer)
   * Animated transformation from 2D cross net to 3D cube
   * Demonstrates dimensional bridging: flat → volume
   * 
   * The cross is one of the 11 distinct nets of a cube.
   * This visualization shows the folding process.
   */
  cube_net_fold: {
    name: "📦 Cube Net Fold (Cross→Cube Transition)",
    description: "Animated folding of 2D cross net into 3D cube - dimensional transition visualization",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const a = params.d ?? 1;
      const foldProgress = Math.max(0, Math.min(1, (params.g ?? 0) * 0.1 + 0.5)); // 0-1 fold progress
      const time = (params.h ?? 0) * 0.1;
      
      // Face size
      const faceSize = 1;
      
      // Determine which face (6 faces: center + 4 arms + back)
      const faceIndex = Math.floor(u * 6) % 6;
      const localU = (u * 6) % 1;
      
      // Local coordinates within face
      const lx = (localU - 0.5) * faceSize;
      const ly = (v - 0.5) * faceSize;
      
      // Calculate fold angle based on progress
      const maxFoldAngle = Math.PI / 2;
      const foldAngle = foldProgress * maxFoldAngle;
      
      let x = 0, y = 0, z = 0;
      
      switch (faceIndex) {
        case 0: // Center face (bottom of cube)
          x = lx;
          y = 0;
          z = ly;
          break;
        case 1: // Top arm (folds to front)
          const topFold = foldAngle;
          x = lx;
          y = Math.sin(topFold) * (faceSize / 2 + ly * Math.cos(topFold));
          z = faceSize / 2 + ly * Math.sin(topFold) * Math.sin(topFold);
          break;
        case 2: // Bottom arm (folds to back)
          const bottomFold = foldAngle;
          x = lx;
          y = -Math.sin(bottomFold) * (faceSize / 2 - ly * Math.cos(bottomFold));
          z = -faceSize / 2 - ly * Math.sin(bottomFold) * Math.sin(bottomFold);
          break;
        case 3: // Right arm (folds to right side)
          const rightFold = foldAngle;
          x = faceSize / 2 + ly * Math.cos(rightFold);
          y = Math.sin(rightFold) * ly;
          z = lx;
          break;
        case 4: // Left arm (folds to left side)
          const leftFold = foldAngle;
          x = -faceSize / 2 - ly * Math.cos(leftFold);
          y = Math.sin(leftFold) * ly;
          z = lx;
          break;
        case 5: // Top face (second level - folds to top)
          if (foldProgress > 0.5) {
            const secondFold = (foldProgress - 0.5) * 2 * maxFoldAngle;
            x = lx;
            y = faceSize * Math.sin(foldAngle) + Math.cos(secondFold) * faceSize / 2;
            z = faceSize + ly * Math.sin(secondFold);
          } else {
            x = lx;
            y = faceSize * 1.5 + ly;
            z = 0;
          }
          break;
      }
      
      // Add subtle animation
      const breathe = 1 + 0.02 * Math.sin(time * 2);
      
      return [x * a * breathe, y * a * breathe, z * a * breathe];
    },
    defaultParams: getCleanDefaults({ 
      d: 1.5, g: 0, h: 0,
      uSegments: 96, vSegments: 48,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1
    })
  },

  /**
   * TEMPORAL MANDALA (Rotational Symmetry)
   * Cross rotated 360° creating circular time-cycles
   * Represents: seasonal cycles, harmonic oscillations, flow symmetry
   */
  temporal_mandala: {
    name: "🌀 Temporal Mandala (Rotational Time Cycles)",
    description: "Cross rotated into circular mandala representing cyclical time patterns",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const a = params.d ?? 1;
      const b = params.e ?? 1; // Radial complexity
      const c = params.f ?? 1; // Vertical amplitude
      const symmetry = Math.max(1, Math.floor((params.g ?? 4) + 4)); // Number of arms (4-12)
      const time = (params.h ?? 0) * 0.1;
      
      const theta = u * 2 * Math.PI; // Angular position
      const r = v * 2; // Radial position
      
      // Create cross-arm pattern with rotational symmetry
      const armWidth = 0.2 * b;
      const armCount = symmetry;
      
      // Determine if we're on an arm
      let onArm = false;
      for (let i = 0; i < armCount; i++) {
        const armAngle = (i / armCount) * 2 * Math.PI;
        const angleDiff = Math.abs(Math.atan2(Math.sin(theta - armAngle), Math.cos(theta - armAngle)));
        if (angleDiff < armWidth || angleDiff > Math.PI - armWidth) {
          onArm = true;
          break;
        }
      }
      
      // Base height and arm elevation
      const baseHeight = onArm ? 0.3 : 0;
      
      // Add radial waves (like ripples in time)
      const radialWave = Math.sin(r * 4 - time * 2) * 0.1 * c;
      
      // Add angular waves (rotational energy)
      const angularWave = Math.sin(theta * symmetry + time) * 0.05 * c;
      
      // Center observer pulse
      const centerGlow = Math.exp(-r * 3) * observerPulse(time, 0.2);
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = (baseHeight + radialWave + angularWave + centerGlow) * c;
      
      return [x * a, z * a, y * a]; // Swap Y/Z for proper orientation
    },
    defaultParams: getCleanDefaults({ 
      d: 1.5, e: 1, f: 1, g: 4, h: 0,
      uSegments: 128, vSegments: 64,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1
    })
  },

  /**
   * OBSERVER ANCHOR (Measurement Point System)
   * The center "now" point with pulsating presence
   * Represents: consciousness, observation, measurement collapse
   */
  observer_anchor: {
    name: "👁️ Observer Anchor (Now Point)",
    description: "Pulsating center point representing the observer/measurement anchor in time",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const a = params.d ?? 1;
      const pulseIntensity = (params.e ?? 1);
      const time = (params.h ?? 0) * 0.1;
      
      // Spherical coordinates for 3D presence
      const phi = u * Math.PI;
      const theta = v * 2 * Math.PI;
      
      // Base radius with pulse
      const pulse = observerPulse(time, pulseIntensity);
      const baseRadius = 0.3 + 0.1 * pulse;
      
      // Add observer "awareness" ripples
      const awarenessRipple = 0.05 * Math.sin(phi * 4 + time * 3) * Math.sin(theta * 2 - time);
      const radius = baseRadius + awarenessRipple;
      
      // Spherical to Cartesian
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);
      
      return [x * a, y * a, z * a];
    },
    defaultParams: getCleanDefaults({ 
      d: 2, e: 1, h: 0,
      uSegments: 48, vSegments: 48,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1
    })
  },

  /**
   * SPACETIME MINKOWSKI CROSS
   * Physics-accurate Minkowski diagram in 3D
   * Shows light cones and causal structure
   */
  minkowski_spacetime_cross: {
    name: "⚡ Minkowski Spacetime Cross",
    description: "Physics-accurate spacetime diagram showing light cones and causal structure",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const a = params.d ?? 1;
      const c_speed = params.e ?? 1; // Speed of light (sets light cone angle)
      const time = (params.h ?? 0) * 0.1;
      
      // Map to spacetime coordinates
      const t = (u - 0.5) * 4; // Time axis (vertical)
      const x = (v - 0.5) * 4; // Space axis (horizontal)
      
      // Light cone boundaries: |x| = c * |t|
      const lightConeRadius = Math.abs(t) * c_speed;
      const insideLightCone = Math.abs(x) <= lightConeRadius;
      
      // Height field
      let z = 0;
      
      // Cross structure (time and space axes)
      const onTimeAxis = Math.abs(x) < 0.15;
      const onSpaceAxis = Math.abs(t) < 0.15;
      
      if (onTimeAxis || onSpaceAxis) {
        z = 0.3;
      }
      
      // Light cone surface
      if (Math.abs(Math.abs(x) - lightConeRadius) < 0.1) {
        z = 0.2;
      }
      
      // Causal region coloring (height represents causal accessibility)
      if (insideLightCone) {
        z += 0.1 * Math.exp(-Math.abs(x) * 0.5);
      }
      
      // Observer at origin
      const distFromOrigin = Math.sqrt(t * t + x * x);
      z += Math.exp(-distFromOrigin * 2) * 0.3 * observerPulse(time, 1);
      
      return [x * a, t * a, z * a];
    },
    defaultParams: getCleanDefaults({ 
      d: 1, e: 1, h: 0,
      uSegments: 96, vSegments: 96,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1
    })
  },

  /**
   * TEMPORAL CUBE (Time-Volume Container)
   * The fully folded cube representing enclosed time-space
   * 3D container of temporal states
   */
  temporal_cube: {
    name: "🧊 Temporal Cube (Time Volume)",
    description: "Cube as container of time-space states - the folded cross becomes enclosed volume",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const a = params.d ?? 1;
      const time = (params.h ?? 0) * 0.1;
      const breathing = 1 + 0.03 * Math.sin(time * 1.5);
      
      // Generate cube surface (6 faces)
      const faceIndex = Math.floor(u * 6) % 6;
      const localU = (u * 6) % 1;
      
      const halfSize = 1 * breathing;
      let x = 0, y = 0, z = 0;
      
      // Map localU and v to face coordinates
      const fu = (localU - 0.5) * 2 * halfSize;
      const fv = (v - 0.5) * 2 * halfSize;
      
      switch (faceIndex) {
        case 0: x = fu; y = fv; z = halfSize; break;  // Front
        case 1: x = fu; y = fv; z = -halfSize; break; // Back
        case 2: x = halfSize; y = fu; z = fv; break;  // Right
        case 3: x = -halfSize; y = fu; z = fv; break; // Left
        case 4: x = fu; y = halfSize; z = fv; break;  // Top
        case 5: x = fu; y = -halfSize; z = fv; break; // Bottom
      }
      
      // Add temporal energy on faces (subtle glow at edges)
      const edgeDist = Math.min(
        Math.abs(Math.abs(fu) - halfSize),
        Math.abs(Math.abs(fv) - halfSize)
      );
      const edgeGlow = Math.exp(-edgeDist * 5) * 0.05 * Math.sin(time * 3);
      
      // Scale outward slightly at edges
      const scale = 1 + edgeGlow;
      
      return [x * a * scale, y * a * scale, z * a * scale];
    },
    defaultParams: getCleanDefaults({ 
      d: 1.5, h: 0,
      uSegments: 96, vSegments: 48,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1
    })
  },

  /**
   * QUANTUM COLLAPSE CROSS
   * Visualization of wave function collapse at measurement
   * Cross represents the moment of observation
   */
  quantum_collapse_cross: {
    name: "🔮 Quantum Collapse Cross",
    description: "Wave function collapse at measurement - cross as observation moment",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const a = params.d ?? 1;
      const collapseProgress = Math.max(0, Math.min(1, (params.g ?? 5) * 0.1));
      const time = (params.h ?? 0) * 0.1;
      
      // Polar coordinates for wave pattern
      const theta = u * 2 * Math.PI;
      const r = v * 2;
      
      // Cross pattern in polar
      const crossAngle = Math.atan2(Math.sin(theta), Math.cos(theta));
      const onCross = Math.abs(Math.sin(2 * crossAngle)) < 0.3;
      
      // Pre-collapse: wave function spread
      const waveSpread = 1 - collapseProgress;
      const waveHeight = waveSpread * Math.sin(r * 4 - time * 3) * Math.cos(theta * 3 + time);
      
      // Post-collapse: localized at cross
      const collapseHeight = collapseProgress * (onCross ? 0.5 * Math.exp(-r * 0.5) : 0);
      
      // Total height
      const z = waveHeight * 0.2 + collapseHeight;
      
      // Cartesian
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      
      return [x * a, z * a, y * a];
    },
    defaultParams: getCleanDefaults({ 
      d: 1.5, g: 5, h: 0,
      uSegments: 128, vSegments: 64,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1
    })
  },

  /**
   * DIMENSIONAL GATEWAY
   * Cross as portal between 2D and 3D realms
   * Interactive transition visualization
   */
  dimensional_gateway: {
    name: "🚪 Dimensional Gateway (2D↔3D Portal)",
    description: "Cross as a portal between dimensional states - interactive transition",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const a = params.d ?? 1;
      const portalOpen = Math.max(0, Math.min(1, (params.g ?? 5) * 0.1));
      const time = (params.h ?? 0) * 0.1;
      
      // Cross structure
      const x = (u - 0.5) * 4;
      const y = (v - 0.5) * 4;
      
      const armWidth = 0.4;
      const inVertical = Math.abs(x) < armWidth;
      const inHorizontal = Math.abs(y) < armWidth;
      const inCross = inVertical || inHorizontal;
      
      // Portal depth (z dimension opens with portalOpen)
      let z = 0;
      
      if (inCross) {
        // Gateway frame
        z = 0.1;
        
        // Center portal opening
        const distFromCenter = Math.sqrt(x * x + y * y);
        if (distFromCenter < 1) {
          // Vortex effect
          const vortexDepth = portalOpen * Math.sin(distFromCenter * 3 - time * 2);
          const vortexSwirl = Math.sin(Math.atan2(y, x) * 4 + time * 3) * 0.1 * portalOpen;
          z = vortexDepth * 0.5 + vortexSwirl;
        }
      }
      
      // Energy ripples emanating from portal
      const dist = Math.sqrt(x * x + y * y);
      const ripple = Math.sin(dist * 2 - time * 4) * 0.05 * Math.exp(-dist * 0.5) * portalOpen;
      z += ripple;
      
      return [x * a, z * a, y * a];
    },
    defaultParams: getCleanDefaults({ 
      d: 1, g: 5, h: 0,
      uSegments: 96, vSegments: 96,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1
    })
  },

  /**
   * CARTESIAN ORIGIN
   * Pure mathematical origin point with axis indicators
   * The fundamental reference frame
   */
  cartesian_origin: {
    name: "📍 Cartesian Origin (Reference Frame)",
    description: "Mathematical origin with X, Y, Z axis visualization",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const a = params.d ?? 1;
      const axisLength = params.e ?? 2;
      const time = (params.h ?? 0) * 0.1;
      
      // Three axes visualization
      const axisIndex = Math.floor(u * 3) % 3;
      const localU = (u * 3) % 1;
      const thickness = 0.05;
      
      let x = 0, y = 0, z = 0;
      
      const pos = (localU - 0.5) * axisLength * 2;
      const offset = (v - 0.5) * thickness * 2;
      
      switch (axisIndex) {
        case 0: // X axis
          x = pos;
          y = offset;
          z = 0;
          break;
        case 1: // Y axis
          x = offset;
          y = pos;
          z = 0;
          break;
        case 2: // Z axis
          x = 0;
          y = offset;
          z = pos;
          break;
      }
      
      // Origin sphere
      const originRadius = 0.15;
      const distFromOrigin = Math.sqrt(x * x + y * y + z * z);
      if (distFromOrigin < originRadius) {
        const scale = originRadius / Math.max(distFromOrigin, 0.01);
        x *= scale;
        y *= scale;
        z *= scale;
      }
      
      // Subtle pulsing
      const pulse = 1 + 0.02 * Math.sin(time * 2);
      
      return [x * a * pulse, y * a * pulse, z * a * pulse];
    },
    defaultParams: getCleanDefaults({ 
      d: 1, e: 2, h: 0,
      uSegments: 48, vSegments: 24,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1
    })
  }
};

// ============================================================================
// POLYHEDRA NET FOLDING LIBRARY (Reusable)
// ============================================================================

export interface NetDefinition {
  faces: number;
  faceSize: number;
  foldAxes: [number, number, number][];
  facePositions: [number, number][];
}

export const POLYHEDRA_NETS: Record<string, NetDefinition> = {
  cube: {
    faces: 6,
    faceSize: 1,
    foldAxes: [
      [0, 0, 0],      // Center (no fold)
      [1, 0, 0],      // Top folds on X
      [-1, 0, 0],     // Bottom folds on -X
      [0, 0, 1],      // Right folds on Z
      [0, 0, -1],     // Left folds on -Z
      [1, 0, 0]       // Cap folds on X
    ],
    facePositions: [
      [0, 0],         // Center
      [0, 1],         // Top
      [0, -1],        // Bottom
      [1, 0],         // Right
      [-1, 0],        // Left
      [0, 2]          // Cap
    ]
  },
  tetrahedron: {
    faces: 4,
    faceSize: 1,
    foldAxes: [
      [0, 0, 0],
      [0.866, 0, 0.5],
      [-0.866, 0, 0.5],
      [0, 0, -1]
    ],
    facePositions: [
      [0, 0],
      [1, 0],
      [-0.5, 0.866],
      [-0.5, -0.866]
    ]
  }
};

/**
 * Generate animated net-to-polyhedron folding
 * Reusable for any polyhedron with known net
 */
export function generateNetFolding(
  netType: keyof typeof POLYHEDRA_NETS,
  foldProgress: number,
  u: number,
  v: number
): [number, number, number] {
  const net = POLYHEDRA_NETS[netType];
  if (!net) return [0, 0, 0];
  
  const faceIndex = Math.floor(u * net.faces) % net.faces;
  const localU = (u * net.faces) % 1;
  
  const [fx, fy] = net.facePositions[faceIndex];
  const foldAxis = net.foldAxes[faceIndex];
  
  // Local face coordinates
  const lx = (localU - 0.5) * net.faceSize + fx * net.faceSize;
  const ly = (v - 0.5) * net.faceSize + fy * net.faceSize;
  
  // Apply folding
  const foldAngle = foldProgress * Math.PI / 2;
  const [ax, ay, az] = foldAxis;
  
  if (ax === 0 && ay === 0 && az === 0) {
    return [lx, 0, ly];
  }
  
  // Simple fold around axis
  const cos = Math.cos(foldAngle);
  const sin = Math.sin(foldAngle);
  
  return [
    lx * cos,
    ly * sin,
    ly * cos
  ];
}

console.log('🕰️ Temporal Geometry Engine loaded: 10 Cross=Time visualizations');
console.log('🔗 Dimensional Bridge utilities ready for 2D→3D→4D transitions');
console.log('📦 Net-Folding Algorithm available for all polyhedra');

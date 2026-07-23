/**
 * ASTROPHYSICAL PHENOMENA - 3D Parametric Visualizations
 * Gravitational fields, black holes, and cosmic structures
 * 
 * Parameter Mapping:
 * - M (mass): Controls gravitational strength and field intensity
 * - Phi (d): Radial distance parameter (spherical coordinates)
 * - Pi (e): Azimuthal angle parameter (circular motion)
 * - Alpha (f): Field strength / Accretion rate
 * - Beta (g): Curvature factor / Temperature
 * - Gamma (h): Particle density / Spin parameter
 * - Delta (i): Animation/time evolution parameter
 */

import { SurfaceParameters } from '../types/math';

export interface ParametricSurface {
  name: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}

export const ASTROPHYSICAL_PHENOMENA: Record<string, ParametricSurface> = {

  // ============================================================================
  // 1. GRAVITY WELL - Spacetime Curvature Visualization
  // ============================================================================
  gravity_well: {
    name: "🌌 Gravity Well - Spacetime Curvature",
    equation: (u, v, params) => {
      const mass = params.d ?? 2;           // Central mass (affects well depth)
      const scale = params.e ?? 10;         // Radial scale
      const phiMultiplier = params.g ?? 1;  // PHI: Radial distance control
      const piMultiplier = params.h ?? 1;   // PI: Angular/circular control
      const fieldStrength = params.i ?? 1;  // ALPHA: Field strength
      const curvature = params.g ?? 1;      // BETA: Curvature factor
      const time = params.i ?? 0;           // DELTA: Time evolution
      
      // Polar coordinates on the plane
      const radius = (u * scale * phiMultiplier) + 0.1; // Avoid singularity at center
      const theta = v * 2 * Math.PI * piMultiplier;
      
      // Gravitational potential: depth ∝ -M/r
      const gravitationalDepth = -(mass * fieldStrength) / (radius + 0.5);
      
      // Add spacetime ripples (gravitational waves)
      const ripples = 0.2 * Math.sin(radius * 2 - time * 2) * Math.exp(-radius * 0.3);
      
      // Apply curvature factor
      const depth = (gravitationalDepth + ripples) * curvature;
      
      // Convert to Cartesian coordinates
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = depth;
      
      return [x, y, z];
    },
    defaultParams: {
      d: 3, e: 8, f: 1, g: 1, h: 1, i: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 48, vSegments: 48
    }
  },

  // ============================================================================
  // 2. EVENT HORIZON - Black Hole Boundary
  // ============================================================================
  event_horizon: {
    name: "⚫ Event Horizon - Black Hole Boundary",
    equation: (u, v, params) => {
      const mass = params.d ?? 2;              // Schwarzschild mass
      const spin = params.h ?? 0.5;            // GAMMA: Spin parameter (0-1)
      const phiRadius = params.g ?? 1;         // PHI: Radial scaling
      const piAngle = params.h ?? 1;           // PI: Angular deformation
      const accretionRate = params.i ?? 0.3;   // ALPHA: Accretion disk intensity
      const temperature = params.g ?? 1;       // BETA: Temperature/glow
      const time = params.i ?? 0;              // DELTA: Time evolution
      
      // Spherical coordinates
      const theta = u * Math.PI * phiRadius;
      const phi = v * 2 * Math.PI * piAngle;
      
      // Schwarzschild radius: r_s = 2GM/c² (normalized to mass)
      const schwarzschildRadius = mass * 2;
      
      // Kerr metric deformation (rotating black hole)
      const kerrDeformation = spin * Math.sin(theta) * Math.cos(phi * 2 + time);
      
      // Ergosphere bulge (frame dragging effect)
      const ergosphere = spin * 0.3 * Math.pow(Math.sin(theta), 2);
      
      // Final radius with Kerr effects
      const radius = schwarzschildRadius * (1 + ergosphere + kerrDeformation * 0.1);
      
      // Photon ring perturbation
      const photonRing = 0.05 * Math.sin(phi * 12) * Math.sin(theta * 8);
      
      // Hawking radiation texture (quantum fluctuations)
      const hawkingRadiation = 0.02 * Math.sin(phi * 30 + time * 5) * 
                               Math.cos(theta * 25 - time * 3) * temperature;
      
      const finalRadius = radius + photonRing + hawkingRadiation;
      
      // Convert to Cartesian
      const x = finalRadius * Math.sin(theta) * Math.cos(phi);
      const y = finalRadius * Math.sin(theta) * Math.sin(phi);
      const z = finalRadius * Math.cos(theta);
      
      return [x, y, z];
    },
    defaultParams: {
      d: 1.5, e: 1, f: 1, g: 1, h: 0.5, i: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 48, vSegments: 48
    }
  },

  // ============================================================================
  // 3. BLACK HOLE ACCRETION DISK
  // ============================================================================
  black_hole_accretion_disk: {
    name: "💿 Accretion Disk - Spiraling Matter",
    equation: (u, v, params) => {
      const innerRadius = params.d ?? 3;     // Inner edge (near event horizon)
      const outerRadius = params.e ?? 8;     // Outer edge
      const thickness = params.f ?? 0.3;     // Disk thickness
      const phiControl = params.g ?? 1;      // PHI: Radial flow control
      const piControl = params.h ?? 1;       // PI: Spiral tightness
      const accretionRate = params.i ?? 1;   // ALPHA: How fast material falls in
      const temperature = params.g ?? 1;     // BETA: Temperature gradient
      const time = params.i ?? 0;            // DELTA: Time/rotation
      
      // Radial position in disk
      const radius = innerRadius + (u * (outerRadius - innerRadius)) * phiControl;
      
      // Angular position with orbital motion
      const orbitalVelocity = Math.sqrt(1 / radius); // Keplerian orbit: v ∝ 1/√r
      const angle = (v * 2 * Math.PI * piControl) + (time * orbitalVelocity * accretionRate);
      
      // Vertical position (disk has finite thickness)
      const heightProfile = (v - 0.5) * thickness * Math.exp(-radius * 0.2);
      
      // Turbulent variations
      const turbulence = 0.1 * Math.sin(radius * 5 + time) * 
                         Math.cos(angle * 8 - time * 2) * temperature;
      
      // Spiral arms in the disk
      const spiralArms = 0.15 * Math.sin(3 * angle - radius * 0.5 + time);
      
      const x = radius * Math.cos(angle) + spiralArms;
      const y = radius * Math.sin(angle) + spiralArms;
      const z = heightProfile + turbulence;
      
      return [x, y, z];
    },
    defaultParams: {
      d: 3, e: 9, f: 0.4, g: 1, h: 1, i: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 48, vSegments: 80
    }
  },

  // ============================================================================
  // 4. NEUTRON STAR
  // ============================================================================
  neutron_star: {
    name: "⭐ Neutron Star - Ultra-Dense Remnant",
    equation: (u, v, params) => {
      const radius = params.d ?? 1;          // Tiny radius (neutron stars are ~10km)
      const oblateness = params.e ?? 0.15;   // Rotation causes flattening
      const phiControl = params.g ?? 1;      // PHI: Latitude control
      const piControl = params.h ?? 1;       // PI: Longitude control
      const magneticField = params.i ?? 1;   // ALPHA: Magnetic field strength
      const rotationSpeed = params.h ?? 1;   // GAMMA: Rotation (pulsars spin fast)
      const time = params.i ?? 0;            // DELTA: Time
      
      // Spherical coordinates
      const theta = u * Math.PI * phiControl;
      const phi = v * 2 * Math.PI * piControl + time * rotationSpeed;
      
      // Oblate spheroid (rotation causes equatorial bulge)
      const polarFactor = 1 - oblateness * Math.pow(Math.sin(theta), 2);
      
      // Magnetic field surface structure (creates visible "mountains")
      const magneticMountains = magneticField * 0.05 * Math.abs(Math.cos(theta * 4)) * 
                                Math.abs(Math.sin(phi * 3));
      
      // Starquake cracks (neutron stars have crystalline crusts)
      const starquakes = 0.02 * Math.sin(theta * 25 + phi * 20);
      
      const finalRadius = radius * polarFactor * (1 + magneticMountains + starquakes);
      
      // Convert to Cartesian
      const x = finalRadius * Math.sin(theta) * Math.cos(phi);
      const y = finalRadius * Math.sin(theta) * Math.sin(phi);
      const z = finalRadius * Math.cos(theta);
      
      return [x, y, z];
    },
    defaultParams: {
      d: 1.2, e: 0.15, f: 1, g: 1, h: 1, i: 0,
      uMin: 0, uMax: 1,
      vMin: 0,
      vMax: 1,
      uSegments: 72,
      vSegments: 36
    }
  },

  // ============================================================================
  // 5. RELATIVISTIC JET
  // ============================================================================
  relativistic_jet: {
    name: "🚀 Relativistic Jet - High-Energy Beam",
    equation: (u, v, params) => {
      const jetLength = params.d ?? 15;       // Jet extends far from source
      const coreRadius = params.e ?? 0.5;     // Jet core width
      const phiControl = params.g ?? 1;       // PHI: Length control
      const piControl = params.h ?? 1;        // PI: Rotation
      const velocity = params.i ?? 0.9;       // ALPHA: Jet velocity (fraction of c)
      const magneticConfinement = params.g ?? 1; // BETA: Magnetic collimation
      const lorentzFactor = params.h ?? 5;    // GAMMA: Relativistic Lorentz factor
      const time = params.i ?? 0;             // DELTA: Time
      
      // Position along jet axis (z-direction)
      const zPos = (u * jetLength - jetLength * 0.5) * phiControl;
      
      // Angular position around jet axis
      const angle = v * 2 * Math.PI * piControl;
      
      // Jet radius increases with distance (conical shape, but magnetically confined)
      const expansion = Math.abs(zPos) * 0.1 / magneticConfinement;
      const jetRadius = coreRadius + expansion;
      
      // Helical magnetic field structure
      const helixAmplitude = jetRadius * 0.3;
      const helixFrequency = 0.5;
      const helixX = helixAmplitude * Math.cos(zPos * helixFrequency + time);
      const helixY = helixAmplitude * Math.sin(zPos * helixFrequency + time);
      
      // Relativistic beaming effect (jet appears brighter when pointed at observer)
      const beaming = 1 + 0.2 * Math.cos(angle * 2 + time);
      
      // Synchrotron knots (bright spots from shock waves)
      const knots = 0.2 * Math.abs(Math.sin(zPos * 1.5 - time * velocity * 3));
      
      const r = jetRadius * (1 + knots) * beaming;
      
      const x = r * Math.cos(angle) + helixX;
      const y = r * Math.sin(angle) + helixY;
      const z = zPos;
      
      return [x, y, z];
    },
    defaultParams: {
      d: 20, e: 0.6, f: 1, g: 1, h: 5, i: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 48, vSegments: 48
    }
  },

  // ============================================================================
  // 6. WORMHOLE THROAT
  // ============================================================================
  wormhole_throat: {
    name: "🌀 Wormhole - Einstein-Rosen Bridge",
    equation: (u, v, params) => {
      const throatRadius = params.d ?? 2;     // Minimum radius at throat
      const length = params.e ?? 6;           // Separation between mouths
      const phiControl = params.g ?? 1;       // PHI: Radial control
      const piControl = params.h ?? 1;        // PI: Angular control
      const exoticMatter = params.i ?? 1;     // ALPHA: Exotic matter density
      const stability = params.g ?? 1;        // BETA: Wormhole stability
      const time = params.i ?? 0;             // DELTA: Time fluctuations
      
      // Position along wormhole axis
      const zPos = (u - 0.5) * length * phiControl;
      
      // Angular position
      const angle = v * 2 * Math.PI * piControl;
      
      // Morris-Thorne metric: throat shape
      // r(z) = sqrt(r_0² + z²) where r_0 is throat radius
      const radialProfile = throatRadius * Math.sqrt(1 + Math.pow(zPos / throatRadius, 2));
      
      // Exotic matter creates negative energy density (quantum fluctuations)
      const quantumFlux = 0.1 * Math.sin(zPos * 5 + time * 2) * 
                          Math.cos(angle * 8 - time * 3) * exoticMatter;
      
      // Hawking radiation destabilizes wormhole
      const hawkingInstability = (1 - stability * 0.5) * 0.15 * 
                                  Math.sin(time * 5) * Math.cos(zPos * 3);
      
      const radius = radialProfile + quantumFlux + hawkingInstability;
      
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const z = zPos;
      
      return [x, y, z];
    },
    defaultParams: {
      d: 2, e: 8, f: 1, g: 1, h: 1, i: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 80, vSegments: 32
    }
  },

  // ============================================================================
  // 7. KERR BLACK HOLE (Rotating)
  // ============================================================================
  kerr_black_hole: {
    name: "🌪️ Kerr Black Hole - Rotating Singularity",
    equation: (u, v, params) => {
      const mass = params.d ?? 2;             // Black hole mass
      const spin = params.h ?? 0.8;           // GAMMA: Spin parameter (0-1)
      const phiControl = params.g ?? 1;       // PHI: Latitude
      const piControl = params.h ?? 1;        // PI: Longitude  
      const frameDragging = params.i ?? 1;    // ALPHA: Frame dragging effect
      const time = params.i ?? 0;             // DELTA: Time
      
      // Spherical coordinates
      const theta = u * Math.PI * phiControl;
      const phi = v * 2 * Math.PI * piControl;
      
      // Kerr metric event horizon radius (depends on spin and angle)
      const a_spin = spin * mass; // Angular momentum parameter
      const delta = Math.pow(mass, 2) - Math.pow(a_spin, 2);
      
      // Horizon radius varies with latitude (axisymmetric)
      const r_plus = mass + Math.sqrt(delta); // Outer horizon
      
      // Ergosphere (region where frame-dragging is extreme)
      const ergosphereRadius = mass + Math.sqrt(Math.pow(mass, 2) - Math.pow(a_spin * Math.cos(theta), 2));
      
      // Frame dragging effect (spacetime rotation)
      const omega = (2 * mass * a_spin) / Math.pow(ergosphereRadius, 2);
      const phiDragged = phi + omega * frameDragging * time;
      
      // Mix horizon and ergosphere for visualization
      const radius = r_plus + 0.3 * (ergosphereRadius - r_plus);
      
      // Photon sphere oscillations
      const photonOscillation = 0.05 * Math.sin(phiDragged * 6 + time * 4);
      
      const finalRadius = radius + photonOscillation;
      
      // Convert to Cartesian with frame dragging
      const x = finalRadius * Math.sin(theta) * Math.cos(phiDragged);
      const y = finalRadius * Math.sin(theta) * Math.sin(phiDragged);
      const z = finalRadius * Math.cos(theta);
      
      return [x, y, z];
    },
    defaultParams: {
      d: 2, e: 1, f: 1, g: 1, h: 0.8, i: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 48, vSegments: 48
    }
  },

  // ============================================================================
  // 8. GRAVITATIONAL LENS
  // ============================================================================
  gravitational_lens: {
    name: "🔍 Gravitational Lens - Light Bending",
    equation: (u, v, params) => {
      const lensDistance = params.d ?? 8;     // Distance to lensing mass
      const lensMass = params.e ?? 3;         // Mass causing lensing
      const phiControl = params.g ?? 1;       // PHI: Radial
      const piControl = params.h ?? 1;        // PI: Angular
      const deflectionAngle = params.i ?? 1;  // ALPHA: Light deflection strength
      const time = params.i ?? 0;             // DELTA: Time
      
      // Create a surface showing the light deflection pattern
      const radius = (u * lensDistance) * phiControl;
      const angle = v * 2 * Math.PI * piControl;
      
      // Einstein radius for gravitational lensing
      const einsteinRadius = Math.sqrt(4 * lensMass * lensDistance / 2);
      
      // Deflection follows: α = 4GM / (c²r)
      const deflection = (4 * lensMass * deflectionAngle) / (radius + 0.5);
      
      // Create caustic patterns (focus lines where light is concentrated)
      const caustic = 0.5 * Math.exp(-Math.pow((radius - einsteinRadius) / 0.5, 2));
      
      // Multiple images effect
      const multipleImages = 0.2 * Math.abs(Math.sin(radius * 3 - time));
      
      const height = deflection + caustic + multipleImages;
      
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const z = height;
      
      return [x, y, z];
    },
    defaultParams: {
      d: 10, e: 3, f: 1, g: 1, h: 1, i: 0,
      uMin: 0.1, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 48, vSegments: 80
    }
  },

  // ============================================================================
  // 9. PHOTON SPHERE
  // ============================================================================
  photon_sphere: {
    name: "💫 Photon Sphere - Unstable Orbit",
    equation: (u, v, params) => {
      const mass = params.d ?? 2;             // Black hole mass
      const phiControl = params.g ?? 1;       // PHI: Latitude
      const piControl = params.h ?? 1;        // PI: Longitude
      const lightIntensity = params.i ?? 1;   // ALPHA: Light intensity
      const time = params.i ?? 0;             // DELTA: Time
      
      // Photon sphere radius: r = 1.5 * Schwarzschild radius = 3GM/c²
      const schwarzschildRadius = 2 * mass;
      const photonSphereRadius = 1.5 * schwarzschildRadius;
      
      // Spherical coordinates
      const theta = u * Math.PI * phiControl;
      const phi = v * 2 * Math.PI * piControl;
      
      // Light orbits create interference patterns
      const interference = 0.05 * Math.sin(phi * 12 + time * 8) * 
                           Math.cos(theta * 10 - time * 6) * lightIntensity;
      
      // Quantum fluctuations destabilize orbits
      const quantumJitter = 0.02 * Math.sin(phi * 30 + theta * 25 + time * 10);
      
      const radius = photonSphereRadius + interference + quantumJitter;
      
      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(theta);
      
      return [x, y, z];
    },
    defaultParams: {
      d: 2, e: 1, f: 1, g: 1, h: 1, i: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 48, vSegments: 48
    }
  },

  // ============================================================================
  // 10. COSMIC STRING
  // ============================================================================
  cosmic_string: {
    name: "🧵 Cosmic String - Topological Defect",
    equation: (u, v, params) => {
      const stringLength = params.d ?? 20;    // Cosmic strings are extremely long
      const stringRadius = params.e ?? 0.05;  // But incredibly thin
      const phiControl = params.g ?? 1;       // PHI: Length control
      const piControl = params.h ?? 1;        // PI: Rotation
      const tension = params.i ?? 1;          // ALPHA: String tension
      const wiggle = params.g ?? 0.5;         // BETA: Cosmic wiggle amplitude
      const time = params.i ?? 0;             // DELTA: Time evolution
      
      // Position along string
      const zPos = (u - 0.5) * stringLength * phiControl;
      
      // Angular position around string
      const angle = v * 2 * Math.PI * piControl;
      
      // Cosmic strings wiggle due to cosmic expansion
      const cosmicWiggleX = wiggle * Math.sin(zPos * 0.5 + time);
      const cosmicWiggleY = wiggle * Math.cos(zPos * 0.7 - time * 0.8);
      
      // Gravitational waves from string oscillations
      const gravWaves = 0.1 * Math.sin(zPos * 2 + time * 3) * tension;
      
      // String radius with perturbations
      const radius = stringRadius * (1 + gravWaves);
      
      const x = radius * Math.cos(angle) + cosmicWiggleX;
      const y = radius * Math.sin(angle) + cosmicWiggleY;
      const z = zPos;
      
      return [x, y, z];
    },
    defaultParams: {
      d: 25, e: 0.08, f: 1, g: 1, h: 1, i: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 48, vSegments: 24
    }
  },

  // ============================================================================
  // 11. BINARY STAR SYSTEM
  // ============================================================================
  binary_star_system: {
    name: "⭐⭐ Binary Stars - Orbital Dance",
    equation: (u, v, params) => {
      const starRadius = params.d ?? 1.5;     // Star size
      const separation = params.e ?? 8;       // Distance between stars
      const phiControl = params.g ?? 1;       // PHI: Latitude
      const piControl = params.h ?? 1;        // PI: Longitude
      const orbitalSpeed = params.i ?? 1;     // ALPHA: Orbital velocity
      const massRatio = params.g ?? 1;        // BETA: Mass ratio (affects orbit)
      const tidalDeformation = params.h ?? 0.2; // GAMMA: Tidal bulges
      const time = params.i ?? 0;             // DELTA: Time
      
      // Determine which star we're rendering (split u parameter)
      const whichStar = u < 0.5 ? 0 : 1;
      const localU = (u % 0.5) * 2;
      
      // Spherical coordinates for star
      const theta = localU * Math.PI * phiControl;
      const phi = v * 2 * Math.PI * piControl;
      
      // Orbital positions (stars orbit their common center of mass)
      const star1Offset = whichStar === 0 ? 
        -(separation * massRatio / (1 + massRatio)) : 
        (separation / (1 + massRatio));
      
      const orbitAngle = time * orbitalSpeed;
      const xOffset = star1Offset * Math.cos(orbitAngle);
      const yOffset = star1Offset * Math.sin(orbitAngle);
      
      // Tidal deformation (stars are stretched toward each other)
      const tidalAxis = Math.cos(phi - orbitAngle);
      const tidalBulge = tidalDeformation * tidalAxis;
      
      // Surface features (star spots, flares)
      const surfaceFeatures = 0.05 * Math.abs(Math.sin(theta * 8)) * 
                              Math.abs(Math.cos(phi * 6 + time * 2));
      
      const radius = starRadius * (1 + tidalBulge + surfaceFeatures);
      
      const x = radius * Math.sin(theta) * Math.cos(phi) + xOffset;
      const y = radius * Math.sin(theta) * Math.sin(phi) + yOffset;
      const z = radius * Math.cos(theta);
      
      return [x, y, z];
    },
    defaultParams: {
      d: 1.5, e: 9, f: 1, g: 1, h: 0.2, i: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 48, vSegments: 32
    }
  },

  // ============================================================================
  // CINEMATIC BLACK HOLE - Movie Style Visualization  
  // ============================================================================
  cinematic_black_hole: {
    name: "🎬 Cinematic Black Hole - Hollywood Style",
    equation: (u, v, params) => {
      const M = params.a ?? 2;           // Mass (affects event horizon size)
      const scale = params.b ?? 4;       // Overall scale
      const time = params.e ?? 0;        // Animation time
      const intensity = params.f ?? 1;   // Accretion disk intensity
      
      const theta = u * Math.PI * 2;
      const r = v * scale * 6;           // Extended range for dramatic effect
      
      // Schwarzschild radius
      const rs = 2 * M * 0.3;
      
      // Create dramatic spacetime distortion
      // Objects get "stretched" as they approach event horizon (spaghettification)
      const gravitationalField = rs / (r + rs * 0.1);
      const tidalForce = 1 + gravitationalField * 2;
      
      // Accretion disk with realistic orbital mechanics
      const orbitalVelocity = Math.sqrt(M / (r + rs));
      const diskHeight = 0.1 * r * Math.exp(-r / (scale * 2));
      
      // Temperature profile: hotter closer to black hole (realistic physics)
      const temperature = Math.exp(-r / (scale * 1.5));
      const redshift = Math.sqrt(1 - rs / Math.max(r, rs * 1.001)); // Gravitational redshift
      
      // Relativistic beaming effect
      const beamingFactor = 1 + orbitalVelocity * Math.cos(theta - time * 3);
      
      // Create the dramatic warped space visualization
      let x, y, z;
      
      if (r < rs * 1.2) {
        // Event horizon region - pure black with subtle Hawking radiation
        x = rs * 1.1 * Math.cos(theta);
        y = rs * 1.1 * Math.sin(theta);
        z = 0.01 * Math.sin(time * 10 + theta * 8); // Quantum fluctuations
      } else {
        // Accretion disk with realistic physics
        const diskRadius = r * (1 + 0.1 * Math.sin(theta * 6 + time * orbitalVelocity * 10));
        
        x = diskRadius * Math.cos(theta);
        y = diskRadius * Math.sin(theta);
        
        // Disk height with turbulence
        z = diskHeight * Math.sin(theta * 4 + time * 2) * temperature * beamingFactor;
        
        // Add relativistic jet effects for dramatic flair
        if (Math.abs(z) > scale * 0.8) {
          const jetIntensity = Math.exp(-Math.abs(z - scale) / scale);
          z += jetIntensity * scale * 0.5 * Math.sin(time * 5);
        }
      }
      
      // Apply gravitational lensing distortion
      const lensing = 1 + gravitationalField * 0.3 * Math.sin(theta * 3 + time);
      
      return [
        x * lensing * tidalForce,
        y * lensing * tidalForce, 
        z * intensity
      ];
    },
    defaultParams: {
      a: 2, b: 4, c: 1, d: 0, e: 0, f: 1,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 128, vSegments: 96
    }
  }

};


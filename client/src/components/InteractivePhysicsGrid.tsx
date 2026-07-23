import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SurfaceParameters } from '../types/math';
import { detectPhysicsCategory, PhysicsCategory } from '../lib/physicsEngine';

interface InteractivePhysicsGridProps {
  parameters: SurfaceParameters;
  gridSize?: number;
  gridDivisions?: number;
  baseY?: number;
  isAnimating?: boolean;
  animationVelocity?: number;
  gridRef?: React.MutableRefObject<THREE.LineSegments | null>;
}

interface DeformProfile {
  type: 'gravity' | 'wave' | 'quantum' | 'em' | 'crystal' | 'organic' | 'fractal' | 'flat';
  depthScale: number;
  radialDecay: number;
  rippleFreq: number;
  rippleSpeed: number;
  colorHigh: THREE.Color;
  colorLow: THREE.Color;
}

const DEFORM_PROFILES: Record<PhysicsCategory, DeformProfile> = {
  astrophysical: {
    type: 'gravity',
    depthScale: 3.5,
    radialDecay: 0.6,
    rippleFreq: 0,
    rippleSpeed: 0,
    colorHigh: new THREE.Color(0xff8800),
    colorLow:  new THREE.Color(0x220800),
  },
  wave: {
    type: 'wave',
    depthScale: 1.2,
    radialDecay: 0.3,
    rippleFreq: 2.5,
    rippleSpeed: 1.8,
    colorHigh: new THREE.Color(0x00ccff),
    colorLow:  new THREE.Color(0x001133),
  },
  quantum: {
    type: 'quantum',
    depthScale: 0.6,
    radialDecay: 0.15,
    rippleFreq: 6.0,
    rippleSpeed: 3.0,
    colorHigh: new THREE.Color(0xaa44ff),
    colorLow:  new THREE.Color(0x110022),
  },
  molecular: {
    type: 'organic',
    depthScale: 0.8,
    radialDecay: 0.4,
    rippleFreq: 1.5,
    rippleSpeed: 0.9,
    colorHigh: new THREE.Color(0x44ff88),
    colorLow:  new THREE.Color(0x002211),
  },
  cellular: {
    type: 'organic',
    depthScale: 0.7,
    radialDecay: 0.35,
    rippleFreq: 1.2,
    rippleSpeed: 0.7,
    colorHigh: new THREE.Color(0x55ee77),
    colorLow:  new THREE.Color(0x001811),
  },
  attractor: {
    type: 'wave',
    depthScale: 1.4,
    radialDecay: 0.2,
    rippleFreq: 4.0,
    rippleSpeed: 2.5,
    colorHigh: new THREE.Color(0xff2266),
    colorLow:  new THREE.Color(0x220011),
  },
  anatomical: {
    type: 'organic',
    depthScale: 0.9,
    radialDecay: 0.4,
    rippleFreq: 1.0,
    rippleSpeed: 1.2,
    colorHigh: new THREE.Color(0xff4444),
    colorLow:  new THREE.Color(0x220000),
  },
  fractal: {
    type: 'fractal',
    depthScale: 1.1,
    radialDecay: 0.25,
    rippleFreq: 3.5,
    rippleSpeed: 0.5,
    colorHigh: new THREE.Color(0xffaa00),
    colorLow:  new THREE.Color(0x221100),
  },
  crystalline: {
    type: 'crystal',
    depthScale: 0.5,
    radialDecay: 0.8,
    rippleFreq: 8.0,
    rippleSpeed: 0.0,
    colorHigh: new THREE.Color(0x88eeff),
    colorLow:  new THREE.Color(0x003344),
  },
  mechanical: {
    type: 'wave',
    depthScale: 0.6,
    radialDecay: 0.5,
    rippleFreq: 3.0,
    rippleSpeed: 1.5,
    colorHigh: new THREE.Color(0xcccccc),
    colorLow:  new THREE.Color(0x222222),
  },
  static: {
    type: 'flat',
    depthScale: 0.0,
    radialDecay: 1.0,
    rippleFreq: 0,
    rippleSpeed: 0,
    colorHigh: new THREE.Color(0x444444),
    colorLow:  new THREE.Color(0x1a1a1a),
  },
};

function buildGridGeometry(size: number, divisions: number) {
  const step = size / divisions;
  const half = size / 2;

  const linesX = divisions + 1;
  const linesZ = divisions + 1;
  const vertsPerLine = divisions + 1;
  const totalVerts = (linesX + linesZ) * vertsPerLine;
  const positions = new Float32Array(totalVerts * 3);
  const colors    = new Float32Array(totalVerts * 3);

  let idx = 0;

  for (let z = 0; z <= divisions; z++) {
    for (let x = 0; x <= divisions; x++) {
      positions[idx * 3 + 0] = -half + x * step;
      positions[idx * 3 + 1] = 0;
      positions[idx * 3 + 2] = -half + z * step;
      colors[idx * 3] = colors[idx * 3 + 1] = colors[idx * 3 + 2] = 0.25;
      idx++;
    }
  }

  for (let x = 0; x <= divisions; x++) {
    for (let z = 0; z <= divisions; z++) {
      positions[idx * 3 + 0] = -half + x * step;
      positions[idx * 3 + 1] = 0;
      positions[idx * 3 + 2] = -half + z * step;
      colors[idx * 3] = colors[idx * 3 + 1] = colors[idx * 3 + 2] = 0.25;
      idx++;
    }
  }

  const lineIndices: number[] = [];

  for (let z = 0; z <= divisions; z++) {
    const base = z * vertsPerLine;
    for (let x = 0; x < divisions; x++) {
      lineIndices.push(base + x, base + x + 1);
    }
  }

  const zOffset = linesX * vertsPerLine;
  for (let x = 0; x <= divisions; x++) {
    const base = zOffset + x * vertsPerLine;
    for (let z = 0; z < divisions; z++) {
      lineIndices.push(base + z, base + z + 1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setIndex(lineIndices);

  return { geometry, totalVerts, vertsPerLine, linesX, linesZ, half, step, divisions };
}

function computeBaseDisplacement(
  wx: number,
  wz: number,
  profile: DeformProfile,
  time: number,
  mass: number,
  charge: number,
  energy: number,
  noiseSeeds: Float32Array,
  vertIdx: number
): number {
  if (profile.type === 'flat') return 0;

  const dist = Math.sqrt(wx * wx + wz * wz);
  const maxDist = 15;
  const normalDist = Math.min(dist / maxDist, 1.0);
  const physicsWeight = (mass * 0.4 + Math.abs(charge) * 0.3 + Math.abs(energy) * 0.3);

  switch (profile.type) {
    case 'gravity': {
      const well = -profile.depthScale * physicsWeight / (normalDist * profile.radialDecay + 0.15);
      return Math.max(well, -8.0);
    }
    case 'wave': {
      const phase = dist * profile.rippleFreq - time * profile.rippleSpeed;
      const ripple = Math.sin(phase) * profile.depthScale * physicsWeight;
      const envelope = Math.exp(-normalDist * profile.radialDecay * 2.5);
      return ripple * envelope;
    }
    case 'quantum': {
      const seed = noiseSeeds[vertIdx % noiseSeeds.length];
      const noise = Math.sin(time * 4.1 + seed * 13.7) * 0.3;
      const phase = dist * profile.rippleFreq - time * profile.rippleSpeed;
      const base = Math.sin(phase) * profile.depthScale * physicsWeight * 0.5;
      const envelope = Math.exp(-normalDist * 2.5);
      return (base + noise) * envelope;
    }
    case 'organic': {
      const pulse = Math.sin(time * profile.rippleSpeed) * 0.5 + 0.5;
      return -profile.depthScale * physicsWeight * pulse * Math.exp(-normalDist * profile.radialDecay * 3.0);
    }
    case 'em': {
      const angle = Math.atan2(wz, wx);
      const dipole = Math.cos(angle * 2) * Math.sin(dist * profile.rippleFreq - time * profile.rippleSpeed);
      return dipole * profile.depthScale * physicsWeight * Math.exp(-normalDist * 2.0);
    }
    case 'crystal': {
      const hex = Math.cos(wx * profile.rippleFreq) * Math.cos(wz * profile.rippleFreq);
      return hex * profile.depthScale * physicsWeight * 0.4;
    }
    case 'fractal': {
      const s1 = Math.sin(dist * profile.rippleFreq - time * profile.rippleSpeed);
      const s2 = Math.sin(dist * profile.rippleFreq * 2.1 - time * profile.rippleSpeed * 1.3) * 0.5;
      const s3 = Math.sin(dist * profile.rippleFreq * 4.3 - time * profile.rippleSpeed * 0.7) * 0.25;
      const envelope = Math.exp(-normalDist * profile.radialDecay * 2.0);
      return (s1 + s2 + s3) * profile.depthScale * physicsWeight * envelope;
    }
    default:
      return 0;
  }
}

interface Pulse {
  originX: number;
  originZ: number;
  birthTime: number;
  strength: number;
  speed: number;
  width: number;
  upward: boolean;
}

interface AIGridMood {
  intensityScale: number;
  rippleBoost: number;
  colorSaturation: number;
  wakeStrength: number;
}

export default function InteractivePhysicsGrid({
  parameters,
  gridSize = 60,
  gridDivisions = 20,
  baseY = -3,
  isAnimating = false,
  animationVelocity = 1,
  gridRef: externalRef,
}: InteractivePhysicsGridProps) {
  const lineRef  = useRef<THREE.LineSegments>(null);
  const timeRef  = useRef(0);
  const { scene } = useThree();
  // Cache the parametric mesh so we don't traverse every frame
  const cachedMeshRef = useRef<THREE.Mesh | null>(null);

  const category  = useMemo(() => detectPhysicsCategory(parameters.type), [parameters.type]);
  const profile   = DEFORM_PROFILES[category] ?? DEFORM_PROFILES.static;

  const noiseSeeds = useMemo(() => {
    const arr = new Float32Array(2048);
    for (let i = 0; i < arr.length; i++) arr[i] = (i * 2.3 + 1.7) % (Math.PI * 2);
    return arr;
  }, []);

  const gridData = useMemo(() => buildGridGeometry(gridSize, gridDivisions), [gridSize, gridDivisions]);

  const profileRef  = useRef(profile);
  const paramsRef   = useRef(parameters);
  const isAnimatingRef = useRef(isAnimating);
  const animVelocityRef = useRef(animationVelocity);

  useEffect(() => { profileRef.current  = profile; }, [profile]);
  useEffect(() => { paramsRef.current   = parameters; }, [parameters]);
  useEffect(() => { isAnimatingRef.current = isAnimating; }, [isAnimating]);
  useEffect(() => { animVelocityRef.current = animationVelocity; }, [animationVelocity]);

  const prevPositionsRef = useRef<Float32Array | null>(null);
  const transitionRef    = useRef(0);

  const shapePosRef     = useRef(new THREE.Vector3(0, 0, 0));
  const shapeVelRef     = useRef(new THREE.Vector3(0, 0, 0));
  const prevShapePosRef = useRef(new THREE.Vector3(0, 0, 0));

  // Trampoline spring state per-vertex would be too expensive; use a global spring scalar
  const springRef = useRef({ compression: 0, velocity: 0 });

  const pulsesRef = useRef<Pulse[]>([]);

  const aiMoodRef = useRef<AIGridMood>({
    intensityScale: 1.0,
    rippleBoost: 1.0,
    colorSaturation: 1.0,
    wakeStrength: 1.0,
  });

  useEffect(() => {
    if (lineRef.current && externalRef) {
      externalRef.current = lineRef.current;
    }
  }, [externalRef]);

  useEffect(() => {
    if (lineRef.current) {
      const pos = lineRef.current.geometry.attributes.position;
      const snap = new Float32Array(pos.array.length);
      snap.set(pos.array as Float32Array);
      prevPositionsRef.current = snap;
    }
    transitionRef.current = 0;

    const t = timeRef.current;
    pulsesRef.current.push({
      originX: shapePosRef.current.x,
      originZ: shapePosRef.current.z,
      birthTime: t,
      strength: 2.5,
      speed: 8.0,
      width: 2.0,
      upward: false,
    });
    if (pulsesRef.current.length > 12) pulsesRef.current.shift();

    fetch('/api/ai-analysis/shape-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shapeType: parameters.type }),
    })
      .then(r => r.json())
      .then(data => {
        if (data?.status === 'success') {
          const text: string = (data.summary ?? '').toLowerCase();
          const hasEnergy  = text.includes('energetic') || text.includes('dynamic') || text.includes('chaotic');
          const hasCalm    = text.includes('harmonic') || text.includes('smooth') || text.includes('stable');
          const hasComplex = text.includes('complex') || text.includes('fractal') || text.includes('quantum');
          aiMoodRef.current = {
            intensityScale: hasEnergy ? 1.6 : hasCalm ? 0.7 : 1.0,
            rippleBoost:    hasComplex ? 1.5 : 1.0,
            colorSaturation: hasEnergy ? 1.4 : 1.0,
            wakeStrength:   hasEnergy ? 1.8 : hasCalm ? 0.6 : 1.0,
          };
        }
      })
      .catch(() => {});
  }, [parameters.type]);

  useEffect(() => {
    const { a, b, c } = parameters;
    const t = timeRef.current;
    pulsesRef.current.push({
      originX: shapePosRef.current.x,
      originZ: shapePosRef.current.z,
      birthTime: t,
      strength: Math.abs((a ?? 1) + (b ?? 1) + (c ?? 1)) * 0.4 + 0.5,
      speed: 6.0,
      width: 1.5,
      upward: false,
    });
    if (pulsesRef.current.length > 12) pulsesRef.current.shift();
  }, [parameters.a, parameters.b, parameters.c]);

  // Invalidate cached mesh when shape type changes
  useEffect(() => { cachedMeshRef.current = null; }, [parameters.type]);

  const frameCountRef = useRef(0);

  useFrame((_, delta) => {
    if (!lineRef.current) return;

    timeRef.current += delta;
    const t = timeRef.current;
    frameCountRef.current++;

    if (transitionRef.current < 1) {
      transitionRef.current = Math.min(transitionRef.current + delta * 1.8, 1);
    }
    const blend = transitionRef.current;

    // Re-find mesh only every 30 frames or when cache is empty
    if (!cachedMeshRef.current || frameCountRef.current % 30 === 0) {
      scene.updateMatrixWorld(false);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh && obj.userData.isParametricSurface) {
          cachedMeshRef.current = obj;
        }
      });
    }

    if (cachedMeshRef.current) {
      cachedMeshRef.current.getWorldPosition(shapePosRef.current);
      shapeVelRef.current.copy(shapePosRef.current).sub(prevShapePosRef.current).divideScalar(Math.max(delta, 0.001));
      prevShapePosRef.current.copy(shapePosRef.current);
    }

    const prof      = profileRef.current;
    const params    = paramsRef.current;
    const mood      = aiMoodRef.current;
    const animating = isAnimatingRef.current;
    const animVel   = animVelocityRef.current;

    const mass   = Math.abs(params.a ?? 1) * 0.8;
    const charge = (params.b ?? 1) - 1.0;
    const energy = Math.abs(params.c ?? 1) * 0.6;

    // --- Spacetime trampoline spring ---
    // How much the shape presses on the grid (0 when far above, 1 at grid level, >1 when below)
    const shapeY = shapePosRef.current.y;
    const penetration = Math.max(0, 1.0 - (shapeY - baseY) / 7.0);
    // Spring: target compression = penetration, spring stiffness 8, damping 4
    const spring = springRef.current;
    const springTarget = penetration;
    const springForce = (springTarget - spring.compression) * 8.0 - spring.velocity * 4.0;
    spring.velocity += springForce * delta;
    spring.compression += spring.velocity * delta;
    spring.compression = Math.max(0, spring.compression);

    // Detect upward bounce: when shape was compressed and now moves strongly upward
    const velY = shapeVelRef.current.y;
    if (velY > 3.0 && spring.compression > 0.3) {
      pulsesRef.current.push({
        originX: shapePosRef.current.x,
        originZ: shapePosRef.current.z,
        birthTime: t,
        strength: spring.compression * 3.5 * (1 + velY * 0.1),
        speed: 9.0,
        width: 2.5,
        upward: true,
      });
      if (pulsesRef.current.length > 16) pulsesRef.current.shift();
    }

    const geom   = lineRef.current.geometry;
    const posArr = geom.attributes.position.array as Float32Array;
    const colArr = geom.attributes.color.array as Float32Array;
    const prev   = prevPositionsRef.current;

    const { totalVerts } = gridData;

    const shapeX  = shapePosRef.current.x;
    const shapeZ  = shapePosRef.current.z;
    const velMag  = shapeVelRef.current.length();
    const wakeStr = (animating ? animVel * 1.2 : 0.3) * mood.wakeStrength;

    // Universal spacetime gravity well params
    const WELL_MAX_DEPTH = 5.5;
    const WELL_SIGMA_SQ  = 120.0; // spread radius squared

    const now = t;
    const activePulses = pulsesRef.current.filter(p => now - p.birthTime < 6.0);
    pulsesRef.current = activePulses;

    for (let i = 0; i < totalVerts; i++) {
      const wx = posArr[i * 3 + 0];
      const wz = posArr[i * 3 + 2];

      let baseY_val = baseY + computeBaseDisplacement(wx, wz, prof, t, mass, charge, energy, noiseSeeds, i) * mood.intensityScale;

      const dxShape = wx - shapeX;
      const dzShape = wz - shapeZ;
      const distShape = Math.sqrt(dxShape * dxShape + dzShape * dzShape);

      // --- Universal spacetime curvature (always active) ---
      const rSq = dxShape * dxShape + dzShape * dzShape;
      const gravEnvelope = Math.exp(-rSq / WELL_SIGMA_SQ);
      const gravWell = -spring.compression * WELL_MAX_DEPTH * gravEnvelope;
      baseY_val += gravWell;

      // --- Wake ripple ---
      const wakeRadius = 8 + velMag * 0.5;
      const wakeEnv = Math.exp(-distShape / wakeRadius);
      const wakeRippleFreq = 0.8 + (prof.rippleFreq || 1.5) * 0.3;
      const wakePhase = distShape * wakeRippleFreq - t * (animVel || 1.0) * 2.5;
      const wake = Math.sin(wakePhase) * wakeStr * wakeEnv * (1.0 + velMag * 0.1);
      baseY_val += wake * mood.rippleBoost;

      // --- Presence depth (contact shadow) ---
      const presenceDepth = -0.8 * mood.intensityScale * Math.exp(-rSq / (wakeRadius * wakeRadius * 0.25));
      baseY_val += presenceDepth;

      // --- Pulses (shape-change ripples + bounce) ---
      for (const pulse of activePulses) {
        const age     = now - pulse.birthTime;
        const dx      = wx - pulse.originX;
        const dz      = wz - pulse.originZ;
        const dPulse  = Math.sqrt(dx * dx + dz * dz);
        const front   = pulse.speed * age;
        const diff    = Math.abs(dPulse - front);
        if (diff < pulse.width * 3) {
          const ring   = Math.exp(-(diff * diff) / (pulse.width * pulse.width));
          const decay  = Math.exp(-age * 0.5);
          const dir    = pulse.upward ? 1 : -1;
          const ripple = dir * Math.sin(dPulse * 1.8 - age * 5.0) * pulse.strength * ring * decay;
          baseY_val += ripple;
        }
      }

      let finalY: number;
      if (blend < 1 && prev) {
        const prevY = prev[i * 3 + 1];
        finalY = prevY + (baseY_val - prevY) * blend;
      } else {
        finalY = baseY_val;
      }

      posArr[i * 3 + 1] = finalY;

      // Color: blend from base color → hot color based on deformation depth
      const deformAmt = Math.abs(finalY - baseY) / Math.max(prof.depthScale * 4 * mood.intensityScale, 1.5);
      // Extra brightness near the gravity well center
      const wellGlow = gravEnvelope * spring.compression * 0.6;
      const intensity  = Math.min((deformAmt + wellGlow) * mood.colorSaturation, 1.0);

      const distFromShape = distShape / 30.0;
      const shapePing = Math.max(0, 1.0 - distFromShape) * wakeEnv * 0.35;
      const totalIntensity = Math.min(intensity + shapePing, 1.0);

      // Gravity well gets a warm amber glow; other deformations keep profile colors
      const glowR = Math.min(prof.colorLow.r + (prof.colorHigh.r - prof.colorLow.r) * totalIntensity + wellGlow * 0.5, 1.0);
      const glowG = Math.min(prof.colorLow.g + (prof.colorHigh.g - prof.colorLow.g) * totalIntensity + wellGlow * 0.15, 1.0);
      const glowB = Math.min(prof.colorLow.b + (prof.colorHigh.b - prof.colorLow.b) * totalIntensity, 1.0);

      colArr[i * 3 + 0] = glowR;
      colArr[i * 3 + 1] = glowG;
      colArr[i * 3 + 2] = glowB;
    }

    geom.attributes.position.needsUpdate = true;
    geom.attributes.color.needsUpdate    = true;
    // Only recompute bounding sphere every 60 frames — not needed every tick
    if (frameCountRef.current % 60 === 0) geom.computeBoundingSphere();
  });

  const material = useMemo(() => new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.72,
    depthWrite: false,
  }), []);

  return (
    <lineSegments
      ref={lineRef}
      geometry={gridData.geometry}
      material={material}
    />
  );
}

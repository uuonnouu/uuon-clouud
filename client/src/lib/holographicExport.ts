/**
 * HOLOGRAPHIC EXPORT ENGINE
 * 
 * Creates true holographic visual effects for 3D model exports:
 * - Interference patterns (rainbow/iridescent shimmer)
 * - View-dependent transparency (Fresnel effect)
 * - Chromatic aberration at edges
 * - Scan lines / grid artifacts
 * - Depth-of-field bloom simulation
 * - Flicker / noise instability
 * - Fresnel edge glow
 * 
 * Author: UUON Foundation Inc.
 */

import * as THREE from 'three';

export interface HolographicOptions {
  primaryColor: number;
  secondaryColor: number;
  interferenceStrength: number;
  fresnelPower: number;
  chromaticAberration: number;
  scanLineIntensity: number;
  flickerSpeed: number;
  flickerIntensity: number;
  bloomIntensity: number;
  noiseAmount: number;
  hologramOpacity: number;
}

export const DEFAULT_HOLOGRAPHIC_OPTIONS: HolographicOptions = {
  primaryColor: 0x00ffff,
  secondaryColor: 0xff00ff,
  interferenceStrength: 0.4,
  fresnelPower: 2.5,
  chromaticAberration: 0.03,
  scanLineIntensity: 0.15,
  flickerSpeed: 3.0,
  flickerIntensity: 0.1,
  bloomIntensity: 0.8,
  noiseAmount: 0.05,
  hologramOpacity: 0.85
};

const holographicVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  varying vec2 vUv;
  varying float vFresnel;
  
  uniform float time;
  uniform float flickerIntensity;
  uniform float flickerSpeed;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    
    // Calculate Fresnel for view-dependent effects
    vec3 viewDirection = normalize(cameraPosition - worldPosition.xyz);
    vFresnel = pow(1.0 - abs(dot(viewDirection, vNormal)), 2.5);
    
    // Add subtle vertex displacement for holographic instability
    float flicker = sin(time * flickerSpeed + position.y * 10.0) * flickerIntensity * 0.02;
    vec3 displaced = position + normal * flicker;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const holographicFragmentShader = `
  uniform float time;
  uniform vec3 primaryColor;
  uniform vec3 secondaryColor;
  uniform float interferenceStrength;
  uniform float fresnelPower;
  uniform float chromaticAberration;
  uniform float scanLineIntensity;
  uniform float flickerSpeed;
  uniform float flickerIntensity;
  uniform float bloomIntensity;
  uniform float noiseAmount;
  uniform float hologramOpacity;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  varying vec2 vUv;
  varying float vFresnel;
  
  // Simplex noise function for organic flickering
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  void main() {
    // === INTERFERENCE PATTERNS (Rainbow shimmer) ===
    float interference = sin(vWorldPosition.y * 20.0 + time * 2.0) * 0.5 + 0.5;
    interference += sin(vWorldPosition.x * 15.0 - time * 1.5) * 0.3;
    interference += sin(vWorldPosition.z * 18.0 + time * 1.8) * 0.2;
    interference = clamp(interference, 0.0, 1.0);
    
    // Rainbow color based on interference
    vec3 rainbow = vec3(
      sin(interference * 6.28 + 0.0) * 0.5 + 0.5,
      sin(interference * 6.28 + 2.09) * 0.5 + 0.5,
      sin(interference * 6.28 + 4.18) * 0.5 + 0.5
    );
    
    // === FRESNEL (View-dependent transparency & edge glow) ===
    float fresnel = pow(vFresnel, fresnelPower);
    
    // === CHROMATIC ABERRATION ===
    vec3 chromaticOffset = vec3(
      vFresnel * chromaticAberration,
      0.0,
      -vFresnel * chromaticAberration
    );
    
    // === SCAN LINES ===
    float scanLine = sin(vWorldPosition.y * 100.0 + time * 5.0) * 0.5 + 0.5;
    scanLine = pow(scanLine, 4.0) * scanLineIntensity;
    
    // === FLICKER / NOISE ===
    float noise = snoise(vUv * 50.0 + time * flickerSpeed) * noiseAmount;
    float flicker = sin(time * flickerSpeed * 10.0) * flickerIntensity;
    flicker += sin(time * flickerSpeed * 7.3) * flickerIntensity * 0.5;
    flicker += sin(time * flickerSpeed * 13.7) * flickerIntensity * 0.3;
    
    // === BASE HOLOGRAM COLOR ===
    vec3 baseColor = mix(primaryColor, secondaryColor, interference * interferenceStrength);
    
    // Add rainbow interference
    baseColor = mix(baseColor, rainbow, interferenceStrength * 0.5);
    
    // Apply chromatic aberration to color channels
    baseColor.r += chromaticOffset.r;
    baseColor.b += chromaticOffset.z;
    
    // === BLOOM SIMULATION (brighter at overlapping depths) ===
    float bloom = fresnel * bloomIntensity;
    baseColor += vec3(bloom * 0.3, bloom * 0.5, bloom * 0.7);
    
    // === FRESNEL EDGE GLOW ===
    vec3 edgeGlow = mix(primaryColor, secondaryColor, fresnel) * fresnel * 2.0;
    baseColor += edgeGlow;
    
    // === COMBINE EFFECTS ===
    // Add scan lines
    baseColor *= (1.0 - scanLine);
    
    // Add noise and flicker
    baseColor += noise;
    baseColor *= (1.0 + flicker);
    
    // === FINAL OPACITY (View-dependent) ===
    float alpha = hologramOpacity;
    alpha *= (0.6 + fresnel * 0.4); // More visible at edges
    alpha *= (1.0 + flicker * 0.5); // Flicker affects opacity
    alpha = clamp(alpha, 0.0, 1.0);
    
    gl_FragColor = vec4(baseColor, alpha);
  }
`;

export function createHolographicMaterial(
  options: Partial<HolographicOptions> = {}
): THREE.ShaderMaterial {
  const opts = { ...DEFAULT_HOLOGRAPHIC_OPTIONS, ...options };
  
  const primaryColorVec = new THREE.Color(opts.primaryColor);
  const secondaryColorVec = new THREE.Color(opts.secondaryColor);
  
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      primaryColor: { value: primaryColorVec },
      secondaryColor: { value: secondaryColorVec },
      interferenceStrength: { value: opts.interferenceStrength },
      fresnelPower: { value: opts.fresnelPower },
      chromaticAberration: { value: opts.chromaticAberration },
      scanLineIntensity: { value: opts.scanLineIntensity },
      flickerSpeed: { value: opts.flickerSpeed },
      flickerIntensity: { value: opts.flickerIntensity },
      bloomIntensity: { value: opts.bloomIntensity },
      noiseAmount: { value: opts.noiseAmount },
      hologramOpacity: { value: opts.hologramOpacity }
    },
    vertexShader: holographicVertexShader,
    fragmentShader: holographicFragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
}

export function createHolographicWireframeMaterial(
  options: Partial<HolographicOptions> = {}
): THREE.LineBasicMaterial {
  const opts = { ...DEFAULT_HOLOGRAPHIC_OPTIONS, ...options };
  
  return new THREE.LineBasicMaterial({
    color: opts.primaryColor,
    transparent: true,
    opacity: 0.9,
    linewidth: 2
  });
}

export function createHolographicExportScene(
  geometry: THREE.BufferGeometry,
  options: Partial<HolographicOptions> = {},
  animationDuration: number = 4
): { scene: THREE.Scene; animations: THREE.AnimationClip[]; hologramMesh: THREE.Mesh } {
  const opts = { ...DEFAULT_HOLOGRAPHIC_OPTIONS, ...options };
  const scene = new THREE.Scene();
  
  const clonedGeometry = geometry.clone();
  if (!clonedGeometry.attributes.normal) {
    clonedGeometry.computeVertexNormals();
  }
  
  // IMPORTANT: Wrap wireframe in a Group for proper GLTF animation export
  // LineSegments don't animate properly in GLTF, but Groups do
  const wireframeGroup = new THREE.Group();
  wireframeGroup.name = 'Hologram_Wireframe_Group';
  
  const edgesGeometry = new THREE.EdgesGeometry(clonedGeometry);
  const wireframeMaterial = createHolographicWireframeMaterial(opts);
  const wireframe = new THREE.LineSegments(edgesGeometry, wireframeMaterial);
  wireframe.name = 'Hologram_Wireframe_Lines';
  wireframeGroup.add(wireframe);
  scene.add(wireframeGroup);
  
  // Main hologram mesh in its own group for animation
  const hologramGroup = new THREE.Group();
  hologramGroup.name = 'Hologram_Core_Group';
  
  const holographicMaterial = createHolographicMaterial(opts);
  const hologramMesh = new THREE.Mesh(clonedGeometry, holographicMaterial);
  hologramMesh.name = 'Hologram_Core';
  hologramGroup.add(hologramMesh);
  scene.add(hologramGroup);
  
  // Outer glow in its own group
  const outerGlowGroup = new THREE.Group();
  outerGlowGroup.name = 'Hologram_OuterGlow_Group';
  
  const outerGlowGeometry = clonedGeometry.clone();
  const positions = outerGlowGeometry.attributes.position;
  const normals = outerGlowGeometry.attributes.normal;
  
  if (positions && normals) {
    const scaledPositions = new Float32Array(positions.count * 3);
    for (let i = 0; i < positions.count; i++) {
      scaledPositions[i * 3] = positions.getX(i) + normals.getX(i) * 0.02;
      scaledPositions[i * 3 + 1] = positions.getY(i) + normals.getY(i) * 0.02;
      scaledPositions[i * 3 + 2] = positions.getZ(i) + normals.getZ(i) * 0.02;
    }
    outerGlowGeometry.setAttribute('position', new THREE.BufferAttribute(scaledPositions, 3));
  }
  
  const outerGlowMaterial = new THREE.MeshBasicMaterial({
    color: opts.primaryColor,
    transparent: true,
    opacity: 0.15,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending
  });
  const outerGlow = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
  outerGlow.name = 'Hologram_OuterGlow';
  outerGlowGroup.add(outerGlow);
  scene.add(outerGlowGroup);
  
  const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
  scene.add(ambientLight);
  
  const pointLight1 = new THREE.PointLight(opts.primaryColor, 1, 10);
  pointLight1.position.set(2, 2, 2);
  scene.add(pointLight1);
  
  const pointLight2 = new THREE.PointLight(opts.secondaryColor, 0.5, 10);
  pointLight2.position.set(-2, -1, 2);
  scene.add(pointLight2);
  
  // Animations now target the Groups, not the objects directly
  // This ensures proper GLTF export with counter-rotation
  const animations = createHolographicAnimations(
    hologramGroup,      // Animate the group containing the mesh
    wireframeGroup,     // Animate the group containing the wireframe (counter-rotation)
    outerGlowGroup,     // Animate the group containing the glow
    animationDuration,
    opts
  );
  
  return { scene, animations, hologramMesh };
}

function createHolographicAnimations(
  hologramGroup: THREE.Group,
  wireframeGroup: THREE.Group,
  outerGlowGroup: THREE.Group,
  duration: number,
  options: HolographicOptions
): THREE.AnimationClip[] {
  const clips: THREE.AnimationClip[] = [];
  
  const rotationTimes = [0, duration * 0.25, duration * 0.5, duration * 0.75, duration];
  
  // Forward rotation quaternions (clockwise when viewed from above)
  const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
  const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 2, 0));
  const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0));
  const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI * 1.5, 0));
  const q4 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI * 2, 0));
  
  // Counter-rotation quaternions (opposite direction - counter-clockwise)
  const qR0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
  const qR1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -Math.PI / 2, 0));
  const qR2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -Math.PI, 0));
  const qR3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -Math.PI * 1.5, 0));
  const qR4 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -Math.PI * 2, 0));
  
  // Forward rotation values for main mesh and outer glow (clockwise)
  const forwardRotationValues = [
    q0.x, q0.y, q0.z, q0.w,
    q1.x, q1.y, q1.z, q1.w,
    q2.x, q2.y, q2.z, q2.w,
    q3.x, q3.y, q3.z, q3.w,
    q4.x, q4.y, q4.z, q4.w
  ];
  
  // Counter-rotation values for wireframe group - spins OPPOSITE direction (counter-clockwise)
  const counterRotationValues = [
    qR0.x, qR0.y, qR0.z, qR0.w,
    qR1.x, qR1.y, qR1.z, qR1.w,
    qR2.x, qR2.y, qR2.z, qR2.w,
    qR3.x, qR3.y, qR3.z, qR3.w,
    qR4.x, qR4.y, qR4.z, qR4.w
  ];
  
  // Main hologram group rotates forward (clockwise)
  const hologramRotation = new THREE.QuaternionKeyframeTrack(
    `${hologramGroup.name}.quaternion`,
    rotationTimes,
    forwardRotationValues,
    THREE.InterpolateSmooth
  );
  
  // Wireframe group rotates in OPPOSITE direction (counter-clockwise)
  // This creates the dual-spin holographic effect
  const wireframeRotation = new THREE.QuaternionKeyframeTrack(
    `${wireframeGroup.name}.quaternion`,
    rotationTimes,
    counterRotationValues,
    THREE.InterpolateSmooth
  );
  
  // Outer glow group rotates forward with main mesh
  const outerGlowRotation = new THREE.QuaternionKeyframeTrack(
    `${outerGlowGroup.name}.quaternion`,
    rotationTimes,
    forwardRotationValues,
    THREE.InterpolateSmooth
  );
  
  clips.push(new THREE.AnimationClip('HologramRotation', duration, [
    hologramRotation,
    wireframeRotation,
    outerGlowRotation
  ]));
  
  // Flicker animation for the hologram group
  const flickerTimes: number[] = [];
  const flickerScales: number[] = [];
  const flickerSteps = 60;
  
  for (let i = 0; i <= flickerSteps; i++) {
    const t = (i / flickerSteps) * duration;
    flickerTimes.push(t);
    
    const baseScale = 1.0;
    const flicker = Math.sin(t * options.flickerSpeed * 10) * options.flickerIntensity * 0.02;
    const noise = (Math.random() - 0.5) * options.noiseAmount * 0.05;
    const scale = baseScale + flicker + noise;
    
    flickerScales.push(scale, scale, scale);
  }
  
  const hologramFlicker = new THREE.VectorKeyframeTrack(
    `${hologramGroup.name}.scale`,
    flickerTimes,
    flickerScales,
    THREE.InterpolateLinear
  );
  
  clips.push(new THREE.AnimationClip('HologramFlicker', duration, [hologramFlicker]));
  
  return clips;
}

export function bakeHolographicToStandardMaterial(
  options: Partial<HolographicOptions> = {},
  time: number = 0
): THREE.MeshStandardMaterial {
  const opts = { ...DEFAULT_HOLOGRAPHIC_OPTIONS, ...options };
  
  const primaryColor = new THREE.Color(opts.primaryColor);
  const secondaryColor = new THREE.Color(opts.secondaryColor);
  
  const mixedColor = primaryColor.clone().lerp(secondaryColor, 0.3);
  
  return new THREE.MeshStandardMaterial({
    color: mixedColor,
    emissive: primaryColor,
    emissiveIntensity: opts.bloomIntensity * 0.5,
    metalness: 0.9,
    roughness: 0.1,
    transparent: true,
    opacity: opts.hologramOpacity,
    side: THREE.DoubleSide
  });
}

export function createHolographicTextureCanvas(
  width: number = 512,
  height: number = 512,
  options: Partial<HolographicOptions> = {},
  time: number = 0
): HTMLCanvasElement {
  const opts = { ...DEFAULT_HOLOGRAPHIC_OPTIONS, ...options };
  
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return canvas;
  
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  
  const primary = new THREE.Color(opts.primaryColor);
  const secondary = new THREE.Color(opts.secondaryColor);
  
  gradient.addColorStop(0, `rgb(${primary.r * 255}, ${primary.g * 255}, ${primary.b * 255})`);
  gradient.addColorStop(0.5, `rgb(${secondary.r * 255}, ${secondary.g * 255}, ${secondary.b * 255})`);
  gradient.addColorStop(1, `rgb(${primary.r * 255}, ${primary.g * 255}, ${primary.b * 255})`);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  ctx.strokeStyle = `rgba(255, 255, 255, ${opts.scanLineIntensity})`;
  ctx.lineWidth = 1;
  
  for (let y = 0; y < height; y += 4) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * opts.noiseAmount * 50;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  return canvas;
}

export const HOLOGRAPHIC_PRESETS: Record<string, Partial<HolographicOptions>> = {
  'classic-cyan': {
    primaryColor: 0x00ffff,
    secondaryColor: 0x0080ff,
    interferenceStrength: 0.4,
    fresnelPower: 2.5,
    scanLineIntensity: 0.15
  },
  'sci-fi-green': {
    primaryColor: 0x00ff88,
    secondaryColor: 0x88ff00,
    interferenceStrength: 0.5,
    fresnelPower: 3.0,
    scanLineIntensity: 0.2
  },
  'retro-pink': {
    primaryColor: 0xff00ff,
    secondaryColor: 0xff0088,
    interferenceStrength: 0.6,
    fresnelPower: 2.0,
    chromaticAberration: 0.05,
    scanLineIntensity: 0.25
  },
  'ghost-white': {
    primaryColor: 0xffffff,
    secondaryColor: 0x88ccff,
    interferenceStrength: 0.3,
    fresnelPower: 4.0,
    hologramOpacity: 0.6,
    scanLineIntensity: 0.1
  },
  'warning-orange': {
    primaryColor: 0xff8800,
    secondaryColor: 0xffff00,
    interferenceStrength: 0.5,
    flickerIntensity: 0.15,
    scanLineIntensity: 0.3
  },
  'quantum-purple': {
    primaryColor: 0x8800ff,
    secondaryColor: 0xff00ff,
    interferenceStrength: 0.7,
    fresnelPower: 2.0,
    bloomIntensity: 1.0,
    chromaticAberration: 0.04
  }
};

export default {
  createHolographicMaterial,
  createHolographicWireframeMaterial,
  createHolographicExportScene,
  bakeHolographicToStandardMaterial,
  createHolographicTextureCanvas,
  HOLOGRAPHIC_PRESETS,
  DEFAULT_HOLOGRAPHIC_OPTIONS
};

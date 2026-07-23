import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import JSZip from 'jszip';

interface FractalExportConfig {
  harmonicFrequency: number;
  timeScale: number;
  duration: number; // 7.77 seconds
  fps: number; // 40 fps
}

export async function exportAnimatedFractalBiosystem(config: FractalExportConfig) {
  const { duration, fps, harmonicFrequency, timeScale } = config;
  const frameCount = Math.round(duration * fps); // 311 frames (7.77 * 40 = 310.8, rounds to 311)
  
  console.log(`🎬 Starting fractal biosystem export: ${frameCount} frames @ ${fps} fps (${duration}s)`);
  
  // Create scene
  const scene = new THREE.Scene();
  
  // Add lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.3));
  const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight1.position.set(10, 10, 5);
  scene.add(dirLight1);
  
  const dirLight2 = new THREE.DirectionalLight(0x4ECDC4, 0.4);
  dirLight2.position.set(-10, -10, -5);
  scene.add(dirLight2);
  
  const pointLight = new THREE.PointLight(0xC77DFF, 1, 20);
  scene.add(pointLight);
  
  // Create main group for all biosystem components with name for animation targeting
  const biosystemGroup = new THREE.Group();
  biosystemGroup.name = 'FractalBiosystemRoot';
  scene.add(biosystemGroup);
  
  // Build DNA helix geometry
  const dnaHelix = createDNAHelix(1, harmonicFrequency);
  dnaHelix.position.set(-6, 0, 0);
  biosystemGroup.add(dnaHelix);
  
  // Build chromatin structures
  const chromatin1 = createChromatinFiber(0.8);
  chromatin1.position.set(-3, 0, 0);
  biosystemGroup.add(chromatin1);
  
  const chromatin2 = createChromatinFiber(1.2);
  chromatin2.position.set(0, 0, 0);
  biosystemGroup.add(chromatin2);
  
  // Build neural pathway
  const neuralPathway = createOpticNeuralPathway(1);
  neuralPathway.position.set(5, 0, 0);
  biosystemGroup.add(neuralPathway);
  
  // Build harmonic field
  const harmonicField = createHarmonicField(1, harmonicFrequency);
  biosystemGroup.add(harmonicField);
  
  // Create animation tracks with proper timeScale application
  const times: number[] = [];
  const positionValues: number[] = [];
  const quaternionValues: number[] = [];
  
  for (let frame = 0; frame < frameCount; frame++) {
    const t = (frame / fps) * timeScale;
    times.push(frame / fps); // Real time (not scaled for timing)
    
    // Animate main group rotation with timeScale
    const rotY = t * 0.05;
    const quaternion = new THREE.Quaternion();
    quaternion.setFromEuler(new THREE.Euler(0, rotY, 0));
    quaternionValues.push(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
    
    // Subtle vertical oscillation
    const posY = Math.sin(t * 0.3) * 0.2;
    positionValues.push(0, posY, 0);
  }
  
  // Create animation clip with proper quaternion track targeting
  const tracks = [
    new THREE.VectorKeyframeTrack(
      'FractalBiosystemRoot.position',
      times,
      positionValues
    ),
    new THREE.QuaternionKeyframeTrack(
      'FractalBiosystemRoot.quaternion',
      times,
      quaternionValues
    )
  ];
  
  const clip = new THREE.AnimationClip('FractalBiosystemAnimation', duration, tracks);
  
  // Export to GLTF/GLB
  const exporter = new GLTFExporter();
  
  return new Promise<void>((resolve, reject) => {
    exporter.parse(
      scene,
      async (gltf: any) => {
        try {
          // Add animation to GLTF
          if (!gltf.animations) {
            gltf.animations = [];
          }
          gltf.animations.push(clip);
          
          // Create ZIP with metadata
          const zip = new JSZip();
          
          // Convert to GLB buffer
          const glbBuffer = gltf;
          zip.file('fractal_biosystem_7.77s_40fps.glb', glbBuffer);
          
          // Add metadata JSON
          const metadata = {
            name: 'Fractal Biosystem - DNA & Neural Architecture Unity',
            author: 'UUON Foundation Inc.',
            copyright: '© 2024 UUON Foundation Inc. All Rights Reserved.',
            duration_seconds: duration,
            fps: fps,
            frame_count: frameCount,
            harmonic_frequency: harmonicFrequency,
            time_scale: timeScale,
            structures: [
              'DNA Double Helix (3.4nm pitch)',
              'Nucleosome Assembly (11nm diameter)',
              'Chromatin Fiber (30nm)',
              'Optic Neural Pathway',
              'Electromagnetic Resonance Field'
            ],
            mathematical_principles: {
              golden_ratio: 1.618033988749,
              dna_pitch_nm: 3.4,
              nucleosome_diameter_nm: 11,
              chromatin_fiber_diameter_nm: 30,
              scale_range: '10^-9 to 10^-3 meters'
            },
            export_date: new Date().toISOString(),
            contact: 'phi1@uuonfoundation.com',
            website: 'www.uuonfoundation.com'
          };
          
          zip.file('metadata.json', JSON.stringify(metadata, null, 2));
          
          // Add README
          const readme = `# Fractal Biosystem Animation Export

## Overview
This export demonstrates the mathematical unity between DNA structure and neural pathways through fractal geometry and harmonic resonance.

## Contents
- fractal_biosystem_7.77s_40fps.glb: Animated 3D model
- metadata.json: Technical specifications and mathematical parameters
- README.txt: This file

## Animation Details
- Duration: ${duration} seconds (${frameCount} frames)
- Frame Rate: ${fps} fps
- Harmonic Frequency: ${harmonicFrequency}
- Time Scale: ${timeScale}x

## Structures Visualized
1. DNA Double Helix - Molecular scale (3.4nm pitch)
2. Nucleosome Assembly - Nanoscale (11nm diameter)
3. Chromatin Fiber - Nanoscale (30nm diameter)
4. Optic Neural Pathway - Microscale architecture
5. Electromagnetic Resonance Field - Harmonic wave patterns

## Mathematical Principles
- Golden Ratio (φ): 1.618033988749
- Fractal recursion across 6 orders of magnitude
- Harmonic wave interference patterns
- Self-similar geometry at all scales

## Usage
Import the GLB file into any 3D viewer, game engine, or visualization software that supports GLTF 2.0 format with animations.

## Copyright
© 2024 UUON Foundation Inc. All Rights Reserved.
Product of UUON Foundation, no undocumented reproduction or any use without written consent.

Contact: phi1@uuonfoundation.com
Website: www.uuonfoundation.com
`;
          
          zip.file('README.txt', readme);
          
          // Generate and download ZIP
          const blob = await zip.generateAsync({ type: 'blob' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `fractal_biosystem_${Date.now()}.zip`;
          link.click();
          URL.revokeObjectURL(url);
          
          console.log('✅ Fractal biosystem export complete');
          resolve();
        } catch (error) {
          console.error('❌ Export failed:', error);
          reject(error);
        }
      },
      (error: any) => {
        console.error('❌ GLTF export error:', error);
        reject(error);
      },
      { binary: true, animations: [clip] }
    );
  });
}

function createDNAHelix(scale: number, harmonicFreq: number): THREE.Group {
  const group = new THREE.Group();
  const segments = 200;
  const height = 10 * scale;
  const radius = 0.8 * scale;
  const pitch = 3.4;
  
  const points1: THREE.Vector3[] = [];
  const points2: THREE.Vector3[] = [];
  
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const angle = t * Math.PI * 2 * (height / pitch);
    const y = (t - 0.5) * height;
    
    points1.push(new THREE.Vector3(
      Math.cos(angle) * radius,
      y,
      Math.sin(angle) * radius
    ));
    
    points2.push(new THREE.Vector3(
      Math.cos(angle + Math.PI) * radius,
      y,
      Math.sin(angle + Math.PI) * radius
    ));
  }
  
  const curve1 = new THREE.CatmullRomCurve3(points1);
  const curve2 = new THREE.CatmullRomCurve3(points2);
  
  const tubeGeo1 = new THREE.TubeGeometry(curve1, segments, 0.05, 8, false);
  const tubeGeo2 = new THREE.TubeGeometry(curve2, segments, 0.05, 8, false);
  
  const mat1 = new THREE.MeshPhongMaterial({ color: 0x4ECDC4, emissive: 0x4ECDC4, emissiveIntensity: 0.3 });
  const mat2 = new THREE.MeshPhongMaterial({ color: 0xFF6B6B, emissive: 0xFF6B6B, emissiveIntensity: 0.3 });
  
  group.add(new THREE.Mesh(tubeGeo1, mat1));
  group.add(new THREE.Mesh(tubeGeo2, mat2));
  
  // Base pairs
  for (let i = 0; i < points1.length; i += 4) {
    const geo = new THREE.CylinderGeometry(0.03, 0.03, points1[i].distanceTo(points2[i]), 4);
    const mesh = new THREE.Mesh(geo, new THREE.MeshPhongMaterial({ color: 0x95E1D3 }));
    mesh.position.copy(points1[i]).lerp(points2[i], 0.5);
    mesh.lookAt(points2[i]);
    mesh.rotateX(Math.PI / 2);
    group.add(mesh);
  }
  
  return group;
}

function createChromatinFiber(scale: number): THREE.Group {
  const group = new THREE.Group();
  const nucleosomeCount = 24;
  const radius = 1.2 * scale;
  const height = 12 * scale;
  
  for (let i = 0; i < nucleosomeCount; i++) {
    const t = i / nucleosomeCount;
    const angle = t * Math.PI * 2 * 3;
    const y = (t - 0.5) * height;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    
    const nucleoScale = 0.15 * scale;
    const core = new THREE.Mesh(
      new THREE.CylinderGeometry(nucleoScale, nucleoScale, nucleoScale * 0.8, 8),
      new THREE.MeshPhongMaterial({ color: 0xC77DFF, emissive: 0xC77DFF, emissiveIntensity: 0.2 })
    );
    core.position.set(x, y, z);
    group.add(core);
    
    const wrap = new THREE.Mesh(
      new THREE.TorusGeometry(nucleoScale * 1.2, nucleoScale * 0.15, 8, 16),
      new THREE.MeshPhongMaterial({ color: 0x7209B7 })
    );
    wrap.position.set(x, y, z);
    wrap.rotation.y = angle;
    group.add(wrap);
  }
  
  const fiber = new THREE.Mesh(
    new THREE.CylinderGeometry(scale * 0.05, scale * 0.05, height, 8),
    new THREE.MeshPhongMaterial({ color: 0x560BAD, transparent: true, opacity: 0.4 })
  );
  group.add(fiber);
  
  return group;
}

function createOpticNeuralPathway(scale: number): THREE.Group {
  const group = new THREE.Group();
  
  // Eyeballs
  const eye1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.4 * scale, 16, 16),
    new THREE.MeshPhongMaterial({ color: 0xFFFFFF, emissive: 0x88CCFF, emissiveIntensity: 0.3 })
  );
  eye1.position.set(-1.5 * scale, -4 * scale, 0);
  group.add(eye1);
  
  const eye2 = eye1.clone();
  eye2.position.set(1.5 * scale, -4 * scale, 0);
  group.add(eye2);
  
  // Optic chiasma
  const chiasma = new THREE.Mesh(
    new THREE.TorusGeometry(0.6 * scale, 0.15 * scale, 8, 16),
    new THREE.MeshPhongMaterial({ color: 0xFF6B35, emissive: 0xFF6B35, emissiveIntensity: 0.5 })
  );
  chiasma.position.set(0, -0.8 * scale, 0.25 * scale);
  group.add(chiasma);
  
  // LGN nodes
  const lgn1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.25 * scale, 12, 12),
    new THREE.MeshPhongMaterial({ color: 0x9B59B6, emissive: 0x9B59B6, emissiveIntensity: 0.4 })
  );
  lgn1.position.set(-0.7 * scale, 2 * scale, 1.5 * scale);
  group.add(lgn1);
  
  const lgn2 = lgn1.clone();
  lgn2.position.set(0.7 * scale, 2 * scale, 1.5 * scale);
  group.add(lgn2);
  
  return group;
}

function createHarmonicField(scale: number, frequency: number): THREE.Points {
  const particleCount = 1000;
  const positions = new Float32Array(particleCount * 3);
  const phi = 1.618033988749;
  
  for (let i = 0; i < particleCount; i++) {
    const theta = Math.acos(2 * (i / particleCount) - 1);
    const phiAngle = (i * phi * 2 * Math.PI) % (2 * Math.PI);
    const r = 8 * scale * Math.cbrt(i / particleCount);
    
    positions[i * 3] = r * Math.sin(theta) * Math.cos(phiAngle);
    positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phiAngle);
    positions[i * 3 + 2] = r * Math.cos(theta);
  }
  
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  const material = new THREE.PointsMaterial({
    size: 0.05,
    color: 0x00FFFF,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });
  
  return new THREE.Points(geometry, material);
}

export async function exportIndividualComponent(componentType: string, harmonicFrequency: number): Promise<void> {
  console.log(`🎬 Exporting individual component: ${componentType} at frequency ${harmonicFrequency}`);
  
  const scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(5, 5, 5);
  scene.add(dirLight);
  
  let component: THREE.Object3D;
  
  switch (componentType.toLowerCase()) {
    case 'dna':
    case 'dna_helix':
      component = createDNAHelix(1, harmonicFrequency);
      break;
    case 'chromatin':
      component = createChromatinFiber(1);
      break;
    case 'neural':
    case 'neural_pathway':
      component = createOpticNeuralPathway(1);
      break;
    case 'harmonic':
    case 'harmonic_field':
      component = createHarmonicField(1, harmonicFrequency);
      break;
    default:
      component = createDNAHelix(1, harmonicFrequency);
  }
  
  scene.add(component);
  
  const exporter = new GLTFExporter();
  const options = {
    binary: true,
    animations: []
  };
  
  return new Promise((resolve, reject) => {
    exporter.parse(
      scene,
      (result) => {
        const blob = new Blob([result as ArrayBuffer], { type: 'model/gltf-binary' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `fractal-biosystem-${componentType}-${Date.now()}.glb`;
        link.click();
        URL.revokeObjectURL(url);
        console.log(`✅ ${componentType} component exported successfully`);
        resolve();
      },
      (error) => {
        console.error(`❌ Export failed for ${componentType}:`, error);
        reject(error);
      },
      options
    );
  });
}

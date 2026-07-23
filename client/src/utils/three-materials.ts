import * as THREE from 'three';

export interface MaterialPreset {
  color: number;
  metalness: number;
  roughness: number;
  clearcoat: number;
  clearcoatRoughness: number;
  emissive?: number;
  emissiveIntensity?: number;
  transmission?: number;
  thickness?: number;
  ior?: number;
  sheen?: number;
  sheenRoughness?: number;
  sheenColor?: number;
}

export const MATERIAL_PRESETS: Record<string, MaterialPreset> = {
  sacred: {
    color: 0xffd700,
    metalness: 0.3,
    roughness: 0.2,
    clearcoat: 0.5,
    clearcoatRoughness: 0.1,
    emissive: 0xffaa00,
    emissiveIntensity: 0.1
  },

  crystal: {
    color: 0x88ccff,
    metalness: 0.0,
    roughness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.0,
    transmission: 0.9,
    thickness: 1.0,
    ior: 1.5
  },

  organic: {
    color: 0x90ee90,
    metalness: 0.0,
    roughness: 0.8,
    clearcoat: 0.0,
    clearcoatRoughness: 0.3,
    sheen: 0.5,
    sheenRoughness: 0.8,
    sheenColor: 0xffffff
  },

  metallic: {
    color: 0xe0e0e0,
    metalness: 1.0,
    roughness: 0.05,
    clearcoat: 0.0,  // No clearcoat
    clearcoatRoughness: 0.0,
    emissive: 0x000000, // No emissive
    emissiveIntensity: 0.0
  },

  cosmic: {
    color: 0x1a0033,
    metalness: 0.6,
    roughness: 0.3,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1,
    emissive: 0x6600cc,
    emissiveIntensity: 0.3
  },

  medical: {
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.6,
    clearcoat: 0.4,
    clearcoatRoughness: 0.2,
    emissive: 0xaaddff,
    emissiveIntensity: 0.05
  },

  default: {
    color: 0x808080,
    metalness: 0.15,
    roughness: 0.45,
    clearcoat: 0.3,
    clearcoatRoughness: 0.2
  }
};

export function detectShapeCategory(shapeType: string): keyof typeof MATERIAL_PRESETS {
  const type = shapeType.toLowerCase();

  if (type.includes('sacred') || type.includes('flower') || type.includes('merkaba') || type.includes('seed')) {
    return 'sacred';
  } else if (type.includes('crystal') || type.includes('platonic') || type.includes('dodecahedron') || type.includes('icosahedron')) {
    return 'crystal';
  } else if (type.includes('organic') || type.includes('natural') || type.includes('biological')) {
    return 'organic';
  } else if (type.includes('metal') || type.includes('equation') || type.includes('hypercube') || type.includes('tesseract') || 
             type.includes('chrome') || type.includes('steel') || type.includes('gold') || type.includes('copper') || 
             type.includes('silver') || type.includes('aluminum') || type.includes('brass')) {
    return 'metallic';
  } else if (type.includes('cosmic') || type.includes('galaxy') || type.includes('mandelbrot') || type.includes('julia')) {
    return 'cosmic';
  } else if (type.includes('tpms') || type.includes('gyroid') || type.includes('diamond') || type.includes('scaffold') || type.includes('tissue')) {
    return 'medical';
  }

  return 'default';
}

export function createPBRMaterial(
  shapeType: string,
  baseColor?: number | string,
  options: Partial<MaterialPreset> & { transparent?: boolean; opacity?: number; vertexColors?: boolean; polygonOffset?: boolean } = {}
): THREE.MeshPhysicalMaterial {
  const category = detectShapeCategory(shapeType);
  const preset = MATERIAL_PRESETS[category];

  const color = baseColor ? 
    (typeof baseColor === 'string' ? new THREE.Color(baseColor).getHex() : baseColor) : 
    preset.color;

  const transmission = options.transmission ?? preset.transmission ?? 0;
  const transparent = options.transparent !== undefined ? options.transparent : transmission > 0;
  const opacity = options.opacity !== undefined ? options.opacity : (transmission > 0 ? 0.9 : 1.0);

  const material = new THREE.MeshPhysicalMaterial({
    color,
    metalness: options.metalness ?? preset.metalness,
    roughness: options.roughness ?? preset.roughness,
    clearcoat: options.clearcoat ?? preset.clearcoat,
    clearcoatRoughness: options.clearcoatRoughness ?? preset.clearcoatRoughness,
    emissive: options.emissive ?? preset.emissive ?? 0x000000,
    emissiveIntensity: options.emissiveIntensity ?? preset.emissiveIntensity ?? 0,
    transmission,
    thickness: options.thickness ?? preset.thickness ?? 0,
    ior: options.ior ?? preset.ior ?? 1.5,
    sheen: options.sheen ?? preset.sheen ?? 0,
    sheenRoughness: options.sheenRoughness ?? preset.sheenRoughness ?? 0,
    ...(options.sheenColor !== undefined || preset.sheenColor !== undefined ? {
      sheenColor: options.sheenColor ?? preset.sheenColor
    } : {}),
    side: THREE.DoubleSide,
    flatShading: false,
    transparent,
    opacity,
    vertexColors: options.vertexColors ?? false,
    // Enhanced for metals
    envMapIntensity: category === 'metallic' ? 2.0 : 1.0,
    reflectivity: category === 'metallic' ? 1.0 : 0.5,
    // Z-fighting prevention
    depthTest: true,
    depthWrite: true,
    depthFunc: THREE.LessEqualDepth,
    polygonOffset: options.polygonOffset ?? true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1
  });

  // Apply environment map for metallic materials
  if (category === 'metallic') {
    import('../lib/environmentMapping').then(({ getHDREnvironmentMap }) => {
      const envMap = getHDREnvironmentMap();
      if (envMap) {
        material.envMap = envMap;
        material.needsUpdate = true;
      }
    });
  }

  return material;
}

export interface LightingSystem {
  keyLight: THREE.DirectionalLight;
  fillLight: THREE.DirectionalLight;
  rimLight: THREE.DirectionalLight;
  ambientLight: THREE.AmbientLight;
  hemiLight: THREE.HemisphereLight;
}

export function setupProfessionalLighting(scene: THREE.Scene): LightingSystem {
  const existingLights = scene.children.filter(c => (c as any).isLight);
  existingLights.forEach(light => scene.remove(light));

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
  keyLight.position.set(5, 8, 5);
  keyLight.castShadow = true;

  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 50;
  keyLight.shadow.camera.left = -10;
  keyLight.shadow.camera.right = 10;
  keyLight.shadow.camera.top = 10;
  keyLight.shadow.camera.bottom = -10;
  keyLight.shadow.bias = -0.0001;

  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xaaccff, 0.4);
  fillLight.position.set(-5, 3, -5);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xffeecc, 0.6);
  rimLight.position.set(0, 2, -8);
  scene.add(rimLight);

  const ambientLight = new THREE.AmbientLight(0x404060, 0.3);
  scene.add(ambientLight);

  const hemiLight = new THREE.HemisphereLight(
    0x8888ff,
    0x332211,
    0.4
  );
  scene.add(hemiLight);

  return { keyLight, fillLight, rimLight, ambientLight, hemiLight };
}

export function ensureCorrectNormals(geometry: THREE.BufferGeometry, smoothingIterations: number = 2): void {
  // Initial normal computation
  geometry.computeVertexNormals();

  const positions = geometry.attributes.position.array;
  const normals = geometry.attributes.normal.array;

  // Calculate geometric center
  let cx = 0, cy = 0, cz = 0;
  for (let i = 0; i < positions.length; i += 3) {
    cx += positions[i];
    cy += positions[i + 1];
    cz += positions[i + 2];
  }
  const count = positions.length / 3;
  cx /= count; 
  cy /= count; 
  cz /= count;

  // Ensure normals point outward from center
  const dx = positions[0] - cx;
  const dy = positions[1] - cy;
  const dz = positions[2] - cz;
  const dot = dx * normals[0] + dy * normals[1] + dz * normals[2];

  if (dot < 0) {
    for (let i = 0; i < normals.length; i++) {
      normals[i] *= -1;
    }
  }

  // Optimized normal smoothing using vertex index sharing
  // This eliminates fine lines/creases from overlapping geometry
  if (geometry.index) {
    const index = geometry.index.array;
    const smoothedNormals = new Float32Array(normals.length);
    const vertexCount = new Float32Array(normals.length / 3);

    // Accumulate normals for shared vertices
    for (let i = 0; i < index.length; i += 3) {
      const i1 = index[i] * 3;
      const i2 = index[i + 1] * 3;
      const i3 = index[i + 2] * 3;

      // Get triangle normal (average of three vertex normals)
      const nx = (normals[i1] + normals[i2] + normals[i3]) / 3;
      const ny = (normals[i1 + 1] + normals[i2 + 1] + normals[i3 + 1]) / 3;
      const nz = (normals[i1 + 2] + normals[i2 + 2] + normals[i3 + 2]) / 3;

      // Accumulate for each vertex
      smoothedNormals[i1] += nx;
      smoothedNormals[i1 + 1] += ny;
      smoothedNormals[i1 + 2] += nz;
      vertexCount[i1 / 3]++;

      smoothedNormals[i2] += nx;
      smoothedNormals[i2 + 1] += ny;
      smoothedNormals[i2 + 2] += nz;
      vertexCount[i2 / 3]++;

      smoothedNormals[i3] += nx;
      smoothedNormals[i3 + 1] += ny;
      smoothedNormals[i3 + 2] += nz;
      vertexCount[i3 / 3]++;
    }

    // Normalize accumulated normals
    for (let i = 0; i < normals.length; i += 3) {
      const count = vertexCount[i / 3];
      if (count > 0) {
        let nx = smoothedNormals[i] / count;
        let ny = smoothedNormals[i + 1] / count;
        let nz = smoothedNormals[i + 2] / count;

        const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
        if (len > 0) {
          normals[i] = nx / len;
          normals[i + 1] = ny / len;
          normals[i + 2] = nz / len;
        }
      }
    }
  }

  geometry.attributes.normal.needsUpdate = true;
}

export function createGroundPlane(): THREE.Mesh {
  const groundGeometry = new THREE.PlaneGeometry(100, 100);
  const groundMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x222222,
    roughness: 0.8,
    metalness: 0.1,
    side: THREE.DoubleSide
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -3;
  ground.receiveShadow = true;
  return ground;
}
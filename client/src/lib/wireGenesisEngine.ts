
/**
 * WIREGENESIS ENGINE - Enhanced Image-to-3D Conversion
 * Improved depth estimation with multiple visual cues and proper 3D mesh generation
 * Integrates with existing Dmension Parameter Authority (A-Z) system
 */

import * as THREE from 'three';
import { ParameterValues } from './parameterAuthority';

export interface WireGenesisConfig {
  depthEstimationMethod: 'luminance' | 'sobel' | 'hybrid' | 'contrast';
  luminanceWeight: number;
  edgeDetectionWeight: number;
  maxVertices: number;
  smoothingIterations: number;
  subdivisionLevel: number;
  adaptiveTessellation: boolean;
  metalness: number;
  roughness: number;
  displacement: number;
  invertDepth: boolean;
  meshType: 'relief' | 'curved' | 'dome';
  depthContrast: number;
}

export interface WireGenesisOutput {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  uvMapping: Float32Array;
  depthMap: ImageData;
  parameters: Partial<ParameterValues>;
}

class WireGenesisEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  async processImage(
    image: HTMLImageElement,
    config: WireGenesisConfig
  ): Promise<WireGenesisOutput> {
    const targetSize = 256;
    this.canvas.width = targetSize;
    this.canvas.height = targetSize;
    
    this.ctx.drawImage(image, 0, 0, targetSize, targetSize);
    const imageData = this.ctx.getImageData(0, 0, targetSize, targetSize);
    
    const depthMap = this.generateEnhancedDepthMap(imageData, config);
    const geometry = this.createEnhancedMesh(depthMap, config, image);
    const material = this.createMaterial(image, config);
    const parameters = this.mapToParameterAuthority(config);

    return {
      geometry,
      material,
      uvMapping: geometry.attributes.uv.array as Float32Array,
      depthMap,
      parameters
    };
  }

  private generateEnhancedDepthMap(imageData: ImageData, config: WireGenesisConfig): ImageData {
    const { data, width, height } = imageData;
    const depthData = new Uint8ClampedArray(data.length);
    const tempDepth = new Float32Array(width * height);
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const r = data[i], g = data[i + 1], b = data[i + 2];
        
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        const saturation = Math.max(r, g, b) - Math.min(r, g, b);
        const edgeStrength = this.calculateEdgeStrength(data, x, y, width, height);
        const localContrast = this.calculateLocalContrast(data, x, y, width, height);
        
        let depth: number;
        switch (config.depthEstimationMethod) {
          case 'luminance':
            depth = luminance;
            break;
          case 'sobel':
            depth = 128 + edgeStrength * 0.5;
            break;
          case 'contrast':
            depth = localContrast * 2;
            break;
          case 'hybrid':
          default:
            depth = (luminance * config.luminanceWeight) + 
                    (edgeStrength * config.edgeDetectionWeight * 0.5) +
                    (saturation * 0.2) +
                    (localContrast * 0.3);
        }
        
        tempDepth[y * width + x] = depth;
      }
    }
    
    const blurredDepth = this.bilateralFilter(tempDepth, width, height, 5, 25, 25);
    
    let minDepth = Infinity, maxDepth = -Infinity;
    for (let i = 0; i < blurredDepth.length; i++) {
      minDepth = Math.min(minDepth, blurredDepth[i]);
      maxDepth = Math.max(maxDepth, blurredDepth[i]);
    }
    
    const range = maxDepth - minDepth || 1;
    const contrast = config.depthContrast || 1.5;
    
    for (let i = 0; i < blurredDepth.length; i++) {
      let normalized = (blurredDepth[i] - minDepth) / range;
      normalized = Math.pow(normalized, 1 / contrast);
      if (config.invertDepth) normalized = 1 - normalized;
      
      const depth = Math.round(normalized * 255);
      const idx = i * 4;
      depthData[idx] = depth;
      depthData[idx + 1] = depth;
      depthData[idx + 2] = depth;
      depthData[idx + 3] = 255;
    }
    
    return new ImageData(depthData, width, height);
  }

  private calculateLocalContrast(
    data: Uint8ClampedArray, x: number, y: number, width: number, height: number
  ): number {
    const radius = 3;
    let sum = 0, sumSq = 0, count = 0;
    
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const nx = Math.max(0, Math.min(width - 1, x + dx));
        const ny = Math.max(0, Math.min(height - 1, y + dy));
        const idx = (ny * width + nx) * 4;
        const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
        sum += lum;
        sumSq += lum * lum;
        count++;
      }
    }
    
    const mean = sum / count;
    const variance = (sumSq / count) - (mean * mean);
    return Math.sqrt(Math.max(0, variance));
  }

  private bilateralFilter(
    input: Float32Array, width: number, height: number,
    radius: number, sigmaSpace: number, sigmaColor: number
  ): Float32Array {
    const output = new Float32Array(input.length);
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const centerIdx = y * width + x;
        const centerValue = input[centerIdx];
        let weightSum = 0, valueSum = 0;
        
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const nx = Math.max(0, Math.min(width - 1, x + dx));
            const ny = Math.max(0, Math.min(height - 1, y + dy));
            const neighborIdx = ny * width + nx;
            const neighborValue = input[neighborIdx];
            
            const spatialDist = dx * dx + dy * dy;
            const colorDist = (centerValue - neighborValue) ** 2;
            const spatialWeight = Math.exp(-spatialDist / (2 * sigmaSpace * sigmaSpace));
            const colorWeight = Math.exp(-colorDist / (2 * sigmaColor * sigmaColor));
            const weight = spatialWeight * colorWeight;
            
            weightSum += weight;
            valueSum += weight * neighborValue;
          }
        }
        
        output[centerIdx] = valueSum / weightSum;
      }
    }
    
    return output;
  }

  private calculateEdgeStrength(
    data: Uint8ClampedArray, x: number, y: number, width: number, height: number
  ): number {
    const sobelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
    const sobelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];
    
    let gx = 0, gy = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const px = Math.max(0, Math.min(width - 1, x + j));
        const py = Math.max(0, Math.min(height - 1, y + i));
        const idx = (py * width + px) * 4;
        const intensity = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
        gx += intensity * sobelX[i + 1][j + 1];
        gy += intensity * sobelY[i + 1][j + 1];
      }
    }
    return Math.sqrt(gx * gx + gy * gy);
  }

  private createEnhancedMesh(
    depthMap: ImageData, config: WireGenesisConfig, image: HTMLImageElement
  ): THREE.BufferGeometry {
    const { width, height, data } = depthMap;
    const segments = Math.min(128, Math.floor(Math.sqrt(config.maxVertices)));
    const vertices: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    
    for (let iy = 0; iy <= segments; iy++) {
      for (let ix = 0; ix <= segments; ix++) {
        const u = ix / segments;
        const v = iy / segments;
        
        const px = Math.floor(u * (width - 1));
        const py = Math.floor(v * (height - 1));
        const depthIdx = (py * width + px) * 4;
        const depthValue = data[depthIdx] / 255;
        
        let x: number, y: number, z: number;
        
        switch (config.meshType) {
          case 'dome': {
            const theta = u * Math.PI * 2;
            const phi = v * Math.PI * 0.5;
            const radius = 1 + depthValue * config.displacement * 0.5;
            x = Math.sin(phi) * Math.cos(theta) * radius;
            z = Math.sin(phi) * Math.sin(theta) * radius;
            y = Math.cos(phi) * radius;
            break;
          }
          case 'curved': {
            const curvature = 0.5;
            x = (u - 0.5) * 2;
            y = (0.5 - v) * 2;
            const baseCurve = curvature * (1 - 4 * ((u - 0.5) ** 2 + (v - 0.5) ** 2));
            z = baseCurve + depthValue * config.displacement;
            break;
          }
          case 'relief':
          default: {
            x = (u - 0.5) * 2;
            y = (0.5 - v) * 2;
            z = depthValue * config.displacement;
          }
        }
        
        vertices.push(x, y, z);
        normals.push(0, 0, 1);
        uvs.push(u, 1 - v);
      }
    }
    
    for (let iy = 0; iy < segments; iy++) {
      for (let ix = 0; ix < segments; ix++) {
        const a = iy * (segments + 1) + ix;
        const b = iy * (segments + 1) + (ix + 1);
        const c = (iy + 1) * (segments + 1) + ix;
        const d = (iy + 1) * (segments + 1) + (ix + 1);
        indices.push(a, b, c);
        indices.push(b, d, c);
      }
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    
    for (let i = 0; i < config.smoothingIterations; i++) {
      this.applySmoothingIteration(geometry);
    }
    
    geometry.computeVertexNormals();
    return geometry;
  }

  private applySmoothingIteration(geometry: THREE.BufferGeometry): void {
    const positions = geometry.attributes.position;
    const indices = geometry.index;
    if (!indices) return;
    
    const vertexCount = positions.count;
    const smoothedZ = new Float32Array(vertexCount);
    const connections = new Map<number, number[]>();
    
    for (let i = 0; i < indices.count; i += 3) {
      const a = indices.getX(i), b = indices.getX(i + 1), c = indices.getX(i + 2);
      if (!connections.has(a)) connections.set(a, []);
      if (!connections.has(b)) connections.set(b, []);
      if (!connections.has(c)) connections.set(c, []);
      connections.get(a)!.push(b, c);
      connections.get(b)!.push(a, c);
      connections.get(c)!.push(a, b);
    }
    
    for (let i = 0; i < vertexCount; i++) {
      const neighbors = connections.get(i) || [];
      if (neighbors.length === 0) {
        smoothedZ[i] = positions.getZ(i);
        continue;
      }
      let avgZ = 0;
      for (const n of neighbors) avgZ += positions.getZ(n);
      avgZ /= neighbors.length;
      smoothedZ[i] = positions.getZ(i) * 0.6 + avgZ * 0.4;
    }
    
    for (let i = 0; i < vertexCount; i++) {
      const arr = positions.array as Float32Array;
      arr[i * 3 + 2] = smoothedZ[i];
    }
    positions.needsUpdate = true;
  }

  private createMaterial(image: HTMLImageElement, config: WireGenesisConfig): THREE.Material {
    const texture = new THREE.Texture(image);
    texture.needsUpdate = true;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    
    return new THREE.MeshStandardMaterial({
      map: texture,
      metalness: config.metalness,
      roughness: config.roughness,
      side: THREE.DoubleSide,
      flatShading: false
    });
  }

  private mapToParameterAuthority(config: WireGenesisConfig): Partial<ParameterValues> {
    return {
      a: config.displacement * 10,
      b: 1,
      c: 1,
      d: 0,
      e: 0,
      f: 0,
      g: config.smoothingIterations * 10,
      h: config.subdivisionLevel * 20,
      i: config.metalness * 100,
      j: config.roughness * 100
    };
  }

  static getDefaultConfig(): WireGenesisConfig {
    return {
      depthEstimationMethod: 'hybrid',
      luminanceWeight: 0.7,
      edgeDetectionWeight: 0.5,
      maxVertices: 25000,
      smoothingIterations: 1,
      subdivisionLevel: 2,
      adaptiveTessellation: true,
      metalness: 0.2,
      roughness: 0.4,
      displacement: 2.5,
      invertDepth: false,
      meshType: 'relief',
      depthContrast: 2.0
    };
  }
}

export const wireGenesisEngine = new WireGenesisEngine();
export { WireGenesisEngine };
export default wireGenesisEngine;


/**
 * MATHEMATICAL GEOMETRY ENGINE
 * Converts mathematical symbols to geometric representations
 */

import * as THREE from 'three';
import { MathSymbol, getSymbol } from './symbol-database';

export interface GeometryResult {
  vertices: number[];
  indices: number[];
  normals: number[];
  uvs: number[];
  metadata: {
    symbol: string;
    method: string;
    vertex_count: number;
    triangle_count: number;
  };
}

export class GeometryEngine {
  
  /**
   * Generate 3D geometry from mathematical symbol
   */
  generateSymbolGeometry(symbolName: string, params?: Record<string, number>): GeometryResult | null {
    const symbol = getSymbol(symbolName);
    if (!symbol) return null;

    const mergedParams = { ...symbol["3d"].parameters, ...params };

    switch (symbol["3d"].method) {
      case "font_extrusion":
        return this.generateFontExtrusion(symbol, mergedParams);
      case "semantic":
        return this.generateSemanticGeometry(symbol, mergedParams);
      case "procedural":
        return this.generateProceduralGeometry(symbol, mergedParams);
      default:
        return null;
    }
  }

  /**
   * Font extrusion method - convert glyph to 3D
   */
  private generateFontExtrusion(symbol: MathSymbol, params: Record<string, number>): GeometryResult {
    // Create text geometry from symbol
    const depth = params.depth || 0.2;
    const size = params.size || 1.0;
    
    // Simple approximation - in production would use proper font rendering
    const geometry = this.createTextMesh(symbol.symbol, size, depth);
    
    return this.geometryToResult(geometry, symbol, "font_extrusion");
  }

  /**
   * Semantic method - symbol represents actual geometric concept
   */
  private generateSemanticGeometry(symbol: MathSymbol, params: Record<string, number>): GeometryResult {
    let geometry: THREE.BufferGeometry;

    switch (symbol["3d"].geometry_type) {
      case "vector_field":
        geometry = this.createVectorField(params);
        break;
      case "curved_surface":
        geometry = this.createCurvedSurface(params);
        break;
      case "circle":
        geometry = this.createCircle(params);
        break;
      case "golden_spiral":
        geometry = this.createGoldenSpiral(params);
        break;
      case "wave":
        geometry = this.createWave(params);
        break;
      case "intersecting_spheres":
        geometry = this.createIntersectingSpheres(params);
        break;
      case "merged_spheres":
        geometry = this.createMergedSpheres(params);
        break;
      case "probability_cloud":
        geometry = this.createProbabilityCloud(params);
        break;
      case "quantum_spiral":
        geometry = this.createQuantumSpiral(params);
        break;
      case "infinite_fractal":
        geometry = this.createInfiniteFractal(params);
        break;
      case "angle_arc":
        geometry = this.createAngleArc(params);
        break;
      case "perpendicular_lines":
        geometry = this.createPerpendicularLines(params);
        break;
      case "mobius_strip":
        geometry = this.createMobiusStrip(params);
        break;
      case "stepped_pyramid":
        geometry = this.createSteppedPyramid(params);
        break;
      case "interlocked_rings":
        geometry = this.createInterlockedRings(params);
        break;
      default:
        geometry = new THREE.SphereGeometry(1, 32, 16);
    }

    return this.geometryToResult(geometry, symbol, "semantic");
  }

  /**
   * Procedural method - algorithmic generation
   */
  private generateProceduralGeometry(symbol: MathSymbol, params: Record<string, number>): GeometryResult {
    // Generate procedural geometry based on mathematical rules
    const geometry = new THREE.IcosahedronGeometry(params.radius || 1, params.detail || 2);
    return this.geometryToResult(geometry, symbol, "procedural");
  }

  // Geometric shape generators

  private createVectorField(params: Record<string, number>): THREE.BufferGeometry {
    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const indices: number[] = [];
    
    const fieldLines = params.field_lines || 12;
    const intensity = params.intensity || 1.0;
    
    for (let i = 0; i < fieldLines; i++) {
      const angle = (i / fieldLines) * Math.PI * 2;
      const x1 = 0;
      const y1 = 0;
      const z1 = 0;
      const x2 = Math.cos(angle) * intensity;
      const y2 = Math.sin(angle) * intensity;
      const z2 = intensity * 0.5;
      
      positions.push(x1, y1, z1, x2, y2, z2);
      indices.push(i * 2, i * 2 + 1);
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    
    return geometry;
  }

  private createCurvedSurface(params: Record<string, number>): THREE.BufferGeometry {
    const curve_intensity = params.curve_intensity || 1.5;
    const height = params.height || 2.0;
    
    const geometry = new THREE.CylinderGeometry(0.1, 0.1, height, 8);
    
    // Apply curve transformation
    const positions = geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < positions.length; i += 3) {
      const y = positions[i + 1];
      positions[i] += Math.sin(y * curve_intensity) * 0.3;
      positions[i + 2] += Math.cos(y * curve_intensity) * 0.2;
    }
    
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    
    return geometry;
  }

  private createCircle(params: Record<string, number>): THREE.BufferGeometry {
    const radius = params.radius || Math.PI;
    const segments = params.segments || 64;
    
    return new THREE.RingGeometry(radius * 0.9, radius, 0, Math.PI * 2, segments);
  }

  private createGoldenSpiral(params: Record<string, number>): THREE.BufferGeometry {
    const ratio = params.ratio || 1.618033988749;
    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const indices: number[] = [];
    
    const points = 200;
    for (let i = 0; i < points; i++) {
      const t = (i / points) * Math.PI * 4;
      const r = Math.pow(ratio, t / Math.PI);
      const x = r * Math.cos(t);
      const y = r * Math.sin(t);
      const z = t * 0.1;
      
      positions.push(x, y, z);
      if (i > 0) {
        indices.push(i - 1, i);
      }
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    
    return geometry;
  }

  private createWave(params: Record<string, number>): THREE.BufferGeometry {
    const frequency = params.frequency || 1.0;
    const amplitude = params.amplitude || 0.5;
    
    const geometry = new THREE.PlaneGeometry(4, 1, 64, 8);
    const positions = geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      positions[i + 2] = Math.sin(x * frequency * Math.PI) * amplitude;
    }
    
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    
    return geometry;
  }

  private createMobiusStrip(params: Record<string, number>): THREE.BufferGeometry {
    const radius = params.radius || 1.0;
    const twists = params.twists || 1;
    
    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const indices: number[] = [];
    
    const uSegments = 64;
    const vSegments = 16;
    
    for (let i = 0; i <= uSegments; i++) {
      for (let j = 0; j <= vSegments; j++) {
        const u = (i / uSegments) * Math.PI * 2;
        const v = ((j / vSegments) - 0.5) * 0.3;
        
        const x = (radius + v * Math.cos(twists * u / 2)) * Math.cos(u);
        const y = (radius + v * Math.cos(twists * u / 2)) * Math.sin(u);
        const z = v * Math.sin(twists * u / 2);
        
        positions.push(x, y, z);
      }
    }
    
    // Generate indices
    for (let i = 0; i < uSegments; i++) {
      for (let j = 0; j < vSegments; j++) {
        const a = i * (vSegments + 1) + j;
        const b = (i + 1) * (vSegments + 1) + j;
        const c = (i + 1) * (vSegments + 1) + j + 1;
        const d = i * (vSegments + 1) + j + 1;
        
        indices.push(a, b, d, b, c, d);
      }
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    
    return geometry;
  }

  // Additional geometric generators for other symbol types...
  private createIntersectingSpheres(params: Record<string, number>): THREE.BufferGeometry {
    // CSG intersection would be ideal, simplified version here
    return new THREE.SphereGeometry(params.sphere1_radius || 1.0, 32, 16);
  }

  private createMergedSpheres(params: Record<string, number>): THREE.BufferGeometry {
    // CSG union would be ideal, simplified version here  
    return new THREE.SphereGeometry(params.sphere1_radius || 1.0, 32, 16);
  }

  private createProbabilityCloud(params: Record<string, number>): THREE.BufferGeometry {
    const amplitude = params.amplitude || 1.0;
    return new THREE.IcosahedronGeometry(amplitude, 3);
  }

  private createQuantumSpiral(params: Record<string, number>): THREE.BufferGeometry {
    const scale = params.quantum_scale || 1.0;
    return this.createGoldenSpiral({ ratio: 1.618, scale });
  }

  private createInfiniteFractal(params: Record<string, number>): THREE.BufferGeometry {
    const depth = params.recursion_depth || 8;
    const scale = params.scale_factor || 0.618;
    return new THREE.IcosahedronGeometry(scale, Math.min(depth, 4));
  }

  private createAngleArc(params: Record<string, number>): THREE.BufferGeometry {
    const angle = (params.angle_degrees || 90) * Math.PI / 180;
    const radius = params.radius || 1.0;
    const thickness = params.thickness || 0.05;
    
    return new THREE.RingGeometry(radius - thickness, radius + thickness, 0, angle, 32);
  }

  private createPerpendicularLines(params: Record<string, number>): THREE.BufferGeometry {
    const length = params.length || 2.0;
    const thickness = params.thickness || 0.1;
    
    const geometry = new THREE.BufferGeometry();
    const positions = [
      -length/2, 0, 0,  length/2, 0, 0,
      0, -length/2, 0,  0, length/2, 0
    ];
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setIndex([0, 1, 2, 3]);
    
    return geometry;
  }

  private createSteppedPyramid(params: Record<string, number>): THREE.BufferGeometry {
    const steps = params.steps || 10;
    const height = params.height || 2.0;
    const baseWidth = params.base_width || 2.0;
    
    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const indices: number[] = [];
    
    for (let i = 0; i < steps; i++) {
      const y = (i / steps) * height;
      const width = baseWidth * (1 - i / steps);
      
      // Create step vertices
      positions.push(-width/2, y, -width/2);
      positions.push(width/2, y, -width/2);
      positions.push(width/2, y, width/2);
      positions.push(-width/2, y, width/2);
    }
    
    // Generate step faces
    for (let i = 0; i < steps - 1; i++) {
      const base = i * 4;
      indices.push(base, base + 1, base + 4);
      indices.push(base + 1, base + 5, base + 4);
      // Add other faces...
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    
    return geometry;
  }

  private createInterlockedRings(params: Record<string, number>): THREE.BufferGeometry {
    const ringCount = params.ring_count || 5;
    const radius = params.radius || 0.5;
    const thickness = params.thickness || 0.1;
    
    // Simplified - single ring, would need CSG for proper interlocking
    return new THREE.TorusGeometry(radius, thickness, 8, 16);
  }

  private createTextMesh(text: string, size: number, depth: number): THREE.BufferGeometry {
    // Simplified text geometry - would use proper font loader in production
    const geometry = new THREE.BoxGeometry(size, size, depth);
    return geometry;
  }

  /**
   * Convert THREE.BufferGeometry to result format
   */
  private geometryToResult(geometry: THREE.BufferGeometry, symbol: MathSymbol, method: string): GeometryResult {
    const positionAttribute = geometry.attributes.position;
    const normalAttribute = geometry.attributes.normal;
    const uvAttribute = geometry.attributes.uv;
    const indexAttribute = geometry.index;

    const vertices = Array.from(positionAttribute.array);
    const normals = normalAttribute ? Array.from(normalAttribute.array) : [];
    const uvs = uvAttribute ? Array.from(uvAttribute.array) : [];
    const indices = indexAttribute ? Array.from(indexAttribute.array) : [];

    return {
      vertices,
      indices,
      normals,
      uvs,
      metadata: {
        symbol: symbol.symbol,
        method,
        vertex_count: vertices.length / 3,
        triangle_count: indices.length / 3
      }
    };
  }
}

export const geometryEngine = new GeometryEngine();

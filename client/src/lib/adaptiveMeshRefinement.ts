
/**
 * ADAPTIVE MESH REFINEMENT SYSTEM
 * Intelligently refines mesh geometry based on curvature and visual importance
 * © 2025 UUON Foundation Inc. - Phillip A. Ruiz III
 */

interface MeshVertex {
  position: [number, number, number];
  normal: [number, number, number];
  curvature: number;
  importance: number;
}

interface RefinementCriteria {
  maxCurvature: number;
  minImportance: number;
  targetVertexCount: number;
  viewportFactor: number;
}

export class AdaptiveMeshRefinement {
  private curvatureThreshold = 0.5;
  private importanceThreshold = 0.3;
  private maxRefinementLevel = 4;

  /**
   * Refine mesh based on curvature and visual importance
   */
  refineMesh(
    vertices: Float32Array,
    indices: Uint32Array,
    criteria: RefinementCriteria
  ): { vertices: Float32Array; indices: Uint32Array; refinementMap: Map<number, number> } {
    
    const refinedVertices: MeshVertex[] = [];
    const refinedIndices: number[] = [];
    const refinementMap = new Map<number, number>();

    // Convert to vertex objects with metadata
    const meshVertices = this.processVertices(vertices, indices);
    
    // Calculate curvature for each vertex
    this.calculateCurvature(meshVertices, indices);
    
    // Calculate visual importance (distance from camera, screen space area)
    this.calculateImportance(meshVertices, criteria.viewportFactor);
    
    // Adaptive refinement based on criteria
    for (let i = 0; i < meshVertices.length; i++) {
      const vertex = meshVertices[i];
      
      if (this.shouldRefine(vertex, criteria)) {
        // Subdivide this vertex area
        const subdivided = this.subdivideVertex(vertex, meshVertices, indices, i);
        refinedVertices.push(...subdivided);
        
        // Map original to refined indices
        const startIndex = refinedVertices.length - subdivided.length;
        for (let j = 0; j < subdivided.length; j++) {
          refinementMap.set(i, startIndex + j);
        }
      } else {
        // Keep original vertex
        refinedVertices.push(vertex);
        refinementMap.set(i, refinedVertices.length - 1);
      }
    }

    // Rebuild indices with refinement mapping
    const newIndices = this.rebuildIndices(indices, refinementMap);

    // Convert back to typed arrays
    const vertexArray = new Float32Array(refinedVertices.length * 9); // pos(3) + normal(3) + curvature(1) + importance(1) + level(1)
    for (let i = 0; i < refinedVertices.length; i++) {
      const v = refinedVertices[i];
      const base = i * 9;
      vertexArray[base] = v.position[0];
      vertexArray[base + 1] = v.position[1];
      vertexArray[base + 2] = v.position[2];
      vertexArray[base + 3] = v.normal[0];
      vertexArray[base + 4] = v.normal[1];
      vertexArray[base + 5] = v.normal[2];
      vertexArray[base + 6] = v.curvature;
      vertexArray[base + 7] = v.importance;
    }

    return {
      vertices: vertexArray,
      indices: new Uint32Array(newIndices),
      refinementMap
    };
  }

  private processVertices(vertices: Float32Array, indices: Uint32Array): MeshVertex[] {
    const meshVertices: MeshVertex[] = [];
    
    for (let i = 0; i < vertices.length; i += 3) {
      meshVertices.push({
        position: [vertices[i], vertices[i + 1], vertices[i + 2]],
        normal: [0, 0, 0], // Will be calculated
        curvature: 0,
        importance: 0
      });
    }
    
    return meshVertices;
  }

  private calculateCurvature(vertices: MeshVertex[], indices: Uint32Array): void {
    // Discrete mean curvature calculation using cotangent weights
    for (let i = 0; i < vertices.length; i++) {
      let curvature = 0;
      const neighbors = this.findVertexNeighbors(i, indices);
      
      if (neighbors.length > 2) {
        const vertex = vertices[i];
        let weightSum = 0;
        
        for (let j = 0; j < neighbors.length; j++) {
          const n1 = vertices[neighbors[j]];
          const n2 = vertices[neighbors[(j + 1) % neighbors.length]];
          
          // Cotangent weight calculation
          const cotWeight = this.calculateCotangentWeight(vertex.position, n1.position, n2.position);
          curvature += cotWeight * this.vectorDistance(vertex.position, n1.position);
          weightSum += cotWeight;
        }
        
        vertices[i].curvature = weightSum > 0 ? Math.abs(curvature / weightSum) : 0;
      }
    }
  }

  private calculateImportance(vertices: MeshVertex[], viewportFactor: number): void {
    // Calculate importance based on distance to camera and screen space projection
    const cameraPosition: [number, number, number] = [0, 0, 10]; // Assumed camera position
    
    for (const vertex of vertices) {
      const distance = this.vectorDistance(vertex.position, cameraPosition);
      const screenImportance = 1.0 / (1.0 + distance * 0.1); // Closer = more important
      
      // Combine with viewport factor
      vertex.importance = screenImportance * viewportFactor;
    }
  }

  private shouldRefine(vertex: MeshVertex, criteria: RefinementCriteria): boolean {
    return vertex.curvature > criteria.maxCurvature || 
           vertex.importance > criteria.minImportance;
  }

  private subdivideVertex(
    vertex: MeshVertex, 
    allVertices: MeshVertex[], 
    indices: Uint32Array, 
    vertexIndex: number
  ): MeshVertex[] {
    // Simple subdivision - create 4 vertices from 1 (similar to Catmull-Clark)
    const neighbors = this.findVertexNeighbors(vertexIndex, indices);
    const subdivided: MeshVertex[] = [vertex]; // Keep original
    
    // Create edge midpoints
    for (const neighborIndex of neighbors) {
      const neighbor = allVertices[neighborIndex];
      const midpoint: MeshVertex = {
        position: [
          (vertex.position[0] + neighbor.position[0]) * 0.5,
          (vertex.position[1] + neighbor.position[1]) * 0.5,
          (vertex.position[2] + neighbor.position[2]) * 0.5
        ],
        normal: [
          (vertex.normal[0] + neighbor.normal[0]) * 0.5,
          (vertex.normal[1] + neighbor.normal[1]) * 0.5,
          (vertex.normal[2] + neighbor.normal[2]) * 0.5
        ],
        curvature: (vertex.curvature + neighbor.curvature) * 0.5,
        importance: Math.max(vertex.importance, neighbor.importance)
      };
      
      subdivided.push(midpoint);
    }
    
    return subdivided;
  }

  private findVertexNeighbors(vertexIndex: number, indices: Uint32Array): number[] {
    const neighbors = new Set<number>();
    
    for (let i = 0; i < indices.length; i += 3) {
      const triangle = [indices[i], indices[i + 1], indices[i + 2]];
      const vertexPos = triangle.indexOf(vertexIndex);
      
      if (vertexPos !== -1) {
        // Add other vertices in this triangle
        for (let j = 0; j < 3; j++) {
          if (j !== vertexPos) {
            neighbors.add(triangle[j]);
          }
        }
      }
    }
    
    return Array.from(neighbors);
  }

  private calculateCotangentWeight(
    center: [number, number, number],
    p1: [number, number, number],
    p2: [number, number, number]
  ): number {
    // Vector from center to p1 and p2
    const v1 = this.vectorSubtract(p1, center);
    const v2 = this.vectorSubtract(p2, center);
    
    const dot = this.vectorDot(v1, v2);
    const cross = this.vectorCross(v1, v2);
    const crossLength = this.vectorLength(cross);
    
    // Cotangent = cos/sin = dot/(cross magnitude)
    return crossLength > 0 ? dot / crossLength : 0;
  }

  private rebuildIndices(originalIndices: Uint32Array, refinementMap: Map<number, number>): number[] {
    const newIndices: number[] = [];
    
    for (let i = 0; i < originalIndices.length; i += 3) {
      const v1 = originalIndices[i];
      const v2 = originalIndices[i + 1];
      const v3 = originalIndices[i + 2];
      
      const newV1 = refinementMap.get(v1) ?? v1;
      const newV2 = refinementMap.get(v2) ?? v2;
      const newV3 = refinementMap.get(v3) ?? v3;
      
      newIndices.push(newV1, newV2, newV3);
    }
    
    return newIndices;
  }

  // Vector utility functions
  private vectorDistance(a: [number, number, number], b: [number, number, number]): number {
    return Math.sqrt(
      (a[0] - b[0]) ** 2 + 
      (a[1] - b[1]) ** 2 + 
      (a[2] - b[2]) ** 2
    );
  }

  private vectorSubtract(a: [number, number, number], b: [number, number, number]): [number, number, number] {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  }

  private vectorDot(a: [number, number, number], b: [number, number, number]): number {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  private vectorCross(a: [number, number, number], b: [number, number, number]): [number, number, number] {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
  }

  private vectorLength(v: [number, number, number]): number {
    return Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
  }
}

export const adaptiveMeshRefinement = new AdaptiveMeshRefinement();

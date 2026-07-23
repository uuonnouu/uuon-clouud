#!/usr/bin/env tsx
/**
 * Shape Relationship Discovery Engine
 * Automatically discovers and catalogs mathematical relationships between shapes
 */

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { formula_implementations } from '../shared/schema';

const connectionString = process.env.DATABASE_URL!;
const sql = neon(connectionString);
const db = drizzle(sql);

export class ShapeRelationshipEngine {
  private relationships: Map<string, string[]> = new Map();

  async discoverAllRelationships(): Promise<void> {
    console.log('🔗 Discovering mathematical shape relationships...');

    // Get all shapes from database
    const allShapes = await db.select().from(formula_implementations);
    
    // Mathematical relationship categories
    await this.discoverTopologicalRelationships(allShapes);
    await this.discoverDimensionalRelationships(allShapes);
    await this.discoverSymmetryGroupRelationships(allShapes);
    await this.discoverApplicationBasedRelationships(allShapes);
    await this.discoverComplexityProgression(allShapes);

    console.log(`✅ Discovered relationships for ${this.relationships.size} shapes`);
  }

  private async discoverTopologicalRelationships(shapes: any[]): Promise<void> {
    // Group shapes by topological properties
    const genusGroups = {
      genus_0: ['sphere', 'cube', 'tetrahedron', 'octahedron', 'icosahedron'],
      genus_1: ['torus', 'trefoil_knot', 'hopf_link'],
      genus_2: ['double_torus', 'pretzel_surface'],
      non_orientable: ['klein_bottle', 'mobius_strip', 'real_projective_plane']
    };

    Object.entries(genusGroups).forEach(([category, shapeList]) => {
      shapeList.forEach(shape => {
        const related = shapeList.filter(s => s !== shape);
        this.addRelationships(shape, related);
      });
    });
  }

  private async discoverDimensionalRelationships(shapes: any[]): Promise<void> {
    const dimensionalChains = [
      ['point', 'line', 'square', 'cube', 'tesseract_4d', 'penteract_5d'],
      ['circle', 'sphere', 'hypersphere_4d', 'hypersphere_5d'],
      ['triangle', 'tetrahedron', 'simplex_4d', 'simplex_5d']
    ];

    dimensionalChains.forEach(chain => {
      chain.forEach((shape, index) => {
        const related = [
          ...(index > 0 ? [chain[index - 1]] : []),
          ...(index < chain.length - 1 ? [chain[index + 1]] : [])
        ];
        this.addRelationships(shape, related);
      });
    });
  }

  private async discoverSymmetryGroupRelationships(shapes: any[]): Promise<void> {
    const symmetryGroups = {
      platonic_solids: ['tetrahedron', 'cube', 'octahedron', 'dodecahedron', 'icosahedron'],
      archimedean_solids: ['truncated_icosahedron', 'snub_cube', 'rhombicuboctahedron'],
      chakra_geometry: ['root_chakra', 'sacral_chakra', 'solar_plexus_chakra', 'heart_chakra', 'throat_chakra', 'third_eye_chakra', 'crown_chakra']
    };

    Object.values(symmetryGroups).forEach(group => {
      group.forEach(shape => {
        const related = group.filter(s => s !== shape);
        this.addRelationships(shape, related);
      });
    });
  }

  private async discoverApplicationBasedRelationships(shapes: any[]): Promise<void> {
    const applicationGroups = {
      medical_tpms: ['gyroid_tpms', 'diamond_tpms', 'primitive_tpms', 'iws_tpms'],
      physics_equations: ['einstein_field_equations', 'schrodinger_wave_equation', 'maxwell_equations', 'navier_stokes_equations'],
      quantum_orbitals: ['hydrogen_1s_orbital', 'hydrogen_2p_orbital', 'hydrogen_3d_orbital', 'hydrogen_4f_orbital'],
      biological_structures: ['dna_double_helix', 'protein_alpha_helix', 'cell_membrane', 'mitochondria']
    };

    Object.values(applicationGroups).forEach(group => {
      group.forEach(shape => {
        const related = group.filter(s => s !== shape);
        this.addRelationships(shape, related);
      });
    });
  }

  private async discoverComplexityProgression(shapes: any[]): Promise<void> {
    // Progressive complexity chains
    const complexityChains = [
      ['sphere', 'torus', 'klein_bottle', 'tesseract_4d'],
      ['triangle', 'tetrahedron', 'stella_octangula', 'compound_of_five_tetrahedra'],
      ['circle', 'sphere', 'hopf_fibration', 'quaternion_rotation']
    ];

    complexityChains.forEach(chain => {
      chain.forEach((shape, index) => {
        const related = chain.slice(Math.max(0, index - 1), index + 2).filter(s => s !== shape);
        this.addRelationships(shape, related);
      });
    });
  }

  private addRelationships(shape: string, related: string[]): void {
    if (!this.relationships.has(shape)) {
      this.relationships.set(shape, []);
    }
    const existing = this.relationships.get(shape)!;
    related.forEach(rel => {
      if (!existing.includes(rel)) {
        existing.push(rel);
      }
    });
  }

  getRelationships(): Map<string, string[]> {
    return this.relationships;
  }
}

export const relationshipEngine = new ShapeRelationshipEngine();

#!/usr/bin/env tsx
/**
 * SHAPE PLACEHOLDER DETECTOR & FORMULA FIXER
 * Detects all shapes rendering as cube/sphere placeholders and provides mathematical implementations
 */

import { promises as fs } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Fix ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface PlaceholderShape {
  id: string;
  category: string;
  displayName: string;
  placeholderType: 'sphere' | 'cube' | 'unknown';
  suggestedFormula: string;
  complexity: 'basic' | 'advanced' | 'expert';
  priority: number;
}

export class ShapePlaceholderDetector {
  private registeredShapes = new Set<string>();
  private implementedShapes = new Set<string>();
  private placeholderShapes: PlaceholderShape[] = [];

  async detectAllPlaceholders(): Promise<void> {
    console.log('🔍 Detecting shapes with placeholder implementations...');
    
    // Load all registered shapes from categories
    await this.loadRegisteredShapes();
    
    // Load implemented shapes from unified shapes
    await this.loadImplementedShapes();
    
    // Cross-reference to find placeholders
    await this.identifyPlaceholders();
    
    // Generate mathematical formulas for each placeholder
    await this.generateFormulas();
    
    console.log(`📊 Found ${this.placeholderShapes.length} shapes using placeholders`);
  }

  private async loadRegisteredShapes(): Promise<void> {
    try {
      const categoriesPath = resolve(__dirname, '../client/src/lib/shapeCategories.ts');
      const categoriesContent = await fs.readFile(categoriesPath, 'utf-8');
      
      // Extract all shape names from categories
      const shapeArrayMatches = categoriesContent.match(/shapes:\s*\[([\s\S]*?)\]/g);
      
      if (shapeArrayMatches) {
        shapeArrayMatches.forEach(match => {
          const shapeStrings = match.match(/"([^"]+)"/g);
          if (shapeStrings) {
            shapeStrings.forEach(shapeString => {
              const shapeName = shapeString.replace(/"/g, '');
              if (this.isValidShapeName(shapeName)) {
                this.registeredShapes.add(shapeName);
              }
            });
          }
        });
      }
      
      console.log(`✅ Found ${this.registeredShapes.size} registered shapes`);
    } catch (error) {
      console.error('❌ Failed to load registered shapes:', error);
    }
  }

  private async loadImplementedShapes(): Promise<void> {
    try {
      const unifiedShapesPath = resolve(__dirname, '../client/src/lib/unifiedShapes.ts');
      const unifiedContent = await fs.readFile(unifiedShapesPath, 'utf-8');
      
      // Extract all implemented shape keys with actual equations
      const implementationMatches = unifiedContent.match(/(\w+):\s*{[\s\S]*?equation:\s*\(/g);
      
      if (implementationMatches) {
        implementationMatches.forEach(match => {
          const shapeId = match.split(':')[0].trim();
          this.implementedShapes.add(shapeId);
        });
      }
      
      console.log(`✅ Found ${this.implementedShapes.size} implemented shapes`);
    } catch (error) {
      console.error('❌ Failed to load implemented shapes:', error);
    }
  }

  private async identifyPlaceholders(): Promise<void> {
    this.registeredShapes.forEach(shapeId => {
      if (!this.implementedShapes.has(shapeId)) {
        const category = this.getCategoryForShape(shapeId);
        const placeholderType = this.detectPlaceholderType(shapeId);
        const complexity = this.getComplexityLevel(shapeId);
        const priority = this.getPriorityLevel(shapeId, category);

        this.placeholderShapes.push({
          id: shapeId,
          category,
          displayName: this.getDisplayName(shapeId),
          placeholderType,
          suggestedFormula: '',
          complexity,
          priority
        });
      }
    });

    // Sort by priority (highest first)
    this.placeholderShapes.sort((a, b) => b.priority - a.priority);
  }

  private detectPlaceholderType(shapeId: string): 'sphere' | 'cube' | 'unknown' {
    const shapeLower = shapeId.toLowerCase();
    
    // Shapes that would naturally render as sphere placeholder
    if (shapeLower.includes('sphere') || shapeLower.includes('ball') || 
        shapeLower.includes('orbital') || shapeLower.includes('atom') ||
        shapeLower.includes('bubble') || shapeLower.includes('droplet')) {
      return 'sphere';
    }
    
    // Shapes that would naturally render as cube placeholder
    if (shapeLower.includes('cube') || shapeLower.includes('box') || 
        shapeLower.includes('crystal') || shapeLower.includes('lattice') ||
        shapeLower.includes('grid') || shapeLower.includes('voxel')) {
      return 'cube';
    }
    
    return 'unknown';
  }

  private async generateFormulas(): Promise<void> {
    this.placeholderShapes = this.placeholderShapes.map(shape => ({
      ...shape,
      suggestedFormula: this.generateFormulaImplementation(shape)
    }));
  }

  private generateFormulaImplementation(shape: PlaceholderShape): string {
    const { id, category, complexity } = shape;
    
    switch (category) {
      case 'quantum-computing':
        return this.generateQuantumFormula(id, complexity);
      case 'topology-differential':
        return this.generateTopologyFormula(id, complexity);
      case 'fractal-analysis':
        return this.generateFractalFormula(id, complexity);
      case 'general-relativity':
        return this.generateRelativityFormula(id, complexity);
      case 'biological-systems':
        return this.generateBiologyFormula(id, complexity);
      case 'sacred-geometry':
        return this.generateSacredGeometryFormula(id, complexity);
      case 'molecular-biology':
        return this.generateMolecularFormula(id, complexity);
      case 'crystallography':
        return this.generateCrystalFormula(id, complexity);
      default:
        return this.generateGenericFormula(id, complexity);
    }
  }

  private generateQuantumFormula(id: string, complexity: string): string {
    const displayName = this.getDisplayName(id);
    
    return `  ${id}: {
    name: "${displayName}",
    equation: (u, v, params) => {
      const { a = 1, b = 1, c = 1, d = 0, g = 0.618 } = params;
      
      // Quantum state visualization using spherical harmonics
      const theta = u * Math.PI;      // Polar angle [0, π]
      const phi = v * 2 * Math.PI;    // Azimuthal angle [0, 2π]
      
      // Quantum probability amplitude modulation
      const Y_lm = Math.sqrt((2 * Math.abs(Math.sin(theta)) + 1) / (4 * Math.PI)) * 
                   Math.exp(1i * Math.abs(phi) * d);
      
      // Radial component with quantum numbers
      const R_nl = a * Math.exp(-b * theta / 2) * Math.pow(theta, Math.abs(d));
      
      const radius = R_nl * (1 + 0.1 * Math.cos(b * theta + d * phi));
      
      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = c * radius * Math.cos(theta) + g * Math.sin(2 * theta);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1.0,    // Base quantum radius
      b: 2.0,    // Quantum number modulation
      c: 1.0,    // Z-axis scaling
      d: 1.0,    // Phase quantum number
      g: 0.618   // Golden ratio harmonic
    })
  }`;
  }

  private generateTopologyFormula(id: string, complexity: string): string {
    const displayName = this.getDisplayName(id);
    
    return `  ${id}: {
    name: "${displayName}",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 1, d = 0, g = 0.618 } = params;
      
      // Topological surface with genus and handle modifications
      const u_param = u * 2 * Math.PI;  // Parameter u ∈ [0, 2π]
      const v_param = v * Math.PI;      // Parameter v ∈ [0, π]
      
      // Base surface with topological invariants
      const genus_mod = 1 + Math.floor(Math.abs(d)) % 3; // Genus 0, 1, or 2
      const r = a + b * Math.cos(genus_mod * v_param + d * u_param);
      
      // Apply topological deformation
      const topo_x = r * Math.cos(u_param) * Math.sin(v_param);
      const topo_y = r * Math.sin(u_param) * Math.sin(v_param);
      const topo_z = c * r * Math.cos(v_param) + 
                     g * b * Math.sin(genus_mod * u_param) * Math.cos(2 * v_param);
      
      // Handle attachment for higher genus
      if (genus_mod > 1) {
        const handle_x = 0.3 * b * Math.cos(3 * u_param) * Math.sin(v_param);
        const handle_y = 0.3 * b * Math.sin(3 * u_param) * Math.sin(v_param);
        return [topo_x + handle_x, topo_y + handle_y, topo_z];
      }
      
      return [topo_x, topo_y, topo_z];
    },
    defaultParams: getCleanDefaults({
      a: 2.0,    // Major radius
      b: 0.6,    // Topological modulation
      c: 1.0,    // Vertical scaling
      d: 1.0,    // Genus parameter
      g: 0.618   // Golden ratio proportion
    })
  }`;
  }

  private generateFractalFormula(id: string, complexity: string): string {
    const displayName = this.getDisplayName(id);
    
    return `  ${id}: {
    name: "${displayName}",
    equation: (u, v, params) => {
      const { a = 2, b = 1.5, k = 4, j = 0.5, g = 0.618 } = params;
      
      // Fractal surface with self-similar structure
      const x = (u - 0.5) * a;
      const y = (v - 0.5) * a;
      
      // Multi-scale fractal height function
      let z = 0;
      let amplitude = j;
      let frequency = b;
      
      for (let i = 0; i < Math.floor(k); i++) {
        // Fractal noise with lacunarity
        const noise = Math.sin(frequency * x + g * frequency * y) * 
                     Math.cos(frequency * y - g * frequency * x);
        z += amplitude * noise;
        
        // Update parameters for next octave
        amplitude *= 0.5;  // Decrease amplitude
        frequency *= 2.0;  // Increase frequency
      }
      
      // Add golden ratio spiral modulation
      const spiral_r = Math.sqrt(x * x + y * y);
      const spiral_theta = Math.atan2(y, x);
      z += g * 0.1 * Math.sin(spiral_r * 3 + spiral_theta * 1.618);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 2.0,    // Base scale
      b: 1.5,    // Frequency multiplier
      k: 4,      // Fractal octaves
      j: 0.5,    // Initial amplitude
      g: 0.618   // Golden ratio modulation
    })
  }`;
  }

  private generateRelativityFormula(id: string, complexity: string): string {
    const displayName = this.getDisplayName(id);
    
    return `  ${id}: {
    name: "${displayName}",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 1, d = 0.1, g = 0.618 } = params;
      
      // Spacetime curvature visualization
      const r_coord = u * a;  // Radial coordinate
      const theta = v * Math.PI;  // Polar coordinate
      
      // Schwarzschild radius for visualization
      const rs = 2 * d;  // Event horizon scale
      
      // Metric tensor component g_rr = (1 - rs/r)^(-1)
      const metric_factor = Math.max(0.1, 1 - rs / Math.max(r_coord, rs + 0.1));
      
      // Embedding diagram coordinates
      const rho = r_coord * Math.sqrt(metric_factor);
      const phi = theta * 2; // Full rotation
      
      // 3D embedding of curved spacetime
      const x = rho * Math.cos(phi);
      const y = rho * Math.sin(phi);
      
      // Height represents spacetime curvature
      let z = 0;
      if (r_coord > rs) {
        z = -b * Math.sqrt(r_coord - rs) + c * r_coord * metric_factor;
      } else {
        // Inside event horizon - complex behavior
        z = -b * Math.sqrt(rs) * Math.sin(g * r_coord / rs);
      }
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 3.0,    // Spatial scale
      b: 1.0,    // Curvature amplitude
      c: 0.1,    // Metric deviation
      d: 0.5,    // Mass parameter (Schwarzschild radius)
      g: 0.618   // Golden ratio harmonic
    })
  }`;
  }

  private generateBiologyFormula(id: string, complexity: string): string {
    const displayName = this.getDisplayName(id);
    
    return `  ${id}: {
    name: "${displayName}",
    equation: (u, v, params) => {
      const { a = 1, b = 1, c = 1, d = 1, g = 0.618 } = params;
      
      // Biological form using logarithmic spiral and growth patterns
      const t = u * 2 * Math.PI;  // Time/angle parameter
      const s = v;  // Growth parameter [0, 1]
      
      // Logarithmic spiral (common in biology)
      const spiral_a = a * g;  // Golden ratio scaling
      const radius = spiral_a * Math.exp(b * t / (2 * Math.PI));
      
      // Base spiral coordinates
      const spiral_x = radius * Math.cos(t);
      const spiral_y = radius * Math.sin(t);
      
      // Biological growth modulation
      const growth_factor = Math.pow(s, c);  // Non-linear growth
      
      // Organic undulation (cell membrane-like)
      const undulation = d * 0.1 * Math.sin(8 * t) * Math.cos(4 * t + s * Math.PI);
      
      // 3D biological form
      const x = growth_factor * (spiral_x + undulation * Math.cos(t + Math.PI/2));
      const y = growth_factor * (spiral_y + undulation * Math.sin(t + Math.PI/2));
      const z = c * growth_factor * Math.sin(2 * t) + g * s * Math.cos(3 * t);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1.0,    // Base scale
      b: 0.5,    // Spiral tightness
      c: 1.2,    // Growth exponent
      d: 1.0,    // Undulation amplitude
      g: 0.618   // Golden ratio growth
    })
  }`;
  }

  private generateSacredGeometryFormula(id: string, complexity: string): string {
    const displayName = this.getDisplayName(id);
    
    return `  ${id}: {
    name: "${displayName}",
    equation: (u, v, params) => {
      const { a = 1, b = 1, c = 1, g = 0.618, h = 5 } = params;
      
      // Sacred geometry using golden ratio and divine proportions
      const phi = 1.618033988749895;  // Golden ratio
      const theta = u * 2 * Math.PI;  // Angular parameter
      const rho = v * a;  // Radial parameter
      
      // Pentagonal/decagonal symmetry (common in sacred geometry)
      const n_fold = Math.floor(h) || 5;  // 5-fold symmetry default
      const angle_step = 2 * Math.PI / n_fold;
      
      // Golden ratio spiral
      const spiral_radius = rho * Math.pow(phi, theta / (2 * Math.PI));
      
      // Sacred geometry petals/points
      let x = 0, y = 0, z = 0;
      
      for (let i = 0; i < n_fold; i++) {
        const petal_angle = theta + i * angle_step;
        const petal_radius = spiral_radius * (1 + g * Math.cos(n_fold * theta));
        
        // Individual petal coordinates
        const px = petal_radius * Math.cos(petal_angle);
        const py = petal_radius * Math.sin(petal_angle);
        const pz = c * Math.sin(n_fold * theta) * Math.cos(i * angle_step);
        
        // Weighted sum of all petals
        const weight = Math.exp(-Math.pow(petal_angle - theta, 2) / (2 * Math.pow(angle_step, 2)));
        x += weight * px;
        y += weight * py;
        z += weight * pz;
      }
      
      // Normalize and apply golden ratio scaling
      const norm = Math.sqrt(x*x + y*y + z*z) || 1;
      return [
        b * x / norm * spiral_radius,
        b * y / norm * spiral_radius,
        c * z / norm + g * Math.sin(phi * theta)
      ];
    },
    defaultParams: getCleanDefaults({
      a: 1.0,    // Base radius
      b: 1.0,    // Overall scaling
      c: 0.5,    // Z-axis modulation
      g: 0.618,  // Golden ratio parameter
      h: 5       // Sacred number (pentagonal symmetry)
    })
  }`;
  }

  private generateMolecularFormula(id: string, complexity: string): string {
    const displayName = this.getDisplayName(id);
    
    return `  ${id}: {
    name: "${displayName}",
    equation: (u, v, params) => {
      const { a = 1, b = 1, c = 1, d = 1, e = 0 } = params;
      
      // Molecular structure using bond angles and lengths
      const bond_angle = 109.5 * Math.PI / 180;  // Tetrahedral angle
      const t = u * 2 * Math.PI;  // Rotation parameter
      const height = v * c;  // Height along molecular axis
      
      // Base molecular radius with bond length variations
      const base_radius = a * (1 + b * 0.1 * Math.cos(4 * t + e));
      
      // Tetrahedral/octahedral coordination
      const coordination_x = base_radius * Math.cos(t) * Math.sin(bond_angle);
      const coordination_y = base_radius * Math.sin(t) * Math.sin(bond_angle);
      const coordination_z = height + d * base_radius * Math.cos(bond_angle);
      
      // Electron density modulation (quantum mechanical)
      const electron_density = Math.exp(-Math.pow(base_radius / a, 2));
      const density_x = coordination_x * electron_density;
      const density_y = coordination_y * electron_density;
      const density_z = coordination_z + 0.2 * a * Math.sin(6 * t) * electron_density;
      
      return [density_x, density_y, density_z];
    },
    defaultParams: getCleanDefaults({
      a: 1.0,    // Molecular radius
      b: 1.0,    // Bond variation
      c: 2.0,    // Molecular height
      d: 0.5,    // Coordination scaling
      e: 0.0     // Phase offset
    })
  }`;
  }

  private generateCrystalFormula(id: string, complexity: string): string {
    const displayName = this.getDisplayName(id);
    
    return `  ${id}: {
    name: "${displayName}",
    equation: (u, v, params) => {
      const { a = 1, b = 1, c = 1, d = 4, g = 0.618 } = params;
      
      // Crystal lattice structure
      const lattice_param_a = a;  // Lattice parameter a
      const lattice_param_c = c;  // Lattice parameter c
      const n_faces = Math.floor(Math.max(3, d)) || 4;  // Crystal faces
      
      const theta = u * 2 * Math.PI;  // Azimuthal angle
      const phi = v * Math.PI;       // Polar angle
      
      // Crystal face generation
      let x = 0, y = 0, z = 0;
      
      // Generate crystal faces using Miller indices
      for (let i = 0; i < n_faces; i++) {
        const face_angle = (2 * Math.PI * i) / n_faces;
        const miller_h = Math.cos(face_angle);
        const miller_k = Math.sin(face_angle);
        const miller_l = g * Math.sin(2 * face_angle);
        
        // Distance from face plane
        const d_hkl = lattice_param_a / Math.sqrt(miller_h*miller_h + miller_k*miller_k + miller_l*miller_l);
        
        // Face contribution
        const face_contribution = Math.max(0, d_hkl - 
          Math.abs(lattice_param_a * Math.cos(theta + face_angle) + 
                   lattice_param_a * Math.sin(phi + face_angle) + 
                   lattice_param_c * miller_l * Math.cos(phi)));
        
        x += face_contribution * miller_h * Math.sin(phi) * Math.cos(theta);
        y += face_contribution * miller_k * Math.sin(phi) * Math.sin(theta);
        z += face_contribution * miller_l * Math.cos(phi);
      }
      
      // Apply crystal symmetry and golden ratio scaling
      return [
        b * x + g * 0.1 * Math.cos(n_faces * theta),
        b * y + g * 0.1 * Math.sin(n_faces * theta),
        c * z + g * 0.1 * Math.sin(2 * phi)
      ];
    },
    defaultParams: getCleanDefaults({
      a: 1.0,    // Lattice parameter a
      b: 1.0,    // Overall scaling
      c: 1.2,    // Lattice parameter c
      d: 6,      // Number of crystal faces
      g: 0.618   // Golden ratio modulation
    })
  }`;
  }

  private generateGenericFormula(id: string, complexity: string): string {
    const displayName = this.getDisplayName(id);
    
    return `  ${id}: {
    name: "${displayName}",
    equation: (u, v, params) => {
      const { a = 1, b = 1, c = 1, d = 0, g = 0.618 } = params;
      
      // Generic parametric surface with golden ratio harmonics
      const u_scaled = u * 2 * Math.PI;
      const v_scaled = v * Math.PI;
      
      // Base parametric equations
      const base_x = a * Math.cos(u_scaled) * Math.sin(v_scaled);
      const base_y = b * Math.sin(u_scaled) * Math.sin(v_scaled);
      const base_z = c * Math.cos(v_scaled);
      
      // Golden ratio modulation for aesthetic appeal
      const golden_mod_x = g * 0.1 * Math.cos(1.618 * u_scaled + d);
      const golden_mod_y = g * 0.1 * Math.sin(1.618 * v_scaled + d);
      const golden_mod_z = g * 0.1 * Math.sin(0.618 * (u_scaled + v_scaled) + d);
      
      return [
        base_x + golden_mod_x,
        base_y + golden_mod_y,
        base_z + golden_mod_z
      ];
    },
    defaultParams: getCleanDefaults({
      a: 1.0,    // X-axis scaling
      b: 1.0,    // Y-axis scaling  
      c: 1.0,    // Z-axis scaling
      d: 0.0,    // Phase offset
      g: 0.618   // Golden ratio parameter
    })
  }`;
  }

  // Helper methods
  private isValidShapeName(name: string): boolean {
    return name.length > 2 && 
           name.includes('_') && 
           !name.includes(' ') && 
           !/^[A-Z_]+$/.test(name) && 
           !name.startsWith('use') && 
           !name.startsWith('get');
  }

  private getCategoryForShape(shapeId: string): string {
    const shapeLower = shapeId.toLowerCase();
    
    if (shapeLower.includes('quantum') || shapeLower.includes('qubit')) {
      return 'quantum-computing';
    }
    if (shapeLower.includes('topology') || shapeLower.includes('knot') || shapeLower.includes('klein')) {
      return 'topology-differential';
    }
    if (shapeLower.includes('fractal') || shapeLower.includes('mandel') || shapeLower.includes('julia')) {
      return 'fractal-analysis';
    }
    if (shapeLower.includes('einstein') || shapeLower.includes('relativity') || shapeLower.includes('black_hole')) {
      return 'general-relativity';
    }
    if (shapeLower.includes('dna') || shapeLower.includes('protein') || shapeLower.includes('cell')) {
      return 'biological-systems';
    }
    if (shapeLower.includes('chakra') || shapeLower.includes('sacred') || shapeLower.includes('golden')) {
      return 'sacred-geometry';
    }
    if (shapeLower.includes('molecule') || shapeLower.includes('atom') || shapeLower.includes('bond')) {
      return 'molecular-biology';
    }
    if (shapeLower.includes('crystal') || shapeLower.includes('lattice') || shapeLower.includes('diamond')) {
      return 'crystallography';
    }
    
    return 'miscellaneous';
  }

  private getComplexityLevel(shapeId: string): 'basic' | 'advanced' | 'expert' {
    const shapeLower = shapeId.toLowerCase();
    
    if (shapeLower.includes('basic') || shapeLower.includes('simple') || shapeLower.includes('elementary')) {
      return 'basic';
    }
    if (shapeLower.includes('quantum') || shapeLower.includes('4d') || shapeLower.includes('hyperdimensional')) {
      return 'expert';
    }
    
    return 'advanced';
  }

  private getPriorityLevel(shapeId: string, category: string): number {
    // Higher priority for more commonly used categories
    const categoryPriority: Record<string, number> = {
      'quantum-computing': 10,
      'general-relativity': 9,
      'topology-differential': 8,
      'fractal-analysis': 7,
      'biological-systems': 6,
      'sacred-geometry': 5,
      'molecular-biology': 4,
      'crystallography': 3,
      'miscellaneous': 1
    };
    
    return categoryPriority[category] || 1;
  }

  private getDisplayName(shapeId: string): string {
    return shapeId
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  async generateImplementationFile(): Promise<void> {
    const implementations = this.placeholderShapes
      .slice(0, 50) // Limit to top 50 priorities
      .map(shape => shape.suggestedFormula)
      .join(',\n\n');

    const fileContent = `/**
 * AUTO-GENERATED PLACEHOLDER FIX IMPLEMENTATIONS
 * Generated: ${new Date().toISOString()}
 * Fixes: ${Math.min(50, this.placeholderShapes.length)} placeholder shapes
 */

import { getCleanDefaults } from './parametricSurfacesClean';

export const PLACEHOLDER_FIXES = {
${implementations}
};

console.log(\`🔧 Loaded \${Object.keys(PLACEHOLDER_FIXES).length} placeholder fixes\`);
`;

    await fs.writeFile(resolve(__dirname, '../client/src/lib/placeholderFixes.ts'), fileContent);
    console.log('📄 Generated placeholder fixes file');
  }

  async generateDetailedReport(): Promise<void> {
    const report = {
      timestamp: new Date().toISOString(),
      totalRegistered: this.registeredShapes.size,
      totalImplemented: this.implementedShapes.size,
      totalPlaceholders: this.placeholderShapes.length,
      placeholdersByCategory: this.groupPlaceholdersByCategory(),
      placeholdersByType: this.groupPlaceholdersByType(),
      highPriorityShapes: this.placeholderShapes.filter(s => s.priority >= 7),
      shapes: this.placeholderShapes
    };

    await fs.writeFile(resolve(__dirname, '../PLACEHOLDER_ANALYSIS_REPORT.json'), JSON.stringify(report, null, 2));
    console.log('📊 Generated detailed placeholder analysis report');
  }

  private groupPlaceholdersByCategory(): Record<string, number> {
    const grouped: Record<string, number> = {};
    this.placeholderShapes.forEach(shape => {
      grouped[shape.category] = (grouped[shape.category] || 0) + 1;
    });
    return grouped;
  }

  private groupPlaceholdersByType(): Record<string, number> {
    const grouped: Record<string, number> = {};
    this.placeholderShapes.forEach(shape => {
      grouped[shape.placeholderType] = (grouped[shape.placeholderType] || 0) + 1;
    });
    return grouped;
  }

  getPlaceholderShapes(): PlaceholderShape[] {
    return this.placeholderShapes;
  }
}

// CLI execution for ES modules
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    try {
      const detector = new ShapePlaceholderDetector();
      await detector.detectAllPlaceholders();
      await detector.generateImplementationFile();
      await detector.generateDetailedReport();
      
      const placeholders = detector.getPlaceholderShapes();
      console.log('\n🎯 PLACEHOLDER DETECTION SUMMARY:');
      console.log(`Total placeholders detected: ${placeholders.length}`);
      console.log(`High priority fixes: ${placeholders.filter(s => s.priority >= 7).length}`);
      console.log('Generated: placeholderFixes.ts and PLACEHOLDER_ANALYSIS_REPORT.json');
    } catch (error) {
      console.error('❌ Shape placeholder detection failed:', error);
      process.exit(1);
    }
  })();
}

export { ShapePlaceholderDetector };

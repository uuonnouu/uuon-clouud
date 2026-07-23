
/**
 * ESSENTIAL SHAPES API - Bare Minimum Mathematical Core
 * Provides fundamental shape algorithms for all computer systems
 * Ultra-lightweight, data-efficient, learning-focused
 */

import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

// Core essential shapes - the mathematical building blocks every system needs
const ESSENTIAL_SHAPES_CORE = {
  // Basic Primitives (6 shapes - geometric foundations)
  sphere: {
    equation: "x=r·sin(φ)·cos(θ), y=r·sin(φ)·sin(θ), z=r·cos(φ)",
    params: ["r"],
    complexity: 1,
    use_cases: ["3D basics", "collision detection", "volume calculations"]
  },
  cube: {
    equation: "vertices: (±a,±a,±a)",
    params: ["a"],
    complexity: 1,
    use_cases: ["voxel systems", "3D grids", "basic modeling"]
  },
  cylinder: {
    equation: "x=r·cos(θ), y=r·sin(θ), z=h·t",
    params: ["r", "h"],
    complexity: 1,
    use_cases: ["pipes", "columns", "rotation surfaces"]
  },
  cone: {
    equation: "x=r·(1-t)·cos(θ), y=r·(1-t)·sin(θ), z=h·t",
    params: ["r", "h"],
    complexity: 1,
    use_cases: ["pyramids", "funnels", "light cones"]
  },
  torus: {
    equation: "x=(R+r·cos(v))·cos(u), y=(R+r·cos(v))·sin(u), z=r·sin(v)",
    params: ["R", "r"],
    complexity: 2,
    use_cases: ["donuts", "rings", "topology"]
  },
  plane: {
    equation: "z = ax + by + c",
    params: ["a", "b", "c"],
    complexity: 1,
    use_cases: ["surfaces", "cutting planes", "projections"]
  },

  // Mathematical Fundamentals (4 shapes - algorithmic essentials)
  parabola: {
    equation: "y = ax² + bx + c",
    params: ["a", "b", "c"],
    complexity: 1,
    use_cases: ["physics trajectories", "optimization", "curves"]
  },
  sine_wave: {
    equation: "y = A·sin(ωx + φ)",
    params: ["A", "ω", "φ"],
    complexity: 1,
    use_cases: ["signals", "oscillations", "wave physics"]
  },
  exponential: {
    equation: "y = ae^(bx)",
    params: ["a", "b"],
    complexity: 1,
    use_cases: ["growth models", "decay", "probability"]
  },
  spiral: {
    equation: "r = a·θ^n",
    params: ["a", "n"],
    complexity: 2,
    use_cases: ["galaxies", "shells", "patterns"]
  },

  // Computational Essentials (5 shapes - algorithm visualizations)
  mandelbrot_core: {
    equation: "z_{n+1} = z_n² + c",
    params: ["iterations", "escape_radius"],
    complexity: 3,
    use_cases: ["fractals", "chaos theory", "complex systems"]
  },
  fourier_surface: {
    equation: "F(ω) = ∫f(t)e^(-iωt)dt",
    params: ["frequency", "amplitude"],
    complexity: 3,
    use_cases: ["signal processing", "frequency analysis", "transforms"]
  },
  gradient_field: {
    equation: "∇f = (∂f/∂x, ∂f/∂y, ∂f/∂z)",
    params: ["field_strength"],
    complexity: 2,
    use_cases: ["optimization", "AI gradients", "vector fields"]
  },
  decision_tree: {
    equation: "if-then branching structure",
    params: ["depth", "branching_factor"],
    complexity: 2,
    use_cases: ["AI/ML", "algorithms", "logic trees"]
  },
  neural_network_layer: {
    equation: "y = σ(Wx + b)",
    params: ["weights", "bias"],
    complexity: 3,
    use_cases: ["AI systems", "deep learning", "pattern recognition"]
  }
};

// Ultra-compressed shape data format
interface EssentialShapeData {
  id: string;
  equation: string;
  params: string[];
  vertices?: number;
  algorithm: string; // Minimal algorithm description
  learn_from: string; // What systems can learn from this shape
}

router.get('/essential-core', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Essential mathematical shapes for all computer systems",
    version: "1.0.0",
    total_shapes: Object.keys(ESSENTIAL_SHAPES_CORE).length,
    categories: {
      primitives: 6,
      mathematical: 4, 
      computational: 5
    },
    shapes: ESSENTIAL_SHAPES_CORE,
    usage: {
      integrate: "Use these 15 core shapes as building blocks",
      extend: "Learn patterns, extend for your specific needs",
      optimize: "Minimal data footprint, maximum learning value"
    }
  });
});

router.get('/essential-core/shape/:shapeId', (req: Request, res: Response) => {
  const { shapeId } = req.params;
  const shape = ESSENTIAL_SHAPES_CORE[shapeId as keyof typeof ESSENTIAL_SHAPES_CORE];
  
  if (!shape) {
    return res.status(404).json({
      success: false,
      error: "Shape not found in essential core"
    });
  }

  res.json({
    success: true,
    shape: {
      id: shapeId,
      ...shape,
      implementation_guide: {
        basic: "Copy equation directly",
        parametric: "Use params array for customization", 
        advanced: "Extend equation for specific use cases"
      }
    }
  });
});

// Lightweight algorithm patterns that systems can learn from
router.get('/essential-core/algorithms', (req: Request, res: Response) => {
  res.json({
    success: true,
    core_algorithms: {
      parametric_generation: "f(u,v,params) → [x,y,z]",
      mesh_tessellation: "vertices + indices → triangular mesh",
      normal_calculation: "cross product of tangent vectors",
      uv_mapping: "texture coordinates from parameters",
      adaptive_detail: "increase resolution based on curvature",
      instancing: "single geometry, multiple transforms",
      caching: "store computed results for reuse",
      streaming: "generate geometry on-demand"
    },
    data_optimization: {
      compression: "Store equations, not vertices",
      lazy_loading: "Generate only when needed",
      parameter_reuse: "Same equation, different params",
      minimal_precision: "Float32 for most cases, Float64 when needed"
    }
  });
});

// System learning endpoints - what other systems can learn from your engine
router.get('/essential-core/learn/:system', (req: Request, res: Response) => {
  const { system } = req.params;
  
  const learningPaths = {
    "game-engines": {
      shapes: ["sphere", "cube", "cylinder", "cone"],
      focus: "collision detection, primitive generation",
      key_algorithms: ["parametric_generation", "mesh_tessellation"]
    },
    "cad-systems": {
      shapes: ["torus", "plane", "cylinder", "cone"],  
      focus: "precision modeling, surface generation",
      key_algorithms: ["normal_calculation", "adaptive_detail"]
    },
    "ai-ml": {
      shapes: ["gradient_field", "neural_network_layer", "decision_tree"],
      focus: "algorithm visualization, optimization landscapes", 
      key_algorithms: ["parameter_reuse", "streaming"]
    },
    "graphics": {
      shapes: ["sine_wave", "fourier_surface", "spiral"],
      focus: "procedural generation, animation",
      key_algorithms: ["uv_mapping", "instancing"]
    },
    "simulation": {
      shapes: ["parabola", "exponential", "mandelbrot_core"],
      focus: "physics modeling, mathematical accuracy",
      key_algorithms: ["compression", "lazy_loading"]
    }
  };

  const path = learningPaths[system as keyof typeof learningPaths];
  if (!path) {
    return res.json({
      success: false,
      available_systems: Object.keys(learningPaths)
    });
  }

  res.json({
    success: true,
    system,
    recommended_shapes: path.shapes,
    focus_area: path.focus,
    key_algorithms: path.key_algorithms,
    next_steps: `Start with ${path.shapes[0]}, implement core algorithm, extend as needed`
  });
});

export default router;

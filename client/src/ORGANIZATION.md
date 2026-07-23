# Δmension Code Organization

## 📁 New Organized Folder Structure

All shapes and systems are now organized into logical folders for easy discovery:

### 🎨 **client/src/shapes/** - All 595 Shape Definitions
Organized by category with clear navigation:

```
shapes/
├── foundations/          # Basic geometry and mathematical surfaces (210 shapes)
│   ├── unifiedShapes.ts         # Core geometric shapes
│   ├── cleanMathEngine.ts       # PARAMETRIC_SURFACES collection
│   ├── exclusiveShapes.ts       # Specialized shapes
│   ├── nonEuclideanShapes.ts    # Non-Euclidean geometry
│   ├── riemannSurfaces.ts       # Riemann surfaces
│   └── educationalSurfaces.ts   # Educational demonstrations
│
├── generative/           # Procedurally generated patterns (75 shapes)
│   ├── generativeAlgorithms.ts  # L-Systems fractals
│   ├── noiseFunctions.ts        # Perlin, Simplex noise
│   ├── differentialGrowth.ts    # Coral, brain cortex
│   ├── attractorSystems.ts      # Lorenz, Rössler
│   └── voronoiSystems.ts        # Voronoi tessellations
│
├── quantum/              # Quantum computing visualizations (28 shapes)
│   └── quantumParametricFunctions.ts
│
└── waveVectors/          # UUON Wave Vector Catalogue (387 algorithms)
    └── uuonWaveVectorCatalog.ts
```

### ⚙️ **client/src/systems/** - Core Shape Systems
```
systems/
├── parametricSurfacesClean.ts   # Main shape lookup engine
├── shapeCategories.ts           # UI categorization system
└── shapeRegistryValidator.ts    # Registration validation
```

### 🛠️ **client/src/lib/** - Core Libraries & Utilities
Contains mathematical engines, processors, and shared utilities

### 🎯 **client/src/utils/** - Helper Functions
Material systems, export utilities, and three.js helpers

## 🔍 How to Find Shapes

### By Category (Recommended)
```typescript
// Import from organized folders
import { UNIFIED_SHAPES } from '@/shapes/foundations/unifiedShapes';
import { LORENZ_ATTRACTOR } from '@/shapes/generative/attractorSystems';
import { uuonWaveVectorCatalog } from '@/shapes/waveVectors/uuonWaveVectorCatalog';
```

### By Collection (Legacy - Still Works)
```typescript
// Original imports still work
import { UNIFIED_SHAPES } from '@/lib/unifiedShapes';
import { uuonWaveVectorCatalog } from '@/lib/uuonWaveVectorCatalog';
```

## 📊 Shape Count by Category

| Category | Count | Location |
|----------|-------|----------|
| Foundation Shapes | 210 | `shapes/foundations/` |
| Generative Algorithms | 75 | `shapes/generative/` |
| Quantum Functions | 28 | `shapes/quantum/` |
| UUON Wave Vectors | 387 | `shapes/waveVectors/` |
| **Total** | **595** | All organized! |

## 🚀 Benefits of New Structure

1. **Easy Discovery** - Find shapes by browsing organized folders
2. **Clear Separation** - Shapes, systems, and utilities are distinct
3. **Backward Compatible** - All old imports still work
4. **Better Navigation** - VSCode folder tree shows logical grouping
5. **Documentation** - Each folder has clear purpose

## 📖 Using the Structure

### Finding UUON Algorithms
```
client/src/shapes/waveVectors/uuonWaveVectorCatalog.ts
```
Contains all 387 wave algorithms organized in 11 categories.

### Finding Quantum Shapes
```
client/src/shapes/quantum/quantumParametricFunctions.ts
```
Contains Bloch spheres, quantum gates, VQE landscapes, etc.

### Finding L-Systems
```
client/src/shapes/generative/generativeAlgorithms.ts
```
Contains fractal trees, Hilbert curves, dragon curves, etc.

---

**Note**: This structure uses re-exports, so all original files remain in `client/src/lib/` for backward compatibility. The new organized folders provide better navigation while maintaining system stability.

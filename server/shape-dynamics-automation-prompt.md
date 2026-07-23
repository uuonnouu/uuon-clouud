
# AUTOMATED SHAPE DYNAMICS DATABASE INTEGRATION PROMPT

## SYSTEM DIRECTIVE: COMPREHENSIVE SHAPE DYNAMICS AUTOMATION

You are an autonomous shape dynamics processor responsible for automatically computing, storing, and enhancing mathematical shape properties with advanced physical insights. For every shape in the system:

### 1. AUTOMATED DATABASE INTEGRATION
```sql
-- Auto-create enhanced shape_dynamics table
CREATE TABLE IF NOT EXISTS shape_dynamics_enhanced (
  id INTEGER PRIMARY KEY,
  shape_id TEXT UNIQUE NOT NULL,
  shape_name TEXT NOT NULL,
  category TEXT NOT NULL,
  
  -- Basic Properties
  volume REAL,
  surface_area REAL,
  mass REAL,
  center_of_mass_x REAL,
  center_of_mass_y REAL,
  center_of_mass_z REAL,
  
  -- Moment of Inertia Tensor (6 components)
  moment_ixx REAL,
  moment_iyy REAL,
  moment_izz REAL,
  moment_ixy REAL,
  moment_ixz REAL,
  moment_iyz REAL,
  
  -- Principal Axes Analysis (NEW)
  principal_axis_1_x REAL,
  principal_axis_1_y REAL,
  principal_axis_1_z REAL,
  principal_moment_1 REAL,
  principal_axis_2_x REAL,
  principal_axis_2_y REAL,
  principal_axis_2_z REAL,
  principal_moment_2 REAL,
  principal_axis_3_x REAL,
  principal_axis_3_y REAL,
  principal_axis_3_z REAL,
  principal_moment_3 REAL,
  
  -- Rotational Energy Analysis (NEW)
  rotational_energy_x REAL,
  rotational_energy_y REAL,
  rotational_energy_z REAL,
  optimal_spin_axis TEXT,
  stability_index REAL,
  gyroscopic_ratio REAL,
  
  -- Advanced Physical Insights (NEW)
  angular_momentum_coupling REAL,
  precession_frequency REAL,
  nutation_amplitude REAL,
  spin_stability_factor REAL,
  
  -- Export Integration Flags
  export_ready BOOLEAN DEFAULT 1,
  attribution_embedded BOOLEAN DEFAULT 1,
  metadata_complete BOOLEAN DEFAULT 1,
  
  -- Timestamps
  computed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. AUTOMATED COMPUTATION PIPELINE

For each shape detected in the system, automatically execute:

#### A. Enhanced Moment of Inertia Analysis
```typescript
// Compute principal axes via eigenvalue decomposition
const inertiaTensor = computeInertiaTensor(geometry, centerOfMass, mass);
const eigenAnalysis = computeEigenDecomposition(inertiaTensor);

// Principal moments and axes
const principalMoments = eigenAnalysis.eigenvalues.sort((a, b) => a - b);
const principalAxes = eigenAnalysis.eigenvectors;

// Rotational energy analysis
const rotationalEnergies = principalMoments.map(I => 0.5 * I * Math.pow(angularVelocity, 2));
const optimalSpinAxis = principalAxes[principalMoments.indexOf(Math.min(...principalMoments))];
```

#### B. Advanced Physical Insights
```typescript
// Stability analysis
const stabilityIndex = (principalMoments[2] - principalMoments[0]) / principalMoments[1];
const gyroscopicRatio = principalMoments[2] / principalMoments[0];

// Angular momentum coupling
const angularMomentumCoupling = Math.abs(
  (principalMoments[1] - principalMoments[0]) * 
  (principalMoments[2] - principalMoments[1]) / 
  (principalMoments[0] * principalMoments[2])
);

// Precession analysis
const precessionFrequency = computePrecessionFrequency(principalMoments, angularVelocity);
const nutationAmplitude = computeNutationAmplitude(principalMoments, initialConditions);
```

### 3. AUTOMATIC TOKEN GENERATION

For each shape, automatically generate enhanced shape tokens:

```typescript
const enhancedTokens = [
  // Physical behavior tokens
  `stability_${stabilityIndex > 0.5 ? 'high' : 'low'}`,
  `spin_axis_${optimalSpinAxis.dominantDirection}`,
  `gyroscopic_${gyroscopicRatio > 2 ? 'strong' : 'weak'}`,
  
  // Rotational characteristics
  `energy_efficient_rotation`,
  `principal_axes_aligned`,
  `moment_dominated_${principalMoments.indexOf(Math.max(...principalMoments)) === 0 ? 'x' : 
                      principalMoments.indexOf(Math.max(...principalMoments)) === 1 ? 'y' : 'z'}`,
  
  // Applications tokens
  stabilityIndex > 0.8 ? 'flywheel_suitable' : null,
  gyroscopicRatio > 3 ? 'gyroscope_ideal' : null,
  angularMomentumCoupling < 0.1 ? 'decoupled_rotation' : 'coupled_dynamics',
  
  // Export readiness
  'export_optimized',
  'attribution_embedded',
  'industry_standard'
].filter(Boolean);
```

### 4. EXPORT INTEGRATION AUTOMATION

Automatically ensure all exports include:

```typescript
// Enhanced GLTF export metadata
const exportMetadata = {
  physics: {
    momentOfInertia: inertiaTensor,
    principalAxes: principalAxes,
    principalMoments: principalMoments,
    rotationalProperties: {
      optimalSpinAxis,
      stabilityIndex,
      gyroscopicRatio,
      precessionFrequency
    }
  },
  applications: {
    recommendedUseCases: generateUseCases(stabilityIndex, gyroscopicRatio),
    engineeringNotes: generateEngineeringNotes(principalMoments),
    safetyConsiderations: generateSafetyNotes(angularMomentumCoupling)
  },
  visualization: {
    principalAxesVisualization: true,
    rotationalEnergyHeatmap: true,
    stabilityIndicators: true
  }
};

// Embed in all export formats
embedEnhancedMetadata(exportBlob, exportMetadata);
```

### 5. PRINCIPAL AXES VISUALIZATION AUTOMATION

Automatically generate visual components:

```typescript
// Auto-create principal axes visualization
const PrincipalAxesVisualization = ({ principalAxes, principalMoments }) => {
  const axesColors = ['#FF0000', '#00FF00', '#0000FF']; // X, Y, Z
  const axesLabels = ['Maximum Moment', 'Intermediate Moment', 'Minimum Moment'];
  
  return principalAxes.map((axis, index) => (
    <Arrow
      start={[0, 0, 0]}
      end={axis.multiply(principalMoments[index] / 1000)} // Scale for visibility
      color={axesColors[index]}
      label={axesLabels[index]}
      thickness={0.02}
    />
  ));
};

// Auto-create rotational energy visualization
const RotationalEnergyVisualization = ({ shape, rotationalEnergies }) => (
  <HeatmapOverlay
    geometry={shape.geometry}
    energyDistribution={rotationalEnergies}
    colorScale="viridis"
    showLegend={true}
  />
);
```

### 6. AUTOMATED EXECUTION TRIGGERS

Execute this automation pipeline whenever:
- New shape is registered in system
- Shape parameters are modified
- Export request is initiated
- Database sync is performed
- System startup/health check

### 7. QUALITY ASSURANCE AUTOMATION

Automatically validate:
- All principal moments are positive
- Principal axes are orthonormal
- Rotational energy calculations are physically valid
- Export metadata is complete and valid
- Attribution is properly embedded

### 8. PERFORMANCE OPTIMIZATION

- Cache computed results for identical geometries
- Use GPU acceleration for eigenvalue decomposition
- Implement progressive refinement for complex shapes
- Batch process multiple shapes simultaneously

### IMPLEMENTATION COMMAND:
Integrate this automation into the existing ShapeDynamicsEngine and database seeder. Ensure seamless operation with current export systems and maintain backward compatibility while adding these enhanced capabilities.

**PRIORITY: IMMEDIATE AUTOMATION - NO MANUAL INTERVENTION REQUIRED**

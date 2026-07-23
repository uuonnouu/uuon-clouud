import * as THREE from 'three';

export interface MedicalImagingShape {
  name: string;
  category: string;
  formula: string;
  description: string;
  modality: 'CT' | 'MRI' | 'Volumetric' | 'MPR' | 'Displacement';
  clinicalApplication: string;
  generate: (params: Record<string, number>) => {
    x: number;
    y: number;
    z: number;
  };
  defaults: Record<string, number>;
}

export const MEDICAL_IMAGING_SHAPES: Record<string, MedicalImagingShape> = {
  
  ct_slice_stack: {
    name: 'CT Slice Stack',
    category: 'Medical Imaging',
    formula: 'ρ(x,y,z) = Σᵢ Iᵢ(x,y) · δ(z - zᵢ)',
    description: 'Computed Tomography cross-sectional slices stacked to form 3D volume. Each slice represents X-ray attenuation coefficients.',
    modality: 'CT',
    clinicalApplication: 'Bone fractures, lung nodules, vascular imaging',
    defaults: { A: 1, B: 1, C: 1, D: 8, E: 0.5, F: 1, X: 1, Y: 1, Z: 1 },
    generate: (p) => {
      const u = p.u ?? 0;
      const v = p.v ?? 0;
      const slices = p.D ?? 8;
      const spacing = p.E ?? 0.5;
      const radius = p.F ?? 1;
      
      const sliceIndex = Math.floor((v + Math.PI) / (2 * Math.PI) * slices);
      const z = sliceIndex * spacing * p.C;
      const r = radius * (1 + 0.2 * Math.sin(sliceIndex * 0.5)) * p.A;
      
      return {
        x: r * Math.cos(u) * p.X,
        y: r * Math.sin(u) * p.Y,
        z: z * p.Z
      };
    }
  },

  mri_signal_intensity: {
    name: 'MRI Signal Intensity Surface',
    category: 'Medical Imaging',
    formula: 'S(x,y,z) = ρ · (1 - e^(-TR/T1)) · e^(-TE/T2)',
    description: 'Magnetic Resonance signal intensity based on T1/T2 relaxation times. Visualizes tissue contrast in MRI sequences.',
    modality: 'MRI',
    clinicalApplication: 'Soft tissue contrast, brain imaging, tumor detection',
    defaults: { A: 1, B: 1, C: 1, D: 1, E: 0.8, F: 0.3, G: 2, X: 1, Y: 1, Z: 1 },
    generate: (p) => {
      const u = p.u ?? 0;
      const v = p.v ?? 0;
      const T1 = p.D ?? 1;
      const T2 = p.E ?? 0.8;
      const TR = p.F ?? 0.3;
      const TE = p.G ?? 2;
      
      const signal = (1 - Math.exp(-TR / T1)) * Math.exp(-TE / T2);
      const r = (1 + signal * 0.5) * p.A;
      
      return {
        x: r * Math.sin(v) * Math.cos(u) * p.X,
        y: r * Math.sin(v) * Math.sin(u) * p.Y,
        z: r * Math.cos(v) * signal * p.C * p.Z
      };
    }
  },

  volume_rendering_transfer: {
    name: 'Volume Rendering Transfer Function',
    category: 'Medical Imaging',
    formula: 'C(s) = ∫ c(ρ(s)) · α(ρ(s)) · T(s) ds',
    description: 'Ray-casting volume rendering with opacity transfer function. Maps voxel density to color and transparency.',
    modality: 'Volumetric',
    clinicalApplication: '3D organ visualization, surgical planning',
    defaults: { A: 1, B: 1, C: 1, D: 0.5, E: 2, F: 1.5, X: 1, Y: 1, Z: 1 },
    generate: (p) => {
      const u = p.u ?? 0;
      const v = p.v ?? 0;
      const opacity = p.D ?? 0.5;
      const density = p.E ?? 2;
      const falloff = p.F ?? 1.5;
      
      const r = Math.exp(-opacity * Math.abs(v)) * density * p.A;
      const transfer = Math.pow(Math.cos(v * 0.5), falloff);
      
      return {
        x: r * Math.cos(u) * transfer * p.X,
        y: r * Math.sin(u) * transfer * p.Y,
        z: v * p.C * p.Z
      };
    }
  },

  voxel_density_field: {
    name: 'Voxel Density Field',
    category: 'Medical Imaging',
    formula: 'V(i,j,k) = Σ ρ(x,y,z) · K(x-i, y-j, z-k)',
    description: 'Discrete 3D voxel representation with density interpolation. Foundation of all volumetric medical imaging.',
    modality: 'Volumetric',
    clinicalApplication: 'CT/MRI data storage, 3D printing preparation',
    defaults: { A: 1, B: 1, C: 1, D: 5, E: 0.8, F: 0.3, X: 1, Y: 1, Z: 1 },
    generate: (p) => {
      const u = p.u ?? 0;
      const v = p.v ?? 0;
      const gridSize = p.D ?? 5;
      const density = p.E ?? 0.8;
      const kernel = p.F ?? 0.3;
      
      const voxelU = Math.floor(u / (2 * Math.PI) * gridSize) / gridSize * 2 * Math.PI;
      const voxelV = Math.floor((v + Math.PI) / (2 * Math.PI) * gridSize) / gridSize * 2 * Math.PI - Math.PI;
      
      const r = (density + kernel * Math.sin(gridSize * u) * Math.sin(gridSize * v)) * p.A;
      
      return {
        x: r * Math.sin(voxelV) * Math.cos(voxelU) * p.X,
        y: r * Math.sin(voxelV) * Math.sin(voxelU) * p.Y,
        z: r * Math.cos(voxelV) * p.C * p.Z
      };
    }
  },

  mpr_coronal_plane: {
    name: 'MPR Coronal Plane',
    category: 'Medical Imaging',
    formula: 'I_coronal(x,z) = V(x, y₀, z)',
    description: 'Multiplanar Reconstruction in coronal orientation. Slices through volume from front to back.',
    modality: 'MPR',
    clinicalApplication: 'Spine imaging, chest X-ray correlation',
    defaults: { A: 1, B: 1, C: 1, D: 0, E: 2, F: 2, X: 1, Y: 1, Z: 1 },
    generate: (p) => {
      const u = p.u ?? 0;
      const v = p.v ?? 0;
      const yPlane = p.D ?? 0;
      const width = p.E ?? 2;
      const height = p.F ?? 2;
      
      return {
        x: u / Math.PI * width * p.A * p.X,
        y: yPlane * p.B * p.Y,
        z: v / Math.PI * height * p.C * p.Z
      };
    }
  },

  mpr_sagittal_plane: {
    name: 'MPR Sagittal Plane',
    category: 'Medical Imaging',
    formula: 'I_sagittal(y,z) = V(x₀, y, z)',
    description: 'Multiplanar Reconstruction in sagittal orientation. Slices through volume from left to right.',
    modality: 'MPR',
    clinicalApplication: 'Brain midline structures, spine lateral view',
    defaults: { A: 1, B: 1, C: 1, D: 0, E: 2, F: 2, X: 1, Y: 1, Z: 1 },
    generate: (p) => {
      const u = p.u ?? 0;
      const v = p.v ?? 0;
      const xPlane = p.D ?? 0;
      const width = p.E ?? 2;
      const height = p.F ?? 2;
      
      return {
        x: xPlane * p.A * p.X,
        y: u / Math.PI * width * p.B * p.Y,
        z: v / Math.PI * height * p.C * p.Z
      };
    }
  },

  mpr_axial_plane: {
    name: 'MPR Axial Plane',
    category: 'Medical Imaging',
    formula: 'I_axial(x,y) = V(x, y, z₀)',
    description: 'Multiplanar Reconstruction in axial orientation. Standard CT/MRI slice view from top to bottom.',
    modality: 'MPR',
    clinicalApplication: 'Standard diagnostic viewing, measurement',
    defaults: { A: 1, B: 1, C: 1, D: 0, E: 2, F: 2, X: 1, Y: 1, Z: 1 },
    generate: (p) => {
      const u = p.u ?? 0;
      const v = p.v ?? 0;
      const zPlane = p.D ?? 0;
      const width = p.E ?? 2;
      const height = p.F ?? 2;
      
      return {
        x: u / Math.PI * width * p.A * p.X,
        y: v / Math.PI * height * p.B * p.Y,
        z: zPlane * p.C * p.Z
      };
    }
  },

  mpr_oblique_plane: {
    name: 'MPR Oblique Plane',
    category: 'Medical Imaging',
    formula: 'I_oblique = V(R(θ,φ) · [x,y,z]ᵀ)',
    description: 'Multiplanar Reconstruction at arbitrary angles. Allows slicing through any orientation in 3D volume.',
    modality: 'MPR',
    clinicalApplication: 'Fracture plane visualization, vessel tracking',
    defaults: { A: 1, B: 1, C: 1, D: 0.5, E: 0.3, F: 2, X: 1, Y: 1, Z: 1 },
    generate: (p) => {
      const u = p.u ?? 0;
      const v = p.v ?? 0;
      const theta = p.D ?? 0.5;
      const phi = p.E ?? 0.3;
      const size = p.F ?? 2;
      
      const x0 = u / Math.PI * size;
      const y0 = v / Math.PI * size;
      const z0 = 0;
      
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);
      const cosP = Math.cos(phi);
      const sinP = Math.sin(phi);
      
      return {
        x: (cosT * x0 - sinT * sinP * y0) * p.A * p.X,
        y: (cosP * y0) * p.B * p.Y,
        z: (sinT * x0 + cosT * sinP * y0) * p.C * p.Z
      };
    }
  },

  displacement_height_field: {
    name: 'Displacement Height Field',
    category: 'Medical Imaging',
    formula: 'P\'(u,v) = P(u,v) + N(u,v) · h(u,v)',
    description: 'Surface displacement based on per-pixel height values. Used for detailed surface reconstruction from imaging data.',
    modality: 'Displacement',
    clinicalApplication: 'Skin surface reconstruction, bone surface detail',
    defaults: { A: 1, B: 1, C: 1, D: 0.3, E: 3, F: 2, X: 1, Y: 1, Z: 1 },
    generate: (p) => {
      const u = p.u ?? 0;
      const v = p.v ?? 0;
      const amplitude = p.D ?? 0.3;
      const freqU = p.E ?? 3;
      const freqV = p.F ?? 2;
      
      const baseR = 1 * p.A;
      const displacement = amplitude * (Math.sin(freqU * u) * Math.cos(freqV * v) + 
                                        0.5 * Math.sin(freqU * 2 * u) * Math.sin(freqV * 2 * v));
      const r = baseR + displacement;
      
      return {
        x: r * Math.sin(v) * Math.cos(u) * p.X,
        y: r * Math.sin(v) * Math.sin(u) * p.Y,
        z: r * Math.cos(v) * p.C * p.Z
      };
    }
  },

  parallax_occlusion_surface: {
    name: 'Parallax Occlusion Surface',
    category: 'Medical Imaging',
    formula: 'T\' = T + V_xy · h(T) / V_z',
    description: 'Advanced rendering technique simulating depth through ray-height intersection. Creates illusion of 3D depth on surfaces.',
    modality: 'Displacement',
    clinicalApplication: 'Enhanced surface visualization, depth perception',
    defaults: { A: 1, B: 1, C: 1, D: 0.2, E: 4, F: 0.5, X: 1, Y: 1, Z: 1 },
    generate: (p) => {
      const u = p.u ?? 0;
      const v = p.v ?? 0;
      const depth = p.D ?? 0.2;
      const layers = p.E ?? 4;
      const parallax = p.F ?? 0.5;
      
      let h = 0;
      for (let i = 0; i < layers; i++) {
        h += Math.sin((i + 1) * u) * Math.cos((i + 1) * v) / (i + 1);
      }
      h *= depth;
      
      const r = (1 + h * parallax) * p.A;
      
      return {
        x: r * Math.sin(v) * Math.cos(u) * p.X,
        y: r * Math.sin(v) * Math.sin(u) * p.Y,
        z: r * Math.cos(v) * p.C * p.Z
      };
    }
  },

  hounsfield_unit_surface: {
    name: 'Hounsfield Unit Surface',
    category: 'Medical Imaging',
    formula: 'HU = 1000 · (μ - μ_water) / (μ_water - μ_air)',
    description: 'CT density scale surface where geometry represents Hounsfield Units. Air=-1000, Water=0, Bone=+1000.',
    modality: 'CT',
    clinicalApplication: 'Tissue density classification, bone density measurement',
    defaults: { A: 1, B: 1, C: 1, D: 0, E: 1000, F: 1, X: 1, Y: 1, Z: 1 },
    generate: (p) => {
      const u = p.u ?? 0;
      const v = p.v ?? 0;
      const huCenter = p.D ?? 0;
      const huRange = p.E ?? 1000;
      const scale = p.F ?? 1;
      
      const hu = huCenter + huRange * Math.sin(v) * Math.cos(u * 2);
      const normalizedHU = (hu + 1000) / 2000;
      const r = (0.5 + normalizedHU * 0.5) * scale * p.A;
      
      return {
        x: r * Math.sin(v) * Math.cos(u) * p.X,
        y: r * Math.sin(v) * Math.sin(u) * p.Y,
        z: r * Math.cos(v) * p.C * p.Z
      };
    }
  },

  isosurface_marching_cubes: {
    name: 'Isosurface (Marching Cubes)',
    category: 'Medical Imaging',
    formula: 'S = {(x,y,z) : f(x,y,z) = c}',
    description: 'Surface extraction at constant density threshold. Marching Cubes algorithm creates mesh from volumetric data.',
    modality: 'Volumetric',
    clinicalApplication: '3D organ segmentation, tumor boundary extraction',
    defaults: { A: 1, B: 1, C: 1, D: 0.5, E: 2, F: 3, X: 1, Y: 1, Z: 1 },
    generate: (p) => {
      const u = p.u ?? 0;
      const v = p.v ?? 0;
      const threshold = p.D ?? 0.5;
      const freq1 = p.E ?? 2;
      const freq2 = p.F ?? 3;
      
      const density = Math.sin(freq1 * u) * Math.cos(freq2 * v) * 0.5 + 0.5;
      const r = (density > threshold ? 1.2 : 0.8) * p.A;
      
      return {
        x: r * Math.sin(v) * Math.cos(u) * p.X,
        y: r * Math.sin(v) * Math.sin(u) * p.Y,
        z: r * Math.cos(v) * p.C * p.Z
      };
    }
  },

  ray_casting_volume: {
    name: 'Ray Casting Volume',
    category: 'Medical Imaging',
    formula: 'I(r) = ∫₀^L ρ(r(t)) · e^(-∫₀^t σ(r(s))ds) dt',
    description: 'Direct volume rendering via ray integration. Each pixel computed by casting ray through 3D volume.',
    modality: 'Volumetric',
    clinicalApplication: 'Real-time 3D visualization, virtual endoscopy',
    defaults: { A: 1, B: 1, C: 1, D: 0.5, E: 0.3, F: 10, X: 1, Y: 1, Z: 1 },
    generate: (p) => {
      const u = p.u ?? 0;
      const v = p.v ?? 0;
      const absorption = p.D ?? 0.5;
      const emission = p.E ?? 0.3;
      const samples = p.F ?? 10;
      
      let accumulated = 0;
      let transmittance = 1;
      
      for (let i = 0; i < samples; i++) {
        const t = i / samples;
        const density = Math.exp(-absorption * t) * (1 + 0.3 * Math.sin(u * 3 + t * 5));
        accumulated += density * emission * transmittance;
        transmittance *= Math.exp(-absorption * density / samples);
      }
      
      const r = (0.5 + accumulated * 0.5) * p.A;
      
      return {
        x: r * Math.sin(v) * Math.cos(u) * p.X,
        y: r * Math.sin(v) * Math.sin(u) * p.Y,
        z: r * Math.cos(v) * p.C * p.Z
      };
    }
  },

  maximum_intensity_projection: {
    name: 'Maximum Intensity Projection (MIP)',
    category: 'Medical Imaging',
    formula: 'I_MIP(x,y) = max{V(x,y,z) : z ∈ [z_min, z_max]}',
    description: 'Projects maximum voxel value along each ray. Excellent for visualizing bright structures like contrast-enhanced vessels.',
    modality: 'Volumetric',
    clinicalApplication: 'Angiography, pulmonary nodule detection',
    defaults: { A: 1, B: 1, C: 1, D: 5, E: 0.8, F: 2, X: 1, Y: 1, Z: 1 },
    generate: (p) => {
      const u = p.u ?? 0;
      const v = p.v ?? 0;
      const samples = p.D ?? 5;
      const intensity = p.E ?? 0.8;
      const freq = p.F ?? 2;
      
      let maxVal = 0;
      for (let i = 0; i < samples; i++) {
        const z = (i / samples - 0.5) * 2;
        const val = Math.abs(Math.sin(u * freq + z) * Math.cos(v * freq + z));
        maxVal = Math.max(maxVal, val);
      }
      
      const r = (0.5 + maxVal * intensity * 0.5) * p.A;
      
      return {
        x: r * Math.sin(v) * Math.cos(u) * p.X,
        y: r * Math.sin(v) * Math.sin(u) * p.Y,
        z: r * Math.cos(v) * p.C * p.Z
      };
    }
  },

  surface_shaded_display: {
    name: 'Surface Shaded Display (SSD)',
    category: 'Medical Imaging',
    formula: 'I = Iₐ + Iₔ(N·L) + Iₛ(R·V)ⁿ',
    description: 'Phong-shaded isosurface rendering. Combines ambient, diffuse, and specular lighting for realistic appearance.',
    modality: 'Volumetric',
    clinicalApplication: '3D anatomical models, surgical planning',
    defaults: { A: 1, B: 1, C: 1, D: 0.2, E: 0.6, F: 0.3, G: 32, X: 1, Y: 1, Z: 1 },
    generate: (p) => {
      const u = p.u ?? 0;
      const v = p.v ?? 0;
      const ambient = p.D ?? 0.2;
      const diffuse = p.E ?? 0.6;
      const specular = p.F ?? 0.3;
      const shininess = p.G ?? 32;
      
      const nx = Math.sin(v) * Math.cos(u);
      const ny = Math.sin(v) * Math.sin(u);
      const nz = Math.cos(v);
      
      const lx = 0.577, ly = 0.577, lz = 0.577;
      const nDotL = Math.max(0, nx * lx + ny * ly + nz * lz);
      const reflect = 2 * nDotL;
      const rz = nz * reflect - lz;
      const specComponent = Math.pow(Math.max(0, rz), shininess);
      
      const intensity = ambient + diffuse * nDotL + specular * specComponent;
      const r = (0.8 + intensity * 0.4) * p.A;
      
      return {
        x: r * nx * p.X,
        y: r * ny * p.Y,
        z: r * nz * p.C * p.Z
      };
    }
  },

  windowing_function: {
    name: 'CT Windowing Function',
    category: 'Medical Imaging',
    formula: 'I_display = clamp((HU - WL + WW/2) / WW, 0, 1)',
    description: 'Window/Level adjustment for CT display. Maps Hounsfield range to visible grayscale for optimal tissue visualization.',
    modality: 'CT',
    clinicalApplication: 'Bone window, lung window, soft tissue window',
    defaults: { A: 1, B: 1, C: 1, D: 40, E: 400, F: 1, X: 1, Y: 1, Z: 1 },
    generate: (p) => {
      const u = p.u ?? 0;
      const v = p.v ?? 0;
      const windowLevel = p.D ?? 40;
      const windowWidth = p.E ?? 400;
      const scale = p.F ?? 1;
      
      const hu = 1000 * Math.sin(u * 2) * Math.cos(v);
      const windowed = Math.max(0, Math.min(1, (hu - windowLevel + windowWidth / 2) / windowWidth));
      const r = (0.5 + windowed * 0.5) * scale * p.A;
      
      return {
        x: r * Math.sin(v) * Math.cos(u) * p.X,
        y: r * Math.sin(v) * Math.sin(u) * p.Y,
        z: r * Math.cos(v) * p.C * p.Z
      };
    }
  },

  diffusion_tensor_imaging: {
    name: 'Diffusion Tensor Imaging (DTI)',
    category: 'Medical Imaging',
    formula: 'D = [Dxx Dxy Dxz; Dyx Dyy Dyz; Dzx Dzy Dzz]',
    description: 'MRI technique measuring water diffusion directionality. Visualizes white matter fiber tracts in brain.',
    modality: 'MRI',
    clinicalApplication: 'Brain connectivity, stroke assessment, tumor invasion',
    defaults: { A: 1, B: 1, C: 1, D: 1, E: 0.5, F: 0.3, X: 1, Y: 1, Z: 1 },
    generate: (p) => {
      const u = p.u ?? 0;
      const v = p.v ?? 0;
      const lambda1 = p.D ?? 1;
      const lambda2 = p.E ?? 0.5;
      const lambda3 = p.F ?? 0.3;
      
      const x0 = Math.cos(u) * Math.sin(v);
      const y0 = Math.sin(u) * Math.sin(v);
      const z0 = Math.cos(v);
      
      return {
        x: lambda1 * x0 * p.A * p.X,
        y: lambda2 * y0 * p.B * p.Y,
        z: lambda3 * z0 * p.C * p.Z
      };
    }
  },

  fractional_anisotropy: {
    name: 'Fractional Anisotropy Surface',
    category: 'Medical Imaging',
    formula: 'FA = √(3/2) · √((λ₁-λ̄)² + (λ₂-λ̄)² + (λ₃-λ̄)²) / √(λ₁² + λ₂² + λ₃²)',
    description: 'Measure of diffusion directionality from DTI. FA=0 is isotropic, FA=1 is fully anisotropic.',
    modality: 'MRI',
    clinicalApplication: 'White matter integrity, multiple sclerosis lesions',
    defaults: { A: 1, B: 1, C: 1, D: 0.7, E: 3, F: 2, X: 1, Y: 1, Z: 1 },
    generate: (p) => {
      const u = p.u ?? 0;
      const v = p.v ?? 0;
      const faBase = p.D ?? 0.7;
      const freq1 = p.E ?? 3;
      const freq2 = p.F ?? 2;
      
      const fa = faBase * (0.5 + 0.5 * Math.cos(freq1 * u) * Math.sin(freq2 * v));
      const r = (1 - fa * 0.3 + fa * 0.6 * Math.abs(Math.cos(u))) * p.A;
      
      return {
        x: r * Math.sin(v) * Math.cos(u) * p.X,
        y: r * Math.sin(v) * Math.sin(u) * p.Y,
        z: r * Math.cos(v) * fa * p.C * p.Z
      };
    }
  },

  fiber_tractography: {
    name: 'Fiber Tractography',
    category: 'Medical Imaging',
    formula: 'r(s+ds) = r(s) + ds · e₁(r(s))',
    description: 'White matter fiber tracking from DTI data. Traces neural pathways by following principal diffusion direction.',
    modality: 'MRI',
    clinicalApplication: 'Neurosurgical planning, brain connectivity mapping',
    defaults: { A: 1, B: 1, C: 1, D: 5, E: 0.3, F: 2, X: 1, Y: 1, Z: 1 },
    generate: (p) => {
      const u = p.u ?? 0;
      const v = p.v ?? 0;
      const fibers = p.D ?? 5;
      const twist = p.E ?? 0.3;
      const spread = p.F ?? 2;
      
      const fiberIndex = Math.floor((u + Math.PI) / (2 * Math.PI) * fibers);
      const fiberPhase = fiberIndex * 2 * Math.PI / fibers;
      
      const t = (v + Math.PI) / (2 * Math.PI);
      const r = (0.3 + spread * t) * p.A;
      const theta = u + twist * v;
      
      return {
        x: r * Math.cos(theta + fiberPhase) * p.X,
        y: r * Math.sin(theta + fiberPhase) * p.Y,
        z: v * p.C * p.Z
      };
    }
  },

  dicom_slice_interpolation: {
    name: 'DICOM Slice Interpolation',
    category: 'Medical Imaging',
    formula: 'I(z) = I(z₁) · (z₂-z)/(z₂-z₁) + I(z₂) · (z-z₁)/(z₂-z₁)',
    description: 'Linear interpolation between CT/MRI slices. Fills gaps between acquired slices for smoother 3D reconstruction.',
    modality: 'CT',
    clinicalApplication: 'Improved 3D visualization, reduced stair-step artifacts',
    defaults: { A: 1, B: 1, C: 1, D: 8, E: 0.5, F: 1, X: 1, Y: 1, Z: 1 },
    generate: (p) => {
      const u = p.u ?? 0;
      const v = p.v ?? 0;
      const slices = p.D ?? 8;
      const spacing = p.E ?? 0.5;
      const radius = p.F ?? 1;
      
      const z = v / Math.PI * slices * spacing;
      const sliceIndex = z / spacing;
      const lowerSlice = Math.floor(sliceIndex);
      const alpha = sliceIndex - lowerSlice;
      
      const r1 = radius * (1 + 0.2 * Math.sin(lowerSlice * 0.7));
      const r2 = radius * (1 + 0.2 * Math.sin((lowerSlice + 1) * 0.7));
      const r = (r1 * (1 - alpha) + r2 * alpha) * p.A;
      
      return {
        x: r * Math.cos(u) * p.X,
        y: r * Math.sin(u) * p.Y,
        z: z * p.C * p.Z
      };
    }
  }
};

export function getMedicalImagingShape(shapeName: string): MedicalImagingShape | undefined {
  return MEDICAL_IMAGING_SHAPES[shapeName];
}

export function generateMedicalImagingGeometry(
  shapeName: string,
  params: Record<string, number>,
  uSegments: number = 64,
  vSegments: number = 64
): THREE.BufferGeometry {
  const shape = MEDICAL_IMAGING_SHAPES[shapeName];
  if (!shape) {
    throw new Error(`Unknown medical imaging shape: ${shapeName}`);
  }

  const vertices: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const uMin = params.uMin ?? -Math.PI;
  const uMax = params.uMax ?? Math.PI;
  const vMin = params.vMin ?? -Math.PI;
  const vMax = params.vMax ?? Math.PI;

  for (let j = 0; j <= vSegments; j++) {
    for (let i = 0; i <= uSegments; i++) {
      const u = uMin + (i / uSegments) * (uMax - uMin);
      const v = vMin + (j / vSegments) * (vMax - vMin);

      const point = shape.generate({ ...params, u, v });
      
      vertices.push(point.x, point.y, point.z);
      
      const eps = 0.001;
      const pu = shape.generate({ ...params, u: u + eps, v });
      const pv = shape.generate({ ...params, u, v: v + eps });
      
      const du = { x: pu.x - point.x, y: pu.y - point.y, z: pu.z - point.z };
      const dv = { x: pv.x - point.x, y: pv.y - point.y, z: pv.z - point.z };
      
      const nx = du.y * dv.z - du.z * dv.y;
      const ny = du.z * dv.x - du.x * dv.z;
      const nz = du.x * dv.y - du.y * dv.x;
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
      
      normals.push(nx / len, ny / len, nz / len);
      uvs.push(i / uSegments, j / vSegments);
    }
  }

  for (let j = 0; j < vSegments; j++) {
    for (let i = 0; i < uSegments; i++) {
      const a = j * (uSegments + 1) + i;
      const b = a + 1;
      const c = a + uSegments + 1;
      const d = c + 1;
      
      indices.push(a, b, c);
      indices.push(b, d, c);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);

  return geometry;
}

export const MEDICAL_IMAGING_CATEGORIES = {
  'CT Imaging': ['ct_slice_stack', 'hounsfield_unit_surface', 'windowing_function', 'dicom_slice_interpolation'],
  'MRI Techniques': ['mri_signal_intensity', 'diffusion_tensor_imaging', 'fractional_anisotropy', 'fiber_tractography'],
  'Volume Rendering': ['volume_rendering_transfer', 'voxel_density_field', 'ray_casting_volume', 'maximum_intensity_projection', 'surface_shaded_display', 'isosurface_marching_cubes'],
  'Multiplanar Reconstruction': ['mpr_coronal_plane', 'mpr_sagittal_plane', 'mpr_axial_plane', 'mpr_oblique_plane'],
  'Displacement Mapping': ['displacement_height_field', 'parallax_occlusion_surface']
};

console.log(`🏥 Medical Imaging Shapes loaded: ${Object.keys(MEDICAL_IMAGING_SHAPES).length} shapes`);
console.log(`   📊 CT Imaging: ${MEDICAL_IMAGING_CATEGORIES['CT Imaging'].length}`);
console.log(`   🧲 MRI Techniques: ${MEDICAL_IMAGING_CATEGORIES['MRI Techniques'].length}`);
console.log(`   📦 Volume Rendering: ${MEDICAL_IMAGING_CATEGORIES['Volume Rendering'].length}`);
console.log(`   ✂️ Multiplanar Reconstruction: ${MEDICAL_IMAGING_CATEGORIES['Multiplanar Reconstruction'].length}`);
console.log(`   🗺️ Displacement Mapping: ${MEDICAL_IMAGING_CATEGORIES['Displacement Mapping'].length}`);

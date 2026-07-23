import { create } from 'zustand';

export interface IFSParams {
  ft: number;      // fold type 0-7 (also weave type for fractal_weave)
  mi: number;      // IFS iterations 1-6 (also l-system depth, weave depth)
  sc: number;      // IFS scale 2-5 (also weave scale ratio)
  ox: number;      // offset X 0.2-2.5 (also warp count scaled)
  oy: number;      // offset Y 0.2-2.5 (also weft count scaled)
  oz: number;      // offset Z 0.2-2.5 (independent Z axis)
  fi: number;      // fold iterations 1-8 (also section axis for weave)
  fs: number;      // fold size 0.1-3 (also branch angle for lsystem)
  fsc: number;     // fold scale 1-4, capped per fold type (also growth scale for lsystem)
  mr: number;      // min radius 0.01-2 (also thread radius / branch radius)
  bl: number;      // blend 0-1 (also IFS/lsystem blend)
  twist: number;   // torsion angle per Menger iteration 0-PI
  trap: number;    // orbit trap: 0=cylinder 1=sphere 2=cross 3=point
  con: number;     // container: 0=open 1=sphere 2=cube
  cs: number;      // container size 0.5-6
  cm: number;      // shading mode 0-3
  pal: number;     // palette 0=UUON 1=EMBER 2=ICE 3=VOID
  bright: number;  // brightness 0.5-3
  sp: number;      // specular 0-2
  la: number;      // light azimuth 0-360
  le: number;      // light elevation -80-80
  rs: number;      // raymarch steps 48-220
  dv: number;      // camera distance 1-14
  fov: number;     // FOV 25-90
  autoRot: boolean;
  rotSpeed: number;
  // Engine-specific params (lsystem / reaction-diffusion)
  ls: number;      // l-system growth type 0-3 (vascular/neural/mycelium/crystal)
  lt: number;      // l-system tropism 0-1
  lg: number;      // l-system growth scale 0.5-1.2
  rdF: number;     // RD feed rate 0.01-0.09
  rdK: number;     // RD kill rate 0.04-0.07
  // Mandelbulb-specific
  mode: number;    // 0=IFS, 1=Mandelbulb
  pow: number;     // Mandelbulb power 2-16
  bail: number;    // Mandelbulb bailout 1.5-4
  variant: number; // Mandelbulb variant 0=STD 1=SPIKEY 2=SLICEY 3=HILLY 4=SMOOTH
  glow: number;    // Glow halo 0-1
  mbIter: number;  // Mandelbulb DE iterations 4-14
  cutAxis: number; // Cross-section axis 0=NONE 1=X 2=Y 3=Z
  cutPos: number;  // Cross-section position -1 to 1
  // Mandelbulb time animation
  animate: boolean; // true = drive rotation + power oscillation + palette phase via uTime
}

export const IFS_SHAPE_KEYS = new Set([
  'menger_sponge',
  'mandelbox_fractal',
  'kleinian_fractal',
  'lattice_fractal',
  'tetrahedral_fractal',
  'anisotropic_menger',
  'chaos_boundary_menger',
  'compound_ifs_blend',
  'icosahedral_ifs',
  'fractal_weave',
  'reaction_diffusion_ifs',
  'lsystem_ifs',
  // New raymarched engines
  'mandelbulb_raymarched',
  'platonic_icosa',
  'platonic_octa',
  'platonic_dodeca',
  'menger_kleinian_v2',
]);

export function isIFSShape(type: string): boolean {
  return IFS_SHAPE_KEYS.has(type);
}

const DEFAULT_IFS: IFSParams = {
  ft: 0, mi: 4, sc: 3.0, ox: 1.0, oy: 1.0, oz: 1.0,
  fi: 1, fs: 1.0, fsc: 2.0, mr: 0.5, bl: 0.0,
  twist: 0.0, trap: 0,
  con: 0, cs: 2.5,
  cm: 0, pal: 0, bright: 1.4, sp: 0.7, la: 45, le: 35, rs: 140,
  dv: 5.0, fov: 55,
  autoRot: true, rotSpeed: 0.2,
  ls: 0, lt: 0.3, lg: 0.85,
  rdF: 0.055, rdK: 0.062,
  mode: 0, pow: 8, bail: 2.0, variant: 0, glow: 0.3, mbIter: 7,
  cutAxis: 0, cutPos: 0.0,
  animate: false,
};

export const IFS_SHAPE_PRESETS: Record<string, IFSParams> = {
  menger_sponge:     { ...DEFAULT_IFS, ft: 0, mi: 4, sc: 3.0, ox: 1.0, oy: 1.0, oz: 1.0, fi: 1, fs: 1.0, fsc: 2.0, mr: 0.5, bl: 0.0 },
  mandelbox_fractal: { ...DEFAULT_IFS, ft: 1, mi: 3, sc: 2.5, ox: 1.0, oy: 1.0, oz: 1.0, fi: 2, fs: 1.0, fsc: 1.8, mr: 0.5, bl: 0.2, bright: 1.5 },
  kleinian_fractal:  { ...DEFAULT_IFS, ft: 2, mi: 4, sc: 3.0, ox: 1.2, oy: 1.0, oz: 1.0, fi: 2, fs: 1.2, fsc: 1.7, mr: 0.4, bl: 0.1, bright: 1.6, cm: 0 },
  lattice_fractal:   { ...DEFAULT_IFS, ft: 3, mi: 3, sc: 3.0, ox: 0.8, oy: 0.8, oz: 0.8, fi: 2, fs: 0.8, fsc: 1.9, mr: 0.5, bl: 0.0, la: 60 },
  tetrahedral_fractal: { ...DEFAULT_IFS, ft: 4, mi: 3, sc: 2.8, ox: 1.0, oy: 1.0, oz: 1.0, fi: 2, fs: 1.0, fsc: 1.9, mr: 0.5, bl: 0.1, cm: 1 },
  anisotropic_menger: { ...DEFAULT_IFS, ft: 0, mi: 4, sc: 3.0, ox: 1.5, oy: 0.6, oz: 1.0, fi: 1, fs: 1.0, fsc: 2.0, mr: 0.5, bl: 0.0 },
  chaos_boundary_menger: { ...DEFAULT_IFS, ft: 1, mi: 4, sc: 3.0, ox: 1.0, oy: 1.0, oz: 1.0, fi: 3, fs: 0.8, fsc: 1.95, mr: 0.3, bl: 0.15, bright: 1.6, sp: 1.0, rs: 160 },
  compound_ifs_blend: { ...DEFAULT_IFS, ft: 1, mi: 4, sc: 3.0, ox: 1.0, oy: 1.0, oz: 1.0, fi: 2, fs: 1.0, fsc: 1.8, mr: 0.5, bl: 0.5, cm: 0, bright: 1.5 },
  icosahedral_ifs:   { ...DEFAULT_IFS, ft: 5, mi: 3, sc: 2.8, ox: 1.0, oy: 1.0, oz: 1.0, fi: 2, fs: 0.8, fsc: 2.0, mr: 0.5, bl: 0.0, con: 1, cs: 2.2, cm: 0, bright: 1.6, sp: 0.9, la: 30, le: 40, rs: 160 },
  // Fractal Weave: ft=weave type(0-5), mi=depth, sc=scale, ox/oy=warp/weft density, mr=thread radius, fs=float length, fsc=twist
  fractal_weave:     { ...DEFAULT_IFS, ft: 0, mi: 4, sc: 3.0, ox: 1.0, oy: 1.0, oz: 1.0, fi: 1, fs: 1.5, fsc: 2.0, mr: 0.35, bl: 0.0, con: 0, cm: 0, bright: 1.5, sp: 0.8, la: 45, le: 25, rs: 140, dv: 3.0 },
  // Reaction-Diffusion IFS: rdF=feed, rdK=kill, ft=IFS fold for seeding
  reaction_diffusion_ifs: { ...DEFAULT_IFS, ft: 1, mi: 3, sc: 2.6, ox: 1.0, oy: 1.0, oz: 1.0, fi: 1, fs: 1.0, fsc: 1.7, mr: 0.5, bl: 0.3, con: 0, cm: 0, bright: 1.6, sp: 0.5, la: 90, le: 20, rs: 150, dv: 4.5, rdF: 0.055, rdK: 0.062 },
  // L-System IFS: ls=growth type, lt=tropism, lg=growth scale, mi=depth, mr=branch radius, fs=angle, bl=IFS blend
  lsystem_ifs:       { ...DEFAULT_IFS, ft: 0, mi: 3, sc: 3.0, ox: 1.0, oy: 1.0, oz: 1.0, fi: 1, fs: 0.6, fsc: 1.8, mr: 0.06, bl: 0.4, con: 0, cm: 0, bright: 1.5, sp: 0.8, la: 45, le: 50, rs: 150, dv: 5.5, ls: 0, lt: 0.3, lg: 0.85 },
  // New raymarched engines
  mandelbulb_raymarched: { ...DEFAULT_IFS, mode: 1, pow: 8, bail: 2.0, variant: 0, glow: 0.3, mbIter: 7, rs: 110, dv: 2.6, fov: 58, cm: 0, pal: 0, sp: 0.7, la: 45, le: 40, bright: 1.2 },
  platonic_icosa: { ...DEFAULT_IFS, ft: 5, mi: 3, sc: 2.8, ox: 1.0, oy: 1.0, oz: 1.0, fi: 2, fs: 0.618, fsc: 1.75, mr: 0.4, bl: 0.0, cm: 0, bright: 1.5 },
  platonic_octa:  { ...DEFAULT_IFS, ft: 6, mi: 3, sc: 3.0, ox: 1.0, oy: 1.0, oz: 1.0, fi: 2, fs: 1.0, fsc: 1.85, mr: 0.45, bl: 0.0, cm: 1, bright: 1.5 },
  platonic_dodeca: { ...DEFAULT_IFS, ft: 7, mi: 3, sc: 2.6, ox: 1.0, oy: 1.0, oz: 1.0, fi: 2, fs: 1.0, fsc: 1.8, mr: 0.5, bl: 0.05, cm: 0, bright: 1.6 },
  menger_kleinian_v2: { ...DEFAULT_IFS, ft: 2, mi: 4, sc: 3.0, ox: 1.2, oy: 1.0, oz: 0.8, fi: 2, fs: 1.2, fsc: 1.7, mr: 0.4, bl: 0.1, twist: 0.15, trap: 1, bright: 1.6, cm: 0, rs: 160 },
};

export const FOLD_DESC = [
  'Pure Menger IFS. Base attractor. Hausdorff dim 2.727.',
  'Box fold (Mandelbox-type). Clamp-reflect. Creates bulbous compound forms. Stable below fsc 2.0.',
  'Kleinian sphere inversion. Conformal fold from 19th century complex analysis. Creates bubble/limit-set geometry. Stable below fsc 1.85.',
  'Lattice fold. Periodic wrapping into cubic cell. Creates infinite repeating compound lattice.',
  'Tetrahedral fold. Td symmetry group (24 ops). Creates 4-fold angular compound forms.',
  'Icosahedral fold. Ih symmetry group (120 ops). 5-fold axes, quasicrystalline — virus capsid and fullerene-adjacent attractors. Uses golden ratio PHI for mirror planes.',
  'Octahedral fold. Oh symmetry group (48 ops). Abs+sort reduces to fundamental octahedral domain. Highly symmetric cross-shaped attractors.',
  'Dodecahedral fold. Ih symmetry group (120 ops). Mirror planes from cubic+icosahedral normals. Creates 5-fold pentagonal compound forms.',
];

export const FSC_SAFE_CAP: Record<number, number> = {
  0: 2.0,   // Menger — attracts at exactly 3.0 scale; fsc≤2.0 keeps it stable
  1: 2.0,   // Box fold (Mandelbox-type) — diverges above 2.0
  2: 1.85,  // Kleinian sphere inversion — conformal limit; hard boundary at 1.85
  3: 3.5,   // Lattice fold — periodic wrapping is more stable; allow up to 3.5
  4: 3.5,   // Tetrahedral fold — angular symmetry is stable; allow up to 3.5
  5: 2.0,   // Icosahedral fold — phi-scaled; stable below 2.0
  6: 2.2,   // Octahedral fold — 8-fold symmetry; stable below 2.2
  7: 2.0,   // Dodecahedral fold — stable below 2.0
};

function safeRandom(): Partial<IFSParams> {
  const ft = ([0, 0, 1, 1, 2, 3, 4, 5, 6, 7] as const)[Math.floor(Math.random() * 10)];
  const fi = ft === 0 ? 1 : 1 + Math.floor(Math.random() * 3);
  const fsc_max = FSC_SAFE_CAP[ft] ?? 2.0;
  return {
    ft, fi,
    mi: 2 + Math.floor(Math.random() * 3),
    sc: 2.5 + Math.random() * 1.5,
    ox: 0.7 + Math.random() * 0.8,
    oy: 0.7 + Math.random() * 0.8,
    oz: 0.7 + Math.random() * 0.8,
    fs: 0.3 + Math.random() * 1.4,
    fsc: parseFloat((1.4 + Math.random() * (fsc_max - 1.4)).toFixed(2)),
    mr: 0.2 + Math.random() * 0.6,
    bl: Math.random() * 0.5,
    twist: Math.random() * 0.5,
    trap: Math.floor(Math.random() * 4),
    cm: Math.floor(Math.random() * 4),
    bright: 1.2 + Math.random() * 0.6,
    sp: 0.4 + Math.random() * 0.9,
    la: Math.random() * 360,
    le: 10 + Math.random() * 50,
    mode: 0,
  };
}

function chaosRandom(): Partial<IFSParams> {
  const ft = ([1, 2, 3, 4, 5, 6, 7] as const)[Math.floor(Math.random() * 7)];
  const fi = 2 + Math.floor(Math.random() * 2);
  const fsc_edge = Math.min(FSC_SAFE_CAP[ft] ?? 2.0, 1.75 + Math.random() * 0.2);
  return {
    ft, fi,
    mi: 3 + Math.floor(Math.random() * 2),
    sc: 2.8 + Math.random() * 0.8,
    ox: 0.8 + Math.random() * 0.6,
    oy: 0.8 + Math.random() * 0.6,
    oz: 0.8 + Math.random() * 0.6,
    fs: 0.5 + Math.random() * 1.0,
    fsc: parseFloat(fsc_edge.toFixed(2)),
    mr: 0.3 + Math.random() * 0.4,
    bl: Math.random() * 0.3,
    twist: Math.random() * 0.8,
    trap: Math.floor(Math.random() * 4),
    cm: Math.floor(Math.random() * 4),
    bright: 1.3 + Math.random() * 0.5,
    sp: 0.5 + Math.random() * 1.0,
    la: Math.random() * 360,
    le: 10 + Math.random() * 60,
    rs: 160,
    mode: 0,
  };
}

interface IFSStore {
  params: IFSParams;
  setParam: <K extends keyof IFSParams>(key: K, value: IFSParams[K]) => void;
  applyPreset: (shapeKey: string) => void;
  randomExplore: () => void;
  chaosBoundary: () => void;
  getDNA: () => string;
}

export const useIFSStore = create<IFSStore>((set, get) => ({
  params: { ...DEFAULT_IFS },

  setParam: (key, value) =>
    set(state => ({ params: { ...state.params, [key]: value } })),

  applyPreset: (shapeKey) => {
    const preset = IFS_SHAPE_PRESETS[shapeKey];
    if (preset) set(state => ({ params: { ...preset, animate: state.params.animate } }));
  },

  randomExplore: () =>
    set(state => ({ params: { ...state.params, ...safeRandom() } })),

  chaosBoundary: () =>
    set(state => ({ params: { ...state.params, ...chaosRandom() } })),

  getDNA: () => {
    const s = get().params;
    if (s.mode === 1) {
      return [
        'MB', 'pw' + s.pow, 'v' + s.variant,
        'it' + s.mbIter, 'bl' + s.bail.toFixed(1),
        'gl' + s.glow.toFixed(2),
      ].join('|');
    }
    return [
      'ft' + s.ft,
      'mi' + s.mi,
      'sc' + s.sc.toFixed(2),
      'ox' + s.ox.toFixed(2),
      'oy' + s.oy.toFixed(2),
      'oz' + s.oz.toFixed(2),
      'fi' + s.fi,
      'fs' + s.fs.toFixed(2),
      'fsc' + s.fsc.toFixed(2),
      'mr' + s.mr.toFixed(2),
      'bl' + s.bl.toFixed(3),
      'tw' + s.twist.toFixed(3),
      'tp' + s.trap,
    ].join('|');
  },
}));

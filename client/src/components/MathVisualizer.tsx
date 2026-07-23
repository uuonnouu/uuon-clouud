import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  Component,
} from "react";

class IFSErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean; errorMsg: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMsg: '' };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMsg: error.message };
  }
  componentDidCatch(error: Error) {
    console.error('IFS renderer error caught by boundary:', error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 text-cyan-400 text-sm gap-2">
          <span className="text-2xl">⚠️</span>
          <span>IFS renderer failed to initialise</span>
          <span className="text-xs text-gray-500">{this.state.errorMsg}</span>
          <button
            className="mt-2 px-3 py-1 bg-cyan-900/60 border border-cyan-500/40 rounded text-xs hover:bg-cyan-800/60"
            onClick={() => this.setState({ hasError: false, errorMsg: '' })}
          >Retry</button>
        </div>
      );
    }
    return this.props.children;
  }
}
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import {
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ChevronRight,
  X,
  Settings,
  Activity,
  Download,
  Upload,
  Share,
  Play,
  Pause,
  Sun,
  Moon,
  Zap,
  Sparkles,
} from "lucide-react";
import { SurfaceParameters, VisualizationMode } from "../types/math";
import ParametricSurface from "./ParametricSurface";
import ExpandedControlPanel from "./ExpandedControlPanel";
import {
  useParameterAuthority,
  ParameterKey,
  ParameterValues,
} from "../lib/parameterAuthority";
import ComprehensiveParameterPanel from "./ComprehensiveParameterPanel";
import PhysicsControlPanel from "./PhysicsControlPanel";
import InteractivePhysicsPanel from "./InteractivePhysicsPanel";
import ScalePresetPanel, { ScalePreset } from "./ScalePresetPanel";
import { getDefaultParameters } from "../lib/parametricSurfacesClean";
import { detectPhysicsCategory } from "../lib/physicsEngine";
import ProfessionalLighting from "./ProfessionalLighting";
import DepthEffects from "./DepthEffects";
import SmartGrid from "./SmartGrid";
import InteractivePhysicsGrid from "./InteractivePhysicsGrid";
import { shapeCache } from "../lib/shapeCache";
import { performanceMonitor } from "../lib/performanceMonitor";
import SecretsPanel from "./SecretsPanel";
import ClaudeDiscoveryPanel from "./ClaudeDiscoveryPanel";
import ShapeAIEnhancer from "./ShapeAIEnhancer";
import {
  validateParameters,
  preserveUserSettings,
  clearPreservedSettings,
} from "../lib/parameterValidator";
import { LegalNoticeModal } from "./LegalNoticeModal";
import { SystemInfoModal } from "./SystemInfoModal";
import { AppFooter } from "./AppFooter";
import CanvasOverlayControls from "./CanvasOverlayControls";
import { frontendSync } from "../lib/frontendSynchronization";
import LatticeNetworkEngine from "../lib/latticeNetworkEngine";
import ShareButton from "./ShareButton";
import { parseShareURL, clearShareParams } from "../lib/shareURLParser";
import ShapeFormulaBar from "./ShapeFormulaBar";
import { trackingService } from "../lib/trackingService";
import PromotionalSharePanel from "./PromotionalSharePanel";
import LockedPreviewBanner from "./LockedPreviewBanner";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { AttachedAssetsBrowser } from "./AttachedAssetsBrowser";
import MathematicalVerificationPanel from "./MathematicalVerificationPanel";
import ProofTestingPanel from "./ProofTestingPanel";
import UniversalEquationSolverPanel from "./UniversalEquationSolverPanel";
import { performanceOptimizer } from "../lib/performanceOptimizer";
import SystemHealthDashboard from "./SystemHealthDashboard";
import SystemInterconnectionPanel from "./SystemInterconnectionPanel";
import ShapeDynamicsPanel from "./ShapeDynamicsPanel";
import FractalFormulaPanel from "./FractalFormulaPanel";
import DynamicMaterialPanel from "./DynamicMaterialPanel";
import EngineeringPBRPanel from "./EngineeringPBRPanel";
import {
  applyConstantTransform,
  type ConstantKey,
  type FractalFormula,
} from "../lib/fractalFormulaExtensions";
import { applyUnfoldPreset, shouldUnfold } from "../lib/shapeUnfoldPresets";
import { formatShapeName } from "../lib/shapeCategories";
import {
  ReactiveMaterialConfig,
  REACTIVE_MATERIAL_PRESETS,
} from "../lib/reactiveMaterialEngine";
import SocialShareModal from "./SocialShareModal";
import { BookOpen } from "lucide-react";
import GeometricIdentityPanel from "./GeometricIdentityPanel";
import { useIdentityAuthority } from "../lib/identityAuthority";
import QuantumCoreModal, { QuantumCoreButton } from "./QuantumCoreModal";
import IFSCanvas, { IFSCanvasHandle } from "./IFSCanvas";
import IFSControlPanel from "./IFSControlPanel";
import { exportIFSTextureGLB, exportIFSMeshGLB } from "../lib/ifsGLBExporter";
import AutonomousAnimation from "./AutonomousAnimation";
import QueensBridgePanel from "./QueensBridgePanel";
import { QuantumComputingPanel } from "./QuantumComputingPanel";
import AtomicExplorer from "./AtomicExplorer";
import VoiceControlPanel from "./VoiceControlPanel";
import FormulaMappingPanel from "./FormulaMappingPanel";
import LatticeNetworkPanel from "./LatticeNetworkPanel";
import EquationDisplay from "./EquationDisplay";
import { isIFSShape, useIFSStore, IFS_SHAPE_PRESETS } from "../stores/ifsStore";

// Simplified background system - 3 solid colors only
const BACKGROUND_PRESETS = {
  black: { type: "solid", value: "#000000", color: 0x000000 },
  white: { type: "solid", value: "#f3f4f6", color: 0xf3f4f6 },
  gray: { type: "solid", value: "#1a1a1a", color: 0x1a1a1a },
} as const;

function getBackgroundColor(mode: string): number {
  const preset = BACKGROUND_PRESETS[mode as keyof typeof BACKGROUND_PRESETS];
  return preset ? preset.color : 0x000000;
}

const CAMERA_DISTANCE_MAP: Array<[RegExp, number]> = [
  [/qubit|bloch|orbital|hydrogen|schrodinger|quantum_state|photon|boson|fermion|quark|electron_cloud/, 4],
  [/lorenz|rossler|attractor|mandelbulb|mandelbox|julia_3d|kleinian|menger|ifs_/, 80],
  [/schwarzschild|kerr|wormhole|spacetime|gravitational_wave|wheeler|superstring|calabi|cosmic|big_bang/, 100],
  [/tesseract|polytope|hypercube|penrose|_4d/, 30],
];

function getCameraDistance(shapeType: string): number {
  const t = (shapeType || '').toLowerCase();
  for (const [pattern, dist] of CAMERA_DISTANCE_MAP) {
    if (pattern.test(t)) return dist;
  }
  return 20;
}

function CameraAutoAdjuster({
  orbitRef,
  shapeType,
}: {
  orbitRef: any;
  shapeType: string;
}) {
  const { camera } = useThree();

  useEffect(() => {
    if (!orbitRef.current) return;
    const d = getCameraDistance(shapeType);
    camera.position.set(d * 0.5, d * 0.35, d * 0.7);
    orbitRef.current.target.set(0, 0, 0);
    orbitRef.current.update();
  }, [camera, orbitRef, shapeType]);

  return null;
}

function HolographicLight({ colorMode, backgroundMode }: { colorMode: string; backgroundMode: string }) {
  const isHolo = colorMode === 'holographic' || colorMode === 'spectral' || colorMode === 'prismatic';
  const isDark = backgroundMode === 'black' || backgroundMode === 'dark' || backgroundMode === 'space';
  if (!isHolo || !isDark) return null;
  return (
    <>
      <pointLight position={[0, 5, 0]} intensity={1.2} color="#7c3aed" distance={300} decay={2} />
      <pointLight position={[15, 0, 15]} intensity={0.8} color="#06b6d4" distance={200} decay={2} />
    </>
  );
}

function HolographicEmissiveBoost({ colorMode, backgroundMode }: { colorMode: string; backgroundMode: string }) {
  const { scene } = useThree();
  const isHolo = colorMode === 'holographic' || colorMode === 'spectral' || colorMode === 'prismatic';
  const isDark = backgroundMode === 'black' || backgroundMode === 'dark' || backgroundMode === 'space';
  const targetIntensity = isHolo && isDark ? 0.4 : 0;

  useEffect(() => {
    scene.traverse((obj: any) => {
      if (!obj.isMesh) return;
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      mats.forEach((mat: any) => {
        if ('emissiveIntensity' in mat) {
          mat.emissiveIntensity = targetIntensity;
        }
      });
    });
  }, [scene, targetIntensity]);

  return null;
}

function MathVisualizer() {
  const orbitControlsRef = useRef<any>(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [webglContextLost, setWebglContextLost] = useState(false);
  const defaults = getDefaultParameters("sphere");

  const batchUpdateAuthority = useParameterAuthority(
    (state) => state.batchUpdate,
  );
  const setAuthorityShape = useParameterAuthority((state) => state.setShape);
  const [parameters, setParameters] = useState<SurfaceParameters>({
    type: "sphere" as any,
    a: defaults.a ?? 1,
    b: defaults.b ?? 1,
    c: defaults.c ?? 1,
    d: defaults.d ?? 0,
    e: defaults.e ?? 0,
    f: defaults.f ?? 0,
    g: defaults.g ?? 0,
    h: defaults.h ?? 0,
    i: defaults.i ?? 0,
    j: defaults.j ?? 0,
    k: defaults.k ?? 0,
    l: defaults.l ?? 0,
    m: defaults.m ?? 0,
    n: defaults.n ?? 0,
    o: defaults.o ?? 0,
    p: defaults.p ?? 0,
    q: defaults.q ?? 0,
    r: defaults.r ?? 0,
    s: defaults.s ?? 0,
    t: defaults.t ?? 0,
    u: defaults.u ?? 0,
    v: defaults.v ?? 0,
    w: defaults.w ?? 0,
    x: defaults.x ?? 1,
    y: defaults.y ?? 1,
    z: defaults.z ?? 1,
    time: 0,
    uMin: defaults.uMin ?? 0,
    uMax: defaults.uMax ?? 1,
    vMin: defaults.vMin ?? 0,
    vMax: defaults.vMax ?? 1,
    uSegments: defaults.uSegments ?? 360,
    vSegments: defaults.vSegments ?? 360,
  });

  const [visualMode, setVisualizationMode] =
    useState<VisualizationMode>("wireframe");
  // Start with "none" since initial mode is wireframe (clean lines, no material overlay)
  const [colorMode, setColorMode] = useState("none");
  const prevColorModeRef = useRef<string>("holographic");
  // "none" is the sentinel value for no-material (clean wireframe / cleared state)
  const [hasChangedFromInitial, setHasChangedFromInitial] = useState(false);
  const [backgroundMode, setBackgroundMode] = useState<string>("black");
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showGrid, setShowGrid] = useState(true);
  const [isAlgorithmCollapsed, setIsAlgorithmCollapsed] = useState(true);
  const [showSecretsPanel, setShowSecretsPanel] = useState(false);
  const [showLegalNotice, setShowLegalNotice] = useState(false);
  const [showSystemInfo, setShowSystemInfo] = useState(false);
  const [showShapeDynamics, setShowShapeDynamics] = useState(false);
  const [showWireframeTip, setShowWireframeTip] = useState(false);
  const [currentGeometry, setCurrentGeometry] =
    useState<THREE.BufferGeometry | null>(null);
  const [showFractalFormulas, setShowFractalFormulas] = useState(false);
  const [isPhysicsAnimating, setIsPhysicsAnimating] = useState(false);
  const [animationType, setAnimationType] = useState<
    "spin" | "precession" | "tumble" | "stable" | "gyroscope" | "tensor"
  >("tensor");
  const [animationVelocity, setAnimationVelocity] = useState(1);
  const [breatheIntensity, setBreatheIntensity] = useState(0.5);
  const [dynamicsMode, setDynamicsMode] = useState<'rigid' | 'soft'>('soft');
  const [animationPreset, setAnimationPreset] = useState<string>("off");
  const [usePhysics, setUsePhysics] = useState(false);
  const [scalePreset, setScalePreset] = useState<ScalePreset>("meso");
  const [latticeEngine, setLatticeEngine] =
    useState<LatticeNetworkEngine | null>(null);
  const [showLatticePanel, setShowLatticePanel] = useState(false);
  const [isLockedPreview, setIsLockedPreview] = useState(false);
  const [lockedPreviewName, setLockedPreviewName] = useState<
    string | undefined
  >();
  const [showPromotionalShare, setShowPromotionalShare] = useState(false);
  const [showSystemHealth, setShowSystemHealth] = useState(false);
  const [showDiscovery, setShowDiscovery] = useState(false);
  const [showShapeEnhancer, setShowShapeEnhancer] = useState(false);
  const [showSocialShare, setShowSocialShare] = useState(false);
  const [showQuantumCore, setShowQuantumCore] = useState(false);
  const [autonomousEnabled, setAutonomousEnabled] = useState(false);
  const [autonomousIntensity, setAutonomousIntensity] = useState(1.0);
  const [autonomousMode, setAutonomousMode] = useState<'breathe' | 'wave' | 'morph' | 'expand'>('breathe');
  // ✅ RECONNECTED: QueensBridge toggle state
  const [showQueensBridge, setShowQueensBridge] = useState(false);

  const [physicsOpen, setPhysicsOpen] = useState(false);
  const [interactivePhysicsOpen, setInteractivePhysicsOpen] = useState(false);
  const [mathControlsOpen, setMathControlsOpen] = useState(true);
  const [parametersOpen, setParametersOpen] = useState(false);
  const [scalePresetsOpen, setScalePresetsOpen] = useState(false);
  const [promoShareOpen, setPromoShareOpen] = useState(false);
  const [dynamicMaterialsOpen, setDynamicMaterialsOpen] = useState(false);
  const [engineeringPBROpen, setEngineeringPBROpen] = useState(false);
  const [ifsOpen, setIfsOpen] = useState(true);
  // ✅ RECONNECTED: QueensBridge collapsible state
  const [queensBridgeOpen, setQueensBridgeOpen] = useState(false);
  // Orphaned panel collapsible states
  const [quantumComputingOpen, setQuantumComputingOpen] = useState(false);
  const [atomicExplorerOpen, setAtomicExplorerOpen] = useState(false);
  const [voiceControlOpen, setVoiceControlOpen] = useState(false);
  const [formulaMappingOpen, setFormulaMappingOpen] = useState(false);
  const [latticeNetworkOpen, setLatticeNetworkOpen] = useState(false);
  const [equationDisplayOpen, setEquationDisplayOpen] = useState(false);

  const [reactiveMaterial, setReactiveMaterial] =
    useState<ReactiveMaterialConfig>(REACTIVE_MATERIAL_PRESETS.glow_proximity);

  const [physicsConfig, setPhysicsConfig] = useState({
    timeStep: 0.016,
    dampingFactor: 0.98,
    gravityStrength: 9.8,
    displayForces: true,
    displayTrails: true,
    colorMode: "energy" as
      | "energy"
      | "velocity"
      | "temperature"
      | "phase"
      | "none",
  });

  const [interactivePhysicsConfig, setInteractivePhysicsConfig] = useState({
    enabled: false,
    gravity: 9.8,
    groundLevel: -3,
    throwMultiplier: 8,
  });
  const [interactivePhysicsState, setInteractivePhysicsState] = useState<{
    position: { x: number; y: number; z: number };
    velocity: { x: number; y: number; z: number };
    isGrabbed: boolean;
    isSettled: boolean;
  } | null>(null);
  const interactivePhysicsRef = React.useRef<any>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        console.warn("⚠️ WebGL not supported in this environment");
        setWebglSupported(false);
      }
    } catch (e) {
      console.warn("⚠️ WebGL check failed:", e);
      setWebglSupported(false);
    }
  }, []);

  useEffect(() => {
    if (webglSupported) {
      shapeCache.preloadCommonShapes();
    }
  }, [webglSupported]);

  useEffect(() => {
    if (parameters.type) {
      trackingService.trackShapeView(parameters.type, parameters);
    }
  }, [parameters.type]);

  useEffect(() => {
    const {
      type,
      parameters: sharedParams,
      isSharedLink,
      isLockedPreview: locked,
      previewName,
    } = parseShareURL();
    if (isSharedLink && sharedParams.type) {
      console.log(
        locked
          ? "🔒 Loading LOCKED preview shape:"
          : "📎 Loading shared shape:",
        type,
      );
      setParameters((prev) => ({
        ...prev,
        ...sharedParams,
      }));

      if (locked) {
        setIsLockedPreview(true);
        setLockedPreviewName(previewName);
        console.log(
          "🔒 Locked preview mode activated - shape selection disabled",
        );
      } else {
        clearShareParams();
      }

      setNotifications((prev) => [
        ...prev,
        locked
          ? `Previewing: ${previewName || type.replace(/_/g, " ")}`
          : `Loaded shared shape: ${type.replace(/_/g, " ")}`,
      ]);
    }
  }, []);

  const { updateIdentity } = useIdentityAuthority();

  const ifsParams = useIFSStore((state) => state.params);
  const applyIFSPreset = useIFSStore((state) => state.applyPreset);
  const setIFSParam = useIFSStore((state) => state.setParam);

  const ifsCanvasRef = React.useRef<IFSCanvasHandle>(null);
  const [ifsExportState, setIfsExportState] = React.useState<{
    exporting: boolean; progress: string; pct: number;
  }>({ exporting: false, progress: '', pct: 0 });

  const MESH_QUALITY_RES: Record<string, number> = { draft: 22, standard: 34, high: 46 };
  const handleIFSExportGLB = React.useCallback(async (
    mode: 'texture' | 'mesh',
    quality: string = 'standard',
  ) => {
    if (ifsExportState.exporting) return;
    setIfsExportState({ exporting: true, progress: 'Starting…', pct: 0 });
    try {
      if (mode === 'texture') {
        const dataUrl = ifsCanvasRef.current?.captureDataUrl();
        if (!dataUrl) throw new Error('Canvas not ready — please wait for the shape to render');
        await exportIFSTextureGLB(dataUrl, parameters.type, ifsParams, (msg, pct) => {
          setIfsExportState({ exporting: true, progress: msg, pct });
        });
      } else {
        const res = MESH_QUALITY_RES[quality] ?? 34;
        await exportIFSMeshGLB(parameters.type, ifsParams, res, (msg, pct) => {
          setIfsExportState({ exporting: true, progress: msg, pct });
        });
      }
      setIfsExportState({ exporting: false, progress: '', pct: 0 });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setIfsExportState({ exporting: false, progress: `Error: ${msg}`, pct: 0 });
      setTimeout(() => setIfsExportState({ exporting: false, progress: '', pct: 0 }), 4000);
    }
  }, [ifsExportState.exporting, parameters.type, ifsParams]);

  useEffect(() => {
    if (isIFSShape(parameters.type)) {
      applyIFSPreset(parameters.type);
      setIfsOpen(true);
    }
  }, [parameters.type]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isIFSShape(parameters.type)) return;
    setIFSParam("dv", Math.max(1.0, Math.min(14.0, parameters.a * 5.0)));
    setIFSParam("fov", Math.max(25, Math.min(90, parameters.b * 55)));
    setIFSParam("bright", Math.max(0.5, Math.min(3.0, parameters.c * 1.4)));
  }, [parameters.a, parameters.b, parameters.c, parameters.type, setIFSParam]);

  const handleVisualizationModeChange = useCallback(
    (mode: VisualizationMode) => {
      if (mode === "wireframe" && visualMode !== "wireframe") {
        prevColorModeRef.current = colorMode;
        setColorMode("none");
      } else if (mode !== "wireframe" && visualMode === "wireframe") {
        setColorMode(prevColorModeRef.current || "holographic");
      }
      setVisualizationMode(mode);
    },
    [visualMode, colorMode],
  );

  const handleParameterChange = useCallback(
    (newParams: Partial<SurfaceParameters>) => {
      const oldParams = parameters;
      try {
        if (!newParams || typeof newParams !== "object") {
          console.warn("⚠️ Invalid parameter update:", newParams);
          return;
        }

        const azKeys = [
          "a",
          "b",
          "c",
          "d",
          "e",
          "f",
          "g",
          "h",
          "i",
          "j",
          "k",
          "l",
          "m",
          "n",
          "o",
          "p",
          "q",
          "r",
          "s",
          "t",
          "u",
          "v",
          "w",
          "x",
          "y",
          "z",
        ] as const;

        if (newParams.type === "wiregenesis_mesh") {
          console.log(
            "🎯 WireGenesis mode activated - using generated mesh parameters",
          );
          setParameters((prev) =>
            validateParameters({
              ...prev,
              ...newParams,
              type: "wiregenesis_mesh" as any,
            }),
          );

          const azParams: Partial<ParameterValues> = {};
          azKeys.forEach((key) => {
            if (
              key in newParams &&
              typeof (newParams as any)[key] === "number"
            ) {
              azParams[key] = (newParams as any)[key];
            }
          });
          if (Object.keys(azParams).length > 0) {
            batchUpdateAuthority(azParams, "wiregenesis");
          }
          setAuthorityShape("wiregenesis_mesh");
          return;
        }

        if (
          newParams.type &&
          typeof newParams.type === "string" &&
          newParams.type !== parameters.type
        ) {
          clearPreservedSettings();
          console.log("🧹 Cleared preserved settings for shape change");

          if (isIFSShape(newParams.type)) {
            const preset = IFS_SHAPE_PRESETS[newParams.type];
            const initA = parseFloat(
              Math.max(0.2, Math.min(10, (preset?.dv ?? 5.0) / 5.0)).toFixed(3),
            );
            const initB = parseFloat(
              Math.max(0.2, Math.min(1.6, (preset?.fov ?? 55) / 55)).toFixed(3),
            );
            const initC = parseFloat(
              Math.max(
                0.4,
                Math.min(2.1, (preset?.bright ?? 1.4) / 1.4),
              ).toFixed(3),
            );
            const ifsBase = {
              type: newParams.type,
              a: initA,
              b: initB,
              c: initC,
              d: 0,
              e: 0,
              f: 0,
              g: 0,
              h: 0,
              i: 0,
              j: 0,
              k: 0,
              l: 0,
              m: 0,
              n: 0,
              o: 0,
              p: 0,
              q: 0,
              r: 0,
              s: 0,
              t: 0,
              u: 0,
              v: 0,
              w: 0,
              x: 1,
              y: 1,
              z: 1,
              time: 0,
              uMin: 0,
              uMax: 1,
              vMin: 0,
              vMax: 1,
              uSegments: 32,
              vSegments: 32,
            } as SurfaceParameters;
            setParameters(ifsBase);
            applyIFSPreset(newParams.type);
            setIfsOpen(true);
            setAuthorityShape(newParams.type);
            console.log(
              "🌀 IFS shape activated:",
              newParams.type,
              `| a=${initA} b=${initB} c=${initC}`,
            );
            return;
          }

          const shapeDefaults = getDefaultParameters(newParams.type);
          if (!shapeDefaults || Object.keys(shapeDefaults).length === 0) {
            console.warn("⚠️ Invalid shape type, using sphere fallback");
            const sphereDefaults = getDefaultParameters("sphere");
            const fullParams = {
              ...sphereDefaults,
              type: "sphere",
              x: 1,
              y: 1,
              z: 1,
            } as SurfaceParameters;
            setParameters(validateParameters(fullParams));
            setAuthorityShape("sphere");
            return;
          }

          const fullDefaults: SurfaceParameters = {
            type: newParams.type,
            a: shapeDefaults.a ?? 1,
            b: shapeDefaults.b ?? 1,
            c: shapeDefaults.c ?? 1,
            d: shapeDefaults.d ?? 0,
            e: shapeDefaults.e ?? 0,
            f: shapeDefaults.f ?? 0,
            g: shapeDefaults.g ?? 0,
            h: shapeDefaults.h ?? 0,
            i: shapeDefaults.i ?? 0,
            j: shapeDefaults.j ?? 0,
            k: shapeDefaults.k ?? 0,
            l: shapeDefaults.l ?? 0,
            m: shapeDefaults.m ?? 0,
            n: shapeDefaults.n ?? 0,
            o: shapeDefaults.o ?? 0,
            p: shapeDefaults.p ?? 0,
            q: shapeDefaults.q ?? 0,
            r: shapeDefaults.r ?? 0,
            s: shapeDefaults.s ?? 0,
            t: shapeDefaults.t ?? 0,
            u: shapeDefaults.u ?? 0,
            v: shapeDefaults.v ?? 0,
            w: shapeDefaults.w ?? 0,
            x: shapeDefaults.x ?? 1,
            y: shapeDefaults.y ?? 1,
            z: shapeDefaults.z ?? 1,
            time: 0,
            uMin: shapeDefaults.uMin ?? 0,
            uMax: shapeDefaults.uMax ?? 1,
            vMin: shapeDefaults.vMin ?? 0,
            vMax: shapeDefaults.vMax ?? 1,
            uSegments: shapeDefaults.uSegments ?? 360,
            vSegments: shapeDefaults.vSegments ?? 360,
          } as SurfaceParameters;

          if (shouldUnfold(newParams.type)) {
            const unfoldedParams = applyUnfoldPreset(
              newParams.type,
              fullDefaults,
            );
            Object.assign(fullDefaults, unfoldedParams);
            console.log("🔓 Applied unfold preset for:", newParams.type);
          }

          const validatedParams = validateParameters(fullDefaults);
          setParameters(validatedParams);

          if (isIFSShape(newParams.type)) {
            applyIFSPreset(newParams.type);
            setIfsOpen(true);
          }

          const azParams: Partial<ParameterValues> = {};
          azKeys.forEach((key) => {
            azParams[key] = (validatedParams as any)[key];
          });
          batchUpdateAuthority(azParams, "shape-change");
          setAuthorityShape(newParams.type);
          console.log(
            "🔄 Shape changed to:",
            newParams.type,
            "- All parameters reset to defaults",
          );
          return;
        }

        Object.entries(newParams).forEach(([key, value]) => {
          if (typeof value === "number") {
            preserveUserSettings(key as keyof SurfaceParameters, value);
          }
        });

        const updatedParams = { ...parameters };
        Object.entries(newParams).forEach(([key, value]) => {
          if (key !== "type" || newParams.type) {
            (updatedParams as any)[key] = value;
          }
        });

        const validatedParams = validateParameters(updatedParams);
        setParameters(validatedParams);

        const azParams: Partial<ParameterValues> = {};
        azKeys.forEach((key) => {
          if (key in newParams && typeof (newParams as any)[key] === "number") {
            azParams[key] = (newParams as any)[key];
          }
        });
        if (Object.keys(azParams).length > 0) {
          batchUpdateAuthority(azParams, "control-panel");
          console.log(
            "⚡ Synced to Parameter Authority:",
            Object.keys(azParams).join(", "),
          );
        }

        Object.entries(newParams).forEach(([key, value]) => {
          if (key !== "type" && key !== "_syncUpdate") {
            trackingService.trackParameterChange(
              validatedParams.type,
              key,
              parameters[key as keyof SurfaceParameters],
              value,
            );
          }
        });

        updateIdentity(parameters.type, oldParams, validatedParams);
      } catch (error) {
        console.error("❌ Error updating parameters:", error);
        const sphereDefaults = getDefaultParameters("sphere");
        setParameters((prev) =>
          validateParameters({
            ...prev,
            ...sphereDefaults,
            type: "sphere",
          }),
        );
      }
    },
    [parameters, batchUpdateAuthority, setAuthorityShape, updateIdentity],
  );

  useEffect(() => {
    const handleGLTFSuccess = (event: CustomEvent) => {
      const { filename, fileSize, shape, quality, vertexCount } = event.detail;
      const qualityIndicator =
        quality === "Ultra-HD (10x Resolution)" ? "💎" : "📦";
      const vertexInfo = vertexCount
        ? ` | ${Math.floor(vertexCount / 1000)}K vertices`
        : "";
      const message = `✅ ${qualityIndicator} ${shape} exported: ${filename} (${fileSize})${vertexInfo}`;
      setNotifications((prev) => [message, ...prev.slice(0, 4)]);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => !n.includes(filename)));
      }, 7000);
    };

    const handleGLTFError = (event: CustomEvent) => {
      const { error } = event.detail;
      setNotifications((prev) => [
        `❌ GLTF export failed: ${error}`,
        ...prev.slice(0, 4),
      ]);
      setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((n) => !n.includes("GLTF export failed")),
        );
      }, 10000);
    };

    window.addEventListener(
      "gltfExportSuccess",
      handleGLTFSuccess as EventListener,
    );
    window.addEventListener(
      "gltfExportError",
      handleGLTFError as EventListener,
    );

    return () => {
      window.removeEventListener(
        "gltfExportSuccess",
        handleGLTFSuccess as EventListener,
      );
      window.removeEventListener(
        "gltfExportError",
        handleGLTFError as EventListener,
      );
    };
  }, []);

  const handleExport = (
    format: string = "json",
    exportTypeOrQuality: string = "solid",
    options?: { bakeLighting?: boolean; lightingSettings?: any; securityLevel?: string; password?: string },
  ) => {
    const filename = `dmension-${parameters.type ?? 'shape'}-${Date.now()}`;
    // Map VersatileExportPanel quality strings to legacy exportType
    const qualityToType: Record<string, string> = {
      low: "solid", medium: "solid", high: "ultra-hd", ultra: "ultra-hd"
    };
    const exportType = qualityToType[exportTypeOrQuality] ?? exportTypeOrQuality;

    if (format === "json") {
      const exportData = {
        parameters,
        visualMode,
        colorMode,
        timestamp: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (format === "glb" || format === "gltf") {
      // Both GLB and GLTF route through the Three.js GLTF exporter in ParametricSurface
      const exportEvent = new CustomEvent("exportGLTF", {
        detail: {
          parameters,
          visualMode,
          colorMode,
          filename,
          exportType,
          binary: format === "glb",
          bakeLighting: options?.bakeLighting,
          lightingSettings: options?.lightingSettings,
          securityLevel: options?.securityLevel ?? "open",
        },
      });
      window.dispatchEvent(exportEvent);
    } else if (format === "zip") {
      const exportEvent = new CustomEvent("exportZIP", {
        detail: {
          parameters,
          visualMode,
          colorMode,
          filename,
          exportType,
        },
      });
      window.dispatchEvent(exportEvent);
    } else if (format === "ply") {
      const exportEvent = new CustomEvent("exportPLY", {
        detail: { parameters, visualMode, colorMode, filename, exportType },
      });
      window.dispatchEvent(exportEvent);
    } else if (format === "stl") {
      const exportEvent = new CustomEvent("exportSTL", {
        detail: { parameters, visualMode, colorMode, filename, exportType },
      });
      window.dispatchEvent(exportEvent);
    } else if (format === "obj" || format === "fbx") {
      // Fall back to GLB for unsupported formats — notifies user via success event
      const exportEvent = new CustomEvent("exportGLTF", {
        detail: {
          parameters, visualMode, colorMode,
          filename: filename + `_as_glb`,
          exportType, binary: true,
          securityLevel: options?.securityLevel ?? "open",
        },
      });
      window.dispatchEvent(exportEvent);
    } else if (format === "nerf" || format === "points" || format === "tubular" || format === "laser") {
      const exportEvent = new CustomEvent("exportGLTF", {
        detail: {
          parameters, visualMode, colorMode, filename, exportType,
          binary: true, securityLevel: options?.securityLevel ?? "open",
        },
      });
      window.dispatchEvent(exportEvent);
    }
  };

  useEffect(() => {
    performanceMonitor.startTimer("appInit");
    shapeCache.preloadCommonShapes();
    const optimizedSettings = performanceOptimizer.getOptimizedSettings();
    console.log("🔧 Optimized settings applied:", optimizedSettings);
    const unregisterSync = frontendSync.registerUpdateCallback(() => {
      console.log("🔄 Frontend sync triggering parameter refresh");
      setParameters((prev) => ({ ...prev, _syncUpdate: Date.now() }));
    });
    performanceMonitor.endTimer("appInit");
    return () => {
      unregisterSync();
    };
  }, []);

  useEffect(() => {
    if ((window as any).threeScene) {
      const scene = (window as any).threeScene;
      scene.background = new THREE.Color(getBackgroundColor(backgroundMode));
    }
  }, [backgroundMode]);

  const currentParameters = parameters;
  const animationMode = "none";

  const handleUnlockPreview = () => {
    setIsLockedPreview(false);
    setLockedPreviewName(undefined);
    clearShareParams();
    window.location.href = window.location.origin + window.location.pathname;
  };

  const shapeType = parameters.type;

  return (
    <div
      className={`relative w-full h-screen overflow-hidden flex flex-col bg-black ${isLockedPreview ? "pt-14" : ""}`}
    >
      {isLockedPreview && (
        <LockedPreviewBanner
          shapeName={lockedPreviewName}
          shapeType={parameters.type}
          onUnlock={handleUnlockPreview}
        />
      )}

      {notifications.length > 0 && (
        <div className="absolute top-4 right-4 z-50 space-y-2">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className="bg-green-900/90 border border-green-500/50 text-green-300 px-4 py-2 rounded-lg
                         backdrop-blur-sm animate-pulse shadow-lg text-sm max-w-sm"
            >
              {notification}
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <div className="w-[280px] sm:w-72 md:w-80 h-full bg-black/80 backdrop-blur-md border-r border-cyan-500/50 overflow-y-auto flex-shrink-0">
          <div className="p-3 space-y-3">
            {/* Physics Simulation Controls */}
            <Collapsible open={physicsOpen} onOpenChange={setPhysicsOpen}>
              <div className="bg-gradient-to-r from-blue-900/60 to-purple-900/60 rounded-lg border-2 border-blue-400/50 shadow-lg shadow-blue-500/20 overflow-hidden">
                <CollapsibleTrigger asChild>
                  <button className="w-full flex flex-col p-3 hover:bg-blue-500/10 transition-colors">
                    <div className="w-full flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-300 text-sm font-bold">
                          Physics Simulation
                        </span>
                      </div>
                      {physicsOpen ? (
                        <ChevronUp className="w-4 h-4 text-blue-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-blue-400" />
                      )}
                    </div>
                    <span className="text-[10px] text-blue-400/70 mt-1 text-left">
                      Gravity, damping, forces, trails
                    </span>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-3 pt-0">
                    <PhysicsControlPanel
                      physicsEnabled={usePhysics}
                      onPhysicsToggle={setUsePhysics}
                      physicsConfig={physicsConfig}
                      onConfigChange={setPhysicsConfig}
                      currentCategory={detectPhysicsCategory(parameters.type)}
                    />
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* Interactive Physics */}
            <Collapsible
              open={interactivePhysicsOpen}
              onOpenChange={setInteractivePhysicsOpen}
            >
              <div className="bg-gradient-to-r from-purple-900/60 to-pink-900/60 rounded-lg border-2 border-purple-400/50 shadow-lg shadow-purple-500/20 overflow-hidden">
                <CollapsibleTrigger asChild>
                  <button className="w-full flex flex-col p-3 hover:bg-purple-500/10 transition-colors">
                    <div className="w-full flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-purple-400" />
                        <span className="text-purple-300 text-sm font-bold">
                          Interactive Physics
                        </span>
                      </div>
                      {interactivePhysicsOpen ? (
                        <ChevronUp className="w-4 h-4 text-purple-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-purple-400" />
                      )}
                    </div>
                    <span className="text-[10px] text-purple-400/70 mt-1 text-left">
                      Drag shapes, collisions, real-time response
                    </span>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-3 pt-0">
                    <InteractivePhysicsPanel
                      config={interactivePhysicsConfig}
                      onConfigChange={setInteractivePhysicsConfig}
                      onReset={() => interactivePhysicsRef.current?.reset()}
                      materialId={colorMode}
                      physicsState={interactivePhysicsState}
                    />
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* Mathematical Controls */}
            <Collapsible
              open={mathControlsOpen}
              onOpenChange={setMathControlsOpen}
            >
              <div className="bg-black/40 rounded-lg border border-cyan-500/30 overflow-hidden">
                <CollapsibleTrigger asChild>
                  <button className="w-full flex flex-col p-3 hover:bg-cyan-500/10 transition-colors">
                    <div className="w-full flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-cyan-400" />
                        <span className="text-cyan-400 text-sm font-bold">
                          Mathematical Controls
                        </span>
                      </div>
                      {mathControlsOpen ? (
                        <ChevronUp className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-cyan-400" />
                      )}
                    </div>
                    <span className="text-[10px] text-cyan-400/70 mt-1 text-left">
                      Shape selection, materials, grid, animations
                    </span>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-3 pt-0">
                    <ExpandedControlPanel
                      parameters={parameters}
                      visualMode={visualMode}
                      colorMode={colorMode}
                      backgroundMode={backgroundMode}
                      showGrid={showGrid}
                      animationPreset={animationPreset}
                      isAnimating={isPhysicsAnimating}
                      tensorAnimType={animationType}
                      animationVelocity={animationVelocity}
                      onParameterChange={handleParameterChange}
                      onVisualizationModeChange={handleVisualizationModeChange}
                      onColorModeChange={setColorMode}
                      onBackgroundModeChange={setBackgroundMode}
                      onShowGridChange={setShowGrid}
                      onAnimationPresetChange={setAnimationPreset}
                      onAnimToggle={() => setIsPhysicsAnimating(p => !p)}
                      onTensorAnimTypeChange={v => setAnimationType(v as any)}
                      onAnimationVelocityChange={setAnimationVelocity}
                      breatheIntensity={breatheIntensity}
                      dynamicsMode={dynamicsMode}
                      onBreatheIntensityChange={setBreatheIntensity}
                      onDynamicsModeChange={setDynamicsMode}
                      onExport={handleExport}
                    />
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* 26-Parameter System */}
            <Collapsible open={parametersOpen} onOpenChange={setParametersOpen}>
              <div className="bg-black/40 rounded-lg border border-green-500/30 overflow-hidden">
                <CollapsibleTrigger asChild>
                  <button className="w-full flex flex-col p-3 hover:bg-green-500/10 transition-colors">
                    <div className="w-full flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm font-bold">
                          26-Parameter System
                        </span>
                      </div>
                      {parametersOpen ? (
                        <ChevronUp className="w-4 h-4 text-green-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                    <span className="text-[10px] text-green-400/70 mt-1 text-left">
                      A-Z axes, UV domain, mesh density, transforms
                    </span>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-3 pt-0">
                    <ComprehensiveParameterPanel
                      parameters={parameters}
                      onParameterChange={handleParameterChange}
                    />
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* Scale Dynamics */}
            <Collapsible
              open={scalePresetsOpen}
              onOpenChange={setScalePresetsOpen}
            >
              <div className="bg-black/40 rounded-lg border border-indigo-500/30 overflow-hidden">
                <CollapsibleTrigger asChild>
                  <button className="w-full flex flex-col p-3 hover:bg-indigo-500/10 transition-colors">
                    <div className="w-full flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4 text-indigo-400" />
                        <span className="text-indigo-400 text-sm font-bold">
                          Scale Dynamics
                        </span>
                      </div>
                      {scalePresetsOpen ? (
                        <ChevronUp className="w-4 h-4 text-indigo-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-indigo-400" />
                      )}
                    </div>
                    <span className="text-[10px] text-indigo-400/70 mt-1 text-left">
                      Micro, Meso, Macro cosmic scale presets
                    </span>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-3 pt-0">
                    <ScalePresetPanel
                      currentPreset={scalePreset}
                      shapeType={parameters.type}
                      onPresetChange={(preset, scaleParams) => {
                        setScalePreset(preset);
                        setParameters((prev) => ({ ...prev, ...scaleParams }));
                      }}
                    />
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* Promotional Share */}
            {!isLockedPreview && (
              <Collapsible
                open={promoShareOpen}
                onOpenChange={setPromoShareOpen}
              >
                <div className="bg-black/40 rounded-lg border border-purple-500/30 overflow-hidden">
                  <CollapsibleTrigger asChild>
                    <button className="w-full flex flex-col p-3 hover:bg-purple-500/10 transition-colors">
                      <div className="w-full flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Share className="w-4 h-4 text-purple-400" />
                          <span className="text-purple-400 text-sm font-bold">
                            Promotional Share
                          </span>
                        </div>
                        {promoShareOpen ? (
                          <ChevronUp className="w-4 h-4 text-purple-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-purple-400" />
                        )}
                      </div>
                      <span className="text-[10px] text-purple-400/70 mt-1 text-left">
                        Social media, SEO links, viral sharing
                      </span>
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="p-3 pt-0">
                      <PromotionalSharePanel
                        parameters={parameters}
                        shapeName={formatShapeName(parameters.type)}
                      />
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            )}

            {/* ✅ RECONNECTED: QueensBridge Quantum Panel */}
            <Collapsible
              open={queensBridgeOpen}
              onOpenChange={setQueensBridgeOpen}
            >
              <div className="bg-black/40 rounded-lg border border-violet-500/30 overflow-hidden">
                <CollapsibleTrigger asChild>
                  <button className="w-full flex flex-col p-3 hover:bg-violet-500/10 transition-colors">
                    <div className="w-full flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-violet-400" />
                        <span className="text-violet-400 text-sm font-bold">
                          QueensBridge Quantum
                        </span>
                      </div>
                      {queensBridgeOpen ? (
                        <ChevronUp className="w-4 h-4 text-violet-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-violet-400" />
                      )}
                    </div>
                    <span className="text-[10px] text-violet-400/70 mt-1 text-left">
                      Shape topology → IBM quantum circuits
                    </span>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-3 pt-0">
                    <QueensBridgePanel />
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* Quantum Computing Panel */}
            <Collapsible
              open={quantumComputingOpen}
              onOpenChange={setQuantumComputingOpen}
            >
              <div className="bg-black/40 rounded-lg border border-sky-500/30 overflow-hidden">
                <CollapsibleTrigger asChild>
                  <button className="w-full flex flex-col p-3 hover:bg-sky-500/10 transition-colors">
                    <div className="w-full flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-sky-400" />
                        <span className="text-sky-400 text-sm font-bold">
                          Quantum Computing
                        </span>
                      </div>
                      {quantumComputingOpen ? (
                        <ChevronUp className="w-4 h-4 text-sky-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-sky-400" />
                      )}
                    </div>
                    <span className="text-[10px] text-sky-400/70 mt-1 text-left">
                      Quantum circuits & algorithm simulation
                    </span>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-3 pt-0">
                    <QuantumComputingPanel />
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* Atomic Explorer */}
            <Collapsible
              open={atomicExplorerOpen}
              onOpenChange={setAtomicExplorerOpen}
            >
              <div className="bg-black/40 rounded-lg border border-emerald-500/30 overflow-hidden">
                <CollapsibleTrigger asChild>
                  <button className="w-full flex flex-col p-3 hover:bg-emerald-500/10 transition-colors">
                    <div className="w-full flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400 text-sm font-bold">
                          Atomic Explorer
                        </span>
                      </div>
                      {atomicExplorerOpen ? (
                        <ChevronUp className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                    <span className="text-[10px] text-emerald-400/70 mt-1 text-left">
                      Interactive atomic structure visualization
                    </span>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-3 pt-0">
                    <div className="h-64 overflow-hidden relative rounded-lg">
                      <AtomicExplorer />
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* Voice Control */}
            <Collapsible
              open={voiceControlOpen}
              onOpenChange={setVoiceControlOpen}
            >
              <div className="bg-black/40 rounded-lg border border-rose-500/30 overflow-hidden">
                <CollapsibleTrigger asChild>
                  <button className="w-full flex flex-col p-3 hover:bg-rose-500/10 transition-colors">
                    <div className="w-full flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-rose-400" />
                        <span className="text-rose-400 text-sm font-bold">
                          Voice Control
                        </span>
                      </div>
                      {voiceControlOpen ? (
                        <ChevronUp className="w-4 h-4 text-rose-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-rose-400" />
                      )}
                    </div>
                    <span className="text-[10px] text-rose-400/70 mt-1 text-left">
                      Hands-free parameter control via Web Speech API
                    </span>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-3 pt-0">
                    <VoiceControlPanel
                      parameters={parameters}
                      onParameterChange={(partial) =>
                        setParameters((prev) => ({ ...prev, ...partial }))
                      }
                    />
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* Formula Mapping */}
            <Collapsible
              open={formulaMappingOpen}
              onOpenChange={setFormulaMappingOpen}
            >
              <div className="bg-black/40 rounded-lg border border-teal-500/30 overflow-hidden">
                <CollapsibleTrigger asChild>
                  <button className="w-full flex flex-col p-3 hover:bg-teal-500/10 transition-colors">
                    <div className="w-full flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-teal-400" />
                        <span className="text-teal-400 text-sm font-bold">
                          Formula Mapping
                        </span>
                      </div>
                      {formulaMappingOpen ? (
                        <ChevronUp className="w-4 h-4 text-teal-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-teal-400" />
                      )}
                    </div>
                    <span className="text-[10px] text-teal-400/70 mt-1 text-left">
                      Analyze & fuse parametric formula mappings
                    </span>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-3 pt-0">
                    <FormulaMappingPanel />
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* Lattice Network */}
            <Collapsible
              open={latticeNetworkOpen}
              onOpenChange={setLatticeNetworkOpen}
            >
              <div className="bg-black/40 rounded-lg border border-cyan-500/30 overflow-hidden">
                <CollapsibleTrigger asChild>
                  <button className="w-full flex flex-col p-3 hover:bg-cyan-500/10 transition-colors">
                    <div className="w-full flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-cyan-400" />
                        <span className="text-cyan-400 text-sm font-bold">
                          Lattice Network
                        </span>
                      </div>
                      {latticeNetworkOpen ? (
                        <ChevronUp className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-cyan-400" />
                      )}
                    </div>
                    <span className="text-[10px] text-cyan-400/70 mt-1 text-left">
                      Mathematical lattice with spatial crypto-tokens
                    </span>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-3 pt-0">
                    <LatticeNetworkPanel
                      latticeEngine={latticeEngine}
                      onLatticeEngineCreate={setLatticeEngine}
                      currentParameters={parameters}
                    />
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* Equation Display */}
            <Collapsible
              open={equationDisplayOpen}
              onOpenChange={setEquationDisplayOpen}
            >
              <div className="bg-black/40 rounded-lg border border-violet-400/30 overflow-hidden">
                <CollapsibleTrigger asChild>
                  <button className="w-full flex flex-col p-3 hover:bg-violet-400/10 transition-colors">
                    <div className="w-full flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-violet-300" />
                        <span className="text-violet-300 text-sm font-bold">
                          Equation Display
                        </span>
                      </div>
                      {equationDisplayOpen ? (
                        <ChevronUp className="w-4 h-4 text-violet-300" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-violet-300" />
                      )}
                    </div>
                    <span className="text-[10px] text-violet-300/70 mt-1 text-left">
                      Live parametric equations overlay
                    </span>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-3 pt-0">
                    <EquationDisplay
                      shapeName={String(parameters.type)}
                      parameters={parameters}
                      show={true}
                      onToggle={() => setEquationDisplayOpen(false)}
                    />
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* Dynamic Materials */}
            <Collapsible
              open={dynamicMaterialsOpen}
              onOpenChange={setDynamicMaterialsOpen}
            >
              <div className="bg-black/40 rounded-lg border border-cyan-500/30 overflow-hidden">
                <CollapsibleTrigger asChild>
                  <button className="w-full flex flex-col p-3 hover:bg-cyan-500/10 transition-colors">
                    <div className="w-full flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-cyan-400" />
                        <span className="text-cyan-400 text-sm font-bold">
                          Dynamic Materials
                        </span>
                      </div>
                      {dynamicMaterialsOpen ? (
                        <ChevronUp className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-cyan-400" />
                      )}
                    </div>
                    <span className="text-[10px] text-cyan-400/70 mt-1 text-left">
                      Reactive shaders: light, proximity, interaction
                    </span>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-3 pt-0">
                    <DynamicMaterialPanel
                      onMaterialChange={setReactiveMaterial}
                      currentMaterial={reactiveMaterial}
                    />
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* Engineering PBR */}
            <Collapsible
              open={engineeringPBROpen}
              onOpenChange={setEngineeringPBROpen}
            >
              <div className="bg-black/40 rounded-lg border border-amber-500/30 overflow-hidden">
                <CollapsibleTrigger asChild>
                  <button className="w-full flex flex-col p-3 hover:bg-amber-500/10 transition-colors">
                    <div className="w-full flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-amber-400" />
                        <span className="text-amber-400 text-sm font-bold">
                          Engineering PBR
                        </span>
                      </div>
                      {engineeringPBROpen ? (
                        <ChevronUp className="w-4 h-4 text-amber-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-amber-400" />
                      )}
                    </div>
                    <span className="text-[10px] text-amber-400/70 mt-1 text-left">
                      Printed metals, ceramics, bio-alloys, carbon fiber
                    </span>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-3 pt-0">
                    <EngineeringPBRPanel
                      onMaterialChange={setColorMode}
                      currentMaterial={colorMode}
                    />
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* IFS Fractal Engine - only when IFS shape selected */}
            {isIFSShape(parameters.type) && (
              <Collapsible open={ifsOpen} onOpenChange={setIfsOpen}>
                <div className="bg-black/40 rounded-lg border border-cyan-400/40 overflow-hidden">
                  <CollapsibleTrigger asChild>
                    <button className="w-full flex flex-col p-3 hover:bg-cyan-400/10 transition-colors">
                      <div className="w-full flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-cyan-300" />
                          <span className="text-cyan-300 text-sm font-bold">
                            IFS Fractal Engine
                          </span>
                        </div>
                        {ifsOpen ? (
                          <ChevronUp className="w-4 h-4 text-cyan-300" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-cyan-300" />
                        )}
                      </div>
                      <span className="text-[10px] text-cyan-400/70 mt-1 text-left">
                        Raymarched IFS attractor · fold type · chaos boundary
                      </span>
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="p-3 pt-0">
                      <IFSControlPanel
                        shapeType={parameters.type}
                        onExportGLB={handleIFSExportGLB}
                        exportState={ifsExportState}
                      />
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            )}
          </div>
        </div>

        {/* Main 3D canvas area */}
        <div className="flex-1 h-full relative">
          {!webglSupported ? (
            <div className="flex items-center justify-center h-full bg-gray-900/80 backdrop-blur-sm">
              <div className="text-center p-8 bg-gray-800/90 rounded-lg border-2 border-purple-500/50 max-w-md">
                <h2 className="text-2xl font-bold text-purple-400 mb-4">
                  WebGL Not Available
                </h2>
                <p className="text-gray-300 mb-4">
                  This visualization platform requires WebGL support. Your
                  browser or environment doesn't currently support WebGL.
                </p>
                <p className="text-sm text-gray-400">
                  Mathematical visualizations will not render in this
                  environment. Please try using a modern browser with WebGL
                  enabled.
                </p>
              </div>
            </div>
          ) : (
            <>
              <CanvasOverlayControls
                parameters={parameters}
                visualMode={visualMode}
                colorMode={colorMode}
                backgroundMode={backgroundMode}
                onParameterChange={(newParams) => {
                  if (
                    isLockedPreview &&
                    newParams.type &&
                    newParams.type !== parameters.type
                  ) {
                    console.log(
                      "🔒 Shape change blocked - locked preview mode",
                    );
                    return;
                  }
                  if (newParams.type) {
                    const validated = validateParameters(
                      newParams as SurfaceParameters,
                    );
                    setParameters(validated);
                    if (
                      newParams.type !== parameters.type &&
                      (parameters.type as string) === "sphere" &&
                      !hasChangedFromInitial
                    ) {
                      handleVisualizationModeChange("wireframe");
                      setHasChangedFromInitial(true);
                      console.log("🎯 Switched to wireframe mode");
                    }
                  }
                }}
                onVisualizationModeChange={handleVisualizationModeChange}
                onColorModeChange={setColorMode}
                onBackgroundModeChange={setBackgroundMode}
                isLockedPreview={isLockedPreview}
              />

              <div className="absolute top-4 right-4 z-20">
                <QuantumCoreButton onClick={() => setShowQuantumCore(true)} />
              </div>

              {isIFSShape(parameters.type) && (
                <div className="absolute inset-0 z-10">
                  <IFSErrorBoundary>
                    <IFSCanvas
                      ref={ifsCanvasRef}
                      params={ifsParams}
                      shapeType={parameters.type}
                      onCamDvChange={(dv) => setIFSParam("dv", dv)}
                    />
                  </IFSErrorBoundary>
                  <div className="absolute bottom-2 left-2 text-[8px] text-cyan-400/40 pointer-events-none select-none">
                    Drag: orbit · Scroll: zoom · Shift+Drag: light
                  </div>
                </div>
              )}

              <div
                style={{
                  display: isIFSShape(parameters.type) ? "none" : "block",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Canvas
                  camera={{
                    position: [80, 40, 100],
                    fov: 60,
                    near: 0.0001,
                    far: 1000000,
                  }}
                  shadows
                  gl={{
                    preserveDrawingBuffer: true,
                    powerPreference: "default",
                    antialias: true,
                    alpha: false,
                    failIfMajorPerformanceCaveat: false,
                  }}
                  onCreated={({ gl, scene, camera }) => {
                    scene.background = new THREE.Color(
                      getBackgroundColor(backgroundMode),
                    );
                    (window as any).threeScene = scene;
                    (window as any).threeCamera = camera;
                    (window as any).threeRenderer = gl;

                    const canvas = gl.domElement;
                    let contextLossCount = 0;
                    let lastContextLossTime = 0;

                    canvas.addEventListener(
                      "webglcontextlost",
                      (event) => {
                        const now = Date.now();
                        event.preventDefault();
                        if (now - lastContextLossTime < 5000) {
                          contextLossCount++;
                          if (contextLossCount >= 2) {
                            console.error(
                              "🚨 WebGL context loss loop detected - stopping recovery attempts",
                            );
                            setParameters((prev) => ({
                              ...prev,
                              _webglDisabled: true,
                            }));
                            return;
                          }
                        } else {
                          contextLossCount = 1;
                        }
                        lastContextLossTime = now;
                        console.warn(
                          `⚠️ WebGL context lost (${contextLossCount}/2) - attempting recovery`,
                        );
                        setTimeout(() => {
                          console.log(
                            "🔄 Triggering context recovery sequence",
                          );
                          setParameters((prev) => ({
                            ...prev,
                            _forceUpdate: Date.now(),
                            _contextRecovery: true,
                          }));
                        }, 1000);
                      },
                      false,
                    );

                    canvas.addEventListener(
                      "webglcontextrestored",
                      () => {
                        console.log("✅ WebGL context restored by browser");
                        contextLossCount = 0;
                      },
                      false,
                    );

                    (window as any).forceRefresh = () => {
                      console.log("🔄 Manual frontend refresh triggered");
                      setParameters((prev) => ({
                        ...prev,
                        _forceUpdate: Date.now(),
                      }));
                      window.dispatchEvent(new CustomEvent("forceUpdate"));
                    };
                  }}
                >
                  <ProfessionalLighting />

                  {false && (
                    <mesh
                      rotation={[-Math.PI / 2, 0, 0]}
                      position={[0, -1, 0]}
                      receiveShadow
                    >
                      <planeGeometry args={[50, 50]} />
                      <shadowMaterial transparent opacity={0.15} />
                    </mesh>
                  )}

                  <group position={[0, 0, 0]}>
                    <ParametricSurface
                      parameters={parameters}
                      visualizationMode={visualMode}
                      colorMode={colorMode}
                      animationPreset={animationPreset}
                      backgroundMode={backgroundMode}
                      physicsEnabled={usePhysics}
                      physicsConfig={physicsConfig}
                      isPhysicsAnimating={isPhysicsAnimating}
                      animationType={animationType}
                      animationVelocity={animationVelocity}
                      breatheIntensity={breatheIntensity}
                      dynamicsMode={dynamicsMode}
                      onGeometryUpdate={setCurrentGeometry}
                      key={parameters.type}
                    />
                  </group>

                  <OrbitControls
                    ref={orbitControlsRef}
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    target={[0, 0, 0]}
                    maxDistance={50000}
                    minDistance={0.01}
                    enableDamping={true}
                    dampingFactor={0.08}
                    rotateSpeed={1.5}
                    zoomSpeed={8.0}
                    panSpeed={2.0}
                    mouseButtons={{ LEFT: 0, MIDDLE: 1, RIGHT: 2 }}
                  />

                  <CameraAutoAdjuster
                    orbitRef={orbitControlsRef}
                    shapeType={parameters.type}
                  />

                  <HolographicLight
                    colorMode={colorMode}
                    backgroundMode={backgroundMode}
                  />

                  <HolographicEmissiveBoost
                    colorMode={colorMode}
                    backgroundMode={backgroundMode}
                  />

                  {autonomousEnabled && !isIFSShape(parameters.type) && (
                    <AutonomousAnimation
                      parameters={parameters}
                      onParameterChange={handleParameterChange}
                      enabled={autonomousEnabled}
                      intensity={autonomousIntensity}
                      mode={autonomousMode}
                    />
                  )}

                  {showGrid && (
                    <InteractivePhysicsGrid
                      parameters={parameters}
                      gridSize={80}
                      gridDivisions={55}
                      isAnimating={
                        isPhysicsAnimating || animationPreset !== "off"
                      }
                      animationVelocity={animationVelocity}
                    />
                  )}
                </Canvas>
              </div>

              {/* Bottom-right control buttons */}
              <div className="absolute bottom-3 right-3 z-50 flex gap-1">
                <button
                  onClick={() => setShowSocialShare(true)}
                  className="bg-pink-400/20 hover:bg-pink-400/40 text-pink-300 border border-pink-400/30 px-2 py-1 rounded text-[10px] backdrop-blur-md transition-all hover:shadow-[0_0_8px_rgba(244,114,182,0.4)]"
                  title="Share to Social Media"
                >
                  📤
                </button>

                <ShareButton
                  parameters={parameters}
                  shapeName={parameters.type}
                />

                <button
                  onClick={() => {
                    if (orbitControlsRef.current) {
                      orbitControlsRef.current.object.position.set(80, 40, 100);
                      orbitControlsRef.current.target.set(0, 0, 0);
                      orbitControlsRef.current.update();
                    }
                  }}
                  className="bg-cyan-400/20 hover:bg-cyan-400/40 text-cyan-300 border border-cyan-400/30 px-2 py-1 rounded text-[10px] backdrop-blur-md transition-all hover:shadow-[0_0_8px_rgba(34,211,238,0.4)]"
                  title="Reset camera view"
                >
                  ↻
                </button>

                <button
                  onClick={() => {
                    if (orbitControlsRef.current) {
                      orbitControlsRef.current.object.position.set(0, 120, 0);
                      orbitControlsRef.current.target.set(0, 0, 0);
                      orbitControlsRef.current.update();
                    }
                  }}
                  className="bg-purple-400/20 hover:bg-purple-400/40 text-purple-300 border border-purple-400/30 px-2 py-1 rounded text-[10px] backdrop-blur-md transition-all hover:shadow-[0_0_8px_rgba(192,132,252,0.4)]"
                  title="Top view"
                >
                  ⊤
                </button>

                <button
                  onClick={() => {
                    if (orbitControlsRef.current) {
                      orbitControlsRef.current.object.position.set(0, 0, 120);
                      orbitControlsRef.current.target.set(0, 0, 0);
                      orbitControlsRef.current.update();
                    }
                  }}
                  className="bg-orange-400/20 hover:bg-orange-400/40 text-orange-300 border border-orange-400/30 px-2 py-1 rounded text-[10px] backdrop-blur-md transition-all hover:shadow-[0_0_8px_rgba(251,146,60,0.4)]"
                  title="Front view"
                >
                  ◎
                </button>

                <button
                  onClick={() => {
                    if (orbitControlsRef.current) {
                      orbitControlsRef.current.object.position.set(120, 0, 0);
                      orbitControlsRef.current.target.set(0, 0, 0);
                      orbitControlsRef.current.update();
                    }
                  }}
                  className="bg-green-400/20 hover:bg-green-400/40 text-green-300 border border-green-400/30 px-2 py-1 rounded text-[10px] backdrop-blur-md transition-all hover:shadow-[0_0_8px_rgba(74,222,128,0.4)]"
                  title="Side view"
                >
                  ⊢
                </button>

                <button
                  onClick={() => setShowSystemInfo(true)}
                  className="bg-blue-400/20 hover:bg-blue-400/40 text-blue-300 border border-blue-400/30 px-2 py-1 rounded text-[10px] backdrop-blur-md transition-all hover:shadow-[0_0_8px_rgba(96,165,250,0.4)]"
                  title="Info"
                >
                  ℹ
                </button>

                <button
                  onClick={() => setShowShapeDynamics(true)}
                  className="bg-gradient-to-r from-purple-600/50 to-pink-600/50 hover:from-purple-500/70 hover:to-pink-500/70 text-white border border-purple-400/60 px-3 py-1.5 rounded text-[11px] backdrop-blur-md transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.6)] font-medium flex items-center gap-1"
                  title="Shape Dynamics"
                >
                  <span>📊</span>
                  <span className="hidden sm:inline">Dynamics</span>
                </button>

                <button
                  onClick={() => setShowFractalFormulas(true)}
                  className="bg-gradient-to-r from-cyan-600/50 to-purple-600/50 hover:from-cyan-500/70 hover:to-purple-500/70 text-white border border-cyan-400/60 px-3 py-1.5 rounded text-[11px] backdrop-blur-md transition-all hover:shadow-[0_0_15px_rgba(34,211,238,0.6)] font-medium flex items-center gap-1"
                  title="Fractal Formulas"
                >
                  <span>🌀</span>
                  <span className="hidden sm:inline">Fractals</span>
                </button>

                {/* Autonomous Animation Controls */}
                <div className="flex gap-1 items-center">
                  <button
                    onClick={() => setAutonomousEnabled(!autonomousEnabled)}
                    className={`px-2 py-1.5 rounded text-[11px] backdrop-blur-md transition-all font-medium flex items-center gap-1 border ${
                      autonomousEnabled
                        ? 'bg-gradient-to-r from-emerald-600/70 to-teal-600/70 border-emerald-400/60 text-white'
                        : 'bg-gradient-to-r from-slate-600/50 to-slate-700/50 border-slate-400/40 text-gray-300 hover:from-slate-500/60'
                    }`}
                    title="Autonomous Shape Animation"
                  >
                    <span>{autonomousEnabled ? '⏸' : '🌊'}</span>
                    <span className="hidden sm:inline">{autonomousEnabled ? 'Stop' : 'Breathe'}</span>
                  </button>
                  {autonomousEnabled && (
                    <>
                      <select
                        value={autonomousMode}
                        onChange={(e) => setAutonomousMode(e.target.value as any)}
                        className="bg-black/60 text-white text-[10px] border border-emerald-500/30 rounded px-1 py-1"
                      >
                        <option value="breathe">Breathe</option>
                        <option value="wave">Wave</option>
                        <option value="expand">Expand</option>
                        <option value="morph">Morph</option>
                      </select>
                      <input
                        type="range"
                        min={0.1}
                        max={3.0}
                        step={0.1}
                        value={autonomousIntensity}
                        onChange={(e) => setAutonomousIntensity(parseFloat(e.target.value))}
                        className="w-16 h-4"
                        title={`Intensity: ${autonomousIntensity.toFixed(1)}`}
                      />
                    </>
                  )}
                </div>

                <button
                  onClick={() => setIsPhysicsAnimating(!isPhysicsAnimating)}
                  className={`${
                    isPhysicsAnimating
                      ? "bg-gradient-to-r from-green-600/70 to-emerald-600/70 hover:from-green-500/80 hover:to-emerald-500/80 border-green-400/60"
                      : "bg-gradient-to-r from-amber-600/50 to-orange-600/50 hover:from-amber-500/70 hover:to-orange-500/70 border-amber-400/60"
                  } text-white px-3 py-1.5 rounded text-[11px] backdrop-blur-md transition-all hover:shadow-[0_0_15px_rgba(251,191,36,0.6)] font-medium flex items-center gap-1`}
                  title="Domain Animation"
                >
                  <span>{isPhysicsAnimating ? "⏸️" : "🔮"}</span>
                  <span className="hidden sm:inline">
                    {isPhysicsAnimating ? "Stop" : "Animate"}
                  </span>
                </button>
              </div>
            </>
          )}

          <GeometricIdentityPanel />

          {/* Live Algorithm display */}
          <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg border border-green-400/50 shadow-lg z-40 max-w-xs">
            <div className="text-center font-mono">
              <button
                onClick={() => setIsAlgorithmCollapsed(!isAlgorithmCollapsed)}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-green-900/20 transition-colors"
              >
                <span className="text-green-400 font-bold uppercase tracking-wide text-xs">
                  🧮 LIVE ALGORITHM
                </span>
                {isAlgorithmCollapsed ? (
                  <ChevronDown className="w-4 h-4 text-green-400" />
                ) : (
                  <ChevronUp className="w-4 h-4 text-green-400" />
                )}
              </button>

              {!isAlgorithmCollapsed && (
                <div className="px-3 pb-3 space-y-2 text-xs">
                  <div className="text-white bg-gray-900/70 rounded px-2 py-1 border border-gray-600/50">
                    {parameters.type.replace(/_/g, " ").toUpperCase()}
                  </div>
                  <div className="border-t border-green-600 pt-1">
                    <div className="text-green-400 text-[9px] mb-1">
                      EQUATION
                    </div>
                    {parameters.type === "square" && (
                      <div className="text-white text-[9px] font-mono space-y-0.5">
                        <div>x = a·(u-0.5)</div>
                        <div>y = b·(v-0.5)</div>
                        <div>z = 0</div>
                      </div>
                    )}
                    {parameters.type === "sphere" && (
                      <div className="text-white text-[9px] font-mono space-y-0.5">
                        <div>x = a·sin(πv)·cos(2πu)</div>
                        <div>y = b·sin(πv)·sin(2πu)</div>
                        <div>z = c·cos(πv)</div>
                      </div>
                    )}
                    {parameters.type === "torus" && (
                      <div className="text-white text-[9px] font-mono space-y-0.5">
                        <div>x = (a+b·cos(2πv))·cos(2πu)</div>
                        <div>y = (a+b·cos(2πv))·sin(2πu)</div>
                        <div>z = b·sin(2πv)</div>
                      </div>
                    )}
                    {!["square", "sphere", "torus"].includes(
                      parameters.type,
                    ) && (
                      <div className="text-gray-400 text-[9px]">
                        Parametric: f(u,v,a,b,c,...)
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[10px]">
                    <div className="bg-blue-900/30 p-1 rounded">
                      <span className="text-blue-300">A:</span>
                      <div className="text-white font-bold">
                        {parameters.a?.toFixed(3)}
                      </div>
                    </div>
                    <div className="bg-purple-900/30 p-1 rounded">
                      <span className="text-purple-300">B:</span>
                      <div className="text-white font-bold">
                        {parameters.b?.toFixed(3)}
                      </div>
                    </div>
                    <div className="bg-pink-900/30 p-1 rounded">
                      <span className="text-pink-300">C:</span>
                      <div className="text-white font-bold">
                        {parameters.c?.toFixed(3)}
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-600 pt-1">
                    <div className="text-orange-400 text-[9px]">
                      DEPTH ANALYSIS
                    </div>
                    <div className="text-white text-[10px]">
                      Scale:{" "}
                      {Math.max(
                        parameters.a || 1,
                        parameters.b || 1,
                        parameters.c || 1,
                      ) < 0.001
                        ? "MICRO μm"
                        : Math.max(
                              parameters.a || 1,
                              parameters.b || 1,
                              parameters.c || 1,
                            ) < 1
                          ? "MESO mm"
                          : "MACRO m"}
                    </div>
                    <div className="text-gray-300 text-[9px]">
                      Vol:{" "}
                      {(
                        (parameters.a || 1) *
                        (parameters.b || 1) *
                        (parameters.c || 1)
                      ).toExponential(2)}
                    </div>
                  </div>
                  <div className="border-t border-gray-600 pt-1">
                    <div className="text-cyan-400 text-[9px]">
                      FUNDAMENTAL CONSTANTS
                    </div>
                    <div className="text-white text-[9px]">
                      φ⊕π: 13.308 | φ×π: 5.083
                    </div>
                    <div className="text-purple-300 text-[9px]">
                      ℎ: 6.626×10⁻³⁴ J⋅s
                    </div>
                    <div className="text-blue-300 text-[9px]">
                      c: 2.998×10⁸ m/s
                    </div>
                    <div className="text-green-300 text-[9px]">
                      e: 2.718... | G: 6.674×10⁻¹¹
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <ShapeFormulaBar
            parameters={parameters}
            onShapeSelect={(newParams) => {
              if (newParams.type) {
                const validated = validateParameters(
                  newParams as SurfaceParameters,
                );
                setParameters(validated);
              }
            }}
            onMeshDensityChange={(uSegments, vSegments) => {
              setParameters((prev) => ({ ...prev, uSegments, vSegments }));
            }}
          />
        </div>
      </div>

      {/* Bottom-left buttons */}
      <div className="absolute bottom-3 left-3 z-50 flex gap-1 flex-wrap">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowShapeEnhancer(!showShapeEnhancer)}
          className={`gap-2 ${showShapeEnhancer ? "text-purple-300 bg-purple-950/40 border border-purple-500/30" : ""}`}
          title="AI Shape Enhancer"
        >
          <Sparkles className="w-4 h-4" />
          AI Enhance
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDiscovery(!showDiscovery)}
          className={`gap-2 ${showDiscovery ? "text-cyan-300 bg-cyan-950/40 border border-cyan-500/30" : ""}`}
        >
          <Zap className="w-4 h-4" />
          Discover
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSystemHealth(!showSystemHealth)}
          className="gap-2"
        >
          <Activity className="w-4 h-4" />
          System Health
        </Button>
      </div>

      {/* System Health Modal */}
      {showSystemHealth && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl max-w-4xl max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">System Health Dashboard</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSystemHealth(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <SystemHealthDashboard />
          </div>
        </div>
      )}

      <SecretsPanel
        isOpen={showSecretsPanel}
        onToggle={() => setShowSecretsPanel(!showSecretsPanel)}
      />

      <ShapeAIEnhancer
        isOpen={showShapeEnhancer}
        onClose={() => setShowShapeEnhancer(false)}
        shapeType={parameters.type}
        shapeName={parameters.type.replace(/_/g, " ")}
      />

      <ClaudeDiscoveryPanel
        isOpen={showDiscovery}
        onClose={() => setShowDiscovery(false)}
        currentShape={parameters.type}
        onShapeSelect={(shapeType) => {
          const newParams = { ...parameters, type: shapeType };
          const validated = validateParameters(newParams as SurfaceParameters);
          setParameters(validated);
          setShowDiscovery(false);
        }}
      />

      <AppFooter
        onLegalClick={() => setShowLegalNotice(true)}
        onInfoClick={() => setShowSystemInfo(true)}
      />

      <ShapeDynamicsPanel
        geometry={currentGeometry}
        shapeName={formatShapeName(parameters.type)}
        isOpen={showShapeDynamics}
        onClose={() => setShowShapeDynamics(false)}
        scale={parameters.a || 1}
      />

      <FractalFormulaPanel
        isOpen={showFractalFormulas}
        onClose={() => setShowFractalFormulas(false)}
        currentParameters={parameters as unknown as Record<string, number>}
        onApplyFormula={(formula: FractalFormula, intensity: number) => {
          console.log(
            `Applying fractal formula: ${formula.formula} with intensity ${intensity}`,
          );
          setParameters((prev) => ({
            ...prev,
            d: (prev.d || 0) + intensity * 10,
            e: (prev.e || 0) + intensity * 5,
          }));
          setShowFractalFormulas(false);
        }}
        onApplyConstant={(
          constant: ConstantKey,
          operation: string,
          param: string,
        ) => {
          const currentValue = (parameters as any)[param] || 1;
          const newValue = applyConstantTransform(
            currentValue,
            constant,
            operation as any,
          );
          console.log(
            `Applying constant ${constant} with ${operation} to ${param}: ${currentValue} -> ${newValue}`,
          );
          setParameters((prev) => ({ ...prev, [param]: newValue }));
        }}
      />

      <SystemInfoModal
        isOpen={showSystemInfo}
        onClose={() => setShowSystemInfo(false)}
      />

      <LegalNoticeModal
        isOpen={showLegalNotice}
        onClose={() => setShowLegalNotice(false)}
      />

      <SocialShareModal
        isOpen={showSocialShare}
        onClose={() => setShowSocialShare(false)}
        parameters={parameters}
        shapeName={parameters.type}
      />

      <QuantumCoreModal
        open={showQuantumCore}
        onOpenChange={setShowQuantumCore}
      />

      {showWireframeTip && (
        <div className="fixed bottom-20 right-4 z-50 max-w-sm animate-in slide-in-from-right duration-500">
          <div className="bg-gradient-to-r from-blue-900/95 to-purple-900/95 backdrop-blur-sm border border-blue-400/30 rounded-lg p-4 shadow-xl shadow-blue-500/20">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                <span className="text-xl">💡</span>
              </div>
              <div className="flex-1">
                <h4 className="text-blue-100 font-semibold text-sm mb-1">
                  Pro Tip: Wireframe Mode
                </h4>
                <p className="text-blue-200/80 text-xs leading-relaxed">
                  Wireframe mode is the best way to see a shape's mathematical
                  foundation and structural geometry.
                </p>
              </div>
              <button
                onClick={() => setShowWireframeTip(false)}
                className="flex-shrink-0 text-blue-300 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-3 flex justify-end">
              <button
                onClick={() => setShowWireframeTip(false)}
                className="text-xs bg-blue-500/30 hover:bg-blue-500/50 text-blue-100 px-3 py-1 rounded transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MathVisualizer;
export { MathVisualizer };

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Suspense, useMemo, useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import WorkingParametricSurface from "./WorkingParametricSurface";
import PatternRenderer from "./PatternRenderer";
import InteractiveControls from "./InteractiveControls";
import AdvancedEffectsRenderer, { calculateEnergyLevel } from "./AdvancedEffectsRenderer";
import StudioPostProcessing from "./StudioPostProcessing";
import SmartGrid from "./SmartGrid";
import InteractivePhysicsGrid from "./InteractivePhysicsGrid";
import { SurfaceParameters, VisualizationMode } from "../types/math";
import { performanceMonitor } from "../lib/performanceMonitor";
import { renderingConfig } from "../lib/renderingConfigManager";
import { useLightingStore } from "../stores/lightingStore";
import { getDynamicBackgroundForShape, BACKGROUND_KEYFRAMES } from "../lib/dynamicBackgroundEffects";
import * as THREE from "three";
import React from "react";

interface Scene3DProps {
  parameters: SurfaceParameters;
  visualMode: VisualizationMode;
  colorMode: string;
  staticMode?: boolean;
}

function RendererInitializer() {
  const { gl } = useThree();
  const isMobile = performanceMonitor.isMobileDevice();

  useEffect(() => {
    renderingConfig.initialize(gl, isMobile);
  }, [gl, isMobile]);

  return null;
}

function Lights({ shadowMapSize }: { shadowMapSize: number }) {
  const isMobile = performanceMonitor.isMobileDevice();
  const {
    ambientIntensity,
    ambientColor,
    keyLightIntensity,
    keyLightColor,
    keyLightX,
    keyLightY,
    keyLightZ,
    fillLightIntensity,
    fillLightColor,
    rimLightIntensity,
    rimLightColor,
    shadowsEnabled,
    shadowSoftness
  } = useLightingStore();

  const enableShadows = shadowsEnabled && !isMobile;

  return (
    <>
      {/* Ambient light - controlled by store */}
      <ambientLight intensity={ambientIntensity} color={ambientColor} />

      {/* Key light - main directional with shadows */}
      <directionalLight
        position={[keyLightX, keyLightY, keyLightZ]}
        intensity={keyLightIntensity}
        color={keyLightColor}
        castShadow={enableShadows}
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-camera-left={-200}
        shadow-camera-right={200}
        shadow-camera-top={200}
        shadow-camera-bottom={-200}
        shadow-camera-near={0.5}
        shadow-camera-far={500}
        shadow-bias={-0.0008}
        shadow-normalBias={0.08}
        shadow-radius={shadowSoftness}
      />

      {!isMobile && (
        <>
          {/* Rim/back light - creates edge definition (no shadow for efficiency) */}
          <directionalLight
            position={[-8, 4, -12]}
            intensity={rimLightIntensity * 0.9}
            color={rimLightColor}
            castShadow={false}
          />

          {/* Fill light - subtle to prevent completely black shadows */}
          <directionalLight
            position={[-6, -2, 4]}
            intensity={fillLightIntensity * 0.85}
            color={fillLightColor}
          />

          {/* Single accent light for subtle color depth */}
          <pointLight position={[10, -5, 5]} intensity={fillLightIntensity * 0.6} decay={2} color="#445566" />
        </>
      )}
    </>
  );
}

export default function Scene3D({ parameters, visualMode, colorMode, staticMode = false }: Scene3DProps) {
  const {
    environmentPreset,
    shadowsEnabled,
    lightingMode,
    bloomEnabled,
    bloomIntensity,
    ssaoEnabled,
    ssaoIntensity
  } = useLightingStore();

  const safeGetCSSVar = (varName: string, fallback: string): string => {
    if (typeof document === 'undefined') return fallback;
    return getComputedStyle(document.documentElement).getPropertyValue(varName) || fallback;
  };

  const dynamicBg = useMemo(() => getDynamicBackgroundForShape(parameters.type, parameters), [parameters.type, parameters.d, parameters.e]);
  const bgColor = useMemo(() => dynamicBg.primaryColor || safeGetCSSVar('--bg-primary', '#0a0a0a'), [dynamicBg.primaryColor]);
  const gridCellColor = useMemo(() => safeGetCSSVar('--grid-color', '#333333'), []);
  const gridSectionColor = useMemo(() => safeGetCSSVar('--border-color', '#666666'), []);

  const performanceSettings = useMemo(() => performanceMonitor.getOptimizedSettings(), []);
  const isMobile = performanceMonitor.isMobileDevice();
  const enableShadows = shadowsEnabled && !isMobile;

  useEffect(() => {
    const styleId = 'dynamic-bg-keyframes';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = BACKGROUND_KEYFRAMES;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div
      style={{ width: '100%', height: '100%' }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Canvas
        shadows={enableShadows}
        camera={{
          position: [15, 15, 15],
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: performanceSettings.antialias ?? true,
          preserveDrawingBuffer: false,
          powerPreference: isMobile ? "default" : "high-performance",
          failIfMajorPerformanceCaveat: false,
          alpha: false,
          depth: true,
          stencil: false
        }}
        style={{
          background: `linear-gradient(to bottom, ${dynamicBg.primaryColor}, ${dynamicBg.secondaryColor})`,
          transition: 'background 0.5s ease'
        }}
      >
      <color attach="background" args={[bgColor]} />

      <RendererInitializer />
      <Lights shadowMapSize={performanceSettings.shadowMapSize ?? 2048} />

      <Suspense fallback={null}>
        {/* Bloom-based effects for 'glow' and 'cinematic' modes */}
        {bloomEnabled && (
          <AdvancedEffectsRenderer
            surfaceParameters={parameters}
            energyLevel={calculateEnergyLevel(parameters.type)}
            enabled={!staticMode && performanceSettings.enableBloom}
            bloomIntensity={isMobile ? 0.5 : bloomIntensity}
            particleCount={performanceSettings.particleCount}
            volumetricIntensity={isMobile ? 0.3 : (lightingMode === 'glow' ? 1.0 : 0.3)}
            chromaticIntensity={isMobile ? 0.01 : (colorMode.includes("quantum") ? 0.05 : 0.02)}
          />
        )}

        {/* Studio-quality SSAO post-processing for clean geometric shading */}
        {ssaoEnabled && (
          <StudioPostProcessing
            enabled={!staticMode}
            ssaoIntensity={ssaoIntensity}
            vignetteIntensity={lightingMode === 'cinematic' ? 0.4 : 0.2}
          />
        )}

          <InteractiveControls
            enablePivoting={true}
            enableRotation={true}
            enableScaling={true}
            onTransformChange={(transform) => {
              console.log('Transform updated:', transform);
            }}
          >
            <WorkingParametricSurface
              parameters={parameters}
              visualMode={visualMode}
              colorMode={colorMode}
            />
          </InteractiveControls>
        </Suspense>

        {/* Grid rendered by MathVisualizer — not duplicated here */}

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={100}
        target={[0, 0, 0]}
        minPolarAngle={0.01}
        maxPolarAngle={Math.PI - 0.01}
        minAzimuthAngle={-Infinity}
        maxAzimuthAngle={Infinity}
        enableDamping={true}
        dampingFactor={0.15}
        rotateSpeed={0.8}
        panSpeed={0.8}
        zoomSpeed={1.2}
      />

      <Environment preset={environmentPreset as any} />
      </Canvas>
    </div>
  );
}

// Dummy components and functions to satisfy imports and ensure code runs
// In a real application, these would be properly implemented or imported.
function Button({ variant, size, className, onClick, children }: any) {
  return (
    <button className={`${className} ${variant} ${size}`} onClick={onClick}>
      {children}
    </button>
  );
}

function useActivePanelStore() {
  const [activePanel, setActivePanel] = useMemo(() => {
    // Using useMemo to simulate a store with useState for simplicity in this example
    // In a real app, you'd use a state management library like Zustand or Redux
    const [panel, setPanel] = React.useState('advanced-viz'); // Default panel
    return [panel, setPanel];
  }, []);
  return { activePanel, setActivePanel };
}

// Mock implementation for MaxwellFieldVisualizationPanel, AdvancedVisualizationSuite, and DynamicMaterialPanel
// In a real app, these would be actual components.
const MaxwellFieldVisualizationPanel = () => <div>Maxwell Field Controls</div>;
const AdvancedVisualizationSuite = () => <div>Advanced Visualization Controls</div>;
const DynamicMaterialPanel = () => <div>Material Controls</div>;

// Example of how the sidebar navigation might use these components
function SidebarNavigation() {
  const { activePanel, setActivePanel } = useActivePanelStore();

  return (
    <div className="sidebar">
      <Button
        variant={activePanel === 'advanced-viz' ? 'default' : 'ghost'}
        size="sm"
        className="justify-start gap-2"
        onClick={() => setActivePanel('advanced-viz')}
      >
        ✨ Advanced Viz
      </Button>
      <Button
        variant={activePanel === 'materials' ? 'default' : 'ghost'}
        size="sm"
        className="justify-start gap-2"
        onClick={() => setActivePanel('materials')}
      >
        🎨 Materials
      </Button>
      <Button
        variant={activePanel === 'maxwell-fields' ? 'default' : 'ghost'}
        size="sm"
        className="justify-start gap-2"
        onClick={() => setActivePanel('maxwell-fields')}
      >
        ⚡ Maxwell Fields
      </Button>

      <div className="panel-content">
        {activePanel === 'advanced-viz' && <AdvancedVisualizationSuite />}
        {activePanel === 'materials' && <DynamicMaterialPanel />}
        {activePanel === 'maxwell-fields' && <MaxwellFieldVisualizationPanel />}
      </div>
    </div>
  );
}
import React, { useState, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, SMAA, ToneMapping, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction, ToneMappingMode } from 'postprocessing';
import * as THREE from 'three';

import ThomsonModel from './atomic/ThomsonModel';
import RutherfordModel from './atomic/RutherfordModel';
import BohrModel from './atomic/BohrModel';
import ElectronCloud from './atomic/ElectronCloud';
import Nucleus from './atomic/Nucleus';
import Proton from './atomic/Proton';
import Neutron from './atomic/Neutron';
import Electron from './atomic/Electron';
import Photon from './atomic/Photon';
import HiggsBoson from './atomic/HiggsBoson';
import Antimatter from './atomic/Antimatter';
import AlphaRadiation from './atomic/AlphaRadiation';
import BetaRadiation from './atomic/BetaRadiation';
import GammaRadiation from './atomic/GammaRadiation';
import NeutronRadiation from './atomic/NeutronRadiation';
import ElectromagneticRadiation from './atomic/ElectromagneticRadiation';
import CosmicRadiation from './atomic/CosmicRadiation';
import BlackHole from './atomic/BlackHole';
import BlackHoleEdge from './atomic/BlackHoleEdge';
import BlackHoleJets from './atomic/BlackHoleJets';
import WhiteHole from './atomic/WhiteHole';
import Wormhole from './atomic/Wormhole';
import GravitationalLensing from './atomic/GravitationalLensing';
import GravitationalWaves from './atomic/GravitationalWaves';
import TimeDilation from './atomic/TimeDilation';
import Singularity from './atomic/Singularity';
import QuantumStrings from './atomic/QuantumStrings';
import SpacetimeGrain from './atomic/SpacetimeGrain';
import Heart from './atomic/Heart';
import Brain from './atomic/Brain';
import Lungs from './atomic/Lungs';
import Liver from './atomic/Liver';
import Stomach from './atomic/Stomach';
import Kidneys from './atomic/Kidneys';
import Spine from './atomic/Spine';
import Eye from './atomic/Eye';

interface AtomicVisualizationProps {
  selectedStructure?: string;
  showInternals?: boolean;
  onSceneReady?: (scene: THREE.Scene) => void;
}

function getStructureComponent(structure: string, showInternals: boolean): React.ReactNode {
  const componentMap: Record<string, React.ReactNode> = {
    'thomson': <ThomsonModel scale={3} />,
    'rutherford': <RutherfordModel scale={3} />,
    'bohr': <BohrModel scale={3} />,
    'electron-cloud': <ElectronCloud scale={3} />,
    'nucleus': <Nucleus protonCount={6} neutronCount={6} showInternals={showInternals} scale={1} />,
    'proton': <Proton position={[0, 0, 0]} showInternals={showInternals} scale={2} />,
    'neutron': <Neutron position={[0, 0, 0]} showInternals={showInternals} scale={2} />,
    'electron': <Electron position={[0, 0, 0]} scale={2} />,
    'photon': <Photon scale={3} />,
    'higgs': <HiggsBoson scale={2} />,
    'antimatter': <Antimatter scale={2} />,
    'alpha': <AlphaRadiation scale={2} />,
    'beta': <BetaRadiation scale={3} />,
    'gamma': <GammaRadiation scale={3} />,
    'neutron-radiation': <NeutronRadiation scale={2} />,
    'electromagnetic': <ElectromagneticRadiation scale={3} />,
    'cosmic': <CosmicRadiation scale={3} />,
    'blackhole': <BlackHole scale={3} />,
    'blackhole-edge': <BlackHoleEdge scale={3} />,
    'blackhole-jets': <BlackHoleJets scale={3} />,
    'whitehole': <WhiteHole scale={2} />,
    'wormhole': <Wormhole scale={2} />,
    'gravitational-lens': <GravitationalLensing scale={2} />,
    'gravitational-waves': <GravitationalWaves scale={2} />,
    'time-dilation': <TimeDilation scale={2} />,
    'singularity': <Singularity scale={2} />,
    'quantum-strings': <QuantumStrings scale={2} />,
    'spacetime-grain': <SpacetimeGrain scale={2} />,
    'heart': <Heart scale={2} />,
    'brain': <Brain scale={2} />,
    'lungs': <Lungs scale={2} />,
    'liver': <Liver scale={2} />,
    'stomach': <Stomach scale={2} />,
    'kidneys': <Kidneys scale={2} />,
    'spine': <Spine scale={2} />,
    'eye': <Eye scale={2} />,
  };
  
  return componentMap[structure] || <BohrModel scale={3} />;
}

function Scene({ structure, showInternals, onSceneReady }: { structure: string; showInternals: boolean; onSceneReady?: (scene: THREE.Scene) => void }) {
  const { scene, gl } = useThree();

  React.useEffect(() => {
    if (scene && onSceneReady) {
      onSceneReady(scene);
    }
  }, [scene, onSceneReady]);

  React.useEffect(() => {
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
  }, [gl]);

  return (
    <>
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 10, 50]} />
      
      {/* Enhanced multi-light setup for PBR materials with realistic 3-point lighting */}
      <ambientLight intensity={0.2} />
      
      {/* Key light with shadows */}
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={2.0}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Fill light */}
      <directionalLight 
        position={[-10, -10, -5]} 
        intensity={0.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      {/* Rim light for edge definition */}
      <directionalLight 
        position={[0, 5, -10]} 
        intensity={1.2}
        color="#4488ff"
      />
      
      {/* Center accent light */}
      <pointLight 
        position={[0, 0, 0]} 
        intensity={0.8}
        distance={20}
        decay={2}
      />
      
      {getStructureComponent(structure, showInternals)}
      
      {/* Advanced Post-Processing Pipeline for Cinematic Quality */}
      <EffectComposer multisampling={8}>
        {/* Unreal Bloom for volumetric glow effects */}
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.9}
          mipmapBlur
          blendFunction={BlendFunction.SCREEN}
        />
        
        {/* SMAA Anti-aliasing for sharp, clean edges */}
        <SMAA />
        
        {/* Tone Mapping for cinematic color grading */}
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        
        {/* Subtle chromatic aberration for realism */}
        <ChromaticAberration
          offset={[0.0005, 0.0005]}
          blendFunction={BlendFunction.NORMAL}
        />
        
        {/* Vignette for focus */}
        <Vignette
          offset={0.3}
          darkness={0.5}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </>
  );
}

export default function AtomicVisualization({ selectedStructure = 'bohr', showInternals = false, onSceneReady }: AtomicVisualizationProps) {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          outputColorSpace: THREE.SRGBColorSpace,
          physicallyCorrectLights: true,
        }}
        dpr={[1, Math.min(window.devicePixelRatio, 3)]}
      >
        <PerspectiveCamera 
          makeDefault 
          position={[0, 0, 15]} 
          fov={50}
          near={0.1}
          far={1000}
        />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
          minDistance={2}
          maxDistance={50}
          maxPolarAngle={Math.PI}
          minPolarAngle={0}
        />
        
        <Suspense fallback={null}>
          <Scene structure={selectedStructure} showInternals={showInternals} onSceneReady={onSceneReady} />
        </Suspense>
      </Canvas>
    </div>
  );
}

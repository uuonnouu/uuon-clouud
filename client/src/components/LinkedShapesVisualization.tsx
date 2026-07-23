import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid } from '@react-three/drei';
import { useParameterLinkStore, LinkedShape } from '../stores/parameterLinkStore';
import ParametricSurface from './ParametricSurface';
import { SurfaceParameters } from '../types/math';
import * as THREE from 'three';

interface LinkedShapeVisualizerProps {
  linkId: string;
}

function LinkedShapesScene({ linkId }: { linkId: string }) {
  const link = useParameterLinkStore(state => state.getLinkById(linkId));
  
  if (!link || link.shapes.length === 0) {
    return null;
  }

  const spacing = 3;
  const gridSize = Math.ceil(Math.sqrt(link.shapes.length));
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />
      <pointLight position={[0, 5, 0]} intensity={0.5} />
      
      {link.shapes.map((shape, index) => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        const offsetX = (col - gridSize / 2 + 0.5) * spacing;
        const offsetZ = (row - gridSize / 2 + 0.5) * spacing;
        
        const fullParameters: SurfaceParameters = {
          type: shape.shapeName as any,
          a: shape.parameters.a ?? 1.0,
          b: shape.parameters.b ?? 1.0,
          c: shape.parameters.c ?? 0.0,
          d: shape.parameters.d ?? 0.0,
          e: shape.parameters.e ?? 0.0,
          f: shape.parameters.f ?? 0.0,
          g: shape.parameters.g ?? 0.0,
          h: shape.parameters.h ?? 0.0,
          i: shape.parameters.i ?? 0.0,
          j: shape.parameters.j ?? 0.0,
          k: shape.parameters.k ?? 0.0,
          l: shape.parameters.l ?? 0.0,
          m: shape.parameters.m ?? 0.0,
          n: shape.parameters.n ?? 0.0,
          o: shape.parameters.o ?? 0.0,
          p: shape.parameters.p ?? 0.0,
          q: shape.parameters.q ?? 0.0,
          r: shape.parameters.r ?? 0.0,
          s: shape.parameters.s ?? 0.0,
          t: shape.parameters.t ?? 0.0,
          u: shape.parameters.u ?? 0.0,
          v: shape.parameters.v ?? 0.0,
          w: shape.parameters.w ?? 0.0,
          x: shape.parameters.x ?? 0.0,
          y: shape.parameters.y ?? 0.0,
          z: shape.parameters.z ?? 0.0,
          uMin: 0,
          uMax: 1,
          vMin: 0,
          vMax: 1,
          uSegments: 64,
          vSegments: 48
        };
        
        return (
          <group key={shape.id} position={[offsetX, 0, offsetZ]}>
            <ParametricSurface
              parameters={fullParameters}
              visualizationMode="surface"
              colorMode="viridis"
            />
            
            <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[2, 2]} />
              <meshStandardMaterial
                color={shape.id === link.masterShapeId ? '#3b82f6' : '#374151'}
                transparent
                opacity={0.3}
              />
            </mesh>
            
            <mesh position={[0, -1.49, 0]}>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshStandardMaterial
                color={shape.id === link.masterShapeId ? '#60a5fa' : '#6b7280'}
                emissive={shape.id === link.masterShapeId ? '#3b82f6' : '#000000'}
                emissiveIntensity={0.5}
              />
            </mesh>
          </group>
        );
      })}
      
      <Grid
        args={[50, 50]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#444444"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#666666"
        fadeDistance={30}
        fadeStrength={1}
        position={[0, -2, 0]}
      />
    </>
  );
}

export default function LinkedShapesVisualization({ linkId }: LinkedShapeVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div className="w-full h-full bg-gray-950">
      <Canvas
        ref={canvasRef}
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0
        }}
      >
        <color attach="background" args={['#0a0a0a']} />
        <fog attach="fog" args={['#0a0a0a', 10, 50]} />
        
        <PerspectiveCamera makeDefault position={[8, 6, 8]} fov={50} />
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          minDistance={2}
          maxDistance={30}
          maxPolarAngle={Math.PI / 2}
        />
        
        <LinkedShapesScene linkId={linkId} />
      </Canvas>
    </div>
  );
}

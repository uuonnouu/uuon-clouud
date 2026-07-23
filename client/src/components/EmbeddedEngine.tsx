
import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import * as THREE from 'three';

interface EmbeddedEngineProps {
  width?: string;
  height?: string;
  backgroundColor?: string;
}

interface ModelProps {
  url: string;
  u: number;
  p: number;
  a: number;
  b: number;
  c: number;
  uSegments: number;
  vSegments: number;
}

function Model({ url, u, p, a, b, c, uSegments, vSegments }: ModelProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [model, setModel] = useState<THREE.Group | THREE.Object3D | null>(null);

  // Load model based on file extension - ISOLATED from parameter system
  useEffect(() => {
    const extension = url.split('.').pop()?.toLowerCase();
    
    if (extension === 'gltf' || extension === 'glb') {
      const loader = new GLTFLoader();
      loader.load(
        url, 
        (gltf) => {
          // Clone the scene to prevent shared state issues
          const clonedScene = gltf.scene.clone(true);
          
          // Reset all transforms to ensure clean state
          clonedScene.position.set(0, 0, 0);
          clonedScene.rotation.set(0, 0, 0);
          clonedScene.scale.set(1, 1, 1);
          
          setModel(clonedScene);
        },
        undefined,
        (error) => {
          console.error('Error loading GLTF model:', error);
        }
      );
    } else if (extension === 'obj') {
      const loader = new OBJLoader();
      loader.load(
        url, 
        (obj) => {
          // Clone the object to prevent shared state issues
          const clonedObj = obj.clone(true);
          
          // Reset all transforms to ensure clean state
          clonedObj.position.set(0, 0, 0);
          clonedObj.rotation.set(0, 0, 0);
          clonedObj.scale.set(1, 1, 1);
          
          setModel(clonedObj);
        },
        undefined,
        (error) => {
          console.error('Error loading OBJ model:', error);
        }
      );
    }
  }, [url]);

  // Apply transformations based on parameters - ISOLATED from other objects
  useFrame(() => {
    if (model) {
      // CRITICAL: Reset to base state first to prevent parameter accumulation
      model.rotation.set(0, 0, 0);
      model.scale.set(1, 1, 1);
      
      // U parameter controls rotation speed around Y axis
      model.rotation.y = u * 0.01 * Date.now();
      
      // P parameter controls overall scale pulsing
      const pulseScale = 1 + Math.sin(Date.now() * 0.001 * p) * 0.1;
      
      // A, B, C parameters control scaling on each axis (applied cleanly)
      model.scale.set(a * pulseScale, b * pulseScale, c * pulseScale);
      
      // UV segments affect material properties if available
      model.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const material = child.material as THREE.MeshStandardMaterial;
          if (material.map) {
            material.map.repeat.set(uSegments / 10, vSegments / 10);
            material.map.wrapS = THREE.RepeatWrapping;
            material.map.wrapT = THREE.RepeatWrapping;
          }
        }
      });
    }
  });

  return model ? <primitive object={model} ref={meshRef} /> : null;
}

function Controls() {
  return (
    <OrbitControls
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={2}
      maxDistance={20}
      autoRotate={false}
    />
  );
}

export default function EmbeddedEngine({ 
  width = "100%", 
  height = "400px", 
  backgroundColor = "#1a1a1a" 
}: EmbeddedEngineProps) {
  const [modelUrl, setModelUrl] = useState<string>('');
  const [u, setU] = useState<number>(1);
  const [p, setP] = useState<number>(1);
  const [a, setA] = useState<number>(1);
  const [b, setB] = useState<number>(1);
  const [c, setC] = useState<number>(1);
  const [uSegments, setUSegments] = useState<number>(32);
  const [vSegments, setVSegments] = useState<number>(16);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setModelUrl(url);
    }
  };

  return (
    <div style={{ width, height, position: 'relative' }}>
      {/* File Upload */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 10,
        background: 'rgba(0,0,0,0.8)',
        padding: '10px',
        borderRadius: '5px'
      }}>
        <input
          type="file"
          accept=".gltf,.glb,.obj"
          onChange={handleFileUpload}
          style={{ 
            color: 'white',
            fontSize: '12px',
            marginBottom: '10px',
            display: 'block'
          }}
        />
        
        {/* Parameter Controls */}
        <div style={{ color: 'white', fontSize: '12px' }}>
          <div style={{ marginBottom: '5px' }}>
            <label>U: </label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={u}
              onChange={(e) => setU(parseFloat(e.target.value))}
              style={{ width: '80px' }}
            />
            <span> {u.toFixed(1)}</span>
          </div>
          
          <div style={{ marginBottom: '5px' }}>
            <label>P: </label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={p}
              onChange={(e) => setP(parseFloat(e.target.value))}
              style={{ width: '80px' }}
            />
            <span> {p.toFixed(1)}</span>
          </div>
          
          <div style={{ marginBottom: '5px' }}>
            <label>A: </label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={a}
              onChange={(e) => setA(parseFloat(e.target.value))}
              style={{ width: '80px' }}
            />
            <span> {a.toFixed(1)}</span>
          </div>
          
          <div style={{ marginBottom: '5px' }}>
            <label>B: </label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={b}
              onChange={(e) => setB(parseFloat(e.target.value))}
              style={{ width: '80px' }}
            />
            <span> {b.toFixed(1)}</span>
          </div>
          
          <div style={{ marginBottom: '5px' }}>
            <label>C: </label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={c}
              onChange={(e) => setC(parseFloat(e.target.value))}
              style={{ width: '80px' }}
            />
            <span> {c.toFixed(1)}</span>
          </div>
          
          <div style={{ marginBottom: '5px' }}>
            <label>UV Segs: </label>
            <input
              type="range"
              min="4"
              max="64"
              step="4"
              value={uSegments}
              onChange={(e) => setUSegments(parseInt(e.target.value))}
              style={{ width: '80px' }}
            />
            <span> {uSegments}</span>
          </div>
          
          <div>
            <label>V Segs: </label>
            <input
              type="range"
              min="4"
              max="64"
              step="4"
              value={vSegments}
              onChange={(e) => setVSegments(parseInt(e.target.value))}
              style={{ width: '80px' }}
            />
            <span> {vSegments}</span>
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        style={{ width: '100%', height: '100%', background: backgroundColor }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        
        {modelUrl && (
          <Model
            url={modelUrl}
            u={u}
            p={p}
            a={a}
            b={b}
            c={c}
            uSegments={uSegments}
            vSegments={vSegments}
          />
        )}
        
        <Controls />
        <Environment preset="studio" />
      </Canvas>
    </div>
  );
}

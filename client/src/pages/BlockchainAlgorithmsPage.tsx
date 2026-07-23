
/**
 * BLOCKCHAIN ALGORITHMS EXPLORATION PAGE
 * Full-featured page for visualizing and learning about blockchain algorithms
 */

import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import BlockchainAlgorithmsPanel from '../components/BlockchainAlgorithmsPanel';
import { BlockchainAlgorithm, generateAlgorithmVisualization } from '../lib/blockchainAlgorithmsEngine';
import { SurfaceParameters } from '../types/math';

interface AlgorithmMeshProps {
  algorithm: BlockchainAlgorithm | null;
  parameters?: Partial<SurfaceParameters>;
}

function AlgorithmMesh({ algorithm, parameters }: AlgorithmMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);

  React.useEffect(() => {
    if (!algorithm) return;

    try {
      const newGeometry = generateAlgorithmVisualization(algorithm, parameters);
      setGeometry(newGeometry);
    } catch (error) {
      console.error('Error generating algorithm visualization:', error);
    }
  }, [algorithm, parameters]);

  if (!geometry || !algorithm) return null;

  // Algorithm-specific materials
  const getMaterial = () => {
    switch (algorithm.category) {
      case 'consensus':
        return new THREE.MeshPhysicalMaterial({
          color: '#3b82f6',
          metalness: 0.7,
          roughness: 0.2,
          emissive: '#1e40af',
          emissiveIntensity: 0.1
        });
      case 'cryptographic':
        return new THREE.MeshPhysicalMaterial({
          color: '#10b981',
          metalness: 0.5,
          roughness: 0.3,
          emissive: '#059669',
          emissiveIntensity: 0.1
        });
      case 'proof_systems':
        return new THREE.MeshPhysicalMaterial({
          color: '#8b5cf6',
          metalness: 0.8,
          roughness: 0.1,
          emissive: '#7c3aed',
          emissiveIntensity: 0.2
        });
      case 'layer2':
        return new THREE.MeshPhysicalMaterial({
          color: '#f97316',
          metalness: 0.6,
          roughness: 0.4,
          emissive: '#ea580c',
          emissiveIntensity: 0.1
        });
      case 'privacy':
        return new THREE.MeshPhysicalMaterial({
          color: '#ec4899',
          metalness: 0.4,
          roughness: 0.5,
          emissive: '#db2777',
          emissiveIntensity: 0.1
        });
      case 'post_quantum':
        return new THREE.MeshPhysicalMaterial({
          color: '#ef4444',
          metalness: 0.9,
          roughness: 0.1,
          emissive: '#dc2626',
          emissiveIntensity: 0.15
        });
      default:
        return new THREE.MeshPhysicalMaterial({
          color: '#6b7280',
          metalness: 0.5,
          roughness: 0.3
        });
    }
  };

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={getMaterial()}
      rotation={[0, 0, 0]}
    >
    </mesh>
  );
}

function Scene({ algorithm }: { algorithm: BlockchainAlgorithm | null }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[8, 6, 8]} fov={50} />
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={2}
        maxDistance={20}
      />
      
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      {/* Algorithm Visualization */}
      <AlgorithmMesh algorithm={algorithm} />
      
      {/* Environment */}
      <gridHelper args={[20, 20, '#444444', '#222222']} />
    </>
  );
}

export default function BlockchainAlgorithmsPage() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<BlockchainAlgorithm | null>(null);
  const [showPanel, setShowPanel] = useState(true);

  return (
    <div className="w-full h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold">Blockchain Algorithms Visualizer</h1>
            <p className="text-gray-400 text-sm">
              {selectedAlgorithm 
                ? `Visualizing: ${selectedAlgorithm.name} (${selectedAlgorithm.category})`
                : 'Select an algorithm to explore its 3D visualization'
              }
            </p>
          </div>
          <button
            onClick={() => setShowPanel(!showPanel)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            {showPanel ? 'Hide Panel' : 'Show Panel'}
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Algorithm Panel */}
        {showPanel && (
          <div className="w-1/3 bg-gray-800 p-4 overflow-y-auto border-r border-gray-700">
            <BlockchainAlgorithmsPanel
              onAlgorithmSelect={setSelectedAlgorithm}
              isVisible={showPanel}
            />
          </div>
        )}

        {/* 3D Visualization */}
        <div className={`${showPanel ? 'w-2/3' : 'w-full'} relative`}>
          <Canvas
            shadows
            gl={{ antialias: true, alpha: false }}
            style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}
          >
            <Scene algorithm={selectedAlgorithm} />
          </Canvas>
          
          {/* Overlay Info */}
          {selectedAlgorithm && (
            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm p-4 rounded-lg max-w-sm">
              <h3 className="font-bold text-lg mb-2">{selectedAlgorithm.name}</h3>
              <p className="text-sm text-gray-300 mb-2">{selectedAlgorithm.description}</p>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-blue-600 rounded text-xs">
                  {selectedAlgorithm.category.replace('_', ' ')}
                </span>
              </div>
            </div>
          )}
          
          {!selectedAlgorithm && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="text-6xl mb-4">🔗</div>
                <h2 className="text-2xl font-bold mb-2">Select a Blockchain Algorithm</h2>
                <p>Choose from {showPanel ? 'the panel' : 'consensus, cryptographic, or proof systems'} to see its 3D visualization</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Simple cube component that definitely works
function SimpleCube() {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="cyan" />
    </mesh>
  );
}

// Simple sphere component
function SimpleSphere() {
  return (
    <mesh position={[4, 0, 0]}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshStandardMaterial color="magenta" />
    </mesh>
  );
}

// Basic lighting
function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
    </>
  );
}

export default function SimpleMathVisualizer() {
  const [shape, setShape] = useState("cube");

  return (
    <div className="w-full h-screen bg-black text-white">
      {/* Simple controls */}
      <div className="absolute top-4 left-4 z-10 bg-gray-800 p-4 rounded">
        <div className="flex items-center gap-2 mb-2">
          <img src="/dmension-logo-new.jpg" alt="Δmension" className="w-8 h-8 rounded" />
          <h1 className="text-xl font-bold">Δmension Math Platform</h1>
        </div>
        <button
          onClick={() => setShape("cube")}
          className={`mr-2 px-3 py-1 rounded ${shape === "cube" ? "bg-blue-500" : "bg-gray-600"}`}
        >
          Cube
        </button>
        <button
          onClick={() => setShape("sphere")}
          className={`px-3 py-1 rounded ${shape === "sphere" ? "bg-blue-500" : "bg-gray-600"}`}
        >
          Sphere
        </button>
      </div>

      {/* 3D Scene */}
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        style={{ background: "linear-gradient(to bottom, #1a1a2e, #16213e)" }}
      >
        <Lights />
        
        {shape === "cube" && <SimpleCube />}
        {shape === "sphere" && <SimpleSphere />}
        
        <OrbitControls enablePan enableZoom enableRotate />
        
        {/* Grid */}
        <gridHelper args={[20, 20, "#444444", "#444444"]} />
      </Canvas>
    </div>
  );
}
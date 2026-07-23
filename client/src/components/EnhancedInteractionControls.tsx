import React, { useState, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, Text } from '@react-three/drei';
import * as THREE from 'three';
import { SurfaceParameters } from '../types/math';

interface EnhancedInteractionControlsProps {
  parameters: SurfaceParameters;
  children: React.ReactNode;
  onParameterChange?: (params: Partial<SurfaceParameters>) => void;
}

export default function EnhancedInteractionControls({
  parameters,
  children,
  onParameterChange
}: EnhancedInteractionControlsProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<THREE.Vector3 | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const meshRef = useRef<THREE.Group>(null);
  const { camera, gl } = useThree();

  // Quaternion for smooth rotation (prevents gimbal lock)
  const rotationQuatRef = useRef(new THREE.Quaternion());

  // NO arbitrary animations - geometry stays at exact mathematical scale
  // Only time tracking for visual effects (lighting color)
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    setAnimationPhase(time);
  });

  const handlePointerEnter = () => {
    setIsHovering(true);
    setShowTooltip(true);
    gl.domElement.style.cursor = 'pointer';
  };

  const handlePointerLeave = () => {
    setIsHovering(false);
    setShowTooltip(false);
    gl.domElement.style.cursor = 'default';
  };

  const handlePointerMove = (event: any) => {
    if (event.point) {
      setSelectedPoint(new THREE.Vector3(...event.point));
    }
  };

  const handleClick = (event: any) => {
    if (event.point && onParameterChange) {
      // Interactive parameter adjustment based on click position
      const clickPoint = new THREE.Vector3(...event.point);
      const distance = clickPoint.length();
      
      // Dynamically adjust parameters based on interaction
      const newA = Math.max(1, Math.min(10, distance * 2));
      const newB = Math.max(1, Math.min(10, Math.abs(clickPoint.x) + 1));
      const newC = Math.max(1, Math.min(10, Math.abs(clickPoint.y) + 1));
      
      onParameterChange({ a: newA, b: newB, c: newC });
    }
  };

  // Educational content based on shape type
  const getEducationalTooltip = () => {
    const shapeInfo = {
      cube: "A cube has 6 faces, 8 vertices, and 12 edges. Each face is a perfect square.",
      sphere: "A sphere is perfectly round with all points equidistant from the center.",
      torus: "A torus is a doughnut shape created by rotating a circle around an axis.",
      tetrahedron: "A tetrahedron is the simplest 3D shape with 4 triangular faces.",
      octagon: "An octagon has 8 sides and 8 angles, each measuring 135 degrees.",
      hexagon: "A hexagon appears frequently in nature, like in honeycomb structures.",
      dodecagon: "A dodecagon has 12 sides and is used in many architectural designs.",
      koch_snowflake: "The Koch snowflake demonstrates infinite perimeter within finite area.",
      mandelbrot_solid: "The Mandelbrot set showcases complex mathematical beauty and chaos theory.",
      tesseract_4d: "A tesseract is a 4D cube, impossible to fully visualize in 3D space."
    };

    return shapeInfo[parameters.type as keyof typeof shapeInfo] || 
           "Explore this mathematical structure by adjusting parameters and observing changes.";
  };

  return (
    <group
      ref={meshRef}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      onClick={handleClick}
    >
      {children}
      
      {/* Interactive glow effect when hovering */}
      {isHovering && (
        <pointLight
          position={[0, 0, 2]}
          intensity={0.5}
          color={`hsl(${(animationPhase * 50) % 360}, 80%, 60%)`}
          distance={10}
        />
      )}
      
      {/* Educational tooltip */}
      {showTooltip && selectedPoint && (
        <Html
          position={[selectedPoint.x, selectedPoint.y + 2, selectedPoint.z]}
          className="pointer-events-none"
        >
          <div className="bg-black/90 text-white p-3 rounded-lg shadow-lg max-w-xs text-sm border border-cyan-300">
            <div className="font-semibold text-cyan-300 mb-1">
              {parameters.type.replace(/_/g, ' ').toUpperCase()}
            </div>
            <div className="text-gray-200">
              {getEducationalTooltip()}
            </div>
            <div className="text-xs text-gray-400 mt-2">
              Click to modify parameters • Hover to explore
            </div>
          </div>
        </Html>
      )}
      
      {/* Parameter value display for real-time feedback */}
      {isHovering && (
        <Html position={[0, -3, 0]} className="pointer-events-none">
          <div className="bg-black/80 text-cyan-300 p-2 rounded text-xs font-mono">
            a:{parameters.a.toFixed(1)} b:{parameters.b.toFixed(1)} c:{parameters.c.toFixed(1)}
          </div>
        </Html>
      )}
      
      {/* Coordinate system indicator */}
      {isHovering && selectedPoint && (
        <>
          <Text
            position={[selectedPoint.x + 0.5, selectedPoint.y, selectedPoint.z]}
            fontSize={0.3}
            color="cyan"
            anchorX="left"
          >
            ({selectedPoint.x.toFixed(1)}, {selectedPoint.y.toFixed(1)}, {selectedPoint.z.toFixed(1)})
          </Text>
        </>
      )}
    </group>
  );
}
import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface SmartGridProps {
  shapeScale?: { a: number; b: number; c: number };
  cellColor?: string;
  sectionColor?: string;
}

export default function SmartGrid({ 
  shapeScale = { a: 2, b: 1, c: 1 },
  cellColor = '#444444',
  sectionColor = '#888888'
}: SmartGridProps) {
  const [gridYPosition, setGridYPosition] = useState(-3);
  const [gridDivisions, setGridDivisions] = useState(40);
  const [gridSize, setGridSize] = useState(2000);
  const gridRef = useRef<THREE.Group>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const lastDivisionsRef = useRef(40);
  const { scene, camera } = useThree();

  const calculateGridDensity = useCallback((distance: number) => {
    if (distance < 5) {
      return { divisions: 200, size: 100 };
    } else if (distance < 10) {
      return { divisions: 150, size: 200 };
    } else if (distance < 20) {
      return { divisions: 100, size: 400 };
    } else if (distance < 40) {
      return { divisions: 80, size: 800 };
    } else if (distance < 80) {
      return { divisions: 60, size: 1200 };
    } else if (distance < 150) {
      return { divisions: 40, size: 2000 };
    } else {
      return { divisions: 20, size: 4000 };
    }
  }, []);

  const createGrid = useCallback((size: number, divisions: number, yPos: number) => {
    if (!gridRef.current) return;

    if (gridHelperRef.current) {
      gridRef.current.remove(gridHelperRef.current);
      gridHelperRef.current.geometry.dispose();
      if (Array.isArray(gridHelperRef.current.material)) {
        gridHelperRef.current.material.forEach(m => m.dispose());
      } else {
        gridHelperRef.current.material.dispose();
      }
    }

    const newGrid = new THREE.GridHelper(size, divisions, new THREE.Color(sectionColor), new THREE.Color(cellColor));
    newGrid.position.y = yPos;
    newGrid.renderOrder = -1;

    const materials = Array.isArray(newGrid.material) ? newGrid.material : [newGrid.material];
    materials.forEach((material) => {
      material.transparent = true;
      material.opacity = 0.4;
      material.depthWrite = false;
      (material as THREE.LineBasicMaterial).polygonOffset = true;
      (material as THREE.LineBasicMaterial).polygonOffsetFactor = 1;
      (material as THREE.LineBasicMaterial).polygonOffsetUnits = 1;
    });

    gridRef.current.add(newGrid);
    gridHelperRef.current = newGrid;
    lastDivisionsRef.current = divisions;
  }, [cellColor, sectionColor]);

  useEffect(() => {
    createGrid(gridSize, gridDivisions, gridYPosition);
    
    return () => {
      if (gridHelperRef.current && gridRef.current) {
        gridRef.current.remove(gridHelperRef.current);
        gridHelperRef.current.geometry.dispose();
        if (Array.isArray(gridHelperRef.current.material)) {
          gridHelperRef.current.material.forEach(m => m.dispose());
        } else {
          gridHelperRef.current.material.dispose();
        }
      }
    };
  }, []);

  useFrame(() => {
    scene.updateMatrixWorld(true);
    
    let lowestY = 0;
    let hasGeometry = false;

    scene.traverse((object) => {
      if (object instanceof THREE.Mesh && 
          object.userData.isParametricSurface && 
          object.geometry) {
        
        const box = new THREE.Box3().setFromObject(object);
        if (!box.isEmpty()) {
          hasGeometry = true;
          lowestY = Math.min(lowestY, box.min.y);
        }
      }
    });

    if (hasGeometry) {
      const targetY = lowestY - 3;
      if (Math.abs(targetY - gridYPosition) > 0.5) {
        setGridYPosition(targetY);
        if (gridHelperRef.current) {
          gridHelperRef.current.position.y = targetY;
        }
      }
    }

    if (camera) {
      const distance = camera.position.length();
      const { divisions, size } = calculateGridDensity(distance);
      
      if (Math.abs(divisions - lastDivisionsRef.current) >= 10 || 
          Math.abs(size - gridSize) > 100) {
        setGridDivisions(divisions);
        setGridSize(size);
        createGrid(size, divisions, gridYPosition);
      }

      const maxDistance = 200;
      const minOpacity = 0.1;
      const maxOpacity = 0.5;
      const opacity = Math.max(minOpacity, maxOpacity - (distance / maxDistance) * (maxOpacity - minOpacity));
      
      if (gridHelperRef.current) {
        const materials = Array.isArray(gridHelperRef.current.material) 
          ? gridHelperRef.current.material 
          : [gridHelperRef.current.material];
        
        materials.forEach((material) => {
          if (material) {
            material.opacity = opacity;
            material.needsUpdate = true;
          }
        });
      }
    }
  });

  return (
    <group ref={gridRef} />
  );
}

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleTrailSystemProps {
  surfaceParameters: any;
  trailLength?: number;
  particleCount?: number;
  speed?: number;
  enabled?: boolean;
  energyMode?: 'low' | 'medium' | 'high' | 'quantum';
}

interface TrailParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  age: number;
  maxAge: number;
  energy: number;
  path: THREE.Vector3[];
}

export default function ParticleTrailSystem({
  surfaceParameters,
  trailLength = 50,
  particleCount = 100,
  speed = 1.0,
  enabled = true,
  energyMode = 'medium'
}: ParticleTrailSystemProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const trailsRef = useRef<THREE.Group>(null);
  const particleSystem = useRef<TrailParticle[]>([]);
  const timeRef = useRef(0);

  // Energy-based particle settings
  const energySettings = useMemo(() => {
    const settings = {
      low: { size: 0.02, intensity: 0.5, trailDecay: 0.95, colorRange: 0.3 },
      medium: { size: 0.04, intensity: 1.0, trailDecay: 0.92, colorRange: 0.6 },
      high: { size: 0.06, intensity: 1.8, trailDecay: 0.88, colorRange: 0.9 },
      quantum: { size: 0.08, intensity: 2.5, trailDecay: 0.85, colorRange: 1.2 }
    };
    return settings[energyMode];
  }, [energyMode]);

  // Initialize particle system
  useEffect(() => {
    if (!enabled) return;

    particleSystem.current = Array.from({ length: particleCount }, (_, i) => {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 2 + Math.random() * 3;
      
      return {
        position: new THREE.Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          (Math.random() - 0.5) * 2
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1
        ),
        age: 0,
        maxAge: 100 + Math.random() * 200,
        energy: Math.random(),
        path: []
      };
    });
  }, [particleCount, enabled]);

  // Particle geometry and material
  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = 0;
      positions[i3 + 1] = 0;
      positions[i3 + 2] = 0;
      
      colors[i3] = 1.0;
      colors[i3 + 1] = 0.5;
      colors[i3 + 2] = 0.8;
      
      sizes[i] = energySettings.size * (0.5 + Math.random() * 0.5);
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geom.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.PointsMaterial({
      size: energySettings.size,
      vertexColors: true,
      transparent: true,
      opacity: energySettings.intensity * 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    return { geometry: geom, material: mat };
  }, [particleCount, energySettings]);

  // Mathematical field function for particle movement
  const getFieldVector = (position: THREE.Vector3, time: number): THREE.Vector3 => {
    const { x, y, z } = position;
    
    // Dynamic field based on surface parameters
    const fieldX = Math.sin(y * 0.5 + time * 0.3) * 0.02;
    const fieldY = Math.cos(x * 0.5 + time * 0.2) * 0.02;
    const fieldZ = Math.sin((x * x + y * y) * 0.1 + time * 0.1) * 0.01;
    
    // Add quantum fluctuations for quantum mode
    if (energyMode === 'quantum') {
      const quantumX = Math.sin(time * 10 + x * 5) * 0.005;
      const quantumY = Math.cos(time * 8 + y * 4) * 0.005;
      const quantumZ = Math.sin(time * 12 + z * 6) * 0.005;
      
      return new THREE.Vector3(
        fieldX + quantumX,
        fieldY + quantumY,
        fieldZ + quantumZ
      );
    }
    
    return new THREE.Vector3(fieldX, fieldY, fieldZ);
  };

  // Color calculation based on energy and position
  const calculateParticleColor = (particle: TrailParticle, time: number): THREE.Color => {
    const energy = particle.energy;
    const age = particle.age / particle.maxAge;
    
    let hue = 0.6 + energy * energySettings.colorRange;
    let saturation = 0.8 + energy * 0.2;
    let lightness = 0.5 + energy * 0.4 * (1 - age);
    
    // Quantum mode special effects
    if (energyMode === 'quantum') {
      hue += Math.sin(time * 5 + energy * 10) * 0.1;
      saturation = Math.min(1.0, saturation + Math.cos(time * 3) * 0.2);
    }
    
    const color = new THREE.Color();
    color.setHSL(hue % 1, saturation, lightness);
    return color;
  };

  // Trail rendering
  const createTrails = () => {
    if (!trailsRef.current) return;

    // Clear existing trails
    trailsRef.current.clear();

    particleSystem.current.forEach(particle => {
      if (particle.path.length < 2) return;

      const points = particle.path.slice(-trailLength);
      if (points.length < 2) return;

      const trailGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const trailMaterial = new THREE.LineBasicMaterial({
        color: calculateParticleColor(particle, timeRef.current),
        transparent: true,
        opacity: 0.6 * energySettings.intensity,
        blending: THREE.AdditiveBlending
      });

      const trail = new THREE.Line(trailGeometry, trailMaterial);
      trailsRef.current?.add(trail);
    });
  };

  useFrame((state) => {
    if (!enabled || !particlesRef.current) return;

    // Performance-based throttling - skip frames if needed
    const frameSkip = energyMode === 'quantum' ? 1 : energyMode === 'high' ? 2 : 3;
    if (state.clock.elapsedTime % frameSkip < 0.016) return;

    const time = state.clock.elapsedTime * speed;
    timeRef.current = time;

    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const colors = particlesRef.current.geometry.attributes.color.array as Float32Array;

    particleSystem.current.forEach((particle, i) => {
      // Update particle physics
      const fieldForce = getFieldVector(particle.position, time);
      particle.velocity.add(fieldForce);
      particle.velocity.multiplyScalar(0.98); // Damping
      particle.position.add(particle.velocity);

      // Add to trail path
      particle.path.push(particle.position.clone());
      if (particle.path.length > trailLength) {
        particle.path.shift();
      }

      // Age particle
      particle.age++;
      if (particle.age > particle.maxAge) {
        // Respawn particle
        const angle = Math.random() * Math.PI * 2;
        const radius = 2 + Math.random() * 3;
        particle.position.set(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          (Math.random() - 0.5) * 2
        );
        particle.velocity.set(
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1
        );
        particle.age = 0;
        particle.path = [];
      }

      // Update geometry
      const i3 = i * 3;
      positions[i3] = particle.position.x;
      positions[i3 + 1] = particle.position.y;
      positions[i3 + 2] = particle.position.z;

      // Update colors
      const color = calculateParticleColor(particle, time);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    });

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    particlesRef.current.geometry.attributes.color.needsUpdate = true;

    // Update trails every few frames for performance
    if (Math.floor(time * 10) % 3 === 0) {
      createTrails();
    }
  });

  if (!enabled) return null;

  return (
    <group>
      <points ref={particlesRef} geometry={geometry} material={material} />
      <group ref={trailsRef} />
    </group>
  );
}
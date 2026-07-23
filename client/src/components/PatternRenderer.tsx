import { useMemo } from "react";
import * as THREE from "three";
import { SurfaceParameters } from "../types/math";
import { generateParametricSurface } from "../lib/surfaceGenerator";

type PatternMode = "star" | "plus" | "cross" | "lines";

interface PatternRendererProps {
  parameters: SurfaceParameters;
  visualMode: PatternMode;
  colorMode: string;
  staticMode?: boolean;
}

export default function PatternRenderer({ 
  parameters, 
  visualMode, 
  colorMode, 
  staticMode = false 
}: PatternRendererProps) {
  // Generate pattern symbols based on the polygon surface
  const patternElements = useMemo(() => {
    const surfaceData = generateParametricSurface(parameters);
    const positions = surfaceData.vertices;
    const energy = Math.abs(parameters.a) + Math.abs(parameters.b) + Math.abs(parameters.c);
    
    const elements: JSX.Element[] = [];
    
    for (let i = 0; i < positions.length; i += 9) { // Every 3rd vertex for spacing
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];
      
      // Apply quantum colors based on position and energy
      const color = getPatternColor(x, y, z, energy, colorMode);
      
      let patternElement: JSX.Element;
      
      switch (visualMode) {
        case "star":
          patternElement = <StarPattern key={i} position={[x, y, z]} color={color} energy={energy} />;
          break;
        case "plus":
          patternElement = <PlusPattern key={i} position={[x, y, z]} color={color} energy={energy} />;
          break;
        case "cross":
          patternElement = <CrossPattern key={i} position={[x, y, z]} color={color} energy={energy} />;
          break;
        case "lines":
          patternElement = <LinesPattern key={i} position={[x, y, z]} color={color} energy={energy} />;
          break;
        default:
          continue;
      }
      
      elements.push(patternElement);
    }
    
    return elements;
  }, [parameters, visualMode, colorMode]);

  // NO arbitrary animations - patterns stay geometrically fixed in place
  // Mathematical precision: pattern positions are derived from parametric surface equations only

  return <group>{patternElements}</group>;
}

// Individual pattern components
function StarPattern({ position, color, energy }: { position: [number, number, number]; color: [number, number, number]; energy: number }) {
  // NO arbitrary animations - star stays fixed at its geometric position
  
  const starGeometry = useMemo(() => {
    const starShape = new THREE.Shape();
    const outerRadius = 0.1 + (energy * 0.0001);
    const innerRadius = outerRadius * 0.4;
    
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const px = Math.cos(angle) * radius;
      const py = Math.sin(angle) * radius;
      
      if (i === 0) {
        starShape.moveTo(px, py);
      } else {
        starShape.lineTo(px, py);
      }
    }
    starShape.closePath();
    
    return new THREE.ExtrudeGeometry(starShape, {
      depth: 0.02,
      bevelEnabled: false
    });
  }, [energy]);

  return (
    <mesh position={position} geometry={starGeometry}>
      <meshBasicMaterial color={color} transparent opacity={0.8} />
    </mesh>
  );
}

function PlusPattern({ position, color, energy }: { position: [number, number, number]; color: [number, number, number]; energy: number }) {
  // NO arbitrary animations - plus stays fixed at its geometric position
  
  const plusGeometry = useMemo(() => {
    // More responsive size scaling
    const baseSize = 0.06;
    const energyMultiplier = Math.min(0.0002, energy * 0.0001);
    const size = baseSize + energyMultiplier;
    const thickness = size * 0.25;
    
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      // Horizontal bar - enhanced precision
      -size, -thickness, 0,  size, -thickness, 0,  size, thickness, 0,
      -size, -thickness, 0,  size, thickness, 0,  -size, thickness, 0,
      // Vertical bar - enhanced precision  
      -thickness, -size, 0,  thickness, -size, 0,  thickness, size, 0,
      -thickness, -size, 0,  thickness, size, 0,  -thickness, size, 0,
      // Add depth for better visibility
      -size, -thickness, -0.01,  size, -thickness, -0.01,  size, thickness, -0.01,
      -size, -thickness, -0.01,  size, thickness, -0.01,  -size, thickness, -0.01,
      -thickness, -size, -0.01,  thickness, -size, -0.01,  thickness, size, -0.01,
      -thickness, -size, -0.01,  thickness, size, -0.01,  -thickness, size, -0.01,
    ]);
    
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();
    return geometry;
  }, [energy]);

  return (
    <mesh position={position} geometry={plusGeometry}>
      <meshBasicMaterial color={color} transparent opacity={0.9} side={THREE.DoubleSide} />
    </mesh>
  );
}

function CrossPattern({ position, color, energy }: { position: [number, number, number]; color: [number, number, number]; energy: number }) {
  // NO arbitrary animations - cross stays fixed at its geometric position
  
  const crossGeometry = useMemo(() => {
    const size = 0.08 + (energy * 0.0001);
    const thickness = size * 0.2;
    
    const geometry = new THREE.BufferGeometry();
    const sqrt2 = Math.sqrt(2);
    const halfSize = size / sqrt2;
    const halfThickness = thickness / sqrt2;
    
    const vertices = new Float32Array([
      // First diagonal
      -halfSize - halfThickness, -halfSize + halfThickness, 0,
      -halfSize + halfThickness, -halfSize - halfThickness, 0,
      halfSize + halfThickness, halfSize - halfThickness, 0,
      -halfSize - halfThickness, -halfSize + halfThickness, 0,
      halfSize + halfThickness, halfSize - halfThickness, 0,
      halfSize - halfThickness, halfSize + halfThickness, 0,
      
      // Second diagonal
      -halfSize + halfThickness, halfSize + halfThickness, 0,
      -halfSize - halfThickness, halfSize - halfThickness, 0,
      halfSize - halfThickness, -halfSize - halfThickness, 0,
      -halfSize + halfThickness, halfSize + halfThickness, 0,
      halfSize - halfThickness, -halfSize - halfThickness, 0,
      halfSize + halfThickness, -halfSize + halfThickness, 0,
    ]);
    
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();
    return geometry;
  }, [energy]);

  return (
    <mesh position={position} geometry={crossGeometry}>
      <meshBasicMaterial color={color} transparent opacity={0.8} />
    </mesh>
  );
}

function LinesPattern({ position, color, energy }: { position: [number, number, number]; color: [number, number, number]; energy: number }) {
  // NO arbitrary animations - lines stay fixed at their geometric position
  
  const linesGeometry = useMemo(() => {
    const size = 0.08 + (energy * 0.0001);
    const lineWidth = size * 0.15;
    const lineHeight = size * 1.5;
    const spacing = size * 0.8;
    
    const geometry = new THREE.BufferGeometry();
    const vertices: number[] = [];
    
    // Create three vertical lines with diamond separators
    for (let lineIndex = 0; lineIndex < 3; lineIndex++) {
      const offsetX = (lineIndex - 1) * spacing;
      
      // Vertical line
      vertices.push(
        offsetX - lineWidth/2, -lineHeight/2, 0,
        offsetX + lineWidth/2, -lineHeight/2, 0,
        offsetX + lineWidth/2, lineHeight/2, 0,
        offsetX - lineWidth/2, -lineHeight/2, 0,
        offsetX + lineWidth/2, lineHeight/2, 0,
        offsetX - lineWidth/2, lineHeight/2, 0
      );
      
      // Diamond separator (if not the last line)
      if (lineIndex < 2) {
        const diamondX = offsetX + spacing/2;
        const diamondSize = size * 0.25;
        
        // Diamond shape <>
        vertices.push(
          diamondX - diamondSize, 0, 0,
          diamondX, diamondSize/2, 0,
          diamondX + diamondSize, 0, 0,
          diamondX - diamondSize, 0, 0,
          diamondX + diamondSize, 0, 0,
          diamondX, -diamondSize/2, 0
        );
      }
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    geometry.computeVertexNormals();
    return geometry;
  }, [energy]);

  return (
    <mesh position={position} geometry={linesGeometry}>
      <meshBasicMaterial color={color} transparent opacity={0.9} />
    </mesh>
  );
}



function getPatternColor(x: number, y: number, z: number, energy: number, colorMode: string): [number, number, number] {
  switch (colorMode) {
    case "neon_green":
      // TRUE neon green (#00FF00) - pure green
      return [0.0, 1.0, 0.0];
    case "neon_magenta":
      // TRUE neon magenta (#FF00FF) - pure magenta
      return [1.0, 0.0, 1.0];
    case "neon_orange":
      // TRUE neon orange (#FF8000) - pure orange
      return [1.0, 0.5, 0.0];
    default:
      // Default to neon green
      return [0.0, 1.0, 0.0];
  }
}

function getLetterHarmonyColor(x: number, y: number, z: number, energy: number): [number, number, number] {
  // PRECISION SYSTEM: 0.11 increments around 1.0.0.1 base
  const positionSum = Math.abs(x) + Math.abs(y) + Math.abs(z);
  const time = Date.now() * 0.001;
  
  // Create 50-step cycle: 0-24 (forward 1→25), 25-49 (backward 25→-25)
  const cyclePosition = Math.floor((positionSum * 5 + time * 2) % 50);
  
  let letterValue: number;
  let isNegative = false;
  
  if (cyclePosition < 25) {
    letterValue = cyclePosition + 1; // 1→25
  } else {
    letterValue = 50 - cyclePosition; // 25→1 (negative)
    isNegative = true;
  }
  
  // BASE: 1.0.0.1 with 0.11 increments for precision
  const baseR = 1.0;
  const baseG = 0.0;
  const baseB = 0.1;
  
  // Calculate 0.11 increment steps for each channel
  const stepIncrement = 0.11;
  const rStep = (letterValue - 1) * stepIncrement; // R: 0.11, 0.22, 0.33...
  const gStep = letterValue * stepIncrement;       // G: 0.11, 0.22, 0.33...
  const bStep = (letterValue + 1) * stepIncrement; // B: 0.22, 0.33, 0.44...
  
  // Generate precise decimal values with enhanced brightness
  let r, g, b;
  
  if (letterValue === 1) {
    // B pattern: base + 0.11 - enhanced
    r = Math.min(1.0, (baseR + 0.11) * 2.5); // Boosted brightness
    g = Math.min(1.0, (baseG + 0.11) * 2.5);
    b = Math.min(1.0, (baseB + 0.11) * 2.5);
  } else if (letterValue === 2) {
    // C pattern: base + 0.22 - enhanced
    r = Math.min(1.0, (baseR + 0.22) * 2.5);
    g = Math.min(1.0, (baseG + 0.22) * 2.5);
    b = Math.min(1.0, (baseB + 0.22) * 2.5);
  } else {
    // Progressive 0.11 increments - enhanced
    r = Math.min(1.0, (baseR + (letterValue * 0.11)) * 2.2);
    g = Math.min(1.0, (baseG + (letterValue * 0.11)) * 2.2);
    b = Math.min(1.0, (baseB + (letterValue * 0.11)) * 2.2);
  }
  
  // Normalize to valid RGB range [0, 1]
  r = r % 1.0; // Wrap values > 1.0
  g = g % 1.0;
  b = b % 1.0;
  
  // Apply NEGATIVE transformation for backward cycle
  if (isNegative) {
    // Invert colors and apply negative energy signature
    r = 1.0 - r;
    g = 1.0 - g; 
    b = 1.0 - b;
    
    // Add negative energy signature (darker, cooler tones)
    r *= 0.7; // Reduce red
    g *= 0.8; // Slightly reduce green
    b *= 1.2; // Boost blue for cooler negative effect
  }
  
  // Apply energy scaling with different effects for positive/negative
  const energyFactor = Math.min(energy / 5000, 1.0);
  
  if (isNegative) {
    // Negative energy: cooler, more subtle
    r *= energyFactor * 0.8;
    g *= energyFactor * 0.9;
    b *= energyFactor * 1.1;
  } else {
    // Positive energy: warmer, more intense
    r *= energyFactor * 1.2;
    g *= energyFactor * 1.0;
    b *= energyFactor * 0.8;
  }
  
  // Ultra-high energy quantum pulsing
  if (energy > 10000) {
    const pulse = Math.sin(time * 8) * 0.4 + 0.6;
    const negativePulse = isNegative ? 0.7 : 1.0; // Dampen negative pulses
    r *= pulse * negativePulse;
    g *= pulse * negativePulse;
    b *= pulse * negativePulse;
  }
  
  // Ensure valid RGB range [0, 1]
  return [
    Math.max(0.05, Math.min(1, r)),
    Math.max(0.05, Math.min(1, g)),
    Math.max(0.05, Math.min(1, b))
  ];
}

function getLetterHarmonyColorV2(x: number, y: number, z: number, energy: number): [number, number, number] {
  // YOUR APPROACH: Original balanced decimal system
  const positionSum = Math.abs(x) + Math.abs(y) + Math.abs(z);
  const time = Date.now() * 0.001;
  
  // Create 50-step cycle: 0-24 (forward 1→25), 25-49 (backward 25→-25)
  const cyclePosition = Math.floor((positionSum * 5 + time * 2) % 50);
  
  let letterValue: number;
  let isNegative = false;
  
  if (cyclePosition < 25) {
    letterValue = cyclePosition + 1; // 1→25
  } else {
    letterValue = 50 - cyclePosition; // 25→1 (negative)
    isNegative = true;
  }
  
  // Generate balanced decimal patterns using original letter values
  let r, g, b;
  
  if (letterValue === 1) {
    // B pattern: 1.1 → 0.11 in RGB
    r = 0.11; g = 0.11; b = 0.11;
  } else if (letterValue === 2) {
    // C pattern: 22.22 → 0.2222 in RGB
    r = 0.2222; g = 0.2222; b = 0.2222;
  } else if (letterValue === 3) {
    // D pattern: 333.333 → 0.333333 in RGB
    r = 0.333333; g = 0.333333; b = 0.333333;
  } else if (letterValue <= 9) {
    // Single digit patterns: 4444.4444, 5555.5555, etc.
    const digitStr = letterValue.toString();
    const decimalValue = parseFloat("0." + digitStr.repeat(4));
    r = decimalValue; g = decimalValue; b = decimalValue;
  } else if (letterValue <= 19) {
    // Double digit patterns: 1010.1010, 1111.1111, etc.
    const doubleDigit = Math.floor(letterValue / 2);
    const decimalValue = parseFloat("0." + doubleDigit.toString().repeat(4));
    r = decimalValue; g = decimalValue; b = decimalValue;
  } else {
    // Complex patterns for 20-25 (X, Y, Z range)
    // X=23: 23232323.2323, Y=24: 24242424.2424, Z=25: 25252525.2525
    const complexDigit = 20 + (letterValue - 20);
    const complexPattern = complexDigit.toString();
    const decimalValue = parseFloat("0." + complexPattern.repeat(2));
    r = decimalValue; g = decimalValue; b = decimalValue;
  }
  
  // Apply NEGATIVE transformation for backward cycle
  if (isNegative) {
    // Invert colors and apply negative energy signature
    r = 1.0 - r;
    g = 1.0 - g; 
    b = 1.0 - b;
    
    // Add negative energy signature (darker, cooler tones)
    r *= 0.7; // Reduce red
    g *= 0.8; // Slightly reduce green
    b *= 1.2; // Boost blue for cooler negative effect
  }
  
  // Apply energy scaling with different effects for positive/negative
  const energyFactor = Math.min(energy / 5000, 1.0);
  
  if (isNegative) {
    // Negative energy: cooler, more subtle
    r *= energyFactor * 0.8;
    g *= energyFactor * 0.9;
    b *= energyFactor * 1.1;
  } else {
    // Positive energy: warmer, more intense
    r *= energyFactor * 1.2;
    g *= energyFactor * 1.0;
    b *= energyFactor * 0.8;
  }
  
  // Ultra-high energy quantum pulsing
  if (energy > 10000) {
    const pulse = Math.sin(time * 8) * 0.4 + 0.6;
    const negativePulse = isNegative ? 0.7 : 1.0; // Dampen negative pulses
    r *= pulse * negativePulse;
    g *= pulse * negativePulse;
    b *= pulse * negativePulse;
  }
  
  // Ensure valid RGB range [0, 1]
  return [
    Math.max(0.05, Math.min(1, r)),
    Math.max(0.05, Math.min(1, g)),
    Math.max(0.05, Math.min(1, b))
  ];
}

function getLightIntensityColor(x: number, y: number, z: number, energy: number): [number, number, number] {
  // LIGHT INTENSITY FORMULA: I = L / (4π × d²)
  // Where I = intensity, L = luminous flux, d = distance
  
  const distance = Math.sqrt(x * x + y * y + z * z);
  const time = Date.now() * 0.001;
  
  // Light source properties
  const luminousFlux = energy * 100; // Convert energy to lumens
  const surfaceArea = 4 * Math.PI * (distance * distance + 0.01); // +0.01 prevents division by zero
  
  // Inverse square law: intensity decreases with distance squared
  const intensity = luminousFlux / surfaceArea;
  
  // Wavelength-dependent color temperature (Planck's law approximation)
  const temperature = 2000 + (intensity * 0.1); // Kelvin temperature
  
  // Convert color temperature to RGB using Wien's displacement law
  let r, g, b;
  
  if (temperature < 3300) {
    // Red-orange (low temperature)
    r = 1.0;
    g = Math.min(1.0, (temperature - 1000) / 2300);
    b = 0.0;
  } else if (temperature < 5000) {
    // Yellow-white (medium temperature)
    r = 1.0;
    g = 1.0;
    b = Math.min(1.0, (temperature - 3300) / 1700);
  } else if (temperature < 6500) {
    // White (high temperature)
    r = Math.max(0.6, 1.0 - (temperature - 5000) / 1500 * 0.4);
    g = 1.0;
    b = 1.0;
  } else {
    // Blue-white (very high temperature)
    r = Math.max(0.4, 1.0 - (temperature - 6500) / 2000 * 0.6);
    g = Math.max(0.6, 1.0 - (temperature - 6500) / 2000 * 0.4);
    b = 1.0;
  }
  
  // Apply inverse square law dimming
  const dimming = Math.min(1.0, intensity / 1000);
  r *= dimming;
  g *= dimming;
  b *= dimming;
  
  // Atmospheric scattering (Rayleigh scattering)
  // Blue light scatters more than red (λ⁻⁴ dependence)
  const scatteringFactor = 1.0 / (1.0 + distance * 0.1);
  const redScattering = scatteringFactor;
  const greenScattering = scatteringFactor * 0.8;
  const blueScattering = scatteringFactor * 0.6;
  
  r *= redScattering;
  g *= greenScattering;
  b *= blueScattering;
  
  // Quantum fluctuations at high energy
  if (energy > 10000) {
    const fluctuation = Math.sin(time * 10 + distance) * 0.1 + 0.9;
    r *= fluctuation;
    g *= fluctuation;
    b *= fluctuation;
  }
  
  // Ensure valid range with minimum visibility
  return [
    Math.max(0.02, Math.min(1, r)),
    Math.max(0.02, Math.min(1, g)),
    Math.max(0.02, Math.min(1, b))
  ];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h * 6) % 2 - 1));
  const m = l - c / 2;
  
  let r = 0, g = 0, b = 0;
  if (h < 1/6) { r = c; g = x; b = 0; }
  else if (h < 2/6) { r = x; g = c; b = 0; }
  else if (h < 3/6) { r = 0; g = c; b = x; }
  else if (h < 4/6) { r = 0; g = x; b = c; }
  else if (h < 5/6) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }
  
  return [r + m, g + m, b + m];
}
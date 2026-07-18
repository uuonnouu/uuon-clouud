import { useEffect, useState, useRef } from "react";  
import { Canvas } from "@react-three/fiber";  
import { OrbitControls, Html } from "@react-three/drei";  
import * as THREE from "three";  
  
const generatePhi = (t, speedFactor) => {  
  return 1.605 + Math.sin(t / (20 / speedFactor)) * 0.07;  
};  
  
const classifyBand = (phi) => {  
  if (phi >= 1.550 && phi <= 1.551) return "A";  
  if (phi >= 1.576 && phi <= 1.578) return "B";  
  if (phi >= 1.600 && phi <= 1.605) return "C";  
  if (phi >= 1.630 && phi <= 1.637) return "D";  
  if (phi >= 1.669 && phi <= 1.673) return "E";  
  return null;  
};  
  
const bandColors = {  
  A: "#00bcd4",  
  B: "#4caf50",  
  C: "#ff9800",  
  D: "#9c27b0",  
  E: "#f44336",  
  default: "#ffffff"  
};  
  
const bandSymbols = {  
  A: "Δζ",  
  B: "ψλ",  
  C: "Ξχ",  
  D: "ρν",  
  E: "τΩ"  
};  
  
const bandSounds = {  
  A: "https://assets.mixkit.co/sfx/preview/mixkit-arcade-retro-jump-223.wav",  
  B: "https://assets.mixkit.co/sfx/preview/mixkit-game-click-1114.wav",  
  C: "https://assets.mixkit.co/sfx/preview/mixkit-confirmation-tone-2863.wav",  
  D: "https://assets.mixkit.co/sfx/preview/mixkit-classic-click-1117.wav",  
  E: "https://assets.mixkit.co/sfx/preview/mixkit-positive-notification-951.wav"  
};  
  
function playBandSound(band) {  
  if (band && bandSounds[band]) {  
    const audio = new Audio(bandSounds[band]);  
    audio.volume = 0.3;  
    audio.play();  
  }  
}  
  
function detectPattern(t) {  
  const tStr = t.toString().padStart(3, '0');  
  const last3 = tStr.slice(-3);  
  const triple = /^(\d)\1\1$/.test(last3);  
  const sequence = ['123', '234', '345', '456', '567', '678', '789', '012'].includes(last3);  
  const harmonic = t % 111 === 0;  
  if (triple) return "🔥 TRIPLE";  
  if (sequence) return "⚡ SEQUENCE";  
  if (harmonic) return "✨ HARMONIC";  
  return null;  
}  
  
function PhiTrailLine({ points }) {  
  const positions = new Float32Array(points.length * 3);  
  points.forEach(([x, y, z], i) => {  
    positions[i * 3] = x;  
    positions[i * 3 + 1] = y;  
    positions[i * 3 + 2] = z;  
  });  
  
  return (  
    <line>  
      <bufferGeometry>  
        <bufferAttribute  
          attach="attributes-position"  
          count={points.length}  
          array={positions}  
          itemSize={3}  
        />  
      </bufferGeometry>  
      <lineBasicMaterial color="#ffffff" linewidth={2} />  
    </line>  
  );  
}  
  
function PhiPointCloud({ points }) {  
  return (  
    <>  
      {points.map(([x, y, z, band, pattern], i) => (  
        <mesh key={i} position={[x, y, z]}>  
          <sphereGeometry args={[0.05, 8, 8]} />  
          <meshStandardMaterial  
            color={bandColors[band] || bandColors.default}  
            emissive={bandColors[band] || bandColors.default}  
            emissiveIntensity={0.6}  
          />  
          {band && bandSymbols[band] && (  
            <Html position={[0, 0.1, 0]} center distanceFactor={10} style={{ color: bandColors[band], fontWeight: 'bold', fontSize: '0.8rem' }}>  
              {bandSymbols[band]}  
            </Html>  
          )}  
          {pattern && (  
            <Html position={[0, 0.25, 0]} center distanceFactor={10} style={{ color: '#fff', fontSize: '0.7rem', fontStyle: 'italic' }}>  
              {pattern}  
            </Html>  
          )}  
        </mesh>  
      ))}  
    </>  
  );  
}  
  
export default function PhiOscillationEngine() {  
  const [phiPoints, setPhiPoints] = useState([]);  
  const [t, setT] = useState(0);  
  const [speedFactor, setSpeedFactor] = useState(1);  
  const lastBandRef = useRef(null);  
  
  useEffect(() => {  
    const interval = setInterval(() => {  
      const phi = generatePhi(t, speedFactor);  
      const band = classifyBand(phi);  
      const pattern = detectPattern(t  

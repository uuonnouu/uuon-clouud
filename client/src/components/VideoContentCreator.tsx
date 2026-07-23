
import React, { useState, useRef, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, PerspectiveCamera } from '@react-three/drei';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Video, Download, Play, Square, Camera } from 'lucide-react';
import * as THREE from 'three';

interface VideoScene {
  title: string;
  duration: number;
  description: string;
  shapes: string[];
  effects: string[];
  transitions: string[];
}

const VIRAL_SCENES: VideoScene[] = [
  {
    title: "Yuma to Kassel Mathematical Destiny",
    duration: 60,
    description: "Phil's origin story with coordinate mathematics",
    shapes: ["tesseract", "sphere", "torus"],
    effects: ["quantum_particles", "sacred_glow", "coordinate_display"],
    transitions: ["desert_to_castle", "letter_morph", "dimensional_shift"]
  },
  {
    title: "4D Mind-Break Tesseract",
    duration: 30,
    description: "Reality-bending 4D rotation showcase",
    shapes: ["tesseract", "hypersphere", "klein_bottle"],
    effects: ["hyperdimensional_glow", "reality_distortion", "mind_break_particles"],
    transitions: ["4d_unfold", "dimension_collapse", "reality_snap"]
  },
  {
    title: "Sacred Geometry Healing Journey",
    duration: 90,
    description: "Therapeutic chakra visualization experience",
    shapes: ["root_chakra", "heart_chakra", "crown_chakra", "tree_of_life"],
    effects: ["healing_energy", "chakra_activation", "therapeutic_glow"],
    transitions: ["energy_rise", "chakra_sequence", "enlightenment_burst"]
  }
];

function AnimatedTesseract({ recording }: { recording: boolean }) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Outer cube */}
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshBasicMaterial color="#ff6b6b" wireframe transparent opacity={0.6} />
      </mesh>
      {/* Inner cube */}
      <mesh scale={0.5}>
        <boxGeometry args={[2, 2, 2]} />
        <meshBasicMaterial color="#4ecdc4" wireframe transparent opacity={0.8} />
      </mesh>
      {/* Connecting lines for 4D effect */}
      {[...Array(8)].map((_, i) => (
        <mesh key={i} position={[Math.cos(i) * 1.5, Math.sin(i) * 1.5, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 2]} />
          <meshBasicMaterial color="#ffd93d" transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function SacredChakra({ type }: { type: string }) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
  });

  const colors = {
    root: "#ff0000",
    heart: "#00ff00", 
    crown: "#9400d3"
  };

  return (
    <group ref={meshRef}>
      <mesh>
        <torusGeometry args={[1.5, 0.3, 16, 100]} />
        <meshBasicMaterial color={colors[type as keyof typeof colors] || "#ffffff"} />
      </mesh>
      {/* Petals */}
      {[...Array(8)].map((_, i) => (
        <mesh key={i} position={[Math.cos(i * Math.PI / 4) * 1.2, Math.sin(i * Math.PI / 4) * 1.2, 0]}>
          <sphereGeometry args={[0.1]} />
          <meshBasicMaterial color={colors[type as keyof typeof colors] || "#ffffff"} />
        </mesh>
      ))}
    </group>
  );
}

function QuantumParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  const particleCount = 1000;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#00ffff" size={0.05} transparent opacity={0.6} />
    </points>
  );
}

export default function VideoContentCreator() {
  const [selectedScene, setSelectedScene] = useState<VideoScene>(VIRAL_SCENES[0]);
  const [recording, setRecording] = useState(false);
  const [recordedTime, setRecordedTime] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    if (!canvasRef.current) return;

    try {
      const stream = canvasRef.current.captureStream(30);
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });

      recordedChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedScene.title.replace(/\s+/g, '_')}_${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
      setRecordedTime(0);

      // Auto-stop after scene duration
      setTimeout(() => {
        stopRecording();
      }, selectedScene.duration * 1000);

      // Update timer
      const timer = setInterval(() => {
        setRecordedTime(prev => {
          if (prev >= selectedScene.duration) {
            clearInterval(timer);
            return selectedScene.duration;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
    }
  }, [selectedScene.duration]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      setRecordedTime(0);
    }
  }, [recording]);

  const renderScene = () => {
    switch (selectedScene.title) {
      case "4D Mind-Break Tesseract":
        return (
          <>
            <AnimatedTesseract recording={recording} />
            <QuantumParticles />
            <Text
              position={[0, -3, 0]}
              fontSize={0.5}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              4D TESSERACT ROTATION
            </Text>
          </>
        );
      
      case "Sacred Geometry Healing Journey":
        return (
          <>
            <SacredChakra type="root" />
            <QuantumParticles />
            <Text
              position={[0, -3, 0]}
              fontSize={0.5}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              SACRED CHAKRA HEALING
            </Text>
          </>
        );
      
      default:
        return (
          <>
            <AnimatedTesseract recording={recording} />
            <SacredChakra type="crown" />
            <Text
              position={[0, 3, 0]}
              fontSize={0.4}
              color="#ffd93d"
              anchorX="center"
              anchorY="middle"
            >
              YUMA → KASSEL
            </Text>
            <Text
              position={[0, -3, 0]}
              fontSize={0.3}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              MATHEMATICAL DESTINY
            </Text>
          </>
        );
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500">
        <CardHeader>
          <CardTitle className="text-3xl text-center text-purple-300">
            🎬 VIRAL VIDEO CONTENT CREATOR 🎬
          </CardTitle>
          <p className="text-center text-gray-300">
            Create actual 60-second TikTok videos with Phil's mathematical universe
          </p>
        </CardHeader>
      </Card>

      {/* Scene Selection */}
      <Card className="bg-gray-800/50 border-gray-600">
        <CardHeader>
          <CardTitle className="text-xl text-yellow-300">Select Video Scene</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedScene.title}
            onValueChange={(value) => {
              const scene = VIRAL_SCENES.find(s => s.title === value);
              if (scene) setSelectedScene(scene);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VIRAL_SCENES.map((scene) => (
                <SelectItem key={scene.title} value={scene.title}>
                  {scene.title} ({scene.duration}s)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="mt-4 p-4 bg-gray-700/50 rounded-lg">
            <h4 className="text-lg font-bold text-cyan-300">{selectedScene.title}</h4>
            <p className="text-gray-300 mb-2">{selectedScene.description}</p>
            <p className="text-sm text-yellow-300">Duration: {selectedScene.duration} seconds</p>
          </div>
        </CardContent>
      </Card>

      {/* 3D Scene Renderer */}
      <Card className="bg-black border-cyan-500">
        <CardHeader>
          <CardTitle className="text-xl text-cyan-300 flex items-center gap-2">
            <Video className="w-5 h-5" />
            Live Video Preview
            {recording && (
              <span className="text-red-400 animate-pulse">
                ● REC {recordedTime}s / {selectedScene.duration}s
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-96 bg-black rounded-lg overflow-hidden">
            <Canvas ref={canvasRef} className="w-full h-full">
              <PerspectiveCamera makeDefault position={[0, 0, 5]} />
              <OrbitControls enablePan enableZoom enableRotate />
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <pointLight position={[-10, -10, -10]} color="#4ecdc4" />
              
              {renderScene()}
            </Canvas>
          </div>
        </CardContent>
      </Card>

      {/* Recording Controls */}
      <Card className="bg-gradient-to-r from-red-900/50 to-orange-900/50 border-red-500">
        <CardHeader>
          <CardTitle className="text-xl text-red-300">Recording Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={startRecording}
              disabled={recording}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Camera className="w-4 h-4 mr-2" />
              {recording ? 'Recording...' : 'Start Recording'}
            </Button>
            
            <Button
              onClick={stopRecording}
              disabled={!recording}
              className="bg-gray-600 hover:bg-gray-700 text-white"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop Recording
            </Button>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-gray-300">
              Recording will automatically stop after {selectedScene.duration} seconds
            </p>
            <p className="text-sm text-yellow-300 mt-2">
              💡 Tip: Move the 3D view around while recording for dynamic content!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Video Marketing Strategy */}
      <Card className="bg-gradient-to-r from-green-900/50 to-teal-900/50 border-green-500">
        <CardHeader>
          <CardTitle className="text-xl text-green-300">🚀 Viral Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="font-bold text-purple-300">Content Ideas:</h4>
              <ul className="text-sm text-gray-300 mt-2 space-y-1">
                <li>• "Explore 4D geometry in your browser"</li>
                <li>• "Mathematical surfaces you've never seen"</li>
                <li>• "Watch parametric equations come to life"</li>
              </ul>
            </div>
            
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="font-bold text-yellow-300">Hashtags:</h4>
              <ul className="text-sm text-gray-300 mt-2 space-y-1">
                <li>• #mathematics #geometry</li>
                <li>• #3D #visualization #STEM</li>
                <li>• #4D #tesseract #education</li>
              </ul>
            </div>
            
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="font-bold text-cyan-300">Call to Action:</h4>
              <ul className="text-sm text-gray-300 mt-2 space-y-1">
                <li>• "Link in bio to try it yourself!"</li>
                <li>• "Follow for more mathematical content"</li>
                <li>• "Comment your favorite shape!"</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

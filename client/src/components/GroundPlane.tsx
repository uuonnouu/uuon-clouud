import * as THREE from 'three';

export default function GroundPlane() {
  return (
    <mesh 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, -3, 0]} 
      receiveShadow
      frustumCulled={false}
    >
      <planeGeometry args={[5000, 5000]} />
      <meshPhysicalMaterial 
        color={0x222222} 
        roughness={0.8} 
        metalness={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
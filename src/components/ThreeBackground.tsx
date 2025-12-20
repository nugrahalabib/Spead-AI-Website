'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Stars, Icosahedron, Environment } from '@react-three/drei';
import * as THREE from 'three';

const JellyObject = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<any>(null!);

  // Physics State
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Refs for physics calculations (to avoid re-renders)
  const rotation = useRef(new THREE.Vector3(0, 0, 0));
  const targetRotation = useRef(new THREE.Vector3(0, 0, 0));
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const lastMouse = useRef(new THREE.Vector2(0, 0));

  // Colors - Darker Palette
  const baseColor = new THREE.Color("#1e1b4b"); // Indigo 950 (Deep Dark)
  const hoverColor = new THREE.Color("#4338ca"); // Indigo 700 (Brighter but still deep)

  const { size, viewport } = useThree();

  // Global Pointer Up to reset state
  useEffect(() => {
    const handlePointerUp = () => {
      setIsDragging(false);
      document.body.style.cursor = 'auto';
      // Reset target to 0 when released (Snap Back)
      targetRotation.current.set(0, 0, 0);
    };
    window.addEventListener('pointerup', handlePointerUp);
    return () => window.removeEventListener('pointerup', handlePointerUp);
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // 1. Calculate Spring Physics for Rotation
    const stiffness = 120; // Tension
    const damping = 10;   // Friction

    const forceX = (targetRotation.current.x - rotation.current.x) * stiffness - velocity.current.x * damping;
    const forceY = (targetRotation.current.y - rotation.current.y) * stiffness - velocity.current.y * damping;

    const dt = Math.min(delta, 0.1);
    velocity.current.x += forceX * dt;
    velocity.current.y += forceY * dt;

    rotation.current.x += velocity.current.x * dt;
    rotation.current.y += velocity.current.y * dt;

    meshRef.current.rotation.x = rotation.current.x;
    meshRef.current.rotation.y = rotation.current.y;

    // 2. Idle Animation (Floating)
    if (!isDragging && velocity.current.length() < 0.1) {
      const t = state.clock.getElapsedTime();
      meshRef.current.rotation.x += Math.cos(t / 2) * 0.002;
      meshRef.current.rotation.y += Math.sin(t / 2) * 0.002;
    }

    // 3. Jelly Effect (Distortion based on Velocity)
    const speed = velocity.current.length();
    const targetDistort = THREE.MathUtils.clamp(speed * 0.1 + (hovered ? 0.6 : 0.3), 0, 1.2);

    if (materialRef.current) {
      materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, targetDistort, 0.1);
      materialRef.current.color.lerp(hovered ? hoverColor : baseColor, 0.1);
    }
  });

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    setIsDragging(true);
    document.body.style.cursor = 'grabbing';
    lastMouse.current.set(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: any) => {
    if (isDragging) {
      const deltaX = e.clientX - lastMouse.current.x;
      const deltaY = e.clientY - lastMouse.current.y;

      const sensitivity = 0.01;
      targetRotation.current.y += deltaX * sensitivity;
      targetRotation.current.x += deltaY * sensitivity;

      lastMouse.current.set(e.clientX, e.clientY);
    }
  };

  return (
    <group position={[2.5, 0, 0]}> {/* Shifted Left to 2.5 */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Icosahedron
          ref={meshRef}
          args={[1, 40]}
          scale={1.8} // Smaller Scale
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerOver={() => { document.body.style.cursor = 'grab'; setHovered(true); }}
          onPointerOut={() => { document.body.style.cursor = 'auto'; setHovered(false); }}
        >
          <MeshDistortMaterial
            ref={materialRef}
            attach="material"
            roughness={0.3}
            metalness={0.1}
            envMapIntensity={0.5} // Darker reflection
            color={baseColor}
            speed={5}
          />
        </Icosahedron>
      </Float>
    </group>
  );
};

const ThreeBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Environment preset="studio" />

        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#4f46e5" />

        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

        <JellyObject />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;

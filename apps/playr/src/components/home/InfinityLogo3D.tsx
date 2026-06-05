"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MathUtils } from "three";

export function InfinityLogo3D() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  
  const [hovered, setHovered] = useState(false);
  const targetRotation = useRef({ x: 0, y: 0 });

  // Handle mouse movement for rotation
  const handlePointerMove = (e: React.PointerEvent) => {
    // Normalize coordinates (-1 to 1) based on screen center
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    
    // Max rotation ±8 degrees (~0.14 radians)
    const maxRot = 0.14;
    targetRotation.current.x = y * maxRot;
    targetRotation.current.y = x * maxRot;
  };

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;

    // 1. Mouse Move Rotation (Lerp for smoothness)
    meshRef.current.rotation.x = MathUtils.lerp(meshRef.current.rotation.x, targetRotation.current.x, 0.05);
    meshRef.current.rotation.y = MathUtils.lerp(meshRef.current.rotation.y, targetRotation.current.y, 0.05);

    // 2. Idle Animation (Breathing/Floating)
    const elapsedTime = state.clock.getElapsedTime();
    // Float up and down slightly
    meshRef.current.position.y = Math.sin(elapsedTime * 0.5) * 0.2;
    
    // 3. Hover Effects
    // Intensify gold edge reflection (clearcoat roughness and metalness)
    const targetRoughness = hovered ? 0.2 : 0.4;
    const targetMetalness = hovered ? 0.9 : 0.6;
    const targetClearcoat = hovered ? 1.0 : 0.5;
    const targetEmissiveIntensity = hovered ? 0.2 : 0.0;
    
    materialRef.current.roughness = MathUtils.lerp(materialRef.current.roughness, targetRoughness, 0.1);
    materialRef.current.metalness = MathUtils.lerp(materialRef.current.metalness, targetMetalness, 0.1);
    materialRef.current.clearcoat = MathUtils.lerp(materialRef.current.clearcoat, targetClearcoat, 0.1);
    materialRef.current.emissiveIntensity = MathUtils.lerp(materialRef.current.emissiveIntensity, targetEmissiveIntensity, 0.1);

    // 4. Light Sweep Effect
    // Every 8 seconds, sweep a light across the object
    const sweepPhase = (elapsedTime % 8) / 8; // 0 to 1
    // Let's create a subtle shimmer by animating the envMapIntensity based on the sweep
    const shimmer = Math.exp(-Math.pow((sweepPhase - 0.5) * 10, 2)) * 2; // Peak at mid sweep
    materialRef.current.envMapIntensity = 1 + shimmer;
  });

  return (
    <group onPointerMove={handlePointerMove} onPointerOver={() => setHovered(true)} onPointerOut={() => {
      setHovered(false);
      targetRotation.current = { x: 0, y: 0 };
    }}>
      <mesh ref={meshRef} castShadow receiveShadow>
        {/* TorusKnot to simulate an infinity loop. 
            radius: 3, tube: 1, tubularSegments: 256, radialSegments: 64, p: 2, q: 3 (creates knot)
            Wait, p=1, q=2 or something similar makes an infinity shape. 
            p=2, q=3 is standard knot.
            To make an infinity sign (lemniscate), we can use a TorusKnot with p=1, q=2 or just 
            scale a standard torus knot. 
            Actually, a TorusKnotGeometry(radius, tube, tubularSegments, radialSegments, 2, 3) is a standard knot.
            TorusKnotGeometry(2, 0.6, 256, 64, 1, 2) looks like a Mobius/infinity loop. */}
        <torusKnotGeometry args={[2.5, 0.8, 256, 64, 1, 2]} />
        
        <meshPhysicalMaterial
          ref={materialRef}
          color="#1a1a1a" // Graphite body
          emissive="#d4af37" // Gold
          emissiveIntensity={0}
          roughness={0.4}
          metalness={0.6}
          clearcoat={0.5}
          clearcoatRoughness={0.1}
          envMapIntensity={1}
        />
      </mesh>
    </group>
  );
}

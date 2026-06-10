"use client";

import React, { useRef, useState, useMemo, Component, ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { MathUtils } from "three";

// Graceful Error Boundary to prevent the 404 from crashing the whole page
class LogoErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn("3D Logo asset is missing or failed to load:", error);
  }

  render() {
    if (this.state.hasError) {
      return null; // Render nothing if the asset is missing, per user instruction (no placeholders)
    }
    return this.props.children;
  }
}

function LogoModel() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Note: Place the actual PlayR 3D model at /public/models/playr_logo.glb
  const { scene } = useGLTF("/models/playr_logo.glb", true);

  const [hovered, setHovered] = useState(false);
  const targetRotation = useRef({ x: 0, y: 0 });

  // Clone the scene and apply the premium PlayR material to all meshes
  const premiumScene = useMemo(() => {
    const clonedScene = scene.clone();
    
    // Create the premium PlayR material
    const playrMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#1a1a1a"), // Graphite black
      emissive: new THREE.Color("#d4af37"), // Gold accents
      emissiveIntensity: 0.0,
      roughness: 0.2,
      metalness: 0.8,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1.0,
    });

    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = playrMaterial;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    
    return clonedScene;
  }, [scene]);

  // Handle mouse movement for rotation
  const handlePointerMove = (e: React.PointerEvent) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    
    // Max rotation ±6 degrees (~0.10 radians)
    const maxRot = 0.10;
    targetRotation.current.x = y * maxRot;
    targetRotation.current.y = x * maxRot;
  };

  useFrame((state) => {
    if (!groupRef.current) return;

    // 1. Mouse Move Rotation (Lerp)
    groupRef.current.rotation.x = MathUtils.lerp(groupRef.current.rotation.x, targetRotation.current.x, 0.05);
    groupRef.current.rotation.y = MathUtils.lerp(groupRef.current.rotation.y, targetRotation.current.y, 0.05);

    // 2. Idle Animation (Floating / Breathing)
    const elapsedTime = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(elapsedTime * 0.5) * 0.15; // Very subtle float
    
    // 3. Hover Effects (Scale and Lighting)
    const targetScale = hovered ? 1.03 : 1.0;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

    // Dynamic Material updates
    premiumScene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshPhysicalMaterial) {
        const targetEmissiveIntensity = hovered ? 0.3 : 0.0;
        const targetEnvMapIntensity = hovered ? 1.5 : 1.0;
        
        child.material.emissiveIntensity = MathUtils.lerp(child.material.emissiveIntensity, targetEmissiveIntensity, 0.1);
        child.material.envMapIntensity = MathUtils.lerp(child.material.envMapIntensity, targetEnvMapIntensity, 0.1);

        // 4. Light Sweep Effect (Every 8 seconds)
        const sweepPhase = (elapsedTime % 8) / 8; // 0 to 1
        const shimmer = Math.exp(-Math.pow((sweepPhase - 0.5) * 15, 2)) * 1.5;
        child.material.envMapIntensity += shimmer; // Add sweep reflection
      }
    });
  });

  return (
    <group 
      ref={groupRef}
      onPointerMove={handlePointerMove} 
      onPointerOver={() => setHovered(true)} 
      onPointerOut={() => {
        setHovered(false);
        targetRotation.current = { x: 0, y: 0 };
      }}
    >
      <primitive object={premiumScene} />
    </group>
  );
}

export function PlayRLogo3D() {
  return (
    <LogoErrorBoundary>
      <LogoModel />
    </LogoErrorBoundary>
  );
}

// Preload the model (wrapped in try-catch to prevent 404 crash during SSR)
try {
  useGLTF.preload("/models/playr_logo.glb");
} catch (e) {
  console.warn("Preload failed for playr_logo.glb");
}

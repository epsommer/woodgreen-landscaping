"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";

export function LoadingPlant() {
  const stemRef = useRef<Mesh>(null);
  const leafRef = useRef<Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (stemRef.current) {
      stemRef.current.scale.y = Math.sin(t * 2) * 0.5 + 1;
    }
    if (leafRef.current) {
      leafRef.current.rotation.z = Math.sin(t * 3) * 0.3;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Stem */}
      <mesh ref={stemRef} position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>

      {/* Leaf */}
      <mesh ref={leafRef} position={[0, 1, 0]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial color="#4ade80" />
      </mesh>

      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
    </group>
  );
}

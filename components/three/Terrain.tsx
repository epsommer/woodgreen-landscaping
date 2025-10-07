"use client";

import { useRef, useMemo } from "react";
import { Mesh, Color, PlaneGeometry } from "three";
import { useFrame } from "@react-three/fiber";

interface TerrainProps {
  grassColor: Color;
}

export function Terrain({ grassColor }: TerrainProps) {
  const meshRef = useRef<Mesh>(null);

  // Create a wavy terrain using vertex displacement
  const geometry = useMemo(() => {
    const geo = new PlaneGeometry(40, 40, 50, 50);
    const positions = geo.attributes.position;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const wave = Math.sin(x * 0.3) * Math.cos(y * 0.3) * 0.5;
      positions.setZ(i, wave);
    }

    positions.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Animate grass waving in the wind - only in the distance
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      const positions = geometry.attributes.position;

      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);

        // Calculate distance from center (camera is at [0, 5, 15] looking at origin)
        const distanceFromCenter = Math.sqrt(x * x + y * y);

        // Only animate terrain that's far from center (distance > 10)
        // Gradually increase animation strength with distance
        const animationStrength = Math.max(0, (distanceFromCenter - 10) / 10);

        // Wave animation only affects distant terrain
        const wave =
          Math.sin(x * 0.3 + time * 0.3) * Math.cos(y * 0.3 + time * 0.15) * 0.15 * animationStrength;
        positions.setZ(i, wave);
      }

      positions.needsUpdate = true;
    }
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      receiveShadow
      geometry={geometry}
    >
      <meshStandardMaterial
        color={grassColor}
        roughness={0.8}
        metalness={0.2}
      />
    </mesh>
  );
}

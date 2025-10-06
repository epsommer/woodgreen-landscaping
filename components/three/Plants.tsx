"use client";

import { useRef, useMemo } from "react";
import { InstancedMesh, Object3D, Color } from "three";
import { useFrame } from "@react-three/fiber";

interface PlantsProps {
  season: string;
  windTime: number;
}

const PLANT_COUNT = 50;

export function Plants({ season, windTime }: PlantsProps) {
  const plantInstanceRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);

  // Season-based plant colors
  const plantColor = useMemo(() => {
    const colors = {
      spring: "#FFB6C1",
      summer: "#FF69B4",
      fall: "#FFA500",
      winter: "#E6E6FA",
    };
    return new Color(colors[season as keyof typeof colors] || "#FF69B4");
  }, [season]);

  // Generate plant positions with phase offsets
  const plantPositions = useMemo(() => {
    const positions: Array<{
      pos: [number, number, number];
      phaseOffset: number;
      scale: number;
    }> = [];
    for (let i = 0; i < PLANT_COUNT; i++) {
      const x = (Math.random() - 0.5) * 30;
      const z = (Math.random() - 0.5) * 30;
      // Keep plants away from center
      if (Math.sqrt(x * x + z * z) > 3) {
        positions.push({
          pos: [x, 0, z],
          phaseOffset: Math.random() * Math.PI * 2,
          scale: 0.3 + Math.random() * 0.3,
        });
      }
    }
    return positions;
  }, []);

  // Initialize and animate instances
  useFrame((state) => {
    if (!plantInstanceRef.current) return;

    // Initialize once
    if (!plantInstanceRef.current.userData.initialized) {
      plantPositions.forEach((plant, i) => {
        dummy.position.set(plant.pos[0], plant.pos[1] + 0.3, plant.pos[2]);
        dummy.scale.setScalar(plant.scale);
        dummy.rotation.y = Math.random() * Math.PI * 2;
        dummy.updateMatrix();
        plantInstanceRef.current?.setMatrixAt(i, dummy.matrix);
      });

      plantInstanceRef.current.instanceMatrix.needsUpdate = true;
      plantInstanceRef.current.userData.initialized = true;
      return;
    }

    // Smooth, gentle swaying animation
    const time = state.clock.getElapsedTime();

    // Gentle wind parameters for plants
    const windSpeed = 0.5;
    const swayStrength = 0.025; // Very subtle movement

    plantPositions.forEach((plant, i) => {
      const pos = plant.pos;
      const phase = plant.phaseOffset;

      // Gentle swaying motion
      const sway = Math.sin(time * windSpeed + phase) * swayStrength;

      dummy.position.set(pos[0], pos[1] + 0.3, pos[2]);
      dummy.scale.setScalar(plant.scale);
      dummy.rotation.y = Math.random() * Math.PI * 2;
      dummy.rotation.z = sway;
      dummy.updateMatrix();
      plantInstanceRef.current?.setMatrixAt(i, dummy.matrix);
    });

    plantInstanceRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={plantInstanceRef}
      args={[undefined, undefined, PLANT_COUNT]}
      castShadow
    >
      <sphereGeometry args={[0.5, 8, 8]} />
      <meshStandardMaterial color={plantColor} roughness={0.6} />
    </instancedMesh>
  );
}

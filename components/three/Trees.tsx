"use client";

import { useRef, useMemo } from "react";
import { InstancedMesh, Object3D, Color } from "three";
import { useFrame } from "@react-three/fiber";

interface TreesProps {
  season: string;
}

const TREE_COUNT = 15;

export function Trees({ season }: TreesProps) {
  const trunkInstanceRef = useRef<InstancedMesh>(null);
  const foliageInstanceRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);

  // Season-based foliage colors
  const foliageColor = useMemo(() => {
    const colors = {
      spring: "#90EE90",
      summer: "#228B22",
      fall: "#D2691E",
      winter: "#FFFFFF",
    };
    return new Color(colors[season as keyof typeof colors] || "#228B22");
  }, [season]);

  // Generate tree positions with randomized phase offsets for natural staggering
  const treePositions = useMemo(() => {
    const positions: Array<{
      pos: [number, number, number];
      phaseOffset: number;
      scale: number;
    }> = [];
    for (let i = 0; i < TREE_COUNT; i++) {
      const angle = (i / TREE_COUNT) * Math.PI * 2;
      // Place trees only in midground and background (12-18 units from center)
      const radius = 12 + Math.random() * 6;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = 0;
      positions.push({
        pos: [x, y, z],
        phaseOffset: Math.random() * Math.PI * 2, // Random phase for staggered animation
        scale: 1.0 + Math.random() * 0.4,
      });
    }
    return positions;
  }, []);

  // Initialize and animate instances
  useFrame((state) => {
    if (!trunkInstanceRef.current || !foliageInstanceRef.current) return;

    // Initialize once
    if (!trunkInstanceRef.current.userData.initialized) {
      treePositions.forEach((tree, i) => {
        // Trunk - cylinder height is 3, so position at y=1.5 to have base at ground (y=0)
        const trunkHeight = 3;
        dummy.position.set(tree.pos[0], trunkHeight / 2, tree.pos[2]);
        dummy.scale.set(1, 1, 1);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        trunkInstanceRef.current?.setMatrixAt(i, dummy.matrix);

        // Foliage - position at top of trunk
        dummy.position.set(tree.pos[0], trunkHeight + 1.5, tree.pos[2]);
        dummy.scale.setScalar(tree.scale);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        foliageInstanceRef.current?.setMatrixAt(i, dummy.matrix);
      });

      trunkInstanceRef.current.instanceMatrix.needsUpdate = true;
      foliageInstanceRef.current.instanceMatrix.needsUpdate = true;
      trunkInstanceRef.current.userData.initialized = true;
      return;
    }

    // Smooth, gentle wind animation
    const time = state.clock.getElapsedTime();

    // Wind parameters for gentle, natural movement
    const windSpeed = 0.4; // Slower wind
    const windStrength = 0.015; // Much subtler movement (reduced from 0.05)
    const rotationAmount = 0.08; // Gentle rotation (reduced from 0.5)

    const trunkHeight = 3;

    treePositions.forEach((tree, i) => {
      const pos = tree.pos;
      const phase = tree.phaseOffset;

      // Combine multiple sine waves at different frequencies for natural movement
      const slowWave = Math.sin(time * windSpeed + phase) * windStrength;
      const mediumWave = Math.sin(time * windSpeed * 1.3 + phase * 0.7) * windStrength * 0.6;
      const fastWave = Math.sin(time * windSpeed * 2.1 + phase * 1.3) * windStrength * 0.3;

      // Combine waves for organic motion
      const swayX = slowWave + mediumWave * 0.5;
      const swayZ = Math.cos(time * windSpeed * 0.8 + phase) * windStrength + fastWave * 0.5;

      // Add subtle vertical bobbing motion
      const bobbingSpeed = 0.5; // Slow rhythmic bobbing
      const bobbingAmount = 0.08; // Subtle up/down movement
      const bobbing = Math.sin(time * bobbingSpeed + phase) * bobbingAmount;

      // Sway foliage with combined wave motion and vertical bobbing
      const foliageY = trunkHeight + 1.5 + bobbing;
      dummy.position.set(pos[0] + swayX, foliageY, pos[2] + swayZ);
      dummy.scale.setScalar(tree.scale);

      // Gentle rotation that follows the sway
      dummy.rotation.z = swayX * rotationAmount;
      dummy.rotation.x = swayZ * rotationAmount * 0.5;

      dummy.updateMatrix();
      foliageInstanceRef.current?.setMatrixAt(i, dummy.matrix);
    });

    foliageInstanceRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* Tree trunks */}
      <instancedMesh
        ref={trunkInstanceRef}
        args={[undefined, undefined, TREE_COUNT]}
        castShadow
      >
        <cylinderGeometry args={[0.3, 0.4, 3, 8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </instancedMesh>

      {/* Tree foliage */}
      <instancedMesh
        ref={foliageInstanceRef}
        args={[undefined, undefined, TREE_COUNT]}
        castShadow
        receiveShadow
      >
        <coneGeometry args={[1.5, 3, 8]} />
        <meshStandardMaterial color={foliageColor} roughness={0.7} />
      </instancedMesh>
    </group>
  );
}

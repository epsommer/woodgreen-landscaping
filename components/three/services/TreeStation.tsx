"use client";

import { useRef, useMemo, PointerEvent as ReactPointerEvent } from "react";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ServiceInfo, StationComponentProps } from "./ServiceStationsScene";
import { InfoCard } from "./InfoCard";
import { useStationInteraction } from "./useStationInteraction";

export function TreeStation({
  active = false,
  isMobile = false,
  isHovered = false,
  isSelected = false,
  onHover,
  onClick,
  serviceInfo,
}: StationComponentProps) {
  const treeRef = useRef<THREE.Group>(null);
  const leavesRef = useRef<THREE.InstancedMesh>(null);
  const fallingLeavesRef = useRef<THREE.Points>(null);
  const rootsRef = useRef<THREE.Group>(null);

  const treeAge = useRef(0.5); // 0 = sapling, 1 = mature
  const health = useRef(0.7); // 0 = sick, 1 = healthy
  const season = useRef(0); // 0-3 for spring/summer/fall/winter

  const interactionHandlers = useStationInteraction({ onHover, onClick });

  // Create leaves as instanced mesh
  const leafCount = isMobile ? 150 : 400;
  const leafGeometry = useMemo(() => {
    const geom = new THREE.SphereGeometry(0.15, 6, 6);
    return geom;
  }, []);

  const leafPositions = useMemo(() => {
    const positions: THREE.Vector3[] = [];

    // Create leaf cluster positions in a spherical canopy
    for (let i = 0; i < leafCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.6; // Top hemisphere
      const radius = 1.5 + Math.random() * 0.8;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = 7 + radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);

      positions.push(new THREE.Vector3(x, y, z));
    }

    return positions;
  }, [leafCount]);

  // Falling leaves particles
  const fallingLeafCount = isMobile ? 25 : 60;
  const fallingLeafGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(fallingLeafCount * 3);
    const velocities = new Float32Array(fallingLeafCount * 3);
    const rotations = new Float32Array(fallingLeafCount);

    for (let i = 0; i < fallingLeafCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 1] = 7.5 + Math.random() * 2.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;

      velocities[i * 3] = (Math.random() - 0.5) * 0.3;
      velocities[i * 3 + 1] = -Math.random() * 0.5 - 0.2;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.3;

      rotations[i] = Math.random() * Math.PI * 2;
    }

    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));
    geom.setAttribute("rotation", new THREE.BufferAttribute(rotations, 1));

    return geom;
  }, [fallingLeafCount]);

  // Seasonal colors
  const getSeasonalColor = (seasonIndex: number, healthValue: number) => {
    const colors = [
      new THREE.Color(0x86efac), // Spring - light green
      new THREE.Color(0x22c55e), // Summer - vibrant green
      new THREE.Color(0xea580c), // Fall - orange
      new THREE.Color(0x000000), // Winter - bare (transparent/hidden)
    ];

    const sickColor = new THREE.Color(0x78350f); // Brown for sick tree
    const seasonColor = colors[Math.floor(seasonIndex) % 4];

    return sickColor.clone().lerp(seasonColor, healthValue);
  };

  useFrame((state, delta) => {
    if (!active) return;

    // Slowly cycle through seasons
    season.current = (season.current + delta * 0.1) % 4;

    // Animate tree growth
    if (treeRef.current) {
      const targetScale = 0.3 + treeAge.current * 0.7;
      treeRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.02,
      );
    }

    // Update leaves
    if (leavesRef.current) {
      const dummy = new THREE.Object3D();
      const leafColor = getSeasonalColor(season.current, health.current);
      const isWinter = Math.floor(season.current) === 3;

      leafPositions.forEach((pos, i) => {
        const sway = Math.sin(state.clock.elapsedTime * 2 + i * 0.1) * 0.05;

        dummy.position.copy(pos);
        dummy.position.x += sway;
        dummy.rotation.z = sway * 2;

        // Hide leaves in winter
        const scale = isWinter ? 0 : 1;
        dummy.scale.set(scale, scale, scale);

        dummy.updateMatrix();
        leavesRef.current!.setMatrixAt(i, dummy.matrix);
      });

      leavesRef.current.instanceMatrix.needsUpdate = true;
      (leavesRef.current.material as THREE.MeshStandardMaterial).color.copy(
        leafColor,
      );
    }

    // Animate falling leaves (mainly in fall)
    if (fallingLeavesRef.current) {
      const positions = fallingLeafGeometry.attributes.position
        .array as Float32Array;
      const velocities = fallingLeafGeometry.attributes.velocity
        .array as Float32Array;
      const rotations = fallingLeafGeometry.attributes.rotation
        .array as Float32Array;

      const isFall = Math.floor(season.current) === 2;
      const fallRate = isFall ? 1 : 0.2;

      for (let i = 0; i < fallingLeafCount; i++) {
        positions[i * 3] += velocities[i * 3] * delta * fallRate;
        positions[i * 3 + 1] += velocities[i * 3 + 1] * delta * fallRate;
        positions[i * 3 + 2] += velocities[i * 3 + 2] * delta * fallRate;

        rotations[i] += delta * 2;

        // Reset leaf when it hits ground
        if (positions[i * 3 + 1] < 0) {
          positions[i * 3] = (Math.random() - 0.5) * 4;
          positions[i * 3 + 1] = 9 + Math.random() * 2;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
        }
      }

      fallingLeafGeometry.attributes.position.needsUpdate = true;
      fallingLeafGeometry.attributes.rotation.needsUpdate = true;
    }

    // Pulse roots visibility
    if (rootsRef.current) {
      const rootOpacity = Math.sin(state.clock.elapsedTime * 0.5) * 0.2 + 0.3;
      rootsRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          (child.material as THREE.MeshStandardMaterial).opacity = rootOpacity;
        }
      });
    }
  });

  return (
    <group position={[-10, 0, 10]}>
      {/* Invisible larger hitbox for reliable hover detection */}
      <mesh position={[0, 4, 0]} {...interactionHandlers}>
        <cylinderGeometry args={[4, 4, 8, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      {/* Ground */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
        receiveShadow
      >
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial color="#8b6f47" />
      </mesh>

      {/* Tree group */}
      <group ref={treeRef} position={[0, 0, 2.5]}>
        {/* Trunk */}
        <mesh position={[0, 3.5, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.25, 7, 12]} />
          <meshStandardMaterial color="#654321" roughness={0.9} />
        </mesh>

        {/* Main branches */}
        <mesh
          position={[0.5, 6.5, 0]}
          rotation={[0, 0, Math.PI / 4]}
          castShadow
        >
          <cylinderGeometry args={[0.08, 0.12, 1.5, 8]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        <mesh
          position={[-0.5, 6.5, 0]}
          rotation={[0, 0, -Math.PI / 4]}
          castShadow
        >
          <cylinderGeometry args={[0.08, 0.12, 1.5, 8]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        <mesh
          position={[0, 6.5, 0.5]}
          rotation={[Math.PI / 4, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.08, 0.12, 1.5, 8]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        <mesh
          position={[0, 6.5, -0.5]}
          rotation={[-Math.PI / 4, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.08, 0.12, 1.5, 8]} />
          <meshStandardMaterial color="#654321" />
        </mesh>

        {/* Leaves (instanced) */}
        <instancedMesh
          ref={leavesRef}
          args={[leafGeometry, undefined, leafCount]}
          castShadow
        >
          <meshStandardMaterial color="#22c55e" />
        </instancedMesh>
      </group>

      {/* Root system (semi-transparent) */}
      <group ref={rootsRef} position={[0, -0.5, 0]}>
        <mesh rotation={[0, 0, Math.PI / 6]}>
          <cylinderGeometry args={[0.08, 0.05, 1, 8]} />
          <meshStandardMaterial color="#654321" transparent opacity={0.3} />
        </mesh>
        <mesh rotation={[0, 0, -Math.PI / 6]}>
          <cylinderGeometry args={[0.08, 0.05, 1, 8]} />
          <meshStandardMaterial color="#654321" transparent opacity={0.3} />
        </mesh>
        <mesh rotation={[Math.PI / 6, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.05, 1, 8]} />
          <meshStandardMaterial color="#654321" transparent opacity={0.3} />
        </mesh>
        <mesh rotation={[-Math.PI / 6, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.05, 1, 8]} />
          <meshStandardMaterial color="#654321" transparent opacity={0.3} />
        </mesh>
      </group>

      {/* Falling leaves particles */}
      <points ref={fallingLeavesRef} geometry={fallingLeafGeometry}>
        <pointsMaterial size={0.15} color="#ea580c" transparent opacity={0.8} />
      </points>

      {/* Info Cards - conditionally rendered */}
      {serviceInfo && (isHovered || isSelected) && (
        <InfoCard serviceInfo={serviceInfo} isSelected={isSelected} />
      )}
    </group>
  );
}

"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  position: [number, number, number];
  islandType: "garden" | "fountain" | "tree" | "greenhouse";
  color: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "John Doe",
    role: "Founder & Lead Designer",
    bio: "25+ years creating stunning landscapes",
    position: [-4, 0, -2],
    islandType: "garden",
    color: "#ff6b9d",
  },
  {
    name: "Jane Smith",
    role: "Head of Horticulture",
    bio: "Certified master gardener & plant specialist",
    position: [4, 0, -2],
    islandType: "greenhouse",
    color: "#4ade80",
  },
  {
    name: "Mike Johnson",
    role: "Irrigation Specialist",
    bio: "Expert in sustainable water management",
    position: [-4, 0, 2],
    islandType: "fountain",
    color: "#60a5fa",
  },
  {
    name: "Emily Brown",
    role: "Customer Relations",
    bio: "Dedicated to exceeding client expectations",
    position: [4, 0, 2],
    islandType: "tree",
    color: "#CEFF65",
  },
];

interface IslandProps {
  member: TeamMember;
  isHovered: boolean;
  isSelected: boolean;
  onHover: (hovering: boolean) => void;
  onClick: () => void;
}

function Island({ member, isHovered, isSelected, onHover, onClick }: IslandProps) {
  const islandRef = useRef<THREE.Group>(null);
  const targetY = isHovered || isSelected ? 0.8 : 0;

  useFrame((state, delta) => {
    if (islandRef.current) {
      // Smooth height transition
      islandRef.current.position.y += (targetY - islandRef.current.position.y) * delta * 5;

      // Float animation
      const float = Math.sin(state.clock.elapsedTime * 2 + member.position[0]) * 0.1;
      islandRef.current.position.y += float * delta;

      // Gentle rotation
      islandRef.current.rotation.y += delta * 0.2;
    }
  });

  const renderIslandDecoration = () => {
    switch (member.islandType) {
      case "garden":
        return (
          <>
            {/* Flower beds */}
            {[...Array(5)].map((_, i) => {
              const angle = (i / 5) * Math.PI * 2;
              const radius = 0.4;
              return (
                <mesh
                  key={i}
                  position={[Math.cos(angle) * radius, 0.11, Math.sin(angle) * radius]}
                >
                  <sphereGeometry args={[0.08, 8, 8]} />
                  <meshStandardMaterial color="#ff6b9d" />
                </mesh>
              );
            })}
          </>
        );

      case "fountain":
        return (
          <>
            {/* Fountain base */}
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.2, 0.25, 0.3, 8]} />
              <meshStandardMaterial color="#60a5fa" />
            </mesh>
            {/* Water droplets */}
            {[...Array(8)].map((_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              const time = Date.now() * 0.001 + i;
              const height = Math.sin(time) * 0.3 + 0.4;
              return (
                <mesh
                  key={i}
                  position={[Math.cos(angle) * 0.15, height, Math.sin(angle) * 0.15]}
                >
                  <sphereGeometry args={[0.04, 6, 6]} />
                  <meshStandardMaterial color="#60a5fa" transparent opacity={0.8} />
                </mesh>
              );
            })}
          </>
        );

      case "tree":
        return (
          <>
            {/* Tree trunk */}
            <mesh position={[0, 0.25, 0]}>
              <cylinderGeometry args={[0.06, 0.1, 0.5, 8]} />
              <meshStandardMaterial color="#654321" />
            </mesh>
            {/* Tree canopy */}
            <mesh position={[0, 0.6, 0]}>
              <sphereGeometry args={[0.25, 8, 8]} />
              <meshStandardMaterial color="#CEFF65" />
            </mesh>
          </>
        );

      case "greenhouse":
        return (
          <>
            {/* Greenhouse structure */}
            <mesh position={[0, 0.2, 0]}>
              <boxGeometry args={[0.4, 0.4, 0.3]} />
              <meshStandardMaterial color="#4ade80" transparent opacity={0.6} wireframe />
            </mesh>
            {/* Plants inside */}
            {[[-0.1, 0.1, 0], [0.1, 0.1, 0], [0, 0.1, -0.1]].map((pos, i) => (
              <mesh key={i} position={pos as [number, number, number]}>
                <coneGeometry args={[0.05, 0.15, 6]} />
                <meshStandardMaterial color="#22c55e" />
              </mesh>
            ))}
          </>
        );
    }
  };

  return (
    <group
      ref={islandRef}
      position={member.position}
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
      onClick={onClick}
    >
      {/* Island base */}
      <mesh castShadow>
        <cylinderGeometry args={[0.8, 0.9, 0.2, 16]} />
        <meshStandardMaterial color="#3d2817" />
      </mesh>

      {/* Grass top */}
      <mesh position={[0, 0.11, 0]}>
        <cylinderGeometry args={[0.78, 0.78, 0.02, 16]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>

      {/* Island decoration */}
      {renderIslandDecoration()}

      {/* Glow ring */}
      {(isHovered || isSelected) && (
        <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.95, 1.1, 32]} />
          <meshBasicMaterial color={member.color} transparent opacity={0.6} />
        </mesh>
      )}

      {/* Name label */}
      {(isHovered || isSelected) && (
        <group position={[0, 1, 0]}>
          <Text fontSize={0.15} color="white" anchorY="bottom">
            {member.name}
          </Text>
          <Text fontSize={0.1} color="#cccccc" position={[0, -0.2, 0]} anchorY="top">
            {member.role}
          </Text>
          {isSelected && (
            <Text
              fontSize={0.08}
              color="#aaaaaa"
              position={[0, -0.4, 0]}
              anchorY="top"
              maxWidth={2}
              textAlign="center"
            >
              {member.bio}
            </Text>
          )}
        </group>
      )}
    </group>
  );
}

export function TeamIslands() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <group>
      {/* Ambient particles */}
      {[...Array(30)].map((_, i) => {
        const x = (Math.random() - 0.5) * 12;
        const y = Math.random() * 3;
        const z = (Math.random() - 0.5) * 8;
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.03, 6, 6]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
          </mesh>
        );
      })}

      {/* Team islands */}
      {teamMembers.map((member, index) => (
        <Island
          key={index}
          member={member}
          isHovered={hoveredIndex === index}
          isSelected={selectedIndex === index}
          onHover={(hovering) => setHoveredIndex(hovering ? index : null)}
          onClick={() => setSelectedIndex(selectedIndex === index ? null : index)}
        />
      ))}

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0f1810" />
      </mesh>
    </group>
  );
}

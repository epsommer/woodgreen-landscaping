"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";

interface Capability {
  name: string;
  title: string;
  description: string;
  position: [number, number, number];
  type: "design" | "maintenance" | "planting" | "hardscape" | "construction";
  color: string;
  comingSoon?: boolean;
}

const capabilities: Capability[] = [
  {
    name: "Custom Design",
    title: "Landscape Design",
    description: "Graphic design background brings artistic vision to every project",
    position: [-5, 0, -2],
    type: "design",
    color: "#CEFF65",
  },
  {
    name: "Maintenance",
    title: "Zero-Emission Care",
    description: "Professional DeWalt 60V battery equipment - Gallery-worthy results, neighbor-friendly operation",
    position: [5, 0, -2],
    type: "maintenance",
    color: "#4ade80",
  },
  {
    name: "Planting",
    title: "Expert Installation",
    description: "From concept to completion, I handle every step",
    position: [-5, 0, 2],
    type: "planting",
    color: "#22c55e",
  },
  {
    name: "Hardscapes",
    title: "Coming Soon",
    description: "Patios, walkways, and retaining walls—expanding capabilities",
    position: [0, 0, 0],
    type: "hardscape",
    color: "#60a5fa",
    comingSoon: true,
  },
  {
    name: "Construction",
    title: "Full Build Execution",
    description: "Complete landscape construction from ground up",
    position: [5, 0, 2],
    type: "construction",
    color: "#ff6b9d",
  },
];

interface CapabilityIslandProps {
  capability: Capability;
  isHovered: boolean;
  isSelected: boolean;
  onHover: (hovering: boolean) => void;
  onClick: () => void;
}

function CapabilityIsland({ capability, isHovered, isSelected, onHover, onClick }: CapabilityIslandProps) {
  const islandRef = useRef<THREE.Group>(null);
  const iconRef = useRef<THREE.Group>(null);
  const pointerDownPos = useRef({ x: 0, y: 0 });
  const targetY = isHovered || isSelected ? 0.3 : 0; // Levitation height for icon only

  const handlePointerDown = (e: any) => {
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleClick = (e: any) => {
    // Only trigger click if pointer hasn't moved much (not a drag)
    const dx = e.clientX - pointerDownPos.current.x;
    const dy = e.clientY - pointerDownPos.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 5) { // Less than 5 pixels = click, not drag
      onClick();
    }
  };

  useFrame((state, delta) => {
    if (iconRef.current) {
      // Smooth height transition for icon only
      iconRef.current.position.y += (targetY - iconRef.current.position.y) * delta * 5;

      // Float animation for icon only
      const float = Math.sin(state.clock.elapsedTime * 2 + capability.position[0]) * 0.1;
      iconRef.current.position.y += float * delta;
    }

    if (islandRef.current) {
      // Gentle rotation
      islandRef.current.rotation.y += delta * 0.2;
    }
  });

  const renderCapabilityIcon = () => {
    switch (capability.type) {
      case "design":
        return (
          <>
            {/* Drawing tablet */}
            <mesh position={[0, 0.15, 0]} rotation={[-Math.PI / 6, 0, 0]}>
              <boxGeometry args={[0.6, 0.02, 0.8]} />
              <meshStandardMaterial color="#333333" />
            </mesh>
            {/* Sketch on tablet */}
            <mesh position={[0, 0.16, 0]} rotation={[-Math.PI / 6, 0, 0]}>
              <planeGeometry args={[0.5, 0.7]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            {/* Pencil */}
            <mesh position={[0.3, 0.2, 0]} rotation={[0, 0, -Math.PI / 4]}>
              <cylinderGeometry args={[0.02, 0.02, 0.4, 6]} />
              <meshStandardMaterial color="#CEFF65" />
            </mesh>
            {/* Color palette orbs */}
            {[[-0.2, 0, 0], [0, 0, 0.2], [0.2, 0, 0]].map((pos, i) => (
              <mesh key={i} position={[pos[0], 0.3, pos[2]]}>
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshStandardMaterial color={i === 0 ? "#22c55e" : i === 1 ? "#CEFF65" : "#4ade80"} />
              </mesh>
            ))}
          </>
        );

      case "maintenance":
        return (
          <>
            {/* Battery mower - DeWalt colors (yellow/black) */}
            <mesh position={[0, 0.2, 0]}>
              <boxGeometry args={[0.4, 0.25, 0.5]} />
              <meshStandardMaterial color="#FFDE00" /> {/* DeWalt yellow */}
            </mesh>
            {/* Black accents */}
            <mesh position={[0, 0.28, 0]}>
              <boxGeometry args={[0.38, 0.08, 0.48]} />
              <meshStandardMaterial color="#000000" />
            </mesh>
            {/* Wheels */}
            <mesh position={[0.15, 0.1, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
              <meshStandardMaterial color="#222222" />
            </mesh>
            <mesh position={[-0.15, 0.1, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
              <meshStandardMaterial color="#222222" />
            </mesh>

            {/* Battery pack (glowing green) */}
            <mesh position={[0, 0.35, -0.15]}>
              <boxGeometry args={[0.15, 0.12, 0.08]} />
              <meshStandardMaterial
                color="#4ade80"
                emissive="#4ade80"
                emissiveIntensity={0.5}
              />
            </mesh>

            {/* "60V" text indicator */}
            <mesh position={[0, 0.36, -0.1]}>
              <boxGeometry args={[0.08, 0.04, 0.01]} />
              <meshStandardMaterial color="#FFFFFF" />
            </mesh>

            {/* Green energy particles around equipment */}
            {[...Array(12)].map((_, i) => {
              const angle = (i / 12) * Math.PI * 2;
              const radius = 0.5;
              return (
                <mesh key={i} position={[Math.cos(angle) * radius, 0.2 + Math.sin(i) * 0.1, Math.sin(angle) * radius]}>
                  <sphereGeometry args={[0.02, 6, 6]} />
                  <meshBasicMaterial
                    color="#4ade80"
                    transparent
                    opacity={0.6}
                  />
                </mesh>
              );
            })}

            {/* "0 Emissions" indicator */}
            <mesh position={[0, 0.5, 0]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshBasicMaterial
                color="#22c55e"
                transparent
                opacity={0.3}
              />
            </mesh>
          </>
        );

      case "planting":
        return (
          <>
            {/* Flower pot */}
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.15, 0.2, 0.3, 8]} />
              <meshStandardMaterial color="#a0522d" />
            </mesh>
            {/* Flowers */}
            {[[-0.15, 0, 0], [0, 0, 0.15], [0.15, 0, -0.1]].map((pos, i) => (
              <group key={i} position={[pos[0], 0.3, pos[2]]}>
                <mesh position={[0, 0.1, 0]}>
                  <cylinderGeometry args={[0.02, 0.02, 0.2, 6]} />
                  <meshStandardMaterial color="#22c55e" />
                </mesh>
                <mesh position={[0, 0.25, 0]}>
                  <sphereGeometry args={[0.06, 8, 8]} />
                  <meshStandardMaterial color={["#ff6b9d", "#CEFF65", "#60a5fa"][i]} />
                </mesh>
              </group>
            ))}
          </>
        );

      case "hardscape":
        return (
          <>
            {/* Stone pavers stacked */}
            {[0, 0.08, 0.16].map((y, i) => (
              <mesh key={i} position={[0, y + 0.1, 0]} rotation={[0, i * (Math.PI / 6), 0]}>
                <boxGeometry args={[0.4, 0.06, 0.4]} />
                <meshStandardMaterial color={["#808080", "#999999", "#707070"][i]} />
              </mesh>
            ))}
            {/* "Coming Soon" badge */}
            {capability.comingSoon && (
              <mesh position={[0, 0.5, 0]}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={0.5} />
              </mesh>
            )}
          </>
        );

      case "construction":
        return (
          <>
            {/* Shovel */}
            <mesh position={[-0.2, 0.3, 0]} rotation={[0, 0, -Math.PI / 6]}>
              <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
              <meshStandardMaterial color="#654321" />
            </mesh>
            <mesh position={[-0.3, 0.05, 0]} rotation={[0, 0, -Math.PI / 6]}>
              <boxGeometry args={[0.15, 0.02, 0.2]} />
              <meshStandardMaterial color="#888888" />
            </mesh>
            {/* Hammer */}
            <mesh position={[0.2, 0.3, 0]} rotation={[0, 0, Math.PI / 4]}>
              <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
              <meshStandardMaterial color="#654321" />
            </mesh>
            <mesh position={[0.3, 0.48, 0]} rotation={[0, 0, Math.PI / 4]}>
              <boxGeometry args={[0.08, 0.15, 0.06]} />
              <meshStandardMaterial color="#888888" />
            </mesh>
            {/* Blueprint */}
            <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2 + 0.2, 0, 0]}>
              <planeGeometry args={[0.5, 0.4]} />
              <meshStandardMaterial color="#6ba3d4" />
            </mesh>
          </>
        );
    }
  };

  return (
    <group ref={islandRef} position={capability.position}>
      {/* Invisible larger hitbox for reliable hover detection */}
      <mesh
        position={[0, 0.5, 0]}
        onPointerEnter={(e) => {
          onHover(true);
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerLeave={(e) => {
          onHover(false);
          e.stopPropagation();
          document.body.style.cursor = 'auto';
        }}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
      >
        <cylinderGeometry args={[1.5, 1.5, 2, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Island base */}
      <mesh castShadow>
        <cylinderGeometry args={[0.9, 1, 0.2, 16]} />
        <meshStandardMaterial
          color="#3d2817"
          emissive={isHovered || isSelected ? capability.color : "#000000"}
          emissiveIntensity={isHovered || isSelected ? 0.1 : 0}
        />
      </mesh>

      {/* Grass top */}
      <mesh position={[0, 0.11, 0]}>
        <cylinderGeometry args={[0.88, 0.88, 0.02, 16]} />
        <meshStandardMaterial
          color="#22c55e"
          emissive={isHovered || isSelected ? capability.color : "#000000"}
          emissiveIntensity={isHovered || isSelected ? 0.15 : 0}
        />
      </mesh>

      {/* Capability icon - levitates independently */}
      <group ref={iconRef}>
        {renderCapabilityIcon()}
      </group>

      {/* Glow ring - stronger for selected */}
      {(isHovered || isSelected) && (
        <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.05, 1.25, 32]} />
          <meshBasicMaterial
            color={capability.color}
            transparent
            opacity={isSelected ? 0.85 : 0.6}
          />
        </mesh>
      )}

      {/* Additional pulsing ring for selected state */}
      {isSelected && (
        <mesh position={[0, -0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.3, 1.4, 32]} />
          <meshBasicMaterial color={capability.color} transparent opacity={0.4} />
        </mesh>
      )}

      {/* Labels - conditionally rendered */}
      {(isHovered || isSelected) && (
        <group position={[0, 1.5, 0]}>
          {/* Card background plane - double sided */}
          <mesh position={[0, -0.3, 0]}>
            <planeGeometry args={[2.8, isSelected ? 1.2 : 0.6]} />
            <meshBasicMaterial
              color="#000000"
              transparent
              opacity={0.85}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Front side text */}
          <group position={[0, 0, 0.01]}>
            <Text
              fontSize={0.18}
              color={capability.color}
              anchorY="bottom"
              fontWeight="bold"
            >
              {capability.name}
            </Text>
            <Text
              fontSize={0.12}
              color="white"
              position={[0, -0.25, 0]}
              anchorY="top"
            >
              {capability.title}
            </Text>
            {isSelected && (
              <Text
                fontSize={0.1}
                color="white"
                position={[0, -0.5, 0]}
                anchorY="top"
                maxWidth={2.5}
                textAlign="center"
              >
                {capability.description}
              </Text>
            )}
          </group>

          {/* Back side text (flipped 180°) */}
          <group position={[0, 0, -0.01]} rotation={[0, Math.PI, 0]}>
            <Text
              fontSize={0.18}
              color={capability.color}
              anchorY="bottom"
              fontWeight="bold"
            >
              {capability.name}
            </Text>
            <Text
              fontSize={0.12}
              color="white"
              position={[0, -0.25, 0]}
              anchorY="top"
            >
              {capability.title}
            </Text>
            {isSelected && (
              <Text
                fontSize={0.1}
                color="white"
                position={[0, -0.5, 0]}
                anchorY="top"
                maxWidth={2.5}
                textAlign="center"
              >
                {capability.description}
              </Text>
            )}
          </group>
        </group>
      )}
    </group>
  );
}

interface CapabilitiesShowcaseProps {
  isDark?: boolean;
}

export function CapabilitiesShowcase({ isDark = true }: CapabilitiesShowcaseProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Ground color based on theme
  const groundColor = isDark ? "#0f1810" : "#d4e8d4";

  return (
    <group>
      {/* Ambient particles */}
      {[...Array(40)].map((_, i) => {
        const x = (Math.random() - 0.5) * 16;
        const y = Math.random() * 3;
        const z = (Math.random() - 0.5) * 10;
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.03, 6, 6]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
          </mesh>
        );
      })}

      {/* Capability islands */}
      {capabilities.map((capability, index) => (
        <CapabilityIsland
          key={index}
          capability={capability}
          isHovered={hoveredIndex === index}
          isSelected={selectedIndex === index}
          onHover={(hovering) => setHoveredIndex(hovering ? index : null)}
          onClick={() => setSelectedIndex(selectedIndex === index ? null : index)}
        />
      ))}

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[24, 20]} />
        <meshStandardMaterial color={groundColor} />
      </mesh>
    </group>
  );
}

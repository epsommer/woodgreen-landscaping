"use client";

import { useRef, useMemo, PointerEvent as ReactPointerEvent } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { ServiceInfo } from "./ServiceStationsScene";

interface GardenStationProps {
  active?: boolean;
  isMobile?: boolean;
  isHovered?: boolean;
  isSelected?: boolean;
  onHover?: (hovering: boolean) => void;
  onClick?: () => void;
  serviceInfo?: ServiceInfo;
}

export function GardenStation({
  active = false,
  isMobile = false,
  isHovered = false,
  isSelected = false,
  onHover,
  onClick,
  serviceInfo,
}: GardenStationProps) {
  const flowersRef = useRef<THREE.Group>(null);
  const petalParticlesRef = useRef<THREE.Points>(null);
  const bloomProgress = useRef<number[]>([]);
  const colorCycleTime = useRef(0);
  const pointerDownPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: ThreeEvent<ReactPointerEvent>) => {
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleClick = (e: ThreeEvent<ReactPointerEvent>) => {
    const dx = e.clientX - pointerDownPos.current.x;
    const dy = e.clientY - pointerDownPos.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 5 && onClick) {
      onClick();
    }
  };

  const flowerPositions = useMemo(() => {
    const positions: Array<{
      pos: THREE.Vector3;
      type: "rose" | "hydrangea" | "tulip";
    }> = [];

    // Create flower beds in a pattern
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2;
      const radius = 2 + Math.random() * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const types: ("rose" | "hydrangea" | "tulip")[] = [
        "rose",
        "hydrangea",
        "tulip",
      ];
      const type = types[Math.floor(Math.random() * types.length)];

      positions.push({
        pos: new THREE.Vector3(x, 0, z),
        type,
      });

      bloomProgress.current[i] = Math.random();
    }

    return positions;
  }, []);

  // Seasonal color palettes
  const colorPalettes = useMemo(
    () => ({
      spring: [0xffc0cb, 0xffb6c1, 0xfff0f5], // Pinks and whites
      summer: [0xff69b4, 0xff1493, 0xffb6c1], // Hot pinks
      fall: [0xffa500, 0xff8c00, 0xffd700], // Oranges and yellows
      winter: [0xffffff, 0xf0f8ff, 0xe6e6fa], // Whites and pale blues
    }),
    [],
  );

  const currentPalette = useRef("spring");
  const paletteColors =
    colorPalettes[currentPalette.current as keyof typeof colorPalettes];

  // Petal particles
  const particleCount = isMobile ? 20 : 50;
  const petalGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = Math.random() * 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;

      const color = new THREE.Color(paletteColors[i % paletteColors.length]);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      velocities[i * 3] = (Math.random() - 0.5) * 0.2;
      velocities[i * 3 + 1] = Math.random() * 0.3 + 0.1;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
    }

    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geom.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));

    return geom;
  }, [paletteColors, particleCount]);

  useFrame((state, delta) => {
    if (!active) return;

    colorCycleTime.current += delta * 0.2;

    // Update bloom progress for sequential blooming
    bloomProgress.current.forEach((progress, i) => {
      const offset = i * 0.03;
      const wave = Math.sin(colorCycleTime.current + offset) * 0.5 + 0.5;
      bloomProgress.current[i] = THREE.MathUtils.lerp(progress, wave, 0.02);
    });

    // Animate petal particles
    if (petalParticlesRef.current) {
      const positions = petalGeometry.attributes.position.array as Float32Array;
      const velocities = petalGeometry.attributes.velocity
        .array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i * 3] * delta;
        positions[i * 3 + 1] += velocities[i * 3 + 1] * delta;
        positions[i * 3 + 2] += velocities[i * 3 + 2] * delta;

        // Reset when particle falls below ground
        if (positions[i * 3 + 1] < 0) {
          positions[i * 3] = (Math.random() - 0.5) * 8;
          positions[i * 3 + 1] = 5;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
        }
      }

      petalGeometry.attributes.position.needsUpdate = true;
    }
  });

  const renderFlower = (
    type: "rose" | "hydrangea" | "tulip",
    position: THREE.Vector3,
    index: number,
  ) => {
    const scale = bloomProgress.current[index] || 0.5;
    const colorIndex =
      Math.floor(colorCycleTime.current + index) % paletteColors.length;
    const color = paletteColors[colorIndex];

    switch (type) {
      case "rose":
        return (
          <group key={index} position={position.toArray()} scale={scale}>
            {/* Stem */}
            <mesh position={[0, 0.3, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
              <meshStandardMaterial color="#166534" />
            </mesh>
            {/* Bloom - cone shape */}
            <mesh position={[0, 0.7, 0]}>
              <coneGeometry args={[0.15, 0.3, 8]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        );

      case "hydrangea":
        return (
          <group key={index} position={position.toArray()} scale={scale}>
            {/* Stem */}
            <mesh position={[0, 0.25, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
              <meshStandardMaterial color="#166534" />
            </mesh>
            {/* Bloom - sphere cluster */}
            <mesh position={[0, 0.6, 0]}>
              <sphereGeometry args={[0.2, 8, 8]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0.1, 0.65, 0]}>
              <sphereGeometry args={[0.12, 8, 8]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[-0.1, 0.65, 0]}>
              <sphereGeometry args={[0.12, 8, 8]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        );

      case "tulip":
        return (
          <group key={index} position={position.toArray()} scale={scale}>
            {/* Stem */}
            <mesh position={[0, 0.35, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.7, 8]} />
              <meshStandardMaterial color="#166534" />
            </mesh>
            {/* Bloom - capsule shape */}
            <mesh position={[0, 0.8, 0]}>
              <capsuleGeometry args={[0.1, 0.2, 4, 8]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        );
    }
  };

  return (
    <group position={[10, 0, -10]}>
      {/* Invisible larger hitbox for reliable hover detection */}
      <mesh
        position={[0, 2, 0]}
        onPointerEnter={(e) => {
          if (onHover) onHover(true);
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={(e) => {
          if (onHover) onHover(false);
          e.stopPropagation();
          document.body.style.cursor = "auto";
        }}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
      >
        <cylinderGeometry args={[5, 5, 4, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Ground with garden beds */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
        receiveShadow
      >
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial color="#8b6f47" /> {/* Lighter mulch color */}
      </mesh>

      {/* Raised garden bed borders */}
      <mesh position={[0, 0.15, 4]}>
        <boxGeometry args={[10, 0.3, 0.3]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[0, 0.15, -4]}>
        <boxGeometry args={[10, 0.3, 0.3]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[4, 0.15, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[8, 0.3, 0.3]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[-4, 0.15, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[8, 0.3, 0.3]} />
        <meshStandardMaterial color="#654321" />
      </mesh>

      {/* Flowers */}
      <group ref={flowersRef}>
        {flowerPositions.map((flower, i) =>
          renderFlower(flower.type, flower.pos, i),
        )}
      </group>

      {/* Petal particles */}
      <points ref={petalParticlesRef} geometry={petalGeometry}>
        <pointsMaterial size={0.1} vertexColors transparent opacity={0.7} />
      </points>

      {/* Info Cards - conditionally rendered */}
      {serviceInfo && (isHovered || isSelected) && (
        <group position={[0, 5, 0]}>
          {/* Upper card background plane - double sided */}
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[2.8, 0.6]} />
            <meshBasicMaterial
              color="#000000"
              transparent
              opacity={0.85}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Front side text - upper card */}
          <group position={[0, 0.1, 0.01]}>
            <Text
              fontSize={0.18}
              color={serviceInfo.color}
              anchorY="bottom"
              fontWeight="bold"
            >
              {serviceInfo.name}
            </Text>
            <Text
              fontSize={0.12}
              color="white"
              position={[0, -0.25, 0]}
              anchorY="top"
            >
              {serviceInfo.title}
            </Text>
          </group>

          {/* Back side text - upper card (flipped 180°) */}
          <group position={[0, 0.1, -0.01]} rotation={[0, Math.PI, 0]}>
            <Text
              fontSize={0.18}
              color={serviceInfo.color}
              anchorY="bottom"
              fontWeight="bold"
            >
              {serviceInfo.name}
            </Text>
            <Text
              fontSize={0.12}
              color="white"
              position={[0, -0.25, 0]}
              anchorY="top"
            >
              {serviceInfo.title}
            </Text>
          </group>

          {/* Lower description cube card - only when selected */}
          {isSelected && (
            <group position={[0, -0.8, 0]}>
              {/* Front face of thin card */}
              <mesh position={[0, 0, 0.04]}>
                <planeGeometry args={[3.0, 1.0]} />
                <meshBasicMaterial
                  color="#1a1a1a"
                  transparent
                  opacity={0.9}
                  side={THREE.FrontSide}
                />
              </mesh>

              {/* Back face of thin card (rotated to face backward) */}
              <mesh position={[0, 0, -0.04]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[3.0, 1.0]} />
                <meshBasicMaterial
                  color="#1a1a1a"
                  transparent
                  opacity={0.9}
                  side={THREE.FrontSide}
                />
              </mesh>

              {/* Top edge */}
              <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[3.0, 0.08]} />
                <meshBasicMaterial color="#1a1a1a" transparent opacity={0.9} />
              </mesh>

              {/* Bottom edge */}
              <mesh position={[0, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <planeGeometry args={[3.0, 0.08]} />
                <meshBasicMaterial color="#1a1a1a" transparent opacity={0.9} />
              </mesh>

              {/* Left edge */}
              <mesh position={[-1.5, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[0.08, 1.0]} />
                <meshBasicMaterial color="#1a1a1a" transparent opacity={0.9} />
              </mesh>

              {/* Right edge */}
              <mesh position={[1.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[0.08, 1.0]} />
                <meshBasicMaterial color="#1a1a1a" transparent opacity={0.9} />
              </mesh>

              {/* Front side description text */}
              <group position={[0, 0, 0.041]}>
                <Text
                  fontSize={0.11}
                  color="white"
                  anchorY="middle"
                  maxWidth={2.7}
                  textAlign="center"
                >
                  {serviceInfo.description}
                </Text>
              </group>

              {/* Back side description text (flipped 180°) */}
              <group position={[0, 0, -0.041]} rotation={[0, Math.PI, 0]}>
                <Text
                  fontSize={0.11}
                  color="white"
                  anchorY="middle"
                  maxWidth={2.7}
                  textAlign="center"
                >
                  {serviceInfo.description}
                </Text>
              </group>
            </group>
          )}
        </group>
      )}
    </group>
  );
}

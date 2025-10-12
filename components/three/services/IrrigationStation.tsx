"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { StationComponentProps } from "./ServiceStationsScene";
import { InfoCard } from "./InfoCard";
import { useStationInteraction } from "./useStationInteraction";

export function IrrigationStation({
  active = false,
  isMobile = false,
  isHovered = false,
  isSelected = false,
  onHover,
  onClick,
  serviceInfo,
}: StationComponentProps) {
  const sprinklersRef = useRef<THREE.Group>(null);
  const waterParticlesRef = useRef<THREE.Points>(null);
  const groundRef = useRef<THREE.Mesh>(null);
  const pipesRef = useRef<THREE.Group>(null);
  const ripplesRef = useRef<THREE.Group>(null);

  const sprinklersActive = useRef(true);
  const moistureLevel = useRef(0); // 0 = dry, 1 = saturated
  const waterTime = useRef(0);

  const interactionHandlers = useStationInteraction({ onHover, onClick });

  // Ripple animation data
  const rippleData = useRef<
    Array<{
      position: THREE.Vector3;
      lifetime: number;
      maxLifetime: number;
    }>
  >([]);

  // Initialize ripples
  if (rippleData.current.length === 0) {
    for (let i = 0; i < 8; i++) {
      rippleData.current.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 8,
          0,
          (Math.random() - 0.5) * 8,
        ),
        lifetime: Math.random() * 2,
        maxLifetime: 1.5 + Math.random() * 0.5,
      });
    }
  }

  // Sprinkler positions
  const sprinklerPositions = useMemo(
    () => [
      new THREE.Vector3(-3, 0.2, -3),
      new THREE.Vector3(3, 0.2, -3),
      new THREE.Vector3(-3, 0.2, 3),
      new THREE.Vector3(3, 0.2, 3),
    ],
    [],
  );

  // Water particles
  const particleCount = isMobile ? 150 : 400;
  const waterGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sprinklerIds = new Float32Array(particleCount);
    const lifetimes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const sprinklerId = i % 4;
      const sprinklerPos = sprinklerPositions[sprinklerId];

      positions[i * 3] = sprinklerPos.x;
      positions[i * 3 + 1] = sprinklerPos.y;
      positions[i * 3 + 2] = sprinklerPos.z;

      // Arc trajectory
      const angle = (i / (particleCount / 4)) * Math.PI * 2;
      const speed = 2 + Math.random() * 1.5;

      velocities[i * 3] = Math.cos(angle) * speed;
      velocities[i * 3 + 1] = 2 + Math.random() * 1;
      velocities[i * 3 + 2] = Math.sin(angle) * speed;

      sprinklerIds[i] = sprinklerId;
      lifetimes[i] = Math.random() * 2;
    }

    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));
    geom.setAttribute(
      "sprinklerId",
      new THREE.BufferAttribute(sprinklerIds, 1),
    );
    geom.setAttribute("lifetime", new THREE.BufferAttribute(lifetimes, 1));

    return geom;
  }, [sprinklerPositions, particleCount]);

  // Coverage zones (circles showing spray range)
  const coverageZones = useMemo(() => {
    const zones: THREE.Mesh[] = [];
    sprinklerPositions.forEach((pos) => {
      const geometry = new THREE.CircleGeometry(2.5, 32);
      const material = new THREE.MeshBasicMaterial({
        color: 0x4ade80,
        transparent: true,
        opacity: 0.2,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.copy(pos);
      mesh.position.y = 0.03;
      zones.push(mesh);
    });
    return zones;
  }, [sprinklerPositions]);

  useFrame((state, delta) => {
    if (!active) return;

    waterTime.current += delta;

    // Update moisture level
    if (sprinklersActive.current) {
      moistureLevel.current = Math.min(1, moistureLevel.current + delta * 0.1);
    } else {
      moistureLevel.current = Math.max(0, moistureLevel.current - delta * 0.05);
    }

    // Animate ground color based on moisture
    if (groundRef.current) {
      const dryColor = new THREE.Color(0x78350f); // Dry brown
      const wetColor = new THREE.Color(0x166534); // Moist dark green
      const currentColor = dryColor
        .clone()
        .lerp(wetColor, moistureLevel.current);

      (groundRef.current.material as THREE.MeshStandardMaterial).color.copy(
        currentColor,
      );
    }

    // Animate water particles
    if (waterParticlesRef.current && sprinklersActive.current) {
      const positions = waterGeometry.attributes.position.array as Float32Array;
      const velocities = waterGeometry.attributes.velocity
        .array as Float32Array;
      const sprinklerIds = waterGeometry.attributes.sprinklerId
        .array as Float32Array;
      const lifetimes = waterGeometry.attributes.lifetime.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        // Update lifetime
        lifetimes[i] += delta;

        if (lifetimes[i] > 2) {
          // Reset particle at sprinkler
          const sprinklerId = sprinklerIds[i];
          const sprinklerPos = sprinklerPositions[sprinklerId];

          positions[i * 3] = sprinklerPos.x;
          positions[i * 3 + 1] = sprinklerPos.y;
          positions[i * 3 + 2] = sprinklerPos.z;

          const angle = Math.random() * Math.PI * 2;
          const speed = 2 + Math.random() * 1.5;

          velocities[i * 3] = Math.cos(angle) * speed;
          velocities[i * 3 + 1] = 2 + Math.random() * 1;
          velocities[i * 3 + 2] = Math.sin(angle) * speed;

          lifetimes[i] = 0;
        } else {
          // Update position
          positions[i * 3] += velocities[i * 3] * delta;
          positions[i * 3 + 1] += velocities[i * 3 + 1] * delta;
          positions[i * 3 + 2] += velocities[i * 3 + 2] * delta;

          // Gravity
          velocities[i * 3 + 1] -= delta * 9.8;

          // Fade out as it approaches ground
          if (positions[i * 3 + 1] < 0.5) {
            positions[i * 3 + 1] = Math.max(0, positions[i * 3 + 1]);
          }
        }
      }

      waterGeometry.attributes.position.needsUpdate = true;
      waterGeometry.attributes.lifetime.needsUpdate = true;
    }

    // Rotate sprinkler heads
    if (sprinklersRef.current && sprinklersActive.current) {
      sprinklersRef.current.children.forEach((sprinkler) => {
        if (sprinkler instanceof THREE.Group) {
          const head = sprinkler.children[1];
          if (head) {
            head.rotation.y += delta * 2;
          }
        }
      });
    }

    // Pulse coverage zones
    coverageZones.forEach((zone, i) => {
      const pulse = Math.sin(waterTime.current * 2 + i * 0.5) * 0.1 + 0.2;
      (zone.material as THREE.MeshBasicMaterial).opacity =
        sprinklersActive.current ? pulse : 0.05;
    });

    // Animate pipes visibility
    if (pipesRef.current) {
      const pipeOpacity = Math.sin(waterTime.current * 0.8) * 0.15 + 0.35;
      pipesRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          (child.material as THREE.MeshStandardMaterial).opacity = pipeOpacity;
        }
      });
    }

    // Animate ripples
    if (ripplesRef.current && sprinklersActive.current) {
      rippleData.current.forEach((ripple, i) => {
        ripple.lifetime += delta;

        // Reset ripple when it completes
        if (ripple.lifetime > ripple.maxLifetime) {
          ripple.position.set(
            (Math.random() - 0.5) * 8,
            0,
            (Math.random() - 0.5) * 8,
          );
          ripple.lifetime = 0;
          ripple.maxLifetime = 1.5 + Math.random() * 0.5;
        }

        // Update ripple mesh
        const rippleMesh = ripplesRef.current!.children[i] as THREE.Mesh;
        if (rippleMesh) {
          rippleMesh.position.copy(ripple.position);

          // Scale grows over lifetime
          const progress = ripple.lifetime / ripple.maxLifetime;
          const scale = 0.2 + progress * 0.6;
          rippleMesh.scale.set(scale, scale, 1);

          // Fade out over lifetime
          const opacity = Math.max(0, 0.5 * (1 - progress));
          (rippleMesh.material as THREE.MeshBasicMaterial).opacity = opacity;
        }
      });
    }
  });

  return (
    <group position={[10, 0, 10]}>
      {/* Invisible larger hitbox for reliable hover detection */}
      <mesh
        position={[0, 2, 0]}
        {...interactionHandlers}
      >
        <cylinderGeometry args={[5, 5, 4, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Ground plane with moisture visualization */}
      <mesh
        ref={groundRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
        receiveShadow
      >
        <planeGeometry args={[15, 15, 32, 32]} />
        <meshStandardMaterial color="#a87532" />
      </mesh>

      {/* Underground pipe network (semi-transparent) */}
      <group ref={pipesRef} position={[0, -0.3, 0]}>
        {/* Main line */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 12, 8]} />
          <meshStandardMaterial color="#666666" transparent opacity={0.4} />
        </mesh>
        <mesh rotation={[0, Math.PI / 2, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 12, 8]} />
          <meshStandardMaterial color="#666666" transparent opacity={0.4} />
        </mesh>

        {/* Connections to sprinklers */}
        {sprinklerPositions.map((pos, i) => (
          <mesh key={i} position={[pos.x, 0.3, pos.z]}>
            <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
            <meshStandardMaterial color="#666666" transparent opacity={0.4} />
          </mesh>
        ))}
      </group>

      {/* Sprinklers */}
      <group ref={sprinklersRef}>
        {sprinklerPositions.map((pos, i) => (
          <group key={i} position={pos.toArray()}>
            {/* Base */}
            <mesh>
              <cylinderGeometry args={[0.1, 0.12, 0.15, 8]} />
              <meshStandardMaterial color="#333333" />
            </mesh>
            {/* Rotating head */}
            <mesh position={[0, 0.1, 0]}>
              <coneGeometry args={[0.08, 0.15, 8]} />
              <meshStandardMaterial color="#4ade80" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Coverage zones visualization */}
      {coverageZones.map((zone, i) => (
        <primitive key={i} object={zone} />
      ))}

      {/* Water spray particles */}
      <points ref={waterParticlesRef} geometry={waterGeometry}>
        <pointsMaterial
          size={0.08}
          color="#4ade80"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Droplet ripples (animated circles on ground) */}
      <group ref={ripplesRef} position={[0, 0.02, 0]}>
        {rippleData.current.map((_, i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.3, 0.4, 16]} />
            <meshBasicMaterial
              color="#4ade80"
              transparent
              opacity={0.5}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* Info Cards - conditionally rendered */}
      {serviceInfo && (isHovered || isSelected) && (
        <group position={[0, 5, 0]}>
          <InfoCard serviceInfo={serviceInfo} isSelected={isSelected} />
        </group>
      )}
    </group>
  );
}

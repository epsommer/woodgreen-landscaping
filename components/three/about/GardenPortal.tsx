"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function GardenPortal() {
  const portalRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const innerGlowRef = useRef<THREE.Mesh>(null);

  // Create gentle floating particles
  const particleCount = 40;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const particleData: Array<{ baseX: number; baseY: number; baseZ: number; offsetX: number; offsetY: number; speed: number }> = [];

  for (let i = 0; i < particleCount; i++) {
    const x = (Math.random() - 0.5) * 2.5;
    const y = (Math.random() - 0.5) * 3;
    const z = (Math.random() - 0.5) * 0.5;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // Store base positions and animation data
    particleData.push({
      baseX: x,
      baseY: y,
      baseZ: z,
      offsetX: Math.random() * Math.PI * 2,
      offsetY: Math.random() * Math.PI * 2,
      speed: 0.2 + Math.random() * 0.3,
    });

    const color = new THREE.Color().setHSL(
      Math.random() * 0.3 + 0.25,
      0.6,
      0.5,
    );
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3),
  );
  particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Rotate portal slowly
    if (portalRef.current) {
      portalRef.current.rotation.z = time * 0.08;
    }

    // Gentle floating wave motion for particles
    if (particlesRef.current) {
      const positions = particleGeometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const data = particleData[i];

        // Gentle wave motion - no rotation, just subtle oscillation
        const waveX = Math.sin(time * data.speed + data.offsetX) * 0.1;
        const waveY = Math.sin(time * data.speed * 0.7 + data.offsetY) * 0.08;

        positions[i3] = data.baseX + waveX;
        positions[i3 + 1] = data.baseY + waveY;
        positions[i3 + 2] = data.baseZ;
      }

      particleGeometry.attributes.position.needsUpdate = true;
    }

    // Pulse inner glow
    if (innerGlowRef.current) {
      const pulse = Math.sin(time * 2) * 0.3 + 0.7;
      (innerGlowRef.current.material as THREE.MeshBasicMaterial).opacity =
        pulse * 0.4;
    }
  });

  return (
    <group ref={portalRef}>
      {/* Archway structure - Left pillar - perpendicular to plane */}
      <group position={[-1.5, 0, 0]}>
        <mesh position={[0, 1, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.25, 2, 8]} />
          <meshStandardMaterial color="#654321" roughness={0.9} />
        </mesh>
        {/* Vines on pillar */}
        {[0.5, 1, 1.5].map((y) => (
          <mesh
            key={y}
            position={[0, y, 0]}
            rotation={[Math.PI / 2, y * 0.5, 0]}
          >
            <torusGeometry args={[0.22, 0.03, 8, 12]} />
            <meshStandardMaterial color="#22c55e" />
          </mesh>
        ))}
      </group>

      {/* Right pillar - perpendicular to plane */}
      <group position={[1.5, 0, 0]}>
        <mesh position={[0, 1, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.25, 2, 8]} />
          <meshStandardMaterial color="#654321" roughness={0.9} />
        </mesh>
        {/* Vines on pillar */}
        {[0.5, 1, 1.5].map((y) => (
          <mesh
            key={y}
            position={[0, y, 0]}
            rotation={[Math.PI / 2, y * 0.5, 0]}
          >
            <torusGeometry args={[0.22, 0.03, 8, 12]} />
            <meshStandardMaterial color="#22c55e" />
          </mesh>
        ))}
      </group>

      {/* Top arch - perpendicular to plane */}
      <mesh position={[0, 2.2, 0]} rotation={[Math.PI / 2, Math.PI, 0]}>
        <torusGeometry args={[1.7, 0.15, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#654321" roughness={0.9} />
      </mesh>

      {/* Leaves along arch */}
      {[...Array(20)].map((_, i) => {
        const angle = (i / 20) * Math.PI;
        const x = Math.cos(angle) * 1.7;
        const y = 2.2 + Math.sin(angle) * 1.7;

        return (
          <mesh
            key={i}
            position={[x, y, 0]}
            rotation={[Math.PI / 2, 0, angle + Math.PI / 2]}
          >
            <coneGeometry args={[0.1, 0.2, 4]} />
            <meshStandardMaterial color="#4ade80" />
          </mesh>
        );
      })}

      {/* Portal surface (what you see through) */}
      <mesh position={[0, 1.2, -0.1]}>
        <planeGeometry args={[3, 3.5]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.8} />
      </mesh>

      {/* Inner glow */}
      <mesh ref={innerGlowRef} position={[0, 1.2, -0.05]}>
        <planeGeometry args={[2.8, 3.3]} />
        <meshBasicMaterial
          color="#4ade80"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Swirling particles */}
      <points ref={particlesRef} geometry={particleGeometry}>
        <pointsMaterial
          size={0.04}
          vertexColors
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Glimpse of garden through portal (simple shapes) */}
      <group position={[0, 0.5, -0.15]} rotation={[Math.PI / 2, 0, 0]}>
        {/* Flowers */}
        {[
          [-0.8, 0, 0],
          [0.7, 0, 0.1],
          [-0.3, 0, -0.1],
        ].map((pos, i) => (
          <group key={i} position={pos as [number, number, number]} scale={0.8}>
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.2, 6]} />
              <meshStandardMaterial color="#22c55e" />
            </mesh>
            <mesh position={[0, 0.25, 0]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial
                color="#ff6b9d"
                emissive="#ff6b9d"
                emissiveIntensity={0.3}
              />
            </mesh>
          </group>
        ))}

        {/* Small trees */}
        {[
          [0.5, 0.3, -0.2],
          [-0.6, 0.3, 0.1],
        ].map((pos, i) => (
          <group key={i} position={pos as [number, number, number]} scale={0.6}>
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.04, 0.05, 0.4, 6]} />
              <meshStandardMaterial color="#654321" />
            </mesh>
            <mesh position={[0, 0.5, 0]}>
              <coneGeometry args={[0.15, 0.4, 8]} />
              <meshStandardMaterial color="#22c55e" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Magical sparkles around portal */}
      {[...Array(15)].map((_, i) => {
        const angle = (i / 15) * Math.PI * 2;
        const radius = 1.8 + Math.sin(i) * 0.3;
        const x = Math.cos(angle) * radius;
        const y = 1.2 + Math.sin(angle) * 1.5;

        return (
          <mesh key={i} position={[x, y, 0.2]}>
            <sphereGeometry args={[0.02, 6, 6]} />
            <meshBasicMaterial color="#CEFF65" transparent opacity={0.2} />
          </mesh>
        );
      })}
    </group>
  );
}

"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { ServiceInfo } from "./ServiceStationsScene";

interface LawnCareStationProps {
  active?: boolean;
  isMobile?: boolean;
  isHovered?: boolean;
  isSelected?: boolean;
  onHover?: (hovering: boolean) => void;
  onClick?: () => void;
  serviceInfo?: ServiceInfo;
}

export function LawnCareStation({
  active = false,
  isMobile = false,
  isHovered = false,
  isSelected = false,
  onHover,
  onClick,
  serviceInfo,
}: LawnCareStationProps) {
  const grassRef = useRef<THREE.InstancedMesh>(null);
  const mowerRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const groundRef = useRef<THREE.Mesh>(null);
  const pointerDownPos = useRef({ x: 0, y: 0 });

  const healthyState = useRef(0); // 0 = unhealthy, 1 = healthy
  const mowerProgress = useRef(0);
  const windTime = useRef(0);

  const handlePointerDown = (e: any) => {
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleClick = (e: any) => {
    // Only trigger click if pointer hasn't moved much (not a drag)
    const dx = e.clientX - pointerDownPos.current.x;
    const dy = e.clientY - pointerDownPos.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 5 && onClick) {
      onClick();
    }
  };

  // Create instanced grass blades
  const grassCount = isMobile ? 300 : 800;
  const grassGeometry = useMemo(() => {
    const geom = new THREE.BoxGeometry(0.08, 1, 0.08);
    geom.translate(0, 0.5, 0); // Pivot at base
    return geom;
  }, []);

  const grassPositions = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    const size = 7; // 7x7 lawn area

    for (let i = 0; i < grassCount; i++) {
      const x = (Math.random() - 0.5) * size;
      const z = (Math.random() - 0.5) * size;
      positions.push(new THREE.Vector3(x, 0, z));
    }
    return positions;
  }, []);

  // Grass clipping particles
  const particleCount = isMobile ? 30 : 100;
  const particleGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;

      velocities[i * 3] = (Math.random() - 0.5) * 0.5;
      velocities[i * 3 + 1] = Math.random() * 0.8 + 0.2;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }

    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    return geom;
  }, []);

  useFrame((state, delta) => {
    if (!active) return;

    windTime.current += delta;

    // Animate grass blades
    if (grassRef.current) {
      const dummy = new THREE.Object3D();

      grassPositions.forEach((pos, i) => {
        const windOffset = Math.sin(windTime.current * 2 + pos.x + pos.z) * 0.15;
        const height = THREE.MathUtils.lerp(0.5, 1.0, healthyState.current);

        dummy.position.copy(pos);
        dummy.rotation.z = windOffset;
        dummy.scale.set(1, height, 1);
        dummy.updateMatrix();

        grassRef.current!.setMatrixAt(i, dummy.matrix);
      });

      grassRef.current.instanceMatrix.needsUpdate = true;

      // Lerp grass color based on health
      const unhealthyColor = new THREE.Color(0x854d0e); // Brown
      const healthyColor = new THREE.Color(0x22c55e); // Vibrant green
      const currentColor = unhealthyColor.clone().lerp(healthyColor, healthyState.current);

      (grassRef.current.material as THREE.MeshLambertMaterial).color.copy(currentColor);
    }

    // Animate mower
    if (mowerRef.current) {
      mowerProgress.current += delta * 0.3;
      if (mowerProgress.current > 1) {
        mowerProgress.current = 0;
        healthyState.current = Math.min(1, healthyState.current + 0.1);
      }

      const path = Math.sin(mowerProgress.current * Math.PI * 2) * 3;
      mowerRef.current.position.x = path;
      mowerRef.current.position.z = -3 + mowerProgress.current * 6;
    }

    // Animate particles
    if (particlesRef.current && mowerProgress.current > 0) {
      const positions = particleGeometry.attributes.position.array as Float32Array;
      const velocities = particleGeometry.attributes.velocity.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        // Reset particle near mower when it falls
        if (positions[i * 3 + 1] < 0) {
          if (mowerRef.current) {
            positions[i * 3] = mowerRef.current.position.x;
            positions[i * 3 + 1] = 0.3;
            positions[i * 3 + 2] = mowerRef.current.position.z;
          }
        } else {
          // Update position based on velocity
          positions[i * 3] += velocities[i * 3] * delta * 2;
          positions[i * 3 + 1] += velocities[i * 3 + 1] * delta * 2;
          positions[i * 3 + 2] += velocities[i * 3 + 2] * delta * 2;

          // Gravity
          velocities[i * 3 + 1] -= delta * 5;
        }
      }

      particleGeometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={[-10, 0, -10]}>
      {/* Invisible larger hitbox for reliable hover detection */}
      <mesh
        position={[0, 2, 0]}
        onPointerEnter={(e) => {
          if (onHover) onHover(true);
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerLeave={(e) => {
          if (onHover) onHover(false);
          e.stopPropagation();
          document.body.style.cursor = 'auto';
        }}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
      >
        <cylinderGeometry args={[5, 5, 4, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Ground plane */}
      <mesh ref={groundRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial color="#166534" />
      </mesh>

      {/* Instanced grass */}
      <instancedMesh
        ref={grassRef}
        args={[grassGeometry, undefined, grassCount]}
        castShadow
        receiveShadow
      >
        <meshLambertMaterial color="#22c55e" />
      </instancedMesh>

      {/* Lawn mower */}
      <group ref={mowerRef} position={[0, 0.3, -3]}>
        <mesh castShadow>
          <boxGeometry args={[0.6, 0.4, 0.8]} />
          <meshStandardMaterial color="#cc0000" />
        </mesh>
        <mesh position={[0, -0.15, 0.3]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.7, 16]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      </group>

      {/* Grass clipping particles */}
      <points ref={particlesRef} geometry={particleGeometry}>
        <pointsMaterial size={0.08} color="#22c55e" transparent opacity={0.8} />
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

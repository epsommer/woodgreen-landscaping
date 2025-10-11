"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface LawnCareStationProps {
  active?: boolean;
  isMobile?: boolean;
}

export function LawnCareStation({ active = false, isMobile = false }: LawnCareStationProps) {
  const grassRef = useRef<THREE.InstancedMesh>(null);
  const mowerRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const groundRef = useRef<THREE.Mesh>(null);

  const healthyState = useRef(0); // 0 = unhealthy, 1 = healthy
  const mowerProgress = useRef(0);
  const windTime = useRef(0);

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

      {/* Floating label */}
      <group position={[0, 3, 0]}>
        <mesh>
          <planeGeometry args={[3, 0.8]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.6} />
        </mesh>
      </group>
    </group>
  );
}

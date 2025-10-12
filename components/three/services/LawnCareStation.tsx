"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { StationComponentProps } from "./ServiceStationsScene";
import { InfoCard } from "./InfoCard";
import { useStationInteraction } from "./useStationInteraction";

export function LawnCareStation({
  active = false,
  isMobile = false,
  isHovered = false,
  isSelected = false,
  onHover,
  onClick,
  serviceInfo,
}: StationComponentProps) {
  const grassRef = useRef<THREE.InstancedMesh>(null);
  const mowerRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const groundRef = useRef<THREE.Mesh>(null);

  const healthyState = useRef(0); // 0 = unhealthy, 1 = healthy
  const mowerProgress = useRef(0);
  const windTime = useRef(0);
  const cutGrass = useRef<Set<number>>(new Set()); // Track which grass blades are cut

  const interactionHandlers = useStationInteraction({ onHover, onClick });

  // Create instanced grass blades
  const grassCount = isMobile ? 300 : 800;
  const grassGeometry = useMemo(() => {
    const geom = new THREE.BoxGeometry(0.08, 1, 0.08);
    geom.translate(0, 0.5, 0); // Pivot at base
    return geom;
  }, []);

  const grassPositions = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    const mowerWidth = 1.4; // Match mower cutting deck width
    const lawnWidth = 7;
    const numLanes = Math.ceil(lawnWidth / mowerWidth) + 1; // +1 for the extra final pass
    const bladesPerLane = Math.floor(grassCount / numLanes);

    // Create grass blades aligned with mower lanes
    for (let lane = 0; lane < numLanes; lane++) {
      const laneX = -3.5 + lane * mowerWidth;

      for (let i = 0; i < bladesPerLane; i++) {
        // Spread blades within the lane width
        const x = laneX + (Math.random() - 0.5) * mowerWidth;
        const z = (Math.random() - 0.5) * 7; // Full length of lawn
        positions.push(new THREE.Vector3(x, 0, z));
      }
    }
    return positions;
  }, [grassCount]);

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

    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));

    return geom;
  }, [particleCount]);

  useFrame((state, delta) => {
    if (!active) return;

    windTime.current += delta;

    const mowerWidth = 1.4; // Mower cutting deck width

    // Animate grass blades
    if (grassRef.current && mowerRef.current) {
      const dummy = new THREE.Object3D();
      const mowerPos = mowerRef.current.position;
      const mowerCutRadius = mowerWidth * 0.6; // Cutting radius

      grassPositions.forEach((pos, i) => {
        // Check if mower is over this grass blade
        const distanceX = Math.abs(pos.x - mowerPos.x);
        const distanceZ = Math.abs(pos.z - mowerPos.z);

        if (
          distanceX < mowerCutRadius &&
          distanceZ < 0.5 &&
          !cutGrass.current.has(i)
        ) {
          cutGrass.current.add(i);
        }

        const isCut = cutGrass.current.has(i);
        const windOffset =
          Math.sin(windTime.current * 2 + pos.x + pos.z) *
          (isCut ? 0.05 : 0.15);
        const baseHeight = isCut ? 0.3 : 1.0; // Cut grass is shorter
        const height = THREE.MathUtils.lerp(
          baseHeight * 0.5,
          baseHeight,
          healthyState.current,
        );

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
      const currentColor = unhealthyColor
        .clone()
        .lerp(healthyColor, healthyState.current);

      (grassRef.current.material as THREE.MeshLambertMaterial).color.copy(
        currentColor,
      );
    }

    // Animate mower
    if (mowerRef.current) {
      mowerProgress.current += delta * 0.15; // Slower speed (was 0.3)
      if (mowerProgress.current > 1) {
        mowerProgress.current = 0;
        healthyState.current = Math.min(1, healthyState.current + 0.1);
        // Reset cut grass for next cycle
        cutGrass.current.clear();
      }

      // Mowing pattern: straight passes with lateral movement between
      const lawnWidth = 7; // Total lawn width

      const numPasses = Math.ceil(lawnWidth / mowerWidth); // Number of passes needed
      const totalSegments = numPasses * 2 + 1; // Each pass has straight + lateral movement, plus final pass

      const segmentProgress =
        (mowerProgress.current * totalSegments) % totalSegments;
      const currentSegment = Math.floor(segmentProgress);
      const segmentPercent = segmentProgress % 1;

      const passNumber = Math.floor(currentSegment / 2);
      const isLateralMovement = currentSegment % 2 === 1;
      const isGoingDown = passNumber % 2 === 0;

      const currentX = -3.5 + passNumber * mowerWidth;
      const nextX = -3.5 + (passNumber + 1) * mowerWidth;

      // Determine rotation direction - alternates clockwise/counter-clockwise
      const isClockwise = passNumber % 2 === 0;
      const rotationDirection = isClockwise ? 1 : -1;

      if (isLateralMovement) {
        // Smooth easing for lateral movement and rotation
        const easedProgress = (1 - Math.cos(segmentPercent * Math.PI)) / 2;

        // Lateral movement to next lane with smooth easing
        mowerRef.current.position.x =
          currentX + (nextX - currentX) * easedProgress;
        // Stay at the end position (top or bottom)
        mowerRef.current.position.z = isGoingDown ? 3 : -3;

        // Rotate 180° in alternating directions with same easing
        // Even passes: clockwise (+180°), Odd passes: counter-clockwise (-180°)
        mowerRef.current.rotation.y =
          easedProgress * Math.PI * rotationDirection;
      } else {
        // Smooth easing for straight passes too
        const easedProgress = (1 - Math.cos(segmentPercent * Math.PI)) / 2;

        // Straight pass up or down - no rotation (face forward)
        const zStart = isGoingDown ? -3 : 3;
        const zEnd = isGoingDown ? 3 : -3;

        mowerRef.current.position.x = currentX;
        mowerRef.current.position.z = zStart + (zEnd - zStart) * easedProgress;

        // Reset to neutral position after completing turn
        mowerRef.current.rotation.y = 0;
      }
    }

    // Animate particles
    if (particlesRef.current && mowerProgress.current > 0) {
      const positions = particleGeometry.attributes.position
        .array as Float32Array;
      const velocities = particleGeometry.attributes.velocity
        .array as Float32Array;

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
      <mesh position={[0, 2, 0]} {...interactionHandlers}>
        <cylinderGeometry args={[5, 5, 4, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Ground plane */}
      <mesh
        ref={groundRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
        receiveShadow
      >
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial color="#4ade80" />
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
        <mesh
          position={[0, -0.15, 0.3]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
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
          <InfoCard serviceInfo={serviceInfo} isSelected={isSelected} />
        </group>
      )}
    </group>
  );
}

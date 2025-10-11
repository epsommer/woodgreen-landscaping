"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { LawnCareStation } from "./LawnCareStation";
import { GardenStation } from "./GardenStation";
import { TreeStation } from "./TreeStation";
import { IrrigationStation } from "./IrrigationStation";

export type ServiceType = "lawn" | "garden" | "tree" | "irrigation";

interface ServiceStationsSceneProps {
  activeStation: ServiceType;
  onStationChange?: (station: ServiceType) => void;
  isMobile?: boolean;
  isDark?: boolean;
}

// Station camera positions
const stationCameraPositions: Record<ServiceType, { position: THREE.Vector3; target: THREE.Vector3 }> = {
  lawn: {
    position: new THREE.Vector3(-10, 8, -3),
    target: new THREE.Vector3(-10, 0, -10),
  },
  garden: {
    position: new THREE.Vector3(10, 8, -3),
    target: new THREE.Vector3(10, 0, -10),
  },
  tree: {
    position: new THREE.Vector3(-10, 8, 17),
    target: new THREE.Vector3(-10, 0, 10),
  },
  irrigation: {
    position: new THREE.Vector3(10, 8, 17),
    target: new THREE.Vector3(10, 0, 10),
  },
};

export function ServiceStationsScene({ activeStation, isMobile = false, isDark = true }: ServiceStationsSceneProps) {
  const { camera } = useThree();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);
  const targetPosition = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  // Ground color based on theme
  const groundColor = isDark ? "#0f1810" : "#d4e8d4";
  const fogColor = isDark ? 0x0a0f0a : 0xf0f4f0;

  // Update target position when station changes
  useEffect(() => {
    const station = stationCameraPositions[activeStation];
    targetPosition.current.copy(station.position);
    targetLookAt.current.copy(station.target);
  }, [activeStation]);

  // Smooth camera transition
  useFrame((state, delta) => {
    // Lerp camera position
    camera.position.lerp(targetPosition.current, delta * 2);

    // Lerp look-at target
    currentLookAt.current.lerp(targetLookAt.current, delta * 2);

    // Update camera to look at target
    camera.lookAt(currentLookAt.current);

    // Update controls target if available
    if (controlsRef.current) {
      controlsRef.current.target.copy(currentLookAt.current);
      controlsRef.current.update();
    }
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      <directionalLight position={[-10, 10, -10]} intensity={0.4} />

      {/* Subtle fog */}
      <fog attach="fog" args={[fogColor, 20, 60]} />

      {/* Controls - limited movement */}
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={false}
        enableRotate={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={10}
        maxDistance={20}
        enableDamping
        dampingFactor={0.05}
      />

      {/* Base ground plane (connects all stations) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color={groundColor} />
      </mesh>

      {/* Service stations */}
      <LawnCareStation active={activeStation === "lawn"} isMobile={isMobile} />
      <GardenStation active={activeStation === "garden"} isMobile={isMobile} />
      <TreeStation active={activeStation === "tree"} isMobile={isMobile} />
      <IrrigationStation active={activeStation === "irrigation"} isMobile={isMobile} />

      {/* Station labels (floating text) */}
      <StationLabel position={[-10, 5, -10]} text="LAWN CARE" active={activeStation === "lawn"} />
      <StationLabel position={[10, 5, -10]} text="GARDEN DESIGN" active={activeStation === "garden"} />
      <StationLabel position={[-10, 5, 10]} text="TREE SERVICES" active={activeStation === "tree"} />
      <StationLabel position={[10, 5, 10]} text="IRRIGATION" active={activeStation === "irrigation"} />
    </>
  );
}

// Floating station label component
interface StationLabelProps {
  position: [number, number, number];
  text: string;
  active: boolean;
}

function StationLabel({ position, active }: StationLabelProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Float animation
      const float = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.position.y = position[1] + float;

      // Glow effect when active
      const opacity = active ? 0.9 : 0.5;
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity = opacity;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <planeGeometry args={[4, 0.8]} />
        <meshBasicMaterial
          color={active ? "#22c55e" : "#ffffff"}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Sky } from "@react-three/drei";
import { Color, DirectionalLight, PointLight, Mesh } from "three";
import { Season, TimeOfDay } from "./Scene";
import * as THREE from "three";
import { MotionValue } from "framer-motion";

interface FrontYardSceneProps {
  season: Season;
  timeOfDay: TimeOfDay;
  seasonProgress?: number;
  timeProgress?: MotionValue<number>;
}

export function FrontYardScene({
  timeOfDay,
  seasonProgress = 1,
  timeProgress,
}: FrontYardSceneProps) {
  const sunRef = useRef<DirectionalLight>(null);
  const moonRef = useRef<PointLight>(null);
  const windTime = useRef(0);
  const grassRef = useRef<THREE.InstancedMesh>(null);
  const bushRef = useRef<THREE.InstancedMesh>(null);
  const treeRef = useRef<Mesh>(null);

  const { scene } = useThree();
  // Season-based colors
  const seasonColors = useMemo(
    () => ({
      spring: {
        sky: new Color("#87CEEB"),
        ambient: new Color("#FFE4B5"),
        grass: new Color("#7CFC00"),
        foliage: new Color("#90EE90"),
        house: new Color("#F5E6D3"),
      },
      summer: {
        sky: new Color("#4A90E2"),
        ambient: new Color("#FFFACD"),
        grass: new Color("#228B22"),
        foliage: new Color("#228B22"),
        house: new Color("#F5E6D3"),
      },
      fall: {
        sky: new Color("#B0C4DE"),
        ambient: new Color("#FFD700"),
        grass: new Color("#9ACD32"),
        foliage: new Color("#FF8C00"),
        house: new Color("#F5E6D3"),
      },
      winter: {
        sky: new Color("#E6F3FF"),
        ambient: new Color("#F0F8FF"),
        grass: new Color("#FFFFFF"),
        foliage: new Color("#E0F2F7"),
        house: new Color("#FFFFFF"),
      },
    }),
    [],
  );

  // Interpolate colors based on continuous season progress
  const currentColors = useMemo(() => {
    const seasons = ["spring", "summer", "fall", "winter"] as const;
    const index = Math.floor(seasonProgress);
    const nextIndex = Math.min(3, index + 1);
    const t = seasonProgress - index; // 0-1 blend factor

    const from = seasonColors[seasons[index]];
    const to = seasonColors[seasons[nextIndex]];

    return {
      sky: new Color().lerpColors(from.sky, to.sky, t),
      ambient: new Color().lerpColors(from.ambient, to.ambient, t),
      grass: new Color().lerpColors(from.grass, to.grass, t),
      foliage: new Color().lerpColors(from.foliage, to.foliage, t),
      house: new Color().lerpColors(from.house, to.house, t),
    };
  }, [seasonProgress, seasonColors]);

  // Generate grass blade positions - avoid hardscapes
  const grassPositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < 500; i++) {
      const x = (Math.random() - 0.5) * 30;
      const z = (Math.random() - 0.5) * 20;

      // Avoid front walkway (x: -1 to 1, z: -4 to 4)
      const onWalkway = Math.abs(x) < 1 && z > -4 && z < 4;

      // Avoid sidewalk (x: -1 to 13, z: 3.25 to 4.75)
      const onSidewalk = x > -1 && x < 13 && z > 3.25 && z < 4.75;

      // Avoid driveway (x: 6 to 10, z: -5 to 4.5)
      const onDriveway = x > 6 && x < 10 && z > -5 && z < 4.5;

      // Only add if not on any hardscape
      if (!onWalkway && !onSidewalk && !onDriveway) {
        positions.push(new THREE.Vector3(x, 0, z));
      } else {
        i--; // Retry this position
      }
    }
    return positions;
  }, []);

  // Generate bush positions - near front entrance walkway
  const bushPositions = useMemo(() => {
    return [
      new THREE.Vector3(-2, 0, 2),
      new THREE.Vector3(-2, 0, 0),
      new THREE.Vector3(2, 0, 2),
      new THREE.Vector3(2, 0, 0),
    ];
  }, []);

  useFrame((state, delta) => {
    windTime.current += delta;

    // Animate grass
    if (grassRef.current) {
      const dummy = new THREE.Object3D();
      grassPositions.forEach((pos, i) => {
        const windOffset = Math.sin(windTime.current * 2 + pos.x + pos.z) * 0.1;
        dummy.position.copy(pos);
        dummy.rotation.z = windOffset;
        dummy.scale.set(1, 0.8, 1);
        dummy.updateMatrix();
        grassRef.current!.setMatrixAt(i, dummy.matrix);
      });
      grassRef.current.instanceMatrix.needsUpdate = true;
    }

    // Animate bushes
    if (bushRef.current) {
      const dummy = new THREE.Object3D();
      bushPositions.forEach((pos, i) => {
        const sway = Math.sin(windTime.current + i) * 0.05;
        dummy.position.copy(pos);
        dummy.rotation.z = sway;
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        bushRef.current!.setMatrixAt(i, dummy.matrix);
      });
      bushRef.current.instanceMatrix.needsUpdate = true;
    }

    // Animate sun/moon position based on timeProgress
    if (timeProgress) {
      const progress = timeProgress.get(); // 0 for day, 1 for night
      const sunMoonAngle = Math.PI * progress + Math.PI / 2;

      const sun = scene.getObjectByName("sun");
      const moon = scene.getObjectByName("moon");

      if (sun && sunRef.current) {
        sun.position.set(Math.cos(sunMoonAngle) * 20, Math.sin(sunMoonAngle) * 20, -20);
        sunRef.current.position.copy(sun.position);
        sunRef.current.intensity = Math.max(0, Math.sin(sunMoonAngle)) * 1.5;
      }
      if (moon && moonRef.current) {
        moon.position.set(Math.cos(sunMoonAngle + Math.PI) * 20, Math.sin(sunMoonAngle + Math.PI) * 20, -20);
        moonRef.current.position.copy(moon.position);
        moonRef.current.intensity = Math.max(0, Math.sin(sunMoonAngle + Math.PI)) * 0.8;
      }
    }
  });

  // Smoothly interpolate ambient light intensity
  const ambientIntensity = useMemo(() => {
    if (!timeProgress) return 0.6;
    const progress = timeProgress.get();
    return 0.6 - progress * 0.3;
  }, [timeProgress]);

  return (
    <>
      {/* Lighting */}
      <ambientLight
        intensity={ambientIntensity}
        color={currentColors.ambient}
      />
      <directionalLight
        ref={sunRef}
        position={[10, 10, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        color={timeOfDay === "day" ? "#FFF5E1" : "#1E3A5F"}
      />
      <pointLight
        ref={moonRef}
        position={[0, 15, -10]}
        intensity={0}
        color="#B0C4DE"
      />

      {/* Sky and celestial bodies */}
      <Sky
        distance={450000}
        sunPosition={timeOfDay === "day" ? [10, 10, 5] : [-10, -10, -5]}
        azimuth={timeOfDay === "day" ? 0.25 : 0.75}
        inclination={timeOfDay === "day" ? 0.6 : 0.1}
      />
      <mesh name="sun" position={[20, 0, -20]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="yellow" />
      </mesh>
      <mesh name="moon" position={[-20, 0, -20]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial color="white" />
      </mesh>
      <fog attach="fog" args={[currentColors.sky, 20, 50]} />

      {/* Camera controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={10}
        maxDistance={25}
        maxPolarAngle={Math.PI / 2.2}
      />

      {/* Ground/Lawn */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.1, 0]}
        receiveShadow
      >
        <planeGeometry args={[40, 30]} />
        <meshStandardMaterial color={currentColors.grass} />
      </mesh>

      {/* House */}
      <group position={[0, 0, -8]}>
        {/* Main house body */}
        <mesh position={[0, 3, 0]} castShadow receiveShadow>
          <boxGeometry args={[10, 6, 8]} />
          <meshStandardMaterial color={currentColors.house} />
        </mesh>

        {/* Roof - raised to touch top of house and rotated 45 degrees */}
        <mesh position={[0, 8, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[7.5, 4, 4]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>

        {/* Door */}
        <mesh position={[0, 1.5, 4.05]} castShadow>
          <boxGeometry args={[1.5, 3, 0.1]} />
          <meshStandardMaterial color="#654321" />
        </mesh>

        {/* Windows */}
        <mesh position={[-3, 2.5, 4.05]} castShadow>
          <boxGeometry args={[1.5, 1.5, 0.1]} />
          <meshStandardMaterial color="#87CEEB" />
        </mesh>
        <mesh position={[3, 2.5, 4.05]} castShadow>
          <boxGeometry args={[1.5, 1.5, 0.1]} />
          <meshStandardMaterial color="#87CEEB" />
        </mesh>
      </group>

      {/* Garage */}
      <group position={[8, 0, -8]}>
        {/* Garage body */}
        <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[6, 5, 6]} />
          <meshStandardMaterial color={currentColors.house} />
        </mesh>

        {/* Garage roof - raised to touch top of garage and rotated 45 degrees */}
        <mesh position={[0, 6.25, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[4.5, 2.5, 4]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>

        {/* Garage door */}
        <mesh position={[0, 1.5, 3.05]} castShadow>
          <boxGeometry args={[4, 3, 0.1]} />
          <meshStandardMaterial color="#D3D3D3" />
        </mesh>

        {/* Garage door panels (horizontal lines) */}
        <mesh position={[0, 2.2, 3.08]} castShadow>
          <boxGeometry args={[3.8, 0.05, 0.05]} />
          <meshStandardMaterial color="#A9A9A9" />
        </mesh>
        <mesh position={[0, 1.8, 3.08]} castShadow>
          <boxGeometry args={[3.8, 0.05, 0.05]} />
          <meshStandardMaterial color="#A9A9A9" />
        </mesh>
        <mesh position={[0, 1.4, 3.08]} castShadow>
          <boxGeometry args={[3.8, 0.05, 0.05]} />
          <meshStandardMaterial color="#A9A9A9" />
        </mesh>
        <mesh position={[0, 1.0, 3.08]} castShadow>
          <boxGeometry args={[3.8, 0.05, 0.05]} />
          <meshStandardMaterial color="#A9A9A9" />
        </mesh>
      </group>

      {/* Front walkway */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[2, 8]} />
        <meshStandardMaterial color="#A9A9A9" />
      </mesh>

      {/* Driveway - aligned with garage door, flush with sidewalk */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[8, 0, -0.25]}
        receiveShadow
      >
        <planeGeometry args={[4, 9.5]} />
        <meshStandardMaterial color="#696969" />
      </mesh>

      {/* Sidewalk - connecting walkway to driveway, extended */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[6, 0.01, 4]}
        receiveShadow
      >
        <planeGeometry args={[14, 1.5]} />
        <meshStandardMaterial color="#A9A9A9" />
      </mesh>

      {/* Grass blades */}
      <instancedMesh
        ref={grassRef}
        args={[undefined, undefined, grassPositions.length]}
        castShadow
      >
        <boxGeometry args={[0.05, 0.5, 0.05]} />
        <meshStandardMaterial color={currentColors.grass} />
      </instancedMesh>

      {/* Bushes/Shrubs along front of house */}
      <instancedMesh
        ref={bushRef}
        args={[undefined, undefined, bushPositions.length]}
        castShadow
      >
        <sphereGeometry args={[0.8, 8, 8]} />
        <meshStandardMaterial color={currentColors.foliage} />
      </instancedMesh>

      {/* Tree on the left side */}
      <group position={[-10, 0, 1]}>
        {/* Trunk */}
        <mesh position={[0, 2, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.4, 4, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* Foliage */}
        <mesh ref={treeRef} position={[0, 5, 0]} castShadow>
          <sphereGeometry args={[2, 8, 8]} />
          <meshStandardMaterial color={currentColors.foliage} />
        </mesh>
      </group>

      {/* Tree on the right side */}
      <group position={[13, 0, 1]}>
        {/* Trunk */}
        <mesh position={[0, 2, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.4, 4, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* Foliage */}
        <mesh position={[0, 5, 0]} castShadow>
          <sphereGeometry args={[2, 8, 8]} />
          <meshStandardMaterial color={currentColors.foliage} />
        </mesh>
      </group>
    </>
  );
}

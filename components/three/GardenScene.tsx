"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Mesh, Color, DirectionalLight, PointLight } from "three";
import { Season, TimeOfDay } from "./Scene";
import { Terrain } from "./Terrain";
import { Trees } from "./Trees";
import { ParticleSystem } from "./ParticleSystem";
import { Plants } from "./Plants";

interface GardenSceneProps {
  season: Season;
  timeOfDay: TimeOfDay;
  onPlantClick?: (position: [number, number, number]) => void;
}

export function GardenScene({
  season,
  timeOfDay,
  onPlantClick,
}: GardenSceneProps) {
  const sunRef = useRef<DirectionalLight>(null);
  const moonRef = useRef<PointLight>(null);
  const windTime = useRef(0);

  // Season-based colors
  const seasonColors = useMemo(
    () => ({
      spring: {
        sky: new Color("#87CEEB"),
        ambient: new Color("#FFE4B5"),
        grass: new Color("#7CFC00"),
      },
      summer: {
        sky: new Color("#4A90E2"),
        ambient: new Color("#FFFACD"),
        grass: new Color("#228B22"),
      },
      fall: {
        sky: new Color("#B0C4DE"),
        ambient: new Color("#FFD700"),
        grass: new Color("#9ACD32"),
      },
      winter: {
        sky: new Color("#E6F3FF"),
        ambient: new Color("#F0F8FF"),
        grass: new Color("#FFFFFF"),
      },
    }),
    []
  );

  // Time-of-day based lighting
  const lighting = useMemo(() => {
    if (timeOfDay === "day") {
      return {
        sunIntensity: 1.5,
        moonIntensity: 0,
        ambientIntensity: 0.6,
        sunPosition: [10, 10, 5] as [number, number, number],
      };
    } else {
      return {
        sunIntensity: 0,
        moonIntensity: 0.8,
        ambientIntensity: 0.3,
        sunPosition: [-10, -10, -5] as [number, number, number],
      };
    }
  }, [timeOfDay]);

  useFrame((state, delta) => {
    windTime.current += delta;

    // Animate sun/moon position
    if (sunRef.current && timeOfDay === "day") {
      const t = state.clock.getElapsedTime() * 0.1;
      sunRef.current.position.x = Math.cos(t) * 15;
      sunRef.current.position.y = Math.abs(Math.sin(t)) * 10 + 5;
    }
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight
        intensity={lighting.ambientIntensity}
        color={seasonColors[season].ambient}
      />
      <directionalLight
        ref={sunRef}
        position={lighting.sunPosition}
        intensity={lighting.sunIntensity}
        castShadow
        shadow-mapSize={[2048, 2048]}
        color={timeOfDay === "day" ? "#FFF5E1" : "#1E3A5F"}
      />
      <pointLight
        ref={moonRef}
        position={[0, 15, -10]}
        intensity={lighting.moonIntensity}
        color="#B0C4DE"
      />

      {/* Fog for atmosphere */}
      <fog
        attach="fog"
        args={[
          seasonColors[season].sky.getHex(),
          10,
          timeOfDay === "day" ? 50 : 30,
        ]}
      />

      {/* Controls */}
      <OrbitControls
        enablePan={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
        minDistance={8}
        maxDistance={25}
        enableDamping
        dampingFactor={0.05}
      />

      {/* Scene elements */}
      <Terrain season={season} grassColor={seasonColors[season].grass} />
      <Trees season={season} windTime={windTime.current} />
      <Plants season={season} windTime={windTime.current} />

      {/* Particles */}
      <ParticleSystem season={season} timeOfDay={timeOfDay} />
    </>
  );
}

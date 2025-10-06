"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { GardenScene } from "./GardenScene";
import { LoadingPlant } from "./LoadingPlant";

export type Season = "spring" | "summer" | "fall" | "winter";
export type TimeOfDay = "day" | "night";

interface SceneProps {
  season: Season;
  timeOfDay: TimeOfDay;
  onPlantClick?: (position: [number, number, number]) => void;
}

export function Scene({ season, timeOfDay, onPlantClick }: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 5, 15], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
      className="w-full h-full"
    >
      <Suspense fallback={<LoadingPlant />}>
        <GardenScene
          season={season}
          timeOfDay={timeOfDay}
          onPlantClick={onPlantClick}
        />
      </Suspense>
    </Canvas>
  );
}

"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { FrontYardScene } from "./FrontYardScene";
import { LoadingPlant } from "./LoadingPlant";

export type Season = "spring" | "summer" | "fall" | "winter";
export type TimeOfDay = "day" | "night";

interface SceneProps {
  season: Season;
  timeOfDay: TimeOfDay;
  seasonProgress?: number;
}

export function Scene({ season, timeOfDay, seasonProgress = 1 }: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 6, 18], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
      className="w-full h-full"
    >
      <Suspense fallback={<LoadingPlant />}>
        <FrontYardScene
          season={season}
          timeOfDay={timeOfDay}
          seasonProgress={seasonProgress}
        />
      </Suspense>
    </Canvas>
  );
}

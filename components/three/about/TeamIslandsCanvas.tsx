"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { TeamIslands } from "./TeamIslands";
import { LoadingPlant } from "../LoadingPlant";

interface TeamIslandsCanvasProps {
  className?: string;
}

export function TeamIslandsCanvas({ className = "" }: TeamIslandsCanvasProps) {
  return (
    <div className={className}>
      <Canvas
        shadows
        dpr={[1, 2]}
        className="w-full h-full"
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#0a0f0a"]} />

        <PerspectiveCamera makeDefault position={[0, 6, 10]} fov={50} />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-5, 3, -5]} intensity={0.3} color="#CEFF65" />
        <pointLight position={[5, 3, 5]} intensity={0.3} color="#60a5fa" />

        {/* Controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.5}
          minDistance={8}
          maxDistance={16}
          target={[0, 0, 0]}
        />

        <Suspense fallback={<LoadingPlant />}>
          <TeamIslands />
        </Suspense>
      </Canvas>

      {/* Interaction hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm opacity-70 pointer-events-none text-center">
        Click islands to learn more about our team
      </div>
    </div>
  );
}

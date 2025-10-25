"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { CapabilitiesShowcase } from "./CapabilitiesShowcase";
import { LoadingPlant } from "../LoadingPlant";
import { useTheme } from "next-themes";
import ThreeErrorBoundary from "../ErrorBoundary";

interface CapabilitiesShowcaseCanvasProps {
  className?: string;
}

export function CapabilitiesShowcaseCanvas({ className = "" }: CapabilitiesShowcaseCanvasProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const backgroundColor = mounted && resolvedTheme === "dark" ? "#1C1C1C" : "#F0F4F0";

  return (
    <div className={className}>
      <ThreeErrorBoundary
        fallback={
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#F0F4F0] to-[#E8F2E8] dark:from-[#1a1a1a] dark:to-[#0a0a0a] rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">3D visualization loading...</p>
          </div>
        }
      >
        <Canvas
          shadows
          dpr={[1, 2]}
          className="w-full h-full"
          gl={{ antialias: true }}
        >
          <color attach="background" args={[backgroundColor]} />

          <PerspectiveCamera makeDefault position={[0, 7, 12]} fov={50} />

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
          <pointLight position={[0, 3, 0]} intensity={0.4} color="#4ade80" />

          {/* Controls */}
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.5}
            minDistance={10}
            maxDistance={18}
            target={[0, 0, 0]}
            makeDefault
            enableDamping
            dampingFactor={0.05}
          />

          <Suspense fallback={<LoadingPlant />}>
            <CapabilitiesShowcase isDark={mounted && resolvedTheme === "dark"} />
          </Suspense>
        </Canvas>

        {/* Interaction hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[#2F3B30] dark:text-white text-sm opacity-70 pointer-events-none text-center">
          Click islands to explore what I bring to your project
        </div>
      </ThreeErrorBoundary>
    </div>
  );
}

"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { ServiceGlobe } from "./ServiceGlobe";
import { LoadingPlant } from "../LoadingPlant";
import { useTheme } from "next-themes";

interface ServiceGlobeCanvasProps {
  className?: string;
}

export function ServiceGlobeCanvas({ className = "" }: ServiceGlobeCanvasProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const backgroundColor = mounted && resolvedTheme === "dark" ? "#1C1C1C" : "#F0F4F0";

  return (
    <div className={className}>
      <Canvas
        dpr={[1, 2]}
        className="w-full h-full"
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={[backgroundColor]} />

        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />

        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 3, 5]} intensity={0.8} />
        <pointLight position={[-3, 2, -3]} intensity={0.4} color="#22c55e" />

        {/* Controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={4}
          maxDistance={10}
          autoRotate
          autoRotateSpeed={0.3}
        />

        <Suspense fallback={<LoadingPlant />}>
          <ServiceGlobe />
        </Suspense>
      </Canvas>

      {/* Info overlay */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-white/90 dark:bg-black/60 backdrop-blur-md p-4 rounded-lg border border-[#2F3B30]/20 dark:border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-nature-400 rounded-full animate-pulse" />
            <span className="font-semibold text-[#2F3B30] dark:text-white">Service Area: Greater Toronto</span>
          </div>
          <p className="text-sm text-[#4A5D4C] dark:text-gray-300">
            Boutique service. Big city impact. One project at a time.
          </p>
        </div>
      </div>
    </div>
  );
}

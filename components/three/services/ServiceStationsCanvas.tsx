"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo, useEffect, useState } from "react";
import { ServiceStationsScene, ServiceType } from "./ServiceStationsScene";
import { LoadingPlant } from "../LoadingPlant";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useTheme } from "next-themes";

interface ServiceStationsCanvasProps {
  activeStation: ServiceType;
  className?: string;
}

export function ServiceStationsCanvas({ activeStation, className = "" }: ServiceStationsCanvasProps) {
  const isMobile = useIsMobile();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Adjust settings based on device
  const settings = useMemo(() => ({
    antialias: !isMobile,
    shadows: !isMobile,
    dpr: isMobile ? [1, 1.5] : [1, 2], // Pixel ratio
  }), [isMobile]);

  const backgroundColor = mounted && resolvedTheme === "dark" ? "#1C1C1C" : "#F0F4F0";

  return (
    <Canvas
      camera={{ position: [-10, 8, -3], fov: 60 }}
      gl={{
        antialias: settings.antialias,
        alpha: false,
        powerPreference: "high-performance",
      }}
      shadows={settings.shadows}
      dpr={settings.dpr as [number, number]}
      className={className}
      performance={{ min: 0.5 }}
    >
      <color attach="background" args={[backgroundColor]} />
      <Suspense fallback={<LoadingPlant />}>
        <ServiceStationsScene activeStation={activeStation} isMobile={isMobile} isDark={resolvedTheme === "dark"} />
      </Suspense>
    </Canvas>
  );
}

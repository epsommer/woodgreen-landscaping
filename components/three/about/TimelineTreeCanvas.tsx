"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import {
  CameraControls,
  PerspectiveCamera,
  useDetectGPU,
} from "@react-three/drei";
import { TimelineTree } from "./TimelineTree";
import { LoadingPlant } from "../LoadingPlant";
import { useTheme } from "next-themes";
import CameraControlsImpl from "camera-controls";
import { ZoomIn, ZoomOut } from "lucide-react";

interface TimelineTreeCanvasProps {
  className?: string;
}

function Scene({
  cameraControlsRef,
  backgroundColor,
  isMobile,
  isVisible,
  isUserInteracting,
}: {
  cameraControlsRef: React.RefObject<CameraControls | null>;
  backgroundColor: string;
  isMobile: boolean;
  isVisible: boolean;
  isUserInteracting: React.MutableRefObject<boolean>;
}) {
  useFrame((state, delta) => {
    if (cameraControlsRef.current) {
      // Apply auto-rotation only when user is not interacting
      if (!isUserInteracting.current) {
        cameraControlsRef.current.rotate(0.1 * delta, 0, true);
      }
    }
  });

  return (
    <>
      <color attach="background" args={[backgroundColor]} />

      <PerspectiveCamera makeDefault position={[0, 6, 18]} fov={50} />

      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.5}
        castShadow={!isMobile}
        shadow-mapSize={isMobile ? [512, 512] : [1024, 1024]}
      />
      <pointLight position={[-5, 5, -5]} intensity={0.8} color="#CEFF65" />
      <pointLight position={[5, 8, 5]} intensity={0.6} color="#22c55e" />

      {/* OrbitControls, CameraControls, and the rest of the scene are now here */}
      <Suspense fallback={<LoadingPlant />}>
        <TimelineTree isVisible={isVisible} />
      </Suspense>
    </>
  );
}

export function TimelineTreeCanvas({ className = "" }: TimelineTreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [zoom, setZoom] = useState(18); // Initial camera distance
  const cameraControlsRef = useRef<CameraControls | null>(null);
  const GPUTier = useDetectGPU();
  const isMobile =
    (GPUTier.isMobile ?? false) || (GPUTier.tier ?? 0) < 2;
  const isUserInteracting = useRef(false);
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleZoomIn = () => {
    setZoom(prev => Math.max(12, prev - 2)); // Min distance 12
    handleInteraction();
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.min(25, prev + 2)); // Max distance 25
    handleInteraction();
  };

  const handleInteraction = () => {
    isUserInteracting.current = true;
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
    interactionTimeoutRef.current = setTimeout(() => { isUserInteracting.current = false; }, 2000); // Resume auto-rotate after 2 seconds
  };

  // Detect when section enters viewport to start animation (only once)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.2, // Start animation when 20% of section is visible
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  // Background colors based on theme
  const backgroundColor = mounted && resolvedTheme === "dark" ? "#1C1C1C" : "#F0F4F0";

  useEffect(() => {
    if (cameraControlsRef.current) {
      cameraControlsRef.current.dollyTo(zoom, true);
    }
  }, [zoom]);

  // Programmatically set initial target and enable auto-rotation
  useEffect(() => {
    if (cameraControlsRef.current) {
      cameraControlsRef.current.setTarget(0, 6, 0, false);
    }
  }, []);

  return (
    <div ref={containerRef} className={`${className} ${isMobile ? 'pointer-events-none' : ''}`}>
      <Canvas
        shadows={!isMobile}
        dpr={isMobile ? 1 : 2}
        className="w-full h-full"
        gl={{ antialias: true, alpha: true }}
        style={{ touchAction: "pan-y" }}
      >
        <Scene
          cameraControlsRef={cameraControlsRef}
          backgroundColor={backgroundColor}
          isMobile={isMobile}
          isVisible={isVisible}
          isUserInteracting={isUserInteracting}
        />
        <CameraControls
          ref={cameraControlsRef}
          minDistance={12}
          maxDistance={25}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
          // Mobile-friendly touch controls
          // 1 finger to scroll page, 2 fingers to rotate
          mouseButtons={{
            left: isMobile ? CameraControlsImpl.ACTION.NONE : CameraControlsImpl.ACTION.ROTATE,
            wheel: CameraControlsImpl.ACTION.NONE,
            middle: CameraControlsImpl.ACTION.NONE,
            right: CameraControlsImpl.ACTION.NONE,
          }}
          touches={{
            one: isMobile ? CameraControlsImpl.ACTION.NONE : CameraControlsImpl.ACTION.TOUCH_ROTATE,
            two: CameraControlsImpl.ACTION.TOUCH_ZOOM_ROTATE,
            three: CameraControlsImpl.ACTION.NONE,
          }}
        />
      </Canvas>

      {/* Zoom Controls */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={handleZoomIn}
          disabled={zoom <= 12}
          className="p-3 rounded-lg bg-white/90 dark:bg-black/60 backdrop-blur-md border border-[#2F3B30]/20 dark:border-white/10 hover:bg-white dark:hover:bg-black/80 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-5 h-5 text-[#2F3B30] dark:text-white" />
        </button>
        <button
          onClick={handleZoomOut}
          disabled={zoom >= 25}
          className="p-3 rounded-lg bg-white/90 dark:bg-black/60 backdrop-blur-md border border-[#2F3B30]/20 dark:border-white/10 hover:bg-white dark:hover:bg-black/80 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-5 h-5 text-[#2F3B30] dark:text-white" />
        </button>
      </div>

      {/* Interaction hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[#2F3B30] dark:text-white text-sm opacity-70 pointer-events-none text-center">
        {isMobile
          ? "Use two fingers to rotate • Use buttons to zoom"
          : "Drag to rotate • Use buttons to zoom"}
      </div>
    </div>
  );
}

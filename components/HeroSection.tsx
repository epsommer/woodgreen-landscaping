"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import { motion, useMotionValue } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Leaf, Snowflake, Flower2, TreePine, ChevronRight, ChevronLeft } from "lucide-react";
import { Season, TimeOfDay } from "./three/Scene";

// Dynamically import the 3D Scene to avoid SSR issues
const Scene = dynamic(
  () => import("./three/Scene").then((mod) => mod.Scene),
  { ssr: false }
);

interface HeroSectionProps {
  onGetStarted?: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  const [season, setSeason] = useState<Season>("summer");
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("day");
  const [controlsOpen, setControlsOpen] = useState(true);
  const [seasonProgress, setSeasonProgress] = useState(1); // 0=spring, 1=summer, 2=fall, 3=winter
  const [isDragging, setIsDragging] = useState(false);

  // Ref for slider container to constrain drag
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  // Debug state
  const [debugInfo, setDebugInfo] = useState({
    containerY: 0,
    relativeY: 0,
    clampedY: 0,
    progress: 0,
    thumbTop: 0,
    mouseY: 0,
    animateTargetPercent: 0,
    animateTargetPx: 0,
    currentVisualTop: 0,
  });

  const seasonIcons = {
    spring: <Flower2 className="w-4 h-4" />,
    summer: <Sun className="w-4 h-4" />,
    fall: <Leaf className="w-4 h-4" />,
    winter: <Snowflake className="w-4 h-4" />,
  };

  // Log animation state after drag ends
  useEffect(() => {
    if (!isDragging && debugInfo.progress > 0) {
      const finalAnimateTarget = 5 + (seasonProgress / 3) * 90;
      const finalAnimatePx = (finalAnimateTarget / 100) * 160;
      console.log("🎯 AFTER DRAG END - ANIMATION TARGET:", {
        "Progress": seasonProgress.toFixed(3),
        "Animate To %": finalAnimateTarget.toFixed(2),
        "Animate To px": finalAnimatePx.toFixed(2),
        "Season": season,
        "Should Be At": seasonProgress === 3 ? "152px (95%)" : "varies",
      });
    }
  }, [isDragging, seasonProgress, season, debugInfo.progress]);

  // Dynamic background based on time of day
  const backgroundGradient =
    timeOfDay === "day"
      ? "bg-gradient-to-b from-sky-400 via-blue-300 to-blue-200"
      : "bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700";

  return (
    <section className={`relative h-screen w-full overflow-hidden transition-colors duration-1000 ${backgroundGradient}`}>
      {/* 3D Scene Background */}
      <div className="absolute inset-0 z-hero-scene">
        <Suspense fallback={<div className="w-full h-full bg-slate-900" />}>
          <Scene season={season} timeOfDay={timeOfDay} seasonProgress={seasonProgress} />
        </Suspense>
      </div>

      {/* Collapsible Side Panel with Controls */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: controlsOpen ? 0 : -80, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute left-0 top-24 md:top-32 z-hero-controls"
      >
        <div className="flex items-center">
          {/* Controls Panel */}
          <div
            className={`backdrop-blur-md bg-white/10 border border-white/20 rounded-r-2xl p-4 transition-all duration-300 ${
              controlsOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Season controls - vertical slider */}
            <div className="mb-6">
              <p className="text-white/80 text-xs mb-3 font-medium text-center">
                Season
              </p>
              <div className="flex gap-3 items-center">
                {/* Slider track - left side */}
                <div ref={sliderContainerRef} className="relative flex-shrink-0" style={{ width: '20px', height: '160px' }}>
                  {/* Background track */}
                  <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-white/20 rounded-full" />

                  {/* Active segment indicator - shows current season position */}
                  <motion.div
                    className="absolute left-1/2 -translate-x-1/2 w-1 bg-nature-500 rounded-full"
                    animate={!isDragging ? {
                      top: `${(seasonProgress / 3) * 75}%`  // 0-75% (leaving 25% for segment height)
                    } : undefined}
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    style={{
                      height: "25%",
                      top: isDragging ? `${(seasonProgress / 3) * 75}%` : undefined
                    }}
                  />

                  {/* Draggable thumb circle */}
                  <motion.div
                    key={`thumb-${season}-${!isDragging}`} // Force reset when season changes via buttons
                    className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-nature-500 rounded-full cursor-grab active:cursor-grabbing shadow-lg border-2 border-white/50 hover:scale-110 transition-transform"
                    initial={{
                      top: `${5 + (seasonProgress / 3) * 90}%`
                    }}
                    drag="y"
                    _dragX={0}
                    dragConstraints={sliderContainerRef}
                    dragElastic={0}
                    dragMomentum={false}
                    whileDrag={{ scale: 1.2 }}
                    onDragStart={() => {
                      console.log("=== DRAG START ===");
                      setIsDragging(true);
                    }}
                    onDrag={(_, info) => {
                      const seasons: Season[] = ["spring", "summer", "fall", "winter"];
                      const thumbHeight = 16;
                      const containerHeight = 160;
                      const thumbHalf = thumbHeight / 2; // 8px
                      const minPos = thumbHalf; // 8px - keeps thumb centered at top
                      const maxPos = containerHeight - thumbHalf; // 152px - keeps thumb centered at bottom
                      const travelRange = maxPos - minPos; // 144px

                      // Get container bounds
                      const containerEl = info.point.y - info.offset.y;
                      const relativeY = info.point.y - containerEl;
                      // Clamp to valid range (8-152) - center of thumb
                      const clampedY = Math.max(minPos, Math.min(maxPos, relativeY));

                      // Calculate progress (0-3) from centered position
                      const progress = ((clampedY - minPos) / travelRange) * 3;
                      const thumbTop = ((clampedY - minPos) / travelRange) * 100;

                      // Calculate where it will animate to after release
                      const animateTargetPercent = 5 + (progress / 3) * 90;
                      const animateTargetPx = (animateTargetPercent / 100) * containerHeight;

                      // Debug logging
                      console.log("Drag Info:", {
                        "Mouse Y": info.point.y.toFixed(2),
                        "Offset Y": info.offset.y.toFixed(2),
                        "Container Y": containerEl.toFixed(2),
                        "Relative Y": relativeY.toFixed(2),
                        "Clamped Y (centered)": clampedY.toFixed(2),
                        "Min/Max": `${minPos}px - ${maxPos}px`,
                        "Travel Range": travelRange,
                        "Progress": progress.toFixed(3),
                        "Thumb Top %": thumbTop.toFixed(2),
                        "Will Animate To": `${animateTargetPercent.toFixed(2)}% (${animateTargetPx.toFixed(2)}px)`,
                        "Season Index": Math.round(progress),
                      });

                      setDebugInfo({
                        containerY: containerEl,
                        relativeY: relativeY,
                        clampedY: clampedY,
                        progress: progress,
                        thumbTop: thumbTop,
                        mouseY: info.point.y,
                        animateTargetPercent: animateTargetPercent,
                        animateTargetPx: animateTargetPx,
                        currentVisualTop: clampedY,
                      });

                      setSeasonProgress(progress);

                      // Update discrete season
                      const index = Math.round(progress);
                      setSeason(seasons[index]);
                    }}
                    onDragEnd={() => {
                      console.log("=== DRAG END ===");
                      setIsDragging(false);
                    }}
                  />
                </div>

                {/* Season buttons - right side */}
                <div className="flex flex-col gap-2">
                  {(["spring", "summer", "fall", "winter"] as Season[]).map(
                    (s, index) => (
                      <motion.button
                        key={s}
                        onClick={() => {
                          setSeason(s);
                          setSeasonProgress(index);
                        }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-10 h-10 rounded-xl transition-all duration-300 ease-in-out flex items-center justify-center ${
                          season === s
                            ? "bg-nature-500 text-white scale-110"
                            : "bg-white/10 text-white/60 hover:bg-white/20"
                        }`}
                        aria-label={`Set season to ${s}`}
                      >
                        {seasonIcons[s]}
                      </motion.button>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Time of day toggle */}
            <div>
              <p className="text-white/80 text-xs mb-3 font-medium text-center">
                Time
              </p>
              <div className="flex flex-col gap-2">
                <motion.button
                  onClick={() => setTimeOfDay("day")}
                  whileTap={{ scale: 0.95 }}
                  className={`w-10 h-10 rounded-xl transition-all duration-300 ease-in-out flex items-center justify-center ${
                    timeOfDay === "day"
                      ? "bg-nature-500 text-white scale-110"
                      : "bg-white/10 text-white/60 hover:bg-white/20"
                  }`}
                  aria-label="Set to day time"
                >
                  <Sun className="w-4 h-4" />
                </motion.button>
                <motion.button
                  onClick={() => setTimeOfDay("night")}
                  whileTap={{ scale: 0.95 }}
                  className={`w-10 h-10 rounded-xl transition-all duration-300 ease-in-out flex items-center justify-center ${
                    timeOfDay === "night"
                      ? "bg-nature-500 text-white scale-110"
                      : "bg-white/10 text-white/60 hover:bg-white/20"
                  }`}
                  aria-label="Set to night time"
                >
                  <Moon className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setControlsOpen(!controlsOpen)}
            className="backdrop-blur-md bg-white/10 border border-white/20 rounded-r-xl p-2 ml-[-1px] hover:bg-white/20 transition-colors"
            aria-label={controlsOpen ? "Close controls" : "Open controls"}
          >
            {controlsOpen ? (
              <ChevronLeft className="w-5 h-5 text-white/80" />
            ) : (
              <ChevronRight className="w-5 h-5 text-white/80" />
            )}
          </button>
        </div>
      </motion.div>

      {/* Hero Card - raised position */}
      <div className="absolute bottom-24 md:bottom-32 left-0 right-0 z-hero-content px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="backdrop-blur-md bg-black/30 rounded-2xl p-6 md:p-8 border border-white/20 text-center"
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-nature-400 to-nature-600 bg-clip-text text-transparent">
              Transform Your Outdoor Space
            </h1>
            <p className="text-sm md:text-lg text-white/90 mb-4 md:mb-6">
              Experience the beauty of nature through our expert landscaping
              services
            </p>

            <Button
              size="lg"
              onClick={onGetStarted}
              className="bg-nature-500 hover:bg-nature-600 text-white px-6 md:px-8 py-3 md:py-4 text-sm md:text-base rounded-full transition-all duration-300 hover:scale-105"
            >
              Get Started
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator - centered at bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-hero-content"
      >
        <button
          onClick={() => {
            const nextSection = document.querySelector("#services");
            nextSection?.scrollIntoView({ behavior: "smooth" });
          }}
          className="flex flex-col items-center text-white/60 hover:text-white/90 transition-colors cursor-pointer"
          aria-label="Scroll to services section"
        >
          <p className="text-xs md:text-sm mb-2">Explore</p>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <TreePine className="w-5 h-5 md:w-6 md:h-6" />
          </motion.div>
        </button>
      </motion.div>

      {/* Debug Panel */}
      <div className="fixed top-4 right-4 z-[200] bg-black/80 backdrop-blur-md text-white p-4 rounded-lg font-mono text-xs max-w-xs">
        <h3 className="font-bold mb-2 text-sm text-nature-400">Slider Debug Panel</h3>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-400">Season:</span>
            <span className="text-nature-400 font-semibold">{season}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Progress:</span>
            <span>{seasonProgress.toFixed(3)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Dragging:</span>
            <span className={isDragging ? "text-green-400" : "text-red-400"}>
              {isDragging ? "YES" : "NO"}
            </span>
          </div>
          <hr className="border-gray-600 my-2" />
          <div className="flex justify-between">
            <span className="text-gray-400">Mouse Y:</span>
            <span>{debugInfo.mouseY.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Container Y:</span>
            <span>{debugInfo.containerY.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Relative Y:</span>
            <span>{debugInfo.relativeY.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Clamped Y:</span>
            <span className="text-yellow-400">{debugInfo.clampedY.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Range:</span>
            <span className="text-blue-400">8px - 152px</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Thumb Top %:</span>
            <span className="text-purple-400">{debugInfo.thumbTop.toFixed(2)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Expected Top:</span>
            <span className="text-green-400">{(5 + (debugInfo.progress / 3) * 90).toFixed(2)}%</span>
          </div>
          <hr className="border-gray-600 my-2" />
          <div className="text-xs font-bold text-orange-400 mb-1">After Release:</div>
          <div className="flex justify-between">
            <span className="text-gray-400">Animate To %:</span>
            <span className="text-orange-400">{debugInfo.animateTargetPercent.toFixed(2)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Animate To px:</span>
            <span className="text-orange-400">{debugInfo.animateTargetPx.toFixed(2)}px</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Current Top px:</span>
            <span className="text-cyan-400">{debugInfo.currentVisualTop.toFixed(2)}px</span>
          </div>
        </div>
      </div>
    </section>
  );
}

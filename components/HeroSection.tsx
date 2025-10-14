"use client";

import { useState, useEffect, useRef, Suspense, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion"; // Added useSpring
import { Button } from "@/components/ui/button";
import {
  Sun,
  Leaf,
  Snowflake,
  Flower2,
  TreePine,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Season, TimeOfDay } from "./three/Scene";
import { TimeOfDayToggle } from "@/components/TimeOfDayToggle";

// Dynamically import the 3D Scene to avoid SSR issues
const Scene = dynamic(() => import("./three/Scene").then((mod) => mod.Scene), {
  ssr: false,
});

interface HeroSectionProps {
  onGetStarted?: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  const [season, setSeason] = useState<Season>("summer");
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("day");
  const [controlsOpen, setControlsOpen] = useState(true);
  const [seasonProgress, setSeasonProgress] = useState(1); // 0=spring, 1=summer, 2=fall, 3=winter
  const [isDragging, setIsDragging] = useState(false);

  // Motion values for sliders/dials
  const timeProgress = useSpring(0, { stiffness: 200, damping: 30 });

  // Ref for slider container to constrain drag
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  // Debug state
  const [debugInfo] = useState({
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

  const seasonIcons = useMemo(
    () => ({
      spring: <Flower2 className="w-4 h-4" />,
      summer: <Sun className="w-4 h-4" />,
      fall: <Leaf className="w-4 h-4" />,
      winter: <Snowflake className="w-4 h-4" />,
    }),
    [],
  );

  const activeSeasonClasses: Record<Season, string> = {
    spring: "bg-green-400 text-green-800",
    summer: "bg-[#CEFF65] text-[#2F3B30]",
    fall: "bg-amber-700 text-white",
    winter: "bg-white text-blue-900",
  };

  // Update timeProgress when timeOfDay changes
  useEffect(() => {
    timeProgress.set(timeOfDay === "day" ? 0 : 1);
  }, [timeOfDay, timeProgress]);

  // Motion values for the slider
  const thumbY = useMotionValue(20 + (seasonProgress / 3) * 144);
  const trackHeight = useTransform(
    thumbY,
    [20, 164], // Input range in pixels
    [0, 100], // Output range in percentage
  );

  // Log animation state after drag ends
  useEffect(() => {
    if (!isDragging && debugInfo.progress > 0) {
      const containerHeight = 184;
      const minPos = 20; // buttonHalf
      const travelRange = 144;
      const targetPx = minPos + (seasonProgress / 3) * travelRange;
      const finalAnimateTarget = (targetPx / containerHeight) * 100;
      console.log("🎯 AFTER DRAG END - ANIMATION TARGET:", {
        Progress: seasonProgress.toFixed(3),
        "Animate To %": finalAnimateTarget.toFixed(2),
        "Animate To px": targetPx.toFixed(2),
        Season: season,
        "Should Be At": seasonProgress === 3 ? "164px (89.13%)" : "varies",
      });
    }
  }, [isDragging, seasonProgress, season, debugInfo.progress]);

  // Dynamic background based on time of day
  const backgroundGradient =
    timeOfDay === "day"
      ? "bg-gradient-to-b from-sky-400 via-blue-300 to-blue-200"
      : "bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700";

  return (
    <section
      className={`relative h-screen w-full overflow-hidden transition-colors duration-1000 ${backgroundGradient}`}
    >
      {/* 3D Scene Background */}
      <div className="absolute inset-0 z-hero-scene">
        <Suspense fallback={<div className="w-full h-full bg-slate-900" />}>
          <Scene
            season={season}
            timeOfDay={timeOfDay}
            seasonProgress={seasonProgress}
            timeProgress={timeProgress}
          />
        </Suspense>
      </div>

      {/* Collapsible Side Panel with Controls */}
      <motion.div
        animate={{ x: controlsOpen ? 0 : -101 }} // 101px is the width of the panel
        transition={{ type: "spring", stiffness: 400, damping: 40 }}
        className="absolute left-0 top-24 md:top-32 z-hero-controls flex items-center"
      >
        {/* Controls Panel */}
        <div
            className="backdrop-blur-md bg-slate-900/80 border border-r-0 border-white/20 rounded-l-none rounded-r-2xl p-4 overflow-hidden"
            style={{ width: 101 }}
        >
              {/* Season controls - vertical slider */}
              <div className="mb-6">
                <p className="text-white/80 text-xs mb-3 font-medium text-center">
                  Season
                </p>
                <div className="flex gap-3 items-center">
                  {/* Slider track - left side */}
                  <div
                    ref={sliderContainerRef}
                    className="relative flex-shrink-0"
                    style={{ width: "20px", height: "184px" }}
                  >
                    {/* Background track */}
                    <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-white/20 rounded-full" />

                    {/* Active track fill */}
                    <motion.div
                      className="absolute left-1/2 -translate-x-1/2 w-1 bg-nature-500 rounded-full"
                      style={{
                        height: useTransform(trackHeight, (v) => `${v}%`),
                        top: 0,
                      }}
                    />

                    {/* Draggable thumb circle */}
                    <motion.div
                      key={`thumb-${season}`} // Force reset when season changes via buttons
                      className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-nature-500 rounded-full cursor-grab active:cursor-grabbing shadow-lg border-2 border-white/50 hover:scale-110 transition-transform"
                      style={{ top: 0, y: thumbY }}
                      drag="y"
                      dragConstraints={{ top: 20, bottom: 164 }} // Pixel constraints
                      dragElastic={0}
                      dragMomentum={false}
                      whileDrag={{ scale: 1.2 }}
                      onDragStart={() => {
                        setIsDragging(true);
                      }}
                      onDrag={() => {
                        // No need to set state here, the motion value handles the visual update
                      }}
                      onDragEnd={() => {
                        const progress = (thumbY.get() - 20) / 144 * 3;
                        const seasons: Season[] = ["spring", "summer", "fall", "winter"];
                        const index = Math.round(progress);
                        thumbY.set(20 + (index / 3) * 144);
                        setSeason(seasons[index]);
                        setSeasonProgress(index);
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
                            thumbY.set(20 + (index / 3) * 144);
                          }}
                          whileTap={{ scale: 0.95 }}
                          className={`w-10 h-10 rounded-xl transition-all duration-300 ease-in-out flex items-center justify-center ${
                            season === s
                              ? `${activeSeasonClasses[s]} scale-110`
                              : "bg-white/10 text-white/60 hover:bg-white/20"
                          }`}
                          aria-label={`Set season to ${s}`}
                        >
                          {seasonIcons[s]}
                        </motion.button>
                      ),
                    )}
                  </div>
                </div>
              </div>

              {/* Time of day toggle */}
              <TimeOfDayToggle
                timeOfDay={timeOfDay}
                setTimeOfDay={setTimeOfDay}
                timeProgress={timeProgress}
              />
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setControlsOpen(!controlsOpen)}
          className="backdrop-blur-md bg-slate-900/80 border border-white/20 rounded-r-xl p-2 ml-[-1px] hover:bg-slate-900/90 transition-colors"
          aria-label={controlsOpen ? "Close controls" : "Open controls"}
        >
          {controlsOpen ? (
            <ChevronLeft className="w-5 h-5 text-white/80" />
          ) : (
            <ChevronRight className="w-5 h-5 text-white/80" />
          )}
        </button>
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
    </section>
  );
}

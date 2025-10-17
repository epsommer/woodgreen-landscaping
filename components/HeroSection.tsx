"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
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
  Moon,
  Leaf,
  Snowflake,
  Flower2,
  TreePine,
  Settings,
} from "lucide-react";
import { Season, TimeOfDay } from "./three/Scene";

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
  const [controlsOpen, setControlsOpen] = useState(false);
  const [seasonProgress, setSeasonProgress] = useState(1); // 0=spring, 1=summer, 2=fall, 3=winter
  const [isDragging, setIsDragging] = useState(false);

  // Motion values for sliders/dials
  const timeProgress = useSpring(0, { stiffness: 200, damping: 30 });

  // Horizontal slider setup
  const sliderWidth = 280; // Total width of slider track
  const thumbSize = 20; // Width of thumb
  const travelDistance = sliderWidth - thumbSize; // Actual travel distance

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

  // Motion values for horizontal slider
  const thumbX = useMotionValue((Math.min(3, Math.max(0, seasonProgress)) / 3) * travelDistance);
  const trackWidth = useTransform(
    thumbX,
    [0, travelDistance], // Input range in pixels
    [0, 100], // Output range in percentage
  );
  const trackWidthPercent = useTransform(trackWidth, (v) => `${v}%`);

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

      {/* Universal Settings Button - Top Right Corner */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 400, damping: 25 }}
        onClick={() => setControlsOpen(true)}
        className="absolute top-20 md:top-5 right-4 md:right-6 z-hero-controls w-12 h-12 md:w-14 md:h-14 bg-slate-900/80 backdrop-blur-md hover:bg-slate-900/90 rounded-full shadow-xl border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Open scene settings"
      >
        <Settings className="w-5 h-5 md:w-6 md:h-6" />
      </motion.button>

      {/* Settings Panel - Bottom Sheet on Mobile, Modal on Desktop */}
      {controlsOpen && (
        <>
          {/* Backdrop - minimal blur to show scene changes */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setControlsOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[70]"
          />

          {/* Mobile Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-[80] bg-slate-900/95 backdrop-blur-xl rounded-t-3xl border-t border-white/20 shadow-2xl max-h-[80vh] overflow-y-auto"
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-4">
              <div className="w-12 h-1.5 bg-white/30 rounded-full" />
            </div>

            {/* Content */}
            <div className="px-6 pb-8">
              <h3 className="text-white text-lg font-semibold mb-6 text-center">
                Scene Settings
              </h3>

              {/* Season Selection - Horizontal Slider */}
              <div className="mb-8">
                <p className="text-white/80 text-sm mb-6 font-medium text-center">
                  Choose Season
                </p>

                {/* Horizontal Slider */}
                <div className="relative mx-auto" style={{ width: sliderWidth, height: 76 }}>
                  {/* Season Icons - Positioned along track */}
                  <div className="absolute top-0 left-0 right-0 flex justify-between px-2">
                    {(["spring", "summer", "fall", "winter"] as Season[]).map(
                      (s, index) => (
                        <motion.button
                          key={s}
                          onClick={() => {
                            const targetX = (index / 3) * travelDistance;
                            console.log(`🌸 SEASON BUTTON CLICKED (Mobile): ${s.toUpperCase()}`, {
                              seasonIndex: index,
                              targetX: targetX.toFixed(2),
                              travelDistance,
                              calculation: `(${index} / 3) * ${travelDistance} = ${targetX}`,
                              currentThumbX: thumbX.get().toFixed(2),
                            });
                            setSeason(s);
                            setSeasonProgress(index);
                            thumbX.set(targetX);
                          }}
                          whileTap={{ scale: 0.9 }}
                          className={`w-10 h-10 rounded-xl transition-all duration-300 flex items-center justify-center ${
                            season === s
                              ? `${activeSeasonClasses[s]} scale-110 shadow-lg`
                              : "bg-white/10 text-white/60"
                          }`}
                          aria-label={`Set season to ${s}`}
                        >
                          {seasonIcons[s]}
                        </motion.button>
                      ),
                    )}
                  </div>

                  {/* Slider Track Container */}
                  <div className="absolute bottom-0 left-0 right-0 h-8 flex items-center">
                    {/* Background track */}
                    <div className="absolute left-0 right-0 h-2 bg-white/20 rounded-full" />

                    {/* Active track fill */}
                    <motion.div
                      className="absolute left-0 h-2 bg-nature-500 rounded-full"
                      style={{
                        width: trackWidthPercent,
                      }}
                    />

                    {/* Draggable thumb */}
                    <motion.div
                      className="absolute w-5 h-5 bg-nature-500 rounded-full cursor-grab active:cursor-grabbing shadow-xl border-2 border-white hover:scale-125 transition-transform z-10"
                      style={{ x: thumbX }}
                      drag="x"
                      dragConstraints={{ left: 0, right: travelDistance }}
                      dragElastic={0}
                      dragMomentum={false}
                      whileDrag={{ scale: 1.3 }}
                      onDragStart={() => {
                        console.log("🟢 DRAG START (Mobile):", {
                          initialThumbX: thumbX.get(),
                          travelDistance,
                          currentSeason: season,
                          currentSeasonProgress: seasonProgress,
                        });
                        setIsDragging(true);
                      }}
                      onDrag={() => {
                        const currentX = thumbX.get();
                        const progress = (currentX / travelDistance) * 3;
                        const index = Math.round(progress);
                        const seasons: Season[] = ["spring", "summer", "fall", "winter"];
                        console.log("🔵 DRAGGING (Mobile):", {
                          currentX: currentX.toFixed(2),
                          progress: progress.toFixed(3),
                          calculatedIndex: index,
                          calculatedSeason: seasons[index],
                          currentSeason: season,
                        });
                        // Update season progress continuously for smooth transitions
                        setSeasonProgress(Math.min(3, Math.max(0, progress)));
                        // Update discrete season state when crossing boundaries
                        if (seasons[index] !== season) {
                          setSeason(seasons[index]);
                        }
                      }}
                      onDragEnd={() => {
                        const currentX = thumbX.get();
                        const progress = (currentX / travelDistance) * 3;
                        const index = Math.round(progress);
                        const seasons: Season[] = ["spring", "summer", "fall", "winter"];
                        const snapToX = (index / 3) * travelDistance;
                        console.log("🔴 DRAG END (Mobile):", {
                          finalX: currentX.toFixed(2),
                          progress: progress.toFixed(3),
                          roundedIndex: index,
                          snapToX: snapToX.toFixed(2),
                          snapToSeason: seasons[index],
                          travelDistance,
                          calculation: `(${index} / 3) * ${travelDistance} = ${snapToX}`,
                        });
                        thumbX.set(snapToX);
                        setSeason(seasons[index]);
                        setSeasonProgress(index);
                        setIsDragging(false);
                      }}
                    />
                  </div>
                </div>

                {/* Season Label */}
                <p className="text-white text-center mt-4 text-sm font-semibold capitalize">
                  {season}
                </p>
              </div>

              {/* Time of Day Toggle - Mobile Optimized */}
              <div className="mb-6">
                <p className="text-white/80 text-sm mb-4 font-medium text-center">
                  Time of Day
                </p>
                <div className="flex gap-3">
                  <motion.button
                    onClick={() => {
                      console.log("☀️ DAY button clicked (Mobile)");
                      setTimeOfDay("day");
                    }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-1 h-16 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 ${
                      timeOfDay === "day"
                        ? "bg-[#CEFF65] text-[#2F3B30] shadow-lg scale-105"
                        : "bg-white/10 text-white/60 hover:bg-white/20"
                    }`}
                    aria-label="Set time to day"
                  >
                    <Sun className="w-5 h-5" />
                    <span className="font-semibold">Day</span>
                  </motion.button>
                  <motion.button
                    onClick={() => setTimeOfDay("night")}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-1 h-16 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 ${
                      timeOfDay === "night"
                        ? "bg-slate-700 text-white shadow-lg scale-105"
                        : "bg-white/10 text-white/60 hover:bg-white/20"
                    }`}
                    aria-label="Set time to night"
                  >
                    <Moon className="w-5 h-5" />
                    <span className="font-semibold">Night</span>
                  </motion.button>
                </div>
              </div>

              {/* Close Button */}
              <Button
                onClick={() => setControlsOpen(false)}
                className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 h-14 rounded-2xl text-base font-semibold"
              >
                Close
              </Button>
            </div>
          </motion.div>

          {/* Desktop Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="hidden md:flex fixed inset-0 items-center justify-center z-[80] pointer-events-none"
          >
            <div className="bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl w-[90vw] max-w-md pointer-events-auto"
          >
            {/* Content */}
            <div className="p-8">
              <h3 className="text-white text-2xl font-semibold mb-8 text-center">
                Scene Settings
              </h3>

              {/* Season Selection - Horizontal Slider */}
              <div className="mb-8">
                <p className="text-white/80 text-sm mb-6 font-medium text-center">
                  Choose Season
                </p>

                {/* Horizontal Slider */}
                <div className="relative mx-auto" style={{ width: sliderWidth, height: 80 }}>
                  {/* Season Icons - Positioned along track */}
                  <div className="absolute top-0 left-0 right-0 flex justify-between px-2">
                    {(["spring", "summer", "fall", "winter"] as Season[]).map(
                      (s, index) => (
                        <motion.button
                          key={s}
                          onClick={() => {
                            const targetX = (index / 3) * travelDistance;
                            console.log(`🌸 SEASON BUTTON CLICKED (Desktop): ${s.toUpperCase()}`, {
                              seasonIndex: index,
                              targetX: targetX.toFixed(2),
                              travelDistance,
                              calculation: `(${index} / 3) * ${travelDistance} = ${targetX}`,
                              currentThumbX: thumbX.get().toFixed(2),
                            });
                            setSeason(s);
                            setSeasonProgress(index);
                            thumbX.set(targetX);
                          }}
                          whileTap={{ scale: 0.9 }}
                          whileHover={{ scale: 1.05 }}
                          className={`w-12 h-12 rounded-xl transition-all duration-300 flex items-center justify-center ${
                            season === s
                              ? `${activeSeasonClasses[s]} scale-110 shadow-lg`
                              : "bg-white/10 text-white/60 hover:bg-white/20"
                          }`}
                          aria-label={`Set season to ${s}`}
                        >
                          <div className="scale-125">{seasonIcons[s]}</div>
                        </motion.button>
                      ),
                    )}
                  </div>

                  {/* Slider Track Container */}
                  <div className="absolute bottom-0 left-0 right-0 h-8 flex items-center">
                    {/* Background track */}
                    <div className="absolute left-0 right-0 h-2 bg-white/20 rounded-full" />

                    {/* Active track fill */}
                    <motion.div
                      className="absolute left-0 h-2 bg-nature-500 rounded-full"
                      style={{
                        width: trackWidthPercent,
                      }}
                    />

                    {/* Draggable thumb */}
                    <motion.div
                      className="absolute w-5 h-5 bg-nature-500 rounded-full cursor-grab active:cursor-grabbing shadow-xl border-2 border-white hover:scale-125 transition-transform z-10"
                      style={{ x: thumbX }}
                      drag="x"
                      dragConstraints={{ left: 0, right: travelDistance }}
                      dragElastic={0}
                      dragMomentum={false}
                      whileDrag={{ scale: 1.3 }}
                      onDragStart={() => {
                        console.log("🟢 DRAG START (Desktop):", {
                          initialThumbX: thumbX.get(),
                          travelDistance,
                          currentSeason: season,
                          currentSeasonProgress: seasonProgress,
                        });
                        setIsDragging(true);
                      }}
                      onDrag={() => {
                        const currentX = thumbX.get();
                        const progress = (currentX / travelDistance) * 3;
                        const index = Math.round(progress);
                        const seasons: Season[] = ["spring", "summer", "fall", "winter"];
                        console.log("🔵 DRAGGING (Desktop):", {
                          currentX: currentX.toFixed(2),
                          progress: progress.toFixed(3),
                          calculatedIndex: index,
                          calculatedSeason: seasons[index],
                          currentSeason: season,
                        });
                        // Update season progress continuously for smooth transitions
                        setSeasonProgress(Math.min(3, Math.max(0, progress)));
                        // Update discrete season state when crossing boundaries
                        if (seasons[index] !== season) {
                          setSeason(seasons[index]);
                        }
                      }}
                      onDragEnd={() => {
                        const currentX = thumbX.get();
                        const progress = (currentX / travelDistance) * 3;
                        const index = Math.round(progress);
                        const seasons: Season[] = ["spring", "summer", "fall", "winter"];
                        const snapToX = (index / 3) * travelDistance;
                        console.log("🔴 DRAG END (Desktop):", {
                          finalX: currentX.toFixed(2),
                          progress: progress.toFixed(3),
                          roundedIndex: index,
                          snapToX: snapToX.toFixed(2),
                          snapToSeason: seasons[index],
                          travelDistance,
                          calculation: `(${index} / 3) * ${travelDistance} = ${snapToX}`,
                        });
                        thumbX.set(snapToX);
                        setSeason(seasons[index]);
                        setSeasonProgress(index);
                        setIsDragging(false);
                      }}
                    />
                  </div>
                </div>

                {/* Season Label */}
                <p className="text-white text-center mt-4 text-base font-semibold capitalize">
                  {season}
                </p>
              </div>

              {/* Time of Day Toggle - Desktop Optimized */}
              <div className="mb-8">
                <p className="text-white/80 text-sm mb-5 font-medium text-center">
                  Time of Day
                </p>
                <div className="flex gap-4">
                  <motion.button
                    onClick={() => setTimeOfDay("day")}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    className={`flex-1 h-20 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 ${
                      timeOfDay === "day"
                        ? "bg-[#CEFF65] text-[#2F3B30] shadow-xl"
                        : "bg-white/10 text-white/60 hover:bg-white/20"
                    }`}
                    aria-label="Set time to day"
                  >
                    <Sun className="w-6 h-6" />
                    <span className="text-lg font-semibold">Day</span>
                  </motion.button>
                  <motion.button
                    onClick={() => setTimeOfDay("night")}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    className={`flex-1 h-20 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 ${
                      timeOfDay === "night"
                        ? "bg-slate-700 text-white shadow-xl"
                        : "bg-white/10 text-white/60 hover:bg-white/20"
                    }`}
                    aria-label="Set time to night"
                  >
                    <Moon className="w-6 h-6" />
                    <span className="text-lg font-semibold">Night</span>
                  </motion.button>
                </div>
              </div>

              {/* Close Button */}
              <Button
                onClick={() => setControlsOpen(false)}
                className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 h-16 rounded-2xl text-lg font-semibold"
              >
                Close
              </Button>
            </div>
            </div>
          </motion.div>
        </>
      )}

    {/* Hero Card - raised position with mobile-first design */}
    <div className="absolute bottom-20 md:bottom-32 left-0 right-0 z-hero-content px-4 md:px-6">
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
          className="backdrop-blur-md bg-black/30 rounded-2xl p-6 md:p-8 border border-white/20"
        >
          {/* Mobile-optimized heading - larger, bolder */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-5 bg-gradient-to-r from-nature-400 to-nature-600 bg-clip-text text-transparent text-center leading-tight">
            Transform Your Outdoor Space
          </h1>

          {/* Mobile-optimized subtext - increased readability */}
          <p className="text-base md:text-lg lg:text-xl text-white/90 mb-6 md:mb-7 text-center leading-relaxed">
            Professional landscaping & snow removal services for the Greater Toronto Area
          </p>

          {/* Mobile-first CTA buttons - full width on mobile, thumb-friendly positioning */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            {/* Primary CTA - full width on mobile for maximum tap area */}
            <Button
              size="lg"
              onClick={onGetStarted}
              className="w-full sm:flex-1 bg-nature-500 hover:bg-nature-600 text-white px-6 py-6 md:py-7 text-base md:text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl min-h-[56px] md:min-h-[60px]"
            >
              Get Free Quote
            </Button>

            {/* Secondary CTA - click-to-call for mobile */}
            <Button
              size="lg"
              asChild
              className="w-full sm:flex-1 bg-white/90 hover:bg-white text-nature-700 px-6 py-6 md:py-7 text-base md:text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl min-h-[56px] md:min-h-[60px]"
            >
              <a href="tel:+16473278401" className="flex items-center justify-center gap-2">
                <span className="text-xl">📞</span>
                <span>Call Now</span>
              </a>
            </Button>
          </div>

          {/* Trust indicator - subtle on mobile */}
          <p className="text-xs md:text-sm text-white/60 text-center mt-4 md:mt-5">
            Serving the Greater Toronto Area Since 2023
          </p>
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

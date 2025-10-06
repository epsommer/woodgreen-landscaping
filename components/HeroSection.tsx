"use client";

import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Leaf, Snowflake, Flower2, TreePine } from "lucide-react";
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

  const seasonIcons = {
    spring: <Flower2 className="w-4 h-4" />,
    summer: <Sun className="w-4 h-4" />,
    fall: <Leaf className="w-4 h-4" />,
    winter: <Snowflake className="w-4 h-4" />,
  };

  // Dynamic background based on time of day
  const backgroundGradient =
    timeOfDay === "day"
      ? "bg-gradient-to-b from-sky-400 via-blue-300 to-blue-200"
      : "bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700";

  return (
    <section className={`relative h-screen w-full overflow-hidden transition-colors duration-1000 ${backgroundGradient}`}>
      {/* 3D Scene Background */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="w-full h-full bg-slate-900" />}>
          <Scene season={season} timeOfDay={timeOfDay} />
        </Suspense>
      </div>

      {/* Glassmorphic overlay content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl"
        >
          {/* Hero text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="backdrop-blur-md bg-black/30 rounded-3xl p-8 md:p-12 border border-white/20"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-nature-400 to-nature-600 bg-clip-text text-transparent">
              Transform Your Outdoor Space
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Experience the beauty of nature through our expert landscaping
              services
            </p>

            <Button
              size="lg"
              onClick={onGetStarted}
              className="bg-nature-500 hover:bg-nature-600 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105"
            >
              Get Started
            </Button>
          </motion.div>

          {/* Interactive controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-8 flex flex-col md:flex-row gap-4 justify-center items-center"
          >
            {/* Season controls */}
            <div className="backdrop-blur-md bg-white/10 rounded-2xl p-4 border border-white/20">
              <p className="text-white/80 text-sm mb-3 font-medium">
                Season
              </p>
              <div className="flex gap-2">
                {(["spring", "summer", "fall", "winter"] as Season[]).map(
                  (s) => (
                    <button
                      key={s}
                      onClick={() => setSeason(s)}
                      className={`p-3 rounded-xl transition-all duration-300 ${
                        season === s
                          ? "bg-nature-500 text-white scale-110"
                          : "bg-white/10 text-white/60 hover:bg-white/20"
                      }`}
                      aria-label={`Set season to ${s}`}
                    >
                      {seasonIcons[s]}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Time of day toggle */}
            <div className="backdrop-blur-md bg-white/10 rounded-2xl p-4 border border-white/20">
              <p className="text-white/80 text-sm mb-3 font-medium">
                Time of Day
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setTimeOfDay("day")}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    timeOfDay === "day"
                      ? "bg-nature-500 text-white scale-110"
                      : "bg-white/10 text-white/60 hover:bg-white/20"
                  }`}
                  aria-label="Set to day time"
                >
                  <Sun className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setTimeOfDay("night")}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    timeOfDay === "night"
                      ? "bg-nature-500 text-white scale-110"
                      : "bg-white/10 text-white/60 hover:bg-white/20"
                  }`}
                  aria-label="Set to night time"
                >
                  <Moon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-12 flex justify-center"
          >
            <button
              onClick={() => {
                const nextSection = document.querySelector("#services");
                nextSection?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex flex-col items-center text-white/60 hover:text-white/90 transition-colors cursor-pointer"
              aria-label="Scroll to services section"
            >
              <p className="text-sm mb-2">Explore</p>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <TreePine className="w-6 h-6" />
              </motion.div>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

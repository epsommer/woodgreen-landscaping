"use client";

import { useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import { Scene, Season } from "../three/Scene";
import { Button } from "@/components/ui/button";

const seasons: Season[] = ["spring", "summer", "fall", "winter"];

const seasonInfo = {
  spring: {
    name: "Spring",
    description: "Fresh growth, vibrant blooms, and renewal",
  },
  summer: {
    name: "Summer",
    description: "Lush greenery, full canopy, peak growth",
  },
  fall: {
    name: "Fall",
    description: "Brilliant colors, preparation for dormancy",
  },
  winter: {
    name: "Winter",
    description: "Dormant beauty, structural elegance",
  },
};

export function SeasonalDemo() {
  const [seasonIndex, setSeasonIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  const currentSeason = seasons[seasonIndex];

  // Auto-cycle through seasons
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setSeasonIndex((prev) => (prev + 1) % seasons.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeasonIndex(parseInt(e.target.value));
    setAutoPlay(false); // Stop autoplay when user manually changes
  };

  return (
    <section className="py-20 bg-white dark:bg-[#2F3B30] text-[#2F3B30] dark:text-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">4-Season Front Yard Visualization</h2>
          <p className="text-xl text-[#4A5D4C] dark:text-gray-400 max-w-3xl mx-auto">
            See How Year-Round Care Keeps Your Home Beautiful Through Every Season
          </p>
        </div>

        {/* Season slider */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="range"
                min="0"
                max="3"
                step="1"
                value={seasonIndex}
                onChange={handleSliderChange}
                className="w-full h-2 bg-[#F0F4F0] dark:bg-white/10 rounded-lg appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-6
                  [&::-webkit-slider-thumb]:h-6
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-nature-500
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:shadow-lg
                  [&::-moz-range-thumb]:w-6
                  [&::-moz-range-thumb]:h-6
                  [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:bg-nature-500
                  [&::-moz-range-thumb]:border-0
                  [&::-moz-range-thumb]:cursor-pointer
                  [&::-moz-range-thumb]:shadow-lg"
              />
              <div className="flex justify-between mt-2 px-1">
                {seasons.map((season, idx) => (
                  <span
                    key={season}
                    className={`text-sm font-medium transition-all duration-300 ${
                      idx === seasonIndex
                        ? "text-nature-600 dark:text-nature-400 scale-110"
                        : "text-[#4A5D4C] dark:text-gray-500"
                    }`}
                  >
                    {seasonInfo[season].name}
                  </span>
                ))}
              </div>
            </div>

            {/* Auto-play toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setAutoPlay(!autoPlay)}
              className="border-[#2F3B30]/20 dark:border-white/20 hover:bg-[#F0F4F0] dark:hover:bg-white/10"
            >
              {autoPlay ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Current season info */}
        <div className="text-center mb-8">
          <p className="text-[#4A5D4C] dark:text-gray-300 text-lg">{seasonInfo[currentSeason].description}</p>
        </div>

        {/* 3D Scene */}
        <div className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-[#2F3B30]/20 dark:border-white/10 shadow-2xl">
          <Scene season={currentSeason} timeOfDay="day" />

          {/* Season label overlay */}
          <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-[#2F3B30]/20 dark:border-white/20">
            <span className="text-nature-600 dark:text-nature-300 font-semibold">{seasonInfo[currentSeason].name}</span>
          </div>
        </div>

        {/* Benefits text */}
        <div className="mt-12 text-center max-w-3xl mx-auto">
          <p className="text-[#4A5D4C] dark:text-gray-400 leading-relaxed">
            Professional year-round care ensures your landscape thrives through changing seasons.
            From spring renewal to winter protection, our comprehensive services keep your outdoor
            space beautiful 365 days a year.
          </p>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState, useEffect } from "react";
import { ServiceStationsCanvas } from "./three/services/ServiceStationsCanvas";
import { ServiceType } from "./three/services/ServiceStationsScene";
import { ServiceNav } from "./services/ServiceNav";
import { ServiceDetailPanel } from "./services/ServiceDetailPanel";
import { SeasonalDemo } from "./services/SeasonalDemo";
import { PhotoGallery } from "./services/PhotoGallery";
import { EnhancedCTA } from "./services/EnhancedCTA";
import { ArrowDown } from "lucide-react";

export function ServicesNew() {
  const [activeStation, setActiveStation] = useState<ServiceType>("lawn");
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [autoRotate, setAutoRotate] = useState(false);

  // Auto-rotate through stations if idle
  useEffect(() => {
    if (!autoRotate) return;

    const stations: ServiceType[] = ["lawn", "garden", "tree", "irrigation"];
    let currentIndex = stations.indexOf(activeStation);

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % stations.length;
      setActiveStation(stations[currentIndex]);
    }, 15000); // 15 seconds per station

    return () => clearInterval(interval);
  }, [autoRotate, activeStation]);

  const handleStationChange = (station: ServiceType) => {
    setActiveStation(station);
    setAutoRotate(false); // Stop auto-rotate when user interacts
  };

  const handleStationClick = (station: ServiceType) => {
    setSelectedService(station);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F4F0] dark:bg-[#1C1C1C] text-[#2F3B30] dark:text-white">
      {/* Hero Section - 3D Service Stations */}
      <section className="relative h-screen">
        {/* 3D Canvas */}
        <ServiceStationsCanvas
          activeStation={activeStation}
          className="absolute inset-0 w-full h-full"
        />

        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none" />

        {/* Hero text */}
        <div className="absolute top-0 left-0 right-0 pt-32 pb-20 z-20 pointer-events-none">
          <div className="px-8 md:px-16 max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] animate-in fade-in duration-1000">
              Professional Services, Zero Emissions
            </h1>
            <p className="text-xl md:text-2xl text-white/95 drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)] animate-in fade-in duration-1000 delay-300">
              Design-focused landscaping powered by 100% battery equipment
            </p>
          </div>
        </div>

        {/* Floating navigation */}
        <ServiceNav
          activeStation={activeStation}
          onStationChange={handleStationChange}
        />

        {/* Info overlay - Click to learn more */}
        <div className="absolute bottom-48 md:bottom-56 left-8 md:left-16 z-20">
          <button
            onClick={() => handleStationClick(activeStation)}
            className="group bg-nature-500/90 hover:bg-nature-600 backdrop-blur-md px-8 py-4 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border border-nature-400/50"
          >
            <span className="flex items-center gap-2">
              Learn More About This Service
              <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </span>
          </button>
        </div>

        {/* Skip button for accessibility */}
        <a
          href="#seasonal-demo"
          className="absolute top-20 right-4 text-sm text-[#4A5D4C] dark:text-gray-400 hover:text-[#2F3B30] dark:hover:text-white underline z-30"
        >
          Skip 3D Experience
        </a>
      </section>

      {/* Service Detail Panel (Slide-in) */}
      <ServiceDetailPanel
        service={selectedService}
        onClose={() => setSelectedService(null)}
      />

      {/* Seasonal Transformation Demo */}
      <div id="seasonal-demo">
        <SeasonalDemo />
      </div>

      {/* Photo Gallery */}
      <PhotoGallery />

      {/* Enhanced CTA */}
      <EnhancedCTA />

      {/* Simple footer note */}
      <div className="py-8 text-center text-[#4A5D4C] dark:text-gray-500 text-sm border-t border-[#2F3B30]/20 dark:border-white/10">
        <p>Zero-emission, design-focused landscaping • Greater Toronto Area • One designer, complete dedication</p>
      </div>
    </div>
  );
}

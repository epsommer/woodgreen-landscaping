"use client";

import { Sun, TreePine, Droplets, Flower } from "lucide-react";
import { ServiceType } from "../three/services/ServiceStationsScene";

interface ServiceNavProps {
  activeStation: ServiceType;
  onStationChange: (station: ServiceType) => void;
}

const services: Array<{ type: ServiceType; icon: React.ReactNode; label: string }> = [
  { type: "lawn", icon: <Sun className="w-5 h-5" />, label: "Lawn Care" },
  { type: "garden", icon: <Flower className="w-5 h-5" />, label: "Garden Design" },
  { type: "tree", icon: <TreePine className="w-5 h-5" />, label: "Tree Services" },
  { type: "irrigation", icon: <Droplets className="w-5 h-5" />, label: "Irrigation" },
];

export function ServiceNav({ activeStation, onStationChange }: ServiceNavProps) {
  return (
    <div className="absolute bottom-32 right-8 md:right-16 z-30 grid grid-cols-2 gap-3">
      {services.map((service) => {
        const isActive = activeStation === service.type;

        return (
          <button
            key={service.type}
            onClick={() => onStationChange(service.type)}
            className={`
              group relative px-6 py-3 rounded-xl font-medium transition-all duration-300
              backdrop-blur-xl border
              ${
                isActive
                  ? "bg-nature-500/90 border-nature-400 text-white scale-110 shadow-lg shadow-nature-500/50"
                  : "bg-white/80 dark:bg-black/40 border-[#2F3B30]/20 dark:border-white/10 text-[#2F3B30] dark:text-gray-300 hover:bg-white dark:hover:bg-white/10 hover:border-[#2F3B30]/30 dark:hover:border-white/20"
              }
            `}
            aria-label={`View ${service.label}`}
          >
            <div className="flex items-center gap-2">
              {service.icon}
              <span className="hidden lg:inline">{service.label}</span>
            </div>

            {/* Active indicator glow */}
            {isActive && (
              <div className="absolute inset-0 rounded-xl bg-nature-400/20 animate-pulse" />
            )}
          </button>
        );
      })}
    </div>
  );
}

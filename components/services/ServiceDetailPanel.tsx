"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceType } from "../three/services/ServiceStationsScene";

interface ServiceDetail {
  name: string;
  icon: string;
  tagline: string;
  description: string;
  included: string[];
  pricing: {
    name: string;
    description: string;
  }[];
  timeline: string;
  testimonial?: {
    text: string;
    author: string;
  };
}

const serviceDetails: Record<ServiceType, ServiceDetail> = {
  lawn: {
    name: "Lawn Care",
    icon: "🌿",
    tagline: "Zero-emission lawn maintenance with professional DeWalt 60V battery equipment",
    description:
      "Gallery-worthy lawn care with 100% battery-powered equipment. My professional DeWalt 60V Flexvolt lineup delivers the same power as gas equipment, but with zero emissions and quiet operation your neighbors will appreciate. Your grass stays lush and green while protecting the environment.",
    included: [
      "Professional Mowing & Edging (Battery-Powered)",
      "Fertilization Programs",
      "Aeration & Overseeding",
      "Eco-Conscious Weed Control",
      "Seasonal Cleanup",
      "Lawn Health Assessment",
    ],
    pricing: [
      { name: "Weekly", description: "Full service every week" },
      { name: "Bi-Weekly", description: "Maintenance every 2 weeks" },
      { name: "Monthly", description: "Essential care monthly" },
    ],
    timeline: "Ongoing service",
  },
  garden: {
    name: "Garden Design",
    icon: "🌸",
    tagline: "Where graphic design meets landscape artistry",
    description:
      "With a background in graphic design, I bring an artistic eye to every landscape project. From initial sketch to final planting, I create stunning, sustainable gardens that reflect your personality and respect the environment.",
    included: [
      "On-Site Consultation",
      "Custom 3D Design Plans",
      "Plant Selection & Sourcing",
      "Professional Installation",
      "Mulching & Bed Preparation",
      "Seasonal Color Planning",
    ],
    pricing: [
      { name: "Consultation", description: "Design meeting + plan" },
      { name: "Design + Install", description: "Complete package" },
      { name: "Custom Project", description: "Request detailed quote" },
    ],
    timeline: "2-6 weeks depending on scope",
  },
  tree: {
    name: "Tree Services",
    icon: "🌳",
    tagline: "Expert tree care with eco-conscious practices",
    description:
      "Comprehensive tree care services using battery-powered equipment wherever possible. From routine pruning to safe removal, I prioritize tree health while minimizing environmental impact. Every cut is made with precision and care.",
    included: [
      "Professional Pruning & Trimming",
      "Tree Health Assessment",
      "Disease & Pest Treatment",
      "Safe Tree Removal",
      "Stump Grinding",
      "Tree Planting & Selection",
    ],
    pricing: [
      { name: "Per Tree", description: "Evaluated individually" },
      { name: "Property Assessment", description: "Multiple trees" },
      { name: "Custom Quote", description: "Based on scope" },
    ],
    timeline: "1-3 days per tree",
  },
  irrigation: {
    name: "Irrigation Systems",
    icon: "💧",
    tagline: "Water-smart systems that conserve resources and save money",
    description:
      "Eco-conscious irrigation design that reduces water waste while keeping your landscape thriving. I create custom systems with smart controllers that deliver the right amount of water exactly where it's needed—saving you money and protecting our environment.",
    included: [
      "Custom System Design",
      "Professional Installation",
      "Smart Controller Setup",
      "Seasonal Maintenance",
      "Repair Services",
      "Winterization",
    ],
    pricing: [
      { name: "Design", description: "Coverage area evaluation" },
      { name: "Installation", description: "Based on property size" },
      { name: "Maintenance", description: "Annual service plans" },
    ],
    timeline: "3-5 days installation",
  },
};

interface ServiceDetailPanelProps {
  service: ServiceType | null;
  onClose: () => void;
}

export function ServiceDetailPanel({ service, onClose }: ServiceDetailPanelProps) {
  if (!service) return null;

  const details = serviceDetails[service];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-white/95 dark:bg-black/90 backdrop-blur-xl border-l border-[#2F3B30]/20 dark:border-white/10 z-50 overflow-y-auto animate-in slide-in-from-right duration-300">
        <div className="p-8 text-[#2F3B30] dark:text-white">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close panel"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="mb-8">
            <div className="text-6xl mb-4">{details.icon}</div>
            <h2 className="text-3xl font-bold mb-2 text-[#2F3B30] dark:text-white">{details.name}</h2>
            <p className="text-nature-600 dark:text-nature-400 text-lg">{details.tagline}</p>
          </div>

          <div className="h-px bg-[#2F3B30]/20 dark:bg-white/10 mb-8" />

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3 text-[#2F3B30] dark:text-white">About This Service</h3>
            <p className="text-[#4A5D4C] dark:text-gray-300 leading-relaxed">{details.description}</p>
          </div>

          {/* What&apos;s Included */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-[#2F3B30] dark:text-white">What&apos;s Included</h3>
            <ul className="space-y-3">
              {details.included.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-nature-600 dark:text-nature-400 mt-1">•</span>
                  <span className="text-[#4A5D4C] dark:text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="h-px bg-[#2F3B30]/20 dark:bg-white/10 mb-8" />

          {/* Pricing Options */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-[#2F3B30] dark:text-white">Pricing Options</h3>
            <div className="grid grid-cols-1 gap-4">
              {details.pricing.map((tier, i) => (
                <div
                  key={i}
                  className="bg-[#F0F4F0] dark:bg-white/5 border border-[#2F3B30]/20 dark:border-white/10 rounded-lg p-4 hover:bg-white dark:hover:bg-white/10 transition-colors"
                >
                  <div className="font-semibold text-nature-600 dark:text-nature-400">{tier.name}</div>
                  <div className="text-sm text-[#4A5D4C] dark:text-gray-400 mt-1">{tier.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-8">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-[#4A5D4C] dark:text-gray-400">Typical Timeline:</span>
              <span className="text-nature-600 dark:text-nature-400 font-medium">{details.timeline}</span>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            size="lg"
            className="w-full bg-nature-500 hover:bg-nature-600 text-white font-semibold"
          >
            Get Free Estimate
          </Button>
        </div>
      </div>
    </>
  );
}

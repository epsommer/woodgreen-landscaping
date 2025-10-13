"use client";

import { TimelineTreeCanvas } from "./three/about/TimelineTreeCanvas";
import { CapabilitiesShowcaseCanvas } from "./three/about/CapabilitiesShowcaseCanvas";
import { ServiceGlobeCanvas } from "./three/about/ServiceGlobeCanvas";
import { PortalCTA } from "./about/PortalCTA";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Users, Leaf, CheckCircle2, Battery, ChevronDown } from "lucide-react";

export function AboutNew() {
  const stats = [
    { value: "20+", label: "Years Legacy Experience", color: "#CEFF65" },
    { value: "0 Emissions", label: "100% Battery Powered", color: "#4ade80" },
    { value: "100%", label: "Personal Attention", color: "#60a5fa" },
    { value: "Design + Earth", label: "Sustainable Fusion", color: "#ff6b9d" },
  ];

  const values = [
    {
      icon: <Award className="w-8 h-8" />,
      title: "Designer's Eye",
      description: "Graphic design background brings artistic precision to landscape planning",
      color: "#CEFF65",
    },
    {
      icon: <Battery className="w-8 h-8" />,
      title: "Eco-Conscious Care",
      description: "100% battery-powered equipment (DeWalt 60V + Stihl coming) - Zero emissions, quiet operation",
      color: "#4ade80",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Personal Attention",
      description: "One person means one vision—your project gets my complete focus",
      color: "#22c55e",
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Legacy Training",
      description: "Learned from 20+ years of hands-on experience with modern sustainable practices",
      color: "#60a5fa",
    },
    {
      icon: <CheckCircle2 className="w-8 h-8" />,
      title: "Full-Service Control",
      description: "From initial sketch to final planting, I handle every detail",
      color: "#ff6b9d",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F4F0] dark:bg-[#1C1C1C] text-[#2F3B30] dark:text-white">
      {/* Hero: 3D Timeline Tree */}
      <section className="relative h-[85vh]">
        <TimelineTreeCanvas className="absolute inset-0 w-full h-full" />

        {/* Hero text overlay */}
        <div className="absolute top-0 left-0 right-0 pt-32 pb-20 text-center md:text-left md:pl-16 lg:pl-32 z-20 pointer-events-none">
          <h1 className="text-4xl md:text-7xl font-bold mb-4 text-[#2F3B30] dark:text-white">
            Where Design Meets the Earth... Gently
          </h1>
          <p className="text-lg md:text-2xl text-[#4A5D4C] dark:text-gray-300 max-w-3xl mx-auto px-4">
            One Designer. One Vision. Zero Emissions.
          </p>
        </div>

        {/* Skip button for accessibility */}
        <a
          href="#story"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 text-sm text-[#4A5D4C] dark:text-gray-400 hover:text-[#2F3B30] dark:hover:text-white transition-all group"
        >
          <span className="group-hover:underline">Skip to Story</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </a>
      </section>

      {/* Our Story Section */}
      <section id="story" className="py-20 bg-white dark:bg-[#2F3B30]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-8 text-center text-[#2F3B30] dark:text-white">
              My Story
            </h2>

            <div className="space-y-6 text-lg text-[#4A5D4C] dark:text-gray-300 leading-relaxed">
              <p className="text-xl text-nature-600 dark:text-nature-400 font-medium">
                From Woodgreen Roots to Toronto Growth
              </p>

              <p>
                My love for landscaping began in <span className="text-nature-600 dark:text-nature-400 font-semibold">Woodgreen, Ontario</span>, where I apprenticed under my father—a master landscaper with over two decades of experience transforming outdoor spaces. In that small Ontario community, I learned that great landscaping isn&apos;t just about plants and patterns; it&apos;s about understanding the land, respecting nature&apos;s rhythms, and creating spaces that live and breathe.
              </p>

              <p>
                After years of apprenticing in Woodgreen and working with various landscaping companies across Ontario, I made the decision to move to Toronto to be closer to family. But I brought more than just landscaping skills with me—I carried a vision and the name of the place that shaped me.
              </p>

              <p>
                With a background in graphic design, I saw something others didn&apos;t: the natural connection between visual storytelling and landscape creation. <span className="text-nature-600 dark:text-nature-400 font-semibold">Every garden is a canvas. Every yard tells a story.</span> Every outdoor space is a design waiting to be revealed.
              </p>

              <p>
                In 2022, I started working with local neighbors in Toronto—helping them transform their outdoor spaces one project at a time. What began as word-of-mouth work quickly grew as neighbors told friends, and those friends told others. I named the business <span className="text-nature-600 dark:text-nature-400 font-semibold">Woodgreen Landscaping</span> to honor where my journey began—where the artistic precision of graphic design meets the organic craft I learned in those Ontario fields. From the first sketch on paper to the final plant in the ground, every project is both art and earth.
              </p>

              <p>
                But creating beautiful landscapes isn&apos;t enough—they need to be sustainable too. That&apos;s why Woodgreen operates with <span className="text-nature-600 dark:text-nature-400 font-semibold">100% battery-powered equipment</span>. My professional DeWalt 60V Flexvolt lineup delivers the same power as gas equipment, but with zero emissions and quiet operation your neighbors will appreciate. And I&apos;m expanding to even higher-end Stihl battery equipment, because sustainability and professionalism go hand-in-hand.
              </p>

              <p>
                Every design choice considers environmental impact. Native plant selections. Water-efficient irrigation. Eco-conscious maintenance. This is landscaping for the future—beautiful, functional, and kind to the earth.
              </p>

              <p className="text-xl text-nature-600 dark:text-nature-400 italic">
                As a one-person operation, I offer something larger companies can&apos;t: personal attention, artistic vision, complete creative control, and genuinely eco-friendly practices.
              </p>

              <p>
                What started with neighbors three years ago is now expanding beyond the local community. I&apos;m currently formalizing Woodgreen Landscaping to serve the Greater Toronto Area more broadly—adding capabilities like hardscapes while maintaining the boutique, personal approach that got me here.
              </p>

              <p className="text-xl font-semibold text-center pt-6">
                From sketch to soil, from neighbors to new friends—let&apos;s create something extraordinary together.
              </p>
            </div>

            {/* Animated Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  className="bg-[#F0F4F0] dark:bg-[#4A5D4C] border-0 hover:bg-white dark:hover:bg-[#3A4A3A] transition-all duration-300 hover:scale-105"
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className="text-4xl font-bold mb-2"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-sm text-[#4A5D4C] dark:text-gray-400">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section: 3D Islands */}
      <section className="py-20 bg-[#F0F4F0] dark:bg-[#1C1C1C]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center text-[#2F3B30] dark:text-white">
            What I Bring to Your Project
          </h2>
          <p className="text-lg md:text-xl text-[#4A5D4C] dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            From design to installation, I handle every aspect with artistic precision and personal care
          </p>

          {/* 3D Capabilities Islands */}
          <div className="relative h-[600px] rounded-2xl overflow-hidden border border-[#2F3B30]/20 dark:border-white/10 shadow-2xl">
            <CapabilitiesShowcaseCanvas className="w-full h-full" />
          </div>
        </div>
      </section>

      {/* Why Work With Me */}
      <section className="py-20 bg-white dark:bg-[#2F3B30]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center text-[#2F3B30] dark:text-white">
            Why Work With Me
          </h2>
          <p className="text-lg md:text-xl text-[#4A5D4C] dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            The advantages of boutique, personalized landscaping service
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
            {values.map((value, index) => (
              <Card
                key={index}
                className="bg-[#F0F4F0] dark:bg-[#4A5D4C] border-0 hover:bg-white dark:hover:bg-[#3A4A3A] transition-all duration-300 group"
              >
                <CardContent className="p-8 text-center">
                  <div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${value.color}20`, color: value.color }}
                  >
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#2F3B30] dark:text-white">{value.title}</h3>
                  <p className="text-[#4A5D4C] dark:text-gray-400 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Area: 3D Globe */}
      <section className="py-20 bg-[#F0F4F0] dark:bg-[#1C1C1C]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center text-[#2F3B30] dark:text-white">
            Where I Serve
          </h2>
          <p className="text-lg md:text-xl text-[#4A5D4C] dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Serving the Greater Toronto Area with zero-emission, design-focused landscaping
            <br />
            <span className="text-nature-600 dark:text-nature-400 text-base">Boutique service. Sustainable impact. One project at a time.</span>
          </p>

          {/* 3D Globe */}
          <div className="relative h-[600px] rounded-2xl overflow-hidden border border-[#2F3B30]/20 dark:border-white/10 shadow-2xl max-w-4xl mx-auto">
            <ServiceGlobeCanvas className="w-full h-full" />
          </div>
        </div>
      </section>

      {/* CTA: Garden Portal */}
      <PortalCTA />
    </div>
  );
}

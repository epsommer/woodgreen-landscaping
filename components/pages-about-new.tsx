"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { PortalCTA } from "./about/PortalCTA";

// Dynamically import Canvas components to avoid SSR issues with useTheme
const TimelineTreeCanvas = dynamic(
  () => import("./three/about/TimelineTreeCanvas").then((mod) => mod.TimelineTreeCanvas),
  { ssr: false }
);
const CapabilitiesShowcaseCanvas = dynamic(
  () => import("./three/about/CapabilitiesShowcaseCanvas").then((mod) => mod.CapabilitiesShowcaseCanvas),
  { ssr: false }
);
const ServiceGlobeCanvas = dynamic(
  () => import("./three/about/ServiceGlobeCanvas").then((mod) => mod.ServiceGlobeCanvas),
  { ssr: false }
);
import { Card, CardContent } from "@/components/ui/card";
import {
  Award,
  Users,
  Leaf,
  CheckCircle2,
  Battery,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export function AboutNew() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
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
      description:
        "Graphic design background brings artistic precision to landscape planning",
      color: "#CEFF65",
      detailedContent:
        "My professional background in graphic design means I approach every landscape with an artist's perspective. I see composition, balance, colour theory, and visual flow in ways others might miss. Before a single plant goes in the ground, I sketch, visualise, and refine the design until it's perfect. Your landscape isn't just functional. It's a living work of art.",
    },
    {
      icon: <Battery className="w-8 h-8" />,
      title: "Eco-Conscious Care",
      description:
        "100% battery-powered equipment - Zero emissions, quiet operation",
      color: "#4ade80",
      detailedContent:
        "Every piece of equipment I use is battery-powered: no gas, no fumes, no noise pollution. My professional-grade DeWalt 60V Flexvolt lineup delivers the same power as traditional gas equipment, but your neighbors will actually appreciate the quiet operation. I'm expanding to Stihl's premium battery systems because sustainability isn't a compromise. It's a commitment to doing landscaping the right way.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Personal Attention",
      description:
        "One person means one vision: your project gets my complete focus",
      color: "#22c55e",
      detailedContent:
        "As a one-person operation, you're not handed off between salespeople, designers, and crews. You work with me from consultation to completion. I answer your calls, understand your vision, design your space, and personally execute every detail. No miscommunication, no disconnect between planning and execution. Just consistent, focused attention on making your outdoor space extraordinary.",
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Legacy Training",
      description:
        "Learned from 20+ years of hands-on experience with modern sustainable practices",
      color: "#60a5fa",
      detailedContent:
        "I didn't learn landscaping from a manual. I learned it from my father, a master craftsman with over two decades shaping the land around Woodgreen, Ontario. He taught me to read soil, understand drainage, respect native ecosystems, and build landscapes that work with nature, not against it. Now I bring that legacy knowledge to Toronto, blended with modern sustainable techniques and eco-friendly practices.",
    },
    {
      icon: <CheckCircle2 className="w-8 h-8" />,
      title: "Full-Service Control",
      description:
        "From initial sketch to final planting, I handle every detail",
      color: "#ff6b9d",
      detailedContent:
        "Design. Planning. Installation. Planting. Maintenance. I handle it all. There's no fragmentation, no lost context between different teams. When I design something, I know exactly how to build it because I'm the one doing the work. This unified approach means fewer surprises, better quality control, and a finished landscape that perfectly matches the original vision.",
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
                My love for landscaping began in{" "}
                <span className="text-nature-600 dark:text-nature-400 font-semibold">
                  Woodgreen, Ontario
                </span>
                , where I apprenticed under my father, a master landscaper with
                over two decades of experience transforming outdoor spaces. In
                that small Ontario community, I learned that great landscaping
                isn&apos;t just about plants and patterns; it&apos;s about
                understanding the land, respecting nature&apos;s rhythms, and
                creating spaces that live and breathe.
              </p>

              <p>
                After years of apprenticing in Woodgreen and working with
                various landscaping companies across Ontario, I made the
                decision to move to Toronto to be closer to family. But I
                brought more than just landscaping skills with me. I carried a
                vision and the name of the place that shaped me.
              </p>

              <p>
                With a background in graphic design, I saw something others
                didn&apos;t: the natural connection between visual storytelling
                and landscape creation.{" "}
                <span className="text-nature-600 dark:text-nature-400 font-semibold">
                  Every garden is a canvas. Every yard tells a story.
                </span>{" "}
                Every outdoor space is a design waiting to be revealed.
              </p>

              <p>
                In 2022, I started working with local neighbours in Toronto,
                helping them transform their outdoor spaces one project at a
                time. What began as word-of-mouth work quickly grew as neighbours
                told friends, and those friends told others. I named the
                business{" "}
                <span className="text-nature-600 dark:text-nature-400 font-semibold">
                  Woodgreen Landscaping
                </span>{" "}
                to honour where my journey began, where the artistic precision of
                graphic design meets the organic craft I learned in those
                Ontario fields. From the first sketch on paper to the final
                plant in the ground, every project is both art and earth.
              </p>

              <p>
                But creating beautiful landscapes isn&apos;t enough. They need
                to be sustainable too. That&apos;s why Woodgreen operates with{" "}
                <span className="text-nature-600 dark:text-nature-400 font-semibold">
                  100% battery-powered equipment
                </span>
                . My professional DeWalt 60V Flexvolt lineup delivers the same
                power as gas equipment, but with zero emissions and quiet
                operation your neighbours will appreciate. And I&apos;m expanding
                to even higher-end Stihl battery equipment, because
                sustainability and professionalism go hand-in-hand.
              </p>

              <p>
                Every design choice considers environmental impact. Native plant
                selections. Water-efficient irrigation. Eco-conscious
                maintenance. This is landscaping for the future: beautiful,
                functional, and kind to the earth.
              </p>

              <blockquote className="relative my-8 p-8 bg-gradient-to-br from-[#CEFF65]/20 via-nature-100/30 to-[#4ade80]/20 dark:from-[#4A5D4C]/30 dark:via-[#2F3B30]/20 dark:to-[#1C1C1C]/40 rounded-2xl border-l-4 border-[#CEFF65] dark:border-nature-500 shadow-lg">
                <div className="absolute top-4 left-4 text-6xl text-[#CEFF65]/30 dark:text-nature-500/30 font-serif leading-none">
                  &ldquo;
                </div>
                <p className="text-xl md:text-2xl font-medium text-[#2F3B30] dark:text-white pl-8 leading-relaxed">
                  As a one-person operation, I offer something larger companies
                  can&apos;t:{" "}
                  <span className="text-nature-600 dark:text-nature-400 font-semibold">
                    personal attention
                  </span>
                  ,{" "}
                  <span className="text-nature-600 dark:text-nature-400 font-semibold">
                    artistic vision
                  </span>
                  ,{" "}
                  <span className="text-nature-600 dark:text-nature-400 font-semibold">
                    complete creative control
                  </span>
                  , and{" "}
                  <span className="text-nature-600 dark:text-nature-400 font-semibold">
                    genuinely eco-friendly practices
                  </span>
                  .
                </p>
                <div className="absolute bottom-4 right-6 text-6xl text-[#CEFF65]/30 dark:text-nature-500/30 font-serif leading-none">
                  &rdquo;
                </div>
              </blockquote>

              <p>
                What started with neighbors three years ago is now expanding
                beyond the local community. I&apos;m currently formalizing
                Woodgreen Landscaping to serve the Greater Toronto Area more
                broadly. I&apos;m adding capabilities like hardscapes while
                maintaining the boutique, personal approach that got me here.
              </p>

              <div className="relative mt-12 p-10 bg-gradient-to-r from-[#2F3B30] via-[#4A5D4C] to-[#2F3B30] dark:from-[#1C1C1C] dark:via-[#2F3B30] dark:to-[#1C1C1C] rounded-3xl shadow-2xl overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#CEFF65] rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-nature-400 rounded-full blur-3xl"></div>
                </div>

                <p className="relative text-2xl md:text-4xl font-bold text-center text-white leading-relaxed">
                  <span className="inline-block bg-gradient-to-r from-[#CEFF65] to-[#4ade80] bg-clip-text text-transparent">
                    From sketch to soil
                  </span>
                  <span className="text-white/90">, </span>
                  <span className="inline-block bg-gradient-to-r from-[#60a5fa] to-[#ff6b9d] bg-clip-text text-transparent">
                    from neighbors to new friends
                  </span>
                  <span className="text-white/90">: </span>
                  <br className="hidden md:block" />
                  <span className="text-white font-extrabold text-shadow">
                    let&apos;s create something extraordinary together.
                  </span>
                </p>

                {/* Accent line */}
                <div className="mt-6 mx-auto w-32 h-1 bg-gradient-to-r from-transparent via-[#CEFF65] to-transparent rounded-full"></div>
              </div>
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
                    <div className="text-sm text-[#4A5D4C] dark:text-gray-400">
                      {stat.label}
                    </div>
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
            From design to installation, I handle every aspect with artistic
            precision and personal care
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
          <p className="text-lg md:text-xl text-[#4A5D4C] dark:text-gray-400 text-center mb-4 max-w-2xl mx-auto">
            The advantages of boutique, personalized landscaping service
          </p>
          <p className="text-sm text-[#4A5D4C] dark:text-gray-500 text-center mb-12 max-w-xl mx-auto italic">
            Click any card to learn more
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
            {values.map((value, index) => {
              const isSelected = expandedCard === index;
              return (
                <Card
                  key={index}
                  onClick={() => setExpandedCard(isSelected ? null : index)}
                  className={`bg-[#F0F4F0] dark:bg-[#4A5D4C] border-0 hover:bg-white dark:hover:bg-[#3A4A3A] transition-all duration-300 cursor-pointer group ${
                    isSelected ? "ring-2 ring-offset-2 shadow-xl scale-105" : ""
                  }`}
                  style={
                    isSelected
                      ? ({
                          "--tw-ring-color": value.color,
                        } as React.CSSProperties)
                      : {}
                  }
                >
                  <CardContent className="p-8 text-center">
                    <div
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 group-hover:scale-110 transition-transform"
                      style={{
                        backgroundColor: `${value.color}20`,
                        color: value.color,
                      }}
                    >
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-[#2F3B30] dark:text-white">
                      {value.title}
                    </h3>
                    <p className="text-[#4A5D4C] dark:text-gray-400 text-sm leading-relaxed">
                      {value.description}
                    </p>

                    {/* Selection Indicator */}
                    <div className="mt-4 flex justify-center">
                      <ChevronDown
                        className={`w-5 h-5 transition-all ${
                          isSelected
                            ? "text-[#2F3B30] dark:text-white rotate-180"
                            : "text-[#4A5D4C] dark:text-gray-400"
                        }`}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Detailed Content Card - Appears Below Grid */}
          {expandedCard !== null && (
            <div className="mt-12 max-w-5xl mx-auto">
              <div
                className="relative overflow-hidden rounded-3xl shadow-2xl animate-in slide-in-from-top-4 duration-500"
                style={{
                  background: `linear-gradient(135deg, ${values[expandedCard].color}15 0%, ${values[expandedCard].color}05 100%)`,
                  borderLeft: `6px solid ${values[expandedCard].color}`,
                }}
              >
                {/* Close Button */}
                <button
                  onClick={() => setExpandedCard(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/80 dark:bg-black/40 hover:bg-white dark:hover:bg-black/60 transition-all group z-10"
                  aria-label="Close details"
                >
                  <ChevronUp className="w-5 h-5 text-[#2F3B30] dark:text-white" />
                </button>

                <div className="p-10 md:p-12">
                  {/* Header */}
                  <div className="flex items-center gap-6 mb-8">
                    <div
                      className="flex-shrink-0 inline-flex items-center justify-center w-20 h-20 rounded-2xl shadow-lg"
                      style={{ backgroundColor: values[expandedCard].color }}
                    >
                      <div className="text-white scale-125">
                        {values[expandedCard].icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-3xl md:text-4xl font-bold text-[#2F3B30] dark:text-white mb-2">
                        {values[expandedCard].title}
                      </h3>
                      <p className="text-lg text-[#4A5D4C] dark:text-gray-400">
                        {values[expandedCard].description}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div
                    className="h-1 w-24 rounded-full mb-8"
                    style={{ backgroundColor: values[expandedCard].color }}
                  />

                  {/* Detailed Content */}
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-lg leading-relaxed text-[#2F3B30] dark:text-gray-200">
                      {values[expandedCard].detailedContent}
                    </p>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-0 right-0 w-64 h-64 opacity-5 pointer-events-none">
                  <div
                    className="w-full h-full rounded-full blur-3xl"
                    style={{ backgroundColor: values[expandedCard].color }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Service Area: 3D Globe */}
      <section className="py-20 bg-[#F0F4F0] dark:bg-[#1C1C1C]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center text-[#2F3B30] dark:text-white">
            Where I Serve
          </h2>
          <p className="text-lg md:text-xl text-[#4A5D4C] dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Serving the Greater Toronto Area with zero-emission, design-focused
            landscaping
            <br />
            <span className="text-nature-600 dark:text-nature-400 text-base">
              Boutique service. Sustainable impact. One project at a time.
            </span>
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

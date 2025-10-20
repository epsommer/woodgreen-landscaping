"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { emitEvent, EVENTS } from "@/lib/events";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Shovel,
  Sun,
  Wind,
  Snowflake,
  ArrowRight,
  Star,
  CheckCircle2,
  Award,
  Leaf,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Scissors,
  Droplets,
  Clock,
  User,
  Eye,
  Hammer,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { HeroSection } from "@/components/HeroSection";

export function Home() {
  const [expandedService, setExpandedService] = useState<number | null>(null);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [expandedReason, setExpandedReason] = useState<number | null>(null);

  const featuredServices = [
    {
      icon: (
        <Heart className="h-8 w-8 mb-2 text-[#CEFF65] [filter:drop-shadow(0_1px_1px_rgba(0,0,0,0.15))_drop-shadow(0_2px_3px_rgba(0,0,0,0.1))_drop-shadow(0_3px_6px_rgba(0,0,0,0.08))] dark:[filter:none]" />
      ),
      title: "Boutique Service",
      description:
        "High-touch, artisanal approach to landscaping that treats every project as a masterpiece.",
      subheading: "Quality Over Quantity",
      features: [
        "Limited client roster ensures focused attention",
        "Handcrafted solutions, never cookie-cutter designs",
        "Meticulous craftsmanship in every aspect",
        "Direct owner involvement from start to finish",
        "Commitment to excellence in every detail",
      ],
      benefits:
        "Experience the rare combination of small-scale attention with large-scale expertise, where your project isn't just another job—it's a craft.",
      link: "/services",
    },
    {
      icon: (
        <User className="h-8 w-8 mb-2 text-[#CEFF65] [filter:drop-shadow(0_1px_1px_rgba(0,0,0,0.15))_drop-shadow(0_2px_3px_rgba(0,0,0,0.1))_drop-shadow(0_3px_6px_rgba(0,0,0,0.08))] dark:[filter:none]" />
      ),
      title: "Personalized Service",
      description:
        "Tailored landscaping solutions designed specifically for your property and vision.",
      subheading: "Your Unique Outdoor Space, Your Way",
      features: [
        "One-on-one consultation to understand your goals",
        "Customized maintenance schedules that fit your lifestyle",
        "Direct communication with me throughout the project",
        "Flexible service options based on your budget",
        "Personal attention to every detail of your property",
      ],
      benefits:
        "Experience the difference of working directly with a dedicated professional who treats your property as if it were their own.",
      link: "/services",
    },
    {
      icon: (
        <Eye className="h-8 w-8 mb-2 text-[#CEFF65] [filter:drop-shadow(0_1px_1px_rgba(0,0,0,0.15))_drop-shadow(0_2px_3px_rgba(0,0,0,0.1))_drop-shadow(0_3px_6px_rgba(0,0,0,0.08))] dark:[filter:none]" />
      ),
      title: "Designer's Eye",
      description:
        "Creative vision and expertise to bring out the best in your landscape.",
      subheading: "Artistry Meets Functionality",
      features: [
        "Professional design sense honed over 30+ years",
        "Strategic plant placement for year-round beauty",
        "Color coordination and seasonal interest planning",
        "Practical layouts that enhance usability and flow",
        "Solutions that complement your home's architecture",
      ],
      benefits:
        "Transform your outdoor space with thoughtful design that balances aesthetics with practicality, creating a landscape you'll love for years to come.",
      link: "/design",
    },
    {
      icon: (
        <Hammer className="h-8 w-8 mb-2 text-[#CEFF65] [filter:drop-shadow(0_1px_1px_rgba(0,0,0,0.15))_drop-shadow(0_2px_3px_rgba(0,0,0,0.1))_drop-shadow(0_3px_6px_rgba(0,0,0,0.08))] dark:[filter:none]" />
      ),
      title: "Construction Expertise",
      description:
        "Comprehensive hardscape construction including patios, decks, fences, and outdoor structures.",
      subheading: "Building Beyond Landscaping",
      features: [
        "Hardscape installation: patios, walkways, and driveways (pavers, stone, concrete)",
        "Custom deck construction with wood and composite materials",
        "Fence installation: wood, vinyl, and decorative options",
        "Retaining walls and raised garden beds",
        "Pergolas, arbors, and outdoor living structures",
      ],
      benefits:
        "Leverage decades of construction experience to handle all aspects of your outdoor hardscape projects, from foundation work to finishing details.",
      link: "/services",
    },
  ];

  const endOfSummerSpecials = [
    {
      icon: (
        <Sun className="h-8 w-8 text-[#CEFF65] group-hover:animate-sun-glow [filter:drop-shadow(0_1px_1px_rgba(0,0,0,0.15))_drop-shadow(0_2px_3px_rgba(0,0,0,0.1))_drop-shadow(0_3px_6px_rgba(0,0,0,0.08))] dark:[filter:none]" />
      ),
      title: "Grass Cutting",
      subtitle: "Final Cut Service",
      description: "Professional lawn mowing and edging to prepare for fall.",
      price: "$49",
      oldPrice: "$55",
      service: "Grass Cutting",
    },
    {
      icon: (
        <Leaf className="h-8 w-8 text-[#CEFF65] [filter:drop-shadow(0_1px_1px_rgba(0,0,0,0.15))_drop-shadow(0_2px_3px_rgba(0,0,0,0.1))_drop-shadow(0_3px_6px_rgba(0,0,0,0.08))] dark:[filter:none]" />
      ),
      title: "Aeration",
      subtitle: "Soil Health",
      description:
        "Improve lawn health with core aeration for better nutrient absorption.",
      price: "$45",
      oldPrice: "$75",
      service: "Aeration",
    },
    {
      icon: (
        <Sparkles className="h-8 w-8 text-[#CEFF65] [filter:drop-shadow(0_1px_1px_rgba(0,0,0,0.15))_drop-shadow(0_2px_3px_rgba(0,0,0,0.1))_drop-shadow(0_3px_6px_rgba(0,0,0,0.08))] dark:[filter:none]" />
      ),
      title: "Dethatching",
      subtitle: "Lawn Revitalization",
      description: "Remove dead grass buildup to promote healthy fall growth.",
      price: "$60",
      oldPrice: "$100",
      service: "Dethatching",
    },
    {
      icon: (
        <Shovel className="h-8 w-8 text-[#CEFF65] [filter:drop-shadow(0_1px_1px_rgba(0,0,0,0.15))_drop-shadow(0_2px_3px_rgba(0,0,0,0.1))_drop-shadow(0_3px_6px_rgba(0,0,0,0.08))] dark:[filter:none]" />
      ),
      title: "Garden Maintenance",
      subtitle: "Seasonal Care",
      description:
        "Complete garden care including pruning, weeding, and bed preparation.",
      price: "$48/hr",
      oldPrice: "$80/hr",
      service: "Garden Maintenance",
    },
  ];

  const fallPromotions = [
    {
      icon: (
        <Wind className="h-12 w-12 mb-4 text-[#CEFF65] group-hover:animate-wind-blow [filter:drop-shadow(0_1px_1px_rgba(0,0,0,0.15))_drop-shadow(0_2px_3px_rgba(0,0,0,0.1))_drop-shadow(0_3px_6px_rgba(0,0,0,0.08))] dark:[filter:none]" />
      ),
      title: "Fall Cleanup Special",
      subtitle: "Complete Property Preparation",
      description:
        "Prepare your property for winter with our comprehensive fall cleanup service.",
      price: "Starting at $49/hr",
      oldPrice: "$79/hr",
      cta: "Book Now",
      service: "Fall Cleanup",
      included: [
        "Complete leaf removal from lawns and garden beds",
        "Debris cleanup and removal",
        "Gutter cleaning and inspection",
        "Perennial cutback and bed preparation",
        "General landscape labor and property tidying",
        "Final mowing and edging",
      ],
      guarantee: "100% satisfaction guaranteed or we'll make it right",
    },
    {
      icon: (
        <Scissors className="h-12 w-12 mb-4 text-[#CEFF65] group-hover:animate-snip [filter:drop-shadow(0_1px_1px_rgba(0,0,0,0.15))_drop-shadow(0_2px_3px_rgba(0,0,0,0.1))_drop-shadow(0_3px_6px_rgba(0,0,0,0.08))] dark:[filter:none]" />
      ),
      title: "Fall Hedge & Shrub Care",
      subtitle: "Professional Winter Preparation",
      description:
        "Expert hedge trimming and shrub maintenance to protect your plants through winter.",
      price: "Starting at $0.75/ft",
      oldPrice: "$1.25/ft",
      cta: "Book Now",
      service: "Hedge/Shrub Trimming",
      included: [
        "Professional hedge trimming and shaping",
        "Shrub thinning and reduction cuts",
        "Dormant pruning preparation for spring growth",
        "Winter protection fabric installation (burlap wrapping)",
        "Disease and pest inspection",
        "Debris cleanup and disposal",
      ],
      guarantee: "Expert care from certified horticulture professionals",
    },
  ];

  const comingSoonServices = [
    {
      icon: <Snowflake className="h-12 w-12 mb-4 text-gray-400" />,
      title: "Winter Snow Removal",
      subtitle: "24/7 Snow & Ice Management",
      description:
        "Professional snow removal service for driveways, walkways, and parking areas.",
      features: [
        "Priority plowing for driveways and parking areas",
        "Walkway and entrance clearing",
        "24/7 emergency service availability",
        "Seasonal contract options",
      ],
    },
    {
      icon: <Droplets className="h-12 w-12 mb-4 text-gray-400" />,
      title: "De-Icing & Salting",
      subtitle: "Professional Ice Management",
      description:
        "Keep your property safe with professional de-icing and salt application services.",
      features: [
        "Eco-friendly ice melt application",
        "Pre-treatment before winter storms",
        "Post-storm surface treatment",
        "Walkway and driveway coverage",
      ],
    },
  ];

  const testimonials = [
    {
      name: "John D.",
      location: "Richmond Hill, ON",
      service: "Complete Backyard Redesign",
      text: "Woodgreen transformed our backyard into a beautiful oasis. They designed a stunning patio area with native plantings that attract butterflies all summer long. The attention to detail was exceptional!",
      project: "2,500 sq ft landscape renovation",
    },
    {
      name: "Sarah M.",
      location: "Markham, ON",
      service: "Weekly Lawn Maintenance",
      text: "Professional, punctual, and perfect results every single time. The crew is respectful of our property and always leaves the yard looking immaculate. Couldn&apos;t be happier with their service.",
      project: "Ongoing maintenance program",
    },
    {
      name: "Mike R.",
      location: "Vaughan, ON",
      service: "Seasonal Lawn Care Program",
      text: "Their lawn care service is top-notch. Our yard has never looked better! The team educated us on proper watering and care, and the results speak for themselves. Best decision we made for our home.",
      project: "Full-season fertilization & care",
    },
  ];

  const whyChooseUs = [
    {
      icon: (
        <Award className="h-10 w-10 text-[#CEFF65] [filter:drop-shadow(0_1px_1px_rgba(0,0,0,0.15))_drop-shadow(0_2px_3px_rgba(0,0,0,0.1))_drop-shadow(0_3px_6px_rgba(0,0,0,0.08))] dark:[filter:none]" />
      ),
      title: "30+ Years Legacy Experience",
      description:
        "Three decades of expertise in landscape design and maintenance across the GTA",
      details:
        "With over 30 years of hands-on experience, I've mastered the art and science of landscape care. My legacy of quality work spans generations of satisfied clients across the Greater Toronto Area.",
      features: [
        "Proven track record with thousands of completed projects",
        "Deep understanding of GTA soil conditions and climate",
        "Expertise in native plant species and sustainable practices",
        "Legacy of excellence built over three decades",
        "Trusted by residential and commercial clients",
      ],
    },
    {
      icon: (
        <Leaf className="h-10 w-10 text-[#CEFF65] [filter:drop-shadow(0_1px_1px_rgba(0,0,0,0.15))_drop-shadow(0_2px_3px_rgba(0,0,0,0.1))_drop-shadow(0_3px_6px_rgba(0,0,0,0.08))] dark:[filter:none]" />
      ),
      title: "Eco-Friendly Practices",
      description:
        "Sustainable solutions that are better for your landscape and the environment",
      details:
        "I'm committed to environmental stewardship. My practices prioritize sustainability without sacrificing results, helping you create a beautiful landscape that's kind to the planet.",
      features: [
        "Native plant selection to support local ecosystems",
        "Organic fertilizers and natural pest control options",
        "Water-efficient irrigation design and rainwater harvesting",
        "Composting and mulching to reduce waste",
        "Electric and low-emission equipment whenever possible",
      ],
    },
  ];

  const processSteps = [
    {
      number: "1",
      title: "Free Consultation",
      description: "We visit your property to understand your vision and needs",
      details:
        "Our landscape experts will meet with you on-site to discuss your goals, assess your property's unique characteristics, and explore design possibilities.",
      features: [
        "Complimentary on-site property assessment",
        "Discussion of your landscaping goals and budget",
        "Professional recommendations based on property conditions",
        "Analysis of soil, drainage, and sun exposure",
        "Review of existing landscaping and potential improvements",
      ],
    },
    {
      number: "2",
      title: "Custom Proposal",
      description:
        "Receive a detailed plan with transparent pricing and timelines",
      details:
        "We'll create a comprehensive proposal tailored to your specific needs, including detailed scope of work, materials list, and project timeline.",
      features: [
        "Detailed breakdown of all services and materials",
        "Transparent, itemized pricing with no hidden fees",
        "Clear project timeline with key milestones",
        "3D visualizations for design projects",
        "Flexible payment options and financing available",
      ],
    },
    {
      number: "3",
      title: "Expert Execution",
      description:
        "Our skilled team brings your landscape to life with precision",
      details:
        "Our experienced crews will execute your project with meticulous attention to detail, keeping you informed throughout the process.",
      features: [
        "Professional, uniformed crews with proper equipment",
        "Regular progress updates and communication",
        "Careful protection of existing landscaping",
        "Clean, organized work site maintained daily",
        "Quality control inspections at each phase",
      ],
    },
    {
      number: "4",
      title: "Ongoing Support",
      description:
        "Enjoy continued maintenance and care to keep your landscape thriving",
      details:
        "We stand behind our work and offer comprehensive maintenance services to ensure your landscape remains beautiful year after year.",
      features: [
        "Warranty on all workmanship and materials",
        "Seasonal maintenance programs available",
        "Priority scheduling for existing clients",
        "Expert advice on plant care and landscape management",
        "Emergency service for storm damage or urgent issues",
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F4F0] dark:bg-[#1C1C1C] text-[#2F3B30] dark:text-white transition-colors duration-300 overflow-x-hidden">
      <main className="flex-grow overflow-x-hidden">
        {/* Hero Section with 3D Scene */}
        <HeroSection
          onGetStarted={() => emitEvent(EVENTS.OPEN_ESTIMATE_MODAL)}
        />

        <section id="services" className="py-20 bg-white dark:bg-[#2F3B30]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose Woodgreen Landscaping?
              </h2>
              <p className="text-lg text-[#4A5D4C] dark:text-gray-300 max-w-2xl mx-auto">
                Experience the difference that comes from working with true
                landscaping professionals
              </p>
            </div>

            {/* Why Choose Us Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
              {whyChooseUs.map((reason, index) => (
                <div key={index} className="contents md:block">
                  <Card
                    className={`bg-[#F0F4F0] dark:bg-[#4A5D4C] border-2 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer group overflow-hidden ${
                      expandedReason === index
                        ? "border-[#CEFF65] shadow-xl"
                        : "border-transparent"
                    }`}
                    onClick={() =>
                      setExpandedReason(expandedReason === index ? null : index)
                    }
                  >
                    <CardContent className="pt-8 pb-6">
                      <div className="flex justify-center items-center mb-4 transition-transform duration-300 group-hover:scale-110">
                        {reason.icon}
                      </div>
                      <h3 className="font-bold text-lg mb-3 text-[#2F3B30] dark:text-white">
                        {reason.title}
                      </h3>
                      <p className="text-sm text-[#4A5D4C] dark:text-gray-300 mb-4">
                        {reason.description}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`transition-all duration-200 ease-in-out border-0 focus:outline-none ${
                          expandedReason === index
                            ? "bg-[#CEFF65] text-[#2F3B30] font-semibold shadow-[inset_1px_1px_2px_rgba(186,190,204,0.5),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] hover:shadow-[inset_2px_2px_3px_rgba(186,190,204,0.5),inset_-2px_-2px_3px_rgba(255,255,255,0.8)] dark:shadow-none dark:bg-[#CEFF65]"
                            : "bg-[#2F3B30] text-white font-semibold shadow-[-2px_-2px_5px_rgba(255,255,255,0.8),2px_2px_5px_rgba(186,190,204,0.4)] hover:shadow-[-1px_-1px_3px_rgba(255,255,255,0.8),1px_1px_3px_rgba(186,190,204,0.4)] active:shadow-[inset_1px_1px_2px_rgba(186,190,204,0.5),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-none dark:bg-[#2F3B30]"
                        }`}
                      >
                        {expandedReason === index ? (
                          <>
                            Hide Details <ChevronUp className="ml-2 h-4 w-4" />
                          </>
                        ) : (
                          <>
                            Learn More <ChevronDown className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Reason Details Section - Mobile Only (appears directly below card) */}
                  {expandedReason === index && (
                    <div className="md:hidden mt-6 animate-in fade-in-50 slide-in-from-top-5 duration-500">
                      <Card className="bg-white dark:bg-[#2F3B30] border-2 border-[#CEFF65]">
                        <CardHeader>
                          <CardTitle className="text-xl mb-2 flex items-center gap-3">
                            {reason.icon}
                            {reason.title}
                          </CardTitle>
                          <CardDescription className="text-base">
                            {reason.details}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-bold text-lg mb-4 text-[#2F3B30] dark:text-[#CEFF65] flex items-center gap-2">
                              <CheckCircle2 className="h-5 w-5" />
                              What Sets Us Apart
                            </h4>
                            <ul className="space-y-3">
                              {reason.features.map((feature, featureIndex) => (
                                <li
                                  key={featureIndex}
                                  className="flex items-start gap-3"
                                >
                                  <CheckCircle2 className="h-5 w-5 text-[#CEFF65] mt-0.5 flex-shrink-0 [filter:drop-shadow(0_1px_2px_rgba(206,255,101,0.4))_drop-shadow(0_2px_4px_rgba(206,255,101,0.2))] dark:[filter:none]" />
                                  <span className="text-[#4A5D4C] dark:text-gray-300">
                                    {feature}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Reason Details Section - Desktop Only (appears below all cards) */}
            {expandedReason !== null && (
              <div className="hidden md:block mb-16 animate-in fade-in-50 slide-in-from-top-5 duration-500">
                <Card className="bg-white dark:bg-[#2F3B30] border-2 border-[#CEFF65]">
                  <CardHeader>
                    <CardTitle className="text-2xl mb-2 flex items-center gap-3">
                      {whyChooseUs[expandedReason].icon}
                      {whyChooseUs[expandedReason].title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {whyChooseUs[expandedReason].details}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-bold text-lg mb-6 text-[#2F3B30] dark:text-[#CEFF65] flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      What Sets Us Apart
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {whyChooseUs[expandedReason].features.map(
                        (feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className="flex items-start gap-3"
                          >
                            <CheckCircle2 className="h-5 w-5 text-[#CEFF65] mt-0.5 flex-shrink-0 [filter:drop-shadow(0_1px_2px_rgba(206,255,101,0.4))_drop-shadow(0_2px_4px_rgba(206,255,101,0.2))] dark:[filter:none]" />
                            <span className="text-[#4A5D4C] dark:text-gray-300">
                              {feature}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Featured Services */}
            <div className="text-center mb-12 mt-20">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                What Sets Me Apart
              </h3>
              <p className="text-lg text-[#4A5D4C] dark:text-gray-300 max-w-2xl mx-auto">
                Three decades of expertise combined with personalized service
                and comprehensive construction capabilities
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {featuredServices.map((service, index) => (
                <React.Fragment key={index}>
                  <Card
                    className={`bg-[#F0F4F0] dark:bg-[#4A5D4C] border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer group overflow-hidden ${
                      expandedService === index
                        ? "border-[#CEFF65] shadow-xl"
                        : "border-transparent"
                    }`}
                    onClick={() =>
                      setExpandedService(
                        expandedService === index ? null : index,
                      )
                    }
                  >
                    <CardContent className="pt-8 pb-6">
                      <div className="flex justify-center items-center mb-4 transition-transform duration-300 group-hover:scale-110">
                        {service.icon}
                      </div>
                      <h3 className="font-bold text-lg mb-4 text-[#2F3B30] dark:text-white text-center">
                        {service.title}
                      </h3>
                      <div className="flex justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className={`transition-all duration-200 ease-in-out border-0 focus:outline-none ${
                            expandedService === index
                              ? "bg-[#CEFF65] text-[#2F3B30] font-semibold shadow-[inset_1px_1px_2px_rgba(186,190,204,0.5),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] hover:shadow-[inset_2px_2px_3px_rgba(186,190,204,0.5),inset_-2px_-2px_3px_rgba(255,255,255,0.8)] dark:shadow-none dark:bg-[#CEFF65]"
                              : "bg-[#2F3B30] text-white font-semibold shadow-[-2px_-2px_5px_rgba(255,255,255,0.8),2px_2px_5px_rgba(186,190,204,0.4)] hover:shadow-[-1px_-1px_3px_rgba(255,255,255,0.8),1px_1px_3px_rgba(186,190,204,0.4)] active:shadow-[inset_1px_1px_2px_rgba(186,190,204,0.5),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-none dark:bg-[#2F3B30]"
                          }`}
                        >
                          {expandedService === index ? (
                            <>
                              Hide Details <ChevronUp className="ml-2 h-4 w-4" />
                            </>
                          ) : (
                            <>
                              Learn More <ChevronDown className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Service Details Section - Mobile Only (appears directly below card) */}
                  {expandedService === index && (
                    <div className="col-span-2 lg:hidden mt-6 animate-in fade-in-50 slide-in-from-top-5 duration-500">
                      <Card className="bg-white dark:bg-[#2F3B30] border-2 border-[#CEFF65]">
                        <CardHeader>
                          <CardTitle className="text-xl mb-2 flex items-center gap-3">
                            {service.icon}
                            {service.title}
                          </CardTitle>
                          <CardDescription className="text-base">
                            {service.subheading}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div>
                            <h4 className="font-bold text-lg mb-4 text-[#2F3B30] dark:text-[#CEFF65] flex items-center gap-2">
                              <CheckCircle2 className="h-5 w-5" />
                              What&apos;s Included
                            </h4>
                            <ul className="space-y-3">
                              {service.features.map((feature, featureIndex) => (
                                <li
                                  key={featureIndex}
                                  className="flex items-start gap-3"
                                >
                                  <CheckCircle2 className="h-5 w-5 text-[#CEFF65] mt-0.5 flex-shrink-0 [filter:drop-shadow(0_1px_2px_rgba(206,255,101,0.4))_drop-shadow(0_2px_4px_rgba(206,255,101,0.2))] dark:[filter:none]" />
                                  <span className="text-[#4A5D4C] dark:text-gray-300">
                                    {feature}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-bold text-lg mb-4 text-[#2F3B30] dark:text-[#CEFF65] flex items-center gap-2">
                              <Sparkles className="h-5 w-5" />
                              Benefits
                            </h4>
                            <div className="bg-[#F0F4F0] dark:bg-[#1C1C1C] p-4 rounded-lg">
                              <p className="text-[#4A5D4C] dark:text-gray-300 leading-relaxed">
                                {service.benefits}
                              </p>
                            </div>

                            <Link href={service.link}>
                              <Button
                                size="lg"
                                className="w-full mt-6 bg-[#2F3B30] text-white border-0 font-semibold transition-all duration-200 ease-in-out shadow-[-2px_-2px_5px_rgba(255,255,255,0.8),2px_2px_5px_rgba(186,190,204,0.4)] hover:shadow-[-1px_-1px_3px_rgba(255,255,255,0.8),1px_1px_3px_rgba(186,190,204,0.4)] active:shadow-[inset_1px_1px_2px_rgba(186,190,204,0.5),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-none dark:bg-[#4A5D4C]"
                              >
                                Learn More About {service.title}
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Service Details Section - Desktop Only (appears below all cards) */}
            {expandedService !== null && (
              <div className="hidden lg:block mt-12 animate-in fade-in-50 slide-in-from-top-5 duration-500">
                <Card className="bg-white dark:bg-[#2F3B30] border-2 border-[#CEFF65]">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl mb-2 flex items-center gap-3">
                          {featuredServices[expandedService].icon}
                          {featuredServices[expandedService].title}
                        </CardTitle>
                        <CardDescription className="text-base">
                          {featuredServices[expandedService].subheading}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold text-lg mb-4 text-[#2F3B30] dark:text-[#CEFF65] flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5" />
                          What&apos;s Included
                        </h4>
                        <ul className="space-y-3">
                          {featuredServices[expandedService].features.map(
                            (feature, featureIndex) => (
                              <li
                                key={featureIndex}
                                className="flex items-start gap-3"
                              >
                                <CheckCircle2 className="h-5 w-5 text-[#CEFF65] mt-0.5 flex-shrink-0 [filter:drop-shadow(0_1px_2px_rgba(206,255,101,0.4))_drop-shadow(0_2px_4px_rgba(206,255,101,0.2))] dark:[filter:none]" />
                                <span className="text-[#4A5D4C] dark:text-gray-300">
                                  {feature}
                                </span>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-bold text-lg mb-4 text-[#2F3B30] dark:text-[#CEFF65] flex items-center gap-2">
                          <Sparkles className="h-5 w-5" />
                          Benefits
                        </h4>
                        <div className="bg-[#F0F4F0] dark:bg-[#1C1C1C] p-4 rounded-lg">
                          <p className="text-[#4A5D4C] dark:text-gray-300 leading-relaxed">
                            {featuredServices[expandedService].benefits}
                          </p>
                        </div>

                        <Link href={featuredServices[expandedService].link}>
                          <Button
                            size="lg"
                            className="w-full mt-6 bg-[#2F3B30] text-white border-0 font-semibold transition-all duration-200 ease-in-out shadow-[-2px_-2px_5px_rgba(255,255,255,0.8),2px_2px_5px_rgba(186,190,204,0.4)] hover:shadow-[-1px_-1px_3px_rgba(255,255,255,0.8),1px_1px_3px_rgba(186,190,204,0.4)] active:shadow-[inset_1px_1px_2px_rgba(186,190,204,0.5),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-none dark:bg-[#4A5D4C]"
                          >
                            Learn More About{" "}
                            {featuredServices[expandedService].title}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="text-center mt-12">
              <Link href="/services">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-[#2F3B30] text-white border-0 font-semibold transition-all duration-200 ease-in-out shadow-[-2px_-2px_5px_rgba(255,255,255,0.8),2px_2px_5px_rgba(186,190,204,0.4)] hover:shadow-[-1px_-1px_3px_rgba(255,255,255,0.8),1px_1px_3px_rgba(186,190,204,0.4)] active:shadow-[inset_1px_1px_2px_rgba(186,190,204,0.5),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-none dark:bg-[#4A5D4C]"
                >
                  View All Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* 4-Step Process */}
            <div className="bg-[#F0F4F0] dark:bg-[#1C1C1C] rounded-2xl p-8 md:p-12 mt-20">
              <h3 className="text-2xl md:text-3xl font-bold text-center mb-4">
                Our Simple 4-Step Process
              </h3>
              <p className="text-center text-[#4A5D4C] dark:text-gray-300 mb-12 max-w-2xl mx-auto">
                From initial consultation to ongoing maintenance, we make
                creating your dream landscape easy
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {processSteps.map((step, index) => (
                  <div key={index} className="contents md:block">
                    <div className="relative">
                      <div className="flex flex-col items-center text-center group">
                        <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4 transition-all duration-300 cursor-pointer ${
                            expandedStep === index
                              ? "bg-[#CEFF65] text-[#2F3B30] scale-110 shadow-lg"
                              : "bg-[#2F3B30] dark:bg-[#4A5D4C] text-white group-hover:scale-110 group-hover:bg-[#3A4A3A]"
                          }`}
                          onClick={() =>
                            setExpandedStep(
                              expandedStep === index ? null : index,
                            )
                          }
                        >
                          {step.number}
                        </div>
                        <h4 className="font-bold text-lg mb-2 text-[#2F3B30] dark:text-white">
                          {step.title}
                        </h4>
                        <p className="text-sm text-[#4A5D4C] dark:text-gray-300 mb-4">
                          {step.description}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setExpandedStep(
                              expandedStep === index ? null : index,
                            )
                          }
                          className={`text-xs transition-all duration-200 ease-in-out focus:outline-none ${
                            expandedStep === index
                              ? "text-[#CEFF65] font-semibold shadow-[inset_1px_1px_2px_rgba(186,190,204,0.5),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] [text-shadow:1px_1px_2px_rgba(186,190,204,0.8)] dark:shadow-none dark:[text-shadow:none] dark:text-[#CEFF65]"
                              : "text-[#2F3B30] font-semibold shadow-[-2px_-2px_5px_rgba(255,255,255,0.8),2px_2px_5px_rgba(186,190,204,0.4)] hover:shadow-[-1px_-1px_3px_rgba(255,255,255,0.8),1px_1px_3px_rgba(186,190,204,0.4)] active:shadow-[inset_1px_1px_2px_rgba(186,190,204,0.5),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] [text-shadow:1px_1px_0_rgba(255,255,255,1)] dark:shadow-none dark:[text-shadow:none] dark:text-[#CEFF65]"
                          }`}
                        >
                          {expandedStep === index ? (
                            <>
                              Hide Details{" "}
                              <ChevronUp className="ml-1 h-3 w-3" />
                            </>
                          ) : (
                            <>
                              View Details{" "}
                              <ChevronDown className="ml-1 h-3 w-3" />
                            </>
                          )}
                        </Button>
                      </div>
                      {index < processSteps.length - 1 && (
                        <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-[#2F3B30] dark:bg-[#4A5D4C] -translate-x-1/2" />
                      )}
                    </div>

                    {/* Step Details Section - Mobile Only (appears directly below step) */}
                    {expandedStep === index && (
                      <div className="md:hidden mt-6 animate-in fade-in-50 slide-in-from-top-5 duration-500">
                        <Card className="bg-white dark:bg-[#2F3B30] border-2 border-[#CEFF65]">
                          <CardHeader>
                            <CardTitle className="text-xl mb-2 flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#CEFF65] text-[#2F3B30] flex items-center justify-center text-lg font-bold">
                                {step.number}
                              </div>
                              {step.title}
                            </CardTitle>
                            <CardDescription className="text-base">
                              {step.details}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <h4 className="font-bold text-lg mb-4 text-[#2F3B30] dark:text-[#CEFF65] flex items-center gap-2">
                              <CheckCircle2 className="h-5 w-5" />
                              What to Expect
                            </h4>
                            <ul className="space-y-3">
                              {step.features.map((feature, featureIndex) => (
                                <li
                                  key={featureIndex}
                                  className="flex items-start gap-3"
                                >
                                  <CheckCircle2 className="h-5 w-5 text-[#CEFF65] mt-0.5 flex-shrink-0 [filter:drop-shadow(0_1px_2px_rgba(206,255,101,0.4))_drop-shadow(0_2px_4px_rgba(206,255,101,0.2))] dark:[filter:none]" />
                                  <span className="text-[#4A5D4C] dark:text-gray-300">
                                    {feature}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Step Details Section - Desktop Only (appears below all steps) */}
              {expandedStep !== null && (
                <div className="hidden md:block mt-12 animate-in fade-in-50 slide-in-from-top-5 duration-500">
                  <Card className="bg-white dark:bg-[#2F3B30] border-2 border-[#CEFF65]">
                    <CardHeader>
                      <CardTitle className="text-2xl mb-2 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#CEFF65] text-[#2F3B30] flex items-center justify-center text-xl font-bold">
                          {processSteps[expandedStep].number}
                        </div>
                        Step {processSteps[expandedStep].number}:{" "}
                        {processSteps[expandedStep].title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {processSteps[expandedStep].details}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <h4 className="font-bold text-lg mb-6 text-[#2F3B30] dark:text-[#CEFF65] flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" />
                        What to Expect
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {processSteps[expandedStep].features.map(
                          (feature, featureIndex) => (
                            <div
                              key={featureIndex}
                              className="flex items-start gap-3"
                            >
                              <CheckCircle2 className="h-5 w-5 text-[#CEFF65] mt-0.5 flex-shrink-0 [filter:drop-shadow(0_1px_2px_rgba(206,255,101,0.4))_drop-shadow(0_2px_4px_rgba(206,255,101,0.2))] dark:[filter:none]" />
                              <span className="text-[#4A5D4C] dark:text-gray-300">
                                {feature}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#F0F4F0] dark:bg-[#1C1C1C]">
          <div className="container mx-auto px-4">
            {/* End-of-Summer Specials */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                <Clock className="h-8 w-8 md:h-10 md:w-10 text-[#CEFF65] [filter:drop-shadow(0_1px_1px_rgba(0,0,0,0.15))_drop-shadow(0_2px_3px_rgba(0,0,0,0.1))_drop-shadow(0_3px_6px_rgba(0,0,0,0.08))] dark:[filter:none]" />
                End-of-Summer Specials
              </h2>
              <p className="text-lg text-[#4A5D4C] dark:text-gray-300 max-w-2xl mx-auto">
                Get your lawn ready for fall with these individual service
                specials
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {endOfSummerSpecials.map((special, index) => (
                <Card
                  key={index}
                  className="bg-white dark:bg-[#2F3B30] border-0 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group overflow-hidden relative"
                >
                  <div className="absolute top-3 right-3 bg-[#CEFF65] text-[#2F3B30] px-2 py-1 font-bold text-xs rounded-full shadow-md z-10">
                    SAVE{" "}
                    {Math.round(
                      (1 -
                        parseFloat(special.price.replace(/[^0-9.]/g, "")) /
                          parseFloat(
                            special.oldPrice.replace(/[^0-9.]/g, ""),
                          )) *
                        100,
                    )}
                    %
                  </div>
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center items-center mb-3">
                      {special.icon}
                    </div>
                    <CardTitle className="text-xl mb-2">
                      {special.title}
                    </CardTitle>
                    <p className="text-xs font-semibold text-[#2F3B30] dark:text-[#CEFF65]">
                      {special.subtitle}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0">
                    <CardDescription className="text-center text-[#4A5D4C] dark:text-gray-300 text-sm">
                      {special.description}
                    </CardDescription>

                    <div className="flex items-baseline justify-center gap-2 py-2">
                      <p className="text-2xl font-bold text-[#2F3B30] dark:text-[#CEFF65]">
                        {special.price}
                      </p>
                      <p className="text-lg line-through text-gray-500 dark:text-gray-400">
                        {special.oldPrice}
                      </p>
                    </div>

                    <Button
                      onClick={() =>
                        emitEvent(EVENTS.OPEN_ESTIMATE_MODAL, {
                          service: special.service,
                        })
                      }
                      size="sm"
                      className="w-full bg-[#2F3B30] text-white border-0 font-semibold transition-all duration-200 ease-in-out shadow-[-2px_-2px_5px_rgba(255,255,255,0.8),2px_2px_5px_rgba(186,190,204,0.4)] hover:shadow-[-1px_-1px_3px_rgba(255,255,255,0.8),1px_1px_3px_rgba(186,190,204,0.4)] hover:scale-105 active:shadow-[inset_1px_1px_2px_rgba(186,190,204,0.5),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-none dark:bg-[#4A5D4C]"
                    >
                      Book Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Fall Promotions */}
            <div className="text-center mb-12 mt-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Fall Promotions
              </h2>
              <p className="text-lg text-[#4A5D4C] dark:text-gray-300 max-w-2xl mx-auto">
                Comprehensive packages to prepare your property for winter
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {fallPromotions.map((promo, index) => (
                <Card
                  key={index}
                  className="bg-white dark:bg-[#2F3B30] border-0 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group relative"
                >
                  <div className="absolute top-4 right-4 bg-[#CEFF65] text-[#2F3B30] px-3 py-1.5 font-bold text-xs rounded-full shadow-md z-10">
                    SAVE{" "}
                    {(
                      ((parseFloat(promo.oldPrice?.replace("$", "") || "0") -
                        parseFloat(promo.price.replace(/Starting at \$/, ""))) /
                        parseFloat(promo.oldPrice?.replace("$", "") || "1")) *
                      100
                    ).toFixed(0)}
                    %
                  </div>
                  <CardHeader className="text-center overflow-hidden">
                    <div className="flex justify-center items-center">
                      {promo.icon}
                    </div>
                    <CardTitle className="text-2xl mb-2">
                      {promo.title}
                    </CardTitle>
                    <p className="text-sm font-semibold text-[#2F3B30] dark:text-[#CEFF65]">
                      {promo.subtitle}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6 overflow-hidden">
                    <CardDescription className="text-center text-[#4A5D4C] dark:text-gray-300 text-base">
                      {promo.description}
                    </CardDescription>

                    <div className="bg-[#F0F4F0] dark:bg-[#1C1C1C] p-4 rounded-lg">
                      <h4 className="font-semibold text-sm text-[#2F3B30] dark:text-white mb-3 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-[#CEFF65] [filter:drop-shadow(0_1px_2px_rgba(206,255,101,0.4))_drop-shadow(0_2px_4px_rgba(206,255,101,0.2))] dark:[filter:none]" />
                        What&apos;s Included:
                      </h4>
                      <ul className="space-y-2">
                        {promo.included.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="flex items-start gap-2 text-sm text-[#4A5D4C] dark:text-gray-300"
                          >
                            <CheckCircle2 className="h-4 w-4 text-[#CEFF65] mt-0.5 flex-shrink-0 [filter:drop-shadow(0_1px_2px_rgba(206,255,101,0.4))_drop-shadow(0_2px_4px_rgba(206,255,101,0.2))] dark:[filter:none]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-[#2F3B30] dark:bg-[#4A5D4C] p-3 rounded-lg">
                      <p className="text-xs text-white dark:text-gray-200 text-center flex items-center justify-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        {promo.guarantee}
                      </p>
                    </div>

                    <div className="flex items-baseline justify-center gap-3 py-2">
                      <p className="text-3xl font-bold text-[#2F3B30] dark:text-[#CEFF65]">
                        {promo.price}
                      </p>
                      {promo.oldPrice && (
                        <p className="text-xl line-through text-gray-500 dark:text-gray-400">
                          {promo.oldPrice}
                        </p>
                      )}
                    </div>

                    <Button
                      onClick={() =>
                        emitEvent(EVENTS.OPEN_ESTIMATE_MODAL, {
                          service: promo.service,
                        })
                      }
                      size="lg"
                      className="w-full bg-[#2F3B30] text-white border-0 font-semibold transition-all duration-200 ease-in-out shadow-[-2px_-2px_5px_rgba(255,255,255,0.8),2px_2px_5px_rgba(186,190,204,0.4)] hover:shadow-[-1px_-1px_3px_rgba(255,255,255,0.8),1px_1px_3px_rgba(186,190,204,0.4)] hover:scale-105 active:shadow-[inset_1px_1px_2px_rgba(186,190,204,0.5),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-none dark:bg-[#4A5D4C]"
                    >
                      {promo.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Coming Soon Section */}
        <section className="py-20 bg-white dark:bg-[#2F3B30]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Coming Soon
              </h2>
              <p className="text-lg text-[#4A5D4C] dark:text-gray-300 max-w-2xl mx-auto">
                Exciting new services in development - stay tuned for winter
                coverage!
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {comingSoonServices.map((service, index) => (
                <Card
                  key={index}
                  className="bg-[#F0F4F0] dark:bg-[#4A5D4C] border-2 border-dashed border-gray-400 dark:border-gray-500 relative opacity-75"
                >
                  <div className="absolute top-4 right-4 bg-gray-400 text-white px-3 py-1.5 font-bold text-xs rounded-full shadow-md z-10">
                    COMING SOON
                  </div>
                  <CardHeader className="text-center overflow-hidden">
                    <div className="flex justify-center items-center opacity-60">
                      {service.icon}
                    </div>
                    <CardTitle className="text-2xl mb-2 text-gray-600 dark:text-gray-300">
                      {service.title}
                    </CardTitle>
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                      {service.subtitle}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6 overflow-hidden">
                    <CardDescription className="text-center text-[#4A5D4C] dark:text-gray-400 text-base">
                      {service.description}
                    </CardDescription>

                    <div className="bg-white dark:bg-[#2F3B30] p-4 rounded-lg">
                      <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-300 mb-3 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-gray-400" />
                        Planned Features:
                      </h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400"
                          >
                            <CheckCircle2 className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      disabled
                      size="lg"
                      className="w-full bg-gray-400 text-white border-0 cursor-not-allowed opacity-60 font-semibold shadow-[inset_1px_1px_2px_rgba(186,190,204,0.5),inset_-1px_-1px_2px_rgba(255,255,255,0.3)] dark:shadow-none"
                    >
                      Coming Soon
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Testimonials Section */}
        <section className="py-20 bg-[#F0F4F0] dark:bg-[#1C1C1C]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What Our Clients Say
              </h2>
              <p className="text-lg text-[#4A5D4C] dark:text-gray-300 max-w-2xl mx-auto">
                Don&apos;t just take our word for it - hear from homeowners who
                have transformed their properties
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="bg-white dark:bg-[#2F3B30] border-0 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
                >
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex justify-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 text-[#CEFF65] fill-current"
                        />
                      ))}
                    </div>

                    <div className="bg-[#F0F4F0] dark:bg-[#1C1C1C] p-4 rounded-lg">
                      <p className="text-sm text-[#4A5D4C] dark:text-gray-300 leading-relaxed">
                        &ldquo;{testimonial.text}&rdquo;
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="font-bold text-[#2F3B30] dark:text-white mb-1">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-[#4A5D4C] dark:text-gray-400 mb-2">
                        {testimonial.location}
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="bg-[#CEFF65] text-[#2F3B30] px-2 py-1 rounded font-semibold">
                          {testimonial.service}
                        </span>
                      </div>
                      <p className="text-xs text-[#4A5D4C] dark:text-gray-400 mt-2 italic">
                        {testimonial.project}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-[#4A5D4C] dark:text-gray-300 mb-6 text-lg">
                Ready to join our satisfied customers?
              </p>
              <Button
                size="lg"
                onClick={() => emitEvent(EVENTS.OPEN_ESTIMATE_MODAL)}
                className="bg-[#2F3B30] text-white border-0 font-semibold transition-all duration-200 ease-in-out shadow-[-2px_-2px_5px_rgba(255,255,255,0.8),2px_2px_5px_rgba(186,190,204,0.4)] hover:shadow-[-1px_-1px_3px_rgba(255,255,255,0.8),1px_1px_3px_rgba(186,190,204,0.4)] active:shadow-[inset_1px_1px_2px_rgba(186,190,204,0.5),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-none dark:bg-[#4A5D4C]"
              >
                Get Your Free Estimate
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#2F3B30] text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Outdoor Space?
            </h2>
            <p className="text-lg md:text-xl mb-8">
              Contact us today for a free consultation and estimate.
            </p>
            <Button
              size="lg"
              variant="outline"
              className="bg-[#CEFF65] text-[#2F3B30] border-0 font-semibold transition-all duration-200 ease-in-out shadow-[-2px_-2px_5px_rgba(255,255,255,0.8),2px_2px_5px_rgba(186,190,204,0.4)] hover:shadow-[-1px_-1px_3px_rgba(255,255,255,0.8),1px_1px_3px_rgba(186,190,204,0.4)] active:shadow-[inset_1px_1px_2px_rgba(186,190,204,0.5),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-none dark:bg-[#4A5D4C] dark:text-white"
              onClick={() => emitEvent(EVENTS.OPEN_ESTIMATE_MODAL)}
            >
              Get Started
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}

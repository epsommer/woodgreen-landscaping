"use client";

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
  TreePine,
  Wind,
  Snowflake,
  ArrowRight,
  Star,
  CheckCircle2,
  Shield,
  Award,
  Users,
  Leaf,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { HeroSection } from "@/components/HeroSection";
import { useState } from "react";

export function Home() {
  const [expandedService, setExpandedService] = useState<number | null>(null);

  const featuredServices = [
    {
      icon: <TreePine className="h-8 w-8 mb-2" />,
      title: "Landscape Design",
      description: "Transform your outdoor space with our expert design services.",
      subheading: "Personalized Solutions for Every Property",
      features: [
        "Custom 3D landscape visualization",
        "Native plant selection & placement",
        "Hardscape design (patios, walkways, retaining walls)",
        "Sustainable water management solutions",
        "Seasonal color planning",
      ],
      benefits: "Create a stunning outdoor environment that enhances your property value and provides year-round enjoyment.",
      link: "/design",
    },
    {
      icon: <Sun className="h-8 w-8 mb-2" />,
      title: "Lawn Care",
      description: "Professional lawn maintenance for a pristine, healthy yard.",
      subheading: "Complete Lawn Health Management",
      features: [
        "Regular mowing & edging services",
        "Fertilization & weed control programs",
        "Aeration & overseeding",
        "Soil testing & pH balancing",
        "Pest & disease management",
      ],
      benefits: "Enjoy a lush, green lawn that's the envy of the neighborhood with our science-backed care approach.",
      link: "/maintenance",
    },
    {
      icon: <Shovel className="h-8 w-8 mb-2" />,
      title: "Garden Maintenance",
      description: "Expert care to keep your gardens thriving all season long.",
      subheading: "Year-Round Garden Excellence",
      features: [
        "Seasonal pruning & trimming",
        "Mulching & bed preparation",
        "Perennial & annual planting",
        "Irrigation system maintenance",
        "Organic pest control options",
      ],
      benefits: "Maintain beautiful, healthy gardens with minimal effort through our comprehensive care programs.",
      link: "/maintenance",
    },
  ];

  const seasonalPromotions = [
    {
      icon: <Wind className="h-12 w-12 mb-4 text-[#CEFF65]" />,
      title: "Fall Cleanup Special",
      subtitle: "Comprehensive Yard Preparation",
      description:
        "Prepare your yard for winter with our complete fall cleanup service package.",
      price: "Starting at $49",
      oldPrice: "$79",
      cta: "Book Now",
      service: "Fall Cleanup",
      included: [
        "Complete leaf removal from lawn and beds",
        "Gutter cleaning and inspection",
        "Perennial cutback and bed cleanup",
        "Final mowing and lawn edging",
        "Debris hauling and disposal",
      ],
      guarantee: "100% satisfaction guaranteed or we'll make it right",
    },
    {
      icon: <Snowflake className="h-12 w-12 mb-4 text-[#CEFF65]" />,
      title: "Winter Snow Removal",
      subtitle: "24/7 Snow & Ice Management",
      description:
        "Stay safe this winter with our reliable, responsive snow removal service.",
      price: "Starting at $399",
      oldPrice: "$899",
      cta: "Book Now",
      service: "Snow Removal",
      included: [
        "Priority plowing for driveways and parking areas",
        "Walkway and entrance clearing",
        "Eco-friendly ice melt application",
        "24/7 emergency service availability",
        "Seasonal contract options available",
      ],
      guarantee: "Response within 2 hours of snowfall completion",
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
      icon: <Award className="h-10 w-10 text-[#CEFF65]" />,
      title: "15+ Years Experience",
      description: "Trusted expertise in landscape design and maintenance across the GTA",
    },
    {
      icon: <Shield className="h-10 w-10 text-[#CEFF65]" />,
      title: "Licensed & Insured",
      description: "Full liability coverage and WSIB compliance for your peace of mind",
    },
    {
      icon: <Users className="h-10 w-10 text-[#CEFF65]" />,
      title: "Dedicated Teams",
      description: "Skilled professionals who take pride in delivering exceptional results",
    },
    {
      icon: <Leaf className="h-10 w-10 text-[#CEFF65]" />,
      title: "Eco-Friendly Practices",
      description: "Sustainable solutions that are better for your landscape and the environment",
    },
  ];

  const processSteps = [
    {
      number: "1",
      title: "Free Consultation",
      description: "We visit your property to understand your vision and needs",
    },
    {
      number: "2",
      title: "Custom Proposal",
      description: "Receive a detailed plan with transparent pricing and timelines",
    },
    {
      number: "3",
      title: "Expert Execution",
      description: "Our skilled team brings your landscape to life with precision",
    },
    {
      number: "4",
      title: "Ongoing Support",
      description: "Enjoy continued maintenance and care to keep your landscape thriving",
    },
  ];

  const handleSchedule = (service: string) => {
    emitEvent(EVENTS.OPEN_SCHEDULER_MODAL, { service });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F4F0] dark:bg-[#1C1C1C] text-[#2F3B30] dark:text-white transition-colors duration-300">
      <main className="flex-grow">
        {/* Hero Section with 3D Scene */}
        <HeroSection onGetStarted={() => emitEvent(EVENTS.OPEN_ESTIMATE_MODAL)} />

        <section id="services" className="py-20 bg-white dark:bg-[#2F3B30]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Featured Services
              </h2>
              <p className="text-lg text-[#4A5D4C] dark:text-gray-300 max-w-2xl mx-auto">
                Comprehensive landscaping solutions tailored to your property&apos;s unique needs
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredServices.map((service, index) => (
                <Card
                  key={index}
                  className="bg-[#F0F4F0] dark:bg-[#4A5D4C] border-0 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer group"
                  onClick={() => setExpandedService(expandedService === index ? null : index)}
                >
                  <CardHeader>
                    <CardTitle className="flex flex-col items-center text-center">
                      <div className="transition-transform duration-300 group-hover:scale-110">
                        {service.icon}
                      </div>
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-center text-[#4A5D4C] dark:text-gray-300 font-medium">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-sm text-[#2F3B30] dark:text-[#CEFF65]">
                        {service.subheading}
                      </h4>

                      {expandedService === index && (
                        <div className="space-y-4 animate-in fade-in-50 slide-in-from-top-2 duration-300">
                          <ul className="space-y-2 text-sm text-[#4A5D4C] dark:text-gray-300">
                            {service.features.map((feature, featureIndex) => (
                              <li key={featureIndex} className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-[#CEFF65] mt-0.5 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>

                          <div className="bg-white dark:bg-[#2F3B30] p-3 rounded-lg">
                            <p className="text-sm text-[#4A5D4C] dark:text-gray-300 italic">
                              {service.benefits}
                            </p>
                          </div>

                          <Link href={service.link}>
                            <Button
                              variant="outline"
                              className="w-full bg-[#2F3B30] hover:bg-[#3A4A3A] text-white border-0"
                            >
                              Learn More
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      )}

                      <button className="w-full flex items-center justify-center gap-2 text-sm text-[#2F3B30] dark:text-[#CEFF65] font-medium hover:underline">
                        {expandedService === index ? (
                          <>
                            Show Less <ChevronUp className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            Show Details <ChevronDown className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/services">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-[#2F3B30] hover:bg-[#3A4A3A] text-white border-0 dark:bg-[#4A5D4C] dark:hover:bg-[#3A4A3A]"
                >
                  View All Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#F0F4F0] dark:bg-[#1C1C1C]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Seasonal Promotions
              </h2>
              <p className="text-lg text-[#4A5D4C] dark:text-gray-300 max-w-2xl mx-auto">
                Limited-time offers to help you maintain a beautiful outdoor space year-round
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {seasonalPromotions.map((promo, index) => (
                <Card
                  key={index}
                  className="bg-white dark:bg-[#2F3B30] border-0 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-[#CEFF65] text-[#2F3B30] px-4 py-1 font-bold text-sm transform rotate-12 translate-x-8 translate-y-2">
                    SAVE {((parseFloat(promo.oldPrice?.replace('$', '') || '0') - parseFloat(promo.price.replace(/Starting at \$/, ''))) / parseFloat(promo.oldPrice?.replace('$', '') || '1') * 100).toFixed(0)}%
                  </div>
                  <CardHeader className="text-center">
                    <div className="transition-transform duration-300 group-hover:scale-110">
                      {promo.icon}
                    </div>
                    <CardTitle className="text-2xl mb-2">
                      {promo.title}
                    </CardTitle>
                    <p className="text-sm font-semibold text-[#2F3B30] dark:text-[#CEFF65]">
                      {promo.subtitle}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <CardDescription className="text-center text-[#4A5D4C] dark:text-gray-300 text-base">
                      {promo.description}
                    </CardDescription>

                    <div className="bg-[#F0F4F0] dark:bg-[#1C1C1C] p-4 rounded-lg">
                      <h4 className="font-semibold text-sm text-[#2F3B30] dark:text-white mb-3 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-[#CEFF65]" />
                        What&apos;s Included:
                      </h4>
                      <ul className="space-y-2">
                        {promo.included.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-2 text-sm text-[#4A5D4C] dark:text-gray-300">
                            <CheckCircle2 className="h-4 w-4 text-[#CEFF65] mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-[#2F3B30] dark:bg-[#4A5D4C] p-3 rounded-lg">
                      <p className="text-xs text-white dark:text-gray-200 text-center flex items-center justify-center gap-2">
                        <Shield className="h-4 w-4" />
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
                      onClick={() => handleSchedule(promo.service)}
                      size="lg"
                      className="w-full bg-[#2F3B30] hover:bg-[#3A4A3A] text-white border-0 dark:bg-[#4A5D4C] dark:hover:bg-[#3A4A3A] transition-all duration-300 hover:scale-105"
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

        {/* Why Choose Us Section */}
        <section className="py-20 bg-white dark:bg-[#2F3B30]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose Woodgreen Landscaping?
              </h2>
              <p className="text-lg text-[#4A5D4C] dark:text-gray-300 max-w-2xl mx-auto">
                Experience the difference that comes from working with true landscaping professionals
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {whyChooseUs.map((reason, index) => (
                <Card
                  key={index}
                  className="bg-[#F0F4F0] dark:bg-[#4A5D4C] border-0 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
                >
                  <CardContent className="pt-8 pb-6">
                    <div className="flex justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                      {reason.icon}
                    </div>
                    <h3 className="font-bold text-lg mb-3 text-[#2F3B30] dark:text-white">
                      {reason.title}
                    </h3>
                    <p className="text-sm text-[#4A5D4C] dark:text-gray-300">
                      {reason.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-[#F0F4F0] dark:bg-[#1C1C1C] rounded-2xl p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold text-center mb-4">
                Our Simple 4-Step Process
              </h3>
              <p className="text-center text-[#4A5D4C] dark:text-gray-300 mb-12 max-w-2xl mx-auto">
                From initial consultation to ongoing maintenance, we make creating your dream landscape easy
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {processSteps.map((step, index) => (
                  <div key={index} className="relative">
                    <div className="flex flex-col items-center text-center group">
                      <div className="w-16 h-16 rounded-full bg-[#2F3B30] dark:bg-[#4A5D4C] text-white flex items-center justify-center text-2xl font-bold mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#3A4A3A]">
                        {step.number}
                      </div>
                      <h4 className="font-bold text-lg mb-2 text-[#2F3B30] dark:text-white">
                        {step.title}
                      </h4>
                      <p className="text-sm text-[#4A5D4C] dark:text-gray-300">
                        {step.description}
                      </p>
                    </div>
                    {index < processSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-[#2F3B30] dark:bg-[#4A5D4C] -translate-x-1/2" />
                    )}
                  </div>
                ))}
              </div>
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
                Don&apos;t just take our word for it - hear from homeowners who have transformed their properties
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="bg-white dark:bg-[#2F3B30] border-0 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
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
                className="bg-[#2F3B30] hover:bg-[#3A4A3A] text-white border-0 dark:bg-[#4A5D4C] dark:hover:bg-[#3A4A3A]"
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
              className="bg-[#CEFF65] hover:bg-[#CEFF65]/90 text-[#2F3B30] border-0 dark:bg-[#4A5D4C] dark:text-white dark:hover:bg-[#3A4A3A]"
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

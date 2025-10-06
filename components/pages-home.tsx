"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { subscribeToEvent, EVENTS } from "@/lib/events";
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
} from "lucide-react";
import Link from "next/link";
import { EstimateCalculator } from "@/components/estimate-calculator";
import Scheduler from "@/components/scheduler";
import { HeroSection } from "@/components/HeroSection";

export function Home() {
  const [showEstimateCalculator, setShowEstimateCalculator] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  // Listen for estimate modal open event from navigation
  useEffect(() => {
    const unsubscribe = subscribeToEvent(EVENTS.OPEN_ESTIMATE_MODAL, () => {
      setShowEstimateCalculator(true);
    });
    return unsubscribe;
  }, []);

  const featuredServices = [
    {
      icon: <TreePine className="h-8 w-8 mb-2" />,
      title: "Landscape Design",
      description: "Custom designs tailored to your space.",
    },
    {
      icon: <Sun className="h-8 w-8 mb-2" />,
      title: "Lawn Care",
      description: "Comprehensive lawn maintenance services.",
    },
    {
      icon: <Shovel className="h-8 w-8 mb-2" />,
      title: "Garden Maintenance",
      description: "Expert care for your garden and plants.",
    },
  ];

  const seasonalPromotions = [
    {
      icon: <Wind className="h-12 w-12 mb-4 text-[#CEFF65]" />,
      title: "Fall Cleanup Special",
      description:
        "Prepare your yard for winter with our comprehensive fall cleanup service.",
      price: "Starting at $39",
      cta: "Book Now",
      service: "Fall Cleanup",
    },
    {
      icon: <Snowflake className="h-12 w-12 mb-4 text-[#CEFF65]" />,
      title: "Winter Snow Removal",
      description:
        "Stay safe this winter with our reliable snow removal service.",
      price: "Starting at $299",
      cta: "Book Now",
      service: "Snow Removal",
    },
  ];

  const testimonials = [
    {
      name: "John D.",
      text: "Woodgreen transformed our backyard into a beautiful oasis. Highly recommended!",
    },
    {
      name: "Sarah M.",
      text: "Professional, punctual, and perfect results. Couldn&apos;t be happier with their service.",
    },
    {
      name: "Mike R.",
      text: "Their lawn care service is top-notch. Our yard has never looked better!",
    },
  ];

  const handleSchedule = (service: string) => {
    setSelectedService(service);
    setShowScheduler(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F4F0] dark:bg-[#1C1C1C] text-[#2F3B30] dark:text-white transition-colors duration-300">
      <main className="flex-grow">
        {/* Hero Section with 3D Scene */}
        <HeroSection onGetStarted={() => setShowEstimateCalculator(true)} />

        <section id="services" className="py-20 bg-white dark:bg-[#2F3B30]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Featured Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredServices.map((service, index) => (
                <Card
                  key={index}
                  className="text-center bg-[#F0F4F0] dark:bg-[#4A5D4C] border-0"
                >
                  <CardHeader>
                    <CardTitle className="flex flex-col items-center">
                      {service.icon}
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-[#4A5D4C] dark:text-gray-300">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/services">
                <Button
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
            <h2 className="text-3xl font-bold text-center mb-12">
              Seasonal Promotions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {seasonalPromotions.map((promo, index) => (
                <Card
                  key={index}
                  className="bg-white dark:bg-[#2F3B30] border-0"
                >
                  <CardHeader>
                    <CardTitle className="flex flex-col items-center">
                      {promo.icon}
                      {promo.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="mb-4 text-[#4A5D4C] dark:text-gray-300">
                      {promo.description}
                    </CardDescription>
                    <p className="text-2xl font-bold text-[#2F3B30] dark:text-[#CEFF65] mb-4">
                      {promo.price}
                    </p>
                    <Button
                      onClick={() => handleSchedule(promo.service)}
                      className="bg-[#2F3B30] hover:bg-[#3A4A3A] text-white border-0 dark:bg-[#4A5D4C] dark:hover:bg-[#3A4A3A]"
                    >
                      {promo.cta}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-[#2F3B30]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              What Our Clients Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="bg-[#F0F4F0] dark:bg-[#4A5D4C] border-0"
                >
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 text-[#CEFF65] fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-center mb-4 text-[#4A5D4C] dark:text-gray-300">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>
                    <p className="text-center font-semibold">
                      {testimonial.name}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#2F3B30] text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Transform Your Outdoor Space?
            </h2>
            <p className="text-xl mb-8">
              Contact us today for a free consultation and estimate.
            </p>
            <Button
              size="lg"
              variant="outline"
              className="bg-[#CEFF65] hover:bg-[#CEFF65]/90 text-[#2F3B30] border-0 dark:bg-[#4A5D4C] dark:text-white dark:hover:bg-[#3A4A3A]"
              onClick={() => setShowEstimateCalculator(true)}
            >
              Get Started
            </Button>
          </div>
        </section>
      </main>

      {showEstimateCalculator && (
        <EstimateCalculator
          onClose={() => setShowEstimateCalculator(false)}
          onScheduleConsultation={() => {
            setShowEstimateCalculator(false);
            setShowScheduler(true);
          }}
        />
      )}

      {showScheduler && (
        <Scheduler
          onClose={() => setShowScheduler(false)}
          initialService={selectedService}
        />
      )}
    </div>
  );
}

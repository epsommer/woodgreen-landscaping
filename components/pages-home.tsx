"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Leaf, Shovel, TreePine, Wind, Snowflake, Star } from "lucide-react";
import Link from "next/link";
import EstimateCalculator from "@/components/estimate-calculator";
import Scheduler from "@/components/scheduler";
import { Carousel } from "@/components/carousel";
import { SunIcon, ArrowRightIcon } from "@radix-ui/react-icons";

const carouselImages = [
  {
    src: "/placeholder.svg?height=600&width=1920&text=Beautiful+Landscape+1",
    alt: "Beautiful landscape 1",
  },
  {
    src: "/placeholder.svg?height=600&width=1920&text=Beautiful+Landscape+2",
    alt: "Beautiful landscape 2",
  },
  {
    src: "/placeholder.svg?height=600&width=1920&text=Beautiful+Landscape+3",
    alt: "Beautiful landscape 3",
  },
];

export function Home() {
  const [showEstimateCalculator, setShowEstimateCalculator] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const featuredServices = [
    {
      icon: <Leaf className="h-8 w-8 mb-2" />,
      title: "Landscape Design",
      description: "Custom designs tailored to your space.",
    },
    {
      icon: <SunIcon className="h-8 w-8 mb-2" />,
      title: "Lawn Care",
      description: "Comprehensive lawn maintenance services.",
    },
    {
      icon: <TreePine className="h-8 w-8 mb-2" />,
      title: "Tree Services",
      description: "Expert tree care and management.",
    },
    {
      icon: <Shovel className="h-8 w-8 mb-2" />,
      title: "Garden Tools Rental",
      description: "Rent quality tools for your gardening needs.",
    },
  ];

  const seasonalPromotions = [
    {
      icon: <Wind className="h-12 w-12 mb-4 text-orange-500" />,
      title: "Fall Cleanup Special",
      description:
        "Prepare your yard for winter with our comprehensive fall cleanup service.",
      price: "Starting at $39",
      cta: "Book Now",
      service: "Fall Cleanup",
    },
    {
      icon: <Snowflake className="h-12 w-12 mb-4 text-blue-500" />,
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
      text: "Professional, punctual, and perfect results. Couldn't be happier with their service.",
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
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold">Woodgreen Landscaping</span>
          </Link>
          <nav className="hidden md:flex space-x-4">
            <Link
              href="/services"
              className="text-gray-600 hover:text-green-600"
            >
              Services
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-green-600">
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-600 hover:text-green-600"
            >
              Contact
            </Link>
          </nav>
          <Button onClick={() => setShowEstimateCalculator(true)}>
            Get Estimate
          </Button>
        </div>
      </header>

      <main className="flex-grow">
        <section className="h-[600px]">
          <Carousel images={carouselImages} />
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Featured Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredServices.map((service, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <CardTitle className="flex flex-col items-center">
                      {service.icon}
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{service.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/services">
                <Button variant="outline">
                  View All Services
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Seasonal Promotions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {seasonalPromotions.map((promo, index) => (
                <Card key={index} className="bg-white">
                  <CardHeader>
                    <CardTitle className="flex flex-col items-center">
                      {promo.icon}
                      {promo.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="mb-4">
                      {promo.description}
                    </CardDescription>
                    <p className="text-2xl font-bold text-green-600 mb-4">
                      {promo.price}
                    </p>
                    <Button onClick={() => handleSchedule(promo.service)}>
                      {promo.cta}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              What Our Clients Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-white">
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-center mb-4">
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

        <section className="py-20 bg-green-600 text-white">
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
              className="text-green-600 bg-white border-white hover:bg-green-600 hover:text-white"
              onClick={() => setShowEstimateCalculator(true)}
            >
              Get Started
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>&copy; 2024 Woodgreen Landscaping. All rights reserved.</p>
            </div>
            <nav className="flex space-x-4">
              <Link href="/privacy" className="hover:text-green-400">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-green-400">
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>
      </footer>

      {showEstimateCalculator && (
        <EstimateCalculator onClose={() => setShowEstimateCalculator(false)} />
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

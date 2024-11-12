"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Leaf,
  Shovel,
  Droplets,
  Sun,
  TreePine,
  Lightbulb,
  Fence,
  PaintBucket,
} from "lucide-react";
import Link from "next/link";
import { EstimateCalculator } from "./estimate-calculator";

export function ServicesPage() {
  const [showEstimateCalculator, setShowEstimateCalculator] = useState(false);

  const services = [
    {
      title: "Landscape Design",
      description:
        "Custom designs tailored to your space and preferences, creating beautiful and functional outdoor areas.",
      icon: <Leaf className="h-6 w-6" />,
    },
    {
      title: "Garden Maintenance",
      description:
        "Regular upkeep to keep your garden looking its best, including mowing, pruning, and weed control.",
      icon: <Shovel className="h-6 w-6" />,
    },
    {
      title: "Irrigation Systems",
      description:
        "Design and installation of efficient watering solutions to keep your landscape healthy and vibrant.",
      icon: <Droplets className="h-6 w-6" />,
    },
    {
      title: "Hardscaping",
      description:
        "Creation of patios, walkways, retaining walls, and other structural elements to enhance your outdoor living space.",
      icon: <Fence className="h-6 w-6" />,
    },
    {
      title: "Lawn Care",
      description:
        "Comprehensive lawn services including seeding, sodding, fertilization, and pest control for a lush, green lawn.",
      icon: <Sun className="h-6 w-6" />,
    },
    {
      title: "Tree Services",
      description:
        "Professional tree planting, trimming, and removal services to maintain the health and safety of your landscape.",
      icon: <TreePine className="h-6 w-6" />,
    },
    {
      title: "Outdoor Lighting",
      description:
        "Design and installation of landscape lighting to enhance the beauty and security of your outdoor spaces.",
      icon: <Lightbulb className="h-6 w-6" />,
    },
    {
      title: "Seasonal Color",
      description:
        "Planting and maintenance of seasonal flowers and plants to add vibrant colors to your landscape year-round.",
      icon: <PaintBucket className="h-6 w-6" />,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="/">
          <Leaf className="h-6 w-6" />
          <span className="ml-2 text-lg font-bold">Woodgreen Landscaping</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/"
          >
            Home
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#contact"
          >
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-green-700">
                  Our Landscaping Services
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Discover our range of professional landscaping services
                  designed to transform your outdoor space.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {services.map((service, index) => (
                <Card key={index} className="flex flex-col justify-between">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      {service.icon}
                      <CardTitle>{service.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{service.description}</CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Learn More</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section
          id="contact"
          className="w-full py-12 md:py-24 lg:py-32 bg-green-100"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Get a Free Quote
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Ready to transform your outdoor space? Contact us today for a
                  free consultation and quote.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => setShowEstimateCalculator(true)}
                >
                  Estimate Calculator
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Woodgreen Landscaping. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
      {showEstimateCalculator && (
        <EstimateCalculator onClose={() => setShowEstimateCalculator(false)} />
      )}
    </div>
  );
}


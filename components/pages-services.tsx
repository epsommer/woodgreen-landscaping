"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import Image from "next/image";
import EstimateCalculator from "@/components/estimate-calculator";
import { useState } from "react";

export function Services() {
  const [showEstimateCalculator, setShowEstimateCalculator] = useState(false);

  const services = [
    {
      icon: <Leaf className="h-12 w-12 mb-4" />,
      title: "Landscape Design",
      description:
        "Custom designs tailored to your space and preferences, creating beautiful and functional outdoor areas.",
    },
    {
      icon: <Shovel className="h-12 w-12 mb-4" />,
      title: "Garden Maintenance",
      description:
        "Regular upkeep to keep your garden looking its best, including mowing, pruning, and weed control.",
    },
    {
      icon: <Droplets className="h-12 w-12 mb-4" />,
      title: "Irrigation Systems",
      description:
        "Design and installation of efficient watering solutions to keep your landscape healthy and vibrant.",
    },
    {
      icon: <Fence className="h-12 w-12 mb-4" />,
      title: "Hardscaping",
      description:
        "Creation of patios, walkways, retaining walls, and other structural elements to enhance your outdoor living space.",
    },
    {
      icon: <Sun className="h-12 w-12 mb-4" />,
      title: "Lawn Care",
      description:
        "Comprehensive lawn services including seeding, sodding, fertilization, and pest control for a lush, green lawn.",
    },
    {
      icon: <TreePine className="h-12 w-12 mb-4" />,
      title: "Tree Services",
      description:
        "Professional tree planting, trimming, and removal services to maintain the health and safety of your landscape.",
    },
    {
      icon: <Lightbulb className="h-12 w-12 mb-4" />,
      title: "Outdoor Lighting",
      description:
        "Design and installation of landscape lighting to enhance the beauty and security of your outdoor spaces.",
    },
    {
      icon: <PaintBucket className="h-12 w-12 mb-4" />,
      title: "Seasonal Color",
      description:
        "Planting and maintenance of seasonal flowers and plants to add vibrant colors to your landscape year-round.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/woodgreen-landscaping-icon.svg" // Path to your custom logo
              alt="Woodgreen Landscaping Logo" // Alternative text
              width={32} // Specify the width
              height={32} // Specify the height
              className="text-green-600" // Apply any necessary styles
            />
            <span className="text-xl font-bold">Woodgreen Landscaping</span>
          </Link>
          <nav className="hidden md:flex space-x-4">
            <Link href="/" className="text-gray-600 hover:text-green-600">
              Home
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
        <section className="bg-green-50 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Our Services
              </h1>
              <p className="text-xl mb-8">
                Discover our comprehensive range of landscaping services
                designed to transform your outdoor space.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex flex-col items-center">
                      {service.icon}
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription>{service.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-green-50 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                Ready to Transform Your Outdoor Space?
              </h2>
              <p className="text-xl mb-8">
                Contact us today for a free consultation and estimate.
              </p>
              <Button size="lg" onClick={() => setShowEstimateCalculator(true)}>
                Get a Free Estimate
              </Button>
            </div>
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
    </div>
  );
}


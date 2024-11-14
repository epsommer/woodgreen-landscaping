"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import EstimateCalculator from "@/components/estimate-calculator";
import { useState } from "react";

export function About() {
  const [showEstimateCalculator, setShowEstimateCalculator] = useState(false);

  const teamMembers = [
    { name: "John Doe", role: "Founder & Lead Designer" },
    { name: "Jane Smith", role: "Senior Landscaper" },
    { name: "Mike Johnson", role: "Horticulturist" },
    { name: "Emily Brown", role: "Customer Relations Manager" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/woodgreen-landscaping-icon.svg"
              alt="Woodgreen Landscaping Logo"
              width={32}
              height={32}
              className="text-green-600"
            />
            <span className="text-xl font-bold">Woodgreen Landscaping</span>
          </Link>
          <nav className="hidden md:flex space-x-4">
            <Link href="/" className="text-gray-600 hover:text-green-600">
              Home
            </Link>
            <Link
              href="/services"
              className="text-gray-600 hover:text-green-600"
            >
              Services
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
                About Woodgreen Landscaping
              </h1>
              <p className="text-xl mb-8">
                Transforming outdoor spaces with passion and expertise since
                1995.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="mb-4">
                  Founded in 1995, Woodgreen Landscaping has been dedicated to
                  creating beautiful, sustainable outdoor spaces for our
                  clients.
                </p>
                <p>
                  Over the years, we&apos;ve grown from a small team of
                  enthusiasts to a full-service landscaping company.
                </p>
              </div>
              <div>
                <Image
                  src="/placeholder.svg?text=Our+Team" // Keep the 'text' query parameter
                  alt="Woodgreen Landscaping Team"
                  width={600} // Correct width passed as a prop
                  height={400} // Correct height passed as a prop
                  className="rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-green-50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                "Over 25 years of experience",
                "Certified and skilled professionals",
                "Eco-friendly practices",
                "Customized design solutions",
                "Exceptional customer service",
                "Ongoing maintenance support",
              ].map((item, index) => (
                <Card key={index} className="flex items-start p-4">
                  <Check className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <CardContent className="p-0">{item}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Meet Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <Image
                      src={`/placeholder.svg?text=${member.name}`} // Keep only the 'text' query parameter
                      alt={member.name}
                      width={150}
                      height={150}
                      className="rounded-full mx-auto mb-4"
                    />

                    <h3 className="font-bold mb-1">{member.name}</h3>
                    <p className="text-gray-600">{member.role}</p>
                  </CardContent>
                </Card>
              ))}
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

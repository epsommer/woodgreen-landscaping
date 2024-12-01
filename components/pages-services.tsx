'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shovel, Sun, TreePine, Droplets, Scissors, Snowflake } from 'lucide-react'

export function Services() {
  const services = [
    { icon: <TreePine className="h-8 w-8 mb-2" />, title: "Landscape Design", description: "Custom designs tailored to your space and preferences." },
    { icon: <Sun className="h-8 w-8 mb-2" />, title: "Lawn Care", description: "Comprehensive lawn maintenance services for a healthy, lush yard." },
    { icon: <Shovel className="h-8 w-8 mb-2" />, title: "Garden Maintenance", description: "Expert care for your garden, including planting and pruning." },
    { icon: <Droplets className="h-8 w-8 mb-2" />, title: "Irrigation Systems", description: "Installation and maintenance of efficient watering systems." },
    { icon: <Scissors className="h-8 w-8 mb-2" />, title: "Tree & Shrub Care", description: "Pruning, shaping, and health management for trees and shrubs." },
    { icon: <Snowflake className="h-8 w-8 mb-2" />, title: "Snow Removal", description: "Reliable snow clearing services for residential and commercial properties." },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F4F0] dark:bg-[#1C1C1C] text-[#2F3B30] dark:text-white transition-colors duration-300">
      <main className="flex-grow">
        <section className="bg-[#2F3B30] text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4 text-center">Our Services</h1>
            <p className="text-xl text-center max-w-2xl mx-auto">
              Discover our comprehensive range of landscaping services designed to transform your outdoor space.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="bg-white dark:bg-[#2F3B30] border-0">
                  <CardHeader>
                    <CardTitle className="flex flex-col items-center">
                      {service.icon}
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-[#4A5D4C] dark:text-gray-300">{service.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#CEFF65] dark:bg-[#4A5D4C] py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6 text-[#2F3B30] dark:text-white">Ready to Get Started?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-[#2F3B30] dark:text-gray-200">
              Contact us today to discuss your landscaping needs and receive a personalized quote.
            </p>
            <Button size="lg" className="bg-[#2F3B30] hover:bg-[#3A4A3A] text-white dark:bg-white dark:text-[#2F3B30] dark:hover:bg-gray-200">
              Request a Quote
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}
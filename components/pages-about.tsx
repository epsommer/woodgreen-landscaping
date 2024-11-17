'use client'

import Image from "next/image"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Award, Users, Leaf } from 'lucide-react'

export function About() {
  const teamMembers = [
    { name: "John Doe", role: "Founder & Lead Designer", image: "/placeholder.svg?height=200&width=200" },
    { name: "Jane Smith", role: "Head of Horticulture", image: "/placeholder.svg?height=200&width=200" },
    { name: "Mike Johnson", role: "Irrigation Specialist", image: "/placeholder.svg?height=200&width=200" },
    { name: "Emily Brown", role: "Customer Relations Manager", image: "/placeholder.svg?height=200&width=200" },
  ]

  const reasons = [
    { icon: <Award className="h-6 w-6" />, title: "Expertise", description: "25+ years of landscaping experience" },
    { icon: <Users className="h-6 w-6" />, title: "Dedicated Team", description: "Certified and insured professionals" },
    { icon: <Leaf className="h-6 w-6" />, title: "Eco-Friendly", description: "Sustainable practices and materials" },
    { icon: <CheckCircle2 className="h-6 w-6" />, title: "Quality Assurance", description: "Satisfaction guaranteed on every project" },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F4F0] dark:bg-[#1C1C1C] text-[#2F3B30] dark:text-white transition-colors duration-300">
      <MainNav />

      <main className="flex-grow">
        <section className="bg-[#2F3B30] text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4 text-center">About Woodgreen Landscaping</h1>
            <p className="text-xl text-center max-w-2xl mx-auto">
              Transforming outdoor spaces with passion, expertise, and sustainable practices since 1995.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="mb-4">
                  Woodgreen Landscaping was founded in 1995 by John Doe, a passionate gardener with a vision to create beautiful, sustainable outdoor spaces. What started as a small family business has grown into a team of dedicated professionals serving our community for over 25 years.
                </p>
                <p className="mb-4">
                  Our journey has been marked by a commitment to quality, innovation, and customer satisfaction. We've evolved with the industry, embracing new technologies and eco-friendly practices to deliver the best possible results for our clients.
                </p>
                <p>
                  Today, Woodgreen Landscaping is proud to be a leader in sustainable landscaping, creating outdoor environments that not only look beautiful but also contribute positively to our ecosystem.
                </p>
              </div>
              <div className="md:w-1/2">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Woodgreen Landscaping team at work"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-[#2F3B30] py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="bg-[#F0F4F0] dark:bg-[#4A5D4C] border-0">
                  <CardHeader>
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={200}
                      height={200}
                      className="rounded-full mx-auto"
                    />
                  </CardHeader>
                  <CardContent className="text-center">
                    <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                    <p className="text-[#4A5D4C] dark:text-gray-300">{member.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {reasons.map((reason, index) => (
                <Card key={index} className="bg-white dark:bg-[#2F3B30] border-0">
                  <CardHeader>
                    <CardTitle className="flex flex-col items-center">
                      <div className="bg-[#CEFF65] dark:bg-[#4A5D4C] p-3 rounded-full mb-4">
                        {reason.icon}
                      </div>
                      {reason.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-[#4A5D4C] dark:text-gray-300">{reason.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#CEFF65] dark:bg-[#4A5D4C] py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6 text-[#2F3B30] dark:text-white">Ready to Transform Your Outdoor Space?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-[#2F3B30] dark:text-gray-200">
              Let's bring your vision to life. Contact us today for a free consultation and estimate.
            </p>
            <Button size="lg" className="bg-[#2F3B30] hover:bg-[#3A4A3A] text-white dark:bg-white dark:text-[#2F3B30] dark:hover:bg-gray-200">
              Get Started
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({ ...prevState, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log('Form submitted:', formData)
    // Reset form after submission
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F4F0] dark:bg-[#1C1C1C] text-[#2F3B30] dark:text-white transition-colors duration-300">
      <MainNav />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-white dark:bg-[#2F3B30] border-0">
            <CardHeader>
              <CardTitle>Our Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 mt-1 text-[#CEFF65]" />
                <div>
                  <p className="font-semibold">Address:</p>
                  <p>123 Green Street</p>
                  <p>Woodville, WV 12345</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-[#CEFF65]" />
                <p>(555) 123-4567</p>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-[#CEFF65]" />
                <p>info@woodgreenlandscaping.com</p>
              </div>
              <div className="flex items-start space-x-2">
                <Clock className="w-5 h-5 mt-1 text-[#CEFF65]" />
                <div>
                  <p className="font-semibold">Business Hours:</p>
                  <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                  <p>Saturday: 9:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#2F3B30] border-0">
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block mb-1">Name</label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-1">Email</label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block mb-1">Message</label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full"
                    rows={4}
                  />
                </div>
                <Button type="submit" className="w-full bg-[#2F3B30] hover:bg-[#3A4A3A] text-white">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card className="bg-white dark:bg-[#2F3B30] border-0">
            <CardHeader>
              <CardTitle>Find Us</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Placeholder for map */}
              <div className="w-full h-64 bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <p className="text-gray-600 dark:text-gray-400">Map placeholder</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
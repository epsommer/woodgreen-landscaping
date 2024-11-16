"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log({ name, email, message });
    // Reset form fields
    setName("");
    setEmail("");
    setMessage("");
  };

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
            <Link
              href="/services"
              className="text-gray-600 hover:text-green-600"
            >
              Services
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-green-600">
              About
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <section className="bg-green-50 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Contact Us
              </h1>
              <p className="text-xl mb-8">
                Get in touch with us for any inquiries or to schedule a
                consultation.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block mb-1">
                      Name
                    </label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-1">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block mb-1">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={5}
                    />
                  </div>
                  <Button type="submit">Send Message</Button>
                </form>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-green-600 mr-2" />
                      <span>(647) 327-8401</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-green-600 mr-2" />
                      <span>info@woodgreenlandscaping.com</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-green-600 mr-2" />
                      <span>Newton Drive, Toronto, ON M2M 2M9</span>
                    </div>
                  </CardContent>
                </Card>
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4">Business Hours</h3>
                  <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                  <p>Saturday: 9:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
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
    </div>
  );
}

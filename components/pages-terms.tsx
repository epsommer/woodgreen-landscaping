'use client'

import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"

export function Terms() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F0F4F0] dark:bg-[#1C1C1C] text-[#2F3B30] dark:text-white transition-colors duration-300">
      <MainNav />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Terms of Service</h1>
        <div className="max-w-3xl mx-auto space-y-6">
          <p>
            Welcome to Woodgreen Landscaping. By using our website and services, you agree to comply with and be bound by the following terms and conditions of use.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-3">Use of Services</h2>
          <p>
            Our services are intended for personal and commercial use. You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the service without express written permission from Woodgreen Landscaping.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-3">Intellectual Property</h2>
          <p>
            All content on this website, including text, graphics, logos, and images, is the property of Woodgreen Landscaping and protected by copyright laws.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-3">Limitation of Liability</h2>
          <p>
            Woodgreen Landscaping shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of or inability to use the service.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-3">Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of [Your State/Country]. Any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of [Your State/Country].
          </p>
          <p>
            We reserve the right to modify these terms at any time. Your continued use of our website and services after any changes indicates your acceptance of the modified terms.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
'use client'

import { ContactForm } from "@/components/contact-form"
import { AddressInfo } from "@/components/address-info"
import { MapPlaceholder } from "@/components/map-placeholder"

export function Contact() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F0F4F0] dark:bg-[#1C1C1C] text-[#2F3B30] dark:text-white transition-colors duration-300">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AddressInfo />
          <ContactForm />
        </div>

        <div className="mt-8">
          <MapPlaceholder />
        </div>
      </main>
    </div>
  )
}
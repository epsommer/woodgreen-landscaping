'use client'

import Link from "next/link";

export function Sitemap() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F0F4F0] dark:bg-[#1C1C1C] text-[#2F3B30] dark:text-white transition-colors duration-300">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Sitemap</h1>
        <div className="max-w-3xl mx-auto space-y-8">

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#CEFF65]">Main Pages</h2>
            <ul className="space-y-2 ml-4">
              <li>
                <Link href="/" className="hover:text-[#CEFF65] underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#CEFF65] underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#CEFF65] underline">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/design" className="hover:text-[#CEFF65] underline">
                  Design
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#CEFF65] underline">
                  Contact
                </Link>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#CEFF65]">Services</h2>
            <ul className="space-y-2 ml-4">
              <li>
                <span className="text-sm">Lawn Care - Zero-Emission Maintenance</span>
              </li>
              <li>
                <span className="text-sm">Garden Design - Custom Plantings</span>
              </li>
              <li>
                <span className="text-sm">Tree Services - Health & Maintenance</span>
              </li>
              <li>
                <span className="text-sm">Irrigation - Water-Smart Systems</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#CEFF65]">Legal & Information</h2>
            <ul className="space-y-2 ml-4">
              <li>
                <Link href="/privacy" className="hover:text-[#CEFF65] underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#CEFF65] underline">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/sitemap" className="hover:text-[#CEFF65] underline">
                  Sitemap
                </Link>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[#CEFF65]">Contact Information</h2>
            <ul className="space-y-2 ml-4">
              <li>
                <span className="text-sm">Phone: (647) 327-8401</span>
              </li>
              <li>
                <span className="text-sm">Email: info@woodgreenlandscaping.com</span>
              </li>
              <li>
                <span className="text-sm">Address: 84 Newton Drive, Toronto, ON M2M 2M9</span>
              </li>
            </ul>
          </section>

        </div>
      </main>
    </div>
  )
}

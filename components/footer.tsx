"use client";

import Link from "next/link";
import { FaFacebook, FaXTwitter, FaInstagram } from "react-icons/fa6";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#2F3B30] dark:bg-black text-white py-12 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-sm">
              Woodgreen Landscaping has been providing top-quality landscaping
              services since 2023. We&apos;re committed to creating beautiful,
              sustainable outdoor spaces for our clients.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="hover:text-[#CEFF65]">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#CEFF65]">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#CEFF65]">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#CEFF65]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#CEFF65]">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/sitemap" className="hover:text-[#CEFF65]">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2" /> (647) 327-8401
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2" /> info@woodgreenlandscaping.com
              </li>
              <li className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" /> 84 Newton Drive, Toronto, ON
                M2M 2M9
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-[#CEFF65]">
                <FaFacebook className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-[#CEFF65]">
                <FaXTwitter className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-[#CEFF65]">
                <FaInstagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p>
            &copy; {currentYear} Woodgreen Landscaping. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaFacebook,
  FaXTwitter,
  FaInstagram,
  FaTiktok,
  FaTwitch,
} from "react-icons/fa6";
import { Phone, Mail, ArrowUp, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [mounted, setMounted] = useState(false);
  const footerRef = useRef<HTMLElement>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      if (footerRef.current) {
        const footerTop = footerRef.current.offsetTop;
        const viewportBottom = window.scrollY + window.innerHeight;

        // Show button if user has scrolled down 400px and is within 300px of the footer
        if (window.scrollY > 400 && viewportBottom > footerTop - 300) {
          setShowBackToTop(true);
        } else {
          setShowBackToTop(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const logoSrc = "/woodgreen-landscaping-logo-palmette-inverse.svg";

  return (
    <footer
      ref={footerRef}
      className="bg-[#2F3B30] dark:bg-black text-white py-12 transition-colors duration-300"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center mb-4">
              {mounted ? (
                <Image
                  src={logoSrc}
                  alt="Woodgreen Landscaping Logo"
                  width={100}
                  height={100}
                  className="h-auto"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                  }}
                />
              ) : (
                <div className="w-[100px] h-[100px]"></div>
              )}
            </Link>
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
              <li>
                <a
                  href="tel:+16473278401"
                  className="flex items-center hover:text-[#CEFF65]"
                >
                  <Phone className="h-4 w-4 mr-2" /> (647) 327-8401
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@woodgreenlandscaping.com"
                  className="flex items-center hover:text-[#CEFF65]"
                >
                  <Mail className="h-4 w-4 mr-2" /> info@woodgreenlandscaping.com
                </a>
              </li>
              <li>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Serving Greater Toronto Area
                </div>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/woodgreenlandscaping"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#CEFF65]"
              >
                <FaFacebook className="h-6 w-6" />
              </a>
              <a
                href="https://x.com/WoodgreenLand"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#CEFF65]"
              >
                <FaXTwitter className="h-6 w-6" />
              </a>
              <a
                href="https://www.instagram.com/woodgreenlandscaping/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#CEFF65]"
              >
                <FaInstagram className="h-6 w-6" />
              </a>
              <a
                href="https://www.tiktok.com/@woodgreenlandscaping"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#CEFF65]"
              >
                <FaTiktok className="h-6 w-6" />
              </a>
              <a
                href="https://www.twitch.tv/woodgreenlandscaping"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#CEFF65]"
              >
                <FaTwitch className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p>
            &copy; {currentYear} Woodgreen Landscaping. All rights reserved.
          </p>
        </div>
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 bg-[#CEFF65] text-[#2F3B30] p-3 rounded-full shadow-lg hover:bg-opacity-80 transition-opacity duration-300 ${
            showBackToTop ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-hidden={!showBackToTop}
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      </div>
    </footer>
  );
}

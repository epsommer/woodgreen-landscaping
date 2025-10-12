"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useTheme } from "next-themes";
import { emitEvent, EVENTS } from "@/lib/events";

export function MainNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const logoSrc = resolvedTheme === "dark"
    ? "/woodgreen-landscaping-logo-palmette-inverse.svg"
    : "/woodgreen-landscaping-logo-palmette.svg";

  return (
    <header className="bg-white dark:bg-[#2F3B30] shadow-sm relative z-nav transition-colors duration-300">
      <div className="container mx-auto px-4 py-4">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between relative">
          <nav className="flex space-x-4">
            <Link
              href="/services"
              className="text-[#4A5D4C] dark:text-gray-300 hover:text-[#2F3B30] dark:hover:text-white"
            >
              Services
            </Link>
            <Link
              href="/design"
              className="text-[#4A5D4C] dark:text-gray-300 hover:text-[#2F3B30] dark:hover:text-white flex items-center gap-1"
            >
              Design Your Garden
              <span className="text-xs bg-[#4A5D4C] dark:bg-gray-600 text-white px-1.5 py-0.5 rounded">BETA</span>
            </Link>
          </nav>

          <Link href="/" className="flex items-center">
            {mounted ? (
              <Image
                src={logoSrc}
                alt="Woodgreen Landscaping Logo"
                width={120}
                height={120}
                className="h-auto"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                }}
              />
            ) : (
              <div className="w-[120px] h-[120px]"></div>
            )}
          </Link>

          <div className="flex items-center space-x-4">
            <nav className="flex space-x-4">
              <Link
                href="/about"
                className="text-[#4A5D4C] dark:text-gray-300 hover:text-[#2F3B30] dark:hover:text-white"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-[#4A5D4C] dark:text-gray-300 hover:text-[#2F3B30] dark:hover:text-white"
              >
                Contact
              </Link>
            </nav>
            <ThemeToggle />
            <Button
              onClick={() => emitEvent(EVENTS.OPEN_ESTIMATE_MODAL)}
              className="bg-[#2F3B30] hover:bg-[#3A4A3A] text-white"
            >
              Get Estimate
            </Button>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden relative flex items-center">
          <div className="absolute left-0">
            <button onClick={toggleMobileMenu}>
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-[#2F3B30] dark:text-white" />
              ) : (
                <Menu className="h-6 w-6 text-[#2F3B30] dark:text-white" />
              )}
            </button>
          </div>
          <Link href="/" className="flex items-center mx-auto">
            {mounted ? (
              <Image
                src={logoSrc}
                alt="Woodgreen Landscaping Logo"
                width={80}
                height={80}
                className="h-auto"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                }}
              />
            ) : (
              <div className="w-[80px] h-[80px]"></div>
            )}
          </Link>
        </div>
      </div>
      <div
        className={`md:hidden bg-white dark:bg-[#2F3B30] absolute top-full left-0 right-0 shadow-md z-mobile-menu overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col space-y-4 py-4 px-4">
          <Link
            href="/services"
            className="text-[#4A5D4C] dark:text-gray-300 hover:text-[#2F3B30] dark:hover:text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            Services
          </Link>
          <Link
            href="/design"
            className="text-[#4A5D4C] dark:text-gray-300 hover:text-[#2F3B30] dark:hover:text-white flex items-center gap-1"
            onClick={() => setMobileMenuOpen(false)}
          >
            Design Your Garden
            <span className="text-xs bg-[#4A5D4C] dark:bg-gray-600 text-white px-1.5 py-0.5 rounded">BETA</span>
          </Link>
          <Link
            href="/about"
            className="text-[#4A5D4C] dark:text-gray-300 hover:text-[#2F3B30] dark:hover:text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-[#4A5D4C] dark:text-gray-300 hover:text-[#2F3B30] dark:hover:text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </Link>
          <div className="flex items-center gap-2 text-[#4A5D4C] dark:text-gray-300">
            <span>Theme</span>
            <ThemeToggle />
          </div>
          <Button
            onClick={() => {
              emitEvent(EVENTS.OPEN_ESTIMATE_MODAL);
              setMobileMenuOpen(false);
            }}
            className="bg-[#2F3B30] hover:bg-[#3A4A3A] text-white"
          >
            Get Estimate
          </Button>
        </nav>
      </div>
    </header>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useTheme } from "next-themes";

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

  // Determine which logo to use based on theme
  const logoSrc =
    mounted && resolvedTheme === "dark"
      ? "/woodgreen-landscaping-logo-inverse.png"
      : "/woodgreen-landscaping-logo.png";

  return (
    <header className="bg-white dark:bg-[#2F3B30] shadow-sm relative z-20 transition-colors duration-300">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          {mounted ? (
            <Image
              src={logoSrc}
              alt="Woodgreen Landscaping Logo"
              width={180}
              height={40}
              className="h-auto"
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
          ) : (
            // Placeholder with same dimensions while loading to prevent layout shift
            <div className="w-[180px] h-[40px]"></div>
          )}
        </Link>
        <nav className="hidden md:flex space-x-4">
          <Link
            href="/services"
            className="text-[#4A5D4C] dark:text-gray-300 hover:text-[#2F3B30] dark:hover:text-white"
          >
            Services
          </Link>
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
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button
            onClick={() => {}}
            className="hidden md:inline-flex bg-[#2F3B30] hover:bg-[#3A4A3A] text-white"
          >
            Get Estimate
          </Button>
          <button className="md:hidden" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-[#2F3B30] dark:text-white" />
            ) : (
              <Menu className="h-6 w-6 text-[#2F3B30] dark:text-white" />
            )}
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#2F3B30] py-4 px-4 absolute top-full left-0 right-0 shadow-md transition-colors duration-300">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/services"
              className="text-[#4A5D4C] dark:text-gray-300 hover:text-[#2F3B30] dark:hover:text-white"
            >
              Services
            </Link>
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
            <Button
              onClick={() => {}}
              className="bg-[#2F3B30] hover:bg-[#3A4A3A] text-white"
            >
              Get Estimate
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}

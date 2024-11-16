"use client";

import { AlertTriangle, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { useEffect, useState } from "react";

export function UnderMaintenance() {
  const currentYear = new Date().getFullYear();
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F0F4F0] dark:bg-[#1C1C1C] transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full bg-[#4A5D4C] text-white hover:bg-[#3A4A3A] dark:bg-[#2F3B30] dark:hover:bg-[#3A4A3A]"
        >
          {theme === "light" ? (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-lg bg-white dark:bg-[#2F3B30] text-[#2F3B30] dark:text-white transition-colors duration-300">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Image
                src="/woodgreen-landscaping-icon.svg"
                alt="Woodgreen Landscaping Logo"
                width={80}
                height={80}
                className="rounded-full bg-white"
              />
            </div>
            <CardTitle className="text-center flex flex-col items-center gap-4">
              <AlertTriangle className="h-12 w-12 text-[#2F3B30] dark:text-[#CEFF65]" />
              <span className="text-2xl font-bold">Under Maintenance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-[#4A5D4C] dark:text-gray-300 mb-4">
              We&apos;re currently performing some necessary maintenance on our
              website. We apologize for any inconvenience this may cause.
            </p>
            <p className="text-center text-[#4A5D4C] dark:text-gray-300 font-semibold">
              Expected completion:{" "}
              <time dateTime="2024-11-15T20:00:00Z">
                November 21, 2024 at 8:00 PM UTC
              </time>
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="bg-[#2F3B30] hover:bg-[#3A4A3A] text-white border-0 dark:bg-[#4A5D4C] dark:hover:bg-[#3A4A3A]"
            >
              Check Again
            </Button>
          </CardFooter>
        </Card>
      </main>
      <footer className="bg-[#2F3B30] dark:bg-black text-white py-4 mt-auto transition-colors duration-300">
        <div className="container mx-auto px-4 text-center">
          <p>
            &copy; {currentYear} Woodgreen Landscaping. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}


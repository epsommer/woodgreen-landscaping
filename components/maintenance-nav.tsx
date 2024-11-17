"use client";

import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";

export function MaintenanceNav() {
  return (
    <header className="bg-white dark:bg-[#2F3B30] shadow-sm relative z-20 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/woodgreen-landscaping-icon.svg"
              alt="Woodgreen Landscaping Logo"
              width={40}
              height={40}
              className="rounded-full bg-white"
            />
            <span className="ml-2 text-xl font-bold text-[#2F3B30] dark:text-white">
              Woodgreen Landscaping
            </span>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}


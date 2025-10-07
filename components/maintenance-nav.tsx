"use client";

import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";

export function MaintenanceNav() {
  return (
    <header className="bg-[#2F3B30] text-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Image
          src="/woodgreen-landscaping-palmette-v05.png"
          alt="Woodgreen Landscaping Logo"
          width={120}
          height={120}
          style={{
            maxWidth: "100%",
            height: "auto",
          }}
        />
        <ThemeToggle />
      </div>
    </header>
  );
}

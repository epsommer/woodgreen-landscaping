'use client'

import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"

export function MaintenanceNav() {
  return (
    (<header className="bg-[#2F3B30] text-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Image
          src="/placeholder.svg?height=40&width=200&text=Woodgreen+Landscaping"
          alt="Woodgreen Landscaping Logo"
          width={200}
          height={40}
          style={{
            maxWidth: "100%",
            height: "auto"
          }} />
        <ThemeToggle />
      </div>
    </header>)
  );
}
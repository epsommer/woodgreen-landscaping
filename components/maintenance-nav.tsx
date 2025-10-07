"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "next-themes";

export function MaintenanceNav() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc = resolvedTheme === "dark"
    ? "/woodgreen-landscaping-logo-palmette-inverse.svg"
    : "/woodgreen-landscaping-logo-palmette.svg";

  return (
    <header className="bg-white dark:bg-[#2F3B30] text-[#2F3B30] dark:text-white py-4 transition-colors duration-300">
      <div className="container mx-auto px-4 grid grid-cols-3 items-center">
        <div></div>
        <div className="flex justify-center">
          {mounted ? (
            <Image
              src={logoSrc}
              alt="Woodgreen Landscaping Logo"
              width={120}
              height={120}
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
          ) : (
            <div className="w-[120px] h-[120px]"></div>
          )}
        </div>
        <div className="flex justify-end">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

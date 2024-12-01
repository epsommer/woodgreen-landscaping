"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MaintenanceNav } from "@/components/maintenance-nav";
import { MaintenanceFooter } from "@/components/maintenance-footer";

export function UnderMaintenance() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F0F4F0] dark:bg-[#1C1C1C] transition-colors duration-300">
      <MaintenanceNav />
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-lg bg-white dark:bg-[#2F3B30] text-[#2F3B30] dark:text-white transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-center flex flex-col items-center gap-4">
              <AlertTriangle className="h-12 w-12 text-[#CEFF65]" />
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
                December 1st, 2024 at 8:00 PM EST
              </time>
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="bg-[#CEFF65] hover:bg-[#CEFF65]/90 text-[#2F3B30] border-0 dark:border-[#4A5D4C] dark:bg-[#4A5D4C] dark:text-white dark:hover:bg-[#4A5D4C]/90"
            >
              Check Again
            </Button>
          </CardFooter>
        </Card>
      </main>
      <MaintenanceFooter />
    </div>
  );
}

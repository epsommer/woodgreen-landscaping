"use client";

import { MaintenanceNav } from "@/components/maintenance-nav";
import { MaintenanceFooter } from "@/components/maintenance-footer";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <MaintenanceNav />
      <main className="flex-grow">{children}</main>
      <MaintenanceFooter />
    </div>
  );
}

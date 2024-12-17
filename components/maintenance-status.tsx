"use client";

import { siteConfig } from "@/config/site";

export function MaintenanceStatus() {
  return (
    <div className="text-sm">
      Status: {siteConfig.maintenanceMode ? "Maintenance Mode" : "Online"}
    </div>
  );
}

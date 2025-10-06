// lib/maintenance.ts
/**
 * Centralized maintenance mode detection
 * This ensures middleware.ts and layout.tsx use identical logic
 */

export function isInMaintenanceMode(): boolean {
  const isDevelopment = process.env.NODE_ENV === "development";

  // Production maintenance mode triggers
  const isMaintenanceMode =
    !isDevelopment && process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

  // Development override for testing
  const forceMaintenance = process.env.FORCE_MAINTENANCE_MODE === "true";

  return isMaintenanceMode || forceMaintenance;
}

export function shouldShowMaintenanceForHeaders(headers: Headers): boolean {
  const isDevelopment = process.env.NODE_ENV === "development";

  // Header-based trigger (for load balancers/CDNs)
  const headerMaintenance = headers.get("X-Maintenance-Mode") === "true";

  return !isDevelopment && headerMaintenance;
}

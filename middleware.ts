import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check if we're in development environment
  const isDevelopment = process.env.NODE_ENV === "development";

  // Only apply maintenance mode in production or if explicitly forced in development
  const isMaintenanceMode =
    !isDevelopment &&
    (process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true" ||
      request.headers.get("X-Maintenance-Mode") === "true");

  // You could also add a development override option
  const forceMaintenance = process.env.FORCE_MAINTENANCE_MODE === "true";

  if (
    (isMaintenanceMode || forceMaintenance) &&
    !request.nextUrl.pathname.startsWith("/maintenance")
  ) {
    return NextResponse.rewrite(new URL("/maintenance", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg|.*\\.jpg|.*\\.jpeg).*)",
  ],
};

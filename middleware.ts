import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { siteConfig } from "./config/site";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (siteConfig.maintenanceMode) {
    // Allow access to maintenance page and its assets
    if (
      pathname === "/maintenance" ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api") ||
      pathname.includes("favicon.ico")
    ) {
      return NextResponse.next();
    }

    // Redirect all other routes to maintenance
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }

  // If we're not in maintenance mode but someone tries to access the maintenance page
  if (pathname === "/maintenance") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

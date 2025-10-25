import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  isInMaintenanceMode,
  shouldShowMaintenanceForHeaders,
} from "@/lib/maintenance";

export function middleware(request: NextRequest) {
  // Use centralized maintenance detection
  // const isMaintenanceActive =
  //   isInMaintenanceMode() || shouldShowMaintenanceForHeaders(request.headers);
  const isMaintenanceActive = false;

  if (
    isMaintenanceActive &&
    !request.nextUrl.pathname.startsWith("/maintenance")
  ) {
    return NextResponse.rewrite(new URL("/maintenance", request.url));
  }

  const response = NextResponse.next();

  // Security Headers
  // Prevent clickjacking attacks
  response.headers.set("X-Frame-Options", "DENY");

  // Prevent MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Control referrer information
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Enable XSS protection (legacy browsers)
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com https://use.typekit.net blob:",
      "style-src 'self' 'unsafe-inline' https://use.typekit.net https://fonts.googleapis.com",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data: https: https://use.typekit.net blob:",
      "connect-src 'self' https://api.web3forms.com https://va.vercel-scripts.com https://fonts.gstatic.com https://cdn.jsdelivr.net",
      "worker-src 'self' blob:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  );

  // Permissions Policy (formerly Feature Policy)
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  );

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg|.*\\.jpg|.*\\.jpeg).*)",
  ],
};

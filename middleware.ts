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

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg|.*\\.jpg|.*\\.jpeg).*)",
  ],
};

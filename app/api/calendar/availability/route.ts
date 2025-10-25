import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlotsForRange } from "@/lib/calendar/availability";
import { rateLimit, getResetTimeSeconds } from "@/lib/rate-limit";

// Mark this route as dynamic (uses request headers for rate limiting)
export const dynamic = 'force-dynamic';

/**
 * API Route: GET /api/calendar/availability
 * Fetches available time slots for scheduling consultations
 *
 * Query parameters:
 * - startDate: ISO date string (optional, defaults to today)
 * - daysAhead: number of days to check (optional, defaults to 14)
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limiting: 20 availability checks per minute per IP
    const { allowed, remaining, resetTime } = rateLimit(request, 20, 60000);

    if (!allowed) {
      return NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
          retryAfter: getResetTimeSeconds(resetTime!),
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(getResetTimeSeconds(resetTime!)),
            "X-RateLimit-Remaining": "0",
          },
        },
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const startDateParam = searchParams.get("startDate");
    const daysAheadParam = searchParams.get("daysAhead");

    // Parse parameters
    const startDate = startDateParam ? new Date(startDateParam) : new Date();
    const daysAhead = daysAheadParam ? parseInt(daysAheadParam, 10) : 14;

    // Validate parameters
    if (isNaN(startDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid startDate parameter" },
        { status: 400 },
      );
    }

    if (isNaN(daysAhead) || daysAhead < 1 || daysAhead > 60) {
      return NextResponse.json(
        { error: "daysAhead must be between 1 and 60" },
        { status: 400 },
      );
    }

    // Fetch available slots
    const availability = await getAvailableSlotsForRange(startDate, daysAhead);

    return NextResponse.json(
      {
        success: true,
        availability,
        startDate: startDate.toISOString(),
        daysAhead,
      },
      {
        headers: {
          "X-RateLimit-Remaining": String(remaining),
        },
      },
    );
  } catch (error) {
    // Log error internally for debugging
    console.error("Error fetching availability:", error);

    // Return sanitized error message to client
    return NextResponse.json(
      {
        error:
          "Failed to fetch availability. Please try again or contact support.",
        // Only include details in development mode
        ...(process.env.NODE_ENV === "development" && {
          details: error instanceof Error ? error.message : "Unknown error",
        }),
      },
      { status: 500 },
    );
  }
}

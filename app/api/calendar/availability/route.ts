import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlotsForRange } from "@/lib/calendar/availability";

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

    return NextResponse.json({
      success: true,
      availability,
      startDate: startDate.toISOString(),
      daysAhead,
    });
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch availability",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

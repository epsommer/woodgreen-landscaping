import { NextRequest, NextResponse } from "next/server";

/**
 * API Route: GET /api/calendar/ics
 * Generates an ICS calendar file for a booking
 *
 * Query parameters:
 * - service: string
 * - datetime: ISO datetime string
 * - duration: number (minutes)
 * - name: string
 * - email: string
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const service = searchParams.get("service");
    const datetime = searchParams.get("datetime");
    const duration = searchParams.get("duration");
    const name = searchParams.get("name");
    const email = searchParams.get("email");

    if (!service || !datetime || !duration) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const appointmentStart = new Date(datetime);
    const appointmentEnd = new Date(appointmentStart);
    appointmentEnd.setMinutes(
      appointmentEnd.getMinutes() + parseInt(duration, 10)
    );

    // Format dates for ICS (YYYYMMDDTHHMMSSZ)
    const formatICSDate = (date: Date): string => {
      return date
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "");
    };

    const now = new Date();
    const uid = `${now.getTime()}@woodgreen-landscaping.com`;

    // Generate ICS file content
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Woodgreen Landscaping//Booking//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:REQUEST",
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${formatICSDate(now)}`,
      `DTSTART:${formatICSDate(appointmentStart)}`,
      `DTEND:${formatICSDate(appointmentEnd)}`,
      `SUMMARY:${service} - Woodgreen Landscaping`,
      `DESCRIPTION:Appointment for ${service}${name ? ` with ${name}` : ""}`,
      "LOCATION:To be confirmed",
      "STATUS:CONFIRMED",
      "SEQUENCE:0",
      ...(email ? [`ATTENDEE;CN=${name || email};RSVP=TRUE:mailto:${email}`] : []),
      "ORGANIZER;CN=Woodgreen Landscaping:mailto:admin@evangelosommer.com",
      "BEGIN:VALARM",
      "TRIGGER:-PT1H",
      "DESCRIPTION:Reminder: ${service} appointment in 1 hour",
      "ACTION:DISPLAY",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    return new NextResponse(icsContent, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="woodgreen-appointment-${service.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.ics"`,
      },
    });
  } catch (error) {
    console.error("Error generating ICS file:", error);
    return NextResponse.json(
      { error: "Failed to generate calendar file" },
      { status: 500 }
    );
  }
}

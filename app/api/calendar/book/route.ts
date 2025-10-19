import { NextRequest, NextResponse } from "next/server";
import { createGoogleCalendarEvent } from "@/lib/calendar/gmail";
import { createNotionCalendarEvent } from "@/lib/calendar/notion";
import { format } from "date-fns";

/**
 * API Route: POST /api/calendar/book
 * Books a consultation appointment and sends email notifications
 *
 * Request body:
 * {
 *   service: string;
 *   datetime: string; // ISO datetime
 *   name: string;
 *   email: string;
 *   phone: string;
 *   message?: string;
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { service, datetime, name, email, phone, message } = body;

    if (!service || !datetime || !name || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Parse and validate datetime
    const appointmentStart = new Date(datetime);
    if (isNaN(appointmentStart.getTime())) {
      return NextResponse.json(
        { error: "Invalid datetime format" },
        { status: 400 },
      );
    }

    // Calculate appointment end time (default 1 hour)
    const appointmentDuration =
      parseInt(process.env.APPOINTMENT_DURATION_MINUTES || "60", 10);
    const appointmentEnd = new Date(appointmentStart);
    appointmentEnd.setMinutes(
      appointmentEnd.getMinutes() + appointmentDuration,
    );

    // Check if appointment is in the past
    const now = new Date();
    if (appointmentStart < now) {
      return NextResponse.json(
        { error: "Cannot book appointments in the past" },
        { status: 400 },
      );
    }

    // Prepare event details
    const eventTitle = `${service} - ${name}`;
    const eventDescription = `
Service: ${service}
Client: ${name}
Email: ${email}
Phone: ${phone}
${message ? `\nAdditional Information:\n${message}` : ""}
    `.trim();

    // Create events in both calendars
    const results = await Promise.allSettled([
      createGoogleCalendarEvent({
        summary: eventTitle,
        description: eventDescription,
        start: appointmentStart,
        end: appointmentEnd,
        attendees: [email],
      }),
      createNotionCalendarEvent({
        title: eventTitle,
        description: eventDescription,
        start: appointmentStart,
        end: appointmentEnd,
        clientName: name,
        clientEmail: email,
        clientPhone: phone,
      }),
    ]);

    // Check if at least one calendar was updated successfully
    const googleResult = results[0];
    const notionResult = results[1];

    const googleSuccess =
      googleResult.status === "fulfilled" && googleResult.value !== null;
    const notionSuccess =
      notionResult.status === "fulfilled" && notionResult.value !== null;

    if (!googleSuccess && !notionSuccess) {
      throw new Error("Failed to create event in both calendars");
    }

    // Send email notification using Web3Forms
    try {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          subject: `New Consultation Booking - ${service}`,
          from_name: "Woodgreen Landscaping Website",
          message: `
New consultation booking received:

Service: ${service}
Date & Time: ${format(appointmentStart, "MMMM d, yyyy 'at' h:mm a")}
Duration: ${appointmentDuration} minutes

Client Information:
Name: ${name}
Email: ${email}
Phone: ${phone}

${message ? `Additional Information:\n${message}` : ""}

Google Calendar: ${googleSuccess ? "✓ Added" : "✗ Failed"}
Notion Calendar: ${notionSuccess ? "✓ Added" : "✗ Failed"}
          `.trim(),
        }),
      });
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
      // Don't fail the booking if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Appointment booked successfully",
      appointment: {
        service,
        datetime: appointmentStart.toISOString(),
        duration: appointmentDuration,
        name,
        email,
        phone,
      },
      calendars: {
        google: googleSuccess,
        notion: notionSuccess,
      },
    });
  } catch (error) {
    console.error("Error booking appointment:", error);
    return NextResponse.json(
      {
        error: "Failed to book appointment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

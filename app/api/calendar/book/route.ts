import { NextRequest, NextResponse } from "next/server";
import { createGoogleCalendarEvent } from "@/lib/calendar/gmail";
import { createNotionCalendarEvent } from "@/lib/calendar/notion";
import { findOrCreateContact } from "@/lib/calendar/crm";
import { format } from "date-fns";
import { rateLimit, getResetTimeSeconds } from "@/lib/rate-limit";
import {
  bookingSchema,
  sanitizeInput,
  sanitizeEmail,
  sanitizePhone,
} from "@/lib/validation";

// Mark this route as dynamic (uses request headers for rate limiting)
export const dynamic = 'force-dynamic';

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
    // Rate limiting: 5 booking attempts per 5 minutes per IP
    const { allowed, remaining, resetTime } = rateLimit(request, 5, 300000);

    if (!allowed) {
      return NextResponse.json(
        {
          error: "Too many booking attempts. Please try again later.",
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

    const body = await request.json();

    // Validate input with Zod schema
    const validation = bookingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid input data",
          details: validation.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    // Extract and sanitize validated data
    const { service, datetime, message } = validation.data;
    const name = sanitizeInput(validation.data.name);
    const email = sanitizeEmail(validation.data.email);
    const phone = sanitizePhone(validation.data.phone);
    const sanitizedMessage = message ? sanitizeInput(message) : undefined;

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
${sanitizedMessage ? `\nAdditional Information:\n${sanitizedMessage}` : ""}
    `.trim();

    // Find or create contact in CRM
    const crmContactId = await findOrCreateContact({
      name,
      email,
      phone,
      source: "Woodgreen Website",
    });

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
        description: sanitizedMessage || eventDescription,
        start: appointmentStart,
        end: appointmentEnd,
        clientName: name,
        clientEmail: email,
        clientPhone: phone,
        serviceType: service,
        crmContactId: crmContactId || undefined, // Link to CRM contact if found/created
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

    // Send email notifications using Web3Forms
    try {
      // Admin notification
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

${sanitizedMessage ? `Additional Information:\n${sanitizedMessage}` : ""}

Google Calendar: ${googleSuccess ? "✓ Added" : "✗ Failed"}
Notion Calendar: ${notionSuccess ? "✓ Added" : "✗ Failed"}
          `.trim(),
        }),
      });

      // Customer confirmation email
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          subject: `Appointment Confirmed - ${service}`,
          from_name: "Woodgreen Landscaping",
          email: email, // Send to customer
          message: `
Hi ${name},

Thank you for booking with Woodgreen Landscaping!

Your appointment has been confirmed:

Service: ${service}
Date & Time: ${format(appointmentStart, "MMMM d, yyyy 'at' h:mm a")}
Duration: ${appointmentDuration} minutes

We look forward to serving you. If you need to reschedule or have any questions, please contact us.

You can add this appointment to your calendar using the link provided on the confirmation screen.

Best regards,
Woodgreen Landscaping
          `.trim(),
        }),
      });
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
      // Don't fail the booking if email fails
    }

    return NextResponse.json(
      {
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
      },
      {
        headers: {
          "X-RateLimit-Remaining": String(remaining),
        },
      },
    );
  } catch (error) {
    // Log error internally for debugging
    console.error("Error booking appointment:", error);

    // Return sanitized error message to client
    return NextResponse.json(
      {
        error:
          "Failed to book appointment. Please try again or contact support.",
        // Only include details in development mode
        ...(process.env.NODE_ENV === "development" && {
          details: error instanceof Error ? error.message : "Unknown error",
        }),
      },
      { status: 500 },
    );
  }
}

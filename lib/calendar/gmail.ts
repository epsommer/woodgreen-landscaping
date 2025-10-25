import { google } from "googleapis";

/**
 * Gmail Calendar API utility functions
 * Handles authentication and calendar operations with Google Calendar
 */

/**
 * Initialize and authenticate with Google Calendar API
 */
export function getGoogleCalendarClient() {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });

  return google.calendar({ version: "v3", auth });
}

/**
 * Fetch busy time slots from Google Calendar
 * @param startDate Start date for the query
 * @param endDate End date for the query
 * @returns Array of busy time ranges
 */
export async function getGoogleBusyTimes(
  startDate: Date,
  endDate: Date,
): Promise<Array<{ start: Date; end: Date }>> {
  try {
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!calendarId) {
      console.warn("[Google Calendar] GOOGLE_CALENDAR_ID not configured");
      return [];
    }

    if (!clientEmail || !privateKey) {
      console.warn("[Google Calendar] GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY not configured");
      return [];
    }

    const calendar = getGoogleCalendarClient();

    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        items: [{ id: calendarId }],
      },
    });

    const busyTimes =
      response.data.calendars?.[calendarId]?.busy?.map((slot) => ({
        start: new Date(slot.start || ""),
        end: new Date(slot.end || ""),
      })) || [];

    console.log(`[Google Calendar] Found ${busyTimes.length} busy slots for ${startDate.toISOString().split('T')[0]}`);
    return busyTimes;
  } catch (error) {
    console.error("[Google Calendar] Error fetching busy times:", error instanceof Error ? error.message : error);
    if (error instanceof Error && 'code' in error) {
      console.error("[Google Calendar] Error code:", (error as { code?: number }).code);
    }
    return [];
  }
}

/**
 * Create an event in Google Calendar
 * @param event Event details
 * @returns Created event ID or null if failed
 */
export async function createGoogleCalendarEvent(event: {
  summary: string;
  description: string;
  start: Date;
  end: Date;
  attendees?: string[];
}): Promise<string | null> {
  try {
    const calendar = getGoogleCalendarClient();
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!calendarId) {
      throw new Error("GOOGLE_CALENDAR_ID not configured");
    }

    const response = await calendar.events.insert({
      calendarId,
      requestBody: {
        summary: event.summary,
        description: event.description,
        start: {
          dateTime: event.start.toISOString(),
          timeZone: "America/Toronto",
        },
        end: {
          dateTime: event.end.toISOString(),
          timeZone: "America/Toronto",
        },
        // Note: Service accounts require Domain-Wide Delegation to invite attendees
        // Attendees are commented out to avoid 403 errors
        // attendees: event.attendees?.map((email) => ({ email })),
        reminders: {
          useDefault: false,
          overrides: [
            { method: "email", minutes: 24 * 60 },
            { method: "popup", minutes: 30 },
          ],
        },
      },
    });

    return response.data.id || null;
  } catch (error) {
    console.error("Error creating Google Calendar event:", error);
    throw error;
  }
}

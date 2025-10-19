import { Client } from "@notionhq/client";

/**
 * Notion Calendar API utility functions
 * Handles authentication and calendar operations with Notion
 */

/**
 * Initialize Notion client
 */
export function getNotionClient() {
  const notionApiKey = process.env.NOTION_API_KEY;

  if (!notionApiKey) {
    throw new Error("NOTION_API_KEY not configured");
  }

  return new Client({ auth: notionApiKey });
}

/**
 * Fetch busy time slots from Notion Calendar database
 * @param startDate Start date for the query
 * @param endDate End date for the query
 * @returns Array of busy time ranges
 */
export async function getNotionBusyTimes(
  startDate: Date,
  endDate: Date,
): Promise<Array<{ start: Date; end: Date }>> {
  try {
    const notion = getNotionClient();
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!databaseId) {
      console.warn("NOTION_DATABASE_ID not configured");
      return [];
    }

    // Query the Notion database for events in the date range
    // @ts-ignore - Notion SDK types may vary by version
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: "Date",
            date: {
              on_or_after: startDate.toISOString(),
            },
          },
          {
            property: "Date",
            date: {
              on_or_before: endDate.toISOString(),
            },
          },
        ],
      },
    });

    const busyTimes = response.results.map((page: any) => {
      const dateProperty = page.properties?.Date;
      const start = dateProperty?.date?.start
        ? new Date(dateProperty.date.start)
        : new Date();
      const end = dateProperty?.date?.end
        ? new Date(dateProperty.date.end)
        : new Date(start.getTime() + 60 * 60 * 1000); // Default 1 hour

      return { start, end };
    });

    return busyTimes;
  } catch (error) {
    console.error("Error fetching Notion busy times:", error);
    return [];
  }
}

/**
 * Create an event in Notion Calendar database
 * @param event Event details
 * @returns Created page ID or null if failed
 */
export async function createNotionCalendarEvent(event: {
  title: string;
  description: string;
  start: Date;
  end: Date;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
}): Promise<string | null> {
  try {
    const notion = getNotionClient();
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!databaseId) {
      throw new Error("NOTION_DATABASE_ID not configured");
    }

    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: event.title,
              },
            },
          ],
        },
        Date: {
          date: {
            start: event.start.toISOString(),
            end: event.end.toISOString(),
          },
        },
        "Client Name": {
          rich_text: [
            {
              text: {
                content: event.clientName,
              },
            },
          ],
        },
        Email: {
          email: event.clientEmail,
        },
        Phone: {
          phone_number: event.clientPhone,
        },
        Description: {
          rich_text: [
            {
              text: {
                content: event.description,
              },
            },
          ],
        },
        Status: {
          select: {
            name: "Scheduled",
          },
        },
      },
    });

    return response.id;
  } catch (error) {
    console.error("Error creating Notion event:", error);
    throw error;
  }
}

import { Client } from "@notionhq/client";

/**
 * CRM Contact Management
 * Handles automatic contact creation and linking with CRM database
 */

const CRM_DATA_SOURCE_ID = "252f1e18214a8068991f000b15e16acb";

/**
 * Get Notion client for CRM operations
 */
function getNotionClient() {
  const notionApiKey = process.env.NOTION_API_KEY;

  if (!notionApiKey) {
    throw new Error("NOTION_API_KEY not configured");
  }

  return new Client({
    auth: notionApiKey,
    notionVersion: "2025-09-03",
  });
}

/**
 * Search for existing contact by email
 */
export async function findContactByEmail(
  email: string,
): Promise<string | null> {
  try {
    const notion = getNotionClient();

    const response = await notion.dataSources.query({
      data_source_id: CRM_DATA_SOURCE_ID,
      filter: {
        property: "Email",
        email: {
          equals: email,
        },
      },
    });

    if (response.results.length > 0) {
      return response.results[0].id;
    }

    return null;
  } catch (error) {
    console.error("Error searching for contact:", error);
    return null;
  }
}

/**
 * Create new contact in CRM
 */
export async function createCRMContact(contact: {
  name: string;
  email: string;
  phone: string;
  source?: string;
}): Promise<string | null> {
  try {
    const notion = getNotionClient();

    const response = await notion.pages.create({
      parent: {
        type: "data_source_id",
        data_source_id: CRM_DATA_SOURCE_ID,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: contact.name,
              },
            },
          ],
        },
        Email: {
          email: contact.email,
        },
        Phone: {
          phone_number: contact.phone,
        },
        Status: {
          select: {
            name: "Lead", // New contacts start as "Lead"
          },
        },
        Source: {
          select: {
            name: contact.source || "Woodgreen Website",
          },
        },
        "Last Contact": {
          date: {
            start: new Date().toISOString(),
          },
        },
      },
    });

    console.log(`Created new CRM contact: ${contact.name} (${contact.email})`);
    return response.id;
  } catch (error) {
    console.error("Error creating CRM contact:", error);
    return null;
  }
}

/**
 * Find or create contact in CRM
 * Returns the contact page ID
 */
export async function findOrCreateContact(contact: {
  name: string;
  email: string;
  phone: string;
  source?: string;
}): Promise<string | null> {
  // First, search for existing contact
  let contactId = await findContactByEmail(contact.email);

  // If not found, create new contact
  if (!contactId) {
    contactId = await createCRMContact(contact);
  } else {
    console.log(`Found existing CRM contact for: ${contact.email}`);
  }

  return contactId;
}

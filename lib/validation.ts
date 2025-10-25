import { z } from "zod";

/**
 * Allowed service types for booking
 */
const SERVICE_TYPES = [
  // Service bookings
  "Service Booking",
  // Consultation types
  "General Consultation",
  "Landscaping Consultation",
  // Tree services
  "Tree Trimming",
  "Tree Removal/Felling",
  // Shrub and hedge services
  "Hedge/Shrub Trimming",
  // Cleanup services
  "Fall Cleanup",
  "Spring Cleanup",
  "Gutter Cleaning",
  // Maintenance services
  "Garden Maintenance",
  "Lawn Maintenance",
  "Landscaping Labour",
  // Lawn care
  "Aeration",
  "Dethatching",
  "Grass Cutting",
  // Winter services
  "Snow Removal",
  "Salting/De-Icing",
  // Design and construction
  "Garden Design",
  "Hardscaping",
  // Catch-all
  "Other",
] as const;

/**
 * Booking validation schema
 * Validates all required fields with proper constraints
 */
export const bookingSchema = z.object({
  service: z.enum(SERVICE_TYPES, {
    message: "Please select a valid service type",
  }),
  datetime: z
    .string()
    .datetime({ message: "Invalid datetime format. Use ISO 8601 format." }),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .regex(
      /^[a-zA-Z\s'\-\.]+$/,
      "Name can only contain letters, spaces, hyphens, apostrophes, and periods",
    ),
  email: z
    .string()
    .email("Please provide a valid email address")
    .max(255, "Email must not exceed 255 characters")
    .toLowerCase(),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number must not exceed 20 characters")
    .regex(
      /^[\d\s\-\+\(\)\.]+$/,
      "Phone number can only contain digits, spaces, hyphens, plus sign, parentheses, and periods",
    ),
  message: z
    .string()
    .max(1000, "Message must not exceed 1000 characters")
    .optional()
    .or(z.literal("")),
  // Address fields (required for service bookings, optional for video consultations)
  address: z
    .string()
    .min(5, "Street address must be at least 5 characters")
    .max(200, "Street address must not exceed 200 characters")
    .optional()
    .or(z.literal("")),
  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(100, "City must not exceed 100 characters")
    .regex(
      /^[a-zA-Z\s'\-\.]+$/,
      "City can only contain letters, spaces, hyphens, apostrophes, and periods",
    )
    .optional()
    .or(z.literal("")),
  province: z
    .string()
    .min(2, "Province must be at least 2 characters")
    .max(50, "Province must not exceed 50 characters")
    .optional()
    .or(z.literal("")),
  postalCode: z
    .string()
    .regex(
      /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
      "Please provide a valid Canadian postal code (e.g., M5H 2N2)",
    )
    .optional()
    .or(z.literal("")),
  // Consultation type (in-person or video call)
  consultationType: z
    .enum(["in-person", "video"], {
      message: "Please select a valid consultation type",
    })
    .optional(),
  bookingType: z
    .enum(["service", "consultation"], {
      message: "Please select a valid booking type",
    })
    .optional(),
});

/**
 * Availability query parameters validation schema
 */
export const availabilityQuerySchema = z.object({
  startDate: z
    .string()
    .datetime({ message: "Invalid startDate format. Use ISO 8601 format." })
    .optional(),
  daysAhead: z
    .number()
    .int("daysAhead must be an integer")
    .min(1, "daysAhead must be at least 1")
    .max(60, "daysAhead must not exceed 60")
    .optional(),
});

/**
 * Sanitize user input to prevent XSS attacks
 *
 * @param input - User-provided string
 * @returns Sanitized string safe for storage and display
 */
export function sanitizeInput(input: string): string {
  return (
    input
      // Remove HTML tags
      .replace(/<[^>]*>/g, "")
      // Remove < and > characters
      .replace(/[<>]/g, "")
      // Remove javascript: protocol
      .replace(/javascript:/gi, "")
      // Remove data: protocol
      .replace(/data:/gi, "")
      // Remove on* event handlers
      .replace(/on\w+\s*=/gi, "")
      // Trim whitespace
      .trim()
  );
}

/**
 * Sanitize and format email address
 *
 * @param email - Email address
 * @returns Sanitized and normalized email address
 */
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim().replace(/\s/g, "");
}

/**
 * Sanitize and format phone number
 * Removes all non-digit characters except + at the start
 *
 * @param phone - Phone number
 * @returns Sanitized phone number
 */
export function sanitizePhone(phone: string): string {
  // Keep only digits, spaces, hyphens, parentheses, periods, and leading +
  let sanitized = phone.trim();

  // Extract leading + if present
  const hasPlus = sanitized.startsWith("+");
  sanitized = sanitized.replace(/^\+/, "");

  // Remove all non-digit characters except common phone formatting
  sanitized = sanitized.replace(/[^\d\s\-\(\)\.]/g, "");

  // Add back leading + if it was present
  if (hasPlus) {
    sanitized = "+" + sanitized;
  }

  return sanitized;
}

/**
 * Type guard for booking validation result
 */
export type BookingData = z.infer<typeof bookingSchema>;

/**
 * Type guard for availability query validation result
 */
export type AvailabilityQuery = z.infer<typeof availabilityQuerySchema>;

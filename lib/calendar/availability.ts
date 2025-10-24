import { getGoogleBusyTimes } from "./gmail";
import { getNotionBusyTimes } from "./notion";

/**
 * Calendar availability utilities
 * Combines Google Calendar and Notion Calendar to find available time slots
 */

export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
}

export interface AvailableSlot {
  time: string; // Format: "HH:MM AM/PM"
  datetime: Date;
}

/**
 * Get business hours configuration from environment
 */
function getBusinessHoursConfig() {
  const startHour = process.env.BUSINESS_START_HOUR || "09:00";
  const endHour = process.env.BUSINESS_END_HOUR || "17:00";
  const appointmentDuration =
    parseInt(process.env.APPOINTMENT_DURATION_MINUTES || "60", 10);
  const daysOff = (process.env.DAYS_OFF || "0,6")
    .split(",")
    .map((d) => parseInt(d.trim(), 10));

  return {
    startHour,
    endHour,
    appointmentDuration,
    daysOff,
  };
}

/**
 * Check if a date is a business day (not weekend or configured day off)
 */
function isBusinessDay(date: Date): boolean {
  const config = getBusinessHoursConfig();
  const dayOfWeek = date.getDay();
  return !config.daysOff.includes(dayOfWeek);
}

/**
 * Generate time slots for a specific date
 */
function generateTimeSlotsForDay(date: Date): Date[] {
  const config = getBusinessHoursConfig();
  const [startHourNum, startMinuteNum] = config.startHour
    .split(":")
    .map((n) => parseInt(n, 10));
  const [endHourNum, endMinuteNum] = config.endHour
    .split(":")
    .map((n) => parseInt(n, 10));

  const slots: Date[] = [];
  const currentSlot = new Date(date);
  currentSlot.setHours(startHourNum, startMinuteNum, 0, 0);

  const endTime = new Date(date);
  endTime.setHours(endHourNum, endMinuteNum, 0, 0);

  while (currentSlot < endTime) {
    slots.push(new Date(currentSlot));
    currentSlot.setMinutes(
      currentSlot.getMinutes() + config.appointmentDuration,
    );
  }

  return slots;
}

/**
 * Check if a time slot conflicts with busy times
 */
function isSlotAvailable(
  slotStart: Date,
  slotEnd: Date,
  busyTimes: Array<{ start: Date; end: Date }>,
): boolean {
  for (const busy of busyTimes) {
    // Check if there's any overlap
    if (slotStart < busy.end && slotEnd > busy.start) {
      return false;
    }
  }
  return true;
}

/**
 * Format time for display
 */
function formatTimeSlot(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, "0");
  return `${displayHours}:${displayMinutes} ${ampm}`;
}

/**
 * Get available time slots for a specific date
 * Combines both Gmail and Notion calendars to check availability
 */
export async function getAvailableSlots(date: Date): Promise<AvailableSlot[]> {
  // Check if it's a business day
  if (!isBusinessDay(date)) {
    return [];
  }

  const config = getBusinessHoursConfig();

  // Set date range for the day
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // Fetch busy times from both calendars (with error handling)
  let googleBusyTimes: Array<{ start: Date; end: Date }> = [];
  let notionBusyTimes: Array<{ start: Date; end: Date }> = [];

  try {
    [googleBusyTimes, notionBusyTimes] = await Promise.all([
      getGoogleBusyTimes(startOfDay, endOfDay).catch(() => []),
      getNotionBusyTimes(startOfDay, endOfDay).catch(() => []),
    ]);
  } catch (error) {
    console.warn("Error fetching busy times, showing all slots as available:", error);
  }

  // Combine busy times from both calendars
  const allBusyTimes = [...googleBusyTimes, ...notionBusyTimes];

  // Generate potential time slots for the day
  const potentialSlots = generateTimeSlotsForDay(date);

  // Filter out busy slots
  const availableSlots: AvailableSlot[] = [];

  for (const slotStart of potentialSlots) {
    const slotEnd = new Date(slotStart);
    slotEnd.setMinutes(slotEnd.getMinutes() + config.appointmentDuration);

    // Only show slots in the future (at least 1 hour from now)
    const now = new Date();
    const minBookingTime = new Date(now.getTime() + 1 * 60 * 60 * 1000);

    if (slotStart < minBookingTime) {
      continue;
    }

    if (isSlotAvailable(slotStart, slotEnd, allBusyTimes)) {
      availableSlots.push({
        time: formatTimeSlot(slotStart),
        datetime: slotStart,
      });
    }
  }

  return availableSlots;
}

/**
 * Get available slots for multiple days
 */
export async function getAvailableSlotsForRange(
  startDate: Date,
  daysAhead: number = 14,
): Promise<Record<string, AvailableSlot[]>> {
  const availability: Record<string, AvailableSlot[]> = {};

  const promises = [];
  for (let i = 0; i < daysAhead; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateKey = date.toISOString().split("T")[0];

    promises.push(
      getAvailableSlots(date).then((slots) => {
        availability[dateKey] = slots;
      }),
    );
  }

  await Promise.all(promises);

  return availability;
}

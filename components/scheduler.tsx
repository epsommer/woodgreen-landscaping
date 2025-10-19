"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, CalendarDays, Clock, Loader2, Phone, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

interface SchedulerProps {
  onClose: () => void;
  initialService?: string;
  selectedService?: string;
  onScheduleConsultation?: () => void;
  bookingType?: "service" | "consultation";
  selectedServices?: any[];
  estimatedHours?: number;
}

interface AvailableSlot {
  time: string;
  datetime: Date;
}

interface AvailabilityData {
  [date: string]: AvailableSlot[];
}

export function Scheduler({
  onClose,
  initialService,
  selectedService,
  onScheduleConsultation,
  bookingType = "consultation",
  selectedServices = [],
  estimatedHours = 0,
}: SchedulerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined,
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [service, setService] = useState<string | undefined>(selectedService);
  const [availability, setAvailability] = useState<AvailabilityData>({});
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (!service && initialService) {
      setService(initialService);
    }
  }, [initialService, service]);

  // Fetch availability when component mounts
  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    setIsLoadingAvailability(true);
    try {
      const response = await fetch("/api/calendar/availability?daysAhead=14");
      if (!response.ok) {
        throw new Error("Failed to fetch availability");
      }
      const data = await response.json();

      // Convert datetime strings back to Date objects
      const parsedAvailability: AvailabilityData = {};
      for (const [date, slots] of Object.entries(data.availability as AvailabilityData)) {
        parsedAvailability[date] = (slots as any[]).map((slot: any) => ({
          time: slot.time,
          datetime: new Date(slot.datetime),
        }));
      }

      setAvailability(parsedAvailability);
    } catch (error) {
      console.error("Error fetching availability:", error);
      // Set empty availability on error
      setAvailability({});
    } finally {
      setIsLoadingAvailability(false);
    }
  };

  // Get available time slots for selected date
  const getAvailableTimeSlotsForDate = (): AvailableSlot[] => {
    if (!selectedDate) return [];

    const dateKey = selectedDate.toISOString().split("T")[0];
    const dayOfWeek = selectedDate.getDay();

    // Check if it's a weekend (Saturday=6, Sunday=0)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return [];
    }

    return availability[dateKey] || [];
  };

  const isWeekend = (date: Date | undefined): boolean => {
    if (!date) return false;
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  // Get consecutive time slots for multi-hour bookings
  const getConsecutiveTimeSlots = (startTime: string, hoursNeeded: number): AvailableSlot[] => {
    if (!selectedDate || hoursNeeded <= 1) return [];

    const availableSlots = getAvailableTimeSlotsForDate();
    const startIndex = availableSlots.findIndex(slot => slot.time === startTime);

    if (startIndex === -1) return [];

    // Get the requested number of consecutive slots
    const consecutiveSlots: AvailableSlot[] = [];
    for (let i = 0; i < hoursNeeded && startIndex + i < availableSlots.length; i++) {
      consecutiveSlots.push(availableSlots[startIndex + i]);
    }

    // Verify they are actually consecutive (1 hour apart)
    for (let i = 1; i < consecutiveSlots.length; i++) {
      const prevTime = new Date(consecutiveSlots[i - 1].datetime);
      const currTime = new Date(consecutiveSlots[i].datetime);
      const hourDiff = (currTime.getTime() - prevTime.getTime()) / (1000 * 60 * 60);

      if (hourDiff !== 1) {
        // Not consecutive, return only what we have so far
        return consecutiveSlots.slice(0, i);
      }
    }

    return consecutiveSlots;
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(undefined); // Reset time when date changes
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (!selectedDate || !selectedTime) {
        throw new Error("Please select both date and time");
      }

      // Find the full datetime for the selected time
      const availableSlots = getAvailableTimeSlotsForDate();
      const selectedSlot = availableSlots.find((slot) => slot.time === selectedTime);

      if (!selectedSlot) {
        throw new Error("Selected time slot is no longer available");
      }

      // For service bookings with estimated hours > 1, book consecutive slots
      let bookingData: any = {
        service: bookingType === "service" ? "Service Booking" : service,
        datetime: selectedSlot.datetime.toISOString(),
        name,
        email,
        phone,
        message,
      };

      // Add service details and duration for service bookings
      if (bookingType === "service" && estimatedHours > 0) {
        const hoursNeeded = Math.ceil(estimatedHours);
        const consecutiveSlots = getConsecutiveTimeSlots(selectedTime, hoursNeeded);

        // Check if we have enough consecutive slots
        if (consecutiveSlots.length < hoursNeeded) {
          throw new Error(
            `Not enough consecutive time slots available. Need ${hoursNeeded} hour${hoursNeeded > 1 ? 's' : ''}, but only ${consecutiveSlots.length} consecutive slot${consecutiveSlots.length > 1 ? 's' : ''} available.`
          );
        }

        bookingData = {
          ...bookingData,
          bookingType: "service",
          services: selectedServices,
          estimatedHours: hoursNeeded,
          consecutiveSlots: consecutiveSlots.map(slot => slot.datetime.toISOString()),
        };
      }

      const response = await fetch("/api/calendar/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to book appointment");
      }

      setSubmitSuccess(true);

      // Call the callback if provided
      if (onScheduleConsultation) {
        onScheduleConsultation();
      }

      // Close modal after 2 seconds
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to book appointment"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        className="absolute inset-0"
        onClick={handleClose}
        aria-label="Close modal"
      />
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              {bookingType === "service" ? "Book Your Service" : "Schedule a Consultation"}
            </h2>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Service Summary for booking type "service" */}
          {bookingType === "service" && selectedServices.length > 0 && (
            <div className="mb-4 p-4 bg-nature-50 dark:bg-nature-900/20 border border-nature-200 dark:border-nature-800 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Selected Services</h3>
              <ul className="space-y-1 text-sm">
                {selectedServices.map((svc, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>
                      {svc.name}
                      {svc.variant && ` (${svc.variant})`}
                      {svc.debrisCleanup && " + Debris Cleanup"}
                    </span>
                    <span className="text-muted-foreground">
                      {svc.quantity} {svc.unit}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 pt-3 border-t border-nature-200 dark:border-nature-700">
                <p className="font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Estimated Duration: {Math.ceil(estimatedHours)} hour{Math.ceil(estimatedHours) !== 1 ? 's' : ''}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  We'll book {Math.ceil(estimatedHours)} consecutive time slot{Math.ceil(estimatedHours) !== 1 ? 's' : ''} for your service
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Only show service selection for consultation bookings */}
            {bookingType !== "service" && (
              <div className="space-y-2">
                <Label htmlFor="service">Select Service</Label>
                <Select value={service} onValueChange={setService}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="landscaping">Landscaping</SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {/* Success Message */}
            {submitSuccess && (
              <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200">
                <CalendarDays className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">
                  Appointment booked successfully! We&apos;ll send you a confirmation email shortly.
                </p>
              </div>
            )}

            {/* Error Message */}
            {submitError && (
              <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{submitError}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Select Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="rounded-md border"
                  disabled={(date) =>
                    date < new Date() ||
                    date >
                      new Date(new Date().setMonth(new Date().getMonth() + 2))
                  }
                />
                {isLoadingAvailability && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading availability...
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Select Time</Label>

                {/* Weekend Message */}
                {selectedDate && isWeekend(selectedDate) && (
                  <div className="flex items-start gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-800 dark:text-blue-200">
                    <Phone className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Weekend Service</p>
                      <p className="text-sm mt-1">
                        For weekend appointments, please call us directly to discuss availability and scheduling.
                      </p>
                    </div>
                  </div>
                )}

                {/* Time Slot Selection */}
                {selectedDate && !isWeekend(selectedDate) && (
                  <>
                    <Select
                      value={selectedTime}
                      onValueChange={setSelectedTime}
                      disabled={getAvailableTimeSlotsForDate().length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={
                          getAvailableTimeSlotsForDate().length === 0
                            ? "No available times"
                            : "Select time"
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableTimeSlotsForDate().map((slot) => (
                          <SelectItem key={slot.time} value={slot.time}>
                            {slot.time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {getAvailableTimeSlotsForDate().length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No available time slots for this date. Please try another day.
                      </p>
                    )}
                  </>
                )}

                {!selectedDate && (
                  <p className="text-sm text-muted-foreground">
                    Please select a date first
                  </p>
                )}

                {selectedDate && selectedTime && (
                  <div className="text-sm mt-2">
                    <p className="text-muted-foreground">
                      <CalendarDays className="inline-block mr-1 h-4 w-4" />
                      {format(selectedDate, "MMMM d, yyyy")}
                    </p>
                    <p className="text-muted-foreground">
                      <Clock className="inline-block mr-1 h-4 w-4" />
                      {selectedTime}
                      {bookingType === "service" && estimatedHours > 1 && (() => {
                        const hoursNeeded = Math.ceil(estimatedHours);
                        const consecutiveSlots = getConsecutiveTimeSlots(selectedTime, hoursNeeded);
                        if (consecutiveSlots.length > 0) {
                          const endSlot = consecutiveSlots[consecutiveSlots.length - 1];
                          const endTime = new Date(endSlot.datetime);
                          endTime.setHours(endTime.getHours() + 1); // Add 1 hour to get the end time
                          const endTimeString = endTime.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          });
                          return (
                            <span className="font-semibold text-nature-600 dark:text-nature-400">
                              {' '}→ {endTimeString}
                              <span className="text-xs ml-1">
                                ({hoursNeeded} hour{hoursNeeded > 1 ? 's' : ''})
                              </span>
                            </span>
                          );
                        }
                      })()}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Additional Information</Label>
              <Textarea
                id="message"
                placeholder="Any specific details or questions about your landscaping needs"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || submitSuccess || !selectedDate || !selectedTime || isWeekend(selectedDate)}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Booking...
                </span>
              ) : submitSuccess ? (
                "Booked Successfully!"
              ) : (
                "Schedule Consultation"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Scheduler;

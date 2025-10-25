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
import { X, CalendarDays, Clock, Loader2, Phone, AlertCircle, MapPin, Video } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

interface SelectedService {
  name: string;
  quantity: number;
  unit: string;
  variant?: string;
  debrisCleanup?: boolean;
}

interface SchedulerProps {
  onClose: () => void;
  onBack?: () => void; // Allow users to go back to service selection
  initialService?: string;
  selectedService?: string;
  onScheduleConsultation?: () => void;
  bookingType?: "service" | "consultation";
  selectedServices?: SelectedService[];
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
  onBack,
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
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("Ontario");
  const [postalCode, setPostalCode] = useState("");
  const [consultationType, setConsultationType] = useState<"in-person" | "video">("in-person");
  const [isOpen, setIsOpen] = useState(true);
  const [service, setService] = useState<string | undefined>(selectedService);
  const [availability, setAvailability] = useState<AvailabilityData>({});
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [bookingData, setBookingData] = useState<{
    service: string;
    datetime: string;
    duration: number;
    name: string;
    email: string;
  } | null>(null);

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
      const data = await response.json() as { availability: Record<string, Array<{ time: string; datetime: string }>> };

      // Convert datetime strings back to Date objects
      const parsedAvailability: AvailabilityData = {};
      for (const [date, slots] of Object.entries(data.availability)) {
        parsedAvailability[date] = slots.map((slot) => ({
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

      // Validate address fields for service bookings and in-person consultations
      if (bookingType === "service" || consultationType === "in-person") {
        if (!address || !city || !province || !postalCode) {
          throw new Error("Please provide your complete service address");
        }
      }

      // Find the full datetime for the selected time
      const availableSlots = getAvailableTimeSlotsForDate();
      const selectedSlot = availableSlots.find((slot) => slot.time === selectedTime);

      if (!selectedSlot) {
        throw new Error("Selected time slot is no longer available");
      }

      // For service bookings with estimated hours > 1, book consecutive slots
      let bookingData: {
        service: string | undefined;
        datetime: string;
        name: string;
        email: string;
        phone: string;
        message: string;
        address?: string;
        city?: string;
        province?: string;
        postalCode?: string;
        consultationType?: "in-person" | "video";
        serviceDetails?: string;
        duration?: number;
        bookingType?: string;
        services?: SelectedService[];
        estimatedHours?: number;
        consecutiveSlots?: string[];
      } = {
        service: bookingType === "service" ? "Service Booking" : service,
        datetime: selectedSlot.datetime.toISOString(),
        name,
        email,
        phone,
        message,
        bookingType,
      };

      // Add address fields for service bookings or in-person consultations
      if (bookingType === "service" || consultationType === "in-person") {
        bookingData.address = address;
        bookingData.city = city;
        bookingData.province = province;
        bookingData.postalCode = postalCode;
      }

      // Add consultation type for consultation bookings
      if (bookingType === "consultation") {
        bookingData.consultationType = consultationType;
      }

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

      // Store booking data for calendar download
      setBookingData(data.appointment);
      setSubmitSuccess(true);

      // Refresh availability after booking to show updated slots
      await fetchAvailability();

      // Call the callback if provided
      if (onScheduleConsultation) {
        onScheduleConsultation();
      }

      // Don't auto-close - let user download calendar file and close manually
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to book appointment"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[140]">
      <div
        className="absolute inset-0"
        onClick={handleClose}
        aria-label="Close modal"
      />
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              {onBack && !submitSuccess && (
                <Button variant="ghost" size="sm" onClick={onBack}>
                  ← Back
                </Button>
              )}
              <h2 className="text-2xl font-bold">
                {bookingType === "service" ? "Book Your Service" : "Schedule a Consultation"}
              </h2>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Service Summary for all bookings with services */}
          {selectedServices.length > 0 && (
            <div className="mb-4 p-4 bg-nature-50 dark:bg-nature-900/20 border border-nature-200 dark:border-nature-800 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">
                {bookingType === "service" ? "Selected Services" : "Services for Consultation"}
              </h3>
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
              {bookingType === "service" && estimatedHours > 0 && (
                <div className="mt-3 pt-3 border-t border-nature-200 dark:border-nature-700">
                  <p className="font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Estimated Duration: {Math.ceil(estimatedHours)} hour{Math.ceil(estimatedHours) !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    We&apos;ll book {Math.ceil(estimatedHours)} consecutive time slot{Math.ceil(estimatedHours) !== 1 ? 's' : ''} for your service
                  </p>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Only show service selection for consultation bookings without services */}
            {bookingType !== "service" && selectedServices.length === 0 && (
              <div className="space-y-2">
                <Label htmlFor="service">Select Service</Label>
                <Select value={service} onValueChange={setService}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tree Trimming">Tree Trimming</SelectItem>
                    <SelectItem value="Tree Removal/Felling">Tree Removal/Felling</SelectItem>
                    <SelectItem value="Hedge/Shrub Trimming">Hedge/Shrub Trimming</SelectItem>
                    <SelectItem value="Fall Cleanup">Fall Cleanup</SelectItem>
                    <SelectItem value="Gutter Cleaning">Gutter Cleaning</SelectItem>
                    <SelectItem value="Garden Maintenance">Garden Maintenance</SelectItem>
                    <SelectItem value="Landscaping Labour">Landscaping Labour</SelectItem>
                    <SelectItem value="Aeration">Aeration</SelectItem>
                    <SelectItem value="Dethatching">Dethatching</SelectItem>
                    <SelectItem value="Snow Removal" disabled>Snow Removal (Coming Soon)</SelectItem>
                    <SelectItem value="Salting/De-Icing" disabled>Salting/De-Icing (Coming Soon)</SelectItem>
                    <SelectItem value="General Consultation">General Consultation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Consultation Type Selection (only for consultation bookings) */}
            {bookingType === "consultation" && (
              <div className="space-y-2">
                <Label>Consultation Type</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setConsultationType("in-person")}
                    className={`flex items-center justify-center gap-2 p-4 border-2 rounded-lg transition-all ${
                      consultationType === "in-person"
                        ? "border-nature-500 bg-nature-50 dark:bg-nature-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-nature-300"
                    }`}
                  >
                    <MapPin className={`w-5 h-5 ${consultationType === "in-person" ? "text-nature-600" : "text-gray-500"}`} />
                    <div className="text-left">
                      <p className={`font-semibold text-sm ${consultationType === "in-person" ? "text-nature-700 dark:text-nature-400" : ""}`}>
                        In-Person
                      </p>
                      <p className="text-xs text-muted-foreground">Visit your location</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConsultationType("video")}
                    className={`flex items-center justify-center gap-2 p-4 border-2 rounded-lg transition-all ${
                      consultationType === "video"
                        ? "border-nature-500 bg-nature-50 dark:bg-nature-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-nature-300"
                    }`}
                  >
                    <Video className={`w-5 h-5 ${consultationType === "video" ? "text-nature-600" : "text-gray-500"}`} />
                    <div className="text-left">
                      <p className={`font-semibold text-sm ${consultationType === "video" ? "text-nature-700 dark:text-nature-400" : ""}`}>
                        Video Call
                      </p>
                      <p className="text-xs text-muted-foreground">Online consultation</p>
                    </div>
                  </button>
                </div>
                {consultationType === "video" && (
                  <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm">
                    <Video className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-blue-800 dark:text-blue-200">
                      We&apos;ll send you a video call link after booking. Make sure you have a mobile device or computer with camera ready.
                    </p>
                  </div>
                )}
              </div>
            )}
            {/* Success Message */}
            {submitSuccess && bookingData && (
              <div className="space-y-4 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                  <CalendarDays className="w-6 h-6 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-lg">Appointment Booked Successfully!</p>
                    <p className="text-sm opacity-90 mt-1">
                      Confirmation email sent to {bookingData.email}
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-green-200 dark:border-green-700 space-y-3">
                  <Button
                    onClick={() => {
                      const params = new URLSearchParams({
                        service: bookingData.service,
                        datetime: bookingData.datetime,
                        duration: bookingData.duration.toString(),
                        name: bookingData.name,
                        email: bookingData.email,
                      });
                      window.location.href = `/api/calendar/ics?${params.toString()}`;
                    }}
                    variant="outline"
                    className="w-full bg-white dark:bg-gray-800"
                  >
                    <CalendarDays className="w-4 h-4 mr-2" />
                    Add to Calendar
                  </Button>
                  <p className="text-xs text-center text-green-700 dark:text-green-300">
                    Download .ics file for Google Calendar, Outlook, Apple Calendar, etc.
                  </p>
                  <Button
                    onClick={() => {
                      setSubmitSuccess(false);
                      setBookingData(null);
                      setSelectedDate(undefined);
                      setSelectedTime(undefined);
                      setName("");
                      setEmail("");
                      setPhone("");
                      setMessage("");
                    }}
                    variant="default"
                    className="w-full bg-nature-500 hover:bg-nature-600 text-white"
                  >
                    Book Another Appointment
                  </Button>
                </div>
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
                  <div className="relative">
                    <Select
                      value={selectedTime}
                      onValueChange={setSelectedTime}
                      disabled={isLoadingAvailability || getAvailableTimeSlotsForDate().length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={
                          isLoadingAvailability
                            ? "Loading times..."
                            : getAvailableTimeSlotsForDate().length === 0
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

                    {/* Loading Indicator Overlay */}
                    {isLoadingAvailability && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-md pointer-events-none">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Loading availability...</span>
                        </div>
                      </div>
                    )}

                    {!isLoadingAvailability && getAvailableTimeSlotsForDate().length === 0 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        No available time slots for this date. Please try another day.
                      </p>
                    )}
                  </div>
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

            {/* Address Fields - Required for service bookings and in-person consultations */}
            {(bookingType === "service" || consultationType === "in-person") && (
              <div className="space-y-4 p-4 border-2 border-nature-200 dark:border-nature-800 rounded-lg bg-nature-50/30 dark:bg-nature-900/10">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-nature-600 dark:text-nature-400" />
                  <h3 className="font-semibold text-nature-900 dark:text-nature-100">
                    {bookingType === "service" ? "Service Address" : "Visit Address"}
                  </h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Main Street"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="Toronto"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="province">Province</Label>
                    <Select value={province} onValueChange={setProvince}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ontario">Ontario</SelectItem>
                        <SelectItem value="Quebec">Quebec</SelectItem>
                        <SelectItem value="British Columbia">British Columbia</SelectItem>
                        <SelectItem value="Alberta">Alberta</SelectItem>
                        <SelectItem value="Manitoba">Manitoba</SelectItem>
                        <SelectItem value="Saskatchewan">Saskatchewan</SelectItem>
                        <SelectItem value="Nova Scotia">Nova Scotia</SelectItem>
                        <SelectItem value="New Brunswick">New Brunswick</SelectItem>
                        <SelectItem value="Prince Edward Island">Prince Edward Island</SelectItem>
                        <SelectItem value="Newfoundland and Labrador">Newfoundland and Labrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    placeholder="M5H 2N2"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value.toUpperCase())}
                    required
                    maxLength={7}
                  />
                </div>
              </div>
            )}

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
              ) : bookingType === "service" ? (
                "Book Service"
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

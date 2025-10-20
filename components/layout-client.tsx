"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { EstimateCalculator } from "@/components/estimate-calculator";
import Scheduler from "@/components/scheduler";
import { subscribeToEvent, EVENTS } from "@/lib/events";

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const [showEstimateCalculator, setShowEstimateCalculator] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [initialService, setInitialService] = useState("");
  const [estimateInitialService, setEstimateInitialService] = useState("");
  const [bookingType, setBookingType] = useState<"service" | "consultation">("consultation");
  const [selectedServices, setSelectedServices] = useState<Array<{
    name: string;
    quantity: number;
    unit: string;
    variant?: string;
    debrisCleanup?: boolean;
  }>>([]);
  const [estimatedHours, setEstimatedHours] = useState<number>(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleOpenEstimate = (e: CustomEvent) => {
      setEstimateInitialService(e.detail?.service || "");
      setShowEstimateCalculator(true);
    };
    const handleOpenScheduler = (e: CustomEvent) => {
      setInitialService(e.detail?.service || "");
      setShowScheduler(true);
    };

    const unsubscribeEstimate = subscribeToEvent(
      EVENTS.OPEN_ESTIMATE_MODAL,
      handleOpenEstimate,
    );
    const unsubscribeScheduler = subscribeToEvent(
      EVENTS.OPEN_SCHEDULER_MODAL,
      handleOpenScheduler,
    );

    return () => {
      unsubscribeEstimate();
      unsubscribeScheduler();
    };
  }, []);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        {pathname !== "/maintenance" && <MainNav />}
        {children}
        {pathname !== "/maintenance" && <Footer />}
      </div>

      {showEstimateCalculator && (
        <EstimateCalculator
          onClose={() => {
            setShowEstimateCalculator(false);
            setEstimateInitialService("");
          }}
          onBookService={(services, hours) => {
            setShowEstimateCalculator(false);
            setEstimateInitialService("");
            setSelectedServices(services);
            setEstimatedHours(hours);
            setBookingType("service");
            setShowScheduler(true);
          }}
          onScheduleConsultation={() => {
            setShowEstimateCalculator(false);
            setEstimateInitialService("");
            setSelectedServices([]);
            setEstimatedHours(0);
            setBookingType("consultation");
            setShowScheduler(true);
          }}
          initialService={estimateInitialService}
        />
      )}

      {showScheduler && (
        <Scheduler
          onClose={() => setShowScheduler(false)}
          initialService={initialService}
          bookingType={bookingType}
          selectedServices={selectedServices}
          estimatedHours={estimatedHours}
        />
      )}
    </>
  );
}

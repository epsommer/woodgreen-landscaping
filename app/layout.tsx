"use client";

import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/providers";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { useState, useEffect } from "react";
import { EstimateCalculator } from "@/components/estimate-calculator";
import Scheduler from "@/components/scheduler";
import { subscribeToEvent, EVENTS } from "@/lib/events";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showEstimateCalculator, setShowEstimateCalculator] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [initialService, setInitialService] = useState("");

  useEffect(() => {
    const handleOpenEstimate = () => setShowEstimateCalculator(true);
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://use.typekit.net" />
        <link rel="icon" href="/favicon.ico" />
        <title>Woodgreen Landscaping</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          src="https://use.typekit.net/zdt4eix.js"
          strategy="beforeInteractive"
        />
        <Script
          id="typekit-load"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `try{Typekit.load({async:false});}catch(e){}`,
          }}
        />
        <Providers>
          <div className="flex flex-col min-h-screen">
            <MainNav />
            {children}
            <Footer />
          </div>

          {showEstimateCalculator && (
            <EstimateCalculator
              onClose={() => setShowEstimateCalculator(false)}
              onScheduleConsultation={() => {
                setShowEstimateCalculator(false);
                setShowScheduler(true);
              }}
            />
          )}

          {showScheduler && (
            <Scheduler
              onClose={() => setShowScheduler(false)}
              initialService={initialService}
            />
          )}
        </Providers>
      </body>
    </html>
  );
}

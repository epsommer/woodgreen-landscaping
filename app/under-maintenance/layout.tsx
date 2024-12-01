// app/under-maintenance/layout.tsx
"use client";

import { ThemeProvider } from "next-themes";
import localFont from "next/font/local";
import "../globals.css";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function UnderMaintenanceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/zdt4eix.css" />
        <link rel="icon" href="/favicon.ico" />
        <title>Under Maintenance - Woodgreen Landscaping</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Remove navigation and footer; only display centered maintenance content */}
            <main className="flex-grow flex items-center justify-center px-4">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/providers";
import { headers } from "next/headers";
import { MainNav } from "@/components/main-nav";
import {
  isInMaintenanceMode,
  shouldShowMaintenanceForHeaders,
} from "@/lib/maintenance";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();

  // Use centralized maintenance detection - this guarantees consistency
  const isMaintenanceActive =
    isInMaintenanceMode() || shouldShowMaintenanceForHeaders(headersList);

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
          {isMaintenanceActive ? (
            children
          ) : (
            <div className="flex flex-col min-h-screen">
              <MainNav />
              {children}
            </div>
          )}
        </Providers>
      </body>
    </html>
  );
}
